/* fx-suite.js : une suite = un écran à onglets.
   Synergies : un seul schéma circulaire, des filtres, le détail dans un panneau latéral. */
(function () {
  "use strict";
  const E = FX.E;
  const TABS = sk => [{k: "syn", l: "Synergies", i: "sync"}, {k: "duo", l: "Seul ou en suite", i: "layers"}, {k: "ia", l: "IA", i: "spark"}]
    .concat(sk === "S2P" ? [{k: "budget", l: "Chaîne budgétaire", i: "euro"}] : []);
  const shortN = (sk, id) => (SUITES[sk].short_name || {})[id] || FX.mod(id).label;

  /* ---------------------- synergies : schéma de flux (repris à l'identique de l'ancienne version) ----------------------
     Modules alignés sur une ligne, flux en arcs au-dessus et au-dessous, pastille de code sur chaque flux,
     barre IA transverse en bas. Seuls l'usage des informations et l'affichage du détail ont changé. */
  const NV = {W: 1240, H: 720, Y: 320, R: 56};
  const navX = (S, i) => 115 + i * (1010 / (S.order.length - 1));
  const acrOf = (S, id) => (S.acr && S.acr[id]) || String(id).toUpperCase();
  function navGeom(S) {
    const idx = {}; S.order.forEach((id, i) => { idx[id] = i; });
    const used = {};
    const pt = (id, side, dir) => {
      const k = id + "_" + side + "_" + dir, c = used[k] = (used[k] || 0) + 1;
      const o = dir * Math.min(44, 6 + 10 * (c - 1) + 5);
      const x = navX(S, idx[id]) + o, dy = Math.sqrt(Math.max(100, NV.R * NV.R - o * o));
      return [x, side === "up" ? NV.Y - dy : NV.Y + dy];
    };
    return S.syn.map(s => {
      const dir = idx[s.to] > idx[s.from] ? 1 : -1;
      const [x1, y1] = pt(s.from, s.side, dir), [x2, y2] = pt(s.to, s.side, -dir);
      const span = Math.abs(idx[s.to] - idx[s.from]);
      const lvl = typeof s.lvl === "number" ? s.lvl : span;
      const h = (36 + 44 * lvl) * (s.side === "up" ? -1 : 1), cy1 = y1 + h, cy2 = y2 + h;
      const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} C${x1.toFixed(1)} ${cy1.toFixed(1)} ${x2.toFixed(1)} ${cy2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      const t = typeof s.tp === "number" ? s.tp : 0.5, u = 1 - t;
      const mx = (u * u * u) * x1 + 3 * (u * u) * t * x1 + 3 * u * (t * t) * x2 + (t * t * t) * x2;
      const my = (u * u * u) * y1 + 3 * (u * u) * t * cy1 + 3 * u * (t * t) * cy2 + (t * t * t) * y2;
      return {s, d, mx, my};
    });
  }
  function navLines(t) {
    if (t.length <= 12 || t.indexOf(" ") < 0) return [t];
    const w = t.split(" "); let best = [t], bd = 99;
    for (let k = 1; k < w.length; k++) { const x = w.slice(0, k).join(" "), y = w.slice(k).join(" "), d = Math.abs(x.length - y.length); if (d < bd) { bd = d; best = [x, y]; } }
    return best;
  }
  const dataAttrs = s => `data-syn="${s.n}" data-fam="${s.fam}" data-from="${s.from}" data-to="${s.to}" data-core="${s.core ? "1" : "0"}"`;
  function flowSVG(sk) {
    const S = SUITES[sk], g = navGeom(S);
    const marks = Object.keys(SUITE_FAM).map(k => `<marker id="nvA-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${SUITE_FAM[k].c}"/></marker>`).join("");
    const paths = g.map(({s, d}) => { const c = SUITE_FAM[s.fam].c;
      return `<g class="nv-syn${s.st === "cfg" ? " cfg" : ""}" ${dataAttrs(s)} style="--fc:${c}"><path class="nv-hit" d="${d}"/><path class="nv-base" d="${d}" stroke="${c}" marker-end="url(#nvA-${s.fam})"/><path class="nv-flow" d="${d}" stroke="${c}"/></g>`; }).join("");
    const badges = g.map(({s, mx, my}) => { const c = SUITE_FAM[s.fam].c, pw = Math.max(64, Math.round(s.n.length * 7.2 + 28)), ph = 24;
      const rx = mx - pw / 2, ry = my - ph / 2, plusX = mx + pw / 2 - 11, textX = mx - 6;
      return `<g class="nv-badge" ${dataAttrs(s)} style="--fc:${c}" role="button" tabindex="0" aria-label="${E(s.n + " : " + s.t)}">
        <rect class="nv-bpill" x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${pw}" height="${ph}" rx="12"/>
        <text class="nv-bcode" x="${textX.toFixed(1)}" y="${(my + 4).toFixed(1)}">${s.n}</text>
        <circle class="nv-bplus" cx="${plusX.toFixed(1)}" cy="${my.toFixed(1)}" r="7.5"/>
        <text class="nv-bplus-t" x="${plusX.toFixed(1)}" y="${(my + 3.8).toFixed(1)}">+</text></g>`; }).join("");
    const nodes = S.order.map((id, i) => { const m = FX.mod(id), x = navX(S, i), y = NV.Y, nm = shortN(sk, id), acr = acrOf(S, id);
      const cnt = S.syn.filter(s => s.from === id || s.to === id).length;
      return `<g class="nv-node" data-id="${id}" style="--c:${m.c};--d:${(i * 0.07).toFixed(2)}s" role="button" tabindex="0" aria-label="${E(m.label + " (" + acr + ") : " + (S.role[id] || ""))}">
        <circle class="nv-glow" cx="${x}" cy="${y}" r="${NV.R + 14}"/><circle class="nv-orbit" cx="${x}" cy="${y}" r="${NV.R + 6}" style="--od:${(i * 0.4).toFixed(1)}s"/>
        <circle class="nv-disc" cx="${x}" cy="${y}" r="${NV.R}"/><circle class="nv-tint" cx="${x}" cy="${y}" r="${NV.R - 8}"/>
        <text class="nv-num" x="${x}" y="${y - 31}">${String(i + 1).padStart(2, "0")} · ${acr}</text>
        <text class="nv-ico" x="${x}" y="${y + 2}">${m.icon}</text>
        ${navLines(nm).map((l, k, L) => `<text class="nv-nm${l.length > 11 ? " sm" : ""}" x="${x}" y="${y + (L.length > 1 ? 20 : 24) + k * 13}">${E(l)}</text>`).join("")}
        <g class="nv-ncnt" transform="translate(${x + NV.R - 10},${y - NV.R + 10})"><circle r="11" fill="${m.c}"/><text y="3.5" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff" font-family="Barlow,sans-serif">${cnt}</text></g></g>`; }).join("");
    const n = S.order.length, bx = navX(S, 0) - 70, bw = navX(S, n - 1) - navX(S, 0) + 140;
    const dots = S.order.map((id, i) => `<circle class="nv-aidot" cx="${navX(S, i)}" cy="${NV.H - 46}" r="4.5" style="--d:${(i * .3).toFixed(1)}s"/>`).join("");
    const ai = `<g class="nv-ai" role="button" tabindex="0" aria-label="${E(S.ai.t)}"><rect x="${bx}" y="${NV.H - 72}" width="${bw}" height="50" rx="25"/>${dots}<text x="${NV.W / 2}" y="${NV.H - 31}">${E(S.ai.t)} · cliquer pour le détail</text></g>`;
    return `<svg class="nv-svg" viewBox="0 0 ${NV.W} ${NV.H}" role="group" aria-label="Flux et synergies de la suite ${E(S.name)}"><rect x="0" y="0" width="${NV.W}" height="${NV.H}" fill="transparent"/><defs>${marks}</defs>${paths}${ai}${nodes}${badges}</svg>`;
  }

  function synTab(sk) {
    const S = SUITES[sk], fams = Object.keys(SUITE_FAM).filter(f => S.syn.some(s => s.fam === f));
    const core = S.syn.filter(s => s.core).length;
    return `<div class="fx-syn">
      <div class="fx-syn-f">
        <div class="fx-fchips" role="group" aria-label="Filtrer par famille">
          <button type="button" class="fx-fc on" data-fam="all">Toutes les familles</button>
          ${fams.map(f => `<button type="button" class="fx-fc" data-fam="${f}" style="--c:${SUITE_FAM[f].c}"><i></i>${E(SUITE_FAM[f].n)}</button>`).join("")}
        </div>
        <span class="fx-cnt" id="fxCount" aria-live="polite"></span>
        <label class="fx-sw"><input type="checkbox" id="fxAll"><span class="fx-sw-t"></span><span>Afficher les ${S.syn.length} synergies <small>(${core} clés par défaut)</small></span></label>
      </div>
      <div class="fx-syn-b">
        <div class="fx-chord">${flowSVG(sk)}</div>
        <aside class="fx-synp" id="fxPanel" aria-live="polite"></aside>
      </div>
    </div>`;
  }

  function mountSyn(el, sk) {
    const S = SUITES[sk], st = {fam: "all", all: false, sel: null, mod: null, ai: false};
    const box = el.querySelector(".fx-chord"), panel = el.querySelector("#fxPanel"), count = el.querySelector("#fxCount");
    const svg = box.querySelector(".nv-svg");
    const all = sel => Array.prototype.slice.call(svg.querySelectorAll(sel));
    const flows = all(".nv-syn"), badges = all(".nv-badge"), nodes = all(".nv-node");
    const byN = n => S.syn.filter(s => s.n === n)[0];
    const inMod = s => !st.mod || s.from === st.mod || s.to === st.mod;
    const visible = () => S.syn.filter(s => (st.all || s.core) && (st.fam === "all" || s.fam === st.fam) && inMod(s));
    const badge = s => s.st === "cfg" ? '<span class="fx-bd cfg">Sur configuration</span>' : '<span class="fx-bd ok">Disponible</span>';
    const fromTo = s => `<div class="fx-ft"><a class="fx-mc" href="#/m/${s.from}" style="--c:${FX.mod(s.from).c}">${FX.mod(s.from).icon} ${E(shortN(sk, s.from))}</a><span aria-hidden="true">${FX.arrow}</span><a class="fx-mc" href="#/m/${s.to}" style="--c:${FX.mod(s.to).c}">${FX.mod(s.to).icon} ${E(shortN(sk, s.to))}</a></div>`;
    const pill = s => `<button type="button" class="fx-row" data-n="${s.n}" style="--c:${SUITE_FAM[s.fam].c}"><i></i><span><b>${E(s.n)} · ${E(s.t)}</b><small>${E(shortN(sk, s.from))} ${FX.arrow} ${E(shortN(sk, s.to))}</small></span>${FX.arrow}</button>`;

    function paintPanel() {
      if (st.sel) {
        const s = byN(st.sel), f = SUITE_FAM[s.fam];
        panel.innerHTML = `<div class="fx-pd" style="--c:${f.c}"><div class="fx-pd-h"><span class="fx-fam"><i></i>${E(f.n)} · ${E(s.n)}</span>${badge(s)}</div>
          ${fromTo(s)}<h3>${E(s.t)}</h3><p>${E(s.p)}</p>
          <ul>${s.d.map(x => `<li>${E(x)}</li>`).join("")}</ul>
          <button type="button" class="fx-btn ghost" data-act="clear">${FX.back}${st.mod ? "Retour au module" : "Retour à la liste"}</button></div>`;
      } else if (st.ai) {
        panel.innerHTML = `<div class="fx-pd" style="--c:${SUITE_FAM.ai.c}"><div class="fx-pd-h"><span class="fx-fam"><i></i>${E(SUITE_FAM.ai.n)}</span></div>
          <h3>${E(S.ai.t)}</h3><p>${E(S.ai.p)}</p><ul>${S.ai.d.map(x => `<li>${E(x)}</li>`).join("")}</ul>
          <button type="button" class="fx-btn ghost" data-act="clear">${FX.back}Retour</button></div>`;
      } else if (st.mod) {
        const m = FX.mod(st.mod), l = visible(), ins = l.filter(s => s.to === st.mod), outs = l.filter(s => s.from === st.mod);
        panel.innerHTML = `<div class="fx-pl"><div class="fx-pl-h"><span class="fx-mc big" style="--c:${m.c}">${m.icon} ${E(shortN(sk, st.mod))}</span>
          <a class="fx-btn sm" href="#/m/${st.mod}">Ouvrir le module${FX.arrow}</a></div>
          <p class="fx-hint">${E(S.role[st.mod] || "")}.${l.length ? "" : " Aucune synergie visible avec ce filtre : essayez « Toutes les familles » ou affichez toutes les synergies."}</p>
          ${ins.length ? `<h4 class="fx-gh">Reçoit en amont (${ins.length})</h4><ul class="fx-rows">${ins.map(s => `<li>${pill(s)}</li>`).join("")}</ul>` : ""}
          ${outs.length ? `<h4 class="fx-gh">Alimente en aval (${outs.length})</h4><ul class="fx-rows">${outs.map(s => `<li>${pill(s)}</li>`).join("")}</ul>` : ""}
          <button type="button" class="fx-btn ghost" data-act="clear">${FX.back}Tous les modules</button></div>`;
      } else {
        panel.innerHTML = `<div class="fx-pi"><h3>Comment lire ce schéma</h3>
          <p>Chaque flux est une synergie : le module de départ nourrit le module d'arrivée (la flèche). Le code indique l'émetteur puis le récepteur. <b>Cliquez la pastille +</b> d'un flux pour le détail, ou <b>un module</b> pour isoler ses liens.</p>
          <ul class="fx-leg">${Object.keys(SUITE_FAM).filter(f => S.syn.some(s => s.fam === f)).map(f => `<li style="--c:${SUITE_FAM[f].c}"><i></i><span>${E(SUITE_FAM[f].n)}</span><b>${S.syn.filter(s => s.fam === f).length}</b></li>`).join("")}</ul>
          <p class="fx-hint">Flux en pointillés fins : synergie disponible sur configuration.</p></div>`;
      }
    }
    /* mise en lumière : un flux, sa pastille et ses deux modules */
    function light(n) {
      const s = n ? byN(n) : null;
      flows.concat(badges).forEach(g => g.classList.toggle("lit", !!s && g.getAttribute("data-syn") === n));
      nodes.forEach(g => g.classList.toggle("lit", !!s && (g.getAttribute("data-id") === s.from || g.getAttribute("data-id") === s.to)));
      badges.forEach(g => g.classList.toggle("on", !!st.sel && g.getAttribute("data-syn") === st.sel));
      box.classList.toggle("nv-hl", !!s);
    }
    function paint() {
      const vis = visible(), ok = {}; vis.forEach(s => { ok[s.n] = 1; });
      flows.concat(badges).forEach(g => g.classList.toggle("off", !ok[g.getAttribute("data-syn")]));
      nodes.forEach(g => g.classList.toggle("fmod-on", g.getAttribute("data-id") === st.mod));
      box.classList.toggle("has-mod", !!st.mod);
      count.textContent = vis.length + " synergie" + (vis.length > 1 ? "s" : "") + " affichée" + (vis.length > 1 ? "s" : "");
      light(st.sel);
      paintPanel();
    }
    box.addEventListener("mouseover", e => { if (st.sel) return; const t = e.target.closest && e.target.closest(".nv-syn, .nv-badge"); if (t && !t.classList.contains("off")) light(t.getAttribute("data-syn")); });
    box.addEventListener("mouseout", e => { if (st.sel) return; const t = e.target.closest && e.target.closest(".nv-syn, .nv-badge"); if (t) light(null); });
    el.addEventListener("click", e => {
      const fc = e.target.closest(".fx-fc");
      if (fc) { st.fam = fc.getAttribute("data-fam"); st.sel = null; st.ai = false; Array.prototype.forEach.call(el.querySelectorAll(".fx-fc"), b => b.classList.toggle("on", b === fc)); paint(); return; }
      const bd = e.target.closest(".nv-badge, .nv-syn");
      if (bd) { if (bd.classList.contains("off")) return; st.sel = bd.getAttribute("data-syn"); st.ai = false; paint(); return; }
      const nd = e.target.closest(".nv-node");
      if (nd) { const id = nd.getAttribute("data-id"); st.mod = st.mod === id ? null : id; st.sel = null; st.ai = false; paint(); return; }
      if (e.target.closest(".nv-ai")) { st.ai = true; st.sel = null; paint(); return; }
      const row = e.target.closest(".fx-row");
      if (row) { st.sel = row.getAttribute("data-n"); st.ai = false; paint(); return; }
      if (e.target.closest("[data-act='clear']")) { if (st.sel || st.ai) { st.sel = null; st.ai = false; } else st.mod = null; paint(); }
    });
    el.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target.closest && e.target.closest(".nv-badge, .nv-node, .nv-ai");
      if (t) { e.preventDefault(); t.dispatchEvent(new MouseEvent("click", {bubbles: true})); }
    });
    el.querySelector("#fxAll").addEventListener("change", e => { st.all = !!e.target.checked; st.sel = null; paint(); });
    paint();
    return st;
  }

  /* ---------------------- seul ou en suite ---------------------- */
  function duoTab(sk, id) {
    const S = SUITES[sk], P = S.pitch[id], m = FX.mod(id);
    return `<div class="fx-duo-sel" role="group" aria-label="Choisir un module">${FX.order(sk).map(i => {
      const mm = FX.mod(i);
      return `<button type="button" class="fx-mc pick${i === id ? " on" : ""}" data-pick="${i}" style="--c:${mm.c}">${mm.icon} <span>${E(shortN(sk, i))}</span></button>`; }).join("")}</div>
      <div class="fx-duo">
        <section class="fx-duo-c solo"><h3><span>Déployé seul</span><small>${E(P.full)}</small></h3>
          <ul>${P.solo.map(x => `<li><b>${E(x.k)}</b><span>${E(x.d)}</span></li>`).join("")}</ul>
          <p class="fx-limit">${E(P.limit)}</p></section>
        <div class="fx-duo-plus" aria-hidden="true">+</div>
        <section class="fx-duo-c suite" style="--c:${m.c}"><h3><span>Dans la suite</span><small>${E(S.name)}</small></h3>
          <ul>${P.syn.map(x => `<li><b>${E(x.k)}</b><span>${E(x.d)}</span></li>`).join("")}</ul>
          <p class="fx-upsell">${E(P.upsell)}</p></section>
      </div>`;
  }

  /* ---------------------- IA ---------------------- */
  function iaTab(sk) {
    const S = SUITES[sk], ids = FX.order(sk), n = ids.length;
    const nodes = ids.map((id, i) => {
      const a = (-90 + 360 / n * i) * Math.PI / 180, m = FX.mod(id);
      return `<a class="fx-ai-n" href="#/m/${id}" style="left:${(50 + 41 * Math.cos(a)).toFixed(2)}%;top:${(50 + 41 * Math.sin(a)).toFixed(2)}%;--c:${m.c}" title="${E(m.label)}"><span>${m.icon}</span></a>`; }).join("");
    return `<div class="fx-ai">
      <div class="fx-ai-orb" aria-hidden="false"><i class="r1"></i><i class="r2"></i><div class="fx-ai-core">${FX.ic("spark", 1.8)}<b>Synergy IA</b></div>${nodes}</div>
      <div class="fx-ai-t"><h3>${E(S.ai.t)}</h3><p>${E(S.ai.p)}</p>
        <ul>${S.ai.d.map(x => `<li>${E(x)}</li>`).join("")}</ul></div>
    </div>`;
  }

  /* ---------------------- chaîne budgétaire (S2P) ---------------------- */
  function budgetTab() {
    return `<div class="fx-bud">
      <ol class="fx-bud-r" role="tablist" aria-label="Étapes">${FIN_STEPS.map((s, i) =>
        `<li><button type="button" class="fx-bs${i === 0 ? " on" : ""}" data-s="${i}" role="tab"><i>${i + 1}</i><span>${E(s.t)}</span><small>${s.scope === "erp" ? "ERP ou banque" : "Esker"}</small></button></li>`).join("")}</ol>
      <div class="fx-bud-b"><div class="fx-bud-bar" aria-hidden="true"><i class="pre"></i><i class="eng"></i><i class="con"></i></div>
        <ul class="fx-bud-k"><li class="pre"><i></i><span>Pré-engagé</span><b id="bkPre">0</b></li><li class="eng"><i></i><span>Engagé</span><b id="bkEng">0</b></li><li class="con"><i></i><span>Consommé</span><b id="bkCon">0</b></li><li class="fre"><i></i><span>Disponible</span><b id="bkFre">0</b></li></ul>
        <div class="fx-bud-x"><span>Facture non parvenue <b id="bkFnp">0</b></span><span>Payé <b id="bkPay">0</b></span></div>
        <p class="fx-bud-d" id="bkD" aria-live="polite"></p></div>
    </div>`;
  }
  function mountBudget(el) {
    const set = i => {
      const s = FIN_STEPS[i], b = s.b, free = Math.max(0, 100 - b.pre - b.eng - b.con);
      Array.prototype.forEach.call(el.querySelectorAll(".fx-bs"), x => x.classList.toggle("on", +x.getAttribute("data-s") === i));
      const bar = el.querySelector(".fx-bud-bar");
      bar.querySelector(".pre").style.width = b.pre + "%"; bar.querySelector(".eng").style.width = b.eng + "%"; bar.querySelector(".con").style.width = b.con + "%";
      const f = v => FX.fr(v, v % 1 ? 1 : 0) + " k€";
      el.querySelector("#bkPre").textContent = f(b.pre); el.querySelector("#bkEng").textContent = f(b.eng); el.querySelector("#bkCon").textContent = f(b.con); el.querySelector("#bkFre").textContent = f(free);
      el.querySelector("#bkFnp").textContent = f(s.fnp); el.querySelector("#bkPay").textContent = f(s.paid);
      el.querySelector("#bkD").innerHTML = `<b>${E(s.s)}</b> ${E(s.d)}`;
    };
    el.addEventListener("click", e => { const b = e.target.closest(".fx-bs"); if (b) set(+b.getAttribute("data-s")); });
    set(0);
  }

  /* ---------------------- vue ---------------------- */
  FX.views.suite = {
    render(r) {
      const sk = r.key, S = SUITES[sk], tabs = TABS(sk);
      let tab = r.tab; if (!tabs.some(t => t.k === tab)) tab = "syn";
      r.tab = tab;
      const idx = FX.order(sk);
      return {
        title: S.name,
        html: FX.bg() + `<div class="fx-page">
        <div class="fx-vh">${FX.crumb([["Accueil", "#/"], ["La solution", "#/solution"], [FX.suiteName(sk)]])}
          <div class="fx-vt">${FX.kicker(S.short || FX.suiteName(sk))}<h1 data-focus>${S.title}</h1><p>${E(String(S.lead).split(/(?<=\.)\s/)[0])}</p></div>
          <div class="fx-mods" aria-label="Modules de la suite">${idx.map(id => `<a class="fx-mc" href="#/m/${id}" style="--c:${FX.mod(id).c}" title="${E(FX.mod(id).label)}">${FX.mod(id).icon}<span>${E(shortN(sk, id))}</span></a>`).join("")}</div></div>
        ${FX.tabs(tabs, tab, "Vues de la suite")}
        <div class="fx-vb fx-tabbody" id="fxBody"></div></div>`
      };
    },
    mount(el, r) {
      const sk = r.key, body = el.querySelector("#fxBody");
      let duoId = ORDER_S2P.concat(ORDER_O2C).filter(i => FX.suiteKey(i) === sk)[0];
      const show = (k, silent) => {
        r.tab = k; FX.setTab(el, k);
        body.className = "fx-vb fx-tabbody t-" + k;
        if (k === "syn") { body.innerHTML = synTab(sk); mountSyn(body, sk); }
        else if (k === "duo") { body.innerHTML = duoTab(sk, duoId); }
        else if (k === "ia") { body.innerHTML = iaTab(sk); }
        else { body.innerHTML = budgetTab(); mountBudget(body); }
        if (silent) FX.silent("#/suite/" + FX.slug(sk) + "/" + k);
      };
      el.querySelector(".fx-tabs").addEventListener("click", e => { const b = e.target.closest(".fx-tab"); if (b) show(b.getAttribute("data-tab"), true); });
      body.addEventListener("click", e => { const p = e.target.closest("[data-pick]"); if (p) { duoId = p.getAttribute("data-pick"); body.innerHTML = duoTab(sk, duoId); } });
      show(r.tab, false);
    }
  };
})();
