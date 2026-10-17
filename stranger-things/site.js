"use strict";
/* =====================================================================
   HAWKINS FAN ZONE — little bits shared by every page
   (kept tiny on purpose so pages load fast)
   ===================================================================== */

/* ---------- floating spores ---------- */
(function spores() {
  const box = document.getElementById("spores");
  if (!box) return;
  const n = window.innerWidth < 700 ? 14 : 26;
  let html = "";
  for (let i = 0; i < n; i++) {
    const dur = 14 + Math.random() * 18, delay = -Math.random() * 30, size = 2 + Math.random() * 4;
    html += `<div class="spore" style="left:${Math.random() * 100}%;width:${size}px;height:${size}px;
      animation-duration:${dur}s;animation-delay:${delay}s;--dx:${(Math.random() * 120 - 60).toFixed(0)}px"></div>`;
  }
  box.innerHTML = html;
})();

/* ---------- beeps (no sound files needed) ---------- */
let audioCtx = null;
function beep(freq = 600, dur = .12, type = "sine", vol = .1) {
  if (window.__muted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
const tune = (notes, gap = 120) => notes.forEach((f, i) => setTimeout(() => beep(f, .2, "triangle", .09), i * gap));

/* ---------- upside down mode (remembered on this device) ---------- */
function setUpside(on) {
  document.body.classList.toggle("upside", on);
  try { localStorage.setItem("stUpside", on ? "1" : "0"); } catch (e) {}
  const btn = document.getElementById("btn-upside");
  if (btn) btn.textContent = on ? "🙂 Back to the Rightside Up" : "🙃 Flip to the Upside Down";
}
try { if (localStorage.getItem("stUpside") === "1") setUpside(true); } catch (e) {}
document.addEventListener("click", e => {
  const b = e.target.closest("#btn-upside");
  if (b) { setUpside(!document.body.classList.contains("upside")); beep(document.body.classList.contains("upside") ? 180 : 700, .3, "triangle"); }
  const s = e.target.closest(".spoiler");
  if (s) { s.classList.toggle("open"); beep(500, .08); }
});

/* ---------- show which page you're on ---------- */
(function markPage() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.links a").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("here");
  });
})();
