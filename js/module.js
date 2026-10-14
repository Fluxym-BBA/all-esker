let xpS = null;          /* état de l'univers ouvert */
let xpIO = null;         /* IntersectionObserver courant */

function xpVid(x, i){ const v = x.videos[i]; return v.main ? Object.assign({}, v, {u: byId(xpS.id).videos[0].u}) : v; }
function xpFmt(s){ s = Math.max(0, Math.round(s)); return Math.floor(s/60) + ":" + String(s%60).padStart(2,"0"); }
function xpToast(msg){
  let t = document.getElementById("xpToast");
  if(!t){ t = document.createElement("div"); t.id = "xpToast"; t.className = "xp-toast"; t.setAttribute("role","status"); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2600);
}
function xpReduce(){ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }

/* ---------- gabarits ---------- */
function xpRailHTML(x){
  return x.videos.map((v, i) => {
    const ok = v.main || !!v.u;
    return `<button type="button" class="xp-ri${i===0?' on':''}${ok?'':' soon'}" data-xvid="${i}" aria-label="${esc(v.t)}${ok?'':' (bientôt en ligne)'}">
      <span class="xp-ri-th"><img src="${XP_IMG}${v.img}.webp" alt="" loading="lazy"><em>${String(i+1).padStart(2,"0")}</em></span>
      <span><span class="xp-ri-t">${esc(v.t)}</span>
      <span class="xp-ri-m">${ok ? `<span class="tg">${esc(v.tag)}</span>· ${esc(v.dur)}` : `<span class="bt">Bientôt en ligne</span>`}
        <span class="eq"><span></span><span></span><span></span></span></span></span>
    </button>`;
  }).join("");
}

/* ---------- « Ce que ça change » : irritants révélés à la loupe ---------- */
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
function xpPainsHTML(x){
  const tiles = x.pains.map((p, i) => `<div class="xp-pt w${p.w}" data-pain="${i}" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(p.tag)} : ${esc(p.p)} Révéler la réponse Esker">
      <div class="xp-pain"><span class="xp-tag">${XP_SVG(XP_ICONS[p.ic],2)}${esc(p.tag)}</span>
        <h4>${esc(p.p)}</h4><p>${esc(p.ps)}</p>
        <span class="xp-hint"><i>${XP_SVG(XP_ICONS.zoom,2.2)}</i><span class="hm">Survolez pour révéler</span><span class="ht">Touchez pour révéler</span></span>
        <span class="xp-ghost">${XP_SVG(XP_ICONS[p.ic],1.2)}</span></div>
      <div class="xp-gain"><div class="gx"><span class="xp-tag">${XP_SVG(XP_ICONS[p.ic],2)}Avec Esker</span>
        <h4>${p.g}</h4><p>${esc(p.gs)}</p></div>${xpGainVis(p.v)}</div>
      <span class="xp-lens" aria-hidden="true"><em>Esker</em></span>
    </div>`).join("");
  return `<div class="xp-pz-ctl xp-rv">
      <div class="xp-sw" id="xpSw" role="group" aria-label="Comparer"><i></i><button type="button" class="on" data-sw="0">Aujourd'hui</button><button type="button" data-sw="1">Avec Esker</button></div>
      <div class="xp-score" id="xpScore"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18"/><circle class="a" id="xpScA" cx="22" cy="22" r="18"/></svg>
        <span><b id="xpScN">0</b>/${x.pains.length} irritants effacés</span></div></div>
    <div class="xp-pz xp-rv d1" id="xpPz">${tiles}</div>
    <div class="xp-pz-end" id="xpPzEnd" hidden><div><b>Tout est effacé.</b><span>Il ne reste plus qu'à le voir fonctionner en vrai.</span></div>
      <button type="button" class="xp-sb pri" id="xpPzGo">${XP_PLAY}Lancer la présentation globale du module Achats</button></div>`;
}

/* ---------- roue du parcours : un seul SVG, un seul centre ---------- */
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
function xpExHTML(x){
  const tabs = x.screens.map((s, i) => `<button type="button" class="xp-ex-tab${i ? '' : ' on'}" data-scr="${i}" role="tab" aria-selected="${i ? 'false' : 'true'}">${esc(s.tab)}</button>`).join("");
  const strip = x.strip.map(k => `<button type="button" class="xp-st" data-shot="${k}" aria-label="Agrandir : ${esc(x.shots[k].t)}"><img src="${XP_IMG}${k}.webp" alt="${esc(x.shots[k].t)}" loading="lazy"><span><b>${esc(x.shots[k].t)}</b>${esc(x.shots[k].d)}</span></button>`).join("");
  return `<div class="xp-ex xp-rv d1" id="xpEx">
      <div class="xp-ex-tabs" role="tablist" aria-label="Écrans">${tabs}</div>
      <div class="xp-ex-grid" id="xpExGrid">
        <div class="xp-ex-win">
          <div class="xp-ex-bar"><i></i><i></i><i></i><span id="xpExUrl">esker · Achats</span>
            <button type="button" class="xp-ex-fs" id="xpExFs">${XP_SVG(XP_ICONS.expand,2.2)}Plein écran</button></div>
          <div class="xp-ex-vp" id="xpExVp">
            <div class="xp-ex-cam" id="xpExCam"><img id="xpExImg" alt="" loading="lazy"><span class="xp-ex-hl" id="xpExHl"></span><div id="xpExPins"></div></div>
            <div class="xp-ex-hint"><i></i>Bougez la souris sur l'écran pour le parcourir</div>
          </div>
        </div>
        <ol class="xp-ex-list" id="xpExList"></ol>
      </div>
      <div class="xp-strip-h"><b>Plus d'écrans</b><span>Cliquez pour agrandir, puis naviguez avec les flèches.</span></div>
      <div class="xp-strip">${strip}</div>
    </div>`;
}

function xpHTML(m){
  const x = XP[m.id], n = x.steps.length;
  const pers = x.personas.map((p, i) => `<button type="button" class="xp-pc" data-pers="${i}" aria-pressed="false"><i>${XP_SVG(XP_ICONS[p.ic],2)}</i>${esc(p.n)}</button>`).join("");
  const road = x.road.map((r, i) => `<div class="xp-road-pt${i===x.road.length-1?' last':''}" style="transition-delay:${.3 + i*.24}s"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join("");

  return `<div class="xp" id="xp">
    <section class="xp-sec">
      <div class="xp-rv"><span class="xp-k"><i></i>Ce que ça change pour vous</span>
      <h3 class="xp-h">Vos irritants d'aujourd'hui, <em>effacés</em>.</h3>
      <p class="xp-lead">Promenez la loupe Esker sur chaque carte : l'irritant s'efface, la réponse apparaît. Ou basculez tout d'un coup.</p></div>
      ${xpPainsHTML(x)}
    </section>

    <section class="xp-sec">
      <div class="xp-rv"><span class="xp-k"><i></i>Le parcours achat</span>
      <h3 class="xp-h">${n} étapes, <em>un seul flux</em>.</h3>
      <p class="xp-lead">Survolez la roue pour explorer, cliquez pour ouvrir une étape. Flèches du clavier et visite guidée disponibles pendant le rendez-vous.</p></div>
      <div class="xp-wrap">
        <div class="pw xp-rv" id="pw">${xpWheelSVG(x)}</div>
        <div class="xp-card" id="xpCard" aria-live="polite"></div>
      </div>
    </section>

    <section class="xp-sec">
      <div class="xp-rv"><span class="xp-k"><i></i>Pour chaque acteur</span>
      <h3 class="xp-h">Qui y gagne <em>quoi</em> ?</h3>
      <p class="xp-lead">Choisissez un profil : ses étapes s'allument dans la roue.</p></div>
      <div class="xp-pers xp-rv d1" id="xpPers">${pers}</div>
      <div class="xp-pcard" id="xpPcard" hidden></div>
    </section>

    <section class="xp-sec">
      <div class="xp-rv"><span class="xp-k"><i></i>Écrans réels</span>
      <h3 class="xp-h">Entrez dans <em>l'application</em>.</h3>
      <p class="xp-lead">De vraies captures Esker. Survolez un repère pour zoomer dessus, ou bougez la souris sur l'écran pour le parcourir.</p></div>
      ${xpExHTML(x)}
    </section>

    <section class="xp-sec">
      <div class="xp-rv"><span class="xp-k"><i></i>Mise en œuvre</span>
      <h3 class="xp-h">En production en <em>14 semaines</em>.</h3>
      <p class="xp-lead">Calendrier type d'un projet de digitalisation des achats, avec une solution standard prête dès la semaine 4.</p></div>
      <div class="xp-road" id="xpRoad"><div class="xp-road-line"><i></i><u></u></div><div class="xp-road-pts">${road}</div></div>
    </section>

    <div class="xp-share xp-rv">
      <div><h4>Partagez ce module avec votre équipe</h4><p>Le lien ouvre directement cette page : vidéos, parcours et écrans compris.</p></div>
      <div class="xp-sa">
        <button type="button" class="xp-sb" id="xpCopy">${XP_SVG('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',2)}Copier le lien</button>
        <button type="button" class="xp-sb" id="xpFull">${XP_SVG('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',2)}Mode présentation</button>
        <a class="xp-sb pri" href="#contact">Demander une démonstration</a>
      </div>
    </div>
  </div>`;
}

/* ---------- montage ---------- */
function xpKill(){ if(!xpS) return; clearInterval(xpS.tour); clearInterval(xpS.exT); clearTimeout(xpS.exR); (xpS.dw || []).forEach(clearTimeout); }
function xpMount(id){
  const x = XP[id]; if(!x) return;
  const panel = document.getElementById("panel");
  const body = panel.querySelector(".panel-body");
  const frame = document.getElementById("vidFrame");
  const meta = body.querySelector(".vidmeta");
  const player = document.getElementById("player");
  xpKill();
  xpS = {id, x, vid:0, step:0, ind:null, hov:-1, tour:null, pers:-1, seen:{}, dw:[], scr:0, spot:-1, exT:null, exR:null, exHold:false};

  /* fond animé */
  const bg = document.createElement("div"); bg.className = "xp-bg"; bg.setAttribute("aria-hidden","true");
  bg.innerHTML = '<i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="dots"></i>';
  panel.insertBefore(bg, panel.firstChild);

  /* scène : lecteur (grand) + rail compact à droite */
  const stage = document.createElement("div"); stage.className = "xp-stage";
  stage.innerHTML = `<div class="xp-main" id="xpMain"></div>
    <aside class="xp-rail" aria-label="Vidéos du module"><div class="xp-rail-in">
      <div class="xp-rail-h"><b><i></i>${x.videos.length} vidéos</b><span>Choisir, puis lancer</span></div>
      <div class="xp-rail-l">${xpRailHTML(x)}</div></div></aside>`;
  if(frame){
    frame.parentNode.insertBefore(stage, frame);
    const main = stage.querySelector("#xpMain") || document.getElementById("xpMain");
    main.appendChild(frame);
    if(meta) main.appendChild(meta);
    const ch = document.createElement("div"); ch.className = "xp-chap"; ch.id = "xpChap"; main.appendChild(ch);
  }
  panel.querySelectorAll("[data-xvid]").forEach(b => b.addEventListener("click", () => xpSelect(+b.dataset.xvid)));
  xpChapters();
  if(player) player.addEventListener("timeupdate", xpTick);

  xpPainsMount();
  xpWheelMount();
  panel.querySelectorAll("[data-pers]").forEach(b => b.addEventListener("click", () => xpPersona(+b.dataset.pers)));
  xpExMount();

  const cp = document.getElementById("xpCopy");
  if(cp) cp.addEventListener("click", () => {
    const url = location.href.split("#")[0] + "#m=" + id;
    const done = () => xpToast("Lien copié : collez-le dans un e-mail ou dans Teams");
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => prompt("Copiez ce lien :", url));
    else prompt("Copiez ce lien :", url);
  });
  const fs = document.getElementById("xpFull");
  if(fs){
    if(!panel.requestFullscreen) fs.style.display = "none";
    else fs.addEventListener("click", () => { if(document.fullscreenElement) document.exitFullscreen(); else panel.requestFullscreen().catch(() => {}); });
  }

  /* apparitions au défilement ; l'explorateur démarre sa visite quand il devient visible */
  if(xpIO) xpIO.disconnect();
  const reveal = el => { el.classList.add("in"); if(el.id === "xpEx") xpExAuto(); };
  const targets = [...panel.querySelectorAll(".xp-rv"), ...panel.querySelectorAll(".xp-road")];
  if("IntersectionObserver" in window){
    xpIO = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ reveal(e.target); xpIO.unobserve(e.target); } }), {threshold:.18});
    targets.forEach(t => xpIO.observe(t));
  } else targets.forEach(reveal);
}

/* ---------- irritants : loupe, bascule, score ---------- */
function xpPainsMount(){
  const tiles = document.querySelectorAll(".panel--xp .xp-pt");
  xpS.tiles = [];
  tiles.forEach(t => { xpS.tiles[+t.dataset.pain] = t;
  });
  tiles.forEach(t => {
    const i = +t.dataset.pain;
    const at = e => { const r = t.getBoundingClientRect(); if(!r.width) return;
      const px = e.clientX - r.left, py = e.clientY - r.top;
      t.style.setProperty("--mx", px.toFixed(0) + "px"); t.style.setProperty("--my", py.toFixed(0) + "px");
      if(!xpReduce()){ t.style.setProperty("--ry", ((px / r.width - .5) * 5).toFixed(2) + "deg"); t.style.setProperty("--rx", ((.5 - py / r.height) * 4).toFixed(2) + "deg"); } };
    t.addEventListener("pointerenter", e => { if(e.pointerType !== "mouse") return; at(e); t.classList.add("lens");
      clearTimeout(xpS.dw[i]); xpS.dw[i] = setTimeout(() => xpReveal(i, true), 900); });
    t.addEventListener("pointermove", e => { if(e.pointerType === "mouse") at(e); });
    t.addEventListener("pointerleave", e => { if(e.pointerType !== "mouse") return; clearTimeout(xpS.dw[i]);
      t.style.setProperty("--rx","0deg"); t.style.setProperty("--ry","0deg");
      t.classList.remove("lens"); if(!t.classList.contains("lock")) xpReveal(i, false); });
    t.addEventListener("click", e => { if(e.clientX || e.clientY) at(e); else xpCenter(t);
      clearTimeout(xpS.dw[i]); const lk = !t.classList.contains("lock"); t.classList.toggle("lock", lk); xpReveal(i, lk); });
    t.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); t.click(); } });
  });
  document.querySelectorAll(".panel--xp [data-sw]").forEach(b => b.addEventListener("click", () => xpSwitch(+b.dataset.sw)));
  const go = document.getElementById("xpPzGo"); if(go) go.addEventListener("click", () => xpPlay(0, 0, true));
}
function xpCenter(t){ const r = t.getBoundingClientRect(); t.style.setProperty("--mx", (r.width / 2 || 150) + "px"); t.style.setProperty("--my", (r.height / 2 || 120) + "px"); }
function xpTile(i){ return xpS && xpS.tiles ? xpS.tiles[i] : null; }
function xpReveal(i, on){
  const t = xpTile(i); if(!t || !xpS) return;
  t.classList.toggle("full", on); t.setAttribute("aria-pressed", on ? "true" : "false");
  if(on && !xpS.seen[i]){ xpS.seen[i] = 1; xpScore(); }
}
function xpScore(){
  const n = xpS.x.pains.length, k = Object.keys(xpS.seen).length;
  const nb = document.getElementById("xpScN"); if(nb) nb.textContent = k;
  const a = document.getElementById("xpScA"); if(a) a.style.strokeDasharray = (k / n * 113.1).toFixed(1) + " 200";
  const sc = document.getElementById("xpScore"); if(sc){ sc.classList.remove("bump"); void sc.offsetWidth; sc.classList.add("bump"); sc.classList.toggle("all", k === n); }
  const end = document.getElementById("xpPzEnd"); if(end && k === n) end.hidden = false;
}
function xpSwitch(on){
  document.querySelectorAll(".panel--xp [data-sw]").forEach(b => b.classList.toggle("on", +b.dataset.sw === on));
  const sw = document.getElementById("xpSw"); if(sw) sw.classList.toggle("r", !!on);
  xpS.x.pains.forEach((p, i) => { const t = xpTile(i); if(!t) return; clearTimeout(xpS.dw[i]);
    xpS.dw[i] = setTimeout(() => { xpCenter(t); t.classList.toggle("lock", !!on); xpReveal(i, !!on); }, on ? i * 110 : (xpS.x.pains.length - 1 - i) * 60); });
}

/* ---------- roue du parcours ---------- */
function xpWheelMount(){
  const pw = document.getElementById("pw"); if(!pw) return;
  document.querySelectorAll(".panel--xp .pw-seg").forEach(s => {
    const k = +s.dataset.step;
    const go = () => { xpTourStop(); xpStep(k); };
    s.addEventListener("click", go);
    s.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); go(); } });
    s.addEventListener("pointerenter", () => { xpS.hov = k; pw.classList.add("hovering"); s.classList.add("hov"); xpHub(k); });
    s.addEventListener("pointerleave", () => { xpS.hov = -1; pw.classList.remove("hovering"); s.classList.remove("hov"); xpHub(xpS.step); });
    s.addEventListener("focus", () => xpHub(k));
    s.addEventListener("blur", () => xpHub(xpS.step));
  });
  pw.addEventListener("keydown", e => { const n = xpS.x.steps.length;
    if(e.key === "ArrowRight" || e.key === "ArrowDown"){ e.preventDefault(); xpTourStop(); xpStep((xpS.step + 1) % n, false, true); }
    if(e.key === "ArrowLeft" || e.key === "ArrowUp"){ e.preventDefault(); xpTourStop(); xpStep((xpS.step - 1 + n) % n, false, true); } });
  xpStep(0, true);
}
function xpWrap(t, max){ const w = String(t).split(" "), l = [""];
  w.forEach(m => { const c = l[l.length - 1]; if(c && (c + " " + m).length > max && l.length < 2) l.push(m); else l[l.length - 1] = c ? c + " " + m : m; });
  return [l[0], l[1] || ""]; }
function xpHub(i){
  if(!xpS) return;
  const x = xpS.x, s = x.steps[i], n = x.steps.length;
  const N = document.getElementById("pwN"), T1 = document.getElementById("pwT1"), T2 = document.getElementById("pwT2"), K = document.getElementById("pwK"), hc = document.getElementById("pwHc");
  if(!N) return;
  if(N.firstChild) N.firstChild.nodeValue = String(i + 1).padStart(2, "0");
  const [a, b] = xpWrap(s.core, 19); T1.textContent = a; T2.textContent = b || " ";
  K.textContent = i === xpS.step ? s.lab.toUpperCase() : "CLIQUER POUR OUVRIR";
  if(hc){ hc.style.setProperty("--hc", xpStepCol(i, n)); hc.classList.remove("sw"); if(window.requestAnimationFrame) requestAnimationFrame(() => hc.classList.add("sw")); else hc.classList.add("sw"); }
}
function xpStep(i, silent, focus){
  if(!xpS) return;
  const x = xpS.x, n = x.steps.length, s = x.steps[i], A = 360 / n;
  xpS.step = i;
  /* l'arc lumineux extérieur glisse jusqu'au secteur choisi, par le chemin le plus court */
  const target = i * A;
  if(xpS.ind === null) xpS.ind = target; else { const d = ((target - xpS.ind) % 360 + 540) % 360 - 180; xpS.ind += d; }
  const ind = document.getElementById("pwInd"); if(ind) ind.style.transform = "rotate(" + xpS.ind + "deg)";
  document.querySelectorAll(".panel--xp .pw-seg").forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", k < i);
    if(focus && k === i && b.focus) b.focus(); });
  document.querySelectorAll(".panel--xp .pw-node").forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", k < i); });
  xpHub(xpS.hov >= 0 ? xpS.hov : i);

  const card = document.getElementById("xpCard"); if(!card) return;
  card.style.setProperty("--sc", xpStepCol(i, n));
  const v = s.go ? xpVid(x, s.go[0]) : null;
  let go = "";
  if(s.go){
    go = v.u
      ? `<button type="button" class="xp-go xin" id="xpGo" style="animation-delay:.42s"><span class="pl">${XP_PLAY}</span><span><b>Lancer ${esc(v.nm)}</b><small>La vidéo démarre directement sur ${esc(s.go[2])}, à ${xpFmt(s.go[1])}</small></span></button>`
      : `<span class="xp-go off xin" style="animation-delay:.42s"><span class="pl">${XP_PLAY}</span><span><b>${esc(v.nm.charAt(0).toUpperCase() + v.nm.slice(1))}</b><small>Vidéo bientôt en ligne</small></span></span>`;
  }
  const tourOn = !!xpS.tour;
  card.innerHTML = `
    <div class="xp-card-k xin"><em>${String(i+1).padStart(2,"0")}</em>Étape ${i+1} sur ${n} · ${esc(s.lab)}</div>
    <h4 class="xp-card-h xin" style="animation-delay:.06s">${esc(s.h)}</h4>
    <p class="xp-card-p xin" style="animation-delay:.12s">${esc(s.p)}</p>
    <ul>${s.b.map((t, k) => `<li class="xin" style="animation-delay:${.18 + k*.07}s">${esc(t)}</li>`).join("")}</ul>
    <button type="button" class="xp-shot xin" data-shot="${s.shot}" aria-label="Agrandir l'écran : ${esc(x.shots[s.shot].t)}"><img src="${XP_IMG}${s.shot}.webp" alt="${esc(x.shots[s.shot].t)}" loading="lazy"><span>${XP_SVG(XP_ICONS.zoom,2.2)}${esc(x.shots[s.shot].t)}</span></button>
    <div class="xp-act">${go}
      <div class="xp-nav">
        <button type="button" class="xp-nb" id="xpPrev" aria-label="Étape précédente">${XP_SVG('<path d="M15 18l-6-6 6-6"/>',2.4)}</button>
        <button type="button" class="xp-nb${tourOn?' on':''}" id="xpTour" aria-label="${tourOn?'Arrêter':'Lancer'} la visite guidée" title="Visite guidée">${tourOn ? XP_SVG('<path d="M9 5v14M15 5v14"/>',2.6) : XP_SVG('<path d="M8 5v14l11-7z"/>',2)}</button>
        <button type="button" class="xp-nb" id="xpNext" aria-label="Étape suivante">${XP_SVG('<path d="M9 18l6-6-6-6"/>',2.4)}</button>
      </div>
    </div>
    <div class="xp-tbar"><i id="xpTbar"></i></div>`;
  const g = document.getElementById("xpGo"); if(g) g.addEventListener("click", () => { xpTourStop(); xpPlay(s.go[0], s.go[1], true); });
  const sh = document.querySelector("#xpCard [data-shot]") || card.querySelector("[data-shot]");
  if(sh) sh.addEventListener("click", () => xpLightbox(s.shot));
  document.getElementById("xpPrev").addEventListener("click", () => { xpTourStop(); xpStep((i - 1 + n) % n); });
  document.getElementById("xpNext").addEventListener("click", () => { xpTourStop(); xpStep((i + 1) % n); });
  document.getElementById("xpTour").addEventListener("click", () => xpS.tour ? xpTourStop() : xpTourStart());
  if(xpS.tour) xpTbar();
}

/* ---------- explorateur d'écrans ---------- */
function xpExMount(){
  if(!document.getElementById("xpEx")) return;
  document.querySelectorAll(".panel--xp [data-scr]").forEach(b => b.addEventListener("click", () => { xpExHold(); xpExLoad(+b.dataset.scr); }));
  document.querySelectorAll(".panel--xp .xp-st[data-shot]").forEach(b => b.addEventListener("click", () => xpLightbox(b.dataset.shot)));
  const vp = document.getElementById("xpExVp"), grid = document.getElementById("xpExGrid");
  vp.addEventListener("pointermove", e => { if(e.pointerType !== "mouse" || (e.target && e.target.closest && e.target.closest(".xp-ex-pin"))) return;
    const r = vp.getBoundingClientRect(); if(!r.height) return; xpExHold(); xpExPan((e.clientY - r.top) / r.height); });
  grid.addEventListener("pointerenter", e => { if(e.pointerType === "mouse") xpExHold(); });
  grid.addEventListener("pointerleave", () => { if(!xpS) return; xpS.exHold = false; clearTimeout(xpS.exR); xpS.exR = setTimeout(xpExAuto, 2500); });
  document.getElementById("xpExFs").addEventListener("click", () => xpLightbox(xpS.x.screens[xpS.scr].k));
  xpExLoad(0);
}
function xpExLoad(si){
  const x = xpS.x, s = x.screens[si]; xpS.scr = si; xpS.spot = -1;
  document.querySelectorAll(".panel--xp [data-scr]").forEach(b => { const on = +b.dataset.scr === si; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
  const img = document.getElementById("xpExImg"); img.src = XP_IMG + s.k + ".webp"; img.alt = x.shots[s.k].t;
  document.getElementById("xpExUrl").textContent = "esker · Achats · " + s.tab;
  document.getElementById("xpExPins").innerHTML = s.spots.map((p, j) =>
    `<button type="button" class="xp-ex-pin" data-pin="${j}" style="left:${(p.z[0] * 100).toFixed(2)}%;top:${(p.z[1] * 100).toFixed(2)}%" aria-label="${esc(p.t)}">${j + 1}</button>`).join("");
  document.getElementById("xpExList").innerHTML = s.spots.map((p, j) =>
    `<li><button type="button" class="xp-ex-it" data-spot="${j}"><em>${j + 1}</em><span><b>${esc(p.t)}</b><span>${esc(p.d)}</span></span><u></u></button></li>`).join("");
  [...document.querySelectorAll(".panel--xp [data-pin]"), ...document.querySelectorAll(".panel--xp [data-spot]")].forEach(b => {
    const j = +(b.dataset.pin !== undefined ? b.dataset.pin : b.dataset.spot);
    b.addEventListener("pointerenter", e => { if(e.pointerType === "mouse"){ xpExHold(); xpExFocus(j); } });
    b.addEventListener("focus", () => { xpExHold(); xpExFocus(j); });
    b.addEventListener("click", () => { xpExHold(); xpExFocus(j); });
  });
  xpExPan(0, true);
}
function xpExDims(){ const vp = document.getElementById("xpExVp"), s = xpS.x.screens[xpS.scr];
  const W = (vp && vp.clientWidth) || 800, H = (vp && vp.clientHeight) || 520; return {W, H, IH: W * s.ar}; }
function xpExCam(k, tx, ty, free){
  const cam = document.getElementById("xpExCam"); if(!cam) return;
  cam.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${k.toFixed(3)})`;
  cam.style.setProperty("--k", k.toFixed(3)); cam.classList.toggle("free", !!free);
}
function xpExPan(fy, instant){
  const {H, IH} = xpExDims(); fy = Math.min(1, Math.max(0, fy));
  xpExCam(1, 0, -Math.max(0, IH - H) * fy, !instant);
  const hl = document.getElementById("xpExHl"); if(hl) hl.classList.remove("on");
  [...document.querySelectorAll(".panel--xp [data-pin]"), ...document.querySelectorAll(".panel--xp [data-spot]")].forEach(b => { b.classList.remove("on"); b.classList.remove("auto"); });
  document.getElementById("xpExVp").classList.add("pan");
}
function xpExFocus(j, auto){
  const s = xpS.x.screens[xpS.scr], p = s.spots[j]; if(!p) return; xpS.spot = j;
  const {W, H, IH} = xpExDims(), [x0, y0, x1, y1] = p.z;
  const zw = (x1 - x0) * W, zh = (y1 - y0) * IH;
  const k = Math.max(1, Math.min(2.4, Math.min(W * .9 / zw, H * .84 / zh)));
  let tx = W / 2 - k * (x0 + x1) / 2 * W, ty = H / 2 - k * (y0 + y1) / 2 * IH;
  tx = Math.min(0, Math.max(W - k * W, tx));
  ty = k * IH > H ? Math.min(0, Math.max(H - k * IH, ty)) : 0;
  xpExCam(k, tx, ty, false);
  const hl = document.getElementById("xpExHl");
  if(hl){ Object.assign(hl.style, {left:(x0*100)+"%", top:(y0*100)+"%", width:((x1-x0)*100)+"%", height:((y1-y0)*100)+"%"}); hl.classList.add("on"); }
  document.getElementById("xpExVp").classList.remove("pan");
  document.querySelectorAll(".panel--xp [data-pin]").forEach(b => b.classList.toggle("on", +b.dataset.pin === j));
  document.querySelectorAll(".panel--xp [data-spot]").forEach(b => { b.classList.toggle("on", +b.dataset.spot === j); b.classList.toggle("auto", !!auto && +b.dataset.spot === j); });
}
function xpExHold(){ if(!xpS) return; xpS.exHold = true; clearInterval(xpS.exT); xpS.exT = null; clearTimeout(xpS.exR); }
function xpExAuto(){
  if(!xpS || xpS.exHold || xpReduce()) return;
  clearInterval(xpS.exT);
  const step = () => { if(!xpS || !document.getElementById("xpEx")){ xpKill(); return; }
    const n = xpS.x.screens[xpS.scr].spots.length; xpExFocus((xpS.spot + 1) % n, true); };
  step(); xpS.exT = setInterval(step, 4200);
}

function xpCount(el){
  if(!el || el._done) return; el._done = true;
  const to = +el.dataset.to, pre = el.dataset.pre || "", suf = el.dataset.suf || "";
  if(xpReduce()){ el.textContent = pre + to + suf; return; }
  const t0 = performance.now(), D = 1700;
  const f = now => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 4);
    el.textContent = pre + Math.round(to * e) + suf; if(k < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}

/* ---------- vidéos ---------- */
/* Choix dans le rail : on prépare la vidéo et sa vignette, sans la lancer. */
function xpSelect(i){
  if(!xpS) return;
  const v = xpVid(xpS.x, i);
  if(!v.u){ xpToast("Cette vidéo sera en ligne très prochainement"); return; }
  const player = document.getElementById("player"), cover = document.getElementById("vidCover"), end = document.getElementById("vidEnd");
  if(!player) return;
  if(i !== xpS.vid){
    xpS.vid = i;
    try{ player.pause(); }catch(e){}
    const src = player.querySelector("source"); if(src) src.src = v.u; else player.src = v.u;
    player.load();
    const q = s => document.querySelector(".panel--xp " + s);
    const mt = q(".vidmeta-t"); if(mt) mt.textContent = v.t;
    const ms = q(".vidmeta-s"); if(ms) ms.textContent = v.tag + " · " + v.dur + " · Français";
    const ct = q(".cover-title"); if(ct) ct.textContent = v.t;
    const tg = q(".cover-tag"); if(tg) tg.textContent = v.tag + " · " + v.dur;
    document.querySelectorAll(".panel--xp [data-xvid]").forEach(c => c.classList.toggle("on", +c.dataset.xvid === i));
    xpChapters();
  }
  if(end) end.classList.remove("on");
  if(cover){ cover.classList.remove("hidden"); cover.setAttribute("aria-label", "Lancer la vidéo : " + v.t);
    cover.classList.remove("xp-swap"); void cover.offsetWidth; cover.classList.add("xp-swap"); }
}
/* Lecture explicite (bouton « Lancer… » ou chapitre) : démarre au passage demandé. */
function xpPlay(i, t, scroll){
  if(!xpS) return;
  const v = xpVid(xpS.x, i);
  if(!v.u){ xpToast("Cette vidéo sera en ligne très prochainement"); return; }
  const player = document.getElementById("player"), cover = document.getElementById("vidCover"), end = document.getElementById("vidEnd");
  if(!player) return;
  const go = () => { try{ player.currentTime = t || 0; }catch(e){} if(cover) cover.classList.add("hidden"); if(end) end.classList.remove("on");
    const p = player.play(); if(p && p.catch) p.catch(() => {}); };
  if(i !== xpS.vid){ xpSelect(i); if(player.readyState >= 1) go(); else player.addEventListener("loadedmetadata", go, {once:true}); }
  else go();
  if(scroll){ const f = document.getElementById("vidFrame"); if(f) f.scrollIntoView({behavior:"smooth", block:"center"}); }
}

function xpChapters(){
  const box = document.getElementById("xpChap"); if(!box || !xpS) return;
  const v = xpS.x.videos[xpS.vid];
  if(!v.ch || !v.ch.length){ box.innerHTML = ""; return; }
  const segs = v.ch.map((c, k) => { const nx = k < v.ch.length - 1 ? v.ch[k+1][0] : v.len;
    return `<button type="button" class="xp-chap-seg" style="flex:${Math.max(1, nx - c[0])} 1 0" data-t="${c[0]}" aria-label="${esc(c[1])} (${xpFmt(c[0])})" title="${esc(c[1])}"><i></i></button>`; }).join("");
  const list = v.ch.map(c => `<button type="button" class="xp-chap-it" data-t="${c[0]}"><b>${xpFmt(c[0])}</b>${esc(c[1])}</button>`).join("");
  box.innerHTML = `<div class="xp-chap-bar">${segs}</div><div class="xp-chap-list">${list}</div>`;
  box.querySelectorAll("[data-t]").forEach(b => b.addEventListener("click", () => xpPlay(xpS.vid, +b.dataset.t, false)));
}
function xpTick(){
  if(!xpS) return;
  const p = document.getElementById("player"), v = xpS.x.videos[xpS.vid];
  if(!p || !v.ch) return;
  const ct = p.currentTime, len = p.duration && isFinite(p.duration) ? p.duration : v.len;
  const segs = document.querySelectorAll("#xpChap .xp-chap-seg i"), its = document.querySelectorAll("#xpChap .xp-chap-it");
  v.ch.forEach((c, k) => { const s = c[0], e = k < v.ch.length - 1 ? v.ch[k+1][0] : len;
    const r = Math.max(0, Math.min(1, (ct - s) / Math.max(1, e - s)));
    if(segs[k]) segs[k].style.transform = "scaleX(" + r + ")";
    if(its[k]) its[k].classList.toggle("on", ct >= s && ct < e); });
}

/* ---------- roue du parcours ---------- */
const XP_TOUR_MS = 6500;
function xpTbar(){ const b = document.getElementById("xpTbar"); if(!b) return;
  b.style.transition = "none"; b.style.width = "0"; void b.offsetWidth;
  b.style.transition = "width " + XP_TOUR_MS + "ms linear"; b.style.width = "100%"; }
function xpTourStart(){
  if(!xpS) return;
  xpS.tour = setInterval(() => { if(!xpS || !document.getElementById("xpCard")){ xpTourStop(); return; } xpStep((xpS.step + 1) % xpS.x.steps.length); }, XP_TOUR_MS);
  xpStep(xpS.step, true);
}
function xpTourStop(){ if(xpS && xpS.tour){ clearInterval(xpS.tour); xpS.tour = null; if(document.getElementById("xpCard")) xpStep(xpS.step, true); } }

function xpPersona(i){
  if(!xpS) return;
  const x = xpS.x, card = document.getElementById("xpPcard"), orb = document.getElementById("pw");
  xpS.pers = xpS.pers === i ? -1 : i;
  document.querySelectorAll(".panel--xp [data-pers]").forEach(b => { const on = +b.dataset.pers === xpS.pers; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  const segs = document.querySelectorAll(".panel--xp .pw-seg");
  if(xpS.pers < 0){ card.hidden = true; orb.classList.remove("pers"); segs.forEach(b => b.classList.remove("hit")); return; }
  const p = x.personas[xpS.pers];
  orb.classList.add("pers");
  segs.forEach((b, k) => b.classList.toggle("hit", p.steps.includes(k)));
  card.hidden = false;
  card.innerHTML = `<div class="xp-pq xin">« ${esc(p.q)} »<small>${esc(p.n)} · étapes ${p.steps.slice().sort((a,b)=>a-b).map(k => k + 1).join(", ")}</small></div>
    <div class="xp-pg">${p.g.map((g, k) => `<div class="xin" style="animation-delay:${.08 + k*.08}s"><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join("")}</div>`;
  xpTourStop(); xpStep(p.steps[0]);
}

/* ---------- visionneuse ---------- */
function xpLightbox(key){
  if(!xpS) return;
  const keys = Object.keys(xpS.x.shots);
  let lb = document.getElementById("xpLb");
  if(!lb){
    lb = document.createElement("div"); lb.id = "xpLb"; lb.className = "xp-lb";
    lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true"); lb.setAttribute("aria-label","Visionneuse d'écrans");
    lb.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure>
      <button type="button" class="lb-x" aria-label="Fermer">${XP_SVG('<path d="M18 6L6 18M6 6l12 12"/>',2.4)}</button>
      <button type="button" class="lb-p" aria-label="Précédent">${XP_SVG('<path d="M15 18l-6-6 6-6"/>',2.4)}</button>
      <button type="button" class="lb-n" aria-label="Suivant">${XP_SVG('<path d="M9 18l6-6-6-6"/>',2.4)}</button>`;
    document.body.appendChild(lb);
    lb.addEventListener("click", e => { if(e.target === lb) xpLbClose(); });
    lb.querySelector(".lb-x").addEventListener("click", xpLbClose);
    lb.querySelector(".lb-p").addEventListener("click", () => xpLbGo(-1));
    lb.querySelector(".lb-n").addEventListener("click", () => xpLbGo(1));
    document.addEventListener("keydown", e => { if(!lb.classList.contains("on")) return;
      if(e.key === "Escape") xpLbClose(); if(e.key === "ArrowLeft") xpLbGo(-1); if(e.key === "ArrowRight") xpLbGo(1); });
  }
  lb._keys = keys; lb._i = Math.max(0, keys.indexOf(key)); lb._back = document.activeElement;
  xpLbShow(); lb.classList.add("on"); lb.querySelector(".lb-x").focus();
}
function xpLbShow(){ const lb = document.getElementById("xpLb"), k = lb._keys[lb._i], s = xpS.x.shots[k];
  const img = lb.querySelector("img"); img.src = XP_IMG + k + ".webp"; img.alt = s.t;
  lb.classList.toggle("tall", !!s.tall); const fg = lb.querySelector("figure"); if(fg) fg.scrollTop = 0;
  lb.querySelector("figcaption").innerHTML = `<b>${esc(s.t)}</b>${esc(s.d)} · ${lb._i + 1} / ${lb._keys.length}`; }
function xpLbGo(d){ const lb = document.getElementById("xpLb"); lb._i = (lb._i + d + lb._keys.length) % lb._keys.length; xpLbShow(); }
function xpLbClose(){ const lb = document.getElementById("xpLb"); if(!lb) return; lb.classList.remove("on"); if(lb._back && lb._back.focus) lb._back.focus(); }

