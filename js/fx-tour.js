/* fx-tour.js : visite guidée en 6 étapes pour les néophytes. Elle navigue, met en évidence, puis laisse la main. */
(function () {
  "use strict";
  const STEPS = [
    {h: "#/", sel: ".fx-doors", t: "Trois portes d'entrée", d: "Partez de votre enjeu métier, de la solution Esker ou de Fluxym. Chaque cercle est cliquable."},
    {h: "#/enjeux/o2c/1", sel: ".fx-enj-w", t: "Partir de votre enjeu", d: "Choisissez l'étape de votre processus qui vous préoccupe. La fiche à droite montre ce qu'Esker apporte et le module qui répond."},
    {h: "#/solution", sel: "#wheelBox", t: "La grande roue", d: "Les 13 modules des deux suites. Survolez pour un aperçu, cliquez pour ouvrir le module."},
    {h: "#/suite/o2c/syn", sel: ".fx-chord", t: "Les synergies d'une suite", d: "Cliquez un trait pour comprendre ce que la suite apporte, ou un module pour ne voir que ses liens. Les filtres sont au-dessus."},
    {h: "#/m/crm", sel: ".fx-why", t: "Une fiche module", d: "Les messages d'Esker en quatre cartes. Les onglets donnent la suite : fonctionnement, fonctionnalités, cas d'usage."},
    {h: "#/fluxym/valeurs", sel: ".fx-vc", t: "Fluxym", d: "Notre approche, nos services, nos convictions et notre place. Vous pouvez quitter la visite à tout moment."}
  ];
  let cur = -1, box = null;

  function card() {
    if (box) return box;
    box = document.createElement("div");
    box.className = "fx-tour"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Visite guidée");
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-t]"); if (!b) return;
      const a = b.getAttribute("data-t");
      if (a === "next") go(cur + 1); else if (a === "prev") go(cur - 1); else if (a === "stop") stop();
    });
    document.body.appendChild(box);
    return box;
  }
  function hl() {
    Array.prototype.forEach.call(document.querySelectorAll(".tour-hl"), x => x.classList.remove("tour-hl"));
    if (cur < 0) return;
    const t = document.querySelector(STEPS[cur].sel);
    if (t) t.classList.add("tour-hl");
  }
  function paint() {
    const s = STEPS[cur], b = card();
    b.innerHTML = `<div class="fx-tour-i"><small>Étape ${cur + 1} sur ${STEPS.length}</small><b>${s.t}</b><p>${s.d}</p></div>
      <div class="fx-tour-dots">${STEPS.map((x, i) => `<i class="${i === cur ? "on" : i < cur ? "done" : ""}"></i>`).join("")}</div>
      <div class="fx-tour-b"><button type="button" data-t="stop" class="fx-btn ghost sm">Quitter</button>
        ${cur ? '<button type="button" data-t="prev" class="fx-btn sm">Précédent</button>' : ""}
        <button type="button" data-t="next" class="fx-btn pri sm">${cur === STEPS.length - 1 ? "Terminer" : "Suivant"}</button></div>`;
    b.classList.add("on");
  }
  function go(i) {
    if (i < 0) return;
    if (i >= STEPS.length) { stop(); return; }
    cur = i; paint();
    FX.go(STEPS[cur].h);
    setTimeout(hl, 60);
  }
  function stop() { cur = -1; if (box) { box.classList.remove("on"); box.innerHTML = ""; } hl(); }

  window.FXTour = {
    start() { go(0); },
    stop,
    active: () => cur >= 0,
    onRender() { if (cur >= 0) setTimeout(hl, 60); }
  };
  document.addEventListener("click", e => { const t = e.target.closest && e.target.closest("[data-tour='start']"); if (t) { e.preventDefault(); FXTour.start(); } });
})();
