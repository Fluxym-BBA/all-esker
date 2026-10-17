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
/* mods : modules sélectionnés (Ctrl ou Cmd plus clic pour en ajouter).
   croise : à partir de deux modules, vrai montre seulement les interactions entre eux,
   faux montre toutes leurs interactions avec l'ensemble des modules.
   retour : module d'où l'on vient quand on ouvre la fiche d'une interaction. */
var NAV = {suite: null, mods: [], croise: true, retour: null, syn: null, fam: "all", scope: "all",
           search: "", fs: false, sheet: false, studioMod: null, searchOpen: false};
var CAM = {k: 1, tx: 0, ty: 0, tk: 1, ttx: 0, tty: 0, vx: 0, vy: 0, tau: 90, px: 1,
           vis: {x: 0, y: 0, w: 1240, h: 720},
           safe: {x: 0, y: 0, w: 1240, h: 720, cx: 620, cy: 360}, raf: null, fin: null, last: 0};
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
    const lignes = navLines(nm);
    /* Bouton d'accès à la fiche, posé dans le cercle sous le nom. Il n'apparaît qu'une fois
       le module sélectionné. Sa largeur est celle de la corde du disque à sa hauteur, moins
       une marge : c'est ce qui garantit qu'il ne déborde jamais, quel que soit le module.
       textLength force le libellé à tenir dedans plutôt que de dépasser. */
    const by = y + (lignes.length > 1 ? 40 : 37);
    const bh = 14;
    const corde = 2 * Math.sqrt(Math.max(1, NV.R * NV.R - (by - y + bh / 2) * (by - y + bh / 2)));
    const bw = Math.max(44, corde - 7);
    return `<g class="nv-node" data-id="${m.id}" style="--c:${m.c};--d:${(i * 0.07).toFixed(2)}s;transform-origin:${x}px ${y}px" role="button" tabindex="0" aria-label="${esc(m.label)} (${acr}) : ${esc(S.role[m.id] || "")}, ${synCnt} interactions. Cliquer pour les afficher.">
      <circle class="nv-glow" cx="${x}" cy="${y}" r="${NV.R + 14}"/>
      <circle class="nv-halo" cx="${x}" cy="${y}" r="${NV.R + 22}"/>
      <circle class="nv-ring2" cx="${x}" cy="${y}" r="${NV.R + 15}" style="--od:${(i * 0.3).toFixed(1)}s"/>
      <circle class="nv-ring3" cx="${x}" cy="${y}" r="${NV.R + 25}" style="--od:${(i * 0.5).toFixed(1)}s"/>
      <circle class="nv-orbit" cx="${x}" cy="${y}" r="${NV.R + 6}" style="--od:${(i * 0.4).toFixed(1)}s"/>
      <circle class="nv-disc" cx="${x}" cy="${y}" r="${NV.R}"/>
      <circle class="nv-tint" cx="${x}" cy="${y}" r="${NV.R - 8}"/>
      <text class="nv-num" x="${x}" y="${y - 31}">${String(i + 1).padStart(2, "0")} · ${acr}</text>
      <text class="nv-ico" x="${x}" y="${y + 2}">${m.icon}</text>
      ${lignes.map((l, k, L) => `<text class="nv-nm${l.length > 11 ? " sm" : ""}" x="${x}" y="${(y + (L.length > 1 ? 14 : 21) + k * 12.5)}">${esc(l)}</text>`).join("")}
      <g class="nv-openmod" role="button" tabindex="-1" aria-label="Ouvrir la fiche de ${esc(m.label)}">
        <rect x="${(x - bw / 2).toFixed(1)}" y="${(by - bh / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh}" rx="${bh / 2}"/>
        <text x="${x}" y="${(by + 3.1).toFixed(1)}" textLength="${(bw - 11).toFixed(1)}" lengthAdjust="spacingAndGlyphs">Voir la fiche</text>
      </g>
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
/* La caméra ne saute plus d'une position à l'autre : on pose une cible, et une boucle
   rapproche la position courante de la cible à chaque image. Le zoom s'interpole en
   échelle logarithmique, sinon l'approche paraît molle au début et brutale à la fin.
   Au relâchement d'un glisser, la vitesse restante continue de pousser la cible : c'est
   l'inertie. CAM.tau règle le temps de réaction : court pour la molette, plus long pour
   un cadrage, qui doit se lire comme un mouvement de caméra. */
const tnow = () => (window.performance && performance.now ? performance.now() : Date.now());
const clampK = k => Math.max(KMIN, Math.min(KMAX, k));

function camStop(){
  if(CAM.raf){ cancelAnimationFrame(CAM.raf); CAM.raf = null; }
  if(CAM.fin){ clearTimeout(CAM.fin); CAM.fin = null; }
  CAM.vx = 0; CAM.vy = 0;
}
/* filet : si le navigateur suspend ses images (onglet masqué, rendu sans fenêtre),
   la caméra arrive quand même à destination au lieu de rester à mi-chemin. */
function camFilet(){
  if(CAM.fin) clearTimeout(CAM.fin);
  CAM.fin = setTimeout(() => {
    CAM.fin = null;
    if(CAM.raf){ cancelAnimationFrame(CAM.raf); CAM.raf = null; }
    CAM.vx = 0; CAM.vy = 0;
    CAM.k = CAM.tk; CAM.tx = CAM.ttx; CAM.ty = CAM.tty;
    camApply();
  }, 1100);
}
function camSuivre(){
  if(CAM.raf) return;
  CAM.last = tnow();
  const pas = now => {
    const dt = Math.max(1, Math.min(70, now - CAM.last));
    CAM.last = now;
    if(CAM.vx || CAM.vy){
      CAM.ttx += CAM.vx * dt; CAM.tty += CAM.vy * dt;
      const amorti = Math.exp(-dt / 170);
      CAM.vx *= amorti; CAM.vy *= amorti;
      if(Math.abs(CAM.vx) + Math.abs(CAM.vy) < .006){ CAM.vx = 0; CAM.vy = 0; }
    }
    const a = 1 - Math.exp(-dt / (CAM.tau || 90));
    const lk = Math.log(CAM.k);
    CAM.k = Math.exp(lk + (Math.log(CAM.tk) - lk) * a);
    CAM.tx += (CAM.ttx - CAM.tx) * a;
    CAM.ty += (CAM.tty - CAM.ty) * a;
    const arrive = !CAM.vx && !CAM.vy
      && Math.abs(CAM.tk - CAM.k) < CAM.tk * 2e-4
      && Math.abs(CAM.ttx - CAM.tx) < .05 && Math.abs(CAM.tty - CAM.ty) < .05;
    if(arrive){ CAM.k = CAM.tk; CAM.tx = CAM.ttx; CAM.ty = CAM.tty; }
    camApply();
    if(arrive){
      CAM.raf = null;
      if(CAM.fin){ clearTimeout(CAM.fin); CAM.fin = null; }
    } else {
      CAM.raf = requestAnimationFrame(pas);
    }
  };
  CAM.raf = requestAnimationFrame(pas);
  camFilet();
}
/* pose une cible ; immediat saute dessus sans transition */
function camVise(k, tx, ty, immediat, tau){
  CAM.tk = clampK(k); CAM.ttx = tx; CAM.tty = ty;
  CAM.vx = 0; CAM.vy = 0;
  CAM.tau = tau || 90;
  if(immediat || navReduce()){
    if(CAM.raf){ cancelAnimationFrame(CAM.raf); CAM.raf = null; }
    if(CAM.fin){ clearTimeout(CAM.fin); CAM.fin = null; }
    CAM.k = CAM.tk; CAM.tx = CAM.ttx; CAM.ty = CAM.tty;
    camApply();
    return;
  }
  camSuivre();
}
/* zoom ancré sous le curseur : on raisonne sur la cible, pas sur la position courante,
   sinon deux crans de molette rapprochés se contredisent et l'image tremble. */
function camZoomVers(clientX, clientY, k2, tau){
  k2 = clampK(k2);
  const vb = camVB(clientX, clientY);
  const wx = (vb.x - CAM.ttx) / CAM.tk, wy = (vb.y - CAM.tty) / CAM.tk;
  camVise(k2, vb.x - k2 * wx, vb.y - k2 * wy, false, tau);
}
/* zoom par les boutons et le clavier : ancré au centre de la zone utile */
function camZoomCentre(f){
  camMesure();
  const Z = CAM.safe;
  const k2 = clampK(CAM.tk * f);
  const wx = (Z.cx - CAM.ttx) / CAM.tk, wy = (Z.cy - CAM.tty) / CAM.tk;
  camVise(k2, Z.cx - k2 * wx, Z.cy - k2 * wy, false, 110);
}
function camCadre(x, y, w, h, pad, kmax, immediat){
  if(!camMesure()) return;
  const Z = CAM.safe;
  const p = pad == null ? 30 : pad;
  const k = Math.max(KMIN, Math.min(kmax || KMAX, Math.min(Z.w / (w + 2 * p), Z.h / (h + 2 * p))));
  const cx = x + w / 2, cy = y + h / 2;
  camVise(k, Z.cx - k * cx, Z.cy - k * cy, immediat, 165);
}
function camRecentre(immediat){ camCadre(0, 0, NV.W, NV.H, 0, 1.35, immediat); }

/* cadre le module et l'ensemble de ses interactions visibles */
function camSurModules(S, ids, immediat){
  const pts = [];
  (ids || []).forEach(id => { const i = S.order.indexOf(id); if(i >= 0) pts.push([navX(S, i), NV.Y]); });
  if(!pts.length) return camRecentre(immediat);
  (GEO || []).forEach(g => {
    if(!ids.includes(g.s.from) && !ids.includes(g.s.to)) return;
    if(!navSynVisible(g.s)) return;
    pts.push([g.x1, g.y1], [g.x2, g.y2], [g.mx, g.my]);
  });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  pts.forEach(([px, py]) => { x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py); });
  x0 -= NV.R + 16; x1 += NV.R + 16; y0 -= NV.R + 16; y1 += NV.R + 16;
  camCadre(x0, y0, Math.max(120, x1 - x0), Math.max(120, y1 - y0), 34, 2.4, immediat);
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
  const n = NAV.mods.length;
  if(n >= 2){
    const a = NAV.mods.includes(s.from), b = NAV.mods.includes(s.to);
    /* entre eux : seulement les liens directs, pour que la comparaison soit nette.
       avec tous : toutes leurs interactions, et rien d'autre, pour que le compte annoncé
       sur le bouton soit exactement ce que l'on voit. */
    return NAV.croise ? (a && b) : (a || b);
  }
  /* un module sélectionné montre l'ensemble de ses interactions, y compris hors périmètre « majeures » */
  if(n === 1 && (s.from === NAV.mods[0] || s.to === NAV.mods[0])) return true;
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
function navModsLight(ids){
  const S = curS(); if(!S || !ids || !ids.length) return navLight(null);
  const ns = S.syn.filter(s => (ids.includes(s.from) || ids.includes(s.to)) && navSynVisible(s)).map(s => s.n);
  navLight((t, v) => t === "syn" ? ns.includes(v)
    : (ids.includes(v) || S.syn.some(s => ns.includes(s.n) && (s.from === v || s.to === v))));
  navComets(ns);
}
/* état au repos : la sélection en cours commande l'éclairage */
function navRest(){
  if(NAV.syn) navSynLight(NAV.syn);
  else if(NAV.mods.length) navModsLight(NAV.mods);
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
  document.querySelectorAll(".nv-node").forEach(n => n.classList.toggle("sel", NAV.mods.includes(n.dataset.id)));
  document.querySelectorAll(".nv-scope-btn").forEach(b => b.classList.toggle("on", b.dataset.scope === NAV.scope));
  document.querySelectorAll(".nv-fam").forEach(b => b.classList.toggle("on", b.dataset.fam === NAV.fam));

  const cnt = document.getElementById("nvVisCnt");
  if(cnt) cnt.textContent = count + " / " + S.syn.length;

  const actif = NAV.fam !== "all" || NAV.scope !== "all" || !!NAV.search || NAV.mods.length > 0 || !!NAV.syn;
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
  f.querySelectorAll("[data-retour]").forEach(b => b.addEventListener("click", () => navRetour()));
  f.querySelectorAll("[data-croise]").forEach(b => b.addEventListener("click", () => {
    NAV.croise = b.dataset.croise === "1";
    navModsRefresh();
  }));
  f.querySelectorAll("[data-oter]").forEach(b => b.addEventListener("click", () => {
    NAV.mods = NAV.mods.filter(x => x !== b.dataset.oter);
    if(!NAV.mods.length) return navClear();
    navModsRefresh();
  }));
}

/* bandeau d'actions du bas de fiche : deux intentions distinctes, jamais mélangées.
   Rester dans l'univers sur un module, ou quitter l'univers pour sa fiche produit. */
function navActsHTML(S, ids, horsSelection){
  const dans = (horsSelection || []).map(id => {
    const m = byId(id);
    return `<button type="button" class="nv-fpick" data-pick-mod="${id}" style="--c:${m.c}">${m.icon} ${esc(S.short_name[id] || m.label)}</button>`;
  }).join("");
  const sortir = ids.map(id => {
    const m = byId(id);
    return `<button type="button" class="nv-fbtn solid" data-go-mod="${id}" style="--c:${m.c}">${m.icon} ${esc(S.short_name[id] || m.label)} ›</button>`;
  }).join("");
  return `${dans ? `<div class="nv-fact-grp"><small>Rester ici et voir toutes ses interactions</small><div class="nv-fact-row">${dans}</div></div>` : ""}
    <div class="nv-fact-grp"><small>Quitter l'univers et ouvrir la fiche produit</small><div class="nv-fact-row">${sortir}</div></div>`;
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
      <p class="nv-ftip nv-fmulti">Ctrl ou ⌘ plus clic sur un autre module pour les comparer.</p>
    </div>
    <footer class="nv-facts">
      <button type="button" class="nv-fbtn ghost" data-studio="${id}">⚖️ Seul vs en synergie</button>
      <button type="button" class="nv-fbtn solid" data-go-mod="${id}" style="--c:${m.c}">Ouvrir la fiche ${acr} ›</button>
    </footer>
  </article>`;
}

/* Fiche de comparaison : deux ou trois modules sélectionnés ensemble. */
function navMultiCardHTML(S, ids){
  const entre = S.syn.filter(s => ids.includes(s.from) && ids.includes(s.to));
  const autour = S.syn.filter(s => (ids.includes(s.from) || ids.includes(s.to)) && !(ids.includes(s.from) && ids.includes(s.to)));
  const liste = NAV.croise ? entre : entre.concat(autour);
  const puces = ids.map(id => {
    const m = byId(id);
    return `<span class="nv-fmod" style="--c:${m.c}">${m.icon} ${esc(S.short_name[id] || m.label)}
      <button type="button" class="nv-fmod-x" data-oter="${id}" aria-label="Retirer ${esc(S.short_name[id] || m.label)}">✕</button></span>`;
  }).join("");
  return `<article class="nv-fcard nv-fcard--multi">
    <header class="nv-fhead">
      <div class="nv-fttl"><em>${ids.length} modules sélectionnés</em><b>Comparer leurs interactions</b></div>
      <button type="button" class="nv-fx" data-close-float="1" title="Tout réafficher (Échap)">✕</button>
    </header>
    <div class="nv-fmods">${puces}</div>
    <div class="nv-fseg" role="group" aria-label="Quelles interactions afficher">
      <button type="button" data-croise="1" class="${NAV.croise ? "on" : ""}">Entre eux (${entre.length})</button>
      <button type="button" data-croise="0" class="${NAV.croise ? "" : "on"}">Avec tous les modules (${entre.length + autour.length})</button>
    </div>
    <div class="nv-flist">
      ${liste.length ? `<div class="nv-fgrp"><small>${NAV.croise ? "Liens directs entre les modules choisis" : "Toutes leurs interactions"}</small>
        <div class="nv-fchips">${liste.map(s => navSynChip(S, s, null)).join("")}</div></div>`
        : `<p class="nv-fempty">Aucun lien direct ne relie ces modules sans passer par un module intermédiaire. Basculez sur « Avec tous les modules ».</p>`}
    </div>
    <footer class="nv-facts">
      <button type="button" class="nv-fbtn ghost" data-studio="${ids[0]}">⚖️ Seuls vs en synergie</button>
    </footer>
  </article>`;
}

function navSynCardHTML(S, s){
  const fam = SUITE_FAM[s.fam];
  const ids = [s.from, s.to].filter(Boolean);
  const route = s.from ? `${esc(byId(s.from).label)} (${navAcr(S, s.from)}) <i>→</i> ${esc(byId(s.to).label)} (${navAcr(S, s.to)})` : "";
  /* on garde le fil : si on vient de la fiche d'un module, on peut y revenir */
  const r = NAV.retour && byId(NAV.retour);
  const retour = r ? `<button type="button" class="nv-fback" data-retour="1">‹ Retour à ${esc(S.short_name[NAV.retour] || r.label)}</button>` : "";
  return `<article class="nv-fcard nv-fcard--syn" style="--fc:${fam.c}">
    <header class="nv-fhead">
      <div class="nv-fttl"><em><b class="nv-fcode">${s.n}</b> ${esc(fam.n)}${s.st ? " · " + esc(SUITE_STATUS[s.st]) : ""}</em><b>${esc(s.t)}</b></div>
      <button type="button" class="nv-fx" data-close-float="1" title="Tout réafficher (Échap)">✕</button>
    </header>
    ${retour}
    ${route ? `<p class="nv-fpath">${route}</p>` : ""}
    <div class="nv-flist">
      <p class="nv-fp">${esc(s.p)}</p>
      <ul class="nv-ful">${(s.d || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      ${s.note ? `<p class="nv-fnote">${esc(s.note)}</p>` : ""}
    </div>
    <footer class="nv-facts nv-facts--deux">${ids.length ? navActsHTML(S, ids, ids.filter(id => !NAV.mods.includes(id))) : ""}</footer>
  </article>`;
}

/* =====================================================================
   SÉLECTION
   ===================================================================== */
/* affiche la fiche qui correspond à la sélection de modules en cours */
function navModsRefresh(immediat){
  const S = curS(); if(!S) return;
  NAV.syn = null; NAV.retour = null;
  navTip(null);
  navApplyFilters();
  if(!NAV.mods.length) return navFloatClose();
  navFloatShow(NAV.mods.length === 1 ? navModCardHTML(S, NAV.mods[0]) : navMultiCardHTML(S, NAV.mods));
  camSurModules(S, NAV.mods, immediat);
}

/* ajout : Ctrl ou Cmd plus clic empile jusqu'à trois modules à comparer */
function navModSelect(id, ajout, immediat){
  const S = curS(); if(!S || !byId(id)) return;
  if(ajout){
    const i = NAV.mods.indexOf(id);
    if(i >= 0){
      if(NAV.mods.length === 1) return navClear();
      NAV.mods.splice(i, 1);
    } else {
      if(NAV.mods.length >= 3) NAV.mods.shift();
      NAV.mods.push(id);
      NAV.croise = true;
    }
  } else {
    if(NAV.mods.length === 1 && NAV.mods[0] === id && !NAV.syn) return navClear();
    NAV.mods = [id];
  }
  NAV.studioMod = NAV.mods[0];
  navModsRefresh(immediat);
}

function navRetour(){
  const S = curS(); if(!S) return;
  const id = NAV.retour;
  NAV.syn = null; NAV.retour = null;
  navApplyFilters();
  if(id && NAV.mods.includes(id)){
    navFloatShow(NAV.mods.length === 1 ? navModCardHTML(S, NAV.mods[0]) : navMultiCardHTML(S, NAV.mods));
    camSurModules(S, NAV.mods);
  } else if(NAV.mods.length){
    navModsRefresh();
  } else {
    navClear();
  }
}

function navSynSelect(n){
  const S = curS(); if(!S) return;
  if(n && NAV.syn === n) return navRetour();
  const s = n === "IA" ? Object.assign({n: "IA", fam: "ai", from: null, to: null, st: null}, S.ai) : S.syn.find(x => x.n === n);
  if(!s) return;
  NAV.syn = s.n;
  /* on retient d'où l'on vient pour pouvoir y revenir sans perdre le fil */
  NAV.retour = NAV.mods.length === 1 ? NAV.mods[0]
    : (NAV.mods.length ? (NAV.mods.includes(s.from) ? s.from : (NAV.mods.includes(s.to) ? s.to : NAV.mods[0])) : null);
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
  NAV.mods = []; NAV.syn = null; NAV.retour = null; NAV.croise = true;
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
  /* quand plusieurs modules sont sélectionnés, on ne propose qu'eux : c'est leur comparaison qu'on est venu voir */
  const liste = NAV.mods.length >= 2 ? NAV.mods : S.order;
  const tabs = liste.map(i => {
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
    if(NAV.mods.length) camSurModules(curS(), NAV.mods, true);
    else if(NAV.syn) camApply();
    else camRecentre(true);
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
  return t && t.closest ? t.closest(".nv-openmod, .nv-node, .nv-badge, .nv-syn, .nv-ai") : null;
}
function navActiver(cible, ev){
  if(!cible){ if(NAV.mods.length || NAV.syn) navClear(); return; }
  /* bouton posé dans le cercle du module sélectionné */
  if(cible.classList.contains("nv-openmod")){
    const n = cible.closest(".nv-node");
    if(n) return navGoModule(n.dataset.id);
  }
  if(cible.classList.contains("nv-node")) return navModSelect(cible.dataset.id, !!(ev && (ev.ctrlKey || ev.metaKey || ev.shiftKey)));
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
      base = {x: e.clientX, y: e.clientY, tx: CAM.tx, ty: CAM.ty,
              ajout: !!(e.ctrlKey || e.metaKey || e.shiftKey)};
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
      camZoomVers(base.m.x, base.m.y, base.k * (d / base.d), 55);
      return;
    }
    if(pts.size !== 1 || !base) return;
    const dx = e.clientX - base.x, dy = e.clientY - base.y;
    if(!moved && Math.hypot(dx, dy) < 5) return;
    moved = true;
    svg.classList.add("nv-grab");
    camStop();
    /* le glisser suit le doigt au pixel près : position et cible avancent ensemble,
       et on garde la vitesse des derniers instants pour la relancer au relâchement */
    const t = tnow(), px = CAM.px || 1;
    const nx = base.tx + dx / px, ny = base.ty + dy / px;
    const dtv = t - (base.t || t);
    /* au delà de 120 ms entre deux points, le geste n'est plus un lancer : pas d'inertie,
       et on efface la vitesse précédente pour ne pas relancer sur un geste terminé lentement */
    if(dtv > 0 && dtv < 120){ base.vx = (nx - CAM.tx) / dtv; base.vy = (ny - CAM.ty) / dtv; }
    else if(dtv >= 120){ base.vx = 0; base.vy = 0; }
    base.t = t;
    CAM.tx = CAM.ttx = nx;
    CAM.ty = CAM.tty = ny;
    camApply();
  });

  const fin = e => {
    if(!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    try{ svg.releasePointerCapture(e.pointerId); }catch(_){}
    if(pts.size > 0){ base = null; return; }
    svg.classList.remove("nv-grab");
    const c = cible, m = moved, b = base;
    base = null; cible = null; moved = false;
    if(!m){ navActiver(c, {ctrlKey: b && b.ajout}); return; }
    /* inertie : on relance la cible avec la vitesse restante, puis elle s'éteint */
    if(b && (Math.abs(b.vx || 0) + Math.abs(b.vy || 0)) > .02 && !navReduce()){
      CAM.vx = Math.max(-6, Math.min(6, b.vx)); CAM.vy = Math.max(-6, Math.min(6, b.vy));
      CAM.tau = 70;
      camSuivre();
    }
  };
  svg.addEventListener("pointerup", fin);
  svg.addEventListener("pointercancel", fin);

  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const unite = e.deltaMode === 1 ? 18 : (e.deltaMode === 2 ? 400 : 1);
    /* on empile sur la cible, pas sur la position : plusieurs crans rapprochés
       s'additionnent en un seul mouvement continu au lieu de se contrarier */
    camZoomVers(e.clientX, e.clientY, CAM.tk * Math.exp(-e.deltaY * unite * 0.0018), 95);
  }, {passive: false});

  svg.addEventListener("dblclick", e => { if(!navCible(e)) camRecentre(); });

  /* survol : aperçu sans sélection */
  svg.addEventListener("mouseover", e => {
    const c = navCible(e); if(!c) return;
    if(c.classList.contains("nv-openmod")) return;
    if(c.classList.contains("nv-node")){ if(!NAV.syn && !NAV.mods.length) navModsLight([c.dataset.id]); navModTip(c.dataset.id, c); }
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
    navActiver(c, e);
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
      camMesure();
      camVise(CAM.tk, CAM.safe.cx - CAM.tk * wx, CAM.safe.cy - CAM.tk * wy, false, 60);
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
    if(NAV.mods.length) camSurModules(curS(), NAV.mods, true); else camApply();
  });
  /* en capture : sans cela, l'Échap global de fx-core.js remonte d'un niveau de navigation
     avant même que l'espace Synergies ait pu refermer ce qui est ouvert. */
  document.addEventListener("keydown", e => {
    if(!elWork()) return;
    if(e.key === "Escape"){
      if(NAV.sheet){ e.stopPropagation(); navSheetClose(); }
      /* Échap revient d'abord d'une fiche d'interaction à la fiche du module */
      else if(NAV.syn && NAV.retour){ e.stopPropagation(); navRetour(); }
      else if(NAV.syn || NAV.mods.length){ e.stopPropagation(); navClear(); }
      else if(NAV.fs){ e.stopPropagation(); navToggleFs(false); }
      return;
    }
    if(document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    if(e.key === "+" || e.key === "="){ e.preventDefault(); camZoomCentre(1.3); }
    else if(e.key === "-"){ e.preventDefault(); camZoomCentre(1 / 1.3); }
    else if(e.key === "0"){ e.preventDefault(); camRecentre(); }
  }, true);
}

function navMount(root, sk){
  Object.assign(NAV, {suite: sk, mods: [], croise: true, retour: null, syn: null, fam: "all", scope: "all",
                      search: "", fs: false, sheet: false, studioMod: null, searchOpen: false});
  camStop();
  CAM.k = CAM.tk = 1; CAM.tx = CAM.ttx = 0; CAM.ty = CAM.tty = 0;
  document.body.classList.remove("nv-fs-lock");
  navGlobals();
  camBind();

  const zIn = document.getElementById("nvZIn"), zOut = document.getElementById("nvZOut");
  if(zIn) zIn.addEventListener("click", () => camZoomCentre(1.35));
  if(zOut) zOut.addEventListener("click", () => camZoomCentre(1 / 1.35));
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
  camRecentre(true);
  navApplyFilters();
  /* la zone n'a pas toujours sa taille définitive au premier rendu */
  requestAnimationFrame(() => { camMesure(); camRecentre(true); });
  setTimeout(() => { camMesure(); if(!NAV.mods.length && !NAV.syn) camRecentre(true); }, 260);
}

window.FX = window.FX || {};
FX.syn = {html: S => navWorkHTML(S), mount: navMount};
})();
