(() => {
  'use strict';

  const root = document.querySelector('#round2-app');
  if (!root) return;

  const direction = document.body.dataset.direction || 'manual';
  const data = window.ACOLYTE_REAL_CASES || { cases: [], industries: [] };
  const cases = data.cases || [];
  const params = new URLSearchParams(window.location.search);
  const state = {
    view: params.get('view') || 'home',
    caseId: params.get('case') || 'ris-support-memory',
    industry: 'all',
    agentStep: 0,
    toggles: { context: 'RICHE', tools: 'ON', memory: 'ON' }
  };
  const views = ['home', 'learn', 'agent', 'explore', 'case'];
  const directions = {
    manual: {
      label: 'MANUEL DE TERRAIN', short: 'Manual', number: '01',
      note: 'Un guide pratique, imprimé dans l’écran.', mascot: 'Cortex',
      palette: [['PAPIER', '#efe2cc'], ['NOIR', '#202a27'], ['BRIQUE', '#b64f3d'], ['SAUGE', '#849078']]
    },
    lab: {
      label: 'LAB / INSTRUMENT', short: 'Lab', number: '02',
      note: 'Un instrument pour observer avant d’automatiser.', mascot: 'Inat',
      palette: [['CARBONE', '#101820'], ['PÉTROLE', '#1c6972'], ['TURQUOISE', '#68c6bd'], ['SIGNAL', '#e4c25f']]
    },
    system: {
      label: 'HOCUS SYSTEM', short: 'System', number: '03',
      note: 'Une marque-système avec plusieurs voix, pas une couleur unique.', mascot: 'Gremlin',
      palette: [['NOIR', '#17191d'], ['JAUNE', '#e6bd35'], ['ROUGE', '#c8493d'], ['BLEU', '#396d91'], ['SAUGE', '#829579']]
    },
    review: {
      label: 'REVUE / INTELLIGENCE APPLIQUÉE', short: 'Review', number: '04',
      note: 'Une publication de référence qui prend le temps de penser.', mascot: 'Doppel',
      palette: [['IVOIRE', '#f8f5ee'], ['NOIR', '#1d2024'], ['PÉTROLE', '#24616a'], ['BORDEAUX', '#713843']]
    }
  };
  const meta = directions[direction] || directions.manual;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

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

  function directionHref(key) {
    const url = new URL(`../${key}/`, window.location.href);
    url.search = '';
    url.searchParams.set('view', state.view);
    if (state.view === 'case') url.searchParams.set('case', state.caseId);
    return `${url.pathname}${url.search}`;
  }

  function acolyteHref() {
    const url = new URL('../../../', window.location.href);
    url.search = '';
    url.searchParams.set('journey', 'pme');
    url.searchParams.set('slide', '1');
    return `${url.pathname}${url.search}`;
  }

  function evidenceLabel(type) {
    return { observed: 'OBSERVÉ', reported: 'RAPPORTÉ', projected: 'PROJETÉ' }[type] || 'À QUALIFIER';
  }

  function mascot(copy, role = 'NOTE DE MARGE') {
    return `<aside class="r2-mascot r2-mascot-${escapeHtml(direction)}" aria-label="Note de ${escapeHtml(meta.mascot)}"><span>${escapeHtml(role)}</span><strong>${escapeHtml(meta.mascot)}</strong><p>“${escapeHtml(copy)}”</p></aside>`;
  }

  function paletteStrip() {
    return `<div class="r2-palette" aria-label="Palette de la direction">${meta.palette.map(([label, color]) => `<span title="${escapeHtml(label)}" style="--swatch:${color}"><i></i><b>${escapeHtml(label)}</b></span>`).join('')}</div>`;
  }

  function architecture(items, className = '') {
    return `<div class="r2-architecture ${className}">${items.map((item, index) => `${index ? '<i aria-hidden="true">↓</i>' : ''}<span>${escapeHtml(item)}</span>`).join('')}</div>`;
  }

  function caseSummary(item) {
    return `<span class="r2-case-tag">${escapeHtml(item.industryLabel)}</span><span class="r2-case-evidence">${escapeHtml(evidenceLabel(item.source.evidenceType))}</span><h3>${escapeHtml(item.company)}</h3><p class="r2-case-level">${escapeHtml(item.levelLabel)}</p><p>${escapeHtml(item.problem)}</p><strong>${escapeHtml(item.results[0])}</strong>`;
  }

  function renderManualHome() {
    return `<section class="r2-manual-cover"><div class="r2-page-number">ACOLYTE / 01</div><div><p class="r2-kicker">HOCUS · CAHIER DE TERRAIN</p><h1>Comprendre l’IA sans lui confier les clés du bâtiment.</h1><p class="r2-lead">Un compagnon de terrain pour comprendre les agents, les workflows, la mémoire et les outils. On peut commencer par la page une.</p><div class="r2-actions"><a class="r2-button r2-button-primary" href="${escapeHtml(pageHref('learn'))}">Ouvrir le manuel</a><a class="r2-button" href="${escapeHtml(pageHref('explore'))}">Consulter les cas</a></div></div>${mascot('Un agent peut le faire. La vraie question est : est-ce qu’on veut vraiment le laisser faire ?', 'APARTÉ DE TERRAIN')}</section><section class="r2-manual-chapters"><div class="r2-section-label">SOMMAIRE / CE QUI NOUS ATTEND</div><a href="${escapeHtml(pageHref('learn'))}"><span>01</span><strong>Les concepts sans le brouillard</strong><em>Agents, contexte, mémoire, outils</em></a><a href="${escapeHtml(pageHref('explore'))}"><span>02</span><strong>Les cas qui existent déjà</strong><em>Problèmes, architectures, résultats, limites</em></a><div class="is-muted"><span>03</span><strong>WORKSHOP</strong><em>À venir. Chaque chose en son temps.</em></div></section>`;
  }

  function renderLabHome() {
    return `<section class="r2-lab-console"><div class="r2-lab-readout"><span>HOCUS / ACOLYTE</span><strong>02</strong><small>INSTRUMENT D’INTELLIGENCE APPLIQUÉE</small></div><div class="r2-lab-objective"><p class="r2-kicker">OBJECTIF DE L’INSTRUMENT</p><h1>Comprendre l’IA sans lui confier les clés du bâtiment.</h1><p class="r2-lead">Un espace précis pour observer les agents, les workflows et leurs limites. Pas un dashboard. Un poste de lecture.</p><div class="r2-actions"><a class="r2-button r2-button-primary" href="${escapeHtml(pageHref('learn'))}">Lancer l’exploration</a><a class="r2-button" href="${escapeHtml(pageHref('explore'))}">Ouvrir les signaux</a></div></div><div class="r2-lab-signal"><span>SIGNAL / 001</span><b>LEARN</b><i></i><span>SIGNAL / 002</span><b>EXPLORE</b><i></i><span>SIGNAL / 003</span><b>WORKSHOP</b><em>EN PRÉPARATION</em></div></section><section class="r2-lab-modules"><a href="${escapeHtml(pageHref('learn'))}"><span>MODULE 01</span><strong>Concepts</strong><p>Décomposer l’autonomie en objectif, contexte, outils, action et validation.</p><b>ACCÉDER →</b></a><a href="${escapeHtml(pageHref('explore'))}"><span>MODULE 02</span><strong>Cas réels</strong><p>Observer ce qui a été essayé, avec les sources et les angles morts.</p><b>ACCÉDER →</b></a><div class="is-muted"><span>MODULE 03</span><strong>Workshop</strong><p>Transformer une question en expérience cadrée.</p><b>BIENTÔT</b></div></section>`;
  }

  function renderSystemHome() {
    return `<section class="r2-system-hero"><div class="r2-system-wordmark"><span>H</span><span>O</span><span>C</span><span>U</span><span>S</span></div><div class="r2-system-copy"><p class="r2-kicker">ACOLYTE / MOTEUR DE COMPRÉHENSION</p><h1>Comprendre l’IA sans lui confier les clés du bâtiment.</h1><p class="r2-lead">Acolyte organise les concepts, les cas et les méthodes. Chaque section a sa voix ; le cadre reste solide.</p><div class="r2-actions"><a class="r2-button r2-button-primary" href="${escapeHtml(pageHref('learn'))}">Entrer dans LEARN</a><a class="r2-button" href="${escapeHtml(pageHref('explore'))}">Entrer dans EXPLORE</a></div></div><div class="r2-system-orbit"><span class="orbit-yellow">LEARN</span><span class="orbit-blue">EXPLORE</span><span class="orbit-red">WORKSHOP</span><b>HOCUS<br>SYSTEM</b></div></section><section class="r2-system-cast"><div class="r2-section-label">CASTING / LES VOIX DU SYSTÈME</div><a class="system-cast-learn" href="${escapeHtml(pageHref('learn'))}"><span>01 / CORTEX</span><strong>Déplier les idées</strong><p>Le concept devient une mécanique compréhensible.</p></a><a class="system-cast-explore" href="${escapeHtml(pageHref('explore'))}"><span>02 / INAT</span><strong>Regarder le réel</strong><p>Les cas portent les preuves, les caveats et les limites.</p></a><div class="system-cast-muted"><span>03 / À VENIR</span><strong>WORKSHOP</strong><p>Le terrain arrive après la carte.</p></div></section>`;
  }

  function renderReviewHome() {
    return `<section class="r2-review-cover"><div class="r2-review-masthead"><span>HOCUS</span><strong>ACOLYTE</strong><em>N° 02 · INTELLIGENCE APPLIQUÉE</em></div><div class="r2-review-feature"><p class="r2-kicker">ÉDITORIAL / OUVERTURE</p><h1>Comprendre l’IA sans lui confier les clés du bâtiment.</h1><p class="r2-lead">Une publication-outil sur les agents, les workflows, la mémoire et les outils. Sérieuse, lisible, avec juste assez de distance pour éviter le catéchisme technologique.</p><a class="r2-text-link" href="${escapeHtml(pageHref('learn'))}">Lire le premier article →</a></div><div class="r2-review-note"><span>À LA UNE</span><strong>Le mot “agent” ne dispense pas de définir le travail.</strong>${mascot('Une réponse très convaincante reste une réponse à vérifier. Désolé pour l’ambiance.', 'NOTE DE RÉDACTION')}</div></section><section class="r2-review-contents"><div class="r2-section-label">DANS CE NUMÉRO</div><a href="${escapeHtml(pageHref('learn'))}"><span>01</span><strong>Un agent, ce n’est pas juste un chatbot qui a pris du galon.</strong><em>Lire l’article</em></a><a href="${escapeHtml(pageHref('explore'))}"><span>02</span><strong>Des preuves pour ouvrir la conversation.</strong><em>Voir le dossier</em></a><div class="is-muted"><span>03</span><strong>WORKSHOP / PROCHAIN NUMÉRO</strong><em>À suivre</em></div></section>`;
  }

  function renderHome() {
    if (direction === 'lab') return renderLabHome();
    if (direction === 'system') return renderSystemHome();
    if (direction === 'review') return renderReviewHome();
    return renderManualHome();
  }

  const componentRows = [['OBJECTIF', 'Ce qui doit être obtenu, pas seulement demandé.'], ['CONTEXTE', 'Les informations qui empêchent l’agent de deviner.'], ['OUTILS', 'Les systèmes auxquels il peut accéder.'], ['MÉMOIRE', 'Ce qui doit rester utile après la session.'], ['RÈGLES', 'Les limites qui rendent l’autonomie acceptable.']];

  function renderLearnManual() {
    return `<section class="r2-view-head r2-manual-head"><span class="r2-page-number">CHAPITRE 01 / LEARN</span><p class="r2-kicker">CONCEPT / DÉFINITION</p><h1>Un agent, ce n’est pas juste un chatbot qui a pris du galon.</h1><p class="r2-lead">Il reçoit un objectif, utilise des outils et enchaîne plusieurs étapes pour produire un résultat. L’autonomie est pratique. Les limites aussi.</p></section><section class="r2-manual-concept"><article><span class="r2-section-label">DÉFINITION</span><h2>Une IA à laquelle on confie un objectif et une marge d’initiative.</h2><p>La différence ne tient pas à un mot plus ambitieux dans le menu. Elle tient à la boucle : objectif, contexte, outils, action, observation, nouvelle action.</p></article><div class="r2-component-list">${componentRows.map(([label, copy], index) => `<div><span>0${index + 1}</span><strong>${label}</strong><p>${copy}</p></div>`).join('')}</div></section><div class="r2-manual-principle"><strong>Automatiser un mauvais processus reste une mauvaise idée.</strong><span>Simplement, il ira maintenant beaucoup plus vite.</span></div>${mascot('L’autonomie, c’est pratique. Les limites aussi.', 'NOTE DE TERRAIN')}`;
  }

  function renderLearnLab() {
    return `<section class="r2-view-head r2-lab-head"><div class="r2-lab-status"><span>MODULE 01</span><b>ONLINE</b></div><p class="r2-kicker">LEARN / CONCEPT SIGNAL</p><h1>Un agent, ce n’est pas juste un chatbot qui a pris du galon.</h1><p class="r2-lead">Lire le système par ses entrées, ses boucles et ses points de contrôle.</p></section><section class="r2-lab-concept"><div class="r2-lab-schematic"><span class="is-input">OBJECTIF</span><i>→</i><span>CONTEXTE</span><i>→</i><span>AGENT</span><i>→</i><span>OUTILS</span><i>→</i><span class="is-output">LIVRABLE</span><div class="r2-lab-return">OBSERVATION / NOUVELLE ACTION / VALIDATION HUMAINE</div></div><div class="r2-lab-spec"><span>SPEC / 001</span><h2>Une IA à laquelle on confie un objectif et une marge d’initiative.</h2><p>La boucle est la différence : objectif, contexte, outils, action, observation, nouvelle action. L’autonomie n’est pas une ambiance ; c’est une configuration.</p>${mascot('On peut mesurer la boucle. On ne peut pas mesurer le soulagement d’un comité.', 'COMMENTAIRE SIGNAL')}</div></section><section class="r2-lab-components">${componentRows.map(([label, copy], index) => `<div><span>0${index + 1} / ${label}</span><p>${copy}</p></div>`).join('')}</section>`;
  }

  function renderLearnSystem() {
    return `<section class="r2-view-head r2-system-head"><div class="r2-system-marker">CORTEX / 01</div><p class="r2-kicker">LEARN / MOTEUR CONCEPTUEL</p><h1>Un agent, ce n’est pas juste un chatbot qui a pris du galon.</h1><p class="r2-lead">Le mot devient utile quand on voit ce qu’il reçoit, ce qu’il peut faire et où l’humain reprend la main.</p></section><section class="r2-system-concept"><div class="system-concept-definition"><span>LE CONCEPT</span><h2>Une IA à laquelle on confie un objectif et une marge d’initiative.</h2><p>Un agent ne remplace pas la décision. Il organise une suite d’actions dans un cadre qui doit rester visible.</p></div><div class="system-concept-stack">${componentRows.map(([label, copy], index) => `<div class="system-tone-${index + 1}"><span>0${index + 1}</span><strong>${label}</strong><p>${copy}</p></div>`).join('')}</div></section><div class="r2-system-quote"><span>CORTEX DIT</span><strong>Automatiser un mauvais processus reste une mauvaise idée.</strong><p>Simplement, il ira maintenant beaucoup plus vite.</p></div>${mascot('Le système devient intéressant quand il sait aussi dire non.', 'VOIX DU MOTEUR')}`;
  }

  function renderLearnReview() {
    return `<section class="r2-view-head r2-review-head"><span class="r2-review-section">ESSAI / 01</span><p class="r2-kicker">LEARN / CONCEPT</p><h1>Un agent, ce n’est pas juste un chatbot qui a pris du galon.</h1><p class="r2-lead">Ce qui change n’est pas seulement la qualité d’une réponse. C’est la possibilité de poursuivre un objectif à travers plusieurs étapes.</p></section><article class="r2-review-essay"><div class="r2-essay-copy"><p class="r2-dropcap">U</p><p>ne IA à laquelle on confie un objectif et une marge d’initiative peut utiliser des outils, observer leurs résultats et ajuster sa prochaine action.</p><p>La différence ne tient donc pas à un mot plus ambitieux dans le menu. Elle tient à la boucle : objectif, contexte, outils, action, observation, nouvelle action.</p></div><aside class="r2-review-pull"><strong>« L’autonomie est pratique. Les limites aussi. »</strong><span>— note de lecture</span></aside></article><section class="r2-review-footnotes"><div><span>01</span><strong>OBJECTIF</strong><p>Ce qui doit être obtenu.</p></div><div><span>02</span><strong>CONTEXTE</strong><p>Ce qui empêche de deviner.</p></div><div><span>03</span><strong>OUTILS</strong><p>Ce qui permet d’agir.</p></div><div><span>04</span><strong>RÈGLES</strong><p>Ce qui rend l’autonomie acceptable.</p></div></section>${mascot('Un agent, ce n’est pas une délégation de responsabilité en police 12.', 'MARGE ÉDITORIALE')}`;
  }

  function renderLearn() {
    if (direction === 'lab') return renderLearnLab();
    if (direction === 'system') return renderLearnSystem();
    if (direction === 'review') return renderLearnReview();
    return renderLearnManual();
  }

  function renderAgent() {
    const steps = ['Identifier le client', 'Lire le CRM', 'Lire les derniers emails', 'Chercher des informations externes', 'Identifier risques et opportunités', 'Préparer le briefing'];
    const rows = steps.map((label, index) => `<li class="${index < state.agentStep ? 'is-done' : index === state.agentStep && state.agentStep < 6 ? 'is-active' : ''}"><span>0${index + 1}</span><b>${escapeHtml(label)}</b><em>${index < state.agentStep ? 'FAIT' : index === state.agentStep && state.agentStep < 6 ? 'EN COURS' : 'À VENIR'}</em></li>`).join('');
    const complete = state.agentStep >= 6;
    const controls = `<aside class="r2-agent-controls"><p class="r2-kicker">CONSOLE / MISSION</p><h2>Prépare mon dossier commercial pour demain.</h2><button class="r2-button r2-button-primary r2-run-button" type="button" data-agent-run>${complete ? 'Rejouer la mission' : 'Lancer la mission'}</button><div class="r2-toggle-list"><button type="button" data-toggle="context"><span>CONTEXTE</span><b>${escapeHtml(state.toggles.context)}</b></button><button type="button" data-toggle="tools"><span>OUTILS</span><b>${escapeHtml(state.toggles.tools)}</b></button><button type="button" data-toggle="memory"><span>MÉMOIRE</span><b>${escapeHtml(state.toggles.memory)}</b></button></div><p class="r2-agent-status" role="status">${complete ? 'Livrable prêt · validation humaine requise.' : state.agentStep ? `Mission en cours · étape ${state.agentStep}/6.` : 'Lancez la mission pour observer la boucle.'}</p></aside>`;
    const sequence = direction === 'lab'
      ? `<div class="r2-agent-lab-loop"><span>PLAN</span><i>→</i><span>ACTION</span><i>→</i><span>OBSERVATION</span><b>SUFFISANT ?</b></div>`
      : direction === 'system'
        ? `<div class="r2-agent-system-loop"><span>OBJECTIF</span><span>AGENT</span><span>OUTILS</span><span>HUMAN GATE</span></div>`
        : direction === 'review'
          ? `<div class="r2-agent-review-loop"><span>PLAN</span><span>ACTION</span><span>OBSERVATION</span><span>VALIDATION</span></div>`
          : `<div class="r2-agent-manual-loop"><span>PROTOCOLE / 06 ÉTAPES</span><strong>OBJECTIF → ACTION → OBSERVATION → LIVRABLE</strong></div>`;
    return `<section class="r2-view-head"><p class="r2-kicker">LEARN / AGENT LAB</p><h1>Prépare mon dossier commercial pour demain.</h1><p class="r2-lead">Un agent possède un objectif, des outils, du contexte, une boucle d’action et des limites d’autonomie.</p></section><section class="r2-agent-layout"><div class="r2-agent-system">${sequence}<ol class="r2-mission-steps">${rows}</ol>${complete ? '<div class="r2-human-gate"><span>HUMAN GATE</span><strong>J’ai préparé l’email de relance et mis à jour la fiche CRM.</strong><p>VALIDER · MODIFIER · ANNULER — aucune action distante n’est envoyée.</p></div>' : ''}</div>${controls}</section>${mascot('Oui, l’agent peut le faire. Ce n’est pas une raison pour lui confier les clés du bâtiment.', 'COMMENTAIRE SUR LA MISSION')}`;
  }

  function renderExploreManual(visible) {
    return `<div class="r2-manual-index">${visible.map((item, index) => `<a class="r2-case-row" href="${escapeHtml(pageHref('case', { case: item.id }))}"><span>0${index + 1}</span><div><small>${escapeHtml(item.industryLabel)} · ${escapeHtml(evidenceLabel(item.source.evidenceType))}</small><h3>${escapeHtml(item.company)}</h3><p>${escapeHtml(item.problem)}</p></div><strong>Lire →</strong></a>`).join('')}</div>`;
  }

  function renderExploreLab(visible) {
    return `<div class="r2-lab-table"><div class="r2-lab-table-head"><span>ID</span><span>CAS / SIGNAL</span><span>NIVEAU</span><span>PREMIÈRE OBSERVATION</span><span>→</span></div>${visible.map((item, index) => `<a href="${escapeHtml(pageHref('case', { case: item.id }))}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item.company)}</strong><span>${escapeHtml(item.levelLabel)}</span><p>${escapeHtml(item.problem)}</p><b>OUVRIR</b></a>`).join('')}</div>`;
  }

  function renderExploreSystem(visible) {
    return `<div class="r2-atlas">${visible.map((item, index) => `<a class="r2-atlas-${(index % 4) + 1}" href="${escapeHtml(pageHref('case', { case: item.id }))}"><span>CASE / 0${index + 1}</span><h3>${escapeHtml(item.company)}</h3><p>${escapeHtml(item.industryLabel)} · ${escapeHtml(item.levelLabel)}</p><strong>${escapeHtml(item.results[0])}</strong><b>EXPLORER ↗</b></a>`).join('')}</div>`;
  }

  function renderExploreReview(visible) {
    return `<div class="r2-dossier-list">${visible.map((item, index) => `<article><span class="r2-dossier-number">0${index + 1}</span><div><p class="r2-kicker">${escapeHtml(item.industryLabel)} · ${escapeHtml(evidenceLabel(item.source.evidenceType))}</p><h3>${escapeHtml(item.company)}</h3><p>${escapeHtml(item.problem)}</p><strong>${escapeHtml(item.takeaway)}</strong><a class="r2-text-link" href="${escapeHtml(pageHref('case', { case: item.id }))}">Lire le dossier →</a></div></article>`).join('')}</div>`;
  }

  function renderExplore() {
    const visible = cases.filter((item) => state.industry === 'all' || (item.industryLabels || [item.industry]).includes(state.industry));
    const content = direction === 'lab' ? renderExploreLab(visible) : direction === 'system' ? renderExploreSystem(visible) : direction === 'review' ? renderExploreReview(visible) : renderExploreManual(visible);
    return `<section class="r2-view-head"><p class="r2-kicker">EXPLORE / BIBLIOTHÈQUE</p><h1>Des preuves pour ouvrir la conversation.</h1><p class="r2-lead">Des problèmes concrets, des architectures et des limites. Le réel est parfois plus instructif que la roadmap.</p></section><div class="r2-explore-toolbar"><label>FILTRER PAR INDUSTRIE<select id="r2-industry-filter"><option value="all">Toutes les industries</option>${(data.industries || []).map((item) => `<option value="${escapeHtml(item.key)}" ${state.industry === item.key ? 'selected' : ''}>${escapeHtml(item.label)}</option>`).join('')}</select></label><span id="r2-case-count">${visible.length} cas affiché${visible.length > 1 ? 's' : ''}</span></div><section id="r2-case-results">${content}</section>${mascot('On peut ajouter encore trois graphiques. Ou répondre à la question.', 'ANNOTATION DE BIBLIOTHÈQUE')}`;
  }

  function renderCase() {
    const item = cases.find((candidate) => candidate.id === state.caseId) || cases[0];
    if (!item) return renderExplore();
    const bridge = item.id === 'ris-support-memory' ? `<a class="r2-text-link" href="${escapeHtml(pageHref('learn'))}">Revenir au concept mémoire →</a>` : ['qonto-human-gate', 'groupeactive-propale'].includes(item.id) ? `<a class="r2-text-link" href="${escapeHtml(pageHref('agent'))}">Voir la boucle agent →</a>` : '';
    const header = `<section class="r2-view-head r2-case-head"><a class="r2-text-link" href="${escapeHtml(pageHref('explore'))}">← Retour aux cas</a><p class="r2-kicker">EXPLORE / FICHE CAS · ${escapeHtml(evidenceLabel(item.source.evidenceType))}</p><h1>${escapeHtml(item.company)}</h1><p class="r2-lead">${escapeHtml(item.industryLabel)} · ${escapeHtml(item.levelLabel)} · ${escapeHtml(item.size)}</p></section>`;
    const facts = `<div class="r2-case-facts"><div><span>PROBLÈME</span><p>${escapeHtml(item.problem)}</p></div><div><span>APPROCHE</span><p>${escapeHtml(item.solution)}</p></div><div><span>RÉSULTAT</span><ul>${item.results.map((result) => `<li>${escapeHtml(result)}</li>`).join('')}</ul></div></div>`;
    const source = `<div class="r2-case-source"><span>SOURCE / ${escapeHtml(item.source.publisher)} · ${escapeHtml(item.source.date)}</span><a href="${escapeHtml(item.source.url)}" target="_blank" rel="noopener">Lire la source ↗</a><p>${escapeHtml(item.caveat)}</p></div>`;
    if (direction === 'lab') return `${header}<section class="r2-case-lab"><div>${facts}</div><aside><span class="r2-kicker">SIGNAL CHAIN</span>${architecture(item.architecture, 'r2-lab-architecture')}<div class="r2-case-takeaway"><span>TAKEAWAY</span><strong>${escapeHtml(item.takeaway)}</strong></div>${source}</aside></section>${bridge}`;
    if (direction === 'system') return `${header}<section class="r2-case-system"><div class="r2-system-case-band"><span>HOCUS SYSTEM / CASE</span><strong>${escapeHtml(item.industryLabel)}</strong><b>${escapeHtml(item.levelLabel)}</b></div>${facts}<div class="r2-case-system-bottom">${architecture(item.architecture)}<div class="r2-case-takeaway"><span>CE QU’IL FAUT RETENIR</span><strong>${escapeHtml(item.takeaway)}</strong></div></div>${source}</section>${bridge}`;
    if (direction === 'review') return `${header}<article class="r2-case-review"><div class="r2-review-article-copy">${facts}</div><aside><div class="r2-review-pull"><strong>« ${escapeHtml(item.takeaway)} »</strong><span>Note de dossier</span></div>${architecture(item.architecture)}${source}</aside></article>${bridge}`;
    return `${header}<article class="r2-case-manual"><div><span class="r2-section-label">DOSSIER / CE QUE L’ON SAIT</span>${facts}</div><aside><span class="r2-section-label">SCHÉMA DE TERRAIN</span>${architecture(item.architecture)}<div class="r2-case-takeaway"><span>À RETENIR</span><strong>${escapeHtml(item.takeaway)}</strong></div>${source}</aside></article>${bridge}`;
  }

  function renderView() {
    if (state.view === 'learn') return renderLearn();
    if (state.view === 'agent') return renderAgent();
    if (state.view === 'explore') return renderExplore();
    if (state.view === 'case') return renderCase();
    return renderHome();
  }

  function render() {
    const nav = Object.entries(directions).map(([key, item]) => `<a class="${key === direction ? 'is-active' : ''}" href="${escapeHtml(directionHref(key))}">${escapeHtml(item.short)}</a>`).join('');
    root.innerHTML = `<div class="r2-shell"><header class="r2-topbar"><a class="r2-brand" href="${escapeHtml(pageHref('home'))}"><span class="r2-brand-mark">✦</span><span>HOCUS / ACOLYTE</span></a><nav class="r2-primary-nav" aria-label="Acolyte"><a class="${state.view === 'learn' || state.view === 'agent' ? 'is-active' : ''}" href="${escapeHtml(pageHref('learn'))}">LEARN</a><a class="${state.view === 'explore' || state.view === 'case' ? 'is-active' : ''}" href="${escapeHtml(pageHref('explore'))}">EXPLORE</a><span>WORKSHOP · À VENIR</span></nav><span class="r2-direction-label">${escapeHtml(meta.label)}</span><a class="r2-return" href="${escapeHtml(acolyteHref())}">Acolyte ↗</a></header><nav class="r2-direction-nav" aria-label="Round 2 — comparer les directions"><span>ROUND 02 / DIRECTIONS</span>${nav}<a class="r2-old-round" href="../../">Round 1</a></nav><main class="r2-main">${renderView()}</main><footer class="r2-footer"><span>${escapeHtml(meta.number)} / ${escapeHtml(meta.label)}</span>${paletteStrip()}<span>Contenu commun · simulation locale · aucun appel externe</span></footer></div>`;
    bindEvents();
  }

  function bindEvents() {
    const filter = $('#r2-industry-filter');
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

  if (!views.includes(state.view)) state.view = 'home';
  render();
})();
