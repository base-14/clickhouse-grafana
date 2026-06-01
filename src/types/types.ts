import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

/*
 * Value that is used in QueryEditor to switch between builder and SQL modes
 */
export enum EditorMode {
  SQL = 'sql',
  Builder = 'builder',
}

export enum DateTimeColumnSelectorType {
  DateTime = 'datetime',
  Date = 'date',
}

export enum TimestampFormat {
  DateTime = 'DATETIME',
  DateTime64 = 'DATETIME64',
  TimeStamp = 'TIMESTAMP',
  TimeStamp64_3 = 'TIMESTAMP64_3',
  TimeStamp64_6 = 'TIMESTAMP64_6',
  TimeStamp64_9 = 'TIMESTAMP64_9',
  Float = 'FLOAT',
}

export enum DatasourceMode {
  Variable = 'Variable',
  Datasource = 'Datasource',
  Annotation = 'Annotation',
}

export enum SignalType {
  Logs = 'logs',
  Traces = 'traces',
  Metrics = 'metrics',
}

export type FilterConnector = 'AND' | 'OR';

export type FilterScope = 'column' | 'resource' | 'scope' | 'log' | 'span' | 'attribute';

export type FilterOp =
  | 'eq'
  | 'neq'
  | 'in'
  | 'nin'
  | 'like'
  | 'nlike'
  | 'regex'
  | 'nregex'
  | 'exists'
  | 'nexists'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';

export type FilterValueType = 'string' | 'number';

export type DurationUnit = 'ns' | 'us' | 'ms' | 's';

export interface FilterCondition {
  kind: 'condition';
  id: string;
  scope: FilterScope;
  key: string;
  type: FilterValueType;
  op: FilterOp;
  values: string[];
  unit?: DurationUnit;
}

export interface FilterGroup {
  kind: 'group';
  id: string;
  connector: FilterConnector;
  children: FilterNode[];
}

export type FilterNode = FilterCondition | FilterGroup;

export type OperationKind =
  | 'count'
  | 'count_distinct'
  | 'min'
  | 'max'
  | 'avg'
  | 'sum'
  | 'last'
  | 'rate'
  | 'increase'
  | 'percentile'
  | 'rate_count'
  | 'rate_sum'
  | 'increase_count'
  | 'increase_sum'
  | 'avg_quotient'
  | 'min_observed'
  | 'max_observed';

export type MetricKind = 'gauge' | 'sum' | 'histogram' | 'summary';

export interface QueryBuilderOperation {
  id: string;
  kind: OperationKind;
  column?: string;
  percentile?: number;
  unit?: DurationUnit;
}

export interface QueryBuilderGroupBy {
  scope: FilterScope;
  key: string;
}

export interface CHQuery extends DataQuery {
  query: string;
  format: string;
  datasourceMode: DatasourceMode;
  extrapolate: boolean;
  rawQuery: string;
  editorMode?: EditorMode;
  database?: string;
  table?: string;
  initialized?: boolean;
  adHocFilters: any[];

  dateTimeType?: string;
  dateColDataType?: string;
  dateTimeColDataType?: string;
  signalType?: SignalType;
  serviceNames?: string[];
  environments?: string[];
  signalNames?: string[];
  filters?: FilterGroup;
  bodySearch?: string;
  bodySearchIsRegex?: boolean;
  operations?: QueryBuilderOperation[];
  groupBy?: QueryBuilderGroupBy[];
  logsMode?: 'raw' | 'timeseries';
  metricKind?: MetricKind;
  advancedOptions?: boolean;
  variableReturn?: { scope: FilterScope; key: string };
  variableTimeMode?: 'fixed' | 'dashboard';
  variableLookback?: string;

  skip_comments?: boolean;
  add_metadata?: boolean;
  nullifySparse?: boolean;

  round?: string;
  intervalFactor?: number;
  interval?: string;
  formattedQuery?: string;
  contextWindowSize?: string;
  adHocValuesQuery?: string;
  useWindowFuncForMacros?: boolean;
  showHelp: boolean;
  showFormattedSQL: boolean;
}

/**
 * These are options configured for each DataSource instance
 */
export interface CHDataSourceOptions extends DataSourceJsonData {
  useYandexCloudAuthorization?: boolean;
  xHeaderUser?: string;
  xClickHouseSSLCertificateAuth?: boolean;
  addCorsHeader?: boolean;
  usePOST?: boolean;
  defaultDatabase?: string;
  useCompression?: boolean;
  compressionType?: string;
  // @todo remove workaround after merge https://github.com/grafana/grafana/pull/80858, also remove from src/plugin.json
  dataSourceUrl?: string;
  useDefaultConfiguration?: boolean;
  defaultDateTime64?: string;
  defaultDateTime?: string;
  defaultUint32?: string;
  defaultDateDate32?: string;
  defaultDateTimeType?: string;
  defaultFloat?: string;
  defaultTimeStamp64_3?: string;
  defaultTimeStamp64_6?: string;
  defaultTimeStamp64_9?: string;
  adHocValuesQuery?: string;
  adHocHideTableNames?: boolean;
  contextWindowSize?: string;
  useWindowFuncForMacros?: boolean;
  nullifySparse?: boolean;
  queryBuilderAutocompleteEnabled?: boolean;
  queryBuilderMaxTimerange?: string;
  queryBuilderEnvironmentKey?: string;
  queryBuilderDefaultLogsTable?: string;
  queryBuilderDefaultTracesTable?: string;
  queryBuilderDefaultMetricsGaugeTable?: string;
  queryBuilderDefaultMetricsSumTable?: string;
  queryBuilderDefaultMetricsHistogramTable?: string;
  queryBuilderDefaultMetricsSummaryTable?: string;
  queryBuilderAutocompleteLimit?: number;
  queryBuilderRawLogsLimit?: number;
  queryBuilderVariableMaxLookback?: string;
  queryBuilderVariableLimit?: number;
}

export interface QueryBuilderSettings {
  autocompleteEnabled: boolean;
  autocompleteLimit: number;
  rawLogsLimit: number;
  variableMaxLookback: string;
  variableLimit: number;
  maxTimerange: string;
  environmentKey: string;
  logsTable: string;
  tracesTable: string;
  metricsGaugeTable: string;
  metricsSumTable: string;
  metricsHistogramTable: string;
  metricsSummaryTable: string;
}

export const QUERY_BUILDER_DEFAULTS: QueryBuilderSettings = {
  autocompleteEnabled: true,
  autocompleteLimit: 100,
  rawLogsLimit: 200,
  variableMaxLookback: '15m',
  variableLimit: 1000,
  maxTimerange: '5m',
  environmentKey: 'environment',
  logsTable: 'otel_logs',
  tracesTable: 'otel_traces',
  metricsGaugeTable: 'otel_metrics_gauge',
  metricsSumTable: 'otel_metrics_sum',
  metricsHistogramTable: 'otel_metrics_histogram',
  metricsSummaryTable: 'otel_metrics_summary',
};

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */

export const DEFAULT_QUERY: CHQuery = {
  refId: '',
  query: 'SELECT 1',
  format: 'time_series',
  extrapolate: false,
  rawQuery: '',
  editorMode: EditorMode.SQL,
  adHocFilters: [],
  showHelp: false,
  showFormattedSQL: false,
  datasourceMode: DatasourceMode.Datasource,
  nullifySparse: false,
};
