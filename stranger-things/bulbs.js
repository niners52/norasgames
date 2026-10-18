"use strict";
/* =====================================================================
   BULBS — the money of Hawkins.
   You don't collect them one at a time; the site works out how many
   you've earned from everything you've ever done, so the games you
   already played count. Spending is tracked separately.
   ===================================================================== */
const BULBS = (function () {
  const num = k => { try { return +(localStorage.getItem(k) || 0); } catch (e) { return 0; } };
  const js = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } };

  /* what each thing is worth */
  function earnings() {
    const rows = [
      ["🧇 Eggo Catch", Math.floor(num("stEggoBest") / 4)],
      ["💡 Light Code", num("stLightsBest") * 3],
      ["🕰️ Escape Vecna", Math.floor(num("stVecnaBest") / 80)],
      ["🚲 Demogorgon Chase", Math.floor(num("stChaseBest") / 60)],
      ["🔦 Upside Down Maze", Math.max(0, num("stMazeBest") - 1) * 6],
      ["🔐 Russian Code", num("stCodeBest") * 7],
      ["🔮 Trivia", num("stTriviaBest") * 2],
      ["👑 Hard quiz", Math.floor(num("stHardBest") / 8)],
      ["💬 Who Said It?", num("stQuotesBest") * 2],
      ["🤥 Two Truths", num("stTruthsBest") * 3],
      ["🧬 Monsters you built", js("stMonsters", "[]").length * 5],
      ["🐉 Campaign endings", js("stCampaign", "[]").length * 8],
      ["📺 Episodes ticked", Object.keys(js("stSeen", "{}")).length],
      ["✖️ Times tables streak", num("stTablesBest") * 2],
      ["🔤 Spelling words learned", Object.values(js("stSpellScore", "{}")).filter(v => v >= 2).length * 3],
      ["🤘 Hellfire card", localStorage.getItem("stHellfire") ? 10 : 0],
      ["🥚 Looking after your pet", (js("noraPet", "null") || {}).feeds ? (js("noraPet", "null").feeds * 2) : 0],
      ["🗂️ The sealed file", localStorage.getItem("stFile") === "1" ? 25 : 0],
      ["☎️ The scratched-out number", localStorage.getItem("stPhone") === "1" ? 20 : 0],
      ["🕯️ Survived the night", localStorage.getItem("stNight") === "1" ? 30 : 0],
      ["🌈 Room 11", localStorage.getItem("noraRoom") === "1" ? 20 : 0],
      ["🕯️ The Last Room", localStorage.getItem("noraVault") === "1" ? 25 : 0],
      ["📷 The darkroom", localStorage.getItem("noraDarkroomAll") === "1" ? 25 : 0],
      ["👁️ You caught it", localStorage.getItem("noraShadow") === "1" ? 40 : 0],
    ];
    return rows.filter(r => r[1] > 0);
  }
  const total = () => earnings().reduce((a, r) => a + r[1], 0);
  const spent = () => num("stBulbsSpent");
  const left = () => Math.max(0, total() - spent());

  function spend(n) {
    if (left() < n) return false;
    try { localStorage.setItem("stBulbsSpent", String(spent() + n)); } catch (e) {}
    return true;
  }
  const owned = () => js("stShop", '{"items":[],"equipped":{}}');
  const save = o => { try { localStorage.setItem("stShop", JSON.stringify(o)); } catch (e) {} };
  const has = id => owned().items.indexOf(id) >= 0;
  function give(id) {
    const o = owned();
    if (o.items.indexOf(id) < 0) o.items.push(id);
    save(o);
  }
  function equip(slot, id) {
    const o = owned();
    o.equipped[slot] = id;
    save(o);
  }
  const equipped = slot => (owned().equipped || {})[slot] || "";

  return { earnings, total, spent, left, spend, has, give, equip, equipped, owned };
})();
