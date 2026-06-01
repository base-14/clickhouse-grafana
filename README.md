# Base14 ClickHouse datasource for Grafana

Plugin ID: `base14-clickhouse-datasource`

A Base14 fork of the [Altinity ClickHouse Grafana datasource](https://github.com/Altinity/clickhouse-grafana) with a built-in OpenTelemetry-aware Query Builder that targets the standard OTel ClickHouse schema (`otel_logs`, `otel_traces`, `otel_metrics_*`).

The plugin is unsigned. Allow it in your Grafana instance:

```bash
export GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=base14-clickhouse-datasource
```

or in `grafana.ini`:

```ini
[plugins]
allow_loading_unsigned_plugins = base14-clickhouse-datasource
```

## Local development

```bash
npm ci
npm run dev                                            # webpack watch
docker compose run --rm backend_builder                # build Go binaries into dist/
GRAFANA_IMAGE=grafana/grafana docker compose up -d --no-deps grafana
# → http://localhost:3000 (admin / admin)
```

See `CLAUDE.md` for the full architecture overview.

## License

MIT — inherited from upstream.
