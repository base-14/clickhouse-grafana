import { FilterCondition, FilterOp, SignalType } from '../../../../../types/types';
import { resolveScopeForKey, DiscoveredKey } from './resolveScope';
import { makeCondition } from './tree';

type RawParsed = {
  key: string;
  op: FilterOp;
  values: string[];
};

const stripQuotes = (raw: string): string => {
  const t = raw.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
    return t.slice(1, -1);
  }
  return t;
};

const splitList = (raw: string): string[] =>
  raw
    .split(',')
    .map((v) => stripQuotes(v.trim()))
    .filter((v) => v.length > 0);

const tryParse = (input: string): RawParsed | null => {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const operators: Array<{ token: string; op: FilterOp; list?: boolean; substr?: boolean }> = [
    { token: '!:', op: 'nin', list: true },
    { token: ':', op: 'in', list: true },
    { token: '!~', op: 'nregex' },
    { token: '=~', op: 'regex' },
    { token: '!=', op: 'neq' },
    { token: '>=', op: 'gte' },
    { token: '<=', op: 'lte' },
    { token: '=', op: 'eq' },
    { token: '>', op: 'gt' },
    { token: '<', op: 'lt' },
    { token: '~', op: 'like', substr: true },
  ];

  for (const { token, op, list, substr } of operators) {
    const idx = trimmed.indexOf(token);
    if (idx <= 0) {
      continue;
    }
    const key = trimmed.slice(0, idx).trim();
    const valueRaw = trimmed.slice(idx + token.length).trim();
    if (!key || !valueRaw) {
      continue;
    }
    if (list) {
      const values = splitList(valueRaw);
      if (!values.length) {
        return null;
      }
      return { key, op, values };
    }
    const value = stripQuotes(valueRaw);
    if (substr) {
      return { key, op, values: [`%${value}%`] };
    }
    return { key, op, values: [value] };
  }

  return null;
};

export const parseInlineFilter = (
  input: string,
  signal: SignalType,
  discovered: DiscoveredKey[]
): FilterCondition | null => {
  const parsed = tryParse(input);
  if (!parsed) {
    return null;
  }
  const { scope, type } = resolveScopeForKey(signal, parsed.key, discovered);
  return makeCondition({ key: parsed.key, scope, type, op: parsed.op, values: parsed.values });
};
