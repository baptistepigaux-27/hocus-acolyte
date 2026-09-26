/*
 * Acolyte — le hero vivant (Opus Lab 35, pistes A + C du 26/09/2026).
 *
 * A. La fin du titre change de métier toutes les ~4 s, retapée à la machine à écrire
 *    (« … pour votre service client », « … pour vos commerciaux »…), et la carte voisine
 *    montre un cas documenté du catalogue pour ce métier, avec son lien.
 * C. « Que voulez-vous faire avec l’IA ? » : des exemples se tapent seuls dans le champ vide ;
 *    dès qu'on écrit, trois cas remontent, avec la station de la ligne de l'autonomie la plus
 *    probable et l'étape du parcours PME qui l'explique. Entrée : le catalogue filtré (?q=).
 * Données : explore/data/cases-index.json. Mouvement réduit : ni frappe ni rotation.
 */
(() => {
  'use strict';
  const metierEl = document.querySelector('[data-hero-metier]');
  const caseEl = document.querySelector('[data-hero-case]');
  const form = document.querySelector('[data-hero-ask]');
  if (!metierEl || !form) return;
  const input = form.querySelector('input');
  const results = form.querySelector('[data-hero-results]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
  const fold = (v) => String(v || '').toLocaleLowerCase('fr').normalize('NFD').replace(/[̀-ͯ]/g, '');

  const METIERS = [
    { fn: 'customer-service', text: 'pour votre service client', label: 'Service client' },
    { fn: 'sales', text: 'pour vos commerciaux', label: 'Commerce' },
    { fn: 'finance', text: 'pour votre direction financière', label: 'Finance' },
    { fn: 'operations', text: 'pour vos opérations', label: 'Opérations' },
    { fn: 'marketing', text: 'pour votre marketing', label: 'Marketing' },
    { fn: 'hr', text: 'pour vos équipes RH', label: 'Ressources humaines' },
    { fn: 'supply', text: 'pour votre supply chain', label: 'Supply chain' },
    { fn: 'it-data', text: 'pour vos équipes data', label: 'IT / Data' },
  ];
  const EXAMPLES = ['préparer un CODIR', 'répondre à un appel d’offres', 'trier les demandes clients', 'prévoir la demande', 'rédiger des fiches produits', 'contrôler des factures', 'retrouver une décision'];
  const KIND = { documented: 'Cas documenté', experience: 'Retour d’expérience', pattern: 'Cas type' };
  const STOP = new Set(['un', 'une', 'des', 'les', 'le', 'la', 'de', 'du', 'd', 'l', 'a', 'et', 'en', 'pour', 'avec', 'mes', 'nos', 'vos', 'mon', 'ma', 'notre', 'votre', 'au', 'aux', 'sur', 'par', 'ia']);
  let cases = [];

  /* ---------- A. Le métier du titre et sa carte ---------- */
  let metiers = METIERS;
  let mi = 0; let pickIndex = 0;
  function typeInto(el, text, done) {
    if (reduced) { el.textContent = text; done?.(); return; }
    const from = el.textContent;
    let i = from.length;
    el.classList.add('is-typing');
    const erase = setInterval(() => {
      i -= 2; el.textContent = from.slice(0, Math.max(0, i));
      if (i <= 0) {
        clearInterval(erase); let j = 0;
        const write = setInterval(() => { j += 1; el.textContent = text.slice(0, j); if (j >= text.length) { clearInterval(write); el.classList.remove('is-typing'); done?.(); } }, 38);
      }
    }, 22);
  }
  function caseFor(m) {
    const primary = cases.filter((c) => c.evidence === 'documented' && c.functions[0] === m.fn);
    const list = primary.length ? primary : cases.filter((c) => c.evidence === 'documented' && c.functions.includes(m.fn));
    return list.length ? list[(pickIndex + list.length) % list.length] : null;
  }
  function showCase(m) {
    const c = caseFor(m);
    if (!c || !caseEl) return;
    caseEl.classList.remove('is-in');
    void caseEl.offsetWidth;
    caseEl.innerHTML = `<p class="hero-case-kicker">CAS DOCUMENTÉ · ${esc(m.label.toLocaleUpperCase('fr'))}</p><strong>${esc(c.title)}</strong><p>${esc(c.short)}</p><a href="cas/${encodeURIComponent(c.slug)}/">Lire la fiche <span aria-hidden="true">→</span></a>`;
    caseEl.classList.add('is-in');
  }
  let paused = false;
  function rotate() {
    if (paused || document.hidden) return;
    mi = (mi + 1) % metiers.length; if (mi === 0) pickIndex += 1;
    const m = metiers[mi];
    typeInto(metierEl, m.text, () => showCase(m));
  }
  caseEl?.addEventListener('pointerenter', () => { paused = true; });
  caseEl?.addEventListener('pointerleave', () => { paused = false; });
  caseEl?.addEventListener('focusin', () => { paused = true; });
  caseEl?.addEventListener('focusout', () => { paused = false; });

  /* ---------- C. La question vivante ---------- */
  let exampleTimer = null; let exampleIndex = 0; let typing = false;
  function animatePlaceholder() {
    if (reduced) { input.placeholder = `Par exemple : ${EXAMPLES[0]}`; return; }
    const run = () => {
      if (input.value || document.activeElement === input) { exampleTimer = setTimeout(run, 1500); return; }
      const text = `Par exemple : ${EXAMPLES[exampleIndex++ % EXAMPLES.length]}`;
      let i = 0; typing = true;
      const step = () => {
        if (input.value || document.activeElement === input) { typing = false; input.placeholder = 'Décrivez une tâche, un problème, un métier…'; exampleTimer = setTimeout(run, 1500); return; }
        input.placeholder = text.slice(0, ++i);
        if (i < text.length) exampleTimer = setTimeout(step, 45); else { typing = false; exampleTimer = setTimeout(run, 2200); }
      };
      step();
    };
    run();
  }

  function search(q) {
    const tokens = fold(q).split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOP.has(t));
    if (!tokens.length) return [];
    return cases.map((c) => {
      const title = fold(c.title); const body = fold(`${c.short} ${c.functions.join(' ')}`);
      let score = 0;
      for (const t of tokens) { const stem = t.length > 5 ? t.slice(0, t.length - 2) : t; if (title.includes(stem)) score += 3; else if (body.includes(stem)) score += 1; }
      if (score && c.evidence === 'documented') score += 0.5;
      return { c, score };
    }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
  }

  function renderResults() {
    const q = input.value.trim();
    if (q.length < 3 || !cases.length) { results.hidden = true; results.innerHTML = ''; return; }
    const found = search(q);
    const stations = window.ACOLYTE_STATIONS || [];
    if (!found.length) {
      results.hidden = false;
      results.innerHTML = `<p class="hero-ask-empty">Aucun cas ne correspond encore à « ${esc(q)} ». C’est justement l’objet du <a href="/works/diagnostic/">Diagnostic Data &amp; IA ↗</a> : partir de votre situation.</p>`;
      return;
    }
    const top = found.slice(0, 3).map((r) => r.c);
    const votes = {}; found.slice(0, 8).forEach((r) => { votes[r.c.solution] = (votes[r.c.solution] || 0) + r.score; });
    const best = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0];
    const station = stations.find((s) => s.key === best);
    results.hidden = false;
    results.innerHTML = `<div class="hero-ask-cases">${top.map((c) => `<a href="cas/${encodeURIComponent(c.slug)}/"><span>${esc(KIND[c.evidence] || 'Cas')}</span><strong>${esc(c.title)}</strong></a>`).join('')}</div>
      <div class="hero-ask-meta">${station ? `<a class="hero-ask-station" href="?journey=pme&amp;slide=${station.slide}"><span>PLUTÔT ${station.key === 'workflow' ? 'UNE' : 'UN'} ${esc(station.name.toLocaleUpperCase('fr'))}</span><strong>${esc(station.slideTitle)} →</strong></a>` : ''}<a class="hero-ask-all" href="explore/?q=${encodeURIComponent(q)}">Voir les ${found.length} cas →</a></div>`;
  }
  let debounce = null;
  input.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(renderResults, 120); });
  form.querySelectorAll('[data-hero-try]').forEach((b) => b.addEventListener('click', () => { input.value = b.textContent; renderResults(); input.focus(); }));

  /* ---------- Démarrage ---------- */
  animatePlaceholder();
  fetch('explore/data/cases-index.json').then((r) => r.json()).then((data) => {
    cases = data;
    metiers = METIERS.filter((m) => cases.some((c) => c.evidence === 'documented' && c.functions.includes(m.fn)));
    if (!metiers.length) return;
    mi = -1;
    if (reduced) { mi = 0; metierEl.textContent = metiers[0].text; showCase(metiers[0]); return; }
    setTimeout(() => { rotate(); setInterval(rotate, 4200); }, 1400);
    if (input.value) renderResults();
  }).catch(() => {});
})();
