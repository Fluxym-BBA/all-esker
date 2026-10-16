/* fx-home.js : accueil. Trois portes d'entrée en cercles, une question chacune. */
(function () {
  "use strict";
  const E = FX.E;

  /* petite roue : les 13 modules, couleurs de la charte (même géométrie que la grande roue) */
  function miniWheel() {
    const cx = 100, cy = 100, gap = 14, n1 = ORDER_S2P.length, n2 = ORDER_O2C.length;
    const span1 = 180 - gap, span2 = 180 - gap;
    let out = "";
    const seg = (ids, a0, span) => ids.forEach((id, i) => {
      const a1 = a0 + span / ids.length * i, a2 = a0 + span / ids.length * (i + 1), m = FX.mod(id);
      out += `<path d="${ring(cx, cy, 58, 90, a1, a2, 1.4)}" fill="${m.c}" opacity=".92"/>`;
    });
    seg(ORDER_S2P, gap / 2, span1);
    seg(ORDER_O2C, 180 + gap / 2, span2);
    return `<svg class="fx-mw" viewBox="0 0 200 200" aria-hidden="true">${out}<circle cx="100" cy="100" r="50" fill="#fff"/><circle cx="100" cy="100" r="50" fill="none" stroke="rgba(22,52,103,.12)"/></svg>`;
  }

  const door = (cls, href, ico, title, sub, go) => `
    <a class="fx-door ${cls}" href="${href}">
      <span class="fx-dc">
        <svg class="fx-dr a" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 9" stroke-linecap="round"/></svg>
        <svg class="fx-dr b" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="46 30 8 30" stroke-linecap="round"/></svg>
        <span class="fx-dico">${ico}</span>
      </span>
      <span class="fx-dt"><b>${title}</b><small>${sub}</small></span>
      <span class="fx-dgo">${go}${FX.arrow}</span>
    </a>`;

  FX.views.home = {
    render() {
      const n = M.length;
      return {
        title: "Accueil",
        html: FX.bg() + `
      <div class="fx-home">
        <header class="fx-hh">
          ${FX.kicker("Office of the CFO")}
          <h1 data-focus>L'AI Automation Suite pour l'<em>Office of the CFO</em></h1>
          <p>Par où voulez-vous commencer ?</p>
        </header>
        <div class="fx-doors">
          ${door("d1", "#/enjeux", FX.ic("spark", 1.8), "Mon enjeu métier", "Je pars de mon problème, je trouve la réponse", "Commencer")}
          ${door("d2", "#/solution", miniWheel(), "La solution Esker", n + " modules, 2 suites, une seule plateforme", "Explorer la roue")}
          ${door("d3", "#/fluxym", FX.ic("layers", 1.8), "Fluxym", "Notre méthode, nos convictions, notre place", "Découvrir")}
        </div>
        <div class="fx-hrow">
          <button type="button" class="fx-pill" data-tour="start">${FX.ic("zoom", 2)}<span>Visite guidée</span></button>
          <a class="fx-pill" href="#/suite/s2p/syn">${FX.ic("sync", 2)}<span>Synergies Source-to-Pay</span></a>
          <a class="fx-pill" href="#/suite/o2c/syn">${FX.ic("sync", 2)}<span>Synergies Order-to-Cash</span></a>
          <a class="fx-pill" href="demo/index.html" target="_blank" rel="noopener">${FX.ic("play", 2)}<span>Démo interactive</span></a>
        </div>
        <p class="fx-micro">© Fluxym, intégrateur et revendeur Esker · Esker est une marque déposée de son propriétaire · <a href="https://www.fluxym.com/mentions-legales/" target="_blank" rel="noopener">Mentions légales</a></p>
      </div>`
      };
    }
  };
})();
