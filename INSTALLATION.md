# base14 ClickHouse Datasource Installation Guide

## Overview

This guide explains how to install the base14 ClickHouse Datasource plugin for Grafana from our private GitHub releases.

## Prerequisites

- Grafana 10.0.3 or later
- ClickHouse database instance
- Administrative access to Grafana instance

## Installation Methods

### Method 1: Manual Installation (Recommended)

1. **Download the Plugin**
   ```bash
   # Replace VERSION with the desired version (e.g., v3.4.1)
   wget https://github.com/base-14/clickhouse-grafana/releases/download/VERSION/base14-clickhouse-datasource-VERSION.zip
   ```

2. **Extract to Grafana Plugins Directory**
   ```bash
   # For standard Grafana installation
   sudo unzip base14-clickhouse-datasource-VERSION.zip -d /var/lib/grafana/plugins/
   
   # For Docker installations, mount the plugins directory:
   # -v /path/to/plugins:/var/lib/grafana/plugins
   ```

3. **Set Permissions**
   ```bash
   sudo chown -R grafana:grafana /var/lib/grafana/plugins/base14-clickhouse-datasource
   ```

4. **Restart Grafana**
   ```bash
   # SystemD
   sudo systemctl restart grafana-server
   
   # Docker
   docker restart grafana
   ```

### Method 2: Docker with Plugin Pre-installed

Create a custom Grafana image:

```dockerfile
FROM grafana/grafana:latest

# Install base14 ClickHouse plugin
ADD https://github.com/base-14/clickhouse-grafana/releases/download/VERSION/base14-clickhouse-datasource-VERSION.zip /tmp/
RUN unzip /tmp/base14-clickhouse-datasource-VERSION.zip -d /var/lib/grafana/plugins/ && \
    rm /tmp/base14-clickhouse-datasource-VERSION.zip
```

## Configuration

### Add Data Source

1. Log in to Grafana as an administrator
2. Navigate to **Configuration → Data Sources**
3. Click **Add data source**
4. Select **base14 ClickHouse Datasource**
5. Configure connection settings:
   - **URL**: Your ClickHouse HTTP endpoint (e.g., `http://localhost:8123`)
   - **Database**: Default database name
   - **Authentication**: Basic auth, TLS certificates, or custom headers

### Basic Configuration

```yaml
# Example datasource configuration
url: http://clickhouse:8123
database: default
basicAuth: true
basicAuthUser: default
jsonData:
  addCorsHeader: true
  usePOST: true
  useCompression: true
  compressionType: gzip
```

## Verification

1. **Test Connection**: Click "Save & Test" in the datasource configuration
2. **Create Query**: Create a new dashboard and add a panel with a simple query:
   ```sql
   SELECT now() as time, 1 as value
   ```
3. **Check Plugin Version**: Go to **Configuration → Plugins** and verify the plugin is listed

## Troubleshooting

### Plugin Not Loading

1. **Check Grafana Logs**:
   ```bash
   sudo journalctl -u grafana-server -f
   ```

2. **Verify Plugin Files**:
   ```bash
   ls -la /var/lib/grafana/plugins/base14-clickhouse-datasource/
   ```

3. **Check Permissions**:
   ```bash
   sudo chown -R grafana:grafana /var/lib/grafana/plugins/
   ```

### Unsigned Plugin Warning

If you see "unsigned plugin" warnings:

1. **Configure Grafana** to allow unsigned plugins:
   ```ini
   [plugins]
   allow_loading_unsigned_plugins = base14-clickhouse-datasource
   ```

2. **Or via Environment Variable**:
   ```bash
   GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=base14-clickhouse-datasource
   ```

### Connection Issues

1. **Verify ClickHouse is accessible**:
   ```bash
   curl http://your-clickhouse:8123/ping
   ```

2. **Check network connectivity** from Grafana to ClickHouse
3. **Verify authentication credentials**
4. **Check ClickHouse logs** for connection attempts

## Updates

To update to a new version:

1. **Download new version** from GitHub releases
2. **Stop Grafana**
3. **Remove old plugin**:
   ```bash
   sudo rm -rf /var/lib/grafana/plugins/base14-clickhouse-datasource
   ```
4. **Install new version** following installation steps above
5. **Restart Grafana**

## Support

For technical support and issues:
- Check the [GitHub repository](https://github.com/base-14/clickhouse-grafana) for documentation
- Review existing issues and create new ones if needed
- Consult the [ClickHouse documentation](https://clickhouse.tech/docs/) for database-specific questions

## Advanced Configuration

### Custom Filter Maps

The plugin supports custom ad-hoc filter maps for improved performance with OpenTelemetry data:

```json
{
  "useCustomFilterMaps": true,
  "customFilterMaps": [
    {
      "id": "service",
      "label": "Service Name", 
      "key": "service.name",
      "values": [
        {"label": "Frontend", "value": "frontend"},
        {"label": "Backend", "value": "backend"}
      ]
    }
  ]
}
```

### Custom Queries

Configure custom ad-hoc filter queries:

```json
{
  "adHocKeysQuery": "SELECT DISTINCT arrayJoin(mapKeys(ResourceAttributes)) FROM otel_logs",
  "adHocValuesQuery": "SELECT DISTINCT ResourceAttributes['{key}'] FROM otel_logs WHERE has(mapKeys(ResourceAttributes), '{key}')"
}
```