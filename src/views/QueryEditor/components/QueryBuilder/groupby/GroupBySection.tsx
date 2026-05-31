import React from 'react';
import { MultiSelect } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { QueryBuilderGroupBy, SignalType } from '../../../../../types/types';
import { DiscoveredKey, resolveScopeForKey } from '../filters/resolveScope';

type Props = {
  signal: SignalType;
  groupBy: QueryBuilderGroupBy[];
  discoveredKeys: DiscoveredKey[];
  loadingKeys: boolean;
  onChange: (next: QueryBuilderGroupBy[]) => void;
};

const toMulti = (gb: QueryBuilderGroupBy[]): Array<SelectableValue<string>> =>
  gb.map((g) => ({ label: g.key, value: g.key }));

export const GroupBySection = ({ signal, groupBy, discoveredKeys, loadingKeys, onChange }: Props) => {
  const options = discoveredKeys.map((d) => ({ label: d.key, value: d.key }));

  const onSelected = (items: Array<SelectableValue<string>>) => {
    const next: QueryBuilderGroupBy[] = items
      .map((i) => i.value)
      .filter((v): v is string => !!v)
      .map((key) => {
        const existing = groupBy.find((g) => g.key === key);
        if (existing) {
          return existing;
        }
        const resolved = resolveScopeForKey(signal, key, discoveredKeys);
        return { key, scope: resolved.scope };
      });
    onChange(next);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          color: '#6e9fff',
          fontSize: 13,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        Group by
      </div>
      <MultiSelect<string>
        width={80}
        placeholder={loadingKeys ? 'Loading keys…' : 'Pick dimensions to split the series by'}
        options={options}
        value={toMulti(groupBy)}
        onChange={onSelected}
        allowCustomValue
        isClearable
        isLoading={loadingKeys}
      />
    </div>
  );
};
