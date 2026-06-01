import React, { useEffect, useMemo } from 'react';
import { Alert, InlineField, InlineFieldRow, InlineLabel, InlineSwitch, MultiSelect, RadioButtonGroup, Select } from '@grafana/ui';
import { SelectableValue, TimeRange } from '@grafana/data';
import {
  CHQuery,
  FilterCondition,
  FilterGroup,
  FilterNode,
  MetricKind,
  QueryBuilderSettings,
  SignalType,
} from '../../../../types/types';
import { buildSignalPresets, ENVIRONMENT_ALL, SIGNAL_NAME_ALL, SIGNAL_OPTIONS } from './presets';
import {
  buildEnvironmentQuery,
  buildMetricNameDiscoveryQuery,
  buildServiceNameQuery,
  buildSignalNameQuery,
  buildSummaryQuantilesQuery,
  signalNameColumn,
} from './discoveryQueries';
import { useMetricNameDiscovery } from './hooks/useMetricNameDiscovery';
import { useSummaryQuantilesDiscovery } from './hooks/useSummaryQuantilesDiscovery';
import { effectiveSignalNames } from './presets';
import { computeEffectiveLookbackSeconds, formatLookback, useDiscovery } from './hooks/useDiscovery';
import { useKeyDiscovery, useValueDiscovery } from './hooks/useFilterDiscovery';
import { BodySearchBar } from './filters/BodySearchBar';
import { FilterGroupView } from './filters/FilterGroupView';
import { OperationsSection } from './operations/OperationsSection';
import { GroupBySection } from './groupby/GroupBySection';
import { buildPanelSql } from './sql';
import { QueryBuilderGroupBy } from '../../../../types/types';
import { extraGroupByColumns } from './filters/columns';
import { DiscoveredKey } from './filters/resolveScope';
import {
  addChild,
  emptyRoot,
  ensureRoot,
  removeChild,
  toggleConnector,
  updateCondition,
} from './filters/tree';

type DatasourceForBuilder = {
  defaultDatabase?: string;
  queryBuilder: QueryBuilderSettings;
  metricFindQuery: (q: string) => Promise<any[]>;
};

type QueryBuilderProps = {
  query: CHQuery;
  datasource: DatasourceForBuilder;
  onChange: (query: CHQuery) => void;
  onRunQuery?: () => void;
  range?: TimeRange;
};

const toMulti = (values?: string[]): Array<SelectableValue<string>> =>
  (values ?? []).map((v) => ({ label: v, value: v }));

const fromMulti = (items: Array<SelectableValue<string>>): string[] =>
  items.map((i) => i.value).filter((v): v is string => !!v);

export const QueryBuilder = ({ query, datasource, onChange, range }: QueryBuilderProps) => {
  const defaultDatabase = datasource?.defaultDatabase || '';
  const settings = datasource.queryBuilder;

  const lookbackSeconds = useMemo(
    () => computeEffectiveLookbackSeconds(settings.maxTimerange, range),
    [settings.maxTimerange, range]
  );
  const lookback = formatLookback(lookbackSeconds);

  useEffect(() => {
    if (query.signalType && defaultDatabase && query.database !== defaultDatabase) {
      onChange({ ...query, database: defaultDatabase });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDatabase, query.signalType]);

  const onSignalChange = (item: SelectableValue<SignalType>) => {
    const signalType = item?.value;
    if (!signalType) {
      onChange({
        ...query,
        signalType: undefined,
        serviceNames: [],
        environments: [],
        signalNames: [],
        filters: emptyRoot(),
        bodySearch: '',
      });
      return;
    }

    const preset = buildSignalPresets(settings)[signalType];
    onChange({
      ...query,
      signalType,
      database: defaultDatabase || query.database,
      serviceNames: [],
      environments: [],
      signalNames: [],
      filters: emptyRoot(),
      bodySearch: '',
      ...(preset ?? {}),
    });
  };

  const onServiceNamesChange = (items: Array<SelectableValue<string>>) => {
    onChange({ ...query, serviceNames: fromMulti(items), environments: [], signalNames: [] });
  };

  const onEnvironmentsChange = (items: Array<SelectableValue<string>>) => {
    const picked = fromMulti(items);
    const prev = query.environments ?? [];
    const prevHadAll = prev.includes(ENVIRONMENT_ALL);
    const nowHasAll = picked.includes(ENVIRONMENT_ALL);
    let next = picked;
    if (nowHasAll && !prevHadAll) {
      next = [ENVIRONMENT_ALL];
    } else if (nowHasAll && picked.length > 1) {
      next = picked.filter((e) => e !== ENVIRONMENT_ALL);
    }
    onChange({ ...query, environments: next, signalNames: [] });
  };

  const onSignalNamesChange = (items: Array<SelectableValue<string>>) => {
    const picked = fromMulti(items);
    const prev = query.signalNames ?? [];
    const prevHadAll = prev.includes(SIGNAL_NAME_ALL);
    const nowHasAll = picked.includes(SIGNAL_NAME_ALL);
    let next = picked;
    if (nowHasAll && !prevHadAll) {
      next = [SIGNAL_NAME_ALL];
    } else if (nowHasAll && picked.length > 1) {
      next = picked.filter((n) => n !== SIGNAL_NAME_ALL);
    }
    onChange({ ...query, signalNames: next });
  };

  const selectedSignal = SIGNAL_OPTIONS.find((o) => o.value === query.signalType);
  const isMetrics = query.signalType === SignalType.Metrics;
  const isLogs = query.signalType === SignalType.Logs;
  const isTraces = query.signalType === SignalType.Traces;
  const logsMode: 'raw' | 'timeseries' = query.logsMode ?? 'raw';
  const isLogsTimeseries = isLogs && logsMode === 'timeseries';
  const autocomplete = settings.autocompleteEnabled;

  const discoveryReady = !!query.signalType && !!defaultDatabase && autocomplete;
  const discoveryDeps = query.signalType
    ? { signalType: query.signalType, database: defaultDatabase, settings, lookback }
    : null;

  const hasServices = (query.serviceNames?.length ?? 0) > 0;
  const hasEnvironments = (query.environments?.length ?? 0) > 0;
  const hasSignalNames = (query.signalNames?.length ?? 0) > 0;

  const serviceQuery = discoveryDeps ? buildServiceNameQuery(discoveryDeps) : null;
  const services = useDiscovery({
    datasource,
    query: discoveryReady ? serviceQuery : null,
    enabled: discoveryReady,
  });

  const envQuery =
    discoveryDeps && hasServices
      ? buildEnvironmentQuery({ ...discoveryDeps, serviceNames: query.serviceNames ?? [] })
      : null;
  const environments = useDiscovery({
    datasource,
    query: discoveryReady && hasServices ? envQuery : null,
    enabled: discoveryReady && hasServices,
  });

  const signalNameQuery =
    discoveryDeps && hasServices && hasEnvironments && !isMetrics
      ? buildSignalNameQuery({
          ...discoveryDeps,
          serviceNames: query.serviceNames ?? [],
          environments: query.environments ?? [],
        })
      : null;
  const signalNames = useDiscovery({
    datasource,
    query: discoveryReady && hasServices && hasEnvironments && !isMetrics ? signalNameQuery : null,
    enabled: discoveryReady && hasServices && hasEnvironments && !isMetrics,
  });

  const metricNameQuery =
    discoveryDeps && hasServices && hasEnvironments && isMetrics
      ? buildMetricNameDiscoveryQuery({
          ...discoveryDeps,
          serviceNames: query.serviceNames ?? [],
          environments: query.environments ?? [],
        })
      : null;
  const metricNames = useMetricNameDiscovery({
    datasource,
    query: discoveryReady && hasServices && hasEnvironments && isMetrics ? metricNameQuery : null,
    enabled: discoveryReady && hasServices && hasEnvironments && isMetrics,
  });

  const KIND_BY_TABLE: Record<string, MetricKind | undefined> = {
    [settings.metricsGaugeTable]: 'gauge',
    [settings.metricsSumTable]: 'sum',
    [settings.metricsHistogramTable]: 'histogram',
    [settings.metricsSummaryTable]: 'summary',
  };

  const pickedMetricEntries = (query.signalNames ?? [])
    .filter((n) => n !== SIGNAL_NAME_ALL)
    .map((n) => metricNames.entries.find((e) => e.name === n))
    .filter((e): e is { name: string; tables: string[] } => !!e);

  const availableKinds: MetricKind[] = (() => {
    if (pickedMetricEntries.length === 0) {
      return [];
    }
    let candidates: MetricKind[] | null = null;
    for (const entry of pickedMetricEntries) {
      const kinds = entry.tables
        .map((t) => KIND_BY_TABLE[t])
        .filter((k): k is MetricKind => !!k);
      if (candidates === null) {
        candidates = kinds;
      } else {
        candidates = candidates.filter((k) => kinds.includes(k));
      }
    }
    return candidates ?? [];
  })();

  const needsKindSelector = availableKinds.length > 1;
  const autoResolvedKind: MetricKind | null =
    availableKinds.length === 1 ? availableKinds[0] : null;

  const effectiveMetricKind: MetricKind = query.metricKind ?? autoResolvedKind ?? 'gauge';

  const firstMetricName = effectiveSignalNames(query.signalNames)[0];
  const summaryQuantilesQuery =
    isMetrics && effectiveMetricKind === 'summary' && firstMetricName && defaultDatabase
      ? buildSummaryQuantilesQuery({
          database: defaultDatabase,
          settings,
          lookback,
          metricName: firstMetricName,
        })
      : null;
  const summaryQuantiles = useSummaryQuantilesDiscovery({
    datasource,
    query: summaryQuantilesQuery,
    enabled: !!summaryQuantilesQuery && autocomplete,
  });

  const signalNameCol = query.signalType ? signalNameColumn(query.signalType) : null;

  const filtersGateOpen = !!query.signalType && hasServices && hasEnvironments && (isLogs || hasSignalNames);

  const filterDeps =
    discoveryDeps && filtersGateOpen
      ? {
          ...discoveryDeps,
          serviceNames: query.serviceNames ?? [],
          environments: query.environments ?? [],
        }
      : null;

  const keyDiscovery = useKeyDiscovery({
    datasource,
    enabled: discoveryReady && filtersGateOpen,
    deps: filterDeps,
  });

  const valueDiscovery = useValueDiscovery({
    datasource,
    enabled: discoveryReady && filtersGateOpen,
    signal: query.signalType ?? SignalType.Logs,
    database: defaultDatabase,
    settings,
    lookback,
    serviceNames: query.serviceNames ?? [],
    environments: query.environments ?? [],
  });

  const filtersRoot = ensureRoot(query.filters);

  const updateFilters = (next: FilterGroup) => {
    onChange({ ...query, filters: next });
  };

  const onAddChildToGroup = (groupId: string, child: FilterNode) => {
    updateFilters(addChild(filtersRoot, groupId, child));
  };

  const onRemoveChildById = (childId: string) => {
    updateFilters(removeChild(filtersRoot, childId));
  };

  const onUpdateConditionById = (conditionId: string, patch: Partial<FilterCondition>) => {
    updateFilters(updateCondition(filtersRoot, conditionId, patch));
  };

  const onToggleConnectorById = (groupId: string) => {
    updateFilters(toggleConnector(filtersRoot, groupId));
  };

  const onBodySearchCommit = (val: string, isRegex: boolean) => {
    onChange({ ...query, bodySearch: val, bodySearchIsRegex: isRegex });
  };

  const onBodySearchAddFilter = (cond: FilterCondition) => {
    updateFilters(addChild(filtersRoot, filtersRoot.id, cond));
  };

  const onGroupByChange = (next: QueryBuilderGroupBy[]) => {
    onChange({ ...query, groupBy: next });
  };

  const advancedOptions = !!query.advancedOptions;

  const generatedSql = useMemo(() => {
    if (!query.signalType || !defaultDatabase) {
      return null;
    }
    const base = isMetrics ? { ...query, metricKind: effectiveMetricKind } : query;
    const effectiveQuery = advancedOptions ? base : { ...base, operations: [] };
    return buildPanelSql({ query: effectiveQuery, database: defaultDatabase, settings });
  }, [query, defaultDatabase, settings, isMetrics, effectiveMetricKind, advancedOptions]);

  useEffect(() => {
    if (!generatedSql || !filtersGateOpen) {
      return;
    }
    if (query.query === generatedSql) {
      return;
    }
    onChange({ ...query, query: generatedSql });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedSql, filtersGateOpen]);

  return (
    <div className="gf-form" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
      {!defaultDatabase && (
        <Alert
          severity="warning"
          title="No default database set"
          elevated
          style={{ marginTop: '5px', marginBottom: '5px' }}
        >
          Set a default database in this datasource&apos;s settings — the Query Builder uses it as the
          tenant for all queries.
        </Alert>
      )}

      <InlineFieldRow>
        <InlineField
          label={
            <InlineLabel width={24}>
              <span style={{ color: '#6e9fff' }}>Signal type</span>
            </InlineLabel>
          }
        >
          <Select
            width={40}
            placeholder="Select signal"
            options={SIGNAL_OPTIONS}
            value={selectedSignal}
            onChange={onSignalChange}
            data-testid="signal-type-select"
          />
        </InlineField>
      </InlineFieldRow>

      {query.signalType && (
        <InlineFieldRow>
          <InlineField label={<InlineLabel width={24}>Service name</InlineLabel>} grow>
            <MultiSelect
              width={40}
              placeholder={services.loading ? 'Loading…' : 'Select services'}
              options={services.options}
              value={toMulti(query.serviceNames)}
              onChange={onServiceNamesChange}
              allowCustomValue
              isClearable
              data-testid="qb-service-name-select"
            />
          </InlineField>
        </InlineFieldRow>
      )}
      {services.error && (
        <Alert severity="error" title="Service discovery failed" elevated>
          {services.error}
        </Alert>
      )}

      {query.signalType && hasServices && (
        <InlineFieldRow>
          <InlineField label={<InlineLabel width={24}>Environment</InlineLabel>} grow>
            <MultiSelect
              width={40}
              placeholder={environments.loading ? 'Loading…' : `${settings.environmentKey}`}
              options={[{ label: 'All', value: ENVIRONMENT_ALL }, ...environments.options]}
              value={toMulti(query.environments).map((v) =>
                v.value === ENVIRONMENT_ALL ? { label: 'All', value: ENVIRONMENT_ALL } : v
              )}
              onChange={onEnvironmentsChange}
              allowCustomValue
              isClearable
              data-testid="qb-environment-select"
            />
          </InlineField>
        </InlineFieldRow>
      )}
      {environments.error && (
        <Alert severity="error" title="Environment discovery failed" elevated>
          {environments.error}
        </Alert>
      )}

      {query.signalType && !isLogs && !isMetrics && hasServices && hasEnvironments && (
        <InlineFieldRow>
          <InlineField label={<InlineLabel width={24}>{signalNameCol ?? 'Signal name'}</InlineLabel>} grow>
            <MultiSelect
              width={40}
              placeholder={signalNames.loading ? 'Loading…' : `Select ${signalNameCol ?? 'name'}`}
              options={[{ label: 'All', value: SIGNAL_NAME_ALL }, ...signalNames.options]}
              value={toMulti(query.signalNames).map((v) =>
                v.value === SIGNAL_NAME_ALL ? { label: 'All', value: SIGNAL_NAME_ALL } : v
              )}
              onChange={onSignalNamesChange}
              allowCustomValue
              isClearable
              data-testid="qb-signal-name-select"
            />
          </InlineField>
        </InlineFieldRow>
      )}
      {signalNames.error && (
        <Alert severity="error" title="Signal-name discovery failed" elevated>
          {signalNames.error}
        </Alert>
      )}

      {isMetrics && hasServices && hasEnvironments && (
        <InlineFieldRow>
          <InlineField label={<InlineLabel width={24}>MetricName</InlineLabel>} grow>
            <MultiSelect
              width={40}
              placeholder={metricNames.loading ? 'Loading…' : 'Select MetricName'}
              options={metricNames.entries.map((e) => ({
                label: e.name,
                value: e.name,
                description: e.tables.length > 1 ? e.tables.join(', ') : undefined,
              }))}
              value={toMulti(query.signalNames)}
              onChange={onSignalNamesChange}
              allowCustomValue
              isClearable
              data-testid="qb-metric-name-select"
            />
          </InlineField>
        </InlineFieldRow>
      )}
      {metricNames.error && (
        <Alert severity="error" title="Metric-name discovery failed" elevated>
          {metricNames.error}
        </Alert>
      )}

      {isLogs && filtersGateOpen && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              color: '#6e9fff',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Output
          </div>
          <RadioButtonGroup<'raw' | 'timeseries'>
            options={[
              { label: 'Raw logs', value: 'raw' },
              { label: 'Time series', value: 'timeseries' },
            ]}
            value={logsMode}
            onChange={(v) => onChange({ ...query, logsMode: v ?? 'raw' })}
            size="sm"
          />
        </div>
      )}

      {isMetrics && needsKindSelector && (
        <InlineFieldRow>
          <InlineField
            label={<InlineLabel width={24}>Use as</InlineLabel>}
            tooltip="The selected metric exists in more than one table. Pick which kind to query."
          >
            <RadioButtonGroup<MetricKind>
              options={availableKinds.map((k) => ({
                label:
                  k === 'gauge' ? 'Gauge' :
                  k === 'sum' ? 'Sum' :
                  k === 'histogram' ? 'Histogram' : 'Summary',
                value: k,
              }))}
              value={effectiveMetricKind}
              onChange={(v) => {
                if (!v || v === effectiveMetricKind) {
                  return;
                }
                onChange({
                  ...query,
                  metricKind: v,
                  operations: [],
                  groupBy: [],
                });
              }}
              size="sm"
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {filtersGateOpen && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              color: '#6e9fff',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Filters
          </div>
          {isLogs && (
            <BodySearchBar
              value={query.bodySearch ?? ''}
              isRegex={!!query.bodySearchIsRegex}
              signal={query.signalType!}
              discoveredKeys={keyDiscovery.keys.filter((k) => !(k.scope === 'column' && k.key === 'Body'))}
              onCommit={onBodySearchCommit}
              onAddFilter={onBodySearchAddFilter}
            />
          )}
          <FilterGroupView
            group={filtersRoot}
            isRoot
            signal={query.signalType!}
            discoveredKeys={isLogs ? keyDiscovery.keys.filter((k) => !(k.scope === 'column' && k.key === 'Body')) : keyDiscovery.keys}
            loadingKeys={keyDiscovery.loading}
            valueCache={valueDiscovery.cache}
            fetchValues={valueDiscovery.fetchValues}
            onToggleConnector={onToggleConnectorById}
            onAddChild={onAddChildToGroup}
            onRemoveChild={onRemoveChildById}
            onUpdateCondition={onUpdateConditionById}
            depth={1}
          />
          {keyDiscovery.error && (
            <Alert severity="error" title="Filter-key discovery failed" elevated>
              {keyDiscovery.error}
            </Alert>
          )}
        </div>
      )}

      {filtersGateOpen && (isTraces || isMetrics) && (
        <InlineFieldRow style={{ marginTop: 12 }}>
          <InlineField
            label={<InlineLabel width={24}>Advanced options</InlineLabel>}
            tooltip="Show the Aggregation picker so you can override the default aggregation."
          >
            <InlineSwitch
              value={advancedOptions}
              onChange={(e) => onChange({ ...query, advancedOptions: e.currentTarget.checked })}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {filtersGateOpen && advancedOptions && (isTraces || isMetrics) && (
        <div style={{ marginTop: 12 }}>
          <OperationsSection
            signal={query.signalType!}
            metricKind={isMetrics ? effectiveMetricKind : undefined}
            operations={query.operations ?? []}
            summaryQuantiles={summaryQuantiles.quantiles}
            onChange={(operations) => onChange({ ...query, operations })}
          />
        </div>
      )}

      {filtersGateOpen && (isTraces || isLogsTimeseries || isMetrics) && (
        <div style={{ marginTop: 12 }}>
          <GroupBySection
            signal={query.signalType!}
            groupBy={query.groupBy ?? []}
            discoveredKeys={(() => {
              const extras: DiscoveredKey[] = extraGroupByColumns(query.signalType!).map((c) => ({
                key: c.name,
                scope: 'column',
              }));
              const baseKeys = isLogs
                ? keyDiscovery.keys.filter((k) => !(k.scope === 'column' && k.key === 'Body'))
                : keyDiscovery.keys;
              const seen = new Set(baseKeys.map((k) => k.key));
              const merged = [...baseKeys];
              for (const e of extras) {
                if (!seen.has(e.key)) {
                  merged.push(e);
                }
              }
              return merged.sort((a, b) => a.key.localeCompare(b.key));
            })()}
            loadingKeys={keyDiscovery.loading}
            onChange={onGroupByChange}
          />
        </div>
      )}

      {!autocomplete && query.signalType && (
        <Alert severity="info" title="Autocomplete is disabled" elevated>
          Enable it in the datasource&apos;s Query Builder settings to populate the dropdowns. You can
          still type values manually.
        </Alert>
      )}

      {filtersGateOpen && isMetrics && (query.groupBy?.length ?? 0) === 0 && (
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>
          No dimensions selected — values are averaged across all attributes. Pick a Group By
          dimension (e.g. <code>ServiceName</code> or <code>host.name</code>) to split per series.
        </div>
      )}

    </div>
  );
};

export default QueryBuilder;
