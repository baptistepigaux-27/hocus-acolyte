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
    <a class="acolyte-global-brand" href="${href()}" aria-label="Hocus Acolyte, retour à la home">
      <img class="acolyte-global-brand-mark" src="${href('shared/acolyte-o.png')}" alt="">
      <span>HOCUS ACOLYTE</span>
      <small>AI OPERATING EXPERIENCES / DRAFT</small>
    </a>
    <nav class="site-nav" aria-label="Navigation principale">
      <a class="site-nav-home" data-global-section="index" href="${href()}">Home</a>
      <details class="site-nav-group">
        <summary>Parcourir <span aria-hidden="true">↓</span></summary>
        <div class="site-nav-panel site-nav-panel-journeys">
          <div class="site-nav-panel-heading">
            <p>01 · PARCOURIR</p>
            <strong>Les parcours</strong>
            <span>Deux récits pour comprendre puis décider.</span>
          </div>
          <div class="site-nav-columns site-nav-columns-single">
            <div class="site-nav-subgroup">
              <h3>Les parcours</h3>
              <a class="site-nav-compact-link" data-global-section="journey" href="${href('', '?journey=operating-system&amp;slide=1')}"><b>01</b><span>Du chatbot au système de travail</span><small>Système de travail · 23 slides</small></a>
              <a class="site-nav-compact-link" data-global-section="journey" href="${href('', '?journey=pme&amp;slide=1')}"><b>02</b><span>Partir d’un travail réel</span><small>PME AI Overview · 17 slides</small></a>
            </div>
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
          <div class="site-nav-columns site-nav-columns-single">
            <div class="site-nav-subgroup">
              <h3>Espaces de travail</h3>
              <a class="site-nav-compact-link" data-global-section="explore" href="${href('explore/')}"><b>01</b><span>EXPLORE</span><small>Catalogue · 120 cas</small></a>
              <a class="site-nav-compact-link" href="${href('', '?module=cases&amp;journey=pme&amp;slide=3')}"><b>02</b><span>Real Cases</span><small>Cas documentés, architectures et résultats</small></a>
              <a class="site-nav-compact-link" href="${href('', '?module=agent-lab&amp;journey=pme&amp;slide=3')}"><b>03</b><span>Agent Lab</span><small>Outils, permissions, boucle et human gate</small></a>
              <a class="site-nav-compact-link" href="${href('', '?module=memory-map&amp;journey=pme&amp;slide=3')}"><b>04</b><span>Memory Map</span><small>Contexte, recherche, mémoire et retrieval</small></a>
            </div>
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
          <div class="site-nav-columns site-nav-columns-single">
            <div class="site-nav-subgroup">
              <h3>Formats d’apprentissage</h3>
              <a class="site-nav-compact-link" data-global-section="learn" href="${href('ux/tutorial/', '?slide=1')}"><b>01</b><span>Le tuto Acolyte</span><small>10 leçons · Tutorial Boards</small></a>
              <a class="site-nav-compact-link" href="${href('ux/')}" data-global-section="compare"><b>02</b><span>Comparer les directions</span><small>UX Lab · Round 01</small></a>
              <a class="site-nav-compact-link" href="${href('ux/round-2/')}" data-global-section="compare"><b>03</b><span>Voir les variantes</span><small>UX Lab · Round 02</small></a>
            </div>
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
