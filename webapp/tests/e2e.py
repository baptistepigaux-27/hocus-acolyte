#!/usr/bin/env python3
"""Focused browser checks for the Hocus Acolyte interactive draft."""

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


def assert_no_horizontal_overflow(page) -> None:
    assert page.evaluate(
        "document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"
    )


def assert_visual_fits_canvas(page) -> None:
    assert page.evaluate(
        """() => {
            const canvas = document.querySelector('.visual-canvas');
            if (!canvas) return false;
            return canvas.scrollWidth <= canvas.clientWidth + 1
                && [...canvas.children].every((child) => {
                    if (child.hidden || getComputedStyle(child).display === 'none') return true;
                    const canvasBox = canvas.getBoundingClientRect();
                    const childBox = child.getBoundingClientRect();
                    return childBox.left >= canvasBox.left - 1
                        && childBox.right <= canvasBox.right + 1;
                });
        }"""
    )


def run_checks(base_url: str) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        desktop = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = desktop.new_page()
        page.goto(base_url, wait_until="networkidle")
        assert page.locator("#home-content").is_visible()
        assert page.locator(".app-layout").is_hidden()
        assert page.locator(".home-journey-grid .home-card").count() == 2
        assert page.locator(".home-module-card").count() == 4
        assert page.locator(".home-mini-grid a").count() == 8
        assert page.locator(".site-nav-group").count() == 4
        assert page.locator(".site-nav-home").is_visible()
        page.locator(".site-nav-group").nth(1).locator("summary").click()
        assert page.locator(".site-nav-link-accent").first.is_visible()
        assert page.locator(".site-nav-panel:visible").count() == 1
        page.locator(".site-nav-group").nth(2).locator("summary").click()
        assert page.locator(".site-nav-panel:visible").count() == 1
        assert page.locator(".site-nav-compact-link:visible").count() == 8
        panel_box = page.locator(".site-nav-panel:visible").bounding_box()
        assert panel_box is not None
        assert panel_box["x"] >= 0 and panel_box["x"] + panel_box["width"] <= 1440
        assert_no_horizontal_overflow(page)

        page.goto(f"{base_url}?journey=operating-system&slide=9", wait_until="networkidle")
        assert page.locator("#slide-title").inner_text() == "Chatbot contre agent — le déclic"
        assert page.locator(".chatbot-agent-interaction").count() == 1
        assert page.locator(".topbar-nav-button").count() == 2
        assert page.locator(".journey-link").count() == 2
        assert page.locator(".journey-link[data-journey='operating-system']").get_attribute("aria-current") == "page"
        assert page.locator(".agent-step[data-state='upcoming']").count() == 7
        assert_visual_fits_canvas(page)

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
        assert_visual_fits_canvas(page)

        page.goto(f"{base_url}?journey=operating-system&slide=10&function=commerce", wait_until="networkidle")
        assert page.locator(".step-flow").count() == 1
        assert_visual_fits_canvas(page)

        page.goto(f"{base_url}?module=cases&journey=pme&slide=3", wait_until="networkidle")
        assert page.locator(".module-content").is_visible()
        assert page.locator(".app-layout").is_hidden()
        assert page.locator(".real-case-card").count() == 7
        page.select_option("#case-industry-filter", "finance")
        assert page.locator(".real-case-card").count() == 1
        page.locator("[data-open-case='qonto-human-gate']").click()
        assert page.locator(".module-drawer").is_visible()
        assert "Qonto" in page.locator(".module-drawer").inner_text()
        assert page.locator(".module-drawer a[href*='claude.com']").count() == 1
        assert page.locator(".module-bridge-link[href*='module=agent-lab']").count() == 1
        page.locator(".module-drawer [data-close-case]").first.click()
        assert page.locator(".module-drawer").count() == 0
        assert page.evaluate("document.activeElement?.dataset.openCase === 'qonto-human-gate'")
        page.select_option("#case-industry-filter", "all")
        page.select_option("#case-level-filter", "tool")
        assert page.locator(".real-case-card").count() == 1
        assert "Original Tamale" in page.locator(".real-case-card").inner_text()

        page.goto(f"{base_url}?module=agent-lab&journey=pme&slide=3", wait_until="networkidle")
        assert page.locator(".agent-tool").count() == 7
        assert page.locator(".agent-human-gate").is_hidden()
        assert page.locator("[data-agent-permission='crm-update']").inner_text() == "ASK FIRST"
        page.locator("[data-agent-tool='crm-update']").click()
        assert page.locator("[data-agent-permission='crm-update']").inner_text() == "DENIED"
        page.locator("[data-agent-tool='crm-update']").click()
        assert page.locator("[data-agent-permission='crm-update']").inner_text() == "AUTO"
        page.get_by_role("button", name="LANCER LA MISSION").click()
        assert page.locator(".agent-mission-steps li[data-state='active']").count() == 1
        for _ in range(5):
            page.get_by_role("button", name="RÉVÉLER L’ÉTAPE SUIVANTE").click()
        assert page.locator(".agent-human-gate").is_visible()
        page.get_by_role("button", name="MODIFIER", exact=True).click()
        assert "modifier choisi" in page.locator("#agent-live-status").inner_text().lower()
        page.get_by_role("button", name="ANNULER", exact=True).click()
        assert "annuler choisi" in page.locator("#agent-live-status").inner_text().lower()
        page.get_by_role("button", name="VALIDER", exact=True).click()
        assert "aucune action distante" in page.locator("#agent-live-status").inner_text().lower()
        page.get_by_role("button", name="REJOUER LA MISSION", exact=True).click()
        assert page.locator(".agent-human-gate").is_hidden()

        page.goto(f"{base_url}?module=memory-map&journey=pme&slide=3", wait_until="networkidle")
        assert page.locator(".memory-type-grid article").count() == 4
        page.get_by_role("button", name="LLM SEUL").click()
        assert "je ne sais pas" in page.locator("#memory-query-result").inner_text().lower()
        page.get_by_role("button", name="LLM + KNOWLEDGE").click()
        assert "12 %" in page.locator("#memory-query-result").inner_text()
        page.get_by_role("button", name="CRM", exact=True).click()
        assert "système métier" in page.locator("#memory-lifecycle-result").inner_text().lower()

        page.goto(f"{base_url}?slide=5", wait_until="networkidle")
        assert page.locator(".context-builder-interaction").count() == 1
        context_options = page.locator(".context-option")
        assert context_options.count() == 5
        assert page.locator(".context-builder-interaction").get_attribute("data-phase") == "base"
        assert page.locator(".context-answer").inner_text().startswith("RÉPONSE ÉVOLUTIVE")
        context_options.nth(0).click()
        assert page.locator(".context-option").nth(0).get_attribute("aria-pressed") == "true"
        assert page.locator(".context-answer.is-emphasized").is_visible()
        assert "décision" in page.locator(".context-answer").inner_text().lower()
        for index in range(1, context_options.count()):
            context_options.nth(index).click()
        assert page.locator(".context-builder-interaction").get_attribute("data-phase") == "complete"
        assert page.get_by_role("button", name="RÉINITIALISER").is_visible()
        assert "complet" in page.locator(".context-unknowns").inner_text().lower()
        page.get_by_role("button", name="RÉINITIALISER").click()
        assert page.locator(".context-builder-interaction").get_attribute("data-phase") == "base"

        page.goto(f"{base_url}?slide=7", wait_until="networkidle")
        assert page.locator(".memory-recall-interaction").count() == 1
        assert page.get_by_role("button", name="SANS MÉMOIRE").get_attribute("aria-pressed") == "true"
        assert page.locator(".memory-library").is_hidden()
        assert "réexpliquer" in page.locator(".memory-live-status").inner_text().lower()
        page.get_by_role("button", name="AVEC MÉMOIRE").click()
        assert page.locator(".memory-library").is_visible()
        page.locator(".memory-note[data-memory-key='decision']").click()
        assert page.locator(".recalled-note").is_visible()
        assert "12 juin" in page.locator(".recalled-note").inner_text().lower()
        assert "source" in page.locator(".recalled-note-source").inner_text().lower()
        assert "réinjectée" in page.locator(".memory-live-status").inner_text().lower()

        page.goto(f"{base_url}?journey=pme&slide=1", wait_until="networkidle")
        assert page.locator("#slide-title").inner_text() == "Une PME n’a pas « un cas d’usage IA »"
        assert page.locator("#slide-counter").inner_text() == "01 / 17"
        assert "PME AI OVERVIEW" in page.locator("#journey-status").inner_text()
        assert page.locator(".journey-link[data-journey='pme']").get_attribute("aria-current") == "page"
        assert page.locator(".pme-level-card").count() == 6

        page.goto(f"{base_url}?journey=pme&slide=3", wait_until="networkidle")
        assert page.locator(".opportunity-map-interaction").count() == 1
        assert page.locator(".opportunity-function-button").count() == 8
        assert page.locator(".opportunity-function-button[data-function-key='commerce']").get_attribute("aria-pressed") == "true"
        assert page.locator(".opportunity-cell").count() == 5
        assert "commerce" in page.locator(".opportunity-result-title").inner_text().lower()
        page.locator(".opportunity-function-button[data-function-key='finance']").click()
        assert page.locator(".opportunity-map-interaction").get_attribute("data-function") == "finance"
        assert "facture" in page.locator(".opportunity-matrix").inner_text().lower()
        page.locator(".opportunity-function-button[data-function-key='operations']").click()
        assert "incident" in page.locator(".opportunity-matrix").inner_text().lower()
        page.locator(".opportunity-function-button[data-function-key='commerce']").click()
        tender_card = page.locator(".opportunity-card[data-opportunity-id='sales-tender']")
        tender_card.click()
        assert page.locator(".opportunity-detail-panel").is_visible()
        assert "has-detail" in page.locator(".opportunity-map-interaction").get_attribute("class")
        assert "appel d’offres" in page.locator(".opportunity-detail-title").inner_text().lower()
        assert "approche fréquente" in page.locator(".opportunity-detail-mode").inner_text().lower()
        assert "configure" in page.locator(".opportunity-detail-mode").inner_text().lower()
        detail_text = page.locator(".opportunity-detail-panel").inner_text().lower()
        assert "dce" in detail_text and "capacités ia" in detail_text and "briques possibles" in detail_text
        assert "workflow automation" in detail_text and "n8n" in detail_text and "famille de solution" in detail_text
        assert page.locator(".opportunity-implementation-legend").count() == 1
        assert page.evaluate("document.activeElement === document.querySelector('.opportunity-detail-title')")
        page.get_by_role("button", name="FERMER", exact=True).click()
        assert page.locator(".opportunity-detail-panel").is_hidden()
        assert page.evaluate("document.activeElement?.dataset.opportunityId === 'sales-tender'")
        page.locator(".opportunity-card[data-opportunity-id='sales-tender']").click()
        page.keyboard.press("Escape")
        assert page.locator(".opportunity-detail-panel").is_hidden()
        assert page.evaluate("document.activeElement?.dataset.opportunityId === 'sales-tender'")
        page.locator(".opportunity-function-button[data-function-key='finance']").click()
        assert page.locator(".opportunity-detail-panel").is_hidden()
        assert "facture" in page.locator(".opportunity-matrix").inner_text().lower()

        page.goto(f"{base_url}?journey=pme&slide=3&function=commerce&opportunity=sales-tender", wait_until="networkidle")
        assert page.locator(".opportunity-map-interaction").get_attribute("data-function") == "commerce"
        assert page.locator(".opportunity-detail-panel").is_visible()
        assert "appel d’offres" in page.locator(".opportunity-detail-title").inner_text().lower()
        assert "opportunity=sales-tender" in page.url
        page.get_by_role("button", name="FERMER", exact=True).click()
        assert "opportunity=" not in page.url
        assert "function=commerce" in page.url
        page.goto(f"{base_url}?journey=pme&slide=3&function=finance&opportunity=sales-tender", wait_until="networkidle")
        assert page.locator(".opportunity-map-interaction").get_attribute("data-function") == "finance"
        assert page.locator(".opportunity-detail-panel").is_hidden()
        page.goto(f"{base_url}?journey=pme&slide=3&function=unknown&opportunity=sales-tender", wait_until="networkidle")
        assert page.locator(".opportunity-map-interaction").get_attribute("data-function") == "commerce"
        assert page.locator(".opportunity-detail-panel").is_hidden()

        for slide_id, expected_counter in [(4, "04 / 17"), (5, "05 / 17"), (6, "06 / 17"), (9, "09 / 17"), (11, "11 / 17"), (13, "13 / 17"), (14, "14 / 17"), (17, "17 / 17")]:
            page.goto(f"{base_url}?journey=pme&slide={slide_id}", wait_until="networkidle")
            assert page.locator("#slide-counter").inner_text() == expected_counter

        page.goto(f"{base_url}?journey=pme&slide=4", wait_until="networkidle")
        assert page.locator(".solution-family-card").count() == 5
        page.goto(f"{base_url}?journey=pme&slide=5", wait_until="networkidle")
        assert page.locator(".role-selector-tab").count() == 4
        page.locator(".role-selector-tab[data-role-key='finance']").click()
        assert "contrôler une facture" in page.locator(".role-task-list").inner_text().lower()
        page.goto(f"{base_url}?journey=pme&slide=6", wait_until="networkidle")
        page.get_by_role("button", name="SANS CONNAISSANCE").click()
        assert "générique" in page.locator(".knowledge-response").inner_text().lower()
        page.goto(f"{base_url}?journey=pme&slide=9", wait_until="networkidle")
        page.get_by_role("button", name="LANCER LA PRÉPARATION").click()
        assert page.locator(".agent-business-step[data-state='done']").count() == 1
        page.goto(f"{base_url}?journey=pme&slide=13", wait_until="networkidle")
        assert page.locator(".opportunity-scoring-case").count() == 3
        page.locator(".opportunity-scoring-case[data-opportunity-id='sales-meeting']").click()
        assert "days" in page.locator(".opportunity-scoring-detail").inner_text().lower()
        page.locator(".opportunity-scoring-case[data-opportunity-id='finance-invoice']").click()
        scoring_text = page.locator(".opportunity-scoring-detail").inner_text().lower()
        assert "contrôler une facture" in scoring_text and "à vérifier" in scoring_text and "règles de contrôle" in scoring_text
        page.goto(f"{base_url}?journey=pme&slide=14", wait_until="networkidle")
        page.locator(".portfolio-card[data-portfolio-key='strategic-bets']").click()
        portfolio_text = page.locator(".portfolio-detail").inner_text().lower()
        assert "cockpit de pilotage" in portfolio_text and "direction" in portfolio_text and "build" in portfolio_text
        page.get_by_role("link", name="APPROFONDIR DANS LA MAP →").click()
        page.wait_for_load_state("networkidle")
        assert "slide=3" in page.url and "function=direction" in page.url and "opportunity=direction-cockpit" in page.url
        assert page.locator(".opportunity-detail-panel").is_visible()
        assert "cockpit de pilotage" in page.locator(".opportunity-detail-title").inner_text().lower()
        page.get_by_role("button", name="FERMER", exact=True).click()
        page.goto(f"{base_url}?journey=pme&slide=11", wait_until="networkidle")
        page.locator(".function-overview-tab[data-function-key='finance']").click()
        page.get_by_role("link", name="OUVRIR DANS L’OPPORTUNITY MAP →").click()
        page.wait_for_load_state("networkidle")
        assert "function=finance" in page.url and "opportunity=finance-invoice" in page.url
        assert page.locator(".opportunity-detail-panel").is_visible()
        assert "contrôler une facture" in page.locator(".opportunity-detail-title").inner_text().lower()
        page.goto(f"{base_url}?journey=pme&slide=17", wait_until="networkidle")
        assert "3 opportunités prioritaires" in page.locator(".pme-conclusion-output").inner_text().lower().replace("\n", " ")

        page.goto(f"{base_url}?journey=pme&slide=3&present=1", wait_until="networkidle")
        assert "presentation-mode" in page.locator("body").get_attribute("class")
        assert page.locator(".opportunity-map-interaction").is_visible()
        assert not page.locator(".slide-copy").is_visible()

        page.goto(f"{base_url}?journey=operating-system&slide=1", wait_until="networkidle")
        assert page.locator("#slide-title").inner_text() == "Vous connaissez déjà une partie de l’histoire"
        assert page.locator(".opportunity-map-interaction").count() == 0
        page.goto(f"{base_url}?journey=pme&slide=3", wait_until="networkidle")
        assert page.locator(".opportunity-map-interaction").get_attribute("data-function") == "commerce"

        page.goto(f"{base_url}?slide=12", wait_until="networkidle")
        assert page.locator(".handoff-interaction").count() == 1
        assert page.locator(".handoff-stage").count() == 6
        assert "BRIEF-001" in page.locator(".handoff-artifact").inner_text()
        page.get_by_role("button", name="LANCER LE HANDOFF").click()
        assert page.locator(".handoff-stage-detail:visible").count() == 1
        handoff_reveal = page.get_by_role("button", name="FAIRE SUIVRE L’ARTEFACT")
        for _ in range(5):
            handoff_reveal.click()
        assert page.locator(".handoff-stage[data-state='done']").count() == 6
        assert page.locator(".handoff-stage-detail:visible").count() == 6
        assert page.locator(".handoff-stage-artifact:visible").count() == 6
        assert "validation humaine" in page.locator(".handoff-live-status").inner_text().lower()

        page.goto(f"{base_url}?slide=18", wait_until="networkidle")
        assert page.locator(".idea-product-interaction").count() == 1
        assert page.locator(".idea-stage").count() == 12
        assert "DCE ANALYZER" in page.locator(".idea-artifact").inner_text()
        page.get_by_role("button", name="FAIRE ÉVOLUER L’ARTEFACT").click()
        assert page.locator(".idea-stage-detail:visible").count() == 1
        assert not page.locator(".idea-final-result").is_visible()
        idea_reveal = page.get_by_role("button", name="RÉVÉLER L’ÉTAPE SUIVANTE")
        for _ in range(11):
            idea_reveal.click()
        assert page.locator(".idea-stage[data-state='done']").count() == 12
        assert page.locator(".idea-stage-detail:visible").count() == 12
        assert page.locator(".idea-final-result").is_visible()
        assert "outil testable" in page.locator(".idea-live-status").inner_text().lower()

        page.goto(f"{base_url}?slide=9&present=1", wait_until="networkidle")
        assert "presentation-mode" in page.locator("body").get_attribute("class")
        assert page.locator(".topbar-navigation").is_visible()
        page.keyboard.press("ArrowRight")
        assert page.locator("#slide-counter").inner_text() == "10 / 23"

        for viewport in [(1440, 900), (1920, 1080)]:
            presentation_audit = browser.new_context(viewport={"width": viewport[0], "height": viewport[1]})
            presentation_page = presentation_audit.new_page()
            for slide_id in [3, 7, 10, 13, 14, 15, 17]:
                presentation_page.goto(f"{base_url}?journey=pme&slide={slide_id}&present=1", wait_until="networkidle")
                assert "presentation-mode" in presentation_page.locator("body").get_attribute("class")
                assert presentation_page.locator("#slide-counter").inner_text() == f"{slide_id:02} / 17"
                assert_no_horizontal_overflow(presentation_page)
            presentation_page.goto(f"{base_url}?journey=pme&slide=3&present=1", wait_until="networkidle")
            assert presentation_page.locator(".opportunity-column-label").count() == 5
            presentation_page.locator(".opportunity-card[data-opportunity-id='sales-tender']").click()
            assert presentation_page.locator(".opportunity-detail-panel").is_visible()
            assert presentation_page.locator(".opportunity-detail-title").evaluate("element => parseFloat(getComputedStyle(element).fontSize)") >= 24
            assert presentation_page.locator(".opportunity-card strong").first.evaluate("element => parseFloat(getComputedStyle(element).fontSize)") >= 15
            assert presentation_page.locator(".opportunity-card span").first.evaluate("element => parseFloat(getComputedStyle(element).fontSize)") >= 11
            assert presentation_page.locator(".opportunity-card em").first.evaluate("element => parseFloat(getComputedStyle(element).fontSize)") >= 10
            assert presentation_page.locator(".opportunity-column-label").first.evaluate("element => parseFloat(getComputedStyle(element).fontSize)") >= 11
            assert_no_horizontal_overflow(presentation_page)
            presentation_audit.close()

        reduced = browser.new_context(
            viewport={"width": 1440, "height": 1000}, reduced_motion="reduce"
        )
        reduced_page = reduced.new_page()
        reduced_page.goto(f"{base_url}?slide=9", wait_until="networkidle")
        transition = reduced_page.locator(".agent-step").first.evaluate(
            "element => getComputedStyle(element).transitionDuration"
        )
        assert float(transition.rstrip("s")) <= 0.0001, transition

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mobile_page = mobile.new_page()
        mobile_page.goto(f"{base_url}?slide=9", wait_until="networkidle")
        assert mobile_page.locator(".topbar-navigation").is_visible()
        mobile_page.locator(".site-nav-group").nth(1).locator("summary").click()
        assert mobile_page.locator(".site-nav-panel:visible").count() == 1
        assert mobile_page.locator(".site-nav-link-accent").first.is_visible()
        assert_no_horizontal_overflow(mobile_page)
        assert_visual_fits_canvas(mobile_page)
        mobile_page.get_by_role("button", name="LANCER LA MISSION").click()
        assert mobile_page.locator(".agent-step-detail:visible").count() == 1
        assert_no_horizontal_overflow(mobile_page)
        assert_visual_fits_canvas(mobile_page)
        mobile_page.goto(f"{base_url}?journey=operating-system&slide=10&function=commerce", wait_until="networkidle")
        assert mobile_page.locator(".step-flow").count() == 1
        assert_no_horizontal_overflow(mobile_page)
        assert_visual_fits_canvas(mobile_page)
        for module_key in ["cases", "agent-lab", "memory-map"]:
            mobile_page.goto(f"{base_url}?module={module_key}&journey=pme&slide=3", wait_until="networkidle")
            assert mobile_page.locator(".module-content").is_visible()
            assert_no_horizontal_overflow(mobile_page)
        mobile_page.goto(f"{base_url}?module=cases&journey=pme&slide=3", wait_until="networkidle")
        assert mobile_page.locator(".real-case-card").count() == 7
        mobile_page.goto(f"{base_url}?module=agent-lab&journey=pme&slide=3", wait_until="networkidle")
        assert mobile_page.locator(".agent-lab-pipeline").evaluate("element => getComputedStyle(element).display") == "grid"
        mobile_page.goto(f"{base_url}?module=memory-map&journey=pme&slide=3", wait_until="networkidle")
        assert mobile_page.locator(".memory-type-grid").evaluate("element => getComputedStyle(element).gridTemplateColumns.split(' ').length") == 1
        mobile_page.goto(f"{base_url}?slide=5", wait_until="networkidle")
        assert mobile_page.locator(".context-builder-interaction").is_visible()
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.locator(".context-option[data-context-key='objective']").click()
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.goto(f"{base_url}?journey=pme&slide=3", wait_until="networkidle")
        assert mobile_page.locator(".opportunity-map-interaction").is_visible()
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.locator(".opportunity-function-button[data-function-key='marketing']").click()
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.locator(".opportunity-card").first.click()
        assert mobile_page.locator(".opportunity-detail-panel").is_visible()
        assert mobile_page.locator(".opportunity-detail-panel").evaluate("element => getComputedStyle(element).position") == "fixed"
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.keyboard.press("Escape")
        assert mobile_page.locator(".opportunity-detail-panel").is_hidden()
        for slide_id in range(1, 18):
            mobile_page.goto(f"{base_url}?journey=pme&slide={slide_id}", wait_until="networkidle")
            assert mobile_page.locator("#slide-counter").inner_text() == f"{slide_id:02} / 17"
            assert mobile_page.locator("#slide-title").inner_text()
            assert_no_horizontal_overflow(mobile_page)
        mobile_page.goto(f"{base_url}?journey=pme&slide=7", wait_until="networkidle")
        assert mobile_page.locator(".pme-process-pipeline").evaluate("element => getComputedStyle(element).display") == "grid"
        assert mobile_page.locator(".pme-process-pipeline").evaluate("element => getComputedStyle(element).minWidth") == "0px"
        mobile_page.goto(f"{base_url}?journey=pme&slide=10", wait_until="networkidle")
        assert mobile_page.locator(".build-threshold-visual").evaluate("element => getComputedStyle(element).display") == "grid"
        assert mobile_page.locator(".build-threshold-visual").evaluate("element => getComputedStyle(element).minWidth") == "0px"
        mobile_page.goto(f"{base_url}?journey=pme&slide=3&function=commerce&opportunity=sales-tender", wait_until="networkidle")
        assert mobile_page.locator(".opportunity-detail-panel").is_visible()
        assert_no_horizontal_overflow(mobile_page)
        mobile_page.get_by_role("button", name="FERMER", exact=True).click()
        assert "opportunity=" not in mobile_page.url
        mobile_page.goto(f"{base_url}?journey=pme&slide=14", wait_until="networkidle")
        assert_no_horizontal_overflow(mobile_page)

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

    print("Hocus Acolyte Playwright checks passed (multi-journey, desktop, mobile, interaction, deep link).")


if __name__ == "__main__":
    main()
