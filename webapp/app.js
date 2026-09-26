(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const navGroups = [...document.querySelectorAll('.site-nav-group')];
  const closeOtherNavGroups = (activeGroup) => {
    navGroups.filter((other) => other !== activeGroup).forEach((other) => { other.open = false; });
  };
  navGroups.forEach((group) => group.addEventListener('toggle', () => {
    if (!group.open) return;
    closeOtherNavGroups(group);
  }));
  navGroups.forEach((group) => group.querySelector('summary')?.addEventListener('click', () => {
    closeOtherNavGroups(group);
  }));
  document.addEventListener('click', (event) => {
    if (event.target.closest('.site-nav')) return;
    navGroups.forEach((group) => { group.open = false; });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    navGroups.forEach((group) => { group.open = false; });
  });
  const requestedModule = params.get('module');
  if (requestedModule && window.ACOLYTE_MODULES && window.ACOLYTE_MODULES[requestedModule]) { document.querySelector('#home-content')?.remove(); return; }
  const homeRouteKeys = ['journey', 'slide', 'module', 'present', 'function', 'opportunity'];
  const isHome = homeRouteKeys.every((key) => !params.has(key));
  const journeys = window.ACOLYTE_JOURNEYS || {};
  const requestedJourney = params.get('journey') || 'operating-system';
  const journeyKey = journeys[requestedJourney] ? requestedJourney : 'operating-system';
  const activeJourney = journeys[journeyKey] || {
    config: { key: 'operating-system', shortLabel: 'SYSTÈME DE TRAVAIL', label: 'Du chatbot au système de travail' },
    slides: window.ACOLYTE_SLIDES || []
  };
  const journeyConfig = activeJourney.config || {};
  const slides = activeJourney.slides || [];
  const acts = [...new Map(slides.map((slide) => [slide.act, { id: slide.act, label: slide.actLabel }])).values()];
  const state = { index: 0, indexOpen: window.innerWidth >= 900, query: '' };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const refs = {
    body: document.body,
    home: $('#home-content'),
    appLayout: $('.app-layout'),
    main: $('#main-content'),
    sidebar: $('#sidebar'),
    actList: $('#act-list'),
    search: $('#slide-search'),
    actLabel: $('#act-label'),
    progress: $('#progress-bar'),
    counter: $('#slide-counter'),
    index: $('#slide-index'),
    end: $('#journey-end'),
    canvas: $('#visual-canvas'),
    journeyStatus: $('#journey-status'),
    journeyLinks: $$('.journey-link'),
    act: $('#slide-act'),
    title: $('#slide-title'),
    message: $('#slide-message'),
    bullets: $('#slide-bullets'),
    stage: $('#slide-stage')
  };
  let activeInteraction = null;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  const pad = (value) => String(value).padStart(2, '0');
  const current = () => slides[state.index];

  function renderActList() {
    refs.actList.innerHTML = acts.map((act) => {
      const actSlides = slides.filter((slide) => slide.act === act.id);
      const visible = actSlides.some((slide) => matchesSearch(slide));
      return `<section class="act-group ${visible ? '' : 'is-hidden'}">
        <div class="act-heading"><span>0${act.id}</span><h3>${escapeHtml(act.label)}</h3></div>
        <div class="slide-links">${actSlides.map((slide) => `
          <button class="slide-link ${slide.id === current().id ? 'is-active' : ''} ${matchesSearch(slide) ? '' : 'is-filtered'}" type="button" data-slide="${slide.id}">
            <span>${pad(slide.id)}</span><b>${escapeHtml(slide.title)}</b>
          </button>`).join('')}</div>
      </section>`;
    }).join('');
    $$('.slide-link').forEach((button) => button.addEventListener('click', () => goTo(Number(button.dataset.slide))));
  }

  function matchesSearch(slide) {
    if (!state.query) return true;
    const haystack = [slide.title, slide.message, slide.actLabel, ...(slide.bullets || [])].join(' ').toLocaleLowerCase('fr');
    return haystack.includes(state.query.toLocaleLowerCase('fr'));
  }

  function renderJourneyLinks() {
    refs.journeyLinks.forEach((link) => {
      const active = params.has('journey') && link.dataset.journey === journeyKey;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      const url = new URL(window.location.href);
      url.searchParams.set('journey', link.dataset.journey);
      url.searchParams.set('slide', '1');
      url.searchParams.delete('present');
      link.href = `${url.pathname}${url.search}`;
    });
    if (refs.journeyStatus) refs.journeyStatus.textContent = `${journeyConfig.shortLabel || journeyKey} · ${slides.length} étapes`;
  }

  function renderSlide() {
    const slide = current();
    refs.actLabel.textContent = `ACTE ${slide.act} · ${slide.actLabel}`;
    refs.progress.style.width = `${(slide.id / slides.length) * 100}%`;
    refs.counter.textContent = `${pad(slide.id)} / ${pad(slides.length)}`;
    refs.index.textContent = pad(slide.id);
    refs.act.textContent = `ACTE ${slide.act}`;
    refs.title.textContent = slide.title;
    refs.message.textContent = slide.message;
    refs.bullets.innerHTML = (slide.bullets || []).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('');
    if (activeInteraction && activeInteraction.destroy) activeInteraction.destroy();
    refs.canvas.innerHTML = visualMarkup(slide);
    refs.canvas.dataset.visual = slide.visual;
    if (slide.interaction) {
      refs.canvas.removeAttribute('aria-hidden');
      const interaction = window.ACOLYTE_INTERACTIONS && window.ACOLYTE_INTERACTIONS[slide.interaction.kind];
      activeInteraction = interaction ? interaction.mount(refs.canvas, slide) : null;
    } else {
      refs.canvas.setAttribute('aria-hidden', 'true');
      refs.canvas.removeAttribute('aria-label');
      activeInteraction = null;
    }
    renderEnd(slide);
    renderActList();
    document.title = `${pad(slide.id)} · ${slide.title} — ${journeyConfig.label || 'Hocus Acolyte'}`;
    const url = new URL(window.location.href);
    url.searchParams.set('journey', journeyKey);
    url.searchParams.set('slide', slide.id);
    url.searchParams.delete('present');
    window.history.replaceState({}, '', url);
    renderJourneyLinks();
  }

  /* Fin de parcours : passer de la compréhension au terrain (Acolyte V2). */
  function renderEnd(slide) {
    if (!refs.end) return;
    const last = slide.id === slides[slides.length - 1].id;
    refs.end.hidden = !last;
    if (!last) { refs.end.innerHTML = ''; return; }
    const other = journeyKey === 'pme'
      ? { href: '?journey=operating-system&slide=1', label: 'Du chatbot au système de travail' }
      : { href: '?journey=pme&slide=1', label: 'L’IA dans une PME' };
    refs.end.innerHTML = `<div class="journey-end-head"><p class="overline">FIN DU PARCOURS · ET CHEZ VOUS ?</p><h2 id="journey-end-title">Passer de la compréhension au terrain.</h2><p>Le bon premier chantier dépend de vos données, de vos équipes et de ce qui compte pour votre activité. C’est l’objet du Diagnostic Data &amp; IA.</p></div>
      <div class="journey-end-actions">
        <a class="journey-end-primary" href="/works/diagnostic/">Découvrir le Diagnostic Data &amp; IA <span aria-hidden="true">↗</span></a>
        <a class="journey-end-link" href="mailto:hello@hocus.works?subject=Acolyte%20%E2%80%94%20parlons%20de%20votre%20cas">Écrire à HOCUS <span aria-hidden="true">↗</span></a>
        <a class="journey-end-link" href="explore/">Explorer les 120 cas <span aria-hidden="true">→</span></a>
        <a class="journey-end-link" href="${other.href}">L’autre parcours : ${escapeHtml(other.label)} <span aria-hidden="true">→</span></a>
      </div>`;
  }

  function visualMarkup(slide) {
    const node = (label, value, tone = '') => `<div class="diagram-node ${tone}"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`;
    const arrow = '<span class="diagram-arrow" aria-hidden="true">→</span>';
    const step = (number, label, detail = '') => `<div class="step-node"><span>${pad(number)}</span><b>${escapeHtml(label)}</b>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</div>`;
    const visual = slide.visual;
    if (slide.interaction) return '<div class="interaction-placeholder">Chargement de la simulation…</div>';
    if (visual === 'cover') return `<div class="visual-cover"><span class="ghost-word">CHAT</span><div class="cover-orbit"><i></i><i></i><i></i><b>AI</b></div><div class="cover-flow"><span>question</span><span>contexte</span><span>action</span></div></div>`;
    if (visual === 'familiar') return `<div class="card-grid familiar-grid">${['résumer','reformuler','comparer','structurer','produire'].map((label, i) => `<div class="mini-card"><span>0${i + 1}</span><b>${label}</b><i>→</i><small>${['document','message','options','problème','présentation'][i]}</small></div>`).join('')}</div>`;
    if (visual === 'meeting') return `<div class="meeting-loop"><div class="loop-core">rendez-vous<br><small>client</small></div>${['synthétiser','questionner','incertitudes','préparer','rendre compte'].map((label, i) => `<div class="loop-step loop-${i + 1}"><span>0${i + 1}</span>${label}</div>`).join('')}</div>`;
    if (visual === 'model') return `<div class="pipeline-visual model-pipeline">${node('corpus', 'textes')} ${arrow} ${node('apprentissage', 'modèle', 'accent')} ${arrow} ${node('situation', 'contexte + instruction')} ${arrow} ${node('sortie', 'réponse', 'outline')}</div>`;
    if (visual === 'context') return `<div class="context-visual"><div class="context-side muted"><small>QUESTION SEULE</small><b>Prépare mon rendez-vous.</b><span>hypothèses</span><span>manques</span><span>générique</span></div><div class="context-connector">+</div><div class="context-side"><small>CONTEXTE DE TRAVAIL</small><b>Objectif + données + contraintes</b><span>questions</span><span>incertitudes</span><span>prochaines actions</span></div></div>`;
    if (visual === 'equation') return `<div class="equation-visual"><div class="equation-row">${['modèle','contexte','mémoire','outils','actions'].map((item, i) => `<span class="equation-cell ${i === 0 ? 'dark' : ''}">${item}</span>${i < 4 ? '<i>+</i>' : ''}`).join('')}</div><div class="equation-result">SYSTÈME <em>IA</em></div><div class="equation-control">contrôle / provenance / validation humaine</div></div>`;
    if (visual === 'memory') return `<div class="memory-visual"><div class="memory-lane empty"><small>SANS MÉMOIRE</small><b>session 1</b><span>information</span><i></i><b class="faded">session 2</b><span>tout réexpliquer</span></div><div class="memory-lane full"><small>AVEC MÉMOIRE</small><b>session 1</b><span>décision · brief · sources</span><i></i><b>session 2</b><span class="highlight">contexte retrouvé</span></div></div>`;
    if (visual === 'agent-loop') return `<div class="agent-ring"><div class="ring-center">OBJECTIF</div>${['plan','outil','observer','décider'].map((label, i) => `<span class="ring-node ring-${i + 1}">${label}</span>`).join('')}<div class="permission-rail"><span>autorisé</span><span>à valider</span></div></div>`;
    if (visual === 'compare') return `<div class="compare-visual"><div class="compare-column chatbot"><small>CHATBOT</small><strong>question</strong>${arrow}<strong>réponse</strong><p>une sortie</p></div><div class="compare-column agent"><small>AGENT</small><strong>objectif</strong>${['recherche','sources','comparaison','calcul','vérification'].map((label) => `${arrow}<strong>${label}</strong>`).join('')}<p>un workflow</p></div></div>`;
    if (visual === 'agent-workflow') return `<div class="step-flow">${['comprendre','chercher','lire','comparer','calculer','synthèse'].map((label, i) => `${step(i + 1, label, ['demande','outil','sources','table','indicateurs','résultat'][i])}${i < 5 ? arrow : ''}`).join('')}</div>`;
    if (visual === 'control') return `<div class="control-visual"><div class="control-track">${['entrée','action','observation','preuve'].map((label, i) => `${step(i + 1, label)}${i < 3 ? arrow : ''}`).join('')}</div><div class="human-gate"><span>CONTRÔLE</span><b>validation humaine</b><small>avant l’action conséquente</small></div></div>`;
    if (visual === 'roles') return `<div class="roles-visual">${[['GPT','penser','cadrer'],['OBSIDIAN','mémoriser','décisions'],['GITHUB','opérer','état'],['CODEX','réaliser','tests']].map(([label, role, detail], i) => `<div class="role-card role-${i + 1}"><span>0${i + 1}</span><b>${label}</b><strong>${role}</strong><small>${detail}</small></div>`).join('')}</div>`;
    if (visual === 'handoff-memory') return `<div class="handoff-visual"><div class="handoff-bubble">idée<br><small>conversation</small></div>${arrow}<div class="handoff-bubble accent">brief<br><small>GPT</small></div>${arrow}<div class="handoff-bubble gold">décision<br><small>Obsidian</small></div><div class="handoff-return">↻ contexte futur</div></div>`;
    if (visual === 'handoff-code') return `<div class="handoff-code-visual"><div class="code-card"><small>ISSUE</small><b>objectif</b><span>critères</span></div>${arrow}<div class="code-card accent"><small>CODEX</small><b>branche</b><span>tests</span></div>${arrow}<div class="code-card"><small>PR</small><b>review</b><span>staging</span></div></div>`;
    if (visual === 'timeline') return `<div class="timeline-visual">${['idée','issue','branche','développement','tests','PR','préprod'].map((label, i) => `<div class="timeline-item"><span>${pad(i + 1)}</span><b>${label}</b></div>`).join('')}<div class="timeline-gate"><span>CONTRÔLE</span><b>validation humaine</b></div><div class="timeline-item production"><span>09</span><b>production</b></div></div>`;
    if (visual === 'continuity') return `<div class="continuity-visual">${[['GPT','brief'],['OBSIDIAN','contexte'],['GITHUB','issue'],['CODEX','code + tests'],['HUMAIN','validation']].map(([label, detail], i) => `<div class="continuity-step"><span>${pad(i + 1)}</span><b>${label}</b><small>${detail}</small></div>`).join('')}</div>`;
    if (visual === 'northstar') return `<div class="northstar-visual"><div class="northstar-source"><span>DCE</span><span>données<br>marchés</span><span>entreprise</span></div><div class="northstar-core">ANALYSE<br><small>faits + preuves</small></div><div class="northstar-output"><span>évaluation</span><b>RÉPONDRE</b><b class="review">REVOIR</b><b class="no-go">RENONCER</b></div><small class="synthetic-label">données fictives</small></div>`;
    if (visual === 'spec') return `<div class="spec-visual">${[['01','question'],['02','brief'],['03','spec'],['04','issue']].map(([number, label], i) => `<div class="spec-card spec-${i + 1}"><span>${number}</span><b>${label}</b><small>${['intention','contexte','contrat','travail'][i]}</small></div>${i < 3 ? arrow : ''}`).join('')}</div>`;
    if (visual === 'delivery') return `<div class="delivery-visual">${['SPEC','ISSUE','CODE','TESTS','PR','STAGING'].map((label, i) => `<div class="delivery-card ${i === 5 ? 'final' : ''}"><span>0${i + 1}</span><b>${label}</b><small>${['périmètre','branche','changement','contrôle','revue','testable'][i]}</small></div>`).join('')}</div>`;
    if (visual === 'sybil') return `<div class="sybil-visual"><div class="sybil-path"><span>question</span>${arrow}<span>POC</span>${arrow}<span>parcours</span>${arrow}<span>patterns</span>${arrow}<span class="gate">POINT DE DÉCISION</span></div><div class="sybil-result"><b>CONTINUER</b><b class="iterate">ITÉRER</b><b class="no-go">ARRÊTER</b></div></div>`;
    if (visual === 'specialized') return `<div class="specialized-visual"><div class="specialized-row source-row"><span>sources</span><i></i><span>intelligence</span><i></i><span>restitution</span></div><div class="specialized-agents"><b>Gremlin</b><b>Moteurs de décision</b><b>Stolas</b><b>Inat</b><b>Yokai</b><b>Doppel</b></div><div class="cortex-orbit">CORTEX · orchestrer / gouverner / prouver</div></div>`;
    if (visual === 'consulting') return `<div class="consulting-visual"><div class="consulting-input"><span>50 fichiers</span><span>PDF</span><span>question</span></div><div class="consulting-pipeline">${['import','nettoyage','analyse','IA','visualisation'].map((label) => `<span>${label}</span>`).join('')}</div><div class="consulting-output"><b>recommandation</b><span>prototype</span><span>outil</span><span>mesure</span></div></div>`;
    if (visual === 'closing') return `<div class="closing-visual"><div class="closing-human"><span>HUMAIN</span><b>décide / juge</b></div>${arrow}<div class="closing-ai"><span>IA</span><b>raisonne / orchestre</b></div><div class="closing-orbits"><span>mémoire</span><span>outils</span><span>données</span></div><div class="closing-action">ACTION</div></div>`;
    if (visual === 'solution-families') return `<div class="solution-families-visual">${(slide.families || []).map((family, index) => `<article class="solution-family-card family-card-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(family.family)}</strong><small>${escapeHtml(family.description)}</small><em>${escapeHtml((family.modes || []).join(' · '))}</em></article>`).join('')}</div>`;
    if (visual === 'process-pipeline') return `<div class="pme-process-pipeline">${(slide.steps || []).map((pipelineStep, index) => `<div class="pme-process-step ${pipelineStep.label === 'HUMAIN' ? 'is-human' : ''}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(pipelineStep.label)}</strong><small>${escapeHtml(pipelineStep.detail)}</small></div>${index < (slide.steps || []).length - 1 ? '<i aria-hidden="true">→</i>' : ''}`).join('')}</div>`;
    if (visual === 'automation-compare') return `<div class="automation-compare-visual">${(slide.modes || []).map((mode, index) => `<article class="automation-mode-card mode-${escapeHtml(mode.key)}"><span>${String(index + 1).padStart(2, '0')}</span><small>${escapeHtml(mode.label)}</small><strong>${escapeHtml(mode.flow)}</strong><p>${escapeHtml(mode.example)}</p><em>${escapeHtml(mode.family)}</em></article>`).join('')}<div class="automation-compare-note">TOUT NE DOIT PAS DEVENIR UN AGENT.</div></div>`;
    if (visual === 'build-threshold') return `<div class="build-threshold-visual">${(slide.steps || []).map((buildStep, index) => `<div class="build-threshold-step ${index === (slide.steps || []).length - 1 ? 'is-application' : ''}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(buildStep.label)}</strong><small>${escapeHtml(buildStep.detail)}</small></div>${index < (slide.steps || []).length - 1 ? '<i aria-hidden="true">→</i>' : ''}`).join('')}<div class="build-threshold-caption">LA RÉCURRENCE, LES UTILISATEURS ET LA MESURE FONT CHANGER DE NIVEAU.</div></div>`;
    if (visual === 'decision-axes') return `<div class="decision-axes-visual">${(slide.axes || []).map((axis, index) => `<article class="decision-axis axis-${escapeHtml(axis.key)}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(axis.label)}</strong><b>${escapeHtml(axis.question)}</b><small>${escapeHtml(axis.detail)}</small></article>`).join('')}</div>`;
    if (visual === 'roadmap') return `<div class="roadmap-visual">${(slide.phases || []).map((phase, index) => `<article class="roadmap-phase roadmap-phase-${index + 1}"><span>${escapeHtml(phase.period)}</span><strong>${escapeHtml(phase.title)}</strong><div>${phase.items.map((item) => `<small>${escapeHtml(item)}</small>`).join('')}</div><em>${escapeHtml(phase.gate)}</em></article>`).join('')}</div>`;
    if (visual === 'ai-native') return `<div class="ai-native-visual"><div class="ai-native-center"><span>HUMAINS</span><strong>responsabilité<br>et décision</strong></div><div class="ai-native-components">${(slide.components || []).map((component, index) => `<div class="ai-native-component native-${index + 1}"><span>${escapeHtml(component.label)}</span><small>${escapeHtml(component.detail)}</small></div>`).join('')}</div><div class="ai-native-equation">UN SYSTÈME DE TRAVAIL AUGMENTÉ</div></div>`;
    if (visual === 'pme-conclusion') return `<div class="pme-conclusion-visual"><div class="pme-conclusion-steps">${(slide.steps || []).map((label, index) => `<span><i>${String(index + 1).padStart(2, '0')}</i>${escapeHtml(label)}</span>`).join('')}</div><div class="pme-conclusion-output"><small>OUTPUT ATTENDU</small><strong>3 OPPORTUNITÉS<br>PRIORITAIRES</strong><em>avec une preuve à obtenir</em></div></div>`;
    if (visual === 'pme-levels') return `<div class="pme-levels-visual">${(slide.levels || []).map((level) => `<div class="pme-level-card"><span>${escapeHtml(level.number)}</span><strong>${escapeHtml(level.label)}</strong><small>${escapeHtml(level.detail)}</small></div>`).join('')}</div>`;
    if (visual === 'transformation-ladder') return `<div class="transformation-ladder-visual">${(slide.levels || []).map((level, index) => `<div class="transformation-ladder-step"><span>${escapeHtml(level.number)}</span><div><b>${escapeHtml(level.label)}</b><small>${escapeHtml(level.detail)}</small><small class="transformation-ladder-meta">INVESTISSEMENT · ${escapeHtml(level.investment || 'indicatif')} · IMPACT · ${escapeHtml(level.timeToImpact || 'à préciser')}</small></div>${index < (slide.levels || []).length - 1 ? '<i aria-hidden="true">↓</i>' : '<em>VISION</em>'}</div>`).join('')}</div>`;
    if (visual === 'pme-prioritization') return `<div class="pme-prioritization-visual">${(slide.priorityCards || []).map((card) => `<div class="pme-priority-card priority-${escapeHtml(card.key)}"><span>${escapeHtml(card.label)}</span><b>${escapeHtml(card.example)}</b><small>${escapeHtml(card.detail)}</small><em>${escapeHtml(card.gate)}</em></div>`).join('')}</div>`;
    return `<div class="fallback-visual">${escapeHtml(slide.title)}</div>`;
  }

  function goTo(id) {
    const nextIndex = slides.findIndex((slide) => slide.id === id);
    if (nextIndex < 0) return;
    state.index = nextIndex;
    renderSlide();
    refs.main.focus({ preventScroll: true });
    if (window.innerWidth < 900) { setIndexOpen(false); refs.main.scrollIntoView({ block: 'start' }); }
  }

  function next() { goTo(slides[Math.min(slides.length - 1, state.index + 1)].id); }
  function previous() { goTo(slides[Math.max(0, state.index - 1)].id); }

  function setIndexOpen(open) {
    state.indexOpen = open;
    refs.body.classList.toggle('index-collapsed', !open);
    $('[data-action="toggle-index"]').setAttribute('aria-expanded', String(open));
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'next') next();
    if (action === 'previous') previous();
    if (action === 'toggle-index') setIndexOpen(!state.indexOpen);
  });

  refs.search.addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    renderActList();
  });

  document.addEventListener('keydown', (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      if (event.key !== 'Escape') return;
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); next(); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); previous(); }
    if (event.key === 'Home') { event.preventDefault(); goTo(1); }
    if (event.key === 'End') { event.preventDefault(); goTo(slides.length); }
    if (event.key === '/' && document.activeElement !== refs.search) { event.preventDefault(); refs.search.focus(); }
  });

  const initialSlide = Number(params.get('slide'));
  if (initialSlide && slides.some((slide) => slide.id === initialSlide)) state.index = slides.findIndex((slide) => slide.id === initialSlide);
  refs.home.hidden = !isHome;
  refs.appLayout.hidden = isHome;
  refs.body.classList.toggle('home-mode', isHome);
  if (isHome) {
    document.title = 'Acolyte — Comprendre l’IA, par HOCUS';
    refs.home.focus({ preventScroll: true });
  } else {
    setIndexOpen(state.indexOpen);
    renderSlide();
  }

  /* Mobile : on glisse d'une étape à l'autre, et chaque étape repart de son titre. */
  let touch = null;
  refs.stage.addEventListener('touchstart', (event) => {
    if (event.target.closest('button, a, input, select, .visual-canvas')) { touch = null; return; }
    const t = event.touches[0]; touch = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  refs.stage.addEventListener('touchend', (event) => {
    if (!touch) return;
    const t = event.changedTouches[0]; const dx = t.clientX - touch.x; const dy = t.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else previous(); }
  }, { passive: true });
})();
