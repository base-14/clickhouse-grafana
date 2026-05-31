import { FilterValueType, SignalType } from '../../../../../types/types';

export type ColumnDef = {
  name: string;
  type: FilterValueType;
};

const LOGS_COLUMNS: ColumnDef[] = [
  { name: 'SeverityText', type: 'string' },
  { name: 'SeverityNumber', type: 'number' },
  { name: 'TraceId', type: 'string' },
  { name: 'SpanId', type: 'string' },
  { name: 'Body', type: 'string' },
  { name: 'ScopeName', type: 'string' },
  { name: 'ScopeVersion', type: 'string' },
];

const TRACES_COLUMNS: ColumnDef[] = [
  { name: 'SpanKind', type: 'string' },
  { name: 'StatusCode', type: 'string' },
  { name: 'StatusMessage', type: 'string' },
  { name: 'Duration', type: 'number' },
  { name: 'TraceId', type: 'string' },
  { name: 'SpanId', type: 'string' },
  { name: 'ParentSpanId', type: 'string' },
  { name: 'TraceState', type: 'string' },
  { name: 'ScopeName', type: 'string' },
  { name: 'ScopeVersion', type: 'string' },
];

const METRICS_COLUMNS: ColumnDef[] = [
  { name: 'MetricDescription', type: 'string' },
  { name: 'MetricUnit', type: 'string' },
  { name: 'Flags', type: 'number' },
  { name: 'ScopeName', type: 'string' },
  { name: 'ScopeVersion', type: 'string' },
];

export const columnsForSignal = (signal: SignalType): ColumnDef[] => {
  switch (signal) {
    case SignalType.Logs:
      return LOGS_COLUMNS;
    case SignalType.Traces:
      return TRACES_COLUMNS;
    case SignalType.Metrics:
      return METRICS_COLUMNS;
  }
};

export const findColumn = (signal: SignalType, name: string): ColumnDef | undefined =>
  columnsForSignal(signal).find((c) => c.name === name);
