"use strict";
/* =====================================================================
   THE CURSOR YOU BUILT
   Reads whatever you made in the Cursor Lab and uses it on every page.
   - your own pointer shape, with a trail behind it
   - on an iPad there's no pointer, so your finger leaves the trail instead
   - and now and then a second cursor drifts past on its own, doing
     things you didn't do. That one isn't yours.
   Nothing here runs at all until you've made one.
   ===================================================================== */
(function ghostCursor() {
  let C = null;
  try { C = JSON.parse(localStorage.getItem("noraCursor") || "null"); } catch (e) {}
  if (!C || !C.shape) return;

  const SIZE = { small: 26, medium: 36, big: 52 }[C.size] || 36;
  const COL = C.color || "#ff2020";
  const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ---------- the shapes ---------- */
  const SHAPES = {
    torch: c => `<path d="M20 6 L30 6 L30 17 L44 2 L44 44 L30 29 L30 40 L20 40 Z" fill="#241a2e" stroke="${c}" stroke-width="2"/>
      <path d="M30 17 L46 2 L46 44 L30 29 Z" fill="${c}" opacity=".35"/>
      <circle cx="25" cy="23" r="4" fill="${c}"/>`,
    claw: c => `<path d="M14 4 C20 16 22 28 20 42 C18 46 12 46 11 41 C9 28 10 14 14 4 Z" fill="#0a0710" stroke="${c}" stroke-width="1.6"/>
      <path d="M24 2 C30 16 32 30 29 44 C27 48 21 48 20 43 C18 29 20 14 24 2 Z" fill="#0a0710" stroke="${c}" stroke-width="1.6"/>
      <path d="M34 6 C40 18 41 30 38 42 C36 46 30 46 29 41 C28 29 30 16 34 6 Z" fill="#0a0710" stroke="${c}" stroke-width="1.6"/>`,
    bike: c => `<circle cx="14" cy="34" r="10" fill="none" stroke="${c}" stroke-width="3"/>
      <circle cx="38" cy="34" r="10" fill="none" stroke="${c}" stroke-width="3"/>
      <path d="M14 34 L26 18 L38 34 M26 18 L32 18 M20 24 L30 24" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    waffle: c => `<rect x="8" y="8" width="34" height="34" rx="6" fill="#e8b64c" stroke="${c}" stroke-width="2"/>
      ${[0,1,2].map(i => [0,1,2].map(j => `<rect x="${13 + i * 10}" y="${13 + j * 10}" width="6" height="6" fill="rgba(120,70,20,.6)"/>`).join("")).join("")}`,
    d20: c => `<polygon points="25,4 44,15 44,35 25,46 6,35 6,15" fill="#1a0a16" stroke="${c}" stroke-width="2.4"/>
      <polygon points="25,14 34,30 16,30" fill="none" stroke="${c}" stroke-width="1.4" opacity=".7"/>
      <text x="25" y="31" text-anchor="middle" font-size="13" font-family="Georgia" fill="${c}">20</text>`,
    hand: c => `<path d="M18 44 C12 36 10 28 12 22 C14 18 18 19 19 23 L20 28 L20 10 C20 6 26 6 26 10 L26 24 L27 8
      C27 4 33 4 33 8 L33 24 L35 12 C35 8 41 8 41 12 L40 32 C39 40 34 44 28 45 Z" fill="#f0d2c0" stroke="${c}" stroke-width="1.8"/>
      <path d="M24 12 L26 6 M30 11 L30 5" stroke="${c}" stroke-width="1.2" opacity=".6"/>`,
    shadow: c => `<ellipse cx="25" cy="46" rx="11" ry="3" fill="#000" opacity=".5"/>
      <path d="M25 10 C32 10 35 17 34 24 C33 31 31 35 31 44 L31 48 L28 48 L27 36 L23 36 L22 48 L19 48 L19 44
      C19 35 17 31 16 24 C15 17 18 10 25 10 Z" fill="#06040c"/>
      <ellipse cx="25" cy="7" rx="7" ry="8" fill="#06040c"/>
      <circle cx="23" cy="7" r="1.8" fill="${c}"/>`,
    star: c => `<path d="M25 3 L31 18 L47 19 L34 29 L39 45 L25 36 L11 45 L16 29 L3 19 L19 18 Z"
      fill="${c}" opacity=".9" stroke="#0a0710" stroke-width="1.4"/>`,
  };
  const art = SHAPES[C.shape] || SHAPES.torch;

  /* ---------- the layer ---------- */
  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9600;overflow:hidden";
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ncfade { to { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(var(--sc)); } }
    .nc-bit { position: absolute; pointer-events: none; will-change: transform, opacity; }
    .nc-main { position: absolute; top: 0; left: 0; will-change: transform; transition: opacity .3s; }
    html.nc-hide, html.nc-hide * { cursor: none !important; }`;
  document.head.appendChild(style);
  function mount() {
    document.body.appendChild(layer);
    if (fine) document.documentElement.classList.add("nc-hide");
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", mount); else mount();

  function svg(size, opacity) {
    const d = document.createElement("div");
    d.className = "nc-main";
    d.style.opacity = opacity;
    d.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"
      style="filter:drop-shadow(0 0 ${Math.round(size / 4)}px ${COL})">${art(COL)}</svg>`;
    return d;
  }

  /* ---------- the trail ---------- */
  let live = 0;
  const TRAILS = {
    spores: (x, y) => bit(x, y, `width:${3 + Math.random() * 4}px;height:${3 + Math.random() * 4}px;border-radius:50%;
      background:${COL};box-shadow:0 0 8px ${COL}`, (Math.random() * 40 - 20), -30 - Math.random() * 40, 1400, .4),
    bulbs: (x, y) => {
      const c = ["#ff2020", "#ffd54a", "#4fd2ff", "#6fff9c", "#ff5fc8"][Math.floor(Math.random() * 5)];
      bit(x, y, `width:9px;height:12px;border-radius:50% 50% 44% 44%;background:${c};box-shadow:0 0 12px ${c}`,
        Math.random() * 16 - 8, 18 + Math.random() * 20, 900, 1.6);
    },
    ash: (x, y) => bit(x, y, `width:${2 + Math.random() * 3}px;height:${2 + Math.random() * 3}px;border-radius:40%;
      background:#b9b2c4;opacity:.75`, Math.random() * 30 - 15, 40 + Math.random() * 40, 1600, .5),
    steps: (x, y) => bit(x, y, `width:7px;height:11px;border-radius:50% 50% 40% 40%;background:${COL};opacity:.6;
      transform:rotate(${Math.random() * 40 - 20}deg)`, 0, 0, 1700, 1),
    glow: (x, y) => bit(x, y, `width:${SIZE * .7}px;height:${SIZE * .7}px;border-radius:50%;
      background:radial-gradient(circle, ${COL}aa, transparent 70%)`, 0, 0, 700, 1.9),
    none: () => {},
  };
  function bit(x, y, css, dx, dy, ms, sc) {
    if (live > 46) return;
    live++;
    const b = document.createElement("div");
    b.className = "nc-bit";
    b.style.cssText = css + `;left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px;--sc:${sc};
      animation:ncfade ${ms}ms linear forwards`;
    layer.appendChild(b);
    setTimeout(() => { b.remove(); live--; }, ms + 60);
  }
  const trail = TRAILS[C.trail] || TRAILS.spores;

  /* ---------- your cursor ---------- */
  const me = svg(SIZE, "1");
  me.style.transform = "translate(-200px,-200px)";
  let last = 0, lx = 0, ly = 0;
  function moveTo(x, y) {
    me.style.transform = `translate(${x - SIZE * .22}px, ${y - SIZE * .18}px)`;
    const d = Math.hypot(x - lx, y - ly);
    if (d > (C.trail === "steps" ? 46 : 16)) { lx = x; ly = y; trail(x, y); }
  }
  addEventListener("pointermove", e => {
    if (!me.isConnected) layer.appendChild(me);
    moveTo(e.clientX, e.clientY);
    if (e.pointerType !== "mouse") me.style.opacity = "1";
  }, { passive: true });
  addEventListener("pointerdown", e => {
    if (!me.isConnected) layer.appendChild(me);
    moveTo(e.clientX, e.clientY);
    for (let i = 0; i < 6; i++) trail(e.clientX, e.clientY);
  }, { passive: true });
  addEventListener("pointerup", e => { if (e.pointerType !== "mouse") setTimeout(() => { me.style.opacity = "0"; }, 500); }, { passive: true });

  /* ---------- and the one that isn't yours ---------- */
  function phantom() {
    const g = svg(SIZE, "0");
    layer.appendChild(g);
    const fromLeft = Math.random() < .5;
    const w = innerWidth, h = innerHeight;
    const p0 = { x: fromLeft ? -60 : w + 60, y: h * (.2 + Math.random() * .6) };
    const p1 = { x: w * (.3 + Math.random() * .4), y: h * (.1 + Math.random() * .3) };
    const p2 = { x: w * (.3 + Math.random() * .4), y: h * (.5 + Math.random() * .4) };
    const p3 = { x: fromLeft ? w + 60 : -60, y: h * (.2 + Math.random() * .6) };
    const T = 7000 + Math.random() * 3000;
    const t0 = performance.now();
    g.style.opacity = ".5";
    (function step(now) {
      const t = Math.min(1, (now - t0) / T), u = 1 - t;
      const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
      const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
      g.style.transform = `translate(${x}px, ${y}px)`;
      if (Math.random() < .3) trail(x, y);
      if (t < 1) requestAnimationFrame(step);
      else { g.style.opacity = "0"; setTimeout(() => g.remove(), 600); }
    })(t0);
  }
  if (C.ghost !== false && Math.random() < .3) setTimeout(phantom, 14000 + Math.random() * 30000);

  /* so the lab can show you one on demand */
  window.noraPhantom = phantom;
})();
