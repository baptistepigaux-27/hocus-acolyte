/*
 * Acolyte — « L'équation » (Opus Lab 35) : la thèse d'Acolyte se construit au défilement.
 *
 * Une question est posée à un chat. À chaque cran de défilement, une pièce rejoint l'orrery
 * autour du modèle (contexte, mémoire, outils, agents, validation humaine) et la réponse
 * s'améliore, retapée à la machine à écrire. À la fin, le cœur devient « SYSTÈME IA ».
 * Exemple fictif (Durand SA). Mouvement réduit : état final, sans défilement collant.
 */
(() => {
  'use strict';
  const section = document.querySelector('[data-equation]');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEPS = [
    { key: 'model', label: 'Un modèle seul', caption: 'Il répond à la question posée, avec ce qu’il sait du monde.',
      reply: 'Voici une trame de rendez-vous : présentation, recueil des besoins, prochaines étapes.' },
    { key: 'context', label: 'Contexte', caption: 'Le dossier du client, l’objectif du rendez-vous, les contraintes.',
      reply: 'Pour Durand SA : trois sites, un litige en mars, un contrat à renouveler fin octobre. Objectif : sécuriser le renouvellement.' },
    { key: 'memory', label: 'Mémoire', caption: 'Ce qui a été décidé, essayé, laissé en suspens.',
      reply: 'Comme décidé le 12 juin, on ne repropose pas l’offre Premium. Reste à trancher le volume annuel.' },
    { key: 'tools', label: 'Outils', caption: 'Le CRM, les factures, les documents : consulter, calculer, vérifier.',
      reply: 'J’ai relu les factures et le dernier échange CRM : le volume a baissé de 12 %, surtout sur le site de Lyon.' },
    { key: 'agents', label: 'Agents', caption: 'Plusieurs étapes enchaînées vers un objectif, dans un cadre autorisé.',
      reply: 'Brief, note de synthèse et projet de mail de relance sont prêts, sources jointes.' },
    { key: 'human', label: 'Validation humaine', caption: 'Ce qui engage l’entreprise attend une décision explicite.',
      reply: 'Le mail de relance attend votre validation avant envoi. Rien ne part sans vous.' },
  ];

  const $ = (sel) => section.querySelector(sel);
  const reply = $('[data-eq-reply]');
  const core = $('[data-eq-core]');
  const stepsList = $('[data-eq-steps]');
  const caption = $('[data-eq-caption]');
  const pieces = [...section.querySelectorAll('[data-eq-piece]')];
  stepsList.innerHTML = STEPS.map((s, i) => `<li data-eq-step="${i}"><span>${String(i).padStart(2, '0')}</span>${s.label}</li>`).join('');
  const stepItems = [...stepsList.children];

  let current = -1;
  let typing = null;
  function type(text) {
    if (typing) clearInterval(typing);
    if (reduced) { reply.textContent = text; return; }
    let i = 0;
    reply.textContent = '';
    reply.classList.add('is-typing');
    typing = setInterval(() => {
      i += 2;
      reply.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(typing); typing = null; reply.classList.remove('is-typing'); }
    }, 16);
  }
  function setStep(n) {
    if (n === current) return;
    current = n;
    section.dataset.step = String(n);
    stepItems.forEach((li, i) => { li.classList.toggle('is-done', i < n); li.classList.toggle('is-active', i === n); });
    pieces.forEach((p) => p.classList.toggle('is-in', Number(p.dataset.eqPiece) <= n));
    caption.textContent = STEPS[n].caption;
    core.innerHTML = n === STEPS.length - 1 ? 'SYSTÈME<br><em>IA</em>' : 'MODÈLE';
    core.classList.toggle('is-system', n === STEPS.length - 1);
    type(STEPS[n].reply);
  }

  if (reduced) { section.classList.add('is-static'); setStep(STEPS.length - 1); return; }
  const track = $('.eq-track');
  /* La zone collante démarre sous l'en-tête (collant lui aussi, plus haut sur mobile). */
  const header = document.querySelector('.topbar');
  const setHeader = () => section.style.setProperty('--hdr', `${header ? Math.round(header.getBoundingClientRect().height) : 0}px`);
  setHeader();
  window.addEventListener('resize', setHeader);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 1;
      section.style.setProperty('--eq-p', p.toFixed(3));
      setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999)));
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
