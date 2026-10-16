/* fx-module.js : une fiche module = un écran à onglets.
   Aperçu · Comment ça marche · Fonctionnalités · Vidéo · Irritants · Profils · Cas d'usage · Dans la suite · Démo.
   Les messages viennent des fiches Esker (fiches.js) ; la roue, les irritants et les profils viennent du deck et d'E-Procurement. */
(function () {
  "use strict";
  const E = FX.E;
  const num = n => String(n).padStart(2, "0");

  /* contenu d'accroche : fiche Esker si elle existe, sinon repli sur le pitch du deck */
  function fiche(c) {
    const F = window.FICHES && FICHES[c.id];
    if (F) return F;
    const P = c.P;
    return {
      src: "Deck Esker × Fluxym", hook: c.role || c.name, intro: c.desc,
      why: P ? P.solo.map((s, i) => ({t: s.k, d: s.d, ic: ["spark", "layers", "check"][i % 3]})) : [], how: null, stats: null
    };
  }
  function stats(c, F) {
    if (F.stats && F.stats.length) return F.stats;
    if (c.kpis) return c.kpis.map(k => ({n: k.n, p: k.s || "", pre: (k.p || "").trim(), l: k.l}));
    return [];
  }

  function tabsFor(c) {
    const F = fiche(c), t = [{k: "apercu", l: "Aperçu", i: "spark"}];
    if (F.how && !c.pains) t.push({k: "how", l: "Comment ça marche", i: "sync"});
    if (c.hasWheel) t.push({k: "fonct", l: "Fonctionnalités", i: "layers"});
    if (c.videos.length) t.push({k: "video", l: "Vidéo", i: "play"});
    if (c.pains) t.push({k: "irritants", l: "Irritants effacés", i: "shield"});
    if (c.personas) t.push({k: "profils", l: "Profils", i: "user"});
    if (c.adv) t.push({k: "usage", l: "Cas d'usage", i: "check"});
    t.push({k: "suite", l: "Dans la suite", i: "layers"});
    if (c.demo) t.push({k: "demo", l: "Démo", i: "play"});
    return t;
  }

  /* ---------- Aperçu ---------- */
  function apercu(c, tabs) {
    const F = fiche(c), st = stats(c, F), has = k => tabs.some(t => t.k === k);
    return `<div class="fx-ap" style="--c:${c.color}">
      <div class="fx-ap-l">
        <div class="fx-badge" aria-hidden="true"><i class="r1"></i><i class="r2"></i><span>${c.icon}</span></div>
        <div class="fx-ap-t">
          <h2 class="fx-hook">${E(F.hook)}</h2>
          <p class="fx-intro">${E(F.intro)}</p>
          <div class="fx-ap-cta">
            ${has("video") ? `<button type="button" class="fx-btn pri" data-tab-go="video">${FX.ic("play", 2)}Voir la vidéo</button>` : ""}
            ${has("how") ? `<button type="button" class="fx-btn${has("video") ? "" : " pri"}" data-tab-go="how">Comment ça marche${FX.arrow}</button>` : ""}
            ${has("fonct") && !has("how") ? `<button type="button" class="fx-btn${has("video") ? "" : " pri"}" data-tab-go="fonct">Les fonctionnalités${FX.arrow}</button>` : ""}
            ${has("demo") ? `<button type="button" class="fx-btn" data-tab-go="demo">Démo interactive${FX.arrow}</button>` : ""}
          </div>
          ${st.length ? `<ul class="fx-stats">${st.map(s => `<li><span class="fx-sn">${s.pre ? `<small>${E(s.pre)}</small>` : ""}<b data-count="${E(s.n)}">0</b><em>${E(s.p)}</em></span><span class="fx-sl">${E(s.l)}</span></li>`).join("")}</ul>` : ""}
        </div>
      </div>
      <div class="fx-why">${F.why.map((w, i) => `<article class="fx-wc" style="--i:${i}"><span class="fx-wic">${FX.ic(w.ic || "check", 1.9)}</span><h3>${E(w.t)}</h3><p>${E(w.d)}</p></article>`).join("")}</div>
      <p class="fx-src">Source : ${E(F.src)}</p>
    </div>`;
  }

  /* ---------- Comment ça marche : étapes animées ---------- */
  function how(c) {
    const F = fiche(c), n = F.how.length;
    return `<div class="fx-how" style="--n:${n};--c:${c.color}">
      <ol class="fx-hs">${F.how.map((s, i) => `<li><button type="button" class="fx-hb${i ? "" : " on"}" data-i="${i}" aria-label="Étape ${i + 1} : ${E(s.t)}"><i>${i + 1}</i><span>${E(s.t)}</span></button></li>`).join("")}<li class="fx-hl" aria-hidden="true"><b></b></li></ol>
      <div class="fx-hd" id="fxHd" aria-live="polite"></div>
      <div class="fx-hc"><button type="button" data-hprev aria-label="Étape précédente">${FX.ic("back", 2.4)}</button>
        <button type="button" class="fx-ctl-p" data-hplay aria-pressed="false">${FX.ic("play", 2)}<span>Lecture</span></button>
        <button type="button" data-hnext aria-label="Étape suivante">${FX.ic("next", 2.4)}</button></div>
      ${F.gauges ? `<div class="fx-gau" aria-label="Quatre thèmes évalués, notés de 0 à 100">${F.gauges.map((g, i) => `<div class="fx-g" style="--i:${i}"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="32"/><circle class="a" cx="40" cy="40" r="32"/></svg><span>${E(g.l)}</span></div>`).join("")}<small>Notation de 0 à 100 sur 4 thèmes. Illustration du principe.</small></div>` : ""}
    </div>`;
  }
  function mountHow(el, c, reg) {
    const F = fiche(c), n = F.how.length;
    const hd = el.querySelector("#fxHd"), line = el.querySelector(".fx-hl b"), btns = el.querySelectorAll(".fx-hb");
    let cur = 0, timer = null;
    const playBtn = el.querySelector("[data-hplay]");
    const set = (i, user) => {
      cur = (i + n) % n;
      Array.prototype.forEach.call(btns, (b, k) => { b.classList.toggle("on", k === cur); b.classList.toggle("done", k < cur); });
      if (line) line.style.width = (n > 1 ? cur / (n - 1) * 100 : 100) + "%";
      const s = F.how[cur];
      hd.innerHTML = `<div class="fx-hd-i xin"><span class="fx-hn">${num(cur + 1)}</span><div><h3>${E(s.t)}</h3><p>${E(s.d)}</p></div></div>`;
      if (user) stop();
    };
    const stop = () => { clearInterval(timer); timer = null; playBtn.setAttribute("aria-pressed", "false"); playBtn.querySelector("span").textContent = "Lecture"; };
    const play = () => {
      if (timer) { stop(); return; }
      playBtn.setAttribute("aria-pressed", "true"); playBtn.querySelector("span").textContent = "Pause";
      if (cur >= n - 1) set(0);
      timer = setInterval(() => { if (cur >= n - 1) { stop(); return; } set(cur + 1); }, 3600);
    };
    el.addEventListener("click", e => {
      const b = e.target.closest(".fx-hb"); if (b) { set(+b.getAttribute("data-i"), true); return; }
      if (e.target.closest("[data-hprev]")) set(cur - 1, true);
      if (e.target.closest("[data-hnext]")) set(cur + 1, true);
      if (e.target.closest("[data-hplay]")) play();
    });
    set(0);
    if (!FX.reduce()) setTimeout(() => { if (document.body.contains(el) && !timer && cur === 0) play(); }, 900);
    reg(stop);
  }

  FX.moduleParts = {fiche, stats, tabsFor, apercu, how, mountHow, num};
})();
