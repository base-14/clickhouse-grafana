# Custom Filter Maps

The ClickHouse Grafana datasource now supports **Custom Filter Maps** for ad-hoc filters, providing better performance and control over available filters compared to the default auto-discovery behavior.

## Overview

Custom Filter Maps allow you to define specific filter options instead of automatically discovering all available columns from your ClickHouse database. This is particularly useful for:

- **Performance**: Avoids expensive queries against `system.columns` on large databases
- **Control**: Limit filter options to relevant fields only
- **User Experience**: Provide meaningful labels and descriptions for filters
- **Security**: Prevent exposure of internal database structure

## Configuration

### Enabling Custom Filter Maps

1. Go to your ClickHouse datasource configuration
2. Scroll to the "Additional" section
3. Enable the "Use Custom Filter Maps" toggle
4. Configure your filter maps using the editor below

### Filter Map Structure

Each filter map consists of:

- **Label**: Display name shown to users
- **Field Key**: Database column name to filter on
- **Values**: List of available filter options
- **Description**: Optional explanation of the filter's purpose

### Example Configuration

```json
[
  {
    "id": "priority",
    "label": "Task Priority",
    "key": "priority",
    "values": [
      { "label": "Critical", "value": "critical" },
      { "label": "High", "value": "high" },
      { "label": "Medium", "value": "medium" },
      { "label": "Low", "value": "low" }
    ],
    "description": "Priority level for task management"
  },
  {
    "id": "environment",
    "label": "Environment",
    "key": "env",
    "values": [
      { "label": "Production", "value": "prod" },
      { "label": "Staging", "value": "staging" },
      { "label": "Development", "value": "dev" }
    ]
  }
]
```

## User Interface

### Adding Filter Maps

1. Click "Add Filter Map" to create a new filter
2. Fill in the required fields:
   - **Label**: User-friendly name
   - **Field Key**: Database column name
   - **Description**: Optional help text
3. Add filter values using the values editor

### Managing Filter Values

For each filter map, you can:
- Add multiple label/value pairs
- Use descriptive labels while keeping database values
- Remove individual values
- Reorder values as needed

### Import/Export

- **Export**: Save your filter maps configuration as JSON
- **Import**: Load previously saved configurations
- Useful for backup, sharing, or migrating between environments

## Database Integration

### Field Key Requirements

- Must match actual column names in your ClickHouse tables
- Should use valid identifier format (letters, numbers, underscores)
- Must be unique across all filter maps

### Value Mapping

- **Label**: What users see in the UI
- **Value**: Actual value sent to ClickHouse queries
- Values should match the data types and format in your database

### Example Database Schema

```sql
CREATE TABLE events (
    timestamp DateTime,
    priority Enum8('critical'=1, 'high'=2, 'medium'=3, 'low'=4),
    env String,
    message String,
    user_id UInt64
) ENGINE = MergeTree()
ORDER BY timestamp;
```

For this schema, appropriate filter maps would be:

```json
[
  {
    "id": "priority",
    "label": "Priority Level",
    "key": "priority",
    "values": [
      { "label": "Critical", "value": "critical" },
      { "label": "High", "value": "high" },
      { "label": "Medium", "value": "medium" },
      { "label": "Low", "value": "low" }
    ]
  },
  {
    "id": "environment",
    "label": "Environment",
    "key": "env",
    "values": [
      { "label": "Production", "value": "production" },
      { "label": "Staging", "value": "staging" },
      { "label": "Development", "value": "development" }
    ]
  }
]
```

## Performance Considerations

### Custom Maps vs Auto-Discovery

| Feature | Custom Maps | Auto-Discovery |
|---------|-------------|----------------|
| Setup Time | Requires initial configuration | Automatic |
| Query Performance | Fast (no system queries) | Slower (queries system.columns) |
| Database Load | Minimal | Higher on large databases |
| Filter Control | Full control | Shows all columns |
| User Experience | Curated options | All available fields |

### Recommendations

- Use custom filter maps for production environments with large databases
- Keep filter maps focused on frequently used fields
- Regularly review and update filter options based on usage patterns
- Consider the trade-off between setup time and runtime performance

## Migration Guide

### From Auto-Discovery to Custom Maps

1. **Identify Key Filters**: Determine which columns users actually filter on
2. **Enable Custom Maps**: Turn on the feature with empty configuration initially
3. **Add Maps Gradually**: Start with the most important filters
4. **Test Thoroughly**: Verify filters work as expected
5. **Disable Auto-Discovery**: Remove fallback once confident in custom maps

### Backup Current Configuration

Before enabling custom filter maps:
1. Document your current ad-hoc filter usage
2. Export datasource configuration
3. Test custom maps in a development environment

## Troubleshooting

### Common Issues

**Filter Not Appearing**
- Check field key matches database column name exactly
- Verify filter map is saved and datasource is updated
- Ensure values array is not empty

**Values Not Working**
- Confirm values match database data types
- Check for case sensitivity
- Verify quotes/escaping for string values

**Performance Issues**
- Reduce number of filter maps if too many
- Limit values per filter map (recommend <100)
- Consider pagination for large value lists

### Validation

The system validates:
- Required fields (label, key)
- Unique field keys across maps
- Valid identifier format for keys
- Array structure for values

### Fallback Behavior

When custom filter maps are enabled but empty, the system falls back to auto-discovery mode. This allows for gradual migration and testing.

## API Reference

### TypeScript Interfaces

```typescript
interface CustomFilterMap {
  id: string;
  label: string;
  key: string;
  values: CustomFilterValue[];
  description?: string;
}

interface CustomFilterValue {
  label: string;
  value: string;
}

interface CHDataSourceOptions {
  useCustomFilterMaps?: boolean;
  customFilterMaps?: CustomFilterMap[];
  // ... other options
}
```

### Methods

- `getTagKeys()`: Returns available filter keys
- `getTagValues(options)`: Returns values for specific filter key
- Custom maps are automatically used when enabled

## Best Practices

1. **Naming Conventions**
   - Use descriptive labels for user clarity
   - Keep field keys consistent with database schema
   - Include descriptions for complex filters

2. **Value Organization**
   - Order values logically (alphabetical, priority-based)
   - Use consistent formatting across similar filters
   - Consider grouping related values

3. **Maintenance**
   - Review filter usage analytics regularly
   - Update values when database schema changes
   - Remove unused filter maps to reduce complexity

4. **Testing**
   - Test all filter combinations in development
   - Verify performance improvements in production
   - Validate filter behavior with real queries

## Examples

### Log Analysis Dashboard

```json
[
  {
    "id": "log_level",
    "label": "Log Level",
    "key": "level",
    "values": [
      { "label": "Error", "value": "ERROR" },
      { "label": "Warning", "value": "WARN" },
      { "label": "Info", "value": "INFO" },
      { "label": "Debug", "value": "DEBUG" }
    ],
    "description": "Application log severity levels"
  },
  {
    "id": "service",
    "label": "Service",
    "key": "service_name",
    "values": [
      { "label": "API Gateway", "value": "api-gateway" },
      { "label": "User Service", "value": "user-service" },
      { "label": "Payment Service", "value": "payment-service" }
    ]
  }
]
```

### E-commerce Analytics

```json
[
  {
    "id": "product_category",
    "label": "Product Category",
    "key": "category",
    "values": [
      { "label": "Electronics", "value": "electronics" },
      { "label": "Clothing", "value": "clothing" },
      { "label": "Books", "value": "books" },
      { "label": "Home & Garden", "value": "home_garden" }
    ]
  },
  {
    "id": "order_status",
    "label": "Order Status",
    "key": "status",
    "values": [
      { "label": "Pending", "value": "pending" },
      { "label": "Processing", "value": "processing" },
      { "label": "Shipped", "value": "shipped" },
      { "label": "Delivered", "value": "delivered" },
      { "label": "Cancelled", "value": "cancelled" }
    ]
  }
]
```

## Support

For issues or questions related to Custom Filter Maps:

1. Check this documentation for common solutions
2. Review validation errors in the UI
3. Test with simplified configurations
4. Consult ClickHouse logs for query issues
5. Report bugs with specific configuration examples