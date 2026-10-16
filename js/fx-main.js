/* fx-main.js : démarrage. Le jeu reste lisible même si une vue échoue : l'erreur est affichée dans la vue, pas dans une page blanche. */
(function () {
  "use strict";
  function boot() {
    if (window.FXDock) { try { FXDock.init(); } catch (e) { if (window.console) console.error(e); } }
    FX.render();
    const l = document.getElementById("loading"); if (l) l.remove();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
