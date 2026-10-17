"use strict";
/* =====================================================================
   HIDDEN CODES — two ways to set them off.

   WITH A KEYBOARD: type the word anywhere on the page.
   WITH A FINGER:   tap one of the faint little emojis in the footer
                    THREE times in a row. Works great on an iPad.
     EGGO        waffle rain
     VECNA       the clock chimes and the screen cracks
     HELLFIRE    the whole page catches fire
     RUN         everything on the page runs away from you
     LIGHTS      a string of Christmas lights spells a message
     FLIP        the world turns upside down until you tap
     RAINBOW     Kali's illusion — only unlocked inside Room 11
   Clues live on the secret page. Nothing here breaks the page —
   every effect cleans itself up when it's done.
   ===================================================================== */
(function eggs() {
  /* ---------- sound (own copy, so this works on every page) ---------- */
  let ac = null;
  const AC = () => (ac = ac || new (window.AudioContext || window.webkitAudioContext)());
  function note(f, dur, type, vol, slide) {
    try {
      const a = AC(), o = a.createOscillator(), g = a.createGain();
      o.type = type || "sine"; o.frequency.value = f;
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + dur);
      g.gain.value = vol == null ? .06 : vol;
      g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + dur);
      o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur);
    } catch (e) {}
  }
  const melody = (list, gap, type) => list.forEach((f, i) => setTimeout(() => note(f, .3, type || "triangle"), i * (gap || 130)));

  /* ---------- a layer to draw effects on ---------- */
  function layer(z) {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${z || 9000};overflow:hidden`;
    document.body.appendChild(d);
    return d;
  }
  const css = (() => {
    const s = document.createElement("style");
    s.textContent = `
      @keyframes eggfall { to { transform: translateY(115vh) rotate(var(--spin)); } }
      @keyframes eggcrack { from { stroke-dashoffset: 1200; } to { stroke-dashoffset: 0; } }
      @keyframes eggflame { 0%,100% { transform: translateY(0) scaleY(1); opacity: .9; }
                            50% { transform: translateY(-14px) scaleY(1.25); opacity: 1; } }
      @keyframes eggpulse { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
      @keyframes eggflash { 0%,100% { opacity: 0; } 12% { opacity: .85; } 30% { opacity: .1; } 55% { opacity: .7; } }
      .egg-runner { transition: transform .35s cubic-bezier(.3,1.4,.5,1) !important; }
      .egg-flipped { transform: rotate(180deg) !important; filter: saturate(.45) contrast(1.2) hue-rotate(-18deg) !important;
                     transition: transform 1.1s ease, filter 1.1s ease !important; }
      .egg-toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 99999;
                   background: rgba(10,2,14,.94); color: #ffd9d9; font-family: Nunito, system-ui, sans-serif; font-weight: 800;
                   padding: 11px 22px; border-radius: 999px; border: 1px solid rgba(255,32,32,.6);
                   box-shadow: 0 0 34px rgba(255,32,32,.45); animation: eggin .3s }
      @keyframes eggin { from { opacity: 0; transform: translate(-50%, 14px); } }`;
    document.head.appendChild(s);
    return s;
  })();
  function toast(msg, ms) {
    const t = document.createElement("div");
    t.className = "egg-toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms || 3000);
  }

  /* ================= EGGO — waffles rain ================= */
  function eggo() {
    const L = layer();
    for (let i = 0; i < 46; i++) {
      const w = document.createElement("div");
      w.textContent = Math.random() < .12 ? "🥛" : "🧇";
      const size = 22 + Math.random() * 30;
      w.style.cssText = `position:absolute;top:-80px;left:${Math.random() * 100}vw;font-size:${size}px;
        --spin:${Math.random() * 1080 - 540}deg;
        animation:eggfall ${2.4 + Math.random() * 2.4}s linear ${Math.random() * 1.8}s forwards;
        filter:drop-shadow(0 4px 10px rgba(0,0,0,.5))`;
      L.appendChild(w);
    }
    melody([523, 659, 784, 1047]);
    toast("🧇 Eggo extravaganza!");
    setTimeout(() => L.remove(), 7000);
  }

  /* ================= VECNA — the clock and the cracks ================= */
  function vecna() {
    const L = layer(9500);
    L.innerHTML = `
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%, rgba(120,0,0,.0), rgba(60,0,0,.86));
                  animation:eggflash 3.4s ease-out"></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">
        <g stroke="#ff2020" fill="none" stroke-width=".45" stroke-linecap="round"
           style="filter:drop-shadow(0 0 6px #ff2020);stroke-dasharray:1200;animation:eggcrack 1.5s ease-out forwards">
          <path d="M0 0 L22 20 L14 36 L30 48 L22 68 L36 84 L30 100"/>
          <path d="M100 0 L78 18 L88 34 L70 44 L80 64 L64 80 L72 100"/>
          <path d="M22 20 L44 14 M30 48 L52 52 M36 84 L54 76 M78 18 L58 10 M70 44 L50 40 M64 80 L48 88"/>
          <path d="M50 0 L46 22 L54 40 L48 58 L56 78 L50 100"/>
        </g>
      </svg>
      <div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:min(240px,62vw);
                  animation:eggpulse 1.1s ease-in-out 3">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="100" rx="92" ry="52" fill="#120208" stroke="#ff2020" stroke-width="3"
                   style="filter:drop-shadow(0 0 22px #ff2020)"/>
          <circle cx="100" cy="100" r="36" fill="#ff2020" opacity=".9" style="filter:drop-shadow(0 0 26px #ff2020)"/>
          <circle cx="100" cy="100" r="15" fill="#15020a"/>
          <path d="M8 100 Q100 38 192 100 Q100 162 8 100 Z" fill="none" stroke="#ff5a5a" stroke-width="2.4" opacity=".8"/>
        </svg>
      </div>`;
    for (let i = 0; i < 4; i++) setTimeout(() => note(110 - i * 6, 1.3, "sine", .12), i * 780);
    toast("🕰️ Four chimes. Think about your favourite song.", 4200);
    setTimeout(() => { L.style.transition = "opacity 1s"; L.style.opacity = "0"; }, 3600);
    setTimeout(() => L.remove(), 4800);
  }

  /* ================= HELLFIRE — the page catches fire ================= */
  function hellfire() {
    const L = layer(9200);
    L.innerHTML = `<div style="position:absolute;left:0;right:0;bottom:0;height:46vh;
      background:linear-gradient(0deg, rgba(255,60,0,.78), rgba(255,160,0,.35) 42%, rgba(255,200,0,0));
      animation:eggflame 1.1s ease-in-out infinite"></div>`;
    for (let i = 0; i < 34; i++) {
      const f = document.createElement("div");
      f.textContent = ["🔥", "🔥", "🔥", "🤘", "🎸"][i % 5];
      f.style.cssText = `position:absolute;bottom:-40px;left:${Math.random() * 100}vw;font-size:${20 + Math.random() * 34}px;
        animation:eggfall ${2 + Math.random() * 2}s linear ${Math.random() * 1.2}s forwards reverse;
        --spin:${Math.random() * 200 - 100}deg`;
      L.appendChild(f);
    }
    /* a scrappy little power chord */
    [[110, 0], [164.81, 0], [220, 40], [164.81, 80]].forEach(([f, d]) =>
      setTimeout(() => { note(f, 1.5, "sawtooth", .07); note(f * 1.005, 1.5, "square", .04); }, d));
    setTimeout(() => melody([330, 392, 440, 523, 587], 110, "sawtooth"), 700);
    const title = document.querySelector("h1, .brand");
    if (title) {
      const old = title.style.cssText;
      title.style.cssText += ";animation:eggpulse .18s linear 14;text-shadow:0 0 22px #ff8a00,0 0 46px #ff2020";
      setTimeout(() => { title.style.cssText = old; }, 2600);
    }
    toast("🤘 THE MOST METAL THING I'VE EVER SEEN", 3400);
    setTimeout(() => { L.style.transition = "opacity .9s"; L.style.opacity = "0"; }, 3200);
    setTimeout(() => L.remove(), 4200);
  }

  /* ================= RUN — everything runs away from you ================= */
  function run() {
    const targets = [...document.querySelectorAll("nav.links a, .card, .bar .brand, button")].slice(0, 26);
    if (!targets.length) { toast("🏃 Nothing here is brave enough to run."); return; }
    targets.forEach(t => t.classList.add("egg-runner"));
    const flee = e => {
      const mx = e.touches ? e.touches[0].clientX : e.clientX, my = e.touches ? e.touches[0].clientY : e.clientY;
      for (const t of targets) {
        const r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy);
        if (d < 190) {
          const p = (190 - d) / 190 * 80;
          t.style.transform = `translate(${(dx / (d || 1)) * p}px, ${(dy / (d || 1)) * p}px)`;
        } else t.style.transform = "";
      }
    };
    addEventListener("pointermove", flee);
    addEventListener("touchmove", flee, { passive: true });
    melody([880, 784, 659, 587, 523, 440], 90, "square");
    toast("🏃 RUN! (back to normal in 8 seconds)", 4000);
    setTimeout(() => {
      removeEventListener("pointermove", flee);
      removeEventListener("touchmove", flee);
      targets.forEach(t => { t.style.transform = ""; setTimeout(() => t.classList.remove("egg-runner"), 400); });
    }, 8000);
  }

  /* ================= LIGHTS — Joyce's alphabet, anywhere ================= */
  function lights() {
    const WORDS = ["RUN", "HI NORA", "FRIENDS DONT LIE", "HELP ME", "RIGHT HERE", "ELEVEN IS COMING"];
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const COL = ["#ff2020", "#ffd54a", "#4fd2ff", "#6fff9c", "#ff5fc8"];
    const L = layer(9300);
    L.style.height = "auto";
    L.innerHTML = `<div id="eggwire" style="position:relative;display:flex;flex-wrap:wrap;justify-content:center;
      gap:6px 10px;padding:14px 10px 18px;background:linear-gradient(180deg, rgba(5,2,10,.92), rgba(5,2,10,0))"></div>`;
    const wire = L.querySelector("#eggwire");
    wire.innerHTML = [...A].map((ch, i) => `<div data-ch="${ch}" style="display:flex;flex-direction:column;align-items:center;
      font:800 10px Nunito,system-ui,sans-serif;color:rgba(255,230,230,.55)">
      <div class="eggbulb" style="width:13px;height:18px;border-radius:50% 50% 45% 45%;background:${COL[i % 5]};
        opacity:.18;transition:opacity .12s, box-shadow .12s"></div>${ch}</div>`).join("");
    const bulbs = {};
    wire.querySelectorAll("[data-ch]").forEach(d => { bulbs[d.dataset.ch] = d.querySelector(".eggbulb"); });
    let i = 0;
    const step = () => {
      if (i >= word.length) {
        setTimeout(() => { L.style.transition = "opacity .8s"; L.style.opacity = "0"; setTimeout(() => L.remove(), 900); }, 1400);
        return;
      }
      const ch = word[i++];
      const b = bulbs[ch];
      if (b) {
        b.style.opacity = "1"; b.style.boxShadow = `0 0 16px ${b.style.background}, 0 0 34px ${b.style.background}`;
        note(300 + A.indexOf(ch) * 22, .22, "triangle", .05);
        setTimeout(() => { b.style.opacity = ".18"; b.style.boxShadow = ""; }, 330);
      }
      setTimeout(step, ch === " " ? 520 : 520);
    };
    setTimeout(step, 400);
    toast("💡 Watch the wall…", 2600);
  }

  /* ================= FLIP — the world turns over ================= */
  function flip() {
    if (document.body.classList.contains("egg-flipped")) return;
    document.body.classList.add("egg-flipped");
    melody([392, 330, 262, 196], 160, "sine");
    toast("🙃 Tap anywhere to come back", 5000);
    const back = () => {
      document.body.classList.remove("egg-flipped");
      removeEventListener("pointerdown", back);
      melody([262, 330, 392, 523], 120);
    };
    setTimeout(() => addEventListener("pointerdown", back, { once: true }), 900);
  }

  /* ======== RAINBOW — Kali's illusion. Only people who found Room 11 know this one. ======== */
  function rainbow() {
    const L = layer(9400);
    L.innerHTML = '<div style="position:absolute;inset:0;background:linear-gradient(120deg,' +
      '#ff2020,#ff8a00,#ffd54a,#6fff9c,#4fd2ff,#a66bff,#ff5fc8);opacity:.26;' +
      'animation:eggpulse 1.4s ease-in-out 3"></div>';
    for (let i = 0; i < 60; i++) {
      const p = document.createElement("div");
      const hue = (i * 37) % 360;
      p.style.cssText = `position:absolute;top:-40px;left:${Math.random() * 100}vw;width:${6 + Math.random() * 12}px;
        height:${10 + Math.random() * 18}px;border-radius:3px;background:hsl(${hue} 100% 62%);
        box-shadow:0 0 14px hsl(${hue} 100% 62%);--spin:${Math.random() * 900 - 450}deg;
        animation:eggfall ${2 + Math.random() * 2.6}s linear ${Math.random() * 1.4}s forwards`;
      L.appendChild(p);
    }
    /* the illusion: the page briefly doubles */
    const body = document.body;
    const old = body.style.cssText;
    body.style.transition = "filter 1.2s";
    body.style.filter = "hue-rotate(90deg) drop-shadow(14px 0 rgba(255,0,120,.45)) drop-shadow(-14px 0 rgba(0,200,255,.45))";
    setTimeout(() => { body.style.filter = "hue-rotate(260deg)"; }, 1400);
    setTimeout(() => { body.style.cssText = old; }, 2800);
    melody([523, 587, 659, 698, 784, 880, 988, 1047], 110, "triangle");
    toast("🌈 Kali says hello.", 3200);
    setTimeout(() => { L.style.transition = "opacity 1s"; L.style.opacity = "0"; }, 3400);
    setTimeout(() => L.remove(), 4500);
  }

  /* ---------- the emoji strip (for iPads and anyone without a keyboard) ---------- */
  const STRIP = [["🧇", "EGGO"], ["🕰️", "VECNA"], ["🎸", "HELLFIRE"], ["🏃", "RUN"], ["💡", "LIGHTS"], ["🙃", "FLIP"]];
  try { if (localStorage.getItem("noraRoom") === "1") STRIP.push(["🌈", "RAINBOW"]); } catch (e) {}
  function buildStrip() {
    if (document.getElementById("egg-strip")) return;
    const foot = document.querySelector("footer");
    if (!foot) return;
    const wrap = document.createElement("div");
    wrap.id = "egg-strip";
    wrap.style.cssText = "margin-top:10px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap;user-select:none";
    wrap.innerHTML = STRIP.map(function (e) {
      return '<span data-egg="' + e[1] + '" role="button" style="opacity:.22;cursor:pointer;font-size:1.25rem;' +
             'line-height:1;padding:7px;border-radius:10px;transition:opacity .15s, transform .15s, background .15s;' +
             '-webkit-tap-highlight-color:transparent">' + e[0] + '</span>';
    }).join("");
    foot.appendChild(wrap);

    let last = "", count = 0, timer = null;
    wrap.addEventListener("click", function (ev) {
      const el = ev.target.closest("[data-egg]");
      if (!el) return;
      const code = el.dataset.egg;
      if (code !== last) { last = code; count = 0; wrap.querySelectorAll("[data-egg]").forEach(function (o) { o.style.opacity = ".22"; o.style.transform = ""; o.style.background = ""; }); }
      count++;
      clearTimeout(timer);
      timer = setTimeout(function () { count = 0; last = ""; el.style.opacity = ".22"; el.style.transform = ""; el.style.background = ""; }, 2200);
      el.style.opacity = String(.22 + count * .26);
      el.style.transform = "scale(" + (1 + count * .14) + ")";
      el.style.background = count >= 2 ? "rgba(255,32,32,.18)" : "";
      note(520 + count * 120, .06, "triangle", .04);
      if (count >= 3) {
        count = 0; last = "";
        el.style.opacity = ".22"; el.style.transform = ""; el.style.background = "";
        if (CODES[code]) CODES[code]();
      }
    });
  }

  /* ---------- listen for the words ---------- */
  const CODES = { EGGO: eggo, VECNA: vecna, HELLFIRE: hellfire, RUN: run, LIGHTS: lights, FLIP: flip, RAINBOW: rainbow };
  const LONGEST = Math.max(...Object.keys(CODES).map(k => k.length));
  let buf = "";
  addEventListener("keydown", e => {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (!e.key || e.key.length !== 1) return;
    buf = (buf + e.key.toUpperCase()).replace(/[^A-Z]/g, "").slice(-LONGEST);
    for (const code in CODES) if (buf.endsWith(code)) { buf = ""; CODES[code](); return; }
  });
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", buildStrip); else buildStrip();

  /* so other pages can fire one on purpose (the secret page does) */
  window.noraEggs = CODES;
  window.noraEggStrip = STRIP;
})();
