/* =========================================================================
   O2C XP : même grammaire que l'univers E-Procurement (roue + carte,
   fond à halos, révélations au scroll), appliquée aux 7 modules Order-to-Cash
   et à la section « Services Fluxym ». Réutilise xpWheelSVG, xpWrap, xpStepCol
   (module.js) ; ne modifie rien du module Achats.
   ========================================================================= */
(function () {
  "use strict";
  const D = () => window.O2C;
  const reduce = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
  const fr = (n, d) => Number(n).toFixed(d || 0).replace(".", ",");
  const ic = k => (typeof XP_ICONS !== "undefined" && XP_ICONS[k]) || "";
  const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic(k)}</svg>`;
  let uidN = 0;

  /* ---------- briques HTML communes ---------- */
  const bg = () => `<div class="xp-bg" aria-hidden="true"><i class="dots"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i></div>`;
  const head = (k, h, lead) => `<div class="ox-head xp-rv"><span class="xp-k"><i></i>${E(k)}</span><h3 class="xp-h">${h}</h3>${lead ? `<p class="xp-lead">${lead}</p>` : ""}</div>`;

  function countHTML(o) {
    if (o.n == null) return `<b class="ox-kv ox-kt">${E(o.t)}</b>`;
    const d = o.d || 0;
    return `<b class="ox-kv">${o.p ? `<small>${E(o.p)}</small>` : ""}<span data-count="${o.n}" data-dec="${d}">${fr(o.n, d)}</span>${E(o.s || "")}</b>`;
  }
  const kpiBand = list => `<div class="ox-kpis xp-rv">${list.map(k => `<div class="ox-kpi">${countHTML(k)}<span>${E(k.l)}</span></div>`).join("")}</div>`;

  /* ---------- roue : balisage avec identifiants uniques ---------- */
  function wheelHTML(uid, steps, label) {
    let h = xpWheelSVG({steps: steps.map(s => ({lab: s.lab, core: s.core, ic: s.ic}))});
    h = h.replace(/id="pw(N|T1|T2|K|Hc)"/g, (m, k) => `id="${uid}${k}"`).replace(/aria-label="Roue du parcours achat"/, `aria-label="${E(label)}"`);
    return `<div class="pw" id="${uid}" tabindex="-1">${h}</div>`;
  }

  /* ---------- contrôleur de roue + carte (instance indépendante) ---------- */
  function mountWheel(root, uid, cfg) {
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
      if (st.playing || reduce()) return;
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

  /* ---------- révélations, compteurs, auto-visite ---------- */
  function countUp(el) {
    const to = parseFloat(el.getAttribute("data-count")), dec = +el.getAttribute("data-dec") || 0;
    if (isNaN(to)) return;
    if (reduce() || !window.requestAnimationFrame) { el.textContent = fr(to, dec); return; }
    const t0 = performance.now(), dur = 1300;
    (function f(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fr(to * e, dec);
      if (k < 1) requestAnimationFrame(f); else el.textContent = fr(to, dec);
    })(t0);
  }
  function armReveal(root, wheels) {
    const items = Array.prototype.slice.call(root.querySelectorAll(".xp-rv"));
    const show = el => {
      if (el.classList.contains("in")) return;
      el.classList.add("in");
      Array.prototype.forEach.call(el.querySelectorAll("[data-count]"), countUp);
      const id = el.getAttribute("data-autowheel");
      if (id && wheels[id]) setTimeout(() => wheels[id].play(), 1400);
    };
    if (!("IntersectionObserver" in window)) { items.forEach(show); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), {threshold: .14, rootMargin: "0px 0px -6% 0px"});
    items.forEach(el => io.observe(el));
  }

  /* ---------- ouverture d'un autre module ---------- */
  function openMod(id) {
    if (typeof renderPanel === "function") { renderPanel(id, 0, false); if (typeof scrollToPanel === "function") scrollToPanel(false); }
  }
  function bindOpen(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-open]"), b => b.addEventListener("click", () => openMod(b.getAttribute("data-open"))));
  }

  /* ---------- lightbox ---------- */
  function lightbox(src, alt) {
    const o = document.createElement("div");
    o.className = "ox-lb"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", alt);
    o.innerHTML = `<button type="button" aria-label="Fermer">×</button><img src="${E(src)}" alt="${E(alt)}">`;
    const close = () => { o.remove(); document.removeEventListener("keydown", kd); };
    const kd = e => { if (e.key === "Escape") close(); };
    o.addEventListener("click", close); document.addEventListener("keydown", kd);
    document.body.appendChild(o);
  }

  /* ---------- rail processus (partagé fiche module / services) ---------- */
  function procHTML(uid, mine, sel) {
    const d = D();
    const rail = d.stages.map((s, i) => `<button type="button" class="ox-st${mine.indexOf(i) > -1 ? " mine" : ""}${i === sel ? " on" : ""}" data-st="${i}" aria-label="Étape ${s.n} : ${E(s.t)}"><b>${E(s.n)}</b><span>${E(s.t)}</span></button>`).join("");
    return `<div class="ox-rail" role="tablist" aria-label="Processus Order-to-Cash">${rail}</div><div class="ox-pcard" id="${uid}Pc" aria-live="polite"></div>`;
  }
  function mountProc(root, uid, sel, mod) {
    const d = D(), card = root.querySelector("#" + uid + "Pc");
    if (!card) return;
    const btns = Array.prototype.slice.call(root.querySelectorAll(".ox-rail .ox-st"));
    function show(i) {
      const s = d.stages[i];
      btns.forEach((b, j) => b.classList.toggle("on", j === i));
      const chips = s.mods.length ? s.mods.map(m => `<button type="button" class="ox-mchip${m === mod ? " cur" : ""}" data-open="${m}">${E(d.names[m])}<i>${E(d.mods[m].acr)}</i></button>`).join("") : `<span class="ox-none">Hors cœur Esker</span>`;
      card.innerHTML = `<div class="xin"><div class="ox-pc-h"><b>${E(s.n)}</b><h5>${E(s.t)}</h5></div><p>${E(s.note)}</p><div class="ox-pc-g"><div><small>Couverture Esker</small><div class="ox-chips">${chips}</div></div><div><small>Système de référence</small><strong>${E(s.sor)}</strong></div></div></div>`;
      bindOpen(card);
    }
    btns.forEach((b, i) => b.addEventListener("click", () => show(i)));
    show(sel);
  }

  /* =======================================================================
     FICHE MODULE O2C
     ======================================================================= */
  function moduleHTML(id, m) {
    const d = D(), x = d.mods[id];
    if (!x) return "";
    const uid = "ox" + (++uidN);
    const col = (m && m.c) || "#13b4e2";
    const steps = x.steps.map(s => ({lab: s[0], core: s[1], ic: s[2], p: s[3], b: s[4]}));
    const meta = `<div class="ox-meta"><span class="ox-pill"><i></i>Utilisé par · ${E(x.owner)}</span>${x.badge ? `<span class="ox-pill ox-ok">${E(x.badge)}</span>` : ""}</div>`;
    const flow = x.flow ? `<div class="ox-flow xp-rv" aria-label="Parcours du module"><ol>${x.flow.map((f, i) => `<li style="--i:${i}"><i>${i + 1}</i><span>${E(f)}</span></li>`).join("")}</ol></div>` : "";
    const kpis = x.kpis ? kpiBand(x.kpis) : "";
    const wheelBlock = `<div class="ox-block xp-rv" data-autowheel="${uid}">
      ${head("Contenu applicatif", `Les ${steps.length} briques du module, <em>une par une</em>`, "Cliquez sur un segment, ou lancez la visite guidée.")}
      <div class="xp-wrap ox-wrap">${wheelHTML(uid, steps, "Roue des briques du module " + d.names[id])}
        <div class="ox-side"><div class="xp-card ox-card" data-card="${uid}"></div>
          <div class="ox-ctl"><button type="button" class="xp-nb" data-prev="${uid}" aria-label="Brique précédente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>
            <button type="button" class="xp-nb" data-next="${uid}" aria-label="Brique suivante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
            <button type="button" class="ox-play" data-play="${uid}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Visite guidée</span></button>
            <div class="ox-prog" aria-hidden="true"><i data-prog="${uid}"></i></div></div></div></div></div>`;
    const adv = `<div class="ox-block xp-rv">${head("Avantages", `Ce que ça change <em>au quotidien</em>`)}<div class="ox-adv">${x.adv.map((a, i) => `<div class="ox-av" style="--i:${i}"><span class="ox-avn">${String(i + 1).padStart(2, "0")}</span><h5>${E(a[0])}</h5><p>${E(a[1])}</p></div>`).join("")}</div></div>`;
    const use = x.use ? `<div class="ox-block xp-rv">${head(x.use.k, `<em>${E(x.use.h)}</em>`)}<div class="ox-use"><button type="button" class="ox-shot" data-zoom="${E(x.use.img)}" data-alt="${E(x.use.alt)}" aria-label="Agrandir la capture : ${E(x.use.alt)}"><span class="ox-bar"><i></i><i></i><i></i></span><img src="${E(x.use.img)}" alt="${E(x.use.alt)}" loading="lazy"><em class="ox-zoom">${svgI("zoom")}Agrandir</em></button>${x.use.caps.length ? `<ol class="ox-caps">${x.use.caps.map((c, i) => `<li style="--i:${i}"><b>${i + 1}</b><span>${E(c)}</span></li>`).join("")}</ol>` : ""}</div></div>` : "";
    const procBlock = `<div class="ox-block xp-rv">${head("Dans votre processus", `Où ce module <em>s'insère</em>`, E(x.proc.cover) + ".")}${procHTML(uid + "p", x.proc.stages, x.proc.stages[0])}</div>`;
    const syn = x.syn && x.syn.length ? `<div class="ox-block xp-rv">${head("Synergies", `Ce module <em>se combine avec</em>`)}<div class="ox-syn">${x.syn.map((s, i) => `<button type="button" class="ox-sy" data-open="${s[0]}" style="--i:${i}"><i>${E(d.mods[s[0]].acr)}</i><span><b>${E(d.names[s[0]])}</b>${E(s[1])}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>`).join("")}</div></div>` : "";
    return `<section class="o2x" data-o2x="${id}" data-uid="${uid}" style="--mc:${col}">${bg()}<div class="ox-in">
      <div class="ox-hero xp-rv"><span class="xp-k"><i></i>Order-to-Cash · ${E(x.acr)}</span><h3 class="xp-h">${x.title}</h3><p class="xp-lead">${E(x.lead)}</p>${meta}</div>
      ${flow}${kpis}${wheelBlock}${adv}${use}${procBlock}${syn}</div></section>`;
  }

  function mountModule(host) {
    Array.prototype.forEach.call((host || document).querySelectorAll(".o2x[data-o2x]"), root => {
      if (root.getAttribute("data-mounted")) return;
      root.setAttribute("data-mounted", "1");
      const id = root.getAttribute("data-o2x"), uid = root.getAttribute("data-uid"), x = D().mods[id];
      const steps = x.steps.map(s => ({lab: s[0], core: s[1], ic: s[2], p: s[3], b: s[4]}));
      const w = mountWheel(root, uid, {steps, card: (s, i, n, col, lis) =>
        `<div class="xin"><div class="xp-card-k">Brique ${i + 1} / ${n}</div><h4 class="xp-card-h">${E(s.core)}</h4><p class="xp-card-p">${E(s.p)}</p>${lis ? `<ul>${lis}</ul>` : ""}</div>`});
      mountProc(root, uid + "p", x.proc.stages[0], id);
      bindOpen(root);
      Array.prototype.forEach.call(root.querySelectorAll("[data-zoom]"), b => b.addEventListener("click", () => lightbox(b.getAttribute("data-zoom"), b.getAttribute("data-alt"))));
      const wheels = {}; wheels[uid] = w;
      armReveal(root, wheels);
    });
  }

  /* =======================================================================
     SECTION SERVICES FLUXYM
     ======================================================================= */
  function servicesHTML() {
    const d = D(), uid = "ox" + (++uidN);
    const svc = d.services.map(s => ({lab: s.lab, core: s.core, ic: s.ic}));
    const stats = `<div class="ox-kpis ox-stats xp-rv">${d.market_stats.map(k => `<div class="ox-kpi">${countHTML(k)}<span>${E(k.l)}</span></div>`).join("")}</div><p class="ox-src">Source : ${E(d.market_src)}</p>`;
    const phases = `<div class="ox-phases" aria-label="Approche transverse">${Object.keys(d.phases).map(k => `<div class="ox-ph" data-ph="${k}"><b>${E(d.phases[k])}</b><ul>${d.phase_items[k].map(i => `<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}</div>`;
    const pr = d.principles.map((p, i) => `<div class="ox-pr" style="--i:${i}"><span>${String(i + 1).padStart(2, "0")}</span><h5>${E(p.t)}</h5><p>${E(p.d)}</p></div>`).join("");
    const conv = d.convictions.map((c, i) => `<button type="button" class="xp-pc ox-cv${i === 0 ? " on" : ""}" data-cv="${i}"><i>${i + 1}</i>${E(c.t)}</button>`).join("");
    const act = d.actors.map((a, i) => `<button type="button" class="xp-pc ox-cv${i === 0 ? " on" : ""}" data-ac="${i}"><i>${i + 1}</i>${E(a.t)}</button>`).join("");
    return `<div class="o2x o2s" data-o2s="1" data-uid="${uid}">${bg()}<div class="ox-in">
      <div class="ox-hero ox-center xp-rv"><span class="xp-k"><i></i>Accompagnement &amp; expertise métier</span><h2 class="xp-h">Au-delà de l'outil Esker : <em>ce que Fluxym apporte</em></h2><p class="xp-lead">Relier les métiers, les données, le SI, le projet et l'adoption, du diagnostic à la maintenance.</p></div>
      ${stats}
      <div class="ox-block xp-rv">${head("Du processus à la solution", `Où Esker intervient <em>dans l'O2C</em>`, "Sélectionnez une étape du processus : vous voyez ce que couvre Esker et quel système reste la référence.")}${procHTML(uid + "p", [], 0)}<p class="ox-read">${E(d.reading)}</p><div class="ox-prs">${pr}</div></div>
      <div class="ox-block xp-rv" data-autowheel="${uid}">${head("Nos services", `Cinq briques <em>autour de la suite</em>`, "Évaluer, déployer, sécuriser : une approche transverse de l'intégration et des services.")}${phases}
        <div class="xp-wrap ox-wrap">${wheelHTML(uid, svc, "Roue des services Fluxym autour de la suite Esker")}
        <div class="ox-side"><div class="xp-card ox-card" data-card="${uid}"></div>
          <div class="ox-ctl"><button type="button" class="xp-nb" data-prev="${uid}" aria-label="Service précédent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>
            <button type="button" class="xp-nb" data-next="${uid}" aria-label="Service suivant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
            <button type="button" class="ox-play" data-play="${uid}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Visite guidée</span></button>
            <div class="ox-prog" aria-hidden="true"><i data-prog="${uid}"></i></div></div></div></div></div>
      <div class="ox-block xp-rv">${head("Nos convictions", `Des décisions <em>explicites et vérifiables</em>`)}<div class="ox-cvs">${conv}</div><div class="xp-card ox-card ox-mini" id="${uid}Cv" aria-live="polite"></div><p class="ox-value">${E(d.value)}</p></div>
      <div class="ox-block xp-rv">${head("Quels acteurs sur l'O2C ?", `Ce que chacun couvre, <em>et notre différence</em>`, "Conseil, ESN, services externalisés : une typologie par catégorie d'acteur.")}<div class="ox-cvs">${act}</div><div class="xp-card ox-card ox-mini" id="${uid}Ac" aria-live="polite"></div>
        <div class="ox-place"><span class="xp-k"><i></i>Notre place</span><p>${E(d.place)}</p><small>${E(d.nota)}</small></div></div>
    </div></div>`;
  }

  function mountPicker(root, sel, attr, targetId, render) {
    const btns = Array.prototype.slice.call(root.querySelectorAll(sel)), box = root.querySelector("#" + targetId);
    if (!box) return;
    const show = i => { btns.forEach((b, j) => b.classList.toggle("on", j === i)); box.innerHTML = `<div class="xin">${render(i)}</div>`; };
    btns.forEach((b, i) => b.addEventListener("click", () => show(i)));
    show(0);
  }

  function mountServices(host) {
    const root = (host || document).querySelector(".o2s[data-o2s]");
    if (!root || root.getAttribute("data-mounted")) return;
    root.setAttribute("data-mounted", "1");
    const d = D(), uid = root.getAttribute("data-uid");
    const phaseLab = k => d.phases[k];
    const svc = d.services.map(s => ({lab: s.lab, core: s.core, ic: s.ic, s}));
    const w = mountWheel(root, uid, {steps: svc, card: (s, i, n) => {
      const v = s.s;
      return `<div class="xin"><div class="xp-card-k">${E(phaseLab(v.ph))} · brique ${i + 1} / ${n}</div><h4 class="xp-card-h">${E(v.head)}</h4><p class="ox-bt">${E(v.t)}</p><div class="ox-sub">Valeur client</div><p class="xp-card-p">${E(v.v)}</p><div class="ox-sub">Pourquoi cette brique ?</div><p class="xp-card-p">${E(v.w)}</p><div class="ox-sub">Livrables (extraits)</div><ul>${v.l.map(l => `<li>${E(l)}</li>`).join("")}</ul></div>`;
    }, onSelect: i => {
      const ph = d.services[i].ph;
      Array.prototype.forEach.call(root.querySelectorAll(".ox-ph"), el => el.classList.toggle("on", el.getAttribute("data-ph") === ph));
    }});
    mountProc(root, uid + "p", 0, null);
    mountPicker(root, "[data-cv]", "cv", uid + "Cv", i => `<div class="xp-card-k">Conviction ${i + 1} / ${d.convictions.length}</div><h4 class="xp-card-h">${E(d.convictions[i].t)}</h4><p class="xp-card-p">${E(d.convictions[i].d)}</p>`);
    mountPicker(root, "[data-ac]", "ac", uid + "Ac", i => `<div class="xp-card-k">${E(d.actors[i].t)}</div><div class="ox-duo"><div><small>Ce qu'ils apportent</small><p>${E(d.actors[i].a)}</p></div><div class="ox-diff"><small>Notre différence</small><p>${E(d.actors[i].d)}</p></div></div>`);
    bindOpen(root);
    const wheels = {}; wheels[uid] = w;
    armReveal(root, wheels);
  }

  window.o2xModuleHTML = moduleHTML;
  window.o2xMountModule = mountModule;
  window.o2xServicesHTML = servicesHTML;
  window.o2xMountServices = mountServices;
})();
