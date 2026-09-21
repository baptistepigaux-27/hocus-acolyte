#!/usr/bin/env python3
"""Browser checks for the shared Acolyte navigation on served pages."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import time
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
WEBAPP = ROOT / "webapp"
LOCAL_URL = "http://127.0.0.1:4179/"
ROUTES = [
    "",
    "explore/",
    "ux/",
    "ux/current/?view=home",
    "ux/editorial/?view=explore",
    "ux/playground/?view=agent",
    "ux/field-guide/?view=case",
    "ux/round-2/",
    "ux/round-2/manual/?view=home",
    "ux/round-2/lab/?view=agent",
    "ux/round-2/system/?view=explore",
    "ux/round-2/review/?view=case",
    "ux/tutorial/?slide=1",
]


def wait_for_server(url: str) -> None:
    for _ in range(30):
        try:
            with urlopen(url, timeout=1):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError(f"Static server did not start: {url}")


def assert_no_horizontal_overflow(page) -> None:
    dimensions = page.evaluate(
        "({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth})"
    )
    assert dimensions["scrollWidth"] <= dimensions["clientWidth"] + 1, dimensions


def run_checks(base_url: str) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()

        for route in ROUTES:
            page.goto(f"{base_url}{route}", wait_until="networkidle")
            assert page.locator(".site-nav").is_visible(), route
            assert page.locator(".site-nav-home").inner_text().casefold() == "home", route
            assert page.locator("link[rel='icon'][href*='acolyte-o.png']").count() == 1, route
            assert page.locator(".site-nav-group").count() == 4, route
            assert page.locator(".acolyte-global-header").count() == 1, route
            assert page.locator(".acolyte-global-brand").is_visible(), route
            if route:
                assert page.locator(".acolyte-global-brand-mark").is_visible(), route
            else:
                assert page.locator(".brand-mark[src*='acolyte-o.png']").is_visible()
            assert_no_horizontal_overflow(page)

        page.locator(".site-nav-group").nth(1).locator("summary").click()
        assert page.locator(".site-nav-group").nth(1).locator(".site-nav-panel").is_visible()
        assert sum(group.get_attribute("open") is not None for group in page.locator(".site-nav-group").all()) == 1
        page.locator(".site-nav-group").nth(2).locator("summary").click()
        assert not page.locator(".site-nav-group").nth(1).get_attribute("open")
        assert page.locator(".site-nav-group").nth(2).locator(".site-nav-panel").is_visible()

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mobile_page = mobile.new_page()
        for route in ["explore/", "ux/current/?view=home", "ux/round-2/lab/?view=home", "ux/tutorial/?slide=1"]:
            mobile_page.goto(f"{base_url}{route}", wait_until="networkidle")
            assert mobile_page.locator(".acolyte-global-header").is_visible(), route
            assert_no_horizontal_overflow(mobile_page)
            mobile_page.locator(".site-nav-group").nth(0).locator("summary").click()
            assert mobile_page.locator(".site-nav-group").nth(0).locator(".site-nav-panel").is_visible()
            mobile_page.locator(".site-nav-group").nth(0).locator("summary").click()

        desktop.close()
        mobile.close()
        browser.close()


def main() -> None:
    configured_url = os.environ.get("ACOLYTE_BASE_URL")
    server = None
    base_url = configured_url or LOCAL_URL
    if configured_url is None:
        server = subprocess.Popen(
            ["python3", "-m", "http.server", "4179", "--directory", str(WEBAPP)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        wait_for_server(base_url)

    try:
        run_checks(base_url)
    finally:
        if server is not None:
            server.terminate()
            server.wait(timeout=5)

    print(f"Acolyte shared navigation checks passed ({len(ROUTES)} served routes, desktop, mobile).")


if __name__ == "__main__":
    main()
