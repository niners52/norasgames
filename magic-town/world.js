"use strict";
/* =====================================================================
   MAGIC TOWN — the world: rooms, walking, dragging, poses, holding,
   furniture, magic, your own house, friends, and saving
   ===================================================================== */
const $ = id => document.getElementById(id);
const stage = $("stage"), roomEl = $("room"), thingsEl = $("things"), sceneryEl = $("scenery");
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const SAVE_KEY = "magicTown";
const PLACE_ORDER = ["home", "school", "potion", "cafe", "meadow", "castle", "myhouse"];

/* how big things are next to a person (a person is 34 tall) */
const BIG = { "🛋️": 40, "🛏️": 46, "🛁": 44, "🚽": 26, "📺": 24, "🪴": 22, "🪞": 28, "🎹": 36, "🫕": 34, "🪑": 30, "🔭": 26, "🪩": 18,
              "🦄": 36, "🐴": 34, "🐉": 30, "🐈‍⬛": 16, "🐱": 16, "🐶": 16, "🧸": 12, "🥁": 20, "🎸": 20, "🪧": 30, "👗": 18, "🐰": 12, "🌳": 40 };
const ART = { unicorn: { w: 44, h: 36 }, horse: { w: 44, h: 36 } };          // drawn animals with whole bodies
const ART_FROM = { "🦄": "unicorn", "🐴": "horse", "🐎": "horse" };
const sizeOf = p => p.art ? ART[p.art].h : (BIG[p.e] ?? p.s ?? 10);
const FURN_EMOJI = new Set(["🛋️", "🛏️", "🪑", "📺", "🪴", "🛁", "🚽", "🎹", "🫕", "🪞", "🥁", "🔭", "🪩", "🪧"]);
const FURN_KINDS = { table: { name: "Table", w: 40, h: 19 }, counter: { name: "Counter", w: 48, h: 22 }, shelf: { name: "Shelf", w: 32, h: 3 }, nightstand: { name: "Nightstand", w: 16, h: 16 } };
const POSE_FOR = { sleep: "sleep", sofa: "sit", throne: "sit", bath: "bath", horse: "ride", unicorn: "ride" };
const POSE_CLASS = { sleep: "lying", sit: "sitting", bath: "bathing", ride: "riding" };
const POSE_SAY = { sleep: ["Zzz… 😴", "Night night! 🌙", "So sleepy… 💤"], sit: ["So comfy! 🛋️", "Ahh, nice seat!", "Sitting pretty! 💅"],
                   bath: ["Bubble bath! 🫧", "Splish splash! 🛁", "Rubber ducky time! 🦆"], ride: ["Giddy up! 🦄", "Wheee, let's ride! 🌈", "Go go go! 💨"] };

let friends = [], layouts = {}, house = null, roomKey = "home:living", soundOn = true, dim = false, moveFurn = false;
let decorating = false, dragging = null, swipe = null, selected = null, uidN = 0;
const fxState = {};   // friend id -> { tiny, giant, glow, rainbow, wings, frog } (time each one ends)
const speech = {};    // thing id -> { text, until }
const newId = p => p + Date.now().toString(36) + (uidN++).toString(36);

/* ---------- places and rooms ---------- */
function placeMeta(pid) {
  if (pid !== "myhouse") return PLACES[pid];
  if (!house) return { name: "Empty Lot", emoji: "🪧", card: "linear-gradient(135deg,#c8e6a0,#9fd07a)" };
  const S = HOUSE_STYLES[house.style];
  return { name: "My " + S.name, emoji: S.emoji, card: S.card };
}
function houseRoom(r) {
  const S = HOUSE_STYLES[house.style], T = HOUSE_ROOMS[r.type] || HOUSE_ROOMS.living;
  return { id: r.id, name: T.name, emoji: T.emoji, walls: S.walls, wallIdx: T.wallIdx % S.walls.length, floor: S.floor,
           scenery: [...T.scenery, ...S.scenery],
           props: [...T.props, ...S.accents.map((e, i) => ({ e, x: i % 2 ? 94 : 6, y: 97, s: 8, a: "sparkle" }))] };
}
const roomsOf = pid => pid === "myhouse" ? (house ? house.rooms.map(houseRoom) : [LOT]) : PLACES[pid].rooms;
function street() { const out = []; for (const pid of PLACE_ORDER) for (const r of roomsOf(pid)) out.push({ pid, room: r, key: pid + ":" + r.id }); return out; }
function roomInfo(key) { const s = street(); return s.find(x => x.key === key) || s[0]; }
function neighbors() {
  const s = street(), i = Math.max(0, s.findIndex(x => x.key === roomKey));
  return { prev: s[(i - 1 + s.length) % s.length], next: s[(i + 1) % s.length], here: s[i] };
}
function layout(key) {
  if (!layouts[key]) {
    const r = roomInfo(key).room, ids = {};
    const props = r.props.map(p => { const id = newId("p"); if (p.key) ids[p.key] = id; const q = { ...p, id }; delete q.key; return q; });
    for (const p of props) { if (p.on) p.on = ids[p.on] || null; if (p.x == null) p.x = 50; if (p.y == null) p.y = 80; p.x0 = p.x; p.y0 = p.y; }
    layouts[key] = { wall: r.wallIdx || 0, props };
  }
  return layouts[key];
}

/* ---------- saving ---------- */
function fixKey(k) {
  if (typeof k !== "string") return "home:living";
  if (k.includes(":")) return k;
  return PLACES[k] ? k + ":" + PLACES[k].rooms[0].id : "home:living";
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!d || !Array.isArray(d.friends) || !d.friends.length) return false;
    house = d.house && HOUSE_STYLES[d.house.style] && Array.isArray(d.house.rooms) && d.house.rooms.length ? d.house : null;
    layouts = {};
    // rooms from the first version of Magic Town get a fresh start with the new furniture
    for (const [k, v] of Object.entries(d.layouts || {})) if (k.includes(":") && v && Array.isArray(v.props)) layouts[k] = v;
    const valid = new Set(street().map(x => x.key));
    friends = d.friends.map(f => { const k = fixKey(f.place); return { ...f, place: valid.has(k) ? k : "home:living" }; });
    const rk = fixKey(d.roomKey || d.placeId);
    roomKey = valid.has(rk) ? rk : "home:living";
    soundOn = d.soundOn !== false;
    return true;
  } catch (e) { return false; }
}
let saveTimer;
function saveNow() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, friends, layouts, house, roomKey, soundOn, savedAt: Date.now() })); } catch (e) {}
}
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 150); }
/* save the moment the page is hidden or closed (iPads close tabs without warning) */
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveNow(); });
window.addEventListener("pagehide", saveNow);
window.addEventListener("beforeunload", saveNow);
setInterval(saveNow, 5000);
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

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

/* ---------- sizes and furniture ---------- */
const U = () => Math.min(stage.clientHeight, stage.clientWidth * .8) / 100;
const isDrawn = p => !!(p && p.k);
const isFurniture = p => isDrawn(p) || FURN_EMOJI.has(p.e);
const furnTop = f => f.y - FURN_KINDS[f.k].h * U() / stage.clientHeight * 100;
const friendsHere = () => friends.filter(f => f.place === roomKey);
const elById = id => thingsEl.querySelector(`[data-id="${id}"]`);

function settle(L) {   // things sitting on furniture sit right on top of it
  for (const p of L.props) {
    if (!p.on) continue;
    const f = L.props.find(q => q.id === p.on && isDrawn(q));
    if (!f) { delete p.on; delete p.dx; continue; }
    p.x = clamp(f.x + (p.dx || 0), 1, 99); p.y = furnTop(f);
  }
}
function furnHTML(k, u, c) {
  const wood = c || "#b9834f", dark = shade(wood, -35), light = shade(wood, 25);
  const board = (h, top = `linear-gradient(${light},${wood})`) =>
    `<div style="position:absolute;left:0;right:0;top:0;height:${h}px;background:${top};border-radius:${.8 * u}px;box-shadow:0 ${.4 * u}px 0 ${dark}"></div>`;
  const leg = side => `<div style="position:absolute;${side}:9%;width:${1.8 * u}px;top:${2 * u}px;bottom:0;background:${dark};border-radius:${.5 * u}px"></div>`;
  const knob = pos => `<div style="position:absolute;${pos};width:${1.1 * u}px;height:${1.1 * u}px;border-radius:50%;background:#ffd54a"></div>`;
  switch (k) {
    case "table": return leg("left") + leg("right") + board(2.4 * u);
    case "counter": return `<div style="position:absolute;left:2%;right:2%;top:${2 * u}px;bottom:0;background:${wood};border-radius:0 0 ${.6 * u}px ${.6 * u}px;box-shadow:inset 0 0 0 ${.4 * u}px ${dark}"></div>
      <div style="position:absolute;left:7%;width:39%;top:${4.2 * u}px;bottom:${1.6 * u}px;border:${.35 * u}px solid ${dark};border-radius:${.6 * u}px"></div>
      <div style="position:absolute;right:7%;width:39%;top:${4.2 * u}px;bottom:${1.6 * u}px;border:${.35 * u}px solid ${dark};border-radius:${.6 * u}px"></div>
      ${knob("left:40%;top:48%")}${knob("right:40%;top:48%")}${board(2.6 * u, "linear-gradient(#fff,#e6e0f0)")}`;
    case "shelf": return board(2 * u) +
      `<div style="position:absolute;left:12%;top:${1.8 * u}px;width:${1.6 * u}px;height:${3 * u}px;background:${dark};clip-path:polygon(0 0,100% 0,0 100%)"></div>
       <div style="position:absolute;right:12%;top:${1.8 * u}px;width:${1.6 * u}px;height:${3 * u}px;background:${dark};clip-path:polygon(0 0,100% 0,100% 100%)"></div>`;
    case "nightstand": return `<div style="position:absolute;left:4%;right:4%;top:${1.6 * u}px;bottom:${1.4 * u}px;background:${wood};border-radius:${.6 * u}px;box-shadow:inset 0 0 0 ${.3 * u}px ${dark}"></div>
      <div style="position:absolute;left:16%;right:16%;top:44%;height:${.35 * u}px;background:${dark}"></div>${knob("left:45%;top:60%")}
      <div style="position:absolute;left:10%;width:${1.3 * u}px;bottom:0;height:${1.6 * u}px;background:${dark}"></div>
      <div style="position:absolute;right:10%;width:${1.3 * u}px;bottom:0;height:${1.6 * u}px;background:${dark}"></div>${board(2.2 * u)}`;
  }
  return "";
}
function furnitureUnder(o, u) {   // is this item being set down on top of a table, counter, shelf, or nightstand?
  const L = layout(roomKey), W = stage.clientWidth, H = stage.clientHeight;
  let best = null;
  for (const f of L.props) {
    if (!isDrawn(f) || f === o || f.gone) continue;
    const F = FURN_KINDS[f.k], halfW = F.w * u / 2 / W * 100, top = furnTop(f), hPct = F.h * u / H * 100;
    if (Math.abs(o.x - f.x) <= halfW && o.y >= top - 4 && o.y <= top + Math.max(hPct * .55, 3)) if (!best || top < furnTop(best)) best = f;
  }
  return best;
}

/* ---------- where posed friends go ---------- */
function posePos(c, p, idx) {
  const W = stage.clientWidth, H = stage.clientHeight, u = U(), ph = sizeOf(p) * u, h = 34 * u;
  const px = p.x / 100 * W, py = p.y / 100 * H;
  let x = px, y = py;
  switch (c.pose.type) {
    case "sleep": x = px + ph * .22 + idx * 3 * u; y = py - ph * .36; break;
    case "sit":   x = px + (idx ? (idx % 2 ? 1 : -1) * Math.ceil(idx / 2) * ph * .28 : 0); y = py - ph * .2; break;
    case "bath":  x = px + (idx ? (idx % 2 ? 1 : -1) * Math.ceil(idx / 2) * ph * .22 : 0); y = py - ph * .42 + h * .78 * .48; break;
    case "ride":  x = px + (p.art ? (p.flip ? 1 : -1) * ph * .08 : 0) + (idx ? idx * ph * .3 : 0); y = py - ph * (p.art ? .5 : .42); break;
  }
  return { x: x / W * 100, y: y / H * 100 };
}

/* ---------- drawing the room ---------- */
function render() {
  const info = roomInfo(roomKey); roomKey = info.key;
  const R = info.room, P = placeMeta(info.pid), L = layout(roomKey), u = U();
  settle(L);
  $("place").textContent = `${P.emoji} ${P.name} · ${R.emoji} ${R.name}`;
  $("wall").style.background = R.walls[L.wall % R.walls.length];
  $("floor").style.background = R.floor;

  let sc = "";
  if (R.rainbow) sc += `<div class="scene-bit" style="left:50%;top:64%;width:${95 * u}px;height:${48 * u}px;opacity:.75;
    background:radial-gradient(circle at 50% 100%,transparent 52%,#9b7bff 52% 57%,#4fc3f7 57% 62%,#6fdc8c 62% 67%,#ffe066 67% 72%,#ffb347 72% 77%,#ff6f91 77% 82%,transparent 82%)"></div>`;
  if (R.shelf) sc += `<div style="position:absolute;left:52%;width:44%;top:${R.shelf.y}%;height:${1.6 * u}px;background:#7a5230;border-radius:3px;box-shadow:0 4px 6px rgba(0,0,0,.3)"></div>`;
  if (R.board) { const b = R.board; sc += `<div class="board" style="left:${b.x - b.w / 2}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;font-size:${3.2 * u}px">${b.text}</div>`; }
  for (const s of R.scenery) sc += `<div class="scene-bit" style="left:${s.x}%;top:${s.y}%;font-size:${(BIG[s.e] ?? s.s) * u}px">${s.e}</div>`;
  sceneryEl.innerHTML = sc;

  thingsEl.innerHTML = "";
  const zOf = {};
  for (const p of L.props) if (isDrawn(p)) zOf[p.id] = Math.round(p.y * 10);
  for (const p of L.props) {
    if (!p.art && ART_FROM[p.e]) p.art = ART_FROM[p.e];   // old head-only unicorns become whole unicorns
    if (p.gone) continue;
    const el = propEl(p, u);
    el.style.zIndex = p.on && zOf[p.on] != null ? zOf[p.on] + 2 : Math.round(p.y * 10);
    thingsEl.appendChild(el);
  }
  const count = {};
  for (const c of friendsHere()) {
    let z = Math.round(c.y * 10) + 1;
    if (c.pose) {
      const p = L.props.find(q => q.id === c.pose.on && !q.gone);
      if (!p) c.pose = null;
      else {
        const idx = count[p.id] = (count[p.id] ?? -1) + 1, pos = posePos(c, p, idx);
        c.x = pos.x; c.y = pos.y; z = Math.round(p.y * 10) + 3 + idx;
      }
    }
    const el = charEl(c, u); el.style.zIndex = z; thingsEl.appendChild(el);
  }
  $("dim").classList.toggle("show", dim);
  renderNav();
  $("house-btns").hidden = !(info.pid === "myhouse" && house);
}
function propEl(p, u) {
  const el = document.createElement("div");
  el.dataset.id = p.id;
  if (isDrawn(p)) {
    const F = FURN_KINDS[p.k];
    el.className = "thing prop furn"; el.style.width = F.w * u + "px"; el.style.height = F.h * u + "px"; el.innerHTML = furnHTML(p.k, u, p.c);
  } else if (p.art) {
    const A = ART[p.art];
    el.className = "thing prop art"; el.style.width = A.w * u + "px"; el.style.height = A.h * u + "px"; el.innerHTML = animalSVG(p.art);
    if (p.flip) el.firstChild.style.transform = "scaleX(-1)";
  } else { el.className = "thing prop"; el.textContent = p.e; el.style.fontSize = sizeOf(p) * u + "px"; }
  el.style.left = p.x + "%"; el.style.top = p.y + "%";
  addSay(el, p.id);
  return el;
}
function look(c) {
  const f = fxState[c.id] || {}, now = Date.now(), l = { ...c };
  if (f.rainbow > now) l.hairC = "rainbow";
  if (f.wings > now) l.wings = c.wings === "none" ? "fairy" : c.wings === "fairy" ? "butterfly" : "fairy";
  if (dim || (c.pose && c.pose.type === "sleep")) l.eyes = "sleepy";
  return l;
}
function charEl(c, u) {
  const f = fxState[c.id] || {}, now = Date.now(), h = 34 * u;
  const el = document.createElement("div");
  el.className = "thing char"; el.dataset.id = c.id;
  el.style.width = h * 120 / 170 + "px"; el.style.height = h + "px";
  el.style.left = c.x + "%"; el.style.top = c.y + "%";
  for (const k of ["tiny", "giant", "glow"]) if (f[k] > now) el.classList.add(k);
  if (c.pose) el.classList.add(POSE_CLASS[c.pose.type]);
  const frog = f.frog > now;
  const body = frog ? `<div class="frogbody" style="font-size:${h * .55}px;line-height:1;text-align:center;padding-top:${h * .38}px">🐸</div>` : avatarSVG(look(c));
  const held = c.hold && !frog ? `<div class="held" style="font-size:${Math.min(sizeOf(c.hold), 11) * u}px">${c.hold.e}</div>` : "";
  const blanket = c.pose && c.pose.type === "sleep" ? `<div class="blanket"></div>` : "";
  el.innerHTML = `<div class="shadow"></div><div class="inner"><div class="bob">${body}${held}${blanket}</div></div><div class="name">${esc(c.name)}</div>`;
  if (selected && selected.id === c.id && selected.until > now) el.appendChild(friendButtons(c));
  addSay(el, c.id);
  return el;
}

/* ---------- walking from room to room ---------- */
function navLabel(n, here) {
  if (n.pid !== here.pid) { const P = placeMeta(n.pid); return `${P.emoji} ${P.name}`; }
  return `${n.room.emoji} ${n.room.name}`;
}
function renderNav() {
  const { prev, next, here } = neighbors();
  $("go-left").querySelector("small").textContent = navLabel(prev, here);
  $("go-right").querySelector("small").textContent = navLabel(next, here);
  const rooms = roomsOf(here.pid);
  $("dots").innerHTML = rooms.length > 1 ? rooms.map(r => `<span class="${here.pid + ":" + r.id === roomKey ? "on" : ""}"></span>`).join("") : "";
}
function goRoom(key, dir = 0) {
  roomKey = key; dim = false; selected = null;
  render();
  if (decorating) renderDecorTray();
  if ($("friends-tray").classList.contains("show")) renderFriendsTray();
  roomEl.classList.remove("slide-l", "slide-r", "disco"); void roomEl.offsetWidth;
  if (dir) roomEl.classList.add(dir > 0 ? "slide-l" : "slide-r");
  blip(dir >= 0 ? 660 : 520, .12, "triangle", .08); save();
  const info = roomInfo(roomKey);
  if (info.pid === "myhouse" && !house) setTimeout(() => toast("Tap the sign to build your very own house! 🏠"), 450);
}
function step(dir) { const { prev, next } = neighbors(); goRoom((dir > 0 ? next : prev).key, dir); }
$("go-left").onclick = () => step(-1);
$("go-right").onclick = () => step(1);

/* ---------- speech bubbles, sparkles, toasts ---------- */
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
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---------- friend buttons: change look, put down, get up, goodbye ---------- */
function friendButtons(c) {
  const box = document.createElement("div");
  box.className = "fbtns" + (c.x > 78 ? " left" : "");
  const add = (act, label) => { const b = document.createElement("div"); b.className = "fbtn"; b.dataset.act = act; b.textContent = label; box.appendChild(b); };
  add("edit", "✏️");
  if (c.hold) add("drop", "✋");
  if (c.pose) add("up", "🚶");
  add("delete", "🗑️");
  return box;
}
function showButtons(c, el) {
  selected = { id: c.id, until: Date.now() + 5000 };
  thingsEl.querySelectorAll(".fbtns").forEach(n => n.remove());
  el.appendChild(friendButtons(c));
  setTimeout(() => { if (selected && selected.id === c.id && selected.until <= Date.now()) { selected = null; const e2 = elById(c.id); if (e2) e2.querySelectorAll(".fbtns").forEach(n => n.remove()); } }, 5050);
}
function friendAct(c, act) {
  if (!c) return;
  selected = null;
  if (act === "edit") openCreator(c);
  else if (act === "delete") deleteFriend(c);
  else if (act === "drop") { dropHeld(c); render(); blip(400, .1); save(); }
  else if (act === "up") { c.pose = null; c.y = clamp(c.y + 10, 80, 98); render(); say(c.id, "I'm up! ☀️"); blip(700, .15); save(); }
  else render();
}
function deleteFriend(c) {
  if (!confirm(`Say goodbye to ${c.name}? 👋`)) { render(); return; }
  const el = elById(c.id); if (el) fxAt(el, ["👋", "💨", "✨"], 8);
  if (c.place === roomKey && c.hold) dropHeld(c);
  friends = friends.filter(f => f !== c);
  $("creator-overlay").classList.remove("show");
  render(); if ($("friends-tray").classList.contains("show")) renderFriendsTray();
  toast(`Bye bye, ${c.name}! 👋`); blip(300, .3); save();
}

/* ---------- holding things ---------- */
function giveItem(o, c) {
  const L = layout(roomKey);
  if (c.hold) dropHeld(c);
  L.props.splice(L.props.indexOf(o), 1);
  const h = { ...o }; delete h.on; delete h.dx; delete h.gone;
  c.hold = h;
  render();
  const el = elById(c.id); bounce(el); fxAt(el, ["✨"], 4);
  say(c.id, pick([`I got a ${o.e}!`, "Thanks! 💖", "Look what I have! ✨", "Ooh, for me? 🥹"]));
  blip(800, .12); save();
}
function dropHeld(c) {
  if (!c.hold) return;
  const L = layout(roomKey), h = c.hold;
  c.hold = null;
  h.id = h.id || newId("p"); h.x = clamp(c.x + 7, 2, 98); h.y = clamp(c.y, 20, 100); h.x0 = h.x; h.y0 = h.y;
  L.props.push(h);
}
function setPose(c, p) {
  const type = POSE_FOR[p.a];
  c.pose = { type, on: p.id };
  render();
  const el = elById(c.id);
  say(c.id, pick(POSE_SAY[type]), 3000);
  fxAt(el, type === "sleep" ? ["💤"] : type === "bath" ? ["🫧", "🫧"] : ["✨", "💖"], 5);
  blip(type === "sleep" ? 260 : 700, .3); save();
}

/* ---------- dragging and tapping ---------- */
function inRect(el, x, y, pad = 8) { const r = el.getBoundingClientRect(); return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad; }
function charAt(x, y, except) {
  for (const el of thingsEl.querySelectorAll(".char")) if (el !== except && inRect(el, x, y, 0)) return friends.find(f => f.id === el.dataset.id);
  return null;
}
function propAt(x, y, except, test) {
  const L = layout(roomKey);
  let best = null, bz = -1;
  for (const el of thingsEl.querySelectorAll(".prop")) {
    if (el === except || !inRect(el, x, y, 6)) continue;
    const p = L.props.find(q => q.id === el.dataset.id), z = +el.style.zIndex || 0;
    if (p && test(p) && z > bz) { best = p; bz = z; }
  }
  return best;
}
const overTrash = (x, y) => (decorating && inRect($("trash"), x, y, 6)) || ($("bin").classList.contains("show") && inRect($("bin"), x, y, 14));
/* a friend only sits, sleeps, bathes, or rides when their feet land right on the seat part */
const ZONES = { sleep: [.05, .95, .12, .72], sit: [.12, .88, .18, .68], bath: [.08, .92, .08, .68], ride: [.18, .82, .08, .62] };
function poseTarget(o) {
  const sr = stage.getBoundingClientRect(), fx = sr.left + o.x / 100 * sr.width, fy = sr.top + o.y / 100 * sr.height, L = layout(roomKey);
  let best = null, bz = -1;
  for (const el of thingsEl.querySelectorAll(".prop")) {
    const p = L.props.find(q => q.id === el.dataset.id);
    if (!p || p.gone || !POSE_FOR[p.a]) continue;
    const [x0, x1, y0, y1] = ZONES[POSE_FOR[p.a]], r = el.getBoundingClientRect();
    if (fx < r.left + r.width * x0 || fx > r.left + r.width * x1 || fy < r.top + r.height * y0 || fy > r.top + r.height * y1) continue;
    const z = +el.style.zIndex || 0;
    if (z > bz) { best = p; bz = z; }
  }
  return best;
}
function markTarget(d, p) {
  if (d.target === p) return;
  if (d.targetEl) d.targetEl.classList.remove("target");
  d.target = p; d.targetEl = p ? elById(p.id) : null;
  if (d.targetEl) d.targetEl.classList.add("target");
}
const arrowAt = (x, y) => inRect($("go-left"), x, y, 12) ? -1 : inRect($("go-right"), x, y, 12) ? 1 : 0;

thingsEl.addEventListener("pointerdown", e => {
  const fb = e.target.closest(".fbtn");
  if (fb) { e.preventDefault(); e.stopPropagation(); friendAct(friends.find(f => f.id === fb.closest(".thing").dataset.id), fb.dataset.act); return; }
  const el = e.target.closest(".thing");
  if (!el) { swipe = { x: e.clientX, y: e.clientY }; return; }
  e.preventDefault();
  const isChar = el.classList.contains("char");
  const o = isChar ? friends.find(f => f.id === el.dataset.id) : layout(roomKey).props.find(p => p.id === el.dataset.id);
  if (!o) return;
  dragging = { el, id: el.dataset.id, isChar, o, locked: !isChar && isFurniture(o) && !moveFurn && !decorating,
               sx: e.clientX, sy: e.clientY, moved: false, sr: stage.getBoundingClientRect(), riders: [], posed: [] };
  try { (isChar ? thingsEl : el).setPointerCapture(e.pointerId); } catch (err) {}
});
function startDrag(d) {
  const o = d.o;
  d.el.classList.add("drag"); d.el.style.zIndex = 9999; d.el.style.transition = "none";
  $("bin").classList.add("show");
  d.el.querySelectorAll(".say,.fbtns").forEach(n => n.remove());
  if (d.isChar) {
    selected = null;
    if (o.pose) { o.pose = null; d.el.classList.remove("lying", "sitting", "bathing", "riding"); d.el.querySelectorAll(".blanket").forEach(n => n.remove()); }
  } else {
    if (o.on) { delete o.on; delete o.dx; }
    const L = layout(roomKey);
    d.riders = L.props.filter(p => p.on === o.id).map(p => ({ p, el: elById(p.id) }));
    d.posed = friendsHere().filter(c => c.pose && c.pose.on === o.id).map(c => ({ c, el: elById(c.id), dx: c.x - o.x, dy: c.y - o.y }));
    d.riders.concat(d.posed).forEach(r => { if (r.el) r.el.style.zIndex = 10000; });
  }
}
thingsEl.addEventListener("pointermove", e => {
  const d = dragging; if (!d) return;
  if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 8) return;
  if (d.locked) { d.moved = true; return; }
  if (!d.moved) { d.moved = true; startDrag(d); }
  const o = d.o;
  o.x = clamp((e.clientX - d.sr.left) / d.sr.width * 100, 2, 98);
  o.y = clamp((e.clientY - d.sr.top + d.el.offsetHeight * .45) / d.sr.height * 100, 14, 100);
  d.el.style.left = o.x + "%"; d.el.style.top = o.y + "%";
  if (isDrawn(o)) for (const r of d.riders) { r.p.x = clamp(o.x + (r.p.dx || 0), 1, 99); r.p.y = furnTop(o); if (r.el) { r.el.style.left = r.p.x + "%"; r.el.style.top = r.p.y + "%"; } }
  for (const r of d.posed) { r.c.x = o.x + r.dx; r.c.y = o.y + r.dy; if (r.el) { r.el.style.left = r.c.x + "%"; r.el.style.top = r.c.y + "%"; } }
  if (d.isChar) markTarget(d, poseTarget(o));
  const a = arrowAt(e.clientX, e.clientY);
  $("go-left").classList.toggle("hot", a < 0); $("go-right").classList.toggle("hot", a > 0);
  const bin = overTrash(e.clientX, e.clientY);
  $("trash").classList.toggle("hot", bin && decorating); $("bin").classList.toggle("hot", bin);
});
function endDrag(e, cancelled) {
  const d = dragging; dragging = null; if (!d) return;
  d.el.classList.remove("drag");
  if (d.targetEl) d.targetEl.classList.remove("target");
  const o = d.o, x = e.clientX, y = e.clientY, dropBin = !d.locked && d.moved && overTrash(x, y);
  ["go-left", "go-right", "trash", "bin"].forEach(id => $(id).classList.remove("hot"));
  $("bin").classList.remove("show");
  if (d.locked) {
    if (cancelled) return;
    if (!d.moved) { propAction(o, d.el); return; }
    toast("🔒 Tap the 🔒 Furniture button first to move furniture");
    return;
  }
  if (!d.moved) { if (!cancelled) onTap(d, o); return; }
  if (cancelled) { render(); save(); return; }
  const a = arrowAt(x, y);
  if (a) { carry(d, o, a); return; }
  if (dropBin) { if (d.isChar) deleteFriend(o); else removeProp(o); return; }
  if (d.isChar) {
    const p = poseTarget(o);
    if (p) { setPose(o, p); return; }
    if (Math.random() < .25) say(o.id, pick(["Wheee! ✨", "Whoa! 😲", "I like this spot! 💖"]));
  } else {
    const c = isFurniture(o) || o.art ? null : charAt(x, y, d.el);
    if (c) { if (o.eat || o.potion) feed(o, c); else giveItem(o, c); return; }
    if (!isDrawn(o)) { const f = furnitureUnder(o, U()); if (f) { o.on = f.id; o.dx = o.x - f.x; blip(520, .08); } }
    o.x0 = o.x; o.y0 = o.y;
  }
  render(); save();
}
thingsEl.addEventListener("pointerup", e => {
  if (swipe && !dragging) {
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y; swipe = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
    else if (selected) { selected = null; thingsEl.querySelectorAll(".fbtns").forEach(n => n.remove()); }
    return;
  }
  endDrag(e, false);
});
thingsEl.addEventListener("pointercancel", e => { swipe = null; endDrag(e, true); });

let lastTap = { id: null, t: 0 };
function onTap(d, o) {
  const now = Date.now(), dbl = lastTap.id === d.id && now - lastTap.t < 400;
  lastTap = { id: d.id, t: now };
  if (d.isChar) {
    if (dbl) { openCreator(o); return; }
    showButtons(o, d.el); bounce(d.el);
    say(o.id, o.pose && o.pose.type === "sleep" ? "Zzz… 😴" : pick(LINES));
    if (o.hold && o.hold.a) fxAt(d.el, ["✨", "⭐"], 4);
    blip(600 + Math.random() * 300, .12);
  } else propAction(o, d.el);
}
function carry(d, o, dir) {   // drop something on an arrow to take it to the next room
  const { prev, next } = neighbors(), target = (dir > 0 ? next : prev).key;
  const L = layout(roomKey), T = layout(target);
  if (d.isChar) { o.place = target; o.pose = null; o.x = dir > 0 ? 16 : 84; o.y = clamp(o.y, 80, 96); }
  else {
    const moving = [o, ...L.props.filter(p => p.on === o.id)];
    for (const p of moving) { L.props.splice(L.props.indexOf(p), 1); T.props.push(p); }
    delete o.on; o.x = dir > 0 ? 20 : 80; o.y = clamp(o.y, 40, 97); o.x0 = o.x; o.y0 = o.y;
    friends.forEach(c => { if (c.pose && c.pose.on === o.id) c.pose = null; });
  }
  goRoom(target, dir);
  const el = elById(o.id); fxAt(el, ["✨", "💨"], 6);
  if (d.isChar) say(o.id, pick(["Here I come! 🏃", "Wheee! ✨", "Let's go! 💖"]));
  save();
}

/* ---------- things that happen when you tap props ---------- */
const ACTS = {
  hug: { fx: ["💖", "💕", "💗"], notes: [660] },
  tv: { fx: ["🌈", "⭐", "📺"], notes: [523, 659, 784], friend: "Cartoon time! 📺" },
  sparkle: { fx: ["✨", "⭐", "💫"], notes: [1000] },
  owl: { say: "Hoo hoo! 🦉", notes: [420, 340] },
  hat: { fx: ["🐇", "✨", "🎉"], say: "Ta-da! 🐇", notes: [523, 784, 1047] },
  cat: { say: "Meow! 😺", notes: [700] }, dog: { say: "Woof woof! 🐶", notes: [220] },
  coffee: { fx: ["☁️", "☕"], say: "So cozy ☕" }, tea: { fx: ["☁️", "🫖"], say: "Tea party time! 🫖", notes: [784, 988] },
  crown: { fx: ["👑", "✨", "💎"], notes: [784, 988, 1175] },
  mirror: { fx: ["✨", "💖"], say: "Looking magical! 🪞", notes: [1200] },
  dragon: { fx: ["💖", "🔥", "💖"], say: "Rawr! 💖", notes: [140] },
  bath: { fx: ["🫧", "🫧", "🛁"], say: "Splish splash! 🫧", notes: [900, 1100, 1300] },
  flush: { fx: ["🌀", "💧"], say: "FLUSH! 🚽", notes: [300, 200, 120] },
  soap: { fx: ["🫧", "🫧"], notes: [1000, 1200] },
  duck: { say: "Quack quack! 🦆", notes: [500, 450] },
  brush: { fx: ["✨", "🦷"], say: "Sparkly teeth! 😁", notes: [1300] },
  paint: { fx: ["🎨", "🌈", "🖌️"], say: "Masterpiece! 🎨", notes: [659, 784] },
  puzzle: { fx: ["🧩", "⭐"], say: "I did it! 🧩", notes: [523, 659, 784, 1047] },
  yoyo: { fx: ["🪀"], notes: [400, 800, 400] },
  kite: { fx: ["🪁", "☁️"], say: "Up, up, up! 🪁", notes: [784, 988] },
  telescope: { fx: ["⭐", "🌠"], say: "I see a shooting star! 🌠", notes: [988, 1175] },
  globe: { fx: ["✈️", "🌍"], say: "Around the world! 🌍", notes: [523, 659] },
  bell: { fx: ["🔔", "🎶"], say: "Ding ding! Dinner time! 🔔", notes: [1047, 1047, 784] },
  bat: { fx: ["🦇"], say: "Squeak! 🦇", notes: [1500] },
  horse: { fx: ["💖", "🥕"], say: "Neigh! 🐴", notes: [600, 500] },
  rooster: { say: "Cock-a-doodle-doo! 🐓", notes: [700, 900, 700] },
  throne: { fx: ["👑", "✨"], say: "All hail the queen! 👑", notes: [523, 659, 784, 1047] },
  trumpet: { fx: ["🎺", "🎶"], notes: [523, 523, 659, 784] },
  violin: { fx: ["🎻", "🎶"], notes: [659, 784, 880, 784] },
  guitar: { fx: ["🎸", "🎶"], notes: [330, 392, 494, 659] },
  drum: { fx: ["🥁", "💥"], notes: [120, 120, 180] },
  dress: { fx: ["👗", "✨", "💖"], say: "So pretty! 👗", notes: [988] },
  sofa: { fx: ["☁️", "💖"], say: "So comfy! Drop a friend on me 🛋️", notes: [400] },
};
const SPELLBOOK = ["Fluffy Flutter 🦋", "Sparkle Sneeze ✨", "Rainbow Wiggle 🌈", "Cupcake Cloud 🧁", "Giggle Glow 😂", "Moonbeam Hop 🌙"];
const FORTUNES = ["You'll find a rainbow today 🌈", "A new friend is coming! 💖", "Something sparkly is near ✨", "Cake is in your future 🍰", "You are very magical 🔮"];
function moveProp(p, x, y, ms = 900) {
  if (p.on) { delete p.on; delete p.dx; }
  if (p.art && Math.abs(x - p.x) > 1) p.flip = x < p.x;   // animals face the way they walk
  p.x = x; p.y = y;
  const el = elById(p.id);
  if (el && p.art && el.firstChild) el.firstChild.style.transform = p.flip ? "scaleX(-1)" : "";
  if (el) { el.style.transition = `left ${ms}ms ease-in-out, top ${ms}ms ease-in-out`; el.style.left = x + "%"; el.style.top = y + "%"; setTimeout(() => { el.style.transition = ""; }, ms + 30); }
  let idx = 0;
  for (const c of friendsHere()) {
    if (!c.pose || c.pose.on !== p.id) continue;
    const pos = posePos(c, p, idx++); c.x = pos.x; c.y = pos.y;
    const ce = elById(c.id);
    if (ce) { ce.style.transition = `left ${ms}ms ease-in-out, top ${ms}ms ease-in-out`; ce.style.left = c.x + "%"; ce.style.top = c.y + "%"; setTimeout(() => { ce.style.transition = ""; }, ms + 30); }
  }
  save();
}
function spawnTemp(p, emojis, extra) {
  const L = layout(roomKey);
  if (L.props.filter(q => q.temp).length >= 6) return;
  const np = { id: newId("p"), e: pick(emojis), s: 8, temp: true, ...extra };
  if (p.on) { np.on = p.on; np.dx = (p.dx || 0) + rand(-6, 6); np.x = p.x; np.y = p.y; }
  else { np.x = clamp(p.x + rand(-14, 14), 5, 95); np.y = clamp(p.y + rand(1, 6), 50, 100); }
  np.x0 = np.x; np.y0 = np.y;
  L.props.push(np); render(); fxAt(elById(np.id), ["✨"], 5); save();
}
function propAction(p, el) {
  bounce(el);
  if (p.eat) { fxAt(el, ["😋", "✨"], 3); say(p.id, "Drag me to a friend! 😋", 1800); blip(520, .1); return; }
  if (p.potion) { fxAt(el, ["🫧", "✨"], 4); say(p.id, "Drag me onto a friend! 🪄", 1800); blip(760, .15); return; }
  if (isDrawn(p)) { say(p.id, "Put things on me! ✨", 1800); blip(500, .1); return; }
  const here = friendsHere();
  switch (p.a) {
    case "sleep": case "light":
      dim = !dim; render(); blip(dim ? 260 : 520, .3);
      if (dim) here.slice(0, 2).forEach((c, i) => setTimeout(() => say(c.id, pick(["Goodnight! 🌙", "Zzz… 😴", "Sweet dreams 💤"])), i * 400));
      if (p.a === "sleep" && !here.some(c => c.pose && c.pose.on === p.id)) toast("Drag a friend onto the bed to tuck them in 🛏️");
      return;
    case "book": say(p.id, "New spell: " + pick(SPELLBOOK), 3000); fxAt(el, ["📖", "✨"], 5); tune([659, 784]); return;
    case "orb": say(p.id, pick(FORTUNES), 3200); fxAt(el, ["🔮", "💜", "✨"], 7); tune([392, 494, 587, 784]); return;
    case "frog": say(p.id, "Ribbit! 🐸"); moveProp(p, clamp(p.x + rand(-25, 25), 5, 95), p.y, 600); blip(180, .15, "square", .06); return;
    case "cauldron": say(p.id, "Bubble bubble! ✨"); fxAt(el, ["🫧", "💚", "✨"], 10); tune([330, 392, 523, 659]);
      setTimeout(() => { spawnTemp(p, ["🧪", "🍶", "⚗️", "🧴"], { potion: true }); toast("A new potion! Drag it onto a friend 🧪"); }, 500); return;
    case "cook": say(p.id, "Sizzle sizzle! 🍳"); fxAt(el, ["♨️", "✨"], 6); tune([440, 554, 659]);
      setTimeout(() => spawnTemp(p, ["🥞", "🧇", "🍳", "🍪", "🥐"], { eat: true }), 500); return;
    case "unicorn": say(p.id, "Neigh! 🌈"); fxAt(el, ["🌈", "✨", "💖"], 9); moveProp(p, clamp(rand(15, 85), 5, 95), p.y, 1200); tune([523, 659, 784, 1047]); return;
    case "flower": p.s = Math.min((p.s || 7) + 2, 18); render(); fxAt(elById(p.id), ["🌸", "🌼", "✨"], 6); blip(880, .15); save(); return;
    case "butterfly": moveProp(p, rand(10, 90), rand(25, 70), 1300); blip(900, .1); return;
    case "bunny": say(p.id, "Boing! 🐰"); moveProp(p, clamp(p.x + rand(-30, 30), 5, 95), p.y, 500); blip(600, .1); return;
    case "piano": fxAt(el, ["🎵", "🎶"], 8); tune(Array.from({ length: 6 }, () => pick([523, 587, 659, 698, 784, 880, 988, 1047]))); return;
    case "balloon": { const y0 = p.y; moveProp(p, p.x, 24, 1400); blip(700, .3); setTimeout(() => moveProp(p, p.x, y0, 1400), 2200); return; }
    case "disco": roomEl.classList.add("disco"); fxAt(el, ["🪩", "🎶", "✨"], 10);
      tune([523, 659, 784, 659, 523, 784, 1047]); here.forEach(c => { bounce(elById(c.id)); say(c.id, pick(["Dance party! 💃", "Let's boogie! 🕺", "Wooo! 🎶"])); });
      setTimeout(() => roomEl.classList.remove("disco"), 8000); return;
    case "sign": openHousePicker(); return;
    case "gift": {
      const e = pick(DECOR.filter(x => x !== "🎁")), info = DECOR_INFO[e] || {};
      p.e = e; p.a = info.a; p.eat = !!info.eat; p.potion = !!info.potion;
      render(); fxAt(elById(p.id), ["🎉", "🎊", "✨"], 12); tune([523, 659, 784, 1047]); save(); return;
    }
  }
  const A = ACTS[p.a];
  if (A) {
    if (A.fx) fxAt(el, A.fx, 7);
    if (A.say) say(p.id, A.say);
    if (A.notes) tune(A.notes);
    if (A.friend && here[0]) say(here[0].id, A.friend);
  } else { fxAt(el, ["✨"], 4); blip(800, .1); }
}

/* ---------- eating and magic ---------- */
const SPELLS = [["tiny", "I'm so tiny! 🐜"], ["giant", "I'm HUGE! 🦖"], ["glow", "I'm glowing! ✨"], ["rainbow", "Rainbow hair! 🌈"],
                ["wings", "I've got wings! 🧚"], ["frog", "Ribbit! 🐸"], ["color", "New outfit color! 👗"]];
function useUp(o) {
  const L = layout(roomKey);
  if (o.temp) L.props.splice(L.props.indexOf(o), 1);
  else { o.gone = Date.now(); if (!o.on) { o.x = o.x0 ?? o.x; o.y = o.y0 ?? o.y; } }
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
  const L = layout(roomKey);
  L.props.splice(L.props.indexOf(o), 1);
  L.props.forEach(p => { if (p.on === o.id) { delete p.on; delete p.dx; } });
  friends.forEach(c => { if (c.pose && c.pose.on === o.id) c.pose = null; });
  render(); blip(200, .15); save();
}

/* ---------- your own house ---------- */
function openHousePicker() {
  const g = $("house-grid"); g.innerHTML = "";
  for (const [id, S] of Object.entries(HOUSE_STYLES)) {
    const d = document.createElement("div");
    d.className = "loc" + (house && house.style === id ? " here" : ""); d.style.background = S.card;
    d.innerHTML = `<span class="e">${S.emoji}</span>${S.name}<small>${S.desc}</small>`;
    d.onclick = () => buildHouse(id); g.appendChild(d);
  }
  closeTrays(); $("house-overlay").classList.add("show"); blip(600, .1);
}
function buildHouse(style) {
  if (house && house.style === style) { $("house-overlay").classList.remove("show"); return; }
  if (house && !confirm("Move to a new house? Your house decorations will start fresh.")) return;
  Object.keys(layouts).filter(k => k.startsWith("myhouse:")).forEach(k => delete layouts[k]);
  house = { style, rooms: ["living", "bedroom", "kitchen", "bathroom"].map(t => ({ id: newId("r"), type: t })) };
  const first = "myhouse:" + house.rooms[0].id;
  friends.forEach(f => { if (f.place.startsWith("myhouse:")) { f.place = first; f.pose = null; f.x = rand(30, 70); f.y = rand(86, 96); } });
  $("house-overlay").classList.remove("show");
  goRoom(first, 0);
  const S = HOUSE_STYLES[style];
  fxPx(stage.clientWidth / 2, stage.clientHeight / 2, ["🎉", "🏠", S.emoji, "✨"], 16);
  toast(`Welcome to your ${S.name}! ${S.emoji} Walk ▶ to see all the rooms`); tune([523, 659, 784, 1047, 1319]); save();
}
function openAddRoom() {
  if (!house) return;
  if (house.rooms.length >= 8) { toast("Your house has 8 rooms. That's the most! 🏠"); return; }
  const g = $("addroom-grid"); g.innerHTML = "";
  for (const [t, T] of Object.entries(HOUSE_ROOMS)) {
    const d = document.createElement("div");
    d.className = "loc"; d.style.background = HOUSE_STYLES[house.style].card;
    d.innerHTML = `<span class="e">${T.emoji}</span>${T.name}`;
    d.onclick = () => addRoom(t); g.appendChild(d);
  }
  $("addroom-overlay").classList.add("show");
}
function addRoom(t) {
  const r = { id: newId("r"), type: t }, i = house.rooms.findIndex(x => "myhouse:" + x.id === roomKey);
  house.rooms.splice(i + 1, 0, r);
  $("addroom-overlay").classList.remove("show");
  goRoom("myhouse:" + r.id, 1);
  toast(`A new ${HOUSE_ROOMS[t].name}! ${HOUSE_ROOMS[t].emoji}`); tune([523, 784, 1047]); save();
}
function removeRoom() {
  if (!house) return;
  if (house.rooms.length <= 1) { toast("Your house needs at least one room! 🏠"); return; }
  const i = house.rooms.findIndex(x => "myhouse:" + x.id === roomKey);
  if (i < 0 || !confirm("Remove this room and everything in it?")) return;
  const [r] = house.rooms.splice(i, 1), gone = "myhouse:" + r.id, dest = "myhouse:" + house.rooms[Math.max(0, i - 1)].id;
  delete layouts[gone];
  friends.forEach(f => { if (f.place === gone) { f.place = dest; f.pose = null; } });
  goRoom(dest, -1); save();
}
$("house-close").onclick = () => $("house-overlay").classList.remove("show");
$("addroom-close").onclick = () => $("addroom-overlay").classList.remove("show");
$("btn-addroom").onclick = openAddRoom;
$("btn-removeroom").onclick = removeRoom;
$("btn-newhouse").onclick = openHousePicker;

/* ---------- friends tray ---------- */
function renderFriendsTray() {
  const row = $("friends-row"); row.innerHTML = "";
  const add = document.createElement("div"); add.className = "chip"; add.innerHTML = `<span class="e">➕</span>New friend`;
  add.onclick = () => openCreator(null); row.appendChild(add);
  for (const c of friends) {
    const info = roomInfo(c.place), ch = document.createElement("div");
    ch.className = "chip" + (c.place === roomKey ? " pick" : "");
    ch.innerHTML = `<div class="mini">${avatarSVG(c)}</div>${esc(c.name)} ${placeMeta(info.pid).emoji}`;
    ch.onclick = () => callFriend(c); row.appendChild(ch);
  }
}
function callFriend(c) {
  if (c.place === roomKey) { const el = elById(c.id); bounce(el); say(c.id, "I'm right here! 👋"); blip(600, .1); return; }
  c.place = roomKey; c.pose = null; c.x = rand(25, 75); c.y = rand(84, 96);
  render(); const el = elById(c.id); fxAt(el, ["✨", "💫"], 9); say(c.id, "Hi! I'm here! 👋"); tune([523, 784]);
  renderFriendsTray(); save();
}

/* ---------- decorate tray ---------- */
function buildDecorItems() {
  const ir = $("items-row");
  for (const [k, F] of Object.entries(FURN_KINDS)) {
    const ch = document.createElement("div"); ch.className = "chip";
    const s = 1.3;
    ch.innerHTML = `<div style="position:relative;width:${F.w * s}px;height:${Math.max(F.h * s, 6)}px;margin:${k === "shelf" ? 16 : 4}px auto 4px">${furnHTML(k, s)}</div>${F.name}`;
    ch.onclick = () => addFurniture(k); ir.appendChild(ch);
  }
  for (const e of DECOR) {
    const ch = document.createElement("div"); ch.className = "chip"; ch.innerHTML = `<span class="e">${e}</span>`;
    ch.onclick = () => addDecor(e); ir.appendChild(ch);
  }
}
function renderDecorTray() {
  const R = roomInfo(roomKey).room, L = layout(roomKey), wr = $("walls-row"); wr.innerHTML = "";
  R.walls.forEach((w, i) => {
    const sw = document.createElement("div"); sw.className = "swatch" + (L.wall % R.walls.length === i ? " pick" : ""); sw.style.background = w;
    sw.onclick = () => { L.wall = i; render(); renderDecorTray(); save(); blip(500 + i * 60, .1); };
    wr.appendChild(sw);
  });
}
function roomFull(L) { if (L.props.length >= 70) { toast("This room is full! Drag something onto 🗑️ first"); return true; } return false; }
function addDecor(e) {
  const L = layout(roomKey); if (roomFull(L)) return;
  const info = DECOR_INFO[e] || {};
  const p = { id: newId("p"), e, x: rand(30, 70), y: info.art ? rand(80, 94) : rand(48, 64), s: 10, a: info.a, art: info.art, eat: !!info.eat, potion: !!info.potion };
  p.x0 = p.x; p.y0 = p.y; L.props.push(p);
  render(); fxAt(elById(p.id), ["✨", "⭐"], 6); blip(700, .1); save();
}
function addFurniture(k) {
  const L = layout(roomKey); if (roomFull(L)) return;
  const p = { id: newId("p"), k, x: rand(30, 70), y: k === "shelf" ? rand(40, 52) : rand(58, 66) };
  p.x0 = p.x; p.y0 = p.y; L.props.push(p);
  render(); fxAt(elById(p.id), ["✨", "⭐"], 6); blip(600, .1); save();
  toast(`${FURN_KINDS[k].name} added! Put things on top of it ✨`);
}

/* ---------- map ---------- */
function renderMap() {
  const m = $("map"); m.innerHTML = "";
  const here = roomInfo(roomKey);
  for (const pid of PLACE_ORDER) {
    const P = placeMeta(pid), rooms = roomsOf(pid), d = document.createElement("div");
    d.className = "loc" + (pid === here.pid ? " here" : ""); d.style.background = P.card;
    d.innerHTML = `<span class="e">${P.emoji}</span>${P.name}`;
    const chips = document.createElement("div"); chips.className = "roomchips";
    for (const r of rooms) {
      const c = document.createElement("span"); c.className = "roomchip"; c.textContent = `${r.emoji} ${r.name}`;
      c.onclick = ev => { ev.stopPropagation(); $("map-overlay").classList.remove("show"); goRoom(pid + ":" + r.id, 0); };
      chips.appendChild(c);
    }
    d.appendChild(chips);
    d.onclick = () => { $("map-overlay").classList.remove("show"); goRoom(pid + ":" + rooms[0].id, 0); };
    m.appendChild(d);
  }
}

/* ---------- character creator ---------- */
let draft = null, editing = null;
const SECTIONS = [["Skin", "skin", "color"], ["Hair", "hair", "chip"], ["Hair color", "hairC", "color"], ["Eyes", "eyes", "chip"], ["Mouth", "mouth", "chip"],
                  ["Outfit", "outfit", "chip"], ["Outfit color", "outC", "color"], ["Extras", "acc", "chip"], ["Wings", "wings", "chip"]];
function openCreator(c, title) {
  closeTrays(); selected = null;
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
  else { c = { ...draft, place: roomKey, x: rand(30, 70), y: rand(84, 96) }; friends.push(c); }
  $("creator-overlay").classList.remove("show");
  render(); renderFriendsTray();
  const el = elById(c.id); fxAt(el, ["✨", "💖", "⭐"], 12); bounce(el); say(c.id, "Ta-da! ✨");
  tune([523, 659, 784, 1047]); save();
};
$("c-delete").onclick = () => { if (editing) deleteFriend(editing); };
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
  if (open) { decorating = true; renderDecorTray(); $("decor-tray").classList.add("show"); $("btn-decorate").classList.add("on"); render(); }
};
$("friends-close").onclick = closeTrays;
$("decor-close").onclick = closeTrays;
$("btn-lock").onclick = e => {
  moveFurn = !moveFurn;
  e.currentTarget.textContent = moveFurn ? "🔓 Moving furniture" : "🔒 Furniture";
  e.currentTarget.classList.toggle("on", moveFurn);
  toast(moveFurn ? "🔓 Now you can move furniture! Tap again to lock it." : "🔒 Furniture is locked in place");
  blip(moveFurn ? 700 : 350, .15);
};
$("btn-map").onclick = () => { closeTrays(); renderMap(); $("map-overlay").classList.add("show"); blip(600, .1); };
$("map-close").onclick = () => $("map-overlay").classList.remove("show");
$("btn-sound").onclick = e => { soundOn = !soundOn; e.currentTarget.textContent = soundOn ? "🔊" : "🔇"; save(); };

/* ---------- timers: food comes back, magic wears off, snoring, chatting ---------- */
setInterval(() => {
  if (dragging) return;
  const now = Date.now(); let changed = false;
  for (const [key, L] of Object.entries(layouts))
    for (const p of L.props) if (p.gone && now - p.gone > 15000) { delete p.gone; if (key === roomKey) changed = true; }
  for (const f of Object.values(fxState))
    for (const k in f) if (f[k] && f[k] <= now) { f[k] = 0; changed = true; }
  if (changed) { render(); save(); }
}, 1000);
setInterval(() => {
  if (dragging || document.querySelector(".overlay.show")) return;
  for (const c of friendsHere()) {
    if (!c.pose) continue;
    const el = elById(c.id);
    if (c.pose.type === "sleep") fxAt(el, ["💤"], 1);
    else if (c.pose.type === "bath") fxAt(el, ["🫧"], 1);
  }
}, 2600);
setInterval(() => {
  if (dragging || dim || document.querySelector(".overlay.show")) return;
  const awake = friendsHere().filter(c => !c.pose || c.pose.type !== "sleep");
  if (awake.length && Math.random() < .5) say(pick(awake).id, pick(LINES));
}, 8000);
window.addEventListener("resize", () => { if (!dragging) render(); });

/* ---------- start ---------- */
const fresh = !load();
if (fresh) {
  const a = randomAvatar("Luna"); Object.assign(a, { place: "home:living", x: 64, y: 92 });
  const b = randomAvatar("Milo"); Object.assign(b, { place: "home:living", x: 24, y: 95 });
  friends = [a, b]; save();
}
$("btn-sound").textContent = soundOn ? "🔊" : "🔇";
buildDecorItems(); render();
if (fresh) setTimeout(() => openCreator(null, "Make YOU! ✨"), 400);
