/* =========================================================================
   fx-core.js : noyau de l'application à écran unique.
   Routeur par hash (#/...), rendu d'une vue à la fois, composants communs.
   Aucune vue ne s'empile sous une autre : chaque clic remplace le contenu.
   ========================================================================= */
(function () {
  "use strict";
  const FX = window.FX = {views: {}, cur: null, leave: [], suites: {s2p: "S2P", o2c: "O2C"}};

  /* ---------- utilitaires ---------- */
  const E = FX.E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
  FX.fr = (n, d) => Number(n).toFixed(d || 0).replace(".", ",");
  FX.reduce = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  FX.svg = (p, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const EXTRA = {play: '<path d="M8 5l11 7-11 7z"/>', home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>', back: '<path d="M19 12H5M11 6l-6 6 6 6"/>', next: '<path d="M5 12h14M13 6l6 6-6 6"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>'};
  FX.ic = (k, w) => FX.svg(EXTRA[k] || (typeof XP_ICONS !== "undefined" && XP_ICONS[k]) || "", w);
  FX.arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  FX.back = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  FX.mod = id => (typeof byId === "function" ? byId(id) : null);
  FX.suiteKey = id => { const m = FX.mod(id); return m ? m.suite : null; };           /* "S2P" | "O2C" */
  FX.slug = k => String(k).toLowerCase();
  FX.suiteName = k => (k === "S2P" ? "Source-to-Pay" : "Order-to-Cash");
  FX.suiteNice = k => (k === "S2P" ? "Achats et dépenses" : "Clients et encaissements");
  FX.order = k => (k === "S2P" ? ORDER_S2P : ORDER_O2C);
  FX.ALL = () => ORDER_S2P.concat(ORDER_O2C);
  FX.onLeave = fn => FX.leave.push(fn);
  FX.id = (() => { let n = 0; return p => (p || "fx") + (++n); })();

  /* ---------- décors et en-têtes ---------- */
  FX.bg = () => '<div class="fx-bg" aria-hidden="true"><i class="dots"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i></div>';
  FX.kicker = t => `<span class="fx-k"><i></i>${E(t)}</span>`;
  FX.crumb = list => '<nav class="fx-crumb" aria-label="Fil d\'Ariane">' + list.map((c, i) => i === list.length - 1
    ? `<span aria-current="page">${E(c[0])}</span>`
    : `<a href="${E(c[1])}">${E(c[0])}</a><i aria-hidden="true">›</i>`).join("") + "</nav>";
  /* barre d'onglets : un seul écran par onglet */
  FX.tabs = (items, cur, label) => `<div class="fx-tabs" role="tablist" aria-label="${E(label || "Sections")}">${items.map(t =>
    `<button type="button" role="tab" class="fx-tab${t.k === cur ? " on" : ""}" data-tab="${E(t.k)}" aria-selected="${t.k === cur}" id="tab-${E(t.k)}">${t.i ? FX.ic(t.i, 2) : ""}<span>${E(t.l)}</span></button>`).join("")}</div>`;
  FX.setTab = (root, k) => {
    Array.prototype.forEach.call(root.querySelectorAll(".fx-tab"), b => { const on = b.getAttribute("data-tab") === k; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
  };

  /* ---------- compteur animé ---------- */
  FX.countUp = el => {
    const to = parseFloat(el.getAttribute("data-count")), dec = +el.getAttribute("data-dec") || 0;
    if (isNaN(to)) return;
    if (FX.reduce() || !window.requestAnimationFrame) { el.textContent = FX.fr(to, dec); return; }
    const t0 = performance.now(), dur = 1200;
    (function f(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = FX.fr(to * e, dec);
      if (k < 1 && document.body.contains(el)) requestAnimationFrame(f); else el.textContent = FX.fr(to, dec);
    })(t0);
  };
  FX.runCounts = root => Array.prototype.forEach.call(root.querySelectorAll("[data-count]"), FX.countUp);

  /* ---------- visionneuse d'image ---------- */
  FX.lightbox = (src, alt) => {
    const o = document.createElement("div");
    o.className = "fx-lb"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", alt || "Image");
    o.innerHTML = `<button type="button" aria-label="Fermer">×</button><img src="${E(src)}" alt="${E(alt || "")}">`;
    const close = () => { o.remove(); document.removeEventListener("keydown", kd, true); };
    const kd = e => { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    o.addEventListener("click", close);
    document.addEventListener("keydown", kd, true);
    document.body.appendChild(o);
  };

  /* ---------- routage ---------- */
  /* routes : #/ · #/enjeux[/s2p|o2c] · #/solution · #/suite/s2p[/onglet] · #/m/<id>[/onglet] · #/fluxym[/onglet]
     anciens liens conservés : #m=ap, #suite=o2c, #roue, #services, #s2p, #o2c, #contact */
  FX.parse = h => {
    h = String(h || "").replace(/^#/, "");
    let m;
    if ((m = /^m=([a-z0-9]+)/.exec(h)) && FX.mod(m[1])) return {v: "module", id: m[1], tab: ""};
    if ((m = /^suite=([a-z0-9]+)/i.exec(h)) && FX.suites[m[1].toLowerCase()]) return {v: "suite", key: FX.suites[m[1].toLowerCase()], tab: ""};
    if (h === "roue") return {v: "solution"};
    if (h === "services") return {v: "fluxym", tab: ""};
    if (h === "s2p" || h === "o2c") return {v: "suite", key: FX.suites[h], tab: ""};
    const p = h.replace(/^\/+/, "").split("/").filter(Boolean);
    if (!p.length) return {v: "home"};
    if (p[0] === "enjeux") return {v: "enjeux", key: FX.suites[(p[1] || "").toLowerCase()] || "", stage: p[2] == null ? -1 : parseInt(p[2], 10)};
    if (p[0] === "solution") return {v: "solution"};
    if (p[0] === "suite" && FX.suites[(p[1] || "").toLowerCase()]) return {v: "suite", key: FX.suites[p[1].toLowerCase()], tab: p[2] || ""};
    if (p[0] === "m" && FX.mod(p[1])) return {v: "module", id: p[1], tab: p[2] || ""};
    if (p[0] === "fluxym") return {v: "fluxym", tab: p[1] || ""};
    return {v: "home"};
  };
  FX.hash = r => {
    switch (r.v) {
      case "enjeux": return "#/enjeux" + (r.key ? "/" + FX.slug(r.key) + (r.stage >= 0 ? "/" + r.stage : "") : "");
      case "solution": return "#/solution";
      case "suite": return "#/suite/" + FX.slug(r.key) + (r.tab ? "/" + r.tab : "");
      case "module": return "#/m/" + r.id + (r.tab ? "/" + r.tab : "");
      case "fluxym": return "#/fluxym" + (r.tab ? "/" + r.tab : "");
      default: return "#/";
    }
  };
  /* niveau parent (Échap, bouton retour) */
  FX.parent = r => {
    if (r.v === "module") return "#/suite/" + FX.slug(FX.suiteKey(r.id));
    if (r.v === "suite") return "#/solution";
    if (r.v === "home") return null;
    return "#/";
  };
  FX.go = (h, opt) => {
    h = h.charAt(0) === "#" ? h : "#" + h;
    if (opt && opt.replace) { FX.silent(h); return; }
    if (location.hash === h) FX.render(); else location.hash = h;
  };
  /* met à jour l'adresse sans recharger la vue (changement d'onglet, d'étape) */
  FX.silent = h => {
    try { history.replaceState(null, "", h); } catch (e) { /* file:// : on ignore */ }
    if (FX.cur) FX.cur.hash = h;
  };

  const NAV = {home: "home", enjeux: "enjeux", solution: "solution", suite: "solution", module: "solution", fluxym: "fluxym"};
  const TITLES = {home: "Accueil", enjeux: "Mon enjeu métier", solution: "La solution", suite: "Suite", module: "Module", fluxym: "Fluxym"};

  FX.render = () => {
    const app = document.getElementById("app");
    if (!app) return;
    const r = FX.parse(location.hash), V = FX.views[r.v] || FX.views.home;
    FX.leave.splice(0).forEach(fn => { try { fn(); } catch (e) { /* nettoyage best effort */ } });
    const el = document.createElement("section");
    el.className = "fx-view fx-v-" + r.v;
    el.setAttribute("data-view", r.v);
    let out;
    try { out = V.render(r); } catch (e) { out = {html: `<div class="fx-err"><h2>Cette page n'a pas pu s'afficher</h2><p>${E(e && e.message)}</p><a class="fx-btn" href="#/">Retour à l'accueil</a></div>`}; if (window.console) console.error(e); }
    el.innerHTML = out.html;
    app.innerHTML = "";
    app.appendChild(el);
    FX.cur = {r, el, hash: FX.hash(r)};
    document.body.setAttribute("data-view", r.v);
    /* en-tête : entrée active */
    Array.prototype.forEach.call(document.querySelectorAll("#hnav [data-nav]"), a => {
      const on = a.getAttribute("data-nav") === NAV[r.v];
      a.classList.toggle("is-here", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    /* roue flottante : utile partout sauf là où la grande roue est déjà visible */
    const dock = document.getElementById("dock");
    if (dock) dock.classList.toggle("on", r.v !== "home" && r.v !== "solution");
    if (window.FXDock && r.v !== "home" && r.v !== "solution") FXDock.sync(r);
    try { if (V.mount) V.mount(el, r); } catch (e) { if (window.console) console.error(e); }
    document.title = ((out && out.title) || TITLES[r.v] || "") + " · Esker × Fluxym";
    el.scrollTop = 0;
    const t = el.querySelector("[data-focus]");
    if (t) { t.setAttribute("tabindex", "-1"); try { t.focus({preventScroll: true}); } catch (e) { /* focus non supporté */ } }
    if (window.FXTour) FXTour.onRender(r);
  };

  /* ---------- délégation globale ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest("[data-go]");
    if (t) { e.preventDefault(); FX.go(t.getAttribute("data-go")); }
    const z = e.target.closest && e.target.closest("[data-zoom]");
    if (z) { e.preventDefault(); FX.lightbox(z.getAttribute("data-zoom"), z.getAttribute("data-alt")); }
  });
  document.addEventListener("keydown", e => {
    const tag = ((e.target && e.target.tagName) || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key === "Escape" && FX.cur) {
      const dock = document.getElementById("dock");
      if (dock && dock.classList.contains("open")) return;       /* le widget gère son propre Échap */
      if (window.FXTour && FXTour.active()) { FXTour.stop(); return; }
      const p = FX.parent(FX.cur.r);
      if (p) FX.go(p);
    }
    if (FX.cur && FX.cur.r.v === "module" && (e.key === "ArrowRight" || e.key === "ArrowLeft") && !e.altKey && !e.ctrlKey && !e.metaKey) {
      const ord = FX.ALL(), i = ord.indexOf(FX.cur.r.id), d = e.key === "ArrowRight" ? 1 : -1;
      if (e.target.closest && e.target.closest(".pw, .fx-tabs, .fx-orbit")) return;   /* ces composants gèrent déjà les flèches */
      FX.go("#/m/" + ord[(i + d + ord.length) % ord.length] + (FX.cur.r.tab ? "/" + FX.cur.r.tab : ""));
    }
  });
  window.addEventListener("hashchange", () => FX.render());
})();
