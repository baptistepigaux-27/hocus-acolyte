(() => {
  'use strict';

  const slides = window.ACOLYTE_SLIDES || [];
  const acts = [...new Map(slides.map((slide) => [slide.act, { id: slide.act, label: slide.actLabel }])).values()];
  const state = { index: 0, present: false, notes: false, indexOpen: true, query: '' };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const refs = {
    body: document.body,
    main: $('#main-content'),
    sidebar: $('#sidebar'),
    actList: $('#act-list'),
    search: $('#slide-search'),
    actLabel: $('#act-label'),
    progress: $('#progress-bar'),
    counter: $('#slide-counter'),
    mode: $('#slide-mode'),
    index: $('#slide-index'),
    flags: $('#slide-flags'),
    canvas: $('#visual-canvas'),
    act: $('#slide-act'),
    title: $('#slide-title'),
    message: $('#slide-message'),
    bullets: $('#slide-bullets'),
    source: $('#slide-source'),
    notes: $('#speaker-notes'),
    speaker: $('#speaker-copy'),
    demo: $('#speaker-demo'),
    toast: $('#toast'),
    stage: $('#slide-stage')
  };

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
            <span>${pad(slide.id)}</span><b>${escapeHtml(slide.title)}</b>${slide.wow ? '<i aria-label="Moment wow">✦</i>' : ''}
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

  function renderFlags(slide) {
    const flags = [];
    if (slide.wow) flags.push('<span class="flag wow">✦ wow</span>');
    if (slide.demoType) flags.push(`<span class="flag demo">${escapeHtml(slide.demoType)}</span>`);
    if (slide.interactive) flags.push('<span class="flag interactive">interactive candidate</span>');
    refs.flags.innerHTML = flags.join('');
  }

  function renderSlide() {
    const slide = current();
    refs.actLabel.textContent = `ACTE ${slide.act} · ${slide.actLabel}`;
    refs.progress.style.width = `${(slide.id / slides.length) * 100}%`;
    refs.counter.textContent = `${pad(slide.id)} / ${pad(slides.length)}`;
    refs.mode.textContent = state.present ? 'PRESENT' : 'EXPLORE';
    refs.index.textContent = pad(slide.id);
    refs.act.textContent = `ACTE ${slide.act}`;
    refs.title.textContent = slide.title;
    refs.message.textContent = slide.message;
    refs.source.textContent = slide.source;
    refs.bullets.innerHTML = (slide.bullets || []).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('');
    refs.speaker.textContent = slide.speaker;
    refs.demo.textContent = slide.demo;
    refs.canvas.innerHTML = visualMarkup(slide);
    refs.canvas.dataset.visual = slide.visual;
    renderFlags(slide);
    renderActList();
    document.title = `${pad(slide.id)} · ${slide.title} — Hocus Acolyte`;
    const url = new URL(window.location.href);
    url.searchParams.set('slide', slide.id);
    if (state.present) url.searchParams.set('present', '1'); else url.searchParams.delete('present');
    window.history.replaceState({}, '', url);
  }

  function visualMarkup(slide) {
    const node = (label, value, tone = '') => `<div class="diagram-node ${tone}"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`;
    const arrow = '<span class="diagram-arrow" aria-hidden="true">→</span>';
    const step = (number, label, detail = '') => `<div class="step-node"><span>${pad(number)}</span><b>${escapeHtml(label)}</b>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</div>`;
    const visual = slide.visual;
    if (visual === 'cover') return `<div class="visual-cover"><span class="ghost-word">CHAT</span><div class="cover-orbit"><i></i><i></i><i></i><b>AI</b></div><div class="cover-flow"><span>question</span><span>context</span><span>action</span></div></div>`;
    if (visual === 'familiar') return `<div class="card-grid familiar-grid">${['résumer','reformuler','comparer','structurer','produire'].map((label, i) => `<div class="mini-card"><span>0${i + 1}</span><b>${label}</b><i>→</i><small>${['document','message','options','problème','présentation'][i]}</small></div>`).join('')}</div>`;
    if (visual === 'meeting') return `<div class="meeting-loop"><div class="loop-core">rendez-vous<br><small>client</small></div>${['synthétiser','questionner','incertitudes','préparer','rendre compte'].map((label, i) => `<div class="loop-step loop-${i + 1}"><span>0${i + 1}</span>${label}</div>`).join('')}</div>`;
    if (visual === 'model') return `<div class="pipeline-visual model-pipeline">${node('corpus', 'textes')} ${arrow} ${node('apprentissage', 'modèle', 'accent')} ${arrow} ${node('situation', 'contexte + instruction')} ${arrow} ${node('sortie', 'réponse', 'outline')}</div>`;
    if (visual === 'context') return `<div class="context-visual"><div class="context-side muted"><small>QUESTION SEULE</small><b>Prépare mon rendez-vous.</b><span>hypothèses</span><span>manques</span><span>générique</span></div><div class="context-connector">+</div><div class="context-side"><small>CONTEXTE DE TRAVAIL</small><b>Objectif + données + contraintes</b><span>questions</span><span>incertitudes</span><span>prochaines actions</span></div></div>`;
    if (visual === 'equation') return `<div class="equation-visual"><div class="equation-row">${['modèle','contexte','mémoire','outils','actions'].map((item, i) => `<span class="equation-cell ${i === 0 ? 'dark' : ''}">${item}</span>${i < 4 ? '<i>+</i>' : ''}`).join('')}</div><div class="equation-result">SYSTÈME <em>IA</em></div><div class="equation-control">contrôle / provenance / gate humain</div></div>`;
    if (visual === 'memory') return `<div class="memory-visual"><div class="memory-lane empty"><small>SANS MÉMOIRE</small><b>session 1</b><span>information</span><i></i><b class="faded">session 2</b><span>tout réexpliquer</span></div><div class="memory-lane full"><small>AVEC MÉMOIRE</small><b>session 1</b><span>décision · brief · sources</span><i></i><b>session 2</b><span class="highlight">contexte retrouvé</span></div></div>`;
    if (visual === 'agent-loop') return `<div class="agent-ring"><div class="ring-center">OBJECTIF</div>${['plan','outil','observer','décider'].map((label, i) => `<span class="ring-node ring-${i + 1}">${label}</span>`).join('')}<div class="permission-rail"><span>autorisé</span><span>à valider</span></div></div>`;
    if (visual === 'compare') return `<div class="compare-visual"><div class="compare-column chatbot"><small>CHATBOT</small><strong>question</strong>${arrow}<strong>réponse</strong><p>une sortie</p></div><div class="compare-column agent"><small>AGENT</small><strong>objectif</strong>${['recherche','sources','comparaison','calcul','vérification'].map((label) => `${arrow}<strong>${label}</strong>`).join('')}<p>un workflow</p></div></div>`;
    if (visual === 'agent-workflow') return `<div class="step-flow">${['comprendre','chercher','lire','comparer','calculer','synthèse'].map((label, i) => `${step(i + 1, label, ['demande','outil','sources','table','indicateurs','résultat'][i])}${i < 5 ? arrow : ''}`).join('')}</div>`;
    if (visual === 'control') return `<div class="control-visual"><div class="control-track">${['entrée','action','observation','preuve'].map((label, i) => `${step(i + 1, label)}${i < 3 ? arrow : ''}`).join('')}</div><div class="human-gate"><span>GATE</span><b>validation humaine</b><small>avant l’action conséquente</small></div></div>`;
    if (visual === 'roles') return `<div class="roles-visual">${[['GPT','penser','cadrer'],['OBSIDIAN','mémoriser','décisions'],['GITHUB','opérer','état'],['CODEX','réaliser','tests']].map(([label, role, detail], i) => `<div class="role-card role-${i + 1}"><span>0${i + 1}</span><b>${label}</b><strong>${role}</strong><small>${detail}</small></div>`).join('')}</div>`;
    if (visual === 'handoff-memory') return `<div class="handoff-visual"><div class="handoff-bubble">idée<br><small>conversation</small></div>${arrow}<div class="handoff-bubble accent">brief<br><small>GPT</small></div>${arrow}<div class="handoff-bubble gold">décision<br><small>Obsidian</small></div><div class="handoff-return">↻ contexte futur</div></div>`;
    if (visual === 'handoff-code') return `<div class="handoff-code-visual"><div class="code-card"><small>ISSUE</small><b>objectif</b><span>critères</span></div>${arrow}<div class="code-card accent"><small>CODEX</small><b>branche</b><span>tests</span></div>${arrow}<div class="code-card"><small>PR</small><b>review</b><span>staging</span></div></div>`;
    if (visual === 'timeline') return `<div class="timeline-visual">${['idée','issue','branche','développement','tests','PR','préprod'].map((label, i) => `<div class="timeline-item"><span>${pad(i + 1)}</span><b>${label}</b></div>`).join('')}<div class="timeline-gate"><span>GATE</span><b>validation humaine</b></div><div class="timeline-item production"><span>09</span><b>production</b></div></div>`;
    if (visual === 'continuity') return `<div class="continuity-visual">${[['GPT','brief'],['OBSIDIAN','contexte'],['GITHUB','issue'],['CODEX','code + tests'],['HUMAIN','validation']].map(([label, detail], i) => `<div class="continuity-step"><span>${pad(i + 1)}</span><b>${label}</b><small>${detail}</small></div>`).join('')}</div>`;
    if (visual === 'northstar') return `<div class="northstar-visual"><div class="northstar-source"><span>DCE</span><span>données<br>marchés</span><span>entreprise</span></div><div class="northstar-core">NORTHSTAR<br><small>facts + evidence</small></div><div class="northstar-output"><span>assessment</span><b>GO</b><b class="review">REVIEW</b><b class="no-go">NO-GO</b></div><small class="synthetic-label">synthetic / staging</small></div>`;
    if (visual === 'spec') return `<div class="spec-visual">${[['01','question'],['02','brief'],['03','spec'],['04','issue']].map(([number, label], i) => `<div class="spec-card spec-${i + 1}"><span>${number}</span><b>${label}</b><small>${['intention','contexte','contrat','travail'][i]}</small></div>${i < 3 ? arrow : ''}`).join('')}</div>`;
    if (visual === 'delivery') return `<div class="delivery-visual">${['SPEC','ISSUE','CODE','TESTS','PR','STAGING'].map((label, i) => `<div class="delivery-card ${i === 5 ? 'final' : ''}"><span>0${i + 1}</span><b>${label}</b><small>${['périmètre','branche','changement','contrôle','revue','testable'][i]}</small></div>`).join('')}</div>`;
    if (visual === 'sybil') return `<div class="sybil-visual"><div class="sybil-path"><span>question</span>${arrow}<span>POC</span>${arrow}<span>journeys</span>${arrow}<span>patterns</span>${arrow}<span class="gate">VALUE GATE</span></div><div class="sybil-result"><b>GO</b><b class="iterate">ITERATE</b><b class="no-go">NO-GO</b></div></div>`;
    if (visual === 'specialized') return `<div class="specialized-visual"><div class="specialized-row source-row"><span>sources</span><i></i><span>intelligence</span><i></i><span>restitution</span></div><div class="specialized-agents"><b>Gremlin</b><b>Zoltar</b><b>Stolas</b><b>Sybil</b><b>Northstar</b><b>Inat</b><b>Fumist</b></div><div class="cortex-orbit">CORTEX · orchestrer / gouverner / prouver</div></div>`;
    if (visual === 'consulting') return `<div class="consulting-visual"><div class="consulting-input"><span>50 fichiers</span><span>PDF</span><span>question</span></div><div class="consulting-pipeline">${['import','nettoyage','analyse','IA','visualisation'].map((label) => `<span>${label}</span>`).join('')}</div><div class="consulting-output"><b>recommandation</b><span>prototype</span><span>outil</span><span>mesure</span></div></div>`;
    if (visual === 'closing') return `<div class="closing-visual"><div class="closing-human"><span>HUMAIN</span><b>décide / juge</b></div>${arrow}<div class="closing-ai"><span>IA</span><b>raisonne / orchestre</b></div><div class="closing-orbits"><span>mémoire</span><span>outils</span><span>données</span></div><div class="closing-action">ACTION</div></div>`;
    return `<div class="fallback-visual">${escapeHtml(slide.title)}</div>`;
  }

  function goTo(id) {
    const nextIndex = slides.findIndex((slide) => slide.id === id);
    if (nextIndex < 0) return;
    state.index = nextIndex;
    renderSlide();
    refs.main.focus({ preventScroll: true });
    if (window.innerWidth < 900) setIndexOpen(false);
  }

  function next() { goTo(slides[Math.min(slides.length - 1, state.index + 1)].id); }
  function previous() { goTo(slides[Math.max(0, state.index - 1)].id); }

  function setIndexOpen(open) {
    state.indexOpen = open;
    refs.body.classList.toggle('index-collapsed', !open);
    $('[data-action="toggle-index"]').setAttribute('aria-expanded', String(open));
  }

  function setPresent(present) {
    state.present = present;
    refs.body.classList.toggle('presentation-mode', present);
    const button = $('[data-action="toggle-present"]');
    button.setAttribute('aria-pressed', String(present));
    button.innerHTML = present ? 'Explorer <b aria-hidden="true">×</b>' : 'Présenter <b aria-hidden="true">↗</b>';
    renderSlide();
  }

  function setNotes(open) {
    state.notes = open;
    refs.notes.hidden = !open;
    $$('[data-action="toggle-notes"]').forEach((button) => button.setAttribute('aria-expanded', String(open)));
  }

  function showToast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add('is-visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => refs.toast.classList.remove('is-visible'), 2200);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Lien de la slide copié.');
    } catch {
      showToast('Le lien est visible dans la barre d’adresse.');
    }
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'next') next();
    if (action === 'previous') previous();
    if (action === 'toggle-index') setIndexOpen(!state.indexOpen);
    if (action === 'toggle-present') setPresent(!state.present);
    if (action === 'toggle-notes') setNotes(!state.notes);
    if (action === 'copy-link') copyLink();
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
    if (event.key.toLowerCase() === 'f') setPresent(!state.present);
    if (event.key.toLowerCase() === 'n') setNotes(!state.notes);
    if (event.key === '/' && document.activeElement !== refs.search) { event.preventDefault(); refs.search.focus(); }
    if (event.key === 'Escape' && state.present) setPresent(false);
  });

  const params = new URLSearchParams(window.location.search);
  const initialSlide = Number(params.get('slide'));
  if (initialSlide && slides.some((slide) => slide.id === initialSlide)) state.index = slides.findIndex((slide) => slide.id === initialSlide);
  renderSlide();
  if (params.get('present') === '1') setPresent(true);
})();
