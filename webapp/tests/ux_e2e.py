#!/usr/bin/env python3
"""Browser checks for the parallel Acolyte UX directions."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import time
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
WEBAPP = ROOT / "webapp"
LOCAL_URL = "http://127.0.0.1:4175/"
VARIANTS = ["current", "editorial", "playground", "field-guide"]
VIEWS = ["home", "learn", "agent", "explore", "case"]


def wait_for_server(url: str) -> None:
    for _ in range(30):
        try:
            with urlopen(url, timeout=1):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError(f"Static server did not start: {url}")


def assert_no_horizontal_overflow(page) -> None:
    assert page.evaluate(
        "document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"
    )


def route(base_url: str, variant: str, view: str = "home", case: str | None = None) -> str:
    query = f"view={view}"
    if case:
        query += f"&case={case}"
    return f"{base_url}ux/{variant}/?{query}"


def run_checks(base_url: str) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()

        headings = {}
        for variant in VARIANTS:
            for view in VIEWS:
                page.goto(route(base_url, variant, view), wait_until="networkidle")
                assert page.locator("#ux-app").is_visible()
                assert page.locator(".acolyte-global-header").is_visible()
                assert page.locator(".site-nav").is_visible()
                assert_no_horizontal_overflow(page)
                headings[(view, variant)] = page.locator(".ux-main h1").inner_text().casefold()

        for view in VIEWS:
            assert len({headings[(view, variant)] for variant in VARIANTS}) == 1

        page.goto(route(base_url, "editorial", "explore"), wait_until="networkidle")
        page.select_option("#ux-industry-filter", "finance")
        assert page.locator(".ux-case-card").count() == 1
        page.get_by_role("link", name="Lire la fiche").click()
        assert "Qonto" in page.locator(".ux-main").inner_text()
        assert page.locator(".ux-source a[href*='claude.com']").count() == 1

        page.goto(route(base_url, "playground", "agent"), wait_until="networkidle")
        page.get_by_role("button", name="CONTEXTE RICHE").click()
        assert page.get_by_role("button", name="CONTEXTE FAIBLE").count() == 1
        run = page.get_by_role("button", name="Lancer la mission")
        for _ in range(6):
            run.click()
        assert page.locator(".ux-human-gate").is_visible()
        page.get_by_role("button", name="Rejouer la mission").click()
        assert page.locator(".ux-human-gate").count() == 0

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mobile_page = mobile.new_page()
        for variant in VARIANTS:
            for view in ["home", "agent", "explore", "case"]:
                mobile_page.goto(route(base_url, variant, view), wait_until="networkidle")
                assert_no_horizontal_overflow(mobile_page)
        mobile_page.goto(route(base_url, "editorial", "agent"), wait_until="networkidle")
        assert mobile_page.locator(".ux-pipeline").evaluate("element => getComputedStyle(element).display") == "grid"
        mobile_page.goto(f"{base_url}ux/", wait_until="networkidle")
        assert mobile_page.locator(".ux-pillar").count() == 4
        assert mobile_page.locator(".acolyte-global-header").is_visible()
        assert_no_horizontal_overflow(mobile_page)

        desktop.close()
        mobile.close()
        browser.close()


def main() -> None:
    configured_url = os.environ.get("ACOLYTE_BASE_URL")
    server = None
    base_url = configured_url or LOCAL_URL
    if configured_url is None:
        server = subprocess.Popen(
            ["python3", "-m", "http.server", "4175", "--directory", str(WEBAPP)],
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

    print("Acolyte UX direction checks passed (4 variants, 5 views, desktop, mobile, interactions).")


if __name__ == "__main__":
    main()
