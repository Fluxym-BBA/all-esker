/* =========================================================================
   LE MODÈLE PLANÉTAIRE & L'OFFRE DE VALEUR TRANSVERSE FLUXYM
   Conforme à la charte graphique Fluxym :
   Fond clair lumineux, cercles, interaction par clic, typographies Miriam Libre & Barlow
   ========================================================================= */

const FLUXYM_SERVICES_DATA = {
  activeSat: 0,
  satellites: [
    {
      id: "evaluer",
      num: "01",
      tag: "AMOA & Cadrage",
      title: "ÉVALUER",
      subtitle: "Diagnostic BFR & Data Cleansing",
      lead: "Objectiver l'existant, cibler les causes réelles qui pèsent sur le cash et assainir les référentiels avant d'outiller.",
      color: "var(--blue, #13b4e2)",
      icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
      bullets: [
        { t: "Diagnostic opposable", d: "Analyse chiffrée des goulets d'étranglement pesant réellement sur le DSO et le BFR." },
        { t: "Data Cleansing", d: "Qualification et remise en qualité des référentiels clients, articles et conditions de règlement." },
        { t: "Cadrage TO-BE", d: "Formalisation des règles de gestion cibles, des matrices de délégation et de la roadmap finançable." }
      ]
    },
    {
      id: "deployer",
      num: "02",
      tag: "Intégration SI",
      title: "DÉPLOYER",
      subtitle: "Conception & Intégration SI",
      lead: "Aligner les métiers, la finance et la DSI sur une trajectoire séquencée, sécurisée et gouvernable.",
      color: "var(--purple-rain, #6b51ed)",
      icon: '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
      bullets: [
        { t: "Direction de projet agile", d: "Gouvernance structurée, sécurisation des jalons de livraison et respect des engagements." },
        { t: "Intégration universelle", d: "Connecteurs éprouvés avec SAP, Oracle, Microsoft, Salesforce et les réseaux e-invoicing." },
        { t: "Paramétrage sur mesure", d: "Configuration précise des workflows de validation sans dénaturer le standard éditeur." }
      ]
    },
    {
      id: "securiser",
      num: "03",
      tag: "Pérennisation",
      title: "SÉCURISER",
      subtitle: "Formation, Conduite & TMA",
      lead: "Rendre les équipes pleinement autonomes et garantir la performance opérationnelle bien au-delà du go-live.",
      color: "var(--sunlight, #f5a623)",
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      bullets: [
        { t: "Conduite du changement", d: "Plans de formation ciblés par rôle (ADV, Crédit, Comptables, Managers de centres de coûts)." },
        { t: "Support expert & TMA", d: "Tierce Maintenance Applicative dédiée, engagement de SLA et suivi proactif des tickets." },
        { t: "Amélioration continue", d: "Audits post-démarrage pour maximiser le taux de Touchless et pérenniser les gains BFR." }
      ]
    }
  ],
  principles: [
    { num: "01", t: "Process-First", lead: "Le métier dicte le processus, pas le logiciel", d: "Nous partons toujours de vos règles de gestion réelles et de vos flux physiques pour adapter l'outil, sans standardisation forcée." },
    { num: "02", t: "System-of-Record Clair", lead: "Qui détient la donnée et qui l'exécute", d: "Esker orchestre et automatise les flux mais ne remplace pas l'ERP qui comptabilise, le WMS qui expédie ou la banque qui encaisse." },
    { num: "03", t: "Gestion des Exceptions", lead: "Chaque anomalie a un responsable", d: "Toute réclamation et toute déduction est dotée d'un propriétaire identifié (Owner), d'un motif qualifié et d'un engagement de SLA." },
    { num: "04", t: "Mesure de Performance", lead: "Le DSO seul ne suffit pas", d: "Nous pilotons des indicateurs d'efficacité opérationnelle : taux de Touchless (STP), bon du premier coup (FTR) et cash non alloué." }
  ],
  actors: [
    { type: "Cabinets d'audit & conseil", ex: "Deloitte, PwC, EY, KPMG", pro: "Cadrage stratégique BFR, accès direction générale", con: "Ils cadrent mais n'intègrent pas la solution technique" },
    { type: "ESN généralistes", ex: "Capgemini, Sopra Steria, Inetum", pro: "Capacité de delivery et déploiements à grande échelle", con: "L'O2C est une ligne parmi d'autres, sans spécialité métier" },
    { type: "Services externalisés", ex: "Allianz Trade, Coface, factors", pro: "Portage financier du risque et du recouvrement", con: "Ils pallient le risque sans corriger les causes racines du processus" },
    { type: "L'Alliance Fluxym", ex: "Expert Métier & Intégrateur Pure-Player", pro: "Double compétence : expertise métier O2C ET maîtrise pointue d'Esker", con: "Un seul interlocuteur engagé de bout en bout", champ: true }
  ]
};

function renderFluxymServicesHTML() {
  const d = FLUXYM_SERVICES_DATA;

  const satPills = d.satellites.map((s, idx) => `
    <button type="button" class="fp-sat-btn${idx === 0 ? ' active' : ''}" data-fpsat="${idx}" style="--c:${s.color}">
      <span class="fp-sat-num">${s.num}</span>
      <span class="fp-sat-name">${s.title}</span>
    </button>
  `).join("");

  const satCards = d.satellites.map((s, idx) => `
    <div class="fp-detail-card${idx === 0 ? ' active' : ''}" data-fppane="${idx}" style="--c:${s.color}">
      <div class="fp-card-top">
        <span class="fp-tag" style="background:${s.color}15;color:${s.color};border:1px solid ${s.color}35">${s.tag}</span>
        <h4>${s.subtitle}</h4>
        <p class="fp-card-lead">${s.lead}</p>
      </div>
      <div class="fp-card-grid">
        ${s.bullets.map(b => `
          <div class="fp-bullet-box">
            <span class="fp-bullet-dot" style="background:${s.color}"></span>
            <div>
              <strong>${b.t}</strong>
              <p>${b.d}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  const principlesHtml = d.principles.map(p => `
    <div class="fp-principle-card">
      <span class="fp-pr-num">${p.num}</span>
      <h5>${p.t}</h5>
      <span class="fp-pr-lead">${p.lead}</span>
      <p>${p.d}</p>
    </div>
  `).join("");

  const comparisonHtml = d.actors.map(a => `
    <div class="fp-actor-card${a.champ ? ' champion' : ''}">
      <div class="fp-actor-head">
        <span class="fp-actor-type">${a.type}</span>
        <small>${a.ex}</small>
      </div>
      <div class="fp-actor-body">
        <div class="fp-act-item pro">
          <small>Ce qu'ils apportent</small>
          <span>${a.pro}</span>
        </div>
        <div class="fp-act-item con">
          <small>${a.champ ? 'Notre engagement' : 'Leur limite constatée'}</small>
          <span>${a.con}</span>
        </div>
      </div>
    </div>
  `).join("");

  return `
    <div class="fluxym-planet-experience">
      <div class="wrap">
        <!-- En-tête sobre et percutant dans la charte Fluxym -->
        <div class="fp-section-head">
          <span class="fp-kicker"><i></i>Accompagnement & Expertise Métier</span>
          <h2 class="fp-main-title">Au-delà de l'outil Esker : <em>l'offre de valeur Fluxym</em></h2>
          <p class="fp-main-lead">
            Intégrer une solution technologique ne suffit pas à réduire le DSO ou éradiquer les litiges. 
            Fluxym relie vos métiers, vos données et vos systèmes de référence autour d'une méthodologie éprouvée en 3 leviers.
          </p>
        </div>

        <!-- Le Système Planétaire Interactif (Lumineux & Dynamique) -->
        <div class="fp-stage-box">
          <!-- Cercle central représentant le socle Esker -->
          <div class="fp-system-center">
            <div class="fp-center-glow"></div>
            <div class="fp-center-orbit"></div>
            <div class="fp-center-core">
              <span class="fp-core-badge">Plateforme Technologique</span>
              <h3>Suite Esker</h3>
              <p>O2C & S2P</p>
              <div class="fp-core-chips">
                <span>Synergy AI</span>
                <span>Datalake</span>
                <span>APIs ERP</span>
              </div>
            </div>
          </div>

          <!-- Sélecteur des 3 leviers d'action Fluxym (Satellites) -->
          <div class="fp-satellites-nav" role="tablist" aria-label="Les 3 leviers d'action Fluxym">
            ${satPills}
          </div>

          <!-- Volet interactif affichant le levier actif -->
          <div class="fp-details-viewport">
            ${satCards}
          </div>
        </div>

        <!-- Nos 4 Convictions d'Architecture Métier -->
        <div class="fp-sub-header">
          <span class="fp-kicker"><i></i>Architecture & Méthode</span>
          <h3>Nos 4 convictions pour une transformation pérenne</h3>
        </div>

        <div class="fp-principles-row">
          ${principlesHtml}
        </div>

        <!-- Tableau Comparatif de Marché (Pourquoi Fluxym ?) -->
        <div class="fp-sub-header">
          <span class="fp-kicker"><i></i>Positionnement Unique</span>
          <h3>Pourquoi choisir Fluxym face aux autres acteurs de l'O2C ?</h3>
        </div>

        <div class="fp-actors-grid">
          ${comparisonHtml}
        </div>
      </div>
    </div>
  `;
}

function bindFluxymServicesEvents() {
  const container = document.getElementById('fluxymServicesContainer');
  if (!container || container.dataset.bound) return;
  container.dataset.bound = 'true';

  const btns = container.querySelectorAll('.fp-sat-btn');
  const panes = container.querySelectorAll('.fp-detail-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.fpsat;
      btns.forEach(b => b.classList.toggle('active', b === btn));
      panes.forEach(p => p.classList.toggle('active', p.dataset.fppane === idx));
    });
  });
}
