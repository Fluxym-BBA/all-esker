/* =========================================================================
   LE MODÈLE PLANÉTAIRE & L'OFFRE DE VALEUR FLUXYM
   Expérience interactive et visuelle premium (Charte Fluxym & Esker)
   ========================================================================= */

function renderFluxymServicesHTML() {
  return `
    <div class="fluxym-universe">
      <!-- En-tête de section immersif -->
      <div class="fu-header">
        <span class="fu-badge">
          <span class="fu-badge-dot"></span>
          Accompagnement & Expertise Métier
        </span>
        <h2 class="fu-title">Au-delà de l'outil Esker : l'offre de valeur Fluxym</h2>
        <p class="fu-subtitle">
          Intégrer un logiciel ne suffit pas à réduire le BFR ou éradiquer les litiges. 
          Fluxym relie vos métiers, vos données et vos systèmes de référence autour d'une méthodologie éprouvée en 3 leviers.
        </p>
      </div>

      <!-- Le Système Planétaire Interactif -->
      <div class="fu-planet-stage">
        <!-- Fond étoilé et nébuleuses de fond -->
        <div class="fu-space-glow glow-1"></div>
        <div class="fu-space-glow glow-2"></div>
        
        <!-- Anneaux orbitaux avec particules en révolution -->
        <div class="fu-orbit orbit-outer">
          <span class="fu-orbit-particle p1"></span>
          <span class="fu-orbit-particle p2"></span>
        </div>
        <div class="fu-orbit orbit-inner">
          <span class="fu-orbit-particle p3"></span>
        </div>

        <!-- Cœur du système : La Suite Esker (Plateforme Technologique) -->
        <div class="fu-core-sun" id="fuCoreSun">
          <div class="fu-sun-corona"></div>
          <div class="fu-sun-content">
            <span class="fu-sun-pill">SOCLE UNIFIÉ</span>
            <h3>Suite Esker</h3>
            <p>O2C & S2P</p>
            <div class="fu-sun-tags">
              <span>Synergy AI</span>
              <span>Datalake</span>
              <span>APIs ERP</span>
            </div>
          </div>
        </div>

        <!-- Satellite 1 : ÉVALUER (AMOA, Diagnostic, Data Cleansing) -->
        <div class="fu-satellite sat-evaluer" data-sat="evaluer">
          <div class="fu-sat-card">
            <div class="fu-sat-header">
              <span class="fu-sat-step">01</span>
              <div>
                <span class="fu-sat-label">ÉVALUER</span>
                <h4>Cadrage & Diagnostic BFR</h4>
              </div>
            </div>
            <p class="fu-sat-desc">Comprendre l'organisation et objectiver les flux réels avant d'outiller.</p>
            <div class="fu-sat-pills">
              <span>Diagnostic opposable</span>
              <span>Data Cleansing</span>
              <span>Modèle TO-BE</span>
            </div>
            <div class="fu-sat-drawer">
              <ul>
                <li><strong>Ciblage des causes racines</strong> : analyse des postes pesant réellement sur le DSO et le BFR.</li>
                <li><strong>Qualification des référentiels</strong> : assainissement des bases clients, articles et conditions de paiement.</li>
                <li><strong>RACI & règles de gestion</strong> : trajectoire partagée entre Direction Financière, ADV et DSI.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Satellite 2 : DÉPLOYER (Conception, Intégration SI, Paramétrage) -->
        <div class="fu-satellite sat-deployer" data-sat="deployer">
          <div class="fu-sat-card">
            <div class="fu-sat-header">
              <span class="fu-sat-step">02</span>
              <div>
                <span class="fu-sat-label">DÉPLOYER</span>
                <h4>Conception & Intégration SI</h4>
              </div>
            </div>
            <p class="fu-sat-desc">Aligner les métiers et la DSI sur une trajectoire finançable et séquencée.</p>
            <div class="fu-sat-pills">
              <span>Direction agile</span>
              <span>Connecteurs SAP/ERP</span>
              <span>Plateforme Agréée</span>
            </div>
            <div class="fu-sat-drawer">
              <ul>
                <li><strong>Gouvernance de projet agile</strong> : sécurisation des jalons de livraison et maîtrise des coûts.</li>
                <li><strong>Intégration universelle</strong> : interconnexion native avec SAP, Oracle, Salesforce et réseaux e-invoicing.</li>
                <li><strong>Paramétrage sur mesure</strong> : adaptation fine des workflows de validation sans dénaturer le standard.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Satellite 3 : SÉCURISER (Formation, Conduite du changement, TMA) -->
        <div class="fu-satellite sat-securiser" data-sat="securiser">
          <div class="fu-sat-card">
            <div class="fu-sat-header">
              <span class="fu-sat-step">03</span>
              <div>
                <span class="fu-sat-label">SÉCURISER</span>
                <h4>Formation, Conduite & TMA</h4>
              </div>
            </div>
            <p class="fu-sat-desc">Rendre les équipes autonomes et tenir la performance au-delà du go-live.</p>
            <div class="fu-sat-pills">
              <span>Adoption métier</span>
              <span>Support & TMA dédié</span>
              <span>Gouvernance SLA</span>
            </div>
            <div class="fu-sat-drawer">
              <ul>
                <li><strong>Accompagnement au changement</strong> : plans de formation personnalisés par profil (ADV, Crédit, Comptabilité).</li>
                <li><strong>Support expert & TMA</strong> : maintenance corrective, évolutive et engagements stricts de SLA.</li>
                <li><strong>Amélioration continue</strong> : audits post-démarrage pour maximiser le taux de Touchless et le ROI.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Les 4 Principes Directeurs d'Architecture Métier -->
      <div class="fu-section-title">
        <span class="fu-kicker">Architecture & Méthode</span>
        <h3>Nos 4 convictions pour une transformation pérenne</h3>
      </div>

      <div class="fu-principles-deck">
        <div class="fu-principle-card">
          <div class="fu-p-icon">01</div>
          <div class="fu-p-body">
            <h4>Process-First</h4>
            <span class="fu-p-lead">Ne pas faire du catalogue logiciel le modèle de vos processus.</span>
            <p>Nous partons toujours de vos règles métier réelles, de vos flux physiques et de vos spécificités organisationnelles pour adapter l'outil, jamais l'inverse.</p>
          </div>
        </div>

        <div class="fu-principle-card">
          <div class="fu-p-icon">02</div>
          <div class="fu-p-body">
            <h4>System-of-Record Clair</h4>
            <span class="fu-p-lead">Définir qui détient la donnée source et qui l'exécute.</span>
            <p>Esker orchestre et fluidifie les flux, mais ne remplace pas l'ERP qui comptabilise, le WMS qui expédie ou la banque qui exécute le paiement. Chaque système garde sa frontière.</p>
          </div>
        </div>

        <div class="fu-principle-card">
          <div class="fu-p-icon">03</div>
          <div class="fu-p-body">
            <h4>Gestion des Exceptions</h4>
            <span class="fu-p-lead">Tout litige et toute déduction doit avoir un propriétaire.</span>
            <p>Une réclamation non qualifiée paralyse le recouvrement. Nous installons pour chaque motif un Owner désigné, un code de cause racine et un engagement de délai (SLA).</p>
          </div>
        </div>

        <div class="fu-principle-card">
          <div class="fu-p-icon">04</div>
          <div class="fu-p-body">
            <h4>Mesure de Performance Commune</h4>
            <span class="fu-p-lead">Le DSO seul ne suffit pas à piloter la performance.</span>
            <p>Nous instrumentons des indicateurs d'efficacité opérationnelle : taux de Touchless (STP), bon du premier coup (FTR), stock de litiges et cash non alloué en banque.</p>
          </div>
        </div>
      </div>

      <!-- Tableau Comparatif de Positionnement Marché -->
      <div class="fu-comparison-wrapper">
        <div class="fu-comp-header">
          <span class="fu-kicker">Positionnement Unique</span>
          <h3>Pourquoi choisir Fluxym face aux autres acteurs de l'O2C ?</h3>
          <p>La concurrence se joue brique par brique. Voici ce qui nous différencie radicalement des alternatives du marché.</p>
        </div>

        <div class="fu-matrix-container">
          <div class="fu-matrix-col">
            <div class="fu-matrix-head">
              <span class="fu-type">AUDIT & CONSEIL</span>
              <h5>Cabinets de Conseil</h5>
              <small>Deloitte, PwC, EY, KPMG...</small>
            </div>
            <div class="fu-matrix-body">
              <div class="fu-item-pro">
                <strong>Ce qu'ils apportent :</strong>
                <span>Cadrage BFR stratégique et accès à la direction générale.</span>
              </div>
              <div class="fu-item-con">
                <strong>Leur limite constatée :</strong>
                <span>Ils livrent des recommandations mais n'intègrent pas la solution technique dans vos systèmes.</span>
              </div>
            </div>
          </div>

          <div class="fu-matrix-col">
            <div class="fu-matrix-head">
              <span class="fu-type">INTÉGRATION GÉNÉRALISTE</span>
              <h5>ESN & Intégrateurs</h5>
              <small>Capgemini, Sopra Steria, Inetum...</small>
            </div>
            <div class="fu-matrix-body">
              <div class="fu-item-pro">
                <strong>Ce qu'ils apportent :</strong>
                <span>Capacité de delivery et déploiements à très grande échelle.</span>
              </div>
              <div class="fu-item-con">
                <strong>Leur limite constatée :</strong>
                <span>L'Order-to-Cash est une ligne parmi d'autres, sans culture métier approfondie du risque ou du recouvrement.</span>
              </div>
            </div>
          </div>

          <div class="fu-matrix-col">
            <div class="fu-matrix-head">
              <span class="fu-type">SERVICES EXTERNALISÉS</span>
              <h5>Assureurs & Factors</h5>
              <small>Allianz Trade, Coface, Factors...</small>
            </div>
            <div class="fu-matrix-body">
              <div class="fu-item-pro">
                <strong>Ce qu'ils apportent :</strong>
                <span>Externalisation du risque et portage financier du poste client.</span>
              </div>
              <div class="fu-item-con">
                <strong>Leur limite constatée :</strong>
                <span>Ils indemnisent l'impayé mais ne corrigent pas les défaillances internes à l'origine du blocage.</span>
              </div>
            </div>
          </div>

          <!-- Colonne Vedette : FLUXYM -->
          <div class="fu-matrix-col fu-fluxym-champion">
            <div class="fu-matrix-head">
              <span class="fu-champion-badge">NOTRE DIFFÉRENCE</span>
              <h5>L'Alliance Fluxym</h5>
              <small>Expert Métier & Intégrateur Pure-Player</small>
            </div>
            <div class="fu-matrix-body">
              <div class="fu-champion-highlight">
                <strong>La double compétence rare :</strong>
                <p>La compréhension intime des enjeux financiers et métiers du poste client <em>ET</em> la maîtrise technique absolue de la suite Esker au sein d'une seule et même équipe projet.</p>
              </div>
              <ul class="fu-champion-bullets">
                <li>Conseil & intégration réunis sans déperdition</li>
                <li>Expertise reconnue par les analystes et éditeurs</li>
                <li>Accompagnement du diagnostic jusqu'au support TMA</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
