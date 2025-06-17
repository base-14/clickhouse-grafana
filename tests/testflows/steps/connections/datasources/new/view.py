from testflows.core import *

from steps.connections.datasources.new.locators import locators

import steps.ui as ui


@TestStep(When)
def open_add_new_datasource_endpoint(self, endpoint=None):
    """Open /connections/datasources/new."""
    if endpoint is None:
        endpoint = f"{self.context.endpoint}connections/datasources/new"

    ui.open_endpoint(endpoint=endpoint)


@TestStep(When)
def click_new_base14_plugin_datasource(self):
    """Click new base14 ClickHouse Datasource."""

    locators.new_altinity_plugin_datasource.click()
