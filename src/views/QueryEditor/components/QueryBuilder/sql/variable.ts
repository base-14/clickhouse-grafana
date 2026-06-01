import { CHQuery, FilterScope, QueryBuilderSettings, SignalType } from '../../../../../types/types';
import { compileFilters } from './compileFilters';
import { accessExpr, inList } from './util';
import { effectiveEnvironments, effectiveSignalNames } from '../presets';
import { rangeUtil } from '@grafana/data';

type Args = {
  query: CHQuery;
  database: string;
  settings: QueryBuilderSettings;
};

const timeColForSignal = (signal: SignalType): 'Timestamp' | 'TimestampTime' | 'TimeUnix' => {
  if (signal === SignalType.Logs) {
    return 'TimestampTime';
  }
  if (signal === SignalType.Metrics) {
    return 'TimeUnix';
  }
  return 'Timestamp';
};

const tableForSignal = (signal: SignalType, settings: QueryBuilderSettings, metricKind?: string): string => {
  if (signal === SignalType.Logs) {
    return settings.logsTable;
  }
  if (signal === SignalType.Traces) {
    return settings.tracesTable;
  }
  if (metricKind === 'sum') {
    return settings.metricsSumTable;
  }
  if (metricKind === 'histogram') {
    return settings.metricsHistogramTable;
  }
  if (metricKind === 'summary') {
    return settings.metricsSummaryTable;
  }
  return settings.metricsGaugeTable;
};

const metricTables = (settings: QueryBuilderSettings): string[] => [
  settings.metricsSumTable,
  settings.metricsGaugeTable,
  settings.metricsHistogramTable,
  settings.metricsSummaryTable,
];

const parseDurationToSeconds = (raw: string | undefined, fallbackSec: number): number => {
  if (!raw) {
    return fallbackSec;
  }
  try {
    return Math.max(1, Math.floor(rangeUtil.intervalToMs(raw) / 1000));
  } catch {
    return fallbackSec;
  }
};

const buildWhereClauses = (
  query: CHQuery,
  settings: QueryBuilderSettings,
  signal: SignalType,
  signalNameColumn: string | null,
  useTimeMacro: boolean,
  lookbackSeconds: number,
  timeCol: string
): string[] => {
  const wheres: string[] = [];

  if (useTimeMacro) {
    wheres.push('$timeFilter');
  } else {
    wheres.push(`${timeCol} > now() - INTERVAL ${lookbackSeconds} SECOND`);
  }

  const services = query.serviceNames ?? [];
  if (services.length > 0) {
    wheres.push(`ServiceName IN (${inList(services)})`);
  }

  const envs = effectiveEnvironments(query.environments);
  if (envs.length > 0) {
    wheres.push(`ResourceAttributes['${settings.environmentKey}'] IN (${inList(envs)})`);
  }

  const sigs = effectiveSignalNames(query.signalNames);
  if (sigs.length > 0 && signalNameColumn) {
    wheres.push(`${signalNameColumn} IN (${inList(sigs)})`);
  }

  const filterClause = compileFilters(query.filters, signal);
  if (filterClause) {
    wheres.push(filterClause);
  }

  return wheres;
};

export const buildVariableSql = ({ query, database, settings }: Args): string | null => {
  if (!database || !query.signalType || !query.variableReturn) {
    return null;
  }

  const signal = query.signalType;
  const ret = query.variableReturn;
  const timeMode = query.variableTimeMode ?? 'fixed';
  const useTimeMacro = timeMode === 'dashboard';

  const maxSeconds = parseDurationToSeconds(settings.variableMaxLookback, 900);
  const requestedSeconds = parseDurationToSeconds(query.variableLookback, maxSeconds);
  const lookbackSeconds = Math.min(requestedSeconds, maxSeconds);

  const signalNameColumn =
    signal === SignalType.Traces ? 'SpanName' : signal === SignalType.Metrics ? 'MetricName' : null;
  const timeCol = timeColForSignal(signal);
  const limit = settings.variableLimit;

  const access = accessExpr(signal, ret.scope, ret.key);
  if (!access) {
    return null;
  }

  if (signal === SignalType.Metrics && ret.scope !== 'attribute') {
    const wheres = buildWhereClauses(query, settings, signal, signalNameColumn, useTimeMacro, lookbackSeconds, timeCol);
    const tables = metricTables(settings);
    const branches = tables
      .map((t) => `SELECT DISTINCT ${access} AS value FROM ${database}.${t} WHERE\n  ${wheres.join('\n  AND ')}`)
      .join('\nUNION ALL\n');
    return ['SELECT DISTINCT value FROM (', branches, ')', 'ORDER BY value ASC', `LIMIT ${limit}`].join('\n');
  }

  const table = tableForSignal(signal, settings, query.metricKind);
  const wheres = buildWhereClauses(query, settings, signal, signalNameColumn, useTimeMacro, lookbackSeconds, timeCol);

  return [
    `SELECT DISTINCT ${access} AS value`,
    `FROM ${database}.${table}`,
    'WHERE',
    '  ' + wheres.join('\n  AND '),
    'ORDER BY value ASC',
    `LIMIT ${limit}`,
  ].join('\n');
};

export const _unused: FilterScope = 'column';
