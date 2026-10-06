(() => {
  'use strict';

  const root = document.querySelector('#explore-view');
  if (!root) return;

  const labels = {
    company_size: {
      tpe: 'TPE', pme: 'PME', eti: 'ETI', enterprise: 'Grand compte', group: 'Groupe', unknown: 'Toutes tailles'
    },
    industry: {
      retail: 'Distribution', industry: 'Industrie', 'services-b2b': 'Services B2B', insurance: 'Assurance', finance: 'Finance',
      construction: 'Construction', hospitality: 'Hôtellerie', 'luxury-beauty': 'Luxe / Beauté', 'transport-logistics': 'Transport / Logistique',
      agriculture: 'Agriculture', automotive: 'Automobile', software: 'Logiciel', healthcare: 'Santé', 'public-sector': 'Secteur public', 'energy-utilities': 'Énergie / Environnement', other: 'Autre', unknown: 'Tous secteurs'
    },
    business_function: {
      'general-management': 'Direction générale', marketing: 'Marketing', sales: 'Commerce', finance: 'Finance', hr: 'Ressources humaines',
      operations: 'Opérations', supply: 'Supply chain', 'customer-service': 'Service client', 'it-data': 'IT / Data', procurement: 'Achats', product: 'Produit', legal: 'Juridique', other: 'Autre', unknown: 'Non renseigné'
    },
    solution_type: { copilot: 'Copilote', knowledge: 'Base de connaissance', workflow: 'Chaîne automatisée', agent: 'Agent', product: 'Produit', unknown: 'Non renseigné' },
    autonomy_level: { assisted: 'Assisté', 'semi-autonomous': 'Semi-autonome', 'supervised-agent': 'Agent supervisé', 'bounded-autonomous': 'Autonome borné', unknown: 'Non renseigné' },
    outcome: { positive: 'Résultat positif', mixed: 'Résultat mitigé', setback: 'Échec ou revers' },
    evidence_level: { documented: 'Documenté', experience: 'Expérience', pattern: 'Cas type', concept: 'Concept' },
    confidence: { high: 'Élevée', medium: 'Moyenne', low: 'Faible', unknown: 'Non renseignée' },
    value_type: { productivity: 'Productivité', quality: 'Qualité', speed: 'Vitesse', cost: 'Coût', revenue: 'Revenu', risk: 'Risque', knowledge: 'Connaissance', decision: 'Décision', unknown: 'Non renseigné' },
    tool_family: { model: 'Modèles', 'harness-agent': 'Harnais et agents', automation: 'Automatisation', 'knowledge-rag': 'Connaissance et RAG', 'classic-ml': 'Machine learning classique', 'vision-speech': 'Vision et parole', 'eval-observability': 'Évaluation et observabilité', 'office-copilot': 'Copilotes bureautiques', hosting: 'Hébergement et cloud', 'data-platform': 'Plateformes de données', 'business-app': 'Applications métier' },
    license: { proprietary: 'Propriétaire', 'open-weights': 'Poids ouverts', 'open-source': 'Open source', unknown: 'Non renseignée' },
    hosting: { saas: 'SaaS', api: 'API', 'cloud-platform': 'Plateforme cloud', 'eu-region': 'Région UE disponible', secnumcloud: 'SecNumCloud', 'self-hosted': 'Auto-hébergeable', 'on-prem': 'Sur site', desktop: 'Poste de travail', unknown: 'Non renseigné' },
    skill_level: { 'no-code': 'Sans code', 'low-code': 'Low-code', dev: 'Développeur', ml: 'Data science / ML', unknown: 'Non renseigné' },
    pricing_model: { free: 'Gratuit', 'open-source': 'Open source (gratuit, hors infrastructure)', 'per-seat': 'Par utilisateur', 'usage-based': 'À l’usage', subscription: 'Abonnement', 'enterprise-quote': 'Sur devis', included: 'Inclus dans une offre', unknown: 'Non renseigné' },
    country: { US: 'États-Unis', FR: 'France', GB: 'Royaume-Uni', DE: 'Allemagne', AU: 'Australie', community: 'Communauté open source' },
    tool_ids: {},
    ai_pattern: { generation: 'Génération', summarization: 'Synthèse', retrieval: 'Recherche', extraction: 'Extraction', classification: 'Classification', comparison: 'Comparaison', scoring: 'Scoring', recommendation: 'Recommandation', orchestration: 'Orchestration', monitoring: 'Veille', prediction: 'Prédiction', coding: 'Code', multimodal: 'Multimodal', clustering: 'Regroupement (clustering)', optimization: 'Optimisation sous contraintes', other: 'Autre', unknown: 'Non renseigné' }
  };
  const filterConfig = [
    ['company_size', 'Taille d’entreprise'],
    ['industry', 'Secteur'],
    ['business_function', 'Fonction métier'],
    ['solution_type', 'Type de solution'],
    ['autonomy_level', 'Autonomie'],
    ['evidence_level', 'Niveau de preuve'],
    ['outcome', 'Résultat'],
    ['value_type', 'Type de valeur'],
    ['tool_ids', 'Outil cité']
  ];
  /* Carte des outils : l'ordre des familles suit le rôle dans un système, du modèle à l'application métier. */
  const familyOrder = ['model', 'office-copilot', 'harness-agent', 'automation', 'knowledge-rag', 'classic-ml', 'vision-speech', 'eval-observability', 'data-platform', 'hosting', 'business-app'];
  const familyCopy = {
    model: 'Les grands modèles de langage, propriétaires ou ouverts, et les services qui les donnent à utiliser.',
    'office-copilot': 'Les assistants intégrés aux outils de bureau et à la messagerie de l’entreprise.',
    'harness-agent': 'Ce qui fait travailler un modèle : agents, plateformes d’agents, protocoles et outils métier spécialisés.',
    automation: 'Les outils qui enchaînent des étapes et relient les applications entre elles.',
    'knowledge-rag': 'Les sources de connaissance et la recherche qui nourrissent les réponses.',
    'classic-ml': 'Prévision, scoring et détection d’anomalies, souvent sans grand modèle de langage.',
    'vision-speech': 'Lire une image, un document scanné ou une voix.',
    'eval-observability': 'Tester, mesurer et améliorer un système d’IA avant et après sa mise en service.',
    'data-platform': 'Collecter, gouverner et analyser les données dont l’IA dépend.',
    hosting: 'Les clouds et les plateformes où tournent les modèles et les applications.',
    'business-app': 'Les applications métier dans lesquelles l’IA s’insère.'
  };
  const evidenceCopy = {
    documented: 'Cas publiquement documenté, avec entreprise identifiable et source.',
    experience: 'Expérience réelle reformulée ou anonymisée.',
    pattern: 'Cas type construit à partir de situations fréquentes, pas un cas client unique.',
    concept: 'Concept ou proposition non prouvé par un cas réel.'
  };
  const evidenceColors = { documented: 'documented', experience: 'experience', pattern: 'pattern', concept: 'concept' };
  const PAGE = 12;
  const state = { cases: [], tools: [], toolsById: {}, glossary: { groups: {}, terms: [] }, query: '', filters: {}, detail: null, filtersOpen: false, limit: PAGE };
  /* Acolyte V2 : chaque fiche a sa page, /acolyte/cas/{slug}/ (pré-rendue pour les moteurs de recherche). */
  const base = root.dataset.root || '../';
  const caseHref = (item) => `${base}cas/${encodeURIComponent(item.slug || item.id)}/`;
  const exploreHref = `${base}explore/`;
  /* Carte des outils : /acolyte/outils/ et une page par outil, /acolyte/outils/{slug}/ (pré-rendue elle aussi). */
  const toolSlug = (tool) => String(tool.id).replace(/^tool-/, '');
  const toolHref = (tool) => `${base}outils/${encodeURIComponent(toolSlug(tool))}/`;
  const toolsHref = `${base}outils/`;
  /* Glossaire : /acolyte/glossaire/ et une page par terme, /acolyte/glossaire/{slug}/ (pré-rendue). */
  const termHref = (term) => `${base}glossaire/${encodeURIComponent(term.slug)}/`;
  const glossaryHref = `${base}glossaire/`;
  let sky = null;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  const asArray = (value) => value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];
  const textValue = (value) => typeof value === 'object' && value !== null ? value.text || value.description || value.name || value.title || '' : String(value ?? '');
  const titleFor = (field, value) => labels[field]?.[value] || value || 'Non renseigné';
  const labelForArray = (field, value) => asArray(value).map((item) => titleFor(field, item)).filter(Boolean);
  const slugToKey = (value) => String(value || '').trim();

  function valuesFor(item, field) { return asArray(item[field]).filter((value) => value !== null && value !== undefined && value !== ''); }
  function hasFilter(item, field, value) { return value === 'all' || valuesFor(item, field).includes(value); }
  function formatList(value, field) { return labelForArray(field, value).join(' · '); }
  const outcomeBadge = (item) => item.outcome === 'setback' || item.outcome === 'mixed' ? `<span class="outcome-badge outcome-${item.outcome}">${escapeHtml(titleFor('outcome', item.outcome))}</span>` : '';
  function proofBadge(level, extraClass = '') {
    const key = evidenceColors[level] || 'unknown';
    return `<span class="proof-badge proof-${key} ${extraClass}" title="${escapeHtml(evidenceCopy[level] || 'Niveau de preuve non renseigné.')}"><i aria-hidden="true"></i>${escapeHtml(titleFor('evidence_level', level))}</span>`;
  }

  function readRoute() {
    const params = new URLSearchParams(window.location.search);
    state.query = params.get('q') || '';
    state.detail = params.get('case') || null;
    state.filters = {};
    filterConfig.forEach(([field]) => {
      const value = params.get(field);
      if (value) state.filters[field] = value;
    });
  }

  function routeUrl({ detail = state.detail, query = state.query, filters = state.filters } = {}) {
    const url = new URL(window.location.href);
    url.search = '';
    if (detail) url.searchParams.set('case', detail);
    if (query) url.searchParams.set('q', query);
    Object.entries(filters).forEach(([field, value]) => { if (value && value !== 'all') url.searchParams.set(field, value); });
    return url;
  }

  function navigate(next = {}) {
    readRoute();
    if (Object.prototype.hasOwnProperty.call(next, 'detail')) state.detail = next.detail;
    if (Object.prototype.hasOwnProperty.call(next, 'query')) state.query = next.query;
    if (Object.prototype.hasOwnProperty.call(next, 'filters')) state.filters = next.filters;
    state.limit = PAGE;
    window.history.pushState({}, '', routeUrl());
    render();
    root.focus({ preventScroll: true });
  }

  function matchesQuery(item) {
    const query = state.query.trim().toLocaleLowerCase('fr');
    if (!query) return true;
    const haystack = [
      item.title, item.short_description, item.problem, item.industry, item.industry_raw,
      ...valuesFor(item, 'business_function'), ...valuesFor(item, 'ai_pattern'), ...valuesFor(item, 'solution_type'),
      ...valuesFor(item, 'tool_ids').map((id) => state.toolsById[id]?.name)
    ].join(' ').toLocaleLowerCase('fr');
    return haystack.includes(query);
  }

  function filteredCases() {
    return state.cases.filter((item) => matchesQuery(item) && filterConfig.every(([field]) => hasFilter(item, field, state.filters[field] || 'all')));
  }

  function optionValues(field) {
    if (field === 'evidence_level') return ['documented', 'experience', 'pattern', 'concept'];
    const values = new Set(state.cases.flatMap((item) => valuesFor(item, field)));
    return [...values].sort((a, b) => titleFor(field, a).localeCompare(titleFor(field, b), 'fr'));
  }

  function renderActiveFilters() {
    const container = $('#active-filters');
    if (!container) return;
    const active = filterConfig
      .map(([field, label]) => ({ field, label, value: state.filters[field] }))
      .filter(({ value }) => value && value !== 'all');
    const query = state.query.trim();
    const chips = [
      ...(query ? [`<button class="explore-filter-chip" type="button" data-remove-query aria-label="Retirer la recherche ${escapeHtml(query)}">Recherche : ${escapeHtml(query)} <b aria-hidden="true">×</b></button>`] : []),
      ...active.map(({ field, label, value }) => `<button class="explore-filter-chip" type="button" data-remove-filter="${escapeHtml(field)}" aria-label="Retirer le filtre ${escapeHtml(label)} : ${escapeHtml(titleFor(field, value))}">${escapeHtml(label)} : ${escapeHtml(titleFor(field, value))} <b aria-hidden="true">×</b></button>`)
    ];
    container.hidden = chips.length === 0;
    container.innerHTML = chips.join('');
  }

  function populateFilterOptions(scope = document) {
    filterConfig.forEach(([field, label]) => {
      const select = $(`#filter-${field}`, scope);
      if (!select) return;
      const current = state.filters[field] || 'all';
      select.innerHTML = `<option value="all">Tous · ${escapeHtml(label.toLocaleLowerCase('fr'))}</option>${optionValues(field).map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(titleFor(field, value))}</option>`).join('')}`;
      select.value = current;
    });
  }

  function renderCatalogShell() {
    root.innerHTML = `<section class="explore-hero">
      <div class="explore-hero-copy">
        <p class="explore-kicker">CATALOGUE · 160 CAS D’USAGE</p>
        <h1>Les cas d’usage de l’IA, avant les promesses.</h1>
        <p class="explore-lead">Parcourez des situations de travail, les solutions possibles et ce qui est réellement documenté. Filtrez par secteur, fonction ou taille d’entreprise, puis ouvrez une fiche.</p>
        <div class="explore-hero-links"><a class="explore-button explore-button-primary" href="${base}?journey=operating-system&amp;slide=1">Commencer par un parcours <span aria-hidden="true">→</span></a><a class="explore-text-link" href="${toolsHref}">La carte des outils →</a><a class="explore-text-link" href="${glossaryHref}">Le glossaire →</a><a class="explore-text-link" href="/works/diagnostic/">Le Diagnostic Data &amp; IA ↗</a></div>
      </div>
      <aside class="explore-hero-note"><span>À DATE</span><strong id="case-count">— cas</strong><p><span id="case-mix">115 cas documentés par une source publique, 41 cas types et 4 retours d’expérience.</span> Les inconnues et les limites restent visibles.</p></aside>
    </section>
    <section class="explore-catalog" aria-labelledby="catalog-title">
      <div class="explore-catalog-head"><div><p class="explore-kicker">LE CATALOGUE</p><h2 id="catalog-title">Trouver un point de départ.</h2></div><p class="explore-catalog-intro">La recherche porte sur le titre, le problème, la fonction, le secteur, le type d’IA et les outils cités. Les filtres se combinent.</p></div>
      <section class="sky" id="case-sky" aria-label="Le ciel des cas"></section>
      <div class="explore-toolbar"><label class="explore-search"><span aria-hidden="true">⌕</span><span class="sr-only">Rechercher dans les cas</span><input id="case-search" type="search" autocomplete="off" placeholder="Rechercher un problème, une fonction, un secteur…" value="${escapeHtml(state.query)}"></label><button class="explore-filter-toggle" id="filter-toggle" type="button" aria-expanded="${state.filtersOpen}">Filtres <span aria-hidden="true">＋</span></button><button class="explore-reset" id="reset-filters" type="button">Réinitialiser</button></div><div class="explore-active-filters" id="active-filters" aria-live="polite"></div>
      <div class="explore-catalog-layout ${state.filtersOpen ? 'filters-open' : ''}">
        <aside class="explore-filters" id="explore-filters" aria-label="Filtrer les cas"><div class="explore-filters-head"><span>FILTRER PAR CONTEXTE</span><button id="filter-close" type="button" aria-label="Fermer les filtres">×</button></div>${filterConfig.map(([field, label]) => `<label class="explore-filter" for="filter-${field}"><span>${escapeHtml(label)}</span><select id="filter-${field}" data-filter="${field}"></select></label>`).join('')}<div class="explore-proof-key"><span>NIVEAUX DE PREUVE</span>${Object.keys(evidenceCopy).map((key) => `<p>${proofBadge(key)}<small>${escapeHtml(evidenceCopy[key])}</small></p>`).join('')}</div></aside>
        <div class="explore-results"><div class="explore-results-head"><p id="results-count" aria-live="polite"></p></div><div class="explore-card-grid" id="case-grid"></div><div class="explore-more" id="case-more" hidden><button class="explore-button" id="more-cases" type="button"></button></div><div class="explore-empty" id="case-empty" hidden><strong>Aucun cas dans cette sélection.</strong><p>Essayez une recherche plus courte ou retirez un filtre.</p><button class="explore-button" id="empty-reset" type="button">Réinitialiser les filtres</button></div></div>
      </div>
    </section>`;
    populateFilterOptions(root);
    const skyHost = $('#case-sky', root);
    sky = skyHost && window.ACOLYTE_SKY ? window.ACOLYTE_SKY.mount(skyHost, state.cases, caseHref) : null;
  }

  function kindLabel(item) { return item.evidence_level === 'documented' ? 'CAS DOCUMENTÉ' : item.evidence_level === 'experience' ? 'RETOUR D’EXPÉRIENCE' : 'CAS TYPE'; }

  function card(item) {
    const functionLabel = formatList(item.business_function, 'business_function') || 'Fonction non renseignée';
    const industryLabel = titleFor('industry', item.industry);
    return `<article class="explore-card"><a class="explore-card-link" href="${caseHref(item)}"><div class="explore-card-top"><span class="explore-card-number">${escapeHtml(kindLabel(item))}</span><span class="explore-card-badges">${outcomeBadge(item)}${proofBadge(item.evidence_level)}</span></div><h3>${escapeHtml(item.title)}</h3><p class="explore-card-problem">${escapeHtml(item.short_description || item.problem)}</p><div class="explore-card-meta"><span><b>Secteur</b>${escapeHtml(industryLabel)}</span><span><b>Fonction</b>${escapeHtml(functionLabel)}</span><span><b>Solution</b>${escapeHtml(titleFor('solution_type', item.solution_type))}</span><span><b>Autonomie</b>${escapeHtml(titleFor('autonomy_level', item.autonomy_level))}</span></div><span class="explore-card-open">Ouvrir la fiche <b aria-hidden="true">→</b></span></a></article>`;
  }

  function renderResults() {
    const visible = filteredCases();
    const grid = $('#case-grid');
    const empty = $('#case-empty');
    const count = $('#results-count');
    if (!grid || !empty || !count) return;
    count.innerHTML = `<strong>${visible.length}</strong> cas trouvé${visible.length > 1 ? 's' : ''} <span>sur ${state.cases.length}</span>`;
    if (sky) sky.update(visible);
    const shown = visible.slice(0, state.limit);
    grid.innerHTML = shown.map(card).join('');
    const more = $('#case-more');
    if (more) {
      const rest = visible.length - shown.length;
      more.hidden = rest <= 0;
      $('#more-cases').textContent = `Afficher ${Math.min(PAGE, rest)} cas de plus (${rest} restant${rest > 1 ? 's' : ''})`;
    }
    empty.hidden = visible.length > 0;
    $('#case-count').textContent = `${state.cases.length} cas`;
    const byEvidence = (level) => state.cases.filter((c) => (c.evidence_level || c.evidence) === level).length;
    const [documented, pattern, experience] = ['documented', 'pattern', 'experience'].map(byEvidence);
    $('#case-mix').textContent = `${documented} cas documentés par une source publique, ${pattern} cas types et ${experience} retour${experience > 1 ? 's' : ''} d’expérience.`;
    renderActiveFilters();
  }

  function renderItems(values, field = null) { return asArray(values).filter(Boolean).map((value) => `<li>${escapeHtml(field ? titleFor(field, textValue(value)) : textValue(value))}</li>`).join(''); }
  function renderSection(label, content, className = '') { return content ? `<section class="detail-section ${className}"><h2 class="detail-section-title">${escapeHtml(label)}</h2>${content}</section>` : ''; }
  function renderTextList(values, field = null) { const list = asArray(values).filter((item) => textValue(item)); return list.length ? `<ul class="detail-list">${renderItems(list, field)}</ul>` : ''; }
  function resultLabel(result, sourceType) { return result?.observed === false || sourceType === 'projected' ? 'PROJETÉ' : sourceType === 'reported' ? 'RAPPORTÉ' : result?.observed ? 'OBSERVÉ' : 'À QUALIFIER'; }
  function sourceType(item) { return item.sources?.[0]?.evidence_type || 'unknown'; }

  function hasAny(...values) { return values.some((value) => asArray(value).some((item) => textValue(item))); }

  function editorialWhy(item) {
    if (item.id === 'case-real-qonto-human-gate') {
      return 'Qonto illustre une architecture d’agent supervisé appliquée à une zone sensible : les opérations financières. L’agent prépare, rassemble les éléments et propose l’action ; l’utilisateur conserve le dernier mot avant toute exécution. Le cas est intéressant moins pour la sophistication technique que pour l’usage de la validation humaine comme mécanisme de contrôle.';
    }
    const functionLabel = formatList(item.business_function, 'business_function');
    const solutionLabel = titleFor('solution_type', item.solution_type).toLowerCase();
    const problem = item.problem || item.short_description;
    if (item.evidence_level === 'pattern') {
      return `Ce pattern ne décrit pas un déploiement client documenté. Il sert à cadrer un travail${functionLabel && functionLabel !== 'Non renseigné' ? ` côté ${functionLabel.toLowerCase()}` : ''} autour de « ${problem} ». Son intérêt est de rendre visibles les données, les outils et les risques à traiter avant de parler d’autonomie.`;
    }
    if (item.evidence_level === 'concept') {
      return `Ce concept propose une manière de traiter « ${problem} » avec un ${solutionLabel}. Il est utile pour ouvrir une discussion de conception, pas pour faire passer une hypothèse pour un résultat observé.`;
    }
    if (item.evidence_level === 'experience') {
      return `Cette expérience donne un point de vue concret sur « ${problem} » et sur la place d’un ${solutionLabel}. Elle mérite d’être lue comme un retour situé, avec son contexte et ses limites, plutôt que comme une recette universelle.`;
    }
    if (hasAny(item.results)) {
      return `Ce cas documenté permet de regarder concrètement comment un ${solutionLabel} répond à « ${problem} ». Il est surtout utile pour séparer ce que la source rapporte de ce qu’Acolyte peut en déduire.`;
    }
    return `Ce cas documenté montre comment un ${solutionLabel} est mobilisé autour de « ${problem} ». Son intérêt tient à la situation décrite ; les éléments qui ne sont pas publiés restent volontairement hors champ.`;
  }

  function editorialShows(item) {
    if (item.id === 'case-real-qonto-human-gate') {
      return [
        'Un agent utile n’a pas besoin d’être totalement autonome.',
        'Dans un domaine sensible, la valeur peut venir surtout de la préparation et de l’orchestration.',
        'La validation humaine permet d’augmenter l’autonomie sans supprimer le contrôle humain.'
      ];
    }
    const points = [];
    if (item.autonomy_level === 'supervised-agent' || item.human_in_the_loop?.required) points.push('L’autonomie peut être progressive : le système prépare et l’humain garde la décision finale.');
    if (item.solution_type === 'knowledge' || valuesFor(item, 'ai_pattern').includes('retrieval')) points.push('La valeur peut venir de l’accès à une connaissance existante, pas nécessairement de la production de nouveau contenu.');
    if (item.solution_type === 'copilot') points.push('Un copilote déplace le travail vers la préparation, la vérification et l’itération plutôt que vers un simple bouton “générer”.');
    if (item.solution_type === 'workflow' || item.solution_type === 'agent') points.push('Le cas se lit comme une chaîne de travail : la qualité du résultat dépend aussi des étapes, des exceptions et du contrôle.');
    if (hasAny(item.data_required, item.data_sources)) points.push('Les données et les outils sont une partie du cas, pas un détail d’implémentation à découvrir après la promesse.');
    if (hasAny(item.risks, item.limitations)) points.push('Les risques rendent la proposition plus utile : ils indiquent où l’automatisation doit rester sous surveillance.');
    if (item.evidence_level === 'pattern') points.push('Un pattern aide à cadrer une opportunité ; il ne constitue pas, à lui seul, une preuve de déploiement.');
    if (item.evidence_level === 'concept') points.push('Un concept peut aider à explorer une direction, mais il doit rester séparé des cas éprouvés.');
    return points.slice(0, 3);
  }

  function editorialNote(item) {
    if (item.id === 'case-real-qonto-human-gate') return '« Autonome » ne veut pas dire : laissez-le virer l’argent pendant que vous êtes à déjeuner.';
    return '';
  }

  function renderEditorial(item) {
    const points = editorialShows(item);
    return `<section class="detail-editorial-section"><p class="detail-label">ANALYSE ACOLYTE</p><h2>Ce que ce cas montre</h2><ul class="detail-analysis-list">${points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>${editorialNote(item) ? `<aside class="detail-acolyte-note"><strong>Note d’Acolyte</strong><p>${escapeHtml(editorialNote(item))}</p></aside>` : ''}</section>`;
  }

  function renderUndocumented(item) {
    const missing = [];
    if (!hasAny(item.data_required, item.data_sources)) missing.push('Données mobilisées dans le détail');
    if (!hasAny(item.tools, item.models, item.integrations, item.systems_involved)) missing.push('Stack technique et systèmes connectés');
    if (!hasAny(item.delivery_scope, item.complexity, item.technical_feasibility, item.organizational_feasibility, item.data_readiness, item.maturity_required)) missing.push('Prérequis de déploiement');
    if (!hasAny(item.results, item.expected_value, item.business_impact)) missing.push('Mesures de résultat ou d’impact');
    if (!hasAny(item.sources)) missing.push('Source primaire publiée');
    return missing.length ? `<section class="detail-undocumented"><p class="detail-label">INFORMATIONS NON DOCUMENTÉES</p><p>La fiche ne permet pas d’aller plus loin sur :</p><ul class="detail-list">${missing.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul></section>` : '';
  }

  function detailFacts(item) {
    const linked = { Solution: ['solution_type', item.solution_type], Autonomie: ['autonomy_level', item.autonomy_level] };
    return [['Taille', formatList(item.company_size, 'company_size')], ['Secteur', titleFor('industry', item.industry)], ['Fonction', formatList(item.business_function, 'business_function')], ['Solution', titleFor('solution_type', item.solution_type)], ['Autonomie', titleFor('autonomy_level', item.autonomy_level)], ['Preuve', titleFor('evidence_level', item.evidence_level)]].map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${linked[label] && value ? termLink(linked[label][0], linked[label][1], value) : escapeHtml(value || 'Non renseigné')}</strong></div>`).join('');
  }

  function relatedCases(item) {
    const score = (candidate) => {
      if (candidate.id === item.id) return -1;
      let value = 0;
      if (item.industry !== 'unknown' && candidate.industry === item.industry) value += 4;
      if (valuesFor(item, 'business_function').some((x) => valuesFor(candidate, 'business_function').includes(x) && x !== 'unknown')) value += 3;
      if (candidate.solution_type === item.solution_type) value += 2;
      value += valuesFor(item, 'ai_pattern').filter((x) => x !== 'unknown' && valuesFor(candidate, 'ai_pattern').includes(x)).length;
      return value;
    };
    return state.cases.map((candidate) => ({ candidate, score: score(candidate) })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title, 'fr')).slice(0, 3).map(({ candidate }) => `<a href="${caseHref(candidate)}"><span>${escapeHtml(titleFor('solution_type', candidate.solution_type))}</span><strong>${escapeHtml(candidate.title)}</strong><small>${escapeHtml(titleFor('evidence_level', candidate.evidence_level))} · ${escapeHtml(titleFor('industry', candidate.industry))}</small></a>`).join('');
  }

  /* Lecture indicative du niveau de risque au sens de l'AI Act (page /acolyte/cadre/). Règles prudentes,
     fondées sur le secteur, la fonction, les patterns et le texte de la fiche : une aide pour se poser
     les bonnes questions, pas une qualification juridique. */
  function riskReading(item) {
    const text = [item.title, item.short_description, item.problem].join(' ').toLocaleLowerCase('fr');
    const patterns = valuesFor(item, 'ai_pattern');
    const functions = valuesFor(item, 'business_function');
    const decides = ['scoring', 'classification', 'prediction', 'recommendation', 'comparison'].some((key) => patterns.includes(key));
    const high = (domain) => ({ level: 'high', label: 'Haut risque possible', domain, text: `Le cas touche à un domaine listé à l’annexe III du règlement (${domain}). Si l’IA y évalue des personnes ou pèse sur une décision les concernant, les obligations « haut risque » s’appliqueront à partir du 2 décembre 2027.` });
    const recruiting = /recrut|embauche|\bcv\b/.test(text) || (functions.includes('hr') && /candidat/.test(text));
    if (recruiting && (decides || /tri(?:er)? |sélection|filtr|évalu/.test(text))) return high('emploi et gestion des salariés');
    if (decides && item.industry === 'finance' && /\bcrédit|\bprêt|solvabilit/.test(text) && !/fraude|carte de crédit/.test(text)) return high('accès au crédit');
    if (decides && item.industry === 'insurance' && /santé|\bvie\b|décès|prévoyance/.test(text) && /tarif|souscription|\bprime/.test(text)) return high('assurance vie ou santé');
    if (decides && item.industry === 'public-sector' && /aide|prestation|allocation|éligib/.test(text)) return high('accès aux services publics');
    if (decides && /élève|étudiant|admission|examen/.test(text)) return high('éducation');
    if (item.industry === 'healthcare' && /conseil médical|médical conversationnel|diagnostic|triage/.test(text)) return { level: 'high', label: 'Haut risque possible', domain: 'dispositif médical', text: 'Un logiciel qui délivre un conseil médical peut être qualifié de dispositif médical ; l’IA qu’il intègre relèverait alors des obligations « haut risque » de l’annexe I, applicables à partir du 2 août 2028, en plus de l’obligation de transparence envers les patients.' };
    const talks = !/fraude/.test(text) && (/chatbot|callbot|assistant (?:virtuel|conversationnel|vocal)|agent vocal|conseil vocal|conversationnel|par conversation|en conversation|répond(?:re)? aux? (?:clients|usagers|voyageurs|citoyens)|accueil téléphonique|concierge/.test(text) || (functions.includes('customer-service') && item.solution_type === 'agent' && /support|client|usager|voyageur/.test(text)));
    if (talks) return { level: 'limited', label: 'Transparence', text: 'L’IA échange directement avec des personnes : il faut leur dire qu’elles s’adressent à une IA (article 50, applicable depuis le 2 août 2026). Si elle publie des contenus générés, ils doivent être signalés.' };
    if (patterns.includes('generation') && functions.includes('marketing')) return { level: 'limited', label: 'Transparence', text: 'Des contenus générés par l’IA peuvent être diffusés au public : ils doivent être signalés comme tels (article 50, applicable depuis le 2 août 2026).' };
    return { level: 'minimal', label: 'Risque minimal', text: 'Usage sans obligation spécifique au titre de l’AI Act, en dehors de la maîtrise de l’IA par les équipes. Le RGPD s’applique dès que des données personnelles sont traitées.' };
  }

  function renderRisk(item) {
    const risk = riskReading(item);
    return `<section class="detail-section detail-risk"><h2 class="detail-section-title">Cadre réglementaire · lecture indicative</h2><p class="risk-badge risk-${risk.level}">${escapeHtml(risk.label)}</p><p class="detail-prose">${escapeHtml(risk.text)}</p><p class="detail-quiet">Une lecture d’Acolyte à partir de la fiche, pas un avis juridique : le niveau dépend de votre usage réel. <a href="${base}cadre/#niveaux">Comprendre les niveaux de risque →</a></p></section>`;
  }

  function provenanceLabel(type) {
    return { 'public-source': 'Source publique', 'internal-note': 'Cas type HOCUS' }[type] || type || 'Non renseignée';
  }

  /* Ce que HOCUS ferait ici : la passerelle vers l'offre la plus proche (règles ordonnées), toujours
     précédée du Diagnostic Data & IA, point de départ de toute mission. */
  function hocusFor(item) {
    const patterns = valuesFor(item, 'ai_pattern');
    const functions = valuesFor(item, 'business_function');
    const text = [item.title, item.short_description, item.problem].join(' ').toLocaleLowerCase('fr');
    const has = (...keys) => keys.some((key) => patterns.includes(key));
    const says = (re) => re.test(text);
    if (says(/catalogue (?:produit|de produits)|assortiment|référentiel produit|fiches? produits?|gamme de produits|merchandising|découverte produit/) || (functions.includes('product') && has('classification', 'comparison') && says(/produit/))) return { name: 'Stolas', tier: 'Atelier', href: '/atelier/stolas/', why: 'Stolas lit la forme d’un catalogue : familles, recouvrements, compléments et substituts, espaces blancs.' };
    if (says(/veille|concurren|marché|tendance|social commerce|réseaux sociaux/) && has('monitoring', 'comparison', 'summarization')) return { name: 'Scrolls', tier: 'Atelier', href: '/atelier/scrolls/', why: 'Scrolls transforme une veille de marché en intelligence suivie : acteurs, catégories, signaux et leviers.' };
    if (has('prediction', 'scoring')) return { name: 'Works · Scoring & prédiction', tier: 'Works', href: '/works/', why: 'Des scores recalculés et expliqués (attrition, valeur, appétence, demande) branchés là où l’action se passe.' };
    if (has('recommendation') && (functions.some((f) => ['sales', 'marketing', 'customer-service'].includes(f)) || says(/produit|offre|achat|panier|recommand/))) return { name: 'Works · Recommandation & affinités', tier: 'Works', href: '/works/', why: 'Le prochain meilleur produit, les compléments et les substituts, même sans historique d’achat.' };
    if (has('generation') && (functions.includes('marketing') || says(/campagne|contenu|fiches? produits?|description produit|article|newsletter|publication/))) return { name: 'Lore', tier: 'Atelier', href: '/atelier/lore/', why: 'Lore produit des contenus contextuels à grande échelle, à partir de faits vérifiés et tenus à jour.' };
    if (item.solution_type === 'agent' || (item.solution_type === 'workflow' && has('orchestration'))) return { name: 'Strings', tier: 'Atelier', href: '/atelier/strings/', why: 'Strings conçoit des agents et des chaînes automatisées, avec leurs permissions et leurs points de validation.' };
    if (has('retrieval', 'summarization', 'extraction') || item.solution_type === 'knowledge') return { name: 'Works · IA générative & contenus', tier: 'Works', href: '/works/', why: 'Une connaissance rendue retrouvable et des synthèses fondées sur des sources vérifiées.' };
    return { name: 'Works', tier: 'Works', href: '/works/', why: 'Un problème spécifique devient un système construit sur mesure, du diagnostic au pilotage.' };
  }

  function renderHocus(item) {
    const offer = hocusFor(item);
    return `<section class="detail-hocus" aria-labelledby="detail-hocus-title"><div class="detail-hocus-head"><p class="detail-label">ET CHEZ VOUS ?</p><h2 id="detail-hocus-title">Ce que HOCUS ferait ici</h2><p>Un cas publié ne se recopie pas : il se transpose à vos données, vos équipes et vos contraintes.</p></div><div class="detail-hocus-grid"><a class="detail-hocus-card is-entry" href="/works/diagnostic/"><span>1 · POINT DE DÉPART</span><strong>Diagnostic Data &amp; IA</strong><p>Vérifier que ce cas a du sens chez vous, avec quelles données, et ce qu’il rapporterait.</p><b>Découvrir ↗</b></a><a class="detail-hocus-card" href="${offer.href}"><span>2 · ${escapeHtml(offer.tier.toLocaleUpperCase('fr'))}</span><strong>${escapeHtml(offer.name)}</strong><p>${escapeHtml(offer.why)}</p><b>Voir ↗</b></a><a class="detail-hocus-card" href="mailto:hello@hocus.works?subject=${encodeURIComponent(`Acolyte — ${item.title}`)}"><span>3 · EN PARLER</span><strong>Écrire à HOCUS</strong><p>Une question sur ce cas ou sur votre situation.</p><b>hello@hocus.works ↗</b></a></div></section>`;
  }

  function learnLink(item) {
    if (item.solution_type === 'agent') return `<a class="detail-bridge" href="${base}?journey=operating-system&amp;slide=8"><span>PARCOURS · AGENTS</span><strong>Comprendre le fonctionnement d’un agent <b aria-hidden="true">→</b></strong></a>`;
    if (item.solution_type === 'knowledge' || valuesFor(item, 'ai_pattern').includes('retrieval')) return `<a class="detail-bridge" href="${base}?module=memory-map&amp;journey=pme&amp;slide=3"><span>ATELIER · MÉMOIRE</span><strong>Voir une mémoire rendue retrouvable <b aria-hidden="true">→</b></strong></a>`;
    return `<a class="detail-bridge" href="${base}?journey=pme&amp;slide=1"><span>PARCOURS · PME</span><strong>Partir d’un travail réel, pas d’un catalogue <b aria-hidden="true">→</b></strong></a>`;
  }

  function renderDetail(item) {
    const source = item.sources?.[0];
    const resultList = item.results?.length ? `<div><p class="detail-sub-label">Résultats rapportés par la source</p><ul class="detail-results">${item.results.map((result) => `<li><span>${escapeHtml(resultLabel(result, sourceType(item)))}</span>${escapeHtml(textValue(result))}</li>`).join('')}</ul></div>` : '';
    const expectedValue = item.expected_value?.length ? `<ul class="detail-list">${item.expected_value.map((value) => `<li>${value.type && value.type !== 'unknown' ? `<b>${escapeHtml(titleFor('value_type', value.type))}</b>` : ''}${escapeHtml(value.description || '')}</li>`).join('')}</ul>` : '';
    const sourceMarkup = source ? `<div class="detail-source"><p class="detail-sub-label">Preuve et source</p><strong>${escapeHtml(source.publisher || source.title || 'Source')}</strong>${source.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Ouvrir la source ↗</a>` : ''}<small>${escapeHtml(sourceType(item) === 'projected' ? 'Résultat projeté dans la source.' : sourceType(item) === 'reported' ? 'Résultat rapporté par la source.' : 'Type de résultat non renseigné.')}</small></div>` : '';
    const architecture = renderTextList(item.architecture_pattern);
    const dataMarkup = hasAny(item.data_required, item.data_sources) ? renderTextList(item.data_required) || renderTextList(item.data_sources) : '';
    const toolsMarkup = hasAny(item.tools, item.models, item.integrations, item.systems_involved) ? renderTextList([...(item.tools || []), ...(item.models || []), ...(item.integrations || []), ...(item.systems_involved || [])]) : '';
    const namedTools = valuesFor(item, 'tool_ids').map((id) => state.toolsById[id]).filter(Boolean);
    const namedToolsMarkup = namedTools.length ? `<div class="detail-pills detail-tool-links">${namedTools.map((tool) => `<a href="${toolHref(tool)}">${escapeHtml(tool.name)} <b aria-hidden="true">→</b></a>`).join('')}</div>` : '';
    const mechanismSupport = [dataMarkup ? `<div><p class="detail-sub-label">Données et entrées</p>${dataMarkup}</div>` : '', namedToolsMarkup ? `<div><p class="detail-sub-label">Outils nommés · voir la carte des outils</p>${namedToolsMarkup}</div>` : '', toolsMarkup ? `<div><p class="detail-sub-label">Outils et systèmes cités par la source</p>${toolsMarkup}</div>` : ''].join('');
    const mechanism = `<div class="detail-pills">${valuesFor(item, 'ai_pattern').map((value) => { const term = termFor('ai_pattern', value); return term ? `<a class="glossary-pill" href="${termHref(term)}">${escapeHtml(titleFor('ai_pattern', value))}</a>` : `<span>${escapeHtml(titleFor('ai_pattern', value))}</span>`; }).join('')}</div>${item.workflow?.length ? renderTextList(item.workflow) : architecture ? `<p class="detail-sub-label">Chaîne décrite dans la source</p>${architecture}` : '<p class="detail-quiet">Le schéma indique le pattern mobilisé, sans déroulé opérationnel plus détaillé.</p>'}${mechanismSupport}`;
    const impactMarkup = [resultList, expectedValue ? `<div><p class="detail-sub-label">Valeur attendue dans la fiche</p>${expectedValue}</div>` : '', item.business_impact?.length ? `<div><p class="detail-sub-label">Type d’impact envisagé</p>${renderTextList(item.business_impact)}</div>` : ''].join('');
    const prerequisites = renderTextList([item.delivery_scope, item.complexity && `Complexité : ${item.complexity}`, item.technical_feasibility && `Faisabilité technique : ${item.technical_feasibility}`, item.organizational_feasibility && `Faisabilité organisationnelle : ${item.organizational_feasibility}`, item.data_readiness && `Maturité data : ${item.data_readiness}`, item.maturity_required && `Maturité requise : ${item.maturity_required}`]);
    const limitations = renderTextList([...(item.risks || []), ...(item.limitations || []), ...(item.failure_modes || []), ...(item.governance_requirements || []), ...(item.security_constraints || []), ...(item.legal_constraints || [])]);
    const related = relatedCases(item);
    const provenance = `<div class="detail-evidence-grid"><section class="detail-aside-card"><p class="detail-label">PROVENANCE</p><p>${escapeHtml(provenanceLabel(item.provenance?.source_type))}</p>${item.provenance?.source_type === 'internal-note' ? '<small>Cas type construit par HOCUS à partir des parcours Acolyte.</small>' : `<small>${escapeHtml(item.provenance?.source_ref || '')}</small>`}</section><section class="detail-aside-card"><p class="detail-label">CONFIANCE</p><strong class="detail-confidence">${escapeHtml(titleFor('confidence', item.confidence))}</strong><p>Le niveau de preuve et la confiance ne remplacent pas une revue du contexte.</p></section></div>`;
    root.innerHTML = `<div class="explore-detail-page"><a class="detail-back" href="${exploreHref}">← Retour au catalogue</a><header class="explore-detail-hero"><div><p class="explore-kicker">FICHE · ${escapeHtml(kindLabel(item))}</p><h1>${escapeHtml(item.title)}</h1><p class="explore-detail-lead">${escapeHtml(item.short_description || item.problem)}</p></div><div class="detail-proof-panel">${proofBadge(item.evidence_level)}${outcomeBadge(item)}<p>${escapeHtml(evidenceCopy[item.evidence_level] || 'Niveau de preuve non renseigné.')}</p><small>La preuve décrit le statut du cas, pas une garantie de résultat.</small></div></header><div class="detail-facts">${detailFacts(item)}</div><section class="detail-editorial-intro"><div><p class="detail-label">ANALYSE ACOLYTE</p><h2>Pourquoi ce cas mérite d’être regardé</h2></div><p class="detail-editorial-copy">${escapeHtml(editorialWhy(item))}</p></section><div class="detail-layout"><div class="detail-main">${renderSection('Le problème traité', `<p class="detail-prose">${escapeHtml(item.problem || item.short_description || '')}</p>`)}${renderSection('Le mécanisme / workflow', mechanism)}${renderSection('Impact observé ou attendu', impactMarkup)}${prerequisites ? renderSection('Prérequis', prerequisites) : ''}${renderEditorial(item)}${renderSection('Limites et risques', limitations)}${renderRisk(item)}${renderSection('Résultats et sources', sourceMarkup)}${item.lessons_learned?.length ? renderSection('À retenir de la source', renderTextList(item.lessons_learned)) : ''}${provenance}${renderUndocumented(item)}</div></div>${renderHocus(item)}${related ? `<section class="detail-related"><div><p class="detail-label">CAS PROCHES</p><h2>Continuer par une autre entrée.</h2></div><div class="detail-related-grid">${related}</div></section>` : ''}<section class="detail-learn-row">${learnLink(item)}</section></div>`;
  }

  const toolCases = (tool) => state.cases.filter((item) => valuesFor(item, 'tool_ids').includes(tool.id));
  const evidenceRank = { documented: 0, experience: 1, concept: 2, pattern: 3 };
  const byEvidenceThenTitle = (a, b) => (evidenceRank[a.evidence_level] ?? 9) - (evidenceRank[b.evidence_level] ?? 9) || a.title.localeCompare(b.title, 'fr');
  const formatDate = (value) => { const date = new Date(`${value}T12:00:00Z`); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); };
  const casesLabel = (count) => `${count} cas`;
  const clipText = (text, max) => { const t = String(text || ''); return t.length <= max ? t : `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`; };

  function vendorMix() {
    const mentions = { us: 0, europe: 0, other: 0 };
    const europe = new Set(['FR', 'DE', 'GB', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'DK', 'FI', 'NO', 'IE', 'AT', 'PT', 'PL', 'LU']);
    state.cases.forEach((item) => valuesFor(item, 'tool_ids').forEach((id) => {
      const country = state.toolsById[id]?.vendor_country;
      if (!country) return;
      mentions[country === 'US' ? 'us' : europe.has(country) ? 'europe' : 'other'] += 1;
    }));
    const total = mentions.us + mentions.europe + mentions.other || 1;
    return { us: Math.round((100 * mentions.us) / total), europe: Math.round((100 * mentions.europe) / total) };
  }

  /* Terme du glossaire qui explique une valeur de taxonomie (le plus spécifique d'abord). */
  function termFor(field, value) {
    const candidates = state.glossary.terms.filter((term) => asArray(term.maps?.[field]).includes(value));
    const best = candidates.sort((a, b) => asArray(a.maps[field]).length - asArray(b.maps[field]).length)[0];
    /* Toute valeur d'autonomie renvoie au terme qui présente l'échelle complète. */
    return best || (field === 'autonomy_level' ? state.glossary.terms.find((term) => term.slug === 'autonomie') : null) || null;
  }
  const termLink = (field, value, label) => { const term = termFor(field, value); return term ? `<a class="glossary-link" href="${termHref(term)}">${escapeHtml(label)}</a>` : escapeHtml(label); };

  function termCases(term) {
    const maps = term.maps || {};
    const families = new Set(asArray(maps.tool_family));
    const licenses = new Set(asArray(maps.license));
    return state.cases.filter((item) => {
      const tools = valuesFor(item, 'tool_ids').map((id) => state.toolsById[id]).filter(Boolean);
      return asArray(maps.case_ids).includes(item.id)
        || valuesFor(item, 'ai_pattern').some((value) => asArray(maps.ai_pattern).includes(value))
        || asArray(maps.solution_type).includes(item.solution_type)
        || asArray(maps.autonomy_level).includes(item.autonomy_level)
        || (maps.human_gate && item.human_in_the_loop?.required)
        || tools.some((tool) => asArray(maps.tool_ids).includes(tool.id) || families.has(tool.family) || licenses.has(tool.license));
    });
  }
  const termTools = (term) => state.tools.filter((tool) => asArray(term.maps?.tool_ids).includes(tool.id) || asArray(term.maps?.tool_family).includes(tool.family) || asArray(term.maps?.license).includes(tool.license));

  function renderGlossaryIndex() {
    const groups = Object.entries(state.glossary.groups || {});
    const terms = state.glossary.terms;
    root.innerHTML = `<section class="explore-hero">
      <div class="explore-hero-copy">
        <p class="explore-kicker">GLOSSAIRE · ${terms.length} TERMES</p>
        <h1>Les mots de l’IA, expliqués par les cas.</h1>
        <p class="explore-lead">LLM, RAG, agent, validation humaine, niveau d’autonomie : les termes employés dans les parcours, le catalogue et la carte des outils. Chacun renvoie aux cas et aux outils qui le rendent concret.</p>
        <div class="explore-hero-links"><a class="explore-button explore-button-primary" href="${base}?journey=operating-system&amp;slide=1">Commencer par un parcours <span aria-hidden="true">→</span></a><a class="explore-text-link" href="${exploreHref}">Le catalogue des cas →</a><a class="explore-text-link" href="${toolsHref}">La carte des outils →</a></div>
      </div>
      <aside class="explore-hero-note"><span>LE PRINCIPE</span><strong>Court et concret</strong><p>Une définition sans jargon, ce que cela change en pratique, les confusions fréquentes, et les cas du catalogue qui l’illustrent.</p></aside>
    </section>
    ${groups.map(([group, label]) => { const list = terms.filter((term) => term.group === group).sort((a, b) => a.term.localeCompare(b.term, 'fr')); return list.length ? `<section class="explore-catalog glossary-group" id="${escapeHtml(group)}" aria-labelledby="${escapeHtml(group)}-title"><div class="explore-catalog-head"><div><p class="explore-kicker">${list.length} TERMES</p><h2 id="${escapeHtml(group)}-title">${escapeHtml(label)}</h2></div></div><div class="glossary-grid">${list.map((term) => `<a class="glossary-card" href="${termHref(term)}"><strong>${escapeHtml(term.term)}</strong><p>${escapeHtml(term.short)}</p><span>${termCases(term).length ? `${escapeHtml(casesLabel(termCases(term).length))} liés` : 'Notion transverse'} <b aria-hidden="true">→</b></span></a>`).join('')}</div></section>` : ''; }).join('')}`;
  }

  function renderTerm(term) {
    const bySlug = Object.fromEntries(state.glossary.terms.map((item) => [item.slug, item]));
    const cases = termCases(term).sort(byEvidenceThenTitle);
    const tools = termTools(term).sort((a, b) => toolCases(b).length - toolCases(a).length || a.name.localeCompare(b.name, 'fr'));
    const related = asArray(term.related).map((slug) => bySlug[slug]).filter(Boolean);
    const filterKey = ['solution_type', 'autonomy_level'].find((key) => asArray(term.maps?.[key]).length === 1);
    const exploreLink = filterKey ? `${exploreHref}?${filterKey}=${encodeURIComponent(term.maps[filterKey][0])}` : exploreHref;
    const groupLabel = state.glossary.groups?.[term.group] || '';
    root.innerHTML = `<div class="explore-detail-page glossary-term-page"><a class="detail-back" href="${glossaryHref}">← Le glossaire</a><header class="explore-detail-hero"><div><p class="explore-kicker">GLOSSAIRE · ${escapeHtml(groupLabel.toLocaleUpperCase('fr'))}</p><h1>${escapeHtml(term.term)}</h1><p class="explore-detail-lead">${escapeHtml(term.short)}</p></div><div class="detail-proof-panel">${cases.length ? `<strong class="tool-count-large">${escapeHtml(casesLabel(cases.length))}</strong><p>du catalogue illustrent ce terme${tools.length ? `, avec ${tools.length} outil${tools.length > 1 ? 's' : ''} de la carte` : ''}.</p>` : `<strong class="tool-count-large">Transverse</strong><p>Une notion qui concerne tous les cas plutôt que quelques-uns. <a href="${exploreHref}">Parcourir le catalogue →</a></p>`}${term.aliases?.length ? `<small>Aussi : ${escapeHtml(term.aliases.join(' · '))}</small>` : ''}</div></header><div class="detail-layout"><div class="detail-main">${renderSection('Définition', term.definition.map((paragraph) => `<p class="detail-prose">${escapeHtml(paragraph)}</p>`).join(''))}${term.in_practice?.length ? renderSection('En pratique', renderTextList(term.in_practice)) : ''}${term.links?.length ? renderSection('Pour aller plus loin', `<div class="detail-pills">${term.links.map((link) => `<a class="glossary-pill" href="${base}${link.path}">${escapeHtml(link.label)} →</a>`).join('')}</div>`) : ''}${term.confusions?.length ? renderSection('À ne pas confondre', `<ul class="detail-list">${term.confusions.map((item) => `<li><b>${escapeHtml(item.term)}</b> : ${escapeHtml(item.difference)}</li>`).join('')}</ul>`) : ''}${tools.length ? renderSection('Outils liés', `<div class="detail-pills detail-tool-links">${tools.slice(0, 10).map((tool) => `<a href="${toolHref(tool)}">${escapeHtml(tool.name)} <b aria-hidden="true">→</b></a>`).join('')}</div>`) : ''}</div></div>${cases.length ? `<section class="explore-catalog tool-cases" aria-labelledby="term-cases-title"><div class="explore-catalog-head"><div><p class="explore-kicker">DANS LE CATALOGUE</p><h2 id="term-cases-title">Des cas pour le voir à l’œuvre</h2></div><p class="explore-catalog-intro">${cases.length > 6 ? `Six cas sur ${cases.length}, les documentés d’abord. <a href="${exploreLink}">Voir le catalogue →</a>` : 'Les cas documentés d’abord.'}</p></div><div class="explore-card-grid">${cases.slice(0, 6).map(card).join('')}</div></section>` : ''}${related.length ? `<section class="detail-related"><div><p class="detail-label">TERMES LIÉS</p><h2>Continuer la lecture.</h2></div><div class="detail-related-grid">${related.map((item) => `<a href="${termHref(item)}"><span>${escapeHtml(state.glossary.groups?.[item.group] || '')}</span><strong>${escapeHtml(item.term)}</strong><small>${escapeHtml(clipText(item.short, 90))}</small></a>`).join('')}</div></section>` : ''}<section class="detail-hocus" aria-labelledby="term-hocus-title"><div class="detail-hocus-head"><p class="detail-label">ET CHEZ VOUS ?</p><h2 id="term-hocus-title">Passer du mot au cas d’usage</h2><p>Comprendre le vocabulaire est un début. HOCUS part de vos données et de vos équipes pour identifier ce qui a du sens chez vous.</p></div><div class="detail-hocus-grid"><a class="detail-hocus-card is-entry" href="/works/diagnostic/"><span>1 · POINT DE DÉPART</span><strong>Diagnostic Data &amp; IA</strong><p>Les cas qui ont du sens chez vous, avec quelles données, et ce qu’ils rapporteraient.</p><b>Découvrir ↗</b></a><a class="detail-hocus-card" href="mailto:hello@hocus.works?subject=${encodeURIComponent(`Acolyte — ${term.term}`)}"><span>2 · EN PARLER</span><strong>Écrire à HOCUS</strong><p>Une question sur ce terme ou sur votre situation.</p><b>hello@hocus.works ↗</b></a></div></section></div>`;
  }

  function toolCard(tool) {
    const count = toolCases(tool).length;
    return `<article class="explore-card tool-card"><a class="explore-card-link" href="${toolHref(tool)}"><div class="explore-card-top"><span class="explore-card-number">${escapeHtml(tool.vendor.toLocaleUpperCase('fr'))}</span><span class="tool-count">${escapeHtml(casesLabel(count))}</span></div><h3>${escapeHtml(tool.name)}</h3><p class="explore-card-problem">${escapeHtml(tool.description)}</p><div class="explore-card-meta"><span><b>Hébergement</b>${escapeHtml(formatList(tool.hosting, 'hosting'))}</span><span><b>Origine</b>${escapeHtml(titleFor('country', tool.vendor_country))}</span><span><b>Licence</b>${escapeHtml(titleFor('license', tool.license))}</span><span><b>Niveau</b>${escapeHtml(titleFor('skill_level', tool.skill_level))}</span></div><span class="explore-card-open">Voir l’outil <b aria-hidden="true">→</b></span></a></article>`;
  }

  function renderToolsIndex() {
    const mix = vendorMix();
    const families = familyOrder.map((family) => ({ family, tools: state.tools.filter((tool) => tool.family === family).sort((a, b) => toolCases(b).length - toolCases(a).length || a.name.localeCompare(b.name, 'fr')) })).filter(({ tools }) => tools.length);
    root.innerHTML = `<section class="explore-hero">
      <div class="explore-hero-copy">
        <p class="explore-kicker">CARTE DES OUTILS · ${state.tools.length} OUTILS NOMMÉS</p>
        <h1>Les outils de l’IA, vus depuis les cas.</h1>
        <p class="explore-lead">Les outils cités dans les fiches du catalogue, rangés par rôle dans un système. Pour chacun : à quoi il sert, quand l’éviter, et les cas qui l’utilisent vraiment.</p>
        <div class="explore-hero-links"><a class="explore-button explore-button-primary" href="${exploreHref}">Partir des cas <span aria-hidden="true">→</span></a><a class="explore-text-link" href="${glossaryHref}">Le glossaire →</a><a class="explore-text-link" href="/works/diagnostic/">Le Diagnostic Data &amp; IA ↗</a></div>
      </div>
      <aside class="explore-hero-note"><span>À LIRE AVANT</span><strong>${mix.us} % américains</strong><p>${mix.us} % des mentions d’outils dans les fiches renvoient à des éditeurs américains, ${mix.europe} % à des éditeurs européens. La carte reflète les cas publiés, pas le marché. Acolyte ne classe pas les outils et n’est affilié à aucun éditeur.</p></aside>
    </section>
    ${families.map(({ family, tools }) => `<section class="explore-catalog tool-family" id="famille-${escapeHtml(family)}" aria-labelledby="famille-${escapeHtml(family)}-title"><div class="explore-catalog-head"><div><p class="explore-kicker">${escapeHtml(String(tools.length))} OUTIL${tools.length > 1 ? 'S' : ''}</p><h2 id="famille-${escapeHtml(family)}-title">${escapeHtml(titleFor('tool_family', family))}</h2></div><p class="explore-catalog-intro">${escapeHtml(familyCopy[family] || '')}</p></div><div class="explore-card-grid">${tools.map(toolCard).join('')}</div></section>`).join('')}
    <section class="detail-undocumented tool-method"><p class="detail-label">MÉTHODE</p><p>Un outil figure ici s’il est nommé dans au moins une fiche du catalogue. Les libellés génériques (« modèle IA », « recherche sémantique ») et les systèmes construits en interne par l’entreprise d’un cas ne sont pas des outils. Chaque fiche porte sa source officielle et sa date de vérification ; les offres et les prix évoluent vite.</p></section>`;
  }

  function renderTool(tool) {
    const cases = toolCases(tool).sort(byEvidenceThenTitle);
    const siblings = state.tools.filter((other) => other.family === tool.family && other.id !== tool.id).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    const facts = [['Éditeur', tool.vendor], ['Origine', titleFor('country', tool.vendor_country)], ['Licence', titleFor('license', tool.license)], ['Hébergement', formatList(tool.hosting, 'hosting')], ['Niveau technique', titleFor('skill_level', tool.skill_level)], ['Modèle de prix', titleFor('pricing_model', tool.pricing_model)]]
      .map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || 'Non renseigné')}</strong></div>`).join('');
    const source = tool.sources?.[0];
    const documented = cases.filter((item) => item.evidence_level === 'documented' || item.evidence_level === 'experience').length;
    root.innerHTML = `<div class="explore-detail-page tool-detail-page"><a class="detail-back" href="${toolsHref}">← La carte des outils</a><header class="explore-detail-hero"><div><p class="explore-kicker">OUTIL · ${escapeHtml(titleFor('tool_family', tool.family).toLocaleUpperCase('fr'))}</p><h1>${escapeHtml(tool.name)}</h1><p class="explore-detail-lead">${escapeHtml(tool.description)}</p></div><div class="detail-proof-panel"><strong class="tool-count-large">${escapeHtml(casesLabel(cases.length))}</strong><p>${documented} documenté${documented > 1 ? 's' : ''} par une source publique ou un retour d’expérience.</p><small>Vérifié le ${escapeHtml(formatDate(tool.verified_at))}.</small></div></header><div class="detail-facts">${facts}</div><div class="detail-layout"><div class="detail-main">${tool.use_when?.length ? renderSection('Quand l’utiliser', renderTextList(tool.use_when)) : ''}${tool.avoid_when?.length ? renderSection('Quand l’éviter', renderTextList(tool.avoid_when)) : ''}${tool.data_residency ? renderSection('Données et hébergement', `<p class="detail-prose">${escapeHtml(tool.data_residency)}</p>`) : ''}${source ? renderSection('Source', `<div class="detail-source"><p class="detail-sub-label">Page officielle</p><strong>${escapeHtml(source.title)}</strong><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Ouvrir la source ↗</a><small>Informations vérifiées le ${escapeHtml(formatDate(tool.verified_at))} ; les offres et les prix évoluent vite.</small></div>`) : ''}<section class="detail-undocumented"><p class="detail-label">LECTURE</p><p>Acolyte ne classe pas les outils et n’est affilié à aucun éditeur. Le bon outil dépend du problème, des données et des contraintes : il se choisit après le cas d’usage, pas avant.</p></section></div></div>${cases.length ? `<section class="explore-catalog tool-cases" aria-labelledby="tool-cases-title"><div class="explore-catalog-head"><div><p class="explore-kicker">DANS LE CATALOGUE</p><h2 id="tool-cases-title">Les cas qui l’utilisent</h2></div><p class="explore-catalog-intro">Les cas documentés d’abord. Chaque fiche dit ce qui est prouvé et ce qui ne l’est pas.</p></div><div class="explore-card-grid">${cases.map(card).join('')}</div></section>` : ''}<section class="detail-hocus" aria-labelledby="tool-hocus-title"><div class="detail-hocus-head"><p class="detail-label">ET CHEZ VOUS ?</p><h2 id="tool-hocus-title">Choisir l’outil après le problème</h2><p>Un outil ne fait pas un cas d’usage. HOCUS part de vos données, de vos équipes et de vos contraintes, puis choisit les briques.</p></div><div class="detail-hocus-grid"><a class="detail-hocus-card is-entry" href="/works/diagnostic/"><span>1 · POINT DE DÉPART</span><strong>Diagnostic Data &amp; IA</strong><p>Identifier les cas qui ont du sens chez vous, avec quelles données, et ce qu’ils rapporteraient.</p><b>Découvrir ↗</b></a><a class="detail-hocus-card" href="mailto:hello@hocus.works?subject=${encodeURIComponent(`Acolyte — ${tool.name}`)}"><span>2 · EN PARLER</span><strong>Écrire à HOCUS</strong><p>Une question sur cet outil ou sur votre situation.</p><b>hello@hocus.works ↗</b></a></div></section>${siblings.length ? `<section class="detail-related"><div><p class="detail-label">MÊME FAMILLE</p><h2>${escapeHtml(titleFor('tool_family', tool.family))}</h2></div><div class="detail-related-grid">${siblings.slice(0, 6).map((other) => `<a href="${toolHref(other)}"><span>${escapeHtml(other.vendor)}</span><strong>${escapeHtml(other.name)}</strong><small>${escapeHtml(casesLabel(toolCases(other).length))} · ${escapeHtml(titleFor('license', other.license))}</small></a>`).join('')}</div></section>` : ''}</div>`;
  }

  function render() {
    readRoute();
    if (root.dataset.tool) { const own = state.toolsById[root.dataset.tool]; if (own) renderTool(own); return; }
    if (root.dataset.view === 'tools') { renderToolsIndex(); return; }
    if (root.dataset.term) { const own = state.glossary.terms.find((term) => term.slug === root.dataset.term); if (own) renderTerm(own); return; }
    if (root.dataset.view === 'glossary') { renderGlossaryIndex(); return; }
    if (root.dataset.case) { const own = state.cases.find((candidate) => candidate.id === root.dataset.case); if (own) renderDetail(own); return; }
    if (state.detail) { const legacy = state.cases.find((candidate) => candidate.id === state.detail); if (legacy) { window.location.replace(caseHref(legacy)); return; } }
    const item = state.detail ? state.cases.find((candidate) => candidate.id === state.detail) : null;
    if (state.detail && item) { renderDetail(item); return; }
    if (state.detail && !item) { state.detail = null; window.history.replaceState({}, '', routeUrl({ detail: null })); }
    renderCatalogShell();
    renderResults();
    bindCatalogEvents();
  }

  function bindCatalogEvents() {
    $('#case-search')?.addEventListener('input', (event) => {
      state.query = event.target.value;
      state.detail = null;
      state.limit = PAGE;
      window.history.replaceState({}, '', routeUrl());
      renderResults();
    });
    $$('[data-filter]').forEach((select) => select.addEventListener('change', (event) => navigate({ filters: { ...state.filters, [event.target.dataset.filter]: event.target.value }, detail: null })));
    $('#more-cases')?.addEventListener('click', () => { state.limit += PAGE; renderResults(); });
    $('#reset-filters')?.addEventListener('click', () => navigate({ query: '', filters: {}, detail: null }));
    $('#empty-reset')?.addEventListener('click', () => navigate({ query: '', filters: {}, detail: null }));
    $('#filter-toggle')?.addEventListener('click', () => { state.filtersOpen = !state.filtersOpen; $('.explore-catalog-layout')?.classList.toggle('filters-open', state.filtersOpen); $('#filter-toggle').setAttribute('aria-expanded', String(state.filtersOpen)); });
    $('#filter-close')?.addEventListener('click', () => { state.filtersOpen = false; $('.explore-catalog-layout')?.classList.remove('filters-open'); $('#filter-toggle')?.setAttribute('aria-expanded', 'false'); });
  }

  root.addEventListener('click', (event) => {
    const removeFilter = event.target.closest('[data-remove-filter]');
    if (removeFilter) {
      event.preventDefault();
      const filters = { ...state.filters };
      delete filters[removeFilter.dataset.removeFilter];
      navigate({ filters, detail: null });
      return;
    }
    const removeQuery = event.target.closest('[data-remove-query]');
    if (removeQuery) {
      event.preventDefault();
      navigate({ query: '', detail: null });
      return;
    }
  });
  window.addEventListener('popstate', render);

  window.ACOLYTE_HOCUS_FOR = hocusFor;
  /* Page de fiche pré-rendue : tout est déjà dans le HTML, pas besoin de charger le corpus. */
  if (root.dataset.prerendered === 'true') return;
  const casesSrc = root.dataset.src || 'data/cases-v1.json';
  const toolsSrc = root.dataset.tools || casesSrc.replace(/cases-v1\.json$/, 'tools-v1.json');
  const glossarySrc = casesSrc.replace(/cases-v1\.json$/, 'glossary-v1.json');
  Promise.all([
    fetch(casesSrc).then((response) => { if (!response.ok) throw new Error(`Dataset unavailable (${response.status})`); return response.json(); }),
    /* Le référentiel des outils enrichit le catalogue ; s'il manque, les cas restent consultables. */
    fetch(toolsSrc).then((response) => (response.ok ? response.json() : [])).catch(() => []),
    fetch(glossarySrc).then((response) => (response.ok ? response.json() : null)).catch(() => null)
  ])
    .then(([cases, tools, glossary]) => {
      if (glossary?.terms) state.glossary = glossary;
      state.cases = cases;
      state.tools = tools;
      state.toolsById = Object.fromEntries(tools.map((tool) => [tool.id, tool]));
      labels.tool_ids = Object.fromEntries(tools.map((tool) => [tool.id, tool.name]));
      render();
    })
    .catch((error) => { root.innerHTML = `<div class="explore-error"><strong>Le corpus n’a pas pu être chargé.</strong><p>${escapeHtml(error.message)}</p><a class="explore-button" href="${base}">Retour à Acolyte</a></div>`; });
})();
