/*
 * Acolyte — le ciel des cas (Opus Lab 35), au-dessus de la grille du catalogue.
 *
 * Chaque cas est une étoile : colonne = famille de fonction métier, hauteur = niveau
 * d'autonomie (assisté en bas, autonome borné en haut), forme = niveau de preuve
 * (étoile pleine : documenté ; losange : retour d'expérience ; cercle creux : cas type).
 * Les filtres et la recherche du catalogue allument les étoiles concernées ; les cas
 * documentés d'une même colonne restent reliés en constellation (arbre couvrant minimal).
 * Survol (ou toucher) : titre de la fiche ; clic (ou second toucher) : ouverture de la fiche.
 * API : window.ACOLYTE_SKY.mount(container, cases, caseHref) puis .update(visibleCases).
 */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const COLUMNS = [
    { label: 'Direction & finance', short: ['Direction', 'finance'], fns: ['general-management', 'finance', 'procurement'] },
    { label: 'Commerce & marketing', short: ['Commerce', 'marketing'], fns: ['sales', 'marketing'] },
    { label: 'Service client', short: ['Service', 'client'], fns: ['customer-service'] },
    { label: 'Opérations & supply', short: ['Opéra-', 'tions'], fns: ['operations', 'supply'] },
    { label: 'IT, data & produit', short: ['IT', 'data'], fns: ['it-data', 'product'] },
    { label: 'RH & autres', short: ['RH', 'autres'], fns: ['hr', 'other', 'unknown'] },
  ];
  const ROWS = [
    { key: 'bounded-autonomous', label: 'Autonome borné' },
    { key: 'supervised-agent', label: 'Agent supervisé' },
    { key: 'semi-autonomous', label: 'Semi-autonome' },
    { key: 'assisted', label: 'Assisté' },
  ];
  const KIND = { documented: 'Cas documenté', experience: 'Retour d’expérience', pattern: 'Cas type' };
  const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function columnOf(item) {
    const fns = [].concat(item.business_function || []);
    const i = COLUMNS.findIndex((c) => fns.some((f) => c.fns.includes(f)));
    return i < 0 ? COLUMNS.length - 1 : i;
  }
  function rowOf(item) { const i = ROWS.findIndex((r) => r.key === item.autonomy_level); return i < 0 ? ROWS.length - 1 : i; }

  function mst(pts) {
    if (pts.length < 2) return [];
    const inTree = new Set([0]); const edges = [];
    while (inTree.size < pts.length) {
      let best = null;
      for (const i of inTree) for (let j = 0; j < pts.length; j++) {
        if (inTree.has(j)) continue;
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (!best || d < best.d) best = { i, j, d };
      }
      inTree.add(best.j); edges.push([pts[best.i], pts[best.j]]);
    }
    return edges;
  }

  function mount(container, cases, caseHref) {
    container.innerHTML = `<div class="sky-frame"><canvas class="sky-canvas" role="img" aria-label="Le ciel des cas : chaque étoile est un cas, placée selon sa fonction métier et son niveau d’autonomie."></canvas><div class="sky-tip" hidden></div></div>
      <div class="sky-legend"><span><i class="k-doc"></i>Cas documenté</span><span><i class="k-exp"></i>Retour d’expérience</span><span><i class="k-pat"></i>Cas type</span><em data-sky-count></em><small>Survolez une étoile, cliquez pour ouvrir la fiche. Les filtres ci-dessous allument le ciel.</small></div>`;
    const canvas = container.querySelector('canvas');
    const tip = container.querySelector('.sky-tip');
    const count = container.querySelector('[data-sky-count]');
    const ctx = canvas.getContext('2d');
    const stars = cases.map((item) => ({ item, col: columnOf(item), row: rowOf(item), u: hash(`${item.id}u`), v: hash(`${item.id}v`), tw: hash(item.id) * TAU, lit: 1, target: 1 }));
    let W = 0; let H = 0; let pad = {}; let hover = null; let pinned = null; let running = false; let visible = false; let t = 0; let edges = [];

    function layout() {
      const r = container.querySelector('.sky-frame').getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(r.width); H = Math.round(r.height);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = W < 640;
      pad = { l: narrow ? 14 : 118, r: 14, t: 16, b: narrow ? 46 : 34 };
      const cw = (W - pad.l - pad.r) / COLUMNS.length; const rh = (H - pad.t - pad.b) / ROWS.length;
      for (const s of stars) {
        s.x = pad.l + cw * (s.col + 0.1 + s.u * 0.8);
        s.y = pad.t + rh * (s.row + 0.12 + s.v * 0.76);
      }
      edges = [];
      COLUMNS.forEach((_, c) => { edges.push(...mst(stars.filter((s) => s.col === c && s.item.evidence_level === 'documented'))); });
      draw();
    }

    function shape(s, a) {
      const lev = s.item.evidence_level; const k = s === hover || s === pinned ? 1.6 : 1;
      if (lev === 'documented') {
        const r = 4.6 * k; ctx.fillStyle = `rgba(245,241,234,${a})`; ctx.beginPath();
        for (let i = 0; i < 8; i++) { const ang = 0.25 + (i / 8) * TAU; const rr = i % 2 ? r * 0.36 : r; ctx.lineTo(s.x + Math.cos(ang) * rr, s.y + Math.sin(ang) * rr); }
        ctx.closePath(); ctx.fill();
        if (a > 0.5) { const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 12 * k); g.addColorStop(0, `rgba(198,165,104,${0.35 * a})`); g.addColorStop(1, 'rgba(198,165,104,0)'); ctx.fillStyle = g; ctx.fillRect(s.x - 12 * k, s.y - 12 * k, 24 * k, 24 * k); }
      } else if (lev === 'experience') {
        const r = 4.4 * k; ctx.fillStyle = `rgba(228,100,68,${a})`; ctx.beginPath(); ctx.moveTo(s.x, s.y - r); ctx.lineTo(s.x + r, s.y); ctx.lineTo(s.x, s.y + r); ctx.lineTo(s.x - r, s.y); ctx.closePath(); ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(198,165,104,${a})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(s.x, s.y, 3.2 * k, 0, TAU); ctx.stroke();
      }
    }

    function draw() {
      if (!W) return;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0b1320'); bg.addColorStop(1, '#141c28'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      const cw = (W - pad.l - pad.r) / COLUMNS.length; const rh = (H - pad.t - pad.b) / ROWS.length; const narrow = W < 640;
      ctx.strokeStyle = 'rgba(245,241,234,.07)'; ctx.lineWidth = 1;
      for (let c = 1; c < COLUMNS.length; c++) { ctx.beginPath(); ctx.moveTo(pad.l + cw * c, pad.t); ctx.lineTo(pad.l + cw * c, H - pad.b); ctx.stroke(); }
      for (let r = 1; r < ROWS.length; r++) { ctx.setLineDash([2, 6]); ctx.beginPath(); ctx.moveTo(pad.l, pad.t + rh * r); ctx.lineTo(W - pad.r, pad.t + rh * r); ctx.stroke(); ctx.setLineDash([]); }
      ctx.font = '9px "SFMono-Regular", Consolas, monospace'; ctx.fillStyle = 'rgba(198,165,104,.8)';
      if (!narrow) { ctx.textAlign = 'right'; ROWS.forEach((r, i) => ctx.fillText(r.label.toUpperCase(), pad.l - 12, pad.t + rh * (i + 0.5) + 3)); }
      else { ctx.save(); ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(198,165,104,.55)'; ctx.fillText('↑ AUTONOMIE', 16, pad.t + 10); ctx.restore(); }
      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(245,241,234,.62)';
      COLUMNS.forEach((c, i) => {
        const x = pad.l + cw * (i + 0.5);
        if (narrow) { ctx.fillText(c.short[0].toUpperCase(), x, H - pad.b + 18); ctx.fillText(c.short[1].toUpperCase(), x, H - pad.b + 30); }
        else ctx.fillText(c.label.toUpperCase(), x, H - pad.b + 20);
      });
      ctx.strokeStyle = 'rgba(198,165,104,.22)'; ctx.lineWidth = 0.8;
      for (const [a, b] of edges) { const k = Math.min(a.lit, b.lit); if (k < 0.3) continue; ctx.globalAlpha = k; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      for (const s of stars) {
        const tw = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 1.3 + s.tw);
        shape(s, Math.max(0.1, s.lit) * (s.lit > 0.5 ? tw : 1));
      }
      const f = pinned || hover;
      if (f) { ctx.strokeStyle = 'rgba(228,100,68,.9)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(f.x, f.y, 11, 0, TAU); ctx.stroke(); }
    }

    function frame(now) {
      if (!running) return;
      t = now / 1000;
      let moving = false;
      for (const s of stars) { const d = s.target - s.lit; if (Math.abs(d) > 0.01) { s.lit += d * 0.14; moving = true; } else s.lit = s.target; }
      draw();
      if (!reduced || moving) requestAnimationFrame(frame); else running = false;
    }
    function start() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }

    function nearest(x, y) {
      let best = null; let bd = 16;
      for (const s of stars) { if (s.lit < 0.5) continue; const d = Math.hypot(s.x - x, s.y - y); if (d < bd) { bd = d; best = s; } }
      return best;
    }
    function showTip(s, withLink) {
      if (!s) { tip.hidden = true; return; }
      const it = s.item;
      tip.innerHTML = `<span>${KIND[it.evidence_level] || 'Cas'} · ${COLUMNS[s.col].label}</span><strong>${it.title.replace(/[<>&]/g, '')}</strong>${withLink ? `<a href="${caseHref(it)}">Ouvrir la fiche →</a>` : '<em>Cliquer pour ouvrir la fiche</em>'}`;
      tip.hidden = false;
      const tw = tip.offsetWidth; const th = tip.offsetHeight;
      tip.style.left = `${Math.min(W - tw - 8, Math.max(8, s.x - tw / 2))}px`;
      tip.style.top = `${s.y - th - 16 < 4 ? s.y + 16 : s.y - th - 16}px`;
    }
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const s = nearest(...pos(e)); if (s !== hover) { hover = s; canvas.style.cursor = s ? 'pointer' : ''; showTip(s, false); draw(); }
    });
    canvas.addEventListener('pointerleave', () => { hover = null; if (!pinned) tip.hidden = true; draw(); });
    canvas.addEventListener('click', (e) => {
      const s = nearest(...pos(e));
      if (!s) { pinned = null; tip.hidden = true; draw(); return; }
      if (e.pointerType === 'mouse' || (e.pointerType === undefined && window.matchMedia('(hover: hover)').matches) || pinned === s) { window.location.href = caseHref(s.item); return; }
      pinned = s; showTip(s, true); draw();
    });

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else running = false; }).observe(canvas);
    new ResizeObserver(layout).observe(container.querySelector('.sky-frame'));
    layout();

    return {
      update(visibleCases) {
        const ids = new Set(visibleCases.map((c) => c.id));
        for (const s of stars) s.target = ids.has(s.item.id) ? 1 : 0.1;
        if (pinned && !ids.has(pinned.item.id)) { pinned = null; tip.hidden = true; }
        count.textContent = `${ids.size} étoile${ids.size > 1 ? 's' : ''} allumée${ids.size > 1 ? 's' : ''} sur ${stars.length}`;
        if (reduced) { for (const s of stars) s.lit = s.target; draw(); } else start();
      },
    };
  }

  window.ACOLYTE_SKY = { mount };
})();
