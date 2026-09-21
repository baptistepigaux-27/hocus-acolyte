(() => {
  'use strict';

  const modules = window.ACOLYTE_MODULES || (window.ACOLYTE_MODULES = {});
  const casesData = window.ACOLYTE_REAL_CASES || { cases: [], industries: [], levels: [] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

  const moduleLabels = {
    cases: 'REAL CASES',
    'agent-lab': 'AGENT LAB',
    'memory-map': 'MEMORY MAP'
  };
  const moduleDescriptions = {
    cases: 'Des entreprises utilisent déjà ces approches.',
    'agent-lab': 'Objectif, outils, boucle et contrôle humain.',
    'memory-map': 'Documents, mémoire, recherche et contexte.'
  };

  function context() {
    const params = new URLSearchParams(window.location.search);
    const journey = ['pme', 'operating-system'].includes(params.get('journey')) ? params.get('journey') : 'pme';
    const slide = Number(params.get('slide')) > 0 ? Number(params.get('slide')) : 1;
    return { journey, slide };
  }

  function hrefForModule(moduleKey, extra = {}) {
    const url = new URL(window.location.href);
    const current = context();
    url.search = '';
    url.searchParams.set('module', moduleKey);
    url.searchParams.set('journey', current.journey);
    url.searchParams.set('slide', String(current.slide));
    Object.entries(extra).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') url.searchParams.delete(key);
      else url.searchParams.set(key, String(value));
    });
    return `${url.pathname}${url.search}`;
  }

  function hrefForJourney() {
    const current = context();
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('journey', current.journey);
    url.searchParams.set('slide', String(current.slide));
    return `${url.pathname}${url.search}`;
  }

  function evidenceLabel(type) {
    return { observed: 'OBSERVÉ', reported: 'RAPPORTÉ', projected: 'PROJETÉ' }[type] || 'À QUALIFIER';
  }

  function setModuleLinks() {
    const current = context();
    const navJourney = new URLSearchParams(window.location.search).has('journey') ? current.journey : null;
    $$('.module-launcher-link').forEach((link) => {
      link.href = hrefForModule(link.dataset.module);
    });
    $$('.journey-link').forEach((link) => {
      const active = navJourney && link.dataset.journey === navJourney;
      link.classList.toggle('is-active', active);
      link.href = `?journey=${encodeURIComponent(link.dataset.journey)}&slide=${current.slide}`;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function moduleHeader(active) {
    const current = context();
    const returnLabel = current.journey === 'pme' ? 'RETOUR AU PARCOURS PME' : 'RETOUR AU SYSTÈME';
    return `<header class="module-header">
      <div class="module-header-copy">
        <p class="eyebrow">EXPLORER · MODULE CONVERSATIONNEL</p>
        <h1>${escapeHtml(moduleLabels[active])}</h1>
        <p>${escapeHtml(moduleDescriptions[active])}</p>
      </div>
      <div class="module-header-actions">
        <nav class="module-nav" aria-label="Modules conversationnels">
          ${Object.entries(moduleLabels).map(([key, label]) => `<a class="module-nav-link ${key === active ? 'is-active' : ''}" href="${escapeHtml(hrefForModule(key))}">${escapeHtml(label)}</a>`).join('')}
        </nav>
        <a class="module-return-link" href="${escapeHtml(hrefForJourney())}">← ${returnLabel}</a>
      </div>
    </header>`;
  }

  function architectureMarkup(items) {
    return `<div class="case-architecture" aria-label="Mini architecture">
      ${items.map((item, index) => `${index ? '<i aria-hidden="true">↓</i>' : ''}<span>${escapeHtml(item)}</span>`).join('')}
    </div>`;
  }

  function caseCard(item) {
    const visibleIndustry = item.industryLabel;
    const visibleLevel = item.levelLabel;
    return `<article class="real-case-card" data-case-id="${escapeHtml(item.id)}">
      <div class="real-case-card-top"><span>${escapeHtml(visibleIndustry)}</span><small>${escapeHtml(evidenceLabel(item.source.evidenceType))}</small></div>
      <h2>${escapeHtml(item.company)}</h2>
      <p class="real-case-level">${escapeHtml(visibleLevel)}</p>
      <p>${escapeHtml(item.problem)}</p>
      <div class="real-case-result"><small>RÉSULTAT CLÉ</small><strong>${escapeHtml(item.results[0])}</strong></div>
      <button class="module-card-button" type="button" data-open-case="${escapeHtml(item.id)}">OUVRIR LE CAS <span aria-hidden="true">↗</span></button>
    </article>`;
  }

  function caseDrawer(item, restoreFocus) {
    const linkedModule = item.id === 'ris-support-memory' ? 'memory-map' : ['qonto-human-gate', 'groupeactive-propale'].includes(item.id) ? 'agent-lab' : null;
    return `<div class="module-drawer-layer" data-drawer-layer>
      <button class="module-drawer-scrim" type="button" data-close-case aria-label="Fermer la fiche"></button>
      <aside class="module-drawer" role="dialog" aria-modal="true" aria-labelledby="case-drawer-title">
        <div class="module-drawer-top"><span>FICHE CAS RÉEL · ${escapeHtml(item.industryLabel)}</span><button class="icon-button" type="button" data-close-case aria-label="Fermer la fiche">×</button></div>
        <h2 id="case-drawer-title" tabindex="-1">${escapeHtml(item.company)}</h2>
        <div class="case-drawer-meta"><span>${escapeHtml(item.country)}</span><span>${escapeHtml(item.levelLabel)}</span><b>${escapeHtml(evidenceLabel(item.source.evidenceType))}</b></div>
        <section class="case-drawer-section"><small>PROBLÈME</small><p>${escapeHtml(item.problem)}</p></section>
        <section class="case-drawer-section"><small>APPROCHE</small><p>${escapeHtml(item.solution)}</p></section>
        <section class="case-drawer-section"><small>ARCHITECTURE</small>${architectureMarkup(item.architecture)}</section>
        <section class="case-drawer-section"><small>RÉSULTAT</small><ul>${item.results.map((result) => `<li>${escapeHtml(result)}</li>`).join('')}</ul></section>
        <section class="case-drawer-section"><small>NIVEAU ACOLYTE</small><p class="case-drawer-level">${escapeHtml(item.levelLabel)}</p></section>
        <section class="case-drawer-section case-drawer-takeaway"><small>CE QU’IL FAUT RETENIR</small><p>${escapeHtml(item.takeaway)}</p></section>
        <section class="case-drawer-section"><small>SOURCE</small><p><a href="${escapeHtml(item.source.url)}" target="_blank" rel="noopener">${escapeHtml(item.source.publisher)} · ${escapeHtml(item.source.date)} ↗</a></p><p class="case-drawer-caveat">${escapeHtml(item.caveat)}</p></section>
        ${linkedModule ? `<a class="module-bridge-link" href="${escapeHtml(hrefForModule(linkedModule))}">${linkedModule === 'memory-map' ? 'VOIR COMMENT LA MÉMOIRE FONCTIONNE' : 'VOIR COMMENT L’AGENT AGIT'} <span aria-hidden="true">→</span></a>` : ''}
      </aside>
    </div>`;
  }

  function renderCases(root) {
    root.innerHTML = `${moduleHeader('cases')}
      <div class="real-cases-layout">
        <section class="real-cases-main" aria-labelledby="real-cases-list-title">
          <div class="module-section-heading"><div><p class="eyebrow">BIBLIOTHÈQUE · 07 CAS</p><h2 id="real-cases-list-title">Des preuves pour ouvrir la conversation.</h2></div><p>Filtrez par industrie ou niveau Acolyte, puis ouvrez une fiche pour voir le système derrière le cas.</p></div>
          <div class="real-cases-filters" aria-label="Filtres des cas">
            <label>INDUSTRIE<select id="case-industry-filter"><option value="all">Toutes les industries</option>${casesData.industries.map((item) => `<option value="${escapeHtml(item.key)}">${escapeHtml(item.label)}</option>`).join('')}</select></label>
            <label>NIVEAU ACOLYTE<select id="case-level-filter"><option value="all">Tous les niveaux</option>${casesData.levels.map((item) => `<option value="${escapeHtml(item.key)}">${escapeHtml(item.label)}</option>`).join('')}</select></label>
            <button class="tool-button" type="button" id="case-filter-reset">Réinitialiser</button>
          </div>
          <div class="real-cases-grid" id="real-cases-grid"></div>
          <p class="module-empty-state" id="real-cases-empty" hidden>Aucun cas ne correspond à ces filtres.</p>
        </section>
      </div>`;

    const grid = $('#real-cases-grid', root);
    const empty = $('#real-cases-empty', root);
    const industryFilter = $('#case-industry-filter', root);
    const levelFilter = $('#case-level-filter', root);
    let restoreFocus = null;

    function filter() {
      const industry = industryFilter.value;
      const level = levelFilter.value;
      const visible = casesData.cases.filter((item) => {
        const industries = item.industryLabels || [item.industry];
        return (industry === 'all' || industries.includes(industry)) && (level === 'all' || item.levels.includes(level));
      });
      grid.innerHTML = visible.map(caseCard).join('');
      empty.hidden = visible.length > 0;
    }

    function closeDrawer() {
      const layer = $('[data-drawer-layer]', root);
      if (layer) layer.remove();
      if (restoreFocus) restoreFocus.focus({ preventScroll: true });
      restoreFocus = null;
    }

    function openDrawer(id, trigger) {
      const item = casesData.cases.find((candidate) => candidate.id === id);
      if (!item) return;
      closeDrawer();
      restoreFocus = trigger;
      root.insertAdjacentHTML('beforeend', caseDrawer(item, restoreFocus));
      const heading = $('#case-drawer-title', root);
      heading?.focus?.({ preventScroll: true });
    }

    industryFilter.addEventListener('change', filter);
    levelFilter.addEventListener('change', filter);
    $('#case-filter-reset', root).addEventListener('click', () => { industryFilter.value = 'all'; levelFilter.value = 'all'; filter(); });
    root.addEventListener('click', (event) => {
      const open = event.target.closest('[data-open-case]');
      if (open) openDrawer(open.dataset.openCase, open);
      if (event.target.closest('[data-close-case]')) closeDrawer();
    });
    root.ownerDocument.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && $('[data-drawer-layer]', root)) closeDrawer();
    });
    filter();
  }

  function renderAgentLab(root) {
    const tools = [
      { key: 'crm', label: 'READ CRM', detail: 'Identifier le client', defaultPermission: 'AUTO' },
      { key: 'email', label: 'READ EMAIL', detail: 'Lire les derniers échanges', defaultPermission: 'AUTO' },
      { key: 'documents', label: 'READ DOCUMENTS', detail: 'Lire les pièces autorisées', defaultPermission: 'AUTO' },
      { key: 'web', label: 'SEARCH WEB', detail: 'Chercher des informations externes', defaultPermission: 'AUTO' },
      { key: 'draft', label: 'WRITE DRAFT', detail: 'Préparer le briefing', defaultPermission: 'AUTO' },
      { key: 'crm-update', label: 'UPDATE CRM', detail: 'Écrire une mise à jour', defaultPermission: 'ASK FIRST' },
      { key: 'send-email', label: 'SEND EMAIL', detail: 'Envoyer un message', defaultPermission: 'ASK FIRST' }
    ];
    const steps = ['Identifier le client', 'Lire le CRM', 'Lire les derniers emails', 'Chercher des informations externes', 'Identifier risques et opportunités', 'Préparer le briefing'];
    const permissionOrder = ['AUTO', 'ASK FIRST', 'DENIED'];
    const state = { permissions: Object.fromEntries(tools.map((tool) => [tool.key, tool.defaultPermission])), started: false, revealed: 0, gate: null };
    root.innerHTML = `${moduleHeader('agent-lab')}
      <div class="agent-lab-layout">
        <section class="agent-lab-main">
          <div class="module-section-heading"><div><p class="eyebrow">MISSION · SIMULATION DÉTERMINISTE</p><h2>Prépare mon dossier commercial pour demain.</h2></div><p>Un agent ne reçoit pas seulement une question. Il poursuit un objectif, choisit des outils et s’arrête aux bons endroits.</p></div>
          <div class="agent-lab-pipeline" aria-label="Architecture agent"><span>OBJECTIF</span><i>↓</i><span>AGENT</span><i>↓</i><span>PLAN</span><i>↓</i><span>OUTILS</span><i>↓</i><span>OBSERVATION</span><i>↓</i><span>NOUVELLE ACTION</span><i>↓</i><span>LIVRABLE</span><i>↓</i><span class="is-gate">HUMAN GATE</span></div>
          <div class="agent-lab-console">
            <section class="agent-lab-tools"><div class="module-panel-heading"><small>OUTILS DISPONIBLES</small><h3>Ce que l’agent peut faire</h3></div><div class="agent-tool-list">${tools.map((tool) => `<button class="agent-tool" type="button" data-agent-tool="${escapeHtml(tool.key)}"><span><b>${escapeHtml(tool.label)}</b><small>${escapeHtml(tool.detail)}</small></span><em data-agent-permission="${escapeHtml(tool.key)}">${escapeHtml(tool.defaultPermission)}</em></button>`).join('')}</div></section>
            <section class="agent-lab-metrics"><div class="module-panel-heading"><small>ÉTAT DU SYSTÈME</small><h3>Autonomie bornée</h3></div><div class="agent-metric-grid"><div><small>CAPACITÉS</small><strong id="agent-capabilities">0</strong></div><div><small>RISQUE</small><strong id="agent-risk">FAIBLE</strong></div><div><small>HUMAN GATES</small><strong id="agent-gates">1</strong></div><div><small>ACTIONS POSSIBLES</small><strong id="agent-actions">0</strong></div></div><p class="agent-lab-status" id="agent-permission-status">AUTO lit et prépare · ASK FIRST demande une confirmation · DENIED reste interdit.</p><a class="module-inline-link" href="${escapeHtml(hrefForModule('memory-map'))}">MÉMOIRE <span aria-hidden="true">→</span></a></section>
          </div>
          <div class="agent-loop-diagram"><div><small>BOUCLE AGENT</small><span>PLAN</span><i>↓</i><span>ACTION</span><i>↓</i><span>OBSERVATION</span></div><div class="agent-loop-question">SUFFISANT ?<b>NON → ACTION</b><b>OUI → LIVRABLE</b></div></div>
          <section class="agent-mission-panel"><div class="module-panel-heading"><small>DÉMONSTRATION</small><h3>Une mission commerciale, étape par étape.</h3></div><ol class="agent-mission-steps">${steps.map((step, index) => `<li data-agent-step="${index}"><span>0${index + 1}</span><b>${escapeHtml(step)}</b><em>À VENIR</em></li>`).join('')}</ol><div class="module-action-row"><button class="interaction-button interaction-button-primary" id="agent-launch" type="button">LANCER LA MISSION</button><button class="interaction-button" id="agent-reveal" type="button" hidden>RÉVÉLER L’ÉTAPE SUIVANTE</button><p id="agent-live-status" class="interaction-live-status" role="status">Lancez la mission pour observer la boucle.</p></div></section>
          <section class="agent-human-gate" id="agent-human-gate" hidden><div><small>HUMAN GATE · SORTIE SIMULÉE</small><h3>J’ai préparé l’email de relance et mis à jour la fiche CRM.</h3><p>Aucune action distante n’est envoyée. Le présentateur montre ici où l’humain reprend la responsabilité.</p></div><div class="module-action-row"><button class="interaction-button interaction-button-primary" data-agent-gate="VALIDER" type="button">VALIDER</button><button class="interaction-button" data-agent-gate="MODIFIER" type="button">MODIFIER</button><button class="interaction-button" data-agent-gate="ANNULER" type="button">ANNULER</button></div></section>
        </section>
      </div>`;

    function updateMetrics() {
      const values = Object.values(state.permissions);
      const auto = values.filter((value) => value === 'AUTO').length;
      const ask = values.filter((value) => value === 'ASK FIRST').length;
      const denied = values.filter((value) => value === 'DENIED').length;
      $('#agent-capabilities', root).textContent = String(auto + ask);
      $('#agent-risk', root).textContent = denied >= 2 ? 'CONTRAINT' : ask > 0 ? 'MODÉRÉ' : 'ÉLEVÉ';
      $('#agent-gates', root).textContent = String(1 + ask);
      $('#agent-actions', root).textContent = String(auto + ask);
      $('#agent-permission-status', root).textContent = `${auto} outil(s) en AUTO · ${ask} en ASK FIRST · ${denied} interdit(s). Les actions sensibles restent derrière une confirmation.`;
      tools.forEach((tool) => {
        const badge = $(`[data-agent-permission="${tool.key}"]`, root);
        badge.textContent = state.permissions[tool.key];
        badge.dataset.permission = state.permissions[tool.key].toLowerCase().replace(' ', '-');
      });
    }

    function updateMission() {
      const complete = state.started && state.revealed >= steps.length;
      $$('[data-agent-step]', root).forEach((item, index) => {
        const done = state.started && index < state.revealed;
        item.dataset.state = !done ? 'upcoming' : complete || index < state.revealed - 1 ? 'done' : 'active';
        item.querySelector('em').textContent = !done ? 'À VENIR' : item.dataset.state === 'active' ? 'EN COURS' : 'FAIT';
      });
      const launch = $('#agent-launch', root);
      const reveal = $('#agent-reveal', root);
      launch.textContent = complete ? 'REJOUER LA MISSION' : 'LANCER LA MISSION';
      launch.hidden = state.started && !complete;
      reveal.hidden = !state.started || complete;
      reveal.textContent = state.revealed < steps.length ? 'RÉVÉLER L’ÉTAPE SUIVANTE' : 'TERMINER';
      $('#agent-human-gate', root).hidden = !complete;
      $('#agent-live-status', root).textContent = !state.started ? 'Lancez la mission pour observer la boucle.' : complete ? 'Livrable prêt · validation humaine requise.' : `Mission en cours · ${state.revealed}/${steps.length} étapes révélées.`;
    }

    root.addEventListener('click', (event) => {
      const tool = event.target.closest('[data-agent-tool]');
      if (tool) {
        const key = tool.dataset.agentTool;
        const currentPermission = state.permissions[key];
        state.permissions[key] = permissionOrder[(permissionOrder.indexOf(currentPermission) + 1) % permissionOrder.length];
        updateMetrics();
      }
      if (event.target.closest('#agent-launch')) {
        if (state.started && state.revealed >= steps.length) { state.started = false; state.revealed = 0; state.gate = null; }
        else { state.started = true; state.revealed = 1; }
        updateMission();
      }
      if (event.target.closest('#agent-reveal')) {
        state.revealed = Math.min(steps.length, state.revealed + 1);
        updateMission();
      }
      const gate = event.target.closest('[data-agent-gate]');
      if (gate) {
        state.gate = gate.dataset.agentGate;
        $('#agent-live-status', root).textContent = `Simulation : ${state.gate.toLowerCase()} choisi · aucune action distante.`;
        $$('[data-agent-gate]', root).forEach((button) => button.classList.toggle('is-selected', button === gate));
      }
    });
    updateMetrics();
    updateMission();
  }

  function renderMemoryMap(root) {
    const state = { queryMode: 'knowledge', lifecycle: null };
    root.innerHTML = `${moduleHeader('memory-map')}
      <div class="memory-map-layout">
        <section class="memory-map-main">
          <div class="module-section-heading"><div><p class="eyebrow">CARTOGRAPHIE · 04 DESTINATIONS</p><h2>L’IA n’a pas une mémoire unique.</h2></div><p>Le modèle raisonne dans un contexte. Les documents, les souvenirs durables et le RAG jouent des rôles différents.</p></div>
          <div class="memory-type-grid">
            <article><span>01</span><h3>CONVERSATION</h3><p>Messages, contexte courant et travail en cours.</p><small>COURT TERME · SESSION</small></article>
            <article><span>02</span><h3>MÉMOIRE DURABLE</h3><p>Préférences, décisions, méthodes et conventions utiles entre sessions.</p><small>AGENT · NOTES · BASE STRUCTURÉE</small></article>
            <article><span>03</span><h3>KNOWLEDGE BASE</h3><p>Obsidian, SharePoint, Drive, Notion, Wiki, GitHub et dossiers internes.</p><small>LA CONNAISSANCE EXISTE HORS DU LLM</small></article>
            <article class="is-accent"><span>04</span><h3>RAG / RETRIEVAL</h3><p>Le mécanisme qui retrouve les informations pertinentes pour construire le contexte.</p><small>LE RAG N’EST PAS LA MÉMOIRE</small></article>
          </div>
          <figure class="memory-flow-diagram"><figcaption>DOCUMENTS · NOTES · CRM · EMAILS · DATABASES</figcaption><span>INGESTION</span><i>↓</i><span>INDEXATION</span><i>↓</i><span>SEARCH / RETRIEVAL</span><i>↓</i><span>CONTEXT</span><i>↓</i><span>LLM</span><i>↓</i><span class="is-accent">ANSWER / ANALYSIS / ACTION</span></figure>
          <div class="memory-columns">
            <section class="memory-subpanel"><small>OBSIDIAN</small><h3>Une mémoire explicite de travail.</h3><div class="memory-obisidian-flow"><span>NOTES</span><span>PROJECTS</span><span>DECISIONS</span><span>METHODS</span><span>HISTORY</span><i>↓ INDEX / SEARCH ↓</i><b>AGENT</b></div><p>Obsidian peut conserver la continuité ; il n’est pas le moteur de raisonnement.</p></section>
            <section class="memory-subpanel"><small>RAG</small><h3>Retrouver avant de répondre.</h3><div class="memory-rag-flow"><span>QUESTION</span><i>↓</i><span>SEARCH</span><i>↓</i><span>TOP DOCUMENTS</span><i>↓</i><span>CONTEXT → LLM → ANSWER → SOURCES</span></div></section>
          </div>
          <section class="memory-query-panel"><div class="module-panel-heading"><small>QUESTION MÉMOIRE</small><h3>Quelle remise avons-nous accordée au client X la dernière fois ?</h3></div><div class="memory-mode-buttons"><button type="button" data-memory-mode="llm">LLM SEUL</button><button type="button" data-memory-mode="knowledge">LLM + KNOWLEDGE</button></div><div class="memory-query-result" id="memory-query-result"></div></section>
          <section class="memory-lifecycle-panel"><div class="module-panel-heading"><small>MEMORY LIFECYCLE</small><h3>Le client préfère être appelé le mardi matin. Faut-il mémoriser ça ?</h3></div><div class="memory-lifecycle-options">${['NON', 'SESSION', 'MÉMOIRE DURABLE', 'CRM'].map((value) => `<button type="button" data-lifecycle="${escapeHtml(value)}">${escapeHtml(value)}</button>`).join('')}</div><p id="memory-lifecycle-result" class="memory-lifecycle-result">Toutes les informations n’ont pas la même destination.</p></section>
          <div class="memory-key-message"><strong>Bonne mémoire ≠ tout stocker</strong><span>Une bonne mémoire sait quoi conserver, où le conserver, comment le retrouver et quand le réinjecter.</span></div>
        </section>
      </div>`;

    function renderQuery() {
      $$('[data-memory-mode]', root).forEach((button) => button.classList.toggle('is-selected', button.dataset.memoryMode === state.queryMode));
      $('#memory-query-result', root).innerHTML = state.queryMode === 'llm'
        ? '<div class="memory-answer memory-answer-muted"><small>LLM SEUL</small><strong>Je ne sais pas.</strong><p>Sans document ni mémoire retrouvée, le modèle ne peut pas inventer une réponse vérifiable.</p></div>'
        : '<div class="memory-answer"><small>LLM + KNOWLEDGE · RETRIEVAL</small><strong>Remise 12 %, décision prise le 8 avril.</strong><p>Sources retrouvées : CRM · proposition V3 · compte rendu client.</p><div class="memory-retrieval-trace"><span>CRM</span><span>PROPOSITION V3</span><span>COMPTE RENDU</span></div></div>';
    }

    function renderLifecycle() {
      $$('[data-lifecycle]', root).forEach((button) => button.classList.toggle('is-selected', button.dataset.lifecycle === state.lifecycle));
      const messages = {
        NON: 'Ne rien conserver : l’information reste dans la conversation et disparaît avec la session.',
        SESSION: 'Conserver pour le travail en cours, sans la réinjecter automatiquement plus tard.',
        'MÉMOIRE DURABLE': 'Conserver comme préférence utile entre sessions, avec une règle de révision.',
        CRM: 'Conserver comme fait client dans le système métier de référence, pas dans une note libre.'
      };
      $('#memory-lifecycle-result', root).textContent = state.lifecycle ? messages[state.lifecycle] : 'Toutes les informations n’ont pas la même destination.';
    }

    root.addEventListener('click', (event) => {
      const mode = event.target.closest('[data-memory-mode]');
      if (mode) { state.queryMode = mode.dataset.memoryMode; renderQuery(); }
      const lifecycle = event.target.closest('[data-lifecycle]');
      if (lifecycle) { state.lifecycle = lifecycle.dataset.lifecycle; renderLifecycle(); }
    });
    renderQuery();
    renderLifecycle();
  }

  function mount(moduleKey) {
    const root = document.querySelector('#module-content');
    if (!root || !moduleLabels[moduleKey]) return;
    document.body.classList.add('module-mode');
    const appLayout = document.querySelector('.app-layout');
    if (appLayout) appLayout.hidden = true;
    root.hidden = false;
    setModuleLinks();
    if (moduleKey === 'cases') renderCases(root);
    if (moduleKey === 'agent-lab') renderAgentLab(root);
    if (moduleKey === 'memory-map') renderMemoryMap(root);
  }

  document.addEventListener('click', (event) => {
    const launcher = event.target.closest('[data-action="toggle-modules"]');
    if (!launcher) return;
    const menu = document.querySelector('#module-menu');
    if (!menu) return;
    const open = menu.hidden;
    menu.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (event) => {
    const menu = document.querySelector('#module-menu');
    const launcher = event.target.closest('[data-action="toggle-modules"]');
    if (menu && !menu.hidden && !launcher && !event.target.closest('#module-menu')) {
      menu.hidden = true;
      document.querySelector('[data-action="toggle-modules"]')?.setAttribute('aria-expanded', 'false');
    }
  });
  setModuleLinks();

  modules.cases = { mount: () => mount('cases') };
  modules['agent-lab'] = { mount: () => mount('agent-lab') };
  modules['memory-map'] = { mount: () => mount('memory-map') };

  const requestedModule = new URLSearchParams(window.location.search).get('module');
  if (modules[requestedModule]) modules[requestedModule].mount();
})();
