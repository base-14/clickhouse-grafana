import { FilterScope, FilterValueType, SignalType } from '../../../../../types/types';
import { columnsForSignal, findColumn } from './columns';

export type DiscoveredKey = {
  key: string;
  scope: FilterScope;
};

const SCOPE_PRIORITY: FilterScope[] = ['column', 'resource', 'scope', 'log', 'span', 'attribute'];

const OTEL_RESOURCE_PREFIXES = ['service.', 'host.', 'k8s.', 'container.', 'cloud.', 'deployment.', 'os.', 'process.'];

export const defaultMapScopeForSignal = (signal: SignalType): FilterScope => {
  switch (signal) {
    case SignalType.Logs:
      return 'log';
    case SignalType.Traces:
      return 'span';
    case SignalType.Metrics:
      return 'attribute';
  }
};

export const mergeKeysByPriority = (signal: SignalType, discovered: DiscoveredKey[]): DiscoveredKey[] => {
  const byKey = new Map<string, DiscoveredKey>();

  for (const col of columnsForSignal(signal)) {
    byKey.set(col.name, { key: col.name, scope: 'column' });
  }

  for (const item of discovered) {
    const existing = byKey.get(item.key);
    if (!existing) {
      byKey.set(item.key, item);
      continue;
    }
    const existingRank = SCOPE_PRIORITY.indexOf(existing.scope);
    const incomingRank = SCOPE_PRIORITY.indexOf(item.scope);
    if (incomingRank < existingRank) {
      byKey.set(item.key, item);
    }
  }

  return Array.from(byKey.values()).sort((a, b) => a.key.localeCompare(b.key));
};

export const resolveScopeForKey = (
  signal: SignalType,
  key: string,
  discovered: DiscoveredKey[]
): { scope: FilterScope; type: FilterValueType } => {
  const col = findColumn(signal, key);
  if (col) {
    return { scope: 'column', type: col.type };
  }
  const hit = discovered.find((d) => d.key === key);
  if (hit) {
    return { scope: hit.scope, type: 'string' };
  }
  if (OTEL_RESOURCE_PREFIXES.some((p) => key.startsWith(p))) {
    return { scope: 'resource', type: 'string' };
  }
  return { scope: defaultMapScopeForSignal(signal), type: 'string' };
};
