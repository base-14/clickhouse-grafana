import AdHocFilter from './adhoc';
import { CustomFilterMap } from '../types/types';

describe('AdHocFilter with Custom Filter Maps', () => {
  let mockDatasource: any;
  let adHocFilter: AdHocFilter;

  beforeEach(() => {
    mockDatasource = {
      defaultDatabase: '',
      adHocHideTableNames: false,
      adHocValuesQuery: '',
      adHocKeysQuery: '',
      useCustomFilterMaps: false,
      customFilterMaps: [],
      metricFindQuery: jest.fn()
    };
  });

  describe('Constructor', () => {
    it('should initialize with custom filter maps when provided', () => {
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

      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = customFilterMaps;

      adHocFilter = new AdHocFilter(mockDatasource);

      expect(adHocFilter.customFilterMaps).toEqual(customFilterMaps);
      expect(adHocFilter.useCustomFilterMaps).toBe(true);
    });

    it('should initialize with empty custom filter maps when not provided', () => {
      adHocFilter = new AdHocFilter(mockDatasource);

      expect(adHocFilter.customFilterMaps).toEqual([]);
      expect(adHocFilter.useCustomFilterMaps).toBe(false);
    });
  });

  describe('getCustomTagKeys', () => {
    it('should return tag keys from custom filter maps', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority Level',
          key: 'priority',
          values: []
        },
        {
          id: 'status',
          label: 'Status',
          key: 'status',
          values: []
        }
      ];

      mockDatasource.customFilterMaps = customFilterMaps;
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.getCustomTagKeys();

      expect(result).toEqual([
        { text: 'Priority Level', value: 'priority' },
        { text: 'Status', value: 'status' }
      ]);
    });

    it('should return empty array when no custom filter maps exist', async () => {
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.getCustomTagKeys();

      expect(result).toEqual([]);
    });

    it('should handle custom filter maps with descriptions', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'category',
          label: 'Category',
          key: 'category',
          values: [],
          description: 'Filter by item category'
        }
      ];

      mockDatasource.customFilterMaps = customFilterMaps;
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.getCustomTagKeys();

      expect(result).toEqual([
        { text: 'Category', value: 'category' }
      ]);
    });
  });

  describe('getCustomTagValues', () => {
    it('should return values for a valid custom filter map', async () => {
      const customFilterMap: CustomFilterMap = {
        id: 'priority',
        label: 'Priority',
        key: 'priority',
        values: [
          { label: 'High Priority', value: 'high' },
          { label: 'Medium Priority', value: 'medium' },
          { label: 'Low Priority', value: 'low' }
        ]
      };

      mockDatasource.customFilterMaps = [customFilterMap];
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.getCustomTagValues(customFilterMap);

      expect(result).toEqual([
        { text: 'High Priority', value: 'high' },
        { text: 'Medium Priority', value: 'medium' },
        { text: 'Low Priority', value: 'low' }
      ]);
    });

    it('should return empty array for custom filter map with no values', async () => {
      const customFilterMap: CustomFilterMap = {
        id: 'empty',
        label: 'Empty Filter',
        key: 'empty',
        values: []
      };

      mockDatasource.customFilterMaps = [customFilterMap];
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.getCustomTagValues(customFilterMap);

      expect(result).toEqual([]);
    });

    it('should handle special characters in filter values', async () => {
      const customFilterMap: CustomFilterMap = {
        id: 'special',
        label: 'Special',
        key: 'special',
        values: [
          { label: 'Special & Characters', value: 'special&chars' },
          { label: 'Unicode: 测试', value: 'unicode_test' }
        ]
      };

      mockDatasource.customFilterMaps = [customFilterMap];
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.getCustomTagValues(customFilterMap);

      expect(result).toEqual([
        { text: 'Special & Characters', value: 'special&chars' },
        { text: 'Unicode: 测试', value: 'unicode_test' }
      ]);
    });
  });

  describe('GetTagKeys with custom filter maps', () => {
    it('should return custom tag keys when useCustomFilterMaps is enabled', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority',
          key: 'priority',
          values: [{ label: 'High', value: 'high' }]
        }
      ];

      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = customFilterMaps;
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagKeys();

      expect(result).toEqual([
        { text: 'Priority', value: 'priority' }
      ]);
      expect(mockDatasource.metricFindQuery).not.toHaveBeenCalled();
    });

    it('should fallback to auto-discovery when custom filter maps are disabled', async () => {
      mockDatasource.useCustomFilterMaps = false;
      mockDatasource.metricFindQuery.mockResolvedValue([
        { database: 'test_db', table: 'test_table', name: 'column1', type: 'String' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagKeys();

      expect(mockDatasource.metricFindQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT database, table, name, type FROM system.columns')
      );
      expect(result).toContainEqual({ text: 'column1', value: 'column1' });
    });

    it('should fallback to auto-discovery when custom filter maps are empty', async () => {
      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = [];
      mockDatasource.metricFindQuery.mockResolvedValue([
        { database: 'test_db', table: 'test_table', name: 'column1', type: 'String' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagKeys();

      expect(mockDatasource.metricFindQuery).toHaveBeenCalled();
      expect(result).toContainEqual({ text: 'column1', value: 'column1' });
    });
  });

  describe('GetTagValues with custom filter maps', () => {
    it('should return custom tag values when key matches custom filter map', async () => {
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

      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = customFilterMaps;
      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagValues({ key: 'priority' });

      expect(result).toEqual([
        { text: 'High', value: 'high' },
        { text: 'Low', value: 'low' }
      ]);
      expect(mockDatasource.metricFindQuery).not.toHaveBeenCalled();
    });

    it('should fallback to auto-discovery when key does not match custom filter map', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority',
          key: 'priority',
          values: [{ label: 'High', value: 'high' }]
        }
      ];

      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = customFilterMaps;
      mockDatasource.defaultDatabase = 'test_db';
      mockDatasource.metricFindQuery.mockResolvedValue([
        { text: 'value1' },
        { text: 'value2' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagValues({ key: 'table.unknown_field' });

      expect(mockDatasource.metricFindQuery).toHaveBeenCalled();
      expect(result).toEqual([
        { text: 'value1', value: 'value1' },
        { text: 'value2', value: 'value2' }
      ]);
    });

    it('should fallback to auto-discovery when custom filter maps are disabled', async () => {
      mockDatasource.useCustomFilterMaps = false;
      mockDatasource.defaultDatabase = 'test_db';
      mockDatasource.metricFindQuery.mockResolvedValue([
        { text: 'auto_value1' },
        { text: 'auto_value2' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagValues({ key: 'table.field' });

      expect(mockDatasource.metricFindQuery).toHaveBeenCalled();
      expect(result).toEqual([
        { text: 'auto_value1', value: 'auto_value1' },
        { text: 'auto_value2', value: 'auto_value2' }
      ]);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed custom filter maps gracefully', async () => {
      // Simulate malformed custom filter maps
      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = [
        { id: 'invalid', label: 'Invalid' }, // missing key and values
        null, // null entry
        undefined // undefined entry
      ];

      adHocFilter = new AdHocFilter(mockDatasource);

      const tagKeysResult = await adHocFilter.GetTagKeys();
      expect(tagKeysResult).toBeDefined();
      expect(Array.isArray(tagKeysResult)).toBe(true);

      const tagValuesResult = await adHocFilter.GetTagValues({ key: 'invalid' });
      expect(tagValuesResult).toBeDefined();
      expect(Array.isArray(tagValuesResult)).toBe(true);
    });

    it('should handle custom filter maps without values array', async () => {
      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = [
        {
          id: 'no-values',
          label: 'No Values',
          key: 'no_values'
          // missing values array
        }
      ];

      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagValues({ key: 'no_values' });
      expect(result).toEqual([]);
    });
  });

  describe('Caching behavior with custom filter maps', () => {
    it('should not cache custom filter map values between different instances', async () => {
      const customFilterMap: CustomFilterMap = {
        id: 'test',
        label: 'Test',
        key: 'test',
        values: [{ label: 'Value1', value: 'value1' }]
      };

      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = [customFilterMap];

      const adHocFilter1 = new AdHocFilter(mockDatasource);
      const adHocFilter2 = new AdHocFilter(mockDatasource);

      const result1 = await adHocFilter1.GetTagValues({ key: 'test' });
      const result2 = await adHocFilter2.GetTagValues({ key: 'test' });

      expect(result1).toEqual(result2);
      expect(result1).toEqual([{ text: 'Value1', value: 'value1' }]);
    });
  });

  describe('Custom AdHoc Keys Query', () => {
    it('should use adHocKeysQuery instead of default columnsQuery when provided', async () => {
      const customKeysQuery = 'SELECT DISTINCT name as key FROM custom_table ORDER BY key LIMIT 50';
      
      mockDatasource.useCustomFilterMaps = false; // Not using custom filter maps
      mockDatasource.customFilterMaps = [];
      mockDatasource.adHocKeysQuery = customKeysQuery;
      mockDatasource.metricFindQuery.mockResolvedValue([
        { key: 'custom_key1' },
        { key: 'custom_key2' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      await adHocFilter.GetTagKeys();

      // Should call metricFindQuery with the custom keys query, not the default columns query
      expect(mockDatasource.metricFindQuery).toHaveBeenCalledWith(customKeysQuery);
      expect(mockDatasource.metricFindQuery).not.toHaveBeenCalledWith(
        expect.stringContaining('SELECT database, table, name, type FROM system.columns')
      );
    });

    it('should fall back to default columnsQuery when adHocKeysQuery is empty', async () => {
      mockDatasource.useCustomFilterMaps = false;
      mockDatasource.customFilterMaps = [];
      mockDatasource.adHocKeysQuery = ''; // Empty custom keys query
      mockDatasource.metricFindQuery.mockResolvedValue([
        { database: 'test_db', table: 'test_table', name: 'column1', type: 'String' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      await adHocFilter.GetTagKeys();

      // Should use default columns query when custom keys query is empty
      expect(mockDatasource.metricFindQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT database, table, name, type FROM system.columns')
      );
    });

    it('should prioritize custom filter maps over adHocKeysQuery', async () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority',
          key: 'priority',
          values: [{ label: 'High', value: 'high' }]
        }
      ];
      
      mockDatasource.useCustomFilterMaps = true;
      mockDatasource.customFilterMaps = customFilterMaps;
      mockDatasource.adHocKeysQuery = 'SELECT name as key FROM custom_table';

      adHocFilter = new AdHocFilter(mockDatasource);

      const result = await adHocFilter.GetTagKeys();

      // Should use custom filter maps and not call metricFindQuery at all
      expect(result).toEqual([{ text: 'Priority', value: 'priority' }]);
      expect(mockDatasource.metricFindQuery).not.toHaveBeenCalled();
    });
  });

  describe('Custom AdHoc Values Query with {key} placeholder', () => {
    it('should use custom values query with {key} placeholder when provided', async () => {
      const customValuesQuery = "SELECT DISTINCT ResourceAttributes['{key}'] as value FROM otel_logs WHERE has(mapKeys(ResourceAttributes), '{key}') LIMIT 50";
      
      mockDatasource.useCustomFilterMaps = false;
      mockDatasource.customFilterMaps = [];
      mockDatasource.adHocValuesQuery = customValuesQuery;
      mockDatasource.metricFindQuery.mockResolvedValue([
        { text: 'value1' },
        { text: 'value2' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      await adHocFilter.GetTagValues({ key: 'service.name' });

      // Should call metricFindQuery with the custom values query with key substituted
      const expectedQuery = "SELECT DISTINCT ResourceAttributes['service.name'] as value FROM otel_logs WHERE has(mapKeys(ResourceAttributes), 'service.name') LIMIT 50";
      expect(mockDatasource.metricFindQuery).toHaveBeenCalledWith(expectedQuery);
    });

    it('should fall back to traditional format when custom values query does not contain {key}', async () => {
      const traditionalValuesQuery = 'SELECT DISTINCT {field} FROM {database}.{table} LIMIT 50';
      
      mockDatasource.useCustomFilterMaps = false;
      mockDatasource.customFilterMaps = [];
      mockDatasource.adHocValuesQuery = traditionalValuesQuery;
      mockDatasource.defaultDatabase = 'test_db';
      mockDatasource.metricFindQuery.mockResolvedValue([
        { text: 'value1' },
        { text: 'value2' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      await adHocFilter.GetTagValues({ key: 'table.field' });

      // Should use traditional database.table.field format
      const expectedQuery = 'SELECT DISTINCT field FROM test_db.table LIMIT 50';
      expect(mockDatasource.metricFindQuery).toHaveBeenCalledWith(expectedQuery);
    });

    it('should cache values query results', async () => {
      const customValuesQuery = "SELECT DISTINCT ResourceAttributes['{key}'] as value FROM otel_logs LIMIT 10";
      
      mockDatasource.useCustomFilterMaps = false;
      mockDatasource.customFilterMaps = [];
      mockDatasource.adHocValuesQuery = customValuesQuery;
      mockDatasource.metricFindQuery.mockResolvedValue([
        { text: 'cached_value' }
      ]);

      adHocFilter = new AdHocFilter(mockDatasource);

      // First call
      const result1 = await adHocFilter.GetTagValues({ key: 'test.key' });
      // Second call should use cache
      const result2 = await adHocFilter.GetTagValues({ key: 'test.key' });

      // Should only call metricFindQuery once (first time)
      expect(mockDatasource.metricFindQuery).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
      expect(result1).toEqual([{ text: 'cached_value', value: 'cached_value' }]);
    });
  });
});
