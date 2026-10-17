/* fx-syn.js : espace Synergies refondu en univers plein cadre (16 octobre 2026).
   Le schéma d'origine (modules alignés, flux en arcs, pastilles de code, barre IA) est conservé tel quel :
   seules la mise en scène et l'ergonomie changent.
     - le canevas occupe tout le cadre, on y zoome et on s'y déplace librement (molette, glisser, pincement) ;
     - les commandes flottent dans l'univers, il n'y a plus de console ni de sections empilées autour ;
     - un clic sur un module le sélectionne : la caméra cadre son voisinage et toutes ses interactions
       s'allument, les autres s'estompent ; sa fiche s'ouvre en carte flottante ;
     - par défaut, toutes les synergies sont affichées ; « majeures » est un filtre optionnel ;
     - mini-carte et bouton de recentrage servent de filet : on ne peut pas se perdre.
   Voir SPEC.md, sections 2 et 3. */
(function () {
"use strict";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));

/* ---------- état ---------- */
var NAV = {suite: null, mod: null, syn: null, fam: "all", scope: "all", search: "", fs: false, sheet: false, studioMod: null, fdir: "all", searchOpen: false};
var CAM = {k: 1, tx: 0, ty: 0, px: 1, vis: {x: 0, y: 0, w: 1240, h: 720},
           safe: {x: 0, y: 0, w: 1240, h: 720, cx: 620, cy: 360}, anim: null};
/* marges en pixels réservées au HUD : la caméra ne cadre que ce qui reste visible */
const INS = {t: 24, r: 16, b: 60, l: 16};

const NV = {W: 1240, H: 720, Y: 320, R: 56};
const KMIN = 0.6, KMAX = 4.5;

const navReduce = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const elWork = () => document.getElementById("nvWork");
const elSvg = () => document.getElementById("nvSvg");
function navQA(...sels){ return sels.reduce((a, q) => a.concat([...document.querySelectorAll(q)]), []); }
function navMods(S){ return S.order.map(byId).filter(Boolean); }
function navAcr(S, id){ return (S && S.acr && S.acr[id]) || String(id || "").toUpperCase(); }
const curS = () => SUITES[NAV.suite];

/* ---------- géométrie du schéma de flux (inchangée : zéro collision sur 22 flux) ---------- */
function navX(S, i){ const n = S.order.length; return 115 + i * (1010 / (n - 1)); }
function navGeom(S){
  const idx = {}; S.order.forEach((id, i) => idx[id] = i);
  const used = {};
  const pt = (id, side, dir) => {
    const k = id + "_" + side + "_" + dir;
    const c = used[k] = (used[k] || 0) + 1;
    const o = dir * Math.min(44, 6 + 10 * (c - 1) + 5);
    const x = navX(S, idx[id]) + o;
    const dy = Math.sqrt(Math.max(100, NV.R * NV.R - o * o));
    return [x, side === "up" ? NV.Y - dy : NV.Y + dy];
  };
  return S.syn.map(s => {
    const dir = idx[s.to] > idx[s.from] ? 1 : -1;
    const [x1, y1] = pt(s.from, s.side, dir);
    const [x2, y2] = pt(s.to, s.side, -dir);
    const span = Math.abs(idx[s.to] - idx[s.from]);
    const lvl = typeof s.lvl === "number" ? s.lvl : span;
    const h = (36 + 44 * lvl) * (s.side === "up" ? -1 : 1);
    const cy1 = y1 + h, cy2 = y2 + h;
    const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} C${x1.toFixed(1)} ${cy1.toFixed(1)} ${x2.toFixed(1)} ${cy2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    const t = typeof s.tp === "number" ? s.tp : 0.5;
    const u = 1 - t;
    const mx = (u*u*u)*x1 + 3*(u*u)*t*x1 + 3*u*(t*t)*x2 + (t*t*t)*x2;
    const my = (u*u*u)*y1 + 3*(u*u)*t*cy1 + 3*u*(t*t)*cy2 + (t*t*t)*y2;
    return {s, d, mx, my, x1, y1, x2, y2};
  });
}
let GEO = null;
const geoOf = n => (GEO || []).find(g => g.s.n === n);

function navLines(t){
  if(t.length <= 12 || t.indexOf(" ") < 0) return [t];
  const w = t.split(" "); let best = [t], bd = 99;
  for(let k = 1; k < w.length; k++){ const a = w.slice(0, k).join(" "), b = w.slice(k).join(" "), d = Math.abs(a.length - b.length); if(d < bd){ bd = d; best = [a, b]; } }
  return best;
}

/* ---------- dessin du schéma, rangé dans le groupe caméra ---------- */
function navDiagram(S){
  const g = GEO = navGeom(S);
  const marks = Object.entries(SUITE_FAM).map(([k, f]) =>
    `<marker id="nvA-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${f.c}"/></marker>`).join("");
  const paths = g.map(({s, d}) => {
    const c = SUITE_FAM[s.fam].c;
    return `<g class="nv-syn" data-syn="${s.n}" data-fam="${s.fam}" data-from="${s.from}" data-to="${s.to}" data-core="${s.core ? '1' : '0'}" data-side="${s.side}" style="--fc:${c}">
      <path class="nv-hit" d="${d}"/>
      <path class="nv-base" d="${d}" stroke="${c}" marker-end="url(#nvA-${s.fam})"/>
      <path class="nv-flow" d="${d}" stroke="${c}"/>
    </g>`; }).join("");
  const badges = g.map(({s, mx, my}) => {
    const c = SUITE_FAM[s.fam].c;
    const pw = Math.max(64, Math.round(s.n.length * 7.2 + 28));
    const ph = 24;
    const rx = mx - pw / 2, ry = my - ph / 2;
    const plusX = mx + pw / 2 - 11;
    const textX = mx - 6;
    return `<g class="nv-badge" data-syn="${s.n}" data-fam="${s.fam}" data-from="${s.from}" data-to="${s.to}" data-core="${s.core ? '1' : '0'}" data-side="${s.side}" data-mx="${mx.toFixed(1)}" data-my="${my.toFixed(1)}" style="--fc:${c}" role="button" tabindex="0" aria-label="${esc(s.n + " : " + s.t + " (cliquer pour ouvrir le détail)")}">
      <rect class="nv-bpill" x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${pw}" height="${ph}" rx="12"/>
      <text class="nv-bcode" x="${textX.toFixed(1)}" y="${(my + 4).toFixed(1)}">${s.n}</text>
      <circle class="nv-bplus" cx="${plusX.toFixed(1)}" cy="${my.toFixed(1)}" r="7.5"/>
      <text class="nv-bplus-t" x="${plusX.toFixed(1)}" y="${(my + 3.8).toFixed(1)}">+</text></g>`; }).join("");
  const nodes = navMods(S).map((m, i) => {
    const x = navX(S, i), y = NV.Y, nm = S.short_name[m.id] || m.label, acr = navAcr(S, m.id);
    const synCnt = S.syn.filter(s => s.from === m.id || s.to === m.id).length;
    return `<g class="nv-node" data-id="${m.id}" style="--c:${m.c};--d:${(i * 0.07).toFixed(2)}s" role="button" tabindex="0" aria-label="${esc(m.label)} (${acr}) : ${esc(S.role[m.id] || "")}, ${synCnt} interactions. Cliquer pour les afficher.">
      <circle class="nv-glow" cx="${x}" cy="${y}" r="${NV.R + 14}"/>
      <circle class="nv-orbit" cx="${x}" cy="${y}" r="${NV.R + 6}" style="--od:${(i * 0.4).toFixed(1)}s"/>
      <circle class="nv-disc" cx="${x}" cy="${y}" r="${NV.R}"/>
      <circle class="nv-tint" cx="${x}" cy="${y}" r="${NV.R - 8}"/>
      <text class="nv-num" x="${x}" y="${y - 31}">${String(i + 1).padStart(2, "0")} · ${acr}</text>
      <text class="nv-ico" x="${x}" y="${y + 2}">${m.icon}</text>
      ${navLines(nm).map((l, k, L) => `<text class="nv-nm${l.length > 11 ? " sm" : ""}" x="${x}" y="${(y + (L.length > 1 ? 20 : 24) + k * 13)}">${esc(l)}</text>`).join("")}
      <g class="nv-ncnt" transform="translate(${x + NV.R - 10},${y - NV.R + 10})">
        <circle r="11" fill="${m.c}"/>
        <text y="3.5" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff" font-family="Barlow,sans-serif">${synCnt}</text>
      </g>
    </g>`; }).join("");
  const n = S.order.length, bx = navX(S, 0) - 70, bw = navX(S, n - 1) - navX(S, 0) + 140;
  const dots = S.order.map((id, i) => `<circle class="nv-aidot" cx="${navX(S, i)}" cy="${NV.H - 46}" r="4.5" style="--d:${(i * .3).toFixed(1)}s"/>`).join("");
  const ai = `<g class="nv-ai" role="button" tabindex="0" aria-label="${esc(S.ai.t)}">
      <rect x="${bx}" y="${NV.H - 72}" width="${bw}" height="50" rx="25"/>
      ${dots}
      <text x="${NV.W / 2}" y="${NV.H - 31}">${esc(S.ai.t)} · cliquer pour le détail</text></g>`;
  return `<svg class="nv-sky" id="nvSvg" viewBox="0 0 ${NV.W} ${NV.H}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Univers des flux et synergies de la suite ${esc(S.name)}">
    <defs>${marks}</defs>
    <rect class="nv-void" x="${-6 * NV.W}" y="${-6 * NV.H}" width="${13 * NV.W}" height="${13 * NV.H}" fill="#fff" fill-opacity="0"/>
    <g id="nvCam">${paths}${ai}${nodes}${badges}<g id="nvComets"></g></g></svg>`;
}

/* =====================================================================
   CAMÉRA : zoom et déplacement libres, recentrage, mini-carte
   Le monde est le repère du schéma (0..1240 x 0..720).
   Le groupe #nvCam porte translate(tx ty) scale(k) ; comme le cadrage SVG est
   xMidYMid, le centre visible tombe toujours sur le centre du viewBox.
   ===================================================================== */
function camMesure(){
  const svg = elSvg(); if(!svg) return false;
  const r = svg.getBoundingClientRect();
  if(r.width < 2 || r.height < 2) return false;
  const s = Math.min(r.width / NV.W, r.height / NV.H);
  CAM.px = s;
  CAM.vis = {x: NV.W / 2 - r.width / (2 * s), y: NV.H / 2 - r.height / (2 * s), w: r.width / s, h: r.height / s};
  /* la fiche flottante mange de la place à droite : la caméra en tient compte */
  const flo = document.getElementById("nvFloat");
  const fw = flo && !flo.hidden ? Math.min(flo.getBoundingClientRect().width + 22, r.width * .46) : 0;
  const sx = CAM.vis.x + INS.l / s, sy = CAM.vis.y + INS.t / s;
  const sw = Math.max(90, CAM.vis.w - (INS.l + INS.r + fw) / s);
  const sh = Math.max(90, CAM.vis.h - (INS.t + INS.b) / s);
  CAM.safe = {x: sx, y: sy, w: sw, h: sh, cx: sx + sw / 2, cy: sy + sh / 2};
  return true;
}
function camApply(){
  const g = document.getElementById("nvCam");
  if(g) g.setAttribute("transform", `translate(${CAM.tx.toFixed(2)} ${CAM.ty.toFixed(2)}) scale(${CAM.k.toFixed(4)})`);
  const w = elWork();
  if(w){
    w.style.setProperty("--gs", (26 * CAM.k * CAM.px).toFixed(2) + "px");
    w.style.setProperty("--gx", ((CAM.tx - CAM.vis.x) * CAM.px).toFixed(1) + "px");
    w.style.setProperty("--gy", ((CAM.ty - CAM.vis.y) * CAM.px).toFixed(1) + "px");
  }
  camMini();
  const z = document.getElementById("nvZoomLbl");
  if(z) z.textContent = Math.round(CAM.k * 100) + " %";
}
/* point écran -> repère du viewBox */
function camVB(clientX, clientY){
  const svg = elSvg(); if(!svg) return {x: NV.W / 2, y: NV.H / 2};
  const r = svg.getBoundingClientRect();
  const s = Math.min(r.width / NV.W, r.height / NV.H) || 1;
  return {x: CAM.vis.x + (clientX - r.left) / s, y: CAM.vis.y + (clientY - r.top) / s};
}
function camStop(){
  if(CAM.anim){ cancelAnimationFrame(CAM.anim); CAM.anim = null; }
  if(CAM.fin){ clearTimeout(CAM.fin); CAM.fin = null; }
}
function camZoomAt(clientX, clientY, k2){
  camStop();
  k2 = Math.max(KMIN, Math.min(KMAX, k2));
  const vb = camVB(clientX, clientY);
  const wx = (vb.x - CAM.tx) / CAM.k, wy = (vb.y - CAM.ty) / CAM.k;
  CAM.tx = vb.x - k2 * wx; CAM.ty = vb.y - k2 * wy; CAM.k = k2;
  camApply();
}
function camGo(k, tx, ty, dur){
  k = Math.max(KMIN, Math.min(KMAX, k));
  camStop();
  if(navReduce() || dur === 0){ CAM.k = k; CAM.tx = tx; CAM.ty = ty; camApply(); return; }
  const k0 = CAM.k, x0 = CAM.tx, y0 = CAM.ty, t0 = (window.performance || Date).now(), d = dur || 640;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = now => {
    const p = Math.min(1, (now - t0) / d), e = ease(p);
    CAM.k = k0 + (k - k0) * e; CAM.tx = x0 + (tx - x0) * e; CAM.ty = y0 + (ty - y0) * e;
    camApply();
    CAM.anim = p < 1 ? requestAnimationFrame(step) : null;
  };
  CAM.anim = requestAnimationFrame(step);
  /* filet : si le navigateur suspend ses images (onglet masqué, rendu sans fenêtre),
     la caméra arrive quand même à destination au lieu de rester à mi-chemin. */
  CAM.fin = setTimeout(() => {
    CAM.fin = null;
    if(CAM.anim){ cancelAnimationFrame(CAM.anim); CAM.anim = null; }
    CAM.k = k; CAM.tx = tx; CAM.ty = ty; camApply();
  }, d + 90);
}
function camCadre(x, y, w, h, pad, kmax, dur){
  if(!camMesure()) return;
  const Z = CAM.safe;
  const p = pad == null ? 30 : pad;
  const k = Math.max(KMIN, Math.min(kmax || KMAX, Math.min(Z.w / (w + 2 * p), Z.h / (h + 2 * p))));
  const cx = x + w / 2, cy = y + h / 2;
  camGo(k, Z.cx - k * cx, Z.cy - k * cy, dur);
}
function camRecentre(dur){ camCadre(0, 0, NV.W, NV.H, 0, 1.35, dur); }

/* cadre le module et l'ensemble de ses interactions visibles */
function camSurModule(S, id, dur){
  const pts = [[navX(S, S.order.indexOf(id)), NV.Y]];
  (GEO || []).forEach(g => {
    if(g.s.from !== id && g.s.to !== id) return;
    if(!navSynVisible(g.s)) return;
    pts.push([g.x1, g.y1], [g.x2, g.y2], [g.mx, g.my]);
  });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  pts.forEach(([px, py]) => { x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py); });
  x0 -= NV.R + 14; x1 += NV.R + 14; y0 -= NV.R + 14; y1 += NV.R + 14;
  camCadre(x0, y0, Math.max(120, x1 - x0), Math.max(120, y1 - y0), 34, 2.4, dur);
}

/* mini-carte : repères des modules et rectangle du champ de vision */
function navMiniHTML(S){
  const dots = navMods(S).map((m, i) => `<circle cx="${navX(S, i)}" cy="${NV.Y}" r="30" fill="${m.c}" opacity=".5"/>`).join("");
  return `<svg viewBox="0 0 ${NV.W} ${NV.H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect class="nv-mini-world" x="4" y="4" width="${NV.W - 8}" height="${NV.H - 8}" rx="30"/>
    ${dots}
    <rect class="nv-mini-vp" id="nvMiniVp" x="0" y="0" width="${NV.W}" height="${NV.H}"/></svg>`;
}
function camMini(){
  const vp = document.getElementById("nvMiniVp"); if(!vp) return;
  /* borné au monde : le cadre reste lisible même quand on voit plus large que le schéma */
  const x0 = Math.max(0, (CAM.vis.x - CAM.tx) / CAM.k), y0 = Math.max(0, (CAM.vis.y - CAM.ty) / CAM.k);
  const x1 = Math.min(NV.W, (CAM.vis.x + CAM.vis.w - CAM.tx) / CAM.k);
  const y1 = Math.min(NV.H, (CAM.vis.y + CAM.vis.h - CAM.ty) / CAM.k);
  vp.setAttribute("x", x0.toFixed(1)); vp.setAttribute("y", y0.toFixed(1));
  vp.setAttribute("width", Math.max(4, x1 - x0).toFixed(1));
  vp.setAttribute("height", Math.max(4, y1 - y0).toFixed(1));
}

/* =====================================================================
   FILTRES ET MISE EN LUMIÈRE
   ===================================================================== */
function navSynVisible(s){
  if(NAV.fam !== "all" && s.fam !== NAV.fam) return false;
  if(NAV.search){
    const q = NAV.search.toLowerCase();
    const hay = (s.n + " " + s.t + " " + s.p + " " + (s.d || []).join(" ")).toLowerCase();
    if(hay.indexOf(q) === -1) return false;
  }
  /* un module sélectionné montre l'ensemble de ses interactions, y compris hors périmètre « majeures » */
  if(NAV.mod && (s.from === NAV.mod || s.to === NAV.mod)) return true;
  if(NAV.scope === "core" && !s.core) return false;
  return true;
}

/* met en lumière : fn(type, valeur) -> vrai si l'élément reste allumé */
function navLight(fn){
  const w = elWork(); if(!w) return;
  const on = !!fn;
  w.classList.toggle("nv-hl", on);
  navQA(".nv-syn", ".nv-badge", ".nv-fsyn").forEach(e => e.classList.toggle("lit", on && fn("syn", e.dataset.syn)));
  document.querySelectorAll(".nv-node").forEach(e => e.classList.toggle("lit", on && fn("node", e.dataset.id)));
}
function navSynLight(n){
  const S = curS(); const s = S && S.syn.find(x => x.n === n); if(!s) return navLight(null);
  navLight((t, v) => t === "syn" ? v === n : (v === s.from || v === s.to));
}
function navModLight(id){
  const S = curS(); if(!S) return;
  const ns = S.syn.filter(s => (s.from === id || s.to === id) && navSynVisible(s)).map(s => s.n);
  navLight((t, v) => t === "syn" ? ns.includes(v) : (v === id || S.syn.some(s => ns.includes(s.n) && (s.from === v || s.to === v))));
  navComets(ns);
}
/* état au repos : la sélection en cours commande l'éclairage */
function navRest(){
  if(NAV.syn) navSynLight(NAV.syn);
  else if(NAV.mod) navModLight(NAV.mod);
  else { navLight(null); navComets(null); }
  navTip(null);
}

/* comètes le long des flux allumés (dégradé silencieux si le navigateur ne gère pas offset-path) */
let _comets = null;
function navComets(codes){
  const layer = document.getElementById("nvComets"); if(!layer) return;
  if(_comets === null) _comets = !!(window.CSS && CSS.supports && CSS.supports("offset-path", 'path("M0 0L1 1")'));
  if(!_comets || navReduce() || !codes || !codes.length){ if(layer.innerHTML) layer.innerHTML = ""; return; }
  const parts = [];
  codes.slice(0, 12).forEach((n, i) => {
    const g = geoOf(n); if(!g) return;
    parts.push(`<circle class="nv-comet" r="5" fill="${SUITE_FAM[g.s.fam].c}" style="offset-path:path('${g.d}');animation-delay:${(i * 0.17).toFixed(2)}s"/>`);
  });
  layer.innerHTML = parts.join("");
}

function navApplyFilters(){
  const S = curS(); if(!S) return;
  let count = 0;
  const vis = {};
  S.syn.forEach(s => { if(navSynVisible(s)){ vis[s.n] = true; count++; } });

  navQA(".nv-syn", ".nv-badge", ".nv-fsyn").forEach(e => {
    if(e.dataset.syn === "IA") return;
    e.classList.toggle("off", !vis[e.dataset.syn]);
  });
  document.querySelectorAll(".nv-node").forEach(n => n.classList.toggle("sel", n.dataset.id === NAV.mod));
  document.querySelectorAll(".nv-scope-btn").forEach(b => b.classList.toggle("on", b.dataset.scope === NAV.scope));
  document.querySelectorAll(".nv-fam").forEach(b => b.classList.toggle("on", b.dataset.fam === NAV.fam));

  const cnt = document.getElementById("nvVisCnt");
  if(cnt) cnt.textContent = count + " / " + S.syn.length;

  const actif = NAV.fam !== "all" || NAV.scope !== "all" || !!NAV.search || !!NAV.mod || !!NAV.syn;
  const reset = document.getElementById("nvResetBtn");
  if(reset) reset.hidden = !actif;

  navRest();
}

/* =====================================================================
   FICHES FLOTTANTES
   ===================================================================== */
function navFloatClose(){
  const f = document.getElementById("nvFloat");
  if(f){ f.hidden = true; f.innerHTML = ""; }
}
function navFloatShow(html){
  const f = document.getElementById("nvFloat"); if(!f) return;
  f.innerHTML = html;
  f.hidden = false;
  f.querySelectorAll("[data-syn]").forEach(b => {
    b.addEventListener("click", () => navSynSelect(b.dataset.syn));
    b.addEventListener("mouseenter", () => { navSynLight(b.dataset.syn); navComets([b.dataset.syn]); navSynTip(b.dataset.syn, b); });
    b.addEventListener("mouseleave", navRest);
  });
  f.querySelectorAll("[data-go-mod]").forEach(b => b.addEventListener("click", () => navGoModule(b.dataset.goMod)));
  f.querySelectorAll("[data-pick-mod]").forEach(b => b.addEventListener("click", () => navModSelect(b.dataset.pickMod)));
  f.querySelectorAll("[data-studio]").forEach(b => b.addEventListener("click", () => navSheetOpen(b.dataset.studio)));
  f.querySelectorAll("[data-close-float]").forEach(b => b.addEventListener("click", () => navClear()));
}

/* Pastille compacte : le détail vit sur le schéma, la fiche n'en est que l'index.
   Survol = le flux s'allume et son titre s'affiche ; clic = fiche complète de la synergie. */
function navSynChip(S, s, fromId){
  const other = fromId ? (s.from === fromId ? s.to : s.from) : null;
  return `<button type="button" class="nv-fsyn" data-syn="${s.n}" style="--fc:${SUITE_FAM[s.fam].c}" aria-label="${esc(s.n + " : " + s.t)}">
    <em>${s.n}</em>${other ? `<i>${esc(navAcr(S, other))}</i>` : ""}</button>`;
}

function navModCardHTML(S, id){
  const m = byId(id); if(!m) return "";
  const acr = navAcr(S, id);
  const ins = S.syn.filter(s => s.to === id && navSynVisible(s));
  const outs = S.syn.filter(s => s.from === id && navSynVisible(s));
  const tot = ins.length + outs.length;
  return `<article class="nv-fcard nv-fcard--mod" style="--c:${m.c}">
    <header class="nv-fhead">
      <span class="nv-fico">${m.icon}</span>
      <div class="nv-fttl"><em>${acr} · module sélectionné</em><b>${esc(S.short_name[id] || m.label)}</b></div>
      <button type="button" class="nv-fx" data-close-float="1" title="Tout réafficher (Échap)">✕</button>
    </header>
    <p class="nv-frole">${esc(S.role[id] || "")}</p>
    <p class="nv-fcount"><b>${tot}</b> interaction${tot > 1 ? "s" : ""} avec les autres modules de la suite ${esc(S.name)}</p>
    <div class="nv-flist">
      ${outs.length ? `<div class="nv-fgrp"><small>↑ Alimente en aval (${outs.length})</small><div class="nv-fchips">${outs.map(s => navSynChip(S, s, id)).join("")}</div></div>` : ""}
      ${ins.length ? `<div class="nv-fgrp"><small>↓ Reçoit en amont (${ins.length})</small><div class="nv-fchips">${ins.map(s => navSynChip(S, s, id)).join("")}</div></div>` : ""}
      ${tot ? `<p class="nv-ftip">Survolez un code pour le suivre sur le schéma, cliquez pour sa fiche complète.</p>`
            : `<p class="nv-fempty">Aucune interaction ne correspond aux filtres en cours.</p>`}
    </div>
    <footer class="nv-facts">
      <button type="button" class="nv-fbtn ghost" data-studio="${id}">⚖️ Seul vs en synergie</button>
      <button type="button" class="nv-fbtn solid" data-go-mod="${id}" style="--c:${m.c}">Ouvrir la fiche ${acr} ›</button>
    </footer>
  </article>`;
}

function navSynCardHTML(S, s){
  const fam = SUITE_FAM[s.fam];
  const route = s.from ? `${esc(byId(s.from).label)} (${navAcr(S, s.from)}) <i>→</i> ${esc(byId(s.to).label)} (${navAcr(S, s.to)})` : "";
  const gos = [s.from, s.to].filter(Boolean).map(id => byId(id)).map(m =>
    `<button type="button" class="nv-fbtn solid" data-go-mod="${m.id}" style="--c:${m.c}">${m.icon} ${navAcr(S, m.id)} ›</button>`).join("");
  const picks = [s.from, s.to].filter(Boolean).map(id =>
    `<button type="button" class="nv-fpick" data-pick-mod="${id}" style="--c:${byId(id).c}">${byId(id).icon} ${navAcr(S, id)}</button>`).join("");
  return `<article class="nv-fcard nv-fcard--syn" style="--fc:${fam.c}">
    <header class="nv-fhead">
      <div class="nv-fttl"><em><b class="nv-fcode">${s.n}</b> ${esc(fam.n)}${s.st ? " · " + esc(SUITE_STATUS[s.st]) : ""}</em><b>${esc(s.t)}</b></div>
      <button type="button" class="nv-fx" data-close-float="1" title="Tout réafficher (Échap)">✕</button>
    </header>
    ${route ? `<p class="nv-fpath">${route}</p>` : ""}
    <div class="nv-flist">
      <p class="nv-fp">${esc(s.p)}</p>
      <ul class="nv-ful">${(s.d || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      ${s.note ? `<p class="nv-fnote">${esc(s.note)}</p>` : ""}
    </div>
    ${picks ? `<div class="nv-fpicks"><small>Voir toutes les interactions de :</small>${picks}</div>` : ""}
    <footer class="nv-facts">${gos}</footer>
  </article>`;
}

/* =====================================================================
   SÉLECTION
   ===================================================================== */
function navModSelect(id, instant){
  const S = curS(); if(!S || !byId(id)) return;
  if(NAV.mod === id && !NAV.syn){ navClear(); return; }
  NAV.mod = id;
  NAV.syn = null;
  NAV.studioMod = id;
  navTip(null);
  navApplyFilters();
  navFloatShow(navModCardHTML(S, id));
  camSurModule(S, id, instant ? 0 : undefined);
}

function navSynSelect(n){
  const S = curS(); if(!S) return;
  if(n && NAV.syn === n){
    NAV.syn = null;
    navApplyFilters();
    if(NAV.mod) navFloatShow(navModCardHTML(S, NAV.mod)); else navFloatClose();
    return;
  }
  const s = n === "IA" ? Object.assign({n: "IA", fam: "ai", from: null, to: null, st: null}, S.ai) : S.syn.find(x => x.n === n);
  if(!s) return;
  NAV.syn = s.n;
  navTip(null);
  navApplyFilters();
  navFloatShow(navSynCardHTML(S, s));
  if(s.n === "IA"){ navLight((t) => t === "node"); return; }
  navSynLight(n);
  navComets([n]);
  const g = geoOf(n);
  if(g){
    /* on cadre le flux avec ses deux modules, pour garder le contexte */
    const xs = [g.x1, g.x2, g.mx], ys = [g.y1, g.y2, g.my];
    [s.from, s.to].forEach(id => { const i = S.order.indexOf(id); if(i >= 0){ xs.push(navX(S, i)); ys.push(NV.Y); } });
    const x0 = Math.min(...xs) - NV.R - 20, x1 = Math.max(...xs) + NV.R + 20;
    const y0 = Math.min(...ys) - NV.R - 20, y1 = Math.max(...ys) + NV.R + 20;
    camCadre(x0, y0, x1 - x0, y1 - y0, 26, 1.7);
  }
}

function navClear(){
  NAV.mod = null; NAV.syn = null;
  navFloatClose();
  navApplyFilters();
  camRecentre();
}
function navResetAll(){
  NAV.fam = "all"; NAV.scope = "all"; NAV.search = "";
  const sIn = document.getElementById("nvSearchIn"); if(sIn) sIn.value = "";
  navClear();
}

/* ---------- infobulle ---------- */
function navTip(html, el, forceBelow){
  const tip = document.getElementById("nvTip"); if(!tip) return;
  if(!html || !el){ tip.hidden = true; return; }
  const work = elWork();
  tip.innerHTML = html;
  tip.hidden = false;
  const myAttr = el.dataset && el.dataset.my ? parseFloat(el.dataset.my) : null;
  const isUp = el.dataset && el.dataset.side === "up";
  const below = typeof forceBelow === "boolean" ? forceBelow : (isUp || (myAttr !== null && myAttr < NV.Y));
  tip.classList.toggle("below", below);
  if(work && el.getBoundingClientRect){
    const wr = work.getBoundingClientRect(), r = el.getBoundingClientRect();
    const x = r.left + r.width / 2 - wr.left;
    tip.style.left = Math.max(160, Math.min(wr.width - 160, x)) + "px";
    tip.style.top = Math.max(10, Math.min(wr.height - 10, (below ? r.bottom : r.top) - wr.top)) + "px";
  }
}
function navSynTip(n, el){
  const S = curS(), s = S && S.syn.find(x => x.n === n); if(!s) return;
  navTip(`<em style="--fc:${SUITE_FAM[s.fam].c}">${s.n} · ${esc(SUITE_FAM[s.fam].n)} · ${esc(SUITE_STATUS[s.st])}</em><b>${esc(s.t)}</b><span>${esc(s.p)}</span><small class="nv-tip-cta">Cliquer pour ouvrir la fiche</small>`, el);
}
function navModTip(id, el){
  const S = curS(), m = byId(id); if(!m) return;
  const cnt = S.syn.filter(s => s.from === id || s.to === id).length;
  navTip(`<em style="--fc:${m.c}">${navAcr(S, id)} · ${esc(S.short_name[id] || m.label)}</em><b>${esc(S.role[id] || "")}</b><span>Cliquer pour afficher ses ${cnt} interactions</span>`, el, false);
}

/* =====================================================================
   SURIMPRESSION « SEUL VS EN SYNERGIE » (studio, contenu d'origine)
   ===================================================================== */
function navFormatPitchItem(item){
  if(typeof item === "string") return `<li>${esc(item)}</li>`;
  return `<li><b>${esc(item.k)}</b><span>${esc(item.d)}</span></li>`;
}
function navStudioHTML(S, id){
  const m = byId(id), p = S.pitch && S.pitch[id], acr = navAcr(S, id);
  if(!m || !p) return `<p class="nv-fempty">Argumentaire non disponible pour ce module.</p>`;
  const ins = S.syn.filter(s => s.to === id), outs = S.syn.filter(s => s.from === id);
  const tabs = S.order.map(i => {
    const tm = byId(i), on = i === id;
    return `<button type="button" class="nv-st-tab${on ? " on" : ""}" data-st-mod="${i}" style="--c:${tm.c}" title="${esc(tm.label)}">
      <span class="nv-st-ico">${tm.icon}</span><b>${navAcr(S, i)}</b></button>`;
  }).join("");
  const pills = l => l.map(s => `<button type="button" class="nv-st-pill" data-st-syn="${s.n}" style="--fc:${SUITE_FAM[s.fam].c}"><em>${s.n}</em><span>${esc(s.t)}</span></button>`).join("");
  return `<div class="nv-sheet-box" style="--c:${m.c}">
    <header class="nv-sheet-head">
      <div><span class="nv-k"><i></i>Positionnement commercial</span>
        <h4>${m.icon} ${esc(S.short_name[id] || m.label)} (${acr}) : seul ou dans la suite ${esc(S.name)} ?</h4></div>
      <button type="button" class="nv-fx" id="nvSheetClose" title="Fermer (Échap)">✕</button>
    </header>
    <div class="nv-st-tabs" role="tablist" aria-label="Choisir le module">${tabs}</div>
    <div class="nv-st-duel">
      <section class="nv-st-side solo">
        <header class="nv-st-shead"><span class="nv-st-badge solo">1 · Seul (Standalone)</span>
          <h5>Déployé seul sur votre ERP</h5></header>
        <ul class="nv-st-list">${p.solo.map(navFormatPitchItem).join("")}</ul>
        ${p.limit ? `<div class="nv-st-limit"><strong>Frontière en mode seul :</strong> ${esc(p.limit)}</div>` : ""}
      </section>
      <div class="nv-st-bridge" aria-hidden="true"><div class="nv-st-bcircle" style="background:${m.c}">+${ins.length + outs.length}</div><span>synergies</span></div>
      <section class="nv-st-side syn">
        <header class="nv-st-shead"><span class="nv-st-badge syn">2 · En synergie</span>
          <h5>Combiné aux autres modules de la suite</h5></header>
        <ul class="nv-st-list">${p.syn.map(navFormatPitchItem).join("")}</ul>
        <div class="nv-st-flows">
          ${outs.length ? `<div class="nv-st-fgrp"><small>↑ Alimente en aval (${outs.length})</small><div class="nv-st-fpills">${pills(outs)}</div></div>` : ""}
          ${ins.length ? `<div class="nv-st-fgrp"><small>↓ Reçoit en amont (${ins.length})</small><div class="nv-st-fpills">${pills(ins)}</div></div>` : ""}
        </div>
        ${p.upsell ? `<div class="nv-st-upsell"><strong>💡 ${esc(p.upsell)}</strong></div>` : ""}
      </section>
    </div>
    <footer class="nv-sheet-foot">
      <button type="button" class="nv-fbtn solid" data-go-mod="${id}" style="--c:${m.c}">Ouvrir la fiche ${acr} ›</button>
    </footer>
  </div>`;
}
function navSheetOpen(id){
  const S = curS(); if(!S) return;
  const sheet = document.getElementById("nvSheet"); if(!sheet) return;
  NAV.studioMod = id; NAV.sheet = true;
  sheet.innerHTML = navStudioHTML(S, id);
  sheet.hidden = false;
  const close = document.getElementById("nvSheetClose");
  if(close) close.addEventListener("click", navSheetClose);
  sheet.querySelectorAll("[data-st-mod]").forEach(b => b.addEventListener("click", () => navSheetOpen(b.dataset.stMod)));
  sheet.querySelectorAll("[data-st-syn]").forEach(b => b.addEventListener("click", () => { navSheetClose(); navSynSelect(b.dataset.stSyn); }));
  sheet.querySelectorAll("[data-go-mod]").forEach(b => b.addEventListener("click", () => navGoModule(b.dataset.goMod)));
}
function navSheetClose(){
  const sheet = document.getElementById("nvSheet"); if(!sheet) return;
  NAV.sheet = false; sheet.hidden = true; sheet.innerHTML = "";
}

/* ---------- plein écran ---------- */
function navToggleFs(force){
  const work = elWork(); const btn = document.getElementById("nvFsBtn");
  if(!work) return;
  NAV.fs = typeof force === "boolean" ? force : !NAV.fs;
  work.classList.toggle("nv-fs", NAV.fs);
  if(document.body) document.body.classList.toggle("nv-fs-lock", NAV.fs);
  if(btn){
    btn.textContent = NAV.fs ? "✕" : "⛶";
    btn.setAttribute("aria-label", NAV.fs ? "Quitter le plein écran" : "Plein écran");
    btn.classList.toggle("on", NAV.fs);
  }
  /* la zone change de taille : on remesure et on garde le même cadrage */
  requestAnimationFrame(() => {
    camMesure();
    if(NAV.mod) camSurModule(curS(), NAV.mod, 0);
    else if(NAV.syn) camApply();
    else camRecentre(0);
  });
}

function navGoModule(id){
  if(NAV.fs) navToggleFs(false);
  navSheetClose();
  FX.go("#/m/" + id);
}

/* =====================================================================
   ENTRÉES : souris, tactile, clavier
   ===================================================================== */
function navCible(ev){
  const t = ev.target;
  return t && t.closest ? t.closest(".nv-node, .nv-badge, .nv-syn, .nv-ai") : null;
}
function navActiver(cible){
  if(!cible){ if(NAV.mod || NAV.syn) navClear(); return; }
  if(cible.classList.contains("nv-node")) return navModSelect(cible.dataset.id);
  if(cible.classList.contains("nv-ai")) return navSynSelect("IA");
  const n = cible.dataset.syn;
  if(n) navSynSelect(n);
}

function camBind(){
  const svg = elSvg(); if(!svg) return;
  const pts = new Map();
  let base = null, moved = false, cible = null;

  const dist = () => {
    const a = [...pts.values()];
    return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
  };
  const mid = () => {
    const a = [...pts.values()];
    return {x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2};
  };

  svg.addEventListener("pointerdown", e => {
    if(e.pointerType === "mouse" && e.button !== 0) return;
    pts.set(e.pointerId, {x: e.clientX, y: e.clientY});
    try{ svg.setPointerCapture(e.pointerId); }catch(_){}
    if(pts.size === 1){
      moved = false;
      cible = navCible(e);
      base = {x: e.clientX, y: e.clientY, tx: CAM.tx, ty: CAM.ty};
    } else if(pts.size === 2){
      moved = true;
      base = {d: dist(), k: CAM.k, m: mid()};
    }
  });

  svg.addEventListener("pointermove", e => {
    if(!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if(pts.size === 2 && base && base.d){
      const d = dist(); if(d < 4) return;
      camZoomAt(base.m.x, base.m.y, base.k * (d / base.d));
      return;
    }
    if(pts.size !== 1 || !base) return;
    const dx = e.clientX - base.x, dy = e.clientY - base.y;
    if(!moved && Math.hypot(dx, dy) < 5) return;
    moved = true;
    svg.classList.add("nv-grab");
    camStop();
    CAM.tx = base.tx + dx / (CAM.px || 1);
    CAM.ty = base.ty + dy / (CAM.px || 1);
    camApply();
  });

  const fin = e => {
    if(!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    try{ svg.releasePointerCapture(e.pointerId); }catch(_){}
    if(pts.size > 0){ base = null; return; }
    svg.classList.remove("nv-grab");
    const c = cible, m = moved;
    base = null; cible = null; moved = false;
    if(!m) navActiver(c);
  };
  svg.addEventListener("pointerup", fin);
  svg.addEventListener("pointercancel", fin);

  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const unite = e.deltaMode === 1 ? 18 : (e.deltaMode === 2 ? 400 : 1);
    camZoomAt(e.clientX, e.clientY, CAM.k * Math.exp(-e.deltaY * unite * 0.0016));
  }, {passive: false});

  svg.addEventListener("dblclick", e => { if(!navCible(e)) camRecentre(); });

  /* survol : aperçu sans sélection */
  svg.addEventListener("mouseover", e => {
    const c = navCible(e); if(!c) return;
    if(c.classList.contains("nv-node")){ if(!NAV.syn) navModLight(c.dataset.id); navModTip(c.dataset.id, c); }
    else if(c.dataset.syn){ navSynLight(c.dataset.syn); if(c.classList.contains("nv-badge")) navSynTip(c.dataset.syn, c); }
  });
  svg.addEventListener("mouseout", e => {
    const c = navCible(e); if(!c) return;
    const to = e.relatedTarget;
    if(to && to.closest && to.closest(".nv-node, .nv-badge, .nv-syn, .nv-ai") === c) return;
    navRest();
  });

  /* clavier : Entrée / Espace activent l'élément focalisé */
  svg.addEventListener("keydown", e => {
    if(e.key !== "Enter" && e.key !== " ") return;
    const c = navCible(e); if(!c) return;
    e.preventDefault(); e.stopPropagation();
    navActiver(c);
  });

  /* mini-carte : cliquer ou glisser pour déplacer le champ de vision */
  const mini = document.getElementById("nvMini");
  if(mini){
    let on = false;
    const vers = ev => {
      const r = mini.getBoundingClientRect();
      const s = Math.min(r.width / NV.W, r.height / NV.H) || 1;
      const wx = (NV.W / 2 - r.width / (2 * s)) + (ev.clientX - r.left) / s;
      const wy = (NV.H / 2 - r.height / (2 * s)) + (ev.clientY - r.top) / s;
      camGo(CAM.k, NV.W / 2 - CAM.k * wx, NV.H / 2 - CAM.k * wy, 0);
    };
    mini.addEventListener("pointerdown", e => { on = true; try{ mini.setPointerCapture(e.pointerId); }catch(_){} vers(e); });
    mini.addEventListener("pointermove", e => { if(on) vers(e); });
    const off = e => { on = false; try{ mini.releasePointerCapture(e.pointerId); }catch(_){} };
    mini.addEventListener("pointerup", off);
    mini.addEventListener("pointercancel", off);
  }
}

/* =====================================================================
   MONTAGE
   ===================================================================== */
function navWorkHTML(S){
  const fams = [...new Set(S.syn.map(s => s.fam))];
  const coreCnt = S.syn.filter(s => s.core).length;
  const allCnt = S.syn.length;
  const famBtns = `<button type="button" class="nv-fam on" data-fam="all" title="Toutes les typologies">Toutes</button>` + fams.map(k =>
    `<button type="button" class="nv-fam" data-fam="${k}" style="--fc:${SUITE_FAM[k].c}" title="${esc(SUITE_FAM[k].n)}"><i></i><span>${esc(SUITE_FAM[k].n)}</span></button>`).join("");

  return `<div class="suitesec nv-on" id="suitesec"><div class="nv-work" id="nvWork">
    ${navDiagram(S)}

    <div class="nv-hud nv-hud-tl">
      <span class="nv-ctx"><b>${esc(S.name)}</b><em>Synergies</em></span>
      <span class="nv-cntbox"><i id="nvVisCnt">${allCnt} / ${allCnt}</i> flux</span>
    </div>

    <div class="nv-hud nv-hud-tr">
      <span class="nv-searchbox">
        <button type="button" class="nv-ib" id="nvSearchBtn" title="Rechercher une synergie" aria-label="Rechercher une synergie">⌕</button>
        <input type="search" id="nvSearchIn" class="nv-search-in" placeholder="Code ou mot-clé…" aria-label="Rechercher une synergie" hidden/>
      </span>
      <button type="button" class="nv-ib" id="nvResetBtn" hidden title="Tout réinitialiser" aria-label="Tout réinitialiser">↺</button>
      <span class="nv-zoom">
        <button type="button" class="nv-ib" id="nvZOut" title="Dézoomer" aria-label="Dézoomer">−</button>
        <i id="nvZoomLbl">100 %</i>
        <button type="button" class="nv-ib" id="nvZIn" title="Zoomer" aria-label="Zoomer">+</button>
      </span>
      <button type="button" class="nv-ib" id="nvHome" title="Recentrer la vue d'ensemble" aria-label="Recentrer la vue d'ensemble">⌂</button>
      <button type="button" class="nv-ib nv-ib-fs" id="nvFsBtn" title="Plein écran" aria-label="Plein écran">⛶</button>
    </div>

    <div class="nv-hud nv-hud-bl" role="region" aria-label="Filtres de l'univers des synergies">
      <div class="nv-scope" role="group" aria-label="Périmètre">
        <button type="button" class="nv-scope-btn on" data-scope="all">Toutes (${allCnt})</button>
        <button type="button" class="nv-scope-btn" data-scope="core">Majeures (${coreCnt})</button>
      </div>
      <div class="nv-fams" role="group" aria-label="Typologies">${famBtns}</div>
    </div>

    <div class="nv-hud nv-hud-br"><div class="nv-mini" id="nvMini" title="Vue d'ensemble : cliquer ou glisser pour vous déplacer">${navMiniHTML(S)}</div></div>

    <p class="nv-hint" id="nvHint">Cliquez un module pour voir toutes ses interactions · molette pour zoomer · glissez pour vous déplacer</p>

    <div class="nv-float" id="nvFloat" hidden></div>
    <div class="nv-tip" id="nvTip" hidden></div>
    <div class="nv-sheet" id="nvSheet" hidden></div>
  </div></div>`;
}

let _globals = false;
function navGlobals(){
  if(_globals) return; _globals = true;
  window.addEventListener("hashchange", () => { NAV.fs = false; if(document.body) document.body.classList.remove("nv-fs-lock"); });
  window.addEventListener("resize", () => {
    if(!elSvg()) return;
    camMesure();
    if(NAV.mod) camSurModule(curS(), NAV.mod, 0); else camApply();
  });
  /* en capture : sans cela, l'Échap global de fx-core.js remonte d'un niveau de navigation
     avant même que l'espace Synergies ait pu refermer ce qui est ouvert. */
  document.addEventListener("keydown", e => {
    if(!elWork()) return;
    if(e.key === "Escape"){
      if(NAV.sheet){ e.stopPropagation(); navSheetClose(); }
      else if(NAV.syn || NAV.mod){ e.stopPropagation(); navClear(); }
      else if(NAV.fs){ e.stopPropagation(); navToggleFs(false); }
      return;
    }
    if(document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    if(e.key === "+" || e.key === "="){ e.preventDefault(); camGo(CAM.k * 1.3, CAM.tx, CAM.ty, 220); }
    else if(e.key === "-"){ e.preventDefault(); camGo(CAM.k / 1.3, CAM.tx, CAM.ty, 220); }
    else if(e.key === "0"){ e.preventDefault(); camRecentre(); }
  }, true);
}

function navMount(root, sk){
  Object.assign(NAV, {suite: sk, mod: null, syn: null, fam: "all", scope: "all", search: "", fs: false, sheet: false, studioMod: null, fdir: "all", searchOpen: false});
  CAM.k = 1; CAM.tx = 0; CAM.ty = 0; camStop();
  document.body.classList.remove("nv-fs-lock");
  navGlobals();
  camBind();

  const zIn = document.getElementById("nvZIn"), zOut = document.getElementById("nvZOut");
  if(zIn) zIn.addEventListener("click", () => camGo(CAM.k * 1.35, CAM.tx, CAM.ty, 240));
  if(zOut) zOut.addEventListener("click", () => camGo(CAM.k / 1.35, CAM.tx, CAM.ty, 240));
  const home = document.getElementById("nvHome");
  if(home) home.addEventListener("click", () => navClear());
  const fs = document.getElementById("nvFsBtn");
  if(fs) fs.addEventListener("click", () => navToggleFs());
  const reset = document.getElementById("nvResetBtn");
  if(reset) reset.addEventListener("click", () => navResetAll());

  document.querySelectorAll(".nv-scope-btn").forEach(b => b.addEventListener("click", () => { NAV.scope = b.dataset.scope; navApplyFilters(); }));
  document.querySelectorAll(".nv-fam").forEach(b => b.addEventListener("click", () => { NAV.fam = b.dataset.fam; navApplyFilters(); }));

  const sBtn = document.getElementById("nvSearchBtn"), sIn = document.getElementById("nvSearchIn");
  if(sBtn && sIn){
    sBtn.addEventListener("click", () => {
      NAV.searchOpen = !NAV.searchOpen;
      sIn.hidden = !NAV.searchOpen;
      sBtn.classList.toggle("on", NAV.searchOpen);
      if(NAV.searchOpen) sIn.focus();
      else if(NAV.search){ NAV.search = ""; sIn.value = ""; navApplyFilters(); }
    });
    sIn.addEventListener("input", () => { NAV.search = sIn.value.trim(); navApplyFilters(); });
  }

  camMesure();
  camRecentre(0);
  navApplyFilters();
  /* la zone n'a pas toujours sa taille définitive au premier rendu */
  requestAnimationFrame(() => { camMesure(); camRecentre(0); });
  setTimeout(() => { camMesure(); if(!NAV.mod && !NAV.syn) camRecentre(0); }, 260);
}

window.FX = window.FX || {};
FX.syn = {html: S => navWorkHTML(S), mount: navMount};
})();
