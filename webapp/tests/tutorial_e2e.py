#!/usr/bin/env python3
"""Browser checks for the Acolyte tutorial-board format prototype."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import time
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
WEBAPP = ROOT / "webapp"
LOCAL_URL = "http://127.0.0.1:4177/"


def wait_for_server(url: str) -> None:
    for _ in range(30):
        try:
            with urlopen(url, timeout=1):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError(f"Static server did not start: {url}")


def assert_no_horizontal_overflow(page, label: str) -> None:
    dimensions = page.evaluate(
        "({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth})"
    )
    assert dimensions["scrollWidth"] <= dimensions["clientWidth"] + 1, (
        f"Horizontal overflow at {label}: {dimensions}"
    )


def route(base_url: str, slide: int = 1, mode: str | None = None) -> str:
    query = f"slide={slide}"
    if mode:
        query += f"&mode={mode}"
    return f"{base_url}ux/tutorial/?{query}"


def run_checks(base_url: str) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()

        titles = []
        for slide in range(1, 11):
            page.goto(route(base_url, slide), wait_until="networkidle")
            assert page.locator(".tuto-board").is_visible()
            assert page.locator(".tuto-diagram").is_visible()
            assert page.locator(".tuto-reading").is_visible()
            assert page.locator(".tuto-progress i").is_visible()
            assert page.locator(".tuto-board-meta").get_by_text(f"LEÇON {slide:02d} / 10").is_visible()
            titles.append(page.locator(".tuto-reading h1").inner_text())
            assert_no_horizontal_overflow(page, f"desktop slide {slide}")
        assert len(set(titles)) == 10

        page.goto(route(base_url, 1), wait_until="networkidle")
        page.get_by_role("button", name="Planche suivante").click()
        assert "slide=2" in page.url
        page.get_by_role("button", name="Planche précédente").click()
        assert "slide=1" in page.url
        page.get_by_role("button", name="CONTENU").click()
        assert page.locator(".tuto-index").is_visible()
        assert page.locator(".tuto-index > button").count() == 10
        page.locator('[data-slide="8"]').click()
        assert "slide=8" in page.url
        assert "HUMAN GATE" in page.locator(".tuto-reading").inner_text()

        page.goto(route(base_url, 2, "explore"), wait_until="networkidle")
        page.get_by_role("button", name="OBJECTIF").click()
        assert page.locator(".tuto-node.is-focused").is_visible()
        assert page.locator(".tuto-node.is-focused small").is_visible()
        page.get_by_role("button", name="MODE LECTURE").click()
        assert "mode=explore" not in page.url

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mobile_page = mobile.new_page()
        for slide in range(1, 11):
            mobile_page.goto(route(base_url, slide), wait_until="networkidle")
            assert_no_horizontal_overflow(mobile_page, f"mobile slide {slide}")
            assert mobile_page.locator(".tuto-board").is_visible()
        mobile_page.goto(route(base_url, 2, "explore"), wait_until="networkidle")
        assert_no_horizontal_overflow(mobile_page, "mobile explore")

        desktop.close()
        mobile.close()
        browser.close()


def main() -> None:
    configured_url = os.environ.get("ACOLYTE_BASE_URL")
    server = None
    base_url = configured_url or LOCAL_URL
    if configured_url is None:
        server = subprocess.Popen(
            ["python3", "-m", "http.server", "4177", "--directory", str(WEBAPP)],
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

    print("Acolyte tutorial-board checks passed (10 slides, split layout, navigation, index, exploration, mobile).")


if __name__ == "__main__":
    main()
