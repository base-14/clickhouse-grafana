import { CHQuery, QueryBuilderSettings, SignalType } from '../../../../../types/types';
import { compileFilters } from './compileFilters';
import { compileOperations } from './compileOperations';
import { accessExpr, dimAlias, inList } from './util';
import { effectiveEnvironments, effectiveSignalNames } from '../presets';

type Args = {
  query: CHQuery;
  database: string;
  settings: QueryBuilderSettings;
};

export const buildTracesSql = ({ query, database, settings }: Args): string | null => {
  if (!database) {
    return null;
  }
  const table = settings.tracesTable;
  const timeCol = 'Timestamp';

  const selects: string[] = [
    `toUnixTimestamp64Milli(toStartOfInterval(${timeCol}, INTERVAL $__interval_ms MILLISECOND)) AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const gb of query.groupBy ?? []) {
    const expr = accessExpr(SignalType.Traces, gb.scope, gb.key);
    if (!expr) {
      continue;
    }
    const alias = dimAlias(gb.key);
    selects.push(`${expr} AS ${alias}`);
    groupBy.push(alias);
  }

  const opCols = compileOperations(query.operations);
  for (const c of opCols) {
    selects.push(`${c.sql} AS ${c.alias}`);
  }
  if (opCols.length === 0) {
    selects.push('count() AS count_value');
  }

  const wheres: string[] = ['$timeFilter'];

  if ((query.serviceNames ?? []).length > 0) {
    wheres.push(`ServiceName IN (${inList(query.serviceNames!)})`);
  }
  const effEnvs = effectiveEnvironments(query.environments);
  if (effEnvs.length > 0) {
    wheres.push(`ResourceAttributes['${settings.environmentKey}'] IN (${inList(effEnvs)})`);
  }
  const spanNames = effectiveSignalNames(query.signalNames);
  if (spanNames.length > 0) {
    wheres.push(`SpanName IN (${inList(spanNames)})`);
  }

  const filterClause = compileFilters(query.filters, SignalType.Traces);
  if (filterClause) {
    wheres.push(filterClause);
  }

  const sql = [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${database}.${table}`,
    'WHERE',
    '  ' + wheres.join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');

  return sql;
};
