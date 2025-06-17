import { CHDataSource } from '../datasource';
import { CustomFilterMap, CHDataSourceOptions } from '../../types/types';
import { DataSourceInstanceSettings } from '@grafana/data';

// Mock Grafana runtime dependencies
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(() => ({})),
  getTemplateSrv: jest.fn(() => ({})),
  DataSourceWithBackend: class MockDataSourceWithBackend {
    constructor(instanceSettings: any) {
      // Mock constructor
    }
  }
}));

// Mock backend modules
jest.mock('../backend_gopher.js', () => ({}));
jest.mock('../gopher_module', () => ({
  ClickHouseGopherJS: {
    getInstance: jest.fn().mockReturnValue({})
  }
}));

describe('Custom Filter Maps Integration Tests', () => {
  let datasource: CHDataSource;
  let mockMetricFindQuery: jest.Mock;

  const createDataSourceSettings = (jsonData: Partial<CHDataSourceOptions> = {}): DataSourceInstanceSettings<CHDataSourceOptions> => ({
    id: 1,
    uid: 'test-uid',
    name: 'Test ClickHouse',
    type: 'clickhouse',
    url: 'http://localhost:8123',
    basicAuth: '',
    withCredentials: false,
    isDefault: false,
    readOnly: false,
    access: 'proxy',
    meta: {
      id: 'clickhouse',
      name: 'ClickHouse',
      type: 'datasource' as any,
      baseUrl: '',
      info: { 
        version: '1.0.0',
        author: { name: 'Test' },
        description: 'Test',
        links: [],
        logos: { small: '', large: '' },
        screenshots: [],
        updated: ''
      },
      module: 'test'
    },
    jsonData: {
      defaultDatabase: 'test_db',
      ...jsonData
    }
  });

  beforeEach(() => {
    mockMetricFindQuery = jest.fn();
  });

  describe('Complete Custom Filter Maps Workflow', () => {
    it('should handle end-to-end custom filter maps configuration', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Task Priority',
          key: 'priority',
          values: [
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' }
          ],
          description: 'Priority level for tasks'
        },
        {
          id: 'status',
          label: 'Status',
          key: 'status',
          values: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]
        }
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps
      });

      datasource = new CHDataSource(settings);
      datasource.metricFindQuery = mockMetricFindQuery;

      // Test that datasource correctly initializes with custom filter maps
      expect(datasource.useCustomFilterMaps).toBe(true);
      expect(datasource.customFilterMaps).toEqual(customFilterMaps);
      expect(datasource.adHocFilter.useCustomFilterMaps).toBe(true);
      expect(datasource.adHocFilter.customFilterMaps).toEqual(customFilterMaps);

      // Test tag keys retrieval
      const tagKeys = await datasource.adHocFilter.GetTagKeys();
      expect(tagKeys).toEqual([
        { text: 'Task Priority', value: 'priority' },
        { text: 'Status', value: 'status' }
      ]);
      
      // Should not call metricFindQuery when using custom filter maps
      expect(mockMetricFindQuery).not.toHaveBeenCalled();

      // Test tag values retrieval for priority
      const priorityValues = await datasource.adHocFilter.GetTagValues({ key: 'priority' });
      expect(priorityValues).toEqual([
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
        { text: 'Low', value: 'low' }
      ]);

      // Test tag values retrieval for status
      const statusValues = await datasource.adHocFilter.GetTagValues({ key: 'status' });
      expect(statusValues).toEqual([
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }
      ]);

      // Should still not call metricFindQuery
      expect(mockMetricFindQuery).not.toHaveBeenCalled();
    });

    it('should fallback to auto-discovery when custom filter maps are disabled', async () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: false,
        customFilterMaps: [] // Empty custom filter maps
      });

      datasource = new CHDataSource(settings);
      datasource.metricFindQuery = mockMetricFindQuery;

      // Mock auto-discovery response
      mockMetricFindQuery.mockResolvedValue([
        { database: 'test_db', table: 'events', name: 'timestamp', type: 'DateTime' },
        { database: 'test_db', table: 'events', name: 'level', type: 'String' },
        { database: 'test_db', table: 'events', name: 'message', type: 'String' }
      ]);

      // Test that datasource correctly initializes without custom filter maps
      expect(datasource.useCustomFilterMaps).toBe(false);
      expect(datasource.customFilterMaps).toEqual([]);

      // Test tag keys retrieval falls back to auto-discovery
      const tagKeys = await datasource.adHocFilter.GetTagKeys();
      
      // Should call metricFindQuery for auto-discovery
      expect(mockMetricFindQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT database, table, name, type FROM system.columns')
      );
      
      // Should return processed column names
      expect(tagKeys).toContainEqual({ text: 'events.timestamp', value: 'events.timestamp' });
      expect(tagKeys).toContainEqual({ text: 'events.level', value: 'events.level' });
      expect(tagKeys).toContainEqual({ text: 'events.message', value: 'events.message' });
    });

    it('should handle mixed mode with fallback for unknown keys', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority',
          key: 'priority',
          values: [
            { label: 'High', value: 'high' },
            { label: 'Low', value: 'low' }
          ]
        }
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps,
        defaultDatabase: 'test_db'
      });

      datasource = new CHDataSource(settings);
      datasource.metricFindQuery = mockMetricFindQuery;

      // Mock fallback response for unknown keys
      mockMetricFindQuery.mockResolvedValue([
        { text: 'value1' },
        { text: 'value2' }
      ]);

      // Test known key (from custom filter maps)
      const priorityValues = await datasource.adHocFilter.GetTagValues({ key: 'priority' });
      expect(priorityValues).toEqual([
        { text: 'High', value: 'high' },
        { text: 'Low', value: 'low' }
      ]);
      expect(mockMetricFindQuery).not.toHaveBeenCalled();

      // Test unknown key (should fallback to auto-discovery)
      const unknownValues = await datasource.adHocFilter.GetTagValues({ key: 'events.unknown_field' });
      expect(mockMetricFindQuery).toHaveBeenCalled();
      expect(unknownValues).toEqual([
        { text: 'value1', value: 'value1' },
        { text: 'value2', value: 'value2' }
      ]);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed custom filter maps gracefully', async () => {
      const malformedCustomFilterMaps: any[] = [
        { id: 'valid', label: 'Valid', key: 'valid', values: [] },
        { id: 'missing-key', label: 'Missing Key', values: [] }, // Missing key
        null, // Null entry
        undefined, // Undefined entry
        { id: 'no-values', label: 'No Values', key: 'no_values' } // Missing values
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps: malformedCustomFilterMaps
      });

      datasource = new CHDataSource(settings);
      datasource.metricFindQuery = mockMetricFindQuery;

      // Should not throw errors
      expect(() => new CHDataSource(settings)).not.toThrow();

      // Should handle gracefully
      const tagKeys = await datasource.adHocFilter.GetTagKeys();
      expect(Array.isArray(tagKeys)).toBe(true);

      const tagValues = await datasource.adHocFilter.GetTagValues({ key: 'valid' });
      expect(Array.isArray(tagValues)).toBe(true);
    });
  });
});
