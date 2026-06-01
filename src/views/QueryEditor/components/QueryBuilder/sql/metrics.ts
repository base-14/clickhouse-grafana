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
import { effectiveSignalNames } from '../presets';

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
  if ((query.environments ?? []).length > 0) {
    wheres.push(
      `ResourceAttributes['${settings.environmentKey}'] IN (${inList(query.environments!)})`
    );
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

export const buildMetricsSql = (args: Args): string | null => {
  if (!args.database) {
    return null;
  }
  const kind = args.query.metricKind ?? 'gauge';
  if (kind === 'sum') {
    return buildSumSql(args);
  }
  return buildGaugeSql(args);
};

void quote;
