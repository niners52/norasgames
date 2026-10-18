"use strict";
/* =====================================================================
   The creature drawing, shared by the Monster Maker and the Print Shop
   so a monster you build looks the same on screen and on paper.
   ===================================================================== */
/* ---------- draw the monster ---------- */
function draw(c) {
  const col = c.color, dark = "#07050b";
  const scale = { small: .7, human: .92, huge: 1.08, giant: 1.2 }[c.size];
  let body = "", legs = "", head = "", extra = "";

  if (c.body === "tall")   body = `<path d="M200 170 C244 180 260 226 254 272 C248 316 226 342 200 348 C174 342 152 316 146 272 C140 226 156 180 200 170 Z" fill="${dark}"/>`;
  if (c.body === "blob")   body = `<path d="M200 168 C268 172 290 230 282 286 C274 338 240 356 200 356 C160 356 126 338 118 286 C110 230 132 172 200 168 Z" fill="${dark}"/>`;
  if (c.body === "spider") body = `<ellipse cx="200" cy="262" rx="76" ry="58" fill="${dark}"/><ellipse cx="200" cy="200" rx="44" ry="36" fill="${dark}"/>`;
  if (c.body === "bat")    body = `<ellipse cx="200" cy="262" rx="40" ry="62" fill="${dark}"/>
     <path d="M184 220 C110 150 36 162 10 220 C56 198 96 216 140 256 C100 236 62 242 34 268 C84 272 142 292 190 262 Z" fill="${dark}"/>
     <path d="M216 220 C290 150 364 162 390 220 C344 198 304 216 260 256 C300 236 338 242 366 268 C316 272 258 292 210 262 Z" fill="${dark}"/>`;
  if (c.body === "vine")   body = `<path d="M200 170 C248 184 264 236 256 292 C248 338 228 352 200 356 C172 352 152 338 144 292 C136 236 152 184 200 170 Z" fill="${dark}"/>
     <g stroke="${col}" stroke-width="3" fill="none" opacity=".55"><path d="M166 206 C188 226 212 226 234 206"/><path d="M160 248 C186 272 214 272 240 248"/>
     <path d="M166 292 C188 312 212 312 234 292"/></g>`;

  const legStroke = `stroke="${dark}" stroke-width="22" fill="none" stroke-linecap="round"`;
  if (c.legs === "two")   legs = `<g ${legStroke}><path d="M182 338 C172 386 170 424 176 456"/><path d="M218 338 C228 386 230 424 224 456"/></g>`;
  if (c.legs === "four")  legs = `<g ${legStroke}><path d="M156 330 C140 380 138 420 146 456"/><path d="M182 338 C172 386 170 424 176 456"/>
     <path d="M218 338 C228 386 230 424 224 456"/><path d="M244 330 C260 380 262 420 254 456"/></g>`;
  if (c.legs === "six")   legs = `<g stroke="${dark}" stroke-width="14" fill="none" stroke-linecap="round">
     <path d="M140 300 C96 330 70 380 60 440"/><path d="M160 320 C130 370 118 410 116 452"/><path d="M186 336 C178 390 176 424 180 456"/>
     <path d="M260 300 C304 330 330 380 340 440"/><path d="M240 320 C270 370 282 410 284 452"/><path d="M214 336 C222 390 224 424 220 456"/></g>`;
  if (c.legs === "tenta") legs = `<g stroke="${dark}" stroke-width="18" fill="none" stroke-linecap="round">
     <path d="M160 330 C120 380 130 420 100 456"/><path d="M182 340 C166 390 186 420 160 460"/>
     <path d="M218 340 C234 390 214 420 240 460"/><path d="M240 330 C280 380 270 420 300 456"/></g>`;
  if (c.legs === "float") legs = `<ellipse cx="200" cy="430" rx="90" ry="20" fill="${col}" opacity=".28"/>`;

  const hy = c.body === "spider" ? 196 : 150;
  if (c.head === "petal") {
    head = `<g transform="translate(200 ${hy})"><ellipse rx="30" ry="26" fill="${dark}"/>` +
      Array.from({ length: 7 }, (_, i) => {
        const a = -Math.PI / 2 + (i - 3) * .45, x = Math.cos(a) * 64, y = Math.sin(a) * 60;
        const nx = -Math.sin(a) * 18, ny = Math.cos(a) * 18;
        return `<path d="M0 0 C${x * .3 + nx} ${y * .3 + ny} ${x * .8 + nx * .7} ${y * .8 + ny * .7} ${x} ${y}
          C${x * .8 - nx * .7} ${y * .8 - ny * .7} ${x * .3 - nx} ${y * .3 - ny} 0 0 Z" fill="${dark}" stroke="${col}" stroke-width="1.6" stroke-opacity=".7"/>`;
      }).join("") +
      `<ellipse rx="20" ry="16" fill="${col}" opacity=".85"/><ellipse rx="9" ry="7" fill="#14040a"/></g>`;
  }
  if (c.head === "bug") head = `<g transform="translate(200 ${hy})"><ellipse rx="48" ry="38" fill="${dark}"/>
     <path d="M-24 -32 L-44 -72 M24 -32 L44 -72" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
     <circle cx="-44" cy="-74" r="7" fill="${col}"/><circle cx="44" cy="-74" r="7" fill="${col}"/>
     <ellipse cx="-18" cy="-4" rx="11" ry="9" fill="${col}"/><ellipse cx="18" cy="-4" rx="11" ry="9" fill="${col}"/>
     <path d="M-20 20 L20 20" stroke="${col}" stroke-width="4"/></g>`;
  if (c.head === "skull") head = `<g transform="translate(200 ${hy})"><path d="M0 -44 C34 -44 50 -20 48 8 C46 28 32 40 0 44 C-32 40 -46 28 -48 8 C-50 -20 -34 -44 0 -44 Z" fill="${dark}"/>
     <ellipse cx="-17" cy="-4" rx="11" ry="13" fill="${col}"/><ellipse cx="17" cy="-4" rx="11" ry="13" fill="${col}"/>
     <path d="M-8 20 h16 M-14 30 h28" stroke="${col}" stroke-width="4"/></g>`;
  if (c.head === "eyes") head = `<g transform="translate(200 ${hy})"><ellipse rx="46" ry="40" fill="${dark}"/>` +
     Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2;
       return `<circle cx="${Math.cos(a) * 24}" cy="${Math.sin(a) * 20}" r="8" fill="${col}"/><circle cx="${Math.cos(a) * 24}" cy="${Math.sin(a) * 20}" r="3.4" fill="#14040a"/>`;
     }).join("") + `</g>`;
  if (c.head === "horn") head = `<g transform="translate(200 ${hy})"><path d="M0 -40 C32 -40 46 -16 44 10 C42 32 26 44 0 46 C-26 44 -42 32 -44 10 C-46 -16 -32 -40 0 -40 Z" fill="${dark}"/>
     <path d="M-28 -34 C-44 -66 -36 -86 -18 -92 M28 -34 C44 -66 36 -86 18 -92" stroke="${dark}" stroke-width="10" fill="none" stroke-linecap="round"/>
     <ellipse cx="-16" cy="0" rx="8" ry="6" fill="${col}"/><ellipse cx="16" cy="0" rx="8" ry="6" fill="${col}"/>
     <path d="M-14 24 C-6 32 6 32 14 24" stroke="${col}" stroke-width="3.4" fill="none"/></g>`;

  if (c.extra === "tail")  extra += `<path d="M256 320 C330 330 370 390 340 456" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  if (c.extra === "spikes") extra += `<g fill="${dark}">` + Array.from({ length: 6 }, (_, i) =>
     `<path d="M${168 + i * 13} ${200 + (i % 2) * 8} l-9 -26 l18 0 Z"/>`).join("") + `</g>`;
  if (c.extra === "claws") extra += `<g stroke="${col}" stroke-width="4" stroke-linecap="round" opacity=".9">
     <path d="M146 300 l-34 26"/><path d="M148 316 l-32 34"/><path d="M254 300 l34 26"/><path d="M252 316 l32 34"/></g>`;
  if (c.extra === "glowspots") extra += `<g fill="${col}" opacity=".85">` + Array.from({ length: 7 }, (_, i) =>
     `<circle cx="${174 + (i % 3) * 26}" cy="${210 + Math.floor(i / 3) * 42}" r="6"/>`).join("") + `</g>`;

  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mmg" cx=".5" cy=".45" r=".6">
        <stop offset="0" stop-color="${col}" stop-opacity=".75"/><stop offset=".5" stop-color="${col}" stop-opacity=".25"/>
        <stop offset="1" stop-color="${col}" stop-opacity="0"/>
      </radialGradient>
      <filter id="mmb"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <rect width="400" height="500" fill="#0a0410"/>
    <ellipse cx="200" cy="250" rx="180" ry="200" fill="url(#mmg)"/>
    <ellipse cx="200" cy="462" rx="150" ry="36" fill="${col}" opacity=".25" filter="url(#mmb)"/>
    <g transform="translate(200 260) scale(${scale}) translate(-200 -260)">${legs}${body}${head}${extra}</g>
    <rect width="400" height="500" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="14"/>
  </svg>`;
}


/* the Print Shop calls it by this name */
window.MONSTER_ART = draw;
