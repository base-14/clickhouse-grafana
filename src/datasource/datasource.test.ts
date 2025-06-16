import { CHDataSource } from './datasource';
import { DataSourceInstanceSettings } from '@grafana/data';
import { CHDataSourceOptions, CustomFilterMap } from '../types/types';

// Mock the AdHocFilter class
jest.mock('./adhoc', () => {
  return jest.fn().mockImplementation((datasource) => ({
    datasource,
    useCustomFilterMaps: datasource.useCustomFilterMaps,
    customFilterMaps: datasource.customFilterMaps,
    GetTagKeys: jest.fn(),
    GetTagValues: jest.fn()
  }));
});

// Mock the backend gopher JS module
jest.mock('./backend_gopher.js', () => ({}));

// Mock ClickHouseGopherJS
jest.mock('./gopher_module', () => ({
  ClickHouseGopherJS: {
    getInstance: jest.fn().mockReturnValue({
      // Mock methods as needed
    })
  }
}));

// Mock Grafana runtime
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(() => ({})),
  getTemplateSrv: jest.fn(() => ({})),
  DataSourceWithBackend: class MockDataSourceWithBackend {
    constructor(instanceSettings: any) {
      // Mock constructor
    }
  }
}));

describe('CHDataSource Custom Filter Maps Integration', () => {
  const createDataSourceSettings = (jsonData: Partial<CHDataSourceOptions> = {}): DataSourceInstanceSettings<CHDataSourceOptions> => ({
    id: 1,
    uid: 'test-uid',
    name: 'Test ClickHouse',
    type: 'clickhouse',
    typeName: 'ClickHouse',
    url: 'http://localhost:8123',
    user: '',
    database: '',
    basicAuth: '',
    basicAuthUser: '',
    withCredentials: false,
    isDefault: false,
    readOnly: false,
    access: 'proxy',
    orgId: 1,
    typeLogoUrl: '',
    meta: {
      id: 'clickhouse',
      name: 'ClickHouse',
      type: 'datasource',
      info: { version: '1.0.0' },
      module: 'test'
    },
    jsonData: {
      defaultDatabase: 'test_db',
      ...jsonData
    }
  });

  describe('DataSource initialization with custom filter maps', () => {
    it('should initialize with useCustomFilterMaps property from jsonData', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.useCustomFilterMaps).toBe(true);
    });

    it('should initialize with useCustomFilterMaps defaulting to false', () => {
      const settings = createDataSourceSettings({});

      const dataSource = new CHDataSource(settings);

      expect(dataSource.useCustomFilterMaps).toBe(false);
    });

    it('should initialize with customFilterMaps property from jsonData', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority Level',
          key: 'priority',
          values: [
            { label: 'High', value: 'high' },
            { label: 'Low', value: 'low' }
          ]
        }
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.customFilterMaps).toEqual(customFilterMaps);
    });

    it('should initialize with empty customFilterMaps when not provided', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.customFilterMaps).toEqual([]);
    });

    it('should handle undefined jsonData gracefully', () => {
      const settings = createDataSourceSettings();
      // Remove jsonData to test undefined case
      settings.jsonData = undefined as any;

      expect(() => new CHDataSource(settings)).not.toThrow();
    });
  });

  describe('AdHocFilter integration', () => {
    it('should pass useCustomFilterMaps to AdHocFilter constructor', () => {
      const AdHocFilterMock = require('./adhoc');
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(AdHocFilterMock).toHaveBeenCalledWith(
        expect.objectContaining({
          useCustomFilterMaps: true
        })
      );
    });

    it('should pass customFilterMaps to AdHocFilter constructor', () => {
      const AdHocFilterMock = require('./adhoc');
      const customFilterMaps: CustomFilterMap[] = [
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

      const dataSource = new CHDataSource(settings);

      expect(AdHocFilterMock).toHaveBeenCalledWith(
        expect.objectContaining({
          customFilterMaps
        })
      );
    });

    it('should pass all required properties to AdHocFilter', () => {
      const AdHocFilterMock = require('./adhoc');
      const customFilterMaps: CustomFilterMap[] = [
        { id: 'test', label: 'Test', key: 'test', values: [] }
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps,
        defaultDatabase: 'custom_db',
        adHocValuesQuery: 'SELECT DISTINCT {field} FROM {table}',
        adHocHideTableNames: true
      });

      const dataSource = new CHDataSource(settings);

      expect(AdHocFilterMock).toHaveBeenCalledWith(
        expect.objectContaining({
          useCustomFilterMaps: true,
          customFilterMaps,
          defaultDatabase: 'custom_db',
          adHocValuesQuery: 'SELECT DISTINCT {field} FROM {table}',
          adHocHideTableNames: true
        })
      );
    });

    it('should initialize AdHocFilter with datasource instance', () => {
      const AdHocFilterMock = require('./adhoc');
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(AdHocFilterMock).toHaveBeenCalledWith(dataSource);
      expect(dataSource.adHocFilter).toBeDefined();
    });
  });

  describe('Property assignment and validation', () => {
    it('should assign useCustomFilterMaps property correctly', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.useCustomFilterMaps).toBe(true);
      expect(typeof dataSource.useCustomFilterMaps).toBe('boolean');
    });

    it('should assign customFilterMaps property correctly', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'category',
          label: 'Category',
          key: 'category',
          values: [
            { label: 'Electronics', value: 'electronics' },
            { label: 'Books', value: 'books' }
          ],
          description: 'Product category filter'
        }
      ];

      const settings = createDataSourceSettings({
        customFilterMaps
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.customFilterMaps).toEqual(customFilterMaps);
      expect(Array.isArray(dataSource.customFilterMaps)).toBe(true);
    });

    it('should handle malformed customFilterMaps gracefully', () => {
      const settings = createDataSourceSettings({
        customFilterMaps: [
          null,
          undefined,
          { id: 'valid', label: 'Valid', key: 'valid', values: [] },
          { invalid: 'object' }
        ] as any
      });

      expect(() => new CHDataSource(settings)).not.toThrow();
      
      const dataSource = new CHDataSource(settings);
      expect(Array.isArray(dataSource.customFilterMaps)).toBe(true);
    });
  });

  describe('Configuration persistence and consistency', () => {
    it('should maintain configuration consistency across initialization', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority',
          key: 'priority',
          values: [{ label: 'High', value: 'high' }]
        }
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps,
        defaultDatabase: 'test_db'
      });

      const dataSource = new CHDataSource(settings);

      // Should maintain all properties consistently
      expect(dataSource.useCustomFilterMaps).toBe(true);
      expect(dataSource.customFilterMaps).toEqual(customFilterMaps);
      expect(dataSource.defaultDatabase).toBe('test_db');
    });

    it('should handle empty configuration gracefully', () => {
      const settings = createDataSourceSettings({});

      const dataSource = new CHDataSource(settings);

      expect(dataSource.useCustomFilterMaps).toBe(false);
      expect(dataSource.customFilterMaps).toEqual([]);
    });

    it('should preserve other datasource properties', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps: [{ id: 'test', label: 'Test', key: 'test', values: [] }],
        usePOST: true,
        useCompression: true,
        compressionType: 'gzip'
      });

      const dataSource = new CHDataSource(settings);

      // Should preserve existing properties
      expect(dataSource.usePOST).toBe(true);
      expect(dataSource.useCompression).toBe(true);
      expect(dataSource.compressionType).toBe('gzip');
      
      // Should have new properties
      expect(dataSource.useCustomFilterMaps).toBe(true);
      expect(dataSource.customFilterMaps).toHaveLength(1);
    });
  });

  describe('Integration with getTagKeys method', () => {
    it('should make getTagKeys available on AdHocFilter instance', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.adHocFilter).toBeDefined();
      expect(dataSource.adHocFilter.GetTagKeys).toBeDefined();
      expect(typeof dataSource.adHocFilter.GetTagKeys).toBe('function');
    });

    it('should make getTagValues available on AdHocFilter instance', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.adHocFilter).toBeDefined();
      expect(dataSource.adHocFilter.GetTagValues).toBeDefined();
      expect(typeof dataSource.adHocFilter.GetTagValues).toBe('function');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle null customFilterMaps', () => {
      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps: null as any
      });

      expect(() => new CHDataSource(settings)).not.toThrow();
      
      const dataSource = new CHDataSource(settings);
      expect(dataSource.customFilterMaps).toEqual([]);
    });

    it('should handle undefined useCustomFilterMaps', () => {
      const settings = createDataSourceSettings({
        customFilterMaps: [{ id: 'test', label: 'Test', key: 'test', values: [] }]
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.useCustomFilterMaps).toBe(false);
      expect(dataSource.customFilterMaps).toHaveLength(1);
    });

    it('should handle complex custom filter maps configuration', () => {
      const complexFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Task Priority',
          key: 'priority',
          values: [
            { label: 'Critical', value: 'critical' },
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
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
          ]
        }
      ];

      const settings = createDataSourceSettings({
        useCustomFilterMaps: true,
        customFilterMaps: complexFilterMaps
      });

      const dataSource = new CHDataSource(settings);

      expect(dataSource.customFilterMaps).toEqual(complexFilterMaps);
      expect(dataSource.customFilterMaps).toHaveLength(2);
      expect(dataSource.customFilterMaps[0].values).toHaveLength(4);
      expect(dataSource.customFilterMaps[1].values).toHaveLength(3);
    });
  });
});