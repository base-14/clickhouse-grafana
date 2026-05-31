import { useCallback, useEffect, useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { FilterScope, QueryBuilderSettings, SignalType } from '../../../../../types/types';
import {
  buildKeyDiscoveryQuery,
  buildValueDiscoveryQuery,
  FilterDiscoveryDeps,
} from '../discoveryQueries';
import { DiscoveredKey, mergeKeysByPriority } from '../filters/resolveScope';

type Datasource = { metricFindQuery: (q: string) => Promise<any[]> };

type KeyState = {
  loading: boolean;
  error: string | null;
  keys: DiscoveredKey[];
};

const valueCacheKey = (scope: FilterScope, key: string) => `${scope}::${key}`;

const stringFromRow = (r: any): string | null => {
  if (r == null) {
    return null;
  }
  if (typeof r === 'string') {
    return r;
  }
  if (typeof r === 'object') {
    const firstKey = Object.keys(r)[0];
    return firstKey ? (r[firstKey] == null ? null : String(r[firstKey])) : null;
  }
  return String(r);
};

export const useKeyDiscovery = (args: {
  datasource: Datasource;
  enabled: boolean;
  deps: FilterDiscoveryDeps | null;
}): KeyState => {
  const { datasource, enabled, deps } = args;
  const [state, setState] = useState<KeyState>({ loading: false, error: null, keys: [] });
  const queryKey = enabled && deps ? buildKeyDiscoveryQuery(deps).query : null;

  useEffect(() => {
    if (!enabled || !deps || !queryKey) {
      setState({ loading: false, error: null, keys: [] });
      return;
    }
    let cancelled = false;
    setState({ loading: true, error: null, keys: [] });
    datasource
      .metricFindQuery(queryKey)
      .then((rows: any[]) => {
        if (cancelled) {
          return;
        }
        const discovered: DiscoveredKey[] = (rows || [])
          .map((r) => {
            if (r && typeof r === 'object' && 'k' in r && 's' in r) {
              const k = r.k == null ? null : String(r.k);
              const s = r.s == null ? null : (String(r.s) as FilterScope);
              if (!k || !s) {
                return null;
              }
              return { key: k, scope: s };
            }
            return null;
          })
          .filter((x): x is DiscoveredKey => !!x);
        setState({
          loading: false,
          error: null,
          keys: mergeKeysByPriority(deps.signalType, discovered),
        });
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setState({ loading: false, error: err?.message || String(err), keys: [] });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource, queryKey, enabled]);

  return state;
};

export type ValueCacheEntry = {
  loading: boolean;
  options: Array<SelectableValue<string>>;
  error: string | null;
};

export const useValueDiscovery = (args: {
  datasource: Datasource;
  enabled: boolean;
  signal: SignalType;
  database: string;
  settings: QueryBuilderSettings;
  lookback: string;
  serviceNames: string[];
  environments: string[];
}) => {
  const [cache, setCache] = useState<Map<string, ValueCacheEntry>>(new Map());

  const fetchValues = useCallback(
    (scope: FilterScope, key: string) => {
      if (!args.enabled || !key) {
        return;
      }
      const cacheK = valueCacheKey(scope, key);
      if (cache.get(cacheK)) {
        return;
      }
      setCache((prev) => {
        const next = new Map(prev);
        next.set(cacheK, { loading: true, options: [], error: null });
        return next;
      });
      const sql = buildValueDiscoveryQuery({
        signalType: args.signal,
        database: args.database,
        settings: args.settings,
        lookback: args.lookback,
        serviceNames: args.serviceNames,
        environments: args.environments,
        scope,
        key,
      });
      if (!sql) {
        setCache((prev) => {
          const next = new Map(prev);
          next.set(cacheK, { loading: false, options: [], error: null });
          return next;
        });
        return;
      }
      args.datasource
        .metricFindQuery(sql)
        .then((rows: any[]) => {
          const opts = (rows || [])
            .map(stringFromRow)
            .filter((v): v is string => v !== null && v !== '')
            .map((v) => ({ label: v, value: v }));
          setCache((prev) => {
            const next = new Map(prev);
            next.set(cacheK, { loading: false, options: opts, error: null });
            return next;
          });
        })
        .catch((err) => {
          setCache((prev) => {
            const next = new Map(prev);
            next.set(cacheK, { loading: false, options: [], error: err?.message || String(err) });
            return next;
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      args.datasource,
      args.enabled,
      args.signal,
      args.database,
      args.lookback,
      args.serviceNames.join(','),
      args.environments.join(','),
    ]
  );

  useEffect(() => {
    setCache(new Map());
  }, [
    args.signal,
    args.database,
    args.lookback,
    args.serviceNames.join(','),
    args.environments.join(','),
    args.settings,
  ]);

  return { cache, fetchValues };
};
