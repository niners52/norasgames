"use strict";
/* =====================================================================
   THE TINY PET
   Once you adopt one on pet.html it lives in the corner of every page.
   Feed it once a day. It grows up, it remembers you, and it never dies —
   it just gets sad and waits.
   ===================================================================== */
(function tinyPet() {
  let P = null;
  try { P = JSON.parse(localStorage.getItem("noraPet") || "null"); } catch (e) {}
  if (!P || !P.name) return;

  const DAY = 86400000;
  const today = () => new Date().toDateString();
  const age = () => Math.floor((Date.now() - P.born) / DAY);
  const fedToday = () => P.lastFed === today();
  const daysSinceFed = () => {
    if (!P.lastFed) return 99;
    const d = Math.round((new Date(today()) - new Date(P.lastFed)) / DAY);
    return isNaN(d) ? 0 : d;
  };
  const STAGES = [
    { at: 0, n: "baby", s: .58, says: ["mrp?", "…mrrp!", "*wobbles*"] },
    { at: 3, n: "little", s: .74, says: ["mrrOW", "*chews your sleeve*", "mrp mrp mrp"] },
    { at: 7, n: "big", s: .9, says: ["MROW", "*thumps tail*", "*follows you*"] },
    { at: 14, n: "enormous", s: 1.05, says: ["MROOOW", "*barely fits in the corner*", "*purrs like a lawnmower*"] },
  ];
  const stage = () => STAGES.filter(s => age() >= s.at).pop();
  const save = () => { try { localStorage.setItem("noraPet", JSON.stringify(P)); } catch (e) {} };

  const worn = () => { try { return (JSON.parse(localStorage.getItem("stShop") || '{"equipped":{}}').equipped || {}).pet || ""; } catch (e) { return ""; } };
  const COSTUME = {
    "pet-cap": `<g transform="translate(0 -26)"><path d="M-16 -2 q16 -16 32 0 z" fill="#c0392b" stroke="#2a1b3d" stroke-width="2.6"/>
        <path d="M-16 -2 h40 q-4 6 -10 6 h-30 z" fill="#8e271c" stroke="#2a1b3d" stroke-width="2.4"/></g>`,
    "pet-scarf": `<g transform="translate(0 2)"><path d="M-17 2 q17 10 34 0 l2 8 q-19 10 -38 0 z" fill="#d85a7a" stroke="#2a1b3d" stroke-width="2.4"/>
        <path d="M12 8 l10 22 l-9 3 l-8 -22 z" fill="#d85a7a" stroke="#2a1b3d" stroke-width="2.4"/>
        <path d="M-15 6 h32 M-14 14 h30" stroke="#fff" stroke-width="2" opacity=".55"/></g>`,
    "pet-hellfire": `<g transform="translate(0 10)"><path d="M-19 -6 q19 -8 38 0 l-3 20 q-16 6 -32 0 z" fill="#241f2a" stroke="#2a1b3d" stroke-width="2.4"/>
        <path d="M0 0 q6 6 4 12 q-2 6 -4 7 q-2 -1 -4 -7 q-2 -6 4 -12 z" fill="#ff3b2f"/></g>`,
  };

  /* ---------- the little creature ---------- */
  function art(size, mood) {
    const c = P.color || "#9ad6a0";
    const eye = mood === "sad" ? `<path d="M-13 -4 q5 4 10 0 M3 -4 q5 4 10 0" stroke="#2a1b3d" stroke-width="3"
        fill="none" stroke-linecap="round"/>`
      : `<circle cx="-8" cy="-4" r="5.2" fill="#fff" stroke="#2a1b3d" stroke-width="2"/>
         <circle cx="8" cy="-4" r="5.2" fill="#fff" stroke="#2a1b3d" stroke-width="2"/>
         <circle cx="-7" cy="-3" r="2.4" fill="#2a1b3d"/><circle cx="9" cy="-3" r="2.4" fill="#2a1b3d"/>`;
    const mouth = mood === "sad"
      ? `<path d="M-6 10 q6 -5 12 0" stroke="#2a1b3d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M-6 8 q6 6 12 0" stroke="#2a1b3d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    return `<svg width="${size}" height="${size}" viewBox="-40 -42 80 84" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="0" cy="36" rx="22" ry="4" fill="#000" opacity=".2"/>
      <path d="M22 18 C34 12 36 2 30 -4" stroke="#2a1b3d" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="14" rx="23" ry="19" fill="${c}" stroke="#2a1b3d" stroke-width="3.4"/>
      <path d="M-14 30 l-2 8 M-4 32 l-1 7 M6 32 l1 7 M15 30 l3 8" stroke="#2a1b3d" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(0 -10)">
        ${Array.from({ length: 5 }, (_, i) => {
          const a = -Math.PI / 2 + (i - 2) * .6;
          return `<ellipse cx="${Math.cos(a) * 18}" cy="${Math.sin(a) * 17}" rx="9" ry="5.4" fill="${c}"
                   stroke="#2a1b3d" stroke-width="2.6"
                   transform="rotate(${(a * 180 / Math.PI) + 90} ${Math.cos(a) * 18} ${Math.sin(a) * 17})"/>`;
        }).join("")}
        <circle r="15" fill="${c}" stroke="#2a1b3d" stroke-width="3"/>
        ${eye}${mouth}
      </g>
      ${COSTUME[worn()] || ""}
    </svg>`;
  }

  /* ---------- the corner ---------- */
  const box = document.createElement("div");
  box.id = "nora-pet";
  box.style.cssText = `position:fixed;left:12px;bottom:12px;z-index:9550;cursor:pointer;user-select:none;
    -webkit-tap-highlight-color:transparent;transition:transform .2s;filter:drop-shadow(0 4px 8px rgba(0,0,0,.45))`;
  const bubble = document.createElement("div");
  bubble.style.cssText = `position:fixed;left:12px;bottom:96px;z-index:9560;max-width:240px;display:none;
    background:#fff;color:#22304a;border:3px solid #2a1b3d;border-radius:16px;padding:12px 14px;
    font-family:Nunito,system-ui,sans-serif;font-weight:700;font-size:.86rem;line-height:1.5;
    box-shadow:0 10px 26px rgba(0,0,0,.45)`;

  function mood() {
    const d = daysSinceFed();
    return d === 0 ? "happy" : d === 1 ? "ok" : "sad";
  }
  function draw() {
    const st = stage();
    box.innerHTML = art(Math.round(66 * st.s), mood());
  }
  function speak() {
    const st = stage(), m = mood();
    const line = m === "sad"
      ? `${P.name} hasn't eaten in ${daysSinceFed()} days and is doing the sad eyes.`
      : m === "ok" ? `${P.name} is fine, but is definitely looking at you.`
      : st.says[Math.floor(Math.random() * st.says.length)];
    bubble.innerHTML = `
      <div style="font-family:'Noto Serif Display',Georgia,serif;font-size:1.05rem">${P.name}</div>
      <div style="color:#5c6f8e;font-size:.78rem">${st.n} · ${age()} day${age() === 1 ? "" : "s"} old · fed ${P.feeds} time${P.feeds === 1 ? "" : "s"}</div>
      <p style="margin:7px 0">${line}</p>
      ${fedToday()
        ? `<div style="color:#2f8f6a;font-weight:800">✅ Already fed today. Come back tomorrow.</div>`
        : `<button id="petfeed" style="font:inherit;font-weight:800;cursor:pointer;border:2px solid #2a1b3d;
             border-radius:999px;padding:8px 14px;background:linear-gradient(135deg,#ffd54a,#ffa83b);color:#2a1b3d">
             🍫 Give it some nougat</button>`}
      <div style="margin-top:8px;font-size:.72rem;color:#8a97ad">tap the pet to hide this</div>`;
    bubble.style.display = "block";
    const f = document.getElementById("petfeed");
    if (f) f.onclick = e => {
      e.stopPropagation();
      P.lastFed = today(); P.feeds = (P.feeds || 0) + 1; save();
      draw(); speak();
      box.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], 420);
    };
  }
  box.addEventListener("click", () => {
    if (bubble.style.display === "block") { bubble.style.display = "none"; return; }
    speak();
  });
  function mount() {
    document.body.appendChild(box);
    document.body.appendChild(bubble);
    draw();
    /* it wanders a little */
    setInterval(() => {
      box.style.transform = `translateX(${Math.random() * 16 - 8}px)`;
    }, 3000);
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", mount); else mount();
})();
