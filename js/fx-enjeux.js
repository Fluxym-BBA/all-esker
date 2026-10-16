/* fx-enjeux.js : « Mon enjeu métier ». Parcours en 3 clics :
   1) mon monde (achats ou clients) 2) l'étape qui me préoccupe (roue) 3) le module qui y répond. */
(function () {
  "use strict";
  const E = FX.E;

  const worlds = [
    {k: "S2P", ic: "cart", t: "Achats et dépenses", q: "Je veux maîtriser ce que je dépense", c: "var(--cy)"},
    {k: "O2C", ic: "euro", t: "Clients et encaissements", q: "Je veux encaisser plus vite et plus sûrement", c: "var(--vi)"}
  ];

  const seg = cur => `<div class="fx-seg" role="group" aria-label="Choisir un périmètre">${worlds.map(w =>
    `<a class="fx-seg-b${w.k === cur ? " on" : ""}" href="#/enjeux/${FX.slug(w.k)}" aria-pressed="${w.k === cur}">${FX.ic(w.ic, 2)}<span>${E(w.t)}</span></a>`).join("")}</div>`;

  function chooser() {
    return `
      <div class="fx-vh">${FX.crumb([["Accueil", "#/"], ["Mon enjeu métier"]])}
        <div class="fx-vt">${FX.kicker("Étape 1 sur 3")}<h1 data-focus>Quel est <em>votre monde</em> ?</h1>
        <p>Choisissez le périmètre qui vous concerne. Vous arriverez directement sur les étapes de votre processus.</p></div></div>
      <div class="fx-vb fx-choose">
        ${worlds.map(w => {
          const ids = FX.order(w.k);
          return `<a class="fx-world" href="#/enjeux/${FX.slug(w.k)}" style="--wc:${w.c}">
            <span class="fx-dc"><svg class="fx-dr a" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 9" stroke-linecap="round"/></svg><svg class="fx-dr b" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="46 30 8 30" stroke-linecap="round"/></svg><span class="fx-dico">${FX.ic(w.ic, 1.8)}</span></span>
            <span class="fx-dt"><b>${E(w.t)}</b><small>${E(w.q)}</small></span>
            <span class="fx-chips">${ids.map(id => `<i style="--mc:${FX.mod(id).c}">${E((SUITES[w.k].short_name || {})[id] || FX.mod(id).label)}</i>`).join("")}</span>
            <span class="fx-dgo">Choisir${FX.arrow}</span></a>`;
        }).join("")}
      </div>`;
  }

  function card(s, i, n, col) {
    const names = s.mods.map(id => ({id, n: (SUITES[FX.suiteKey(id)].short_name || {})[id] || FX.mod(id).label}));
    return `<div class="fx-sc">
      <div class="fx-sc-h"><span class="fx-nb" style="--c:${col}">${String(i + 1).padStart(2, "0")}</span><div><small>${E(s.lab)}</small><h3>${E(s.core)}</h3></div></div>
      <p class="fx-sc-n">${E(s.note)}</p>
      ${s.sor ? `<div class="fx-sor"><span>Système de référence</span><b>${E(s.sor)}</b></div>` : ""}
      ${names.length ? `<div class="fx-sc-l">Ce qu'Esker apporte ici</div>
        <ul class="fx-sc-u">${s.solo.map(x => `<li>${E(x)}</li>`).join("")}</ul>
        <div class="fx-sc-go">${names.map(m => `<a class="fx-btn" href="#/m/${m.id}">${E(m.n)}${FX.arrow}</a>`).join("")}</div>`
        : `<div class="fx-hors">Cette étape se situe hors du périmètre des modules Esker. Elle reste dans votre système de référence.</div>`}
    </div>`;
  }

  FX.views.enjeux = {
    render(r) {
      if (!r.key) return {title: "Mon enjeu métier", html: FX.bg() + `<div class="fx-page">${chooser()}</div>`};
      const st = FX.stages(r.key), W = worlds.filter(w => w.k === r.key)[0];
      r._st = st;
      return {
        title: W.t,
        html: FX.bg() + `<div class="fx-page">
        <div class="fx-vh">${FX.crumb([["Accueil", "#/"], ["Mon enjeu métier", "#/enjeux"], [W.t]])}
          <div class="fx-vt">${FX.kicker("Étape 2 sur 3")}<h1 data-focus>Quelle étape <em>vous préoccupe</em> ?</h1>
          <p>Cliquez une étape de votre processus : vous voyez ce que fait Esker, puis vous ouvrez le module.</p></div>
          ${seg(r.key)}</div>
        <div class="fx-vb fx-enj">
          <div class="fx-enj-w">
            ${xpWheelHTML("enjw", st, "Étapes du processus " + W.t)}
            <div class="fx-ctl"><button type="button" data-prev="enjw" aria-label="Étape précédente">${FX.ic("back", 2.4)}</button>
              <button type="button" class="fx-ctl-p" data-play="enjw" aria-pressed="false">${FX.ic("play", 2)}<span>Visite guidée</span></button>
              <button type="button" data-next="enjw" aria-label="Étape suivante">${FX.ic("next", 2.4)}</button></div>
          </div>
          <aside class="xp-card fx-card" data-card="enjw" aria-live="polite"></aside>
        </div>
        ${r.key === "O2C" && O2C.reading ? `<p class="fx-read">${E(O2C.reading)}</p>` : ""}
      </div>`
      };
    },
    mount(el, r) {
      if (!r.key) return;
      const ctl = xpWheelMount(el, "enjw", {steps: r._st, card, onSelect: i => FX.silent("#/enjeux/" + FX.slug(r.key) + "/" + i)});
      if (ctl) { FX.onLeave(() => ctl.stop()); if (r.stage >= 0 && r.stage < r._st.length) ctl.select(r.stage, false); }
    }
  };
})();
