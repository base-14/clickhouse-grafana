import { FilterScope, SignalType } from '../../../../../types/types';

export const quote = (v: string): string => `'${v.replace(/'/g, "''")}'`;

const BUILTIN_VAR_RE = /^\$\{?__\w+/;
const VAR_WITH_FMT_RE = /^\$\{(\w+):[^}]+\}$/;
const VAR_BRACED_RE = /^\$\{(\w+)\}$/;
const VAR_BARE_RE = /^\$(\w+)$/;

export const formatValue = (raw: string): string => {
  const v = raw.trim();
  if (!v) {
    return quote(raw);
  }
  if (BUILTIN_VAR_RE.test(v)) {
    return v;
  }
  if (VAR_WITH_FMT_RE.test(v)) {
    return v;
  }
  const braced = v.match(VAR_BRACED_RE);
  if (braced) {
    return `\${${braced[1]}:singlequote}`;
  }
  const bare = v.match(VAR_BARE_RE);
  if (bare) {
    return `\${${bare[1]}:singlequote}`;
  }
  return quote(raw);
};

export const inList = (vs: string[]): string => vs.map(formatValue).join(', ');

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
