(() => {
  'use strict';

  const root = document.querySelector('#ux-app');
  if (!root) return;

  const variant = document.body.dataset.variant || 'editorial';
  const casesData = window.ACOLYTE_REAL_CASES || { cases: [], industries: [] };
  const cases = casesData.cases || [];
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  const variantMeta = {
    current: { label: 'TÉMOIN · UX ACTUELLE', short: 'Current', note: 'La version de référence, dense et structurée.' },
    editorial: { label: 'EDITORIAL AIR', short: 'Editorial', note: 'Plus de respiration. Moins de chrome. Le contenu peut enfin respirer.' },
    playground: { label: 'PRODUCT PLAYGROUND', short: 'Playground', note: 'On comprend en manipulant. C’est généralement plus rapide qu’un comité.' },
    'field-guide': { label: 'FIELD GUIDE', short: 'Field Guide', note: 'Un manuel de terrain : précis, annoté, et utilisable quand le tableau blanc est déjà plein.' }
  };
  const meta = variantMeta[variant] || variantMeta.editorial;
  const state = {
    view: new URLSearchParams(window.location.search).get('view') || 'home',
    caseId: new URLSearchParams(window.location.search).get('case') || 'ris-support-memory',
    industry: 'all',
    agentStep: 0,
    toggles: { context: 'RICHE', tools: 'ON', memory: 'ON' }
  };
  const validViews = ['home', 'learn', 'agent', 'explore', 'case'];

  function pageHref(view, extra = {}) {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('view', view);
    Object.entries(extra).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') url.searchParams.delete(key);
      else url.searchParams.set(key, String(value));
    });
    return `${url.pathname}${url.search}`;
  }

  function variantHref(key) {
    const url = new URL(`../${key}/`, window.location.href);
    url.search = '';
    url.searchParams.set('view', state.view);
    if (state.view === 'case') url.searchParams.set('case', state.caseId);
    return `${url.pathname}${url.search}`;
  }

  function acolyteHref(query = {}) {
    const url = new URL('../../', window.location.href);
    url.search = '';
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    return `${url.pathname}${url.search}`;
  }

  function mascot(name, copy, role = 'COMMENTAIRE DE MARGE') {
    return `<aside class="ux-mascot-note" aria-label="Note de ${escapeHtml(name)}"><span>${escapeHtml(role)}</span><strong>${escapeHtml(name)}</strong><p>“${escapeHtml(copy)}”</p></aside>`;
  }

  function evidenceLabel(type) {
    return { observed: 'OBSERVÉ', reported: 'RAPPORTÉ', projected: 'PROJETÉ' }[type] || 'À QUALIFIER';
  }

  function architecture(items) {
    return `<div class="ux-architecture">${items.map((item, index) => `${index ? '<i aria-hidden="true">↓</i>' : ''}<span>${escapeHtml(item)}</span>`).join('')}</div>`;
  }

  function caseCard(item) {
    return `<article class="ux-case-card">
      <div class="ux-case-meta"><span>${escapeHtml(item.industryLabel)}</span><small>${escapeHtml(evidenceLabel(item.source.evidenceType))}</small></div>
      <h3>${escapeHtml(item.company)}</h3>
      <p class="ux-case-level">${escapeHtml(item.levelLabel)}</p>
      <p>${escapeHtml(item.problem)}</p>
      <strong class="ux-case-result">${escapeHtml(item.results[0])}</strong>
      <a class="ux-text-link" href="${escapeHtml(pageHref('case', { case: item.id }))}">Lire la fiche <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function renderHome() {
    return `<section class="ux-hero ux-home-hero">
      <p class="ux-kicker">HOCUS ACOLYTE · LEARN + EXPLORE</p>
      <h1>Comprendre l’IA sans lui confier les clés du bâtiment.</h1>
      <p class="ux-lead">Un compagnon de terrain pour comprendre les agents, les workflows, la mémoire et les outils — avec assez de recul pour ne pas transformer chaque automatisation en religion.</p>
      <div class="ux-hero-actions"><a class="ux-button ux-button-primary" href="${escapeHtml(pageHref('learn'))}">Commencer par apprendre</a><a class="ux-button" href="${escapeHtml(pageHref('explore'))}">Explorer les cas</a></div>
    </section>
    <section class="ux-home-intro"><div><p class="ux-kicker">LEARN / EXPLORE / WORKSHOP</p><h2>Un parcours pour comprendre. Un explorateur pour discuter.</h2></div>${mascot('Cortex', 'Un agent peut le faire. La vraie question est : est-ce qu’on veut vraiment le laisser faire ?', 'VOIX SECONDAIRE')}</section>
    <section class="ux-pillar-grid" aria-label="Zones d’Acolyte">
      <a class="ux-pillar" href="${escapeHtml(pageHref('learn'))}"><span>01 · LEARN</span><h3>Les concepts, sans le brouillard.</h3><p>Agents, contexte, mémoire, outils et workflows. Les mots deviennent enfin des choses que l’on peut manipuler.</p><b>Comprendre →</b></a>
      <a class="ux-pillar" href="${escapeHtml(pageHref('explore'))}"><span>02 · EXPLORE</span><h3>Les cas qui existent déjà.</h3><p>Des entreprises, des problèmes concrets, des architectures et des limites. Le réel est parfois plus instructif que la roadmap.</p><b>Voir les cas →</b></a>
      <div class="ux-pillar ux-pillar-muted"><span>03 · WORKSHOP</span><h3>Transformer une idée en plan.</h3><p>Diagnostics, ateliers et roadmaps viendront ensuite. Chaque chose en son temps, même pour une IA.</p><b>À venir</b></div>
    </section>`;
  }

  function renderLearn() {
    return `<section class="ux-view-title"><p class="ux-kicker">LEARN / CONCEPT</p><h1>Un agent, ce n’est pas juste un chatbot qui a pris du galon.</h1><p class="ux-lead">Il reçoit un objectif, utilise des outils et enchaîne plusieurs étapes pour produire un résultat. L’autonomie est pratique. Les limites aussi.</p></section>
    <section class="ux-concept-layout"><article class="ux-definition"><span>DÉFINITION</span><h2>Une IA à laquelle on confie un objectif et une marge d’initiative.</h2><p>La différence ne tient pas à un mot plus ambitieux dans le menu. Elle tient à la boucle : objectif, contexte, outils, action, observation, nouvelle action.</p></article><div class="ux-component-list"><p class="ux-kicker">COMPOSANTS</p><ol><li><b>OBJECTIF</b><span>Ce qui doit être obtenu, pas seulement demandé.</span></li><li><b>CONTEXTE</b><span>Les informations qui empêchent l’agent de deviner.</span></li><li><b>OUTILS</b><span>Les systèmes auxquels il peut accéder.</span></li><li><b>MÉMOIRE</b><span>Ce qui doit rester utile après la session.</span></li><li><b>RÈGLES</b><span>Les limites qui rendent l’autonomie acceptable.</span></li></ol></div></section>
    <section class="ux-principle"><strong>Automatiser un mauvais processus reste une mauvaise idée.</strong><span>Simplement, il ira maintenant beaucoup plus vite.</span></section>${mascot('Cortex', 'L’autonomie, c’est pratique. Les limites aussi.', 'NOTE DE TERRAIN')}`;
  }

  function agentStepLabel(index) {
    return ['Identifier le client', 'Lire le CRM', 'Lire les derniers emails', 'Chercher des informations externes', 'Identifier risques et opportunités', 'Préparer le briefing'][index];
  }

  function renderAgent() {
    const steps = Array.from({ length: 6 }, (_, index) => `<li class="${index < state.agentStep ? 'is-done' : index === state.agentStep && state.agentStep < 6 ? 'is-active' : ''}"><span>0${index + 1}</span><b>${escapeHtml(agentStepLabel(index))}</b><em>${index < state.agentStep ? 'FAIT' : index === state.agentStep && state.agentStep < 6 ? 'EN COURS' : 'À VENIR'}</em></li>`).join('');
    const complete = state.agentStep >= 6;
    return `<section class="ux-view-title"><p class="ux-kicker">LEARN / AGENT LAB</p><h1>Prépare mon dossier commercial pour demain.</h1><p class="ux-lead">Un agent n’est pas un chatbot plus intelligent. Il possède un objectif, des outils, du contexte, une boucle d’action et des limites d’autonomie.</p></section>
    <section class="ux-agent-layout"><div class="ux-agent-main"><div class="ux-pipeline" aria-label="Boucle agent"><span>OBJECTIF</span><i>↓</i><span>AGENT</span><i>↓</i><span>PLAN</span><i>↓</i><span>OUTILS</span><i>↓</i><span>OBSERVATION</span><i>↓</i><span>NOUVELLE ACTION</span><i>↓</i><span>LIVRABLE</span><i>↓</i><span class="is-gate">HUMAN GATE</span></div><div class="ux-loop"><span>PLAN</span><i>↓</i><span>ACTION</span><i>↓</i><span>OBSERVATION</span><strong>SUFFISANT ?<small>NON → ACTION · OUI → LIVRABLE</small></strong></div></div>
      <aside class="ux-agent-controls"><p class="ux-kicker">CONSOLE DE DÉMO</p><h2>Réglages du système</h2><button class="ux-button ux-button-primary ux-run-button" type="button" data-agent-run>${complete ? 'Rejouer la mission' : 'Lancer la mission'}</button><div class="ux-toggle-list"><button type="button" data-toggle="context"><span>CONTEXTE</span><b>${escapeHtml(state.toggles.context)}</b></button><button type="button" data-toggle="tools"><span>OUTILS</span><b>${escapeHtml(state.toggles.tools)}</b></button><button type="button" data-toggle="memory"><span>MÉMOIRE</span><b>${escapeHtml(state.toggles.memory)}</b></button></div><p class="ux-agent-status" role="status">${complete ? 'Livrable prêt · validation humaine requise.' : state.agentStep ? `Mission en cours · étape ${state.agentStep}/6.` : 'Lancez la mission pour observer la boucle.'}</p></aside></section>
    <section class="ux-mission"><div class="ux-section-heading"><p class="ux-kicker">MISSION DÉTERMINISTE</p><h2>Une mission commerciale, étape par étape.</h2></div><ol class="ux-mission-steps">${steps}</ol>${complete ? '<div class="ux-human-gate"><span>HUMAN GATE</span><strong>J’ai préparé l’email de relance et mis à jour la fiche CRM.</strong><p>VALIDER · MODIFIER · ANNULER — aucune action distante n’est envoyée.</p></div>' : ''}</section>${mascot('Cortex', 'Oui, l’agent peut le faire. Ce n’est pas une raison pour lui confier les clés du bâtiment.', 'COMMENTAIRE SUR LA MISSION')}`;
  }

  function renderExplore() {
    const industries = casesData.industries || [];
    const visible = cases.filter((item) => state.industry === 'all' || (item.industryLabels || [item.industry]).includes(state.industry));
    return `<section class="ux-view-title"><p class="ux-kicker">EXPLORE / BIBLIOTHÈQUE</p><h1>Des preuves pour ouvrir la conversation.</h1><p class="ux-lead">Qui fait réellement ça ? Ces fiches donnent le problème, l’architecture, le résultat et la source — sans faire passer une projection pour un fait.</p></section><div class="ux-explore-toolbar"><label>INDUSTRIE<select id="ux-industry-filter"><option value="all">Toutes les industries</option>${industries.map((item) => `<option value="${escapeHtml(item.key)}" ${state.industry === item.key ? 'selected' : ''}>${escapeHtml(item.label)}</option>`).join('')}</select></label><span>${visible.length} cas affiché${visible.length > 1 ? 's' : ''}</span></div><section class="ux-case-grid" id="ux-case-grid">${visible.length ? visible.map(caseCard).join('') : '<p class="ux-empty">Aucun cas pour ce filtre. Le réel a parfois moins de catégories que nos menus.</p>'}</section>${mascot('Inat', 'On peut ajouter encore trois graphiques. Ou répondre à la question.', 'ANNOTATION DE BIBLIOTHÈQUE')}`;
  }

  function renderCase() {
    const item = cases.find((candidate) => candidate.id === state.caseId) || cases[0];
    if (!item) return renderExplore();
    return `<section class="ux-view-title"><p class="ux-kicker">EXPLORE / FICHE CAS</p><a class="ux-back-link" href="${escapeHtml(pageHref('explore'))}">← Retour aux cas</a><h1>${escapeHtml(item.company)}</h1><p class="ux-lead">${escapeHtml(item.industryLabel)} · ${escapeHtml(item.levelLabel)} · ${escapeHtml(evidenceLabel(item.source.evidenceType))}</p></section><article class="ux-case-detail"><div><p class="ux-kicker">PROBLÈME</p><p>${escapeHtml(item.problem)}</p><p class="ux-kicker">APPROCHE</p><p>${escapeHtml(item.solution)}</p><p class="ux-kicker">RÉSULTAT</p><ul>${item.results.map((result) => `<li>${escapeHtml(result)}</li>`).join('')}</ul></div><div><p class="ux-kicker">ARCHITECTURE</p>${architecture(item.architecture)}<div class="ux-takeaway"><span>CE QU’IL FAUT RETENIR</span><strong>${escapeHtml(item.takeaway)}</strong></div><p class="ux-source"><a href="${escapeHtml(item.source.url)}" target="_blank" rel="noopener">${escapeHtml(item.source.publisher)} · ${escapeHtml(item.source.date)} ↗</a><br>${escapeHtml(item.caveat)}</p></div></article>${item.id === 'ris-support-memory' ? `<a class="ux-bridge" href="${escapeHtml(pageHref('learn'))}">Voir le concept mémoire et retrieval →</a>` : ''}${['qonto-human-gate', 'groupeactive-propale'].includes(item.id) ? `<a class="ux-bridge" href="${escapeHtml(pageHref('agent'))}">Voir comment l’agent agit →</a>` : ''}`;
  }

  function renderView() {
    if (state.view === 'learn') return renderLearn();
    if (state.view === 'agent') return renderAgent();
    if (state.view === 'explore') return renderExplore();
    if (state.view === 'case') return renderCase();
    return renderHome();
  }

  function render() {
    const guideRail = variant === 'field-guide' ? '<aside class="ux-guide-rail" aria-label="Field Guide"><strong>FIELD GUIDE</strong><a href="?view=learn">01 · CONCEPTS</a><a href="?view=explore">02 · CASES</a><a href="?view=agent">03 · PATTERNS</a><span>04 · ANTI-PATTERNS</span><span>05 · OUTILS</span><span>06 · MÉTHODES</span></aside>' : '';
    root.innerHTML = `<div class="ux-shell"><header class="ux-topbar"><a class="ux-brand" href="${escapeHtml(pageHref('home'))}"><span class="ux-brand-mark">✦</span><span>HOCUS ACOLYTE</span></a><nav class="ux-primary-nav" aria-label="Acolyte"><a class="${state.view === 'learn' || state.view === 'agent' ? 'is-active' : ''}" href="${escapeHtml(pageHref('learn'))}">LEARN</a><a class="${state.view === 'explore' || state.view === 'case' ? 'is-active' : ''}" href="${escapeHtml(pageHref('explore'))}">EXPLORE</a><span class="is-muted">WORKSHOP · À VENIR</span></nav><span class="ux-variant-label">${escapeHtml(meta.label)}</span><a class="ux-current-link" href="${escapeHtml(acolyteHref({ journey: 'pme', slide: 1 }))}">Retour à Acolyte ↗</a></header><nav class="ux-variant-nav" aria-label="Comparer les directions"><span>VARIANTES</span>${Object.keys(variantMeta).map((key) => `<a class="${key === variant ? 'is-active' : ''}" href="${escapeHtml(variantHref(key))}">${escapeHtml(variantMeta[key].short)}</a>`).join('')}</nav><main class="ux-main">${guideRail}${renderView()}</main><footer class="ux-footer"><span>ACOLYTE / ${escapeHtml(meta.label)}</span><span>Contenu commun · simulation locale · aucun appel externe</span></footer></div>`;
    bindEvents();
  }

  function bindEvents() {
    const filter = $('#ux-industry-filter');
    if (filter) filter.addEventListener('change', () => { state.industry = filter.value; render(); });
    const run = $('[data-agent-run]');
    if (run) run.addEventListener('click', () => { state.agentStep = state.agentStep >= 6 ? 0 : state.agentStep + 1; render(); });
    document.querySelectorAll('[data-toggle]').forEach((button) => button.addEventListener('click', () => {
      const key = button.dataset.toggle;
      if (key === 'context') state.toggles[key] = state.toggles[key] === 'RICHE' ? 'FAIBLE' : 'RICHE';
      else state.toggles[key] = state.toggles[key] === 'ON' ? 'OFF' : 'ON';
      render();
    }));
  }

  if (!validViews.includes(state.view)) state.view = 'home';
  render();
})();
