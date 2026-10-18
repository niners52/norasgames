"use strict";
/* =====================================================================
   WHO'S PLAYING?
   Everything this site saves — trophies, your pet, monsters, the
   aquarium, Magic Town, secret rooms — is kept per person, so Nora,
   her sister and Belle can all use the same iPad without wrecking
   each other's stuff.

   It works by quietly putting the person's name in front of every
   saved thing. Nothing else on the site had to change.
   Load this BEFORE any other script on the page.
   ===================================================================== */
(function profiles() {
  const LIST = "noraProfiles", ACTIVE = "noraProfile";
  const real = window.localStorage;
  if (!real) return;

  let list = [], active = "";
  try { list = JSON.parse(real.getItem(LIST) || "[]"); active = real.getItem(ACTIVE) || ""; } catch (e) {}

  /* first time: make a profile and move everything already saved into it */
  if (!list.length) {
    let name = "Player 1";
    try {
      const h = JSON.parse(real.getItem("stHellfire") || "null");
      if (h && h.name) name = h.name.slice(0, 14);
    } catch (e) {}
    const id = "u1";
    list = [{ id, name }];
    active = id;
    const keys = [];
    for (let i = 0; i < real.length; i++) {
      const k = real.key(i);
      if (k && k !== LIST && k !== ACTIVE && k.indexOf("::") === -1) keys.push(k);
    }
    keys.forEach(k => { try { real.setItem(id + "::" + k, real.getItem(k)); } catch (e) {} });
    try { real.setItem(LIST, JSON.stringify(list)); real.setItem(ACTIVE, id); } catch (e) {}
  }
  if (!list.some(p => p.id === active)) { active = list[0].id; try { real.setItem(ACTIVE, active); } catch (e) {} }

  const GLOBAL = { [LIST]: 1, [ACTIVE]: 1 };
  const px = k => (GLOBAL[k] ? k : active + "::" + k);
  const mine = k => k && k.indexOf(active + "::") === 0;

  const shim = {
    getItem: k => real.getItem(px(String(k))),
    setItem: (k, v) => real.setItem(px(String(k)), String(v)),
    removeItem: k => real.removeItem(px(String(k))),
    clear: () => {
      const doomed = [];
      for (let i = 0; i < real.length; i++) { const k = real.key(i); if (mine(k)) doomed.push(k); }
      doomed.forEach(k => real.removeItem(k));
    },
    key: i => {
      const ks = [];
      for (let n = 0; n < real.length; n++) { const k = real.key(n); if (mine(k)) ks.push(k.slice(active.length + 2)); }
      return ks[i] === undefined ? null : ks[i];
    },
    get length() {
      let n = 0;
      for (let i = 0; i < real.length; i++) if (mine(real.key(i))) n++;
      return n;
    },
  };

  /* a Proxy so localStorage.someKey works as well as getItem("someKey") */
  const proxy = new Proxy(shim, {
    get(t, prop) {
      if (prop in t) { const v = t[prop]; return typeof v === "function" ? v.bind(t) : v; }
      if (typeof prop === "string") return real.getItem(px(prop));
      return undefined;
    },
    set(t, prop, value) {
      if (prop in t) return true;
      real.setItem(px(String(prop)), String(value));
      return true;
    },
    has: (t, prop) => prop in t || real.getItem(px(String(prop))) !== null,
    deleteProperty(t, prop) { real.removeItem(px(String(prop))); return true; },
  });

  try {
    Object.defineProperty(window, "localStorage", { configurable: true, get: () => proxy });
  } catch (e) { return; }   /* if the browser won't allow it, the site just works as before */

  /* tools for the Who's Playing page */
  window.noraProfiles = {
    list: () => { try { return JSON.parse(real.getItem(LIST) || "[]"); } catch (e) { return []; } },
    active: () => active,
    name: () => (list.find(p => p.id === active) || {}).name || "Player 1",
    add(name) {
      const l = this.list();
      const id = "u" + (Date.now().toString(36));
      l.push({ id, name: String(name).slice(0, 14) || "Player" });
      real.setItem(LIST, JSON.stringify(l));
      return id;
    },
    rename(id, name) {
      const l = this.list();
      const p = l.find(x => x.id === id);
      if (p) { p.name = String(name).slice(0, 14) || p.name; real.setItem(LIST, JSON.stringify(l)); }
    },
    remove(id) {
      let l = this.list().filter(p => p.id !== id);
      if (!l.length) return false;
      const doomed = [];
      for (let i = 0; i < real.length; i++) { const k = real.key(i); if (k && k.indexOf(id + "::") === 0) doomed.push(k); }
      doomed.forEach(k => real.removeItem(k));
      real.setItem(LIST, JSON.stringify(l));
      if (active === id) real.setItem(ACTIVE, l[0].id);
      return true;
    },
    use(id) { real.setItem(ACTIVE, id); },
  };
})();
