import { useEffect, useState } from 'react';
import { rangeUtil, SelectableValue, TimeRange } from '@grafana/data';

const DEFAULT_LOOKBACK_FALLBACK_MS = 5 * 60 * 1000;

const parseDurationMs = (raw: string | undefined, fallbackMs: number): number => {
  if (!raw) {
    return fallbackMs;
  }
  try {
    return rangeUtil.intervalToMs(raw);
  } catch {
    return fallbackMs;
  }
};

export const computeEffectiveLookbackSeconds = (
  pluginSetting: string,
  dashboardRange?: TimeRange
): number => {
  const settingMs = parseDurationMs(pluginSetting, DEFAULT_LOOKBACK_FALLBACK_MS);
  if (!dashboardRange) {
    return Math.max(1, Math.floor(settingMs / 1000));
  }
  const fromMs = dashboardRange.from.valueOf();
  const toMs = dashboardRange.to.valueOf();
  const rangeMs = Math.max(0, toMs - fromMs);
  const effectiveMs = Math.min(settingMs, rangeMs || settingMs);
  return Math.max(1, Math.floor(effectiveMs / 1000));
};

export const formatLookback = (seconds: number): string => `${seconds} SECOND`;

type UseDiscoveryArgs = {
  datasource: { metricFindQuery: (q: string) => Promise<any[]> };
  query: string | null;
  enabled: boolean;
};

export type DiscoveryResult = {
  loading: boolean;
  error: string | null;
  options: Array<SelectableValue<string>>;
};

export const useDiscovery = ({ datasource, query, enabled }: UseDiscoveryArgs): DiscoveryResult => {
  const [state, setState] = useState<DiscoveryResult>({ loading: false, error: null, options: [] });

  useEffect(() => {
    if (!enabled || !query) {
      setState({ loading: false, error: null, options: [] });
      return;
    }

    let cancelled = false;
    setState({ loading: true, error: null, options: [] });

    datasource
      .metricFindQuery(query)
      .then((rows: any[]) => {
        if (cancelled) {
          return;
        }
        const opts = (rows || [])
          .map((r) => {
            if (r == null) {
              return null;
            }
            if (typeof r === 'string') {
              return r;
            }
            if (typeof r === 'object') {
              const firstKey = Object.keys(r)[0];
              const v = firstKey ? r[firstKey] : null;
              return v == null ? null : String(v);
            }
            return String(r);
          })
          .filter((v): v is string => v !== null && v !== '')
          .map((v) => ({ label: v, value: v }));
        setState({ loading: false, error: null, options: opts });
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setState({
          loading: false,
          error: err?.message || String(err),
          options: [],
        });
      });

    return () => {
      cancelled = true;
    };
  }, [datasource, query, enabled]);

  return state;
};
