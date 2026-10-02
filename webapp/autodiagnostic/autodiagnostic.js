/*
 * Acolyte — autodiagnostic « Votre entreprise est-elle prête pour l'IA ? » (/acolyte/autodiagnostic/).
 *
 * Dix questions notées de 0 à 3, réparties sur quatre axes, et deux questions de profil (fonction,
 * taille) qui servent seulement à proposer des cas proches. Tout se calcule dans le navigateur :
 * rien n'est enregistré ni envoyé. Le résultat renvoie vers le glossaire, le catalogue et le
 * Diagnostic Data & IA de HOCUS.
 */
(() => {
  'use strict';

  const root = document.querySelector('#explore-view');
  const form = document.querySelector('#ad-form');
  const result = document.querySelector('#ad-result');
  if (!root || !form || !result) return;

  const base = root.dataset.root || '../';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

  const profile = [
    { id: 'function', label: 'Dans quelle fonction l’IA aiderait-elle le plus ?', options: [
      ['general-management', 'Direction'], ['sales', 'Commerce'], ['marketing', 'Marketing'], ['customer-service', 'Service client'],
      ['finance', 'Finance'], ['hr', 'Ressources humaines'], ['operations', 'Opérations'], ['supply', 'Supply chain'], ['it-data', 'IT / Data']] },
    { id: 'size', label: 'Quelle est la taille de votre entreprise ?', options: [['tpe', 'TPE (moins de 10 personnes)'], ['pme', 'PME (10 à 249)'], ['eti', 'ETI (250 à 4 999)'], ['enterprise', 'Grand compte (5 000 et plus)']] },
  ];

  const axes = {
    usage: { label: 'Le cas d’usage', short: 'Cas d’usage' },
    data: { label: 'Les données', short: 'Données' },
    team: { label: 'L’équipe', short: 'Équipe' },
    frame: { label: 'Le cadre et les risques', short: 'Cadre' },
  };

  const questions = [
    { id: 'q1', axis: 'usage', label: 'Avez-vous identifié un problème précis à traiter avec l’IA ?', options: ['Pas encore', 'Des idées générales', 'Un ou deux problèmes précis', 'Un problème précis, dont on connaît le coût actuel'] },
    { id: 'q2', axis: 'usage', label: 'Savez-vous comment mesurer le gain attendu ?', options: ['Non', 'Une intuition', 'Un indicateur identifié', 'Un indicateur et sa valeur actuelle mesurée'] },
    { id: 'q3', axis: 'data', label: 'Les données ou documents nécessaires sont-ils accessibles ?', options: ['Je ne sais pas où ils sont', 'Ils existent mais sont difficiles à obtenir', 'Accessibles, de qualité inégale', 'Accessibles, à jour et bien rangés'] },
    { id: 'q4', axis: 'data', label: 'Savez-vous quelles données sont sensibles (personnelles, confidentielles) ?', options: ['Non', 'En partie', 'Oui', 'Oui, avec des règles d’usage écrites'] },
    { id: 'q5', axis: 'data', label: 'Disposez-vous d’un historique sur plusieurs mois (ventes, tickets, interventions…) ?', options: ['Non', 'Partiel', 'Oui', 'Oui, propre et exploitable'] },
    { id: 'q6', axis: 'team', label: 'Vos équipes utilisent-elles déjà l’IA générative ?', options: ['Non', 'Quelques personnes, sans cadre', 'Plusieurs équipes, avec des outils fournis', 'Usage courant, outils et formation fournis'] },
    { id: 'q7', axis: 'team', label: 'Qui porterait un projet d’IA ?', options: ['Personne d’identifié', 'Une personne intéressée, sans temps dédié', 'Un responsable métier qui a du temps', 'Un binôme métier et technique, mandaté par la direction'] },
    { id: 'q8', axis: 'team', label: 'Avez-vous des compétences data ou techniques ?', options: ['Aucune', 'Un profil polyvalent', 'Une petite équipe IT ou data', 'Une équipe data ou IA, ou un partenaire attitré'] },
    { id: 'q9', axis: 'frame', label: 'Avez-vous prévu qui vérifie les résultats de l’IA avant qu’ils aient un effet ?', options: ['Pas encore réfléchi', 'Au cas par cas', 'Un point de validation prévu', 'Validation et suivi de la qualité définis'] },
    { id: 'q10', axis: 'frame', label: 'Existe-t-il des règles d’usage de l’IA dans l’entreprise ?', options: ['Non', 'Des règles informelles', 'Une charte d’usage', 'Une charte et un recensement des usages'] },
  ];

  const levels = [
    { min: 0, name: 'Explorer', lead: 'Le bon moment pour comprendre et repérer.', text: 'L’IA n’est pas encore rattachée à un problème précis ni aux données qui permettraient de le traiter. Commencez par repérer deux ou trois situations de travail coûteuses et regardez comment d’autres les ont traitées.' },
    { min: 35, name: 'Cadrer', lead: 'Des bases existent ; il faut choisir et cadrer.', text: 'Vous avez des idées et une partie des moyens. L’enjeu est de choisir un cas, de fixer comment mesurer le gain et de vérifier que les données suivent, avant tout développement.' },
    { min: 60, name: 'Prototyper', lead: 'Prêt pour un essai mesuré.', text: 'Le cas, les données et l’équipe sont réunis pour un POC court : quelques semaines, de vraies données, un critère de réussite fixé à l’avance et une décision à la fin.' },
    { min: 80, name: 'Industrialiser', lead: 'Prêt à passer à l’échelle.', text: 'Vous avez les conditions pour mettre un système en production et le suivre : intégration, validation humaine, évaluation continue, gouvernance. Le sujet devient la fiabilité et l’adoption.' },
  ];

  const advice = {
    usage: { title: 'Préciser le cas d’usage', points: ['Partir d’une situation de travail coûteuse, pas d’une technologie.', 'Estimer ce qu’elle coûte aujourd’hui (temps, erreurs, délais) pour savoir mesurer le gain.', 'Comparer avec des cas documentés de votre fonction.'], terms: [['poc', 'POC (preuve de concept)'], ['niveau-de-preuve', 'Niveau de preuve']] },
    data: { title: 'Rendre les données utilisables', points: ['Lister les documents et données dont le cas aurait besoin, et où ils sont.', 'Classer ce qui est sensible avant de choisir un outil ou un hébergement.', 'Trier : des sources obsolètes ou en double dégradent les réponses.'], terms: [['base-de-connaissance', 'Base de connaissance'], ['rag', 'RAG'], ['souverainete', 'Souveraineté des données']] },
    team: { title: 'Mobiliser une équipe', points: ['Désigner un porteur métier avec du temps, appuyé par un profil technique.', 'Équiper et former les équipes à un usage encadré des copilotes.', 'Choisir un premier cas qui parle aux équipes concernées.'], terms: [['copilote', 'Copilote'], ['industrialisation', 'Industrialisation']] },
    frame: { title: 'Poser le cadre', points: ['Écrire des règles d’usage simples : outils autorisés, données interdites.', 'Placer une validation humaine là où une erreur coûterait cher.', 'Recenser les usages existants, y compris ceux qui se font sans cadre.'], terms: [['validation-humaine', 'Validation humaine'], ['gouvernance-ia-act', 'Gouvernance et AI Act']] },
  };

  const fieldset = (id, label, options, index, total, scored) => `<fieldset class="ad-question" data-question="${id}"><legend><span class="ad-step">${index} / ${total}</span>${escapeHtml(label)}</legend><div class="ad-options">${options.map((option, i) => { const [value, text] = scored ? [String(i), option] : option; return `<label class="ad-option"><input type="radio" name="${id}" value="${escapeHtml(value)}" required><span>${escapeHtml(text)}</span></label>`; }).join('')}</div></fieldset>`;

  const total = profile.length + questions.length;
  form.innerHTML = `${profile.map((q, i) => fieldset(q.id, q.label, q.options, i + 1, total, false)).join('')}${questions.map((q, i) => fieldset(q.id, q.label, q.options, profile.length + i + 1, total, true)).join('')}<div class="ad-submit"><p class="ad-progress" id="ad-progress" aria-live="polite">0 réponse sur ${total}</p><button class="explore-button explore-button-primary" type="submit">Voir mon résultat <span aria-hidden="true">→</span></button></div>`;

  const answered = () => [...profile, ...questions].filter((q) => form.querySelector(`input[name="${q.id}"]:checked`)).length;
  form.addEventListener('change', () => {
    const count = answered();
    document.querySelector('#ad-progress').textContent = `${count} réponse${count > 1 ? 's' : ''} sur ${total}`;
  });

  let cases = [];
  fetch(root.dataset.src || '../explore/data/cases-v1.json').then((response) => (response.ok ? response.json() : [])).then((data) => { cases = data; }).catch(() => {});

  function suggestedCases(fn, size) {
    const documented = cases.filter((item) => item.evidence_level === 'documented' || item.evidence_level === 'experience');
    const score = (item) => ([].concat(item.business_function || []).includes(fn) ? 2 : 0) + ([].concat(item.company_size || []).includes(size) ? 1 : 0);
    return documented.map((item) => ({ item, s: score(item) })).filter(({ s }) => s >= 2).sort((a, b) => b.s - a.s || a.item.title.localeCompare(b.item.title, 'fr')).slice(0, 3).map(({ item }) => item);
  }

  function render(answers) {
    const axisScores = Object.fromEntries(Object.keys(axes).map((axis) => {
      const list = questions.filter((q) => q.axis === axis);
      return [axis, Math.round((100 * list.reduce((sum, q) => sum + answers[q.id], 0)) / (3 * list.length))];
    }));
    const overall = Math.round((100 * questions.reduce((sum, q) => sum + answers[q.id], 0)) / (3 * questions.length));
    const level = [...levels].reverse().find((item) => overall >= item.min);
    const weakest = Object.entries(axisScores).sort((a, b) => a[1] - b[1])[0][0];
    const tip = advice[weakest];
    const fnLabel = profile[0].options.find(([value]) => value === answers.function)?.[1] || '';
    const picks = suggestedCases(answers.function, answers.size);
    const exploreLink = `${base}explore/?business_function=${encodeURIComponent(answers.function)}`;
    result.innerHTML = `<div class="ad-result-head"><div><p class="explore-kicker">VOTRE RÉSULTAT · ${overall} / 100</p><h2>${escapeHtml(level.name)}</h2><p class="explore-lead">${escapeHtml(level.lead)}</p><p class="detail-prose">${escapeHtml(level.text)}</p></div><ol class="ad-levels" aria-label="Les quatre niveaux">${levels.map((item) => `<li class="${item === level ? 'is-current' : ''}"${item === level ? ' aria-current="step"' : ''}>${escapeHtml(item.name)}</li>`).join('')}</ol></div>
      <div class="ad-axes">${Object.entries(axes).map(([axis, meta]) => `<div class="ad-axis${axis === weakest ? ' is-weakest' : ''}"><div class="ad-axis-label"><span>${escapeHtml(meta.label)}</span><strong>${axisScores[axis]} %</strong></div><div class="ad-bar" role="img" aria-label="${escapeHtml(meta.short)} : ${axisScores[axis]} %"><i style="width:${axisScores[axis]}%"></i></div>${axis === weakest ? '<small>À renforcer en premier</small>' : ''}</div>`).join('')}</div>
      <section class="detail-section ad-advice"><h2 class="detail-section-title">${escapeHtml(tip.title)}</h2><ul class="detail-list">${tip.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul><p class="detail-sub-label">Pour comprendre</p><div class="detail-pills">${tip.terms.map(([slug, label]) => `<a class="glossary-pill" href="${base}glossaire/${slug}/">${escapeHtml(label)}</a>`).join('')}</div></section>
      ${picks.length ? `<section class="ad-cases"><div class="explore-catalog-head"><div><p class="explore-kicker">CAS COMPARABLES · ${escapeHtml(fnLabel.toLocaleUpperCase('fr'))}</p><h2>Ce que d’autres ont fait</h2></div><p class="explore-catalog-intro">Des cas documentés de votre fonction, proches de votre taille quand c’est possible. <a href="${exploreLink}">Tous les cas de cette fonction →</a></p></div><div class="explore-card-grid">${picks.map((item) => `<article class="explore-card"><a class="explore-card-link" href="${base}cas/${encodeURIComponent(item.slug || item.id)}/"><div class="explore-card-top"><span class="explore-card-number">CAS DOCUMENTÉ</span></div><h3>${escapeHtml(item.title)}</h3><p class="explore-card-problem">${escapeHtml(item.short_description || item.problem)}</p><span class="explore-card-open">Ouvrir la fiche <b aria-hidden="true">→</b></span></a></article>`).join('')}</div></section>` : `<p class="detail-prose"><a href="${exploreLink}">Voir les cas de votre fonction dans le catalogue →</a></p>`}
      <section class="detail-hocus" aria-labelledby="ad-hocus-title"><div class="detail-hocus-head"><p class="detail-label">ET MAINTENANT ?</p><h2 id="ad-hocus-title">De la tendance au plan d’action</h2><p>Cet autodiagnostic donne une tendance en dix questions. Le Diagnostic Data &amp; IA de HOCUS regarde vos données, vos équipes et vos priorités pour dire quels cas ont du sens chez vous et ce qu’ils rapporteraient.</p></div><div class="detail-hocus-grid"><a class="detail-hocus-card is-entry" href="/works/diagnostic/"><span>1 · ALLER PLUS LOIN</span><strong>Diagnostic Data &amp; IA</strong><p>Un état des lieux et une trajectoire, à partir de votre situation réelle.</p><b>Découvrir ↗</b></a><a class="detail-hocus-card" href="mailto:hello@hocus.works?subject=${encodeURIComponent(`Acolyte — autodiagnostic : ${level.name} (${overall}/100)`)}"><span>2 · EN PARLER</span><strong>Écrire à HOCUS</strong><p>Partager votre résultat et poser vos questions.</p><b>hello@hocus.works ↗</b></a><a class="detail-hocus-card" href="${base}?journey=pme&amp;slide=1"><span>3 · COMPRENDRE</span><strong>Le parcours PME</strong><p>Dix-sept étapes pour voir où l’IA s’insère dans le travail réel.</p><b>Commencer ↗</b></a></div></section>
      <p class="ad-restart"><button class="explore-text-link" type="button" id="ad-restart">Recommencer le questionnaire</button></p>`;
    result.hidden = false;
    result.querySelector('#ad-restart').addEventListener('click', () => { form.reset(); form.dispatchEvent(new Event('change')); result.hidden = true; form.hidden = false; form.querySelector('fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    form.hidden = true;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const missing = [...profile, ...questions].find((q) => !form.querySelector(`input[name="${q.id}"]:checked`));
    form.querySelectorAll('.ad-question').forEach((node) => node.classList.remove('is-missing'));
    if (missing) {
      const node = form.querySelector(`[data-question="${missing.id}"]`);
      node.classList.add('is-missing');
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.querySelector('input')?.focus({ preventScroll: true });
      document.querySelector('#ad-progress').textContent = `Il reste ${total - answered()} question${total - answered() > 1 ? 's' : ''} sans réponse.`;
      return;
    }
    const value = (id) => form.querySelector(`input[name="${id}"]:checked`).value;
    const answers = { function: value('function'), size: value('size') };
    questions.forEach((q) => { answers[q.id] = Number(value(q.id)); });
    render(answers);
  });
})();
