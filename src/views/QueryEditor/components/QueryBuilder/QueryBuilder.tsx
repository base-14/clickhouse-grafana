import React, { useEffect, useMemo } from 'react';
import { Alert, InlineField, InlineFieldRow, InlineLabel, MultiSelect, Select } from '@grafana/ui';
import { SelectableValue, TimeRange } from '@grafana/data';
import { CHQuery, QueryBuilderSettings, SignalType } from '../../../../types/types';
import { buildSignalPresets, SIGNAL_OPTIONS } from './presets';
import {
  buildEnvironmentQuery,
  buildServiceNameQuery,
  buildSignalNameQuery,
  signalNameColumn,
} from './discoveryQueries';
import { computeEffectiveLookbackSeconds, formatLookback, useDiscovery } from './hooks/useDiscovery';

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
      ...(preset ?? {}),
    });
  };

  const onServiceNamesChange = (items: Array<SelectableValue<string>>) => {
    onChange({ ...query, serviceNames: fromMulti(items), environments: [], signalNames: [] });
  };

  const onEnvironmentsChange = (items: Array<SelectableValue<string>>) => {
    onChange({ ...query, environments: fromMulti(items), signalNames: [] });
  };

  const onSignalNamesChange = (items: Array<SelectableValue<string>>) => {
    onChange({ ...query, signalNames: fromMulti(items) });
  };

  const selectedSignal = SIGNAL_OPTIONS.find((o) => o.value === query.signalType);
  const isMetrics = query.signalType === SignalType.Metrics;
  const isLogs = query.signalType === SignalType.Logs;
  const autocomplete = settings.autocompleteEnabled;

  const discoveryReady = !!query.signalType && !!defaultDatabase && autocomplete;
  const discoveryDeps = query.signalType
    ? { signalType: query.signalType, database: defaultDatabase, settings, lookback }
    : null;

  const hasServices = (query.serviceNames?.length ?? 0) > 0;
  const hasEnvironments = (query.environments?.length ?? 0) > 0;

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
    discoveryDeps && hasServices && hasEnvironments
      ? buildSignalNameQuery({
          ...discoveryDeps,
          serviceNames: query.serviceNames ?? [],
          environments: query.environments ?? [],
        })
      : null;
  const signalNames = useDiscovery({
    datasource,
    query: discoveryReady && hasServices && hasEnvironments ? signalNameQuery : null,
    enabled: discoveryReady && hasServices && hasEnvironments && !!signalNameQuery,
  });

  const signalNameCol = query.signalType ? signalNameColumn(query.signalType) : null;

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
              options={environments.options}
              value={toMulti(query.environments)}
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

      {query.signalType && !isLogs && hasServices && hasEnvironments && (
        <InlineFieldRow>
          <InlineField label={<InlineLabel width={24}>{signalNameCol ?? 'Signal name'}</InlineLabel>} grow>
            <MultiSelect
              width={40}
              placeholder={signalNames.loading ? 'Loading…' : `Select ${signalNameCol ?? 'name'}`}
              options={signalNames.options}
              value={toMulti(query.signalNames)}
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

      {!autocomplete && query.signalType && (
        <Alert severity="info" title="Autocomplete is disabled" elevated>
          Enable it in the datasource&apos;s Query Builder settings to populate the dropdowns. You can
          still type values manually.
        </Alert>
      )}

      {isMetrics && (
        <Alert severity="info" title="Metrics table is chosen per-MetricName" elevated>
          The MetricName picker scans all four metric tables (sum / gauge / histogram / summary).
          The final query template will pick the right table based on the selected metric — coming
          in a follow-up.
        </Alert>
      )}
    </div>
  );
};

export default QueryBuilder;
