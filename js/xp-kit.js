/* xp-kit.js : briques graphiques de la grammaire E-Procurement, extraites de module.js (inchangées) :
   icônes, géométrie de la roue, roue du parcours, visuels animés des irritants. */
function xpReduce(){ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
function xpGainVis(v){
  if(v === "bud") return `<div class="gv gv-bud" aria-hidden="true">
      ${[["Marketing",52,14],["Informatique",61,21],["Production",38,9],["Ressources humaines",74,19]].map(([n,c,e],k) =>
        `<div class="r${c+e>90?' hot':''}" style="--c:${c}%;--e:${e}%;--d:${(.15+k*.12).toFixed(2)}s"><span>${n}</span><div class="t"><i class="c"></i><i class="e"></i></div><b>${c+e} %</b></div>`).join("")}
      <div class="lg"><span class="c">Consommé</span><span class="e">Engagé</span><span class="al">${XP_SVG(XP_ICONS.lock,2.2)}Alerte avant dépassement</span></div></div>`;
  if(v === "ia") return `<div class="gv gv-ia" aria-hidden="true">
      <div class="ch"><u></u>${["Devis","Demande","Validation","Commande","Réception"].map((t,k) => `<span style="--d:${(k*.55).toFixed(2)}s">${XP_SVG(XP_ICONS.spark,2)}${t}</span>`).join("")}</div>
      <div class="gov">${["Droits d'accès","Seuils d'approbation","Circuits de validation","Traçabilité complète"].map(t => `<em>${XP_SVG(XP_ICONS.shield,2)}${t}</em>`).join("")}</div></div>`;
  if(v === "chat") return `<div class="gv gv-chat" aria-hidden="true">
      <div class="hd"><i></i>Teams · Esker</div>
      <div class="b bot" style="--d:.2s">Marc, une demande de <b>1 240 €</b> attend votre accord : 3 écrans pour l'équipe informatique. Budget disponible.</div>
      <div class="ac" style="--d:.9s"><span class="ok">Approuver</span><span>Voir le détail</span></div>
      <div class="b me" style="--d:1.7s">Approuvé ✓</div>
      <div class="b bot" style="--d:2.4s">C'est fait. La commande part chez le fournisseur.</div>
      <div class="via"><span>Microsoft Teams · bientôt</span><span>Agents IA via MCP · à venir</span></div></div>`;
  if(v === "pdf") return `<div class="gv gv-pdf" aria-hidden="true"><div class="doc">PDF</div><div class="ar"></div>
      <div class="ln">${[0,1,2,3].map(k => `<i style="--d:${(.3+k*.22).toFixed(2)}s"></i>`).join("")}</div><div class="ck">30 s</div></div>`;
  if(v === "ok") return `<div class="gv gv-ok" aria-hidden="true"><div class="ph"><span class="bt">${XP_SVG('<path d="M5 12.5l4.5 4.5L19 7"/>',3)}</span><small>Approuver</small></div>
      <div class="wv">${[0,1,2,3,4].map(k => `<i style="--d:${(k*.12).toFixed(2)}s"></i>`).join("")}</div></div>`;
  if(v === "dial") return `<div class="gv gv-dial" aria-hidden="true"><div class="dl"><i class="hd"></i><span class="su">${XP_SVG(XP_ICONS.sun,2)}</span><span class="mo">${XP_SVG(XP_ICONS.moon,2)}</span><b>24 h/24</b></div>
      <ul class="ev"><li style="--d:.2s"><time>02:14</time>Commande confirmée</li><li style="--d:.7s"><time>06:40</time>Date de livraison ajustée</li><li style="--d:1.2s"><time>09:05</time>Avis d'expédition envoyé</li></ul></div>`;
  if(v === "sync") return `<div class="gv gv-sync" aria-hidden="true"><b class="nd">Esker</b>
      <div class="ln">${[["Commande",0],["Réception",1],["Avenant",2],["Référentiels",3]].map(([t,k]) => `<div class="l${k===3?' rev':''}" style="--d:${(k*.45).toFixed(2)}s"><span>${t}</span></div>`).join("")}</div><b class="nd">ERP</b></div>`;
  return "";
}
const PW = {C:370, HUB:150, R1:182, R2:300};
function xpPol(r, a){ const t = a * Math.PI / 180; return [PW.C + r * Math.sin(t), PW.C - r * Math.cos(t)]; }
function xpP(r, a){ const p = xpPol(r, a); return p[0].toFixed(2) + " " + p[1].toFixed(2); }
function xpRing(r1, r2, a1, a2, gap){
  const go = gap ? gap / r2 * 180 / Math.PI : 0, gi = gap ? gap / r1 * 180 / Math.PI : 0, L = (a2 - a1) > 180 ? 1 : 0;
  return `M${xpP(r2, a1 + go)} A${r2} ${r2} 0 ${L} 1 ${xpP(r2, a2 - go)} L${xpP(r1, a2 - gi)} A${r1} ${r1} 0 ${L} 0 ${xpP(r1, a1 + gi)}Z`;
}
function xpArc(r, a1, a2){ return `M${xpP(r, a1)} A${r} ${r} 0 ${(a2 - a1) > 180 ? 1 : 0} 1 ${xpP(r, a2)}`; }
function xpMix(k){ const a = [19,180,226], b = [107,81,237]; return "#" + a.map((v, j) => Math.round(v + (b[j] - v) * k).toString(16).padStart(2,"0")).join(""); }
function xpStepCol(i, n){ return xpMix(n > 1 ? i / (n - 1) : 0); }
function xpWheelSVG(x){
  const {C, HUB, R1, R2} = PW, n = x.steps.length, A = 360 / n, rc = (R1 + R2) / 2 + 2;
  const segs = x.steps.map((s, i) => {
    const a1 = i * A, a2 = a1 + A, am = a1 + A / 2, col = xpStepCol(i, n);
    const [cx, cy] = xpPol(rc, am), [tx, ty] = xpPol(14, am).map((v, j) => v - C);
    return `<g class="pw-seg" data-step="${i}" style="--c:${col};--tx:${tx.toFixed(1)}px;--ty:${ty.toFixed(1)}px" role="button" tabindex="0" aria-label="Étape ${i+1} : ${esc(s.lab)}, ${esc(s.core)}">
      <path class="pg" d="${xpRing(R1 - 4, R2 + 4, a1, a2, 3)}"/>
      <path class="pf" d="${xpRing(R1, R2, a1, a2, 3.5)}"/>
      <path class="pr" d="${xpRing(R1, R1 + 7, a1, a2, 3.5)}"/>
      <g transform="translate(${cx.toFixed(1)} ${(cy - 21).toFixed(1)})"><g class="pi"><g transform="translate(-13 -13) scale(1.0833)" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${XP_ICONS[s.ic]}</g></g></g>
      <text class="pl" x="${cx.toFixed(1)}" y="${(cy + 13).toFixed(1)}">${esc(s.lab)}</text>
      <text class="pn" x="${cx.toFixed(1)}" y="${(cy + 30).toFixed(1)}">${String(i+1).padStart(2,"0")}</text>
    </g>`;
  }).join("");
  const nodes = x.steps.map((s, i) => { const [nx, ny] = xpPol(R1 - 20, i * A + A / 2);
    return `<circle class="pw-node" data-node="${i}" cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="4" style="--c:${xpStepCol(i, n)}"/>`; }).join("");
  const o = `style="transform-origin:${C}px ${C}px"`;
  return `<svg class="pw-svg" viewBox="0 0 ${2*C} ${2*C}" role="group" aria-label="Roue du parcours achat">
    <defs>
      <radialGradient id="pwHubG" cx="50%" cy="34%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#eef5f9"/></radialGradient>
      <linearGradient id="pwNumG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#13b4e2"/><stop offset="1" stop-color="#6b51ed"/></linearGradient>
      <linearGradient id="pwIndG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#13b4e2"/><stop offset="1" stop-color="#6b51ed"/></linearGradient>
      <filter id="pwBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
      <filter id="pwSh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#163467" flood-opacity=".14"/></filter>
    </defs>
    <g class="pw-deco" aria-hidden="true" fill="none">
      <circle class="rot-slow" ${o} cx="${C}" cy="${C}" r="${R2 + 36}" stroke="rgba(19,180,226,.45)" stroke-width="1.3" stroke-dasharray="2 9"/>
      <circle class="rot-rev" ${o} cx="${C}" cy="${C}" r="${R2 + 52}" stroke="rgba(107,81,237,.28)" stroke-width="1.1" stroke-dasharray="46 20"/>
      <g class="rot-fast" ${o}><circle cx="${C}" cy="${C - R2 - 52}" r="5" fill="#13b4e2"/><circle cx="${C}" cy="${C + R2 + 52}" r="3.5" fill="#6b51ed"/></g>
      <g class="rot-med" ${o}><circle cx="${C + R2 + 36}" cy="${C}" r="3" fill="#ffcf63"/></g>
    </g>
    <g class="pw-ind" id="pwInd" aria-hidden="true">
      <path d="${xpArc(R2 + 18, 4, A - 4)}" fill="none" stroke="url(#pwIndG)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${xpPol(R2 + 18, A - 4)[0].toFixed(1)}" cy="${xpPol(R2 + 18, A - 4)[1].toFixed(1)}" r="6.5" fill="#fff" stroke="#6b51ed" stroke-width="3"/>
    </g>
    ${segs}
    <g class="pw-flow" aria-hidden="true" fill="none">
      <circle cx="${C}" cy="${C}" r="${R1 - 20}" stroke="rgba(22,52,103,.12)" stroke-width="1.5" stroke-dasharray="3 7" class="fl"/>
      <circle cx="${C}" cy="${C}" r="${R1 - 20}" stroke="url(#pwNumG)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*(R1-20)*.09).toFixed(1)} ${(2*Math.PI*(R1-20)*.91).toFixed(1)}" class="cm" ${o} transform="rotate(-90 ${C} ${C})"/>
      ${nodes}
    </g>
    <g class="pw-hub" aria-hidden="true">
      <circle cx="${C}" cy="${C}" r="${HUB}" fill="url(#pwHubG)" stroke="rgba(22,52,103,.08)" filter="url(#pwSh)"/>
      <circle class="rot-slow" ${o} cx="${C}" cy="${C}" r="${HUB - 14}" fill="none" stroke="rgba(107,81,237,.3)" stroke-width="1.3" stroke-dasharray="4 7"/>
      <g class="rot-fast" ${o}><path d="${xpArc(HUB + 1, 0, 80)}" fill="none" stroke="url(#pwIndG)" stroke-width="3" stroke-linecap="round" opacity=".85"/></g>
      <g class="pw-hc" id="pwHc">
        <text class="hn" id="pwN" x="${C}" y="${C - 18}">01<tspan class="hs" dx="4">/${String(n).padStart(2,"0")}</tspan></text>
        <text class="ht" x="${C}" y="${C + 20}"><tspan id="pwT1" x="${C}">&nbsp;</tspan><tspan id="pwT2" x="${C}" dy="24">&nbsp;</tspan></text>
        <text class="hk" id="pwK" x="${C}" y="${C + 82}">&nbsp;</text>
      </g>
    </g>
  </svg>`;
}

/* ---------- écrans réels : explorateur guidé ---------- */
function xpWrap(t, max){ const w = String(t).split(" "), l = [""];
  w.forEach(m => { const c = l[l.length - 1]; if(c && (c + " " + m).length > max && l.length < 2) l.push(m); else l[l.length - 1] = c ? c + " " + m : m; });
  return [l[0], l[1] || ""]; }


/* --- roue générique : balisage avec identifiants uniques + contrôleur (instance indépendante).
       Portée depuis o2c-xp.js (L24) sans changement de comportement. --- */
const xpReduceMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
function xpWheelHTML(uid, steps, label) {
  let h = xpWheelSVG({steps: steps.map(s => ({lab: s.lab, core: s.core, ic: s.ic}))});
  h = h.replace(/id="pw(N|T1|T2|K|Hc)"/g, (m, k) => `id="${uid}${k}"`).replace(/aria-label="Roue du parcours achat"/, `aria-label="${E(label)}"`);
  return `<div class="pw" id="${uid}" tabindex="-1">${h}</div>`;
}

/* ---------- contrôleur de roue + carte (instance indépendante) ---------- */
function xpWheelMount(root, uid, cfg) {
  const pw = root.querySelector("#" + uid);
  if (!pw) return null;
  const steps = cfg.steps, n = steps.length, A = 360 / n;
  const segs = Array.prototype.slice.call(pw.querySelectorAll(".pw-seg"));
  const nodes = Array.prototype.slice.call(pw.querySelectorAll(".pw-node"));
  const ind = pw.querySelector(".pw-ind");
  const card = root.querySelector("[data-card='" + uid + "']");
  const prog = root.querySelector("[data-prog='" + uid + "']");
  const btnPlay = root.querySelector("[data-play='" + uid + "']");
  const st = {cur: 0, timer: null, playing: false, started: false};

  function hub(i, selected) {
    const N = document.getElementById(uid + "N"), T1 = document.getElementById(uid + "T1"), T2 = document.getElementById(uid + "T2"), K = document.getElementById(uid + "K"), hc = document.getElementById(uid + "Hc");
    if (!N) return;
    if (N.firstChild) N.firstChild.nodeValue = String(i + 1).padStart(2, "0");
    const w = xpWrap(steps[i].core, 19);
    T1.textContent = w[0]; T2.textContent = w[1] || " ";
    K.textContent = selected ? steps[i].lab.toUpperCase() : "CLIQUER POUR OUVRIR";
    if (hc) {
      hc.style.setProperty("--hc", xpStepCol(i, n));
      hc.classList.remove("sw");
      if (window.requestAnimationFrame) requestAnimationFrame(() => hc.classList.add("sw")); else hc.classList.add("sw");
    }
  }
  function paint(i) {
    const s = steps[i], col = xpStepCol(i, n);
    const lis = (s.b || []).map(b => `<li>${E(b)}</li>`).join("");
    if (card) card.innerHTML = cfg.card(s, i, n, col, lis);
    if (card) card.style.setProperty("--sc", col);
  }
  function select(i, byUser) {
    st.cur = (i + n) % n;
    segs.forEach((g, j) => { g.classList.toggle("on", j === st.cur); g.classList.toggle("done", j < st.cur); });
    nodes.forEach((g, j) => { g.classList.toggle("on", j === st.cur); g.classList.toggle("done", j < st.cur); });
    if (ind) ind.style.transform = "rotate(" + (st.cur * A + A / 2) + "deg)";
    hub(st.cur, true);
    paint(st.cur);
    if (cfg.onSelect) cfg.onSelect(st.cur);
    if (byUser) stop();
    if (prog) { prog.classList.remove("run"); void prog.offsetWidth; if (st.playing) prog.classList.add("run"); }
  }
  function tick() {
    if (!document.getElementById(uid)) { stop(); return; }
    select(st.cur + 1, false);
  }
  function play() {
    if (st.playing || xpReduceMotion()) return;
    st.playing = true;
    if (btnPlay) { btnPlay.classList.add("on"); btnPlay.setAttribute("aria-pressed", "true"); btnPlay.querySelector("span").textContent = "Pause"; }
    st.timer = setInterval(tick, 5600);
    if (prog) { prog.classList.remove("run"); void prog.offsetWidth; prog.classList.add("run"); }
  }
  function stop() {
    st.playing = false; clearInterval(st.timer); st.timer = null;
    if (btnPlay) { btnPlay.classList.remove("on"); btnPlay.setAttribute("aria-pressed", "false"); btnPlay.querySelector("span").textContent = "Visite guidée"; }
    if (prog) prog.classList.remove("run");
  }

  segs.forEach((g, i) => {
    g.addEventListener("click", () => select(i, true));
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i, true); } });
    g.addEventListener("mouseenter", () => { pw.classList.add("hovering"); g.classList.add("hov"); hub(i, i === st.cur); });
    g.addEventListener("mouseleave", () => { pw.classList.remove("hovering"); g.classList.remove("hov"); hub(st.cur, true); });
  });
  const bp = root.querySelector("[data-prev='" + uid + "']"), bn = root.querySelector("[data-next='" + uid + "']");
  if (bp) bp.addEventListener("click", () => select(st.cur - 1, true));
  if (bn) bn.addEventListener("click", () => select(st.cur + 1, true));
  if (btnPlay) btnPlay.addEventListener("click", () => { if (st.playing) stop(); else play(); });
  pw.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(st.cur + 1, true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(st.cur - 1, true); }
  });
  select(0, false);
  return {select, play, stop, state: st};
}


/* --- irritants : balisage + contrôleur autonome (état local, aucun identifiant global requis sauf xpSw/xpScore/xpPzEnd).
       Portés de module.js (E-Procurement), comportement inchangé : survol 0,9 s ou clic pour révéler, bascule globale. --- */
function xpPainsHTML2(x, goLabel) {
  const tiles = x.pains.map((p, i) => `<div class="xp-pt w${p.w}" data-pain="${i}" role="button" tabindex="0" aria-pressed="false" aria-label="${E(p.tag)} : ${E(p.p)} Révéler la réponse Esker">
      <div class="xp-pain"><span class="xp-tag">${XP_SVG(XP_ICONS[p.ic], 2)}${E(p.tag)}</span>
        <h4>${E(p.p)}</h4><p>${E(p.ps)}</p>
        <span class="xp-hint"><i>${XP_SVG(XP_ICONS.zoom, 2.2)}</i><span class="hm">Survolez pour révéler</span><span class="ht">Touchez pour révéler</span></span>
        <span class="xp-ghost">${XP_SVG(XP_ICONS[p.ic], 1.2)}</span></div>
      <div class="xp-gain"><div class="gx"><span class="xp-tag">${XP_SVG(XP_ICONS[p.ic], 2)}Avec Esker</span>
        <h4>${p.g}</h4><p>${E(p.gs)}</p></div>${xpGainVis(p.v)}</div>
      <span class="xp-lens" aria-hidden="true"><em>Esker</em></span>
    </div>`).join("");
  return `<div class="xp-pz-ctl">
      <div class="xp-sw" id="xpSw" role="group" aria-label="Comparer"><i></i><button type="button" class="on" data-sw="0">Aujourd'hui</button><button type="button" data-sw="1">Avec Esker</button></div>
      <div class="xp-score" id="xpScore"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18"/><circle class="a" id="xpScA" cx="22" cy="22" r="18"/></svg>
        <span><b id="xpScN">0</b>/${x.pains.length} irritants effacés</span></div></div>
    <div class="xp-pz" id="xpPz">${tiles}</div>
    <div class="xp-pz-end" id="xpPzEnd" hidden><div><b>Tout est effacé.</b><span>Il ne reste plus qu'à le voir fonctionner en vrai.</span></div>
      <button type="button" class="xp-sb pri" id="xpPzGo">${XP_PLAY}${E(goLabel)}</button></div>`;
}
function xpPainsMountIn(root, x, onGo) {
  const S = {tiles: [], dw: [], seen: {}};
  const tiles = root.querySelectorAll(".xp-pt");
  const center = t => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", (r.width / 2 || 150) + "px"); t.style.setProperty("--my", (r.height / 2 || 120) + "px"); };
  const score = () => {
    const n = x.pains.length, k = Object.keys(S.seen).length;
    const nb = root.querySelector("#xpScN"); if (nb) nb.textContent = k;
    const a = root.querySelector("#xpScA"); if (a) a.style.strokeDasharray = (k / n * 113.1).toFixed(1) + " 200";
    const sc = root.querySelector("#xpScore");
    if (sc) { sc.classList.remove("bump"); void sc.offsetWidth; sc.classList.add("bump"); sc.classList.toggle("all", k === n); }
    const end = root.querySelector("#xpPzEnd"); if (end && k === n) end.hidden = false;
  };
  const reveal = (i, on) => {
    const t = S.tiles[i]; if (!t) return;
    t.classList.toggle("full", on); t.setAttribute("aria-pressed", on ? "true" : "false");
    if (on && !S.seen[i]) { S.seen[i] = 1; score(); }
  };
  tiles.forEach(t => { S.tiles[+t.getAttribute("data-pain")] = t; });
  tiles.forEach(t => {
    const i = +t.getAttribute("data-pain");
    const at = e => {
      const r = t.getBoundingClientRect(); if (!r.width) return;
      const px = e.clientX - r.left, py = e.clientY - r.top;
      t.style.setProperty("--mx", px.toFixed(0) + "px"); t.style.setProperty("--my", py.toFixed(0) + "px");
      if (!xpReduceMotion()) { t.style.setProperty("--ry", ((px / r.width - .5) * 5).toFixed(2) + "deg"); t.style.setProperty("--rx", ((.5 - py / r.height) * 4).toFixed(2) + "deg"); }
    };
    t.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse") return; at(e); t.classList.add("lens"); clearTimeout(S.dw[i]); S.dw[i] = setTimeout(() => reveal(i, true), 900); });
    t.addEventListener("pointermove", e => { if (e.pointerType === "mouse") at(e); });
    t.addEventListener("pointerleave", e => { if (e.pointerType !== "mouse") return; clearTimeout(S.dw[i]); t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); t.classList.remove("lens"); if (!t.classList.contains("lock")) reveal(i, false); });
    t.addEventListener("click", e => { if (e.clientX || e.clientY) at(e); else center(t); clearTimeout(S.dw[i]); const lk = !t.classList.contains("lock"); t.classList.toggle("lock", lk); reveal(i, lk); });
    t.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t.click(); } });
  });
  const sw = root.querySelector("#xpSw");
  const sw2 = on => {
    root.querySelectorAll("[data-sw]").forEach(b => b.classList.toggle("on", +b.getAttribute("data-sw") === on));
    if (sw) sw.classList.toggle("r", !!on);
    x.pains.forEach((p, i) => { const t = S.tiles[i]; if (!t) return; clearTimeout(S.dw[i]); S.dw[i] = setTimeout(() => { center(t); t.classList.toggle("lock", !!on); reveal(i, !!on); }, on ? i * 110 : (x.pains.length - 1 - i) * 60); });
  };
  root.querySelectorAll("[data-sw]").forEach(b => b.addEventListener("click", () => sw2(+b.getAttribute("data-sw"))));
  const go = root.querySelector("#xpPzGo"); if (go) go.addEventListener("click", () => onGo && onGo());
  return {stop() { S.dw.forEach(clearTimeout); }};
}
