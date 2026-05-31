import { FilterScope, QueryBuilderSettings, SignalType } from '../../../../types/types';

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
      (t) =>
        `SELECT ${selectExpr} FROM ${database}.${t} WHERE ${timeCol} > now() - INTERVAL ${lookback}${whereExtra}`
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

export const buildEnvironmentQuery = (
  deps: DiscoveryDeps & { serviceNames: string[] }
): string => {
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
  if (environments.length) {
    wheres.push(`ResourceAttributes[${quote(envKey)}] IN (${inList(environments)})`);
  }
  const extraWhere = wheres.join(' AND ');

  if (signalType === SignalType.Logs) {
    return null;
  }

  if (signalType === SignalType.Traces) {
    const tail = extraWhere ? ` AND ${extraWhere}` : '';
    return `SELECT DISTINCT SpanName FROM ${database}.${settings.tracesTable} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail} ORDER BY SpanName ASC LIMIT ${limit}`;
  }

  const tables = METRIC_TABLES(settings);
  const inner = unionSelect(tables, database, 'DISTINCT MetricName AS MetricName', timeCol, lookback, extraWhere);
  return `SELECT DISTINCT MetricName FROM (\n${inner}\n) ORDER BY MetricName ASC LIMIT ${limit}`;
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
  if (deps.environments.length) {
    wheres.push(`ResourceAttributes[${quote(envKey)}] IN (${inList(deps.environments)})`);
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
    selects.push(...tables.map((t) => {
      const tail = scopeWhere ? ` AND ${scopeWhere}` : '';
      return `SELECT DISTINCT ${selectExpr} FROM ${database}.${t} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail}`;
    }));
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
