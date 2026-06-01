import {
  FilterCondition,
  FilterGroup,
  FilterNode,
  FilterOp,
  SignalType,
} from '../../../../../types/types';
import { accessExpr, formatValue, inList, mapColumnForScope, quote } from './util';

const isVariableRef = (raw: string): boolean => /^\$\{?\w+/.test(raw.trim());

const NANO_PER: Record<string, number> = {
  ns: 1,
  us: 1_000,
  ms: 1_000_000,
  s: 1_000_000_000,
};

const toStorageNumber = (cond: FilterCondition, raw: string): string => {
  if (isVariableRef(raw)) {
    return formatValue(raw);
  }
  if (cond.key === 'Duration' && cond.unit && NANO_PER[cond.unit]) {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      return String(Math.round(n * NANO_PER[cond.unit]));
    }
  }
  return raw;
};

const compileCondition = (cond: FilterCondition, signal: SignalType): string | null => {
  const access = accessExpr(signal, cond.scope, cond.key);
  if (!access) {
    return null;
  }

  if (cond.op === 'exists' || cond.op === 'nexists') {
    const mapCol = mapColumnForScope(signal, cond.scope);
    if (!mapCol) {
      return null;
    }
    const inner = `mapContains(${mapCol}, ${quote(cond.key)})`;
    return cond.op === 'nexists' ? `NOT ${inner}` : inner;
  }

  const noVals = cond.values.length === 0;
  if (noVals && cond.op !== 'eq' && cond.op !== 'neq') {
    return null;
  }

  const v0 = cond.values[0] ?? '';

  switch (cond.op) {
    case 'eq':
      if (cond.type === 'number') {
        return `${access} = ${toStorageNumber(cond, v0)}`;
      }
      return `${access} = ${formatValue(v0)}`;
    case 'neq':
      if (cond.type === 'number') {
        return `${access} != ${toStorageNumber(cond, v0)}`;
      }
      return `${access} != ${formatValue(v0)}`;
    case 'in':
      if (cond.type === 'number') {
        return `${access} IN (${cond.values.map((v) => toStorageNumber(cond, v)).join(', ')})`;
      }
      return `${access} IN (${inList(cond.values)})`;
    case 'nin':
      if (cond.type === 'number') {
        return `${access} NOT IN (${cond.values.map((v) => toStorageNumber(cond, v)).join(', ')})`;
      }
      return `${access} NOT IN (${inList(cond.values)})`;
    case 'like':
      return `${access} LIKE ${formatValue(v0)}`;
    case 'nlike':
      return `${access} NOT LIKE ${formatValue(v0)}`;
    case 'regex':
      return `match(${access}, ${formatValue(v0)})`;
    case 'nregex':
      return `NOT match(${access}, ${formatValue(v0)})`;
    case 'lt':
      return `${access} < ${toStorageNumber(cond, v0)}`;
    case 'lte':
      return `${access} <= ${toStorageNumber(cond, v0)}`;
    case 'gt':
      return `${access} > ${toStorageNumber(cond, v0)}`;
    case 'gte':
      return `${access} >= ${toStorageNumber(cond, v0)}`;
    default: {
      const _exhaustive: never = cond.op as FilterOp & never;
      void _exhaustive;
      return null;
    }
  }
};

const compileNode = (node: FilterNode, signal: SignalType): string | null => {
  if (node.kind === 'condition') {
    return compileCondition(node, signal);
  }
  const parts = node.children
    .map((c) => compileNode(c, signal))
    .filter((s): s is string => !!s);
  if (parts.length === 0) {
    return null;
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return `(${parts.join(` ${node.connector} `)})`;
};

export const compileFilters = (root: FilterGroup | undefined, signal: SignalType): string | null => {
  if (!root) {
    return null;
  }
  return compileNode(root, signal);
};
