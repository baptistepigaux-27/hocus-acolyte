(() => {
  'use strict';

  const root = document.querySelector('#tutorial-app');
  if (!root) return;

  const slides = [
    {
      id: 1, act: 'ACTE 01 / CADRER', label: 'INTRODUCTION', visual: 'chapter',
      title: 'Un workflow, pas une boîte noire.',
      intro: 'Pour comprendre un système d’IA, il faut pouvoir suivre ce qu’il reçoit, ce qu’il tente et l’endroit où quelqu’un reprend la main.',
      takeaways: ['Un parcours se lit comme une suite d’actes.', 'Chaque planche porte une seule idée principale.', 'Le schéma montre le mouvement ; le texte donne le recul.'],
      aside: 'Un peu de structure ne nuit pas. Même aux systèmes qui prétendent improviser.'
    },
    {
      id: 2, act: 'ACTE 01 / CADRER', label: 'CONCEPT', visual: 'loop',
      title: 'Comment travaille un agent.',
      intro: 'Un agent ne produit pas seulement une réponse. Il poursuit un objectif à travers une boucle d’actions, d’observations et de décisions.',
      takeaways: ['Objectif avant réponse.', 'Action puis observation.', 'La boucle s’arrête quand le résultat est suffisant.'],
      aside: 'Un chatbot répond. Un agent doit aussi savoir quoi faire ensuite.'
    },
    {
      id: 3, act: 'ACTE 02 / DÉROULER', label: 'WORKFLOW', visual: 'workflow',
      title: 'De la demande à la décision.',
      intro: 'Un workflow lisible rend visible la progression : ce qui est automatique, ce qui est observé et ce qui reste soumis à validation.',
      takeaways: ['Une demande devient un objectif opérable.', 'Les outils produisent des observations.', 'Le livrable n’est pas encore l’exécution.'],
      aside: 'Une flèche bien placée évite parfois une réunion de cadrage.'
    },
    {
      id: 4, act: 'ACTE 02 / DÉROULER', label: 'ÉTAPE 01 / CONTEXTE', visual: 'context',
      title: 'Le contexte évite le travail imaginaire.',
      intro: 'Avant d’agir, l’agent doit savoir pour qui, pourquoi et dans quelles limites il travaille. Le contexte transforme une consigne vague en situation.',
      takeaways: ['Le contexte réduit les suppositions.', 'Une information utile est reliée à l’objectif.', 'Le manque de contexte doit rester visible.'],
      aside: 'Quand l’agent devine, il faut au moins savoir ce qu’il a inventé.'
    },
    {
      id: 5, act: 'ACTE 02 / DÉROULER', label: 'ÉTAPE 02 / OUTILS', visual: 'tools',
      title: 'Les outils font passer l’intention dans le réel.',
      intro: 'Un agent devient opérant quand il peut lire ou écrire dans des systèmes. Chaque outil élargit sa portée — et la surface à contrôler.',
      takeaways: ['Un outil est une permission concrète.', 'La portée doit être proportionnée à la tâche.', 'Lire, proposer et exécuter sont trois niveaux différents.'],
      aside: 'Donner accès à tout n’est pas une architecture. C’est une humeur.'
    },
    {
      id: 6, act: 'ACTE 03 / COMPARER', label: 'COMPARAISON', visual: 'compare',
      title: 'Chatbot ou agent : ce qui change vraiment.',
      intro: 'La différence n’est pas une question de prestige lexical. Elle se voit dans la durée du travail, l’accès aux outils et la place de la validation.',
      takeaways: ['Le chatbot répond à une demande.', 'L’agent poursuit un objectif en plusieurs étapes.', 'Plus d’autonomie implique plus de cadrage.'],
      aside: '“Agent” n’est pas un chatbot qui a pris du galon.'
    },
    {
      id: 7, act: 'ACTE 03 / COMPARER', label: 'PREUVE', visual: 'evidence',
      title: 'Observation, preuve, validation.',
      intro: 'Une bonne démonstration ne montre pas seulement un résultat. Elle distingue ce qui a été observé, rapporté, projeté et finalement validé.',
      takeaways: ['Une observation est située.', 'Une source n’est pas une validation.', 'Le niveau de preuve accompagne toujours le résultat.'],
      aside: 'Une réponse convaincante n’est pas encore une preuve. Désolé pour l’ambiance.'
    },
    {
      id: 8, act: 'ACTE 04 / REPRENDRE LA MAIN', label: 'HUMAN GATE', visual: 'gate',
      title: 'Le point où l’humain reprend la main.',
      intro: 'La validation humaine n’est pas une décoration de conformité. C’est un moment explicite où l’on peut valider, modifier ou annuler.',
      takeaways: ['Le système prépare avant d’exécuter.', 'Le geste sensible est nommé.', 'Annuler reste une option réelle.'],
      aside: 'L’autonomie est pratique. Les boutons “modifier” et “annuler” aussi.'
    },
    {
      id: 9, act: 'ACTE 05 / LIRE UN CAS', label: 'CAS GUIDÉ / RIS', visual: 'case',
      title: 'La mémoire utile est une connaissance retrouvable.',
      intro: 'Dans ce cas de support, les FAQ, manuels et historiques alimentent une recherche qui propose une réponse. L’équipe garde la main sur les exceptions.',
      takeaways: ['La mémoire est reliée à une source.', 'La recherche alimente un processus.', 'Le support complexe reste un travail humain.'],
      aside: 'Un souvenir vague n’est pas une base de connaissances. C’est juste un souvenir vague.'
    },
    {
      id: 10, act: 'ACTE 06 / SYNTHÉTISER', label: 'À RETENIR', visual: 'summary',
      title: 'Ce qu’il faut garder avant de construire.',
      intro: 'Un tutoriel utile ne se termine pas par une conclusion décorative. Il laisse une grille de lecture réutilisable sur le prochain problème.',
      takeaways: ['Définir l’objectif.', 'Rendre le contexte et les outils visibles.', 'Observer avant de conclure.', 'Placer la validation au bon endroit.', 'Commencer petit, puis mesurer.'],
      aside: 'Le meilleur workflow est souvent celui que l’équipe comprend encore le mois suivant.'
    }
  ];
  const total = slides.length;
  const initialSlide = Number(new URLSearchParams(window.location.search).get('slide')) || 1;
  const state = {
    slide: Math.min(total, Math.max(1, initialSlide)),
    indexOpen: false,
    explore: new URLSearchParams(window.location.search).get('mode') === 'explore',
    focus: null
  };
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

  function currentSlide() { return slides[state.slide - 1]; }

  function routeUrl(slide = state.slide) {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('slide', String(slide));
    if (state.explore) url.searchParams.set('mode', 'explore');
    return url;
  }

  function updateUrl() { window.history.replaceState({}, '', routeUrl()); }

  function node(label, key, copy, className = '') {
    const isFocused = state.focus === key;
    return `<button type="button" class="tuto-node ${className} ${isFocused ? 'is-focused' : ''}" data-node="${escapeHtml(key)}" aria-label="${escapeHtml(label)}"><span>${escapeHtml(label)}</span>${state.explore && isFocused ? `<small>${escapeHtml(copy)}</small>` : ''}</button>`;
  }

  function arrow(label = '↓') { return `<i class="tuto-arrow" aria-hidden="true">${label}</i>`; }

  function renderDiagram(slide) {
    if (slide.visual === 'chapter') return `<div class="tuto-chapter-diagram"><span class="tuto-giant-number">01</span><div class="tuto-chapter-rule"></div><span class="tuto-diagram-label">CADRER / DÉFINIR LE TERRAIN</span><strong>CONCEPT<br>→<br>WORKFLOW<br>→<br>VALIDATION</strong><small>3 actes · 10 planches · 1 fil conducteur</small></div>`;
    if (slide.visual === 'loop') return `<div class="tuto-loop-diagram"><div class="tuto-loop-orbit"><span class="tuto-orbit-label">AGENT LOOP</span>${node('OBJECTIF', 'objective', 'Ce qui doit être obtenu.', 'is-primary')}${node('PLAN', 'plan', 'La prochaine action choisie.', '')}${node('ACTION', 'action', 'Un outil est appelé dans un cadre.', '')}${node('OBSERVATION', 'observation', 'Le résultat de l’action revient dans la boucle.', '')}<b>SUFFISANT ?</b></div><p class="tuto-diagram-caption">PLAN → ACTION → OBSERVATION → NOUVELLE ACTION</p></div>`;
    if (slide.visual === 'workflow') return `<div class="tuto-workflow-diagram"><span class="tuto-diagram-label">DEMANDE → DÉCISION</span><div class="tuto-workflow-row">${node('DEMANDE', 'request', 'Un signal ou un besoin entre dans le système.', 'is-primary')}${arrow('→')}${node('OBJECTIF', 'goal', 'La demande devient un résultat attendu.', '')}${arrow('→')}${node('PLAN', 'plan-flow', 'Les étapes sont ordonnées.', '')}</div><div class="tuto-workflow-row">${node('OUTILS', 'tools-flow', 'Le système lit ou prépare.', '')}${arrow('→')}${node('OBSERVATION', 'observe-flow', 'Le résultat est rendu visible.', '')}${arrow('→')}${node('DÉCISION', 'decision', 'Un humain valide la suite.', 'is-gate')}</div><div class="tuto-connector-line"></div><p class="tuto-diagram-caption">La flèche ne cache pas les étapes intermédiaires.</p></div>`;
    if (slide.visual === 'context') return `<div class="tuto-context-diagram"><span class="tuto-diagram-label">CONTEXTE / CE QUI ENTRE</span><div class="tuto-context-source">${node('OBJECTIF', 'context-goal', 'Le résultat attendu.', 'is-primary')}${arrow()}${node('PERSONNE', 'context-person', 'Pour qui le travail est fait.', '')}${arrow()}${node('LIMITES', 'context-limits', 'Ce qui ne doit pas arriver.', '')}</div><div class="tuto-context-frame"><span>CADRE DE TRAVAIL</span><strong>Ce que l’agent sait<br>avant d’agir.</strong><small>Sources · règles · niveau d’accès</small></div><p class="tuto-diagram-caption">Sans contexte, l’agent remplit les blancs.</p></div>`;
    if (slide.visual === 'tools') return `<div class="tuto-tools-diagram"><span class="tuto-diagram-label">OUTILS / PORTÉE D’ACTION</span><div class="tuto-tools-orbit"><div class="tuto-tool tool-crm">CRM<br><small>LIRE</small></div><div class="tuto-tool tool-mail">EMAIL<br><small>PRÉPARER</small></div><div class="tuto-tool tool-search">SEARCH<br><small>RECHERCHER</small></div><div class="tuto-tool tool-finance">FINANCE<br><small>VALIDER</small></div><div class="tuto-tools-core">${node('AGENT', 'tools-agent', 'Une capacité organisée par un objectif.', 'is-primary')}<span>PERMISSIONS<br>VISIBLES</span></div></div><p class="tuto-diagram-caption">LIRE ≠ PROPOSER ≠ EXÉCUTER</p></div>`;
    if (slide.visual === 'compare') return `<div class="tuto-compare-diagram"><span class="tuto-diagram-label">DEUX MODES DE TRAVAIL</span><div class="tuto-compare-columns"><div><header>CHATBOT</header>${['Reçoit une question', 'Produit une réponse', 'Attend la prochaine demande', 'Accès limité ou absent'].map((item, index) => `<p><b>0${index + 1}</b>${item}</p>`).join('')}</div><div class="is-agent"><header>AGENT</header>${['Reçoit un objectif', 'Construit un plan', 'Observe et recommence', 'Agit dans un cadre'].map((item, index) => `<p><b>0${index + 1}</b>${item}</p>`).join('')}</div></div><p class="tuto-diagram-caption">La différence se lit dans la boucle, pas dans le badge.</p></div>`;
    if (slide.visual === 'evidence') return `<div class="tuto-evidence-diagram"><span class="tuto-diagram-label">NIVEAUX DE CONFIANCE</span><div class="tuto-evidence-stack"><div>${node('OBSERVÉ', 'observed', 'Ce qui est documenté dans le cas.', 'is-primary')}<small>source / trace / date</small></div><div>${node('RAPPORTÉ', 'reported', 'Ce qui est déclaré par une partie prenante.', '')}<small>source / caveat</small></div><div>${node('PROJETÉ', 'projected', 'Ce qui reste une hypothèse ou une promesse.', '')}<small>à vérifier / à mesurer</small></div></div><div class="tuto-evidence-meter"><span>FAIBLE</span><i></i><span>FORT</span></div><p class="tuto-diagram-caption">Une source renseigne le niveau de preuve. Elle ne l’efface pas.</p></div>`;
    if (slide.visual === 'gate') return `<div class="tuto-gate-diagram"><span class="tuto-diagram-label">HUMAN GATE / ACTION SENSIBLE</span><div class="tuto-gate-path"><div class="tuto-gate-card">${node('PRÉPARER', 'prepare', 'L’agent rassemble le contexte et propose une action.', 'is-primary')}<small>aucune action distante</small></div>${arrow('→')}<div class="tuto-gate-card is-gate">${node('VALIDER', 'validate', 'Une personne confirme que l’action est correcte.', 'is-gate')}<small>moment explicite</small></div>${arrow('→')}<div class="tuto-gate-card">${node('EXÉCUTER', 'execute', 'Le système agit seulement après accord.', '')}<small>trace conservée</small></div></div><div class="tuto-gate-actions"><button type="button">VALIDER</button><button type="button">MODIFIER</button><button type="button">ANNULER</button></div><p class="tuto-diagram-caption">Le contrôle est une étape, pas une note de bas de page.</p></div>`;
    if (slide.visual === 'case') return `<div class="tuto-case-diagram"><span class="tuto-diagram-label">RIS / SUPPORT AUGMENTÉ</span><div class="tuto-case-flow">${node('FAQ + MANUELS', 'ris-sources', 'La connaissance existante est rassemblée.', 'is-primary')}${arrow()}${node('RAG / SEARCH', 'ris-search', 'Les passages pertinents sont retrouvés.', '')}${arrow()}${node('RÉPONSE PROPOSÉE', 'ris-answer', 'Une réponse est préparée pour le support.', '')}${arrow()}${node('EXCEPTION', 'ris-human', 'Le cas complexe revient à l’équipe.', 'is-gate')}</div><div class="tuto-case-proof"><span>CAS RÉEL / RIS D.O.O.</span><strong>La mémoire devient utile quand elle est retrouvable.</strong><small>Projet rapporté · pilote · gains long terme à qualifier</small></div></div>`;
    return `<div class="tuto-summary-diagram"><span class="tuto-diagram-label">LA GRILLE À EMPORTER</span><div>${['OBJECTIF', 'CONTEXTE', 'OUTILS', 'OBSERVATION', 'HUMAN GATE'].map((item, index) => `<span><b>0${index + 1}</b>${item}</span>`).join('')}</div><p class="tuto-diagram-caption">Une bonne planche donne envie de passer à la suivante.</p></div>`;
  }

  function renderTakeaways(slide) {
    return `<section class="tuto-takeaways"><div class="tuto-section-label">À RETENIR</div>${slide.takeaways.map((item, index) => `<div><b>0${index + 1}</b><span>${escapeHtml(item)}</span></div>`).join('')}</section>`;
  }

  function renderIndex() {
    if (!state.indexOpen) return '';
    return `<div class="tuto-index-backdrop" data-action="close-index"></div><aside class="tuto-index" aria-label="Sommaire"><div class="tuto-index-head"><span>SOMMAIRE / 10 PLANCHES</span><button type="button" data-action="close-index">FERMER ×</button></div>${slides.map((item) => `<button type="button" class="${item.id === state.slide ? 'is-active' : ''}" data-slide="${item.id}"><b>0${item.id}</b><span><small>${escapeHtml(item.act)}</small>${escapeHtml(item.title)}</span><i>${escapeHtml(item.label)}</i></button>`).join('')}</aside>`;
  }

  function render() {
    const slide = currentSlide();
    document.body.classList.toggle('is-explore', state.explore);
    root.innerHTML = `<div class="tuto-shell"><header class="tuto-topbar"><a class="tuto-brand" href="?slide=1"><span class="tuto-brand-mark">✦</span><span>HOCUS / ACOLYTE</span></a><div class="tuto-breadcrumb"><span>TUTORIAL BOARDS</span><strong>${escapeHtml(slide.act)}</strong></div><nav class="tuto-nav" aria-label="Tutoriel"><button type="button" data-action="toggle-index">SOMMAIRE</button><button type="button" data-action="toggle-mode">${state.explore ? 'MODE LECTURE' : 'EXPLORER'}</button><a href="../">UX LAB ↗</a></nav><div class="tuto-nav-arrows"><button type="button" data-action="previous" ${state.slide === 1 ? 'disabled' : ''} aria-label="Planche précédente">←</button><span>${String(state.slide).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span><button type="button" data-action="next" ${state.slide === total ? 'disabled' : ''} aria-label="Planche suivante">→</button></div></header><div class="tuto-progress" aria-label="Progression"><i style="width:${(state.slide / total) * 100}%"></i></div><main class="tuto-main" tabindex="-1"><div class="tuto-board-meta"><span>${escapeHtml(slide.act)}</span><span>${escapeHtml(slide.label)}</span><span>PLANCHE ${String(slide.id).padStart(2, '0')}</span></div><section class="tuto-board"><div class="tuto-diagram" aria-label="Schéma pédagogique">${renderDiagram(slide)}</div><article class="tuto-reading"><div class="tuto-reading-kicker"><span>${escapeHtml(slide.label)}</span><span>${state.explore ? 'MODE EXPLORATION' : 'MODE LECTURE'}</span></div><h1>${escapeHtml(slide.title)}</h1><p class="tuto-intro">${escapeHtml(slide.intro)}</p>${renderTakeaways(slide)}<aside class="tuto-aside"><span>NOTE DE TERRAIN</span><strong>CORTEX</strong><p>“${escapeHtml(slide.aside)}”</p></aside><div class="tuto-board-actions"><button type="button" class="tuto-button" data-action="previous" ${state.slide === 1 ? 'disabled' : ''}>← PRÉCÉDENT</button><button type="button" class="tuto-button tuto-button-primary" data-action="next" ${state.slide === total ? 'disabled' : ''}>${state.slide === total ? 'TERMINÉ' : 'SUIVANT →'}</button></div></article></section><footer class="tuto-footer"><span>LEARN / TUTORIAL BOARDS</span><span>Un format réplicable pour concepts, workflows et cas guidés.</span><a href="../">SORTIR VERS EXPLORER ↗</a></footer></main>${renderIndex()}</div>`;
    bindEvents();
  }

  function goTo(slide) {
    state.slide = Math.min(total, Math.max(1, slide));
    state.focus = null;
    state.indexOpen = false;
    updateUrl();
    render();
    $('.tuto-main')?.focus();
  }

  function bindEvents() {
    document.querySelectorAll('[data-action="previous"]').forEach((button) => button.addEventListener('click', () => goTo(state.slide - 1)));
    document.querySelectorAll('[data-action="next"]').forEach((button) => button.addEventListener('click', () => goTo(state.slide + 1)));
    document.querySelectorAll('[data-action="toggle-index"]').forEach((button) => button.addEventListener('click', () => { state.indexOpen = !state.indexOpen; render(); }));
    document.querySelectorAll('[data-action="close-index"]').forEach((button) => button.addEventListener('click', () => { state.indexOpen = false; render(); }));
    document.querySelector('[data-action="toggle-mode"]')?.addEventListener('click', () => { state.explore = !state.explore; state.focus = null; updateUrl(); render(); });
    document.querySelectorAll('[data-slide]').forEach((button) => button.addEventListener('click', () => goTo(Number(button.dataset.slide))));
    document.querySelectorAll('[data-node]').forEach((button) => button.addEventListener('click', () => { state.focus = button.dataset.node; render(); }));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); goTo(state.slide + 1); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); goTo(state.slide - 1); }
    if (event.key === 'Home') { event.preventDefault(); goTo(1); }
    if (event.key === 'End') { event.preventDefault(); goTo(total); }
    if (event.key === 'Escape' && state.indexOpen) { state.indexOpen = false; render(); }
  });

  render();
})();
