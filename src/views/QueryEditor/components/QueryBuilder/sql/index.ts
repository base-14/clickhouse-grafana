import { CHQuery, QueryBuilderSettings, SignalType } from '../../../../../types/types';
import { buildTracesSql } from './traces';
import { buildLogsSql } from './logs';
import { buildMetricsSql } from './metrics';

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
  if (args.query.signalType === SignalType.Logs) {
    return buildLogsSql(args);
  }
  if (args.query.signalType === SignalType.Metrics) {
    return buildMetricsSql(args);
  }
  return null;
};
