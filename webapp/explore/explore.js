(() => {
  'use strict';

  const root = document.querySelector('#explore-view');
  if (!root) return;

  const labels = {
    company_size: {
      tpe: 'TPE', pme: 'PME', eti: 'ETI', enterprise: 'Grand compte', group: 'Groupe', unknown: 'Non renseigné'
    },
    industry: {
      retail: 'Retail', industry: 'Industrie', 'services-b2b': 'Services B2B', insurance: 'Assurance', finance: 'Finance',
      construction: 'Construction', hospitality: 'Hospitality', 'luxury-beauty': 'Luxe / Beauty', 'transport-logistics': 'Transport / Logistique',
      agriculture: 'Agriculture', automotive: 'Automobile', software: 'Logiciel', healthcare: 'Santé', 'public-sector': 'Secteur public', other: 'Autre', unknown: 'Non renseigné'
    },
    business_function: {
      'general-management': 'Direction générale', marketing: 'Marketing', sales: 'Commerce', finance: 'Finance', hr: 'Ressources humaines',
      operations: 'Opérations', supply: 'Supply', 'customer-service': 'Service client', 'it-data': 'IT / Data', procurement: 'Achats', product: 'Produit', other: 'Autre', unknown: 'Non renseigné'
    },
    solution_type: { copilot: 'Copilote', knowledge: 'Knowledge', workflow: 'Workflow', agent: 'Agent', product: 'Produit', unknown: 'Non renseigné' },
    autonomy_level: { assisted: 'Assisté', 'semi-autonomous': 'Semi-autonome', 'supervised-agent': 'Agent supervisé', 'bounded-autonomous': 'Autonome borné', unknown: 'Non renseigné' },
    evidence_level: { documented: 'Documenté', experience: 'Expérience', pattern: 'Pattern', concept: 'Concept' },
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
    pattern: 'Pattern généralisé, pas un cas client unique.',
    concept: 'Concept ou proposition non prouvé par un cas réel.'
  };
  const evidenceColors = { documented: 'documented', experience: 'experience', pattern: 'pattern', concept: 'concept' };
  const state = { cases: [], query: '', filters: {}, detail: null, filtersOpen: false };
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
    const values = new Set(state.cases.flatMap((item) => valuesFor(item, field)));
    return [...values].sort((a, b) => titleFor(field, a).localeCompare(titleFor(field, b), 'fr'));
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
        <p class="explore-kicker">EXPLORE · BIBLIOTHÈQUE DE CAS</p>
        <h1>Les use cases IA, avant le catalogue de promesses.</h1>
        <p class="explore-lead">Parcourez des situations de travail, les solutions possibles et ce qui est réellement documenté. Filtrez par contexte, ouvrez une fiche, puis revenez au parcours qui l’explique.</p>
        <div class="explore-hero-links"><a class="explore-button explore-button-primary" href="../ux/tutorial/?slide=9">Lire un cas guidé <span aria-hidden="true">→</span></a><a class="explore-text-link" href="../">Retour à l’accueil ↗</a></div>
      </div>
      <aside class="explore-hero-note"><span>À DATE</span><strong id="case-count">— cas</strong><p>Un corpus volontairement petit, avec les inconnues et les limites laissées visibles.</p></aside>
    </section>
    <section class="explore-catalog" aria-labelledby="catalog-title">
      <div class="explore-catalog-head"><div><p class="explore-kicker">CATALOGUE CANONIQUE</p><h2 id="catalog-title">Trouver un point de départ.</h2></div><p class="explore-catalog-intro">La recherche porte sur le titre, le problème, la fonction, le secteur et le pattern IA. Les filtres se combinent.</p></div>
      <div class="explore-toolbar"><label class="explore-search"><span aria-hidden="true">⌕</span><span class="sr-only">Rechercher dans les cas</span><input id="case-search" type="search" autocomplete="off" placeholder="Rechercher un problème, une fonction, un pattern…" value="${escapeHtml(state.query)}"></label><button class="explore-filter-toggle" id="filter-toggle" type="button" aria-expanded="${state.filtersOpen}">Filtres <span aria-hidden="true">＋</span></button><button class="explore-reset" id="reset-filters" type="button">Réinitialiser</button></div>
      <div class="explore-catalog-layout ${state.filtersOpen ? 'filters-open' : ''}">
        <aside class="explore-filters" id="explore-filters" aria-label="Filtrer les cas"><div class="explore-filters-head"><span>FILTRER PAR CONTEXTE</span><button id="filter-close" type="button" aria-label="Fermer les filtres">×</button></div>${filterConfig.map(([field, label]) => `<label class="explore-filter" for="filter-${field}"><span>${escapeHtml(label)}</span><select id="filter-${field}" data-filter="${field}"></select></label>`).join('')}<div class="explore-proof-key"><span>NIVEAUX DE PREUVE</span>${Object.keys(evidenceCopy).map((key) => `<p>${proofBadge(key)}<small>${escapeHtml(evidenceCopy[key])}</small></p>`).join('')}</div></aside>
        <div class="explore-results"><div class="explore-results-head"><p id="results-count" aria-live="polite"></p><span>Les fiches restent au niveau du corpus source.</span></div><div class="explore-card-grid" id="case-grid"></div><div class="explore-empty" id="case-empty" hidden><strong>Aucun cas dans cette sélection.</strong><p>Essayez une recherche plus courte ou retirez un filtre.</p><button class="explore-button" id="empty-reset" type="button">Réinitialiser les filtres</button></div></div>
      </div>
    </section>`;
    populateFilterOptions(root);
  }

  function card(item) {
    const functionLabel = formatList('business_function', item.business_function) || 'Fonction non renseignée';
    const industryLabel = titleFor('industry', item.industry);
    return `<article class="explore-card"><a class="explore-card-link" href="?case=${encodeURIComponent(item.id)}" data-case-link="${escapeHtml(item.id)}"><div class="explore-card-top"><span class="explore-card-number">${escapeHtml(item.evidence_level === 'documented' ? 'REAL CASE' : 'OPPORTUNITÉ')}</span>${proofBadge(item.evidence_level)}</div><h3>${escapeHtml(item.title)}</h3><p class="explore-card-problem">${escapeHtml(item.short_description || item.problem)}</p><div class="explore-card-meta"><span><b>Secteur</b>${escapeHtml(industryLabel)}</span><span><b>Fonction</b>${escapeHtml(functionLabel)}</span><span><b>Solution</b>${escapeHtml(titleFor('solution_type', item.solution_type))}</span><span><b>Autonomie</b>${escapeHtml(titleFor('autonomy_level', item.autonomy_level))}</span></div><span class="explore-card-open">Ouvrir la fiche <b aria-hidden="true">→</b></span></a></article>`;
  }

  function renderResults() {
    const visible = filteredCases();
    const grid = $('#case-grid');
    const empty = $('#case-empty');
    const count = $('#results-count');
    if (!grid || !empty || !count) return;
    count.innerHTML = `<strong>${visible.length}</strong> cas affiché${visible.length > 1 ? 's' : ''} <span>sur ${state.cases.length}</span>`;
    grid.innerHTML = visible.map(card).join('');
    empty.hidden = visible.length > 0;
    $('#case-count').textContent = `${state.cases.length} cas`;
  }

  function missingNote() { return '<p class="detail-missing">Cette information n’est pas renseignée dans la fiche canonique.</p>'; }
  function renderItems(values, field = null) { return asArray(values).filter(Boolean).map((value) => `<li>${escapeHtml(field ? titleFor(field, textValue(value)) : textValue(value))}</li>`).join(''); }
  function renderSection(label, content, className = '') { return content ? `<section class="detail-section ${className}"><p class="detail-label">${escapeHtml(label)}</p>${content}</section>` : ''; }
  function renderTextList(values, field = null) { const list = asArray(values).filter((item) => textValue(item)); return list.length ? `<ul class="detail-list">${renderItems(list, field)}</ul>` : ''; }
  function resultLabel(result, sourceType) { return result?.observed === false || sourceType === 'projected' ? 'PROJETÉ' : sourceType === 'reported' ? 'RAPPORTÉ' : result?.observed ? 'OBSERVÉ' : 'À QUALIFIER'; }
  function sourceType(item) { return item.sources?.[0]?.evidence_type || 'unknown'; }

  function detailFacts(item) {
    return [['Taille', formatList('company_size', item.company_size)], ['Secteur', titleFor('industry', item.industry)], ['Fonction', formatList('business_function', item.business_function)], ['Solution', titleFor('solution_type', item.solution_type)], ['Autonomie', titleFor('autonomy_level', item.autonomy_level)], ['Preuve', titleFor('evidence_level', item.evidence_level)]].map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || 'Non renseigné')}</strong></div>`).join('');
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
    return state.cases.map((candidate) => ({ candidate, score: score(candidate) })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title, 'fr')).slice(0, 3).map(({ candidate }) => `<a href="?case=${encodeURIComponent(candidate.id)}" data-case-link="${escapeHtml(candidate.id)}"><span>${escapeHtml(titleFor('solution_type', candidate.solution_type))}</span><strong>${escapeHtml(candidate.title)}</strong><small>${escapeHtml(titleFor('evidence_level', candidate.evidence_level))} · ${escapeHtml(titleFor('industry', candidate.industry))}</small></a>`).join('');
  }

  function learnLink(item) {
    if (item.solution_type === 'agent') return '<a class="detail-bridge" href="../ux/tutorial/?slide=2"><span>LEARN · AGENTS</span><strong>Comprendre le fonctionnement d’un agent <b aria-hidden="true">→</b></strong></a>';
    if (item.solution_type === 'knowledge' || valuesFor(item, 'ai_pattern').includes('retrieval')) return '<a class="detail-bridge" href="../ux/tutorial/?slide=9"><span>LEARN · CAS GUIDÉ</span><strong>Voir une mémoire rendue retrouvable <b aria-hidden="true">→</b></strong></a>';
    return '<a class="detail-bridge" href="../ux/tutorial/?slide=7"><span>LEARN · PREUVE</span><strong>Lire la grille des niveaux de preuve <b aria-hidden="true">→</b></strong></a>';
  }

  function renderDetail(item) {
    const source = item.sources?.[0];
    const resultList = item.results?.length ? `<ul class="detail-results">${item.results.map((result) => `<li><span>${escapeHtml(resultLabel(result, sourceType(item)))}</span>${escapeHtml(textValue(result))}</li>`).join('')}</ul>` : '';
    const expectedValue = item.expected_value?.length ? `<ul class="detail-list">${item.expected_value.map((value) => `<li><b>${escapeHtml(titleFor('value_type', value.type))}</b>${escapeHtml(value.description || '')}</li>`).join('')}</ul>` : '';
    const sourceMarkup = source ? `<div class="detail-source"><strong>${escapeHtml(source.publisher || source.title || 'Source')}</strong>${source.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Ouvrir la source ↗</a>` : ''}<small>${escapeHtml(sourceType(item) === 'projected' ? 'Résultat projeté dans la source.' : sourceType(item) === 'reported' ? 'Résultat rapporté par la source.' : 'Type de résultat non renseigné.')}</small></div>` : missingNote();
    const architecture = renderTextList(item.architecture_pattern);
    const mechanism = `<div class="detail-pills">${labelForArray('ai_pattern', item.ai_pattern).map((value) => `<span>${escapeHtml(value)}</span>`).join('')}</div>${item.workflow?.length ? renderTextList(item.workflow) : architecture ? `<p class="detail-sub-label">Chaîne décrite dans la source</p>${architecture}` : missingNote()}`;
    const related = relatedCases(item);
    root.innerHTML = `<div class="explore-detail-page"><a class="detail-back" href="./" data-back-catalog>← Retour au catalogue</a><header class="explore-detail-hero"><div><p class="explore-kicker">FICHE ${item.evidence_level === 'documented' ? 'REAL CASE' : 'USE CASE'} · ${escapeHtml(item.id)}</p><h1>${escapeHtml(item.title)}</h1><p class="explore-detail-lead">${escapeHtml(item.short_description || item.problem)}</p></div><div class="detail-proof-panel">${proofBadge(item.evidence_level)}<p>${escapeHtml(evidenceCopy[item.evidence_level] || 'Niveau de preuve non renseigné.')}</p></div></header><div class="detail-facts">${detailFacts(item)}</div><div class="detail-layout"><div class="detail-main">${renderSection('Le problème traité', `<p class="detail-prose">${escapeHtml(item.problem || item.short_description || '')}</p>`)}${renderSection('Le mécanisme', mechanism)}${renderSection('Données nécessaires', renderTextList(item.data_required) || renderTextList(item.data_sources) || missingNote())}${renderSection('Outils et systèmes', renderTextList([...(item.tools || []), ...(item.models || []), ...(item.integrations || []), ...(item.systems_involved || [])]) || missingNote())}${renderSection('Impact attendu ou observé', expectedValue || resultList || (item.business_impact ? renderTextList(item.business_impact) : '') || missingNote())}${renderSection('Prérequis', renderTextList([item.delivery_scope, item.complexity && `Complexité : ${item.complexity}`, item.technical_feasibility && `Faisabilité technique : ${item.technical_feasibility}`, item.organizational_feasibility && `Faisabilité organisationnelle : ${item.organizational_feasibility}`, item.data_readiness && `Maturité data : ${item.data_readiness}`, item.maturity_required && `Maturité requise : ${item.maturity_required}`]) || missingNote())}${renderSection('Limites et risques', renderTextList([...(item.risks || []), ...(item.limitations || []), ...(item.failure_modes || []), ...(item.governance_requirements || []), ...(item.security_constraints || []), ...(item.legal_constraints || [])]) || missingNote())}${renderSection('Résultats et sources', sourceMarkup)}${item.lessons_learned?.length ? renderSection('À retenir', renderTextList(item.lessons_learned)) : ''}</div><aside class="detail-aside">${learnLink(item)}<section class="detail-aside-card"><p class="detail-label">PROVENANCE</p><p>${escapeHtml(item.provenance?.source_type || 'Non renseignée')}</p><small>${escapeHtml(item.provenance?.source_ref || '')}</small>${item.provenance?.transformation_notes ? `<p class="detail-note">${escapeHtml(item.provenance.transformation_notes)}</p>` : ''}</section><section class="detail-aside-card"><p class="detail-label">CONFIANCE</p><strong class="detail-confidence">${escapeHtml(titleFor('confidence', item.confidence))}</strong><p>Le niveau de preuve et la confiance ne remplacent pas une revue du contexte.</p></section></aside></div>${related ? `<section class="detail-related"><div><p class="detail-label">CAS PROCHES</p><h2>Continuer par une autre entrée.</h2></div><div class="detail-related-grid">${related}</div></section>` : ''}</div>`;
  }

  function render() {
    readRoute();
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
      window.history.replaceState({}, '', routeUrl());
      renderResults();
    });
    $$('[data-filter]').forEach((select) => select.addEventListener('change', (event) => navigate({ filters: { ...state.filters, [event.target.dataset.filter]: event.target.value }, detail: null })));
    $('#reset-filters')?.addEventListener('click', () => navigate({ query: '', filters: {}, detail: null }));
    $('#empty-reset')?.addEventListener('click', () => navigate({ query: '', filters: {}, detail: null }));
    $('#filter-toggle')?.addEventListener('click', () => { state.filtersOpen = !state.filtersOpen; $('.explore-catalog-layout')?.classList.toggle('filters-open', state.filtersOpen); $('#filter-toggle').setAttribute('aria-expanded', String(state.filtersOpen)); });
    $('#filter-close')?.addEventListener('click', () => { state.filtersOpen = false; $('.explore-catalog-layout')?.classList.remove('filters-open'); $('#filter-toggle')?.setAttribute('aria-expanded', 'false'); });
    $$('[data-case-link]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); navigate({ detail: link.dataset.caseLink }); }));
  }

  root.addEventListener('click', (event) => {
    const back = event.target.closest('[data-back-catalog]');
    if (back) { event.preventDefault(); navigate({ detail: null }); }
    const related = event.target.closest('[data-case-link]');
    if (related) { event.preventDefault(); navigate({ detail: related.dataset.caseLink }); }
  });
  window.addEventListener('popstate', render);

  fetch('data/cases-v1.json')
    .then((response) => { if (!response.ok) throw new Error(`Dataset unavailable (${response.status})`); return response.json(); })
    .then((cases) => { state.cases = cases; render(); })
    .catch((error) => { root.innerHTML = `<div class="explore-error"><strong>Le corpus n’a pas pu être chargé.</strong><p>${escapeHtml(error.message)}</p><a class="explore-button" href="../">Retour à Acolyte</a></div>`; });
})();
