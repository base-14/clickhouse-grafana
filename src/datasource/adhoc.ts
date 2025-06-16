import { CustomFilterMap, CustomFilterValue } from '../types/types';

export const DEFAULT_VALUES_QUERY = 'SELECT DISTINCT {field} AS value FROM {database}.{table} LIMIT 300';
export default class AdHocFilter {
  tagKeys: any[];
  tagValues: { [key: string]: any } = {};
  datasource: any;
  query: string;
  adHocValuesQuery: string;
  customFilterMaps: CustomFilterMap[];
  useCustomFilterMaps: boolean;

  constructor(datasource: any) {
    const queryFilter = "database NOT IN ('system','INFORMATION_SCHEMA','information_schema')";
    const columnsQuery =
      'SELECT database, table, name, type FROM system.columns WHERE {filter} ORDER BY database, table';

    this.tagKeys = [];
    this.tagValues = [];
    this.datasource = datasource;
    this.adHocValuesQuery = datasource.adHocValuesQuery;
    this.useCustomFilterMaps = datasource.useCustomFilterMaps || false;
    this.customFilterMaps = datasource.customFilterMaps || [];
    let filter = queryFilter;
    if (datasource.defaultDatabase.length > 0) {
      filter = "database = '" + datasource.defaultDatabase + "'";
    }
    this.query = columnsQuery.replace('{filter}', filter);
  }

  /**
   * Returns tag keys from custom filter maps
   * @returns Promise<any[]> Array of tag key objects with text and value properties
   */
  private getCustomTagKeys(): Promise<any[]> {
    try {
      const tagKeys = this.customFilterMaps
        .filter((map) => map && map.id && map.label && map.key) // Filter out malformed maps
        .map((map) => ({
          text: map.label,
          value: map.key
        }));
      
      return Promise.resolve(tagKeys);
    } catch (error) {
      console.error('Error processing custom filter maps:', error);
      return Promise.resolve([]);
    }
  }

  /**
   * Returns tag values for a specific custom filter map
   * @param filterMap The custom filter map to get values from
   * @returns Promise<any[]> Array of tag value objects with text and value properties
   */
  private getCustomTagValues(filterMap: CustomFilterMap): Promise<any[]> {
    try {
      if (!filterMap || !filterMap.values || !Array.isArray(filterMap.values)) {
        return Promise.resolve([]);
      }

      const tagValues = filterMap.values.map((value: CustomFilterValue) => ({
        text: value.label,
        value: value.value
      }));

      return Promise.resolve(tagValues);
    } catch (error) {
      console.error('Error processing custom filter map values:', error);
      return Promise.resolve([]);
    }
  }

  // GetTagKeys fetches columns from CH tables according to provided filters
  // if no filters applied all tables from all databases will be fetched
  // if datasource setting `defaultDatabase` is set only tables from that database will be fetched
  // if query param passed it will be performed instead of default
  // If custom filter maps are enabled and available, returns custom tag keys instead
  GetTagKeys(query?: string) {
    let self = this;
    
    // Check for custom filter maps first
    if (this.useCustomFilterMaps && this.customFilterMaps.length > 0) {
      return this.getCustomTagKeys().then(function (customTagKeys) {
        self.tagKeys = customTagKeys;
        return customTagKeys;
      });
    }
    
    // Fallback to auto-discovery
    if (this.tagKeys.length > 0) {
      return Promise.resolve(this.tagKeys);
    }
    let q = this.query;
    if (query && query.length > 0) {
      q = query;
    }
    return this.datasource.metricFindQuery(q).then(function (response: any) {
      return self.processTagKeysResponse(response);
    });
  }

  processTagKeysResponse(response: any): Promise<any[]> {
    const columnNames: { [key: string]: boolean } = {};

    response.forEach((item: any) => {
      const databasePrefix = this.datasource.defaultDatabase.length === 0 ? item.database + '.' : '';
      const text: string = databasePrefix + item.table + '.' + item.name;

      if (!this.datasource.adHocHideTableNames) {
        this.tagKeys.push({ text: text, value: text });
      }
      if (item.type.slice(0, 4) === 'Enum') {
        const regexEnum = /'(?:[^']+|'')+'/gim;
        const enumValues = item.type.match(regexEnum) || [];

        if (enumValues.length > 0) {
          if (!this.datasource.adHocHideTableNames) {
            this.tagValues[text] = enumValues.map((o: any) => ({ text: o, value: o }));
          }
          if (!this.tagValues[item.name]) {
            this.tagValues[item.name] = this.tagValues[text];
          } else {
            this.tagValues[item.name].combine(this.tagValues[text]);
          }
        }
      }
      columnNames[item.name] = true;
    });

    // Store unique column names without table name
    Object.keys(columnNames).forEach((columnName) => {
      this.tagKeys.push({ text: columnName, value: columnName });
    });

    return Promise.resolve(this.tagKeys);
  }

  // GetTagValues returns column values according to passed options
  // Values for fields with Enum type were already fetched in GetTagKeys func and stored in `tagValues`
  // Values for fields which not represented on `tagValues` get from ClickHouse and cached on `tagValues`
  // If custom filter maps are enabled, checks for matching custom filter map first
  async GetTagValues(options) {
    // Check for custom filter maps first
    if (this.useCustomFilterMaps && this.customFilterMaps.length > 0) {
      const customMap = this.customFilterMaps.find((map) => map && map.key === options.key);
      if (customMap) {
        return this.getCustomTagValues(customMap);
      }
    }
    // Determine which query to use initially
    const initialQuery = this.adHocValuesQuery || DEFAULT_VALUES_QUERY;
    // Function to build the query
    let database: string, table: string, field: string;
    const buildQuery = (queryTemplate: string) =>
      queryTemplate.replace('{field}', field).replace('{database}', database).replace('{table}', table);

    if (this.datasource.adHocHideTableNames) {
      // @todo could be very slow
      const allTablesColumnSQL = "SELECT name,database,table FROM system.columns WHERE name='" + options.key + "'";
      let allValuesSQL: string[] = [];
      let isGetAllValuesOK: boolean = await this.datasource
        .metricFindQuery(allTablesColumnSQL)
        .then((response: any) => {
          allValuesSQL = response.map((item: any) => {
            field = item.name;
            database = item.database;
            table = item.table;
            return buildQuery("(" + initialQuery + ")");
          });
          return true;
        })
        .catch((error: any) => {
          console.error(error);
          return false;
        });

      if (!isGetAllValuesOK) {
        return [];
      }
      return this.datasource
        .metricFindQuery(allValuesSQL.join(" UNION ALL "))
        .then((response: any) => {
          // Process and cache the response
          this.tagValues[options.key] = this.processTagValuesResponse(response);
          return this.tagValues[options.key];
        })
        .catch((error: any) => {
          this.tagValues[options.key] = [];
          console.error(error);
          return this.tagValues[options.key];
        });
    }

    // If the tag values are already cached, return them immediately
    if (Object.prototype.hasOwnProperty.call(this.tagValues, options.key)) {
      return Promise.resolve(this.tagValues[options.key]);
    }
    // Split the key to extract database, table, and field
    const keyItems = options.key.split('.');
    if (keyItems.length < 2 || (keyItems.length === 2 && !this.datasource.defaultDatabase) || keyItems.length > 3) {
      return Promise.resolve([]);
    }

    // Destructure key items based on their length
    if (keyItems.length === 3) {
      [database, table, field] = keyItems;
    } else {
      database = this.datasource.defaultDatabase;
      [table, field] = keyItems;
    }


    // Execute the initial query
    return this.datasource
      .metricFindQuery(buildQuery(initialQuery))
      .then((response: any) => {
        // Process and cache the response
        this.tagValues[options.key] = this.processTagValuesResponse(response);
        return this.tagValues[options.key];
      })
      .catch((error: any) => {
        this.tagValues[options.key] = [];
        console.error(error);
        return this.tagValues[options.key];
      });
  }

  processTagValuesResponse(response: any) {
    const tagValues = response.map((item: any) => ({ text: item.text, value: item.text }));
    return Promise.resolve(tagValues);
  }
}
