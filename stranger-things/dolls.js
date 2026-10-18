"use strict";
/* =====================================================================
   CUT-OUT DRESS-UP DOLLS
   Big heads, big eyes, little bodies — drawn from scratch, nobody's
   artwork copied. Each doll prints with a fold-out stand and four
   outfits that hook on with tabs.
   ===================================================================== */
const DOLLS = (function () {
  const INK = "#2a1b3d";
  const SKIN = { pale: "#f6d9c4", tan: "#e8b894", deep: "#9a6446" };

  /* ---------- the bits every doll is made of ---------- */
  function eyes(c) {
    return `<g>
      <ellipse cx="78" cy="86" rx="11" ry="13" fill="#fff" stroke="${INK}" stroke-width="2.6"/>
      <ellipse cx="122" cy="86" rx="11" ry="13" fill="#fff" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="79" cy="88" r="7" fill="${c}"/><circle cx="123" cy="88" r="7" fill="${c}"/>
      <circle cx="79" cy="88" r="3.2" fill="${INK}"/><circle cx="123" cy="88" r="3.2" fill="${INK}"/>
      <circle cx="82" cy="84" r="2.6" fill="#fff"/><circle cx="126" cy="84" r="2.6" fill="#fff"/>
      <path d="M66 70 q12 -7 24 -1 M110 69 q12 -6 24 1" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="62" cy="104" r="7" fill="#ff9ec4" opacity=".55"/>
      <circle cx="138" cy="104" r="7" fill="#ff9ec4" opacity=".55"/>
      <path d="M92 106 q8 7 16 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  function body(skin) {
    return `<g>
      <path d="M86 132 h28 v16 h-28 z" fill="${skin}" stroke="${INK}" stroke-width="3"/>
      <path d="M72 150 q28 -10 56 0 l6 86 q-34 10 -68 0 z" fill="#fdfdfd" stroke="${INK}" stroke-width="3"/>
      <path d="M72 154 q-16 30 -14 62 q0 10 11 10 q9 0 9 -10 q2 -34 8 -56"
            fill="${skin}" stroke="${INK}" stroke-width="3"/>
      <path d="M128 154 q16 30 14 62 q0 10 -11 10 q-9 0 -9 -10 q-2 -34 -8 -56"
            fill="${skin}" stroke="${INK}" stroke-width="3"/>
      <path d="M78 236 q22 8 44 0 l-4 34 h-36 z" fill="#cfe0f5" stroke="${INK}" stroke-width="3"/>
      <path d="M84 268 l-4 76 q10 5 18 0 l2 -76 z" fill="${skin}" stroke="${INK}" stroke-width="3"/>
      <path d="M116 268 l4 76 q-10 5 -18 0 l-2 -76 z" fill="${skin}" stroke="${INK}" stroke-width="3"/>
      <path d="M78 344 q10 8 22 2 l0 14 h-24 q-4 -10 2 -16 z" fill="#f0f0f5" stroke="${INK}" stroke-width="3"/>
      <path d="M122 344 q-10 8 -22 2 l0 14 h24 q4 -10 -2 -16 z" fill="#f0f0f5" stroke="${INK}" stroke-width="3"/>
    </g>`;
  }
  const head = skin => `<circle cx="100" cy="88" r="58" fill="${skin}" stroke="${INK}" stroke-width="3.4"/>`;

  /* ---------- hair ---------- */
  const HAIR = {
    buzz: c => `<path d="M42 84 q4 -46 58 -46 q54 0 58 46 q-10 -22 -58 -22 q-48 0 -58 22 z" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
    curls: c => `<g fill="${c}" stroke="${INK}" stroke-width="3">
        <circle cx="60" cy="52" r="18"/><circle cx="86" cy="38" r="20"/><circle cx="114" cy="38" r="20"/>
        <circle cx="140" cy="52" r="18"/><circle cx="46" cy="76" r="15"/><circle cx="154" cy="76" r="15"/></g>`,
    bowl: c => `<path d="M40 86 q0 -52 60 -52 q60 0 60 52 q-14 -12 -24 -8 q-16 -18 -36 -18 q-20 0 -36 18 q-10 -4 -24 8 z"
        fill="${c}" stroke="${INK}" stroke-width="3"/>`,
    long: c => `<path d="M38 96 q-6 -62 62 -62 q68 0 62 62 q-4 48 -14 70 q-6 -34 -10 -54 q-14 10 -38 10 q-24 0 -38 -10
        q-4 20 -10 54 q-10 -22 -14 -70 z" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
    wavy: c => `<path d="M36 100 q-2 -66 64 -66 q66 0 64 66 q-2 36 -10 60 q-10 -8 -8 -30 q-4 14 -12 18
        q4 -26 -2 -40 q-16 12 -32 12 q-16 0 -32 -12 q-6 14 -2 40 q-8 -4 -12 -18 q2 22 -8 30 q-8 -24 -10 -60 z"
        fill="${c}" stroke="${INK}" stroke-width="3"/>`,
    mullet: c => `<path d="M40 84 q2 -50 60 -50 q58 0 60 50 q-8 -16 -26 -20 q-14 10 -34 10 q-20 0 -34 -10
        q-18 4 -26 20 z M44 92 q-4 44 6 72 q8 -30 6 -66 z M156 92 q4 44 -6 72 q-8 -30 -6 -66 z"
        fill="${c}" stroke="${INK}" stroke-width="3"/>`,
  };

  /* ---------- outfits: one piece that hooks over the doll ---------- */
  function garment(parts, tabs) {
    const tab = (x, y, w, h) => `<g>
      <path d="M${x} ${y} h${w} v${h} h${-w} z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-dasharray="5 4"/>
    </g>`;
    return `<g>${parts}${(tabs || [[70, 140, 18, 14], [112, 140, 18, 14], [64, 232, 16, 13], [120, 232, 16, 13]])
      .map(t => tab(...t)).join("")}</g>`;
  }
  const dress = (c, trim) => garment(`
    <path d="M70 148 q30 -12 60 0 l20 110 q-50 16 -100 0 z" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <path d="M78 196 q22 8 44 0" stroke="${trim}" stroke-width="5" fill="none"/>
    <path d="M70 148 q30 -12 60 0" stroke="${trim}" stroke-width="4" fill="none"/>`);
  const topAndJeans = (top, jeans, detail) => garment(`
    <path d="M70 148 q30 -12 60 0 l6 90 q-36 10 -72 0 z" fill="${top}" stroke="${INK}" stroke-width="3"/>
    ${detail || ""}
    <path d="M66 238 q34 10 68 0 l-4 106 q-14 6 -26 0 l-4 -70 l-4 70 q-12 6 -26 0 z" fill="${jeans}" stroke="${INK}" stroke-width="3"/>`);

  /* ---------- the cast ---------- */
  const CAST = {
    eleven: { name: "Eleven", skin: SKIN.pale, hair: ["buzz", "#5a3a2a"], eye: "#6a4a3a",
      fits: [
        { n: "Pink dress + jacket", svg: dress("#ffc8dc", "#ff8ab0") },
        { n: "Yellow dungarees", svg: topAndJeans("#fff3c4", "#ffd54a",
          `<path d="M84 160 v76 M116 160 v76" stroke="${INK}" stroke-width="2.6"/>`) },
        { n: "Mall stripes", svg: topAndJeans("#fff", "#6fd3e8",
          `<path d="M72 176 h58 M73 192 h58 M74 208 h56" stroke="#ff5a8a" stroke-width="7"/>`) },
        { n: "Hawkins hoodie", svg: topAndJeans("#f0b63c", "#4a5a7a",
          `<path d="M86 150 q14 16 28 0" stroke="${INK}" stroke-width="3" fill="none"/>`) },
      ] },
    mike: { name: "Mike", skin: SKIN.pale, hair: ["bowl", "#2b2320"], eye: "#4a3a2a",
      fits: [
        { n: "Striped tee", svg: topAndJeans("#e8e2d4", "#4a6ea8",
          `<path d="M72 178 h62 M73 198 h62 M74 218 h60" stroke="#c84a3a" stroke-width="6"/>`) },
        { n: "Hellfire shirt", svg: topAndJeans("#1f1b24", "#3a4a66",
          `<text x="100" y="200" text-anchor="middle" font-size="22" fill="#ff2020" font-family="Georgia">🔥</text>`) },
        { n: "Winter coat", svg: topAndJeans("#2f6f4f", "#6a5a44",
          `<path d="M100 150 v88" stroke="${INK}" stroke-width="3"/>
           <path d="M66 156 q34 -12 68 0 l-4 16 q-30 -10 -60 0 z" fill="#c0392b" stroke="${INK}" stroke-width="2.6"/>`) },
        { n: "Snow Ball suit", svg: topAndJeans("#3a3f5a", "#3a3f5a",
          `<path d="M100 150 l-10 40 l10 -6 l10 6 z" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
           <path d="M100 160 l-6 14 h12 z" fill="#c0392b" stroke="${INK}" stroke-width="2"/>`) },
      ] },
    max: { name: "Max", skin: SKIN.pale, hair: ["wavy", "#d2622c"], eye: "#4a7a5a",
      fits: [
        { n: "Denim jacket", svg: topAndJeans("#7aa6d6", "#3f5f8a",
          `<path d="M100 150 v88 M84 156 v80 M116 156 v80" stroke="${INK}" stroke-width="2.4"/>`) },
        { n: "Skate kit", svg: topAndJeans("#f0f0f5", "#2f3b55",
          `<path d="M74 180 q26 -10 52 0 l-4 20 q-22 -8 -44 0 z" fill="#ff8a3b" stroke="${INK}" stroke-width="2.6"/>`) },
        { n: "Snow Ball dress", svg: dress("#cfd8f0", "#8fa0d8") },
        { n: "Red windbreaker", svg: topAndJeans("#d8402f", "#2b2f3f",
          `<path d="M100 150 v88" stroke="${INK}" stroke-width="3"/>
           <path d="M70 200 h60" stroke="#fff" stroke-width="6"/>`) },
      ] },
    dustin: { name: "Dustin", skin: SKIN.pale, hair: ["curls", "#5a4030"], eye: "#4a3a2a",
      fits: [
        { n: "AV Club shirt", svg: topAndJeans("#f5e9c9", "#5a6a4a",
          `<text x="100" y="202" text-anchor="middle" font-size="16" font-family="Nunito" font-weight="800" fill="${INK}">AV</text>`) },
        { n: "Camp Know Where", svg: topAndJeans("#e8dcc0", "#7a6a4a",
          `<path d="M78 186 q22 -8 44 0" stroke="#2f8f6a" stroke-width="7" fill="none"/>`) },
        { n: "Hellfire shirt", svg: topAndJeans("#1f1b24", "#4a4a5a",
          `<text x="100" y="200" text-anchor="middle" font-size="22" fill="#ff2020" font-family="Georgia">🔥</text>`) },
        { n: "Snow Ball suit", svg: topAndJeans("#4a4458", "#4a4458",
          `<path d="M100 150 l-10 40 l10 -6 l10 6 z" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
           <path d="M100 160 l-6 14 h12 z" fill="#ffd54a" stroke="${INK}" stroke-width="2"/>`) },
      ] },
    lucas: { name: "Lucas", skin: SKIN.deep, hair: ["buzz", "#241a14"], eye: "#3a2a20",
      fits: [
        { n: "Explorer vest", svg: topAndJeans("#c9b48a", "#6a7a5a",
          `<path d="M100 150 v88" stroke="${INK}" stroke-width="3"/>
           <path d="M76 196 h18 v16 h-18 z M106 196 h18 v16 h-18 z" fill="#8a7a5a" stroke="${INK}" stroke-width="2.2"/>`) },
        { n: "Basketball kit", svg: topAndJeans("#f0f0f5", "#f0f0f5",
          `<text x="100" y="206" text-anchor="middle" font-size="22" font-family="Georgia" fill="#c0392b">11</text>`) },
        { n: "Hellfire shirt", svg: topAndJeans("#1f1b24", "#3f4a6a",
          `<text x="100" y="200" text-anchor="middle" font-size="22" fill="#ff2020" font-family="Georgia">🔥</text>`) },
        { n: "Winter coat", svg: topAndJeans("#2f5f7f", "#4a4a5a",
          `<path d="M100 150 v88" stroke="${INK}" stroke-width="3"/>`) },
      ] },
    robin: { name: "Robin", skin: SKIN.pale, hair: ["mullet", "#8a6a3a"], eye: "#4a6a7a",
      fits: [
        { n: "Scoops Ahoy", svg: dress("#fdfdfd", "#2f6fa8") },
        { n: "Stripy jumper", svg: topAndJeans("#f5e9c9", "#5a6a8a",
          `<path d="M72 180 h60 M73 200 h60" stroke="#c84a3a" stroke-width="6"/>`) },
        { n: "Band tee", svg: topAndJeans("#2b2b33", "#6a5a44",
          `<text x="100" y="202" text-anchor="middle" font-size="14" font-family="Nunito" font-weight="800" fill="#fff">♫</text>`) },
        { n: "Big coat", svg: topAndJeans("#7a6a9a", "#3a3a4a",
          `<path d="M100 150 v88" stroke="${INK}" stroke-width="3"/>`) },
      ] },
  };

  /* ---------- draw one doll ---------- */
  function doll(key) {
    const c = CAST[key];
    return `<svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      ${body(c.skin)}
      ${head(c.skin)}
      ${eyes(c.eye)}
      ${HAIR[c.hair[0]](c.hair[1])}
    </svg>`;
  }
  function outfit(key, i) {
    const c = CAST[key];
    return `<svg viewBox="40 130 120 230" xmlns="http://www.w3.org/2000/svg" style="width:100%">${c.fits[i].svg}</svg>`;
  }
  return { CAST, doll, outfit, names: () => Object.keys(CAST) };
})();
