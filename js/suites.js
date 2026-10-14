/* =========================================================================
   NAVIGATION PAR NIVEAUX
   Niveau 0 : la roue. Niveau 1 : une suite (flux + synergies).
   Niveau 2 : un module, affiché dans le contexte de sa suite.
   Ce fichier s'ajoute au code existant : il enveloppe sel() et closePanel()
   sans les réécrire.
   ========================================================================= */
const NAV = {suite:null, mode:null, mod:null, syn:null, fam:"all", view:"ess", fin:0, finT:null, busy:false};
const navSec = () => document.getElementById("suitesec");
const navReduce = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const navCanFly = () => !navReduce() && typeof Element !== "undefined" && Element.prototype && typeof Element.prototype.animate === "function";
function navQA(...sels){ return sels.reduce((a, q) => a.concat([...document.querySelectorAll(q)]), []); }
function navMods(S){ return S.order.map(byId).filter(Boolean); }
function navSuiteOf(id){ const m = byId(id); return m && SUITES[m.suite] ? m.suite : null; }

/* ---------- géométrie du schéma de flux ---------- */
const NV = {W:1200, H:610, Y:250, R:60};
function navX(S, i){ const n = S.order.length; return 110 + i * (980 / (n - 1)); }
function navGeom(S){
  const idx = {}; S.order.forEach((id, i) => idx[id] = i);
  /* point d'ancrage sur le cercle : décalé du côté où part la flèche,
     de plus en plus loin du centre à chaque flèche supplémentaire */
  const used = {};
  const pt = (id, side, dir) => {
    const k = id + side + dir; const c = used[k] = (used[k] || 0) + 1;
    const o = dir * Math.min(44, 6 + 16 * (c - 1) + 8), x = navX(S, idx[id]) + o, dy = Math.sqrt(NV.R * NV.R - o * o);
    return [x, side === "up" ? NV.Y - dy : NV.Y + dy];
  };
  const order = S.syn.map((s, i) => i).sort((a, b) => Math.abs(idx[S.syn[a].to] - idx[S.syn[a].from]) - Math.abs(idx[S.syn[b].to] - idx[S.syn[b].from]));
  const res = [];
  order.forEach(i => { const s = S.syn[i], dir = idx[s.to] > idx[s.from] ? 1 : -1;
    res[i] = [pt(s.from, s.side, dir), pt(s.to, s.side, -dir)]; });
  return S.syn.map((s, i) => {
    const [[x1, y1], [x2, y2]] = res[i];
    const span = Math.abs(idx[s.to] - idx[s.from]);
    const h = (40 + 52 * span) * (s.side === "up" ? -1 : 1);
    const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} C${x1.toFixed(1)} ${(y1 + h).toFixed(1)} ${x2.toFixed(1)} ${(y2 + h).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 0.75 * h;
    return {s, d, mx, my};
  });
}
function navLines(t){ /* libellé sur deux lignes au-delà de 12 caractères */
  if(t.length <= 12 || t.indexOf(" ") < 0) return [t];
  const w = t.split(" "); let best = [t], bd = 99;
  for(let k = 1; k < w.length; k++){ const a = w.slice(0, k).join(" "), b = w.slice(k).join(" "), d = Math.abs(a.length - b.length); if(d < bd){ bd = d; best = [a, b]; } }
  return best;
}
function navDiagram(S){
  const g = navGeom(S);
  const marks = Object.entries(SUITE_FAM).map(([k, f]) =>
    `<marker id="nvA-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${f.c}"/></marker>`).join("");
  const paths = g.map(({s, d}) => {
    const c = SUITE_FAM[s.fam].c;
    return `<g class="nv-syn" data-syn="${s.n}" data-fam="${s.fam}" style="--fc:${c}">
      <path class="nv-hit" d="${d}"/>
      <path class="nv-base" d="${d}" stroke="${c}" marker-end="url(#nvA-${s.fam})"/>
      <path class="nv-flow" d="${d}" stroke="${c}"/>
    </g>`; }).join("");
  const badges = g.map(({s, mx, my}) => {
    const c = SUITE_FAM[s.fam].c;
    return `<g class="nv-badge" data-syn="${s.n}" data-fam="${s.fam}" style="--fc:${c}" role="button" tabindex="0" aria-label="${esc(s.n + " : " + s.t)}">
      <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="17"/>
      <text x="${mx.toFixed(1)}" y="${(my + 4.5).toFixed(1)}">${s.n}</text></g>`; }).join("");
  const nodes = navMods(S).map((m, i) => {
    const x = navX(S, i), y = NV.Y, nm = S.short_name[m.id] || m.label;
    return `<g class="nv-node" data-id="${m.id}" style="--c:${m.c};--d:${(i * 0.07).toFixed(2)}s" role="button" tabindex="0" aria-label="${esc(m.label)} : ${esc(S.role[m.id] || "")}">
      <circle class="nv-glow" cx="${x}" cy="${y}" r="${NV.R + 10}"/>
      <circle class="nv-disc" cx="${x}" cy="${y}" r="${NV.R}"/>
      <circle class="nv-tint" cx="${x}" cy="${y}" r="${NV.R - 8}"/>
      <text class="nv-num" x="${x}" y="${y - 34}">${String(i + 1).padStart(2, "0")}</text>
      <text class="nv-ico" x="${x}" y="${y + 2}">${m.icon}</text>
      ${navLines(nm).map((l, k, L) => `<text class="nv-nm${l.length > 11 ? " sm" : ""}" x="${x}" y="${(y + (L.length > 1 ? 22 : 27) + k * 14)}">${esc(l)}</text>`).join("")}
    </g>`; }).join("");
  const n = S.order.length, bx = navX(S, 0) - 70, bw = navX(S, n - 1) - navX(S, 0) + 140;
  const dots = S.order.map((id, i) => `<circle class="nv-aidot" cx="${navX(S, i)}" cy="${NV.H - 56}" r="4.5" style="--d:${(i * .3).toFixed(1)}s"/>`).join("");
  const ai = `<g class="nv-ai" role="button" tabindex="0" aria-label="${esc(S.ai.t)}">
      <rect x="${bx}" y="${NV.H - 82}" width="${bw}" height="52" rx="26"/>
      ${dots}
      <text x="${NV.W / 2}" y="${NV.H - 39}">${esc(S.ai.t)} · cliquer pour le détail</text></g>`;
  return `<svg class="nv-svg" viewBox="0 0 ${NV.W} ${NV.H}" role="group" aria-label="Flux et synergies de la suite ${esc(S.name)}">
    <defs>${marks}</defs>${paths}${ai}${nodes}${badges}</svg>`;
}

/* ---------- rendu des niveaux ---------- */
function navCrumb(S, mod){
  const m = mod ? byId(mod) : null;
  return `<nav class="nv-crumb" aria-label="Fil d'Ariane">
    <button type="button" data-nav="home">Office of the CFO</button><i>›</i>
    ${m ? `<button type="button" data-nav="suite">${esc(S.name)}</button><i>›</i><b>${esc(m.label)}</b>` : `<b>${esc(S.name)}</b>`}
  </nav>`;
}
function navFullHTML(S){
  const fams = [...new Set(S.syn.map(s => s.fam))];
  const chips = `<button type="button" class="nv-fam on" data-fam="all">Toutes</button>` + fams.map(k =>
    `<button type="button" class="nv-fam" data-fam="${k}" style="--fc:${SUITE_FAM[k].c}"><i></i>${SUITE_FAM[k].n}</button>`).join("");
  const cards = S.syn.map(s => `<button type="button" class="nv-card" data-syn="${s.n}" data-fam="${s.fam}" style="--fc:${SUITE_FAM[s.fam].c}">
      <em>${s.n}</em><span><b>${esc(s.t)}</b><small>${esc((S.short_name[s.from] || "") + " → " + (S.short_name[s.to] || ""))}</small></span></button>`).join("");
  const rows = Object.keys(SUITE_FAM).filter(k => S.syn.some(s => s.fam === k)).map(k => `
      <div class="nv-dgroup" style="--fc:${SUITE_FAM[k].c}"><h4><i></i>${SUITE_FAM[k].n}</h4>
      ${S.syn.filter(s => s.fam === k).map(s => `<article class="nv-drow" data-syn="${s.n}">
        <header><em>${s.n}</em><b>${esc(s.t)}</b><span class="nv-st ${s.st}">${SUITE_STATUS[s.st]}</span></header>
        <p class="nv-dpath">${esc(byId(s.from).label)} → ${esc(byId(s.to).label)}</p>
        <p>${esc(s.p)}</p><ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>${s.note ? `<p class="nv-note">${esc(s.note)}</p>` : ""}
      </article>`).join("")}</div>`).join("") + `
      <div class="nv-dgroup" style="--fc:${SUITE_FAM.ai.c}"><h4><i></i>${SUITE_FAM.ai.n}</h4>
        <article class="nv-drow"><header><em>IA</em><b>${esc(S.ai.t)}</b></header><p>${esc(S.ai.p)}</p><ul>${S.ai.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul></article></div>`;
  return `<div class="nv-full">
    <div class="nv-top">${navCrumb(S)}<button type="button" class="nv-back" data-nav="home">‹ Revenir à la roue</button></div>
    <div class="nv-head"><span class="nv-k"><i></i>Suite ${esc(S.name)} · ${esc(S.short)}${S.preview ? ' · aperçu' : ''}</span>
      <h2>${S.title}</h2><p>${esc(S.lead)}</p></div>
    <div class="nv-tools"><div class="nv-fams" role="group" aria-label="Familles de synergies">${chips}</div>
      <div class="nv-view" role="group" aria-label="Niveau de détail"><i></i><button type="button" class="on" data-view="ess">L'essentiel</button><button type="button" data-view="det">Tout le détail</button></div></div>
    <div class="nv-ess" id="nvEss">
      <div class="nv-stage"><div class="nv-scroll">${navDiagram(S)}</div><div class="nv-tip" id="nvTip" hidden></div></div>
      <div class="nv-cards">${cards}</div>
      <div class="nv-detail" id="nvDetail"><div class="nv-detail-empty">Survolez une flèche ou une carte pour la mettre en lumière, cliquez pour le détail. Cliquez sur un module pour y entrer.</div></div>
    </div>
    <div class="nv-det" id="nvDet" hidden>${rows}</div>
    ${S.chain ? navChainHTML() : ""}
  </div>`;
}
function navCompactHTML(S, mod){
  const pills = navMods(S).map((m, i) => `<button type="button" class="nv-pill${m.id === mod ? ' on' : ''}${m.videos.length ? '' : ' soon'}" data-id="${m.id}" style="--c:${m.c};--d:${(i * .05).toFixed(2)}s" aria-current="${m.id === mod ? 'true' : 'false'}">
      <span class="ic">${m.icon}</span><span class="tx"><b>${esc(S.short_name[m.id] || m.label)}</b><small>${esc(S.role[m.id] || "")}</small></span></button>`).join("");
  return `<div class="nv-compact">
    <div class="nv-top">${navCrumb(S, mod)}<button type="button" class="nv-back" data-nav="suite">Voir les synergies de la suite</button></div>
    <div class="nv-rail" role="tablist" aria-label="Modules de la suite ${esc(S.name)}">${pills}</div></div>`;
}

/* ---------- chaîne engagement, charge, trésorerie ---------- */
function navChainHTML(){
  const dots = FIN_STEPS.map((s, i) => `<button type="button" class="nv-fstep${s.scope === 'erp' ? ' erp' : ''}" data-fin="${i}"><em>${i}</em><b>${esc(s.t)}</b><small>${esc(s.s)}</small></button>`).join("");
  return `<section class="nv-chain" aria-label="Engagement, charge et trésorerie">
    <div class="nv-chain-h"><span class="nv-k"><i></i>Le réflexe à transmettre au client</span>
      <h3>Le budget se pilote jusqu'à la facture. <em>Le paiement, c'est la trésorerie.</em></h3>
      <p>Exemple : une prestation de 100 k€ par an, facturée chaque mois. Avancez pas à pas et regardez ce qui bouge, et ce qui ne bouge pas.</p></div>
    <div class="nv-scope"><span class="es">Ce que pilote Esker : le budget et la charge</span><span class="erp">ERP et banque : la trésorerie</span></div>
    <div class="nv-fsteps" id="nvFsteps">${dots}</div>
    <div class="nv-fbody">
      <div class="nv-fbars">
        <div class="nv-flab"><b>Budget du service</b><span id="nvFbud">100 k€</span></div>
        <div class="nv-fbar" id="nvFbar"><i class="con"></i><i class="eng"></i><i class="pre"></i></div>
        <div class="nv-fleg"><span class="con">Consommé <b id="nvFcon">0</b></span><span class="eng">Engagé <b id="nvFeng">0</b></span><span class="pre">Pré-engagé <b id="nvFpre">0</b></span><span class="dis">Disponible <b id="nvFdis">100</b></span></div>
        <div class="nv-ffnp" id="nvFfnp" hidden>Facture non parvenue : <b>8,3 k€</b> (reçu, pas encore facturé)</div>
        <div class="nv-flab cash"><b>Trésorerie</b><span>hors budget</span></div>
        <div class="nv-fcash" id="nvFcash"><i></i><span>Décaissé : <b id="nvFpaid">0</b> k€</span></div>
      </div>
      <div class="nv-ftxt"><span class="nv-fk" id="nvFk">Étape 0</span><h4 id="nvFt">Départ</h4><p id="nvFd"></p>
        <div class="nv-fnav"><button type="button" class="nv-fb" id="nvFprev" aria-label="Étape précédente">‹</button>
          <button type="button" class="nv-fb play" id="nvFplay">Lecture</button>
          <button type="button" class="nv-fb" id="nvFnext" aria-label="Étape suivante">›</button></div></div>
    </div></section>`;
}
const navK = v => (Math.round(v * 10) / 10).toString().replace(".", ",");
function navFin(i){
  i = Math.max(0, Math.min(FIN_STEPS.length - 1, i)); NAV.fin = i;
  const s = FIN_STEPS[i], b = s.b, dis = Math.max(0, 100 - b.pre - b.eng - b.con);
  const bar = document.getElementById("nvFbar"); if(!bar) return;
  const seg = c => bar.querySelector("." + c);
  const set = (c, v) => { const e = seg(c); if(e) e.style.width = v + "%"; };
  set("con", b.con); set("eng", b.eng); set("pre", b.pre);
  const put = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = navK(v); };
  put("nvFcon", b.con); put("nvFeng", b.eng); put("nvFpre", b.pre); put("nvFdis", dis); put("nvFpaid", s.paid);
  const f = document.getElementById("nvFfnp"); if(f) f.hidden = !(s.fnp > 0);
  const cash = document.getElementById("nvFcash"); if(cash) cash.classList.toggle("on", s.paid > 0);
  const bud = document.getElementById("nvFbud"); if(bud) bud.classList.toggle("still", s.k === "pay");
  document.getElementById("nvFk").textContent = "Étape " + i + " sur " + (FIN_STEPS.length - 1) + " · " + s.s;
  document.getElementById("nvFt").textContent = s.t;
  document.getElementById("nvFd").textContent = s.d;
  document.querySelectorAll(".nv-fstep").forEach(e => { const k = +e.dataset.fin; e.classList.toggle("on", k === i); e.classList.toggle("done", k < i); });
}
function navFinPlay(on){
  clearInterval(NAV.finT); NAV.finT = null;
  const b = document.getElementById("nvFplay");
  if(on){ if(NAV.fin >= FIN_STEPS.length - 1) navFin(0);
    NAV.finT = setInterval(() => { if(!document.getElementById("nvFbar")){ clearInterval(NAV.finT); return; }
      if(NAV.fin >= FIN_STEPS.length - 1){ navFinPlay(false); return; } navFin(NAV.fin + 1); }, 2600); }
  if(b){ b.textContent = on ? "Pause" : "Lecture"; b.classList.toggle("on", !!on); }
}

/* ---------- interactions du niveau 1 ---------- */
function navLight(fn){ /* fn(élément) -> true si allumé */
  const sec = navSec(); if(!sec) return;
  const on = !!fn;
  sec.classList.toggle("nv-hl", on);
  navQA(".nv-syn", ".nv-badge", ".nv-card").forEach(e => e.classList.toggle("lit", on && fn("syn", e.dataset.syn)));
  document.querySelectorAll(".nv-node").forEach(e => e.classList.toggle("lit", on && fn("node", e.dataset.id)));
}
function navSynLight(n){
  const S = SUITES[NAV.suite]; const s = S && S.syn.find(x => x.n === n); if(!s) return navLight(null);
  navLight((t, v) => t === "syn" ? v === n : (v === s.from || v === s.to));
}
function navNodeLight(id){
  const S = SUITES[NAV.suite]; if(!S) return;
  const ns = S.syn.filter(s => s.from === id || s.to === id).map(s => s.n);
  navLight((t, v) => t === "syn" ? ns.includes(v) : (v === id || S.syn.some(s => ns.includes(s.n) && (s.from === v || s.to === v))));
}
function navRest(){ if(NAV.syn) navSynLight(NAV.syn); else navLight(null); navTip(null); }
function navTip(html, el){
  const tip = document.getElementById("nvTip"); if(!tip) return;
  if(!html || !el || !el.getBoundingClientRect){ tip.hidden = true; return; }
  const stage = document.querySelector(".nv-stage");
  if(!stage || !stage.getBoundingClientRect){ tip.hidden = true; return; }
  const st = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
  tip.innerHTML = html; tip.hidden = false;
  const x = r.left + r.width / 2 - st.left, y = r.top - st.top;
  tip.style.left = Math.max(120, Math.min(st.width - 120, x)) + "px";
  tip.style.top = Math.max(10, y - 12) + "px";
}
function navSynTip(n, el){
  const S = SUITES[NAV.suite], s = S.syn.find(x => x.n === n); if(!s) return;
  navTip(`<em style="--fc:${SUITE_FAM[s.fam].c}">${s.n} · ${esc(SUITE_FAM[s.fam].n)}</em><b>${esc(s.t)}</b><span>${esc(s.p)}</span>`, el);
}
function navSynSelect(n){
  const S = SUITES[NAV.suite], box = document.getElementById("nvDetail"); if(!S || !box) return;
  const s = n === "IA" ? Object.assign({n:"IA", fam:"ai", from:null, to:null}, S.ai) : S.syn.find(x => x.n === n); if(!s) return;
  NAV.syn = s.n === "IA" ? null : s.n;
  document.querySelectorAll(".nv-card").forEach(c => c.classList.toggle("on", c.dataset.syn === n));
  if(s.n === "IA") navLight((t, v) => t === "node"); else navSynLight(n);
  const go = [s.from, s.to].filter(Boolean).map(id => byId(id)).map(m =>
    `<button type="button" class="nv-go" data-id="${m.id}" style="--c:${m.c}"><span>${m.icon}</span>Entrer dans ${esc(m.label)} ›</button>`).join("");
  box.innerHTML = `<div class="nv-dcard" style="--fc:${SUITE_FAM[s.fam].c}">
    <div class="l"><span class="nv-tag"><em>${s.n}</em>${esc(SUITE_FAM[s.fam].n)}${s.st ? ` · <i class="nv-st ${s.st}">${SUITE_STATUS[s.st]}</i>` : ""}</span>
      <h3>${esc(s.t)}</h3><p>${esc(s.p)}</p>${s.from ? `<p class="nv-dpath">${esc(byId(s.from).label)} <i>→</i> ${esc(byId(s.to).label)}</p>` : ""}</div>
    <div class="r"><ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>${s.note ? `<p class="nv-note">${esc(s.note)}</p>` : ""}<div class="nv-gos">${go}</div></div></div>`;
  box.querySelectorAll(".nv-go").forEach(b => b.addEventListener("click", () => navGoModule(b.dataset.id, b)));
}
function navBindFull(){
  const S = SUITES[NAV.suite];
  navQA(".nv-syn", ".nv-badge", ".nv-card").forEach(e => {
    const n = e.dataset.syn;
    e.addEventListener("mouseenter", () => { navSynLight(n); if(!e.classList.contains("nv-card")) navSynTip(n, e.classList.contains("nv-badge") ? e : e); });
    e.addEventListener("mouseleave", navRest);
    e.addEventListener("focus", () => navSynLight(n));
    e.addEventListener("blur", navRest);
    e.addEventListener("click", () => navSynSelect(n));
    e.addEventListener("keydown", ev => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); navSynSelect(n); } });
  });
  document.querySelectorAll(".nv-node").forEach(e => {
    const id = e.dataset.id, m = byId(id);
    e.addEventListener("mouseenter", () => { navNodeLight(id);
      navTip(`<em style="--fc:${m.c}">${esc(S.short_name[id])} · ${m.videos.length ? m.videos.length + " vidéo" + (m.videos.length > 1 ? "s" : "") : "vidéo bientôt"}</em><b>${esc(S.role[id])}</b><span>Cliquez pour entrer dans le module</span>`, e); });
    e.addEventListener("mouseleave", navRest);
    e.addEventListener("click", () => navGoModule(id, e));
    e.addEventListener("keydown", ev => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); navGoModule(id, e); } });
  });
  document.querySelectorAll(".nv-ai").forEach(e => {
    e.addEventListener("click", () => navSynSelect("IA"));
    e.addEventListener("keydown", ev => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); navSynSelect("IA"); } });
  });
  document.querySelectorAll(".nv-fam").forEach(b => b.addEventListener("click", () => {
    NAV.fam = b.dataset.fam;
    document.querySelectorAll(".nv-fam").forEach(x => x.classList.toggle("on", x === b));
    const sec = navSec(); if(sec) sec.dataset.fam = NAV.fam;
    navQA(".nv-syn", ".nv-badge", ".nv-card").forEach(e => e.classList.toggle("off", NAV.fam !== "all" && e.dataset.fam !== NAV.fam));
  }));
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => navView(b.dataset.view)));
  if(document.getElementById("nvFbar")){
    document.querySelectorAll(".nv-fstep").forEach(b => b.addEventListener("click", () => { navFinPlay(false); navFin(+b.dataset.fin); }));
    document.getElementById("nvFprev").addEventListener("click", () => { navFinPlay(false); navFin(NAV.fin - 1); });
    document.getElementById("nvFnext").addEventListener("click", () => { navFinPlay(false); navFin(NAV.fin + 1); });
    document.getElementById("nvFplay").addEventListener("click", () => navFinPlay(!NAV.finT));
    navFin(0);
  }
}
function navView(v){
  NAV.view = v;
  document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("on", b.dataset.view === v));
  const vw = document.querySelector(".nv-view"); if(vw) vw.classList.toggle("r", v === "det");
  const e = document.getElementById("nvEss"), d = document.getElementById("nvDet");
  if(e) e.hidden = v === "det"; if(d) d.hidden = v !== "det";
}
function navBindCommon(){
  document.querySelectorAll("#suitesec [data-nav]").forEach(b => b.addEventListener("click", () => b.dataset.nav === "home" ? navHome() : navOpenSuite(NAV.suite, {from:"module"})));
  document.querySelectorAll("#suitesec .nv-pill").forEach(b => b.addEventListener("click", () => { if(b.dataset.id !== NAV.mod) sel(b.dataset.id); }));
}

/* ---------- rendu et transitions ---------- */
function navRender(sk, mode, mod){
  const sec = navSec(), S = SUITES[sk]; if(!sec || !S) return;
  clearInterval(NAV.finT); NAV.finT = null;
  NAV.suite = sk; NAV.mode = mode; NAV.mod = mod || null;
  if(mode === "full"){ NAV.syn = null; NAV.fam = "all"; NAV.view = "ess"; }
  sec.className = "suitesec nv-on nv-" + mode;
  sec.dataset.suite = sk; sec.dataset.fam = "all";
  sec.innerHTML = `<div class="wrap">${mode === "full" ? navFullHTML(S) : navCompactHTML(S, mod)}</div>`;
  navBindCommon();
  if(mode === "full") navBindFull();
}
function navScroll(instant){
  const sec = navSec(); if(!sec) return;
  sec.scrollIntoView({behavior: instant ? "auto" : "smooth", block:"start"});
}
function navVeil(on){
  let v = document.getElementById("nvVeil");
  if(!v){ v = document.createElement("div"); v.id = "nvVeil"; v.className = "nv-veil"; document.body.appendChild(v); }
  v.classList.toggle("on", !!on);
}
/* Vol des modules : chaque fantôme part de la position actuelle de l'élément
   source et rejoint la position de l'élément cible, une fois la page rendue. */
function navFly(items, between, done){
  if(!navCanFly() || !items.length){ between(); if(done) done(); return; }
  NAV.busy = true;
  const ghosts = items.map(it => {
    const g = document.createElement("div"); g.className = "nv-ghost";
    g.style.cssText = `left:${it.from.left + it.from.width / 2 - 34}px;top:${it.from.top + it.from.height / 2 - 34}px;--c:${it.c}`;
    g.innerHTML = `<span>${it.icon}</span><b>${esc(it.lab)}</b>`;
    document.body.appendChild(g); return g;
  });
  ghosts.forEach((g, i) => g.animate([{transform:"scale(.55)", opacity:0}, {transform:"scale(1)", opacity:1}], {duration:260, delay:i * 35, easing:"cubic-bezier(.23,1,.32,1)", fill:"both"}));
  navVeil(true);
  setTimeout(() => {
    between();
    const sec = navSec(); if(sec) sec.classList.add("nv-wait");
    let left = ghosts.length;
    ghosts.forEach((g, i) => {
      const t = items[i].to(); const r = t && t.getBoundingClientRect ? t.getBoundingClientRect() : null;
      const fx = items[i].from.left + items[i].from.width / 2, fy = items[i].from.top + items[i].from.height / 2;
      const tx = r ? r.left + r.width / 2 : fx, ty = r ? r.top + r.height / 2 : fy;
      const sc = r ? Math.max(.6, Math.min(2.2, Math.min(r.width, r.height) / 68)) : 1;
      const a = g.animate([{transform:"translate(0,0) scale(1)"}, {transform:`translate(${(tx - fx) * .5}px,${(ty - fy) * .5 - 60}px) scale(${(1 + sc) / 2 * 1.1})`, offset:.55},
        {transform:`translate(${tx - fx}px,${ty - fy}px) scale(${sc})`}], {duration:820, delay:i * 70, easing:"cubic-bezier(.45,0,.2,1)", fill:"forwards"});
      a.onfinish = () => { g.animate([{opacity:1}, {opacity:0}], {duration:220, fill:"forwards"}).onfinish = () => g.remove();
        if(--left === 0){ if(sec) sec.classList.remove("nv-wait"); NAV.busy = false; if(done) done(); } };
    });
    setTimeout(() => navVeil(false), 120);
  }, 320);
}

/* Niveau 0 -> 1 : depuis la roue (ou depuis un module, sans vol) */
function navOpenSuite(sk, opts){
  opts = opts || {};
  const S = SUITES[sk]; if(!S || NAV.busy) return;
  const fromModule = NAV.mode === "compact" && NAV.suite === sk;
  if(current) _navClosePanel(true);
  const bw = document.getElementById("bigWheel");
  const wheelVisible = bw && bw.getBoundingClientRect && (() => { const r = bw.getBoundingClientRect(); return r.bottom > 80 && r.top < (window.innerHeight || 800) - 80; })();
  if(opts.fly !== false && !fromModule && wheelVisible && navCanFly()){
    bw.classList.add("nv-pick", "nv-pick-" + sk);
    const items = S.order.map(id => {
      const seg = [...document.querySelectorAll("#bigWheel .seg")].find(s => s.dataset.id === id); const m = byId(id);
      return {from: seg.getBoundingClientRect(), c:m.c, icon:m.icon, lab:S.short_name[id], to: () => [...document.querySelectorAll("#suitesec .nv-node")].find(n => n.dataset.id === id)};
    });
    setTimeout(() => {
      navFly(items, () => { navRender(sk, "full"); navScroll(true); history.replaceState(null, "", "#suite=" + S.slug); },
        () => { bw.classList.remove("nv-pick", "nv-pick-" + sk); navSec().classList.add("nv-arrived"); });
    }, 260);
    return;
  }
  navRender(sk, "full"); navSec().classList.add("nv-arrived");
  if(opts.scroll !== false) navScroll(false);
  history.replaceState(null, "", "#suite=" + S.slug);
}
/* Niveau 1 -> 2 : le module choisi grossit et rejoint sa place dans le rail */
function navGoModule(id, el){
  if(NAV.busy) return;
  const m = byId(id), S = SUITES[NAV.suite]; if(!m) return;
  const from = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
  if(from && navCanFly()){
    NAV.instant = true;
    navFly([{from, c:m.c, icon:m.icon, lab:(S && S.short_name[id]) || m.label, to: () => [...document.querySelectorAll("#suitesec .nv-pill")].find(p => p.dataset.id === id)}],
      () => sel(id), () => { NAV.instant = false; });
  } else sel(id);
}
/* Retour au niveau 0 */
function navHome(){
  clearInterval(NAV.finT); NAV.finT = null;
  if(current) _navClosePanel(true);
  const sec = navSec(); if(sec){ sec.className = "suitesec"; sec.innerHTML = ""; }
  NAV.suite = NAV.mode = NAV.mod = NAV.syn = null;
  const r = document.getElementById("roue"); if(r) r.scrollIntoView({behavior:"smooth", block:"start"});
  history.replaceState(null, "", location.pathname + location.search);
}

/* ---------- enveloppes de sel() et closePanel() ---------- */
const _navSel = sel;
const _navClose = closePanel;
function _navClosePanel(quiet){
  const v = document.getElementById("player"); if(v) v.pause();
  if(xpS){ xpKill(); xpS = null; }
  host.innerHTML = ""; current = null; markActive(null);
}
sel = function(id, opts){
  _navSel(id, opts);
  const sk = navSuiteOf(id); if(!sk) return;
  const stay = opts && opts.keepPlace === true;
  navRender(sk, "compact", id);
  if(NAV.instant) navScroll(true);
  else if(!stay) setTimeout(() => navScroll(false), 40);
  history.replaceState(null, "", "#m=" + id);
};
closePanel = function(){
  if(NAV.suite){ _navClosePanel(); navOpenSuite(NAV.suite, {fly:false}); return; }
  _navClose();
};

/* ---------- branchements sur la roue et la mini-roue ---------- */
(function navInit(){
  const bindArc = (g, close) => {
    if(!g) return; const sk = g.dataset.suite;
    g.setAttribute("role", "button"); g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", "Explorer la suite " + (SUITES[sk] ? SUITES[sk].name : sk));
    const go = e => { if(e && e.stopPropagation) e.stopPropagation(); if(close) dockClose(); navOpenSuite(sk, {fly: !close}); };
    g.addEventListener("click", go);
    g.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); go(e); } });
  };
  ["S2P", "O2C"].forEach(k => { bindArc(document.getElementById("arc-" + k), false); bindArc(document.getElementById("marc-" + k), true); });
  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && !current && NAV.mode === "full"){
      const t = e.target && e.target.tagName; if(t === "INPUT" || t === "TEXTAREA") return;
      navHome();
    }
  });
  const h = (location.hash || "").replace(/^#/, "");
  if(h.indexOf("suite=") === 0){
    const sk = Object.keys(SUITES).find(k => SUITES[k].slug === h.slice(6));
    if(sk) setTimeout(() => navOpenSuite(sk, {fly:false}), 300);
  }
})();
