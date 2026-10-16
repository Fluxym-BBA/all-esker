/* fx-suite.js : une suite = un écran à onglets.
   Synergies : un seul schéma circulaire, des filtres, le détail dans un panneau latéral. */
(function () {
  "use strict";
  const E = FX.E;
  const TABS = sk => [{k: "syn", l: "Synergies", i: "sync"}, {k: "duo", l: "Seul ou en suite", i: "layers"}, {k: "ia", l: "IA", i: "spark"}]
    .concat(sk === "S2P" ? [{k: "budget", l: "Chaîne budgétaire", i: "euro"}] : []);
  const shortN = (sk, id) => (SUITES[sk].short_name || {})[id] || FX.mod(id).label;

  /* ---------------------- synergies : schéma circulaire ---------------------- */
  const CX = 350, CY = 350, RN = 245, RI = 205;
  function chordSVG(sk) {
    const ids = FX.order(sk), n = ids.length, ang = {};
    ids.forEach((id, i) => { ang[id] = -90 + (360 / n) * i; });
    const pt = (a, r) => { const t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; };
    let defs = "", nodes = "";
    Object.keys(SUITE_FAM).forEach(f => { defs += `<marker id="mk-${f}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${SUITE_FAM[f].c}"/></marker>`; });
    ids.forEach(id => {
      const m = FX.mod(id), [x, y] = pt(ang[id], RN), [lx, ly] = pt(ang[id], RN + 52);
      const side = Math.cos(ang[id] * Math.PI / 180), anchor = side > 0.3 ? "start" : side < -0.3 ? "end" : "middle";
      const lines = wrapTxt(shortN(sk, id), 14);
      const dy = Math.sin(ang[id] * Math.PI / 180) > 0.6 ? 14 : Math.sin(ang[id] * Math.PI / 180) < -0.6 ? -4 : 4;
      nodes += `<g class="fx-nd" data-id="${id}" tabindex="0" role="button" aria-label="${E(m.label)}" style="--c:${m.c}">
        <circle class="nd-halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="40"/>
        <circle class="nd-c" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="31" fill="${m.c}"/>
        <text x="${x.toFixed(1)}" y="${(y + 10).toFixed(1)}" text-anchor="middle" font-size="28">${m.icon}</text>
        <text class="nd-l" x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}" font-size="17" font-weight="700" fill="#163467" font-family="Barlow, sans-serif">${lines.map((l, i) => `<tspan x="${lx.toFixed(1)}" dy="${i ? 19 : 0}">${E(l)}</tspan>`).join("")}</text>
      </g>`;
    });
    return `<svg class="fx-chord-svg" viewBox="-10 -10 720 720" role="group" aria-label="Synergies entre les modules de la suite ${E(FX.suiteName(sk))}">
      <defs>${defs}</defs>
      <circle cx="${CX}" cy="${CY}" r="${RN}" fill="none" stroke="rgba(22,52,103,.08)" stroke-width="1.4" stroke-dasharray="2 9"/>
      <circle class="fx-orbit-r" cx="${CX}" cy="${CY}" r="${RI - 28}" fill="none" stroke="rgba(19,180,226,.28)" stroke-width="1.2" stroke-dasharray="3 12"/>
      <g id="fxLinks"></g>
      <g id="fxNodes">${nodes}</g>
      <g class="fx-chord-hub" pointer-events="none"><text x="${CX}" y="${CY - 6}" text-anchor="middle" font-size="19" font-weight="700" fill="#163467" font-family="Miriam Libre, serif">${E(FX.suiteName(sk))}</text><text id="fxCount" x="${CX}" y="${CY + 22}" text-anchor="middle" font-size="14" font-weight="600" fill="#6b7ea0" font-family="Barlow, sans-serif"></text></g>
    </svg>`;
  }
  function linksHTML(sk, list, st) {
    const ids = FX.order(sk), n = ids.length, ang = {};
    ids.forEach((id, i) => { ang[id] = -90 + (360 / n) * i; });
    const pt = (a, r) => { const t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; };
    const d = 3.2;                                    /* écart d'angle : sépare A vers B de B vers A */
    return list.map(s => {
      const [x1, y1] = pt(ang[s.from] + d, RI), [x2, y2] = pt(ang[s.to] - d, RI);
      const qx = CX + (x1 + x2 - 2 * CX) * 0.12, qy = CY + (y1 + y2 - 2 * CY) * 0.12;
      const path = `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      const f = SUITE_FAM[s.fam], on = st.sel === s.n, rel = !st.mod || s.from === st.mod || s.to === st.mod;
      return `<g class="fx-lk${on ? " on" : ""}${rel ? "" : " dim"}${s.st === "cfg" ? " cfg" : ""}" data-n="${s.n}" tabindex="0" role="button" aria-label="${E(s.n + " : " + s.t)}" style="--c:${f.c}">
        <path class="lk-hit" d="${path}"/>
        <path class="lk" d="${path}" stroke="${f.c}" marker-end="url(#mk-${s.fam})"/>
        <title>${E(s.n + " : " + s.t)}</title></g>`;
    }).join("");
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
        <label class="fx-sw"><input type="checkbox" id="fxAll"><span class="fx-sw-t"></span><span>Afficher les ${S.syn.length} synergies <small>(${core} clés par défaut)</small></span></label>
      </div>
      <div class="fx-syn-b">
        <div class="fx-chord">${chordSVG(sk)}</div>
        <aside class="fx-synp" id="fxPanel" aria-live="polite"></aside>
      </div>
    </div>`;
  }

  function mountSyn(el, sk) {
    const S = SUITES[sk], st = {fam: "all", all: false, sel: null, mod: null};
    const links = el.querySelector("#fxLinks"), panel = el.querySelector("#fxPanel"), count = el.querySelector("#fxCount");
    const visible = () => S.syn.filter(s => (st.all || s.core) && (st.fam === "all" || s.fam === st.fam));
    const byN = n => S.syn.filter(s => s.n === n)[0];
    const badge = s => s.st === "cfg" ? '<span class="fx-bd cfg">Sur configuration</span>' : '<span class="fx-bd ok">Disponible</span>';
    const fromTo = s => `<div class="fx-ft"><a class="fx-mc" href="#/m/${s.from}" style="--c:${FX.mod(s.from).c}">${FX.mod(s.from).icon} ${E(shortN(sk, s.from))}</a><span aria-hidden="true">${FX.arrow}</span><a class="fx-mc" href="#/m/${s.to}" style="--c:${FX.mod(s.to).c}">${FX.mod(s.to).icon} ${E(shortN(sk, s.to))}</a></div>`;

    function paintPanel() {
      if (st.sel) {
        const s = byN(st.sel), f = SUITE_FAM[s.fam];
        panel.innerHTML = `<div class="fx-pd" style="--c:${f.c}"><div class="fx-pd-h"><span class="fx-fam"><i></i>${E(f.n)}</span>${badge(s)}</div>
          ${fromTo(s)}<h3>${E(s.t)}</h3><p>${E(s.p)}</p>
          <ul>${s.d.map(x => `<li>${E(x)}</li>`).join("")}</ul>
          <button type="button" class="fx-btn ghost" data-act="clear">${FX.back}Retour à la liste</button></div>`;
      } else if (st.mod) {
        const m = FX.mod(st.mod), l = visible().filter(s => s.from === st.mod || s.to === st.mod);
        panel.innerHTML = `<div class="fx-pl"><div class="fx-pl-h"><span class="fx-mc big" style="--c:${m.c}">${m.icon} ${E(shortN(sk, st.mod))}</span>
          <a class="fx-btn sm" href="#/m/${st.mod}">Ouvrir le module${FX.arrow}</a></div>
          <p class="fx-hint">${l.length ? l.length + " synergie" + (l.length > 1 ? "s" : "") + " visible" + (l.length > 1 ? "s" : "") + " avec ce module. Cliquez pour le détail." : "Aucune synergie visible avec ce filtre. Essayez « Toutes les familles » ou affichez toutes les synergies."}</p>
          <ul class="fx-rows">${l.map(s => { const other = s.from === st.mod ? s.to : s.from, f = SUITE_FAM[s.fam];
            return `<li><button type="button" class="fx-row" data-n="${s.n}" style="--c:${f.c}"><i></i><span><b>${E(s.t)}</b><small>${s.from === st.mod ? "vers" : "depuis"} ${E(shortN(sk, other))}</small></span>${FX.arrow}</button></li>`; }).join("")}</ul>
          <button type="button" class="fx-btn ghost" data-act="clear">${FX.back}Tous les modules</button></div>`;
      } else {
        panel.innerHTML = `<div class="fx-pi"><h3>Comment lire ce schéma</h3>
          <p>Chaque trait est une synergie : le module de départ nourrit le module d'arrivée (la flèche). <b>Cliquez un trait</b> pour comprendre ce que la suite apporte, ou <b>un module</b> pour ne voir que ses liens.</p>
          <ul class="fx-leg">${Object.keys(SUITE_FAM).filter(f => S.syn.some(s => s.fam === f)).map(f => `<li style="--c:${SUITE_FAM[f].c}"><i></i><span>${E(SUITE_FAM[f].n)}</span><b>${S.syn.filter(s => s.fam === f).length}</b></li>`).join("")}</ul>
          <p class="fx-hint">Trait en pointillés : synergie disponible sur configuration.</p></div>`;
      }
    }
    function paint() {
      const l = visible();
      links.innerHTML = linksHTML(sk, l, st);
      count.textContent = l.length + " synergie" + (l.length > 1 ? "s" : "") + " affichée" + (l.length > 1 ? "s" : "");
      Array.prototype.forEach.call(el.querySelectorAll(".fx-nd"), g => g.classList.toggle("on", g.getAttribute("data-id") === st.mod));
      const svg = el.querySelector(".fx-chord-svg");
      svg.classList.toggle("has-mod", !!st.mod); svg.classList.toggle("has-sel", !!st.sel);
      paintPanel();
    }
    el.addEventListener("click", e => {
      const fc = e.target.closest(".fx-fc");
      if (fc) { st.fam = fc.getAttribute("data-fam"); st.sel = null; Array.prototype.forEach.call(el.querySelectorAll(".fx-fc"), b => b.classList.toggle("on", b === fc)); paint(); return; }
      const lk = e.target.closest(".fx-lk");
      if (lk) { st.sel = lk.getAttribute("data-n"); paint(); return; }
      const nd = e.target.closest(".fx-nd");
      if (nd) { const id = nd.getAttribute("data-id"); st.mod = st.mod === id ? null : id; st.sel = null; paint(); return; }
      const row = e.target.closest(".fx-row");
      if (row) { st.sel = row.getAttribute("data-n"); paint(); return; }
      const act = e.target.closest("[data-act='clear']");
      if (act) { if (st.sel && st.mod) st.sel = null; else { st.sel = null; st.mod = null; } paint(); }
    });
    el.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target.closest && e.target.closest(".fx-lk, .fx-nd");
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
