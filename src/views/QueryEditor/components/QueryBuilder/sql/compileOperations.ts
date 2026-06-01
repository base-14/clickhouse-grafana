import { QueryBuilderOperation } from '../../../../../types/types';

const NANO_PER: Record<string, number> = {
  ns: 1,
  us: 1_000,
  ms: 1_000_000,
  s: 1_000_000_000,
};

const aliasFor = (op: QueryBuilderOperation): string => {
  if (op.kind === 'count') {
    return 'count_value';
  }
  if (op.kind === 'percentile') {
    const p = op.percentile ?? 99;
    const safeP = String(p).replace('.', '_');
    return `p${safeP}_${op.column ?? 'value'}`;
  }
  return `${op.kind}_${op.column ?? 'value'}`;
};

const divisorForUnit = (unit?: string): number => {
  if (!unit) {
    return 1;
  }
  return NANO_PER[unit] ?? 1;
};

const expr = (op: QueryBuilderOperation): string => {
  if (op.kind === 'count') {
    return 'count()';
  }
  const col = op.column ?? 'Value';
  const div = divisorForUnit(op.unit);
  const colExpr = div > 1 ? `${col} / ${div}` : col;
  if (op.kind === 'percentile') {
    const p = (op.percentile ?? 99) / 100;
    return `quantile(${p})(${colExpr})`;
  }
  if (op.kind === 'count_distinct') {
    return `countDistinct(${col})`;
  }
  if (op.kind === 'last') {
    return `argMax(${colExpr}, TimeUnix)`;
  }
  return `${op.kind}(${colExpr})`;
};

export type OperationColumn = {
  sql: string;
  alias: string;
};

export const compileOperations = (ops: QueryBuilderOperation[] | undefined): OperationColumn[] => {
  if (!ops || ops.length === 0) {
    return [];
  }
  const seen = new Map<string, number>();
  return ops.map((op) => {
    const base = aliasFor(op);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const alias = count === 0 ? base : `${base}_${count + 1}`;
    return { sql: expr(op), alias };
  });
};
