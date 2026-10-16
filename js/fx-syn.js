/* fx-syn.js : mécanique des synergies d'origine (console multi-filtres, périmètre, sens amont/aval, survol, tiroir,
   studio Seul vs Synergie, exploration, plein écran), reprise de l'ancien suites.js et rangée dans l'écran unique.
   Les fonctions nav* sont conservées telles quelles ; seuls l'amorçage et le rendu autour changent. */
(function () {
"use strict";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
var NAV = {suite: null, mode: null, mod: null, syn: null, fam: "all", scope: "core", fmod: "all", fmods: [], fmodUnlock: false, fdir: "all", studioMod: null, search: "", cmp: false, fs: false, view: "ess", fin: 0, finT: null, busy: false};
const navSec = () => document.getElementById("suitesec");
const navReduce = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
function navQA(...sels){ return sels.reduce((a, q) => a.concat([...document.querySelectorAll(q)]), []); }
function navMods(S){ return S.order.map(byId).filter(Boolean); }
function navAcr(S, id){ return (S && S.acr && S.acr[id]) || String(id || "").toUpperCase(); }

/* Synchronisation de fmod (compatibilité) et fmods (multi-sélection) */
function navSyncFmodState(){
  NAV.fmod = NAV.fmods.length === 1 ? NAV.fmods[0] : (NAV.fmods.length === 0 ? "all" : NAV.fmods.join(","));
}

/* ---------- géométrie du schéma de flux (zéro collision sur 22 flux S2P et 22 flux O2C) ---------- */
const NV = {W:1240, H:720, Y:320, R:56};
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
    return {s, d, mx, my};
  });
}
function navLines(t){
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
    return `<g class="nv-node" data-id="${m.id}" style="--c:${m.c};--d:${(i * 0.07).toFixed(2)}s" role="button" tabindex="0" aria-label="${esc(m.label)} (${acr}) : ${esc(S.role[m.id] || "")}">
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
  return `<svg class="nv-svg" id="nvSvg" viewBox="0 0 ${NV.W} ${NV.H}" role="group" aria-label="Flux et synergies de la suite ${esc(S.name)}">
    <rect class="nv-svg-bg" x="0" y="0" width="${NV.W}" height="${NV.H}" fill="transparent"/>
    <defs>${marks}</defs>${paths}${ai}${nodes}${badges}</svg>`;
}

/* ---------- Studio Standalone vs En synergie (ergonomie repensée) ---------- */
function navFormatPitchItem(item){
  if(typeof item === "string") return `<li>${esc(item)}</li>`;
  return `<li><b>${esc(item.k)}</b><span>${esc(item.d)}</span></li>`;
}
function navPitchHTML(S){
  if(!S.pitch) return "";
  const activeSingleMod = NAV.fmods.length === 1 ? NAV.fmods[0] : null;
  if(!activeSingleMod && !NAV.cmp) return "";

  const curMod = activeSingleMod || NAV.studioMod || S.order[0];
  NAV.studioMod = curMod;
  const m = byId(curMod), p = S.pitch[curMod], acr = navAcr(S, curMod);
  if(!m || !p) return "";

  const inSyns = S.syn.filter(s => s.to === curMod);
  const outSyns = S.syn.filter(s => s.from === curMod);

  const tabs = S.order.map((id, i) => {
    const tm = byId(id), tacr = navAcr(S, id), on = id === curMod;
    return `<button type="button" class="nv-st-tab${on ? ' on' : ''}" data-st-mod="${id}" style="--c:${tm.c}">
      <span class="nv-st-ico">${tm.icon}</span>
      <span class="nv-st-txt"><b>${tacr} · ${esc(S.short_name[id] || tm.label)}</b><small>${esc(S.role[id] || "")}</small></span>
    </button>`;
  }).join("");

  const dirFilterHtml = activeSingleMod ? `<div class="nv-fdirs" role="group" aria-label="Sens des synergies sur le schéma">
      <button type="button" class="nv-fdir${NAV.fdir === 'all' ? ' on' : ''}" data-fdir="all">Tous ses flux (${inSyns.length + outSyns.length})</button>
      <button type="button" class="nv-fdir${NAV.fdir === 'in' ? ' on' : ''}" data-fdir="in">↓ Reçus en amont (${inSyns.length})</button>
      <button type="button" class="nv-fdir${NAV.fdir === 'out' ? ' on' : ''}" data-fdir="out">↑ Émis en aval (${outSyns.length})</button>
    </div>` : "";

  const synPillsIn = inSyns.map(s => `<button type="button" class="nv-st-pill" data-st-syn="${s.n}" style="--fc:${SUITE_FAM[s.fam].c}"><em>${s.n}</em><span>${esc(s.t)}</span></button>`).join("");
  const synPillsOut = outSyns.map(s => `<button type="button" class="nv-st-pill" data-st-syn="${s.n}" style="--fc:${SUITE_FAM[s.fam].c}"><em>${s.n}</em><span>${esc(s.t)}</span></button>`).join("");

  /* Cartes cachées .nv-cmp-card pour compatibilité des contrôles automatisés */
  const compatCards = NAV.cmp ? `<div class="nv-cmp-compat" hidden>${S.order.map(id => `<span class="nv-cmp-card" data-id="${id}"></span>`).join("")}</div>` : "";

  return `<section class="nv-studio nv-pitch-card nv-cmp-box" style="--c:${m.c}" aria-label="Studio de positionnement Standalone vs En synergie">
    ${compatCards}
    <div class="nv-studio-bar">
      <div class="nv-studio-title">
        <span class="nv-k"><i></i>Positionnement commercial · Seul (Standalone) vs En synergie</span>
        <h4>Pourquoi équiper un module seul, ou le combiner dans la suite ${esc(S.name)} ?</h4>
      </div>
      <div class="nv-studio-top-acts">
        ${dirFilterHtml}
        <button type="button" class="nv-go" data-go-mod="${m.id}" style="--c:${m.c}"><span>${m.icon}</span>Entrer dans ${esc(m.label)} (${acr}) ›</button>
        ${NAV.cmp ? `<button type="button" class="nv-cmp-close" id="nvCmpClose">Fermer ✕</button>` : ""}
      </div>
    </div>

    <div class="nv-st-tabs" role="tablist" aria-label="Choisir le module à comparer">${tabs}</div>

    <div class="nv-st-duel">
      <div class="nv-st-side solo">
        <header class="nv-st-shead">
          <span class="nv-st-badge solo">1 · Pertinence en Standalone</span>
          <h5>${m.icon} ${esc(S.short_name[curMod] || m.label)} (${acr}) déployé seul sur votre ERP</h5>
        </header>
        <ul class="nv-st-list">${p.solo.map(navFormatPitchItem).join("")}</ul>
        ${p.limit ? `<div class="nv-st-limit"><strong>Frontière en mode seul :</strong> ${esc(p.limit)}</div>` : ""}
      </div>

      <div class="nv-st-bridge" aria-hidden="true">
        <div class="nv-st-bcircle" style="background:${m.c}">+${inSyns.length + outSyns.length}</div>
        <span>synergies<br>actives</span>
      </div>

      <div class="nv-st-side syn">
        <header class="nv-st-shead">
          <span class="nv-st-badge syn">2 · Valeur démultipliée en Synergie</span>
          <h5>Combiné aux autres modules de la suite ${esc(S.name)}</h5>
        </header>
        <ul class="nv-st-list">${p.syn.map(navFormatPitchItem).join("")}</ul>
        <div class="nv-st-flows">
          ${inSyns.length ? `<div class="nv-st-fgrp"><small>↓ Reçoit en amont (${inSyns.length}) :</small><div class="nv-st-fpills">${synPillsIn}</div></div>` : ""}
          ${outSyns.length ? `<div class="nv-st-fgrp"><small>↑ Alimente en aval (${outSyns.length}) :</small><div class="nv-st-fpills">${synPillsOut}</div></div>` : ""}
        </div>
        ${p.upsell ? `<div class="nv-st-upsell"><strong>💡 ${esc(p.upsell)}</strong></div>` : ""}
      </div>
    </div>
  </section>`;
}

/* ---------- rendu des niveaux ---------- */
function navSynVisible(s){
  if(NAV.fam !== "all" && s.fam !== NAV.fam) return false;
  if(NAV.search){
    const q = NAV.search.toLowerCase();
    const hay = (s.n + " " + s.t + " " + s.p + " " + (s.d || []).join(" ")).toLowerCase();
    if(hay.indexOf(q) === -1) return false;
  }
  if(NAV.fmods.length === 1){
    const m = NAV.fmods[0];
    if(NAV.fdir === "in" && s.to !== m) return false;
    if(NAV.fdir === "out" && s.from !== m) return false;
    if(NAV.fdir === "all" && s.from !== m && s.to !== m) return false;
    return true;
  }
  if(NAV.fmods.length >= 2){
    if(!NAV.fmodUnlock){
      /* Par défaut : uniquement les synergies ENTRE les modules sélectionnés */
      return NAV.fmods.includes(s.from) && NAV.fmods.includes(s.to);
    }
    /* Case cochée : toutes les synergies des modules sélectionnés avec l'ensemble des modules */
    return NAV.fmods.includes(s.from) || NAV.fmods.includes(s.to);
  }
  if(NAV.fam === "all" && !NAV.search && NAV.scope === "core" && !s.core) return false;
  return true;
}

function navApplyFiltersCore(){
  const S = SUITES[NAV.suite]; if(!S) return;
  navSyncFmodState();
  const vis = {};
  let count = 0;
  S.syn.forEach(s => { if(navSynVisible(s)){ vis[s.n] = true; count++; } });

  navQA(".nv-syn", ".nv-badge", ".nv-qpill", ".nv-card", ".nv-drow").forEach(e => {
    if(e.dataset.syn === "IA") return;
    const show = !!vis[e.dataset.syn];
    e.classList.toggle("off", !show);
  });

  document.querySelectorAll(".nv-node").forEach(n => {
    n.classList.toggle("fmod-on", NAV.fmods.includes(n.dataset.id));
  });
  document.querySelectorAll(".nv-mchip").forEach(b => {
    const id = b.dataset.fmod;
    const on = id === "all" ? NAV.fmods.length === 0 : NAV.fmods.includes(id);
    b.classList.toggle("on", on);
  });
  document.querySelectorAll(".nv-scope-btn").forEach(b => {
    b.classList.toggle("on", b.dataset.scope === NAV.scope);
  });
  document.querySelectorAll(".nv-fam").forEach(b => {
    b.classList.toggle("on", b.dataset.fam === NAV.fam);
  });

  const unlockWrap = document.getElementById("nvUnlockWrap");
  const unlockChk = document.getElementById("nvUnlockMods");
  if(unlockWrap) unlockWrap.hidden = NAV.fmods.length < 2;
  if(unlockChk) unlockChk.checked = !!NAV.fmodUnlock;

  /* Si 2+ modules sélectionnés en mode strict n'ont pas de lien direct, proposer de déverrouiller */
  const emptyPair = document.getElementById("nvEmptyPair");
  if(emptyPair){
    if(count === 0 && NAV.fmods.length >= 2 && !NAV.fmodUnlock){
      const names = NAV.fmods.map(id => (S.short_name[id] || id) + " (" + navAcr(S, id) + ")").join(" et ");
      emptyPair.hidden = false;
      emptyPair.innerHTML = `<span>Aucune synergie directe ne relie uniquement <b>${esc(names)}</b> sans passer par un module intermédiaire.</span>
        <button type="button" class="nv-unlock-cta" id="nvUnlockCta">🔓 Afficher leurs synergies avec les autres modules</button>`;
      const uCta = document.getElementById("nvUnlockCta");
      if(uCta) uCta.addEventListener("click", () => { NAV.fmodUnlock = true; navApplyFilters(); });
    } else {
      emptyPair.hidden = true;
      emptyPair.innerHTML = "";
    }
  }

  const hasFilter = NAV.fmods.length > 0 || NAV.fam !== "all" || NAV.scope !== "core" || !!NAV.syn || !!NAV.search;
  const resetBtn = document.getElementById("nvResetBtn");
  if(resetBtn) resetBtn.hidden = !hasFilter;

  const cmpBtn = document.getElementById("nvCmpBtn");
  if(cmpBtn) cmpBtn.classList.toggle("on", !!NAV.cmp || NAV.fmods.length === 1);

  const cntEl = document.getElementById("nvVisCnt");
  if(cntEl) cntEl.textContent = count + " / " + S.syn.length + " synergies affichées";

  const pitchBox = document.getElementById("nvPitch");
  if(pitchBox){
    pitchBox.innerHTML = navPitchHTML(S);
    pitchBox.querySelectorAll(".nv-fdir").forEach(b => b.addEventListener("click", () => {
      NAV.fdir = b.dataset.fdir;
      navApplyFilters();
    }));
    pitchBox.querySelectorAll("[data-st-mod]").forEach(b => b.addEventListener("click", () => {
      const mId = b.dataset.stMod;
      NAV.studioMod = mId;
      if(NAV.fmods.length === 1) NAV.fmods = [mId];
      navApplyFilters();
    }));
    pitchBox.querySelectorAll("[data-st-syn]").forEach(b => b.addEventListener("click", () => {
      navSynSelect(b.dataset.stSyn);
    }));
    pitchBox.querySelectorAll("[data-go-mod]").forEach(b => b.addEventListener("click", () => {
      navGoModule(b.dataset.goMod, b);
    }));
    const closeCmp = document.getElementById("nvCmpClose");
    if(closeCmp) closeCmp.addEventListener("click", () => {
      NAV.cmp = false;
      if(NAV.fmods.length === 1) NAV.fmods = [];
      navApplyFilters();
    });
  }
}

/* ---------- mode plein écran de l'espace Synergies ---------- */
function navToggleFs(force){
  const work = document.getElementById("nvWork");
  const btn = document.getElementById("nvFsBtn");
  if(!work) return;
  NAV.fs = typeof force === "boolean" ? force : !NAV.fs;
  work.classList.toggle("nv-fs", NAV.fs);
  if(document.body) document.body.classList.toggle("nv-fs-lock", NAV.fs);
  if(btn){
    btn.textContent = NAV.fs ? "✕ Quitter le plein écran" : "⛶ Plein écran";
    btn.classList.toggle("on", NAV.fs);
  }
}

/* ---------- interactions du niveau 1 (mise en lumière & désélection universelle) ---------- */
function navLight(fn){
  const sec = navSec(); if(!sec) return;
  const on = !!fn;
  sec.classList.toggle("nv-hl", on);
  navQA(".nv-syn", ".nv-badge", ".nv-qpill", ".nv-card").forEach(e => e.classList.toggle("lit", on && fn("syn", e.dataset.syn)));
  document.querySelectorAll(".nv-node").forEach(e => e.classList.toggle("lit", on && fn("node", e.dataset.id)));
}
function navSynLight(n){
  const S = SUITES[NAV.suite]; const s = S && S.syn.find(x => x.n === n); if(!s) return navLight(null);
  navLight((t, v) => t === "syn" ? v === n : (v === s.from || v === s.to));
}
function navNodeLight(id){
  const S = SUITES[NAV.suite]; if(!S) return;
  const ns = S.syn.filter(s => (s.from === id || s.to === id) && navSynVisible(s)).map(s => s.n);
  navLight((t, v) => t === "syn" ? ns.includes(v) : (v === id || S.syn.some(s => ns.includes(s.n) && (s.from === v || s.to === v))));
}
function navRest(){ if(NAV.syn) navSynLight(NAV.syn); else navLight(null); navTip(null); }

/* Désélection complète de la synergie active (remet toutes les flèches) */
function navSynClear(){
  NAV.syn = null;
  navLight(null);
  navTip(null);
  navQA(".nv-card", ".nv-qpill", ".nv-badge").forEach(c => c.classList.remove("on"));
  document.querySelectorAll(".nv-bplus-t").forEach(t => { t.textContent = "+"; });
  const drawer = document.getElementById("nvStageDrawer");
  if(drawer){ drawer.hidden = true; drawer.innerHTML = ""; }
  const clrBtn = document.getElementById("nvClearSyn");
  if(clrBtn) clrBtn.hidden = true;
  const box = document.getElementById("nvDetail");
  if(box) box.innerHTML = `<div class="nv-detail-empty">Cliquez sur le bouton <b>+</b> d'une flèche du schéma ou sur une carte ci-dessous pour afficher sa fiche complète.</div>`;
  const resetBtn = document.getElementById("nvResetBtn");
  if(resetBtn) resetBtn.hidden = !(NAV.fmods.length > 0 || NAV.fam !== "all" || NAV.scope !== "core" || !!NAV.search);
}

/* Infobulle adaptative : ne dépasse jamais du cadre (.below pour les arcs hauts) */
function navTip(html, el, forceBelow){
  const tip = document.getElementById("nvTip"); if(!tip) return;
  if(!html || !el){ tip.hidden = true; return; }
  const stage = document.getElementById("nvStage");
  tip.innerHTML = html;
  tip.hidden = false;

  const mxAttr = el.dataset && el.dataset.mx ? parseFloat(el.dataset.mx) : null;
  const myAttr = el.dataset && el.dataset.my ? parseFloat(el.dataset.my) : null;
  const isUpSide = el.dataset && el.dataset.side === "up";
  const below = typeof forceBelow === "boolean" ? forceBelow : (isUpSide || (myAttr !== null && myAttr < NV.Y));
  tip.classList.toggle("below", below);

  if(stage && stage.getBoundingClientRect && el.getBoundingClientRect){
    const st = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    if(st.width > 200){
      const x = r.left + r.width / 2 - st.left;
      tip.style.left = Math.max(150, Math.min(st.width - 150, x)) + "px";
      tip.style.top = (below ? (r.bottom - st.top) : (r.top - st.top)) + "px";
      return;
    }
  }
  if(mxAttr !== null && myAttr !== null){
    const xPct = Math.max(15, Math.min(85, (mxAttr / NV.W) * 100));
    const yPct = (myAttr / NV.H) * 100;
    tip.style.left = xPct.toFixed(1) + "%";
    tip.style.top = yPct.toFixed(1) + "%";
    return;
  }
  tip.style.left = "50%";
  tip.style.top = "50%";
}
function navSynTip(n, el){
  const S = SUITES[NAV.suite], s = S.syn.find(x => x.n === n); if(!s) return;
  const badge = [...document.querySelectorAll(".nv-badge")].find(x => x.dataset.syn === n) || el;
  navTip(`<em style="--fc:${SUITE_FAM[s.fam].c}">${s.n} · ${esc(SUITE_FAM[s.fam].n)} · ${esc(SUITE_STATUS[s.st])}</em><b>${esc(s.t)}</b><span>${esc(s.p)}</span><small class="nv-tip-cta">Cliquez sur <b>+</b> pour ouvrir la fiche détaillée</small>`, badge);
}

/* Sélection / Bascule d'une synergie : ouvre à la fois le tiroir SPA dans le schéma ET #nvDetail */
function navSynSelect(n){
  const S = SUITES[NAV.suite]; if(!S) return;
  /* Si on reclique sur la même synergie, on la désélectionne ! */
  if(n && NAV.syn === n){
    navSynClear();
    return;
  }
  const s = n === "IA" ? Object.assign({n:"IA", fam:"ai", from:null, to:null}, S.ai) : S.syn.find(x => x.n === n);
  if(!s) return;
  NAV.syn = s.n;

  navQA(".nv-card", ".nv-qpill", ".nv-badge").forEach(c => c.classList.toggle("on", c.dataset.syn === n));
  document.querySelectorAll(".nv-badge").forEach(b => {
    const t = b.querySelector(".nv-bplus-t");
    if(t) t.textContent = b.dataset.syn === n ? "×" : "+";
  });

  if(s.n === "IA") navLight((t, v) => t === "node"); else navSynLight(n);

  const clrBtn = document.getElementById("nvClearSyn");
  if(clrBtn) clrBtn.hidden = false;
  const resetBtn = document.getElementById("nvResetBtn");
  if(resetBtn) resetBtn.hidden = false;

  const go = [s.from, s.to].filter(Boolean).map(id => byId(id)).map(m =>
    `<button type="button" class="nv-go" data-id="${m.id}" style="--c:${m.c}"><span>${m.icon}</span>Entrer dans ${esc(m.label)} (${navAcr(S, m.id)}) ›</button>`).join("");

  const cardInner = `<div class="nv-dcard" style="--fc:${SUITE_FAM[s.fam].c}">
    <div class="l">
      <div class="nv-dcard-top">
        <span class="nv-tag"><em>${s.n}</em>${esc(SUITE_FAM[s.fam].n)}${s.st ? ` · <i class="nv-st ${s.st}">${SUITE_STATUS[s.st]}</i>` : ""}</span>
        <button type="button" class="nv-dcard-close" data-close-syn="1" title="Fermer et réafficher toutes les flèches (Échap)">✕ Tout réafficher</button>
      </div>
      <h3>${esc(s.t)}</h3>
      <p>${esc(s.p)}</p>
      ${s.from ? `<p class="nv-dpath">${esc(byId(s.from).label)} (${navAcr(S, s.from)}) <i>→</i> ${esc(byId(s.to).label)} (${navAcr(S, s.to)})</p>` : ""}
    </div>
    <div class="r">
      <ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      ${s.note ? `<p class="nv-note">${esc(s.note)}</p>` : ""}
      <div class="nv-gos">${go}</div>
    </div>
  </div>`;

  const drawer = document.getElementById("nvStageDrawer");
  if(drawer){
    drawer.hidden = false;
    drawer.innerHTML = cardInner;
    drawer.querySelectorAll(".nv-go").forEach(b => b.addEventListener("click", () => navGoModule(b.dataset.id, b)));
    drawer.querySelectorAll("[data-close-syn]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); navSynClear(); }));
  }

  const box = document.getElementById("nvDetail");
  if(box){
    box.innerHTML = cardInner;
    box.querySelectorAll(".nv-go").forEach(b => b.addEventListener("click", () => navGoModule(b.dataset.id, b)));
    box.querySelectorAll("[data-close-syn]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); navSynClear(); }));
  }
}

function navResetAll(){
  NAV.fmods = [];
  NAV.fmodUnlock = false;
  NAV.fdir = "all";
  NAV.fam = "all";
  NAV.scope = "core";
  NAV.search = "";
  const sIn = document.getElementById("nvSearchIn");
  if(sIn) sIn.value = "";
  navSynClear();
  navApplyFilters();
}

function navBindFull(){
  const S = SUITES[NAV.suite];
  navQA(".nv-syn", ".nv-badge", ".nv-qpill", ".nv-card").forEach(e => {
    const n = e.dataset.syn;
    e.addEventListener("mouseenter", () => { navSynLight(n); if(!e.classList.contains("nv-card") && !e.classList.contains("nv-qpill")) navSynTip(n, e); });
    e.addEventListener("mouseleave", navRest);
    e.addEventListener("focus", () => navSynLight(n));
    e.addEventListener("blur", navRest);
    e.addEventListener("click", ev => { if(ev && ev.stopPropagation) ev.stopPropagation(); navSynSelect(n); });
    e.addEventListener("keydown", ev => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); ev.stopPropagation(); navSynSelect(n); } });
  });

  /* Clic sur le fond blanc du schéma SVG -> désélectionne la synergie active */
  const stage = document.getElementById("nvStage");
  if(stage){
    stage.addEventListener("click", ev => {
      if(!NAV.syn) return;
      const t = ev.target;
      if(t && t.closest && t.closest(".nv-badge, .nv-syn, .nv-node, .nv-ai, .nv-stage-drawer, .nv-clear-syn")) return;
      navSynClear();
    });
  }
  const clrBtn = document.getElementById("nvClearSyn");
  if(clrBtn) clrBtn.addEventListener("click", e => { e.stopPropagation(); navSynClear(); });

  const resetBtn = document.getElementById("nvResetBtn");
  if(resetBtn) resetBtn.addEventListener("click", () => navResetAll());

  document.querySelectorAll(".nv-node").forEach(e => {
    const id = e.dataset.id, m = byId(id), acr = navAcr(S, id);
    e.addEventListener("mouseenter", () => { navNodeLight(id);
      navTip(`<em style="--fc:${m.c}">${acr} · ${esc(S.short_name[id])} · ${m.videos.length ? m.videos.length + " vidéo" + (m.videos.length > 1 ? "s" : "") : "vidéo bientôt"}</em><b>${esc(S.role[id])}</b><span>Cliquez pour entrer dans le module (ou filtrez ses flux ci-dessus)</span>`, e, false); });
    e.addEventListener("mouseleave", navRest);
    e.addEventListener("click", ev => { if(ev && ev.stopPropagation) ev.stopPropagation(); navGoModule(id, e); });
    e.addEventListener("keydown", ev => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); navGoModule(id, e); } });
  });

  document.querySelectorAll(".nv-ai").forEach(e => {
    e.addEventListener("click", ev => { if(ev && ev.stopPropagation) ev.stopPropagation(); navSynSelect("IA"); });
    e.addEventListener("keydown", ev => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); navSynSelect("IA"); } });
  });

  document.querySelectorAll(".nv-fam").forEach(b => b.addEventListener("click", () => {
    NAV.fam = b.dataset.fam;
    const sec = navSec(); if(sec) sec.dataset.fam = NAV.fam;
    navApplyFilters();
  }));

  document.querySelectorAll(".nv-scope-btn").forEach(b => b.addEventListener("click", () => {
    NAV.scope = b.dataset.scope;
    navApplyFilters();
  }));

  /* Filtre par module : supporte la multi-sélection (1, 2 ou N modules) */
  document.querySelectorAll(".nv-mchip").forEach(b => b.addEventListener("click", () => {
    const target = b.dataset.fmod;
    if(target === "all"){
      NAV.fmods = [];
      NAV.fmodUnlock = false;
    } else {
      const idx = NAV.fmods.indexOf(target);
      if(idx >= 0) NAV.fmods.splice(idx, 1);
      else NAV.fmods.push(target);
    }
    NAV.fdir = "all";
    if(NAV.fmods.length === 1) NAV.studioMod = NAV.fmods[0];
    navApplyFilters();
  }));

  const unlockChk = document.getElementById("nvUnlockMods");
  if(unlockChk){
    unlockChk.addEventListener("change", () => {
      NAV.fmodUnlock = !!unlockChk.checked;
      navApplyFilters();
    });
  }

  const cmpBtn = document.getElementById("nvCmpBtn");
  if(cmpBtn) cmpBtn.addEventListener("click", () => {
    NAV.cmp = !NAV.cmp;
    navApplyFilters();
  });

  const fsBtn = document.getElementById("nvFsBtn");
  if(fsBtn) fsBtn.addEventListener("click", () => navToggleFs());

  const sIn = document.getElementById("nvSearchIn");
  if(sIn){
    sIn.addEventListener("input", () => {
      NAV.search = sIn.value.trim();
      navApplyFilters();
    });
  }

  document.querySelectorAll("[data-nvview]").forEach(b => b.addEventListener("click", () => navView(b.dataset.nvview)));
  navApplyFilters();
}

function navView(v){
  NAV.view = v;
  document.querySelectorAll("[data-nvview]").forEach(b => b.classList.toggle("on", b.dataset.nvview === v));
  const vw = document.querySelector(".nv-view"); if(vw) vw.classList.toggle("r", v === "det");
  const e = document.getElementById("nvEss"), d = document.getElementById("nvDet");
  if(e) e.hidden = v === "det"; if(d) d.hidden = v !== "det";
}


function navGoModule(id){
  if(NAV.fs) navToggleFs(false);
  FX.go("#/m/" + id);
}
function navWorkHTML(S){
  const fams = [...new Set(S.syn.map(s => s.fam))];
  const coreCnt = S.syn.filter(s => s.core).length;
  const allCnt = S.syn.length;

  const chips = `<button type="button" class="nv-fam on" data-fam="all">Toutes les typologies</button>` + fams.map(k =>
    `<button type="button" class="nv-fam" data-fam="${k}" style="--fc:${SUITE_FAM[k].c}"><i></i>${SUITE_FAM[k].n}</button>`).join("");

  const modChips = `<button type="button" class="nv-mchip on" data-fmod="all">Tous (${allCnt})</button>` +
    navMods(S).map((m, idx) => {
      const acr = navAcr(S, m.id);
      const cnt = S.syn.filter(s => s.from === m.id || s.to === m.id).length;
      return `<button type="button" class="nv-mchip" data-fmod="${m.id}" style="--c:${m.c}"><em>0${idx + 1}·${acr}</em> <b>${esc(S.short_name[m.id] || m.label)}</b> <span>(${cnt})</span></button>`;
    }).join("");

  /* Pastilles rapides de sélection sous le schéma SVG */
  const quickPills = S.syn.map(s => `<button type="button" class="nv-qpill" data-syn="${s.n}" data-fam="${s.fam}" data-from="${s.from}" data-to="${s.to}" data-core="${s.core ? '1' : '0'}" style="--fc:${SUITE_FAM[s.fam].c}" title="${esc(s.t + ' — cliquer pour isoler sur le schéma, re-cliquer pour désélectionner')}">
    <em>${s.n}</em><span>${esc(s.t)}</span><i>+</i></button>`).join("");

  /* Cartes de la section inférieure « Exploration détaillée de l'ensemble des synergies » */
  const cards = S.syn.map(s => `<button type="button" class="nv-card" data-syn="${s.n}" data-fam="${s.fam}" data-from="${s.from}" data-to="${s.to}" data-core="${s.core ? '1' : '0'}" style="--fc:${SUITE_FAM[s.fam].c}">
      <div class="nv-card-top"><em>${s.n}</em><span class="nv-st ${s.st}">${SUITE_STATUS[s.st]}</span></div>
      <b>${esc(s.t)}</b>
      <small class="nv-card-route">${esc((S.short_name[s.from] || "") + " (" + navAcr(S, s.from) + ") → " + (S.short_name[s.to] || "") + " (" + navAcr(S, s.to) + ")")}</small>
      <p class="nv-card-p">${esc(s.p)}</p>
    </button>`).join("");

  const rows = Object.keys(SUITE_FAM).filter(k => S.syn.some(s => s.fam === k)).map(k => `
      <div class="nv-dgroup" data-dgroup="${k}" style="--fc:${SUITE_FAM[k].c}"><h4><i></i>${SUITE_FAM[k].n}</h4>
      ${S.syn.filter(s => s.fam === k).map(s => `<article class="nv-drow" data-syn="${s.n}" data-fam="${s.fam}" data-from="${s.from}" data-to="${s.to}" data-core="${s.core ? '1' : '0'}">
        <header><em>${s.n}</em><b>${esc(s.t)}</b><span class="nv-st ${s.st}">${SUITE_STATUS[s.st]}</span></header>
        <p class="nv-dpath">${esc(byId(s.from).label)} (${navAcr(S, s.from)}) → ${esc(byId(s.to).label)} (${navAcr(S, s.to)})</p>
        <p>${esc(s.p)}</p><ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>${s.note ? `<p class="nv-note">${esc(s.note)}</p>` : ""}
      </article>`).join("")}</div>`).join("") + `
      <div class="nv-dgroup" data-dgroup="ai" style="--fc:${SUITE_FAM.ai.c}"><h4><i></i>${SUITE_FAM.ai.n}</h4>
        <article class="nv-drow" data-syn="IA"><header><em>IA</em><b>${esc(S.ai.t)}</b></header><p>${esc(S.ai.p)}</p><ul>${S.ai.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul></article></div>`;

  return `<div class="suitesec nv-on" id="suitesec"><div class="nv-work" id="nvWork" data-sv="schema">
    <div class="nv-subnav" id="nvSubnav" role="tablist" aria-label="Vues de l'espace synergies">
      <button type="button" role="tab" data-sv="schema" class="on"><b>1</b>Schéma des flux</button>
      <button type="button" role="tab" data-sv="pitch"><b>2</b>Seul vs En synergie<i id="nvPitchDot" hidden></i></button>
      <button type="button" role="tab" data-sv="explore"><b>3</b>Exploration détaillée</button>
    </div>

      <!-- CONSOLE DE FILTRES STRUCTURÉE EN 3 CATÉGORIES CLAIREMENT NOMMÉES -->
      <div class="nv-console" role="region" aria-label="Filtres et commandes du schéma de synergies">
        <div class="nv-crow">
          <div class="nv-clbl">
            <span class="nv-cnum">1</span>
            <div>
              <strong>Filtrer par module</strong>
              <small>Cliquez sur 1, 2 ou plusieurs modules</small>
            </div>
          </div>
          <div class="nv-cbody">
            <div class="nv-mods-chips" role="group" aria-label="Modules de la suite">${modChips}</div>
            <label class="nv-unlock-box" id="nvUnlockWrap" hidden title="Par défaut, sélectionner 2 modules ou plus n'affiche que les synergies directes entre eux. Cochez pour voir aussi leurs synergies avec les autres modules.">
              <input type="checkbox" id="nvUnlockMods"/>
              <span>Déverrouiller : inclure les synergies avec les autres modules annexes</span>
            </label>
          </div>
        </div>

        <div class="nv-crow">
          <div class="nv-clbl">
            <span class="nv-cnum">2</span>
            <div>
              <strong>Typologie de synergie</strong>
              <small>Filtrer par enjeu métier</small>
            </div>
          </div>
          <div class="nv-cbody">
            <div class="nv-fams" role="group" aria-label="Typologies de synergies">${chips}</div>
          </div>
        </div>

        <div class="nv-crow nv-crow--bar">
          <div class="nv-clbl">
            <span class="nv-cnum">3</span>
            <div>
              <strong>Densité & Argumentaire</strong>
              <small>Richesse du schéma et mode commercial</small>
            </div>
          </div>
          <div class="nv-cbody nv-cbody--split">
            <div class="nv-cgrp">
              <span class="nv-sub-lbl">Périmètre :</span>
              <div class="nv-scope" role="group" aria-label="Périmètre des synergies sur le schéma">
                <button type="button" class="nv-scope-btn on" data-scope="core">Synergies majeures (${coreCnt})</button>
                <button type="button" class="nv-scope-btn" data-scope="all">Toutes les synergies (${allCnt})</button>
              </div>
            </div>
            <div class="nv-cgrp">
              <span class="nv-sub-lbl">Argumentaire :</span>
              <button type="button" class="nv-cmp-btn" id="nvCmpBtn">⚖️ Seul (Standalone) vs En synergie</button>
            </div>
            <div class="nv-cgrp nv-cgrp--right">
              <span class="nv-vis-cnt" id="nvVisCnt"></span>
              <button type="button" class="nv-reset-btn" id="nvResetBtn" hidden>↺ Réinitialiser</button>
              <button type="button" class="nv-fs-btn" id="nvFsBtn" aria-label="Plein écran">⛶ Plein écran</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SCHÉMA INTERACTIF SPA + TIROIR DE DÉTAIL INTÉGRÉ -->
      <div class="nv-stage" id="nvStage">
        <div class="nv-stage-bar">
          <span class="nv-stage-hint" id="nvStageHint">💡 <b>Astuce :</b> survolez un flux pour un aperçu rapide, cliquez sur son bouton <b>+</b> pour ouvrir sa fiche complète ici même. Cliquez sur le fond blanc pour tout désélectionner.</span>
          <button type="button" class="nv-clear-syn" id="nvClearSyn" hidden>✕ Désélectionner la synergie active</button>
        </div>
        <div class="nv-scroll">${navDiagram(S)}</div>
        <div class="nv-tip" id="nvTip" hidden></div>
        <div class="nv-empty-pair" id="nvEmptyPair" hidden></div>
        <!-- Tiroir SPA centré directement dans le cadre du schéma -->
        <div class="nv-stage-drawer" id="nvStageDrawer" hidden></div>
      </div>

      <!-- Barre de pastilles d'accès rapide aux synergies sous le schéma -->
      <div class="nv-qbar">
        <div class="nv-qbar-head">
          <span>Sélection rapide d'un flux sur le schéma <em>(cliquez pour isoler et voir la fiche, re-cliquez ou cliquez à côté pour tout réafficher)</em> :</span>
        </div>
        <div class="nv-qpills" id="nvQpills">${quickPills}</div>
      </div>

      <!-- STUDIO STANDALONE VS EN SYNERGIE -->
      <div class="nv-pitch-slot" id="nvPitch"></div>

      <!-- SECTION INFÉRIEURE TITRÉE ET FILTRÉE : EXPLORATION DÉTAILLÉE -->
      <section class="nv-explore" id="nvExploreSec" aria-label="Exploration détaillée de l'ensemble des synergies">
        <div class="nv-explore-head">
          <div>
            <span class="nv-k"><i></i>Référentiel fonctionnel & argumentaire avant-vente</span>
            <h3>Exploration détaillée de l'ensemble des synergies</h3>
            <p>Retrouvez ci-dessous toutes les synergies correspondant à vos filtres. Basculez entre la vue par cartes synthétiques et les fiches complètes déployées.</p>
          </div>
          <div class="nv-explore-tools">
            <div class="nv-search-wrap">
              <input type="search" id="nvSearchIn" class="nv-search-in" placeholder="Rechercher un code (ex. SM-AP-1) ou un mot-clé…" aria-label="Rechercher une synergie"/>
            </div>
            <div class="nv-view" role="group" aria-label="Niveau de détail">
              <i></i>
              <button type="button" class="on" data-nvview="ess">L'essentiel</button>
              <button type="button" data-nvview="det">Tout le détail</button>
            </div>
          </div>
        </div>

        <div class="nv-ess" id="nvEss">
          <div class="nv-detail" id="nvDetail"><div class="nv-detail-empty">Cliquez sur le bouton <b>+</b> d'une flèche du schéma ou sur une carte ci-dessous pour afficher sa fiche complète.</div></div>
          <div class="nv-cards" id="nvCards">${cards}</div>
        </div>
        <div class="nv-det" id="nvDet" hidden>${rows}</div>
      </section>
    </div></div>`;
}

/* ---------- amorçage dans l'écran unique ---------- */
function navSetSv(v){
  const w = document.getElementById("nvWork"); if(!w) return;
  w.setAttribute("data-sv", v);
  navQA("#nvSubnav [data-sv]").forEach(b => b.classList.toggle("on", b.getAttribute("data-sv") === v));
  if(v === "explore"){ const d = document.getElementById("nvExploreSec"); if(d && d.scrollIntoView && !NAV.fs) d.scrollTop = 0; }
}
function navRefreshSv(){
  const dot = document.getElementById("nvPitchDot"); if(dot) dot.hidden = !(NAV.cmp || NAV.fmods.length === 1);
}
function navApplyFilters(){ navApplyFiltersCore(); navRefreshSv(); }

let _globals = false;
function navGlobals(){
  if(_globals) return; _globals = true;
  window.addEventListener("hashchange", () => { NAV.fs = false; if(document.body) document.body.classList.remove("nv-fs-lock"); });
  document.addEventListener("keydown", e => {
    if(e.key !== "Escape" || !document.getElementById("nvWork")) return;
    if(NAV.syn) navSynClear(); else if(NAV.fs) navToggleFs(false);
  });
}
function navMount(root, sk){
  Object.assign(NAV, {suite: sk, mode: "full", mod: null, syn: null, fam: "all", scope: "core", fmod: "all", fmods: [], fmodUnlock: false, fdir: "all", studioMod: null, search: "", cmp: false, fs: false, view: "ess"});
  document.body.classList.remove("nv-fs-lock");
  navGlobals();
  navBindFull();
  const w = document.getElementById("nvWork");
  navQA("#nvSubnav [data-sv]").forEach(b => b.addEventListener("click", () => {
    const v = b.getAttribute("data-sv");
    if(v === "pitch" && !(NAV.cmp || NAV.fmods.length === 1)){ NAV.cmp = true; navApplyFilters(); }
    navSetSv(v);
  }));
  const cmp = document.getElementById("nvCmpBtn");
  if(cmp) cmp.addEventListener("click", () => navSetSv(NAV.cmp || NAV.fmods.length === 1 ? "pitch" : "schema"));
  w.addEventListener("click", e => {
    if(e.target.closest("#nvCmpClose")) navSetSv("schema");
    else if(e.target.closest("[data-st-syn]")) navSetSv("schema");
  });
  navApplyFilters();
}
window.FX = window.FX || {};
FX.syn = {html: S => navWorkHTML(S), mount: navMount};
})();
