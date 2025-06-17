# base14 ClickHouse Datasource v1.0.0 Release Notes

## 🎉 First Official Release

This is the inaugural release of the **base14 ClickHouse Datasource**, a professionally maintained and enhanced version of the ClickHouse Grafana plugin for enterprise and production use.

## 📝 Attribution

This project is derivative work based on the excellent foundation laid by:
- **Vertamedia** (2017-2020) - Original creators of the ClickHouse Grafana plugin
- **Altinity** (2020-2025) - Maintainers who brought the plugin to production maturity

We extend our sincere gratitude to both organizations for their pioneering work in connecting ClickHouse to Grafana. This project builds upon their solid foundation while adding enterprise-focused enhancements.

## 🆕 New Features (base14 Enhancements)

### Custom Ad-hoc Filter Maps
- **Predefined Filter Options**: Configure custom filter maps in datasource settings for consistent, fast filtering
- **OpenTelemetry Support**: Built-in support for map-based columns like `ResourceAttributes`
- **Performance Optimization**: Eliminates slow `system.columns` queries for large databases
- **User Experience**: Provides curated filter options instead of auto-discovery

Example configuration:
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

### Custom Ad-hoc Queries
- **Custom Keys Query**: Replace default `system.columns` with custom discovery queries
- **Custom Values Query**: Support for complex value extraction with `{key}` placeholder
- **Map Column Support**: Native support for ClickHouse Map columns and OpenTelemetry data

Example queries:
```sql
-- Custom keys discovery
SELECT DISTINCT arrayJoin(mapKeys(ResourceAttributes)) FROM otel_logs

-- Custom values with placeholder  
SELECT DISTINCT ResourceAttributes['{key}'] FROM otel_logs 
WHERE has(mapKeys(ResourceAttributes), '{key}')
```

### Enterprise Branding
- **base14 Branding**: Professional branding with base14 logos and styling
- **Private Distribution**: Signed plugin for secure enterprise deployment
- **Custom Installation**: Streamlined installation process via GitHub releases

## 🔧 All Features Inherited from Altinity v3.4.1

This release includes all production-ready features from the Altinity plugin:

### Core Functionality
- **Multiple Visualizations**: Time series, tables, logs, flamegraphs, traces
- **Query Builder**: Visual query construction with ClickHouse-specific features
- **Raw SQL Editor**: Full SQL editor with syntax highlighting and auto-completion
- **Template Variables**: Support for Grafana template variables and conditional logic
- **Annotations**: Query-based annotations for dashboard events

### ClickHouse Integration
- **Advanced Macros**: `$timeFilter`, `$timeSeries`, `$columns`, `$rate`, `$perSecond`, etc.
- **Compression Support**: gzip, zstd, brotli compression formats
- **Authentication**: Basic auth, TLS certificates, X-ClickHouse headers
- **Multiple Formats**: Support for various ClickHouse data types and formats

### Alerting & Monitoring
- **Unified Alerts**: Full support for Grafana's unified alerting system
- **Legacy Alerts**: Backward compatibility with legacy alerting
- **Performance Optimization**: Efficient query execution and caching

### Developer Features
- **TypeScript Frontend**: Modern React-based UI built with TypeScript
- **Go Backend**: High-performance Go backend service
- **Comprehensive Testing**: Jest tests, E2E tests, and integration testing

## 🔧 Technical Improvements

### Build & Distribution
- **Signed Plugin**: Grafana-signed plugin for enterprise security
- **GitHub Releases**: Automated release process via GitHub Actions
- **Docker Support**: Full Docker development and deployment support
- **Multi-platform**: Support for Linux, macOS, and Windows

### Performance Enhancements
- **GopherJS Integration**: Browser-side SQL processing for improved performance
- **Optimized Queries**: Smart query optimization and caching
- **Connection Pooling**: Efficient ClickHouse connection management

## 📦 Installation

### Download
```bash
wget https://github.com/base-14/clickhouse-grafana/releases/download/v1.0.0/base14-clickhouse-datasource-v1.0.0.zip
```

### Manual Installation
```bash
sudo unzip base14-clickhouse-datasource-v1.0.0.zip -d /var/lib/grafana/plugins/
sudo chown -R grafana:grafana /var/lib/grafana/plugins/base14-clickhouse-datasource
sudo systemctl restart grafana-server
```

### Docker Installation
```dockerfile
FROM grafana/grafana:latest
ADD https://github.com/base-14/clickhouse-grafana/releases/download/v1.0.0/base14-clickhouse-datasource-v1.0.0.zip /tmp/
RUN unzip /tmp/base14-clickhouse-datasource-v1.0.0.zip -d /var/lib/grafana/plugins/
```

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## 🔄 Migration from Altinity Plugin

### Backup Existing Configuration
```bash
# Backup existing dashboards and datasources
grafana-cli admin export-dashboard
```

### Update Configuration
1. Remove old Altinity plugin
2. Install base14 plugin
3. Update datasource type to `base14-clickhouse-datasource`
4. Test all dashboards and queries

## 🛠️ Configuration

### Basic Datasource Setup
- **URL**: Your ClickHouse HTTP endpoint
- **Database**: Default database name  
- **Authentication**: Basic auth, TLS, or custom headers
- **Compression**: gzip, zstd, or brotli support

### Advanced Configuration
- **Custom Filter Maps**: Enterprise ad-hoc filtering
- **Custom Queries**: OpenTelemetry and map column support
- **Connection Tuning**: Timeout, retry, and pooling settings

## 📋 Requirements

- **Grafana**: 10.0.3 or later
- **ClickHouse**: Any supported version
- **Permissions**: Administrative access to Grafana instance

## 🐛 Known Issues

None at time of release. Please report issues at: https://github.com/base-14/clickhouse-grafana/issues

## 🔮 Roadmap

- Enhanced OpenTelemetry visualizations
- Advanced performance optimizations  
- Additional enterprise security features
- Extended Map and JSON type support

## 🤝 Support

- **Documentation**: [GitHub Repository](https://github.com/base-14/clickhouse-grafana)
- **Issues**: [GitHub Issues](https://github.com/base-14/clickhouse-grafana/issues)
- **Installation Guide**: [INSTALLATION.md](INSTALLATION.md)

## 📄 License

MIT License - Free for commercial and private use. See [LICENSE](LICENSE) for details.

---

**base14 ClickHouse Datasource v1.0.0** - Building on excellence, delivering enterprise-ready ClickHouse integration for Grafana.