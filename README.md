[![Coverage Status](https://coveralls.io/repos/github/base-14/clickhouse-grafana/badge.svg?branch=master)](https://coveralls.io/github/base-14/clickhouse-grafana?branch=master)

# base14 ClickHouse Datasource for Grafana (Grafana 4.6+ supported)

base14 ClickHouse datasource provides support for [ClickHouse](https://clickhouse.tech) as a backend database.

Originally developed by Vertamedia, maintained by Altinity until 2025, now enhanced and maintained by base14.

## Attribution

This project is derivative work based on the original ClickHouse Grafana Plugin:

- **Original Development**: [Vertamedia](https://github.com/Vertamedia) (2017-2020)
- **Community Maintenance**: [Altinity](https://github.com/Altinity) (2020-2025)
- **Original Repository**: https://github.com/Altinity/clickhouse-grafana
- **License**: MIT License (allows derivative works)

We extend our sincere gratitude to the original developers and maintainers for creating and maintaining this excellent foundation. Their work made this enhanced version possible.

**base14 Enhancements** (2025):
- Custom ad-hoc filter maps functionality
- OpenTelemetry data support improvements
- Enhanced query customization features
- Internal branding and distribution

For complete license information and attribution, see [THIRD_PARTY_LICENSES](https://github.com/base-14/clickhouse-grafana/blob/master/THIRD_PARTY_LICENSES).

## Quick start

### Grafana 10+ setup notes for plugin version before 3.0.0

Old versions of base14 ClickHouse datasource plugin for Grafana written in Angular. So you can watch warning like 
```
Angular plugin
This data source plugin uses a deprecated, legacy platform based on AngularJS and will stop working in future releases of Grafana.
```

Don't worry about warning message, plugin will still working until Grafana 11 will release, after it upgrade to base14 ClickHouse datasource plugin for Grafana to 3.x version is required.


### Grafana 7+ setup notes for plugin version before 2.2.0

When 2.0.x and 2.1.x vertamedia-clickhouse-grafana plugin versions released Grafana team didn't provide worked signing method for community plugins.
Current sign process describe on [grafana.com](https://grafana.com/docs/grafana/latest/developers/plugins/sign-a-plugin/)

so, for properly setup 2.0.x and 2.1.x plugins you need change configuration option

```ini
[plugins]
allow_loading_unsigned_plugins=base14-clickhouse-datasource
```

or setup environment variable

```bash
GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=base14-clickhouse-datasource
```

Copy files to your [Grafana plugin directory](https://grafana.com/docs/grafana/latest/plugins/installation/#install-plugin-on-local-grafana).
Restart Grafana, check data sources list at Configuration -> Datasources -> New, choose ClickHouse option.

![Datasources](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/01_data_sources.png)
![Add new datasource](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/02_add_data_source.png)
![Datasource types](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/03_filter_click_to_plugin.png)


## Features

* Access to CH via HTTP / HTTPS
* Query setup
* Raw SQL editor
* Query formatting
* Macros support
* Additional functions
* Templates
* Table view
* SingleStat view
* Ad-hoc filters
* Custom filter maps for ad-hoc filters
* Annotations
* Alerts support
* Histogram support
* Logs support
* Flamegraph support
* Traces support

## Access to ClickHouse via HTTP / HTTPS

Page configuration is standard

![settings](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/04_datasource_settings.png)

There is a small feature - ClickHouse treats HTTP Basic Authentication credentials as a database user and will try to run queries using its name.

### [CHProxy](https://github.com/ContentSquare/chproxy) (optional)

Using of [CHProxy](https://github.com/ContentSquare/chproxy) will bring additional features:

* Easily setup `HTTPS` access to ClickHouse as shown [here](https://github.com/ContentSquare/chproxy#authorize-users-by-passwords-via-https)
to provide secure access.
* Limit concurrency and execution time for requests from `Grafana` as shown [here](https://github.com/ContentSquare/chproxy#spread-selects-from-reporting-apps-among-cluster-nodes)
to prevent `ClickHouse` overloading from `Grafana`.
* Protection against request bursts for dashboards with numerous graphs. `CHProxy` allows queueing requests and execute them sequentially.
To learn more - read about params `max_queue_size` and `max_queue_time` at [CHProxy](https://github.com/ContentSquare/chproxy) page.
* Response caching for the most frequent queries as shown [here](https://github.com/ContentSquare/chproxy#caching).

`Caching` will protect `ClickHouse` from excessive refreshes and will be optimal option for popular dashboards.
> Hint - if you need to cache requests like `last 24h` where timestamp changes constantly then try to use `Round` option at `Raw Editor`

## Query setup

Query setup interface:

![query editor image](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/05_query_settings.png)

First row `FROM` contains two options: database and table. Table values depends on a selected database.
Next rows contains selectors for time filtering:

Column timestamp time
* DateTime ([DateTime](https://clickhouse.com/docs/en/sql-reference/data-types/datetime/))
* DateTime64 ([DateTime64](https://clickhouse.com/docs/en/sql-reference/data-types/datetime64/))
* TimeStamp ([UInt32](https://clickhouse.com/docs/en/sql-reference/data-types/int-uint/)).

Timestamp column
Date column

> `Timestmap column` are required for time-based macros and functions because all analytics based on these values.
> Plugin will try to detect Date, Date32 column automatically

Button `Go to Query` is just a toggler to Raw SQL Editor

## Raw SQL Editor

Raw Editor allows custom SQL queries to be written:

![raw editor image](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/06_raw_sql_editor.png)

Raw Editor allows typing queries, get info about functions and macros, format queries as Clickhouse do.
To Execute query on server press "Run Query" or just leave focus from SQL editor textarea.

Under the Editor you can find options which allows setup rounding, time column step 
and `Add metadata` to SQL query which allows know which dashboard and user produce workload to your ClickHouse server.

Press `Show Generated SQL` for see a raw query (all macros and functions have already been replaced) which will be sent directly to ClickHouse.
![generated sql](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/07_generated_sql.png)


## Macros support

Plugin supports the following marcos:

* $table - replaced with selected table name from Query Builder
* $dateCol - replaced with `Column:Date` value from Query Builder
* $dateTimeCol - replaced with `Column:DateTime` or `Column:TimeStamp` value from Query Builder
* $from - replaced with (timestamp with ms)/1000 value of UI selected "Time Range:From"
* $to - replaced with (timestamp with ms)/1000 value of UI selected "Time Range:To"
* $interval - replaced with selected "Group by a time interval" value (as a number of seconds)
* $timeFilter - replaced with currently selected "Time Range".
  Requires Column:Date and Column:DateTime or Column:TimeStamp to be selected.
* $timeFilterByColumn($column) - replaced with currently selected "Time Range" for a column passed as `$column` argument. Use it in queries or query variables as `...WHERE $timeFilterColumn($column)...` or `...WHERE $timeFilterColumn(created_at)...`.
* $timeSeries - replaced with special ClickHouse construction to convert results as time-series data. Use it as "SELECT $timeSeries...".
* $naturalTimeSeries - replaced with special ClickHouse construction to convert results as time-series with in a logical/natural breakdown. Use it as "SELECT $naturalTimeSeries...".
* $unescape - unescapes variable value by removing single quotes. Used for multiple-value string variables: "SELECT $unescape($column) FROM requests WHERE $unescape($column) = 5"
* $adhoc - replaced with a rendered ad-hoc filter expression, or "1" if no ad-hoc filters exist. Since ad-hoc applies automatically only to outer queries the macros can be used for filtering in inner queries.

A description of macros is available by typing their names in Raw Editor

## Functions

Functions are just templates of SQL queries, and you can check the final query at [Raw SQL Editor mode](https://github.com/base-14/clickhouse-grafana/blob/master/README.md#raw-sql-editor).
If you need some additional complexity - just copy raw sql into Raw Editor and make according changes. Remember that macros are still available to use.

There are some limits in function use because of poor query analysis:

* Column:Date and Column:DateTime or Column:TimeStamp must be set in Query Builder
* Query must begin from function name
* Only one function can be used per query

Plugin supports the following functions:

### $rate(cols...) - converts query results as "change rate per interval"

Example usage:

```sql
$rate(countIf(Type = 200) AS good, countIf(Type != 200) AS bad) FROM requests
```

Query will be transformed into:

```sql
SELECT
    t,
    good / runningDifference(t / 1000) AS goodRate,
    bad / runningDifference(t / 1000) AS badRate
FROM
(
    SELECT
        (intDiv(toUInt32(EventTime), 60)) * 1000 AS t,
        countIf(Type = 200) AS good,
        countIf(Type != 200) AS bad
    FROM requests
    WHERE ((EventDate >= toDate(1482796747)) AND (EventDate <= toDate(1482853383))) AND ((EventTime >= toDateTime(1482796747)) AND (EventTime <= toDateTime(1482853383)))
    GROUP BY t
    ORDER BY t
)
```

---

### $columns(key, value) - query values as array of [key, value], where key will be used as label

Example usage:

```sql
$columns(OSName, count(*) c)
FROM requests
INNER JOIN oses USING (OS)
```

Query will be transformed into:

```sql
SELECT
    t,
    groupArray((OSName, c)) AS groupArr
FROM
(
    SELECT
        (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
        OSName,
        count(*) AS c
    FROM requests
    INNER JOIN oses USING (OS)
    WHERE ((EventDate >= toDate(1482796627)) AND (EventDate <= toDate(1482853383))) AND ((EventTime >= toDateTime(1482796627)) AND (EventTime <= toDateTime(1482853383)))
    GROUP BY
        t,
        OSName
    ORDER BY
        t,
        OSName
)
GROUP BY t
ORDER BY t
```

This will help to build the next graph:

![req_by_os image](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/08_requests_by_os.png)

---
### $columnsMs(key, value) - same as $columns but for time series with ms

Example usage:

```sql
$columnsMs(OSName, count(*) c)
FROM requests
INNER JOIN oses USING (OS)
```

Query will be transformed into:

```sql
SELECT
    t,
    groupArray((OSName, c)) AS groupArr
FROM
(
    SELECT
        $timeSeriesMs AS t,
        OSName,
        count(*) AS c
    FROM requests
    INNER JOIN oses USING (OS)
    WHERE ((EventDate >= toDate(1482796627)) AND (EventDate <= toDate(1482853383))) AND ((EventTime >= toDateTime64(1482796627,3)) AND (EventTime <= toDateTime64(1482853383,3)))
    GROUP BY
        t,
        OSName
    ORDER BY
        t,
        OSName
)
GROUP BY t
ORDER BY t
```

---
### $lttb(buckets_number, [field1, ... fieldN], x_field, y_field) - allow show down-sampled time series which will contains more outliers than avg or other kind of aggregation

If bucket_number is `auto`, then it will calculated as `toUInt64( ($to-$from) / $interval )`
Example usage:

```sql
$lttb(auto, category, event_time, count(*) c)
FROM requests GROUP BY category
```

Query will be transformed into:

```sql
SELECT category, lttb_result.1 AS event_time, lttb_result.2 AS c FROM (
    SELECT category, untuple(arrayJoin(lttb(toUInt64( ($to - $from) / $interval ))(event_time, cont(*) AS c))) AS lttb_result
    FROM requests WHERE $timeFilter GROUP BY category
) ORDER BY event_time
```

---

---
### $lttbMs(buckets_number, [field1,... fieldN], x_field, y_field) - same as $lttb but for time series with ms

If bucket_number is `auto`, then it will calculated as `toUInt64( ($__to-$__from) / $__interval_ms )`

Example usage:

```sql
$lttbMs(100, event_time, count(*) c)
FROM requests
```

Query will be transformed into:

```sql
SELECT lttb_result.1 AS event_time, lttb_result.2 AS c FROM (
    SELECT untuple(arrayJoin(lttb(100)(event_time, count(*) AS c))) AS lttb_result
    FROM requests WHERE $timeFilterMs    
) ORDER BY event_time
```

---

### $rateColumns(key, value) - is a combination of $columns and $rate

Example usage:

```sql
$rateColumns(OS, count(*) c) FROM requests
```

Query will be transformed into:

```sql
SELECT
    t,
    arrayMap(lambda(tuple(a), (a.1, a.2 / runningDifference(t / 1000))), groupArr)
FROM
(
    SELECT
        t,
        groupArray((OS, c)) AS groupArr
    FROM
    (
        SELECT
            (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
            OS,
            count(*) AS c
        FROM requests
        WHERE ((EventDate >= toDate(1482796867)) AND (EventDate <= toDate(1482853383))) AND ((EventTime >= toDateTime(1482796867)) AND (EventTime <= toDateTime(1482853383)))
        GROUP BY
            t,
            OS
        ORDER BY
            t,
            OS
    )
    GROUP BY t
    ORDER BY t
)

```

---

### $rateColumnsAggregated(key, subkey, aggFunction1, value1, ... aggFunctionN, valueN) - if you need calculate `rate` for higher cardinality dimension and then aggregate by lower cardinality dimension

Example usage:

```sql
$rateColumnsAggregated(datacenter, concat(datacenter,interface) AS dc_interface, sum, tx_bytes * 1014 AS tx_kbytes, sum, max(rx_bytes) AS rx_bytes) FROM traffic
```

Query will be transformed into:

```sql
SELECT
    t,
    datacenter,
    sum(tx_kbytesRate) AS tx_bytesRateAgg,
    sum(rx_bytesRate) AS rx_bytesRateAgg
FROM
(
    SELECT
        t,
        datacenter,
        dc_interface,
        tx_kbytes / runningDifference(t / 1000) AS tx_kbytesRate,
        rx_bytes / runningDifference(t / 1000) AS rx_bytesRate
    FROM
    (
        SELECT
            (intDiv(toUInt32(event_time), 60) * 60) * 1000 AS t,
            datacenter,
            concat(datacenter,interface) AS dc_interface,
            max(tx_bytes * 1024) AS tx_kbytes,
            max(rx_bytes) AS rx_bytes
        FROM traffic
        WHERE ((event_date >= toDate(1482796867)) AND (event_date <= toDate(1482853383))) 
          AND ((event_time >= toDateTime(1482796867)) AND (event_time <= toDateTime(1482853383)))
        GROUP BY
            t,
            datacenter,
            dc_interface
        ORDER BY
            t,
            datacenter,
            dc_interface
    )
)
GROUP BY
  t,
  datacenter
ORDER BY 
  datacenter,
  t
```

see technical documentation for implementation details  

---

### $perSecond(cols...) - converts query results as "change rate per interval" for Counter-like(growing only) metrics

Example usage:

```sql
$perSecond(Requests) FROM requests
```

Query will be transformed into:

```sql
SELECT
    t,
    if(runningDifference(max_0) < 0, nan, runningDifference(max_0) / runningDifference(t / 1000)) AS max_0_PerSecond
FROM
(
    SELECT
        (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
        max(Requests) AS max_0
    FROM requests
    WHERE ((EventDate >= toDate(1535711819)) AND (EventDate <= toDate(1535714715)))
    AND ((EventTime >= toDateTime(1535711819)) AND (EventTime <= toDateTime(1535714715)))
    GROUP BY t
    ORDER BY t
)
```

// historical implementation note

---

### $perSecondColumns(key, value) - is a combination of $columns and $perSecond for Counter-like metrics

Example usage:

```sql
$perSecondColumns(Protocol, Requests) FROM requests WHERE Protocol in ('udp','tcp')
```

Query will be transformed into:

```sql
SELECT
    t,
    groupArray((perSecondColumns, max_0_PerSecond)) AS groupArr
FROM
(
    SELECT
        t,
        Protocol,
        if(runningDifference(max_0) < 0 OR neighbor(perSecondColumns,-1,perSecondColumns) != perSecondColumns, nan, runningDifference(max_0) / runningDifference(t / 1000)) AS max_0_PerSecond
    FROM
    (
        SELECT
            (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
            Protocol AS perSecondColumns,
            max(Requests) AS max_0
        FROM requests
        WHERE ((EventDate >= toDate(1535711819)) AND (EventDate <= toDate(1535714715)))
        AND ((EventTime >= toDateTime(1535711819)) AND (EventTime <= toDateTime(1535714715)))
        AND (Protocol IN ('udp', 'tcp'))
        GROUP BY
            t,
            Protocol
        ORDER BY
            t,
            Protocol
    )
)
GROUP BY t
ORDER BY t
```

// see [issue 80](https://github.com/base-14/clickhouse-grafana/issues/80) for the background

---

### $perSecondColumnsAggregated(key, subkey, aggFunction1, value1, ... aggFunctionN, valueN) - if you need to calculate `perSecond` for higher cardinality dimension and then aggregate by lower cardinality dimension

Example usage:

```sql
$perSecondColumnsAggregated(datacenter, concat(datacenter,interface) AS dc_interface, sum, tx_bytes * 1014 AS tx_kbytes, sum, max(rx_bytes) AS rx_bytes) FROM traffic
```

Query will be transformed into:

```sql
SELECT
    t,
    datacenter,
    sum(tx_kbytesPerSecond) AS tx_bytesPerSecondAgg,
    sum(rx_bytesPerSecond) AS rx_bytesPerSecondAgg
FROM
(
    SELECT
        t,
        datacenter,
        dc_interface,
        if(runningDifference(tx_kbytes) < 0 OR neighbor(tx_kbytes,-1,tx_kbytes) != tx_kbytes, nan, runningDifference(tx_kbytes) / runningDifference(t / 1000)) AS tx_kbytesPerSecond,
        if(runningDifference(rx_bytes) < 0 OR neighbor(rx_bytes,-1,rx_bytes) != rx_bytes, nan, runningDifference(rx_bytes) / runningDifference(t / 1000)) AS rx_bytesPerSecond
    FROM
    (
        SELECT
            (intDiv(toUInt32(event_time), 60) * 60) * 1000 AS t,
            datacenter,
            concat(datacenter,interface) AS dc_interface,
            max(tx_bytes * 1024) AS tx_kbytes,
            max(rx_bytes) AS rx_bytes
        FROM traffic
        WHERE ((event_date >= toDate(1482796867)) AND (event_date <= toDate(1482853383))) 
          AND ((event_time >= toDateTime(1482796867)) AND (event_time <= toDateTime(1482853383)))
        GROUP BY
            t,
            datacenter,
            dc_interface
        ORDER BY
            t,
            datacenter,
            dc_interface
    )
)
GROUP BY
  t,
  datacenter
ORDER BY 
  datacenter,
  t
```

look [issue 386](https://github.com/base-14/clickhouse-grafana/issues/386) for reasons for implementation  

---

### $delta(cols...) - converts query results as "delta value inside interval" for Counter-like(growing only) metrics, will negative if counter reset

Example usage:

```sql
$delta(Requests) FROM requests
```

Query will be transformed into:

```sql
SELECT
    t,
    runningDifference(max_0) AS max_0_Delta
FROM
(
    SELECT
        (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
        max(Requests) AS max_0
    FROM requests
    WHERE ((EventDate >= toDate(1535711819)) AND (EventDate <= toDate(1535714715)))
    AND ((EventTime >= toDateTime(1535711819)) AND (EventTime <= toDateTime(1535714715)))
    GROUP BY t
    ORDER BY t
)
```

// see technical documentation for background

---

### $deltaColumns(key, value) - is a combination of $columns and $delta for Counter-like metrics

Example usage:

```sql
$deltaColumns(Protocol, Requests) FROM requests WHERE Protocol in ('udp','tcp')
```

Query will be transformed into:

```sql
SELECT
    t,
    groupArray((deltaColumns, max_0_Delta)) AS groupArr
FROM
(
    SELECT
        t,
        deltaColumns,
        if (neighbor(deltaColumns,-1,deltaColumns) != deltaColumns, 0, runningDifference(max_0)) AS max_0_Delta
    FROM
    (
        SELECT
            (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
            Protocol AS deltaColumns,
            max(Requests) AS max_0
        FROM requests
        WHERE ((EventDate >= toDate(1535711819)) AND (EventDate <= toDate(1535714715)))
        AND ((EventTime >= toDateTime(1535711819)) AND (EventTime <= toDateTime(1535714715)))
        AND (Protocol IN ('udp', 'tcp'))
        GROUP BY
            t,
            Protocol
        ORDER BY
            t,
            Protocol
    )
)
GROUP BY t
ORDER BY t
```

// see [issue 455](https://github.com/base-14/clickhouse-grafana/issues/455) for the background

---

### $deltaColumnsAggregated(key, subkey, aggFunction1, value1, ... aggFunctionN, valueN) - if you need to calculate `delta` for higher cardinality dimension and then aggregate by lower cardinality dimension

Example usage:

```sql
$deltaColumnsAggregated(datacenter, concat(datacenter,interface) AS dc_interface, sum, tx_bytes * 1014 AS tx_kbytes, sum, max(rx_bytes) AS rx_bytes) FROM traffic
```

Query will be transformed into:

```sql
SELECT
    t,
    datacenter,
    sum(tx_kbytesDelta) AS tx_bytesDeltaAgg,
    sum(rx_bytesDelta) AS rx_bytesDeltaAgg
FROM
(
    SELECT
        t,
        datacenter,
        dc_interface,
        if(neighbor(tx_kbytes,-1,tx_kbytes) != tx_kbytes, 0, runningDifference(tx_kbytes) / 1) AS tx_kbytesDelta,
        if(neighbor(rx_bytes,-1,rx_bytes) != rx_bytes, 0, runningDifference(rx_bytes) / 1) AS rx_bytesDelta
    FROM
    (
        SELECT
            (intDiv(toUInt32(event_time), 60) * 60) * 1000 AS t,
            datacenter,
            concat(datacenter,interface) AS dc_interface,
            max(tx_bytes * 1024) AS tx_kbytes,
            max(rx_bytes) AS rx_bytes
        FROM traffic
        WHERE ((event_date >= toDate(1482796867)) AND (event_date <= toDate(1482853383))) 
          AND ((event_time >= toDateTime(1482796867)) AND (event_time <= toDateTime(1482853383)))
        GROUP BY
            t,
            datacenter,
            dc_interface
        ORDER BY
            t,
            datacenter,
            dc_interface
    )
)
GROUP BY
  t,
  datacenter
ORDER BY 
  datacenter,
  t
```

look [issue 386](https://github.com/base-14/clickhouse-grafana/issues/386) for reasons for implementation

---

### $increase(cols...) - converts query results as "non-negative delta value inside interval" for Counter-like(growing only) metrics, will zero if counter reset and delta less zero

Example usage:

```sql
$increase(Requests) FROM requests
```

Query will be transformed into:

```sql
SELECT
    t,
    if(runningDifference(max_0) < 0, 0, runningDifference(max_0) ) AS max_0_Increase
FROM
(
    SELECT
        (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
        max(Requests) AS max_0
    FROM requests
    WHERE ((EventDate >= toDate(1535711819)) AND (EventDate <= toDate(1535714715)))
    AND ((EventTime >= toDateTime(1535711819)) AND (EventTime <= toDateTime(1535714715)))
    GROUP BY t
    ORDER BY t
)
```

// see [issue 455](https://github.com/base-14/clickhouse-grafana/issues/455) for the background

---

### $increaseColumns(key, value) - is a combination of $columns and $increase for Counter-like metrics

Example usage:

```sql
$increaseColumns(Protocol, Requests) FROM requests WHERE Protocol in ('udp','tcp')
```

Query will be transformed into:

```sql
SELECT
    t,
    groupArray((increaseColumns, max_0_Increase)) AS groupArr
FROM
(
    SELECT
        t,
        Protocol,
        if (runningDifference(max_0) < 0 OR neighbor(increaseColumns,-1,increaseColumns) != increaseColumns, 0, runningDifference(max_0)) AS max_0_Increase
    FROM
    (
        SELECT
            (intDiv(toUInt32(EventTime), 60) * 60) * 1000 AS t,
            Protocol AS increaseColumns,
            max(Requests) AS max_0
        FROM requests
        WHERE ((EventDate >= toDate(1535711819)) AND (EventDate <= toDate(1535714715)))
        AND ((EventTime >= toDateTime(1535711819)) AND (EventTime <= toDateTime(1535714715)))
        AND (Protocol IN ('udp', 'tcp'))
        GROUP BY
            t,
            Protocol
        ORDER BY
            t,
            Protocol
    )
)
GROUP BY t
ORDER BY t
```

// see [issue 455](https://github.com/base-14/clickhouse-grafana/issues/455) for the background

---

### $increaseColumnsAggregated(key, subkey, aggFunction1, value1, ... aggFunctionN, valueN) - if you need to calculate `increase` for higher cardinality dimension and then aggregate by lower cardinality dimension

Example usage:

```sql
$increaseColumnsAggregated(datacenter, concat(datacenter,interface) AS dc_interface, sum, tx_bytes * 1014 AS tx_kbytes, sum, max(rx_bytes) AS rx_bytes) FROM traffic
```

Query will be transformed into:

```sql
SELECT
    t,
    datacenter,
    sum(tx_kbytesIncrease) AS tx_bytesIncreaseAgg,
    sum(rx_bytesIncrease) AS rx_bytesIncreaseAgg
FROM
(
    SELECT
        t,
        datacenter,
        dc_interface,
        if(runningDifference(tx_kbytes) < 0 OR neighbor(tx_kbytes,-1,tx_kbytes) != tx_kbytes, nan, runningDifference(tx_kbytes) / 1) AS tx_kbytesIncrease,
        if(runningDifference(rx_bytes) < 0 OR neighbor(rx_bytes,-1,rx_bytes) != rx_bytes, nan, runningDifference(rx_bytes) / 1) AS rx_bytesIncrease
    FROM
    (
        SELECT
            (intDiv(toUInt32(event_time), 60) * 60) * 1000 AS t,
            datacenter,
            concat(datacenter,interface) AS dc_interface,
            max(tx_bytes * 1024) AS tx_kbytes,
            max(rx_bytes) AS rx_bytes
        FROM traffic
        WHERE ((event_date >= toDate(1482796867)) AND (event_date <= toDate(1482853383))) 
          AND ((event_time >= toDateTime(1482796867)) AND (event_time <= toDateTime(1482853383)))
        GROUP BY
            t,
            datacenter,
            dc_interface
        ORDER BY
            t,
            datacenter,
            dc_interface
    )
)
GROUP BY
  t,
  datacenter
ORDER BY 
  datacenter,
  t
```

look [issue 386](https://github.com/base-14/clickhouse-grafana/issues/386) for reasons for implementation

---

## Templating

### Query Variable

If you add a template variable of the type `Query`, you can write a ClickHouse query that can
return things like measurement names, key names or key values that are shown as a dropdown select box.

For example, you can have a variable that contains all values for the `hostname` column in a table if you specify a query like this in the templating variable *Query* setting.

```sql
SELECT hostname FROM host
```

To use time range dependent macros like `timeFilterByColumn($column)` in your query the refresh mode of the template variable needs to be set to *On Time Range Change*.

```sql
SELECT event_name FROM event_log WHERE $timeFilterByColumn(time_column)
```

Another option is a query that can create a key/value variable. The query should return two columns that are named `__text` and `__value`. The `__text` column value should be unique (if it is not unique then the first value will use). The options in the dropdown will have a text and value that allows you to have a friendly name as text and an id as the value. An example query with `hostname` as the text and `id` as the value:

```sql
SELECT hostname AS __text, id AS __value FROM host
```

You can also create nested variables. For example if you had another variable named `region`. Then you could have the hosts variable only show hosts from the current selected region with a query like this (if `region` is a multi-value variable then use the `IN` comparison operator rather than `=` to match against multiple values):

```sql
SELECT hostname FROM host WHERE region IN ($region)
```

### Conditional Predicate

If you are using templating to feed your predicate, you will face performance degradation when everything will select as the predicate, and it's not necessary. It's also true for textbox when nothing is entered, you have to write specific sql code to handle that.

To resolve this issue a new macro $conditionalTest(SQL Predicate,$variable) can be used to remove some part of the query.
If the variable is type query with all selected or if the variable is a textbox with nothing enter, then the SQL Predicate is not include in the generated query.

To give an example:
with 2 variables
  $var query with include All option
  $text textbox
  $text_with_single_quote textbox with single quote

  The following query

  ```sql
   SELECT
     $timeSeries as t,
     count()
     FROM $table
     WHERE $timeFilter
      $conditionalTest(AND toLowerCase(column) in ($var),$var)
      $conditionalTest(AND toLowerCase(column2) like '%$text%',$text)
      $conditionalTest(AND toLowerCase(column3) ilike ${text_with_single_quote:sqlstring},$text_with_single_quote)
     GROUP BY t
     ORDER BY t
  ```

   if the `$var` is selected as "All" value, and the `$text` variable is empty, the query will be converted into:

  ```sql
    SELECT
      $timeSeries as t,
      count()
       FROM $table
       WHERE $timeFilter
     GROUP BY t
     ORDER BY t
  ```

  If the `$var` template variable have select some elements, and the `$text` template variable has at least one char, the query will be converted into:

  ```sql
  SELECT
      $timeSeries as t,
      count()
       FROM $table
       WHERE $timeFilter
     AND toLowerCase(column) in ($var)
     AND toLowerCase(column2) like '%$text%'
     GROUP BY t
     ORDER BY t
 ```
### Extended Conditional Test with Else Clause

A new signature of the macro now supports three parameters:

```sql
$conditionalTest(SQL_if, SQL_else, $variable)
 ```

If the variable is type query with all selected or if the variable is a textbox with nothing entered, then the SQL_if is included in the generated query. Otherwise, the SQL_else is included.

To give an example:
with 2 variables
  $var query with include All option
  $text textbox
  $text_with_single_quote textbox with single quote

  The following query

  ```sql
   SELECT
     $timeSeries as t,
     count()
     FROM $table
     WHERE $timeFilter
      $conditionalTest(AND toLowerCase(column) in ($var), AND toLowerCase(column) in ($var), $var)
      $conditionalTest(AND toLowerCase(column2) like '%$text%', AND toLowerCase(column2) like '%$text%', $text)
      $conditionalTest(AND toLowerCase(column3) ilike ${text_with_single_quote:sqlstring}, AND toLowerCase(column3) ilike ${text_with_single_quote:sqlstring}, $text_with_single_quote)
     GROUP BY t
     ORDER BY t
  ```

   if the `$var` is selected as "All" value, and the `$text` variable is empty, the query will be converted into:

  ```sql
    SELECT
      $timeSeries as t,
      count()
       FROM $table
       WHERE $timeFilter
     GROUP BY t
     ORDER BY t
  ```

  If the `$var` template variable have select some elements, and the `$text` template variable has at least one char, the query will be converted into:

  ```sql
  SELECT
      $timeSeries as t,
      count()
       FROM $table
       WHERE $timeFilter
     AND toLowerCase(column) in ($var)
     AND toLowerCase(column2) like '%$text%'
     GROUP BY t
     ORDER BY t
 ```
## Working with panels

### Pie Chart ([https://grafana.com/plugins/grafana-piechart-panel](https://grafana.com/plugins/grafana-piechart-panel))

Remember that pie chart plugin is not welcome for using in grafana - see [Grafana BLog - Friends don't let friends abuse pie charts](https://grafana.com/blog/2015/12/04/friends-dont-let-friends-abuse-pie-charts)

![top users](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/09_requests_by_user_pie_chart.png)

To create "Top 5" diagram we will need two queries: one for 'Top 5' rows and one for 'Other' row.

Top5:

```sql
SELECT
    1 AS t, /* fake timestamp value */
    UserName,
    sum(Requests) AS Reqs
FROM requests
GROUP BY t, UserName
ORDER BY Reqs DESC
LIMIT 5
```

Other:

```sql
SELECT
    1 AS t, /* fake timestamp value */
    UserName,
    sum(Requests) AS Reqs
FROM requests
GROUP BY t, UserName
ORDER BY Reqs DESC
LIMIT 5,10000000000000 /* select some ridiculous number after first 5 */
```

### Table view ([https://grafana.com/plugins/table](https://grafana.com/plugins/table))

There are don't contain any tricks in displaying time-series data. To print summary data, omit time column, and format the result as "Table" and press "Run query".


```sql
SELECT
    UserName,
    sum(Requests) as Reqs
FROM requests
GROUP BY
    UserName
ORDER BY
    Reqs
```

![table view](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/10_table_view.png)


### Vertical histogram ([https://grafana.com/plugins/graph](https://grafana.com/plugins/graph))

![vertical histogram](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/11_vertical_histogram.png)

To make the vertical histogram from graph panel we will need to edit some settings:

* Display -> Draw Modes -> Bars
* Axes -> X-Axis -> Mode -> Series

You can use next query:

```sql
$columns(
    Size,
    sum(Items) Items)
FROM some_table
```

// It is also possible to use query without macros

### Worldmap panel ([https://github.com/grafana/worldmap-panel](https://github.com/grafana/worldmap-panel))

![worldmap](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/12_worldmap_example.png)

If you have a table with country/city codes:

```sql
SELECT
    1,
    Country AS c,
    sum(Requests) AS Reqs
FROM requests
GLOBAL ANY INNER JOIN
(
    SELECT Country, CountryCode
    FROM countries
) USING (CountryCode)
WHERE $timeFilter
GROUP BY
    c
ORDER BY Reqs DESC
```

If you are using [geohash](https://github.com/grafana/worldmap-panel#geohashes-as-the-data-source) set following options:

![Format](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/13_worldmap_format.png)

You can make following query with `Table` formatting:

![geohash-query](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/14_worldmap_query.png)

## Ad-hoc filters

### Traditional Auto-Discovery Mode

If there is an Ad-hoc variable, plugin will fetch all columns of all tables of all databases (except system database) as tags.
So in dropdown menu will be options like `database.table.column`. If you specify the default database it will only fetch tables and columns from that database, and the dropdown menu will have an option like `table.column`.
If there are ENUM columns, the plugin will fetch their options and use them as tag values.
Also, plugin will fetch 300 unique values for fields with other types.

Plugin will apply Ad-hoc filters to all queries on the dashboard if their settings `$database` and `$table` are the same
as `database.table` specified in Ad-hoc control. If the ad-hoc filter doesn't specify a table, it will apply to all queries regardless of the table.
This is useful if the dashboard contains queries to multiple different tables.

![ad-hoc](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/15_adhoc_filter.png)

> There are no option to apply OR operator for multiple Ad-hoc filters - see grafana/grafana#10918
> There are no option to use IN operator for Ad-hoc filters due to Grafana limitations

There may be cases when CH contains too many tables and columns so their fetching could take notably amount of time. So, if you need
to have multiple dashboards with different databases using of `default database` won't help. The best way to solve this will be to have parametrized
ad-hoc variable in dashboard settings. Currently, it's not supported by Grafana interface (see [issue](https://github.com/grafana/grafana/issues/13109)).
As a temporary workaround, plugin will try to look for variable with name `adhoc_query_filter` and if it exists will use its value as query to fetch columns.
For this purpose we recommend creating some variable `constant` with the name `adhoc_query_filter` and set the value similar to the following one:

```sql
SELECT database, table, name, type FROM system.columns WHERE table='myTable' ORDER BY database, table
```

That should help to control data fetching by ad-hoc queries.

### Custom Filter Maps Mode

For better performance and control over available filters, you can now use **Custom Filter Maps** instead of auto-discovery. This feature allows you to define specific filter options manually, avoiding expensive queries against `system.columns` on large databases.

#### Benefits of Custom Filter Maps:
- **Performance**: No system queries, faster dashboard loading
- **Control**: Show only relevant filters to users
- **User Experience**: Provide meaningful labels and descriptions
- **Security**: Prevent exposure of internal database structure

#### Configuration:
1. In datasource settings, go to "Additional" section
2. Enable "Use Custom Filter Maps"
3. Define your filter maps with:
   - **Label**: User-friendly display name
   - **Field Key**: Database column name
   - **Values**: Available filter options with labels
   - **Description**: Optional explanation

#### Example Configuration:
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
    "description": "Priority level for tasks"
  }
]
```

For detailed documentation, see [Custom Filter Maps Guide](https://github.com/base-14/clickhouse-grafana/blob/master/docs/CUSTOM_FILTER_MAPS.md).

## Template variable values via Query

To use time range dependent macros like `$from` and `$to` in your query the refresh mode of the template variable needs to be set to On Time Range Change.

```sql
SELECT ClientID FROM events WHERE EventTime > toDateTime($from) AND EventTime < toDateTime($to)
```

## Annotations

Plugin support Annotations with regions. To enable this feature open Dashboard `settings` and add new annotation query with `clickhouse` datasource with properly field names.

![Annotation query add](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/16_annotations_query_add.png)

![Annotation query example](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/17_annotations_query_example.png)

![Annotation with regions graph panel](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/18_annotations_graph.png)

## Alerts support

Grafana provide two kind of alerts. Unified alerts and graph panel related alerts (legacy). 
Both kind of alerts supports by our plugin can't be used together. 
Use `GF_UNIFIED_ALERTING_ENABLED=1` (preferable) or `GF_ALERTING_ENABLED=1` environment variables for switch.

### Panel related alerts (legacy)
To enable alerts open "alerts" tab in panel, and define alert expression as described on [grafana.com](https://grafana.com/docs/grafana/latest/alerting/)

![Alerts in graph panel](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/19_alerts_tab.png)


Be careful with Template variables values, currently grafana doesn't support template variables in alert queries itself.
Also, grafana UI doesn't pass template variables values to a backend, after you change it on frontend UI.

So, the clickhouse grafana plugin can use template variables values, because we have "Generated SQL" which pass to backend "as is"
To ensure template variables values will properly pass to a backend part of the plugin.
Please choose the required template variables values for your alerts in UI dropdown,
ensure values properly rendered in "Generated SQL" (maybe need change SQL queries in query editor)
and save a whole dashboard to the Grafana server

WARNING: `Test alert` button doesn't save a current state of alert rules to a backend part of the plugin.

If the "Generated SQL" properly passed into backend part of plugin, you will see something like this:
![Graph panel with alerts](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/20_alerts_panel.png)


### Unified Alerts support

Unified alerts could be provisioned with YAML file, look to https://github.com/base-14/clickhouse-grafana/tree/master/docker/grafana/provisioning/alerting/

![Unified alerts menu](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/21_unified_alerts_menu.png)

![Unified alerts panel](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/22_unified_alerts_adding.png)

To export exists unified alerts to YAML use Export alerts

![Unified alerts export](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/24_alerts_export.png)

### Alerts troubleshooting 
To troubleshoot alerts in clickhouse grafana plugin when enable `level=debug` in `log` section `grafana.ini` or via `GF_LOG_LEVEL=debug` environment variable.

## Histogram support
![Histogram](https://github.com/base-14/clickhouse-grafana/raw/master/src/img/histogram.png)

To show Histogram you need query in format as "Time Series"

According to https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/histogram, Histograms support time series and any table results with one or more numerical fields.

## Logs support

To render your ClickHouse data as Logs, please use special format in "Format as" dropdown in Query Editor called "Logs". This option helps Grafana recognizes data as logs and shows logs visualization automatically in Explore UI. On dashboards you can use [Logs panel](https://grafana.com/docs/grafana/latest/visualizations/logs-panel/) as well.

![Format as Logs](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/23_logs_support.png)
  
To return suitable for logs data - query should return at least one time field (assumed that it will be first field) and one text field from the ClickHouse.

Plugin is also transforming all text fields, except log line, into the labels using following rules:

* Log line will be taken either from dedicated `content` field or from first in order text field in result
* All other text fields will be treated as a labels

There are few dedicated fields that are recognized by Grafana:

* `level` (string) - set the level for each log line
* `id` (string) - by default, Grafana offers basic support for deduplicating log lines, that can be improved by adding this field to explicitly assign identifiers to each log line

All other fields returned from data source will be recognized by Grafana as [detected fields](https://grafana.com/docs/grafana/latest/explore/logs-integration/#labels-and-detected-fields)

## Flamegraph support
![Format as: Flamegraph](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/25_format_as_flamegraph.png)

To show Flamegraph you need query in format as "Flame Graph"
According to https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/flame-graph/#data-api, you need to have recordset with 4 fields
- `level` - Numeric - the level of the stack frame. The root frame is level 0.
- `label` - String - the function name or other symbol which identify
- `value` - Numeric - the number of samples or bytes that were recorded in this stack trace
- `self` - Numeric - the number of samples or bytes that were recorded in only this stack frame excluding the children, for clickhouse this is usually zero, but for the last frame in stack requires `self` equals with `value` to properly flamegraph vizualization

**Moreover, rows shall be ordered by stack trace and level**

If you setup `query_profiler_real_time_period_ns` in profile or query level settings when you can try to visualize it as FlameGraph with the following query  
Look to [system.trace_log](https://clickhouse.com/docs/en/operations/system-tables/trace_log) table description for how to get data for FlameGraph
Look to [flamegraph dashboard example](https://github.com/base-14/clickhouse-grafana/blob/master/docker/grafana/dashboards/flamegraph_and_tracing_support.json) for example of dashboard with FlameGraph

### Flamegraph query example: 
```sql
SELECT length(trace)  - level_num AS level, label, count() AS value, 0 self
FROM system.trace_log
  ARRAY JOIN arrayEnumerate(trace) AS level_num,
  arrayMap(x -> if(addressToSymbol(x) != '', demangle(addressToSymbol(x)), 'unknown') , trace) AS label
WHERE trace_type='Real' AND $timeFilter
GROUP BY level, label, trace
ORDER BY trace, level
```

## Traces support
To show Traces you need query with format as "Traces" with following
![Format as Traces](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/26_format_as_trace.png)

![Trace example](https://github.com/base-14/clickhouse-grafana/raw/master/.github/images/27_traces_example.png)

For example, if `<opentelemetry_start_trace_probability>1</opentelemetry_start_trace_probability>` in user profile and `system.opentelemetry_span_log` is not emtpy, then you can show traces about clickhouse query execution
Look to [system.opentelemetry_span_log](https://clickhouse.com/docs/en/operations/system-tables/opentelemetry_span_log) table description for how to get data for FlameGraph
Look to [tracing dashboard example](https://github.com/base-14/clickhouse-grafana/blob/master/docker/grafana/dashboards/flamegraph_and_tracing_support.json) for example of dashboard with FlameGraph

Tracing visualization requires following field names (case sensitive):
- `traceID` - String
- `spanID` - String
- `operationName` - String
- `parentSpanID` - String
- `serviceName` - String
- `duration` - UInt64 - duration in milliseconds
- `startTime` - UInt64 - start time in milliseconds
- `tags` - map(String, String) - tags for span
- `serviceTags` - map(String, String) - tags for service (for example 'hostName')

### Traces query example for system.opentelemetry_span_log
```sql
SELECT
  trace_id AS traceID,
  span_id AS spanID,
  operation_name AS operationName,
  parent_span_id AS parentSpanID,
  'clickhouse' AS serviceName,
  intDiv(finish_time_us - start_time_us, 1000) AS duration,
  intDiv(start_time_us,1000) AS startTime,
  attribute AS tags,
  map('hostName',hostname) AS serviceTags
FROM
  system.opentelemetry_span_log
WHERE $timeFilter
ORDER BY traceID, startTime
```
## Configure the Datasource with Provisioning

It’s now possible to configure datasources using config files with Grafana’s provisioning system.
You can read more about how it works and all the settings you can set for datasources on the [provisioning docs page](http://docs.grafana.org/administration/provisioning/#datasources).

Here are some provisioning example:

```yaml
apiVersion: 1

datasources:
 - name: Clickhouse
   type: vertamedia-clickhouse-datasource
   access: proxy
   url: http://localhost:8123
   # <bool> enable/disable basic auth
   basicAuth: false
   # <string> basic auth username
   basicAuthUser: "default"
   # <bool> enable/disable with credentials headers
   withCredentials: false
   # <bool> mark as default datasource. Max one per org
   isDefault: false
   # <map> fields that will be converted to json and stored in json_data
   jsonData:
     # <bool> enable/disable sending 'add_http_cors_header=1' parameter
     addCorsHeader: false
     # <bool> enable/disable using POST method for sending queries
     usePOST: false
     # <bool> enable/disable using Accept-Encoding header in each request
     useCompression: false
     # <string> compression type allowed values: gzip, zstd, br, deflate
     compressionType: ""
     # <string> default database name
     defaultDatabase: ""
     # <bool> enable/disable tls authorization
     tlsAuth: false
     # <bool> enable/disable tls authorization with custom ca
     tlsAuthWithCACert: false
     # <bool> enable/disable authorization with X-ClickHouse-* headers
     useYandexCloudAuthorization: false
     # <string> X-ClickHouse-Key header value for authorization
     xHeaderUser: ""
     # <string> the same value as url when `useYandexCloudAuthorization: true` 
     # @todo remove this workaround when merge https://github.com/grafana/grafana/pull/80858
     dataSourceUrl: "http://localhost:8123"
   secureJsonData:
     # <string> X-ClickHouse-User header value for authorization
     xHeaderKey: ""
     # <string> basic auth password
     basicAuthPassword: ""
     # <string> custom certificate authority for TLS https connection, base64 encoded 
     tlsCACert: ""
     # <string> custom client certificate for TLS https connection, base64 encoded 
     tlsClientCert: ""
     # <string> custom client secret key for TLS https connection, base64 encoded 
     tlsClientKey: ""
```

Some settings and security params are the same for all datasources. You can find them [here](http://docs.grafana.org/administration/provisioning/#example-datasource-config-file).

## FAQ

> Why time series last point is not the real last point?

Plugin extrapolates last datapoint if time range is `last N` to avoid displaying of constantly decreasing graphs
when timestamp in a table is rounded to minute or bigger.
If it so then in 99% cases last datapoint will be much less than previous one, because last minute is not finished yet.
That's why plugin checks prev datapoints and tries to predict last datapoint value just as it was already written into db.
This behavior could be turned off via "Extrapolation" checkbox in query editor.

> Which table schema used in SQL query examples?

All examples in this plugin use following table schema:

```sql
CREATE TABLE IF NOT EXISTS countries(
    Country LowCardinality(String),
    CountryCode LowCardinality(String)
) ENGINE MergeTree()
ORDER BY (CountryCode, Country);

CREATE TABLE IF NOT EXISTS oses (
    OSName LowCardinality(String),
    OS LowCardinality(String)
) ENGINE MergeTree()
ORDER BY (OS);

CREATE TABLE IF NOT EXISTS requests(
    EventTime DateTime,
    EventDate Date,
    Protocol LowCardinality(String),
    UserName LowCardinality(String),
    OS LowCardinality(String),
    CountryCode LowCardinality(String),
    Type UInt8,
    Requests UInt32
) ENGINE=MergeTree()
ORDER BY (EventDate, EventTime, Type, OS, Protocol, UserName)
PARTITION BY toYYYYMM(EventDate);
```

> What about alerts support?

Alerts feature requires changes in `Grafana`'s backend, which can be extended only for Grafana 6.5+. `Grafana`'s maintainers are working on this feature.
Current alerts support for `clickhouse-grafana` datasource plugin in beta.

For clickhouse grafana plugin 2.2.3+ support only for amd64 architecture for Linux, macOS, Windows and arm64 Linux, macOS (m1).
Only amd64 prior 2.2.3 version.

## Contributing

If you have any idea for an improvement or found a bug do not hesitate to open an issue or submit a pull request.
We will appreciate any help from the community which will make working with such amazing products as ClickHouse and Grafana more convenient.

## Development

see [CONTRIBUTING.md](https://github.com/base-14/clickhouse-grafana/blob/master/CONTRIBUTING.md) for Development and Pull request Contributing instructions

License

---
MIT License, please see [LICENSE](https://github.com/base-14/clickhouse-grafana/blob/master/LICENSE) for details.
