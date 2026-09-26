/*
 * Acolyte — « La fenêtre embuée » (Opus Lab 35), slide 7 du parcours « Du chatbot au système ».
 *
 * Derrière la vitre, le projet tel qu'on l'avait laissé il y a trois semaines (décision,
 * méthode, sources, points ouverts). Sans mémoire, la buée recouvre tout et revient quand on
 * l'essuie du doigt : c'est l'oubli. Des gouttes glissent et laissent un sillon net qui se
 * referme. Avec mémoire, les éléments se collent sur la vitre, nets, par-dessus la buée.
 * Mouvement réduit : buée fixe, sans gouttes ni retour de la buée.
 */
(() => {
  'use strict';
  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);

  function mount(root, slide) {
    const config = slide.interaction || {};
    const items = [
      ...(config.memories || []).map((m) => ({ tag: m.kind, date: m.date, text: m.detail || m.summary })),
      { tag: 'SOURCES', date: '18 JUIN', text: 'Trois documents de référence, dont l’étude de marché et le compte rendu client.' },
      { tag: 'POINT OUVERT', date: '19 JUIN', text: 'Le volume annuel reste à trancher avec la direction commerciale.' },
    ];
    root.innerHTML = '';
    root.classList.add('memory-window-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation : la mémoire de travail, derrière une vitre embuée');
    root.innerHTML = `<div class="mw-head"><span class="interaction-kicker">TROIS SEMAINES PLUS TARD</span><strong>${esc(config.scenario || 'Vous reprenez le projet.')}</strong></div>
      <div class="mw-modes" role="group" aria-label="Mémoire"><button type="button" data-mw="without" aria-pressed="true">Sans mémoire</button><button type="button" data-mw="with" aria-pressed="false">Avec mémoire</button></div>
      <div class="mw-window">
        <div class="mw-behind" aria-hidden="true"><div class="mw-lights"></div><p class="mw-behind-title">LE PROJET, TEL QUE VOUS L’AVIEZ LAISSÉ</p>${items.map((it) => `<div class="mw-note"><span>${esc(it.tag)} · ${esc(it.date)}</span><p>${esc(it.text)}</p></div>`).join('')}</div>
        <canvas class="mw-fog" aria-hidden="true"></canvas>
        <div class="mw-pinned">${items.map((it, i) => `<div class="mw-card" style="--i:${i}"><span>RETROUVÉ · ${esc(it.tag)}</span><p>${esc(it.text)}</p></div>`).join('')}</div>
        <span class="mw-frame" aria-hidden="true"></span>
      </div>
      <p class="mw-response" aria-live="polite"></p>
      <p class="mw-hint">Essuyez la buée du doigt ou de la souris : elle revient.</p>`;

    const win = root.querySelector('.mw-window');
    const canvas = root.querySelector('.mw-fog');
    const ctx = canvas.getContext('2d');
    const response = root.querySelector('.mw-response');
    let W = 0; let H = 0; let raf = 0; let mode = 'without'; let alive = true;
    const drops = [];

    function fogFill(alpha) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(150, 164, 178, ${alpha})`;
      ctx.fillRect(0, 0, W, H);
    }
    function clear(x, y, r, strength = 1) {
      ctx.globalCompositeOperation = 'destination-out';
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${strength})`); g.addColorStop(0.7, `rgba(0,0,0,${strength * 0.6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    function resize() {
      const r = win.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = W; canvas.height = H;
      fogFill(0.96);
      /* Texture : quelques nappes plus denses. */
      for (let i = 0; i < 40; i++) { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(196, 206, 216, .09)'; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, 20 + Math.random() * 60, 0, Math.PI * 2); ctx.fill(); }
    }
    function tick() {
      if (!alive) return;
      if (!reduced) {
        fogFill(mode === 'with' ? 0.006 : 0.012);
        if (Math.random() < 0.05 && drops.length < 7) drops.push({ x: 10 + Math.random() * (W - 20), y: -6, v: 0.6 + Math.random() * 1.2, r: 3 + Math.random() * 3 });
        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i]; d.y += d.v; d.v = Math.min(3.2, d.v + 0.02); d.x += Math.sin(d.y / 17) * 0.25;
          clear(d.x, d.y, d.r * 1.8, 0.9);
          if (d.y > H + 10) drops.splice(i, 1);
        }
      }
      raf = requestAnimationFrame(tick);
    }
    let last = null;
    win.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse' && e.buttons === 0 && !e.shiftKey) { const r = win.getBoundingClientRect(); const x = e.clientX - r.left; const y = e.clientY - r.top; clear(x, y, 26, 0.55); last = null; return; }
      const r = win.getBoundingClientRect(); const x = e.clientX - r.left; const y = e.clientY - r.top;
      if (last) { const steps = Math.ceil(Math.hypot(x - last[0], y - last[1]) / 6); for (let i = 1; i <= steps; i++) clear(last[0] + ((x - last[0]) * i) / steps, last[1] + ((y - last[1]) * i) / steps, 30, 0.9); }
      last = [x, y];
    });
    win.addEventListener('pointerdown', (e) => { const r = win.getBoundingClientRect(); last = [e.clientX - r.left, e.clientY - r.top]; clear(last[0], last[1], 30, 0.9); });
    win.addEventListener('pointerup', () => { last = null; });
    win.addEventListener('pointerleave', () => { last = null; });

    function setMode(next) {
      mode = next;
      root.classList.toggle('is-remembered', mode === 'with');
      root.querySelectorAll('[data-mw]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mw === mode)));
      response.textContent = mode === 'with' ? (config.with?.response || '') : (config.without?.response || '');
      if (mode === 'without') resize();
    }
    root.querySelectorAll('[data-mw]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mw)));
    const ro = new ResizeObserver(() => resize());
    ro.observe(win);
    resize(); setMode('without'); tick();
    return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
  }

  registry['memory-window'] = { mount };
})();
