import React, { FormEvent, useEffect, useState } from 'react';
import { CodeEditor, DataSourceHttpSettings, InlineField, InlineSwitch, Input, SecretInput, Select } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps, onUpdateDatasourceJsonDataOption, SelectableValue } from '@grafana/data';
import { CHDataSourceOptions } from '../../types/types';
import _ from 'lodash';
import { DefaultValues } from './FormParts/DefaultValues/DefaultValues';
import { LANGUAGE_ID } from '../QueryEditor/components/QueryTextEditor/editor/initiateEditor';
import { MONACO_EDITOR_OPTIONS } from '../constants';
import { COMPRESSION_TYPE_OPTIONS } from './constants';
import { DEFAULT_VALUES_QUERY, DEFAULT_KEYS_QUERY, DEFAULT_ADHOC_VALUES_QUERY } from '../../datasource/adhoc';

export interface CHSecureJsonData {
  password?: string;
  xHeaderKey?: string;
}

interface Props extends DataSourcePluginOptionsEditorProps<CHDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const newOptions = _.cloneDeep(options);
  const { secureJsonFields } = newOptions;
  const jsonData = newOptions.jsonData || {};
  const secureJsonData = (options.secureJsonData || {}) as CHSecureJsonData;
  const [selectedCompressionType, setSelectedCompressionType] = useState(jsonData.compressionType);
  const [adHocValuesQuery, setAdHocValuesQuery] = useState(
    jsonData.adHocValuesQuery || (jsonData.useCustomFilterMaps ? DEFAULT_ADHOC_VALUES_QUERY : DEFAULT_VALUES_QUERY)
  );
  const [adHocKeysQuery, setAdHocKeysQuery] = useState(jsonData.adHocKeysQuery || DEFAULT_KEYS_QUERY);

  useEffect(() => {
    jsonData.adHocValuesQuery = adHocValuesQuery;

    onOptionsChange({
      ...newOptions,
      jsonData: { ...jsonData },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adHocValuesQuery]);

  useEffect(() => {
    jsonData.adHocKeysQuery = adHocKeysQuery;

    onOptionsChange({
      ...newOptions,
      jsonData: { ...jsonData },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adHocKeysQuery]);


  // @todo remove when merged https://github.com/grafana/grafana/pull/80858
  if (newOptions.url !== '') {
    jsonData.dataSourceUrl = newOptions.url;
  }
  const onSwitchToggle = (
    key: keyof Pick<
      CHDataSourceOptions,
      'useYandexCloudAuthorization' | 'addCorsHeader' | 'usePOST' | 'useCompression' | 'xClickHouseSSLCertificateAuth' | 'adHocHideTableNames' | 'useCustomFilterMaps'
    >,
    value: boolean
  ) => {
    onOptionsChange({
      ...newOptions,
      jsonData: { ...jsonData, [key]: value },
    });
  };

  // @todo remove it when https://github.com/grafana/grafana/pull/80858 merged
  const onDataHttpSettingsChange = (event: any) => {
    const newOptions = _.cloneDeep(event);
    newOptions.jsonData.dataSourceUrl = newOptions.url;
    onOptionsChange({
      ...newOptions,
    });
  };

  const onResetXHeaderKey = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: { ...secureJsonFields, xHeaderKey: false },
      secureJsonData: { ...secureJsonData, xHeaderKey: '' },
    });
  };

  const onChangeXHeaderKey = (event: FormEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonFields: { ...secureJsonFields },
      secureJsonData: { ...secureJsonData, xHeaderKey: event.currentTarget.value },
    });
  };

  const onCompressionTypeChange = (compressionType: SelectableValue) => {
    setSelectedCompressionType(compressionType.value);
    jsonData.compressionType = compressionType.value;
    onOptionsChange({
      ...options,
      jsonData: { ...jsonData },
    });
  };

  const onFieldChange = (column: SelectableValue, fieldName) => {
    jsonData[fieldName] = column.value;
    onOptionsChange({ ...options, jsonData: { ...jsonData } });
  };

  return (
    <>
      <DataSourceHttpSettings
        data-test-id="http-settings"
        defaultUrl="http://localhost:8123"
        dataSourceConfig={options}
        showAccessOptions={true}
        showForwardOAuthIdentityOption={true}
        onChange={onDataHttpSettingsChange}
      />
      <div className="gf-form-group">
        <InlineField
          label="Use Yandex.Cloud authorization headers"
          tooltip="Use authorization headers for managed Yandex.Cloud ClickHouse database, will work only for proxy access method"
          labelWidth={36}
        >
          <InlineSwitch
            data-test-id="use-yandex-cloud-authorization-switch"
            id="useYandexCloudAuthorization"
            value={jsonData.useYandexCloudAuthorization || false}
            onChange={(e) => onSwitchToggle('useYandexCloudAuthorization', e.currentTarget.checked)}
          />
        </InlineField>
        {jsonData.useYandexCloudAuthorization && (
          <>
            <InlineField label="X-ClickHouse-User" labelWidth={36}>
              <Input
                id="xHeaderUser"
                data-test-id="x-header-user-input"
                onChange={onUpdateDatasourceJsonDataOption(props, 'xHeaderUser')}
                value={jsonData.xHeaderUser || ''}
                placeholder="DB user name"
              />
            </InlineField>
            <InlineField label={'X-ClickHouse-Key'} labelWidth={36}>
              <SecretInput
                data-test-id="x-header-key-input"
                isConfigured={!!secureJsonFields?.['xHeaderKey']}
                value={secureJsonData['xHeaderKey'] || ''}
                placeholder={`DB user password`}
                onReset={onResetXHeaderKey}
                onChange={onChangeXHeaderKey}
              />
            </InlineField>
            <InlineField
              label="X-ClickHouse-SSL-Certificate-Auth"
              labelWidth={36}
              tooltip="Requires non empty X-ClickHouse-User and TLS/SSL client key and client cert, doesn't work with basic authorization"
            >
              <InlineSwitch
                data-test-id="x-clickhouse-ssl-certificate-auth"
                id="xClickHouseSSLCertificateAuth"
                value={jsonData.xClickHouseSSLCertificateAuth || false}
                onChange={(e) => onSwitchToggle('xClickHouseSSLCertificateAuth', e.currentTarget.checked)}
              />
            </InlineField>
          </>
        )}
      </div>
      <DefaultValues
        jsonData={jsonData}
        newOptions={newOptions}
        onSwitchToggle={onSwitchToggle}
        onFieldChange={onFieldChange}
      />
      <h3 className="page-heading">Additional</h3>
      <div className="gf-form-group">
        <InlineField
          label="Add CORS flag to requests"
          labelWidth={32}
          tooltip="Whether 'add_http_cors_header=1' parameter should be attached to requests. Remember that read-only users cannot override this setting."
        >
          <InlineSwitch
            id="addCorsHeader"
            data-test-id="add-cors-header-switch"
            value={jsonData.addCorsHeader || false}
            onChange={(e) => onSwitchToggle('addCorsHeader', e.currentTarget.checked)}
          />
        </InlineField>
        <InlineField
          label="Use POST method to send queries"
          labelWidth={32}
          tooltip="Remember that it's possible to change data via POST requests. Better to avoid using POST method if you connecting not as Read-Only user."
        >
          <InlineSwitch
            data-test-id="use-post-method-switch"
            id="usePOST"
            value={jsonData.usePOST || false}
            onChange={(e) => onSwitchToggle('usePOST', e.currentTarget.checked)}
          />
        </InlineField>
        <InlineField
          label="Default database"
          labelWidth={32}
          tooltip="If you set the default database for this datasource, it will be prefilled in the query builder, and used to make ad-hoc filters more convenient."
        >
          <Input
            data-test-id="default-database-input"
            value={jsonData.defaultDatabase || 'default'}
            placeholder="default"
            onChange={onUpdateDatasourceJsonDataOption(props, 'defaultDatabase')}
          />
        </InlineField>
        <InlineField label="Use Compression" labelWidth={32} tooltip="Add `Accept-Encoding` header in each request.">
          <InlineSwitch
            data-test-id="use-compression-switch"
            id="useCompressions"
            value={jsonData.useCompression || false}
            onChange={(e) => onSwitchToggle('useCompression', e.currentTarget.checked)}
          />
        </InlineField>
        <InlineField
          label="Compressions type"
          labelWidth={32}
          tooltip="read https://clickhouse.com/docs/en/interfaces/http#compression for details"
        >
          <Select
            data-test-id="compression-type-select"
            id="compressionType"
            allowCustomValue={false}
            width={24}
            value={selectedCompressionType}
            onChange={({ value }) => onCompressionTypeChange({ value })}
            options={COMPRESSION_TYPE_OPTIONS}
          />
        </InlineField>
        <InlineField 
          label="Use maps instead of columns" 
          labelWidth={32}
          tooltip="Enable custom filter maps instead of auto-discovering all database columns. This improves performance and provides better control over available filters."
        >
          <InlineSwitch
            data-test-id="use-custom-filter-maps"
            id="useCustomFilterMaps"
            value={jsonData.useCustomFilterMaps || false}
            onChange={(e) => onSwitchToggle('useCustomFilterMaps', e.currentTarget.checked)}
          />
        </InlineField>
        {jsonData.useCustomFilterMaps ? (
          <>
            <InlineField
              label="Configure Adhoc Keys Request"
              labelWidth={32}
              tooltip="To be able to configure request properly please use macros {field} {database} {table}"
            >
              <div style={{ position: 'relative', minWidth: '600px' }}>
                <CodeEditor
                  height={Math.max((jsonData.adHocKeysQuery || '').split('\n').length * 18, 150)}
                  value={adHocKeysQuery}
                  language={LANGUAGE_ID}
                  monacoOptions={MONACO_EDITOR_OPTIONS}
                  onChange={setAdHocKeysQuery}
                />
              </div>
            </InlineField>
            <InlineField
              label="Configure Adhoc Values Request"
              labelWidth={32}
              tooltip="To be able to configure request properly please use macros {field} {database} {table}"
            >
              <div style={{ position: 'relative', minWidth: '600px' }}>
                <CodeEditor
                  height={Math.max((jsonData.adHocValuesQuery || '').split('\n').length * 18, 150)}
                  value={adHocValuesQuery}
                  language={LANGUAGE_ID}
                  monacoOptions={MONACO_EDITOR_OPTIONS}
                  onChange={setAdHocValuesQuery}
                />
              </div>
            </InlineField>
          </>
        ) : (
          <InlineField
            label="Configure Adhoc Filters Request"
            labelWidth={32}
            tooltip="To be able to configure request properly please use macros {field} {database} {table}"
          >
            <div style={{ position: 'relative', minWidth: '600px' }}>
              <CodeEditor
                height={Math.max((jsonData.adHocValuesQuery || DEFAULT_VALUES_QUERY).split('\n').length * 18, 150)}
                value={adHocValuesQuery}
                language={LANGUAGE_ID}
                monacoOptions={MONACO_EDITOR_OPTIONS}
                onChange={setAdHocValuesQuery}
              />
            </div>
          </InlineField>
        )}
        {!jsonData.useCustomFilterMaps && (
          <InlineField label="Hide table names in adhoc filters" labelWidth={32} tooltip="Applicable if you want adhoc with short filed names">
            <InlineSwitch
              data-test-id="adhoc-hide-table-names"
              id="adhoc"
              value={jsonData.adHocHideTableNames || false}
              onChange={(e) => onSwitchToggle('adHocHideTableNames', e.currentTarget.checked)}
            />
          </InlineField>
        )}
      </div>
    </>
  );
}
