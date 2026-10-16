/* fx-solution.js : « La solution ». La grande roue occupe l'écran. Un clic ouvre le module,
   un clic sur le nom d'une suite ouvre ses synergies. */
(function () {
  "use strict";
  const E = FX.E;
  let hovered = null;

  FX.hubShow = function (m) {
    const svg = document.getElementById("bigWheel"); if (!svg) return;
    hovered = m.id;
    svg.classList.add("hovering", "dimmed");
    const lines = wrapTxt(m.label, 17);
    document.getElementById("hhIcon").textContent = m.icon;
    document.getElementById("hhRing").setAttribute("fill", m.c + "22");
    const su = document.getElementById("hhSuite");
    su.textContent = m.suite === "S2P" ? "SOURCE-TO-PAY" : "ORDER-TO-CASH";
    su.setAttribute("fill", m.c);
    document.getElementById("hhName").textContent = lines[0] || "";
    document.getElementById("hhName2").textContent = lines.slice(1).join(" ") || "";
    const cta = document.getElementById("hhCta"), ctaT = document.getElementById("hhCtaT");
    ctaT.textContent = "OUVRIR LE MODULE";
    cta.querySelector("rect").setAttribute("fill", m.c);
    ctaT.setAttribute("fill", "#fff");
    ["S2P", "O2C"].forEach(x => {
      const g = document.getElementById("arc-" + x); if (!g) return;
      g.classList.toggle("lit", x === m.suite); g.classList.toggle("dim", x !== m.suite);
    });
  };
  FX.hubReset = function () {
    const svg = document.getElementById("bigWheel"); if (!svg) return;
    hovered = null;
    svg.classList.remove("hovering", "dimmed");
    ["S2P", "O2C"].forEach(x => { const g = document.getElementById("arc-" + x); if (g) g.classList.remove("lit", "dim"); });
  };

  /* la roue tient toujours dans la cellule : on mesure la cellule, jamais la roue */
  function fit(cell, box) {
    const w = cell.clientWidth, h = cell.clientHeight;
    if (!w || !h) return;
    const s = Math.max(240, Math.floor(Math.min(w, h) - 8));
    box.style.width = s + "px"; box.style.height = s + "px";
  }

  FX.views.solution = {
    render() {
      return {
        title: "La solution",
        html: FX.bg() + `<div class="fx-page fx-sol">
        <div class="fx-vh fx-vh-s">${FX.crumb([["Accueil", "#/"], ["La solution"]])}
          <div class="fx-vt"><h1 data-focus>Une plateforme, <em>${M.length} modules</em></h1>
          <p>Survolez la roue, cliquez un module pour le découvrir. Cliquez le nom d'une suite pour voir ses synergies.</p></div></div>
        <div class="fx-sol-cell" id="solCell"><div class="wheel-box" id="wheelBox">${buildWheel()}</div></div>
        <div class="fx-sol-row">
          <a class="fx-pill" href="#/suite/s2p">${FX.ic("cart", 2)}<span>Suite Source-to-Pay</span></a>
          <a class="fx-pill" href="#/suite/o2c">${FX.ic("euro", 2)}<span>Suite Order-to-Cash</span></a>
          <a class="fx-pill" href="#/enjeux">${FX.ic("spark", 2)}<span>Partir de mon enjeu</span></a>
        </div></div>`
      };
    },
    mount(el) {
      const cell = el.querySelector("#solCell"), box = el.querySelector("#wheelBox");
      const refit = () => fit(cell, box);
      refit();
      window.addEventListener("resize", refit);
      let ro = null;
      if (window.ResizeObserver) { ro = new ResizeObserver(refit); ro.observe(cell); }
      FX.onLeave(() => { window.removeEventListener("resize", refit); if (ro) ro.disconnect(); hovered = null; });

      Array.prototype.forEach.call(el.querySelectorAll("#bigWheel .seg"), g => {
        const id = g.getAttribute("data-id"), m = FX.mod(id);
        if (!m) return;
        g.addEventListener("mouseenter", () => FX.hubShow(m));
        g.addEventListener("focus", () => FX.hubShow(m));
        g.addEventListener("mouseleave", FX.hubReset);
        g.addEventListener("blur", FX.hubReset);
        g.addEventListener("click", () => FX.go("#/m/" + id));
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); FX.go("#/m/" + id); } });
      });
      const hh = el.querySelector("#hubHover");
      if (hh) hh.addEventListener("click", () => { if (hovered) FX.go("#/m/" + hovered); });
      Array.prototype.forEach.call(el.querySelectorAll("#bigWheel .suitegrp"), g => {
        const k = g.getAttribute("data-suite");
        g.addEventListener("click", () => FX.go("#/suite/" + FX.slug(k)));
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); FX.go("#/suite/" + FX.slug(k)); } });
      });
    }
  };
})();
