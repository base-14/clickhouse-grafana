import { CHQuery, QueryBuilderSettings, SignalType } from '../../../../../types/types';
import { buildTracesSql } from './traces';

type Args = {
  query: CHQuery;
  database: string;
  settings: QueryBuilderSettings;
};

export const buildPanelSql = (args: Args): string | null => {
  if (!args.query.signalType) {
    return null;
  }
  if (args.query.signalType === SignalType.Traces) {
    return buildTracesSql(args);
  }
  return null;
};
