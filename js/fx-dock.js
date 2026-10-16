/* fx-dock.js : roue flottante, accessible depuis toutes les pages sauf l'accueil et la grande roue. */
(function () {
  "use strict";
  const dock = () => document.getElementById("dock");
  let hoverT = null, closeT = null, miniHovered = null, built = false, here = null;
  const isTouch = () => !!(window.matchMedia && window.matchMedia("(hover: none)").matches);

  function show(m) {
    const mw = document.getElementById("miniWheel"); if (!mw) return;
    miniHovered = m.id;
    mw.classList.add("hovering", "dimmed");
    const lines = wrapTxt(m.label, 15);
    document.getElementById("mhIcon").textContent = m.icon;
    document.getElementById("mhRing").setAttribute("fill", m.c + "22");
    const su = document.getElementById("mhSuite");
    su.textContent = m.suite === "S2P" ? "SOURCE-TO-PAY" : "ORDER-TO-CASH";
    su.setAttribute("fill", m.c);
    document.getElementById("mhName").textContent = lines[0] || "";
    document.getElementById("mhName2").textContent = lines.slice(1).join(" ") || "";
    const cta = document.getElementById("mhCta"), ctaT = document.getElementById("mhCtaT");
    ctaT.textContent = "OUVRIR LE MODULE";
    cta.querySelector("rect").setAttribute("fill", m.c);
    ctaT.setAttribute("fill", "#fff");
    ["S2P", "O2C"].forEach(x => { const g = document.getElementById("marc-" + x); if (!g) return; g.classList.toggle("lit", x === m.suite); g.classList.toggle("dim", x !== m.suite); });
  }
  function reset() {
    const mw = document.getElementById("miniWheel"); if (!mw) return;
    miniHovered = null;
    if (here && FX.mod(here)) { show(FX.mod(here)); miniHovered = null; return; }
    mw.classList.remove("hovering", "dimmed");
    ["S2P", "O2C"].forEach(x => { const g = document.getElementById("marc-" + x); if (g) g.classList.remove("lit", "dim"); });
  }
  function open() {
    const d = dock(); if (!d) return;
    clearTimeout(closeT); d.classList.remove("closing"); d.classList.add("open");
    document.getElementById("dockBtn").setAttribute("aria-expanded", "true");
  }
  function close() {
    const d = dock(); if (!d || !d.classList.contains("open")) return;
    d.classList.remove("open"); d.classList.add("closing");
    clearTimeout(closeT); closeT = setTimeout(() => d.classList.remove("closing"), 820);
    document.getElementById("dockBtn").setAttribute("aria-expanded", "false");
    reset();
  }

  function build() {
    if (built) return; built = true;
    const w = document.getElementById("dockWheel"); if (!w) return;
    w.innerHTML = buildMiniWheel();
    Array.prototype.forEach.call(w.querySelectorAll(".mini-seg"), g => {
      const id = g.getAttribute("data-id"), m = FX.mod(id);
      if (!m) return;
      g.addEventListener("mouseenter", () => show(m));
      g.addEventListener("focus", () => show(m));
      g.addEventListener("mouseleave", reset);
      g.addEventListener("blur", reset);
      g.addEventListener("click", e => { e.stopPropagation(); close(); FX.go("#/m/" + id); });
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(); FX.go("#/m/" + id); } });
    });
    Array.prototype.forEach.call(w.querySelectorAll(".suitegrp"), g => {
      const k = g.getAttribute("data-suite");
      g.addEventListener("click", e => { e.stopPropagation(); close(); FX.go("#/suite/" + FX.slug(k)); });
    });
    const hub = w.querySelector("#miniHubHover");
    if (hub) hub.addEventListener("click", e => { e.stopPropagation(); const id = miniHovered || here; if (id) { close(); FX.go("#/m/" + id); } });
  }

  window.FXDock = {
    init() {
      const d = dock(); if (!d) return;
      build();
      const badge = document.getElementById("dockBadge");
      if (badge && typeof TOTV !== "undefined") badge.textContent = TOTV;
      document.getElementById("dockBtn").addEventListener("click", e => { e.stopPropagation(); d.classList.contains("open") ? close() : open(); });
      const dw = document.getElementById("dockWheel");
      dw.addEventListener("click", e => { if (e.target === dw || e.target.id === "miniWheel") close(); });
      if (!isTouch()) {
        d.addEventListener("mouseenter", () => { clearTimeout(hoverT); hoverT = setTimeout(open, 130); });
        d.addEventListener("mouseleave", () => { clearTimeout(hoverT); hoverT = setTimeout(close, 420); });
      }
      document.addEventListener("click", e => { if (d.classList.contains("open") && !d.contains(e.target)) close(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && d.classList.contains("open")) close(); });
    },
    /* synchronise l'état de la roue avec la page courante */
    sync(r) {
      here = r.v === "module" ? r.id : null;
      Array.prototype.forEach.call(document.querySelectorAll(".mini-seg"), s => s.classList.toggle("active", s.getAttribute("data-id") === here));
      const d = dock(); if (d && d.classList.contains("open")) close();
      reset();
    }
  };
})();
