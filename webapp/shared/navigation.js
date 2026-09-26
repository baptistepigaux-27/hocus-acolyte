/*
 * Acolyte V2 — navigation commune à toutes les pages publiques.
 *
 * La racine d'Acolyte est déduite de l'adresse de ce script (…/shared/navigation.js),
 * ce qui fonctionne sous /acolyte/ (hocus.works) comme sous un autre dossier (sandbox).
 * La page d'accueil réserve sa place avec [data-acolyte-nav] dans sa barre d'outils ;
 * les autres pages reçoivent un en-tête complet.
 */
(() => {
  'use strict';

  const script = document.currentScript || document.querySelector('script[src$="shared/navigation.js"]');
  const root = script ? new URL('../', script.src).pathname : '/acolyte/';
  const href = (path = '', query = '') => `${root}${path}${query}`;
  window.ACOLYTE_ROOT = root;

  const markup = `
    <a class="brand acolyte-global-brand" href="${href()}" aria-label="Acolyte, retour à l’accueil">
      <img class="brand-mark acolyte-global-brand-mark" src="${href('shared/acolyte-o-96.webp')}" width="96" height="96" alt="" aria-hidden="true">
      <span>HOCUS ACOLYTE</span>
      <small>COMPRENDRE L’IA · PAR HOCUS</small>
    </a>
    <nav class="site-nav" aria-label="Navigation principale">
      <a class="site-nav-home" data-global-section="index" href="${href()}">Accueil</a>
      <details class="site-nav-group">
        <summary>Parcours <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel site-nav-panel-journeys">
          <div class="site-nav-panel-heading">
            <p>01 · PARCOURS</p>
            <strong>Deux récits guidés</strong>
            <span>Comprendre le système de travail, puis le traduire dans une PME.</span>
          </div>
          <div class="site-nav-columns site-nav-columns-single">
            <div class="site-nav-subgroup">
              <h3>Les parcours</h3>
              <a class="site-nav-compact-link journey-link" data-journey="operating-system" data-global-section="journey" href="${href('', '?journey=operating-system&amp;slide=1')}"><b>01</b><span>Du chatbot au système de travail</span><small>23 étapes</small></a>
              <a class="site-nav-compact-link journey-link" data-journey="pme" data-global-section="journey" href="${href('', '?journey=pme&amp;slide=1')}"><b>02</b><span>L’IA dans une PME</span><small>17 étapes</small></a>
            </div>
          </div>
        </div>
      </details>
      <details class="site-nav-group">
        <summary>Explorer <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel">
          <div class="site-nav-panel-heading">
            <p>02 · EXPLORER</p>
            <strong>Les cas et les ateliers</strong>
            <span>Des cas documentés, un agent au travail, la mémoire en pratique.</span>
          </div>
          <div class="site-nav-columns site-nav-columns-single">
            <div class="site-nav-subgroup">
              <h3>Explorer</h3>
              <a class="site-nav-compact-link" data-global-section="explore" href="${href('explore/')}"><b>01</b><span>Catalogue des cas</span><small>120 cas d’usage, avec leur niveau de preuve</small></a>
              <a class="site-nav-compact-link module-launcher-link" data-module="cases" href="${href('', '?module=cases&amp;journey=pme&amp;slide=3')}"><b>02</b><span>Cas réels</span><small>Architectures, sources et résultats</small></a>
              <a class="site-nav-compact-link module-launcher-link" data-module="agent-lab" href="${href('', '?module=agent-lab&amp;journey=pme&amp;slide=3')}"><b>03</b><span>Labo agent</span><small>Outils, permissions et validation humaine</small></a>
              <a class="site-nav-compact-link module-launcher-link" data-module="memory-map" href="${href('', '?module=memory-map&amp;journey=pme&amp;slide=3')}"><b>04</b><span>Carte de la mémoire</span><small>Contexte, recherche et mémoire durable</small></a>
            </div>
          </div>
        </div>
      </details>
      <a class="site-nav-home acolyte-hocus-link" href="/">HOCUS ↗</a>
      <a class="acolyte-nav-cta" href="/works/diagnostic/">Diagnostic Data &amp; IA</a>
    </nav>`;

  const slot = document.querySelector('[data-acolyte-nav]');
  let scope;
  if (slot) {
    slot.innerHTML = markup;
    scope = slot;
  } else {
    const header = document.createElement('header');
    header.className = 'acolyte-global-header';
    header.innerHTML = markup;
    document.body.insertBefore(header, document.body.firstChild);
    document.body.classList.add('acolyte-global-nav-page');
    scope = header;
  }

  const nav = scope.querySelector('.site-nav');
  const groups = [...nav.querySelectorAll('.site-nav-group')];
  const closeOthers = (active) => groups.filter((group) => group !== active).forEach((group) => { group.open = false; });
  groups.forEach((group) => {
    group.querySelector('summary')?.addEventListener('click', () => closeOthers(group));
    group.addEventListener('toggle', () => { if (group.open) closeOthers(group); });
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) groups.forEach((group) => { group.open = false; });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') groups.forEach((group) => { group.open = false; });
  });

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const section = path.includes('/explore/') || path.includes('/cas/') ? 'explore' : params.has('journey') ? 'journey' : 'index';
  nav.querySelectorAll(`[data-global-section="${section}"]`).forEach((link) => link.setAttribute('aria-current', 'page'));
})();
