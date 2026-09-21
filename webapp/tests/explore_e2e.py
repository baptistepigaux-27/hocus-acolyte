#!/usr/bin/env python3
"""Browser checks for the canonical Acolyte Explore catalog."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import time
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
WEBAPP = ROOT / "webapp"
LOCAL_URL = "http://127.0.0.1:4178/"
TOTAL_CASES = 100
DOCUMENTED_CASES = 59
AGENT_CASES = 26


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
    explore_url = f"{base_url}explore/"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()

        page.goto(explore_url, wait_until="networkidle")
        assert page.locator("#case-count").inner_text() == f"{TOTAL_CASES} cas"
        assert page.locator(".explore-card").count() == TOTAL_CASES
        assert page.locator(".proof-badge").count() >= TOTAL_CASES
        assert page.locator(".explore-card .proof-documented").count() == DOCUMENTED_CASES
        first_card = page.locator(".explore-card").first.bounding_box()
        assert first_card is not None and first_card["y"] < 1000
        assert_no_horizontal_overflow(page)

        page.select_option("#filter-solution_type", "agent")
        assert page.locator(".explore-card").count() == AGENT_CASES
        assert f"{AGENT_CASES} cas affichés" in page.locator("#results-count").inner_text().lower()
        assert page.locator("#active-filters [data-remove-filter='solution_type']").is_visible()
        page.locator("#active-filters [data-remove-filter='solution_type']").click()
        assert page.locator(".explore-card").count() == TOTAL_CASES
        evidence_values = page.locator("#filter-evidence_level option").evaluate_all("options => options.map(option => option.value)")
        assert evidence_values == ["all", "documented", "experience", "pattern", "concept"]
        page.select_option("#filter-evidence_level", "concept")
        assert page.locator(".explore-card").count() == 0
        assert page.locator("#case-empty").is_visible()
        page.locator("#reset-filters").click()
        page.locator("#case-search").fill("support")
        assert page.locator(".explore-card").count() == 7
        assert any("RIS" in text for text in page.locator(".explore-card").all_inner_texts())
        assert page.locator("#active-filters [data-remove-query]").is_visible()
        page.locator("#active-filters [data-remove-query]").click()
        assert page.locator(".explore-card").count() == TOTAL_CASES

        page.goto(f"{explore_url}?case=case-real-qonto-human-gate", wait_until="networkidle")
        assert page.locator(".explore-detail-hero h1").inner_text() == "Qonto — Agent + Human Gate"
        assert page.locator(".detail-editorial-intro h2").inner_text() == "Pourquoi ce cas mérite d’être regardé"
        assert "human gate" in page.locator(".detail-editorial-copy").inner_text().lower()
        assert page.locator(".detail-editorial-section h2").inner_text() == "Ce que ce cas montre"
        assert page.locator(".detail-acolyte-note").is_visible()
        assert page.locator(".detail-missing").count() == 0
        assert "company_size" not in page.locator(".detail-facts").inner_text()
        assert "business_function" not in page.locator(".detail-facts").inner_text()
        assert page.locator(".detail-proof-panel .proof-documented").is_visible()
        assert "RAPPORTÉ" in page.locator(".detail-results").inner_text()
        assert "Ouvrir la source" in page.locator(".detail-source").inner_text()
        assert page.locator(".detail-related-grid a").count() > 0
        page.locator("[data-back-catalog]").click()
        assert page.locator(".explore-card").count() == TOTAL_CASES

        page.goto(f"{explore_url}?case=case-pme-ops-incident", wait_until="networkidle")
        assert page.locator(".proof-pattern").is_visible()
        assert "ne décrit pas un déploiement client" in page.locator(".detail-editorial-copy").inner_text()
        assert "Non renseigné délai" not in page.locator(".explore-detail-page").inner_text()
        assert page.locator(".detail-undocumented").is_visible()

        page.goto(f"{base_url}ux/tutorial/?slide=2", wait_until="networkidle")
        bridge = page.locator(".tuto-explore-bridge")
        assert bridge.is_visible()
        assert "solution_type=agent" in bridge.get_attribute("href")

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mobile_page = mobile.new_page()
        mobile_page.goto(explore_url, wait_until="networkidle")
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.locator("#filter-toggle").click()
        assert mobile_page.locator("#explore-filters").is_visible()
        mobile_page.select_option("#filter-evidence_level", "documented")
        assert mobile_page.locator(".explore-card").count() == DOCUMENTED_CASES
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
            ["python3", "-m", "http.server", "4178", "--directory", str(WEBAPP)],
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

    print(f"Acolyte Explore checks passed ({TOTAL_CASES} cases, filters, search, detail, bridges, mobile).")


if __name__ == "__main__":
    main()
