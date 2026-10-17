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

/* =====================================================================
   THE MONSTERS
   Drawn as dark creatures lit from behind, the way they look when a
   flashlight catches them in the fog. Shadow first, glowing edges after.
   ===================================================================== */
const SHADOW = "#07050b";
const scene = (id, c1, c2, c3) => `
  <defs>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="${id}back" cx=".5" cy=".46" r=".52">
      <stop offset="0" stop-color="#ffb08a" stop-opacity=".85"/><stop offset=".35" stop-color="#ff4a3a" stop-opacity=".45"/>
      <stop offset="1" stop-color="#ff2020" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}mist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd9c8" stop-opacity="0"/><stop offset="1" stop-color="#ffb9a0" stop-opacity=".30"/>
    </linearGradient>
    <linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff8a6a"/><stop offset=".5" stop-color="#ffd9c0"/><stop offset="1" stop-color="#ff5a4a"/>
    </linearGradient>
    <filter id="${id}blur"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}soft"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${id}glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="500" fill="url(#${id}sky)"/>`;
const mist = id => `<rect y="250" width="400" height="250" fill="url(#${id}mist)"/>
  <ellipse cx="200" cy="470" rx="230" ry="60" fill="#ffd0c0" opacity=".10" filter="url(#${id}blur)"/>`;
const grain = n => Array.from({ length: n }, (_, i) =>
  `<circle cx="${(i * 149) % 400}" cy="${(i * 97) % 500}" r="${.7 + (i % 3) * .5}" fill="#ffe8e0" opacity="${.12 + (i % 5) * .08}"/>`).join("");

/* the flower head: petals that open out like a blossom, teeth inside */
const petalHead = (id, R, n = 7, spread = 1.15) => {
  let s = `<ellipse rx="${R * .5}" ry="${R * .44}" fill="${SHADOW}"/>`;
  for (let i = 0; i < n; i++) {
    const mid = (n - 1) / 2;
    const a = -Math.PI / 2 + (i - mid) * (Math.PI * spread / n);
    const len = R * (1 - Math.abs(i - mid) / n * .3);
    const x = Math.cos(a) * len, y = Math.sin(a) * len;
    const nx = -Math.sin(a), ny = Math.cos(a), w = R * .3;
    s += `<path d="M0 0 C${x * .3 + nx * w} ${y * .3 + ny * w} ${x * .78 + nx * w * .7} ${y * .78 + ny * w * .7} ${x} ${y}
            C${x * .78 - nx * w * .7} ${y * .78 - ny * w * .7} ${x * .3 - nx * w} ${y * .3 - ny * w} 0 0 Z"
          fill="${SHADOW}" stroke="url(#${id}rim)" stroke-width="1.7" stroke-opacity=".65"/>`;
  }
  s += `<g filter="url(#${id}glow)"><ellipse rx="${R * .36}" ry="${R * .3}" fill="#4a0b12"/>
        <ellipse rx="${R * .23}" ry="${R * .18}" fill="#8a1118"/></g>`;
  const t = Math.round(n * 2.6);
  for (let i = 0; i < t; i++) {
    const a = (i / t) * Math.PI * 2, r = R * .34;
    s += `<path d="M${Math.cos(a) * r} ${Math.sin(a) * r * .84} l${Math.cos(a) * R * .15} ${Math.sin(a) * R * .14}
            l${-Math.sin(a) * R * .055} ${Math.cos(a) * R * .055} Z" fill="#ffd9c8" opacity=".92"/>`;
  }
  return s + `<ellipse rx="${R * .12}" ry="${R * .1}" fill="#14040a"/>`;
};

/* ---------- 1. the Demogorgon ---------- */
ART.demogorgon = () => {
  const id = "dg";
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
    ${scene(id, "#2b1016", "#180a14", "#0a040c")}
    <ellipse cx="200" cy="250" rx="190" ry="210" fill="url(#${id}back)"/>
    ${pines(470, "#0d060f", 7, 2.3, 10)}
    ${pines(500, "#07040a", 5, 3, 60)}
    <!-- glow along the ground so the legs show as shadow against it -->
    <ellipse cx="200" cy="440" rx="250" ry="120" fill="url(#${id}back)" opacity=".7"/>
    <ellipse cx="200" cy="470" rx="190" ry="60" fill="#ffb9a0" opacity=".18" filter="url(#${id}blur)"/>
    <g stroke="${SHADOW}" fill="none" stroke-linecap="round">
      <!-- legs: thick thighs, bent backwards like an animal's -->
      <path d="M182 310 C166 352 160 398 170 444" stroke-width="40"/>
      <path d="M220 310 C238 352 244 398 234 444" stroke-width="36"/>
      <!-- arms: way too long, nearly to the ground -->
      <path d="M166 212 C122 250 100 312 96 372" stroke-width="27"/>
      <path d="M234 212 C278 250 300 312 304 372" stroke-width="25"/>
    </g>
    <g fill="${SHADOW}">
      <!-- feet -->
      <path d="M146 440 l48 0 8 22 -64 0 Z"/><path d="M206 440 l48 0 6 22 -62 0 Z"/>
      <!-- torso: broad chest, thin waist -->
      <path d="M200 150 C248 160 266 206 260 254 C254 300 232 324 200 330 C168 324 146 300 140 254 C134 206 152 160 200 150 Z"/>
      <ellipse cx="200" cy="196" rx="66" ry="24"/>
    </g>
    <!-- claws -->
    <g stroke="url(#${id}rim)" stroke-width="4" stroke-linecap="round" opacity=".85">
      <path d="M92 374 l-20 36"/><path d="M98 380 l-4 40"/><path d="M108 376 l14 36"/>
      <path d="M308 374 l20 36"/><path d="M302 380 l4 40"/><path d="M292 376 l-14 36"/>
    </g>
    <!-- rim light where the glow behind catches the body -->
    <g stroke="url(#${id}rim)" stroke-width="3" fill="none" opacity=".7" filter="url(#${id}glow)">
      <path d="M200 150 C152 162 134 206 140 254 C146 300 168 324 198 330"/>
      <path d="M166 212 C124 252 102 312 98 368"/>
      <path d="M182 310 C166 352 160 398 170 440"/>
    </g>
    <g stroke="url(#${id}rim)" stroke-width="2" fill="none" opacity=".3">
      <path d="M166 214 C184 228 216 228 234 214"/><path d="M160 248 C182 264 218 264 240 248"/>
      <path d="M166 282 C184 296 216 296 234 282"/>
    </g>
    <!-- the head, opened into a flower -->
    <g transform="translate(200 136)">${petalHead(id, 66, 7)}</g>
    ${mist(id)}${grain(26)}
    <rect width="400" height="500" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="16"/>
  </svg>`;
};

/* ---------- 2. Demodog ---------- */
ART.demodog = () => {
  const id = "dd";
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
    ${scene(id, "#241019", "#140a14", "#08040a")}
    <ellipse cx="230" cy="300" rx="200" ry="170" fill="url(#${id}back)"/>
    <!-- tunnel of vines -->
    <g stroke="#1a0c14" stroke-width="16" fill="none" stroke-linecap="round">
      <path d="M-10 60 C80 150 70 300 20 470"/><path d="M410 40 C320 140 330 300 380 470"/>
      <path d="M-10 200 C60 240 90 260 120 340"/><path d="M410 180 C340 230 310 260 280 330"/>
    </g>
    <!-- glow behind the legs -->
    <ellipse cx="210" cy="430" rx="230" ry="110" fill="url(#${id}back)" opacity=".8"/>
    <ellipse cx="210" cy="460" rx="180" ry="56" fill="#ffb9a0" opacity=".2" filter="url(#${id}blur)"/>
    <g transform="translate(200 360)">
      <!-- tail -->
      <path d="M120 -16 C166 -40 186 -92 160 -124 C152 -86 130 -48 104 -28 Z" fill="${SHADOW}"/>
      <!-- far legs, a touch lighter so they read behind the body -->
      <path d="M86 6 C102 52 102 92 88 124 l-28 0 C76 90 74 52 62 10 Z" fill="#1a0d14"/>
      <path d="M-80 10 C-66 56 -66 92 -80 124 l-28 0 C-92 88 -94 52 -104 14 Z" fill="#1a0d14"/>
      <g fill="#1a0d14"><path d="M58 124 l30 0 4 12 -38 0 Z"/><path d="M-110 124 l30 0 4 12 -38 0 Z"/></g>
      <!-- body -->
      <path d="M-112 2 C-104 -54 -44 -82 10 -78 C76 -74 122 -48 126 -2 C128 40 76 62 6 62 C-62 62 -114 48 -112 2 Z" fill="${SHADOW}"/>
      <g stroke="url(#${id}rim)" stroke-width="2.2" fill="none" opacity=".45">
        <path d="M-74 -40 C-58 -14 -58 24 -74 48"/><path d="M-30 -56 C-14 -20 -14 28 -30 58"/>
        <path d="M14 -58 C30 -22 30 28 14 60"/><path d="M58 -50 C72 -18 72 24 58 52"/>
      </g>
      <!-- near legs -->
      <path d="M-96 14 C-110 58 -112 96 -98 126 l30 0 C-78 92 -76 54 -68 20 Z" fill="${SHADOW}"/>
      <path d="M88 18 C104 60 106 96 92 126 l-30 0 C74 94 72 56 62 24 Z" fill="${SHADOW}"/>
      <g fill="${SHADOW}"><path d="M-102 126 l34 0 4 14 -42 0 Z"/><path d="M62 126 l34 0 4 14 -42 0 Z"/></g>
      <g stroke="url(#${id}rim)" stroke-width="2.4" fill="none" opacity=".55" filter="url(#${id}glow)">
        <path d="M-96 14 C-110 58 -112 96 -98 124"/><path d="M88 18 C104 60 106 96 92 124"/>
      </g>
      <!-- rim light along the back -->
      <path d="M-112 2 C-104 -54 -44 -82 10 -78 C76 -74 122 -48 126 -2"
            fill="none" stroke="url(#${id}rim)" stroke-width="3" opacity=".8" filter="url(#${id}glow)"/>
      <!-- head -->
      <g transform="translate(-132 -34) rotate(-108)">${petalHead(id, 62, 6, 1.1)}</g>
    </g>
    ${mist(id)}${grain(22)}
    <rect width="400" height="500" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="16"/>
  </svg>`;
};

/* ---------- 3. the Mind Flayer ---------- */
ART.mindflayer = () => {
  const id = "mf";
  const leg = (sx, sy, cx1, cy1, cx2, cy2, ex, ey, w) =>
    `<path d="M${sx} ${sy} C${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey}" fill="none" stroke="${SHADOW}" stroke-width="${w}" stroke-linecap="round"/>
     <path d="M${sx} ${sy} C${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey}" fill="none" stroke="url(#${id}rim)" stroke-width="${w * .22}" opacity=".5"/>`;
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
    ${scene(id, "#4a0f1a", "#250a14", "#0d040a")}
    <ellipse cx="200" cy="170" rx="240" ry="190" fill="url(#${id}back)" opacity=".9"/>
    <!-- storm clouds -->
    <g stroke="#ff8a6a" stroke-width="2" fill="none" opacity=".2">
      <path d="M-20 70 C70 28 140 110 230 56 C290 20 350 70 420 36"/>
      <path d="M-20 118 C70 80 160 150 240 98 C300 62 360 106 420 78"/>
      <path d="M-20 34 C80 2 140 54 220 18 C290 -12 360 28 420 2"/>
    </g>
    <path d="M118 28 l16 54 -24 8 30 66 -10 -50 24 -8 Z" fill="#ffe0b8" opacity=".75" filter="url(#${id}soft)"/>
    <!-- the shadow itself -->
    <g>
      ${leg(176, 212, 120, 250, 80, 330, 34, 430, 20)}
      ${leg(186, 226, 140, 300, 120, 360, 96, 470, 16)}
      ${leg(224, 212, 280, 250, 320, 330, 366, 430, 20)}
      ${leg(214, 226, 260, 300, 280, 360, 304, 470, 16)}
      ${leg(200, 238, 196, 320, 186, 380, 170, 480, 14)}
      ${leg(202, 238, 214, 320, 226, 380, 240, 480, 12)}
      <path d="M200 120 C246 120 272 158 268 204 C264 246 236 268 200 268 C164 268 136 246 132 204 C128 158 154 120 200 120 Z" fill="${SHADOW}"/>
      <path d="M196 122 C188 86 170 58 138 36 C166 76 178 100 182 128 Z" fill="${SHADOW}"/>
      <path d="M206 122 C216 84 238 56 268 36 C242 74 228 100 224 128 Z" fill="${SHADOW}"/>
      <!-- smoky edge -->
      <g fill="#1a0610" opacity=".6" filter="url(#${id}soft)">
        <ellipse cx="200" cy="196" rx="86" ry="64"/><ellipse cx="150" cy="150" rx="26" ry="36" transform="rotate(24 150 150)"/>
        <ellipse cx="252" cy="150" rx="26" ry="36" transform="rotate(-24 252 150)"/>
      </g>
      <path d="M200 120 C154 120 128 158 132 204" fill="none" stroke="url(#${id}rim)" stroke-width="3" opacity=".55" filter="url(#${id}glow)"/>
    </g>
    <!-- Hawkins underneath -->
    <rect y="436" width="400" height="64" fill="#07030a"/>
    <g fill="#050208">
      <path d="M0 446 h66 v54 h-66 Z"/><path d="M76 456 l32 -26 32 26 v44 h-64 Z"/>
      <path d="M150 468 h58 v32 h-58 Z"/><path d="M216 444 l24 -28 24 28 v56 h-48 Z"/>
      <path d="M272 460 h44 v40 h-44 Z"/><path d="M322 430 h16 v70 h-16 Z M316 446 h28 v10 h-28 Z"/>
      <path d="M350 462 h50 v38 h-50 Z"/>
    </g>
    <g fill="#ffc46a" opacity=".9">
      <rect x="14" y="462" width="9" height="11"/><rect x="38" y="462" width="9" height="11"/>
      <rect x="90" y="470" width="9" height="11"/><rect x="166" y="478" width="9" height="11"/>
      <rect x="284" y="472" width="9" height="11"/><rect x="368" y="476" width="9" height="11"/>
    </g>
    ${grain(20)}
    <rect width="400" height="500" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="16"/>
  </svg>`;
};

/* ---------- 4. Demobats ---------- */
ART.demobat = () => {
  const id = "db";
  const bat = (x, y, s, o) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}">
      <path d="M0 0 C-36 -30 -84 -30 -104 2 C-74 -6 -44 6 -14 24 Z" fill="${SHADOW}"/>
      <path d="M0 0 C36 -30 84 -30 104 2 C74 -6 44 6 14 24 Z" fill="${SHADOW}"/>
      <ellipse rx="15" ry="22" fill="${SHADOW}"/>
      <path d="M0 22 C10 54 2 86 -14 104" fill="none" stroke="${SHADOW}" stroke-width="7" stroke-linecap="round"/>
    </g>`;
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
    ${scene(id, "#5a1420", "#2a0b16", "#0c040a")}
    <ellipse cx="200" cy="230" rx="210" ry="190" fill="url(#${id}back)"/>
    <g stroke="#2a0e16" stroke-width="18" fill="none" stroke-linecap="round">
      <path d="M-10 0 C90 90 70 250 30 500"/><path d="M410 -10 C310 80 340 240 380 500"/>
    </g>
    ${[[70, 90, .3, .5], [330, 70, .26, .45], [120, 170, .22, .4], [300, 190, .2, .38], [60, 300, .18, .3], [350, 320, .16, .3], [200, 70, .2, .35]]
      .map(([x, y, s, o]) => bat(x, y, s, o)).join("")}
    <!-- the big one -->
    <g transform="translate(200 270)">
      <path d="M-18 24 C-44 92 -22 150 20 186 C-2 140 -10 86 -2 40 Z" fill="${SHADOW}"/>
      <path d="M-16 -12 C-86 -84 -162 -74 -190 -8 C-146 -28 -108 -8 -66 30 C-100 10 -132 16 -156 42 C-112 44 -62 60 -20 34 Z" fill="${SHADOW}"/>
      <path d="M16 -12 C86 -84 162 -74 190 -8 C146 -28 108 -8 66 30 C100 10 132 16 156 42 C112 44 62 60 20 34 Z" fill="#0b0510"/>
      <g stroke="url(#${id}rim)" stroke-width="2" fill="none" opacity=".55">
        <path d="M-20 -6 L-160 -22 M-20 4 L-124 30 M-20 14 L-86 46"/>
        <path d="M20 -6 L160 -22 M20 4 L124 30 M20 14 L86 46"/>
      </g>
      <path d="M-16 -12 C-86 -84 -162 -74 -190 -8" fill="none" stroke="url(#${id}rim)" stroke-width="3" opacity=".75" filter="url(#${id}glow)"/>
      <ellipse rx="34" ry="46" fill="${SHADOW}"/>
      <g transform="translate(0 -30)">${petalHead(id, 44, 5, 1.05)}</g>
    </g>
    ${mist(id)}${grain(24)}
    <rect width="400" height="500" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="16"/>
  </svg>`;
};

/* ---------- 5. Vecna ---------- */
ART.vecna = () => {
  const id = "vc";
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" class="art">
    ${scene(id, "#2e1208", "#1a0a0c", "#09040a")}
    <defs>
      <radialGradient id="${id}clock" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ffcf7a" stop-opacity=".95"/><stop offset=".55" stop-color="#ff7a2e" stop-opacity=".4"/>
        <stop offset="1" stop-color="#ff2020" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="200" cy="210" rx="190" ry="200" fill="url(#${id}clock)"/>
    <!-- the grandfather clock behind him -->
    <g opacity=".55">
      <rect x="146" y="80" width="108" height="300" rx="10" fill="#140a0c" stroke="#6b4420" stroke-width="3"/>
      <circle cx="200" cy="146" r="40" fill="#f3e2bc" stroke="#6b4420" stroke-width="3"/>
      <g stroke="#2a1a12" stroke-width="4" stroke-linecap="round"><path d="M200 146 L200 116"/><path d="M200 146 L224 154"/></g>
      <circle cx="200" cy="146" r="4" fill="#2a1a12"/>
      <circle cx="200" cy="300" r="18" fill="#d8a93c" stroke="#6b4420" stroke-width="3"/>
    </g>
    <!-- vines -->
    <g stroke="#1b0d10" stroke-width="14" fill="none" stroke-linecap="round">
      <path d="M-10 500 C70 400 60 300 130 240"/><path d="M410 490 C330 400 340 300 270 240"/>
      <path d="M-10 300 C60 260 80 180 100 90"/><path d="M410 280 C340 250 320 170 300 80"/>
    </g>
    <g transform="translate(200 300)">
      <!-- body -->
      <path d="M-58 40 C-76 120 -62 180 -30 220 L30 220 C62 180 76 120 58 40 Z" fill="${SHADOW}"/>
      <!-- raised arm with long fingers -->
      <path d="M46 8 C104 -22 140 -78 148 -140 l-26 -10 C112 -92 82 -46 34 -24 Z" fill="${SHADOW}"/>
      <g stroke="url(#${id}rim)" stroke-width="4.6" stroke-linecap="round" opacity=".9">
        <path d="M142 -146 l12 -46"/><path d="M150 -140 l26 -36"/><path d="M154 -130 l36 -22"/><path d="M154 -118 l38 -2"/>
      </g>
      <path d="M-46 14 C-98 -6 -126 -52 -134 -106 l24 -12 C-100 -70 -76 -34 -36 -16 Z" fill="#0c060e"/>
      <g stroke="url(#${id}rim)" stroke-width="4" stroke-linecap="round" opacity=".7">
        <path d="M-130 -112 l-14 -38"/><path d="M-136 -104 l-28 -26"/><path d="M-138 -94 l-36 -10"/>
      </g>
      <!-- vine ridges across the chest -->
      <g stroke="url(#${id}rim)" stroke-width="2.6" fill="none" opacity=".45">
        <path d="M-34 44 C-12 76 12 76 34 44"/><path d="M-40 92 C-14 126 14 126 40 92"/><path d="M-30 140 C-10 168 10 168 30 140"/>
      </g>
      <path d="M-58 40 C-76 120 -62 180 -30 220" fill="none" stroke="url(#${id}rim)" stroke-width="3" opacity=".7" filter="url(#${id}glow)"/>
      <!-- head -->
      <g transform="translate(0 -40)">
        <path d="M0 -64 C38 -64 56 -32 54 6 C52 42 30 60 0 62 C-30 60 -52 42 -54 6 C-56 -32 -38 -64 0 -64 Z" fill="${SHADOW}"/>
        <g fill="none" stroke="url(#${id}rim)" stroke-width="2.4" opacity=".5">
          <path d="M-44 -18 C-22 -30 22 -30 44 -18"/><path d="M-48 2 C-22 -8 22 -8 48 2"/>
          <path d="M-42 22 C-20 12 20 12 42 22"/><path d="M-32 42 C-14 32 14 32 32 42"/>
        </g>
        <g stroke="${SHADOW}" stroke-width="7" stroke-linecap="round" fill="none">
          <path d="M-32 -54 C-48 -84 -42 -108 -22 -116"/><path d="M32 -54 C48 -84 42 -108 22 -116"/><path d="M-8 -62 C-14 -92 -4 -110 8 -116"/>
        </g>
        <g filter="url(#${id}glow)">
          <ellipse cx="-18" cy="-4" rx="8" ry="5.5" fill="#ffcf7a"/><ellipse cx="18" cy="-4" rx="8" ry="5.5" fill="#ffcf7a"/>
        </g>
        <path d="M-16 28 C-6 38 6 38 16 28" fill="none" stroke="url(#${id}rim)" stroke-width="2.6" opacity=".7"/>
      </g>
    </g>
    ${mist(id)}${grain(22)}
    <rect width="400" height="500" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="16"/>
  </svg>`;
};

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
