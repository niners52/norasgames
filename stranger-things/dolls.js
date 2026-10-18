"use strict";
/* =====================================================================
   CUT-OUT DRESS-UP DOLLS — take two.
   Soft rounded bodies, proper hair with locks and highlights, big shiny
   eyes, and a bit of shading everywhere so they don't look flat.
   All drawn from scratch; nobody's artwork copied.
   ===================================================================== */
const DOLLS = (function () {
  const INK = "#3b2a46";

  /* ---------- colour helpers ---------- */
  function mix(hex, to, amt) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = to === "dark" ? 0 : 255;
    const f = v => Math.round(v + (t - v) * amt);
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  const dark = (c, a) => mix(c, "dark", a === undefined ? .18 : a);
  const light = (c, a) => mix(c, "light", a === undefined ? .22 : a);

  /* ---------- face ---------- */
  function face(eye, skin) {
    return `
    <g>
      <!-- eyes -->
      <ellipse cx="76" cy="92" rx="13.5" ry="16" fill="#fff"/>
      <ellipse cx="124" cy="92" rx="13.5" ry="16" fill="#fff"/>
      <ellipse cx="77" cy="94" rx="10" ry="12.5" fill="${eye}"/>
      <ellipse cx="125" cy="94" rx="10" ry="12.5" fill="${eye}"/>
      <ellipse cx="77" cy="97" rx="9.4" ry="9" fill="${dark(eye, .45)}"/>
      <ellipse cx="125" cy="97" rx="9.4" ry="9" fill="${dark(eye, .45)}"/>
      <circle cx="77" cy="96" r="5" fill="#241a2e"/><circle cx="125" cy="96" r="5" fill="#241a2e"/>
      <circle cx="81" cy="88" r="4.2" fill="#fff"/><circle cx="129" cy="88" r="4.2" fill="#fff"/>
      <circle cx="72" cy="101" r="2.2" fill="#fff" opacity=".9"/>
      <circle cx="120" cy="101" r="2.2" fill="#fff" opacity=".9"/>
      <!-- lashes -->
      <path d="M62 86 q14 -12 28 -4" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M110 82 q14 -8 28 4" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M63 77 q11 -9 23 -5 M114 72 q12 -4 23 5" stroke="${dark(skin, .45)}" stroke-width="3.4"
            fill="none" stroke-linecap="round" opacity=".75"/>
      <!-- blush + nose + mouth -->
      <ellipse cx="58" cy="110" rx="9" ry="6" fill="#ff9ec4" opacity=".5"/>
      <ellipse cx="142" cy="110" rx="9" ry="6" fill="#ff9ec4" opacity=".5"/>
      <path d="M98 108 q3 3 4 0" stroke="${dark(skin, .3)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M92 118 q8 8 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  /* ---------- body ---------- */
  function body(skin, shirt) {
    const sh = dark(skin, .13), shd = dark(shirt, .14);
    return `
    <g>
      <!-- legs -->
      <path d="M86 246 q-5 44 -4 78 q0 7 9 7 q9 0 9 -7 q1 -34 1 -78 z" fill="${skin}"/>
      <path d="M114 246 q5 44 4 78 q0 7 -9 7 q-9 0 -9 -7 q-1 -34 -1 -78 z" fill="${skin}"/>
      <path d="M114 246 q5 44 4 78 q0 7 -9 7 q-3 0 -5 -1 q7 -40 4 -84 z" fill="${sh}" opacity=".55"/>
      <!-- shoes -->
      <path d="M78 330 q12 7 22 1 l1 12 q0 9 -11 9 h-14 q-6 0 -6 -7 q0 -9 8 -15 z" fill="#f2f0f6"/>
      <path d="M122 330 q-12 7 -22 1 l-1 12 q0 9 11 9 h14 q6 0 6 -7 q0 -9 -8 -15 z" fill="#f2f0f6"/>
      <path d="M69 345 h26 M105 345 h26" stroke="${dark("#f2f0f6", .22)}" stroke-width="4" stroke-linecap="round"/>
      <!-- torso -->
      <path d="M72 152 q28 -14 56 0 q6 48 4 96 q-32 12 -64 0 q-2 -48 4 -96 z" fill="${shirt}"/>
      <path d="M110 152 q12 2 18 0 q6 48 4 96 q-10 4 -20 5 q6 -52 -2 -101 z" fill="${shd}" opacity=".6"/>
      <!-- shorts -->
      <path d="M68 232 q32 12 64 0 l-3 24 q-29 10 -58 0 z" fill="#cfe0f5"/>
      <!-- arms -->
      <path d="M74 158 q-16 22 -18 54 q-2 12 8 14 q10 2 12 -10 q3 -28 10 -46 z" fill="${skin}"/>
      <path d="M126 158 q16 22 18 54 q2 12 -8 14 q-10 2 -12 -10 q-3 -28 -10 -46 z" fill="${skin}"/>
      <ellipse cx="62" cy="228" rx="11" ry="10" fill="${skin}"/>
      <ellipse cx="138" cy="228" rx="11" ry="10" fill="${skin}"/>
      <path d="M126 158 q16 22 18 54 q2 12 -8 14 q-3 1 -6 0 q8 -6 6 -18 q-3 -28 -14 -50 z" fill="${sh}" opacity=".5"/>
      <!-- neck -->
      <path d="M88 136 h24 v18 q-12 6 -24 0 z" fill="${sh}"/>
    </g>`;
  }

  /* ---------- hair ---------- */
  /* a bumpy outline, for curls */
  function curlPath(r, bumps, cx, cy) {
    let d = "", step = Math.PI / bumps;
    for (let i = 0; i <= bumps; i++) {
      const a = Math.PI + i * step;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (!i) { d += `M${x.toFixed(1)} ${y.toFixed(1)}`; continue; }
      const pa = Math.PI + (i - 1) * step;
      const mx = cx + Math.cos((a + pa) / 2) * (r + 15), my = cy + Math.sin((a + pa) / 2) * (r + 15);
      d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }

  /* Each style has a BACK piece (drawn behind the head) and a FRONT piece
     (the fringe and side locks), so the face is never covered. */
  const HAIR = {
    buzz: c => ({
      back: "",
      front: `<path d="M44 84 q0 -50 56 -50 q56 0 56 50 q-10 -8 -17 -6 q-10 -24 -39 -24 q-29 0 -39 24 q-7 -2 -17 6 z"
              fill="${c}"/>
        <path d="M56 62 q18 -18 44 -18 q26 0 44 18 q-20 -10 -44 -10 q-24 0 -44 10 z" fill="${light(c, .34)}" opacity=".8"/>
        <g fill="${dark(c, .25)}" opacity=".5">
          ${[[70, 52], [86, 44], [104, 44], [120, 50], [62, 66], [136, 64], [100, 38]]
            .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`).join("")}
        </g>`,
    }),

    curls: c => ({
      back: `<path d="${curlPath(76, 8, 100, 96)} L176 96 q0 24 -8 40 q-68 16 -136 0 q-8 -16 -8 -40 z" fill="${dark(c, .14)}"/>`,
      front: `<path d="${curlPath(68, 7, 100, 86)} L168 86 q0 12 -6 22 q-12 -22 -62 -22 q-50 0 -62 22 q-6 -10 -6 -22 z" fill="${c}"/>
        <path d="${curlPath(54, 6, 100, 80)}" fill="none" stroke="${light(c, .3)}" stroke-width="8"
              stroke-linecap="round" opacity=".75"/>
        <g fill="none" stroke="${dark(c, .3)}" stroke-width="3.2" stroke-linecap="round" opacity=".6">
          <path d="M60 64 q11 -10 19 1"/><path d="M90 50 q11 -10 19 1"/><path d="M120 62 q11 -10 18 2"/></g>`,
    }),

    bowl: c => ({
      back: `<ellipse cx="100" cy="94" rx="62" ry="60" fill="${dark(c, .15)}"/>`,
      front: `<path d="M38 96 q-2 -58 62 -58 q64 0 62 58 q-9 -12 -19 -10 q-5 -8 -9 -16 q-13 14 -34 14
                 q-21 0 -34 -14 q-4 8 -9 16 q-10 -2 -19 10 z" fill="${c}"/>
        <path d="M52 66 q20 -22 48 -22 q28 0 48 22 q-22 -13 -48 -13 q-26 0 -48 13 z" fill="${light(c, .32)}" opacity=".85"/>
        <path d="M38 96 q4 -12 14 -12 q-3 14 -2 26 q-8 -4 -12 -14 z M162 96 q-4 -12 -14 -12 q3 14 2 26 q8 -4 12 -14 z" fill="${c}"/>`,
    }),

    wavy: c => ({
      back: `<path d="M34 104 q-4 -72 66 -72 q70 0 66 72 q-2 48 -14 92 q-12 -8 -14 -28 q-8 18 -20 26
               q10 -44 4 -84 h-44 q-6 40 4 84 q-12 -8 -20 -26 q-2 20 -14 28 q-12 -44 -14 -92 z" fill="${c}"/>
        <path d="M46 120 q4 40 12 62 M154 120 q-4 40 -12 62" stroke="${dark(c, .25)}" stroke-width="4.5"
              fill="none" stroke-linecap="round" opacity=".7"/>`,
      front: `<path d="M40 94 q0 -58 60 -58 q60 0 60 58 q-10 -16 -22 -16 q-12 -18 -38 -18 q-26 0 -38 18
                 q-12 0 -22 16 z" fill="${c}"/>
        <path d="M54 70 q20 -24 46 -24 q26 0 46 24 q-22 -15 -46 -15 q-24 0 -46 15 z" fill="${light(c, .32)}" opacity=".9"/>
        <path d="M40 94 q6 34 2 64 q14 -16 12 -64 z M160 94 q-6 34 -2 64 q-14 -16 -12 -64 z" fill="${c}"/>`,
    }),

    fade: c => ({
      back: "",
      front: `<path d="M42 90 q0 -56 58 -56 q58 0 58 56 q-11 -10 -18 -8 q-8 -26 -40 -26 q-32 0 -40 26 q-7 -2 -18 8 z" fill="${c}"/>
        <path d="M60 60 q16 -16 40 -16 q24 0 40 16 q-18 -9 -40 -9 q-22 0 -40 9 z" fill="${light(c, .22)}" opacity=".7"/>`,
    }),

    bob: c => ({
      back: `<path d="M36 100 q-2 -66 64 -66 q66 0 64 66 q-2 32 -10 56 q-10 -12 -10 -34 h-88
               q0 22 -10 34 q-8 -24 -10 -56 z" fill="${c}"/>
        <path d="M40 122 q4 22 10 34 M160 122 q-4 22 -10 34" stroke="${dark(c, .22)}" stroke-width="4" fill="none" opacity=".7"/>`,
      front: `<path d="M40 92 q0 -58 60 -58 q60 0 60 58 q-12 -14 -24 -12 q-10 -16 -36 -16 q-26 0 -36 16
                 q-12 -2 -24 12 z" fill="${c}"/>
        <path d="M54 66 q20 -22 46 -22 q26 0 46 22 q-22 -13 -46 -13 q-24 0 -46 13 z" fill="${light(c, .3)}" opacity=".85"/>`,
    }),
  };

  /* ---------- outfits ---------- */
  const tabStyle = `fill="#fff" stroke="${INK}" stroke-width="1.8" stroke-dasharray="5 4"`;
  function garment(parts, tabs) {
    const t = tabs || [[68, 146, 20, 15], [112, 146, 20, 15], [62, 230, 18, 14], [120, 230, 18, 14]];
    return `<g>${parts}${t.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" ${tabStyle}/>`).join("")}</g>`;
  }
  const dress = (c, trim) => garment(`
    <path d="M70 152 q30 -14 60 0 q4 20 10 36 l16 78 q-56 18 -112 0 l16 -78 q6 -16 10 -36 z" fill="${c}"/>
    <path d="M100 152 q18 2 30 0 q4 20 10 36 l16 78 q-28 9 -56 10 z" fill="${dark(c, .12)}" opacity=".7"/>
    <path d="M74 196 q26 10 52 0" stroke="${trim}" stroke-width="6" fill="none"/>
    <path d="M70 152 q30 -14 60 0" stroke="${trim}" stroke-width="5" fill="none"/>
    <path d="M56 266 q44 16 88 0" stroke="${trim}" stroke-width="5" fill="none" opacity=".8"/>`);
  const outfit = (top, legs, detail) => garment(`
    <path d="M70 152 q30 -14 60 0 q6 42 4 84 q-34 12 -68 0 q-2 -42 4 -84 z" fill="${top}"/>
    <path d="M104 150 q14 2 26 2 q6 42 4 84 q-16 6 -32 7 q6 -48 2 -93 z" fill="${dark(top, .13)}" opacity=".65"/>
    ${detail || ""}
    <path d="M64 236 q36 12 72 0 l-6 102 q-16 6 -28 0 l-2 -66 l-2 66 q-12 6 -28 0 z" fill="${legs}"/>
    <path d="M100 272 l2 66 q12 6 28 0 l6 -102 q-16 6 -36 6 z" fill="${dark(legs, .14)}" opacity=".6"/>`);

  /* ---------- the cast ---------- */
  const SK = { pale: "#f7dcc6", warm: "#eec49f", deep: "#a26a44" };
  const CAST = {
    eleven: { name: "Eleven", skin: SK.pale, hair: ["buzz", "#6b4631"], eye: "#7a5235", shirt: "#fdfdfd",
      fits: [
        { n: "Pink dress", svg: dress("#ffc3d9", "#ff8ab0") },
        { n: "Yellow dungarees", svg: outfit("#fff6d6", "#ffcf46",
            `<path d="M84 164 v72 M116 164 v72" stroke="${dark("#ffcf46", .25)}" stroke-width="4"/>
             <rect x="88" y="196" width="24" height="18" rx="3" fill="${light("#ffcf46", .25)}"/>`) },
        { n: "Mall stripes", svg: outfit("#ffffff", "#5fd0e8",
            `<path d="M72 178 h56 M72 196 h58 M72 214 h56" stroke="#ff5a8a" stroke-width="8"/>`) },
        { n: "Hawkins hoodie", svg: outfit("#efae33", "#46557a",
            `<path d="M84 152 q16 20 32 0" stroke="${dark("#efae33", .3)}" stroke-width="4" fill="none"/>
             <path d="M88 212 h24" stroke="${dark("#efae33", .3)}" stroke-width="4"/>`) },
      ] },
    mike: { name: "Mike", skin: SK.pale, hair: ["bowl", "#2f2621"], eye: "#5b4532", shirt: "#fdfdfd",
      fits: [
        { n: "Striped tee", svg: outfit("#efe7d6", "#4a6ea8",
            `<path d="M72 180 h58 M72 200 h58 M72 220 h56" stroke="#c84a3a" stroke-width="7"/>`) },
        { n: "Hellfire shirt", svg: outfit("#241f2a", "#3f4f6d",
            `<path d="M100 170 q14 14 10 30 q-4 14 -10 18 q-6 -4 -10 -18 q-4 -16 10 -30 z" fill="#ff3b2f"/>
             <path d="M100 184 q7 8 5 16 q-2 7 -5 9 q-3 -2 -5 -9 q-2 -8 5 -16 z" fill="#ffd54a"/>`) },
        { n: "Winter coat", svg: outfit("#2f6f4f", "#6b5a44",
            `<path d="M100 152 v84" stroke="${dark("#2f6f4f", .3)}" stroke-width="4"/>
             <path d="M66 158 q34 -12 68 0 l-5 18 q-29 -10 -58 0 z" fill="#c0392b"/>`) },
        { n: "Snow Ball suit", svg: outfit("#3c415e", "#3c415e",
            `<path d="M100 152 l-13 44 l13 -7 l13 7 z" fill="#fff"/>
             <path d="M100 164 l-7 16 h14 z" fill="#c0392b"/>`) },
      ] },
    max: { name: "Max", skin: SK.pale, hair: ["wavy", "#cf5f2a"], eye: "#4e7a5c", shirt: "#fdfdfd",
      fits: [
        { n: "Denim jacket", svg: outfit("#79a7d8", "#3f5f8a",
            `<path d="M100 152 v84 M84 158 v76 M116 158 v76" stroke="${dark("#79a7d8", .3)}" stroke-width="3.4"/>`) },
        { n: "Skate kit", svg: outfit("#f3f1f7", "#2f3b55",
            `<path d="M74 182 q26 -10 52 0 l-5 22 q-21 -9 -42 0 z" fill="#ff8a3b"/>`) },
        { n: "Snow Ball dress", svg: dress("#d4ddf4", "#8fa0d8") },
        { n: "Windbreaker", svg: outfit("#d8402f", "#2b2f3f",
            `<path d="M100 152 v84" stroke="${dark("#d8402f", .3)}" stroke-width="4"/>
             <path d="M70 200 h60" stroke="#fff" stroke-width="7"/>`) },
      ] },
    dustin: { name: "Dustin", skin: SK.pale, hair: ["curls", "#5d4232"], eye: "#5a4330", shirt: "#fdfdfd",
      fits: [
        { n: "AV Club shirt", svg: outfit("#f6ead0", "#5d6c4c",
            `<text x="100" y="206" text-anchor="middle" font-size="22" font-family="Nunito" font-weight="800" fill="${INK}">AV</text>`) },
        { n: "Camp Know Where", svg: outfit("#e9dcc1", "#7d6c4c",
            `<path d="M78 188 q22 -10 44 0" stroke="#2f8f6a" stroke-width="8" fill="none"/>
             <path d="M86 206 h28" stroke="#2f8f6a" stroke-width="5"/>`) },
        { n: "Hellfire shirt", svg: outfit("#241f2a", "#4a4a5a",
            `<path d="M100 170 q14 14 10 30 q-4 14 -10 18 q-6 -4 -10 -18 q-4 -16 10 -30 z" fill="#ff3b2f"/>
             <path d="M100 184 q7 8 5 16 q-2 7 -5 9 q-3 -2 -5 -9 q-2 -8 5 -16 z" fill="#ffd54a"/>`) },
        { n: "Snow Ball suit", svg: outfit("#4b4560", "#4b4560",
            `<path d="M100 152 l-13 44 l13 -7 l13 7 z" fill="#fff"/>
             <path d="M100 164 l-7 16 h14 z" fill="#ffd54a"/>`) },
      ] },
    lucas: { name: "Lucas", skin: SK.deep, hair: ["fade", "#2a1d15"], eye: "#3f2c20", shirt: "#fdfdfd",
      fits: [
        { n: "Explorer vest", svg: outfit("#cbb68c", "#6c7a58",
            `<path d="M100 152 v84" stroke="${dark("#cbb68c", .3)}" stroke-width="4"/>
             <rect x="76" y="194" width="20" height="18" rx="3" fill="${dark("#cbb68c", .22)}"/>
             <rect x="104" y="194" width="20" height="18" rx="3" fill="${dark("#cbb68c", .22)}"/>`) },
        { n: "Basketball kit", svg: outfit("#f3f1f7", "#f3f1f7",
            `<text x="100" y="210" text-anchor="middle" font-size="26" font-family="Georgia" fill="#c0392b">11</text>`) },
        { n: "Hellfire shirt", svg: outfit("#241f2a", "#3f4a6a",
            `<path d="M100 170 q14 14 10 30 q-4 14 -10 18 q-6 -4 -10 -18 q-4 -16 10 -30 z" fill="#ff3b2f"/>
             <path d="M100 184 q7 8 5 16 q-2 7 -5 9 q-3 -2 -5 -9 q-2 -8 5 -16 z" fill="#ffd54a"/>`) },
        { n: "Winter coat", svg: outfit("#2f6080", "#474757",
            `<path d="M100 152 v84" stroke="${dark("#2f6080", .3)}" stroke-width="4"/>
             <path d="M70 196 h60" stroke="${light("#2f6080", .25)}" stroke-width="6"/>`) },
      ] },
    robin: { name: "Robin", skin: SK.pale, hair: ["bob", "#8a6a3a"], eye: "#4a6a7a", shirt: "#fdfdfd",
      fits: [
        { n: "Scoops Ahoy", svg: dress("#fdfdfd", "#2f6fa8") },
        { n: "Stripy jumper", svg: outfit("#f6ead0", "#5a6a8a",
            `<path d="M72 182 h58 M72 204 h58" stroke="#c84a3a" stroke-width="8"/>`) },
        { n: "Band tee", svg: outfit("#2e2a35", "#6b5a44",
            `<text x="100" y="208" text-anchor="middle" font-size="26" fill="#fff" font-family="Georgia">♫</text>`) },
        { n: "Big coat", svg: outfit("#7f6ea3", "#3a3a4a",
            `<path d="M100 152 v84" stroke="${dark("#7f6ea3", .3)}" stroke-width="4"/>
             <path d="M66 158 q34 -12 68 0 l-5 16 q-29 -10 -58 0 z" fill="${light("#7f6ea3", .3)}"/>`) },
      ] },
  };

  /* ---------- put one together ---------- */
  function doll(key) {
    const c = CAST[key];
    const h = HAIR[c.hair[0]](c.hair[1]);
    return `<svg viewBox="0 0 200 372" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      ${body(c.skin, c.shirt)}
      ${h.back}
      <circle cx="100" cy="92" r="60" fill="${c.skin}"/>
      <path d="M160 92 a60 60 0 0 1 -60 60 q22 -22 22 -60 q0 -38 -22 -60 a60 60 0 0 1 60 60 z"
            fill="${dark(c.skin, .1)}" opacity=".5"/>
      <ellipse cx="46" cy="98" rx="9" ry="12" fill="${c.skin}"/>
      <ellipse cx="154" cy="98" rx="9" ry="12" fill="${c.skin}"/>
      ${face(c.eye, c.skin)}
      ${h.front}
    </svg>`;
  }
  function outfitSvg(key, i) {
    return `<svg viewBox="40 134 120 218" xmlns="http://www.w3.org/2000/svg" style="width:100%">${CAST[key].fits[i].svg}</svg>`;
  }
  return { CAST, doll, outfit: outfitSvg, names: () => Object.keys(CAST) };
})();
