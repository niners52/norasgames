"use strict";
/* =====================================================================
   HAWKINS FAN ZONE — hand-drawn artwork
   Every picture here is drawn from scratch with SVG shapes, gradients
   and shadows. Nothing is copied from the show.
   ===================================================================== */
const ART = {};

/* ---------- reusable pieces ---------- */
const pines = (y, color, count, scale, seedX) => {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = seedX + i * (400 / count) + (i % 3) * 11;
    const h = (70 + (i * 37) % 60) * scale, w = (22 + (i * 23) % 14) * scale;
    s += `<path d="M${x} ${y} L${x - w} ${y} L${x - w * .55} ${y - h * .42}
            L${x - w * .8} ${y - h * .4} L${x - w * .4} ${y - h * .74}
            L${x - w * .6} ${y - h * .72} L${x} ${y - h}
            L${x + w * .6} ${y - h * .72} L${x + w * .4} ${y - h * .74}
            L${x + w * .8} ${y - h * .4} L${x + w * .55} ${y - h * .42}
            L${x + w} ${y} Z" fill="${color}"/>`;
  }
  return s;
};
const spores = (n, seed = 1) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = (i * 97 * seed) % 400, y = (i * 61 * seed) % 500, r = .8 + (i % 4) * .6;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffeaea" opacity="${.25 + (i % 5) * .11}"/>`;
  }
  return s;
};
const vine = (x1, y1, x2, y2, w, color) =>
  `<path d="M${x1} ${y1} C${x1 + 40} ${y1 + 60}, ${x2 - 50} ${y2 - 70}, ${x2} ${y2}"
     fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;

const defs = id => `
  <defs>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a0f1c"/><stop offset=".45" stop-color="#160a18"/><stop offset="1" stop-color="#080410"/>
    </linearGradient>
    <radialGradient id="${id}glow" cx=".5" cy=".42" r=".5">
      <stop offset="0" stop-color="#ff4a4a" stop-opacity=".55"/><stop offset="1" stop-color="#ff2020" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9cfd0"/><stop offset=".55" stop-color="#9b8d92"/><stop offset="1" stop-color="#5d5258"/>
    </linearGradient>
    <linearGradient id="${id}fog" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#cfd8ff" stop-opacity=".18"/>
    </linearGradient>
    <filter id="${id}blur"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${id}soft"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>`;

/* ---------- 1. the Demogorgon in the foggy woods ---------- */
ART.demogorgon = () => `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
  ${defs("dg")}
  <rect width="400" height="500" fill="url(#dgsky)"/>
  <circle cx="312" cy="78" r="34" fill="#f3e9d8" opacity=".22" filter="url(#dgblur)"/>
  <circle cx="312" cy="78" r="21" fill="#f6efe0" opacity=".5"/>
  ${pines(420, "#0d0a14", 9, 1.5, -10)}
  ${pines(440, "#070510", 7, 2.1, 20)}
  <ellipse cx="200" cy="300" rx="150" ry="170" fill="url(#dgglow)"/>
  <!-- the creature -->
  <g>
    <!-- legs -->
    <path d="M186 452 C182 402 176 372 172 336 L206 330 C206 372 206 410 208 452 Z" fill="url(#dgskin)"/>
    <path d="M232 452 C232 404 230 370 226 336 L198 330 C198 372 198 412 196 452 Z" fill="#6b5f66"/>
    <path d="M168 452 l34 0 -6 14 -24 0 Z" fill="#4a4148"/>
    <path d="M198 452 l34 0 -4 14 -26 0 Z" fill="#4a4148"/>
    <!-- torso -->
    <path d="M200 196 C236 206 252 250 248 300 C246 324 236 338 200 344 C164 338 154 324 152 300 C148 250 164 206 200 196 Z" fill="url(#dgskin)"/>
    <g stroke="#6a5c62" stroke-width="2" opacity=".65" fill="none">
      <path d="M176 240 C186 250 214 250 224 240"/><path d="M172 266 C186 278 214 278 228 266"/>
      <path d="M174 292 C188 304 212 304 226 292"/><path d="M178 316 C190 326 210 326 222 316"/>
    </g>
    <!-- arms -->
    <path d="M160 214 C130 236 112 278 104 322 L122 330 C134 288 150 254 172 232 Z" fill="#8d8187"/>
    <path d="M240 214 C270 236 288 278 296 322 L278 330 C266 288 250 254 228 232 Z" fill="#a89ba1"/>
    <g stroke="#cfc3c8" stroke-width="4" stroke-linecap="round">
      <path d="M110 326 l-16 26"/><path d="M118 330 l-6 30"/><path d="M126 330 l6 28"/>
      <path d="M290 326 l16 26"/><path d="M282 330 l6 30"/><path d="M274 330 l-6 28"/>
    </g>
    <!-- neck + closed head base -->
    <path d="M186 180 h28 v26 h-28 Z" fill="#9b8d92"/>
    <!-- the flower head, open -->
    <g transform="translate(200 150)">
      <ellipse rx="34" ry="30" fill="#2a1016"/>
      <g fill="url(#dgskin)" stroke="#6b5f66" stroke-width="1.5">
        <path d="M0 -6 C26 -26 58 -40 78 -24 C62 -4 30 10 0 8 Z"/>
        <path d="M0 -6 C-26 -26 -58 -40 -78 -24 C-62 -4 -30 10 0 8 Z"/>
        <path d="M0 -6 C14 -40 10 -74 -12 -82 C-22 -56 -18 -24 -4 -6 Z"/>
        <path d="M0 -6 C34 -30 56 -62 44 -82 C22 -70 6 -36 2 -8 Z"/>
        <path d="M0 -6 C-34 -30 -56 -62 -44 -82 C-22 -70 -6 -36 -2 -8 Z"/>
        <path d="M0 2 C22 20 54 34 70 22 C54 4 26 -4 2 0 Z"/>
        <path d="M0 2 C-22 20 -54 34 -70 22 C-54 4 -26 -4 -2 0 Z"/>
      </g>
      <g fill="#fff6f6">
        ${Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2, r = 26;
          return `<path d="M${Math.cos(a) * r} ${Math.sin(a) * r * .86}
            l${Math.cos(a) * 9} ${Math.sin(a) * 8} l${-Math.sin(a) * 4} ${Math.cos(a) * 4} Z" opacity=".9"/>`;
        }).join("")}
      </g>
      <ellipse rx="17" ry="13" fill="#4a0d14"/>
      <ellipse rx="8" ry="6" fill="#19050a"/>
    </g>
  </g>
  <rect y="330" width="400" height="170" fill="url(#dgfog)"/>
  <ellipse cx="200" cy="470" rx="180" ry="40" fill="#d8e0ff" opacity=".08" filter="url(#dgblur)"/>
  ${spores(26, 1)}
</svg>`;

/* ---------- 2. Demodog ---------- */
ART.demodog = () => `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
  ${defs("dd")}
  <rect width="400" height="500" fill="url(#ddsky)"/>
  <rect y="300" width="400" height="200" fill="#120a16"/>
  ${pines(330, "#0a0712", 8, 1.2, 0)}
  <ellipse cx="200" cy="330" rx="170" ry="120" fill="url(#ddglow)"/>
  <!-- tunnel vines -->
  ${vine(0, 420, 160, 330, 9, "#2b1a20")}
  ${vine(400, 440, 250, 340, 7, "#2b1a20")}
  <g transform="translate(200 350)">
    <!-- tail -->
    <path d="M112 -10 C150 -30 170 -70 150 -96 C140 -70 122 -40 100 -24 Z" fill="#6b5f66"/>
    <!-- back legs -->
    <path d="M78 10 C92 40 92 70 80 92 l-22 0 C66 68 66 40 58 14 Z" fill="#6b5f66"/>
    <path d="M-70 14 C-60 44 -60 70 -70 92 l-22 0 C-80 66 -82 40 -90 18 Z" fill="#6b5f66"/>
    <!-- body -->
    <path d="M-104 6 C-96 -46 -40 -70 10 -66 C70 -62 112 -40 116 0 C118 36 70 56 6 56 C-56 56 -106 44 -104 6 Z" fill="url(#ddskin)"/>
    <g stroke="#6a5c62" stroke-width="2.4" fill="none" opacity=".6">
      <path d="M-70 -34 C-56 -12 -56 20 -70 42"/><path d="M-30 -48 C-16 -16 -16 24 -30 52"/>
      <path d="M12 -50 C26 -18 26 24 12 54"/><path d="M54 -44 C66 -16 66 20 54 46"/>
    </g>
    <!-- front legs -->
    <path d="M-86 16 C-96 48 -98 74 -88 96 l24 0 C-72 70 -70 44 -62 20 Z" fill="#8d8187"/>
    <path d="M76 20 C88 50 90 74 80 96 l-24 0 C64 72 62 46 54 24 Z" fill="#8d8187"/>
    <g fill="#cfc3c8">
      <path d="M-92 96 l28 0 4 10 -36 0 Z"/><path d="M56 96 l28 0 4 10 -36 0 Z"/>
    </g>
    <!-- head: open petals -->
    <g transform="translate(-116 -26) rotate(-14)">
      <ellipse rx="26" ry="22" fill="#2a1016"/>
      <g fill="url(#ddskin)" stroke="#6b5f66" stroke-width="1.4">
        <path d="M0 -4 C-20 -22 -44 -34 -58 -20 C-44 -2 -20 8 0 6 Z"/>
        <path d="M0 -4 C-10 -32 -6 -56 10 -60 C18 -38 14 -16 4 -4 Z"/>
        <path d="M0 -4 C-28 -24 -42 -48 -32 -62 C-16 -50 -4 -24 -2 -6 Z"/>
        <path d="M0 4 C-18 18 -42 28 -52 16 C-38 2 -18 -4 -2 0 Z"/>
        <path d="M0 4 C-8 28 -4 48 10 52 C16 32 12 14 4 4 Z"/>
      </g>
      <g fill="#fff6f6">
        ${Array.from({ length: 10 }, (_, i) => {
          const a = Math.PI * .45 + (i / 10) * Math.PI * 1.6, r = 20;
          return `<path d="M${Math.cos(a) * r} ${Math.sin(a) * r * .86} l${Math.cos(a) * 7} ${Math.sin(a) * 7} l${-Math.sin(a) * 3} ${Math.cos(a) * 3} Z"/>`;
        }).join("")}
      </g>
      <ellipse rx="12" ry="9" fill="#4a0d14"/>
    </g>
  </g>
  <rect y="330" width="400" height="170" fill="url(#ddfog)"/>
  ${spores(22, 3)}
</svg>`;

/* ---------- 3. the Mind Flayer over Hawkins ---------- */
ART.mindflayer = () => `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
  ${defs("mf")}
  <defs>
    <linearGradient id="mfred" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5c0f1c"/><stop offset=".5" stop-color="#2a0a16"/><stop offset="1" stop-color="#11040c"/>
    </linearGradient>
    <radialGradient id="mfstorm" cx=".5" cy=".3" r=".6">
      <stop offset="0" stop-color="#ff5a3c" stop-opacity=".5"/><stop offset="1" stop-color="#ff2020" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="500" fill="url(#mfred)"/>
  <ellipse cx="200" cy="150" rx="210" ry="150" fill="url(#mfstorm)"/>
  <!-- swirling clouds -->
  <g stroke="#ff8a6a" stroke-width="2" fill="none" opacity=".25">
    <path d="M-20 90 C60 50 140 120 220 70 C280 34 340 80 420 50"/>
    <path d="M-20 130 C60 94 150 160 230 112 C290 78 350 118 420 92"/>
    <path d="M-20 54 C70 20 130 70 210 34 C280 2 350 44 420 18"/>
  </g>
  <!-- lightning -->
  <path d="M120 40 l14 48 -20 6 26 58 -8 -44 20 -6 Z" fill="#ffd0a0" opacity=".8"/>
  <!-- the shadow monster -->
  <g fill="#120208" opacity=".95">
    <path d="M200 150 C236 150 258 178 254 214 C250 246 228 262 200 262 C172 262 150 246 146 214 C142 178 164 150 200 150 Z"/>
    <path d="M196 152 C190 120 176 96 150 80 C170 112 178 132 182 156 Z"/>
    <path d="M206 152 C214 118 232 94 258 80 C236 110 226 132 222 156 Z"/>
    <!-- long legs -->
    <path d="M160 220 C110 250 70 300 44 370 l16 10 C92 318 128 272 172 244 Z"/>
    <path d="M176 236 C140 282 118 330 104 400 l18 6 C140 344 162 300 190 262 Z"/>
    <path d="M240 220 C290 250 330 300 356 370 l-16 10 C308 318 272 272 228 244 Z"/>
    <path d="M224 236 C260 282 282 330 296 400 l-18 6 C260 344 238 300 210 262 Z"/>
    <path d="M200 262 C196 320 186 370 170 430 l20 6 C206 378 214 322 216 266 Z"/>
    <path d="M200 262 C212 318 228 364 252 420 l-18 10 C206 372 194 318 190 266 Z"/>
  </g>
  <!-- smoky edges -->
  <g fill="#1b0410" opacity=".55" filter="url(#mfsoft)">
    <ellipse cx="200" cy="206" rx="74" ry="56"/>
    <ellipse cx="150" cy="300" rx="20" ry="60" transform="rotate(22 150 300)"/>
    <ellipse cx="256" cy="300" rx="20" ry="60" transform="rotate(-22 256 300)"/>
  </g>
  <!-- Hawkins below -->
  <rect y="420" width="400" height="80" fill="#0a0410"/>
  <g fill="#060208">
    <path d="M0 430 h60 v70 h-60 Z"/>
    <path d="M70 440 l30 -24 30 24 v60 h-60 Z"/>
    <path d="M140 452 h54 v48 h-54 Z"/>
    <path d="M204 430 l22 -26 22 26 v70 h-44 Z"/>
    <path d="M258 446 h40 v54 h-40 Z"/>
    <path d="M306 420 h16 v80 h-16 Z M300 436 h28 v10 h-28 Z"/>
    <path d="M336 448 h64 v52 h-64 Z"/>
  </g>
  <g fill="#ffcf6a" opacity=".85">
    <rect x="12" y="448" width="9" height="11"/><rect x="34" y="448" width="9" height="11"/>
    <rect x="82" y="460" width="9" height="11"/><rect x="156" y="466" width="9" height="11"/>
    <rect x="268" y="462" width="9" height="11"/><rect x="352" y="464" width="9" height="11"/>
  </g>
  ${spores(18, 5)}
</svg>`;

/* ---------- 4. Demobats ---------- */
ART.demobat = () => `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
  ${defs("db")}
  <defs>
    <linearGradient id="dbsky2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a0e1a"/><stop offset=".6" stop-color="#1a0712"/><stop offset="1" stop-color="#0a0410"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#dbsky2)"/>
  <ellipse cx="200" cy="240" rx="190" ry="150" fill="url(#dbglow)"/>
  <!-- far bats -->
  <g fill="#1a0a12">
    ${Array.from({ length: 9 }, (_, i) => {
      const x = 30 + (i * 83) % 360, y = 60 + (i * 57) % 300, s = .25 + (i % 3) * .1;
      return `<g transform="translate(${x} ${y}) scale(${s})">
        <path d="M0 0 C-40 -26 -80 -20 -96 8 C-70 2 -44 10 -12 22 Z"/>
        <path d="M0 0 C40 -26 80 -20 96 8 C70 2 44 10 12 22 Z"/>
        <ellipse rx="16" ry="22" fill="#241018"/></g>`;
    }).join("")}
  </g>
  <!-- vines framing -->
  ${vine(-10, 0, 120, 200, 10, "#2a121a")}
  ${vine(410, 20, 280, 220, 12, "#2a121a")}
  <!-- the big bat -->
  <g transform="translate(200 250)">
    <path d="M-10 30 C-40 90 -30 150 10 190 C-4 140 -6 90 6 44 Z" fill="#6b4048"/>
    <g fill="#50242e" stroke="#2a1016" stroke-width="2">
      <path d="M-14 -10 C-80 -70 -150 -66 -178 -8 C-140 -22 -108 -8 -70 26 C-100 10 -126 14 -148 34 C-112 36 -70 52 -24 30 Z"/>
      <path d="M14 -10 C80 -70 150 -66 178 -8 C140 -22 108 -8 70 26 C100 10 126 14 148 34 C112 36 70 52 24 30 Z"/>
    </g>
    <g stroke="#2a1016" stroke-width="2" fill="none" opacity=".8">
      <path d="M-20 -4 L-150 -20 M-20 4 L-120 26 M-20 12 L-86 40"/>
      <path d="M20 -4 L150 -20 M20 4 L120 26 M20 12 L86 40"/>
    </g>
    <ellipse rx="30" ry="42" fill="url(#dbskin)"/>
    <path d="M-16 -34 C-10 -62 10 -62 16 -34 C8 -46 -8 -46 -16 -34 Z" fill="#8d8187"/>
    <g transform="translate(0 -22)">
      <ellipse rx="18" ry="15" fill="#2a1016"/>
      <g fill="url(#dbskin)" stroke="#5d5258" stroke-width="1.2">
        <path d="M0 -2 C-18 -16 -34 -24 -42 -12 C-30 0 -14 6 0 5 Z"/>
        <path d="M0 -2 C18 -16 34 -24 42 -12 C30 0 14 6 0 5 Z"/>
        <path d="M0 -2 C-8 -26 -4 -42 8 -44 C12 -28 8 -12 2 -3 Z"/>
        <path d="M0 -2 C8 -26 4 -42 -8 -44 C-12 -28 -8 -12 -2 -3 Z"/>
      </g>
      <g fill="#fff6f6">
        ${Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2, r = 14;
          return `<path d="M${Math.cos(a) * r} ${Math.sin(a) * r * .85} l${Math.cos(a) * 6} ${Math.sin(a) * 6} l${-Math.sin(a) * 2.6} ${Math.cos(a) * 2.6} Z"/>`;
        }).join("")}
      </g>
      <ellipse rx="8" ry="6" fill="#4a0d14"/>
    </g>
  </g>
  ${spores(24, 7)}
</svg>`;

/* ---------- 5. Vecna ---------- */
ART.vecna = () => `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
  ${defs("vc")}
  <defs>
    <linearGradient id="vcbody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9a6b55"/><stop offset=".5" stop-color="#6b4436"/><stop offset="1" stop-color="#36211c"/>
    </linearGradient>
    <radialGradient id="vcclock" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#ffb648" stop-opacity=".95"/><stop offset=".7" stop-color="#ff5a1e" stop-opacity=".35"/><stop offset="1" stop-color="#ff2020" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="500" fill="url(#vcsky)"/>
  <!-- the grandfather clock glowing behind him -->
  <g transform="translate(200 210)">
    <ellipse rx="150" ry="150" fill="url(#vcclock)"/>
    <g opacity=".5">
      <rect x="-54" y="-120" width="108" height="240" rx="10" fill="#1a0f12" stroke="#5a3a28" stroke-width="3"/>
      <circle cy="-62" r="40" fill="#f2e2c4" stroke="#5a3a28" stroke-width="3"/>
      <g stroke="#2a1a12" stroke-width="4" stroke-linecap="round">
        <path d="M0 -62 L0 -92"/><path d="M0 -62 L24 -54"/>
      </g>
      <circle cy="-62" r="4" fill="#2a1a12"/>
      <path d="M0 -10 L0 90" stroke="#5a3a28" stroke-width="3"/>
      <circle cy="92" r="16" fill="#d8a93c" stroke="#5a3a28" stroke-width="3"/>
    </g>
  </g>
  <!-- vines all around -->
  ${vine(-10, 480, 130, 260, 14, "#2e1a1e")}
  ${vine(410, 470, 270, 250, 12, "#2e1a1e")}
  ${vine(-10, 300, 90, 120, 7, "#3a2126")}
  ${vine(410, 280, 320, 110, 8, "#3a2126")}
  <!-- Vecna -->
  <g transform="translate(200 270)">
    <path d="M-54 36 C-70 110 -60 170 -30 210 L30 210 C60 168 70 110 54 36 Z" fill="url(#vcbody)"/>
    <path d="M-50 60 C-30 92 30 92 50 60" fill="none" stroke="#2c1a16" stroke-width="3" opacity=".7"/>
    <!-- raised arm with long fingers -->
    <path d="M44 10 C96 -20 128 -70 136 -126 l-22 -8 C104 -86 78 -46 34 -22 Z" fill="url(#vcbody)"/>
    <g stroke="#b08a6a" stroke-width="5" stroke-linecap="round">
      <path d="M130 -130 l10 -40"/><path d="M138 -126 l22 -32"/><path d="M142 -118 l32 -20"/><path d="M142 -108 l34 -2"/>
    </g>
    <path d="M-44 14 C-90 -4 -116 -46 -124 -96 l22 -10 C-92 -62 -70 -30 -34 -14 Z" fill="#7a5243"/>
    <g stroke="#b08a6a" stroke-width="4.5" stroke-linecap="round">
      <path d="M-120 -100 l-12 -34"/><path d="M-126 -94 l-26 -24"/><path d="M-128 -86 l-32 -10"/>
    </g>
    <!-- chest vines -->
    <g stroke="#3f2a22" stroke-width="4" fill="none" opacity=".9">
      <path d="M-30 40 C-10 70 10 70 30 40"/><path d="M-34 86 C-12 118 12 118 34 86"/>
      <path d="M-26 134 C-8 160 8 160 26 134"/>
    </g>
    <!-- head -->
    <g transform="translate(0 -34)">
      <path d="M0 -58 C34 -58 50 -30 48 4 C46 36 26 54 0 56 C-26 54 -46 36 -48 4 C-50 -30 -34 -58 0 -58 Z" fill="url(#vcbody)"/>
      <!-- gnarled ridges -->
      <g fill="none" stroke="#3a241d" stroke-width="3" opacity=".9">
        <path d="M-40 -16 C-20 -26 20 -26 40 -16"/><path d="M-44 2 C-20 -6 20 -6 44 2"/>
        <path d="M-38 20 C-18 12 18 12 38 20"/><path d="M-30 38 C-14 30 14 30 30 38"/>
      </g>
      <!-- horn-like vines on the head -->
      <g stroke="#4a2f24" stroke-width="6" stroke-linecap="round" fill="none">
        <path d="M-30 -50 C-44 -76 -40 -96 -22 -104"/><path d="M30 -50 C44 -76 40 -96 22 -104"/>
        <path d="M-10 -58 C-14 -84 -6 -100 6 -104"/>
      </g>
      <!-- glowing eyes -->
      <ellipse cx="-17" cy="-4" rx="7" ry="5" fill="#ffd27a"/>
      <ellipse cx="17" cy="-4" rx="7" ry="5" fill="#ffd27a"/>
      <ellipse cx="-17" cy="-4" rx="12" ry="9" fill="#ffb648" opacity=".35" filter="url(#vcsoft)"/>
      <ellipse cx="17" cy="-4" rx="12" ry="9" fill="#ffb648" opacity=".35" filter="url(#vcsoft)"/>
      <path d="M-14 26 C-6 34 6 34 14 26" fill="none" stroke="#2c1a16" stroke-width="3"/>
    </g>
  </g>
  <rect y="360" width="400" height="140" fill="#0a0410" opacity=".55"/>
  ${spores(20, 11)}
</svg>`;

/* ---------- 6. the Upside Down (cover art) ---------- */
ART.upsidedown = () => `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
  ${defs("ud")}
  <defs>
    <linearGradient id="udsky2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#101a3c"/><stop offset=".5" stop-color="#0d0a22"/><stop offset="1" stop-color="#060410"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#udsky2)"/>
  <ellipse cx="200" cy="250" rx="200" ry="200" fill="#4a2a7a" opacity=".2" filter="url(#udblur)"/>
  ${pines(500, "#0a0a1c", 8, 1.9, -20)}
  ${pines(470, "#080818", 6, 2.4, 40)}
  <!-- the gate -->
  <g transform="translate(200 300)">
    <ellipse rx="86" ry="112" fill="#1b0a14"/>
    <ellipse rx="86" ry="112" fill="none" stroke="#ff4a4a" stroke-width="4" opacity=".65"/>
    <ellipse rx="64" ry="88" fill="#2a0a12"/>
    <ellipse rx="40" ry="58" fill="#4a0d14" opacity=".9"/>
    <g stroke="#ff6a5a" stroke-width="2.5" fill="none" opacity=".7">
      <path d="M-86 -20 C-50 -40 -40 -90 -30 -112"/><path d="M86 20 C50 48 40 90 28 112"/>
      <path d="M-80 40 C-40 50 -20 86 -8 112"/><path d="M80 -40 C44 -52 20 -88 8 -112"/>
    </g>
  </g>
  ${vine(-10, 60, 140, 300, 12, "#241a30")}
  ${vine(410, 40, 266, 290, 14, "#241a30")}
  ${vine(-10, 420, 150, 330, 9, "#2a2038")}
  ${vine(410, 440, 256, 340, 10, "#2a2038")}
  <rect y="300" width="400" height="200" fill="url(#udfog)"/>
  ${spores(44, 2)}
</svg>`;

/* ---------- character cards: each character's famous object ----------
   Drawn with gradients, highlights and shadows so they look solid,
   sitting on a dark glowing shelf.                                      */
let pid = 0;
const ICONS = {
  eggo: a => `
    <g transform="translate(150 196)">
      <rect x="-74" y="-96" width="148" height="150" rx="8" fill="#e8a81e" stroke="#9c6b08" stroke-width="3"/>
      <rect x="-74" y="-96" width="148" height="34" rx="8" fill="#c4851a"/>
      <text x="0" y="-70" text-anchor="middle" font-family="Noto Serif Display,Georgia,serif" font-size="22" font-weight="800" fill="#fff8e0">EGGO</text>
      <rect x="-56" y="-50" width="112" height="86" rx="6" fill="#f6d78a" stroke="#9c6b08" stroke-width="2"/>
      <g transform="translate(0 -6)">
        <ellipse rx="46" ry="34" fill="#c98f3e"/><ellipse rx="42" ry="30" fill="#e8b25e"/>
        <g fill="#b8793a">${Array.from({ length: 16 }, (_, i) =>
          `<rect x="${-34 + (i % 4) * 18}" y="${-22 + Math.floor(i / 4) * 12}" width="12" height="8" rx="2"/>`).join("")}</g>
        <path d="M-30 -24 C-10 -34 18 -30 30 -16 C14 -24 -6 -26 -30 -24 Z" fill="#fff" opacity=".25"/>
      </g>
      <ellipse cy="62" rx="86" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  d20: a => `
    <g transform="translate(150 190)">
      <g stroke="#2a1a3a" stroke-width="2.5">
        <path d="M0 -84 L74 -42 L74 42 L0 84 L-74 42 L-74 -42 Z" fill="#6b3fb0"/>
        <path d="M0 -84 L0 -14 L74 -42 Z" fill="#8a5fd0"/><path d="M0 -84 L0 -14 L-74 -42 Z" fill="#7a4fc0"/>
        <path d="M74 -42 L0 -14 L74 42 Z" fill="#5a33a0"/><path d="M-74 -42 L0 -14 L-74 42 Z" fill="#4a2a88"/>
        <path d="M0 84 L0 -14 L74 42 Z" fill="#6b3fb0"/><path d="M0 84 L0 -14 L-74 42 Z" fill="#5a33a0"/>
      </g>
      <text x="0" y="-26" text-anchor="middle" font-family="Noto Serif Display,Georgia,serif" font-size="34" font-weight="800" fill="#ffe9ff">20</text>
      <ellipse cy="96" rx="80" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  walkie: a => `
    <g transform="translate(150 192)">
      <rect x="-12" y="-128" width="7" height="60" rx="3" fill="#6a6a78"/>
      <rect x="-15" y="-78" width="13" height="12" rx="3" fill="#2a2a34"/>
      <rect x="-46" y="-72" width="92" height="156" rx="12" fill="#2b2f38" stroke="#15171d" stroke-width="3"/>
      <rect x="-36" y="-60" width="72" height="40" rx="5" fill="#6fff9c" opacity=".22" stroke="#4a4f58" stroke-width="2"/>
      <text x="0" y="-32" text-anchor="middle" font-size="16" font-weight="800" fill="#9cffc0" font-family="Nunito,sans-serif">CH 4</text>
      <g fill="#1b1e24">${Array.from({ length: 9 }, (_, i) =>
        `<rect x="${-30 + (i % 3) * 22}" y="${-8 + Math.floor(i / 3) * 22}" width="18" height="16" rx="4"/>`).join("")}</g>
      <rect x="-30" y="62" width="60" height="12" rx="5" fill="#15171d"/>
      <rect x="-46" y="-72" width="22" height="156" rx="12" fill="#fff" opacity=".07"/>
      <ellipse cy="96" rx="70" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  sling: a => `
    <g transform="translate(150 196)">
      <path d="M-6 80 L-6 -6 L6 -6 L6 80 Z" fill="#8a5a2b" stroke="#5a3a18" stroke-width="2"/>
      <path d="M-6 -6 C-22 -34 -44 -46 -58 -52 L-50 -70 C-30 -60 -10 -40 0 -16 Z" fill="#8a5a2b" stroke="#5a3a18" stroke-width="2"/>
      <path d="M6 -6 C22 -34 44 -46 58 -52 L50 -70 C30 -60 10 -40 0 -16 Z" fill="#9a6a38" stroke="#5a3a18" stroke-width="2"/>
      <path d="M-54 -62 C-20 -36 20 -36 54 -62" fill="none" stroke="#c43a3a" stroke-width="5"/>
      <path d="M-54 -62 C-24 -48 -14 -30 -8 -14 M54 -62 C24 -48 14 -30 8 -14" fill="none" stroke="#c43a3a" stroke-width="4"/>
      <rect x="-14" y="-20" width="28" height="18" rx="5" fill="#3a2a1a"/>
      <circle cx="0" cy="-36" r="9" fill="#9aa3b5" stroke="#5c6472" stroke-width="2"/>
      <ellipse cy="92" rx="66" ry="11" fill="${a}" opacity=".35"/>
    </g>`,
  crayons: a => `
    <g transform="translate(150 194)">
      <rect x="-80" y="-70" width="160" height="124" rx="6" fill="#f3e6cf" stroke="#b49a72" stroke-width="3" transform="rotate(-5)"/>
      <g transform="rotate(-5)" stroke="#5a3a2a" stroke-width="3" fill="none">
        <path d="M-56 20 C-40 -18 -20 30 -2 -10 C14 -40 40 20 58 -6"/>
        <path d="M-50 36 C-28 10 -6 44 18 16 C36 -4 52 32 64 14"/>
      </g>
      <g transform="rotate(-5)" fill="#2a1a12" opacity=".5">
        <circle cx="-30" cy="-30" r="5"/><circle cx="12" cy="-40" r="5"/><circle cx="46" cy="-24" r="5"/>
      </g>
      ${[["#c43a3a", -46], ["#2f7d3e", -14], ["#2f5fa8", 18], ["#e0a81e", 50]].map(([c, x]) =>
        `<g transform="translate(${x} 60) rotate(8)"><rect x="-9" y="-30" width="18" height="52" rx="3" fill="${c}"/>
         <path d="M-9 -30 L0 -46 L9 -30 Z" fill="${c}"/><rect x="-9" y="-12" width="18" height="7" fill="#fff" opacity=".3"/></g>`).join("")}
      <ellipse cy="96" rx="86" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  walkman: a => `
    <g transform="translate(150 196)">
      <path d="M-96 -58 C-96 -110 96 -110 96 -58" fill="none" stroke="#2b2f38" stroke-width="9"/>
      <rect x="-112" y="-62" width="30" height="46" rx="12" fill="#3a3f4a" stroke="#1b1e24" stroke-width="3"/>
      <rect x="82" y="-62" width="30" height="46" rx="12" fill="#3a3f4a" stroke="#1b1e24" stroke-width="3"/>
      <rect x="-62" y="-20" width="124" height="86" rx="10" fill="#d8dce4" stroke="#8b919c" stroke-width="3"/>
      <rect x="-48" y="-6" width="96" height="48" rx="5" fill="#2b2f38"/>
      <circle cx="-20" cy="18" r="13" fill="#8b919c"/><circle cx="20" cy="18" r="13" fill="#8b919c"/>
      <circle cx="-20" cy="18" r="4" fill="#2b2f38"/><circle cx="20" cy="18" r="4" fill="#2b2f38"/>
      <rect x="-48" y="48" width="40" height="10" rx="4" fill="#c43a3a"/>
      <text x="26" y="58" text-anchor="middle" font-size="11" font-weight="800" fill="#5a6070" font-family="Nunito,sans-serif">PLAY</text>
      <ellipse cy="86" rx="86" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  bat: a => `
    <g transform="translate(150 190) rotate(-18)">
      <path d="M-16 86 L-10 -58 L10 -58 L16 86 Z" fill="#a5743c" stroke="#6b4a24" stroke-width="3"/>
      <path d="M-10 -58 C-10 -86 10 -86 10 -58 Z" fill="#a5743c" stroke="#6b4a24" stroke-width="3"/>
      <rect x="-16" y="56" width="32" height="30" rx="6" fill="#3a2a1a"/>
      <g stroke="#1b1e24" stroke-width="2">
        ${Array.from({ length: 9 }, (_, i) => {
          const y = -54 + i * 13, s = i % 2 ? 1 : -1;
          return `<path d="M${s * 11} ${y} l${s * 26} -7 l-3 9 l${-s * 24} 5 Z" fill="#cfd8e8"/>`;
        }).join("")}
      </g>
      <path d="M-8 -50 L-4 60" stroke="#fff" stroke-width="3" opacity=".25"/>
      <ellipse cy="100" rx="40" ry="10" fill="${a}" opacity=".35" transform="rotate(18)"/>
    </g>`,
  scoops: a => `
    <g transform="translate(150 200)">
      <path d="M-70 -46 C-70 -92 70 -92 70 -46 L70 -34 L-70 -34 Z" fill="#f7f9fd" stroke="#c6ccd8" stroke-width="3"/>
      <rect x="-70" y="-50" width="140" height="14" fill="#2f5fa8"/>
      <path d="M-86 -34 h172 c10 0 12 16 0 16 H-86 c-12 0 -10 -16 0 -16 Z" fill="#e6ebf4" stroke="#c6ccd8" stroke-width="2"/>
      <path d="M0 -84 l8 16 -16 0 Z" fill="#2f5fa8"/>
      <g transform="translate(0 44)">
        <path d="M-26 -16 L26 -16 L0 58 Z" fill="#d79a4e" stroke="#a9742f" stroke-width="2"/>
        <g stroke="#a9742f" stroke-width="1.5" opacity=".7"><path d="M-16 2 L10 -10 M-8 20 L18 2 M0 38 L22 20"/></g>
        <circle cx="-10" cy="-26" r="19" fill="#ffd6e6"/><circle cx="12" cy="-30" r="17" fill="#bfe8ff"/>
        <circle cx="0" cy="-44" r="15" fill="#fff0b8"/>
        <circle cx="-14" cy="-32" r="5" fill="#fff" opacity=".5"/>
      </g>
      <ellipse cy="108" rx="60" ry="11" fill="${a}" opacity=".35"/>
    </g>`,
  notes: a => `
    <g transform="translate(150 192)">
      <rect x="-66" y="-80" width="132" height="160" rx="6" fill="#f3e6cf" stroke="#b49a72" stroke-width="3" transform="rotate(-4)"/>
      <g transform="rotate(-4)">
        <rect x="-66" y="-80" width="132" height="20" rx="6" fill="#c0392b"/>
        <g stroke="#9aa3b5" stroke-width="2">${Array.from({ length: 7 }, (_, i) => `<path d="M-50 ${-38 + i * 18} H50"/>`).join("")}</g>
        <g stroke="#2a3a5a" stroke-width="3" stroke-linecap="round">
          <path d="M-44 -40 H30"/><path d="M-44 -22 H44"/><path d="M-44 -4 H14"/><path d="M-44 14 H38"/><path d="M-44 32 H22"/>
        </g>
        <text x="0" y="-64" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Nunito,sans-serif">HAWKINS POST</text>
      </g>
      <g transform="translate(54 44) rotate(28)">
        <rect x="-5" y="-54" width="10" height="96" rx="3" fill="#2f5fa8"/><path d="M-5 42 L0 58 L5 42 Z" fill="#1b1e24"/>
      </g>
      <ellipse cy="100" rx="74" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  camera: a => `
    <g transform="translate(150 196)">
      <rect x="-84" y="-48" width="168" height="108" rx="14" fill="#2b2f38" stroke="#15171d" stroke-width="3"/>
      <rect x="-50" y="-66" width="52" height="22" rx="6" fill="#2b2f38" stroke="#15171d" stroke-width="3"/>
      <circle cx="10" cy="6" r="46" fill="#15171d"/><circle cx="10" cy="6" r="36" fill="#23262e" stroke="#4a4f58" stroke-width="3"/>
      <circle cx="10" cy="6" r="24" fill="#0c1018"/><circle cx="10" cy="6" r="14" fill="#1b3a5a"/>
      <circle cx="2" cy="-4" r="6" fill="#9fd0ff" opacity=".8"/>
      <circle cx="-56" cy="-18" r="10" fill="#c0392b"/>
      <rect x="-80" y="-44" width="24" height="100" rx="10" fill="#fff" opacity=".06"/>
      <text x="-44" y="48" font-size="12" font-weight="800" fill="#8b919c" font-family="Nunito,sans-serif">BYERS</text>
      <ellipse cy="82" rx="88" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  guitar: a => `
    <g transform="translate(150 196) rotate(-20)">
      <rect x="-8" y="-128" width="16" height="92" rx="3" fill="#3a2a1a" stroke="#1f1510" stroke-width="2"/>
      <path d="M-14 -132 L14 -132 L18 -150 L-18 -150 Z" fill="#2a1a12"/>
      <g fill="#cfd8e8">${Array.from({ length: 6 }, (_, i) => `<circle cx="${i % 2 ? 16 : -16}" cy="${-146 + Math.floor(i / 2) * 7}" r="3"/>`).join("")}</g>
      <path d="M-46 -36 C-70 -36 -84 -8 -80 24 C-76 58 -52 76 -26 68 C-10 62 10 62 26 68 C52 76 76 58 80 24 C84 -8 70 -36 46 -36 Z"
            fill="#8b1d2c" stroke="#4a0d14" stroke-width="3"/>
      <circle cx="0" cy="12" r="16" fill="#2a0a10"/>
      <rect x="-10" y="-38" width="20" height="60" fill="#3a2a1a"/>
      <g stroke="#e8e2d0" stroke-width="1.6">${Array.from({ length: 6 }, (_, i) => `<path d="M${-7 + i * 3} -126 L${-7 + i * 3} 44"/>`).join("")}</g>
      <rect x="-22" y="40" width="44" height="12" rx="3" fill="#d8b36a"/>
      <path d="M-40 -20 C-56 0 -56 30 -40 48" fill="none" stroke="#fff" stroke-width="4" opacity=".18"/>
      <ellipse cy="92" rx="56" ry="11" fill="${a}" opacity=".35" transform="rotate(20)"/>
    </g>`,
  badge: a => `
    <g transform="translate(150 192)">
      <path d="M0 -92 C40 -92 76 -74 76 -74 C76 -10 52 46 0 78 C-52 46 -76 -10 -76 -74 C-76 -74 -40 -92 0 -92 Z"
            fill="#d8a93c" stroke="#8a6410" stroke-width="4"/>
      <path d="M0 -78 C34 -78 64 -64 64 -64 C64 -12 44 36 0 64 C-44 36 -64 -12 -64 -64 C-64 -64 -34 -78 0 -78 Z"
            fill="#f0c95a" stroke="#8a6410" stroke-width="2"/>
      <g fill="#8a6410">
        <text x="0" y="-30" text-anchor="middle" font-size="15" font-weight="800" font-family="Nunito,sans-serif">CHIEF</text>
        <text x="0" y="8" text-anchor="middle" font-size="13" font-weight="800" font-family="Nunito,sans-serif">HAWKINS</text>
        <text x="0" y="30" text-anchor="middle" font-size="13" font-weight="800" font-family="Nunito,sans-serif">POLICE</text>
      </g>
      <path d="M-40 -70 C-20 -84 20 -84 40 -70" fill="none" stroke="#fff" stroke-width="5" opacity=".4"/>
      <ellipse cy="96" rx="68" ry="12" fill="${a}" opacity=".35"/>
    </g>`,
  lights: a => `
    <g transform="translate(150 190)">
      <path d="M-120 -60 C-70 10 -40 -30 0 20 C40 -30 70 10 120 -60" fill="none" stroke="#2a2030" stroke-width="5"/>
      ${[["#ff3b3b", -104, -34], ["#ffd54a", -66, -8], ["#4fd2ff", -28, 2], ["#6fff9c", 10, 10], ["#ff5fc8", 48, -6], ["#ff9f3b", 86, -30]].map(([c, x, y]) => `
        <g transform="translate(${x} ${y})">
          <rect x="-5" y="-12" width="10" height="9" rx="2" fill="#4a4a52"/>
          <ellipse rx="12" ry="16" fill="${c}"/><ellipse rx="26" ry="30" fill="${c}" opacity=".22"/>
          <ellipse cx="-4" cy="-5" rx="3.4" ry="5" fill="#fff" opacity=".55"/>
        </g>`).join("")}
      <g font-family="Noto Serif Display,Georgia,serif" font-size="26" font-weight="800" fill="#e8d9b8" opacity=".85">
        <text x="-96" y="86">R</text><text x="-46" y="86">U</text><text x="4" y="86">N</text>
      </g>
      <ellipse cy="110" rx="100" ry="12" fill="${a}" opacity=".3"/>
    </g>`,
  sundae: a => `
    <g transform="translate(150 200)">
      <path d="M-44 -18 L44 -18 L30 66 C28 76 -28 76 -30 66 Z" fill="#cfe8ff" opacity=".35" stroke="#9fd0ff" stroke-width="3"/>
      <circle cx="-16" cy="-30" r="22" fill="#ffd6e6"/><circle cx="16" cy="-34" r="20" fill="#fff0b8"/>
      <circle cx="0" cy="-52" r="18" fill="#c08a5a"/>
      <path d="M-30 -34 C-10 -46 10 -46 30 -36" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/>
      <circle cx="0" cy="-70" r="9" fill="#c43a3a"/><path d="M0 -79 C4 -88 10 -90 14 -90" fill="none" stroke="#2f7d3e" stroke-width="3"/>
      <g fill="#ff5fc8"><circle cx="-24" cy="-16" r="3"/><circle cx="-4" cy="-12" r="3"/><circle cx="20" cy="-18" r="3"/></g>
      <g fill="#4fd2ff"><circle cx="-14" cy="-6" r="3"/><circle cx="10" cy="-4" r="3"/></g>
      <rect x="26" y="-96" width="7" height="110" rx="3" fill="#ff9f3b" transform="rotate(12 30 -40)"/>
      <ellipse cy="88" rx="56" ry="11" fill="${a}" opacity=".35"/>
    </g>`,
};

ART.portrait = o => {
  const id = "q" + (pid++), a = o.accent || "#ff2020";
  const icon = (ICONS[o.icon] || ICONS.d20)(a);
  return `<svg viewBox="0 0 300 330" xmlns="http://www.w3.org/2000/svg" class="art portrait">
    <defs>
      <radialGradient id="${id}g" cx=".5" cy=".45" r=".62">
        <stop offset="0" stop-color="${a}" stop-opacity=".75"/><stop offset=".5" stop-color="${a}" stop-opacity=".25"/>
        <stop offset="1" stop-color="${a}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#160c22"/><stop offset=".6" stop-color="#0a0514"/><stop offset="1" stop-color="#05030c"/>
      </linearGradient>
      <filter id="${id}b"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="${id}drop"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity=".65"/></filter>
    </defs>
    <rect width="300" height="330" fill="url(#${id}bg)"/>
    <ellipse cx="150" cy="160" rx="120" ry="130" fill="url(#${id}g)"/>
    <g stroke="${a}" stroke-width="1" opacity=".16">
      ${Array.from({ length: 6 }, (_, i) => `<path d="M${-10 + i * 60} 330 C${30 + i * 60} 220 ${i * 60} 120 ${40 + i * 60} 0" fill="none"/>`).join("")}
    </g>
    <ellipse cx="150" cy="292" rx="120" ry="26" fill="${a}" opacity=".28" filter="url(#${id}b)"/>
    <g filter="url(#${id}drop)">${icon}</g>
    <g fill="#fff">${Array.from({ length: 14 }, (_, i) =>
      `<circle cx="${(i * 83) % 300}" cy="${(i * 101) % 310}" r="${.9 + (i % 3) * .5}" opacity="${.18 + (i % 4) * .12}"/>`).join("")}</g>
    <rect width="300" height="330" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
  </svg>`;
};

function lighten(hex, amt = 34) { return shift(hex, amt); }
function darken(hex, amt = -40) { return shift(hex, amt); }
function shift(hex, amt) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const n = parseInt(hex.slice(1), 16);
  const ch = s => Math.max(0, Math.min(255, ((n >> s) & 255) + amt));
  return "#" + ((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0");
}

/* ---------- 7. Hawkins at night (home page hero) ---------- */
ART.hawkins = () => `
<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" class="art" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="hwsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b0a22"/><stop offset=".55" stop-color="#2a0f22"/><stop offset="1" stop-color="#0a0410"/>
    </linearGradient>
    <radialGradient id="hwlamp" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffb648" stop-opacity="0"/>
    </radialGradient>
    <filter id="hwb"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <rect width="800" height="300" fill="url(#hwsky)"/>
  <g fill="#fff" opacity=".55">
    ${Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 97) % 800}" cy="${(i * 53) % 150}" r="${.6 + (i % 3) * .5}"/>`).join("")}
  </g>
  <circle cx="650" cy="62" r="26" fill="#f6efe0" opacity=".9"/>
  <circle cx="650" cy="62" r="46" fill="#f6efe0" opacity=".15" filter="url(#hwb)"/>
  <!-- treeline -->
  <g fill="#0b0712">
    ${Array.from({ length: 16 }, (_, i) => {
      const x = i * 54 + 10, h = 70 + (i * 41) % 60;
      return `<path d="M${x} 230 l-22 0 l11 -22 l-8 0 l10 -20 l-7 0 l${16 - 0} -${h * .38} l16 ${h * .38} l-7 0 l10 20 l-8 0 l11 22 Z"/>`;
    }).join("")}
  </g>
  <!-- road and houses -->
  <rect y="228" width="800" height="72" fill="#0a0610"/>
  <g fill="#120a18">
    <path d="M40 228 l0 -40 l34 -26 l34 26 l0 40 Z"/>
    <path d="M150 228 l0 -34 l30 -22 l30 22 l0 34 Z"/>
    <path d="M300 228 l0 -44 l36 -26 l36 26 l0 44 Z"/>
    <path d="M470 228 l0 -36 l32 -24 l32 24 l0 36 Z"/>
    <path d="M600 228 l0 -30 l28 -20 l28 20 l0 30 Z"/>
  </g>
  <g fill="#ffcf6a" opacity=".9">
    <rect x="62" y="196" width="12" height="14"/><rect x="170" y="202" width="11" height="13"/>
    <rect x="326" y="192" width="13" height="15"/><rect x="492" y="200" width="12" height="13"/><rect x="620" y="206" width="11" height="12"/>
  </g>
  <!-- street lamp -->
  <g transform="translate(720 150)">
    <rect x="-3" y="0" width="6" height="80" fill="#0e0a14"/>
    <path d="M-3 0 q0 -18 20 -18" fill="none" stroke="#0e0a14" stroke-width="6"/>
    <ellipse cx="22" cy="-16" rx="40" ry="34" fill="url(#hwlamp)"/>
    <ellipse cx="22" cy="-16" rx="7" ry="5" fill="#ffe9b0"/>
  </g>
  <!-- kids on bikes, silhouettes -->
  <g fill="#060308">
    ${[120, 210, 300].map((x, i) => `
      <g transform="translate(${x} ${250 + (i % 2) * 4}) scale(${.9 + i * .05})">
        <circle cx="-14" cy="18" r="13" fill="none" stroke="#060308" stroke-width="3"/>
        <circle cx="16" cy="18" r="13" fill="none" stroke="#060308" stroke-width="3"/>
        <path d="M-14 18 L2 2 L16 18 M2 2 L8 -6 M-14 18 L-2 0" stroke="#060308" stroke-width="3" fill="none"/>
        <circle cx="0" cy="-20" r="7"/>
        <path d="M0 -14 C8 -12 10 -2 8 2 L-6 2 C-8 -4 -6 -12 0 -14 Z"/>
        <path d="M6 -8 L14 -4" stroke="#060308" stroke-width="3"/>
      </g>`).join("")}
  </g>
  <ellipse cx="400" cy="300" rx="420" ry="50" fill="#ff2020" opacity=".08" filter="url(#hwb)"/>
</svg>`;
