import { SelectableValue } from '@grafana/data';
import {
  DurationUnit,
  OperationKind,
  QueryBuilderOperation,
  SignalType,
} from '../../../../../types/types';

let counter = 0;
const nextId = () => `op-${Date.now()}-${counter++}`;

export const KIND_OPTIONS: Array<SelectableValue<OperationKind>> = [
  { label: 'Count', value: 'count', description: 'count()' },
  { label: 'Percentile', value: 'percentile' },
];

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
  kind === 'min' || kind === 'max' || kind === 'avg' || kind === 'sum' || kind === 'percentile';

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

export const newOperation = (signal: SignalType): QueryBuilderOperation => {
  const column = columnsForSignal(signal)[0];
  return {
    id: nextId(),
    kind: 'count',
    column,
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
  signal: SignalType
): QueryBuilderOperation[] => [...ops, newOperation(signal)];
