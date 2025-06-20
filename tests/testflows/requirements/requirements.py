# These requirements were auto generated
# from software requirements specification (SRS)
# document by TestFlows v2.1.240306.1133530.
# Do not edit by hand but re-generate instead
# using 'tfs requirements generate' command.
from testflows.core import Specification
from testflows.core import Requirement

Heading = Specification.Heading

RQ_SRS_Plugin_ManualPluginInstallation = Requirement(
    name='RQ.SRS.Plugin.ManualPluginInstallation',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL be available to be installed using grafana-cli with the following command:\n'
        '\n'
        '`grafana-cli plugins install base14-clickhouse-datasource`. \n'
        '\n'
        'For installation, user need to install [Grafana] first.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='3.1.1'
)

RQ_SRS_Plugin_GrafanaCloudPluginInstallation = Requirement(
    name='RQ.SRS.Plugin.GrafanaCloudPluginInstallation',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL be available to be installed in Grafana Cloud with the following steps:\n'
        '* Go to Grafana Cloud\n'
        '* Go to Administration `>` Plugins And Data `>` Plugins\n'
        '* Find `base14 ClickHouse Datasource`\n'
        '* Click Install\n'
        '\n'
        '![configuration](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/configuration.png)\n'
        '![filter](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/filter.png)\n'
        '![add data source](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/add%20data%20source.png)\n'
        '\n'
    ),
    link=None,
    level=3,
    num='3.2.1'
)

RQ_SRS_Plugin_DockerComposeEnvironment = Requirement(
    name='RQ.SRS.Plugin.DockerComposeEnvironment',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL be available to be run using docker compose with the following commands:\n'
        '```\n'
        'docker compose run --rm frontend_builder\n'
        'docker compose run --rm backend_builder\n'
        'echo \'export GRAFANA_ACCESS_POLICY_TOKEN="{grafana_token}"\' > .release_env\n'
        'docker compose run --rm plugin_signer\n'
        'docker compose up -d grafana\n'
        '```\n'
        '\n'
    ),
    link=None,
    level=3,
    num='3.3.1'
)

RQ_SRS_Plugin = Requirement(
    name='RQ.SRS.Plugin',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support connecting the [ClickHouse] server to [Grafana].\n'
        '\n'
    ),
    link=None,
    level=2,
    num='4.1'
)

RQ_SRS_Plugin_DataSourceSetupView = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support creating a new [ClickHouse] data source by clicking the `Add new data source` button on the [Plugin] page.\n'
        'The [Plugin] SHALL open the data source setup view by clicking the `Add new data source` button.\n'
        'This view SHALL contain the following sections:\n'
        '* `Name`\n'
        '* `HTTP`\n'
        '* `Auth toggles`\n'
        '* `Use default values` toggle\n'
        '* `Custom HTTP Headers`\n'
        '* `Additional`\n'
        '\n'
        '![data source setup](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/data%20source%20setup.png)\n'
        '\n'
    ),
    link=None,
    level=2,
    num='5.1'
)

RQ_SRS_Plugin_DataSourceSetupView_SaveAndTestButton = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.SaveAndTestButton',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        "The [Plugin]'s data source setup view SHALL contain a `Save & test` button that SHALL save datasource and check if [ClickHouse]\n"
        'datasource is connected to [Grafana] correctly.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='5.2'
)

RQ_SRS_Plugin_DataSourceSetupView_DefaultValuesToggle = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesToggle',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        "The [Plugin]'s data source setup view SHALL contain a `default values` toggle that SHALL open \n"
        'default values setup menu with the following dropdowns:\n'
        '\n'
        '* `Column timestamp type`\n'
        '* `Datetime Field`\n'
        '* `Timestamp (Uint32) Field`\n'
        '* `Datetime64 Field`\n'
        '* `Date Field`\n'
        '\n'
    ),
    link=None,
    level=2,
    num='5.3'
)

RQ_SRS_Plugin_DataSourceSetupView_DefaultValuesSetup = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesSetup',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        "The [Plugin]'s data source setup view SHALL contain a default values setup menu \n"
        'that SHALL specify default values for panels that uses this datasource.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='5.4'
)

RQ_SRS_Plugin_DataSourceSetupView_DataSourceName = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.DataSourceName',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying a data source name by using the `Name` text field in the data source setup view.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='6.1'
)

RQ_SRS_Plugin_DataSourceSetupView_DefaultDataSource = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.DefaultDataSource',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying the data source as default by using the `Default` toggle in the data source setup view.\n'
        'The default data source SHALL be preselected in new panels.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='7.1'
)

RQ_SRS_Plugin_DataSourceSetupView_HTTPConnection = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying an HTTP connection using the following fields:\n'
        '\n'
        '* The `URL` text field to specify [ClickHouse] URL\n'
        '* The `Access` dropdown menu to specify `Server` or `Browser` access will be used\n'
        '* The `Allowed cookies` text field to specify cookies that SHALL not be deleted\n'
        '* The `Timeout` text field to specify the HTTP request timeout in seconds.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='8.1'
)

RQ_SRS_Plugin_DataSourceSetupView_HTTPConnection_ServerAccess = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.ServerAccess',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support connecting to the [ClickHouse] server by selecting the `Server` option in the `Access` dropdown menu\n'
        'in the data source setup view. In this case all requests SHALL be made from the browser to Grafana backend/server which in turn will forward the \n'
        "requests to the data source. The [Plugin]'s data source setup view SHALL contain `Allowed cookies` and `Timeout` text fields \n"
        'if only the `Server` option is selected in the `Access` dropdown menu.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='9.1'
)

RQ_SRS_Plugin_DataSourceSetupView_HTTPConnection_BrowserAccess = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.BrowserAccess',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support connecting to the [ClickHouse] server by selecting the `Browser` option in the `Access` dropdown menu\n'
        'in the data source setup view. In this case all requests SHALL be made from the browser directly to the data source.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='10.1'
)

RQ_SRS_Plugin_DataSourceSetupView_Auth = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.Auth',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying authentication details by specifying the following toggles:\n'
        '\n'
        '* `Basic auth`\n'
        '* `TLS Client Auth`\n'
        '* `Skip TLS Verify`\n'
        '* `Forward OAuth Identity`\n'
        '* `With Credentials`\n'
        '* `With CA Cert`\n'
        '\n'
    ),
    link=None,
    level=2,
    num='11.1'
)

RQ_SRS_Plugin_DataSourceSetupView_BasicAuth = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.BasicAuth',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying username and password for the [ClickHouse] server by turning on the `Basic auth` toggle\n'
        'and specifying username and password in the `User` and `Password` text fields, respectively. The `Password` text field SHALL \n'
        'be able to be empty. The [Plugin] SHALL add the `Basic Auth Details` section to the data source setup view only if the `Basic auth`\n'
        'toggle is on.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='12.1'
)

RQ_SRS_Plugin_DataSourceSetupView_TLS_SSLAuthDetails = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.TLS/SSLAuthDetails',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying server name, client certificate, and client key for the [ClickHouse] server by turning on \n'
        'the `TLS Client Auth` toggle and specifying these options in the `ServerName`, `Client Cert`, and `Client Key` text fields, respectively. \n'
        'The [Plugin] SHALL add `ServerName`, `Client Cert`, and `Client Key` text fields to the data source setup view only if the \n'
        '`TLS Client Auth` toggle is on.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='13.1'
)

RQ_SRS_Plugin_DataSourceSetupView_ForwardOAuthIdentity = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.ForwardOAuthIdentity',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support Forward OAuth Identity by turning on the `Forward OAuth Identity` toggle.\n'
        "The [Plugin] SHALL forward the user's upstream OAuth identity to the data source if this toggle is on.\n"
        '\n'
    ),
    link=None,
    level=2,
    num='14.1'
)

RQ_SRS_Plugin_DataSourceSetupView_WithCredentials = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.WithCredentials',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support sending credentials such as cookies or authentication headers with cross-site \n'
        'requests by turning on the `With Credentials` toggle.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='15.1'
)

RQ_SRS_Plugin_DataSourceSetupView_Auth_WithCACert = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.Auth.WithCACert',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying the CA certificate that will be used to access the [ClickHouse] server \n'
        'by turning on the `With CA Cert` toggle and specifying the `CA Cert` text field. The [Plugin] SHALL add the \n'
        '`CA Cert` text field to the data source setup view only if the `TLS Client Auth` toggle is on.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='16.1'
)

RQ_SRS_Plugin_DataSourceSetupView_Auth_SkipTLSVerify = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.Auth.SkipTLSVerify',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support connecting to clickhouse using HTTPS connection without specifying CA certificate\n'
        'by turning on `Skip TLS verify` toggle.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='17.1'
)

RQ_SRS_Plugin_DataSourceSetupView_CustomHTTPHeaders = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.CustomHTTPHeaders',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support custom HTTP headers that will be used for HTTP requests to the [ClickHouse] server \n'
        'by pressing the `Add Header` button and specifying the `Header` and `Value` text fields.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='18.1'
)

RQ_SRS_Plugin_DataSourceSetupView_DeletingCustomHTTPHeaders = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.DeletingCustomHTTPHeaders',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support deleting custom HTTP headers by clicking the bucket button nearby this header.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='18.2'
)

RQ_SRS_Plugin_DataSourceSetupView_UseYandexCloudAuthorizationHeaders = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.UseYandexCloudAuthorizationHeaders',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support connection to managed Yandex.Cloud [ClickHouse] database setup by turning on the \n'
        '`Use Yandex.Cloud authorization headers` toggle and specifying the `X-ClickHouse-User` and `X-ClickHouse-Key` \n'
        'text fields.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='19.1'
)

RQ_SRS_Plugin_DataSourceSetupView_AddCORSFlagToRequests = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.AddCORSFlagToRequests',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support adding the [CORS] flag to requests by turning on the `Add CORS flag to requests` toggle.\n'
        'If this toggle is on, the [Plugin] SHALL attach `add_http_cors_header=1` to requests.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='20.1'
)

RQ_SRS_Plugin_DataSourceSetupView_UsePostRequests = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.UsePostRequests',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying the use of POST requests to the [ClickHouse] server by turning on the \n'
        '`Use POST method to send queries` toggle.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='21.1'
)

RQ_SRS_Plugin_DataSourceSetupView_DefaultDatabase = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.DefaultDatabase',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying the default [ClickHouse] server database by using the `Default database` text field.\n'
        'This database name SHALL be prefilled in the query builder.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='22.1'
)

RQ_SRS_Plugin_DataSourceSetupView_HTTPCompression = Requirement(
    name='RQ.SRS.Plugin.DataSourceSetupView.HTTPCompression',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying HTTP compression option by using the `HTTP Compression` toggle.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='23.1'
)

RQ_SRS_Plugin_Dashboards = Requirement(
    name='RQ.SRS.Plugin.Dashboards',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support creating dashboards with panels that use the [ClickHouse] data source that was created using the [Plugin].\n'
        '\n'
    ),
    link=None,
    level=2,
    num='24.1'
)

RQ_SRS_Plugin_Panels = Requirement(
    name='RQ.SRS.Plugin.Panels',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support creating panels for the [ClickHouse] data source if the [ClickHouse] data source \n'
        'was created using the [Plugin].\n'
        '\n'
    ),
    link=None,
    level=2,
    num='25.1'
)

RQ_SRS_Plugin_Panels_Repeated = Requirement(
    name='RQ.SRS.Plugin.Panels.Repeated',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support creating more than 1 panel by defining 1 panel and using variables.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='25.2'
)

RQ_SRS_Plugin_MultiUserUsage = Requirement(
    name='RQ.SRS.Plugin.MultiUserUsage',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support multi-user usage of the [Clickhouse] data source that was created using the [Plugin].\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='26.1'
)

RQ_SRS_Plugin_MultiUserUsage_SamePanel = Requirement(
    name='RQ.SRS.Plugin.MultiUserUsage.SamePanel',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support access for the same panel from different users at the same time.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='26.2'
)

RQ_SRS_Plugin_MultiUserUsage_DifferentPanels = Requirement(
    name='RQ.SRS.Plugin.MultiUserUsage.DifferentPanels',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support access for different panels from different users at the same time.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='26.3'
)

RQ_SRS_Plugin_MultiUserUsage_SameDashboard = Requirement(
    name='RQ.SRS.Plugin.MultiUserUsage.SameDashboard',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support access for the same dashboard from different users at the same time.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='26.4'
)

RQ_SRS_Plugin_MultiUserUsage_DifferentDashboards = Requirement(
    name='RQ.SRS.Plugin.MultiUserUsage.DifferentDashboards',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support access for different dashboards from different users at the same time.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='26.5'
)

RQ_SRS_Plugin_QuerySetup = Requirement(
    name='RQ.SRS.Plugin.QuerySetup',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support creating Grafana visualizations using the query setup interface and raw SQL editor.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='27.1'
)

RQ_SRS_Plugin_QuerySettings = Requirement(
    name='RQ.SRS.Plugin.QuerySettings',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        "The [Plugin]'s query setup interface SHALL contain the following fields:\n"
        '\n'
        "* `FROM` - `Database` and `Table` dropdown's that allow the user to specify the database and table for the query\n"
        '* `Column timestamp type` - dropdown of types `DateTime`, `DateTime64`, or `UInt32`\n'
        "* `Timestamp Column` - dropdown of the table's timestamp columns with a type defined in `Column timestamp type`\n"
        "* `Date column` - dropdown of the table's data columns `Date` and `Date32` type\n"
        '* `Go to Query` - button to switch to the raw SQL editor\n'
        '* `Add query` - button to add more than one query\n'
        '* `Expression` - button to add expressions to the query.\n'
        '\n'
        '![query settings](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/query%20settings.png)\n'
        '\n'
    ),
    link=None,
    level=2,
    num='28.1'
)

RQ_SRS_Plugin_QueryOptions = Requirement(
    name='RQ.SRS.Plugin.QueryOptions',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the following options for the query:\n'
        '\n'
        '* `Max data points`\n'
        '* `Min interval`\n'
        '* `Interval`\n'
        '* `Relative time`\n'
        '* `Time shift`\n'
        '* `Hide time info`\n'
        '\n'
        '![query options](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/query%20options.png)\n'
        '\n'
    ),
    link=None,
    level=2,
    num='29.1'
)

RQ_SRS_Plugin_QueryOptions_MaxDataPoints = Requirement(
    name='RQ.SRS.Plugin.QueryOptions.MaxDataPoints',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying maximum data points per series using `Max data points` text field.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='29.2.1'
)

RQ_SRS_Plugin_QueryOptions_MinInterval = Requirement(
    name='RQ.SRS.Plugin.QueryOptions.MinInterval',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying lower limit for the interval using `Min interval` text field.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='29.3.1'
)

RQ_SRS_Plugin_QueryOptions_Interval = Requirement(
    name='RQ.SRS.Plugin.QueryOptions.Interval',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL evaluate interval that is used in $__interval and $__interval_ms macro. \n'
        'This interval SHALL be displayed in `Interval` text field.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='29.4.1'
)

RQ_SRS_Plugin_QueryOptions_RelativeTime = Requirement(
    name='RQ.SRS.Plugin.QueryOptions.RelativeTime',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying relative time using `Relative time` text field.\n'
        'This relative time SHALL override the relative time range for individual panel.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='29.5.1'
)

RQ_SRS_Plugin_QueryOptions_TimeShift = Requirement(
    name='RQ.SRS.Plugin.QueryOptions.TimeShift',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying time shift using `Time shift` text field.\n'
        'This relative time SHALL override the time range for individual panel \n'
        'by shifting its start and end relative to the time picker.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='29.6.1'
)

RQ_SRS_Plugin_QueryOptions_HideTimeInfo = Requirement(
    name='RQ.SRS.Plugin.QueryOptions.HideTimeInfo',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `Hide time info` toggle. \n'
        'This toggle SHALL hide time info regarding relative time and time shift in panel title if turned on. \n'
        '\n'
    ),
    link=None,
    level=3,
    num='29.7.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        "The [Plugin]'s raw SQL editor interface SHALL contain the following fields:\n"
        '\n'
        '* SQL editor\n'
        '* `Add Metadata`\n'
        '* `Extrapolation`\n'
        '* `Skip Comments`\n'
        '* `Step`\n'
        '* `Round`\n'
        '* `Resolution`\n'
        '* `Format As`\n'
        '* `Show help`\n'
        '* `Show generated SQL`\n'
        '* `Reformat Query`\n'
        '\n'
        '![sql editor](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/sql%20editor.png)\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='30.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_SQLEditor = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.SQLEditor',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying SQL query by using SQL Editor text field for SQL query.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='30.2'
)

RQ_SRS_Plugin_RawSQLEditorInterface_AddMetadata = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.AddMetadata',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support turning on and off adding metadata for queries in reformatted query\n'
        'for visualizations using the `Add Metadata` toggle.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.3.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_Extrapolation = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.Extrapolation',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support turning on and off extrapolation for visualizations using the `Extrapolation` toggle.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.4.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_SkipComments = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.SkipComments',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support turning on and off sending comments to [ClickHouse] server by using the `Skip Comments` toggle.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.5.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_Step = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.Step',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying the grid step on the graphs by using the `Step` text field.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.6.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_Round = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.Round',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying rounding for the timestamps by using the `Round` text field.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='30.8'
)

RQ_SRS_Plugin_RawSQLEditorInterface_Resolution = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.Resolution',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support specifying resolution for graphs by using the `Resolution` dropdown menu.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.9.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_FormatAs = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.FormatAs',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support choosing the visualization type by using the `Format As` dropdown menu.\n'
        'The following types SHALL be supported: `Time series`, `Table`, `Logs`, `Trace`, `Flamegraph`.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.10.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_ShowHelp = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.ShowHelp',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL allow user to get information about macros and functions by clicking `Show help` button.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.11.1'
)

RQ_SRS_Plugin_RawSQLEditorInterface_ShowGeneratedSQL = Requirement(
    name='RQ.SRS.Plugin.RawSQLEditorInterface.ShowGeneratedSQL',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL allow user to get generated SQL query in raw form without macros and functions by clicking `Show generated SQL` button.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='30.11.2'
)

RQ_SRS_Plugin_AutoCompleteInQueries = Requirement(
    name='RQ.SRS.Plugin.AutoCompleteInQueries',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support auto-complete in queries for field names and table names.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='31.1'
)

RQ_SRS_Plugin_TimeRangeSelector = Requirement(
    name='RQ.SRS.Plugin.TimeRangeSelector',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support a time range selector for visualization using the time range dropdown menu.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='32.1'
)

RQ_SRS_Plugin_TimeRangeSelector_Zoom = Requirement(
    name='RQ.SRS.Plugin.TimeRangeSelector.Zoom',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support zooming in by selecting an area on the graph and zooming out by double-clicking on the graph.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='32.2'
)

RQ_SRS_Plugin_FillActual = Requirement(
    name='RQ.SRS.Plugin.FillActual',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support changing the size of the graph by clicking `Fill`/`Actual` toggle.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='33.1'
)

RQ_SRS_Plugin_RefreshDataboard = Requirement(
    name='RQ.SRS.Plugin.RefreshDataboard',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support refreshing visualization by clicking the `Refresh` button.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='34.1'
)

RQ_SRS_Plugin_QueryInspector = Requirement(
    name='RQ.SRS.Plugin.QueryInspector',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support inspecting queries by clicking `Query inspector`.\n'
        'The [Plugin] SHALL allow user to check data returned by query in the `Data` tab, request stats in the `Stats` tab, \n'
        'panel in JSON format in the `JSON` tab, request information in the `Query` tab.\n'
        '\n'
        '![query inspector](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/query%20inspector.png)\n'
        '\n'
    ),
    link=None,
    level=2,
    num='35.1'
)

RQ_SRS_Plugin_QueryInspector_QueryTab = Requirement(
    name='RQ.SRS.Plugin.QueryInspector.QueryTab',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support getting information about requests in the `Query` tab by clicking the `Refresh` button.\n'
        'This tab SHALL have an `Expand all` or `Collapse all` button to expand or collapse request information.\n'
        'This tab SHALL have a `Copy to clipboard` button to copy request information to clipboard.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='35.2'
)

RQ_SRS_Plugin_Visualization = Requirement(
    name='RQ.SRS.Plugin.Visualization',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL display visualization on changing attention.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='36.1'
)

RQ_SRS_Plugin_Visualization_Table = Requirement(
    name='RQ.SRS.Plugin.Visualization.Table',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support table view for data.\n'
        '\n'
    ),
    link=None,
    level=3,
    num='36.3.1'
)

RQ_SRS_Plugin_Visualization_VisualizationTypes = Requirement(
    name='RQ.SRS.Plugin.Visualization.VisualizationTypes',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the following visualization types for any supported clickhouse data types:\n'
        '\n'
        '* Time series\n'
        '* Bar chart\n'
        '* Stat\n'
        '* Gauge\n'
        '* Bar Gauge\n'
        '* Pie chart\n'
        '* State timeline\n'
        '* Heatmap\n'
        '* Status history\n'
        '* Histogram\n'
        '* Text\n'
        '* Alert List\n'
        '* Dashboard list\n'
        '* News\n'
        '* Annotation list\n'
        '* Candlestick\n'
        '* Canvas\n'
        '* Flame Graph\n'
        '* Geomap\n'
        '* Logs\n'
        '* Node Graph\n'
        '* Traces\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='36.4.1'
)

RQ_SRS_Plugin_QuerySettings_Macros = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the following macroces:\n'
        '\n'
        '* `$table`\n'
        '* `$dateCol`\n'
        '* `$dateTimeCol`\n'
        '* `$from`\n'
        '* `$to`\n'
        '* `$interval`\n'
        '* `$timeFilter`\n'
        '* `$timeFilterByColumn($column)`\n'
        '* `$timeSeries`\n'
        '* `$naturalTimeSeries`\n'
        '* `$unescape($variable)`\n'
        '* `$adhoc`\n'
        '\n'
        'A description of macros SHALL be available by typing their names in raw SQL editor interface.\n'
        '\n'
        'https://github.com/Altinity/clickhouse-grafana?tab=readme-ov-file#macros-support\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.1'
)

RQ_SRS_Plugin_QuerySettings_Macros_Table = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.Table',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$table` macro in SQL editor. `$table` macro SHALL be replaced with selected table name from query setup interface. \n'
        '$table macro SHALL correctly escape any symbols that can be in [ClickHouse] table name.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.2'
)

RQ_SRS_Plugin_QuerySettings_Macros_DateCol = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.DateCol',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$dateCol` macro in SQL editor. `$dateCol` macro SHALL be replaced with selected Column:Date from query setup interface.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.3'
)

RQ_SRS_Plugin_QuerySettings_Macros_DateTimeCol = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.DateTimeCol',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$dateTimeCol` macro in SQL editor. `$dateTimeCol` macro SHALL be replaced with Column:DateTime or Column:TimeStamp value from query setup interface.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.4'
)

RQ_SRS_Plugin_QuerySettings_Macros_From = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.From',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$from` macro in SQL editor. `$from` macro SHALL be replaced with (timestamp with ms)/1000 value of UI selected `Time Range:From`.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.5'
)

RQ_SRS_Plugin_QuerySettings_Macros_To = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.To',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$to` macro in SQL editor. `$to` macro SHALL be replaced with (timestamp with ms)/1000 value of UI selected `Time Range:To`.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.6'
)

RQ_SRS_Plugin_QuerySettings_Macros_Interval = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.Interval',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$interval` macro in SQL editor. `$interval` macro SHALL be replaced with selected "Group by a time interval" value in seconds.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.7'
)

RQ_SRS_Plugin_QuerySettings_Macros_TimeFilterByColumn = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.TimeFilterByColumn',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$timeFilterByColumn($column)` macro in SQL edior. `$timeFilterByColumn($column)` macro SHALL be replaced with currently \n'
        'selected `Time Range` for a column passed as $column argument. `$timeFilterByColumn($column)` macro SHALL work with any clickhouse date or time type. \n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.8'
)

RQ_SRS_Plugin_QuerySettings_Macros_TimeSeries = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.TimeSeries',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$timeSeries` macro in SQL editor. `$timeSeries` macro SHALL be replaced with special [ClickHouse] construction \n'
        'to convert results as time-series data.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.9'
)

RQ_SRS_Plugin_QuerySettings_Macros_NaturalTimeSeries = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.NaturalTimeSeries',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$naturalTimeSeries` macro in SQL editor. `$naturalTimeSeries` macro SHALL be replaced with special [ClickHouse] \n'
        'construction to convert results as time-series with in a logical/natural breakdown.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.10'
)

RQ_SRS_Plugin_QuerySettings_Macros_Unescape = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.Unescape',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$unescape($variable)` macro in SQL editor. `$unescape($variable)` macro SHALL be replaced with variable \n'
        'value without single quotes.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.11'
)

RQ_SRS_Plugin_QuerySettings_Macros_Adhoc = Requirement(
    name='RQ.SRS.Plugin.QuerySettings.Macros.Adhoc',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support `$adhoc` macro in SQL editor. `$adhoc` macro SHALL be replaced with a rendered ad-hoc filter expression, \n'
        'or "1" if no ad-hoc filters exist. Adhoc filter SHALL support evaluating varchar field with numeric value.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='37.12'
)

RQ_SRS_Plugin_Variables = Requirement(
    name='RQ.SRS.Plugin.Variables',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support [Grafana] variables setup for dashboards by clicking gear button and \n'
        'setting up variables in the `Variables` tab. The [Plugin] SHALL support the following variable types:\n'
        '* `Query`\n'
        '* `Custom`\n'
        '* `Text box`\n'
        '* `Constant`\n'
        '* `Data source`\n'
        '* `Interval`\n'
        '* `Ad hoc filter`\n'
        '\n'
    ),
    link=None,
    level=2,
    num='38.1'
)

RQ_SRS_Plugin_Annotations = Requirement(
    name='RQ.SRS.Plugin.Annotations',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support [Grafana] annotations setup for dashboards by clicking gear button and \n'
        'setting up variables in the `Annotations` tab.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='39.1'
)

RQ_SRS_Plugin_Alerts = Requirement(
    name='RQ.SRS.Plugin.Alerts',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support [Grafana] alerts setup for panels by clicking `New alert rule` button in `Alert rule` tab\n'
        'in edit panel view.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='40.1'
)

RQ_SRS_Plugin_Alerts_AlertSetupPage = Requirement(
    name='RQ.SRS.Plugin.Alerts.AlertSetupPage',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL allow defining query and alert condition by using query setup interface and raw SQL editor in alert setup page.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='40.2'
)

RQ_SRS_Plugin_Alerts_UnifiedAlerts = Requirement(
    name='RQ.SRS.Plugin.Alerts.UnifiedAlerts',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support unified alerts defined in `Alerting > Alert rules` page.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='40.3'
)

RQ_SRS_Plugin_Alerts_LegacyAlerts = Requirement(
    name='RQ.SRS.Plugin.Alerts.LegacyAlerts',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support legacy alerts for grafana version less or equal 10.\n'
        'This Alerts SHALL be defined in panel page for each individual panel.\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='40.4'
)

RQ_SRS_Plugin_Functions = Requirement(
    name='RQ.SRS.Plugin.Functions',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the following functions in SQL queries:\n'
        '\n'
        '* `$rate` \n'
        '* `$columns`\n'
        '* `$rateColumns`\n'
        '* `$perSecond`\n'
        '* `$perSecondColumns`\n'
        '* `$delta`\n'
        '* `$deltaColumns`\n'
        '* `$increase`\n'
        '* `$increaseColumns`\n'
        '* `$lttb`\n'
        '\n'
        'These functions are templates of SQL queries. The user SHALL be allowed to check queries in the expanded format in the raw SQL editor interface.\n'
        'Only one function per query is allowed. \n'
        '\n'
        'Each function argument parsed on full argument and reduced argument. If reduced argument is absent it replaced with full argument.\n'
        'Each function replaces `${function}` with construction with arguments in SQL query.\n'
        'Functions SHALL not be replaced if query contains `${function}` with wrong argument count, or it cannot be parsed as `${function}(arg1, arg2) FROM table`\n'
        '\n'
        'https://github.com/Altinity/clickhouse-grafana?tab=readme-ov-file#functions\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='41.1'
)

RQ_SRS_Plugin_Functions_Columns = Requirement(
    name='RQ.SRS.Plugin.Functions.Columns',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$columns(key, value)` function in SQL editor. This function SHALL query values as array of [key, value], \n'
        'where key will be used as label. The [Plugin] SHALL support $columns function with fill option in query.\n'
        'The [Plugin] SHALL replace `$columns(key as k, value as v) from table_name` with the following:\n'
        '```\n'
        'SELECT t, groupArray((k, v)) AS groupArr FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v from table_name WHERE {time_condition} GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
    ),
    link=None,
    level=2,
    num='41.2'
)

RQ_SRS_Plugin_Functions_Rate = Requirement(
    name='RQ.SRS.Plugin.Functions.Rate',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$rate` function in SQL editor. This function SHALL convert query results as "change rate per interval".\n'
        'The [Plugin] SHALL replace `$rate(first_variable as a, second_variable as b) from table_name` with the following:\n'
        '```\n'
        'SELECT t, a/runningDifference(t/1000) aRate, b/runningDifference(t/1000) bRate FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, first_variable as a, second_variable as b from table_name WHERE {time_condition} GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.3.1'
)

RQ_SRS_Plugin_Functions_RateColumns = Requirement(
    name='RQ.SRS.Plugin.Functions.RateColumns',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$rateColumns` function in SQL editor. This function SHALL be a combination of $columns and $rate functions.\n'
        'The [Plugin] SHALL replace `$rateColumns(key as k, value as v) FROM table_name` with the following:\n'
        '```\n'
        'SELECT t, arrayMap(a -> (a.1, a.2/runningDifference( t/1000 )), groupArr) FROM (SELECT t, groupArray((k, v)) AS groupArr FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v FROM table_name WHERE {time_condition} GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.3.2'
)

RQ_SRS_Plugin_Functions_RateColumnsAggregated = Requirement(
    name='RQ.SRS.Plugin.Functions.RateColumnsAggregated',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$rateColumnsAggregated` function in SQL editor. This function SHALL calculate rate for higher cardinality dimension and then aggregate by lower cardinality dimension.\n'
        'The [Plugin] SHALL replace `$rateColumnsAggregated(key as k, subkey as s, fun1 as f, val1 as v) from table_name` with the following:\n'
        '```\n'
        'SELECT t, k, fun1 as f(vRate) AS vRateAgg FROM (  SELECT t, k, s, v / runningDifference(t / 1000) AS vRate  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, subkey as s, max(val1) AS v   from table_name WHERE {time_condition}   GROUP BY k, s, t    ORDER BY k, s, t  ) ) GROUP BY k, t ORDER BY k, t\n'
        '```\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.3.3'
)

RQ_SRS_Plugin_Functions_PerSecond = Requirement(
    name='RQ.SRS.Plugin.Functions.PerSecond',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$perSecond` function in SQL editor. This function SHALL convert query results as "change rate per interval" \n'
        'for Counter-like(growing only) metrics.\n'
        'The [Plugin] SHALL replace `$perSecond(first_variable as a, second_variable as b) FROM table_name` with the following:\n'
        '```\n'
        'SELECT t, if(runningDifference(max_0) < 0, nan, runningDifference(max_0) / runningDifference(t/1000)) AS max_0_PerSecond, if(runningDifference(max_1) < 0, nan, runningDifference(max_1) / runningDifference(t/1000)) AS max_1_PerSecond FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, max(first_variable as a) AS max_0, max(second_variable as b) AS max_1 FROM table_name WHERE {time_condition} GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.4.1'
)

RQ_SRS_Plugin_Functions_PerSecondColumns = Requirement(
    name='RQ.SRS.Plugin.Functions.PerSecondColumns',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$perSecondColumns` function in SQL editor. This function SHALL be a combination of $columns and $perSecond \n'
        'functions for Counter-like metrics.\n'
        'The [Plugin] SHALL replace `$perSecondColumns(key as k, value as v) FROM table_name` with the following:\n'
        '```\n'
        'SELECT t, groupArray((k, max_0_PerSecond)) AS groupArr FROM ( SELECT t, k, if(runningDifference(max_0) < 0 OR neighbor(k,-1,k) != k, nan, runningDifference(max_0) / runningDifference(t/1000)) AS max_0_PerSecond FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, max(value as v) AS max_0 FROM table_name WHERE {time_condition} GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.4.2'
)

RQ_SRS_Plugin_Functions_PerSecondColumnsAggregated = Requirement(
    name='RQ.SRS.Plugin.Functions.PerSecondColumnsAggregated',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$perSecondColumnsAggregated` function in SQL editor. This function SHALL calculate perSecond for higher cardinality dimension and then aggregate by lower cardinality dimension.\n'
        'The [Plugin] SHALL replace `$perSecondColumnsAggregated(key as k, value as v, fun1 as f, val1 as v) FROM table_name` with the following:\n'
        '```\n'
        'SELECT t, k, fun1 as f(vPerSecond) AS vPerSecondAgg FROM (  SELECT t, k, v, if(runningDifference(v) < 0 OR neighbor(v,-1,v) != v, nan, runningDifference(v) / runningDifference(t / 1000)) AS vPerSecond  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v, max(val1) AS v   FROM table_name WHERE {time_condition}  GROUP BY k, v, t    ORDER BY k, v, t  ) ) GROUP BY k, t ORDER BY k, t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.4.3'
)

RQ_SRS_Plugin_Functions_Delta = Requirement(
    name='RQ.SRS.Plugin.Functions.Delta',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$delta` function in SQL editor. This function SHALL convert query results as "delta value inside interval" \n'
        'for Counter-like(growing only) metrics, will negative if counter reset.\n'
        'The [Plugin] SHALL replace `$delta(first_variable as a, second_variable as b) from table_name` with the following:\n'
        '```\n'
        'SELECT t, runningDifference(max_0) AS max_0_Delta, runningDifference(max_1) AS max_1_Delta FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, max(first_variable as a) AS max_0, max(second_variable as b) AS max_1 from table_name WHERE {time_condition} GROUP BY t ORDER BY t)\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.5.1'
)

RQ_SRS_Plugin_Functions_DeltaColumns = Requirement(
    name='RQ.SRS.Plugin.Functions.DeltaColumns',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$deltaColumns` function in SQL editor. This function SHALL be a combination of $columns and $delta \n'
        'functions for Counter-like metrics.\n'
        'The [Plugin] SHALL replace `$deltaColumns(key as k, value as v) FROM table_name` with the following:\n'
        '```\n'
        'SELECT t, groupArray((k, max_0_Delta)) AS groupArr FROM ( SELECT t, k, if(neighbor(k,-1,k) != k, 0, runningDifference(max_0)) AS max_0_Delta FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, max(value as v) AS max_0 FROM table_name WHERE {time_condition} GROUP BY t, k ORDER BY k, t)) GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.5.2'
)

RQ_SRS_Plugin_Functions_DeltaColumnsAggregated = Requirement(
    name='RQ.SRS.Plugin.Functions.DeltaColumnsAggregated',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$deltaColumnsAggregated` function in SQL editor. This function SHALL calculate delta for higher cardinality dimension and then aggregate by lower cardinality dimension.\n'
        'functions for Counter-like metrics.\n'
        'The [Plugin] SHALL replace `$deltaColumnsAggregated(key as k, value as v) FROM table_name` with the following:\n'
        '```\n'
        'SELECT t, k, fun1 as f(vDelta) AS vDeltaAgg FROM (  SELECT t, k, v, if(neighbor(v,-1,v) != v, 0, runningDifference(v) / 1) AS vDelta  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v, max(val1) AS v   from table_name WHERE {time_condition}   GROUP BY k, v, t    ORDER BY k, v, t  ) ) GROUP BY k, t ORDER BY k, t\n'
        '```\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.5.3'
)

RQ_SRS_Plugin_Functions_Increase = Requirement(
    name='RQ.SRS.Plugin.Functions.Increase',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$increase` function in SQL editor. This function SHALL convert query results as "non-negative delta value inside interval" \n'
        'for Counter-like(growing only) metrics, will zero if counter reset and delta less zero.\n'
        'The [Plugin] SHALL replace `$increase(first_variable as a, second_variable as b) from table_name` with the following:\n'
        '```\n'
        'SELECT t, groupArray((k, v)) AS groupArr FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v from table_name WHERE {time_condition} GROUP BY t ORDER BY t)\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.6.1'
)

RQ_SRS_Plugin_Functions_IncreaseColumns = Requirement(
    name='RQ.SRS.Plugin.Functions.IncreaseColumns',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$increaseColumns` function in SQL editor. This function SHALL be a combination of $columns and $increase \n'
        'functions for Counter-like metrics.\n'
        'The [Plugin] SHALL replace `$increaseColumns(key as k, value as v) from table_name` with the following:\n'
        '```\n'
        'SELECT t, groupArray((a, max_0_Increase)) AS groupArr FROM ( SELECT t, a, if(runningDifference(max_0) < 0 OR neighbor(a,-1,a) != a, 0, runningDifference(max_0)) AS max_0_Increase FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, first_variable as a, max(second_variable as b) AS max_0 from table_name WHERE {time_condition} GROUP BY t, a ORDER BY a, t)) GROUP BY t ORDER BY t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.6.2'
)

RQ_SRS_Plugin_Functions_IncreaseColumnsAggregated = Requirement(
    name='RQ.SRS.Plugin.Functions.IncreaseColumnsAggregated',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$increaseColumnsAggregated` function in SQL editor. This function SHALL calculate delta for higher cardinality dimension and then aggregate by lower cardinality dimension.\n'
        'The [Plugin] SHALL replace `$increaseColumnsAggregated(key as k, value as v, fun1 as f, val1 as v) from table_name` with the following:\n'
        '```\n'
        'SELECT t, k, fun1 as f(vIncrease) AS vIncreaseAgg FROM (  SELECT t, k, v, if(runningDifference(v) < 0 OR neighbor(v,-1,v) != v, nan, runningDifference(v) / 1) AS vIncrease  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v, max(val1) AS v   from table_name WHERE {time_condition}   GROUP BY k, v, t    ORDER BY k, v, t  ) ) GROUP BY k, t ORDER BY k, t\n'
        '```\n'
        '\n'
        '\n'
    ),
    link=None,
    level=3,
    num='41.6.3'
)

RQ_SRS_Plugin_Functions_Lttb = Requirement(
    name='RQ.SRS.Plugin.Functions.Lttb',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support the `$lttb` function in SQL editor.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='41.7'
)

RQ_SRS_Plugin_Functions_SubQuery = Requirement(
    name='RQ.SRS.Plugin.Functions.SubQuery',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support sub queries in SQL editor.\n'
        '\n'
    ),
    link=None,
    level=2,
    num='41.8'
)

RQ_SRS_Plugin_SupportedDataTypes = Requirement(
    name='RQ.SRS.Plugin.SupportedDataTypes',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support scalar data types. The following data types SHALL be supported:\n'
        '\n'
        '\n'
        '\n'
        '| Data Type                                                                           | Supported in Grafana |\n'
        '| ----------------------------------------------------------------------------------- |:--------------------:|\n'
        '| UInt8, UInt16, UInt32, UInt64, UInt128, UInt256                                     |       &#10004;       |\n'
        '| Int8, Int16, Int32, Int64, Int128, Int256                                           |       &#10004;       |\n'
        '| Float32, Float64                                                                    |       &#10004;       |\n'
        '| Decimal(P), Decimal(P, S), Decimal32(S), Decimal64(S), Decimal128(S), Decimal256(S) |       &#10004;       |\n'
        '| Bool                                                                                |       &#10004;       |\n'
        '| String                                                                              |       &#10004;       |\n'
        '| FixedString(N)                                                                      |       &#10004;       |\n'
        '| Date, Date32, DateTime, DateTime64                                                  |       &#10004;       |\n'
        '| JSON                                                                                |       &#10060;       |\n'
        '| UUID                                                                                |       &#10004;       |\n'
        '| Enum                                                                                |       &#10004;       |\n'
        '| LowCardinality                                                                      |       &#10004;       |\n'
        '| Array                                                                               |       &#10060;       |\n'
        '| Map                                                                                 |       &#10060;       |\n'
        '| SimpleAggregateFunction                                                             |       &#10004;       |\n'
        '| AggregateFunction                                                                   |       &#10004;       |\n'
        '| Nested                                                                              |       &#10060;       |\n'
        '| Tuple                                                                               |       &#10060;       |\n'
        '| Nullable                                                                            |       &#10004;       |\n'
        '| IPv4                                                                                |       &#10004;       |\n'
        '| IPv6                                                                                |       &#10004;       |\n'
        '| Point                                                                               |       &#10060;       |\n'
        '| Ring                                                                                |       &#10060;       |\n'
        '| Polygon                                                                             |       &#10060;       |\n'
        '| MultiPolygon                                                                        |       &#10060;       |\n'
        '| Expression                                                                          |       &#10060;       |\n'
        '| Set                                                                                 |       &#10060;       |\n'
        '| Nothing                                                                             |       &#10060;       |\n'
        '| Interval                                                                            |       &#10060;       |\n'
        '\n'
        '\n'
    ),
    link=None,
    level=2,
    num='42.1'
)

RQ_SRS_Plugin_SupportedDataTypes_LimitValues = Requirement(
    name='RQ.SRS.Plugin.SupportedDataTypes.LimitValues',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] SHALL support max and min values of [ClickHouse] numeric datatypes.\n'
        '\n'
        '* Int8 — [-128 : 127]\n'
        '* Int16 — [-32768 : 32767]\n'
        '* Int32 — [-2147483648 : 2147483647]\n'
        '* Int64 — [-9223372036854775808 : 9223372036854775807]\n'
        '* Int128 — [-170141183460469231731687303715884105728 : 170141183460469231731687303715884105727]\n'
        '* Int256 — [-57896044618658097711785492504343953926634992332820282019728792003956564819968 : 57896044618658097711785492504343953926634992332820282019728792003956564819967]\n'
        '* UInt8 — [0 : 255]\n'
        '* UInt16 — [0 : 65535]\n'
        '* UInt32 — [0 : 4294967295]\n'
        '* UInt64 — [0 : 18446744073709551615]\n'
        '* UInt128 — [0 : 340282366920938463463374607431768211455]\n'
        '* UInt256 — [0 : 115792089237316195423570985008687907853269984665640564039457584007913129639935]\n'
        '\n'
        ' For float datatypes inf and - inf values not supported.\n'
        ' \n'
        '\n'
    ),
    link=None,
    level=2,
    num='42.2'
)

RQ_SRS_Plugin_VersionCompatibility = Requirement(
    name='RQ.SRS.Plugin.VersionCompatibility',
    version='1.0',
    priority=None,
    group=None,
    type=None,
    uid=None,
    description=(
        'The [Plugin] 3.0 version SHALL support the following [Grafana] versions:\n'
        '\n'
        '| Grafana version         | Supported with plugin |\n'
        '| ----------------------- |:---------------------:|\n'
        '| v10.3                   |                       |\n'
        '\n'
        '[SRS]: #srs\n'
        '[ClickHouse]: https://clickhouse.tech\n'
        '[Plugin]: https://github.com/Altinity/clickhouse-grafana\n'
        '[GitHub Repository]: https://github.com/Altinity/clickhouse-grafana\n'
        '[Altinity Grafana Datasource Plugin For ClickHouse]: https://github.com/Altinity/clickhouse-grafana\n'
        '[Grafana]: https://grafana.com/\n'
        '[CORS]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing\n'
    ),
    link=None,
    level=2,
    num='43.1'
)

QA_SRS_Altinity_Grafana_Datasource_Plugin_For_ClickHouse = Specification(
    name='QA-SRS Altinity Grafana Datasource Plugin For ClickHouse',
    description=None,
    author=None,
    date=None,
    status=None,
    approved_by=None,
    approved_date=None,
    approved_version=None,
    version=None,
    group=None,
    type=None,
    link=None,
    uid=None,
    parent=None,
    children=None,
    headings=(
        Heading(name='Revision History', level=1, num='1'),
        Heading(name='Introduction', level=1, num='2'),
        Heading(name='Plugin Installation', level=1, num='3'),
        Heading(name='Manual Plugin Installation', level=2, num='3.1'),
        Heading(name='RQ.SRS.Plugin.ManualPluginInstallation', level=3, num='3.1.1'),
        Heading(name='Grafana Cloud Plugin Installation', level=2, num='3.2'),
        Heading(name='RQ.SRS.Plugin.GrafanaCloudPluginInstallation', level=3, num='3.2.1'),
        Heading(name='Docker Compose Environment Setup', level=2, num='3.3'),
        Heading(name='RQ.SRS.Plugin.DockerComposeEnvironment', level=3, num='3.3.1'),
        Heading(name='Grafana Datasource Plugin For ClickHouse', level=1, num='4'),
        Heading(name='RQ.SRS.Plugin', level=2, num='4.1'),
        Heading(name='Adding New Data Source', level=1, num='5'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView', level=2, num='5.1'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.SaveAndTestButton', level=2, num='5.2'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesToggle', level=2, num='5.3'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesSetup', level=2, num='5.4'),
        Heading(name='Specifying Data Source Name', level=1, num='6'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.DataSourceName', level=2, num='6.1'),
        Heading(name='Using Default Data Source', level=1, num='7'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.DefaultDataSource', level=2, num='7.1'),
        Heading(name='Specifying HTTP Connection', level=1, num='8'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection', level=2, num='8.1'),
        Heading(name='Connecting to the Clickhouse Server Using Grafana Backend Server ', level=1, num='9'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.ServerAccess', level=2, num='9.1'),
        Heading(name='Connecting to the Clickhouse Server Without Using Grafana Backend Server ', level=1, num='10'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.BrowserAccess', level=2, num='10.1'),
        Heading(name='ClickHouse Authentication Setup', level=1, num='11'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.Auth', level=2, num='11.1'),
        Heading(name='ClickHouse Authentication Setup Using Username And Password', level=1, num='12'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.BasicAuth', level=2, num='12.1'),
        Heading(name='ClickHouse Authentication Setup Using TLS/SSL Auth Details', level=1, num='13'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.TLS/SSLAuthDetails', level=2, num='13.1'),
        Heading(name='ClickHouse Authentication Using Forward OAuth Identity', level=1, num='14'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.ForwardOAuthIdentity', level=2, num='14.1'),
        Heading(name='Sending Credentials Setup', level=1, num='15'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.WithCredentials', level=2, num='15.1'),
        Heading(name='ClickHouse Authentication With CA Certificate', level=1, num='16'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.Auth.WithCACert', level=2, num='16.1'),
        Heading(name='ClickHouse Authentication Without CA Certificate', level=1, num='17'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.Auth.SkipTLSVerify', level=2, num='17.1'),
        Heading(name='Specifying Custom HTTP Headers', level=1, num='18'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.CustomHTTPHeaders', level=2, num='18.1'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.DeletingCustomHTTPHeaders', level=2, num='18.2'),
        Heading(name='Connection To Managed Yandex.Cloud ClickHouse Database Setup', level=1, num='19'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.UseYandexCloudAuthorizationHeaders', level=2, num='19.1'),
        Heading(name='Specifying Use CORS Flag In Requests', level=1, num='20'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.AddCORSFlagToRequests', level=2, num='20.1'),
        Heading(name='Specifying Use POST Requests', level=1, num='21'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.UsePostRequests', level=2, num='21.1'),
        Heading(name='Specifying Default Database', level=1, num='22'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.DefaultDatabase', level=2, num='22.1'),
        Heading(name='Specifying HTTP compression', level=1, num='23'),
        Heading(name='RQ.SRS.Plugin.DataSourceSetupView.HTTPCompression', level=2, num='23.1'),
        Heading(name='Creating Dashboards', level=1, num='24'),
        Heading(name='RQ.SRS.Plugin.Dashboards', level=2, num='24.1'),
        Heading(name='Creating Panels', level=1, num='25'),
        Heading(name='RQ.SRS.Plugin.Panels', level=2, num='25.1'),
        Heading(name='RQ.SRS.Plugin.Panels.Repeated', level=2, num='25.2'),
        Heading(name='Multi-user Usage', level=1, num='26'),
        Heading(name='RQ.SRS.Plugin.MultiUserUsage', level=2, num='26.1'),
        Heading(name='RQ.SRS.Plugin.MultiUserUsage.SamePanel', level=2, num='26.2'),
        Heading(name='RQ.SRS.Plugin.MultiUserUsage.DifferentPanels', level=2, num='26.3'),
        Heading(name='RQ.SRS.Plugin.MultiUserUsage.SameDashboard', level=2, num='26.4'),
        Heading(name='RQ.SRS.Plugin.MultiUserUsage.DifferentDashboards', level=2, num='26.5'),
        Heading(name='Query Setup', level=1, num='27'),
        Heading(name='RQ.SRS.Plugin.QuerySetup', level=2, num='27.1'),
        Heading(name='Query Settings', level=1, num='28'),
        Heading(name='RQ.SRS.Plugin.QuerySettings', level=2, num='28.1'),
        Heading(name='Query Options', level=1, num='29'),
        Heading(name='RQ.SRS.Plugin.QueryOptions', level=2, num='29.1'),
        Heading(name='Specifying Max Data Points For Visualisation', level=2, num='29.2'),
        Heading(name='RQ.SRS.Plugin.QueryOptions.MaxDataPoints', level=3, num='29.2.1'),
        Heading(name='Specifying Min Interval For Visualisation', level=2, num='29.3'),
        Heading(name='RQ.SRS.Plugin.QueryOptions.MinInterval', level=3, num='29.3.1'),
        Heading(name='Computing Interval', level=2, num='29.4'),
        Heading(name='RQ.SRS.Plugin.QueryOptions.Interval', level=3, num='29.4.1'),
        Heading(name='Specifying Relative Time', level=2, num='29.5'),
        Heading(name='RQ.SRS.Plugin.QueryOptions.RelativeTime', level=3, num='29.5.1'),
        Heading(name='Specifying Time Shift', level=2, num='29.6'),
        Heading(name='RQ.SRS.Plugin.QueryOptions.TimeShift', level=3, num='29.6.1'),
        Heading(name='Show Time Info', level=2, num='29.7'),
        Heading(name='RQ.SRS.Plugin.QueryOptions.HideTimeInfo', level=3, num='29.7.1'),
        Heading(name='Raw SQL Editor', level=1, num='30'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface', level=2, num='30.1'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.SQLEditor', level=2, num='30.2'),
        Heading(name='Show Metadata ', level=2, num='30.3'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.AddMetadata', level=3, num='30.3.1'),
        Heading(name='Use Extrapolation', level=2, num='30.4'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.Extrapolation', level=3, num='30.4.1'),
        Heading(name='Show Comments', level=2, num='30.5'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.SkipComments', level=3, num='30.5.1'),
        Heading(name='Specifying Visualisation Step', level=2, num='30.6'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.Step', level=3, num='30.6.1'),
        Heading(name='Specifying Visualisation Rounding', level=2, num='30.7'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.Round', level=2, num='30.8'),
        Heading(name='Specifying Graph Resolution', level=2, num='30.9'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.Resolution', level=3, num='30.9.1'),
        Heading(name='Specifying Visualization Format', level=2, num='30.10'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.FormatAs', level=3, num='30.10.1'),
        Heading(name='Hints', level=2, num='30.11'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.ShowHelp', level=3, num='30.11.1'),
        Heading(name='RQ.SRS.Plugin.RawSQLEditorInterface.ShowGeneratedSQL', level=3, num='30.11.2'),
        Heading(name='Auto-complete In Queries', level=1, num='31'),
        Heading(name='RQ.SRS.Plugin.AutoCompleteInQueries', level=2, num='31.1'),
        Heading(name='Time range selector', level=1, num='32'),
        Heading(name='RQ.SRS.Plugin.TimeRangeSelector', level=2, num='32.1'),
        Heading(name='RQ.SRS.Plugin.TimeRangeSelector.Zoom', level=2, num='32.2'),
        Heading(name='Changing The Size Of The Graph', level=1, num='33'),
        Heading(name='RQ.SRS.Plugin.FillActual', level=2, num='33.1'),
        Heading(name='Refresh Databoard', level=1, num='34'),
        Heading(name='RQ.SRS.Plugin.RefreshDataboard', level=2, num='34.1'),
        Heading(name='Inspecting Query', level=1, num='35'),
        Heading(name='RQ.SRS.Plugin.QueryInspector', level=2, num='35.1'),
        Heading(name='RQ.SRS.Plugin.QueryInspector.QueryTab', level=2, num='35.2'),
        Heading(name='Visualization', level=1, num='36'),
        Heading(name='RQ.SRS.Plugin.Visualization', level=2, num='36.1'),
        Heading(name='RQ.SRS.Plugin.Visualization.Legends', level=2, num='36.2'),
        Heading(name='Table View', level=2, num='36.3'),
        Heading(name='RQ.SRS.Plugin.Visualization.Table', level=3, num='36.3.1'),
        Heading(name='Visualization Types', level=2, num='36.4'),
        Heading(name='RQ.SRS.Plugin.Visualization.VisualizationTypes', level=3, num='36.4.1'),
        Heading(name='Macros', level=1, num='37'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros', level=2, num='37.1'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.Table', level=2, num='37.2'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.DateCol', level=2, num='37.3'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.DateTimeCol', level=2, num='37.4'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.From', level=2, num='37.5'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.To', level=2, num='37.6'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.Interval', level=2, num='37.7'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.TimeFilterByColumn', level=2, num='37.8'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.TimeSeries', level=2, num='37.9'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.NaturalTimeSeries', level=2, num='37.10'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.Unescape', level=2, num='37.11'),
        Heading(name='RQ.SRS.Plugin.QuerySettings.Macros.Adhoc', level=2, num='37.12'),
        Heading(name='Variables Setup', level=1, num='38'),
        Heading(name='RQ.SRS.Plugin.Variables', level=2, num='38.1'),
        Heading(name='Annotations Setup', level=1, num='39'),
        Heading(name='RQ.SRS.Plugin.Annotations', level=2, num='39.1'),
        Heading(name='Setting up Alerts', level=1, num='40'),
        Heading(name='RQ.SRS.Plugin.Alerts', level=2, num='40.1'),
        Heading(name='RQ.SRS.Plugin.Alerts.AlertSetupPage', level=2, num='40.2'),
        Heading(name='RQ.SRS.Plugin.Alerts.UnifiedAlerts', level=2, num='40.3'),
        Heading(name='RQ.SRS.Plugin.Alerts.LegacyAlerts', level=2, num='40.4'),
        Heading(name='Functions', level=1, num='41'),
        Heading(name='RQ.SRS.Plugin.Functions', level=2, num='41.1'),
        Heading(name='RQ.SRS.Plugin.Functions.Columns', level=2, num='41.2'),
        Heading(name='Functions For Rate Computing', level=2, num='41.3'),
        Heading(name='RQ.SRS.Plugin.Functions.Rate', level=3, num='41.3.1'),
        Heading(name='RQ.SRS.Plugin.Functions.RateColumns', level=3, num='41.3.2'),
        Heading(name='RQ.SRS.Plugin.Functions.RateColumnsAggregated', level=3, num='41.3.3'),
        Heading(name='Functions For Rate Per Second Computing', level=2, num='41.4'),
        Heading(name='RQ.SRS.Plugin.Functions.PerSecond', level=3, num='41.4.1'),
        Heading(name='RQ.SRS.Plugin.Functions.PerSecondColumns', level=3, num='41.4.2'),
        Heading(name='RQ.SRS.Plugin.Functions.PerSecondColumnsAggregated', level=3, num='41.4.3'),
        Heading(name='Functions for Delta Value Computing', level=2, num='41.5'),
        Heading(name='RQ.SRS.Plugin.Functions.Delta', level=3, num='41.5.1'),
        Heading(name='RQ.SRS.Plugin.Functions.DeltaColumns', level=3, num='41.5.2'),
        Heading(name='RQ.SRS.Plugin.Functions.DeltaColumnsAggregated', level=3, num='41.5.3'),
        Heading(name='Functions For Non-Negative Delta Value Computing', level=2, num='41.6'),
        Heading(name='RQ.SRS.Plugin.Functions.Increase', level=3, num='41.6.1'),
        Heading(name='RQ.SRS.Plugin.Functions.IncreaseColumns', level=3, num='41.6.2'),
        Heading(name='RQ.SRS.Plugin.Functions.IncreaseColumnsAggregated', level=3, num='41.6.3'),
        Heading(name='RQ.SRS.Plugin.Functions.Lttb', level=2, num='41.7'),
        Heading(name='RQ.SRS.Plugin.Functions.SubQuery', level=2, num='41.8'),
        Heading(name='Supported ClickHouse Datatypes', level=1, num='42'),
        Heading(name='RQ.SRS.Plugin.SupportedDataTypes', level=2, num='42.1'),
        Heading(name='RQ.SRS.Plugin.SupportedDataTypes.LimitValues', level=2, num='42.2'),
        Heading(name='Versions Compatibility', level=1, num='43'),
        Heading(name='RQ.SRS.Plugin.VersionCompatibility', level=2, num='43.1'),
        ),
    requirements=(
        RQ_SRS_Plugin_ManualPluginInstallation,
        RQ_SRS_Plugin_GrafanaCloudPluginInstallation,
        RQ_SRS_Plugin_DockerComposeEnvironment,
        RQ_SRS_Plugin,
        RQ_SRS_Plugin_DataSourceSetupView,
        RQ_SRS_Plugin_DataSourceSetupView_SaveAndTestButton,
        RQ_SRS_Plugin_DataSourceSetupView_DefaultValuesToggle,
        RQ_SRS_Plugin_DataSourceSetupView_DefaultValuesSetup,
        RQ_SRS_Plugin_DataSourceSetupView_DataSourceName,
        RQ_SRS_Plugin_DataSourceSetupView_DefaultDataSource,
        RQ_SRS_Plugin_DataSourceSetupView_HTTPConnection,
        RQ_SRS_Plugin_DataSourceSetupView_HTTPConnection_ServerAccess,
        RQ_SRS_Plugin_DataSourceSetupView_HTTPConnection_BrowserAccess,
        RQ_SRS_Plugin_DataSourceSetupView_Auth,
        RQ_SRS_Plugin_DataSourceSetupView_BasicAuth,
        RQ_SRS_Plugin_DataSourceSetupView_TLS_SSLAuthDetails,
        RQ_SRS_Plugin_DataSourceSetupView_ForwardOAuthIdentity,
        RQ_SRS_Plugin_DataSourceSetupView_WithCredentials,
        RQ_SRS_Plugin_DataSourceSetupView_Auth_WithCACert,
        RQ_SRS_Plugin_DataSourceSetupView_Auth_SkipTLSVerify,
        RQ_SRS_Plugin_DataSourceSetupView_CustomHTTPHeaders,
        RQ_SRS_Plugin_DataSourceSetupView_DeletingCustomHTTPHeaders,
        RQ_SRS_Plugin_DataSourceSetupView_UseYandexCloudAuthorizationHeaders,
        RQ_SRS_Plugin_DataSourceSetupView_AddCORSFlagToRequests,
        RQ_SRS_Plugin_DataSourceSetupView_UsePostRequests,
        RQ_SRS_Plugin_DataSourceSetupView_DefaultDatabase,
        RQ_SRS_Plugin_DataSourceSetupView_HTTPCompression,
        RQ_SRS_Plugin_Dashboards,
        RQ_SRS_Plugin_Panels,
        RQ_SRS_Plugin_Panels_Repeated,
        RQ_SRS_Plugin_MultiUserUsage,
        RQ_SRS_Plugin_MultiUserUsage_SamePanel,
        RQ_SRS_Plugin_MultiUserUsage_DifferentPanels,
        RQ_SRS_Plugin_MultiUserUsage_SameDashboard,
        RQ_SRS_Plugin_MultiUserUsage_DifferentDashboards,
        RQ_SRS_Plugin_QuerySetup,
        RQ_SRS_Plugin_QuerySettings,
        RQ_SRS_Plugin_QueryOptions,
        RQ_SRS_Plugin_QueryOptions_MaxDataPoints,
        RQ_SRS_Plugin_QueryOptions_MinInterval,
        RQ_SRS_Plugin_QueryOptions_Interval,
        RQ_SRS_Plugin_QueryOptions_RelativeTime,
        RQ_SRS_Plugin_QueryOptions_TimeShift,
        RQ_SRS_Plugin_QueryOptions_HideTimeInfo,
        RQ_SRS_Plugin_RawSQLEditorInterface,
        RQ_SRS_Plugin_RawSQLEditorInterface_SQLEditor,
        RQ_SRS_Plugin_RawSQLEditorInterface_AddMetadata,
        RQ_SRS_Plugin_RawSQLEditorInterface_Extrapolation,
        RQ_SRS_Plugin_RawSQLEditorInterface_SkipComments,
        RQ_SRS_Plugin_RawSQLEditorInterface_Step,
        RQ_SRS_Plugin_RawSQLEditorInterface_Round,
        RQ_SRS_Plugin_RawSQLEditorInterface_Resolution,
        RQ_SRS_Plugin_RawSQLEditorInterface_FormatAs,
        RQ_SRS_Plugin_RawSQLEditorInterface_ShowHelp,
        RQ_SRS_Plugin_RawSQLEditorInterface_ShowGeneratedSQL,
        RQ_SRS_Plugin_AutoCompleteInQueries,
        RQ_SRS_Plugin_TimeRangeSelector,
        RQ_SRS_Plugin_TimeRangeSelector_Zoom,
        RQ_SRS_Plugin_FillActual,
        RQ_SRS_Plugin_RefreshDataboard,
        RQ_SRS_Plugin_QueryInspector,
        RQ_SRS_Plugin_QueryInspector_QueryTab,
        RQ_SRS_Plugin_Visualization,
        RQ_SRS_Plugin_Visualization_Table,
        RQ_SRS_Plugin_Visualization_VisualizationTypes,
        RQ_SRS_Plugin_QuerySettings_Macros,
        RQ_SRS_Plugin_QuerySettings_Macros_Table,
        RQ_SRS_Plugin_QuerySettings_Macros_DateCol,
        RQ_SRS_Plugin_QuerySettings_Macros_DateTimeCol,
        RQ_SRS_Plugin_QuerySettings_Macros_From,
        RQ_SRS_Plugin_QuerySettings_Macros_To,
        RQ_SRS_Plugin_QuerySettings_Macros_Interval,
        RQ_SRS_Plugin_QuerySettings_Macros_TimeFilterByColumn,
        RQ_SRS_Plugin_QuerySettings_Macros_TimeSeries,
        RQ_SRS_Plugin_QuerySettings_Macros_NaturalTimeSeries,
        RQ_SRS_Plugin_QuerySettings_Macros_Unescape,
        RQ_SRS_Plugin_QuerySettings_Macros_Adhoc,
        RQ_SRS_Plugin_Variables,
        RQ_SRS_Plugin_Annotations,
        RQ_SRS_Plugin_Alerts,
        RQ_SRS_Plugin_Alerts_AlertSetupPage,
        RQ_SRS_Plugin_Alerts_UnifiedAlerts,
        RQ_SRS_Plugin_Alerts_LegacyAlerts,
        RQ_SRS_Plugin_Functions,
        RQ_SRS_Plugin_Functions_Columns,
        RQ_SRS_Plugin_Functions_Rate,
        RQ_SRS_Plugin_Functions_RateColumns,
        RQ_SRS_Plugin_Functions_RateColumnsAggregated,
        RQ_SRS_Plugin_Functions_PerSecond,
        RQ_SRS_Plugin_Functions_PerSecondColumns,
        RQ_SRS_Plugin_Functions_PerSecondColumnsAggregated,
        RQ_SRS_Plugin_Functions_Delta,
        RQ_SRS_Plugin_Functions_DeltaColumns,
        RQ_SRS_Plugin_Functions_DeltaColumnsAggregated,
        RQ_SRS_Plugin_Functions_Increase,
        RQ_SRS_Plugin_Functions_IncreaseColumns,
        RQ_SRS_Plugin_Functions_IncreaseColumnsAggregated,
        RQ_SRS_Plugin_Functions_Lttb,
        RQ_SRS_Plugin_Functions_SubQuery,
        RQ_SRS_Plugin_SupportedDataTypes,
        RQ_SRS_Plugin_SupportedDataTypes_LimitValues,
        RQ_SRS_Plugin_VersionCompatibility,
        ),
    content='''
# QA-SRS Altinity Grafana Datasource Plugin For ClickHouse
# Software Requirements Specification

## Table of Contents

* 1 [Revision History](#revision-history)
* 2 [Introduction](#introduction)
* 3 [Plugin Installation](#plugin-installation)
    * 3.1 [Manual Plugin Installation](#manual-plugin-installation)
        * 3.1.1 [RQ.SRS.Plugin.ManualPluginInstallation](#rqsrspluginmanualplugininstallation)
    * 3.2 [Grafana Cloud Plugin Installation](#grafana-cloud-plugin-installation)
        * 3.2.1 [RQ.SRS.Plugin.GrafanaCloudPluginInstallation](#rqsrsplugingrafanacloudplugininstallation)
    * 3.3 [Docker Compose Environment Setup](#docker-compose-environment-setup)
        * 3.3.1 [RQ.SRS.Plugin.DockerComposeEnvironment](#rqsrsplugindockercomposeenvironment)
* 4 [Grafana Datasource Plugin For ClickHouse](#grafana-datasource-plugin-for-clickhouse)
    * 4.1 [RQ.SRS.Plugin](#rqsrsplugin)
* 5 [Adding New Data Source](#adding-new-data-source)
    * 5.1 [RQ.SRS.Plugin.DataSourceSetupView](#rqsrsplugindatasourcesetupview)
    * 5.2 [RQ.SRS.Plugin.DataSourceSetupView.SaveAndTestButton](#rqsrsplugindatasourcesetupviewsaveandtestbutton)
    * 5.3 [RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesToggle](#rqsrsplugindatasourcesetupviewdefaultvaluestoggle)
    * 5.4 [RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesSetup](#rqsrsplugindatasourcesetupviewdefaultvaluessetup)
* 6 [Specifying Data Source Name](#specifying-data-source-name)
    * 6.1 [RQ.SRS.Plugin.DataSourceSetupView.DataSourceName](#rqsrsplugindatasourcesetupviewdatasourcename)
* 7 [Using Default Data Source](#using-default-data-source)
    * 7.1 [RQ.SRS.Plugin.DataSourceSetupView.DefaultDataSource](#rqsrsplugindatasourcesetupviewdefaultdatasource)
* 8 [Specifying HTTP Connection](#specifying-http-connection)
    * 8.1 [RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection](#rqsrsplugindatasourcesetupviewhttpconnection)
* 9 [Connecting to the Clickhouse Server Using Grafana Backend Server ](#connecting-to-the-clickhouse-server-using-grafana-backend-server-)
    * 9.1 [RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.ServerAccess](#rqsrsplugindatasourcesetupviewhttpconnectionserveraccess)
* 10 [Connecting to the Clickhouse Server Without Using Grafana Backend Server ](#connecting-to-the-clickhouse-server-without-using-grafana-backend-server-)
    * 10.1 [RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.BrowserAccess](#rqsrsplugindatasourcesetupviewhttpconnectionbrowseraccess)
* 11 [ClickHouse Authentication Setup](#clickhouse-authentication-setup)
    * 11.1 [RQ.SRS.Plugin.DataSourceSetupView.Auth](#rqsrsplugindatasourcesetupviewauth)
* 12 [ClickHouse Authentication Setup Using Username And Password](#clickhouse-authentication-setup-using-username-and-password)
    * 12.1 [RQ.SRS.Plugin.DataSourceSetupView.BasicAuth](#rqsrsplugindatasourcesetupviewbasicauth)
* 13 [ClickHouse Authentication Setup Using TLS/SSL Auth Details](#clickhouse-authentication-setup-using-tlsssl-auth-details)
    * 13.1 [RQ.SRS.Plugin.DataSourceSetupView.TLS/SSLAuthDetails](#rqsrsplugindatasourcesetupviewtlssslauthdetails)
* 14 [ClickHouse Authentication Using Forward OAuth Identity](#clickhouse-authentication-using-forward-oauth-identity)
    * 14.1 [RQ.SRS.Plugin.DataSourceSetupView.ForwardOAuthIdentity](#rqsrsplugindatasourcesetupviewforwardoauthidentity)
* 15 [Sending Credentials Setup](#sending-credentials-setup)
    * 15.1 [RQ.SRS.Plugin.DataSourceSetupView.WithCredentials](#rqsrsplugindatasourcesetupviewwithcredentials)
* 16 [ClickHouse Authentication With CA Certificate](#clickhouse-authentication-with-ca-certificate)
    * 16.1 [RQ.SRS.Plugin.DataSourceSetupView.Auth.WithCACert](#rqsrsplugindatasourcesetupviewauthwithcacert)
* 17 [ClickHouse Authentication Without CA Certificate](#clickhouse-authentication-without-ca-certificate)
    * 17.1 [RQ.SRS.Plugin.DataSourceSetupView.Auth.SkipTLSVerify](#rqsrsplugindatasourcesetupviewauthskiptlsverify)
* 18 [Specifying Custom HTTP Headers](#specifying-custom-http-headers)
    * 18.1 [RQ.SRS.Plugin.DataSourceSetupView.CustomHTTPHeaders](#rqsrsplugindatasourcesetupviewcustomhttpheaders)
    * 18.2 [RQ.SRS.Plugin.DataSourceSetupView.DeletingCustomHTTPHeaders](#rqsrsplugindatasourcesetupviewdeletingcustomhttpheaders)
* 19 [Connection To Managed Yandex.Cloud ClickHouse Database Setup](#connection-to-managed-yandexcloud-clickhouse-database-setup)
    * 19.1 [RQ.SRS.Plugin.DataSourceSetupView.UseYandexCloudAuthorizationHeaders](#rqsrsplugindatasourcesetupviewuseyandexcloudauthorizationheaders)
* 20 [Specifying Use CORS Flag In Requests](#specifying-use-cors-flag-in-requests)
    * 20.1 [RQ.SRS.Plugin.DataSourceSetupView.AddCORSFlagToRequests](#rqsrsplugindatasourcesetupviewaddcorsflagtorequests)
* 21 [Specifying Use POST Requests](#specifying-use-post-requests)
    * 21.1 [RQ.SRS.Plugin.DataSourceSetupView.UsePostRequests](#rqsrsplugindatasourcesetupviewusepostrequests)
* 22 [Specifying Default Database](#specifying-default-database)
    * 22.1 [RQ.SRS.Plugin.DataSourceSetupView.DefaultDatabase](#rqsrsplugindatasourcesetupviewdefaultdatabase)
* 23 [Specifying HTTP compression](#specifying-http-compression)
    * 23.1 [RQ.SRS.Plugin.DataSourceSetupView.HTTPCompression](#rqsrsplugindatasourcesetupviewhttpcompression)
* 24 [Creating Dashboards](#creating-dashboards)
    * 24.1 [RQ.SRS.Plugin.Dashboards](#rqsrsplugindashboards)
* 25 [Creating Panels](#creating-panels)
    * 25.1 [RQ.SRS.Plugin.Panels](#rqsrspluginpanels)
    * 25.2 [RQ.SRS.Plugin.Panels.Repeated](#rqsrspluginpanelsrepeated)
* 26 [Multi-user Usage](#multi-user-usage)
    * 26.1 [RQ.SRS.Plugin.MultiUserUsage](#rqsrspluginmultiuserusage)
    * 26.2 [RQ.SRS.Plugin.MultiUserUsage.SamePanel](#rqsrspluginmultiuserusagesamepanel)
    * 26.3 [RQ.SRS.Plugin.MultiUserUsage.DifferentPanels](#rqsrspluginmultiuserusagedifferentpanels)
    * 26.4 [RQ.SRS.Plugin.MultiUserUsage.SameDashboard](#rqsrspluginmultiuserusagesamedashboard)
    * 26.5 [RQ.SRS.Plugin.MultiUserUsage.DifferentDashboards](#rqsrspluginmultiuserusagedifferentdashboards)
* 27 [Query Setup](#query-setup)
    * 27.1 [RQ.SRS.Plugin.QuerySetup](#rqsrspluginquerysetup)
* 28 [Query Settings](#query-settings)
    * 28.1 [RQ.SRS.Plugin.QuerySettings](#rqsrspluginquerysettings)
* 29 [Query Options](#query-options)
    * 29.1 [RQ.SRS.Plugin.QueryOptions](#rqsrspluginqueryoptions)
    * 29.2 [Specifying Max Data Points For Visualisation](#specifying-max-data-points-for-visualisation)
        * 29.2.1 [RQ.SRS.Plugin.QueryOptions.MaxDataPoints](#rqsrspluginqueryoptionsmaxdatapoints)
    * 29.3 [Specifying Min Interval For Visualisation](#specifying-min-interval-for-visualisation)
        * 29.3.1 [RQ.SRS.Plugin.QueryOptions.MinInterval](#rqsrspluginqueryoptionsmininterval)
    * 29.4 [Computing Interval](#computing-interval)
        * 29.4.1 [RQ.SRS.Plugin.QueryOptions.Interval](#rqsrspluginqueryoptionsinterval)
    * 29.5 [Specifying Relative Time](#specifying-relative-time)
        * 29.5.1 [RQ.SRS.Plugin.QueryOptions.RelativeTime](#rqsrspluginqueryoptionsrelativetime)
    * 29.6 [Specifying Time Shift](#specifying-time-shift)
        * 29.6.1 [RQ.SRS.Plugin.QueryOptions.TimeShift](#rqsrspluginqueryoptionstimeshift)
    * 29.7 [Show Time Info](#show-time-info)
        * 29.7.1 [RQ.SRS.Plugin.QueryOptions.HideTimeInfo](#rqsrspluginqueryoptionshidetimeinfo)
* 30 [Raw SQL Editor](#raw-sql-editor)
    * 30.1 [RQ.SRS.Plugin.RawSQLEditorInterface](#rqsrspluginrawsqleditorinterface)
    * 30.2 [RQ.SRS.Plugin.RawSQLEditorInterface.SQLEditor](#rqsrspluginrawsqleditorinterfacesqleditor)
    * 30.3 [Show Metadata ](#show-metadata-)
        * 30.3.1 [RQ.SRS.Plugin.RawSQLEditorInterface.AddMetadata](#rqsrspluginrawsqleditorinterfaceaddmetadata)
    * 30.4 [Use Extrapolation](#use-extrapolation)
        * 30.4.1 [RQ.SRS.Plugin.RawSQLEditorInterface.Extrapolation](#rqsrspluginrawsqleditorinterfaceextrapolation)
    * 30.5 [Show Comments](#show-comments)
        * 30.5.1 [RQ.SRS.Plugin.RawSQLEditorInterface.SkipComments](#rqsrspluginrawsqleditorinterfaceskipcomments)
    * 30.6 [Specifying Visualisation Step](#specifying-visualisation-step)
        * 30.6.1 [RQ.SRS.Plugin.RawSQLEditorInterface.Step](#rqsrspluginrawsqleditorinterfacestep)
    * 30.7 [Specifying Visualisation Rounding](#specifying-visualisation-rounding)
    * 30.8 [RQ.SRS.Plugin.RawSQLEditorInterface.Round](#rqsrspluginrawsqleditorinterfaceround)
    * 30.9 [Specifying Graph Resolution](#specifying-graph-resolution)
        * 30.9.1 [RQ.SRS.Plugin.RawSQLEditorInterface.Resolution](#rqsrspluginrawsqleditorinterfaceresolution)
    * 30.10 [Specifying Visualization Format](#specifying-visualization-format)
        * 30.10.1 [RQ.SRS.Plugin.RawSQLEditorInterface.FormatAs](#rqsrspluginrawsqleditorinterfaceformatas)
    * 30.11 [Hints](#hints)
        * 30.11.1 [RQ.SRS.Plugin.RawSQLEditorInterface.ShowHelp](#rqsrspluginrawsqleditorinterfaceshowhelp)
        * 30.11.2 [RQ.SRS.Plugin.RawSQLEditorInterface.ShowGeneratedSQL](#rqsrspluginrawsqleditorinterfaceshowgeneratedsql)
* 31 [Auto-complete In Queries](#auto-complete-in-queries)
    * 31.1 [RQ.SRS.Plugin.AutoCompleteInQueries](#rqsrspluginautocompleteinqueries)
* 32 [Time range selector](#time-range-selector)
    * 32.1 [RQ.SRS.Plugin.TimeRangeSelector](#rqsrsplugintimerangeselector)
    * 32.2 [RQ.SRS.Plugin.TimeRangeSelector.Zoom](#rqsrsplugintimerangeselectorzoom)
* 33 [Changing The Size Of The Graph](#changing-the-size-of-the-graph)
    * 33.1 [RQ.SRS.Plugin.FillActual](#rqsrspluginfillactual)
* 34 [Refresh Databoard](#refresh-databoard)
    * 34.1 [RQ.SRS.Plugin.RefreshDataboard](#rqsrspluginrefreshdataboard)
* 35 [Inspecting Query](#inspecting-query)
    * 35.1 [RQ.SRS.Plugin.QueryInspector](#rqsrspluginqueryinspector)
    * 35.2 [RQ.SRS.Plugin.QueryInspector.QueryTab](#rqsrspluginqueryinspectorquerytab)
* 36 [Visualization](#visualization)
    * 36.1 [RQ.SRS.Plugin.Visualization](#rqsrspluginvisualization)
    * 36.2 [RQ.SRS.Plugin.Visualization.Legends](#rqsrspluginvisualizationlegends)
    * 36.3 [Table View](#table-view)
        * 36.3.1 [RQ.SRS.Plugin.Visualization.Table](#rqsrspluginvisualizationtable)
    * 36.4 [Visualization Types](#visualization-types)
        * 36.4.1 [RQ.SRS.Plugin.Visualization.VisualizationTypes](#rqsrspluginvisualizationvisualizationtypes)
* 37 [Macros](#macros)
    * 37.1 [RQ.SRS.Plugin.QuerySettings.Macros](#rqsrspluginquerysettingsmacros)
    * 37.2 [RQ.SRS.Plugin.QuerySettings.Macros.Table](#rqsrspluginquerysettingsmacrostable)
    * 37.3 [RQ.SRS.Plugin.QuerySettings.Macros.DateCol](#rqsrspluginquerysettingsmacrosdatecol)
    * 37.4 [RQ.SRS.Plugin.QuerySettings.Macros.DateTimeCol](#rqsrspluginquerysettingsmacrosdatetimecol)
    * 37.5 [RQ.SRS.Plugin.QuerySettings.Macros.From](#rqsrspluginquerysettingsmacrosfrom)
    * 37.6 [RQ.SRS.Plugin.QuerySettings.Macros.To](#rqsrspluginquerysettingsmacrosto)
    * 37.7 [RQ.SRS.Plugin.QuerySettings.Macros.Interval](#rqsrspluginquerysettingsmacrosinterval)
    * 37.8 [RQ.SRS.Plugin.QuerySettings.Macros.TimeFilterByColumn](#rqsrspluginquerysettingsmacrostimefilterbycolumn)
    * 37.9 [RQ.SRS.Plugin.QuerySettings.Macros.TimeSeries](#rqsrspluginquerysettingsmacrostimeseries)
    * 37.10 [RQ.SRS.Plugin.QuerySettings.Macros.NaturalTimeSeries](#rqsrspluginquerysettingsmacrosnaturaltimeseries)
    * 37.11 [RQ.SRS.Plugin.QuerySettings.Macros.Unescape](#rqsrspluginquerysettingsmacrosunescape)
    * 37.12 [RQ.SRS.Plugin.QuerySettings.Macros.Adhoc](#rqsrspluginquerysettingsmacrosadhoc)
* 38 [Variables Setup](#variables-setup)
    * 38.1 [RQ.SRS.Plugin.Variables](#rqsrspluginvariables)
* 39 [Annotations Setup](#annotations-setup)
    * 39.1 [RQ.SRS.Plugin.Annotations](#rqsrspluginannotations)
* 40 [Setting up Alerts](#setting-up-alerts)
    * 40.1 [RQ.SRS.Plugin.Alerts](#rqsrspluginalerts)
    * 40.2 [RQ.SRS.Plugin.Alerts.AlertSetupPage](#rqsrspluginalertsalertsetuppage)
    * 40.3 [RQ.SRS.Plugin.Alerts.UnifiedAlerts](#rqsrspluginalertsunifiedalerts)
    * 40.4 [RQ.SRS.Plugin.Alerts.LegacyAlerts](#rqsrspluginalertslegacyalerts)
* 41 [Functions](#functions)
    * 41.1 [RQ.SRS.Plugin.Functions](#rqsrspluginfunctions)
    * 41.2 [RQ.SRS.Plugin.Functions.Columns](#rqsrspluginfunctionscolumns)
    * 41.3 [Functions For Rate Computing](#functions-for-rate-computing)
        * 41.3.1 [RQ.SRS.Plugin.Functions.Rate](#rqsrspluginfunctionsrate)
        * 41.3.2 [RQ.SRS.Plugin.Functions.RateColumns](#rqsrspluginfunctionsratecolumns)
        * 41.3.3 [RQ.SRS.Plugin.Functions.RateColumnsAggregated](#rqsrspluginfunctionsratecolumnsaggregated)
    * 41.4 [Functions For Rate Per Second Computing](#functions-for-rate-per-second-computing)
        * 41.4.1 [RQ.SRS.Plugin.Functions.PerSecond](#rqsrspluginfunctionspersecond)
        * 41.4.2 [RQ.SRS.Plugin.Functions.PerSecondColumns](#rqsrspluginfunctionspersecondcolumns)
        * 41.4.3 [RQ.SRS.Plugin.Functions.PerSecondColumnsAggregated](#rqsrspluginfunctionspersecondcolumnsaggregated)
    * 41.5 [Functions for Delta Value Computing](#functions-for-delta-value-computing)
        * 41.5.1 [RQ.SRS.Plugin.Functions.Delta](#rqsrspluginfunctionsdelta)
        * 41.5.2 [RQ.SRS.Plugin.Functions.DeltaColumns](#rqsrspluginfunctionsdeltacolumns)
        * 41.5.3 [RQ.SRS.Plugin.Functions.DeltaColumnsAggregated](#rqsrspluginfunctionsdeltacolumnsaggregated)
    * 41.6 [Functions For Non-Negative Delta Value Computing](#functions-for-non-negative-delta-value-computing)
        * 41.6.1 [RQ.SRS.Plugin.Functions.Increase](#rqsrspluginfunctionsincrease)
        * 41.6.2 [RQ.SRS.Plugin.Functions.IncreaseColumns](#rqsrspluginfunctionsincreasecolumns)
        * 41.6.3 [RQ.SRS.Plugin.Functions.IncreaseColumnsAggregated](#rqsrspluginfunctionsincreasecolumnsaggregated)
    * 41.7 [RQ.SRS.Plugin.Functions.Lttb](#rqsrspluginfunctionslttb)
    * 41.8 [RQ.SRS.Plugin.Functions.SubQuery](#rqsrspluginfunctionssubquery)
* 42 [Supported ClickHouse Datatypes](#supported-clickhouse-datatypes)
    * 42.1 [RQ.SRS.Plugin.SupportedDataTypes](#rqsrspluginsupporteddatatypes)
    * 42.2 [RQ.SRS.Plugin.SupportedDataTypes.LimitValues](#rqsrspluginsupporteddatatypeslimitvalues)
* 43 [Versions Compatibility](#versions-compatibility)
    * 43.1 [RQ.SRS.Plugin.VersionCompatibility](#rqsrspluginversioncompatibility)


## Revision History

This document is stored in an electronic form using [Git] source control management software
hosted in a [GitHub Repository]. All the updates are tracked using the [Revision History].

## Introduction

This software requirements specification covers requirements related to [Altinity Grafana Datasource Plugin For ClickHouse]
that connects grafana to [ClickHouse] server.


## Plugin Installation

### Manual Plugin Installation

#### RQ.SRS.Plugin.ManualPluginInstallation
version: 1.0

The [Plugin] SHALL be available to be installed using grafana-cli with the following command:

`grafana-cli plugins install vertamedia-clickhouse-datasource`. 

For installation, user need to install [Grafana] first.

### Grafana Cloud Plugin Installation

#### RQ.SRS.Plugin.GrafanaCloudPluginInstallation
version: 1.0

The [Plugin] SHALL be available to be installed in Grafana Cloud with the following steps:
* Go to Grafana Cloud
* Go to Administration `>` Plugins And Data `>` Plugins
* Find `Altinity plugin for ClickHouse`
* Click Install

![configuration](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/configuration.png)
![filter](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/filter.png)
![add data source](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/add%20data%20source.png)

### Docker Compose Environment Setup

#### RQ.SRS.Plugin.DockerComposeEnvironment
version: 1.0

The [Plugin] SHALL be available to be run using docker compose with the following commands:
```
docker compose run --rm frontend_builder
docker compose run --rm backend_builder
echo 'export GRAFANA_ACCESS_POLICY_TOKEN="{grafana_token}"' > .release_env
docker compose run --rm plugin_signer
docker compose up -d grafana
```

## Grafana Datasource Plugin For ClickHouse

### RQ.SRS.Plugin
version: 1.0

The [Plugin] SHALL support connecting the [ClickHouse] server to [Grafana].

## Adding New Data Source

### RQ.SRS.Plugin.DataSourceSetupView
version: 1.0

The [Plugin] SHALL support creating a new [ClickHouse] data source by clicking the `Add new data source` button on the [Plugin] page.
The [Plugin] SHALL open the data source setup view by clicking the `Add new data source` button.
This view SHALL contain the following sections:
* `Name`
* `HTTP`
* `Auth toggles`
* `Use default values` toggle
* `Custom HTTP Headers`
* `Additional`

![data source setup](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/data%20source%20setup.png)

### RQ.SRS.Plugin.DataSourceSetupView.SaveAndTestButton
version: 1.0

The [Plugin]'s data source setup view SHALL contain a `Save & test` button that SHALL save datasource and check if [ClickHouse]
datasource is connected to [Grafana] correctly.

### RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesToggle
version: 1.0

The [Plugin]'s data source setup view SHALL contain a `default values` toggle that SHALL open 
default values setup menu with the following dropdowns:

* `Column timestamp type`
* `Datetime Field`
* `Timestamp (Uint32) Field`
* `Datetime64 Field`
* `Date Field`

### RQ.SRS.Plugin.DataSourceSetupView.DefaultValuesSetup
version: 1.0

The [Plugin]'s data source setup view SHALL contain a default values setup menu 
that SHALL specify default values for panels that uses this datasource.

## Specifying Data Source Name

### RQ.SRS.Plugin.DataSourceSetupView.DataSourceName
version: 1.0

The [Plugin] SHALL support specifying a data source name by using the `Name` text field in the data source setup view.

## Using Default Data Source

### RQ.SRS.Plugin.DataSourceSetupView.DefaultDataSource
version: 1.0

The [Plugin] SHALL support specifying the data source as default by using the `Default` toggle in the data source setup view.
The default data source SHALL be preselected in new panels.

## Specifying HTTP Connection

### RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection
version: 1.0

The [Plugin] SHALL support specifying an HTTP connection using the following fields:

* The `URL` text field to specify [ClickHouse] URL
* The `Access` dropdown menu to specify `Server` or `Browser` access will be used
* The `Allowed cookies` text field to specify cookies that SHALL not be deleted
* The `Timeout` text field to specify the HTTP request timeout in seconds.

## Connecting to the Clickhouse Server Using Grafana Backend Server 

### RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.ServerAccess
version: 1.0

The [Plugin] SHALL support connecting to the [ClickHouse] server by selecting the `Server` option in the `Access` dropdown menu
in the data source setup view. In this case all requests SHALL be made from the browser to Grafana backend/server which in turn will forward the 
requests to the data source. The [Plugin]'s data source setup view SHALL contain `Allowed cookies` and `Timeout` text fields 
if only the `Server` option is selected in the `Access` dropdown menu.

## Connecting to the Clickhouse Server Without Using Grafana Backend Server 

### RQ.SRS.Plugin.DataSourceSetupView.HTTPConnection.BrowserAccess
version: 1.0

The [Plugin] SHALL support connecting to the [ClickHouse] server by selecting the `Browser` option in the `Access` dropdown menu
in the data source setup view. In this case all requests SHALL be made from the browser directly to the data source.

## ClickHouse Authentication Setup

### RQ.SRS.Plugin.DataSourceSetupView.Auth
version: 1.0

The [Plugin] SHALL support specifying authentication details by specifying the following toggles:

* `Basic auth`
* `TLS Client Auth`
* `Skip TLS Verify`
* `Forward OAuth Identity`
* `With Credentials`
* `With CA Cert`

## ClickHouse Authentication Setup Using Username And Password

### RQ.SRS.Plugin.DataSourceSetupView.BasicAuth
version: 1.0

The [Plugin] SHALL support specifying username and password for the [ClickHouse] server by turning on the `Basic auth` toggle
and specifying username and password in the `User` and `Password` text fields, respectively. The `Password` text field SHALL 
be able to be empty. The [Plugin] SHALL add the `Basic Auth Details` section to the data source setup view only if the `Basic auth`
toggle is on.

## ClickHouse Authentication Setup Using TLS/SSL Auth Details

### RQ.SRS.Plugin.DataSourceSetupView.TLS/SSLAuthDetails
version: 1.0

The [Plugin] SHALL support specifying server name, client certificate, and client key for the [ClickHouse] server by turning on 
the `TLS Client Auth` toggle and specifying these options in the `ServerName`, `Client Cert`, and `Client Key` text fields, respectively. 
The [Plugin] SHALL add `ServerName`, `Client Cert`, and `Client Key` text fields to the data source setup view only if the 
`TLS Client Auth` toggle is on.

## ClickHouse Authentication Using Forward OAuth Identity

### RQ.SRS.Plugin.DataSourceSetupView.ForwardOAuthIdentity
version: 1.0

The [Plugin] SHALL support Forward OAuth Identity by turning on the `Forward OAuth Identity` toggle.
The [Plugin] SHALL forward the user's upstream OAuth identity to the data source if this toggle is on.

## Sending Credentials Setup

### RQ.SRS.Plugin.DataSourceSetupView.WithCredentials
version: 1.0

The [Plugin] SHALL support sending credentials such as cookies or authentication headers with cross-site 
requests by turning on the `With Credentials` toggle.

## ClickHouse Authentication With CA Certificate

### RQ.SRS.Plugin.DataSourceSetupView.Auth.WithCACert
version: 1.0

The [Plugin] SHALL support specifying the CA certificate that will be used to access the [ClickHouse] server 
by turning on the `With CA Cert` toggle and specifying the `CA Cert` text field. The [Plugin] SHALL add the 
`CA Cert` text field to the data source setup view only if the `TLS Client Auth` toggle is on.

## ClickHouse Authentication Without CA Certificate

### RQ.SRS.Plugin.DataSourceSetupView.Auth.SkipTLSVerify
version: 1.0

The [Plugin] SHALL support connecting to clickhouse using HTTPS connection without specifying CA certificate
by turning on `Skip TLS verify` toggle.


## Specifying Custom HTTP Headers

### RQ.SRS.Plugin.DataSourceSetupView.CustomHTTPHeaders
version: 1.0

The [Plugin] SHALL support custom HTTP headers that will be used for HTTP requests to the [ClickHouse] server 
by pressing the `Add Header` button and specifying the `Header` and `Value` text fields.

### RQ.SRS.Plugin.DataSourceSetupView.DeletingCustomHTTPHeaders
version: 1.0

The [Plugin] SHALL support deleting custom HTTP headers by clicking the bucket button nearby this header.

## Connection To Managed Yandex.Cloud ClickHouse Database Setup

### RQ.SRS.Plugin.DataSourceSetupView.UseYandexCloudAuthorizationHeaders
version: 1.0

The [Plugin] SHALL support connection to managed Yandex.Cloud [ClickHouse] database setup by turning on the 
`Use Yandex.Cloud authorization headers` toggle and specifying the `X-ClickHouse-User` and `X-ClickHouse-Key` 
text fields.

## Specifying Use CORS Flag In Requests

### RQ.SRS.Plugin.DataSourceSetupView.AddCORSFlagToRequests
version: 1.0

The [Plugin] SHALL support adding the [CORS] flag to requests by turning on the `Add CORS flag to requests` toggle.
If this toggle is on, the [Plugin] SHALL attach `add_http_cors_header=1` to requests.

## Specifying Use POST Requests

### RQ.SRS.Plugin.DataSourceSetupView.UsePostRequests
version: 1.0

The [Plugin] SHALL support specifying the use of POST requests to the [ClickHouse] server by turning on the 
`Use POST method to send queries` toggle.

## Specifying Default Database

### RQ.SRS.Plugin.DataSourceSetupView.DefaultDatabase
version: 1.0

The [Plugin] SHALL support specifying the default [ClickHouse] server database by using the `Default database` text field.
This database name SHALL be prefilled in the query builder.

## Specifying HTTP compression

### RQ.SRS.Plugin.DataSourceSetupView.HTTPCompression
version: 1.0

The [Plugin] SHALL support specifying HTTP compression option by using the `HTTP Compression` toggle.

## Creating Dashboards

### RQ.SRS.Plugin.Dashboards
version: 1.0

The [Plugin] SHALL support creating dashboards with panels that use the [ClickHouse] data source that was created using the [Plugin].

## Creating Panels

### RQ.SRS.Plugin.Panels
version: 1.0

The [Plugin] SHALL support creating panels for the [ClickHouse] data source if the [ClickHouse] data source 
was created using the [Plugin].

### RQ.SRS.Plugin.Panels.Repeated
version: 1.0

The [Plugin] SHALL support creating more than 1 panel by defining 1 panel and using variables.

## Multi-user Usage

### RQ.SRS.Plugin.MultiUserUsage
version: 1.0

The [Plugin] SHALL support multi-user usage of the [Clickhouse] data source that was created using the [Plugin].


### RQ.SRS.Plugin.MultiUserUsage.SamePanel
version: 1.0

The [Plugin] SHALL support access for the same panel from different users at the same time.


### RQ.SRS.Plugin.MultiUserUsage.DifferentPanels
version: 1.0

The [Plugin] SHALL support access for different panels from different users at the same time.


### RQ.SRS.Plugin.MultiUserUsage.SameDashboard
version: 1.0

The [Plugin] SHALL support access for the same dashboard from different users at the same time.


### RQ.SRS.Plugin.MultiUserUsage.DifferentDashboards
version: 1.0

The [Plugin] SHALL support access for different dashboards from different users at the same time.

## Query Setup

### RQ.SRS.Plugin.QuerySetup
version: 1.0

The [Plugin] SHALL support creating Grafana visualizations using the query setup interface and raw SQL editor.

## Query Settings

### RQ.SRS.Plugin.QuerySettings
version: 1.0

The [Plugin]'s query setup interface SHALL contain the following fields:

* `FROM` - `Database` and `Table` dropdown's that allow the user to specify the database and table for the query
* `Column timestamp type` - dropdown of types `DateTime`, `DateTime64`, or `UInt32`
* `Timestamp Column` - dropdown of the table's timestamp columns with a type defined in `Column timestamp type`
* `Date column` - dropdown of the table's data columns `Date` and `Date32` type
* `Go to Query` - button to switch to the raw SQL editor
* `Add query` - button to add more than one query
* `Expression` - button to add expressions to the query.

![query settings](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/query%20settings.png)

## Query Options

### RQ.SRS.Plugin.QueryOptions
version: 1.0

The [Plugin] SHALL support the following options for the query:

* `Max data points`
* `Min interval`
* `Interval`
* `Relative time`
* `Time shift`
* `Hide time info`

![query options](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/query%20options.png)

### Specifying Max Data Points For Visualisation

#### RQ.SRS.Plugin.QueryOptions.MaxDataPoints
version: 1.0

The [Plugin] SHALL support specifying maximum data points per series using `Max data points` text field.

### Specifying Min Interval For Visualisation

#### RQ.SRS.Plugin.QueryOptions.MinInterval
version: 1.0

The [Plugin] SHALL support specifying lower limit for the interval using `Min interval` text field.

### Computing Interval

#### RQ.SRS.Plugin.QueryOptions.Interval
version: 1.0

The [Plugin] SHALL evaluate interval that is used in $__interval and $__interval_ms macro. 
This interval SHALL be displayed in `Interval` text field.

### Specifying Relative Time

#### RQ.SRS.Plugin.QueryOptions.RelativeTime
version: 1.0

The [Plugin] SHALL support specifying relative time using `Relative time` text field.
This relative time SHALL override the relative time range for individual panel.

### Specifying Time Shift

#### RQ.SRS.Plugin.QueryOptions.TimeShift
version: 1.0

The [Plugin] SHALL support specifying time shift using `Time shift` text field.
This relative time SHALL override the time range for individual panel 
by shifting its start and end relative to the time picker.

### Show Time Info

#### RQ.SRS.Plugin.QueryOptions.HideTimeInfo
version: 1.0

The [Plugin] SHALL support `Hide time info` toggle. 
This toggle SHALL hide time info regarding relative time and time shift in panel title if turned on. 

## Raw SQL Editor

### RQ.SRS.Plugin.RawSQLEditorInterface
version: 1.0

The [Plugin]'s raw SQL editor interface SHALL contain the following fields:

* SQL editor
* `Add Metadata`
* `Extrapolation`
* `Skip Comments`
* `Step`
* `Round`
* `Resolution`
* `Format As`
* `Show help`
* `Show generated SQL`
* `Reformat Query`

![sql editor](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/sql%20editor.png)


### RQ.SRS.Plugin.RawSQLEditorInterface.SQLEditor
version: 1.0

The [Plugin] SHALL support specifying SQL query by using SQL Editor text field for SQL query.

### Show Metadata 

#### RQ.SRS.Plugin.RawSQLEditorInterface.AddMetadata
version: 1.0

The [Plugin] SHALL support turning on and off adding metadata for queries in reformatted query
for visualizations using the `Add Metadata` toggle.

### Use Extrapolation

#### RQ.SRS.Plugin.RawSQLEditorInterface.Extrapolation
version: 1.0

The [Plugin] SHALL support turning on and off extrapolation for visualizations using the `Extrapolation` toggle.

### Show Comments

#### RQ.SRS.Plugin.RawSQLEditorInterface.SkipComments
version: 1.0

The [Plugin] SHALL support turning on and off sending comments to [ClickHouse] server by using the `Skip Comments` toggle.

### Specifying Visualisation Step

#### RQ.SRS.Plugin.RawSQLEditorInterface.Step
version: 1.0

The [Plugin] SHALL support specifying the grid step on the graphs by using the `Step` text field.

### Specifying Visualisation Rounding

### RQ.SRS.Plugin.RawSQLEditorInterface.Round
version: 1.0

The [Plugin] SHALL support specifying rounding for the timestamps by using the `Round` text field.

### Specifying Graph Resolution

#### RQ.SRS.Plugin.RawSQLEditorInterface.Resolution
version: 1.0

The [Plugin] SHALL support specifying resolution for graphs by using the `Resolution` dropdown menu.

### Specifying Visualization Format

#### RQ.SRS.Plugin.RawSQLEditorInterface.FormatAs
version: 1.0

The [Plugin] SHALL support choosing the visualization type by using the `Format As` dropdown menu.
The following types SHALL be supported: `Time series`, `Table`, `Logs`, `Trace`, `Flamegraph`.


### Hints

#### RQ.SRS.Plugin.RawSQLEditorInterface.ShowHelp
version: 1.0

The [Plugin] SHALL allow user to get information about macros and functions by clicking `Show help` button.

#### RQ.SRS.Plugin.RawSQLEditorInterface.ShowGeneratedSQL
version: 1.0

The [Plugin] SHALL allow user to get generated SQL query in raw form without macros and functions by clicking `Show generated SQL` button.


## Auto-complete In Queries

### RQ.SRS.Plugin.AutoCompleteInQueries
version: 1.0

The [Plugin] SHALL support auto-complete in queries for field names and table names.

## Time range selector

### RQ.SRS.Plugin.TimeRangeSelector
version: 1.0

The [Plugin] SHALL support a time range selector for visualization using the time range dropdown menu.

### RQ.SRS.Plugin.TimeRangeSelector.Zoom
version: 1.0

The [Plugin] SHALL support zooming in by selecting an area on the graph and zooming out by double-clicking on the graph.

## Changing The Size Of The Graph

### RQ.SRS.Plugin.FillActual
version: 1.0

The [Plugin] SHALL support changing the size of the graph by clicking `Fill`/`Actual` toggle.

## Refresh Databoard

### RQ.SRS.Plugin.RefreshDataboard
version: 1.0

The [Plugin] SHALL support refreshing visualization by clicking the `Refresh` button.

## Inspecting Query

### RQ.SRS.Plugin.QueryInspector
version: 1.0

The [Plugin] SHALL support inspecting queries by clicking `Query inspector`.
The [Plugin] SHALL allow user to check data returned by query in the `Data` tab, request stats in the `Stats` tab, 
panel in JSON format in the `JSON` tab, request information in the `Query` tab.

![query inspector](https://github.com/antip00/clickhouse-grafana/blob/master/tests/testflows/requirements/images/query%20inspector.png)

### RQ.SRS.Plugin.QueryInspector.QueryTab
version: 1.0

The [Plugin] SHALL support getting information about requests in the `Query` tab by clicking the `Refresh` button.
This tab SHALL have an `Expand all` or `Collapse all` button to expand or collapse request information.
This tab SHALL have a `Copy to clipboard` button to copy request information to clipboard.

## Visualization

### RQ.SRS.Plugin.Visualization
version: 1.0

The [Plugin] SHALL display visualization on changing attention.

### RQ.SRS.Plugin.Visualization.Legends

The [Plugin] SHALL define names of graphs as collumn names in query response.

### Table View

#### RQ.SRS.Plugin.Visualization.Table
version: 1.0

The [Plugin] SHALL support table view for data.

### Visualization Types

#### RQ.SRS.Plugin.Visualization.VisualizationTypes
version: 1.0

The [Plugin] SHALL support the following visualization types for any supported clickhouse data types:

* Time series
* Bar chart
* Stat
* Gauge
* Bar Gauge
* Pie chart
* State timeline
* Heatmap
* Status history
* Histogram
* Text
* Alert List
* Dashboard list
* News
* Annotation list
* Candlestick
* Canvas
* Flame Graph
* Geomap
* Logs
* Node Graph
* Traces


## Macros

### RQ.SRS.Plugin.QuerySettings.Macros
version: 1.0

The [Plugin] SHALL support the following macroces:

* `$table`
* `$dateCol`
* `$dateTimeCol`
* `$from`
* `$to`
* `$interval`
* `$timeFilter`
* `$timeFilterByColumn($column)`
* `$timeSeries`
* `$naturalTimeSeries`
* `$unescape($variable)`
* `$adhoc`

A description of macros SHALL be available by typing their names in raw SQL editor interface.

https://github.com/Altinity/clickhouse-grafana?tab=readme-ov-file#macros-support

### RQ.SRS.Plugin.QuerySettings.Macros.Table
version: 1.0

The [Plugin] SHALL support `$table` macro in SQL editor. `$table` macro SHALL be replaced with selected table name from query setup interface. 
$table macro SHALL correctly escape any symbols that can be in [ClickHouse] table name.

### RQ.SRS.Plugin.QuerySettings.Macros.DateCol
version: 1.0

The [Plugin] SHALL support `$dateCol` macro in SQL editor. `$dateCol` macro SHALL be replaced with selected Column:Date from query setup interface.

### RQ.SRS.Plugin.QuerySettings.Macros.DateTimeCol
version: 1.0

The [Plugin] SHALL support `$dateTimeCol` macro in SQL editor. `$dateTimeCol` macro SHALL be replaced with Column:DateTime or Column:TimeStamp value from query setup interface.

### RQ.SRS.Plugin.QuerySettings.Macros.From
version: 1.0

The [Plugin] SHALL support `$from` macro in SQL editor. `$from` macro SHALL be replaced with (timestamp with ms)/1000 value of UI selected `Time Range:From`.

### RQ.SRS.Plugin.QuerySettings.Macros.To
version: 1.0

The [Plugin] SHALL support `$to` macro in SQL editor. `$to` macro SHALL be replaced with (timestamp with ms)/1000 value of UI selected `Time Range:To`.

### RQ.SRS.Plugin.QuerySettings.Macros.Interval
version: 1.0

The [Plugin] SHALL support `$interval` macro in SQL editor. `$interval` macro SHALL be replaced with selected "Group by a time interval" value in seconds.

### RQ.SRS.Plugin.QuerySettings.Macros.TimeFilterByColumn
version: 1.0

The [Plugin] SHALL support `$timeFilterByColumn($column)` macro in SQL edior. `$timeFilterByColumn($column)` macro SHALL be replaced with currently 
selected `Time Range` for a column passed as $column argument. `$timeFilterByColumn($column)` macro SHALL work with any clickhouse date or time type. 

### RQ.SRS.Plugin.QuerySettings.Macros.TimeSeries
version: 1.0

The [Plugin] SHALL support `$timeSeries` macro in SQL editor. `$timeSeries` macro SHALL be replaced with special [ClickHouse] construction 
to convert results as time-series data.

### RQ.SRS.Plugin.QuerySettings.Macros.NaturalTimeSeries
version: 1.0

The [Plugin] SHALL support `$naturalTimeSeries` macro in SQL editor. `$naturalTimeSeries` macro SHALL be replaced with special [ClickHouse] 
construction to convert results as time-series with in a logical/natural breakdown.

### RQ.SRS.Plugin.QuerySettings.Macros.Unescape
version: 1.0

The [Plugin] SHALL support `$unescape($variable)` macro in SQL editor. `$unescape($variable)` macro SHALL be replaced with variable 
value without single quotes.


### RQ.SRS.Plugin.QuerySettings.Macros.Adhoc
version: 1.0

The [Plugin] SHALL support `$adhoc` macro in SQL editor. `$adhoc` macro SHALL be replaced with a rendered ad-hoc filter expression, 
or "1" if no ad-hoc filters exist. Adhoc filter SHALL support evaluating varchar field with numeric value.

## Variables Setup

### RQ.SRS.Plugin.Variables
version: 1.0

The [Plugin] SHALL support [Grafana] variables setup for dashboards by clicking gear button and 
setting up variables in the `Variables` tab. The [Plugin] SHALL support the following variable types:
* `Query`
* `Custom`
* `Text box`
* `Constant`
* `Data source`
* `Interval`
* `Ad hoc filter`

## Annotations Setup

### RQ.SRS.Plugin.Annotations
version: 1.0

The [Plugin] SHALL support [Grafana] annotations setup for dashboards by clicking gear button and 
setting up variables in the `Annotations` tab.

## Setting up Alerts

### RQ.SRS.Plugin.Alerts
version: 1.0

The [Plugin] SHALL support [Grafana] alerts setup for panels by clicking `New alert rule` button in `Alert rule` tab
in edit panel view.

### RQ.SRS.Plugin.Alerts.AlertSetupPage
version: 1.0

The [Plugin] SHALL allow defining query and alert condition by using query setup interface and raw SQL editor in alert setup page.

### RQ.SRS.Plugin.Alerts.UnifiedAlerts
version: 1.0

The [Plugin] SHALL support unified alerts defined in `Alerting > Alert rules` page.


### RQ.SRS.Plugin.Alerts.LegacyAlerts
version: 1.0

The [Plugin] SHALL support legacy alerts for grafana version less or equal 10.
This Alerts SHALL be defined in panel page for each individual panel.


## Functions

### RQ.SRS.Plugin.Functions
version: 1.0

The [Plugin] SHALL support the following functions in SQL queries:

* `$rate` 
* `$columns`
* `$rateColumns`
* `$perSecond`
* `$perSecondColumns`
* `$delta`
* `$deltaColumns`
* `$increase`
* `$increaseColumns`
* `$lttb`

These functions are templates of SQL queries. The user SHALL be allowed to check queries in the expanded format in the raw SQL editor interface.
Only one function per query is allowed. 

Each function argument parsed on full argument and reduced argument. If reduced argument is absent it replaced with full argument.
Each function replaces `${function}` with construction with arguments in SQL query.
Functions SHALL not be replaced if query contains `${function}` with wrong argument count, or it cannot be parsed as `${function}(arg1, arg2) FROM table`

https://github.com/Altinity/clickhouse-grafana?tab=readme-ov-file#functions


### RQ.SRS.Plugin.Functions.Columns
version: 1.0

The [Plugin] SHALL support the `$columns(key, value)` function in SQL editor. This function SHALL query values as array of [key, value], 
where key will be used as label. The [Plugin] SHALL support $columns function with fill option in query.
The [Plugin] SHALL replace `$columns(key as k, value as v) from table_name` with the following:
```
SELECT t, groupArray((k, v)) AS groupArr FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v from table_name WHERE {time_condition} GROUP BY t ORDER BY t
```

### Functions For Rate Computing

#### RQ.SRS.Plugin.Functions.Rate
version: 1.0

The [Plugin] SHALL support the `$rate` function in SQL editor. This function SHALL convert query results as "change rate per interval".
The [Plugin] SHALL replace `$rate(first_variable as a, second_variable as b) from table_name` with the following:
```
SELECT t, a/runningDifference(t/1000) aRate, b/runningDifference(t/1000) bRate FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, first_variable as a, second_variable as b from table_name WHERE {time_condition} GROUP BY t ORDER BY t
```


#### RQ.SRS.Plugin.Functions.RateColumns
version: 1.0

The [Plugin] SHALL support the `$rateColumns` function in SQL editor. This function SHALL be a combination of $columns and $rate functions.
The [Plugin] SHALL replace `$rateColumns(key as k, value as v) FROM table_name` with the following:
```
SELECT t, arrayMap(a -> (a.1, a.2/runningDifference( t/1000 )), groupArr) FROM (SELECT t, groupArray((k, v)) AS groupArr FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v FROM table_name WHERE {time_condition} GROUP BY t ORDER BY t
```


#### RQ.SRS.Plugin.Functions.RateColumnsAggregated
version: 1.0

The [Plugin] SHALL support the `$rateColumnsAggregated` function in SQL editor. This function SHALL calculate rate for higher cardinality dimension and then aggregate by lower cardinality dimension.
The [Plugin] SHALL replace `$rateColumnsAggregated(key as k, subkey as s, fun1 as f, val1 as v) from table_name` with the following:
```
SELECT t, k, fun1 as f(vRate) AS vRateAgg FROM (  SELECT t, k, s, v / runningDifference(t / 1000) AS vRate  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, subkey as s, max(val1) AS v   from table_name WHERE {time_condition}   GROUP BY k, s, t    ORDER BY k, s, t  ) ) GROUP BY k, t ORDER BY k, t
```

### Functions For Rate Per Second Computing

#### RQ.SRS.Plugin.Functions.PerSecond
version: 1.0

The [Plugin] SHALL support the `$perSecond` function in SQL editor. This function SHALL convert query results as "change rate per interval" 
for Counter-like(growing only) metrics.
The [Plugin] SHALL replace `$perSecond(first_variable as a, second_variable as b) FROM table_name` with the following:
```
SELECT t, if(runningDifference(max_0) < 0, nan, runningDifference(max_0) / runningDifference(t/1000)) AS max_0_PerSecond, if(runningDifference(max_1) < 0, nan, runningDifference(max_1) / runningDifference(t/1000)) AS max_1_PerSecond FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, max(first_variable as a) AS max_0, max(second_variable as b) AS max_1 FROM table_name WHERE {time_condition} GROUP BY t ORDER BY t
```


#### RQ.SRS.Plugin.Functions.PerSecondColumns
version: 1.0

The [Plugin] SHALL support the `$perSecondColumns` function in SQL editor. This function SHALL be a combination of $columns and $perSecond 
functions for Counter-like metrics.
The [Plugin] SHALL replace `$perSecondColumns(key as k, value as v) FROM table_name` with the following:
```
SELECT t, groupArray((k, max_0_PerSecond)) AS groupArr FROM ( SELECT t, k, if(runningDifference(max_0) < 0 OR neighbor(k,-1,k) != k, nan, runningDifference(max_0) / runningDifference(t/1000)) AS max_0_PerSecond FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, max(value as v) AS max_0 FROM table_name WHERE {time_condition} GROUP BY t ORDER BY t
```


#### RQ.SRS.Plugin.Functions.PerSecondColumnsAggregated
version: 1.0

The [Plugin] SHALL support the `$perSecondColumnsAggregated` function in SQL editor. This function SHALL calculate perSecond for higher cardinality dimension and then aggregate by lower cardinality dimension.
The [Plugin] SHALL replace `$perSecondColumnsAggregated(key as k, value as v, fun1 as f, val1 as v) FROM table_name` with the following:
```
SELECT t, k, fun1 as f(vPerSecond) AS vPerSecondAgg FROM (  SELECT t, k, v, if(runningDifference(v) < 0 OR neighbor(v,-1,v) != v, nan, runningDifference(v) / runningDifference(t / 1000)) AS vPerSecond  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v, max(val1) AS v   FROM table_name WHERE {time_condition}  GROUP BY k, v, t    ORDER BY k, v, t  ) ) GROUP BY k, t ORDER BY k, t
```


### Functions for Delta Value Computing

#### RQ.SRS.Plugin.Functions.Delta
version: 1.0

The [Plugin] SHALL support the `$delta` function in SQL editor. This function SHALL convert query results as "delta value inside interval" 
for Counter-like(growing only) metrics, will negative if counter reset.
The [Plugin] SHALL replace `$delta(first_variable as a, second_variable as b) from table_name` with the following:
```
SELECT t, runningDifference(max_0) AS max_0_Delta, runningDifference(max_1) AS max_1_Delta FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, max(first_variable as a) AS max_0, max(second_variable as b) AS max_1 from table_name WHERE {time_condition} GROUP BY t ORDER BY t)
```


#### RQ.SRS.Plugin.Functions.DeltaColumns
version: 1.0

The [Plugin] SHALL support the `$deltaColumns` function in SQL editor. This function SHALL be a combination of $columns and $delta 
functions for Counter-like metrics.
The [Plugin] SHALL replace `$deltaColumns(key as k, value as v) FROM table_name` with the following:
```
SELECT t, groupArray((k, max_0_Delta)) AS groupArr FROM ( SELECT t, k, if(neighbor(k,-1,k) != k, 0, runningDifference(max_0)) AS max_0_Delta FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, max(value as v) AS max_0 FROM table_name WHERE {time_condition} GROUP BY t, k ORDER BY k, t)) GROUP BY t ORDER BY t
```


#### RQ.SRS.Plugin.Functions.DeltaColumnsAggregated
version: 1.0

The [Plugin] SHALL support the `$deltaColumnsAggregated` function in SQL editor. This function SHALL calculate delta for higher cardinality dimension and then aggregate by lower cardinality dimension.
functions for Counter-like metrics.
The [Plugin] SHALL replace `$deltaColumnsAggregated(key as k, value as v) FROM table_name` with the following:
```
SELECT t, k, fun1 as f(vDelta) AS vDeltaAgg FROM (  SELECT t, k, v, if(neighbor(v,-1,v) != v, 0, runningDifference(v) / 1) AS vDelta  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v, max(val1) AS v   from table_name WHERE {time_condition}   GROUP BY k, v, t    ORDER BY k, v, t  ) ) GROUP BY k, t ORDER BY k, t
```

### Functions For Non-Negative Delta Value Computing

#### RQ.SRS.Plugin.Functions.Increase
version: 1.0

The [Plugin] SHALL support the `$increase` function in SQL editor. This function SHALL convert query results as "non-negative delta value inside interval" 
for Counter-like(growing only) metrics, will zero if counter reset and delta less zero.
The [Plugin] SHALL replace `$increase(first_variable as a, second_variable as b) from table_name` with the following:
```
SELECT t, groupArray((k, v)) AS groupArr FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v from table_name WHERE {time_condition} GROUP BY t ORDER BY t)
```


#### RQ.SRS.Plugin.Functions.IncreaseColumns
version: 1.0

The [Plugin] SHALL support the `$increaseColumns` function in SQL editor. This function SHALL be a combination of $columns and $increase 
functions for Counter-like metrics.
The [Plugin] SHALL replace `$increaseColumns(key as k, value as v) from table_name` with the following:
```
SELECT t, groupArray((a, max_0_Increase)) AS groupArr FROM ( SELECT t, a, if(runningDifference(max_0) < 0 OR neighbor(a,-1,a) != a, 0, runningDifference(max_0)) AS max_0_Increase FROM ( SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, first_variable as a, max(second_variable as b) AS max_0 from table_name WHERE {time_condition} GROUP BY t, a ORDER BY a, t)) GROUP BY t ORDER BY t
```


#### RQ.SRS.Plugin.Functions.IncreaseColumnsAggregated
version: 1.0

The [Plugin] SHALL support the `$increaseColumnsAggregated` function in SQL editor. This function SHALL calculate delta for higher cardinality dimension and then aggregate by lower cardinality dimension.
The [Plugin] SHALL replace `$increaseColumnsAggregated(key as k, value as v, fun1 as f, val1 as v) from table_name` with the following:
```
SELECT t, k, fun1 as f(vIncrease) AS vIncreaseAgg FROM (  SELECT t, k, v, if(runningDifference(v) < 0 OR neighbor(v,-1,v) != v, nan, runningDifference(v) / 1) AS vIncrease  FROM (   SELECT (intDiv(toUInt32(undefined), 30) * 30) * 1000 AS t, key as k, value as v, max(val1) AS v   from table_name WHERE {time_condition}   GROUP BY k, v, t    ORDER BY k, v, t  ) ) GROUP BY k, t ORDER BY k, t
```


### RQ.SRS.Plugin.Functions.Lttb
version: 1.0

The [Plugin] SHALL support the `$lttb` function in SQL editor.

### RQ.SRS.Plugin.Functions.SubQuery
version: 1.0

The [Plugin] SHALL support sub queries in SQL editor.

## Supported ClickHouse Datatypes

### RQ.SRS.Plugin.SupportedDataTypes
version: 1.0

The [Plugin] SHALL support scalar data types. The following data types SHALL be supported:



| Data Type                                                                           | Supported in Grafana |
| ----------------------------------------------------------------------------------- |:--------------------:|
| UInt8, UInt16, UInt32, UInt64, UInt128, UInt256                                     |       &#10004;       |
| Int8, Int16, Int32, Int64, Int128, Int256                                           |       &#10004;       |
| Float32, Float64                                                                    |       &#10004;       |
| Decimal(P), Decimal(P, S), Decimal32(S), Decimal64(S), Decimal128(S), Decimal256(S) |       &#10004;       |
| Bool                                                                                |       &#10004;       |
| String                                                                              |       &#10004;       |
| FixedString(N)                                                                      |       &#10004;       |
| Date, Date32, DateTime, DateTime64                                                  |       &#10004;       |
| JSON                                                                                |       &#10060;       |
| UUID                                                                                |       &#10004;       |
| Enum                                                                                |       &#10004;       |
| LowCardinality                                                                      |       &#10004;       |
| Array                                                                               |       &#10060;       |
| Map                                                                                 |       &#10060;       |
| SimpleAggregateFunction                                                             |       &#10004;       |
| AggregateFunction                                                                   |       &#10004;       |
| Nested                                                                              |       &#10060;       |
| Tuple                                                                               |       &#10060;       |
| Nullable                                                                            |       &#10004;       |
| IPv4                                                                                |       &#10004;       |
| IPv6                                                                                |       &#10004;       |
| Point                                                                               |       &#10060;       |
| Ring                                                                                |       &#10060;       |
| Polygon                                                                             |       &#10060;       |
| MultiPolygon                                                                        |       &#10060;       |
| Expression                                                                          |       &#10060;       |
| Set                                                                                 |       &#10060;       |
| Nothing                                                                             |       &#10060;       |
| Interval                                                                            |       &#10060;       |


### RQ.SRS.Plugin.SupportedDataTypes.LimitValues
version: 1.0

The [Plugin] SHALL support max and min values of [ClickHouse] numeric datatypes.

* Int8 — [-128 : 127]
* Int16 — [-32768 : 32767]
* Int32 — [-2147483648 : 2147483647]
* Int64 — [-9223372036854775808 : 9223372036854775807]
* Int128 — [-170141183460469231731687303715884105728 : 170141183460469231731687303715884105727]
* Int256 — [-57896044618658097711785492504343953926634992332820282019728792003956564819968 : 57896044618658097711785492504343953926634992332820282019728792003956564819967]
* UInt8 — [0 : 255]
* UInt16 — [0 : 65535]
* UInt32 — [0 : 4294967295]
* UInt64 — [0 : 18446744073709551615]
* UInt128 — [0 : 340282366920938463463374607431768211455]
* UInt256 — [0 : 115792089237316195423570985008687907853269984665640564039457584007913129639935]

 For float datatypes inf and - inf values not supported.
 

## Versions Compatibility

### RQ.SRS.Plugin.VersionCompatibility
version: 1.0

The [Plugin] 3.0 version SHALL support the following [Grafana] versions:

| Grafana version         | Supported with plugin |
| ----------------------- |:---------------------:|
| v10.3                   |                       |

[SRS]: #srs
[ClickHouse]: https://clickhouse.tech
[Plugin]: https://github.com/Altinity/clickhouse-grafana
[GitHub Repository]: https://github.com/Altinity/clickhouse-grafana
[Altinity Grafana Datasource Plugin For ClickHouse]: https://github.com/Altinity/clickhouse-grafana
[Grafana]: https://grafana.com/
[CORS]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
'''
)
