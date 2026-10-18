"use strict";
/* =====================================================================
   DETECTIVE MODE
   Switch it on and a magnifying glass follows your finger. Under the
   glass there's writing that isn't on the page otherwise — notes
   somebody left in the margins, scratches, things crossed out.
   Each page has its own, and it's always the same on that page.
   ===================================================================== */
(function detective() {
  const KEY = "noraDetective";
  const on = () => { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } };

  /* same page, same scribbles */
  function seedFor(s) {
    let h = 2166136261;
    for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return Math.abs(h % 10000) / 10000; };
  }

  const NOTES = [
    "they were here", "don't believe the memo", "it listens", "count the bulbs",
    "page 5 is missing", "she was right", "nobody checked the basement", "ask about 1979",
    "the lights go both ways", "this was never an energy company", "he never left",
    "it knows your name now", "two blinks means no", "the woods are not empty",
    "burn this after", "who is ELEVEN?", "the clock is wrong", "look under the stairs",
    "I heard it breathing", "11 is not a number, it's a person",
  ];
  const SCRATCH = ["✗", "▚", "✕", "⌁", "//////", "▞▚"];

  let layer, ink, lens, built = false;
  function build() {
    if (built) return;
    built = true;
    layer = document.createElement("div");
    layer.id = "det-layer";
    layer.style.cssText = `position:fixed;inset:0;z-index:9500;pointer-events:none;overflow:hidden`;
    ink = document.createElement("div");
    ink.style.cssText = `position:absolute;inset:0;
      -webkit-mask-image:radial-gradient(circle 120px at -500px -500px, #000 58%, rgba(0,0,0,.25) 72%, transparent 78%);
      mask-image:radial-gradient(circle 120px at -500px -500px, #000 58%, rgba(0,0,0,.25) 72%, transparent 78%);`;
    layer.appendChild(ink);

    lens = document.createElement("div");
    lens.style.cssText = `position:absolute;width:244px;height:244px;border-radius:50%;left:-500px;top:-500px;
      border:3px solid rgba(255,235,200,.55);box-shadow:0 0 0 7px rgba(0,0,0,.35), 0 10px 30px rgba(0,0,0,.5),
      inset 0 0 60px rgba(255,220,170,.12);background:radial-gradient(circle at 38% 32%,
      rgba(255,255,255,.1), rgba(255,255,255,0) 60%);transform:translate(-50%,-50%);transition:opacity .2s`;
    layer.appendChild(lens);
    document.body.appendChild(layer);

    /* the hidden writing, in the margins and corners */
    const page = location.pathname.split("/").pop() || "index";
    const rnd = seedFor(page);
    const used = new Set();
    let html = "";
    const count = 7;
    for (let i = 0; i < count; i++) {
      let n = NOTES[Math.floor(rnd() * NOTES.length)];
      while (used.has(n)) n = NOTES[Math.floor(rnd() * NOTES.length)];
      used.add(n);
      const left = 4 + rnd() * 84, top = 8 + rnd() * 78;
      const rot = rnd() * 26 - 13, size = .95 + rnd() * .5;
      html += `<div style="position:absolute;left:${left.toFixed(1)}vw;top:${top.toFixed(1)}vh;
        transform:rotate(${rot.toFixed(1)}deg);font-family:'Noto Serif Display',Georgia,serif;font-style:italic;
        font-size:${size.toFixed(2)}rem;color:rgba(214,48,48,.92);text-shadow:0 0 12px rgba(255,40,40,.35);
        white-space:nowrap">${n}</div>`;
    }
    for (let i = 0; i < 5; i++) {
      html += `<div style="position:absolute;left:${(rnd() * 92).toFixed(1)}vw;top:${(rnd() * 88).toFixed(1)}vh;
        transform:rotate(${(rnd() * 90 - 45).toFixed(1)}deg);color:rgba(214,48,48,.5);font-size:${(1 + rnd() * 2).toFixed(1)}rem;
        letter-spacing:4px">${SCRATCH[Math.floor(rnd() * SCRATCH.length)]}</div>`;
    }
    /* one longer thing, always in the same spot on a given page */
    html += `<div style="position:absolute;left:8vw;bottom:9vh;max-width:70vw;font-family:'Noto Serif Display',Georgia,serif;
      font-style:italic;color:rgba(214,48,48,.9);font-size:1.05rem;line-height:1.7;transform:rotate(-2deg)">
      “Whoever finds this — I wasn't making it up.<br>Check the lights. Check them at night.”</div>`;
    ink.innerHTML = html;

    const move = (x, y) => {
      const m = `radial-gradient(circle 120px at ${x}px ${y}px, #000 58%, rgba(0,0,0,.25) 72%, transparent 78%)`;
      ink.style.webkitMaskImage = m; ink.style.maskImage = m;
      lens.style.left = x + "px"; lens.style.top = y + "px";
    };
    addEventListener("pointermove", e => move(e.clientX, e.clientY), { passive: true });
    addEventListener("touchmove", e => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
    move(innerWidth / 2, innerHeight / 2);
  }
  function teardown() {
    if (layer) { layer.remove(); built = false; layer = null; }
  }

  /* the switch */
  function button() {
    const b = document.createElement("button");
    b.id = "det-btn";
    b.type = "button";
    b.textContent = on() ? "🔍 Detective mode: ON" : "🔍";
    b.title = "Detective mode — a magnifying glass that shows what's written in the margins";
    b.style.cssText = `position:fixed;right:12px;bottom:12px;z-index:9560;cursor:pointer;font:inherit;font-weight:800;
      font-size:.84rem;padding:10px 14px;border-radius:999px;color:#fff;border:1px solid rgba(255,255,255,.25);
      background:${on() ? "linear-gradient(135deg,#d63030,#7a1020)" : "rgba(20,10,24,.75)"};
      box-shadow:0 6px 18px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent`;
    b.addEventListener("click", () => {
      const next = !on();
      try { localStorage.setItem(KEY, next ? "1" : "0"); } catch (e) {}
      if (next) { build(); } else { teardown(); }
      b.textContent = next ? "🔍 Detective mode: ON" : "🔍";
      b.style.background = next ? "linear-gradient(135deg,#d63030,#7a1020)" : "rgba(20,10,24,.75)";
    });
    document.body.appendChild(b);
  }

  function go() { button(); if (on()) build(); }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", go); else go();
})();
