(() => {
  'use strict';

  const marker = '/acolyte/';
  const markerIndex = window.location.pathname.indexOf(marker);
  const root = markerIndex >= 0 ? window.location.pathname.slice(0, markerIndex + marker.length) : '/';
  const href = (path = '', query = '') => `${root}${path}${query}`;

  // The main app already carries this exact navigation in its topbar.
  // Other Acolyte pages receive the shared shell below.
  if (document.querySelector('.site-nav')) return;

  const header = document.createElement('header');
  header.className = 'acolyte-global-header';
  header.innerHTML = `
    <a class="acolyte-global-brand" href="${href()}" aria-label="Hocus Acolyte, retour à l’index">
      <span class="acolyte-global-brand-mark" aria-hidden="true">✦</span>
      <span>HOCUS ACOLYTE</span>
      <small>AI OPERATING EXPERIENCES / DRAFT</small>
    </a>
    <nav class="site-nav" aria-label="Navigation principale">
      <a class="site-nav-home" data-global-section="index" href="${href()}">Index</a>
      <details class="site-nav-group">
        <summary>Parcourir <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel site-nav-panel-journeys">
          <div class="site-nav-panel-heading">
            <p>01 · PARCOURIR</p>
            <strong>Les parcours</strong>
            <span>Deux récits pour comprendre puis décider.</span>
          </div>
          <div class="site-nav-links">
            <a class="site-nav-link" data-global-section="journey" href="${href('', '?journey=operating-system&amp;slide=1')}">
              <small>01 · SYSTÈME DE TRAVAIL · 23 SLIDES</small>
              <b>Du chatbot au système de travail</b>
              <span>Contexte, mémoire, agents, contrôle humain.</span>
            </a>
            <a class="site-nav-link" data-global-section="journey" href="${href('', '?journey=pme&amp;slide=1')}">
              <small>02 · PME AI OVERVIEW · 17 SLIDES</small>
              <b>Partir d’un travail réel</b>
              <span>Opportunités, fonctions, niveaux et portefeuille.</span>
            </a>
          </div>
        </div>
      </details>
      <details class="site-nav-group">
        <summary>Explorer <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel">
          <div class="site-nav-panel-heading">
            <p>02 · EXPLORER</p>
            <strong>Les espaces de travail</strong>
            <span>Preuves, missions et mémoire en pratique.</span>
          </div>
          <div class="site-nav-links">
            <a class="site-nav-link site-nav-link-accent" data-global-section="explore" href="${href('explore/')}">
              <small>CATALOGUE · 100 CAS</small>
              <b>EXPLORE</b>
              <span>Filtrer les cas, lire les preuves, comparer les situations.</span>
            </a>
            <a class="site-nav-link" href="${href('', '?module=cases&amp;journey=pme&amp;slide=3')}">
              <small>MODULE 01</small>
              <b>Real Cases</b>
              <span>Cas documentés, architectures et résultats.</span>
            </a>
            <a class="site-nav-link" href="${href('', '?module=agent-lab&amp;journey=pme&amp;slide=3')}">
              <small>MODULE 02</small>
              <b>Agent Lab</b>
              <span>Outils, permissions, boucle et human gate.</span>
            </a>
            <a class="site-nav-link" href="${href('', '?module=memory-map&amp;journey=pme&amp;slide=3')}">
              <small>MODULE 03</small>
              <b>Memory Map</b>
              <span>Contexte, recherche, mémoire durable et retrieval.</span>
            </a>
          </div>
        </div>
      </details>
      <details class="site-nav-group">
        <summary>Comparer <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel site-nav-panel-wide">
          <div class="site-nav-panel-heading">
            <p>03 · COMPARER</p>
            <strong>Le laboratoire UX</strong>
            <span>Huit directions pour tester la forme d’Acolyte.</span>
          </div>
          <div class="site-nav-columns">
            <div class="site-nav-subgroup">
              <h3>Round 01 · Directions</h3>
              <a class="site-nav-compact-link" href="${href('ux/current/', '?view=home')}" data-global-section="compare"><b>01</b><span>UX actuelle</span><small>Témoin fonctionnel</small></a>
              <a class="site-nav-compact-link" href="${href('ux/editorial/', '?view=home')}" data-global-section="compare"><b>02</b><span>Editorial Air</span><small>Respiration &amp; narration</small></a>
              <a class="site-nav-compact-link" href="${href('ux/playground/', '?view=home')}" data-global-section="compare"><b>03</b><span>Product Playground</span><small>Manipuler pour comprendre</small></a>
              <a class="site-nav-compact-link" href="${href('ux/field-guide/', '?view=home')}" data-global-section="compare"><b>04</b><span>Field Guide</span><small>Manuel de terrain</small></a>
            </div>
            <div class="site-nav-subgroup">
              <h3>Round 02 · Variantes</h3>
              <a class="site-nav-compact-link" href="${href('ux/round-2/manual/', '?view=home')}" data-global-section="compare"><b>01</b><span>Manuel de terrain</span><small>Papier &amp; annotations</small></a>
              <a class="site-nav-compact-link" href="${href('ux/round-2/lab/', '?view=home')}" data-global-section="compare"><b>02</b><span>Lab / instrument</span><small>Signaux &amp; observation</small></a>
              <a class="site-nav-compact-link" href="${href('ux/round-2/system/', '?view=home')}" data-global-section="compare"><b>03</b><span>HOCUS System</span><small>Casting &amp; couleurs</small></a>
              <a class="site-nav-compact-link" href="${href('ux/round-2/review/', '?view=home')}" data-global-section="compare"><b>04</b><span>Revue appliquée</span><small>Publication &amp; rareté</small></a>
            </div>
          </div>
        </div>
      </details>
      <details class="site-nav-group">
        <summary>Apprendre <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel">
          <div class="site-nav-panel-heading">
            <p>04 · APPRENDRE</p>
            <strong>Le parcours pédagogique</strong>
            <span>Des formats pour dérouler une idée sans perdre le fil.</span>
          </div>
          <div class="site-nav-links">
            <a class="site-nav-link site-nav-link-accent" data-global-section="learn" href="${href('ux/tutorial/', '?slide=1')}">
              <small>10 LEÇONS · TUTORIAL BOARDS</small>
              <b>Le tuto Acolyte</b>
              <span>Schéma à gauche, lecture guidée à droite, exploration au clic.</span>
            </a>
            <a class="site-nav-link" href="${href('ux/')}" data-global-section="compare">
              <small>UX LAB · ROUND 01</small>
              <b>Comparer les directions</b>
              <span>Revenir au tableau de comparaison des formats.</span>
            </a>
            <a class="site-nav-link" href="${href('ux/round-2/')}" data-global-section="compare">
              <small>UX LAB · ROUND 02</small>
              <b>Voir les variantes</b>
              <span>Explorer les itérations plus éditoriales et plus denses.</span>
            </a>
          </div>
        </div>
      </details>
    </nav>`;

  document.body.insertBefore(header, document.body.firstChild);
  document.body.classList.add('acolyte-global-nav-page');

  const nav = header.querySelector('.site-nav');
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
  const section = path.includes('/explore/') ? 'explore'
    : path.includes('/ux/tutorial/') ? 'learn'
      : path.includes('/ux/') ? 'compare' : 'index';
  nav.querySelectorAll(`[data-global-section="${section}"]`).forEach((link) => link.setAttribute('aria-current', 'page'));
})();
