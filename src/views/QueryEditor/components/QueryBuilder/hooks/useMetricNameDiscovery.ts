import { useEffect, useState } from 'react';

export type MetricNameEntry = {
  name: string;
  tables: string[];
};

type Args = {
  datasource: { metricFindQuery: (q: string) => Promise<any[]> };
  query: string | null;
  enabled: boolean;
};

export type MetricNameDiscoveryResult = {
  loading: boolean;
  error: string | null;
  entries: MetricNameEntry[];
};

const parseRow = (row: any): MetricNameEntry | null => {
  if (!row || typeof row !== 'object') {
    return null;
  }
  const name = row.MetricName == null ? null : String(row.MetricName);
  if (!name) {
    return null;
  }
  const raw = row.Tables;
  let tables: string[] = [];
  if (Array.isArray(raw)) {
    tables = raw.map((t) => String(t)).filter((t) => t.length > 0);
  } else if (typeof raw === 'string') {
    const trimmed = raw.replace(/^\[|]$/g, '');
    tables = trimmed
      .split(',')
      .map((t) => t.replace(/^['"\s]+|['"\s]+$/g, ''))
      .filter((t) => t.length > 0);
  }
  return { name, tables };
};

export const useMetricNameDiscovery = ({
  datasource,
  query,
  enabled,
}: Args): MetricNameDiscoveryResult => {
  const [state, setState] = useState<MetricNameDiscoveryResult>({
    loading: false,
    error: null,
    entries: [],
  });

  useEffect(() => {
    if (!enabled || !query) {
      setState({ loading: false, error: null, entries: [] });
      return;
    }
    let cancelled = false;
    setState({ loading: true, error: null, entries: [] });

    datasource
      .metricFindQuery(query)
      .then((rows: any[]) => {
        if (cancelled) {
          return;
        }
        const entries = (rows || [])
          .map(parseRow)
          .filter((e): e is MetricNameEntry => !!e);
        setState({ loading: false, error: null, entries });
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setState({ loading: false, error: err?.message || String(err), entries: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [datasource, query, enabled]);

  return state;
};
