import {
  CHQuery,
  QueryBuilderGroupBy,
  QueryBuilderOperation,
  QueryBuilderSettings,
  SignalType,
} from '../../../../../types/types';
import { compileFilters } from './compileFilters';
import { compileOperations } from './compileOperations';
import { accessExpr, dimAlias, inList, quote } from './util';
import { effectiveEnvironments, effectiveSignalNames } from '../presets';

type Args = {
  query: CHQuery;
  database: string;
  settings: QueryBuilderSettings;
};

const baseWheres = (
  query: CHQuery,
  settings: QueryBuilderSettings,
  metricColumn: string
): string[] => {
  const wheres: string[] = ['$timeFilter'];
  if ((query.serviceNames ?? []).length > 0) {
    wheres.push(`ServiceName IN (${inList(query.serviceNames!)})`);
  }
  const effEnvs = effectiveEnvironments(query.environments);
  if (effEnvs.length > 0) {
    wheres.push(`ResourceAttributes['${settings.environmentKey}'] IN (${inList(effEnvs)})`);
  }
  const metricNames = effectiveSignalNames(query.signalNames);
  if (metricNames.length > 0) {
    wheres.push(`${metricColumn} IN (${inList(metricNames)})`);
  }
  const filterClause = compileFilters(query.filters, SignalType.Metrics);
  if (filterClause) {
    wheres.push(filterClause);
  }
  return wheres;
};

const dimExpressions = (
  groupBy: QueryBuilderGroupBy[] | undefined
): Array<{ expr: string; alias: string }> => {
  const out: Array<{ expr: string; alias: string }> = [];
  for (const gb of groupBy ?? []) {
    const expr = accessExpr(SignalType.Metrics, gb.scope, gb.key);
    if (!expr) {
      continue;
    }
    out.push({ expr, alias: dimAlias(gb.key) });
  }
  return out;
};

const buildGaugeSql = ({ query, database, settings }: Args): string => {
  const table = settings.metricsGaugeTable;
  const timeCol = 'TimeUnix';
  const selects: string[] = [
    `toUnixTimestamp64Milli(toStartOfInterval(${timeCol}, INTERVAL $__interval_ms MILLISECOND)) AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const d of dimExpressions(query.groupBy)) {
    selects.push(`${d.expr} AS ${d.alias}`);
    groupBy.push(d.alias);
  }

  const opCols = compileOperations(query.operations);
  for (const c of opCols) {
    selects.push(`${c.sql} AS ${c.alias}`);
  }
  if (opCols.length === 0) {
    selects.push('avg(Value) AS avg_Value');
  }

  return [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${database}.${table}`,
    'WHERE',
    '  ' + baseWheres(query, settings, 'MetricName').join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');
};

const isRateOp = (op: QueryBuilderOperation): boolean =>
  op.kind === 'rate' || op.kind === 'increase';

const buildSumKindKey = (dims: Array<{ expr: string; alias: string }>): { key: string; alias: string } | null => {
  if (dims.length === 0) {
    return null;
  }
  if (dims.length === 1) {
    return { key: `${dims[0].expr} AS ${dims[0].alias}`, alias: dims[0].alias };
  }
  const parts = dims.map((d) => `toString(${d.expr})`).join(`, ' / ', `);
  return { key: `concat(${parts}) AS dims`, alias: 'dims' };
};

const buildSumMacroSql = ({
  query,
  database,
  settings,
  rateOps,
}: Args & { rateOps: QueryBuilderOperation[] }): string => {
  const table = settings.metricsSumTable;
  const dims = dimExpressions(query.groupBy);
  const keyPair = buildSumKindKey(dims);

  const op0 = rateOps[0];
  const isIncrease = op0.kind === 'increase';
  const scalarMacro = isIncrease ? '$increase' : '$perSecond';
  const columnsMacro = isIncrease ? '$increaseColumns' : '$perSecondColumns';

  let inner: string;
  if (keyPair) {
    inner = `${columnsMacro}(\n  ${keyPair.key},\n  Value\n)`;
  } else {
    const aggArgs = rateOps.map(() => 'Value').join(',\n  ');
    inner = `${scalarMacro}(\n  ${aggArgs}\n)`;
  }

  const macroWheres = baseWheres(query, settings, 'MetricName').filter((w) => w !== '$timeFilter');

  const parts: string[] = [
    inner,
    `FROM ${database}.${table}`,
  ];
  if (macroWheres.length > 0) {
    parts.push('WHERE ' + macroWheres.join('\n  AND '));
  }
  return parts.join('\n');
};

const buildSumDirectSql = ({ query, database, settings }: Args): string => {
  const table = settings.metricsSumTable;
  const timeCol = 'TimeUnix';
  const selects: string[] = [
    `toUnixTimestamp64Milli(toStartOfInterval(${timeCol}, INTERVAL $__interval_ms MILLISECOND)) AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const d of dimExpressions(query.groupBy)) {
    selects.push(`${d.expr} AS ${d.alias}`);
    groupBy.push(d.alias);
  }

  const opCols = compileOperations((query.operations ?? []).filter((o) => !isRateOp(o)));
  for (const c of opCols) {
    selects.push(`${c.sql} AS ${c.alias}`);
  }
  if (opCols.length === 0) {
    selects.push('sum(Value) AS sum_Value');
  }

  return [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${database}.${table}`,
    'WHERE',
    '  ' + baseWheres(query, settings, 'MetricName').join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');
};

const buildSumSql = (args: Args): string => {
  const ops = args.query.operations ?? [];
  const rateOps = ops.filter(isRateOp);
  if (rateOps.length > 0) {
    return buildSumMacroSql({ ...args, rateOps });
  }
  if (ops.length === 0) {
    const syntheticIncrease: QueryBuilderOperation = {
      id: 'default-increase',
      kind: 'increase',
      column: 'Value',
    };
    return buildSumMacroSql({ ...args, rateOps: [syntheticIncrease] });
  }
  return buildSumDirectSql(args);
};

const HIST_RATE_KINDS = new Set(['rate_count', 'rate_sum', 'increase_count', 'increase_sum']);

const isHistRateOp = (op: QueryBuilderOperation): boolean => HIST_RATE_KINDS.has(op.kind);

const histRateColumn = (kind: string): 'Count' | 'Sum' =>
  kind === 'rate_sum' || kind === 'increase_sum' ? 'Sum' : 'Count';

const histRateIsIncrease = (kind: string): boolean =>
  kind === 'increase_count' || kind === 'increase_sum';

const buildHistMacroSql = (args: Args, op: QueryBuilderOperation, table: string): string => {
  const dims = dimExpressions(args.query.groupBy);
  const keyPair = buildSumKindKey(dims);
  const isIncrease = histRateIsIncrease(op.kind);
  const scalarMacro = isIncrease ? '$increase' : '$perSecond';
  const columnsMacro = isIncrease ? '$increaseColumns' : '$perSecondColumns';
  const col = histRateColumn(op.kind);

  let inner: string;
  if (keyPair) {
    inner = `${columnsMacro}(\n  ${keyPair.key},\n  ${col}\n)`;
  } else {
    inner = `${scalarMacro}(\n  ${col}\n)`;
  }

  const macroWheres = baseWheres(args.query, args.settings, 'MetricName').filter((w) => w !== '$timeFilter');
  const parts: string[] = [inner, `FROM ${args.database}.${table}`];
  if (macroWheres.length > 0) {
    parts.push('WHERE ' + macroWheres.join('\n  AND '));
  }
  return parts.join('\n');
};

const buildHistogramPercentileSql = (args: Args, op: QueryBuilderOperation): string => {
  const table = args.settings.metricsHistogramTable;
  const p = ((op.percentile ?? 99) / 100).toString();
  const wheres = baseWheres(args.query, args.settings, 'MetricName');

  const dims = dimExpressions(args.query.groupBy);
  const seriesPartition = ['ServiceName', 'MetricName', 'Attributes'].concat(
    dims.map((d) => d.alias)
  );
  const innerSeriesDims = dims.map((d) => `${d.expr} AS ${d.alias}`).join(', ');
  const innerSeriesDimList = dims.length > 0 ? `,\n    ${innerSeriesDims}` : '';
  const seriesGroupBy = ['ServiceName', 'MetricName', 'Attributes', 't', 'ExplicitBounds']
    .concat(dims.map((d) => d.alias))
    .join(', ');
  const aggSelectDims = dims.length > 0 ? dims.map((d) => d.alias).join(', ') + ',\n    ' : '';
  const aggGroupBy = ['t', 'ExplicitBounds'].concat(dims.map((d) => d.alias)).join(', ');
  const outerSelectDims = dims.length > 0 ? dims.map((d) => d.alias).join(', ') + ',\n  ' : '';

  return [
    'SELECT',
    `  t,`,
    `  ${outerSelectDims}multiIf(`,
    `    bucket_idx <= 1, toFloat64(ExplicitBounds[1]),`,
    `    bucket_idx > length(ExplicitBounds), toFloat64(ExplicitBounds[length(ExplicitBounds)]),`,
    `    toFloat64(ExplicitBounds[bucket_idx - 1]) + (target_count - cdf[bucket_idx - 1]) / nullIf(cdf[bucket_idx] - cdf[bucket_idx - 1], 0) * (toFloat64(ExplicitBounds[bucket_idx]) - toFloat64(ExplicitBounds[bucket_idx - 1]))`,
    `  ) AS p${(op.percentile ?? 99).toString().replace('.', '_')}_value`,
    'FROM (',
    '  SELECT',
    `    t,`,
    `    ${aggSelectDims}ExplicitBounds,`,
    `    arrayCumSum(bucket_deltas) AS cdf,`,
    `    arraySum(bucket_deltas) * ${p} AS target_count,`,
    `    arrayFirstIndex(c -> c >= target_count, cdf) AS bucket_idx`,
    '  FROM (',
    '    SELECT',
    `      t,`,
    `      ${aggSelectDims}ExplicitBounds,`,
    `      sumForEach(bucket_delta) AS bucket_deltas`,
    '    FROM (',
    '      SELECT',
    `        toUnixTimestamp64Milli(toStartOfInterval(TimeUnix, INTERVAL $__interval_ms MILLISECOND)) AS t,`,
    `        ExplicitBounds${innerSeriesDimList},`,
    `        arrayMap((c, p) -> if(c >= p, toFloat64(c) - toFloat64(p), toFloat64(c)), argMax(BucketCounts, TimeUnix), lagInFrame(argMax(BucketCounts, TimeUnix), 1, argMax(BucketCounts, TimeUnix)) OVER (PARTITION BY ${seriesPartition.join(', ')} ORDER BY t)) AS bucket_delta`,
    `      FROM ${args.database}.${table}`,
    `      WHERE`,
    '        ' + wheres.join('\n        AND '),
    `      GROUP BY ${seriesGroupBy}`,
    '    )',
    `    GROUP BY ${aggGroupBy}`,
    '  )',
    ')',
    'ORDER BY t',
  ].join('\n');
};

const buildHistogramDirectSql = (args: Args): string => {
  const table = args.settings.metricsHistogramTable;
  const timeCol = 'TimeUnix';
  const ops = args.query.operations ?? [];
  const selects: string[] = [
    `toUnixTimestamp64Milli(toStartOfInterval(${timeCol}, INTERVAL $__interval_ms MILLISECOND)) AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const d of dimExpressions(args.query.groupBy)) {
    selects.push(`${d.expr} AS ${d.alias}`);
    groupBy.push(d.alias);
  }

  for (const op of ops) {
    if (op.kind === 'avg_quotient') {
      selects.push('argMax(Sum, TimeUnix) / nullIf(argMax(Count, TimeUnix), 0) AS avg_value');
    } else if (op.kind === 'min_observed') {
      selects.push('min(Min) AS min_value');
    } else if (op.kind === 'max_observed') {
      selects.push('max(Max) AS max_value');
    }
  }

  if (selects.length === 1 + dimExpressions(args.query.groupBy).length) {
    selects.push('argMax(Sum, TimeUnix) / nullIf(argMax(Count, TimeUnix), 0) AS avg_value');
  }

  return [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${args.database}.${table}`,
    'WHERE',
    '  ' + baseWheres(args.query, args.settings, 'MetricName').join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');
};

const buildHistogramSql = (args: Args): string => {
  const ops = args.query.operations ?? [];
  const percentileOp = ops.find((o) => o.kind === 'percentile');
  const rateOp = ops.find(isHistRateOp);

  if (rateOp) {
    return buildHistMacroSql(args, rateOp, args.settings.metricsHistogramTable);
  }
  if (percentileOp) {
    return buildHistogramPercentileSql(args, percentileOp);
  }
  if (ops.length === 0) {
    const defaultPercentile: QueryBuilderOperation = {
      id: 'default-p99',
      kind: 'percentile',
      percentile: 99,
    };
    return buildHistogramPercentileSql(args, defaultPercentile);
  }
  return buildHistogramDirectSql(args);
};

const buildSummaryPercentileSql = (args: Args, op: QueryBuilderOperation): string => {
  const table = args.settings.metricsSummaryTable;
  const timeCol = 'TimeUnix';
  const p = ((op.percentile ?? 99) / 100).toString();
  const selects: string[] = [
    `toUnixTimestamp64Milli(toStartOfInterval(${timeCol}, INTERVAL $__interval_ms MILLISECOND)) AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const d of dimExpressions(args.query.groupBy)) {
    selects.push(`${d.expr} AS ${d.alias}`);
    groupBy.push(d.alias);
  }

  selects.push(
    `argMax(arrayElement(ValueAtQuantiles.Value, indexOf(ValueAtQuantiles.Quantile, ${p})), TimeUnix) AS p${(op.percentile ?? 99).toString().replace('.', '_')}_value`
  );

  return [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${args.database}.${table}`,
    'WHERE',
    '  ' + baseWheres(args.query, args.settings, 'MetricName').join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');
};

const buildSummaryDirectSql = (args: Args): string => {
  const table = args.settings.metricsSummaryTable;
  const timeCol = 'TimeUnix';
  const ops = args.query.operations ?? [];
  const selects: string[] = [
    `toUnixTimestamp64Milli(toStartOfInterval(${timeCol}, INTERVAL $__interval_ms MILLISECOND)) AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const d of dimExpressions(args.query.groupBy)) {
    selects.push(`${d.expr} AS ${d.alias}`);
    groupBy.push(d.alias);
  }

  for (const op of ops) {
    if (op.kind === 'avg_quotient') {
      selects.push('argMax(Sum, TimeUnix) / nullIf(argMax(Count, TimeUnix), 0) AS avg_value');
    }
  }

  if (selects.length === 1 + dimExpressions(args.query.groupBy).length) {
    selects.push('argMax(Sum, TimeUnix) / nullIf(argMax(Count, TimeUnix), 0) AS avg_value');
  }

  return [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${args.database}.${table}`,
    'WHERE',
    '  ' + baseWheres(args.query, args.settings, 'MetricName').join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');
};

const buildSummarySql = (args: Args): string => {
  const ops = args.query.operations ?? [];
  const percentileOp = ops.find((o) => o.kind === 'percentile');
  const rateOp = ops.find(isHistRateOp);

  if (rateOp) {
    return buildHistMacroSql(args, rateOp, args.settings.metricsSummaryTable);
  }
  if (percentileOp) {
    return buildSummaryPercentileSql(args, percentileOp);
  }
  if (ops.length === 0) {
    const defaultPercentile: QueryBuilderOperation = {
      id: 'default-p99',
      kind: 'percentile',
      percentile: 99,
    };
    return buildSummaryPercentileSql(args, defaultPercentile);
  }
  return buildSummaryDirectSql(args);
};

export const buildMetricsSql = (args: Args): string | null => {
  if (!args.database) {
    return null;
  }
  const kind = args.query.metricKind ?? 'gauge';
  if (kind === 'sum') {
    return buildSumSql(args);
  }
  if (kind === 'histogram') {
    return buildHistogramSql(args);
  }
  if (kind === 'summary') {
    return buildSummarySql(args);
  }
  return buildGaugeSql(args);
};

void quote;
