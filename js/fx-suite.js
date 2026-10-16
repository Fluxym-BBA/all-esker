/* fx-suite.js : une suite = un écran à onglets.
   Synergies : un seul schéma circulaire, des filtres, le détail dans un panneau latéral. */
(function () {
  "use strict";
  const E = FX.E;
  const TABS = sk => [{k: "syn", l: "Synergies", i: "sync"}, {k: "duo", l: "Seul ou en suite", i: "layers"}, {k: "ia", l: "IA", i: "spark"}]
    .concat(sk === "S2P" ? [{k: "budget", l: "Chaîne budgétaire", i: "euro"}] : []);
  const shortN = (sk, id) => (SUITES[sk].short_name || {})[id] || FX.mod(id).label;

  /* ---------------------- synergies : espace d'origine (console, schéma, studio, exploration), voir fx-syn.js ---------------------- */
  function synTab(sk) { return FX.syn.html(SUITES[sk]); }
  function mountSyn(el, sk) { FX.syn.mount(el, sk); }

  /* ---------------------- seul ou en suite ---------------------- */
  function duoTab(sk, id) {
    const S = SUITES[sk], P = S.pitch[id], m = FX.mod(id);
    return `<div class="fx-duo-sel" role="group" aria-label="Choisir un module">${FX.order(sk).map(i => {
      const mm = FX.mod(i);
      return `<button type="button" class="fx-mc pick${i === id ? " on" : ""}" data-pick="${i}" style="--c:${mm.c}">${mm.icon} <span>${E(shortN(sk, i))}</span></button>`; }).join("")}</div>
      <div class="fx-duo">
        <section class="fx-duo-c solo"><h3><span>Déployé seul</span><small>${E(P.full)}</small></h3>
          <ul>${P.solo.map(x => `<li><b>${E(x.k)}</b><span>${E(x.d)}</span></li>`).join("")}</ul>
          <p class="fx-limit">${E(P.limit)}</p></section>
        <div class="fx-duo-plus" aria-hidden="true">+</div>
        <section class="fx-duo-c suite" style="--c:${m.c}"><h3><span>Dans la suite</span><small>${E(S.name)}</small></h3>
          <ul>${P.syn.map(x => `<li><b>${E(x.k)}</b><span>${E(x.d)}</span></li>`).join("")}</ul>
          <p class="fx-upsell">${E(P.upsell)}</p></section>
      </div>`;
  }

  /* ---------------------- IA ---------------------- */
  function iaTab(sk) {
    const S = SUITES[sk], ids = FX.order(sk), n = ids.length;
    const nodes = ids.map((id, i) => {
      const a = (-90 + 360 / n * i) * Math.PI / 180, m = FX.mod(id);
      return `<a class="fx-ai-n" href="#/m/${id}" style="left:${(50 + 41 * Math.cos(a)).toFixed(2)}%;top:${(50 + 41 * Math.sin(a)).toFixed(2)}%;--c:${m.c}" title="${E(m.label)}"><span>${m.icon}</span></a>`; }).join("");
    return `<div class="fx-ai">
      <div class="fx-ai-orb" aria-hidden="false"><i class="r1"></i><i class="r2"></i><div class="fx-ai-core">${FX.ic("spark", 1.8)}<b>Synergy IA</b></div>${nodes}</div>
      <div class="fx-ai-t"><h3>${E(S.ai.t)}</h3><p>${E(S.ai.p)}</p>
        <ul>${S.ai.d.map(x => `<li>${E(x)}</li>`).join("")}</ul></div>
    </div>`;
  }

  /* ---------------------- chaîne budgétaire (S2P) ---------------------- */
  function budgetTab() {
    return `<div class="fx-bud">
      <ol class="fx-bud-r" role="tablist" aria-label="Étapes">${FIN_STEPS.map((s, i) =>
        `<li><button type="button" class="fx-bs${i === 0 ? " on" : ""}" data-s="${i}" role="tab"><i>${i + 1}</i><span>${E(s.t)}</span><small>${s.scope === "erp" ? "ERP ou banque" : "Esker"}</small></button></li>`).join("")}</ol>
      <div class="fx-bud-b"><div class="fx-bud-bar" aria-hidden="true"><i class="pre"></i><i class="eng"></i><i class="con"></i></div>
        <ul class="fx-bud-k"><li class="pre"><i></i><span>Pré-engagé</span><b id="bkPre">0</b></li><li class="eng"><i></i><span>Engagé</span><b id="bkEng">0</b></li><li class="con"><i></i><span>Consommé</span><b id="bkCon">0</b></li><li class="fre"><i></i><span>Disponible</span><b id="bkFre">0</b></li></ul>
        <div class="fx-bud-x"><span>Facture non parvenue <b id="bkFnp">0</b></span><span>Payé <b id="bkPay">0</b></span></div>
        <p class="fx-bud-d" id="bkD" aria-live="polite"></p></div>
    </div>`;
  }
  function mountBudget(el) {
    const set = i => {
      const s = FIN_STEPS[i], b = s.b, free = Math.max(0, 100 - b.pre - b.eng - b.con);
      Array.prototype.forEach.call(el.querySelectorAll(".fx-bs"), x => x.classList.toggle("on", +x.getAttribute("data-s") === i));
      const bar = el.querySelector(".fx-bud-bar");
      bar.querySelector(".pre").style.width = b.pre + "%"; bar.querySelector(".eng").style.width = b.eng + "%"; bar.querySelector(".con").style.width = b.con + "%";
      const f = v => FX.fr(v, v % 1 ? 1 : 0) + " k€";
      el.querySelector("#bkPre").textContent = f(b.pre); el.querySelector("#bkEng").textContent = f(b.eng); el.querySelector("#bkCon").textContent = f(b.con); el.querySelector("#bkFre").textContent = f(free);
      el.querySelector("#bkFnp").textContent = f(s.fnp); el.querySelector("#bkPay").textContent = f(s.paid);
      el.querySelector("#bkD").innerHTML = `<b>${E(s.s)}</b> ${E(s.d)}`;
    };
    el.addEventListener("click", e => { const b = e.target.closest(".fx-bs"); if (b) set(+b.getAttribute("data-s")); });
    set(0);
  }

  /* ---------------------- vue ---------------------- */
  FX.views.suite = {
    render(r) {
      const sk = r.key, S = SUITES[sk], tabs = TABS(sk);
      let tab = r.tab; if (!tabs.some(t => t.k === tab)) tab = "syn";
      r.tab = tab;
      const idx = FX.order(sk);
      return {
        title: S.name,
        html: FX.bg() + `<div class="fx-page">
        <div class="fx-vh">${FX.crumb([["Accueil", "#/"], ["La solution", "#/solution"], [FX.suiteName(sk)]])}
          <div class="fx-vt">${FX.kicker(S.short || FX.suiteName(sk))}<h1 data-focus>${S.title}</h1><p>${E(String(S.lead).split(/(?<=\.)\s/)[0])}</p></div>
          <div class="fx-mods" aria-label="Modules de la suite">${idx.map(id => `<a class="fx-mc" href="#/m/${id}" style="--c:${FX.mod(id).c}" title="${E(FX.mod(id).label)}">${FX.mod(id).icon}<span>${E(shortN(sk, id))}</span></a>`).join("")}</div></div>
        ${FX.tabs(tabs, tab, "Vues de la suite")}
        <div class="fx-vb fx-tabbody" id="fxBody"></div></div>`
      };
    },
    mount(el, r) {
      const sk = r.key, body = el.querySelector("#fxBody");
      let duoId = ORDER_S2P.concat(ORDER_O2C).filter(i => FX.suiteKey(i) === sk)[0];
      const show = (k, silent) => {
        r.tab = k; FX.setTab(el, k);
        body.className = "fx-vb fx-tabbody t-" + k;
        if (k === "syn") { body.innerHTML = synTab(sk); mountSyn(body, sk); }
        else if (k === "duo") { body.innerHTML = duoTab(sk, duoId); }
        else if (k === "ia") { body.innerHTML = iaTab(sk); }
        else { body.innerHTML = budgetTab(); mountBudget(body); }
        if (silent) FX.silent("#/suite/" + FX.slug(sk) + "/" + k);
      };
      el.querySelector(".fx-tabs").addEventListener("click", e => { const b = e.target.closest(".fx-tab"); if (b) show(b.getAttribute("data-tab"), true); });
      body.addEventListener("click", e => { const p = e.target.closest("[data-pick]"); if (p) { duoId = p.getAttribute("data-pick"); body.innerHTML = duoTab(sk, duoId); } });
      show(r.tab, false);
    }
  };
})();
