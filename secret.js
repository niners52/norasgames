"use strict";
/* =====================================================================
   THE SECRET GATE — four ways in, so it always works
     1. go to norasgames.com/upsidedown
     2. tap the site title (or the little 11) five times
     3. type ELEVEN on a keyboard
     4. the old arrow code
   The screen flickers as you get closer, so you know it's working.
   ===================================================================== */
(function secretGate() {
  const WORD = "ELEVEN";
  const ARROWS = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];
  const TAP_TARGETS = ".secret-dot, .brand, h1.title, .logo, header .brand";
  let typed = "", arrows = [], taps = 0, tapTimer = null;

  function flicker(strength) {
    const el = document.documentElement;
    el.style.transition = "filter .12s";
    el.style.filter = `invert(${strength}) hue-rotate(${strength * 180}deg)`;
    setTimeout(() => { el.style.filter = ""; }, 140);
  }
  function open() {
    try { localStorage.setItem("noraSecret", "1"); } catch (e) {}
    const d = document.createElement("div");
    d.textContent = "🌀 A gate has opened…";
    d.style.cssText = `position:fixed;left:50%;top:40%;transform:translate(-50%,-50%) scale(.6);z-index:99999;
      background:rgba(10,2,14,.96);color:#ffd9d9;font-family:Nunito,system-ui,sans-serif;font-weight:800;font-size:1.4rem;
      padding:18px 28px;border-radius:18px;border:2px solid #ff2020;box-shadow:0 0 60px rgba(255,32,32,.8);
      transition:transform .4s,opacity .4s;opacity:0;text-align:center`;
    document.body.appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = "1"; d.style.transform = "translate(-50%,-50%) scale(1)"; });
    document.documentElement.style.transition = "filter .5s";
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    setTimeout(() => { location.href = "/secret.html"; }, 1100);
  }

  /* 1. tapping the title or the 11 */
  function tap() {
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { taps = 0; }, 3000);
    if (taps >= 3 && taps < 5) flicker(taps === 3 ? .25 : .5);
    if (taps >= 5) { taps = 0; open(); }
  }
  document.addEventListener("click", e => { if (e.target.closest(TAP_TARGETS)) tap(); }, true);

  /* 2. typing */
  document.addEventListener("keydown", e => {
    if (e.key && e.key.length === 1) {
      typed = (typed + e.key.toUpperCase()).slice(-WORD.length);
      if (typed === WORD) { typed = ""; open(); }
    }
    arrows = [...arrows, e.key].slice(-ARROWS.length);
    if (arrows.join(",") === ARROWS.join(",")) { arrows = []; open(); }
  });

  /* 3. once you've found it, a key shows up in the menu */
  function addKey() {
    try { if (localStorage.getItem("noraSecret") !== "1") return; } catch (e) { return; }
    const nav = document.querySelector("nav.links");
    if (nav && !nav.querySelector(".secret-link")) {
      const a = document.createElement("a");
      a.href = "/secret.html"; a.className = "secret-link"; a.textContent = "🔑 Secret";
      nav.appendChild(a);
    }
  }
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", addKey); else addKey();
})();
