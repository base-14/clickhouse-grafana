import { FilterScope, SignalType } from '../../../../../types/types';

export const quote = (v: string): string => `'${v.replace(/'/g, "''")}'`;
export const inList = (vs: string[]): string => vs.map(quote).join(', ');

export const mapColumnForScope = (signal: SignalType, scope: FilterScope): string | null => {
  if (scope === 'resource') {
    return 'ResourceAttributes';
  }
  if (scope === 'scope') {
    return signal === SignalType.Traces ? null : 'ScopeAttributes';
  }
  if (scope === 'log' && signal === SignalType.Logs) {
    return 'LogAttributes';
  }
  if (scope === 'span' && signal === SignalType.Traces) {
    return 'SpanAttributes';
  }
  if (scope === 'attribute' && signal === SignalType.Metrics) {
    return 'Attributes';
  }
  return null;
};

export const accessExpr = (signal: SignalType, scope: FilterScope, key: string): string | null => {
  if (scope === 'column') {
    return key;
  }
  const col = mapColumnForScope(signal, scope);
  if (!col) {
    return null;
  }
  return `${col}[${quote(key)}]`;
};

const sanitizeAlias = (raw: string): string => raw.replace(/[^A-Za-z0-9_]/g, '_');

export const dimAlias = (key: string): string => sanitizeAlias(key);
