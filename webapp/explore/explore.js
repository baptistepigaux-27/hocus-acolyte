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
      agriculture: 'Agriculture', automotive: 'Automobile', software: 'Logiciel', healthcare: 'Santé', 'public-sector': 'Secteur public', other: 'Autre', unknown: 'Tous secteurs'
    },
    business_function: {
      'general-management': 'Direction générale', marketing: 'Marketing', sales: 'Commerce', finance: 'Finance', hr: 'Ressources humaines',
      operations: 'Opérations', supply: 'Supply chain', 'customer-service': 'Service client', 'it-data': 'IT / Data', procurement: 'Achats', product: 'Produit', other: 'Autre', unknown: 'Non renseigné'
    },
    solution_type: { copilot: 'Copilote', knowledge: 'Base de connaissance', workflow: 'Chaîne automatisée', agent: 'Agent', product: 'Produit', unknown: 'Non renseigné' },
    autonomy_level: { assisted: 'Assisté', 'semi-autonomous': 'Semi-autonome', 'supervised-agent': 'Agent supervisé', 'bounded-autonomous': 'Autonome borné', unknown: 'Non renseigné' },
    evidence_level: { documented: 'Documenté', experience: 'Expérience', pattern: 'Cas type', concept: 'Concept' },
    confidence: { high: 'Élevée', medium: 'Moyenne', low: 'Faible', unknown: 'Non renseignée' },
    value_type: { productivity: 'Productivité', quality: 'Qualité', speed: 'Vitesse', cost: 'Coût', revenue: 'Revenu', risk: 'Risque', knowledge: 'Connaissance', decision: 'Décision', unknown: 'Non renseigné' },
    ai_pattern: { generation: 'Génération', summarization: 'Synthèse', retrieval: 'Recherche', extraction: 'Extraction', classification: 'Classification', comparison: 'Comparaison', scoring: 'Scoring', recommendation: 'Recommandation', orchestration: 'Orchestration', monitoring: 'Veille', prediction: 'Prédiction', coding: 'Code', multimodal: 'Multimodal', other: 'Autre', unknown: 'Non renseigné' }
  };
  const filterConfig = [
    ['company_size', 'Taille d’entreprise'],
    ['industry', 'Secteur'],
    ['business_function', 'Fonction métier'],
    ['solution_type', 'Type de solution'],
    ['autonomy_level', 'Autonomie'],
    ['evidence_level', 'Niveau de preuve'],
    ['value_type', 'Type de valeur']
  ];
  const evidenceCopy = {
    documented: 'Cas publiquement documenté, avec entreprise identifiable et source.',
    experience: 'Expérience réelle reformulée ou anonymisée.',
    pattern: 'Cas type construit à partir de situations fréquentes, pas un cas client unique.',
    concept: 'Concept ou proposition non prouvé par un cas réel.'
  };
  const evidenceColors = { documented: 'documented', experience: 'experience', pattern: 'pattern', concept: 'concept' };
  const PAGE = 12;
  const state = { cases: [], query: '', filters: {}, detail: null, filtersOpen: false, limit: PAGE };
  /* Acolyte V2 : chaque fiche a sa page, /acolyte/cas/{slug}/ (pré-rendue pour les moteurs de recherche). */
  const base = root.dataset.root || '../';
  const caseHref = (item) => `${base}cas/${encodeURIComponent(item.slug || item.id)}/`;
  const exploreHref = `${base}explore/`;
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
      ...valuesFor(item, 'business_function'), ...valuesFor(item, 'ai_pattern'), ...valuesFor(item, 'solution_type')
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
        <p class="explore-kicker">CATALOGUE · 120 CAS D’USAGE</p>
        <h1>Les cas d’usage de l’IA, avant les promesses.</h1>
        <p class="explore-lead">Parcourez des situations de travail, les solutions possibles et ce qui est réellement documenté. Filtrez par secteur, fonction ou taille d’entreprise, puis ouvrez une fiche.</p>
        <div class="explore-hero-links"><a class="explore-button explore-button-primary" href="${base}?journey=operating-system&amp;slide=1">Commencer par un parcours <span aria-hidden="true">→</span></a><a class="explore-text-link" href="/works/diagnostic/">Le Diagnostic Data &amp; IA ↗</a></div>
      </div>
      <aside class="explore-hero-note"><span>À DATE</span><strong id="case-count">— cas</strong><p>77 cas documentés par une source publique, 41 cas types et 2 retours d’expérience. Les inconnues et les limites restent visibles.</p></aside>
    </section>
    <section class="explore-catalog" aria-labelledby="catalog-title">
      <div class="explore-catalog-head"><div><p class="explore-kicker">LE CATALOGUE</p><h2 id="catalog-title">Trouver un point de départ.</h2></div><p class="explore-catalog-intro">La recherche porte sur le titre, le problème, la fonction, le secteur et le type d’IA. Les filtres se combinent.</p></div>
      <div class="explore-toolbar"><label class="explore-search"><span aria-hidden="true">⌕</span><span class="sr-only">Rechercher dans les cas</span><input id="case-search" type="search" autocomplete="off" placeholder="Rechercher un problème, une fonction, un secteur…" value="${escapeHtml(state.query)}"></label><button class="explore-filter-toggle" id="filter-toggle" type="button" aria-expanded="${state.filtersOpen}">Filtres <span aria-hidden="true">＋</span></button><button class="explore-reset" id="reset-filters" type="button">Réinitialiser</button></div><div class="explore-active-filters" id="active-filters" aria-live="polite"></div>
      <div class="explore-catalog-layout ${state.filtersOpen ? 'filters-open' : ''}">
        <aside class="explore-filters" id="explore-filters" aria-label="Filtrer les cas"><div class="explore-filters-head"><span>FILTRER PAR CONTEXTE</span><button id="filter-close" type="button" aria-label="Fermer les filtres">×</button></div>${filterConfig.map(([field, label]) => `<label class="explore-filter" for="filter-${field}"><span>${escapeHtml(label)}</span><select id="filter-${field}" data-filter="${field}"></select></label>`).join('')}<div class="explore-proof-key"><span>NIVEAUX DE PREUVE</span>${Object.keys(evidenceCopy).map((key) => `<p>${proofBadge(key)}<small>${escapeHtml(evidenceCopy[key])}</small></p>`).join('')}</div></aside>
        <div class="explore-results"><div class="explore-results-head"><p id="results-count" aria-live="polite"></p></div><div class="explore-card-grid" id="case-grid"></div><div class="explore-more" id="case-more" hidden><button class="explore-button" id="more-cases" type="button"></button></div><div class="explore-empty" id="case-empty" hidden><strong>Aucun cas dans cette sélection.</strong><p>Essayez une recherche plus courte ou retirez un filtre.</p><button class="explore-button" id="empty-reset" type="button">Réinitialiser les filtres</button></div></div>
      </div>
    </section>`;
    populateFilterOptions(root);
  }

  function kindLabel(item) { return item.evidence_level === 'documented' ? 'CAS DOCUMENTÉ' : item.evidence_level === 'experience' ? 'RETOUR D’EXPÉRIENCE' : 'CAS TYPE'; }

  function card(item) {
    const functionLabel = formatList(item.business_function, 'business_function') || 'Fonction non renseignée';
    const industryLabel = titleFor('industry', item.industry);
    return `<article class="explore-card"><a class="explore-card-link" href="${caseHref(item)}"><div class="explore-card-top"><span class="explore-card-number">${escapeHtml(kindLabel(item))}</span>${proofBadge(item.evidence_level)}</div><h3>${escapeHtml(item.title)}</h3><p class="explore-card-problem">${escapeHtml(item.short_description || item.problem)}</p><div class="explore-card-meta"><span><b>Secteur</b>${escapeHtml(industryLabel)}</span><span><b>Fonction</b>${escapeHtml(functionLabel)}</span><span><b>Solution</b>${escapeHtml(titleFor('solution_type', item.solution_type))}</span><span><b>Autonomie</b>${escapeHtml(titleFor('autonomy_level', item.autonomy_level))}</span></div><span class="explore-card-open">Ouvrir la fiche <b aria-hidden="true">→</b></span></a></article>`;
  }

  function renderResults() {
    const visible = filteredCases();
    const grid = $('#case-grid');
    const empty = $('#case-empty');
    const count = $('#results-count');
    if (!grid || !empty || !count) return;
    count.innerHTML = `<strong>${visible.length}</strong> cas trouvé${visible.length > 1 ? 's' : ''} <span>sur ${state.cases.length}</span>`;
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
    return [['Taille', formatList(item.company_size, 'company_size')], ['Secteur', titleFor('industry', item.industry)], ['Fonction', formatList(item.business_function, 'business_function')], ['Solution', titleFor('solution_type', item.solution_type)], ['Autonomie', titleFor('autonomy_level', item.autonomy_level)], ['Preuve', titleFor('evidence_level', item.evidence_level)]].map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || 'Non renseigné')}</strong></div>`).join('');
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
    if (says(/catalogue|assortiment|référentiel produit|fiches? produits?|gamme/) || (functions.includes('product') && has('classification', 'comparison'))) return { name: 'Stolas', tier: 'Atelier', href: '/atelier/stolas/', why: 'Stolas lit la forme d’un catalogue : familles, recouvrements, compléments et substituts, espaces blancs.' };
    if (says(/veille|concurren|marché|tendance|social commerce|réseaux sociaux/) && has('monitoring', 'comparison', 'summarization')) return { name: 'Scrolls', tier: 'Atelier', href: '/atelier/scrolls/', why: 'Scrolls transforme une veille de marché en intelligence suivie : acteurs, catégories, signaux et leviers.' };
    if (has('prediction', 'scoring')) return { name: 'Works · Scoring & prédiction', tier: 'Works', href: '/works/', why: 'Des scores recalculés et expliqués (attrition, valeur, appétence, demande) branchés là où l’action se passe.' };
    if (has('recommendation')) return { name: 'Works · Recommandation & affinités', tier: 'Works', href: '/works/', why: 'Le prochain meilleur produit, les compléments et les substituts, même sans historique d’achat.' };
    if (has('generation') && (functions.includes('marketing') || says(/contenu|description|article|rédaction|texte/))) return { name: 'Lore', tier: 'Atelier', href: '/atelier/lore/', why: 'Lore produit des contenus contextuels à grande échelle, à partir de faits vérifiés et tenus à jour.' };
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
    const mechanismSupport = [dataMarkup ? `<div><p class="detail-sub-label">Données et entrées</p>${dataMarkup}</div>` : '', toolsMarkup ? `<div><p class="detail-sub-label">Outils et systèmes</p>${toolsMarkup}</div>` : ''].join('');
    const mechanism = `<div class="detail-pills">${labelForArray('ai_pattern', item.ai_pattern).map((value) => `<span>${escapeHtml(value)}</span>`).join('')}</div>${item.workflow?.length ? renderTextList(item.workflow) : architecture ? `<p class="detail-sub-label">Chaîne décrite dans la source</p>${architecture}` : '<p class="detail-quiet">Le schéma indique le pattern mobilisé, sans déroulé opérationnel plus détaillé.</p>'}${mechanismSupport}`;
    const impactMarkup = [resultList, expectedValue ? `<div><p class="detail-sub-label">Valeur attendue dans la fiche</p>${expectedValue}</div>` : '', item.business_impact?.length ? `<div><p class="detail-sub-label">Type d’impact envisagé</p>${renderTextList(item.business_impact)}</div>` : ''].join('');
    const prerequisites = renderTextList([item.delivery_scope, item.complexity && `Complexité : ${item.complexity}`, item.technical_feasibility && `Faisabilité technique : ${item.technical_feasibility}`, item.organizational_feasibility && `Faisabilité organisationnelle : ${item.organizational_feasibility}`, item.data_readiness && `Maturité data : ${item.data_readiness}`, item.maturity_required && `Maturité requise : ${item.maturity_required}`]);
    const limitations = renderTextList([...(item.risks || []), ...(item.limitations || []), ...(item.failure_modes || []), ...(item.governance_requirements || []), ...(item.security_constraints || []), ...(item.legal_constraints || [])]);
    const related = relatedCases(item);
    const provenance = `<div class="detail-evidence-grid"><section class="detail-aside-card"><p class="detail-label">PROVENANCE</p><p>${escapeHtml(provenanceLabel(item.provenance?.source_type))}</p>${item.provenance?.source_type === 'internal-note' ? '<small>Cas type construit par HOCUS à partir des parcours Acolyte.</small>' : `<small>${escapeHtml(item.provenance?.source_ref || '')}</small>`}</section><section class="detail-aside-card"><p class="detail-label">CONFIANCE</p><strong class="detail-confidence">${escapeHtml(titleFor('confidence', item.confidence))}</strong><p>Le niveau de preuve et la confiance ne remplacent pas une revue du contexte.</p></section></div>`;
    root.innerHTML = `<div class="explore-detail-page"><a class="detail-back" href="${exploreHref}">← Retour au catalogue</a><header class="explore-detail-hero"><div><p class="explore-kicker">FICHE · ${escapeHtml(kindLabel(item))}</p><h1>${escapeHtml(item.title)}</h1><p class="explore-detail-lead">${escapeHtml(item.short_description || item.problem)}</p></div><div class="detail-proof-panel">${proofBadge(item.evidence_level)}<p>${escapeHtml(evidenceCopy[item.evidence_level] || 'Niveau de preuve non renseigné.')}</p><small>La preuve décrit le statut du cas, pas une garantie de résultat.</small></div></header><div class="detail-facts">${detailFacts(item)}</div><section class="detail-editorial-intro"><div><p class="detail-label">ANALYSE ACOLYTE</p><h2>Pourquoi ce cas mérite d’être regardé</h2></div><p class="detail-editorial-copy">${escapeHtml(editorialWhy(item))}</p></section><div class="detail-layout"><div class="detail-main">${renderSection('Le problème traité', `<p class="detail-prose">${escapeHtml(item.problem || item.short_description || '')}</p>`)}${renderSection('Le mécanisme / workflow', mechanism)}${renderSection('Impact observé ou attendu', impactMarkup)}${prerequisites ? renderSection('Prérequis', prerequisites) : ''}${renderEditorial(item)}${renderSection('Limites et risques', limitations)}${renderSection('Résultats et sources', sourceMarkup)}${item.lessons_learned?.length ? renderSection('À retenir de la source', renderTextList(item.lessons_learned)) : ''}${provenance}${renderUndocumented(item)}</div></div>${renderHocus(item)}${related ? `<section class="detail-related"><div><p class="detail-label">CAS PROCHES</p><h2>Continuer par une autre entrée.</h2></div><div class="detail-related-grid">${related}</div></section>` : ''}<section class="detail-learn-row">${learnLink(item)}</section></div>`;
  }

  function render() {
    readRoute();
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
  fetch(root.dataset.src || 'data/cases-v1.json')
    .then((response) => { if (!response.ok) throw new Error(`Dataset unavailable (${response.status})`); return response.json(); })
    .then((cases) => { state.cases = cases; render(); })
    .catch((error) => { root.innerHTML = `<div class="explore-error"><strong>Le corpus n’a pas pu être chargé.</strong><p>${escapeHtml(error.message)}</p><a class="explore-button" href="${base}">Retour à Acolyte</a></div>`; });
})();
