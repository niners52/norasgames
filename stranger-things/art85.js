"use strict";
/* =====================================================================
   TALES FROM '85 — the cartoon versions.
   Same creatures, drawn the way a Saturday-morning cartoon would do it:
   thick outlines, big eyes, bright colours, nothing scary.
   These only replace the real drawings when '85 mode is switched on.
   ===================================================================== */
const ART85 = {};

const OUT = "#2a1b3d";                       /* the outline everything shares */
const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

function snowy(id) {
  return `${sky(id, "#7fd4ff", "#cfeeff")}
    <rect width="400" height="400" fill="url(#${id})"/>
    ${Array.from({ length: 26 }, (_, i) =>
      `<circle cx="${(i * 71) % 400}" cy="${(i * 53) % 300}" r="${2 + (i % 3)}" fill="#fff" opacity=".85"/>`).join("")}
    <path d="M0 330 Q60 306 120 326 Q200 350 280 322 Q340 302 400 330 L400 400 L0 400 Z" fill="#fff"/>
    <path d="M0 356 Q70 338 150 354 Q240 372 320 350 Q360 340 400 356 L400 400 L0 400 Z" fill="#e8f6ff"/>
    ${Array.from({ length: 5 }, (_, i) => {
      const x = 24 + i * 92, h = 56 + (i % 2) * 22;
      return `<path d="M${x} 330 L${x - 20} 330 L${x} ${330 - h} L${x + 20} 330 Z" fill="#2f8f6a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
              <path d="M${x} ${330 - h} L${x - 11} ${330 - h + 18} L${x + 11} ${330 - h + 18} Z" fill="#fff"/>`;
    }).join("")}`;
}
const bigEyes = (cx, cy, r, look) => `
  <circle cx="${cx - r * 1.1}" cy="${cy}" r="${r}" fill="#fff" stroke="${OUT}" stroke-width="3.5"/>
  <circle cx="${cx + r * 1.1}" cy="${cy}" r="${r}" fill="#fff" stroke="${OUT}" stroke-width="3.5"/>
  <circle cx="${cx - r * 1.1 + (look || 0)}" cy="${cy + 2}" r="${r * .45}" fill="#2a1b3d"/>
  <circle cx="${cx + r * 1.1 + (look || 0)}" cy="${cy + 2}" r="${r * .45}" fill="#2a1b3d"/>
  <circle cx="${cx - r * 1.1 + (look || 0) + 3}" cy="${cy - 2}" r="${r * .16}" fill="#fff"/>
  <circle cx="${cx + r * 1.1 + (look || 0) + 3}" cy="${cy - 2}" r="${r * .16}" fill="#fff"/>`;

/* ---------------- the big friendly flower ---------------- */
ART85.demogorgon = () => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  ${snowy("g85a")}
  <ellipse cx="200" cy="356" rx="86" ry="14" fill="#2a1b3d" opacity=".18"/>
  <g stroke="${OUT}" stroke-width="7" stroke-linecap="round">
    <path d="M176 300 L166 350" fill="none"/><path d="M224 300 L234 350" fill="none"/>
  </g>
  <ellipse cx="200" cy="252" rx="62" ry="68" fill="#e98aa8" stroke="${OUT}" stroke-width="6"/>
  <ellipse cx="200" cy="268" rx="40" ry="44" fill="#ffd3e0"/>
  <g stroke="${OUT}" stroke-width="6" stroke-linecap="round">
    <path d="M142 232 C112 244 104 268 112 288" fill="#e98aa8"/>
    <path d="M258 232 C288 244 296 268 288 288" fill="#e98aa8"/>
  </g>
  <g transform="translate(200 150)">
    ${Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + (i - 2.5) * .52;
      const x = Math.cos(a) * 66, y = Math.sin(a) * 60;
      return `<ellipse cx="${x * .62}" cy="${y * .62}" rx="30" ry="17" fill="#ff9ec4" stroke="${OUT}" stroke-width="5"
               transform="rotate(${(a * 180 / Math.PI) + 90} ${x * .62} ${y * .62})"/>`;
    }).join("")}
    <circle r="34" fill="#ffd3e0" stroke="${OUT}" stroke-width="6"/>
    ${bigEyes(0, -4, 11)}
    <path d="M-13 16 Q0 28 13 16" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  <circle cx="92" cy="104" r="7" fill="#fff" opacity=".9"/><circle cx="320" cy="86" r="5" fill="#fff" opacity=".9"/>
</svg>`;

/* ---------------- the puppy ---------------- */
ART85.demodog = () => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  ${snowy("g85b")}
  <ellipse cx="206" cy="340" rx="92" ry="14" fill="#2a1b3d" opacity=".18"/>
  <path d="M292 268 C322 258 334 232 326 214" stroke="${OUT}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="208" cy="282" rx="86" ry="52" fill="#9ad6a0" stroke="${OUT}" stroke-width="6"/>
  <ellipse cx="200" cy="296" rx="58" ry="32" fill="#d7f3da"/>
  <g stroke="${OUT}" stroke-width="7" stroke-linecap="round">
    <path d="M160 324 L154 350"/><path d="M196 330 L194 352"/><path d="M240 330 L244 352"/><path d="M272 322 L282 348"/>
  </g>
  <g transform="translate(124 236)">
    <circle r="46" fill="#9ad6a0" stroke="${OUT}" stroke-width="6"/>
    ${Array.from({ length: 5 }, (_, i) => {
      const a = -Math.PI / 2 + (i - 2) * .55;
      return `<ellipse cx="${Math.cos(a) * 36}" cy="${Math.sin(a) * 34}" rx="20" ry="12" fill="#b8e8bd" stroke="${OUT}" stroke-width="4.5"
               transform="rotate(${(a * 180 / Math.PI) + 90} ${Math.cos(a) * 36} ${Math.sin(a) * 34})"/>`;
    }).join("")}
    <circle r="27" fill="#d7f3da" stroke="${OUT}" stroke-width="5"/>
    ${bigEyes(0, -4, 9, -2)}
    <path d="M-10 14 Q0 24 10 14" stroke="${OUT}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M-4 24 q4 8 8 0" fill="#ff8aa8" stroke="${OUT}" stroke-width="3"/>
  </g>
  <text x="300" y="150" font-size="34">❄️</text>
</svg>`;

/* ---------------- the big cloud ---------------- */
ART85.mindflayer = () => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  ${snowy("g85c")}
  <g opacity=".95">
    <path d="M86 196 C66 150 102 112 140 124 C150 86 212 80 228 118 C272 104 314 140 300 180
             C330 192 326 232 294 238 L112 238 C80 232 76 206 86 196 Z"
          fill="#b9a8f0" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>
    ${bigEyes(196, 168, 15)}
    <path d="M172 200 Q196 220 220 200" stroke="${OUT}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <g stroke="${OUT}" stroke-width="6" fill="#b9a8f0" stroke-linecap="round">
      <path d="M126 238 C112 268 124 294 110 316"/><path d="M168 240 C160 274 176 296 162 324"/>
      <path d="M232 240 C240 274 224 296 238 324"/><path d="M276 238 C290 268 278 294 292 316"/>
    </g>
  </g>
  <text x="54" y="104" font-size="30">❄️</text><text x="316" y="286" font-size="26">❄️</text>
</svg>`;

/* ---------------- the little bat ---------------- */
ART85.demobat = () => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  ${snowy("g85d")}
  <g transform="translate(200 200)">
    <path d="M-34 -6 C-96 -60 -158 -40 -170 6 C-128 -14 -96 6 -54 36 C-92 22 -126 30 -148 54
             C-98 56 -54 70 -22 34 Z" fill="#8fd3ff" stroke="${OUT}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M34 -6 C96 -60 158 -40 170 6 C128 -14 96 6 54 36 C92 22 126 30 148 54
             C98 56 54 70 22 34 Z" fill="#8fd3ff" stroke="${OUT}" stroke-width="5.5" stroke-linejoin="round"/>
    <ellipse cx="0" cy="20" rx="30" ry="40" fill="#bfe8ff" stroke="${OUT}" stroke-width="6"/>
    <circle cx="0" cy="-26" r="30" fill="#bfe8ff" stroke="${OUT}" stroke-width="6"/>
    ${bigEyes(0, -30, 10)}
    <path d="M-11 -10 Q0 0 11 -10" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-7 -4 l3 7 M7 -4 l-3 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  </g>
  <text x="56" y="330" font-size="28">❄️</text>
</svg>`;

/* ---------------- the grumpy one ---------------- */
ART85.vecna = () => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  ${snowy("g85e")}
  <ellipse cx="200" cy="360" rx="78" ry="13" fill="#2a1b3d" opacity=".18"/>
  <path d="M200 158 C244 158 258 196 252 240 C246 286 230 320 228 350 L172 350
           C170 320 154 286 148 240 C142 196 156 158 200 158 Z"
        fill="#c69ae8" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>
  <g stroke="${OUT}" stroke-width="6.5" fill="#c69ae8" stroke-linecap="round">
    <path d="M154 196 C120 214 108 248 118 278"/><path d="M246 196 C280 214 292 248 282 278"/>
  </g>
  <circle cx="200" cy="124" r="44" fill="#ddc2f5" stroke="${OUT}" stroke-width="6"/>
  <path d="M166 100 C178 82 222 82 234 100" stroke="${OUT}" stroke-width="5" fill="none"/>
  ${bigEyes(200, 120, 12)}
  <path d="M182 148 Q200 140 218 148" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g transform="translate(300 268)">
    <circle r="30" fill="#ffe08a" stroke="${OUT}" stroke-width="5"/>
    <path d="M0 -16 L0 0 L12 8" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  <text x="62" y="120" font-size="28">❄️</text>
</svg>`;

/* ---------------- the frozen gate ---------------- */
ART85.upsidedown = () => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  ${snowy("g85f")}
  <g transform="translate(200 206)">
    <ellipse rx="104" ry="118" fill="#8fd3ff" stroke="${OUT}" stroke-width="7"/>
    <ellipse rx="74" ry="88" fill="#cfeeff"/>
    <ellipse rx="44" ry="56" fill="#9fd9ff"/>
    ${Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return `<path d="M${Math.cos(a) * 46} ${Math.sin(a) * 58} L${Math.cos(a) * 98} ${Math.sin(a) * 112}"
               stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
    }).join("")}
    <text x="0" y="8" text-anchor="middle" font-size="40">❄️</text>
  </g>
  <text x="48" y="92" font-size="26">❄️</text><text x="330" y="330" font-size="26">❄️</text>
</svg>`;

/* ---------------- a snowy Hawkins for the top of the home page ---------------- */
ART85.hawkins = () => `
<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="h85" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9ad8ff"/><stop offset="1" stop-color="#ffe6f2"/></linearGradient></defs>
  <rect width="800" height="300" fill="url(#h85)"/>
  ${Array.from({ length: 40 }, (_, i) =>
    `<circle cx="${(i * 97) % 800}" cy="${(i * 61) % 210}" r="${2 + (i % 3)}" fill="#fff" opacity=".9"/>`).join("")}
  <circle cx="686" cy="62" r="30" fill="#fff6c9" stroke="${OUT}" stroke-width="4"/>
  ${Array.from({ length: 7 }, (_, i) => {
    const x = 60 + i * 112, h = 58 + (i % 3) * 20;
    return `<path d="M${x} 236 L${x - 24} 236 L${x} ${236 - h} L${x + 24} 236 Z" fill="#2f8f6a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  }).join("")}
  ${[[150, 60, "#ffb4c8"], [300, 72, "#ffd98a"], [470, 64, "#b9e4ff"], [620, 70, "#c9f0c0"]].map(([x, w, c]) =>
    `<g><rect x="${x}" y="${236 - 54}" width="${w}" height="54" fill="${c}" stroke="${OUT}" stroke-width="4"/>
       <path d="M${x - 10} ${236 - 54} L${x + w / 2} ${236 - 88} L${x + w + 10} ${236 - 54} Z" fill="#fff" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
       <rect x="${x + w / 2 - 10}" y="${236 - 30}" width="20" height="30" fill="#8a6a46" stroke="${OUT}" stroke-width="3"/>
       <circle cx="${x + 16}" cy="${236 - 36}" r="7" fill="#fff6c9" stroke="${OUT}" stroke-width="3"/></g>`).join("")}
  <path d="M0 236 Q200 222 400 238 Q600 254 800 236 L800 300 L0 300 Z" fill="#fff" stroke="${OUT}" stroke-width="4"/>
  ${Array.from({ length: 14 }, (_, i) =>
    `<circle cx="${30 + i * 56}" cy="${268 + (i % 2) * 10}" r="4" fill="${["#ff5a8a", "#ffd54a", "#6fe8a0", "#7fc8ff"][i % 4]}" stroke="${OUT}" stroke-width="2"/>`).join("")}
</svg>`;

/* if '85 mode is on, these become the drawings the whole site uses */
try {
  if (localStorage.getItem("stMode") === "85" && typeof ART !== "undefined") {
    Object.keys(ART85).forEach(k => { ART[k] = ART85[k]; });
  }
} catch (e) {}
