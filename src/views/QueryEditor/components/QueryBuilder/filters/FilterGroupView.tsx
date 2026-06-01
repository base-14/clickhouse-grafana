import React from 'react';
import { Button, IconButton } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { FilterCondition, FilterGroup, FilterNode, SignalType } from '../../../../../types/types';
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

const valueKey = (scope: FilterCondition['scope'], key: string) => `${scope}::${key}`;

const ConnectorChip = ({ connector, onToggle }: { connector: 'AND' | 'OR'; onToggle: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0 2px 8px' }}>
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: 'rgba(110, 159, 255, 0.12)',
        color: '#6e9fff',
        border: '1px solid rgba(110, 159, 255, 0.35)',
        borderRadius: 10,
        padding: '1px 10px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        cursor: 'pointer',
      }}
      title="Click to toggle AND / OR"
    >
      {connector}
    </button>
  </div>
);

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

  const addSubgroup = () => {
    onAddChild(group.id, makeGroup(oppositeConnector(group.connector)));
  };

  const children = group.children;
  const hasChildren = children.length > 0;
  const hasMultiple = children.length > 1;

  const body = (
    <>
      {children.map((child, idx) => {
        const isLast = idx === children.length - 1;
        const nodeView = isGroup(child) ? (
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
        ) : (
          <FilterConditionRow
            key={child.id}
            condition={child}
            signal={signal}
            discoveredKeys={discoveredKeys}
            loadingKeys={loadingKeys}
            fetchValues={fetchValues}
            values={valueCache.get(valueKey(child.scope, child.key))?.options ?? []}
            loadingValues={valueCache.get(valueKey(child.scope, child.key))?.loading ?? false}
            onChange={(patch) => onUpdateCondition(child.id, patch)}
            onRemove={() => onRemoveChild(child.id)}
          />
        );
        return (
          <React.Fragment key={child.id}>
            {nodeView}
            {!isLast && hasMultiple && (
              <ConnectorChip connector={group.connector} onToggle={() => onToggleConnector(group.id)} />
            )}
          </React.Fragment>
        );
      })}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: hasChildren ? 6 : 0 }}>
        <Button size="sm" variant="secondary" icon="plus" onClick={addCondition}>
          Add filter
        </Button>
        {hasChildren && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, padding: '0 4px' }}>·</span>
            <Button size="sm" variant="secondary" fill="text" icon="plus" onClick={addSubgroup}>
              Subgroup
            </Button>
          </>
        )}
        {depth >= 5 && (
          <span style={{ color: '#e09f3e', fontSize: 11, marginLeft: 8 }}>deep nesting — consider flattening</span>
        )}
      </div>
    </>
  );

  if (isRoot) {
    return <div>{body}</div>;
  }

  return (
    <div
      style={{
        border: '1px solid rgba(110, 159, 255, 0.3)',
        borderRadius: 4,
        padding: 8,
        marginTop: 4,
        background: 'rgba(110, 159, 255, 0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <button
          type="button"
          onClick={() => onToggleConnector(group.id)}
          style={{
            background: 'rgba(110, 159, 255, 0.12)',
            color: '#6e9fff',
            border: '1px solid rgba(110, 159, 255, 0.35)',
            borderRadius: 10,
            padding: '1px 12px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.5,
            cursor: 'pointer',
          }}
          title="Click to toggle AND / OR"
        >
          {group.connector}
        </button>
        <IconButton name="trash-alt" aria-label="Remove group" onClick={() => onRemoveChild(group.id)} />
      </div>
      {body}
    </div>
  );
};
