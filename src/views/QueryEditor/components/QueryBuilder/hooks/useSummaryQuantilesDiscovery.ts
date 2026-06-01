import { useCallback, useEffect, useState } from 'react';
import { extractErrorMessage } from './errorMessage';

type Args = {
  datasource: { metricFindQuery: (q: string) => Promise<any[]> };
  query: string | null;
  enabled: boolean;
};

export type SummaryQuantilesResult = {
  loading: boolean;
  error: string | null;
  quantiles: number[];
  retry: () => void;
};

const parseRows = (rows: any[]): number[] => {
  const out = new Set<number>();
  for (const row of rows || []) {
    if (!row || typeof row !== 'object') {
      continue;
    }
    const raw = row.quantiles ?? row.Quantile ?? row.q;
    if (Array.isArray(raw)) {
      for (const v of raw) {
        const n = Number(v);
        if (Number.isFinite(n)) {
          out.add(n);
        }
      }
    } else if (typeof raw === 'string') {
      const trimmed = raw.replace(/^\[|]$/g, '');
      for (const piece of trimmed.split(',')) {
        const n = Number(piece.trim());
        if (Number.isFinite(n)) {
          out.add(n);
        }
      }
    }
  }
  return Array.from(out).sort((a, b) => a - b);
};

export const useSummaryQuantilesDiscovery = ({
  datasource,
  query,
  enabled,
}: Args): SummaryQuantilesResult => {
  const [state, setState] = useState<{ loading: boolean; error: string | null; quantiles: number[] }>({
    loading: false,
    error: null,
    quantiles: [],
  });
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!enabled || !query) {
      setState({ loading: false, error: null, quantiles: [] });
      return;
    }
    let cancelled = false;
    setState({ loading: true, error: null, quantiles: [] });

    datasource
      .metricFindQuery(query)
      .then((rows: any[]) => {
        if (cancelled) {
          return;
        }
        setState({ loading: false, error: null, quantiles: parseRows(rows) });
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setState({ loading: false, error: extractErrorMessage(err), quantiles: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [datasource, query, enabled, retryToken]);

  const retry = useCallback(() => setRetryToken((n) => n + 1), []);

  return { ...state, retry };
};
