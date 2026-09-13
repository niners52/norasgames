"use strict";
/* =====================================================================
   MAGIC TOWN — the world: rooms, dragging, magic, friends, saving
   ===================================================================== */
const $ = id => document.getElementById(id);
const stage = $("stage"), thingsEl = $("things"), sceneryEl = $("scenery");
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const SAVE_KEY = "magicTown";

let friends = [], layouts = {}, placeId = "home", soundOn = true, dim = false;
let decorating = false, dragging = null, uidN = 0;
const fxState = {};   // friend id -> { tiny, giant, glow, rainbow, wings, frog } (time each one ends)
const speech = {};    // thing id -> { text, until }
const newId = p => p + Date.now().toString(36) + (uidN++);

/* ---------- saving ---------- */
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!d || !Array.isArray(d.friends) || !d.friends.length) return false;
    friends = d.friends.filter(f => PLACES[f.place]);
    layouts = d.layouts || {};
    placeId = PLACES[d.placeId] ? d.placeId : "home";
    soundOn = d.soundOn !== false;
    return friends.length > 0;
  } catch (e) { return false; }
}
let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ friends, layouts, placeId, soundOn })); } catch (e) {} }, 300);
}
function layout(pid) {
  if (!layouts[pid]) layouts[pid] = { wall: 0, props: PLACES[pid].props.map(p => ({ id: newId("p"), ...p, x0: p.x, y0: p.y })) };
  return layouts[pid];
}

/* ---------- sound ---------- */
let audio = null;
function blip(freq, dur = .12, type = "sine", vol = .1) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, audio.currentTime);
    g.gain.setValueAtTime(vol, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + dur);
    o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + dur);
  } catch (e) {}
}
const tune = notes => notes.forEach((f, i) => setTimeout(() => blip(f, .2, "triangle", .1), i * 110));

/* ---------- drawing the room ---------- */
const U = () => Math.min(stage.clientHeight, stage.clientWidth * .8) / 100;
const friendsHere = () => friends.filter(f => f.place === placeId);
const elById = id => thingsEl.querySelector(`[data-id="${id}"]`);

function render() {
  const P = PLACES[placeId], L = layout(placeId), u = U();
  $("place").textContent = `${P.emoji} ${P.name}`;
  $("wall").style.background = P.walls[L.wall % P.walls.length];
  $("floor").style.background = P.floor;

  let sc = "";
  if (P.rainbow) sc += `<div class="scene-bit" style="left:50%;top:64%;width:${95 * u}px;height:${48 * u}px;opacity:.75;
    background:radial-gradient(circle at 50% 100%,transparent 52%,#9b7bff 52% 57%,#4fc3f7 57% 62%,#6fdc8c 62% 67%,#ffe066 67% 72%,#ffb347 72% 77%,#ff6f91 77% 82%,transparent 82%)"></div>`;
  if (P.shelf) sc += `<div style="position:absolute;left:52%;width:44%;top:${P.shelf.y}%;height:${1.6 * u}px;background:#7a5230;border-radius:3px;box-shadow:0 4px 6px rgba(0,0,0,.3)"></div>`;
  if (P.board) { const b = P.board; sc += `<div class="board" style="left:${b.x - b.w / 2}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;font-size:${3.4 * u}px">${b.text}</div>`; }
  for (const s of P.scenery) sc += `<div class="scene-bit" style="left:${s.x}%;top:${s.y}%;font-size:${s.s * u}px">${s.e}</div>`;
  sceneryEl.innerHTML = sc;

  thingsEl.innerHTML = "";
  for (const p of L.props) {
    if (p.gone) continue;
    const el = document.createElement("div");
    el.className = "thing prop"; el.dataset.id = p.id; el.textContent = p.e;
    el.style.fontSize = p.s * u + "px"; setPos(el, p); addSay(el, p.id);
    thingsEl.appendChild(el);
  }
  for (const c of friendsHere()) thingsEl.appendChild(charEl(c, u));
  $("dim").classList.toggle("show", dim);
}
function setPos(el, o) { el.style.left = o.x + "%"; el.style.top = o.y + "%"; el.style.zIndex = Math.round(o.y * 10); }

function look(c) {
  const f = fxState[c.id] || {}, now = Date.now(), l = { ...c };
  if (f.rainbow > now) l.hairC = "rainbow";
  if (f.wings > now) l.wings = c.wings === "none" ? "fairy" : c.wings === "fairy" ? "butterfly" : "fairy";
  if (dim) l.eyes = "sleepy";
  return l;
}
function charEl(c, u) {
  const f = fxState[c.id] || {}, now = Date.now(), h = 34 * u;
  const el = document.createElement("div");
  el.className = "thing char"; el.dataset.id = c.id;
  el.style.width = h * 120 / 170 + "px"; el.style.height = h + "px"; setPos(el, c);
  el.style.zIndex = Math.round(c.y * 10) + 1;
  for (const k of ["tiny", "giant", "glow"]) if (f[k] > now) el.classList.add(k);
  const body = f.frog > now ? `<div class="frogbody" style="font-size:${h * .55}px;line-height:1;text-align:center;padding-top:${h * .38}px">🐸</div>` : avatarSVG(look(c));
  el.innerHTML = `<div class="shadow"></div><div class="inner"><div class="bob">${body}</div></div><div class="name">${esc(c.name)}</div>`;
  addSay(el, c.id);
  return el;
}

/* ---------- speech bubbles and sparkles ---------- */
function addSay(el, id) {
  const s = speech[id]; if (!s || s.until < Date.now()) return;
  const b = document.createElement("div"); b.className = "say"; b.textContent = s.text; el.appendChild(b);
}
function say(id, text, ms = 2600) {
  speech[id] = { text, until: Date.now() + ms };
  const el = elById(id); if (!el) return;
  el.querySelectorAll(".say").forEach(n => n.remove()); addSay(el, id);
  setTimeout(() => { if (speech[id] && speech[id].until <= Date.now()) { const e2 = elById(id); if (e2) e2.querySelectorAll(".say").forEach(n => n.remove()); } }, ms + 50);
}
function fxPx(x, y, chars, n) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "fx"; s.textContent = chars[i % chars.length];
    s.style.left = x + rand(-30, 30) + "px"; s.style.top = y + rand(-20, 20) + "px";
    s.style.fontSize = rand(18, 32) + "px"; s.style.setProperty("--dx", rand(-45, 45) + "px"); s.style.animationDelay = i * 45 + "ms";
    stage.appendChild(s); setTimeout(() => s.remove(), 1700);
  }
}
function fxAt(el, chars, n) {
  if (!el) return;
  const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
  fxPx(r.left + r.width / 2 - s.left, r.top + r.height * .35 - s.top, chars, n);
}
function bounce(el) { if (!el) return; el.classList.remove("bounce"); void el.offsetWidth; el.classList.add("bounce"); }
let toastTimer;
function toast(msg) {
  let t = $("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- dragging and tapping ---------- */
function objFor(d) { return d.isChar ? friends.find(f => f.id === d.id) : layout(placeId).props.find(p => p.id === d.id); }
function inRect(el, x, y, pad = 8) { const r = el.getBoundingClientRect(); return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad; }
function charAt(x, y, except) {
  for (const el of thingsEl.querySelectorAll(".char")) if (el !== except && inRect(el, x, y)) return friends.find(f => f.id === el.dataset.id);
  return null;
}
function propAt(x, y, except, test) {
  const L = layout(placeId);
  for (const el of thingsEl.querySelectorAll(".prop")) {
    if (el === except || !inRect(el, x, y, 4)) continue;
    const p = L.props.find(q => q.id === el.dataset.id); if (p && test(p)) return p;
  }
  return null;
}
const overTrash = (x, y) => decorating && inRect($("trash"), x, y, 6);

thingsEl.addEventListener("pointerdown", e => {
  const el = e.target.closest(".thing"); if (!el) return;
  e.preventDefault();
  dragging = { el, id: el.dataset.id, isChar: el.classList.contains("char"), sx: e.clientX, sy: e.clientY, moved: false, sr: stage.getBoundingClientRect() };
  try { (dragging.isChar ? thingsEl : el).setPointerCapture(e.pointerId); } catch (err) {}
});
thingsEl.addEventListener("pointermove", e => {
  const d = dragging; if (!d) return;
  if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 8) return;
  if (!d.moved) { d.moved = true; d.el.classList.add("drag"); d.el.style.zIndex = 9999; d.el.style.transition = "none"; d.el.querySelectorAll(".say").forEach(n => n.remove()); }
  const o = objFor(d); if (!o) return;
  o.x = clamp((e.clientX - d.sr.left) / d.sr.width * 100, 2, 98);
  o.y = clamp((e.clientY - d.sr.top + d.el.offsetHeight * .45) / d.sr.height * 100, 14, 100);
  d.el.style.left = o.x + "%"; d.el.style.top = o.y + "%";
  if (!d.isChar) $("trash").classList.toggle("hot", overTrash(e.clientX, e.clientY));
});
function endDrag(e, cancelled) {
  const d = dragging; dragging = null; if (!d) return;
  d.el.classList.remove("drag"); $("trash").classList.remove("hot");
  const o = objFor(d); if (!o) return;
  if (!d.moved) { if (!cancelled) onTap(d, o); return; }
  d.el.style.zIndex = Math.round(o.y * 10) + (d.isChar ? 1 : 0);
  if (!cancelled) {
    if (!d.isChar) {
      if (overTrash(e.clientX, e.clientY)) { removeProp(o); return; }
      if (o.eat || o.potion) { const c = charAt(e.clientX, e.clientY, d.el); if (c) { feed(o, c); return; } }
    } else {
      if (propAt(e.clientX, e.clientY, d.el, p => p.a === "sleep")) { say(o.id, "Zzz… 😴", 3000); fxAt(d.el, ["💤"], 4); blip(260, .4); }
      else if (Math.random() < .25) say(o.id, pick(["Wheee! ✨", "Whoa! 😲", "Here? Okay!", "I like this spot! 💖"]));
    }
  }
  if (!d.isChar) { o.x0 = o.x; o.y0 = o.y; }
  save();
}
thingsEl.addEventListener("pointerup", e => endDrag(e, false));
thingsEl.addEventListener("pointercancel", e => endDrag(e, true));

let lastTap = { id: null, t: 0 };
function onTap(d, o) {
  const now = Date.now(), dbl = lastTap.id === d.id && now - lastTap.t < 400;
  lastTap = { id: d.id, t: now };
  if (d.isChar) {
    if (dbl) { openCreator(o); return; }
    bounce(d.el); say(o.id, pick(LINES)); blip(600 + Math.random() * 300, .12);
  } else propAction(o, d.el);
}

/* ---------- things that happen when you tap props ---------- */
const SPELLBOOK = ["Fluffy Flutter 🦋", "Sparkle Sneeze ✨", "Rainbow Wiggle 🌈", "Cupcake Cloud 🧁", "Giggle Glow 😂", "Moonbeam Hop 🌙"];
const FORTUNES = ["You'll find a rainbow today 🌈", "A new friend is coming! 💖", "Something sparkly is near ✨", "Cake is in your future 🍰", "You are very magical 🔮"];
function moveProp(p, x, y, ms = 900) {
  p.x = x; p.y = y;
  const el = elById(p.id); if (!el) return;
  el.style.transition = `left ${ms}ms ease-in-out, top ${ms}ms ease-in-out`; setPos(el, p);
  setTimeout(() => { el.style.transition = ""; }, ms + 30);
  save();
}
function propAction(p, el) {
  bounce(el);
  const L = layout(placeId);
  if (p.eat) { fxAt(el, ["😋", "✨"], 3); say(p.id, "Drag me to a friend! 😋", 1800); blip(520, .1); return; }
  if (p.potion) { fxAt(el, ["🫧", "✨"], 4); say(p.id, "Drag me onto a friend! 🪄", 1800); blip(760, .15); return; }
  switch (p.a) {
    case "sleep": case "light":
      dim = !dim; render(); blip(dim ? 260 : 520, .3);
      if (dim) friendsHere().slice(0, 2).forEach((c, i) => setTimeout(() => say(c.id, pick(["Goodnight! 🌙", "Zzz… 😴", "Sweet dreams 💤"])), i * 400));
      break;
    case "hug": fxAt(el, ["💖", "💕", "💗"], 7); blip(660, .2); break;
    case "tv": fxAt(el, ["🌈", "⭐", "📺"], 7); tune([523, 659, 784]); if (friendsHere()[0]) say(friendsHere()[0].id, "Cartoon time! 📺"); break;
    case "sparkle": fxAt(el, ["✨", "⭐", "💫"], 9); blip(1000, .2); break;
    case "owl": say(p.id, "Hoo hoo! 🦉"); blip(420, .2); setTimeout(() => blip(340, .3), 220); break;
    case "book": say(p.id, "New spell: " + pick(SPELLBOOK), 3000); fxAt(el, ["📖", "✨"], 5); tune([659, 784]); break;
    case "orb": say(p.id, pick(FORTUNES), 3200); fxAt(el, ["🔮", "💜", "✨"], 7); tune([392, 494, 587, 784]); break;
    case "frog": say(p.id, "Ribbit! 🐸"); moveProp(p, clamp(p.x + rand(-25, 25), 5, 95), p.y, 600); blip(180, .15, "square", .06); break;
    case "hat": fxAt(el, ["🐇", "✨", "🎉"], 6); say(p.id, "Ta-da! 🐇"); tune([523, 784, 1047]); break;
    case "cauldron": {
      fxAt(el, ["🫧", "💚", "✨", "🫧"], 10); say(p.id, "Bubble bubble! ✨"); tune([330, 392, 523, 659]);
      const temp = L.props.filter(q => q.temp).length;
      if (temp < 6) setTimeout(() => {
        const np = { id: newId("p"), e: pick(["🧪", "🍶", "⚗️", "🧴"]), x: clamp(p.x + rand(-18, 18), 5, 95), y: clamp(p.y + rand(1, 8), 60, 100), s: 8, potion: true, temp: true };
        np.x0 = np.x; np.y0 = np.y; L.props.push(np); render(); fxAt(elById(np.id), ["✨"], 5); toast("A new potion! Drag it onto a friend 🧪"); save();
      }, 600);
      break;
    }
    case "cat": say(p.id, "Meow! 😺"); blip(700, .25, "triangle", .08); break;
    case "dog": say(p.id, "Woof woof! 🐶"); blip(220, .15, "square", .06); break;
    case "coffee": fxAt(el, ["☁️", "☕"], 5); say(p.id, "So cozy ☕"); break;
    case "unicorn": fxAt(el, ["🌈", "✨", "💖"], 9); say(p.id, "Neigh! 🌈"); moveProp(p, clamp(rand(10, 90), 5, 95), p.y, 1200); tune([523, 659, 784, 1047]); break;
    case "flower": p.s = Math.min(p.s + 2, 18); render(); fxAt(elById(p.id), ["🌸", "🌼", "✨"], 6); blip(880, .15); save(); break;
    case "butterfly": moveProp(p, rand(10, 90), rand(25, 70), 1300); blip(900, .1); break;
    case "bunny": say(p.id, "Boing! 🐰"); moveProp(p, clamp(p.x + rand(-30, 30), 5, 95), p.y, 500); blip(600, .1); break;
    case "crown": fxAt(el, ["👑", "✨", "💎"], 8); tune([784, 988, 1175]); break;
    case "piano": fxAt(el, ["🎵", "🎶"], 8); tune(Array.from({ length: 6 }, () => pick([523, 587, 659, 698, 784, 880, 988, 1047]))); break;
    case "mirror": fxAt(el, ["✨", "💖"], 6); say(p.id, "Looking magical! 🪞"); blip(1200, .2); break;
    case "balloon": { const y0 = p.y; moveProp(p, p.x, 22, 1400); blip(700, .3); setTimeout(() => moveProp(p, p.x, y0, 1400), 2200); break; }
    case "dragon": fxAt(el, ["💖", "🔥", "💖"], 9); say(p.id, "Rawr! 💖"); blip(140, .4, "sawtooth", .08); break;
    case "gift": {
      const e = pick(DECOR.filter(x => x !== "🎁")), info = DECOR_INFO[e] || {};
      p.e = e; p.a = info.a; p.eat = !!info.eat; p.potion = !!info.potion;
      render(); fxAt(elById(p.id), ["🎉", "🎊", "✨"], 12); tune([523, 659, 784, 1047]); save();
      break;
    }
    default: fxAt(el, ["✨"], 4); blip(800, .1);
  }
}

/* ---------- eating and magic ---------- */
const SPELLS = [["tiny", "I'm so tiny! 🐜"], ["giant", "I'm HUGE! 🦖"], ["glow", "I'm glowing! ✨"], ["rainbow", "Rainbow hair! 🌈"],
                ["wings", "I've got wings! 🧚"], ["frog", "Ribbit! 🐸"], ["color", "New outfit color! 👗"]];
function useUp(o) {
  const L = layout(placeId);
  if (o.temp) L.props.splice(L.props.indexOf(o), 1);
  else { o.gone = Date.now(); o.x = o.x0 ?? o.x; o.y = o.y0 ?? o.y; }
}
function feed(o, c) {
  useUp(o);
  if (o.eat) {
    render(); const el = elById(c.id); bounce(el);
    say(c.id, pick(["Yummy! 😋", "Nom nom nom!", "Delicious! 💖", "More please! 🥹"])); fxAt(el, ["💖", "😋", "✨"], 7); tune([660, 880]);
  } else magic(c);
  save();
}
function magic(c) {
  const [k, line] = pick(SPELLS), f = fxState[c.id] = fxState[c.id] || {};
  if (k === "color") c.outC = pick(PARTS.outC.filter(x => x !== c.outC));
  else { if (k === "tiny") f.giant = 0; if (k === "giant") f.tiny = 0; f[k] = Date.now() + (k === "frog" ? 7000 : 15000); }
  render(); const el = elById(c.id);
  fxAt(el, ["✨", "🪄", "💫", "⭐"], 12); say(c.id, line, 3000); tune([523, 784, 1047, 1319]);
}
function removeProp(o) {
  const L = layout(placeId); L.props.splice(L.props.indexOf(o), 1);
  render(); blip(200, .15); save();
}

/* ---------- friends tray ---------- */
function renderFriendsTray() {
  const row = $("friends-row"); row.innerHTML = "";
  const add = document.createElement("div"); add.className = "chip"; add.innerHTML = `<span class="e">➕</span>New friend`;
  add.onclick = () => openCreator(null); row.appendChild(add);
  for (const c of friends) {
    const ch = document.createElement("div");
    ch.className = "chip" + (c.place === placeId ? " pick" : "");
    ch.innerHTML = `<div class="mini">${avatarSVG(c)}</div>${esc(c.name)} ${PLACES[c.place].emoji}`;
    ch.onclick = () => callFriend(c); row.appendChild(ch);
  }
}
function callFriend(c) {
  if (c.place === placeId) { const el = elById(c.id); bounce(el); say(c.id, "I'm right here! 👋"); blip(600, .1); return; }
  c.place = placeId; c.x = rand(25, 75); c.y = rand(84, 96);
  render(); const el = elById(c.id); fxAt(el, ["✨", "💫"], 9); say(c.id, "Hi! I'm here! 👋"); tune([523, 784]);
  renderFriendsTray(); save();
}

/* ---------- decorate tray ---------- */
function buildDecorItems() {
  const ir = $("items-row");
  for (const e of DECOR) {
    const ch = document.createElement("div"); ch.className = "chip"; ch.innerHTML = `<span class="e">${e}</span>`;
    ch.onclick = () => addDecor(e); ir.appendChild(ch);
  }
}
function renderDecorTray() {
  const P = PLACES[placeId], L = layout(placeId), wr = $("walls-row"); wr.innerHTML = "";
  P.walls.forEach((w, i) => {
    const sw = document.createElement("div"); sw.className = "swatch" + (L.wall === i ? " pick" : ""); sw.style.background = w;
    sw.onclick = () => { L.wall = i; render(); renderDecorTray(); save(); blip(500 + i * 60, .1); };
    wr.appendChild(sw);
  });
}
function addDecor(e) {
  const L = layout(placeId);
  if (L.props.length >= 60) { toast("This room is full! Drag something onto 🗑️ first"); return; }
  const info = DECOR_INFO[e] || {};
  const p = { id: newId("p"), e, x: rand(25, 75), y: rand(50, 68), s: 10, a: info.a, eat: !!info.eat, potion: !!info.potion };
  p.x0 = p.x; p.y0 = p.y; L.props.push(p);
  render(); fxAt(elById(p.id), ["✨", "⭐"], 6); blip(700, .1); save();
}

/* ---------- map ---------- */
function renderMap() {
  const m = $("map"); m.innerHTML = "";
  for (const [id, P] of Object.entries(PLACES)) {
    const n = friends.filter(f => f.place === id).length;
    const d = document.createElement("div");
    d.className = "loc" + (id === placeId ? " here" : ""); d.style.background = P.card;
    d.innerHTML = `<span class="e">${P.emoji}</span>${P.name}<small>${n ? `${n} friend${n === 1 ? "" : "s"} here` : "nobody yet"}</small>`;
    d.onclick = () => go(id); m.appendChild(d);
  }
}
function go(id) {
  placeId = id; dim = false; $("map-overlay").classList.remove("show"); closeTrays(); render(); tune([392, 523, 659]); save();
  if (!friendsHere().length) setTimeout(() => toast("Tap 🧑‍🤝‍🧑 Friends to bring someone here!"), 500);
}

/* ---------- character creator ---------- */
let draft = null, editing = null;
const SECTIONS = [["Skin", "skin", "color"], ["Hair", "hair", "chip"], ["Hair color", "hairC", "color"], ["Eyes", "eyes", "chip"], ["Mouth", "mouth", "chip"],
                  ["Outfit", "outfit", "chip"], ["Outfit color", "outC", "color"], ["Extras", "acc", "chip"], ["Wings", "wings", "chip"]];
function openCreator(c, title) {
  closeTrays();
  editing = c; draft = c ? { ...c } : randomAvatar("");
  if (!c) draft.name = "";
  $("creator-title").textContent = title || (c ? `Change ${c.name} ✨` : "Make a Friend ✨");
  $("cname").value = draft.name; $("c-delete").hidden = !c;
  buildOpts(); updatePreview();
  $("creator-overlay").classList.add("show");
}
function buildOpts() {
  const o = $("opts"); o.innerHTML = "";
  for (const [label, k, type] of SECTIONS) {
    const h = document.createElement("h4"); h.textContent = label; o.appendChild(h);
    const row = document.createElement("div"); row.className = "row";
    for (const v of PARTS[k]) {
      const val = Array.isArray(v) ? v[0] : v, el = document.createElement("div");
      if (type === "color") { el.className = "swatch"; el.style.background = val === "rainbow" ? "linear-gradient(135deg,#ff5f8f,#ffb347,#ffe066,#6fdc8c,#9b7bff)" : val; }
      else { el.className = "chip"; el.textContent = v[1]; }
      if (draft[k] === val) el.classList.add("pick");
      el.onclick = () => { draft[k] = val; [...row.children].forEach(x => x.classList.remove("pick")); el.classList.add("pick"); updatePreview(); blip(500 + Math.random() * 400, .08); };
      row.appendChild(el);
    }
    o.appendChild(row);
  }
}
function updatePreview() { $("preview").innerHTML = avatarSVG(draft); }
$("cname").addEventListener("input", e => { draft.name = e.target.value; });
$("c-random").onclick = () => {
  const nm = $("cname").value.trim();
  draft = { ...draft, ...randomAvatar(nm || undefined), id: draft.id };
  $("cname").value = draft.name; buildOpts(); updatePreview(); tune([523, 659, 784]);
};
$("c-save").onclick = () => {
  draft.name = $("cname").value.trim() || pick(["Luna", "Milo", "Stella", "Pip", "Rosie"]);
  let c = editing;
  if (c) Object.assign(c, draft);
  else { c = { ...draft, place: placeId, x: rand(30, 70), y: rand(84, 96) }; friends.push(c); }
  $("creator-overlay").classList.remove("show");
  render(); renderFriendsTray();
  const el = elById(c.id); fxAt(el, ["✨", "💖", "⭐"], 12); bounce(el); say(c.id, "Ta-da! ✨");
  tune([523, 659, 784, 1047]); save();
};
$("c-delete").onclick = () => {
  if (!editing || !confirm(`Say goodbye to ${editing.name}?`)) return;
  friends = friends.filter(f => f !== editing);
  $("creator-overlay").classList.remove("show"); render(); renderFriendsTray(); save();
};
$("c-cancel").onclick = () => $("creator-overlay").classList.remove("show");

/* ---------- buttons ---------- */
function closeTrays() {
  $("friends-tray").classList.remove("show"); $("decor-tray").classList.remove("show");
  decorating = false; $("btn-friends").classList.remove("on"); $("btn-decorate").classList.remove("on");
}
$("btn-friends").onclick = () => {
  const open = !$("friends-tray").classList.contains("show"); closeTrays();
  if (open) { renderFriendsTray(); $("friends-tray").classList.add("show"); $("btn-friends").classList.add("on"); }
};
$("btn-decorate").onclick = () => {
  const open = !decorating; closeTrays();
  if (open) { decorating = true; renderDecorTray(); $("decor-tray").classList.add("show"); $("btn-decorate").classList.add("on"); }
};
$("friends-close").onclick = closeTrays;
$("decor-close").onclick = closeTrays;
$("btn-map").onclick = () => { closeTrays(); renderMap(); $("map-overlay").classList.add("show"); blip(600, .1); };
$("map-close").onclick = () => $("map-overlay").classList.remove("show");
$("btn-sound").onclick = e => { soundOn = !soundOn; e.target.textContent = soundOn ? "🔊" : "🔇"; save(); };

/* ---------- timers: food comes back, magic wears off, friends chat ---------- */
setInterval(() => {
  if (dragging) return;
  const now = Date.now(); let changed = false;
  for (const [pid, L] of Object.entries(layouts))
    for (const p of L.props) if (p.gone && now - p.gone > 15000) { delete p.gone; if (pid === placeId) changed = true; }
  for (const f of Object.values(fxState))
    for (const k in f) if (f[k] && f[k] <= now) { f[k] = 0; changed = true; }
  if (changed) { render(); save(); }
}, 1000);
setInterval(() => {
  if (dragging || dim || document.querySelector(".overlay.show")) return;
  const here = friendsHere(); if (here.length && Math.random() < .5) say(pick(here).id, pick(LINES));
}, 8000);
window.addEventListener("resize", () => { if (!dragging) render(); });

/* ---------- start ---------- */
const fresh = !load();
if (fresh) {
  const a = randomAvatar("Luna"); Object.assign(a, { place: "home", x: 64, y: 90 });
  const b = randomAvatar("Milo"); Object.assign(b, { place: "home", x: 82, y: 95 });
  friends = [a, b]; save();
}
$("btn-sound").textContent = soundOn ? "🔊" : "🔇";
buildDecorItems(); render();
if (fresh) setTimeout(() => openCreator(null, "Make YOU! ✨"), 400);
