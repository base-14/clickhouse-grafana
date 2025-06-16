import { CustomFilterMap, CustomFilterValue, CHDataSourceOptions } from './types';

describe('CustomFilterValue interface', () => {
  it('should allow creating a valid CustomFilterValue object', () => {
    const customFilterValue: CustomFilterValue = {
      label: 'High Priority',
      value: 'high'
    };

    expect(customFilterValue.label).toBe('High Priority');
    expect(customFilterValue.value).toBe('high');
  });

  it('should require label and value properties', () => {
    // This test ensures TypeScript compilation will fail if required properties are missing
    const createInvalidValue = () => {
      // @ts-expect-error - testing that label is required
      const invalidValue: CustomFilterValue = {
        value: 'test'
      };
      return invalidValue;
    };

    expect(createInvalidValue).toBeDefined();
  });
});

describe('CustomFilterMap interface', () => {
  it('should allow creating a valid CustomFilterMap object with all properties', () => {
    const customFilterMap: CustomFilterMap = {
      id: 'priority-filter',
      label: 'Priority Level',
      key: 'priority',
      values: [
        { label: 'High Priority', value: 'high' },
        { label: 'Medium Priority', value: 'medium' },
        { label: 'Low Priority', value: 'low' }
      ],
      description: 'Filter by task priority level'
    };

    expect(customFilterMap.id).toBe('priority-filter');
    expect(customFilterMap.label).toBe('Priority Level');
    expect(customFilterMap.key).toBe('priority');
    expect(customFilterMap.values).toHaveLength(3);
    expect(customFilterMap.description).toBe('Filter by task priority level');
  });

  it('should allow creating a CustomFilterMap without optional description', () => {
    const customFilterMap: CustomFilterMap = {
      id: 'status-filter',
      label: 'Status',
      key: 'status',
      values: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    };

    expect(customFilterMap.description).toBeUndefined();
    expect(customFilterMap.values).toHaveLength(2);
  });

  it('should require id, label, key, and values properties', () => {
    // This test ensures TypeScript compilation will fail if required properties are missing
    const createInvalidMap = () => {
      // @ts-expect-error - testing that required properties are enforced
      const invalidMap: CustomFilterMap = {
        id: 'test',
        label: 'Test'
        // missing key and values
      };
      return invalidMap;
    };

    expect(createInvalidMap).toBeDefined();
  });

  it('should allow empty values array', () => {
    const customFilterMap: CustomFilterMap = {
      id: 'empty-filter',
      label: 'Empty Filter',
      key: 'empty',
      values: []
    };

    expect(customFilterMap.values).toHaveLength(0);
  });
});

describe('CHDataSourceOptions interface extensions', () => {
  it('should allow CHDataSourceOptions with custom filter maps properties', () => {
    const dataSourceOptions: CHDataSourceOptions = {
      useCustomFilterMaps: true,
      customFilterMaps: [
        {
          id: 'test-filter',
          label: 'Test Filter',
          key: 'test',
          values: [
            { label: 'Option 1', value: 'opt1' },
            { label: 'Option 2', value: 'opt2' }
          ]
        }
      ]
    };

    expect(dataSourceOptions.useCustomFilterMaps).toBe(true);
    expect(dataSourceOptions.customFilterMaps).toHaveLength(1);
    expect(dataSourceOptions.customFilterMaps![0].id).toBe('test-filter');
  });

  it('should allow CHDataSourceOptions without custom filter maps properties', () => {
    const dataSourceOptions: CHDataSourceOptions = {
      defaultDatabase: 'test_db'
    };

    expect(dataSourceOptions.useCustomFilterMaps).toBeUndefined();
    expect(dataSourceOptions.customFilterMaps).toBeUndefined();
  });

  it('should allow useCustomFilterMaps without customFilterMaps array', () => {
    const dataSourceOptions: CHDataSourceOptions = {
      useCustomFilterMaps: false
    };

    expect(dataSourceOptions.useCustomFilterMaps).toBe(false);
    expect(dataSourceOptions.customFilterMaps).toBeUndefined();
  });
});

describe('Type validation and edge cases', () => {
  it('should handle CustomFilterMap with special characters in values', () => {
    const customFilterMap: CustomFilterMap = {
      id: 'special-chars',
      label: 'Special Characters',
      key: 'special',
      values: [
        { label: 'Special & Characters', value: 'special&chars' },
        { label: 'Unicode: 测试', value: 'unicode_test' },
        { label: 'Numbers: 123', value: '123' }
      ]
    };

    expect(customFilterMap.values[0].label).toBe('Special & Characters');
    expect(customFilterMap.values[1].label).toBe('Unicode: 测试');
    expect(customFilterMap.values[2].value).toBe('123');
  });

  it('should handle long description strings', () => {
    const longDescription = 'This is a very long description that might be used to explain complex filtering logic and should be handled properly by the interface definition without any issues or truncation';
    
    const customFilterMap: CustomFilterMap = {
      id: 'long-desc',
      label: 'Long Description Filter',
      key: 'long_desc',
      values: [],
      description: longDescription
    };

    expect(customFilterMap.description).toBe(longDescription);
  });
});