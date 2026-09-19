#!/usr/bin/env python3
"""Browser checks for the deliberately divergent Acolyte UX round 2."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import time
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
WEBAPP = ROOT / "webapp"
LOCAL_URL = "http://127.0.0.1:4176/"
DIRECTIONS = ["manual", "lab", "system", "review"]
VIEWS = ["home", "learn", "agent", "explore", "case"]


def wait_for_server(url: str) -> None:
    for _ in range(30):
        try:
            with urlopen(url, timeout=1):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError(f"Static server did not start: {url}")


def route(base_url: str, direction: str, view: str = "home", case: str | None = None) -> str:
    query = f"view={view}"
    if case:
        query += f"&case={case}"
    return f"{base_url}ux/round-2/{direction}/?{query}"


def assert_no_horizontal_overflow(page, route_label: str = "") -> None:
    dimensions = page.evaluate(
        "({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth})"
    )
    assert dimensions["scrollWidth"] <= dimensions["clientWidth"] + 1, (
        f"Horizontal overflow at {route_label}: {dimensions}"
    )


def run_checks(base_url: str) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()

        headings = {}
        for direction in DIRECTIONS:
            for view in VIEWS:
                page.goto(route(base_url, direction, view), wait_until="networkidle")
                assert page.locator("#round2-app").is_visible()
                assert page.locator(".r2-primary-nav").is_visible()
                assert page.locator(f"body.r2-{direction}").count() == 1
                assert_no_horizontal_overflow(page, f"desktop {direction}/{view}")
                headings[(view, direction)] = page.locator(".r2-main h1").inner_text().casefold()

        for view in VIEWS:
            assert len({headings[(view, direction)] for direction in DIRECTIONS}) == 1

        page.goto(route(base_url, "system", "explore"), wait_until="networkidle")
        page.select_option("#r2-industry-filter", "finance")
        assert page.locator("#r2-case-results a").count() == 1
        page.get_by_role("link", name="EXPLORER ↗").click()
        assert "Qonto" in page.locator(".r2-main").inner_text()
        assert page.locator(".r2-case-source a[href*='claude.com']").count() == 1

        page.goto(route(base_url, "lab", "agent"), wait_until="networkidle")
        page.get_by_role("button", name="CONTEXTE RICHE").click()
        assert page.get_by_role("button", name="CONTEXTE FAIBLE").count() == 1
        run = page.get_by_role("button", name="Lancer la mission")
        for _ in range(6):
            run.click()
        assert page.locator(".r2-human-gate").is_visible()
        page.get_by_role("button", name="Rejouer la mission").click()
        assert page.locator(".r2-human-gate").count() == 0

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mobile_page = mobile.new_page()
        for direction in DIRECTIONS:
            for view in ["home", "learn", "agent", "explore", "case"]:
                mobile_page.goto(route(base_url, direction, view), wait_until="networkidle")
                assert_no_horizontal_overflow(mobile_page, f"mobile {direction}/{view}")
        mobile_page.goto(f"{base_url}ux/round-2/", wait_until="networkidle")
        assert mobile_page.locator(".r2-direction-chooser a").count() == 4
        assert_no_horizontal_overflow(mobile_page, "mobile chooser")

        desktop.close()
        mobile.close()
        browser.close()


def main() -> None:
    configured_url = os.environ.get("ACOLYTE_BASE_URL")
    server = None
    base_url = configured_url or LOCAL_URL
    if configured_url is None:
        server = subprocess.Popen(
            ["python3", "-m", "http.server", "4176", "--directory", str(WEBAPP)],
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

    print("Acolyte UX round 2 checks passed (4 directions, 5 views, desktop, mobile, interactions).")


if __name__ == "__main__":
    main()
