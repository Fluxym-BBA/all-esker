let curS2PSyn = "pr-ap"; // synergie par défaut : Achats × Factures

function openS2P() {
  // Fermer le panel module s'il était ouvert
  if (typeof closePanel === "function") closePanel(false);

  // Cacher la section de la grande roue
  const roueSec = document.getElementById("roue");
  if (roueSec) roueSec.style.display = "none";

  const s2pHost = document.getElementById("s2pHost");
  if (s2pHost) {
    s2pHost.style.display = "block";
    s2pHost.innerHTML = renderS2PHTML();
    selectSynergy(curS2PSyn);
    s2pHost.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.location.hash = "suite=s2p";
}

function closeS2P() {
  const s2pHost = document.getElementById("s2pHost");
  if (s2pHost) s2pHost.style.display = "none";

  const roueSec = document.getElementById("roue");
  if (roueSec) {
    roueSec.style.display = "block";
    roueSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.location.hash = "roue";
}

function renderS2PHTML() {
  // Les 6 modules Source-to-Pay dans l'ordre chronologique
  const nodes = ORDER_S2P.map((id, idx) => {
    const m = byId(id);
    return `<div class="s2p-node" data-s2p-id="${id}" style="--c:${m.c}" onclick="highlightModuleSynergies('${id}')">
      <div class="ord">0${idx + 1} · ${m.code}</div>
      <div class="ico">${m.icon}</div>
      <b>${m.label}</b>
      <span>${m.videos.length} vidéo${m.videos.length > 1 ? 's' : ''}</span>
    </div>`;
  }).join("");

  // Les puces de synergies clés
  const chips = S2P_SYNERGIES.map(s => {
    return `<button type="button" class="s2p-chip" data-syn-id="${s.id}" onclick="selectSynergy('${s.id}')">
      <i>${s.name}</i>
      <span>${s.lvl1}</span>
    </button>`;
  }).join("");

  // Les étapes de la chaîne financière
  const chainCards = FINANCIAL_CHAIN.map(st => {
    return `<div class="s2p-step-card" style="--c:${st.c}">
      <span class="s2p-step-tag">${st.tag}</span>
      <h4>${st.step}</h4>
      <div class="s2p-step-badge">${st.badge}</div>
      <p>${st.desc}</p>
    </div>`;
  }).join("");

  return `
    <div class="s2p-hero">
      <div class="s2p-top">
        <div class="s2p-bc"><i></i>Suite Esker · Source-to-Pay</div>
        <button type="button" class="s2p-back" onclick="closeS2P()">‹ Revenir à la roue générale</button>
      </div>
      <h2>Le cycle d'achat unifié : <em>synergies &amp; maîtrise budgétaire</em></h2>
      <p>Découvrez comment les 6 modules Source-to-Pay s'articulent pour éliminer les ressaisies, verrouiller les plafonds d'engagement et fiabiliser la clôture comptable.</p>
    </div>

    <div class="s2p-flow-box">
      <div class="s2p-track">
        ${nodes}
      </div>

      <div class="s2p-syn-head">
        <b>Synergies directes inter-modules</b>
        <span>Cliquez sur une synergie pour observer son mécanisme et son bénéfice financier</span>
      </div>

      <div class="s2p-syn-chips" id="s2pChips">
        ${chips}
      </div>

      <div id="s2pDetailBox"></div>
    </div>

    <div class="s2p-chain-box">
      <div class="s2p-chain-head">
        <h3>La chaîne de valeur financière : Engagement vs Charge vs Trésorerie</h3>
        <p>Comprendre la distinction fondamentale entre la gestion budgétaire Esker et l'exécution de trésorerie de l'ERP.</p>
      </div>

      <div class="s2p-steps-grid">
        ${chainCards}
      </div>

      <div class="s2p-cfo-takeaway">
        <div>
          <b>Règle de contrôle interne : Esker est le gardien du P&amp;L et de l'EBITDA</b>
          <span>Budget alloué = Consommé (factures) + Engagé (commandes en cours) + Pré-engagé (DA) + Disponible restant. L'ERP exécute les décaissements.</span>
        </div>
        <a href="#m=pr" onclick="closeS2P(); sel('pr');">Explorer le module Achats en détail →</a>
      </div>
    </div>
  `;
}

function selectSynergy(synId) {
  curS2PSyn = synId;
  const syn = S2P_SYNERGIES.find(s => s.id === synId);
  if (!syn) return;

  // Mise à jour de la puce active
  document.querySelectorAll(".s2p-chip").forEach(c => {
    c.classList.toggle("on", c.dataset.synId === synId);
  });

  // Mise en lumière des 2 modules connectés
  document.querySelectorAll(".s2p-node").forEach(n => {
    const id = n.dataset.s2pId;
    n.classList.toggle("lit", id === syn.from || id === syn.to);
  });

  // Rendu de la carte de détail
  const box = document.getElementById("s2pDetailBox");
  if (!box) return;

  const mFrom = byId(syn.from), mTo = byId(syn.to);
  const targetMod = (syn.to === "pr" || syn.from === "pr") ? "pr" : (syn.to || syn.from);

  box.innerHTML = `
    <div class="s2p-detail">
      <div class="s2p-detail-left">
        <span class="s2p-tag-l1">Synergie majeure · ${syn.name}</span>
        <h3>${syn.lvl1}</h3>
        <p>${syn.pitch}</p>
      </div>
      <div class="s2p-detail-right">
        <div class="s2p-benefit">
          <b>Bénéfice CFO &amp; Audit</b>
          <span>${syn.benefit}</span>
        </div>
        <div class="s2p-detail-act">
          <button type="button" class="s2p-btn-mod" onclick="closeS2P(); sel('${targetMod}');">
            Explorer le module ${byId(targetMod).label} →
          </button>
        </div>
      </div>
    </div>
  `;
}

function highlightModuleSynergies(modId) {
  // Trouver la première synergie impliquant ce module
  const match = S2P_SYNERGIES.find(s => s.from === modId || s.to === modId);
  if (match) {
    selectSynergy(match.id);
  }
}

function bindS2PEvents() {
  // Gestionnaires déjà déclarés en onclick inline
}
