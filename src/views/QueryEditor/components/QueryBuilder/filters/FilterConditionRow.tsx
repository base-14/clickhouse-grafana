import React, { useMemo } from 'react';
import { IconButton, Input, MultiSelect, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import {
  DurationUnit,
  FilterCondition,
  FilterOp,
  FilterValueType,
  SignalType,
} from '../../../../../types/types';
import { DiscoveredKey, resolveScopeForKey } from './resolveScope';
import { opIsMulti, opOptions, opTakesValues } from './tree';

const UNIT_OPTIONS: Array<SelectableValue<DurationUnit>> = [
  { label: 'ns', value: 'ns' },
  { label: 'µs', value: 'us' },
  { label: 'ms', value: 'ms' },
  { label: 's', value: 's' },
];

type Props = {
  condition: FilterCondition;
  signal: SignalType;
  discoveredKeys: DiscoveredKey[];
  loadingKeys: boolean;
  fetchValues: (scope: FilterCondition['scope'], key: string) => void;
  values: Array<SelectableValue<string>>;
  loadingValues: boolean;
  onChange: (patch: Partial<FilterCondition>) => void;
  onRemove: () => void;
};

const toMulti = (vs: string[]): Array<SelectableValue<string>> => vs.map((v) => ({ label: v, value: v }));
const fromMulti = (items: Array<SelectableValue<string>>): string[] =>
  items.map((i) => i.value).filter((v): v is string => !!v);

export const FilterConditionRow = ({
  condition,
  signal,
  discoveredKeys,
  loadingKeys,
  fetchValues,
  values,
  loadingValues,
  onChange,
  onRemove,
}: Props) => {
  const keyOptions = useMemo(
    () => discoveredKeys.map((d) => ({ label: d.key, value: d.key })),
    [discoveredKeys]
  );
  const operators = opOptions(condition.type, condition.scope);
  const isDuration = condition.scope === 'column' && condition.key === 'Duration';
  const takesValues = opTakesValues(condition.op);
  const isMulti = opIsMulti(condition.op);

  const onKeyPicked = (item: SelectableValue<string>) => {
    if (!item?.value) {
      return;
    }
    const resolved = resolveScopeForKey(signal, item.value, discoveredKeys);
    onChange({
      key: item.value,
      scope: resolved.scope,
      type: resolved.type,
      op: resolved.type === 'number' ? 'eq' : 'in',
      values: [],
      unit: item.value === 'Duration' ? 'ns' : undefined,
    });
  };

  const onOpChange = (item: SelectableValue<FilterOp>) => {
    if (!item?.value) {
      return;
    }
    const wasMulti = opIsMulti(condition.op);
    const willBeMulti = opIsMulti(item.value);
    const nextValues =
      wasMulti && !willBeMulti && condition.values.length > 1
        ? [condition.values[0]]
        : condition.values;
    onChange({ op: item.value, values: nextValues });
  };

  const onSingleValueChange = (raw: string) => {
    onChange({ values: raw === '' ? [] : [raw] });
  };

  const onMultiValueChange = (items: Array<SelectableValue<string>>) => {
    onChange({ values: fromMulti(items) });
  };

  const onValueMenuOpen = () => fetchValues(condition.scope, condition.key);

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
      <Select<string>
        width={28}
        placeholder={loadingKeys ? 'Loading keys…' : 'key'}
        options={keyOptions}
        value={condition.key ? { label: condition.key, value: condition.key } : null}
        onChange={onKeyPicked}
        allowCustomValue
        isLoading={loadingKeys}
        onCreateOption={(v) => onKeyPicked({ label: v, value: v })}
      />
      <Select<FilterOp>
        width={16}
        options={operators}
        value={operators.find((o) => o.value === condition.op) ?? null}
        onChange={onOpChange}
      />
      {takesValues && !isMulti && !isDuration && (
        <Input
          width={28}
          placeholder="value"
          value={condition.values[0] ?? ''}
          onChange={(e) => onSingleValueChange((e.target as HTMLInputElement).value)}
        />
      )}
      {takesValues && !isMulti && isDuration && (
        <>
          <Input
            width={20}
            type="number"
            placeholder="value"
            value={condition.values[0] ?? ''}
            onChange={(e) => onSingleValueChange((e.target as HTMLInputElement).value)}
          />
          <Select<DurationUnit>
            width={10}
            options={UNIT_OPTIONS}
            value={UNIT_OPTIONS.find((o) => o.value === (condition.unit ?? 'ns')) ?? UNIT_OPTIONS[0]}
            onChange={(item) => onChange({ unit: item?.value ?? 'ns' })}
          />
        </>
      )}
      {takesValues && isMulti && (
        <MultiSelect<string>
          width={40}
          placeholder={loadingValues ? 'Loading values…' : 'values'}
          options={values}
          value={toMulti(condition.values)}
          onChange={onMultiValueChange}
          onOpenMenu={onValueMenuOpen}
          isLoading={loadingValues}
          allowCustomValue
          isClearable
        />
      )}
      <IconButton name="trash-alt" aria-label="Remove condition" onClick={onRemove} />
    </div>
  );
};

export const _unused: FilterValueType = 'string';
