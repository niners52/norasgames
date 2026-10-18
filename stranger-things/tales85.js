"use strict";
/* =====================================================================
   THE TALES FROM '85 SWITCH
   One button, on every Hawkins page. It turns the whole site into the
   cartoon version: winter 1985, bright colours, snow instead of spores,
   and the monsters drawn the friendly way.
   Press it again and you're back in the scary one.
   ===================================================================== */
(function tales85() {
  const KEY = "stMode";
  const on = () => { try { return localStorage.getItem(KEY) === "85"; } catch (e) { return false; } };

  /* the stylesheet lives next to this script */
  const here = (function () {
    const sc = document.currentScript || [].slice.call(document.scripts).filter(x => /tales85\.js/.test(x.src))[0];
    return sc ? sc.src.replace(/[^/]*$/, "") : "";
  })();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = here + "tales85.css";
  document.head.appendChild(link);

  function apply() {
    document.documentElement.classList.toggle("t85", on());
    document.body.classList.toggle("t85", on());
  }
  function snow() {
    if (!on()) return;
    const box = document.getElementById("spores");
    if (!box) return;
    box.innerHTML = Array.from({ length: 26 }, (_, i) => {
      const left = Math.random() * 100, size = 8 + Math.random() * 14;
      const dur = 9 + Math.random() * 12, delay = -Math.random() * 20;
      return `<span class="flake" style="left:${left}vw;font-size:${size}px;
        animation-duration:${dur}s;animation-delay:${delay}s">${["❄", "❅", "❆"][i % 3]}</span>`;
    }).join("");
  }
  function button() {
    const bar = document.querySelector("header.bar");
    if (!bar || document.getElementById("t85btn")) return;
    const b = document.createElement("button");
    b.id = "t85btn";
    b.type = "button";
    b.textContent = on() ? "🔦 Stranger Things" : "📺 Tales from '85";
    b.title = on() ? "Switch back to the real Stranger Things look" : "Switch the whole site to the cartoon one";
    b.addEventListener("click", () => {
      try { localStorage.setItem(KEY, on() ? "real" : "85"); } catch (e) {}
      document.documentElement.style.transition = "filter .45s";
      document.documentElement.style.filter = "brightness(1.9) saturate(1.5)";
      setTimeout(() => location.reload(), 420);
    });
    bar.appendChild(b);
  }
  function retitle() {
    if (!on()) return;
    const t = document.querySelector("h1.title");
    if (t && /stranger\s*things/i.test(t.textContent)) {
      t.innerHTML = "Tales<br>from '85";
      const sub = t.parentElement.querySelector(".sub");
      if (sub) sub.textContent = "The cartoon one. Winter 1985, and the frozen things are waking up. ❄️";
      const blurb = document.querySelector(".blurb");
      if (blurb) blurb.innerHTML = "The animated Stranger Things, where nothing is too scary. Same kids, same town, " +
        "same monsters — just drawn the friendly way. Everything on this site changes with it.";
    }
    const kick = document.querySelector(".kicker");
    if (kick) kick.textContent = "Hawkins, Indiana · Winter 1985";
  }
  function aboutCard() {
    if (!on()) return;
    const grid = document.querySelector("main .grid");
    if (!grid || document.getElementById("t85about")) return;
    const d = document.createElement("article");
    d.className = "card";
    d.id = "t85about";
    d.innerHTML = `<span class="emoji">📺</span><h3>What is Tales from '85?</h3>
      <p>The animated Stranger Things. All 10 episodes came out on 23 April 2026, and it's set in the winter of
      1985 — after the gate is closed, but before the summer at Starcourt. Frozen creatures from the Upside Down
      start waking back up.</p>
      <p>The kids are all in it, drawn as cartoons, plus new people: <b>Nikki Baxter</b> and her mum Anna,
      Daniel Fischer, Jeff, and a character called <b>Cosmo</b>.</p>
      <span class="tag">10 episodes</span>`;
    grid.insertBefore(d, grid.firstChild);
  }

  /* the monster book keeps the real facts, it just stops looking scary */
  function bookNote() {
    if (!on()) return;
    if (!/monsters\.html/.test(location.pathname)) return;
    if (document.getElementById("t85note")) return;
    const main = document.querySelector("main .sub") || document.querySelector("main");
    const p = document.createElement("p");
    p.id = "t85note";
    p.style.cssText = "max-width:620px;margin:10px auto 0;text-align:center;font-weight:700;color:#2a1b3d;" +
      "background:#fff;border:3px solid #2a1b3d;border-radius:18px;padding:10px 14px;box-shadow:0 5px 0 rgba(42,27,61,.2)";
    p.textContent = "❄️ Cartoon mode: these are the friendly drawings. The facts underneath are still the real ones.";
    main.insertAdjacentElement("afterend", p);
  }

  apply();
  function go() { apply(); button(); snow(); retitle(); aboutCard(); bookNote(); }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", go); else go();
})();
