function markActive(id){
  document.querySelectorAll(".seg").forEach(s => s.classList.toggle("active", s.dataset.id === id));
  document.querySelectorAll(".mini-seg").forEach(s => s.classList.toggle("active", s.dataset.id === id));
  document.querySelectorAll(".card").forEach(c => c.classList.toggle("active", c.dataset.id === id));
}

function closePanel(){
  const v = document.getElementById("player"); if(v) v.pause();
  if(xpS){ xpKill(); xpS = null; }
  host.innerHTML = ""; current = null;
  markActive(null);
  document.getElementById("roue").scrollIntoView({behavior:"smooth", block:"start"});
}
function scrollToPanel(focus){
  const p = document.getElementById("panel"); if(!p) return;
  p.scrollIntoView({behavior:"smooth", block:"center"});
  if(focus !== false) setTimeout(()=>p.focus({preventScroll:true}), 420);
}
/* Sélection d'un module.
   Règle unique et sans exception : tout clic sur un module amène au lecteur
   et démarre la vidéo. opts.play === false sert uniquement au lien profond
   (aucun geste utilisateur : le navigateur refuserait la lecture).
   opts.keepPlace évite un défilement inutile quand le lecteur est déjà visible. */
function panelVisible(){
  const p = document.getElementById("panel"); if(!p) return false;
  const r = p.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top > -40 && r.top < vh * 0.62;
}
function sel(id, opts){
  opts = opts || {};
  const play = opts.play !== false;
  const stay = opts.keepPlace === true && panelVisible();
  renderPanel(id, 0, play);
  if(!stay) scrollToPanel(opts.focus !== false);
  history.replaceState(null, "", "#m=" + id);
}

/* =========================================================================
   6. CARTES
   ========================================================================= */
function cardHTML(m){
  const soon = !m.videos.length;
  const tag = soon ? `<span class="tag soon">Bientôt</span>`
                   : `<span class="tag ok">${m.videos.length} vidéo${m.videos.length>1?'s':''}</span>`;
  return `<article class="card" style="--c:${m.c}" data-id="${m.id}" role="button" tabindex="0" aria-label="${esc(m.label)}">
    <div class="card-top"><div class="card-ico">${m.icon}</div><h3>${esc(m.label)}</h3></div>
    <p>${esc(m.desc)}</p>
    <div class="card-foot">${tag}<span class="card-go">${soon ? 'En savoir plus →' : 'Voir la vidéo →'}</span></div>
  </article>`;
}

/* =========================================================================
   7. FORMULAIRE HUBSPOT
   ========================================================================= */
function loadHubspot(){
  const s = document.createElement("script");
  s.src = "//js-eu1.hsforms.net/forms/embed/v2.js"; s.charset = "utf-8"; s.async = true;
  s.onload = () => {
    try{
      window.hbspt.forms.create({region:"eu1", portalId:"26096000",
        formId:"b3d5e891-cdf8-4a67-ac3c-37fb327c4eac", target:"#hsFormTarget"});
    }catch(e){ document.getElementById("formFallback").classList.add("on"); }
  };
  s.onerror = () => document.getElementById("formFallback").classList.add("on");
  document.head.appendChild(s);
  setTimeout(() => {
    const t = document.getElementById("hsFormTarget");
    if(t && !t.children.length) document.getElementById("formFallback").classList.add("on");
  }, 6000);
}

/* =========================================================================
   8. DIMENSIONNEMENT : la roue tient TOUJOURS dans l'écran
   ========================================================================= */
let zoom = 1;
/* 100 % = la roue remplit la hauteur disponible sous le menu, du haut au bas
   de la fenêtre. En dessous elle respire, au-dessus elle pousse le titre et le
   bandeau sans jamais les recouvrir. */
const ZMIN = 0.5, ZMAX = 3, ZSTEP = 0.05;
const wheelBox  = document.getElementById("wheelBox");
const wheelCell = document.querySelector(".wheel-cell");
const stageEl   = document.getElementById("roue");

/* MESURE DIRECTE, sans arithmétique à trous.
   On relève la position absolue du haut de la cellule de la roue : elle intègre
   déjà le menu fixe, les marges et tout ce qui se trouve au-dessus, et elle ne
   dépend jamais de la roue elle-même. Aucune boucle de rétroaction possible.
   La barre d'état du bas étant en surimpression dans les coins, elle ne retire
   aucune hauteur : la roue dispose de toute la fenêtre sous le menu. */
function fitBase(){
  const vh = Math.max(380, document.documentElement.clientHeight || window.innerHeight);
  let top = 76;
  if(wheelCell){
    const r = wheelCell.getBoundingClientRect();
    top = r.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
  }
  const h = vh - top - 18;
  const w = Math.min((stageEl ? stageEl.clientWidth : vh) - 20, 1500);
  return Math.max(230, Math.min(h, w));
}
/* size = côté de la boîte SVG, qui correspond maintenant exactement au dessin :
   la viewBox a été resserrée sur son contenu réel. */
function fitWheel(){
  if(!wheelBox) return;
  const size = Math.round(fitBase() * zoom);
  wheelBox.style.width  = size + "px";
  wheelBox.style.height = size + "px";
}


function setZoom(v, save){
  zoom = Math.min(ZMAX, Math.max(ZMIN, Math.round(v * 100) / 100));   /* au pour cent près */
  const pct = Math.round(zoom * 100);
  const inp = document.getElementById("hzInput");
  if(inp && document.activeElement !== inp) inp.value = pct + "%";
  const mi = document.getElementById("hzMinus"), pl = document.getElementById("hzPlus");
  if(mi) mi.classList.toggle("off", zoom <= ZMIN + 0.001);
  if(pl) pl.classList.toggle("off", zoom >= ZMAX - 0.001);
  fitWheel();
  if(save !== false){ try{ localStorage.setItem("fx-wheel-zoom3", String(zoom)); }catch(e){} }
}
/* les boutons avancent de palier en palier de 5 %, même en partant d'une
   valeur saisie à la main comme 137 % */
function stepZoom(dir){
  const cur = Math.round(zoom * 100);
  const nxt = dir > 0 ? (Math.floor(cur / 5) + 1) * 5 : (Math.ceil(cur / 5) - 1) * 5;
  setZoom(nxt / 100);
}

/* =========================================================================
   9. CINÉMATIQUES DE SURVOL
   ========================================================================= */
let hovered = null;            /* module actuellement survolé sur la grande roue */
let miniHovered = null;        /* module actuellement survolé sur la mini roue */

function hubShow(m){
  const svg = document.getElementById("bigWheel"); if(!svg) return;
  hovered = m.id;
  svg.classList.add("hovering","dimmed");
  const lines = wrapTxt(m.label, 17);
  const soon = !m.videos.length;
  document.getElementById("hhIcon").textContent = m.icon;
  document.getElementById("hhRing").setAttribute("fill", m.c + "22");
  const su = document.getElementById("hhSuite");
  su.textContent = m.suite === "S2P" ? "SOURCE-TO-PAY" : "ORDER-TO-CASH";
  su.setAttribute("fill", m.c);
  document.getElementById("hhName").textContent  = lines[0] || "";
  document.getElementById("hhName2").textContent = lines.slice(1).join(" ") || "";
  const cta = document.getElementById("hhCta"), ctaT = document.getElementById("hhCtaT");
  ctaT.textContent = soon ? "BIENTÔT DISPONIBLE" : "LANCER LA VIDÉO";
  cta.querySelector("rect").setAttribute("fill", soon ? "#ffcf63" : m.c);
  ctaT.setAttribute("fill", soon ? "#5c4100" : "#fff");
  ["S2P","O2C"].forEach(x => {
    const g = document.getElementById("arc-" + x); if(!g) return;
    g.classList.toggle("lit", x === m.suite);
    g.classList.toggle("dim", x !== m.suite);
  });
}
function hubReset(){
  const svg = document.getElementById("bigWheel"); if(!svg) return;
  hovered = null;
  svg.classList.remove("hovering","dimmed");
  ["S2P","O2C"].forEach(x => { const g = document.getElementById("arc-" + x); if(g) g.classList.remove("lit","dim"); });
}
function miniShow(m){
  const mw = document.getElementById("miniWheel"); if(!mw) return;
  miniHovered = m.id;
  mw.classList.add("hovering","dimmed");
  const lines = wrapTxt(m.label, 15);
  const soon = !m.videos.length;
  document.getElementById("mhIcon").textContent = m.icon;
  document.getElementById("mhRing").setAttribute("fill", m.c + "22");
  const su = document.getElementById("mhSuite");
  su.textContent = m.suite === "S2P" ? "SOURCE-TO-PAY" : "ORDER-TO-CASH";
  su.setAttribute("fill", m.c);
  document.getElementById("mhName").textContent  = lines[0] || "";
  document.getElementById("mhName2").textContent = lines.slice(1).join(" ") || "";
  const cta = document.getElementById("mhCta"), ctaT = document.getElementById("mhCtaT");
  ctaT.textContent = soon ? "BIENTÔT" : "LANCER LA VIDÉO";
  cta.querySelector("rect").setAttribute("fill", soon ? "#ffcf63" : m.c);
  ctaT.setAttribute("fill", soon ? "#5c4100" : "#fff");
  ["S2P","O2C"].forEach(x => {
    const g = document.getElementById("marc-" + x); if(!g) return;
    g.classList.toggle("lit", x === m.suite);
    g.classList.toggle("dim", x !== m.suite);
  });
}
function miniReset(){
  const mw = document.getElementById("miniWheel"); if(!mw) return;
  miniHovered = null;
  if(current){ miniShow(byId(current)); miniHovered = null; return; }
  mw.classList.remove("hovering","dimmed");
  ["S2P","O2C"].forEach(x => { const g = document.getElementById("marc-" + x); if(g) g.classList.remove("lit","dim"); });
}

/* =========================================================================
   10. WIDGET FLOTTANT
   ========================================================================= */
const dock = document.getElementById("dock");
let dockHoverTimer = null;
const isTouch = window.matchMedia("(hover: none)").matches;

let closeTmr = null;
function dockOpen(){
  clearTimeout(closeTmr);
  dock.classList.remove("closing");
  dock.classList.add("open");
  document.getElementById("dockBtn").setAttribute("aria-expanded","true");
}
function dockClose(){
  if(!dock.classList.contains("open")) return;
  dock.classList.remove("open");
  /* l'état "closing" maintient la galaxie en place le temps de l'effondrement :
     une simple transition inverse ne permettrait aucune mise en scène */
  dock.classList.add("closing");
  clearTimeout(closeTmr);
  closeTmr = setTimeout(() => dock.classList.remove("closing"), 820);
  document.getElementById("dockBtn").setAttribute("aria-expanded","false");
  miniReset();
}
function dockToggle(){ dock.classList.contains("open") ? dockClose() : dockOpen(); }

/* =========================================================================
   11. INITIALISATION
   ========================================================================= */
(function init(){
  /* --- grande roue --- */
  wheelBox.innerHTML = buildWheel();
  document.querySelectorAll("#bigWheel .seg").forEach(s => {
    const m = byId(s.dataset.id);
    s.addEventListener("click", () => sel(s.dataset.id));
    s.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); sel(s.dataset.id); } });
    s.addEventListener("mouseenter", () => hubShow(m));
    s.addEventListener("focus", () => hubShow(m));
  });
  const bw = document.getElementById("bigWheel");
  if(bw){
    bw.addEventListener("mouseleave", hubReset);
    bw.addEventListener("focusout", e => { if(!bw.contains(e.relatedTarget)) hubReset(); });
  }
  /* le noyau devient cliquable : il lance le module affiché en son centre */
  const hubH = document.getElementById("hubHover");
  if(hubH){
    hubH.addEventListener("click", e => { e.stopPropagation(); if(hovered) sel(hovered); });
    hubH.addEventListener("keydown", e => {
      if((e.key === "Enter" || e.key === " ") && hovered){ e.preventDefault(); sel(hovered); }
    });
  }

  /* --- zoom intégré au noyau --- */
  const hzM = document.getElementById("hzMinus"), hzP = document.getElementById("hzPlus");
  const bindZoom = (el, dir) => {
    if(!el) return;
    el.addEventListener("click", e => { e.stopPropagation(); stepZoom(dir); });
    el.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); stepZoom(dir); }
    });
  };
  bindZoom(hzM, -1); bindZoom(hzP, 1);
  /* saisie directe du pourcentage */
  const hzI = document.getElementById("hzInput");
  if(hzI){
    const applyInput = () => {
      const n = parseFloat(String(hzI.value).replace(",", ".").replace(/[^\d.]/g, ""));
      setZoom(isFinite(n) && n > 0 ? n / 100 : zoom);
      hzI.value = Math.round(zoom * 100) + "%";
    };
    hzI.addEventListener("click", e => e.stopPropagation());
    hzI.addEventListener("mouseenter", e => e.stopPropagation());
    hzI.addEventListener("focus", () => { hzI.value = String(Math.round(zoom * 100)); hzI.select(); });
    hzI.addEventListener("blur", applyInput);
    hzI.addEventListener("keydown", e => {
      e.stopPropagation();
      if(e.key === "Enter"){ e.preventDefault(); applyInput(); hzI.blur(); }
      else if(e.key === "Escape"){ hzI.value = String(Math.round(zoom * 100)); hzI.blur(); }
      else if(e.key === "ArrowUp"){ e.preventDefault(); stepZoom(1); hzI.value = String(Math.round(zoom * 100)); }
      else if(e.key === "ArrowDown"){ e.preventDefault(); stepZoom(-1); hzI.value = String(Math.round(zoom * 100)); }
    });
  }
  const hz = document.getElementById("hubZoom");
  if(hz) hz.addEventListener("mouseenter", e => e.stopPropagation());

  /* --- mini roue du widget --- */
  document.getElementById("dockWheel").innerHTML = buildMiniWheel();
  document.querySelectorAll("#miniWheel .mini-seg").forEach(s => {
    const m = byId(s.dataset.id);
    s.addEventListener("click", () => { sel(s.dataset.id); dockClose(); });
    s.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); sel(s.dataset.id); dockClose(); } });
    s.addEventListener("mouseenter", () => miniShow(m));
    s.addEventListener("focus", () => miniShow(m));
  });
  const mw = document.getElementById("miniWheel");
  if(mw) mw.addEventListener("mouseleave", miniReset);
  const mhub = document.getElementById("miniHubHover");
  if(mhub){
    mhub.style.cursor = "pointer";
    mhub.addEventListener("click", e => {
      e.stopPropagation();
      const t = miniHovered || current;
      if(t){ sel(t); dockClose(); }
    });
  }

  /* --- cartes --- */
  document.getElementById("gridS2P").innerHTML = ORDER_S2P.map(id => cardHTML(byId(id))).join("");
  document.getElementById("gridO2C").innerHTML = ORDER_O2C.map(id => cardHTML(byId(id))).join("");
  document.querySelectorAll(".card").forEach(c => {
    c.addEventListener("click", () => sel(c.dataset.id));
    c.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); sel(c.dataset.id); } });
  });

  /* --- compteurs --- */
  const sm = document.getElementById("stMod"), sv = document.getElementById("stVid");
  if(sm) sm.textContent = M.length;
  if(sv) sv.textContent = TOTV;
  document.getElementById("dockBadge").textContent = TOTV;
  document.getElementById("yr").textContent = new Date().getFullYear();

  /* --- zoom --- */
  let z0 = 1;
  try{ const st = localStorage.getItem("fx-wheel-zoom3"); if(st) z0 = parseFloat(st) || 1; }catch(e){}
  setZoom(z0, false);


  /* --- redimensionnement --- */
  let rt = null;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => setZoom(zoom, false), 80); };
  window.addEventListener("resize", onResize, {passive:true});
  window.addEventListener("orientationchange", onResize);
  /* on n'observe QUE les deux blocs de texte : leur hauteur peut changer (retour
     à la ligne, chargement des polices) mais ne dépend jamais de la roue.
     Observer la scène elle-même rouvrirait une boucle de rétroaction. */
  /* on n'observe que le menu : sa hauteur peut changer (compactage au défilement)
     et c'est la seule chose au-dessus de la roue. */
  if(window.ResizeObserver){
    const ro = new ResizeObserver(() => fitWheel());
    const h = document.getElementById("hdr");
    if(h) ro.observe(h);
  }
  fitWheel(); setTimeout(fitWheel, 120); setTimeout(fitWheel, 600);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fitWheel);

  /* --- header --- */
  const hdr = document.getElementById("hdr");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    hdr.classList.toggle("scrolled", window.scrollY > 10);
    /* le widget et la flèche n'apparaissent qu'une fois la grande roue dépassée */
    const past = window.scrollY > (stageEl.offsetHeight * 0.55);
    dock.classList.toggle("on", past);
    toTop.classList.toggle("on", past);
    if(!past && dock.classList.contains("open")) dockClose();
  };
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  toTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  /* --- interactions du widget --- */
  const dockBtn = document.getElementById("dockBtn");
  dockBtn.addEventListener("click", e => { e.stopPropagation(); dockToggle(); });
  /* un clic dans le vide autour de la roue la referme (indispensable au tactile,
     puisque la bulle s'efface pendant que la roue est déployée) */
  const dockWheelEl = document.getElementById("dockWheel");
  dockWheelEl.addEventListener("click", e => {
    if(e.target === dockWheelEl || e.target.id === "miniWheel") dockClose();
  });
  if(!isTouch){
    dock.addEventListener("mouseenter", () => { clearTimeout(dockHoverTimer); dockHoverTimer = setTimeout(dockOpen, 130); });
    dock.addEventListener("mouseleave", () => { clearTimeout(dockHoverTimer); dockHoverTimer = setTimeout(dockClose, 420); });
  }
  document.addEventListener("click", e => {
    if(dock.classList.contains("open") && !dock.contains(e.target)) dockClose();
  });

  /* --- clavier --- */
  document.addEventListener("keydown", e => {
    if(e.key === "Escape"){
      if(dock.classList.contains("open")) { dockClose(); return; }
      if(current) closePanel();
    }
    if(!current) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if(tag === "input" || tag === "textarea" || tag === "select") return;
    const i = ALL_ORDER.indexOf(current);
    if(e.key === "ArrowRight"){ e.preventDefault(); sel(ALL_ORDER[(i+1)%ALL_ORDER.length], {keepPlace:true, focus:false}); }
    if(e.key === "ArrowLeft"){ e.preventDefault(); sel(ALL_ORDER[(i-1+ALL_ORDER.length)%ALL_ORDER.length], {keepPlace:true, focus:false}); }
  });

  /* --- lien profond index.html#m=ap --- */
  const h = location.hash.match(/m=([a-z]+)/);
  if(h && byId(h[1])) setTimeout(() => sel(h[1], {play:false}), 450);

  loadHubspot();
})();
