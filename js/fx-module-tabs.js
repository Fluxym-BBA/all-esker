/* fx-module-tabs.js : onglets de la fiche module + la vue module elle-même. */
(function () {
  "use strict";
  const E = FX.E, P = FX.moduleParts, num = P.num;
  const shortN = (sk, id) => (SUITES[sk].short_name || {})[id] || FX.mod(id).label;

  /* ---------- Fonctionnalités : roue + fiche ---------- */
  function fonct(c) {
    return `<div class="fx-enj fx-fonct">
      <div class="fx-enj-w">${xpWheelHTML("modw", c.bricks, "Fonctionnalités de " + c.name)}
        <div class="fx-ctl"><button type="button" data-prev="modw" aria-label="Précédent">${FX.ic("back", 2.4)}</button>
          <button type="button" class="fx-ctl-p" data-play="modw" aria-pressed="false">${FX.ic("play", 2)}<span>Parcours guidé</span></button>
          <button type="button" data-next="modw" aria-label="Suivant">${FX.ic("next", 2.4)}</button></div></div>
      <aside class="xp-card fx-card" data-card="modw" aria-live="polite"></aside></div>`;
  }
  function brickCard(c) {
    return (s, i, n, col) => {
      const img = s.shot && typeof XP_IMG !== "undefined" ? XP_IMG + s.shot + ".webp" : "";
      const go = s.go && c.xvideos ? s.go : null;
      return `<div class="fx-sc">
        <div class="fx-sc-h"><span class="fx-nb" style="--c:${col}">${num(i + 1)}</span><div><small>${E(s.lab)}</small><h3>${E(s.core)}</h3></div></div>
        ${s.h ? `<p class="fx-sc-hh">${E(s.h)}</p>` : ""}
        <p class="fx-sc-n">${E(s.p)}</p>
        <ul class="fx-sc-u">${s.b.map(x => `<li>${E(x)}</li>`).join("")}</ul>
        ${img ? `<button type="button" class="fx-shot" data-zoom="${E(img)}" data-alt="${E(s.core)}"><img src="${E(img)}" alt="${E(s.core)}" loading="lazy" onerror="this.parentNode.remove()"><span>${FX.ic("expand", 2)}Agrandir</span></button>` : ""}
        ${go ? `<button type="button" class="fx-btn sm" data-vgo="${go[0]},${go[1]}">${FX.ic("play", 2)}Voir ${E(go[2])} en vidéo</button>` : ""}
      </div>`;
    };
  }

  /* ---------- Vidéo ---------- */
  function videoList(c) {
    if (c.xvideos) return c.xvideos.map(v => ({t: v.t, u: v.u || c.videos[0].u, tag: v.tag || "Vidéo", dur: v.dur || "", d: v.d || "", ch: v.ch || [], img: v.img}));
    return c.videos.map((v, i) => ({t: v.t, u: v.u, tag: i ? "Vidéo " + (i + 1) : "Présentation", dur: v.sz || "", d: "", ch: [], img: ""}));
  }
  function video(c) {
    const L = videoList(c);
    return `<div class="fx-vid">
      <div class="fx-vid-p"><div class="fx-vid-box" id="fxVbox"><video id="fxVid" controls preload="none" playsinline></video>
        <button type="button" class="fx-cover" id="fxCover" aria-label="Lancer la vidéo"><span class="fx-play">${FX.ic("play", 2)}</span><b id="fxCt"></b></button></div>
        <p class="fx-vid-m" id="fxVm"></p></div>
      <aside class="fx-vid-s">${L.length > 1 ? `<ul class="fx-vl" aria-label="Vidéos">${L.map((v, i) => `<li><button type="button" class="fx-vi${i ? "" : " on"}" data-vi="${i}"><i>${i + 1}</i><span><small>${E(v.tag)}${v.dur ? " · " + E(v.dur) : ""}</small><b>${E(v.t)}</b></span></button></li>`).join("")}</ul>` : ""}
        <div class="fx-chs" id="fxChs"></div></aside></div>`;
  }
  function mountVideo(el, c, reg, start) {
    const L = videoList(c), vid = el.querySelector("#fxVid"), cover = el.querySelector("#fxCover");
    let cur = 0, pend = null;
    const fmt = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
    const chapters = () => {
      const ch = L[cur].ch, box = el.querySelector("#fxChs");
      box.innerHTML = ch.length ? `<h4>Chapitres</h4><ol>${ch.map((x, i) => `<li><button type="button" class="fx-chb" data-t="${x[0]}"><time>${fmt(x[0])}</time><span>${E(x[1])}</span></button></li>`).join("")}</ol>` : "";
    };
    const seek = t => { if (!vid.play) return; const go = () => { try { vid.currentTime = t; } catch (e) { /* métadonnées pas prêtes */ } vid.play().catch(() => {}); }; if (vid.readyState >= 1) go(); else { pend = go; vid.load && vid.load(); } };
    const load = (i, t) => {
      cur = i; const v = L[i];
      vid.removeAttribute("src"); vid.setAttribute("src", v.u); vid.setAttribute("poster", ""); if (vid.pause) vid.pause();
      cover.hidden = false; cover.className = "fx-cover";
      cover.querySelector("#fxCt").textContent = v.t;
      el.querySelector("#fxVm").innerHTML = `<b>${E(v.t)}</b>${v.d ? ` <span>${E(v.d)}</span>` : ""}`;
      if (v.img && typeof XP_IMG !== "undefined") { cover.style.backgroundImage = `url('${XP_IMG + v.img}.webp')`; } else cover.style.backgroundImage = "";
      Array.prototype.forEach.call(el.querySelectorAll(".fx-vi"), b => b.classList.toggle("on", +b.getAttribute("data-vi") === i));
      chapters();
      if (t != null) { cover.hidden = true; seek(t); }
    };
    vid.addEventListener("loadedmetadata", () => { if (pend) { const f = pend; pend = null; f(); } });
    vid.addEventListener("timeupdate", () => {
      const ch = L[cur].ch; if (!ch.length) return;
      let k = -1; ch.forEach((x, i) => { if (vid.currentTime >= x[0]) k = i; });
      Array.prototype.forEach.call(el.querySelectorAll(".fx-chb"), (b, i) => b.classList.toggle("on", i === k));
    });
    cover.addEventListener("click", () => { cover.hidden = true; if (vid.play) { vid.play().catch(() => { cover.hidden = false; }); } });
    el.addEventListener("click", e => {
      const vi = e.target.closest(".fx-vi"); if (vi) { load(+vi.getAttribute("data-vi")); return; }
      const ch = e.target.closest(".fx-chb"); if (ch) { cover.hidden = true; seek(+ch.getAttribute("data-t")); }
    });
    load(start ? start.i : 0, start ? start.t : null);
    reg(() => { if (vid.pause) vid.pause(); });
  }

  /* ---------- Irritants (E-Procurement) ---------- */
  const irritants = c => `<div class="fx-pzw">${xpPainsHTML2({pains: c.pains}, "Voir la vidéo du module")}</div>`;

  /* ---------- Profils (E-Procurement) ---------- */
  function profils(c) {
    const pers = c.personas, road = c.road;
    return `<div class="fx-prof">
      <div class="fx-pers" role="tablist" aria-label="Profils">${pers.map((p, i) => `<button type="button" role="tab" class="fx-pp${i ? "" : " on"}" data-p="${i}"><span>${FX.ic(p.ic, 1.9)}</span><b>${E(p.n)}</b></button>`).join("")}</div>
      <div class="fx-pcard" id="fxPcard" aria-live="polite"></div>
      ${road ? `<div class="fx-road" aria-label="Mise en œuvre"><h4>Mise en œuvre</h4><ol>${road.map((r, i) => `<li style="--i:${i}"><i></i><b>${E(r[0])}</b><span>${E(r[1])}</span></li>`).join("")}</ol></div>` : ""}
    </div>`;
  }
  function mountProfils(el, c) {
    const pers = c.personas, box = el.querySelector("#fxPcard");
    const set = i => {
      const p = pers[i];
      Array.prototype.forEach.call(el.querySelectorAll(".fx-pp"), b => b.classList.toggle("on", +b.getAttribute("data-p") === i));
      box.innerHTML = `<div class="fx-pc xin"><blockquote>« ${E(p.q)} »</blockquote>
        <ul class="fx-pg">${p.g.map(g => `<li><b>${E(g[0])}</b><span>${E(g[1])}</span></li>`).join("")}</ul>
        <div class="fx-pst"><small>Étapes concernées</small>${p.steps.map(k => c.bricks[k] ? `<i>${E(c.bricks[k].lab)}</i>` : "").join("")}</div></div>`;
    };
    el.addEventListener("click", e => { const b = e.target.closest(".fx-pp"); if (b) set(+b.getAttribute("data-p")); });
    set(0);
  }

  /* ---------- Cas d'usage (O2C) ---------- */
  function usage(c) {
    const u = c.use;
    return `<div class="fx-use${u ? " has" : ""}">
      ${u ? `<figure class="fx-fig"><button type="button" data-zoom="${E(u.img)}" data-alt="${E(u.alt || "")}"><img src="${E(u.img)}" alt="${E(u.alt || "")}" loading="lazy" onerror="this.parentNode.parentNode.remove()"></button>
        <figcaption><b>${E(u.k || "")}</b>${u.h ? ` <span>${E(u.h)}</span>` : ""}</figcaption></figure>` : ""}
      <div class="fx-adv">${c.adv.map((a, i) => `<article class="fx-ac" style="--i:${i}"><i>${num(i + 1)}</i><h3>${E(a[0])}</h3><p>${E(a[1])}</p></article>`).join("")}</div></div>`;
  }

  /* ---------- Dans la suite ---------- */
  function suite(c) {
    const sk = c.sk, st = FX.stages(sk), syn = FX.synFor(sk, c.id).sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0));
    const Pp = c.P;
    return `<div class="fx-su">
      <section class="fx-su-r"><h4>Sa place dans le processus</h4>
        <ol class="fx-rail">${st.map((s, i) => `<li class="${s.mods.indexOf(c.id) >= 0 ? "on" : ""}"><a href="#/enjeux/${FX.slug(sk)}/${i}" title="${E(s.core)}"><i>${i + 1}</i><span>${E(s.lab)}</span></a></li>`).join("")}</ol>
        ${c.proc && c.proc.sor ? `<p class="fx-sor-l"><span>Système de référence</span><b>${E(c.proc.sor)}</b></p>` : ""}
        ${c.proc && c.proc.cover ? `<p class="fx-cover-l">${E(c.proc.cover)}</p>` : ""}
      </section>
      <section class="fx-su-s"><h4>${syn.length} synergies avec les autres modules <a href="#/suite/${FX.slug(sk)}/syn">Voir le schéma${FX.arrow}</a></h4>
        <ul class="fx-sl-list">${syn.map(s => { const o = s.from === c.id ? s.to : s.from, f = SUITE_FAM[s.fam];
          return `<li class="fx-sy" style="--c:${f.c}"><button type="button" class="fx-sy-h" aria-expanded="false"><i></i><span><b>${E(s.t)}</b><small>${s.from === c.id ? "vers" : "depuis"} ${E(shortN(sk, o))} · ${E(f.n)}</small></span>${FX.arrow}</button>
            <div class="fx-sy-b" hidden><p>${E(s.p)}</p><ul>${s.d.map(x => `<li>${E(x)}</li>`).join("")}</ul><a class="fx-btn sm" href="#/m/${o}">Ouvrir ${E(shortN(sk, o))}${FX.arrow}</a></div></li>`; }).join("")}</ul></section>
      ${Pp ? `<section class="fx-su-p"><div class="solo"><small>Déployé seul</small><p>${E(Pp.limit)}</p></div><div class="suite"><small>Rebond dans la suite</small><p>${E(Pp.upsell)}</p></div></section>` : ""}
    </div>`;
  }

  /* ---------- Démo ---------- */
  const demo = c => `<div class="fx-demo"><div class="fx-demo-h"><div><h3>${E(c.demo.label)}</h3><p>${E(c.demo.d)}</p></div>
    <a class="fx-btn" href="${E(c.demo.url)}" target="_blank" rel="noopener">Plein écran${FX.arrow}</a></div>
    <iframe class="fx-demo-f" src="${E(c.demo.url)}" title="${E(c.demo.label)}" loading="lazy" allow="fullscreen"></iframe></div>`;

  /* ---------- vue ---------- */
  FX.views.module = {
    render(r) {
      const c = FX.content(r.id), tabs = tabsFor0(c);
      let tab = r.tab; if (!tabs.some(t => t.k === tab)) tab = "apercu";
      r.tab = tab; r._c = c; r._tabs = tabs;
      const ord = FX.ALL(), i = ord.indexOf(c.id), prev = ord[(i - 1 + ord.length) % ord.length], next = ord[(i + 1) % ord.length];
      return {
        title: c.name,
        html: FX.bg() + `<div class="fx-page fx-mod" style="--c:${c.color}">
        <div class="fx-vh fx-mh">
          ${FX.crumb([["Accueil", "#/"], ["La solution", "#/solution"], [FX.suiteName(c.sk), "#/suite/" + FX.slug(c.sk)], [c.name]])}
          <div class="fx-mt"><span class="fx-badge sm" aria-hidden="true">${c.icon}</span><div><small>${E(FX.suiteName(c.sk))} · ${E(c.acr)}</small><h1 data-focus>${E(c.name)}</h1></div></div>
          <div class="fx-pn"><a href="#/m/${prev}/${tab}" aria-label="Module précédent : ${E(FX.mod(prev).label)}" title="${E(FX.mod(prev).label)}">${FX.ic("back", 2.4)}</a><a href="#/m/${next}/${tab}" aria-label="Module suivant : ${E(FX.mod(next).label)}" title="${E(FX.mod(next).label)}">${FX.ic("next", 2.4)}</a></div>
        </div>
        ${FX.tabs(tabs, tab, "Sections du module")}
        <div class="fx-vb fx-tabbody" id="fxBody"></div></div>`
      };
    },
    mount(el, r) {
      const c = r._c, tabs = r._tabs, body = el.querySelector("#fxBody");
      let cleanups = [], vstart = null;
      const reg = fn => cleanups.push(fn);
      const clean = () => { cleanups.splice(0).forEach(fn => { try { fn(); } catch (e) { /* ok */ } }); };
      FX.onLeave(clean);
      const show = (k, silent) => {
        clean();
        r.tab = k; FX.setTab(el, k);
        body.className = "fx-vb fx-tabbody t-" + k;
        if (k === "apercu") { body.innerHTML = P.apercu(c, tabs); FX.runCounts(body); P.mountApercu(body, c, reg); }
        else if (k === "fonct") { body.innerHTML = fonct(c); const ctl = xpWheelMount(body, "modw", {steps: c.bricks, card: brickCard(c)}); if (ctl) reg(() => ctl.stop()); }
        else if (k === "video") { body.innerHTML = video(c); mountVideo(body, c, reg, vstart); vstart = null; }
        else if (k === "irritants") { body.innerHTML = irritants(c); const m = xpPainsMountIn(body, {pains: c.pains}, () => show("video", true)); reg(() => m.stop()); }
        else if (k === "profils") { body.innerHTML = profils(c); mountProfils(body, c); }
        else if (k === "usage") { body.innerHTML = usage(c); }
        else if (k === "suite") { body.innerHTML = suite(c); }
        else if (k === "demo") { body.innerHTML = demo(c); }
        /* le prochain onglet repart en haut */
        body.scrollTop = 0;
        if (silent) FX.silent("#/m/" + c.id + "/" + k);
        /* les liens précédent/suivant gardent l'onglet courant */
        Array.prototype.forEach.call(el.querySelectorAll(".fx-pn a"), a => { a.setAttribute("href", a.getAttribute("href").replace(/\/[a-z]+$/, "/" + k)); });
      };
      el.querySelector(".fx-tabs").addEventListener("click", e => { const b = e.target.closest(".fx-tab"); if (b) show(b.getAttribute("data-tab"), true); });
      body.addEventListener("click", e => {
        const g = e.target.closest("[data-tab-go]"); if (g) { show(g.getAttribute("data-tab-go"), true); return; }
        const v = e.target.closest("[data-vgo]"); if (v) { const p = v.getAttribute("data-vgo").split(","); vstart = {i: +p[0], t: +p[1]}; show("video", true); return; }
        const sy = e.target.closest(".fx-sy-h");
        if (sy) { const open = sy.getAttribute("aria-expanded") !== "true"; sy.setAttribute("aria-expanded", open ? "true" : "false"); const b = sy.parentNode.querySelector(".fx-sy-b"); if (open) b.removeAttribute("hidden"); else b.setAttribute("hidden", ""); sy.parentNode.classList.toggle("open", open); }
      });
      show(r.tab, false);
    }
  };
  function tabsFor0(c) { return P.tabsFor(c); }
})();
