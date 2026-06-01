import { FilterScope, QueryBuilderSettings, SignalType } from '../../../../types/types';
import { effectiveEnvironments } from './presets';

const quote = (v: string) => `'${v.replace(/'/g, "''")}'`;
const inList = (vals: string[]) => vals.map(quote).join(', ');

const METRIC_TABLES = (s: QueryBuilderSettings) => [
  s.metricsSumTable,
  s.metricsGaugeTable,
  s.metricsSummaryTable,
  s.metricsHistogramTable,
];

const timeColForSignal = (signal: SignalType): 'Timestamp' | 'TimestampTime' | 'TimeUnix' => {
  if (signal === SignalType.Logs) {
    return 'TimestampTime';
  }
  if (signal === SignalType.Metrics) {
    return 'TimeUnix';
  }
  return 'Timestamp';
};

const tablesForSignal = (signal: SignalType, s: QueryBuilderSettings): string[] => {
  switch (signal) {
    case SignalType.Logs:
      return [s.logsTable];
    case SignalType.Traces:
      return [s.tracesTable];
    case SignalType.Metrics:
      return METRIC_TABLES(s);
  }
};

const unionSelect = (
  tables: string[],
  database: string,
  selectExpr: string,
  timeCol: string,
  lookback: string,
  extraWhere: string
): string => {
  const whereExtra = extraWhere ? ` AND ${extraWhere}` : '';
  return tables
    .map(
      (t) => `SELECT ${selectExpr} FROM ${database}.${t} WHERE ${timeCol} > now() - INTERVAL ${lookback}${whereExtra}`
    )
    .join('\nUNION ALL\n');
};

export type DiscoveryDeps = {
  signalType: SignalType;
  database: string;
  settings: QueryBuilderSettings;
  lookback: string;
};

export const buildServiceNameQuery = (deps: DiscoveryDeps): string => {
  const { signalType, database, settings, lookback } = deps;
  const tables = tablesForSignal(signalType, settings);
  const timeCol = timeColForSignal(signalType);
  const limit = settings.autocompleteLimit;
  if (tables.length === 1) {
    return `SELECT DISTINCT ServiceName FROM ${database}.${tables[0]} WHERE ${timeCol} > now() - INTERVAL ${lookback} ORDER BY ServiceName ASC LIMIT ${limit}`;
  }
  const inner = unionSelect(tables, database, 'DISTINCT ServiceName AS ServiceName', timeCol, lookback, '');
  return `SELECT DISTINCT ServiceName FROM (\n${inner}\n) ORDER BY ServiceName ASC LIMIT ${limit}`;
};

export const buildEnvironmentQuery = (deps: DiscoveryDeps & { serviceNames: string[] }): string => {
  const { signalType, database, settings, lookback, serviceNames } = deps;
  const envKey = settings.environmentKey;
  const tables = tablesForSignal(signalType, settings);
  const timeCol = timeColForSignal(signalType);
  const limit = settings.autocompleteLimit;
  const where = serviceNames.length ? `ServiceName IN (${inList(serviceNames)})` : '';
  const selectExpr = `DISTINCT ResourceAttributes[${quote(envKey)}] AS environment`;
  if (tables.length === 1) {
    const whereExtra = where ? ` AND ${where}` : '';
    return `SELECT ${selectExpr} FROM ${database}.${tables[0]} WHERE ${timeCol} > now() - INTERVAL ${lookback}${whereExtra} ORDER BY environment ASC LIMIT ${limit}`;
  }
  const inner = unionSelect(tables, database, selectExpr, timeCol, lookback, where);
  return `SELECT DISTINCT environment FROM (\n${inner}\n) ORDER BY environment ASC LIMIT ${limit}`;
};

export const buildSignalNameQuery = (
  deps: DiscoveryDeps & { serviceNames: string[]; environments: string[] }
): string | null => {
  const { signalType, database, settings, lookback, serviceNames, environments } = deps;
  const envKey = settings.environmentKey;
  const timeCol = timeColForSignal(signalType);
  const limit = settings.autocompleteLimit;

  const wheres: string[] = [];
  if (serviceNames.length) {
    wheres.push(`ServiceName IN (${inList(serviceNames)})`);
  }
  const effEnvs = effectiveEnvironments(environments);
  if (effEnvs.length) {
    wheres.push(`ResourceAttributes[${quote(envKey)}] IN (${inList(effEnvs)})`);
  }
  const extraWhere = wheres.join(' AND ');

  if (signalType === SignalType.Logs) {
    return null;
  }

  if (signalType === SignalType.Traces) {
    const tail = extraWhere ? ` AND ${extraWhere}` : '';
    return `SELECT DISTINCT SpanName FROM ${database}.${settings.tracesTable} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail} ORDER BY SpanName ASC LIMIT ${limit}`;
  }

  const tail = extraWhere ? ` AND ${extraWhere}` : '';
  const metricsTable =
    (deps as DiscoveryDeps & { metricKind?: 'gauge' | 'sum' }).metricKind === 'sum'
      ? settings.metricsSumTable
      : settings.metricsGaugeTable;
  return `SELECT DISTINCT MetricName FROM ${database}.${metricsTable} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail} ORDER BY MetricName ASC LIMIT ${limit}`;
};

export const buildSummaryQuantilesQuery = (deps: {
  database: string;
  settings: QueryBuilderSettings;
  lookback: string;
  metricName: string;
}): string => {
  const { database, settings, lookback, metricName } = deps;
  return `SELECT arrayDistinct(arrayFlatten(groupArray(ValueAtQuantiles.Quantile))) AS quantiles FROM ${database}.${settings.metricsSummaryTable} WHERE TimeUnix > now() - INTERVAL ${lookback} AND MetricName = ${quote(metricName)} LIMIT 1`;
};

export const buildMetricNameDiscoveryQuery = (
  deps: DiscoveryDeps & { serviceNames: string[]; environments: string[] }
): string => {
  const { database, settings, lookback, serviceNames, environments } = deps;
  const limit = settings.autocompleteLimit;
  const envKey = settings.environmentKey;
  const tables = [
    settings.metricsSumTable,
    settings.metricsGaugeTable,
    settings.metricsHistogramTable,
    settings.metricsSummaryTable,
  ];

  const wheres: string[] = [`TimeUnix > now() - INTERVAL ${lookback}`];
  if (serviceNames.length > 0) {
    wheres.push(`ServiceName IN (${inList(serviceNames)})`);
  }
  const effEnvs = effectiveEnvironments(environments);
  if (effEnvs.length > 0) {
    wheres.push(`ResourceAttributes[${quote(envKey)}] IN (${inList(effEnvs)})`);
  }
  const whereSql = wheres.join(' AND ');

  const branches = tables.map(
    (t) => `SELECT DISTINCT MetricName, ${quote(t)} AS TableName FROM ${database}.${t} WHERE ${whereSql}`
  );

  return [
    'SELECT MetricName, groupArray(TableName) AS Tables FROM (',
    branches.join('\nUNION ALL\n'),
    ') AS all_metrics',
    'GROUP BY MetricName',
    `ORDER BY MetricName ASC LIMIT ${limit}`,
  ].join('\n');
};

export const signalNameColumn = (signal: SignalType): 'MetricName' | 'SpanName' | null => {
  if (signal === SignalType.Metrics) {
    return 'MetricName';
  }
  if (signal === SignalType.Traces) {
    return 'SpanName';
  }
  return null;
};

const mapColumnsForSignal = (signal: SignalType): Array<{ col: string; scope: FilterScope }> => {
  if (signal === SignalType.Logs) {
    return [
      { col: 'ResourceAttributes', scope: 'resource' },
      { col: 'ScopeAttributes', scope: 'scope' },
      { col: 'LogAttributes', scope: 'log' },
    ];
  }
  if (signal === SignalType.Traces) {
    return [
      { col: 'ResourceAttributes', scope: 'resource' },
      { col: 'SpanAttributes', scope: 'span' },
    ];
  }
  return [
    { col: 'ResourceAttributes', scope: 'resource' },
    { col: 'ScopeAttributes', scope: 'scope' },
    { col: 'Attributes', scope: 'attribute' },
  ];
};

export type FilterDiscoveryDeps = DiscoveryDeps & {
  serviceNames: string[];
  environments: string[];
};

const filterScopeWhere = (deps: FilterDiscoveryDeps): string => {
  const envKey = deps.settings.environmentKey;
  const wheres: string[] = [];
  if (deps.serviceNames.length) {
    wheres.push(`ServiceName IN (${inList(deps.serviceNames)})`);
  }
  const effEnvs = effectiveEnvironments(deps.environments);
  if (effEnvs.length) {
    wheres.push(`ResourceAttributes[${quote(envKey)}] IN (${inList(effEnvs)})`);
  }
  return wheres.join(' AND ');
};

export type KeyDiscoveryResult = {
  query: string;
  scopes: FilterScope[];
};

export const buildKeyDiscoveryQuery = (deps: FilterDiscoveryDeps): KeyDiscoveryResult => {
  const { signalType, database, settings, lookback } = deps;
  const tables = tablesForSignal(signalType, settings);
  const timeCol = timeColForSignal(signalType);
  const limit = settings.autocompleteLimit;
  const maps = mapColumnsForSignal(signalType);
  const scopeWhere = filterScopeWhere(deps);

  const selects: string[] = [];
  for (const { col, scope } of maps) {
    const selectExpr = `arrayJoin(mapKeys(${col})) AS k, ${quote(scope)} AS s`;
    selects.push(
      ...tables.map((t) => {
        const tail = scopeWhere ? ` AND ${scopeWhere}` : '';
        return `SELECT DISTINCT ${selectExpr} FROM ${database}.${t} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail}`;
      })
    );
  }

  const inner = selects.join('\nUNION ALL\n');
  const query = `SELECT k, s FROM (\n${inner}\n) GROUP BY k, s ORDER BY k ASC LIMIT ${limit}`;
  return { query, scopes: maps.map((m) => m.scope) };
};

export type ValueDiscoveryArgs = FilterDiscoveryDeps & {
  scope: FilterScope;
  key: string;
};

export const buildValueDiscoveryQuery = (args: ValueDiscoveryArgs): string | null => {
  const { signalType, database, settings, lookback, scope, key } = args;
  const tables = tablesForSignal(signalType, settings);
  const timeCol = timeColForSignal(signalType);
  const limit = settings.autocompleteLimit;
  const scopeWhere = filterScopeWhere(args);

  if (scope === 'column') {
    if (key === 'Body') {
      return null;
    }
    if (tables.length === 1) {
      const tail = scopeWhere ? ` AND ${scopeWhere}` : '';
      return `SELECT DISTINCT ${key} FROM ${database}.${tables[0]} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail} ORDER BY ${key} ASC LIMIT ${limit}`;
    }
    const inner = unionSelect(tables, database, `DISTINCT ${key} AS v`, timeCol, lookback, scopeWhere);
    return `SELECT DISTINCT v FROM (\n${inner}\n) ORDER BY v ASC LIMIT ${limit}`;
  }

  const mapCol = mapColumnForScope(signalType, scope);
  if (!mapCol) {
    return null;
  }
  const mapWhere = `mapContains(${mapCol}, ${quote(key)})`;
  const combined = scopeWhere ? `${scopeWhere} AND ${mapWhere}` : mapWhere;
  const selectExpr = `DISTINCT ${mapCol}[${quote(key)}] AS v`;
  if (tables.length === 1) {
    return `SELECT ${selectExpr} FROM ${database}.${tables[0]} WHERE ${timeCol} > now() - INTERVAL ${lookback} AND ${combined} ORDER BY v ASC LIMIT ${limit}`;
  }
  const inner = unionSelect(tables, database, selectExpr, timeCol, lookback, combined);
  return `SELECT DISTINCT v FROM (\n${inner}\n) ORDER BY v ASC LIMIT ${limit}`;
};

export const mapColumnForScope = (signal: SignalType, scope: FilterScope): string | null => {
  if (scope === 'resource') {
    return 'ResourceAttributes';
  }
  if (scope === 'scope') {
    return signal === SignalType.Traces ? null : 'ScopeAttributes';
  }
  if (scope === 'log' && signal === SignalType.Logs) {
    return 'LogAttributes';
  }
  if (scope === 'span' && signal === SignalType.Traces) {
    return 'SpanAttributes';
  }
  if (scope === 'attribute' && signal === SignalType.Metrics) {
    return 'Attributes';
  }
  return null;
};
