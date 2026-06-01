import { SelectableValue } from '@grafana/data';
import {
  DurationUnit,
  OperationKind,
  QueryBuilderOperation,
  SignalType,
} from '../../../../../types/types';

let counter = 0;
const nextId = () => `op-${Date.now()}-${counter++}`;

const TRACES_KIND_OPTIONS: Array<SelectableValue<OperationKind>> = [
  { label: 'Count', value: 'count', description: 'count()' },
  { label: 'Percentile', value: 'percentile' },
];

const GAUGE_KIND_OPTIONS: Array<SelectableValue<OperationKind>> = [
  { label: 'Avg', value: 'avg', description: 'avg(Value)' },
  { label: 'Min', value: 'min', description: 'min(Value)' },
  { label: 'Max', value: 'max', description: 'max(Value)' },
  { label: 'Last', value: 'last', description: 'argMax(Value, TimeUnix)' },
  { label: 'Count', value: 'count', description: 'count() — data points in bucket' },
];

const SUM_KIND_OPTIONS: Array<SelectableValue<OperationKind>> = [
  { label: 'Rate', value: 'rate', description: '$rate — per-second' },
  { label: 'Increase', value: 'increase', description: '$increase — bucket delta (positive)' },
  { label: 'Sum', value: 'sum', description: 'sum(Value)' },
  { label: 'Min', value: 'min', description: 'min(Value)' },
  { label: 'Max', value: 'max', description: 'max(Value)' },
  { label: 'Avg', value: 'avg', description: 'avg(Value)' },
  { label: 'Last', value: 'last', description: 'argMax(Value, TimeUnix)' },
];

export const kindOptionsForSignal = (
  signal: SignalType,
  metricKind?: 'gauge' | 'sum'
): Array<SelectableValue<OperationKind>> => {
  if (signal === SignalType.Metrics) {
    return metricKind === 'sum' ? SUM_KIND_OPTIONS : GAUGE_KIND_OPTIONS;
  }
  return TRACES_KIND_OPTIONS;
};

export const defaultKindForSignal = (
  signal: SignalType,
  metricKind?: 'gauge' | 'sum'
): OperationKind => {
  if (signal === SignalType.Metrics) {
    return metricKind === 'sum' ? 'rate' : 'avg';
  }
  return 'count';
};

export const UNIT_OPTIONS: Array<SelectableValue<DurationUnit>> = [
  { label: 'ns', value: 'ns' },
  { label: 'µs', value: 'us' },
  { label: 'ms', value: 'ms' },
  { label: 's', value: 's' },
];

export const PERCENTILE_PRESETS: Array<SelectableValue<number>> = [
  { label: 'p50', value: 50 },
  { label: 'p75', value: 75 },
  { label: 'p90', value: 90 },
  { label: 'p95', value: 95 },
  { label: 'p99', value: 99 },
  { label: 'p99.9', value: 99.9 },
];

export const kindNeedsColumn = (kind: OperationKind): boolean =>
  kind === 'min' ||
  kind === 'max' ||
  kind === 'avg' ||
  kind === 'sum' ||
  kind === 'last' ||
  kind === 'percentile';

export const kindNeedsUnit = (kind: OperationKind, column?: string): boolean =>
  kindNeedsColumn(kind) && column === 'Duration';

export const columnsForSignal = (signal: SignalType): string[] => {
  if (signal === SignalType.Traces) {
    return ['Duration'];
  }
  if (signal === SignalType.Metrics) {
    return ['Value'];
  }
  return [];
};

export const newOperation = (
  signal: SignalType,
  metricKind?: 'gauge' | 'sum'
): QueryBuilderOperation => {
  const column = columnsForSignal(signal)[0];
  const kind = defaultKindForSignal(signal, metricKind);
  return {
    id: nextId(),
    kind,
    column: kindNeedsColumn(kind) || kind === 'rate' || kind === 'increase' ? column : undefined,
    unit: column === 'Duration' ? 'ns' : undefined,
  };
};

export const updateOperation = (
  ops: QueryBuilderOperation[],
  id: string,
  patch: Partial<QueryBuilderOperation>
): QueryBuilderOperation[] => ops.map((o) => (o.id === id ? { ...o, ...patch } : o));

export const removeOperation = (
  ops: QueryBuilderOperation[],
  id: string
): QueryBuilderOperation[] => ops.filter((o) => o.id !== id);

export const appendOperation = (
  ops: QueryBuilderOperation[],
  signal: SignalType,
  metricKind?: 'gauge' | 'sum'
): QueryBuilderOperation[] => [...ops, newOperation(signal, metricKind)];

export const KIND_OPTIONS = TRACES_KIND_OPTIONS;
