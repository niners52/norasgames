"use strict";
/* =====================================================================
   MAGIC TOWN — avatar parts and the character drawing
   ===================================================================== */
const PARTS = {
  skin:   ["#ffe0c7", "#f5c6a0", "#d9a07a", "#a86b45", "#6e4228", "#b8f0d8", "#d8c8ff", "#bfe4ff", "#ffc8e4"],
  hairC:  ["#2b1b12", "#6b3e1f", "#d9a441", "#f4e3a1", "#e85d3f", "#ff8fcf", "#9b7bff", "#5ad1ff", "#ffffff", "rainbow"],
  outC:   ["#ff6fae", "#ffb347", "#ffe066", "#6fdc8c", "#4fc3f7", "#9b7bff", "#ffffff", "#333a4d"],
  hair:   [["short", "Short"], ["long", "Long"], ["bob", "Bob"], ["puffs", "Puffs"], ["bun", "Bun"], ["pigtails", "Pigtails"], ["spiky", "Spiky"], ["bald", "None"]],
  eyes:   [["round", "👀 Round"], ["sparkle", "✨ Sparkly"], ["happy", "😊 Happy"], ["sleepy", "😌 Sleepy"], ["wink", "😉 Wink"]],
  mouth:  [["smile", "Smile"], ["grin", "Grin"], ["open", "Wow"], ["tongue", "Silly"], ["o", "Ooh"]],
  outfit: [["dress", "👗 Dress"], ["tee", "👕 T-shirt"], ["hoodie", "🧥 Hoodie"], ["overalls", "👖 Overalls"], ["robe", "🧙 Wizard robe"], ["gown", "👸 Gown"]],
  acc:    [["none", "None"], ["crown", "👑 Crown"], ["tiara", "💎 Tiara"], ["wizard", "🧙 Wizard hat"], ["flower", "🌸 Flower"], ["bow", "🎀 Bow"],
           ["catears", "🐱 Cat ears"], ["bunnyears", "🐰 Bunny ears"], ["halo", "😇 Halo"]],
  wings:  [["none", "None"], ["fairy", "🧚 Fairy"], ["butterfly", "🦋 Butterfly"], ["angel", "🪽 Angel"]],
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const key = v => Array.isArray(v) ? v[0] : v;

function randomAvatar(name) {
  return {
    id: "c" + Math.random().toString(36).slice(2, 9), name: name || pick(["Luna", "Milo", "Stella", "Pip", "Rosie", "Finn", "Willow", "Juniper", "Poppy", "Sky"]),
    skin: pick(PARTS.skin), hairC: pick(PARTS.hairC), outC: pick(PARTS.outC),
    hair: key(pick(PARTS.hair.slice(0, 7))), eyes: key(pick(PARTS.eyes)), mouth: key(pick(PARTS.mouth)),
    outfit: key(pick(PARTS.outfit)), acc: key(pick(PARTS.acc)), wings: key(pick(PARTS.wings)),
  };
}

function shade(hex, amt) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const n = parseInt(hex.slice(1), 16);
  const c = s => Math.max(0, Math.min(255, ((n >> s) & 255) + amt));
  return "#" + ((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, "0");
}

let svgUid = 0;
function avatarSVG(c) {
  const uid = "g" + (svgUid++);
  const hc = c.hairC === "rainbow" ? `url(#${uid}r)` : c.hairC;
  const sk = c.skin, oc = c.outC, dk = shade(oc, -40), skd = shade(sk, -25);
  let s = `<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="${uid}r" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ff5f8f"/><stop offset=".25" stop-color="#ffb347"/><stop offset=".5" stop-color="#ffe066"/>
    <stop offset=".75" stop-color="#6fdc8c"/><stop offset="1" stop-color="#9b7bff"/></linearGradient></defs>`;

  /* wings */
  if (c.wings === "fairy") s += `<g opacity=".85" stroke="#fff" stroke-width="1.5">
    <ellipse cx="34" cy="92" rx="26" ry="13" transform="rotate(-35 34 92)" fill="#bfefff"/><ellipse cx="86" cy="92" rx="26" ry="13" transform="rotate(35 86 92)" fill="#bfefff"/>
    <ellipse cx="40" cy="116" rx="16" ry="9" transform="rotate(25 40 116)" fill="#ffd6f5"/><ellipse cx="80" cy="116" rx="16" ry="9" transform="rotate(-25 80 116)" fill="#ffd6f5"/></g>`;
  if (c.wings === "butterfly") s += `<g stroke="${dk}" stroke-width="1.5">
    <path d="M60 96 C30 60 6 70 14 96 C20 112 44 108 60 100Z" fill="${shade(oc, 30)}"/><path d="M60 96 C90 60 114 70 106 96 C100 112 76 108 60 100Z" fill="${shade(oc, 30)}"/>
    <path d="M60 102 C40 110 26 130 40 136 C50 140 58 122 60 108Z" fill="${oc}"/><path d="M60 102 C80 110 94 130 80 136 C70 140 62 122 60 108Z" fill="${oc}"/>
    <circle cx="28" cy="90" r="5" fill="#fff" stroke="none" opacity=".7"/><circle cx="92" cy="90" r="5" fill="#fff" stroke="none" opacity=".7"/></g>`;
  if (c.wings === "angel") s += `<g fill="#fff" stroke="#dde6ff" stroke-width="1.5">
    <path d="M52 92 C30 70 4 76 6 90 C14 88 12 100 22 98 C20 108 34 110 38 104 C42 112 52 108 54 100Z"/>
    <path d="M68 92 C90 70 116 76 114 90 C106 88 108 100 98 98 C100 108 86 110 82 104 C78 112 68 108 66 100Z"/></g>`;

  /* hair behind the head */
  if (c.hair === "long") s += `<path d="M30 44 C28 80 26 104 36 112 L84 112 C94 104 92 80 90 44 Z" fill="${hc}"/>`;
  if (c.hair === "pigtails") s += `<ellipse cx="24" cy="66" rx="11" ry="20" fill="${hc}"/><ellipse cx="96" cy="66" rx="11" ry="20" fill="${hc}"/>
    <circle cx="30" cy="48" r="4" fill="#ff5fa2"/><circle cx="90" cy="48" r="4" fill="#ff5fa2"/>`;
  if (c.hair === "puffs") s += `<circle cx="32" cy="26" r="15" fill="${hc}"/><circle cx="88" cy="26" r="15" fill="${hc}"/>`;
  if (c.hair === "bun") s += `<circle cx="60" cy="16" r="13" fill="${hc}"/>`;
  if (c.outfit === "hoodie") s += `<circle cx="60" cy="50" r="33" fill="${dk}"/>`;

  /* arms, legs, neck */
  s += `<g stroke="${sk}" stroke-width="9" stroke-linecap="round"><line x1="44" y1="94" x2="33" y2="124"/><line x1="76" y1="94" x2="87" y2="124"/></g>
    <circle cx="33" cy="126" r="5.5" fill="${sk}"/><circle cx="87" cy="126" r="5.5" fill="${sk}"/>
    <rect x="49" y="126" width="9" height="32" rx="4" fill="${sk}"/><rect x="62" y="126" width="9" height="32" rx="4" fill="${sk}"/>
    <ellipse cx="52" cy="160" rx="8" ry="5" fill="${dk}"/><ellipse cx="68" cy="160" rx="8" ry="5" fill="${dk}"/>
    <rect x="55" y="68" width="10" height="22" fill="${skd}"/>`;

  /* outfit */
  const torso = `<path d="M42 90 Q60 82 78 90 L80 132 L40 132 Z" fill="FILL"/>`;
  switch (c.outfit) {
    case "tee": s += torso.replace("FILL", oc) + `<rect x="42" y="124" width="36" height="16" rx="4" fill="${shade(oc, -60)}"/>
      <path d="M42 90 L32 104 L40 108 L46 98Z M78 90 L88 104 L80 108 L74 98Z" fill="${oc}"/>`; break;
    case "dress": s += `<path d="M44 88 Q60 82 76 88 L88 144 Q60 150 32 144 Z" fill="${oc}"/>
      <path d="M44 88 L34 102 L42 106 L48 96Z M76 88 L86 102 L78 106 L72 96Z" fill="${oc}"/>
      <path d="M36 138 Q60 146 84 138" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><circle cx="60" cy="98" r="3" fill="#fff"/>`; break;
    case "gown": s += `<path d="M46 88 Q60 82 74 88 L96 156 Q60 164 24 156 Z" fill="${oc}"/>
      <path d="M44 88 L34 100 L42 104 L48 94Z M76 88 L86 100 L78 104 L72 94Z" fill="${shade(oc, 30)}"/>
      <path d="M46 110 Q60 116 74 110" stroke="${shade(oc, 50)}" stroke-width="4" fill="none"/>
      <g fill="#fff"><circle cx="40" cy="140" r="2"/><circle cx="58" cy="130" r="2"/><circle cx="78" cy="144" r="2"/><circle cx="66" cy="152" r="2"/><circle cx="48" cy="152" r="2"/></g>`; break;
    case "hoodie": s += torso.replace("FILL", oc) + `<path d="M42 90 L30 110 L40 114 L46 100Z M78 90 L90 110 L80 114 L74 100Z" fill="${oc}"/>
      <rect x="48" y="112" width="24" height="12" rx="4" fill="${dk}"/><line x1="56" y1="90" x2="55" y2="104" stroke="#fff" stroke-width="2"/><line x1="64" y1="90" x2="65" y2="104" stroke="#fff" stroke-width="2"/>
      <rect x="42" y="126" width="36" height="16" rx="4" fill="#4a5a7a"/>`; break;
    case "overalls": s += torso.replace("FILL", "#fff") + `<path d="M42 90 L34 104 L41 107 L46 98Z M78 90 L86 104 L79 107 L74 98Z" fill="#fff"/>
      <rect x="46" y="104" width="28" height="30" rx="3" fill="${oc}"/><rect x="40" y="124" width="40" height="18" rx="4" fill="${oc}"/>
      <line x1="48" y1="104" x2="46" y2="88" stroke="${oc}" stroke-width="4"/><line x1="72" y1="104" x2="74" y2="88" stroke="${oc}" stroke-width="4"/>
      <circle cx="49" cy="107" r="2" fill="#ffe066"/><circle cx="71" cy="107" r="2" fill="#ffe066"/>`; break;
    case "robe": s += `<path d="M44 88 Q60 82 76 88 L90 158 Q60 164 30 158 Z" fill="${oc}"/>
      <path d="M44 88 L24 118 L40 122 L48 100Z M76 88 L96 118 L80 122 L72 100Z" fill="${oc}"/>
      <path d="M60 86 L60 158" stroke="${dk}" stroke-width="2"/>
      <g fill="#ffe066"><path d="M44 120 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0Z"/><path d="M72 138 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0Z"/></g>`; break;
  }

  /* head */
  s += `<circle cx="34" cy="50" r="5" fill="${sk}"/><circle cx="86" cy="50" r="5" fill="${sk}"/>
    <circle cx="60" cy="48" r="26" fill="${sk}"/>`;
  if (c.outfit === "hoodie") s += `<path d="M28 60 Q60 86 92 60" stroke="${dk}" stroke-width="6" fill="none"/>`;

  /* hair in front */
  const cap = `<path d="M34 46 C34 16 86 16 86 46 C80 34 70 30 60 32 C50 30 40 34 34 46Z" fill="${hc}"/>`;
  switch (c.hair) {
    case "short": s += `<path d="M33 48 C30 16 90 16 87 48 C84 38 78 32 72 36 C66 30 56 30 50 36 C44 32 36 38 33 48Z" fill="${hc}"/>`; break;
    case "long": s += cap + `<path d="M34 44 C30 60 32 76 36 84 L40 50Z M86 44 C90 60 88 76 84 84 L80 50Z" fill="${hc}"/>`; break;
    case "bob": s += `<path d="M32 64 C24 14 96 14 88 64 L82 64 C82 44 76 36 60 34 C44 36 38 44 38 64Z" fill="${hc}"/>`; break;
    case "spiky": s += `<path d="M34 46 L30 22 L44 30 L48 12 L58 26 L66 10 L72 28 L86 18 L84 34 L92 36 L86 46 C80 34 70 30 60 32 C50 30 40 34 34 46Z" fill="${hc}"/>`; break;
    case "bald": break;
    default: s += cap;
  }

  /* face */
  const eye = (x, kind) => {
    switch (kind) {
      case "sparkle": return `<circle cx="${x}" cy="50" r="5" fill="#3a2466"/><circle cx="${x}" cy="51" r="3" fill="#8b5cf6"/><circle cx="${x + 1.6}" cy="48.2" r="1.6" fill="#fff"/><circle cx="${x - 1.5}" cy="52" r=".9" fill="#fff"/>`;
      case "happy": return `<path d="M${x - 4} 51 Q${x} 45 ${x + 4} 51" stroke="#3a2466" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      case "sleepy": return `<path d="M${x - 4} 50 Q${x} 54 ${x + 4} 50" stroke="#3a2466" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      default: return `<circle cx="${x}" cy="50" r="3.8" fill="#3a2466"/><circle cx="${x + 1.3}" cy="48.7" r="1.3" fill="#fff"/>`;
    }
  };
  s += eye(50, c.eyes === "wink" ? "round" : c.eyes) + eye(70, c.eyes === "wink" ? "happy" : c.eyes);
  s += `<ellipse cx="43" cy="58" rx="4.5" ry="2.6" fill="#ff7fa8" opacity=".45"/><ellipse cx="77" cy="58" rx="4.5" ry="2.6" fill="#ff7fa8" opacity=".45"/>`;
  switch (c.mouth) {
    case "grin": s += `<path d="M53 60 Q60 70 67 60Z" fill="#a33a5a"/><path d="M54 60.5 L66 60.5" stroke="#fff" stroke-width="2"/>`; break;
    case "open": s += `<ellipse cx="60" cy="63" rx="4" ry="5" fill="#a33a5a"/>`; break;
    case "tongue": s += `<path d="M54 60 Q60 67 66 60" stroke="#a33a5a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M58 63 Q60 69 62 63Z" fill="#ff6f91"/>`; break;
    case "o": s += `<circle cx="60" cy="62" r="2.4" fill="#a33a5a"/>`; break;
    default: s += `<path d="M54 60 Q60 66 66 60" stroke="#a33a5a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }

  /* accessories */
  switch (c.acc) {
    case "crown": s += `<path d="M44 26 L44 12 L52 20 L60 6 L68 20 L76 12 L76 26Z" fill="#ffd54a" stroke="#c9961e" stroke-width="1.5"/>
      <circle cx="52" cy="22" r="2" fill="#ff4d6d"/><circle cx="60" cy="20" r="2.2" fill="#4dd2ff"/><circle cx="68" cy="22" r="2" fill="#4dff88"/>`; break;
    case "tiara": s += `<path d="M42 30 Q60 16 78 30" stroke="#e8e8ff" stroke-width="3" fill="none"/><path d="M56 24 L60 14 L64 24Z" fill="#dff" stroke="#9adfff"/><circle cx="60" cy="21" r="2.2" fill="#ff7ac6"/>`; break;
    case "wizard": s += `<ellipse cx="60" cy="26" rx="34" ry="7" fill="#5b3cc4"/><path d="M40 26 Q54 -4 74 -14 Q70 6 80 26Z" fill="#6b4bd6"/>
      <path d="M58 8 l2 4 4 0 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 0Z" fill="#ffe066"/>`; break;
    case "flower": s += `<g transform="translate(82 28)">${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 6}" cy="${Math.sin(a * Math.PI / 180) * 6}" r="5" fill="#ff8fcf"/>`).join("")}<circle r="4" fill="#ffe066"/></g>`; break;
    case "bow": s += `<g transform="translate(60 22)"><path d="M0 0 L-16 -9 L-16 9Z M0 0 L16 -9 L16 9Z" fill="#ff5fa2" stroke="#c9004f" stroke-width="1.2"/><circle r="4" fill="#c9004f"/></g>`; break;
    case "catears": s += `<path d="M36 34 L34 8 L54 24Z M84 34 L86 8 L66 24Z" fill="${hc === "none" ? sk : (c.hair === "bald" ? sk : hc)}"/><path d="M39 28 L38 14 L49 23Z M81 28 L82 14 L71 23Z" fill="#ffb3d1"/>`; break;
    case "bunnyears": s += `<ellipse cx="48" cy="6" rx="7" ry="22" fill="#fff" stroke="#eee"/><ellipse cx="72" cy="6" rx="7" ry="22" fill="#fff" stroke="#eee"/>
      <ellipse cx="48" cy="8" rx="3.5" ry="15" fill="#ffb3d1"/><ellipse cx="72" cy="8" rx="3.5" ry="15" fill="#ffb3d1"/>`; break;
    case "halo": s += `<ellipse cx="60" cy="10" rx="18" ry="5" fill="none" stroke="#ffd54a" stroke-width="3.5"/>`; break;
  }
  return s + `</svg>`;
}
