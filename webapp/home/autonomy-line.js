/*
 * Acolyte — « Où en est votre équipe ? » (Opus Lab 35) : la ligne de métro de l'autonomie.
 *
 * Cinq stations, de l'assistant à l'outil métier (les familles de solutions du catalogue).
 * Toucher une station y conduit la rame et ouvre son quai : ce que cela veut dire, l'étape du
 * parcours PME qui l'explique, trois cas du catalogue (documentés d'abord) et le Diagnostic.
 * Données : explore/data/cases-index.json (index léger).
 */
(() => {
  'use strict';
  const root = document.querySelector('[data-autonomy-line]');
  if (!root) return;
  const STATIONS = [
    { key: 'knowledge', name: 'Assistant', line: 'Interroger ses documents', text: 'Vos équipes posent des questions à vos procédures, vos contrats, votre historique, et obtiennent des réponses sourcées.', you: 'vous cherchez surtout à retrouver l’information.', slide: 6, slideTitle: 'Quand l’IA connaît l’entreprise' },
    { key: 'copilot', name: 'Copilote', line: 'L’IA prépare, vous décidez', text: 'L’IA rédige, résume, compare et prépare ; la personne relit, corrige et reste responsable du résultat.', you: 'chacun utilise déjà l’IA dans son travail, sans cadre commun.', slide: 5, slideTitle: 'Individu augmenté' },
    { key: 'workflow', name: 'Chaîne automatisée', line: 'Un processus qui tourne', text: 'Un traitement récurrent (factures, demandes, relances) s’exécute seul, avec des règles et des points de contrôle.', you: 'une tâche répétitive mobilise du temps chaque semaine.', slide: 7, slideTitle: 'Quand l’IA entre dans le processus' },
    { key: 'agent', name: 'Agent', line: 'Plusieurs étapes vers un objectif', text: 'L’IA choisit ses étapes et ses outils pour atteindre un objectif, dans un cadre autorisé et sous validation humaine.', you: 'le travail demande de chercher, croiser et agir dans plusieurs outils.', slide: 9, slideTitle: 'Un agent métier, borné et vérifiable' },
    { key: 'product', name: 'Outil métier', line: 'Un système utilisé par les équipes', text: 'L’IA devient un outil à part entière, avec ses utilisateurs, ses données, sa mesure et son exploitation.', you: 'l’usage est récurrent, partagé et doit être mesuré.', slide: 10, slideTitle: 'Quand construire un outil métier ?' },
  ];
  window.ACOLYTE_STATIONS = STATIONS;
  const RANK = { documented: 0, experience: 1, pattern: 2 };
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
  let cases = [];
  let active = 1;

  root.innerHTML = `<ol class="al-line" role="list">${STATIONS.map((s, i) => `<li><button type="button" class="al-station" data-station="${i}" aria-pressed="false"><i aria-hidden="true"></i><span class="al-num">${String(i + 1).padStart(2, '0')}</span><strong>${s.name}</strong><small>${s.line}</small></button></li>`).join('')}</ol><span class="al-train" aria-hidden="true"></span><div class="al-platform" aria-live="polite"></div>`;
  const buttons = [...root.querySelectorAll('.al-station')];
  const train = root.querySelector('.al-train');
  const platform = root.querySelector('.al-platform');

  function picks(key) {
    const list = cases.filter((c) => c.solution === key).sort((a, b) => (RANK[a.evidence] ?? 3) - (RANK[b.evidence] ?? 3));
    const seen = new Set(); const out = [];
    for (const c of list) { if (out.length === 3) break; if (c.evidence === 'documented' && seen.has(c.industry)) continue; seen.add(c.industry); out.push(c); }
    for (const c of list) { if (out.length === 3) break; if (!out.includes(c)) out.push(c); }
    return { out, total: list.length, documented: list.filter((c) => c.evidence === 'documented').length };
  }

  function placeTrain() {
    const b = buttons[active].querySelector('i');
    const r = b.getBoundingClientRect(); const o = root.getBoundingClientRect();
    train.style.transform = `translate(${r.left + r.width / 2 - o.left}px, ${r.top + r.height / 2 - o.top}px)`;
  }

  function render() {
    const s = STATIONS[active];
    buttons.forEach((b, i) => { b.setAttribute('aria-pressed', String(i === active)); b.classList.toggle('is-passed', i < active); });
    placeTrain();
    const { out, total, documented } = picks(s.key);
    platform.innerHTML = `<div class="al-platform-head"><p class="al-kicker">STATION ${String(active + 1).padStart(2, '0')} · ${esc(s.name.toLocaleUpperCase('fr'))}</p><h3>${esc(s.line)}</h3><p>${esc(s.text)}</p><p class="al-you"><b>Vous en êtes là si</b> ${esc(s.you)}</p></div>
      <div class="al-platform-cases"><p class="al-kicker">${total ? `${total} CAS AU CATALOGUE · ${documented} DOCUMENTÉS` : 'CAS AU CATALOGUE'}</p>${out.map((c) => `<a href="cas/${encodeURIComponent(c.slug)}/"><span>${c.evidence === 'documented' ? 'Cas documenté' : c.evidence === 'experience' ? 'Retour d’expérience' : 'Cas type'}</span><strong>${esc(c.title)}</strong></a>`).join('')}<a class="al-all" href="explore/?solution_type=${s.key}">Voir les ${total} cas →</a></div>
      <div class="al-platform-go"><a class="al-journey" href="?journey=pme&amp;slide=${s.slide}"><span>PARCOURS PME · ÉTAPE ${String(s.slide).padStart(2, '0')}</span><strong>${esc(s.slideTitle)} →</strong></a><a class="al-diag" href="/works/diagnostic/"><span>SITUER VOTRE ÉQUIPE</span><strong>Diagnostic Data &amp; IA ↗</strong></a></div>`;
  }

  buttons.forEach((b, i) => b.addEventListener('click', () => { active = i; render(); }));
  window.addEventListener('resize', placeTrain);
  new ResizeObserver(placeTrain).observe(root);
  render();
  fetch('explore/data/cases-index.json').then((r) => r.json()).then((data) => { cases = data; render(); }).catch(() => {});
})();
