import React from 'react';
import { Button, IconButton, Input, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import {
  DurationUnit,
  OperationKind,
  QueryBuilderOperation,
  SignalType,
} from '../../../../../types/types';
import {
  appendOperation,
  columnsForSignal,
  KIND_OPTIONS,
  kindNeedsColumn,
  kindNeedsUnit,
  PERCENTILE_PRESETS,
  removeOperation,
  UNIT_OPTIONS,
  updateOperation,
} from './operations';

type Props = {
  signal: SignalType;
  operations: QueryBuilderOperation[];
  onChange: (next: QueryBuilderOperation[]) => void;
};

const findPreset = (p?: number) =>
  PERCENTILE_PRESETS.find((opt) => opt.value === p) ?? null;

const Row = ({
  signal,
  op,
  onPatch,
  onRemove,
}: {
  signal: SignalType;
  op: QueryBuilderOperation;
  onPatch: (patch: Partial<QueryBuilderOperation>) => void;
  onRemove: () => void;
}) => {
  const columns = columnsForSignal(signal);
  const needsColumn = kindNeedsColumn(op.kind);
  const needsUnit = kindNeedsUnit(op.kind, op.column);
  const isPercentile = op.kind === 'percentile';

  const onKindChange = (item: SelectableValue<OperationKind>) => {
    if (!item?.value) {
      return;
    }
    const willNeedColumn = kindNeedsColumn(item.value);
    const column = willNeedColumn ? op.column ?? columns[0] : undefined;
    const patch: Partial<QueryBuilderOperation> = {
      kind: item.value,
      column,
      unit: column === 'Duration' ? op.unit ?? 'ns' : undefined,
    };
    if (item.value === 'percentile' && op.percentile === undefined) {
      patch.percentile = 99;
    }
    if (item.value !== 'percentile') {
      patch.percentile = undefined;
    }
    onPatch(patch);
  };

  const onPercentilePreset = (item: SelectableValue<number>) => {
    if (item?.value === undefined || item?.value === null) {
      return;
    }
    onPatch({ percentile: item.value });
  };

  const onPercentileCustom = (raw: string) => {
    if (raw === '') {
      onPatch({ percentile: undefined });
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) {
      return;
    }
    onPatch({ percentile: Math.min(100, Math.max(0, n)) });
  };

  const onColumnChange = (item: SelectableValue<string>) => {
    if (!item?.value) {
      return;
    }
    onPatch({
      column: item.value,
      unit: item.value === 'Duration' ? op.unit ?? 'ns' : undefined,
    });
  };

  const onUnitChange = (item: SelectableValue<DurationUnit>) => {
    onPatch({ unit: item?.value });
  };

  const presetMatches = isPercentile ? findPreset(op.percentile) : null;

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
      <Select<OperationKind>
        width={26}
        options={KIND_OPTIONS}
        value={KIND_OPTIONS.find((o) => o.value === op.kind) ?? null}
        onChange={onKindChange}
      />
      {needsColumn && columns.length > 1 && (
        <Select<string>
          width={16}
          options={columns.map((c) => ({ label: c, value: c }))}
          value={op.column ? { label: op.column, value: op.column } : null}
          onChange={onColumnChange}
        />
      )}
      {needsColumn && columns.length <= 1 && op.column && (
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{op.column}</span>
      )}
      {isPercentile && (
        <>
          <Select<number>
            width={14}
            placeholder="preset"
            options={PERCENTILE_PRESETS}
            value={presetMatches}
            onChange={onPercentilePreset}
          />
          <Input
            width={14}
            type="number"
            placeholder="0-100"
            value={op.percentile ?? ''}
            onChange={(e) => onPercentileCustom((e.target as HTMLInputElement).value)}
          />
        </>
      )}
      {needsUnit && (
        <Select<DurationUnit>
          width={10}
          options={UNIT_OPTIONS}
          value={UNIT_OPTIONS.find((o) => o.value === (op.unit ?? 'ns')) ?? UNIT_OPTIONS[0]}
          onChange={onUnitChange}
        />
      )}
      <IconButton name="trash-alt" aria-label="Remove aggregation" onClick={onRemove} />
    </div>
  );
};

export const OperationsSection = ({ signal, operations, onChange }: Props) => {
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
        Aggregation
      </div>
      {operations.length === 0 && (
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>
          No aggregations selected. Add one to define what the panel returns.
        </div>
      )}
      {operations.map((op) => (
        <Row
          key={op.id}
          signal={signal}
          op={op}
          onPatch={(patch) => onChange(updateOperation(operations, op.id, patch))}
          onRemove={() => onChange(removeOperation(operations, op.id))}
        />
      ))}
      <Button
        size="sm"
        variant="secondary"
        icon="plus"
        onClick={() => onChange(appendOperation(operations, signal))}
      >
        Aggregation
      </Button>
    </div>
  );
};
