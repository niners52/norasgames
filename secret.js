"use strict";
/* =====================================================================
   THE SECRET GATE
   Type ELEVEN anywhere on Nora's site (or do the old arrow code) and a
   hidden page opens. Once it's open it stays unlocked on that device.
   ===================================================================== */
(function secretGate() {
  const WORD = "ELEVEN";
  const ARROWS = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];
  let typed = "", arrows = [], taps = 0, tapTimer = null;

  const unlocked = () => { try { return localStorage.getItem("noraSecret") === "1"; } catch (e) { return false; } };
  function open() {
    try { localStorage.setItem("noraSecret", "1"); } catch (e) {}
    flash("🌀 A gate has opened…");
    setTimeout(() => { location.href = "/secret.html"; }, 1100);
  }
  function flash(msg) {
    const d = document.createElement("div");
    d.textContent = msg;
    d.style.cssText = `position:fixed;left:50%;top:40%;transform:translate(-50%,-50%) scale(.6);z-index:99999;
      background:rgba(10,2,14,.95);color:#ffd9d9;font-family:Nunito,system-ui,sans-serif;font-weight:800;font-size:1.4rem;
      padding:18px 28px;border-radius:18px;border:2px solid #ff2020;box-shadow:0 0 60px rgba(255,32,32,.8);
      transition:transform .4s,opacity .4s;opacity:0;text-align:center`;
    document.body.appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = "1"; d.style.transform = "translate(-50%,-50%) scale(1)"; });
    document.documentElement.style.transition = "filter .5s";
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    setTimeout(() => { document.documentElement.style.filter = ""; }, 900);
  }

  document.addEventListener("keydown", e => {
    if (e.key && e.key.length === 1) {
      typed = (typed + e.key.toUpperCase()).slice(-WORD.length);
      if (typed === WORD) { typed = ""; open(); }
    }
    arrows = [...arrows, e.key].slice(-ARROWS.length);
    if (arrows.join(",") === ARROWS.join(",")) { arrows = []; open(); }
  });

  /* on an iPad with no keyboard: tap the little 11 in the footer five times */
  document.addEventListener("click", e => {
    if (!e.target.closest(".secret-dot")) return;
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { taps = 0; }, 2500);
    if (taps >= 5) { taps = 0; open(); }
  });

  /* once you've found it, a key shows up so you can go back */
  if (unlocked()) {
    window.addEventListener("DOMContentLoaded", () => {
      const nav = document.querySelector("nav.links");
      if (nav && !nav.querySelector(".secret-link")) {
        const a = document.createElement("a");
        a.href = "/secret.html"; a.className = "secret-link"; a.textContent = "🔑 Secret";
        nav.appendChild(a);
      }
    });
  }
})();
