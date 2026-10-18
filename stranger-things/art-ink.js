"use strict";
/* =====================================================================
   INK ART — the scary drawings, done as black line work on white so
   they print properly. Heavy outlines, hatching for shadow, no big
   blocks of ink. Used by the Print Shop.
   ===================================================================== */
const INKART = (function () {
  const K = "#111";

  /* teeth around the inside edge of a petal */
  function teeth(cx, cy, a, len, n, size) {
    let out = "";
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const d = len * t;
      const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d;
      const nx = -Math.sin(a), ny = Math.cos(a);
      const s = size * (1 - Math.abs(t - .5));
      out += `<path d="M${(px + nx * 2).toFixed(1)} ${(py + ny * 2).toFixed(1)}
        L${(px + nx * (2 + s) + Math.cos(a) * s * .6).toFixed(1)} ${(py + ny * (2 + s) + Math.sin(a) * s * .6).toFixed(1)}
        L${(px + nx * 2 + Math.cos(a) * s * 1.5).toFixed(1)} ${(py + ny * 2 + Math.sin(a) * s * 1.5).toFixed(1)} Z"
        fill="${K}"/>`;
      out += `<path d="M${(px - nx * 2).toFixed(1)} ${(py - ny * 2).toFixed(1)}
        L${(px - nx * (2 + s) + Math.cos(a) * s * .6).toFixed(1)} ${(py - ny * (2 + s) + Math.sin(a) * s * .6).toFixed(1)}
        L${(px - nx * 2 + Math.cos(a) * s * 1.5).toFixed(1)} ${(py - ny * 2 + Math.sin(a) * s * 1.5).toFixed(1)} Z"
        fill="${K}"/>`;
    }
    return out;
  }
  /* parallel hatching inside a rough area */
  function hatch(x0, y0, x1, y1, step, slant, op) {
    let out = "";
    for (let x = x0; x < x1; x += step) {
      out += `<path d="M${x.toFixed(1)} ${y0} L${(x + slant).toFixed(1)} ${y1}" stroke="${K}"
        stroke-width="1.1" opacity="${op || .4}"/>`;
    }
    return out;
  }

  /* ---------------- the Demogorgon ----------------
     The same shape as the one in the monster files, but printed as a
     solid black silhouette on white so it stays scary on paper. */
  function head(R, n, spread) {
    let s = "";
    const mid = (n - 1) / 2;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i - mid) * (Math.PI * spread / n);
      const len = R * (1 - Math.abs(i - mid) / n * .3);
      const x = Math.cos(a) * len, y = Math.sin(a) * len;
      const nx = -Math.sin(a), ny = Math.cos(a), w = R * .3;
      s += `<path d="M0 0 C${(x * .3 + nx * w).toFixed(1)} ${(y * .3 + ny * w).toFixed(1)}
              ${(x * .78 + nx * w * .7).toFixed(1)} ${(y * .78 + ny * w * .7).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}
              C${(x * .78 - nx * w * .7).toFixed(1)} ${(y * .78 - ny * w * .7).toFixed(1)}
              ${(x * .3 - nx * w).toFixed(1)} ${(y * .3 - ny * w).toFixed(1)} 0 0 Z"
            fill="${K}" stroke="#fff" stroke-width="2"/>`;
    }
    /* the throat, with teeth biting inwards */
    s += `<ellipse rx="${(R * .38).toFixed(1)}" ry="${(R * .32).toFixed(1)}" fill="${K}"/>`;
    s += `<ellipse rx="${(R * .3).toFixed(1)}" ry="${(R * .25).toFixed(1)}" fill="#fff"/>`;
    const t = Math.round(n * 2.6);
    for (let i = 0; i < t; i++) {
      const a = (i / t) * Math.PI * 2, r = R * .3;
      s += `<path d="M${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * .84).toFixed(1)}
              l${(-Math.cos(a) * R * .17).toFixed(1)} ${(-Math.sin(a) * R * .15).toFixed(1)}
              l${(-Math.sin(a) * R * .07).toFixed(1)} ${(Math.cos(a) * R * .07).toFixed(1)} Z" fill="${K}"/>`;
    }
    return s + `<ellipse rx="${(R * .1).toFixed(1)}" ry="${(R * .085).toFixed(1)}" fill="${K}"/>`;
  }

  function demogorgon() {
    return `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style="width:100%">
  <rect width="400" height="500" fill="#fff"/>

  <!-- limbs -->
  <g stroke="${K}" fill="none" stroke-linecap="round">
    <path d="M182 310 C166 352 160 398 170 444" stroke-width="40"/>
    <path d="M220 310 C238 352 244 398 234 444" stroke-width="36"/>
    <path d="M166 212 C122 250 100 312 96 372" stroke-width="27"/>
    <path d="M234 212 C278 250 300 312 304 372" stroke-width="25"/>
  </g>
  <g fill="${K}">
    <path d="M146 440 l48 0 8 22 -64 0 Z"/><path d="M206 440 l48 0 6 22 -62 0 Z"/>
    <path d="M200 156 C240 166 254 208 249 254 C244 298 226 324 200 330 C174 324 156 298 151 254
             C146 208 160 166 200 156 Z"/>
    <ellipse cx="200" cy="198" rx="58" ry="21"/>
  </g>
  <!-- claws -->
  <g stroke="${K}" stroke-width="5" stroke-linecap="round">
    <path d="M92 374 l-20 36"/><path d="M98 380 l-4 42"/><path d="M108 376 l14 38"/>
    <path d="M308 374 l20 36"/><path d="M302 380 l4 42"/><path d="M292 376 l-14 38"/>
  </g>
  <!-- white edge lines so the black mass still reads as a body -->
  <g stroke="#fff" stroke-width="2.2" fill="none" opacity=".85">
    <path d="M166 214 C184 228 216 228 234 214"/>
    <path d="M160 248 C182 264 218 264 240 248"/>
    <path d="M166 282 C184 296 216 296 234 282"/>
    <path d="M186 312 C178 352 174 398 180 436"/>
    <path d="M216 312 C224 352 228 398 222 436"/>
    <path d="M168 216 C132 252 112 310 108 364"/>
  </g>

  <g transform="translate(200 122)">${head(80, 7, 1.2)}</g>

  <ellipse cx="200" cy="478" rx="120" ry="11" fill="${K}" opacity=".18"/>
</svg>`;
  }

  /* ---------------- a Demodog, snarling ---------------- */
  function demodog() {
    const HX = 112, HY = 196;
    let flower = "";
    for (let i = 0; i < 5; i++) {
      const a = Math.PI + (i - 2) * .5;
      const L = 66;
      const tipx = HX + Math.cos(a) * L, tipy = HY + Math.sin(a) * L;
      const nx = -Math.sin(a) * 18, ny = Math.cos(a) * 18;
      flower += `
        <path d="M${HX} ${HY} C${HX + nx} ${HY + ny} ${tipx + nx * .4} ${tipy + ny * .4} ${tipx} ${tipy}
          C${tipx - nx * .4} ${tipy - ny * .4} ${HX - nx} ${HY - ny} ${HX} ${HY} Z"
          fill="#fff" stroke="${K}" stroke-width="3.2" stroke-linejoin="round"/>
        ${teeth(HX, HY, a, L, 5, 6)}`;
    }
    return `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" style="width:100%">
  <rect width="400" height="320" fill="#fff"/>
  <path d="M150 196 C196 170 268 172 306 198 C330 214 330 248 306 258 C266 274 196 272 156 252
           C132 240 132 208 150 196 Z" fill="#fff" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
  <g stroke="${K}" fill="none" stroke-width="1.8" opacity=".7">
    <path d="M186 186 C196 206 196 238 186 258"/><path d="M222 180 C232 204 232 244 222 266"/>
    <path d="M258 182 C268 204 268 242 258 262"/>
  </g>
  ${hatch(250, 196, 310, 262, 8, -10, .3)}
  <path d="M306 216 C338 206 352 184 346 164" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g stroke="${K}" stroke-width="3.4" fill="#fff" stroke-linejoin="round">
    <path d="M172 252 l-10 42 l14 2 l10 -40 z"/><path d="M214 262 l-4 38 l14 0 l4 -38 z"/>
    <path d="M258 258 l6 40 l14 -2 l-6 -38 z"/><path d="M292 248 l16 36 l12 -6 l-14 -34 z"/>
  </g>
  <g stroke="${K}" stroke-width="2.6" fill="#fff">
    <path d="M160 292 l-14 8 l16 4 z"/><path d="M212 298 l-14 8 l16 4 z"/>
    <path d="M272 296 l14 10 l-16 2 z"/><path d="M318 282 l16 8 l-14 6 z"/>
  </g>
  ${flower}
  <circle cx="${HX}" cy="${HY}" r="22" fill="#fff" stroke="${K}" stroke-width="3.4"/>
  <circle cx="${HX}" cy="${HY}" r="12" fill="${K}"/>
  <ellipse cx="200" cy="306" rx="110" ry="9" fill="none" stroke="${K}" stroke-width="2" opacity=".45"/>
</svg>`;
  }

  return { demogorgon, demodog };
})();
