import { QueryBuilderSettings, SignalType } from '../../../../types/types';

const quote = (v: string) => `'${v.replace(/'/g, "''")}'`;
const inList = (vals: string[]) => vals.map(quote).join(', ');

const METRIC_TABLES = (s: QueryBuilderSettings) => [
  s.metricsSumTable,
  s.metricsGaugeTable,
  s.metricsSummaryTable,
  s.metricsHistogramTable,
];

const timeColForSignal = (signal: SignalType): 'Timestamp' | 'TimeUnix' =>
  signal === SignalType.Metrics ? 'TimeUnix' : 'Timestamp';

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
  if (tables.length === 1) {
    return `SELECT DISTINCT ServiceName FROM ${database}.${tables[0]} WHERE ${timeCol} > now() - INTERVAL ${lookback} ORDER BY ServiceName ASC`;
  }
  const inner = unionSelect(tables, database, 'DISTINCT ServiceName AS ServiceName', timeCol, lookback, '');
  return `SELECT DISTINCT ServiceName FROM (\n${inner}\n) ORDER BY ServiceName ASC`;
};

export const buildEnvironmentQuery = (
  deps: DiscoveryDeps & { serviceNames: string[] }
): string => {
  const { signalType, database, settings, lookback, serviceNames } = deps;
  const envKey = settings.environmentKey;
  const tables = tablesForSignal(signalType, settings);
  const timeCol = timeColForSignal(signalType);
  const where = serviceNames.length ? `ServiceName IN (${inList(serviceNames)})` : '';
  const selectExpr = `DISTINCT ResourceAttributes[${quote(envKey)}] AS environment`;
  if (tables.length === 1) {
    const whereExtra = where ? ` AND ${where}` : '';
    return `SELECT ${selectExpr} FROM ${database}.${tables[0]} WHERE ${timeCol} > now() - INTERVAL ${lookback}${whereExtra} ORDER BY environment ASC`;
  }
  const inner = unionSelect(tables, database, selectExpr, timeCol, lookback, where);
  return `SELECT DISTINCT environment FROM (\n${inner}\n) ORDER BY environment ASC`;
};

export const buildSignalNameQuery = (
  deps: DiscoveryDeps & { serviceNames: string[]; environments: string[] }
): string | null => {
  const { signalType, database, settings, lookback, serviceNames, environments } = deps;
  const envKey = settings.environmentKey;
  const timeCol = timeColForSignal(signalType);

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
    return `SELECT DISTINCT SpanName FROM ${database}.${settings.tracesTable} WHERE ${timeCol} > now() - INTERVAL ${lookback}${tail} ORDER BY SpanName ASC`;
  }

  const tables = METRIC_TABLES(settings);
  const inner = unionSelect(tables, database, 'DISTINCT MetricName AS MetricName', timeCol, lookback, extraWhere);
  return `SELECT DISTINCT MetricName FROM (\n${inner}\n) ORDER BY MetricName ASC`;
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
