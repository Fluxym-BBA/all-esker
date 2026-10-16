/* fx-fluxym.js : « Fluxym ». Approche · Services (roue) · Convictions · Notre place. Un écran par onglet. */
(function () {
  "use strict";
  const E = FX.E, num = n => String(n).padStart(2, "0");
  const TABS = [{k: "approche", l: "Notre approche", i: "layers"}, {k: "services", l: "Nos services", i: "spark"}, {k: "valeurs", l: "Nos convictions", i: "check"}, {k: "place", l: "Notre place", i: "user"}];
  const PH = {eval: ["Évaluer", "var(--cy)"], dep: ["Déployer", "var(--vi)"], sec: ["Sécuriser", "#2fb872"]};

  function approche() {
    return `<div class="fx-apr">
      <ul class="fx-mk">${O2C.market_stats.map(s => `<li><span class="fx-sn">${s.p ? `<small>${E(s.p.trim())}</small>` : ""}<b data-count="${s.n}">0</b><em>${E(s.s)}</em></span><span class="fx-sl">${E(s.l)}</span></li>`).join("")}</ul>
      <div class="fx-pr">${O2C.principles.map((p, i) => `<article class="fx-pc2" style="--i:${i}"><i>${num(i + 1)}</i><h3>${E(p.t)}</h3><p>${E(p.d)}</p></article>`).join("")}</div>
      <p class="fx-read">${E(O2C.reading)}</p>
    </div>`;
  }
  function services() {
    return `<div class="fx-enj fx-svc">
      <div class="fx-enj-w">${xpWheelHTML("svcw", O2C.services, "Services Fluxym")}
        <div class="fx-ctl"><button type="button" data-prev="svcw" aria-label="Précédent">${FX.ic("back", 2.4)}</button>
          <button type="button" class="fx-ctl-p" data-play="svcw" aria-pressed="false">${FX.ic("play", 2)}<span>Parcours guidé</span></button>
          <button type="button" data-next="svcw" aria-label="Suivant">${FX.ic("next", 2.4)}</button></div>
        <ul class="fx-phs">${Object.keys(PH).map(k => `<li style="--c:${PH[k][1]}"><i></i>${PH[k][0]}</li>`).join("")}</ul></div>
      <aside class="xp-card fx-card" data-card="svcw" aria-live="polite"></aside></div>`;
  }
  function svcCard(s, i, n, col) {
    const ph = PH[s.ph] || PH.eval;
    return `<div class="fx-sc"><div class="fx-sc-h"><span class="fx-nb" style="--c:${col}">${num(i + 1)}</span><div><small style="color:${ph[1]}">${ph[0]} · ${E(s.lab)}</small><h3>${E(s.head)}</h3></div></div>
      <p class="fx-sc-n">${E(s.v)}</p>
      <div class="fx-sc-l">Le problème</div><p class="fx-sc-w">${E(s.w)}</p>
      <div class="fx-sc-l">Ce que vous obtenez</div><ul class="fx-sc-u">${s.l.map(x => `<li>${E(x)}</li>`).join("")}</ul></div>`;
  }
  function valeurs() {
    return `<div class="fx-val"><div class="fx-vc" role="tablist" aria-label="Convictions">${O2C.convictions.map((v, i) => `<button type="button" role="tab" class="fx-vb2${i ? "" : " on"}" data-v="${i}" aria-selected="${i === 0}" style="--i:${i}"><span><i>${num(i + 1)}</i></span><b>${E(v.t)}</b></button>`).join("")}</div>
      <div class="fx-vd" id="fxVd" aria-live="polite"></div></div>`;
  }
  function place() {
    return `<div class="fx-pl2"><div class="fx-act" role="tablist" aria-label="Typologie d'acteurs">${O2C.actors.map((a, i) => `<button type="button" role="tab" class="fx-ab${i ? "" : " on"}" data-a="${i}" aria-selected="${i === 0}"><i>${i + 1}</i><span>${E(a.t)}</span></button>`).join("")}</div>
      <div class="fx-ad" id="fxAd" aria-live="polite"></div>
      <div class="fx-plc"><span class="fx-plc-k">Notre place</span><p>${E(O2C.place)}</p><small>${E(O2C.nota)}</small></div></div>`;
  }

  FX.views.fluxym = {
    render(r) {
      let tab = r.tab; if (!TABS.some(t => t.k === tab)) tab = "approche";
      r.tab = tab;
      return {
        title: "Fluxym",
        html: FX.bg() + `<div class="fx-page">
        <div class="fx-vh">${FX.crumb([["Accueil", "#/"], ["Fluxym"]])}
          <div class="fx-vt">${FX.kicker("Intégrateur et revendeur Esker")}<h1 data-focus>Une méthode, <em>des convictions</em></h1>
          <p>Cadrer, déployer, sécuriser : le processus d'abord, l'outil ensuite.</p></div></div>
        ${FX.tabs(TABS, tab, "Fluxym")}
        <div class="fx-vb fx-tabbody" id="fxBody"></div></div>`
      };
    },
    mount(el, r) {
      const body = el.querySelector("#fxBody");
      let cl = [];
      FX.onLeave(() => cl.splice(0).forEach(f => f()));
      const pick = (sel, attr, html, key) => body.addEventListener("click", e => { const b = e.target.closest(sel); if (b) html(+b.getAttribute(attr)); });
      const show = (k, silent) => {
        cl.splice(0).forEach(f => f());
        r.tab = k; FX.setTab(el, k); body.className = "fx-vb fx-tabbody t-" + k;
        if (k === "approche") { body.innerHTML = approche(); FX.runCounts(body); }
        else if (k === "services") { body.innerHTML = services(); const c = xpWheelMount(body, "svcw", {steps: O2C.services, card: svcCard}); if (c) cl.push(() => c.stop()); }
        else if (k === "valeurs") {
          body.innerHTML = valeurs();
          const set = i => { const v = O2C.convictions[i]; Array.prototype.forEach.call(body.querySelectorAll(".fx-vb2"), b => { const on = +b.getAttribute("data-v") === i; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
            body.querySelector("#fxVd").innerHTML = `<div class="xin"><span class="fx-hn">${num(i + 1)}</span><h3>${E(v.t)}</h3><p>${E(v.d)}</p></div>`; };
          body.querySelector(".fx-vc").addEventListener("click", e => { const b = e.target.closest(".fx-vb2"); if (b) set(+b.getAttribute("data-v")); });
          set(0);
        } else {
          body.innerHTML = place();
          const set = i => { const a = O2C.actors[i]; Array.prototype.forEach.call(body.querySelectorAll(".fx-ab"), b => { const on = +b.getAttribute("data-a") === i; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
            body.querySelector("#fxAd").innerHTML = `<div class="xin"><h3>${E(a.t)}</h3><div class="fx-ad2"><div class="ok"><small>Ce qu'ils apportent</small><p>${E(a.a)}</p></div><div class="ko"><small>Leur limite</small><p>${E(a.d)}</p></div></div></div>`; };
          body.querySelector(".fx-act").addEventListener("click", e => { const b = e.target.closest(".fx-ab"); if (b) set(+b.getAttribute("data-a")); });
          set(0);
        }
        body.scrollTop = 0;
        if (silent) FX.silent("#/fluxym/" + k);
      };
      el.querySelector(".fx-tabs").addEventListener("click", e => { const b = e.target.closest(".fx-tab"); if (b) show(b.getAttribute("data-tab"), true); });
      show(r.tab, false);
    }
  };
})();
