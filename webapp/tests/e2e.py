#!/usr/bin/env python3
"""Focused browser checks for the first Hocus Acolyte interactive vertical slice."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import sys
import time
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
WEBAPP = ROOT / "webapp"
LOCAL_URL = "http://127.0.0.1:4174/"


def wait_for_server(url: str) -> None:
    for _ in range(30):
        try:
            with urlopen(url, timeout=1):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError(f"Static server did not start: {url}")


def run_checks(base_url: str) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()
        page.goto(f"{base_url}?slide=9", wait_until="networkidle")
        assert page.locator("#slide-title").inner_text() == "Chatbot contre agent — le déclic"
        assert page.locator(".chatbot-agent-interaction").count() == 1
        assert page.locator(".topbar-nav-button").count() == 2
        assert page.locator(".agent-step[data-state='upcoming']").count() == 7

        page.get_by_role("button", name="LANCER LA MISSION").click()
        assert page.locator(".chatbot-response.is-emphasized").is_visible()
        assert page.locator(".agent-step[data-state='active']").count() == 1
        assert page.locator(".agent-step-detail:visible").count() == 1
        assert not page.locator(".agent-final-result").is_visible()

        reveal = page.get_by_role("button", name="RÉVÉLER L’ÉTAPE SUIVANTE")
        for _ in range(6):
            reveal.click()
        assert page.locator(".agent-step[data-state='done']").count() == 7
        assert page.locator(".agent-final-result").is_visible()
        assert page.locator(".agent-step-detail:visible").count() == 7
        final_status = page.locator(".interaction-live-status").inner_text().lower()
        assert "validée" in final_status and "humain" in final_status

        page.goto(f"{base_url}?slide=9&present=1", wait_until="networkidle")
        assert "presentation-mode" in page.locator("body").get_attribute("class")
        assert page.locator(".topbar-navigation").is_visible()
        page.keyboard.press("ArrowRight")
        assert page.locator("#slide-counter").inner_text() == "10 / 23"

        reduced = browser.new_context(
            viewport={"width": 1440, "height": 1000}, reduced_motion="reduce"
        )
        reduced_page = reduced.new_page()
        reduced_page.goto(f"{base_url}?slide=9", wait_until="networkidle")
        transition = reduced_page.locator(".agent-step").first.evaluate(
            "element => getComputedStyle(element).transitionDuration"
        )
        assert float(transition.rstrip("s")) <= 0.0001, transition

        mobile = browser.new_context(viewport={"width": 390, "height": 844})
        mobile_page = mobile.new_page()
        mobile_page.goto(f"{base_url}?slide=9", wait_until="networkidle")
        assert mobile_page.locator(".topbar-navigation").is_visible()
        assert mobile_page.evaluate(
            "document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"
        )
        mobile_page.get_by_role("button", name="LANCER LA MISSION").click()
        assert mobile_page.locator(".agent-step-detail:visible").count() == 1
        assert mobile_page.evaluate(
            "document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"
        )

        desktop.close()
        reduced.close()
        mobile.close()
        browser.close()


def main() -> None:
    configured_url = os.environ.get("ACOLYTE_BASE_URL")
    server = None
    base_url = configured_url or LOCAL_URL
    if configured_url is None:
        server = subprocess.Popen(
            [sys.executable, "-m", "http.server", "4174", "--directory", str(WEBAPP)],
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

    print("Hocus Acolyte Playwright checks passed (desktop, mobile, interaction, deep link).")


if __name__ == "__main__":
    main()
