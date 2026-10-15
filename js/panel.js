/* =========================================================================
   5. PANNEAU VIDÉO
   ========================================================================= */
const host = document.getElementById("panelHost");
let current = null, currentVid = 0;

function posterBits(m){
  return m.suite === "S2P" ? "Source-to-Pay" : "Order-to-Cash";
}

function renderPanel(id, vidIdx, autoplay){
  const m = byId(id); if(!m) return;
  current = id; currentVid = vidIdx || 0;
  const soon = !m.videos.length;
  const suite = posterBits(m);
  const pos = ALL_ORDER.indexOf(id);
  const prev = ALL_ORDER[(pos - 1 + ALL_ORDER.length) % ALL_ORDER.length];
  const next = ALL_ORDER[(pos + 1) % ALL_ORDER.length];

  let media;
  if(soon){
    media = `
      <div class="soonbox" style="--c:${m.c}">
        <div class="sb-mesh"></div>
        <div class="sb-ico">${m.icon}</div>
        <h3>${esc(m.label)}</h3>
        <p>La vidéo de présentation de ce module est en cours de production par nos équipes.</p>
        <span class="soon-badge"><i></i>Vidéo disponible très bientôt</span>
      </div>
      <div class="soon-cta">
        <a class="btn btn-navy" href="#contact">Être prévenu de sa mise en ligne</a>
        <span class="ph">ou demandez dès maintenant une démonstration live de ce module.</span>
      </div>`;
  } else {
    const v = m.videos[currentVid] || m.videos[0];
    const multi = (m.videos.length > 1 && !XP[id]) ? `
      <div class="vidswitch">${m.videos.map((x,i)=>
        `<button type="button" class="${i===currentVid?'on':''}" data-vid="${i}">${esc(x.t)}</button>`).join("")}</div>` : "";
    /* 3 suggestions : modules avec vidéo, hors module courant */
    const sugg = WITHVID.filter(x => x !== id).slice(0,3).map(x => {
      const s = byId(x);
      return `<button class="vid-end-card" type="button" data-go="${x}"><span>${s.icon}</span>${esc(s.label)}</button>`;
    }).join("");
    media = `
      <div class="vidframe" id="vidFrame">
        <video id="player" controls playsinline controlsList="nodownload" preload="metadata">
          <source src="${v.u}" type="video/mp4">
          Votre navigateur ne prend pas en charge la lecture vidéo.
          <a href="${v.u}">Télécharger la vidéo</a>.
        </video>
        <div class="vid-cover" id="vidCover" role="button" tabindex="0" aria-label="Lancer la vidéo : ${esc(v.t)}" style="--c:${m.c}">
          <div class="cover-bg"><div class="cover-mesh"></div><div class="cover-glow"></div><div class="cover-circles"></div></div>
          <div class="cover-top">
            <span class="cover-suite">${suite}</span>
            <span class="cover-tag">${esc(v.sz)} · MP4</span>
          </div>
          <div class="cover-center">
            <div class="cover-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
          </div>
          <div class="cover-bottom">
            <h3 class="cover-title">${esc(m.label)}</h3>
            <p class="cover-sub">
              <span>Démonstration officielle</span><span class="cover-sub-dot"></span>
              <span>Fluxym × Esker</span><span class="cover-sub-dot"></span>
              <span class="cover-sub-cta">Cliquer pour lancer la vidéo →</span>
            </p>
          </div>
        </div>
        <div class="vid-end" id="vidEnd">
          <h4>Continuer la découverte</h4>
          <div class="vid-end-row">${sugg}</div>
          <button class="vid-end-replay" type="button" id="replayBtn">↻ Revoir cette vidéo</button>
        </div>
      </div>
      <div class="vidmeta">
        <span class="vidmeta-t">${esc(v.t)}</span>
        <span class="vidmeta-s">MP4 · ${esc(v.sz)} · Version compressée · Français</span>
      </div>
      ${multi}
      <div class="warn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8192ad" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span>Vidéo optimisée : démarrage quasi instantané en cliquant directement sur l'image.</span>
      </div>`;
  }

  const agentCta = id === "ap" ? `<div class="ap-agent-cta"><div><b>Explorer l’interface Esker On Demand</b><span>Filtres Factures fournisseurs et étapes de traitement, dans la fenêtre Synergy Agent.</span></div><button type="button" id="apAgentCta">Ouvrir la démo</button></div>` : "";
  host.innerHTML = `
    <article class="panel${XP[id] && !soon ? ' panel--xp' : ''}" style="--c:${m.c}" id="panel" tabindex="-1">
      <header class="panel-head">
        <div class="panel-chip">${m.icon}</div>
        <div class="panel-ttl">
          <div class="panel-suite">${suite}</div>
          <h2>${esc(m.label)}</h2>
          <p>${esc(m.desc)}</p>
        </div>
        <div class="panel-nav">
          <button class="pnav" type="button" data-go="${prev}" aria-label="Module précédent" title="Module précédent">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button class="pnav" type="button" data-go="${next}" aria-label="Module suivant" title="Module suivant">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
          <button class="pnav" type="button" id="pClose" aria-label="Fermer" title="Fermer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
      </header>
      <div class="panel-body">${media}${agentCta}</div>
      ${XP[id] && !soon ? xpHTML(m) : ""}
    </article>`;

  markActive(id);

  /* lecture au clic n'importe où */
  const cover = document.getElementById("vidCover");
  const player = document.getElementById("player");
  const vidEnd = document.getElementById("vidEnd");
  const playVideo = () => {
    if(!player) return;
    if(cover) cover.classList.add("hidden");
    if(vidEnd) vidEnd.classList.remove("on");
    const p = player.play();
    if(p && typeof p.catch === "function") p.catch(() => {});
  };
  if(cover){
    cover.addEventListener("click", playVideo);
    cover.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); playVideo(); } });
  }
  if(player){
    player.addEventListener("play", () => { if(cover) cover.classList.add("hidden"); if(vidEnd) vidEnd.classList.remove("on"); });
    player.addEventListener("ended", () => { if(vidEnd) vidEnd.classList.add("on"); });
  }
  const rb = document.getElementById("replayBtn");
  if(rb) rb.addEventListener("click", () => { if(player){ player.currentTime = 0; playVideo(); } });

  const apAgentCta = document.getElementById("apAgentCta");
  if(apAgentCta) apAgentCta.addEventListener("click", () => { if(typeof openSynergyAgent === "function") openSynergyAgent("invoice", 9); });
  host.querySelectorAll("#pClose").forEach(b => b.addEventListener("click", closePanel));
  host.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => sel(b.dataset.go, {keepPlace:true, focus:false})));
  host.querySelectorAll("[data-vid]").forEach(b =>
    b.addEventListener("click", () => { renderPanel(id, +b.dataset.vid, true); scrollToPanel(false); }));

  if(XP[id] && !soon) xpMount(id);
  else if(xpS){ xpKill(); xpS = null; }

  /* Plusieurs vidéos disponibles : on montre la vignette et on laisse choisir, sans lecture automatique. */
  const several = !!XP[id] || m.videos.length > 1;
  if(autoplay && !several){ playVideo(); setTimeout(playVideo, 180); }
}

