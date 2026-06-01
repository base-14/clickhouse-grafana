import {
  FilterCondition,
  FilterConnector,
  FilterGroup,
  FilterNode,
  FilterOp,
  FilterScope,
  FilterValueType,
} from '../../../../../types/types';

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${counter++}`;

export const emptyRoot = (): FilterGroup => ({
  kind: 'group',
  id: nextId('grp'),
  connector: 'AND',
  children: [],
});

export const ensureRoot = (root?: FilterGroup): FilterGroup => root ?? emptyRoot();

export const isGroup = (n: FilterNode): n is FilterGroup => n.kind === 'group';
export const isCondition = (n: FilterNode): n is FilterCondition => n.kind === 'condition';

export const makeCondition = (
  init: Partial<FilterCondition> & {
    key: string;
    scope: FilterScope;
    type: FilterValueType;
  }
): FilterCondition => ({
  kind: 'condition',
  id: init.id ?? nextId('cond'),
  scope: init.scope,
  key: init.key,
  type: init.type,
  op: init.op ?? (init.type === 'number' ? 'eq' : 'in'),
  values: init.values ?? [],
  unit: init.unit,
});

export const makeGroup = (connector: FilterConnector, children: FilterNode[] = []): FilterGroup => ({
  kind: 'group',
  id: nextId('grp'),
  connector,
  children,
});

const mapTree = (group: FilterGroup, fn: (g: FilterGroup) => FilterGroup): FilterGroup => {
  const next = fn({ ...group, children: group.children.map((c) => (isGroup(c) ? mapTree(c, fn) : c)) });
  return next;
};

export const findGroupId = (root: FilterGroup, id: string): FilterGroup | null => {
  if (root.id === id) {
    return root;
  }
  for (const c of root.children) {
    if (isGroup(c)) {
      const hit = findGroupId(c, id);
      if (hit) {
        return hit;
      }
    }
  }
  return null;
};

export const addChild = (root: FilterGroup, groupId: string, child: FilterNode): FilterGroup =>
  mapTree(root, (g) => (g.id === groupId ? { ...g, children: [...g.children, child] } : g));

export const removeChild = (root: FilterGroup, childId: string): FilterGroup => {
  const helper = (g: FilterGroup): FilterGroup => {
    const filtered: FilterNode[] = [];
    for (const c of g.children) {
      if (c.id === childId) {
        continue;
      }
      filtered.push(isGroup(c) ? helper(c) : c);
    }
    return { ...g, children: filtered };
  };
  return helper(root);
};

export const updateCondition = (
  root: FilterGroup,
  conditionId: string,
  patch: Partial<FilterCondition>
): FilterGroup => {
  const helper = (g: FilterGroup): FilterGroup => ({
    ...g,
    children: g.children.map((c) => {
      if (isGroup(c)) {
        return helper(c);
      }
      if (c.id === conditionId) {
        return { ...c, ...patch };
      }
      return c;
    }),
  });
  return helper(root);
};

export const toggleConnector = (root: FilterGroup, groupId: string): FilterGroup =>
  mapTree(root, (g) => (g.id === groupId ? { ...g, connector: g.connector === 'AND' ? 'OR' : 'AND' } : g));

export const depthOf = (root: FilterGroup): number => {
  if (root.children.length === 0) {
    return 1;
  }
  let max = 1;
  for (const c of root.children) {
    if (isGroup(c)) {
      const d = depthOf(c) + 1;
      if (d > max) {
        max = d;
      }
    }
  }
  return max;
};

export const oppositeConnector = (c: FilterConnector): FilterConnector => (c === 'AND' ? 'OR' : 'AND');

export const OP_OPTIONS_STRING: Array<{ label: string; value: FilterOp }> = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'neq' },
  { label: 'IN', value: 'in' },
  { label: 'NOT IN', value: 'nin' },
  { label: 'LIKE', value: 'like' },
  { label: 'NOT LIKE', value: 'nlike' },
  { label: 'regex', value: 'regex' },
  { label: 'not regex', value: 'nregex' },
  { label: 'EXISTS', value: 'exists' },
  { label: 'NOT EXISTS', value: 'nexists' },
];

export const OP_OPTIONS_NUMBER: Array<{ label: string; value: FilterOp }> = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'neq' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: 'IN', value: 'in' },
  { label: 'NOT IN', value: 'nin' },
];

export const opOptions = (type: FilterValueType, scope: FilterScope): Array<{ label: string; value: FilterOp }> => {
  const base = type === 'number' ? OP_OPTIONS_NUMBER : OP_OPTIONS_STRING;
  if (scope === 'column') {
    return base.filter((o) => o.value !== 'exists' && o.value !== 'nexists');
  }
  return base;
};

export const opTakesValues = (op: FilterOp): boolean => op !== 'exists' && op !== 'nexists';
export const opIsMulti = (op: FilterOp): boolean => op === 'in' || op === 'nin';
