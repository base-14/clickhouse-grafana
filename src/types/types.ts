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
  Annotation = 'Annotation'
}

export enum SignalType {
  Logs = 'logs',
  Traces = 'traces',
  Metrics = 'metrics',
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
}

export interface QueryBuilderSettings {
  autocompleteEnabled: boolean;
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
