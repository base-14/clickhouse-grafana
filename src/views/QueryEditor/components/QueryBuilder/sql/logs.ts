import { CHQuery, QueryBuilderSettings, SignalType } from '../../../../../types/types';
import { compileBodySearch } from './compileBodySearch';
import { compileFilters } from './compileFilters';
import { accessExpr, dimAlias, inList } from './util';

type Args = {
  query: CHQuery;
  database: string;
  settings: QueryBuilderSettings;
};

const RAW_DEFAULT_LIMIT = 200;

const baseWhere = (
  query: CHQuery,
  settings: QueryBuilderSettings,
  timeCol: string
): string[] => {
  const wheres: string[] = [
    `${timeCol} >= toDateTime(\${__from:date:seconds})`,
    `${timeCol} <= toDateTime(\${__to:date:seconds})`,
  ];
  if ((query.serviceNames ?? []).length > 0) {
    wheres.push(`ServiceName IN (${inList(query.serviceNames!)})`);
  }
  if ((query.environments ?? []).length > 0) {
    wheres.push(
      `ResourceAttributes['${settings.environmentKey}'] IN (${inList(query.environments!)})`
    );
  }
  const body = compileBodySearch(query.bodySearch, !!query.bodySearchIsRegex);
  if (body) {
    wheres.push(body);
  }
  const filterClause = compileFilters(query.filters, SignalType.Logs);
  if (filterClause) {
    wheres.push(filterClause);
  }
  return wheres;
};

const buildRawLogsSql = ({ query, database, settings }: Args): string => {
  const table = settings.logsTable;
  const timeCol = 'TimestampTime';
  const wheres = baseWhere(query, settings, timeCol);
  return [
    'SELECT',
    `  ${timeCol},`,
    `  Body`,
    `FROM ${database}.${table}`,
    'WHERE',
    '  ' + wheres.join('\n  AND '),
    `ORDER BY ${timeCol} DESC`,
    `LIMIT ${RAW_DEFAULT_LIMIT}`,
  ].join('\n');
};

const buildTimeSeriesLogsSql = ({ query, database, settings }: Args): string => {
  const table = settings.logsTable;
  const timeCol = 'TimestampTime';
  const wheres = baseWhere(query, settings, timeCol);

  const selects: string[] = [
    `toUInt32(toStartOfInterval(${timeCol}, INTERVAL greatest(1, intDiv($__interval_ms, 1000)) SECOND)) * 1000 AS t`,
  ];
  const groupBy: string[] = ['t'];

  for (const gb of query.groupBy ?? []) {
    const expr = accessExpr(SignalType.Logs, gb.scope, gb.key);
    if (!expr) {
      continue;
    }
    const alias = dimAlias(gb.key);
    selects.push(`${expr} AS ${alias}`);
    groupBy.push(alias);
  }

  selects.push('count() AS count_value');

  return [
    'SELECT',
    '  ' + selects.join(',\n  '),
    `FROM ${database}.${table}`,
    'WHERE',
    '  ' + wheres.join('\n  AND '),
    'GROUP BY ' + groupBy.join(', '),
    'ORDER BY t',
  ].join('\n');
};

export const buildLogsSql = (args: Args): string | null => {
  if (!args.database) {
    return null;
  }
  if (args.query.logsMode === 'timeseries') {
    return buildTimeSeriesLogsSql(args);
  }
  return buildRawLogsSql(args);
};
