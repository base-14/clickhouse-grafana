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
  { label: 'Rate', value: 'rate', description: '$perSecond — per-second delta' },
  { label: 'Increase', value: 'increase', description: '$increase — bucket delta (positive)' },
  { label: 'Sum', value: 'sum', description: 'sum(Value)' },
  { label: 'Min', value: 'min', description: 'min(Value)' },
  { label: 'Max', value: 'max', description: 'max(Value)' },
  { label: 'Avg', value: 'avg', description: 'avg(Value)' },
  { label: 'Last', value: 'last', description: 'argMax(Value, TimeUnix)' },
];

const HISTOGRAM_KIND_OPTIONS: Array<SelectableValue<OperationKind>> = [
  { label: 'Percentile', value: 'percentile', description: 'bucket interpolation' },
  { label: 'Rate (Count)', value: 'rate_count', description: '$perSecond(Count)' },
  { label: 'Rate (Sum)', value: 'rate_sum', description: '$perSecond(Sum)' },
  { label: 'Increase (Count)', value: 'increase_count', description: '$increase(Count)' },
  { label: 'Increase (Sum)', value: 'increase_sum', description: '$increase(Sum)' },
  { label: 'Avg', value: 'avg_quotient', description: '$increase(Sum) / $increase(Count)' },
  { label: 'Min', value: 'min_observed', description: 'min(Min)' },
  { label: 'Max', value: 'max_observed', description: 'max(Max)' },
];

const SUMMARY_KIND_OPTIONS: Array<SelectableValue<OperationKind>> = [
  { label: 'Quantile', value: 'percentile', description: 'pre-computed in ValueAtQuantiles' },
  { label: 'Rate (Count)', value: 'rate_count', description: '$perSecond(Count)' },
  { label: 'Rate (Sum)', value: 'rate_sum', description: '$perSecond(Sum)' },
  { label: 'Avg', value: 'avg_quotient', description: '$increase(Sum) / $increase(Count)' },
];

export type MetricKindArg = 'gauge' | 'sum' | 'histogram' | 'summary';

export const kindOptionsForSignal = (
  signal: SignalType,
  metricKind?: MetricKindArg
): Array<SelectableValue<OperationKind>> => {
  if (signal === SignalType.Metrics) {
    if (metricKind === 'sum') {
      return SUM_KIND_OPTIONS;
    }
    if (metricKind === 'histogram') {
      return HISTOGRAM_KIND_OPTIONS;
    }
    if (metricKind === 'summary') {
      return SUMMARY_KIND_OPTIONS;
    }
    return GAUGE_KIND_OPTIONS;
  }
  return TRACES_KIND_OPTIONS;
};

export const defaultKindForSignal = (
  signal: SignalType,
  metricKind?: MetricKindArg
): OperationKind => {
  if (signal === SignalType.Metrics) {
    if (metricKind === 'sum') {
      return 'rate';
    }
    if (metricKind === 'histogram' || metricKind === 'summary') {
      return 'percentile';
    }
    return 'avg';
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
  kind === 'percentile' ||
  kind === 'rate_count' ||
  kind === 'rate_sum' ||
  kind === 'increase_count' ||
  kind === 'increase_sum' ||
  kind === 'min_observed' ||
  kind === 'max_observed';

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
  metricKind?: MetricKindArg
): QueryBuilderOperation => {
  const column = columnsForSignal(signal)[0];
  const kind = defaultKindForSignal(signal, metricKind);
  return {
    id: nextId(),
    kind,
    column: kindNeedsColumn(kind) || kind === 'rate' || kind === 'increase' ? column : undefined,
    percentile: kind === 'percentile' ? 99 : undefined,
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
  metricKind?: MetricKindArg
): QueryBuilderOperation[] => [...ops, newOperation(signal, metricKind)];

export const KIND_OPTIONS = TRACES_KIND_OPTIONS;
