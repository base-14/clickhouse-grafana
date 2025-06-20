from testflows.core import *
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.by import By as SelectBy


class Locators:
    # Locators for connections/datasources/new page

    @property
    def new_altinity_plugin_datasource(self):
        driver: WebDriver = current().context.driver
        return driver.find_element(SelectBy.CSS_SELECTOR, f"[aria-label='Add new data source base14 ClickHouse Datasource']")


locators = Locators()
