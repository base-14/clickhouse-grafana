goal: build a query builder

For Claude: no comments in codebase should be written

clickhouse schema:
CREATE TABLE IF NOT EXISTS otel_logs ON CLUSTER "ch-01" (
	Timestamp DateTime64(9) CODEC(Delta(8), ZSTD(1)),
	TimestampTime DateTime DEFAULT toDateTime(Timestamp),
	TraceId String CODEC(ZSTD(1)),
	SpanId String CODEC(ZSTD(1)),
	TraceFlags UInt8,
	SeverityText LowCardinality(String) CODEC(ZSTD(1)),
	SeverityNumber UInt8,
	ServiceName LowCardinality(String) CODEC(ZSTD(1)),
	Body String CODEC(ZSTD(1)),
	ResourceSchemaUrl LowCardinality(String) CODEC(ZSTD(1)),
	ResourceAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
	ScopeSchemaUrl LowCardinality(String) CODEC(ZSTD(1)),
	ScopeName String CODEC(ZSTD(1)),
	ScopeVersion LowCardinality(String) CODEC(ZSTD(1)),
	ScopeAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
	LogAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),

	INDEX idx_trace_id TraceId TYPE bloom_filter(0.001) GRANULARITY 1,
	INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_key mapKeys(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_value mapValues(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_log_attr_key mapKeys(LogAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_log_attr_value mapValues(LogAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_body Body TYPE tokenbf_v1(32768, 3, 0) GRANULARITY 8
) ENGINE = MergeTree()
PARTITION BY toDate(TimestampTime)
PRIMARY KEY (ServiceName, TimestampTime)
ORDER BY (ServiceName, TimestampTime, Timestamp)
TTL TimestampTime + toIntervalDay(180)
SETTINGS index_granularity = 8192, ttl_only_drop_parts = 1;


CREATE TABLE IF NOT EXISTS otel_metrics_gauge ON CLUSTER "ch-01" (
    ResourceAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ResourceSchemaUrl String CODEC(ZSTD(1)),
    ScopeName String CODEC(ZSTD(1)),
    ScopeVersion String CODEC(ZSTD(1)),
    ScopeAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ScopeDroppedAttrCount UInt32 CODEC(ZSTD(1)),
    ScopeSchemaUrl String CODEC(ZSTD(1)),
    ServiceName LowCardinality(String) CODEC(ZSTD(1)),
    MetricName String CODEC(ZSTD(1)),
    MetricDescription String CODEC(ZSTD(1)),
    MetricUnit String CODEC(ZSTD(1)),
    Attributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    StartTimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
    TimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
    Value Float64 CODEC(ZSTD(1)),
    Flags UInt32 CODEC(ZSTD(1)),
    Exemplars Nested (
		FilteredAttributes Map(LowCardinality(String), String),
		TimeUnix DateTime64(9),
		Value Float64,
		SpanId String,
		TraceId String
    ) CODEC(ZSTD(1)),
	INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_key mapKeys(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_value mapValues(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_key mapKeys(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_value mapValues(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()

PARTITION BY toDate(TimeUnix)
ORDER BY (ServiceName, MetricName, Attributes, toUnixTimestamp64Nano(TimeUnix))
SETTINGS index_granularity=8192, ttl_only_drop_parts = 1;



CREATE TABLE IF NOT EXISTS otel_metrics_sum ON CLUSTER "ch-01"  (
    ResourceAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ResourceSchemaUrl String CODEC(ZSTD(1)),
    ScopeName String CODEC(ZSTD(1)),
    ScopeVersion String CODEC(ZSTD(1)),
    ScopeAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ScopeDroppedAttrCount UInt32 CODEC(ZSTD(1)),
    ScopeSchemaUrl String CODEC(ZSTD(1)),
    ServiceName LowCardinality(String) CODEC(ZSTD(1)),
    MetricName String CODEC(ZSTD(1)),
    MetricDescription String CODEC(ZSTD(1)),
    MetricUnit String CODEC(ZSTD(1)),
    Attributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
	StartTimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
	TimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
	Value Float64 CODEC(ZSTD(1)),
	Flags UInt32  CODEC(ZSTD(1)),
    Exemplars Nested (
		FilteredAttributes Map(LowCardinality(String), String),
		TimeUnix DateTime64(9),
		Value Float64,
		SpanId String,
		TraceId String
    ) CODEC(ZSTD(1)),
    AggregationTemporality Int32 CODEC(ZSTD(1)),
	IsMonotonic Boolean CODEC(Delta, ZSTD(1)),
	INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_key mapKeys(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_value mapValues(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_key mapKeys(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_value mapValues(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()
TTL toDateTime("TimeUnix") + toIntervalDay(180)
PARTITION BY toDate(TimeUnix)
ORDER BY (ServiceName, MetricName, Attributes, toUnixTimestamp64Nano(TimeUnix))
SETTINGS index_granularity=8192, ttl_only_drop_parts = 1;


CREATE TABLE IF NOT EXISTS otel_metrics_histogram ON CLUSTER "ch-01"  (
    ResourceAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ResourceSchemaUrl String CODEC(ZSTD(1)),
    ScopeName String CODEC(ZSTD(1)),
    ScopeVersion String CODEC(ZSTD(1)),
    ScopeAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ScopeDroppedAttrCount UInt32 CODEC(ZSTD(1)),
    ScopeSchemaUrl String CODEC(ZSTD(1)),
    ServiceName LowCardinality(String) CODEC(ZSTD(1)),
    MetricName String CODEC(ZSTD(1)),
    MetricDescription String CODEC(ZSTD(1)),
    MetricUnit String CODEC(ZSTD(1)),
    Attributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
	StartTimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
	TimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
    Count UInt64 CODEC(Delta, ZSTD(1)),
    Sum Float64 CODEC(ZSTD(1)),
    BucketCounts Array(UInt64) CODEC(ZSTD(1)),
    ExplicitBounds Array(Float64) CODEC(ZSTD(1)),
	Exemplars Nested (
		FilteredAttributes Map(LowCardinality(String), String),
		TimeUnix DateTime64(9),
		Value Float64,
		SpanId String,
		TraceId String
    ) CODEC(ZSTD(1)),
    Flags UInt32 CODEC(ZSTD(1)),
    Min Float64 CODEC(ZSTD(1)),
    Max Float64 CODEC(ZSTD(1)),
    AggregationTemporality Int32 CODEC(ZSTD(1)),
	INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_key mapKeys(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_value mapValues(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_key mapKeys(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_value mapValues(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()
TTL toDateTime("TimeUnix") + toIntervalDay(180)
PARTITION BY toDate(TimeUnix)
ORDER BY (ServiceName, MetricName, Attributes, toUnixTimestamp64Nano(TimeUnix))
SETTINGS index_granularity=8192, ttl_only_drop_parts = 1;


CREATE TABLE IF NOT EXISTS otel_metrics_summary ON CLUSTER "ch-01"  (
    ResourceAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ResourceSchemaUrl String CODEC(ZSTD(1)),
    ScopeName String CODEC(ZSTD(1)),
    ScopeVersion String CODEC(ZSTD(1)),
    ScopeAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ScopeDroppedAttrCount UInt32 CODEC(ZSTD(1)),
    ScopeSchemaUrl String CODEC(ZSTD(1)),
    ServiceName LowCardinality(String) CODEC(ZSTD(1)),
    MetricName String CODEC(ZSTD(1)),
    MetricDescription String CODEC(ZSTD(1)),
    MetricUnit String CODEC(ZSTD(1)),
    Attributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
	StartTimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
	TimeUnix DateTime64(9) CODEC(Delta, ZSTD(1)),
    Count UInt64 CODEC(Delta, ZSTD(1)),
    Sum Float64 CODEC(ZSTD(1)),
    ValueAtQuantiles Nested(
		Quantile Float64,
		Value Float64
	) CODEC(ZSTD(1)),
    Flags UInt32  CODEC(ZSTD(1)),
	INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_key mapKeys(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_scope_attr_value mapValues(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_key mapKeys(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1,
	INDEX idx_attr_value mapValues(Attributes) TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()
TTL toDateTime("TimeUnix") + toIntervalDay(180)
PARTITION BY toDate(TimeUnix)
ORDER BY (ServiceName, MetricName, Attributes, toUnixTimestamp64Nano(TimeUnix))
SETTINGS index_granularity=8192, ttl_only_drop_parts = 1;



CREATE TABLE IF NOT EXISTS otel_traces  ON CLUSTER "ch-01"  (
    Timestamp DateTime64(9) CODEC(Delta, ZSTD(1)),
    TraceId String CODEC(ZSTD(1)),
    SpanId String CODEC(ZSTD(1)),
    ParentSpanId String CODEC(ZSTD(1)),
    TraceState String CODEC(ZSTD(1)),
    SpanName LowCardinality(String) CODEC(ZSTD(1)),
    SpanKind LowCardinality(String) CODEC(ZSTD(1)),
    ServiceName LowCardinality(String) CODEC(ZSTD(1)),
    ResourceAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    ScopeName String CODEC(ZSTD(1)),
    ScopeVersion String CODEC(ZSTD(1)),
    SpanAttributes Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    Duration UInt64 CODEC(ZSTD(1)),
    StatusCode LowCardinality(String) CODEC(ZSTD(1)),
    StatusMessage String CODEC(ZSTD(1)),
    Events Nested (
        Timestamp DateTime64(9),
        Name LowCardinality(String),
        Attributes Map(LowCardinality(String), String)
    ) CODEC(ZSTD(1)),
    Links Nested (
        TraceId String,
        SpanId String,
        TraceState String,
        Attributes Map(LowCardinality(String), String)
    ) CODEC(ZSTD(1)),
    INDEX idx_trace_id TraceId TYPE bloom_filter(0.001) GRANULARITY 1,
    INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_span_attr_key mapKeys(SpanAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_span_attr_value mapValues(SpanAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_duration Duration TYPE minmax GRANULARITY 1
) ENGINE = MergeTree()
PARTITION BY toDate(Timestamp)
ORDER BY (ServiceName, SpanName, toDateTime(Timestamp))
TTL toDate(Timestamp) + toIntervalDay(180)
SETTINGS index_granularity=8192, ttl_only_drop_parts = 1;


CREATE TABLE IF NOT EXISTS otel_traces_trace_id_ts  ON CLUSTER "ch-01"  (
     TraceId String CODEC(ZSTD(1)),
     Start DateTime CODEC(Delta, ZSTD(1)),
     End DateTime CODEC(Delta, ZSTD(1)),
     INDEX idx_trace_id TraceId TYPE bloom_filter(0.01) GRANULARITY 1
) ENGINE = MergeTree()
PARTITION BY toDate(Start)
ORDER BY (TraceId, Start)
TTL toDate(Start) + toIntervalDay(180)
SETTINGS index_granularity=8192, ttl_only_drop_parts = 1;



CREATE MATERIALIZED VIEW IF NOT EXISTS otel_traces_trace_id_ts_mv  ON CLUSTER "ch-01"
TO otel_traces_trace_id_ts
AS SELECT
    TraceId,
    min(Timestamp) as Start,
    max(Timestamp) as End
FROM otel_traces
WHERE TraceId != ''
GROUP BY TraceId;
--------

# overview

1. Select the signal type
2. Select the ServiceName
3. Select the Environment
4. Select the signal name
5. Apply filters( if any ).
6. Apply Group By

# In plugin settings
1. Interval for query builder auto complete ( default value is 5m ).
> For reference in this doc it will be used as `MAX_QUERY_BUILDER_TIMERANGE`
2. Auto complete enabled/disabled ( default value is enabled ). ( type radio button ).
3. Default logs table ( default value is `otel_logs`). - In doc referenced as `DEFAULT_LOGS_TABLE`
4. Default traces table ( default value is `otel_traces`). - In doc referenced as `DEFAULT_TRACES_TABLE`
5. Default Gauge metric table ( Default value is `otel_metrics_gauge`). - In doc referenced as `DEFAULT_METRICS_GAUGE_TABLE`.
6. Default Sum metric table ( Default value is `otel_metrics_sum`). - In doc referenced as `DEFAULT_METRICS_SUM_TABLE`.
7. Deafult Histogram metric table ( Default value is `otel_metrics_histogram`). - In doc referenced as `DEFAULT_METRICS_HISTOGRAM_TABLE`.
8. Default Summary metric table ( Default value is `otel_metrics_summary`). - In doc referenced as `DEFAULT_SUMMARY_TABLE`.

## Detailed Steps

1. Select the signal type
Avaialble options: logs, metrics, traces
multi select: false
all select: false
custom values allowed: false


2. Select the service name
Info:
After user selects a signal type, they should see the option of selecting the service name
After user selcts a signal type, it should run the query mentioned below to display the option
query:
---
For traces:
SELECT DISTINCT ServiceName
FROM <database>.DEFAULT_TRACES_TABLE
WHERE Timestamp > now() - INTERVAL 5 MINUTE
ORDER BY ServiceName ASC
---
For Logs:
SELECT DISTINCT ServiceName
FROM <database>.DEFAULT_LOGS_TABLE
WHERE Timestamp > now() - INTERVAL 5 MINUTE
ORDER BY ServiceName ASC
---
For Metrics:
SELECT 
    distinct(ServiceName) as Service
FROM <database>.DEFAULT_METRICS_SUM_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
UNION ALL
SELECT 
    distinct(ServiceName) as Service
FROM axi.DEFAULT_METRICS_GAUGE_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
UNION ALL
SELECT 
    distinct(ServiceName) as Service
FROM <database>.DEFAULT_SUMMARY_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
UNION ALL
SELECT 
    distinct(ServiceName) as Service
FROM <database>.DEFAULT_METRICS_HISTOGRAM_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
---
multi select: true
all select: false
plugin settings field: MAX_QUERY_BUILDER_TIMERANGE in the Timefilter
custom values allowed: true

3. Select the environment
Info:
After selecting the service next is selecting the environment
query:
---
For traces:
SELECT DISTINCT ResourceAttributes['environment'] as environment
FROM <database>.DEFAULT_TRACES_TABLE
WHERE Timestamp > now() - INTERVAL 5 MINUTE
AND ServiceName in (<selected service with comma sepearated list, example: 'frontend', 'backend'>)
ORDER BY environment ASC
---
For Logs:
For Logs:
SELECT DISTINCT ResourceAttributes['environment'] as environment
FROM <database>.DEFAULT_LOGS_TABLE
WHERE Timestamp > now() - INTERVAL 5 MINUTE
AND ServiceName in (<selected service with comma sepearated list, example: 'frontend', 'backend'>)
ORDER BY environment ASC
---
For Metrics:
SELECT 
    distinct(ResourceAttributes['environment']) as environment
FROM <database>.DEFAULT_METRICS_SUM_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
AND ServiceName in (<selected service with comma sepearated list, example: 'frontend', 'backend'>)
UNION ALL
SELECT 
    distinct(ResourceAttributes['environment']) as environment
FROM axi.DEFAULT_METRICS_GAUGE_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
AND ServiceName in (<selected service with comma sepearated list, example: 'frontend', 'backend'>)
UNION ALL
SELECT 
    distinct(ResourceAttributes['environment']) as environment
FROM <database>.DEFAULT_SUMMARY_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
AND ServiceName in (<selected service with comma sepearated list, example: 'frontend', 'backend'>)
UNION ALL
SELECT 
    distinct(ResourceAttributes['environment']) as environment
FROM <database>.DEFAULT_METRICS_HISTOGRAM_TABLE
WHERE TimeUnix > now() - INTERVAL 5 MINUTE
AND ServiceName in (<selected service with comma sepearated list, example: 'frontend', 'backend'>)
---
multi select: true
all select: false
plugin seetings field: MAX_QUERY_BUILDER_TIMERANGE in the Tiemfilter
custom values allowed: true

---

# 4. Filters — proposal (under review, NOT implemented yet)

After signal type, services, environment, and (for traces/metrics) the SpanName / MetricName have been chosen, the user can add **filters**. A filter row is the standard observability triple:

```
[ key ▾ ]   [ operator ▾ ]   [ value(s) ▾ ]
```

Rows are AND-combined. The user can add or remove rows freely; each row appears below the previous one with a small `+` button to append.

## What can a key be?

The key dropdown is grouped by **scope**, because OTel ClickHouse data splits attributes across several places:

| Scope | Where it lives | Applies to |
|---|---|---|
| Top-level column | a normal column on the table (e.g. `SeverityText`, `Duration`, `StatusCode`) | varies by signal — see below |
| `resource` | `ResourceAttributes[key]` Map column | all three signals |
| `scope` | `ScopeAttributes[key]` Map column | all three signals |
| `log` | `LogAttributes[key]` Map column | logs only |
| `span` | `SpanAttributes[key]` Map column | traces only |
| `attribute` | `Attributes[key]` Map column | metrics only |

Per signal, the **top-level columns** offered (excluding the ones already picked above — ServiceName, MetricName, SpanName, ResourceAttributes['environment']):

- **Logs:** `SeverityText`, `SeverityNumber`, `TraceId`, `SpanId`, `Body`, `ScopeName`, `ScopeVersion`
- **Traces:** `SpanKind`, `StatusCode`, `StatusMessage`, `Duration`, `TraceId`, `SpanId`, `ParentSpanId`, `TraceState`, `ScopeName`, `ScopeVersion`
- **Metrics:** `MetricDescription`, `MetricUnit`, `Value` (gauge/sum only), `AggregationTemporality` (sum/histogram), `IsMonotonic` (sum), `Flags`, `ScopeName`, `ScopeVersion`

Map-scope keys are **discovered** the same way services and environments are — see the discovery query below.

## What operators?

Type-aware. Operator list is filtered based on the inferred type of the chosen key:

| Type | Operators |
|---|---|
| String / LowCardinality | `=`, `!=`, `IN`, `NOT IN`, `LIKE`, `NOT LIKE`, `regex` (`match`), `EXISTS` (map-key presence only), `NOT EXISTS` |
| Number (UInt8/32/64, Float64) | `=`, `!=`, `<`, `<=`, `>`, `>=`, `IN`, `NOT IN` |
| Map value (treated as string) | same as String |

`EXISTS` / `NOT EXISTS` only apply to map keys and compile to `mapContains(<Map>, '<key>')` / `NOT mapContains(...)`.

## Value picker

Same multi-select pattern as the earlier pickers — autocomplete from a discovery query, custom values allowed.

A value-discovery query is gated on the same prerequisites as the earlier pickers (service + environment must be set) **plus** a key being chosen. Examples (for logs, with services `'frontend'` and environment `'prod'` already selected):

```sql
-- Top-level column value discovery
SELECT DISTINCT SeverityText
FROM <database>.DEFAULT_LOGS_TABLE
WHERE Timestamp > now() - INTERVAL <effective lookback>
  AND ServiceName IN ('frontend')
  AND ResourceAttributes['environment'] IN ('prod')
ORDER BY SeverityText ASC
LIMIT 200
```

```sql
-- Map-key value discovery (ResourceAttributes['k8s.namespace'])
SELECT DISTINCT ResourceAttributes['k8s.namespace'] AS v
FROM <database>.DEFAULT_LOGS_TABLE
WHERE Timestamp > now() - INTERVAL <effective lookback>
  AND ServiceName IN ('frontend')
  AND ResourceAttributes['environment'] IN ('prod')
  AND mapContains(ResourceAttributes, 'k8s.namespace')
ORDER BY v ASC
LIMIT 200
```

For **Body** specifically (logs), no value autocomplete — too high cardinality. The value field becomes a free-text input.

For metrics, value-discovery UNIONs across the four metric tables exactly like the service/environment queries do today.

## Key discovery (for the key dropdown's map sections)

To populate "what `ResourceAttributes` keys exist," run once per (signal, services, environments):

```sql
-- ResourceAttributes keys
SELECT DISTINCT arrayJoin(mapKeys(ResourceAttributes)) AS key
FROM <database>.DEFAULT_LOGS_TABLE
WHERE Timestamp > now() - INTERVAL <effective lookback>
  AND ServiceName IN (...)
  AND ResourceAttributes['environment'] IN (...)
ORDER BY key ASC
LIMIT 500
```

Repeat for `ScopeAttributes`, `LogAttributes`/`SpanAttributes`/`Attributes` (per signal). All three indexes have `bloom_filter` on `mapKeys`, so this is cheap. For metrics: 4-way UNION across metric tables.

The dropdown then renders as a grouped list:
```
─ Columns ────────────────
  SeverityText
  SeverityNumber
  Body
  ...
─ Resource ───────────────
  ResourceAttributes[deployment.environment]
  ResourceAttributes[k8s.namespace]
  ...
─ Scope ──────────────────
  ScopeAttributes[...]
─ Log ────────────────────
  LogAttributes[...]
```

## Gating (cost protection — same principle as the earlier pickers)

- **Filter section is hidden** until services + environment are selected (logs) or services + environment + signal-name (traces/metrics). Same threshold as today's "SpanName / MetricName" picker — once that is non-empty (or skipped for logs), filters appear.
- **Key discovery query** runs once when the section first becomes visible; cached per `(signal, services, environments, signalName)` key.
- **Value discovery query** runs only after a key is chosen, gated on the same prerequisites.
- No discovery happens when autocomplete is disabled in plugin settings — input fields become free-text.

## Storage on CHQuery

New field:
```ts
interface QueryBuilderFilter {
  scope: 'column' | 'resource' | 'scope' | 'log' | 'span' | 'attribute';
  key: string;
  type: 'string' | 'number';
  op: 'eq' | 'neq' | 'in' | 'nin' | 'like' | 'nlike' | 'regex' | 'exists' | 'nexists' | 'lt' | 'lte' | 'gt' | 'gte';
  values: string[];
}
filters?: QueryBuilderFilter[];
```

Drill-down behavior: changing services / environments / signal name does **not** automatically clear filters (a filter on `SeverityText='ERROR'` is meaningful across service changes). But a small badge appears on stale rows if the chosen key no longer exists in the new discovery scope, with a one-click "clear this filter."

## What this proposal does NOT cover yet

- **Events / Links nested filters** (traces). Complex to express in the UI; skip for now.
- **Histogram/summary-specific operators** (e.g. percentile threshold filters). Defer until metric-type-aware UI lands.
- **SQL emission.** Filters write to `query.filters[]` only. Compilation to a `WHERE` fragment lands with the final per-signal query templates (still pending from you).
- **Saved filter presets / "recent filters"** — out of scope.

---

## Resolutions (from user review)

1. **AND + OR both supported.** v1 needs both. See "AND/OR structure" below for the proposed shape — needs your sign-off before I code it.
2. **Body search (logs):** mirror the logX pattern at `/Users/nimishgj/github/work/infraspec/clients/base14/core/base14/apps/logX`:
   - Dedicated search bar at the top of the filter section with a regex toggle button (`.*`).
   - **Plain mode** → tokenize the input and emit `hasToken(Body, 'tok1') AND hasToken(Body, 'tok2') AND …` so the `tokenbf_v1` index on `Body` is used.
   - **Regex mode** → `match(Body, '<pattern>')`.
   - Inline `key=value` / `key!=value` typed into the search bar auto-converts into a filter row (logX behavior).
   - This bar is logs-only; hidden for traces and metrics.
3. **Duration (traces):** unit-aware. OTel ClickHouse exporter stores `Duration` as **nanoseconds (UInt64)** — that's the storage unit. UI shows a value input + unit dropdown (ns / µs / ms / s), with **ns selected by default**; SQL emission converts the entered value into ns before comparison. Raw integer input is hidden.
4. **Ad-hoc filters:** kept completely separate. The QueryBuilder never reads `adHocFilters` and never offers a "promote" action.
5. **Autocomplete limit:** new plugin setting `QUERY_BUILDER_AUTOCOMPLETE_LIMIT`, **default 100**. Applies to **every** discovery query — services, environments, signal names, filter keys, filter values — replacing the placeholder `LIMIT 200` / `LIMIT 500` in the example SQL above and adding a `LIMIT 100` to the existing service/env/signal-name queries (which currently have no LIMIT).

## AND/OR structure — nested expression tree (CONFIRMED)

The filter section is a recursive tree. Every group has a connector (`AND` or `OR`) and any number of children. A child can be either a single condition or another group, allowing arbitrary nesting.

```
Group [AND]
├── SeverityText  =  ERROR
├── Group [OR]
│   ├── k8s.namespace  =  prod
│   └── Group [AND]
│       ├── k8s.namespace  =  staging
│       └── k8s.cluster   !=  canary
└── Duration  >  500  ms
```

Compiles to:
```sql
WHERE SeverityText = 'ERROR'
  AND (
    ResourceAttributes['k8s.namespace'] = 'prod'
    OR (
      ResourceAttributes['k8s.namespace'] = 'staging'
      AND ResourceAttributes['k8s.cluster'] != 'canary'
    )
  )
  AND Duration > 500000000
```

Storage:
```ts
type FilterConnector = 'AND' | 'OR';

interface FilterCondition {
  kind: 'condition';
  scope: 'column' | 'resource' | 'scope' | 'log' | 'span' | 'attribute';
  key: string;
  type: 'string' | 'number';
  op: 'eq' | 'neq' | 'in' | 'nin' | 'like' | 'nlike' | 'regex' | 'nregex'
    | 'exists' | 'nexists' | 'lt' | 'lte' | 'gt' | 'gte';
  values: string[];
  unit?: 'ns' | 'us' | 'ms' | 's';
}

interface FilterGroup {
  kind: 'group';
  connector: FilterConnector;
  children: FilterNode[];
}

type FilterNode = FilterCondition | FilterGroup;

filters?: FilterGroup;
```

Root is always a `FilterGroup` (default `{ kind: 'group', connector: 'AND', children: [] }`). Empty root → no WHERE clause emitted.

UI controls per group:
- `AND / OR` toggle at the top-left of the group's border
- `+ Condition` — appends a single-condition child
- `+ Group` — appends a nested group (default connector = the *opposite* of the parent's, so toggling produces sensible defaults)
- `✕` on each child to remove (removing the last child of a non-root group collapses the group)
- Indentation is visual only; depth has no hard cap, but UI shows a subtle warning past 5 levels (debuggability hint, not a block).

## New plugin setting summary

In addition to `QUERY_BUILDER_AUTOCOMPLETE_LIMIT` (default 100), no other new settings needed for filters.

## More resolutions (round 2)

6. **Flat key dropdown.** The user never sees scope labels (no "Column", "Resource", "Scope", "Log", "Span", "Attribute" badges). The dropdown is a single flat alphabetical list of key names. Internally:
   - Discovery still queries all scopes (top-level columns + each Map column) and tags each discovered key with its scope.
   - **Deduplication priority** when the same key name exists in multiple scopes: `column > resource > scope > log/span/attribute`. The first scope that contains the key wins for that signal type.
   - The chosen scope is stored on the filter object (`scope: 'column' | 'resource' | ...`) for SQL emission, but never rendered.
   - If a typed (custom) key isn't in the discovered list, fall back to logX's heuristic resolver: known top-level columns first; then known attribute keys; then OTel-prefix heuristics (`service.`, `host.`, `k8s.`, `container.`, `cloud.`, `deployment.` → `resource`); else default to the signal's primary map (`log` for logs, `span` for traces, `attribute` for metrics).
7. **Body search gating.** The Body search bar appears *only after services + environment are selected* — same gate as the rest of the filter section. No always-visible bar. (Diverges from logX's always-on placement, but matches the cost-protection model we've already established.)
8. **Richer inline parser.** Extend beyond logX's `=` / `!=` to support the full operator set inline. Supported syntax in the Body search bar:

   | Syntax | Compiles to | Notes |
   |---|---|---|
   | `key=value` | `IN ('value')` | equality |
   | `key!=value` | `NOT IN ('value')` | inequality |
   | `key=~pattern` | `match(<col>, 'pattern')` | regex |
   | `key!~pattern` | `NOT match(<col>, 'pattern')` | not regex |
   | `key:v1,v2,v3` | `IN ('v1','v2','v3')` | list |
   | `key!:v1,v2` | `NOT IN ('v1','v2')` | not in list |
   | `key>N` / `key<N` / `key>=N` / `key<=N` | numeric comparisons | numeric keys only |
   | `key~substring` | `LIKE '%substring%'` | substring search |
   | `key="value with spaces"` | quoted values OK | applies to any operator |

   Each committed inline expression becomes one filter row (single-condition group). Anything that doesn't parse as a filter expression is treated as a Body search (logs only) or shows an inline parse-error tooltip (traces / metrics).

## Status

All decisions resolved. Design is ready to implement on user's "yes".
