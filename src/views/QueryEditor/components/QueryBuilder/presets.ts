import { CHQuery, QueryBuilderSettings, SignalType, TimestampFormat } from '../../../../types/types';

type SignalPreset = Partial<Pick<CHQuery, 'table' | 'dateTimeType' | 'dateTimeColDataType' | 'dateColDataType'>>;

export const buildSignalPresets = (settings: QueryBuilderSettings): Record<SignalType, SignalPreset | null> => ({
  [SignalType.Logs]: {
    table: settings.logsTable,
    dateTimeType: TimestampFormat.DateTime,
    dateTimeColDataType: 'TimestampTime',
    dateColDataType: undefined,
  },
  [SignalType.Traces]: {
    table: settings.tracesTable,
    dateTimeType: TimestampFormat.DateTime64,
    dateTimeColDataType: 'Timestamp',
    dateColDataType: undefined,
  },
  [SignalType.Metrics]: {
    table: settings.metricsGaugeTable,
    dateTimeType: TimestampFormat.DateTime64,
    dateTimeColDataType: 'TimeUnix',
    dateColDataType: undefined,
  },
});

export const SIGNAL_OPTIONS = [
  { label: 'Logs', value: SignalType.Logs },
  { label: 'Traces', value: SignalType.Traces },
  { label: 'Metrics', value: SignalType.Metrics },
];

export const SIGNAL_NAME_ALL = '__all__';
export const ENVIRONMENT_ALL = SIGNAL_NAME_ALL;

export const isSignalNameAll = (names: string[] | undefined): boolean => !!names && names.includes(SIGNAL_NAME_ALL);

export const effectiveSignalNames = (names: string[] | undefined): string[] =>
  (names ?? []).filter((n) => n !== SIGNAL_NAME_ALL);

export const effectiveEnvironments = (envs: string[] | undefined): string[] =>
  (envs ?? []).filter((e) => e !== ENVIRONMENT_ALL);
