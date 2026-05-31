import React from 'react';
import { Button, IconButton, RadioButtonGroup } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import {
  FilterCondition,
  FilterConnector,
  FilterGroup,
  FilterNode,
  SignalType,
} from '../../../../../types/types';
import { FilterConditionRow } from './FilterConditionRow';
import { defaultMapScopeForSignal, DiscoveredKey } from './resolveScope';
import { isGroup, makeCondition, makeGroup, oppositeConnector } from './tree';

type Props = {
  group: FilterGroup;
  isRoot: boolean;
  signal: SignalType;
  discoveredKeys: DiscoveredKey[];
  loadingKeys: boolean;
  valueCache: Map<string, { loading: boolean; options: Array<SelectableValue<string>> }>;
  fetchValues: (scope: FilterCondition['scope'], key: string) => void;
  onToggleConnector: (groupId: string) => void;
  onAddChild: (groupId: string, child: FilterNode) => void;
  onRemoveChild: (childId: string) => void;
  onUpdateCondition: (conditionId: string, patch: Partial<FilterCondition>) => void;
  depth: number;
};

const CONNECTOR_OPTIONS: Array<SelectableValue<FilterConnector>> = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
];

const valueKey = (scope: FilterCondition['scope'], key: string) => `${scope}::${key}`;

export const FilterGroupView = ({
  group,
  isRoot,
  signal,
  discoveredKeys,
  loadingKeys,
  valueCache,
  fetchValues,
  onToggleConnector,
  onAddChild,
  onRemoveChild,
  onUpdateCondition,
  depth,
}: Props) => {
  const addCondition = () => {
    const seed = discoveredKeys[0];
    const cond = seed
      ? makeCondition({ key: seed.key, scope: seed.scope, type: 'string' })
      : makeCondition({ key: '', scope: defaultMapScopeForSignal(signal), type: 'string' });
    onAddChild(group.id, cond);
  };

  const addGroup = () => {
    onAddChild(group.id, makeGroup(oppositeConnector(group.connector)));
  };

  return (
    <div
      style={{
        border: '1px solid rgba(110, 159, 255, 0.25)',
        borderRadius: 4,
        padding: 8,
        marginBottom: 6,
        marginLeft: isRoot ? 0 : 8,
        background: isRoot ? 'transparent' : 'rgba(110, 159, 255, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6, gap: 8 }}>
        <RadioButtonGroup<FilterConnector>
          size="sm"
          options={CONNECTOR_OPTIONS}
          value={group.connector}
          onChange={() => onToggleConnector(group.id)}
        />
        {!isRoot && (
          <IconButton name="trash-alt" aria-label="Remove group" onClick={() => onRemoveChild(group.id)} />
        )}
        {depth >= 5 && (
          <span style={{ color: '#e09f3e', fontSize: 11 }}>
            deep nesting — consider flattening
          </span>
        )}
      </div>

      {group.children.length === 0 && (
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>
          empty group
        </div>
      )}

      {group.children.map((child) => {
        if (isGroup(child)) {
          return (
            <FilterGroupView
              key={child.id}
              group={child}
              isRoot={false}
              signal={signal}
              discoveredKeys={discoveredKeys}
              loadingKeys={loadingKeys}
              valueCache={valueCache}
              fetchValues={fetchValues}
              onToggleConnector={onToggleConnector}
              onAddChild={onAddChild}
              onRemoveChild={onRemoveChild}
              onUpdateCondition={onUpdateCondition}
              depth={depth + 1}
            />
          );
        }
        const cached = valueCache.get(valueKey(child.scope, child.key));
        return (
          <FilterConditionRow
            key={child.id}
            condition={child}
            signal={signal}
            discoveredKeys={discoveredKeys}
            loadingKeys={loadingKeys}
            fetchValues={fetchValues}
            values={cached?.options ?? []}
            loadingValues={cached?.loading ?? false}
            onChange={(patch) => onUpdateCondition(child.id, patch)}
            onRemove={() => onRemoveChild(child.id)}
          />
        );
      })}

      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <Button size="sm" variant="secondary" icon="plus" onClick={addCondition}>
          Condition
        </Button>
        <Button size="sm" variant="secondary" icon="plus" onClick={addGroup}>
          Group
        </Button>
      </div>
    </div>
  );
};
