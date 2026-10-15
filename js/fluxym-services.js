/* =========================================================================
   LE MODÈLE PLANÉTAIRE & LES SERVICES MÉTIER FLUXYM (ACCOMPAGNEMENT O2C / S2P)
   ========================================================================= */

function renderFluxymServicesHTML() {
  return `
    <div class="fluxym-services-section">
      <div class="fserv-header">
        <span class="fserv-pill">Accompagnement & Expertise Métier</span>
        <h3>Au-delà de l'outil Esker : l'offre de valeur Fluxym</h3>
        <p class="fserv-lead">
          Intégrer une solution technologique ne suffit pas pour faire baisser le DSO ou éradiquer les litiges. 
          Fluxym relie vos métiers, vos données et votre écosystème SI autour d'une méthodologie éprouvée en 3 leviers.
        </p>
      </div>

      <!-- Le Modèle Planétaire Fluxym -->
      <div class="planet-container">
        <div class="planet-orbit-ring orbit-1"></div>
        <div class="planet-orbit-ring orbit-2"></div>
        
        <!-- Centre du système : La Suite Esker -->
        <div class="planet-core">
          <div class="planet-core-badge">Plateforme Technologique</div>
          <h4>Suite Esker O2C & S2P</h4>
          <p>Synergy AI · Datalake · Connecteurs ERP</p>
          <div class="core-modules-tags">
            <span>Credit</span><span>Inquiries</span><span>Orders</span>
            <span>Invoices</span><span>Cash App</span><span>Claims</span><span>Collections</span>
          </div>
        </div>

        <!-- Satellite 1 : Évaluer (AMOA & Cadrage) -->
        <div class="satellite-card sat-top">
          <div class="sat-badge">1. ÉVALUER</div>
          <h5>Cadrage & Diagnostic BFR</h5>
          <ul>
            <li><strong>Diagnostic opposable</strong> : ciblage des causes réelles pesant sur le cash</li>
            <li><strong>Data Cleansing</strong> : qualification et assainissement des référentiels tiers</li>
            <li><strong>Trajectoire cible (TO-BE)</strong> : règles de gestion et RACI documentés</li>
          </ul>
        </div>

        <!-- Satellite 2 : Déployer (Intégration SI) -->
        <div class="satellite-card sat-left">
          <div class="sat-badge">2. DÉPLOYER</div>
          <h5>Conception & Intégration SI</h5>
          <ul>
            <li><strong>Direction de projet agile</strong> : gouvernance claire et respect des jalons</li>
            <li><strong>Intégration universelle</strong> : interconnexion ERP (SAP, Oracle), CRM et PA</li>
            <li><strong>Paramétrage sur mesure</strong> : adaptation fine à vos spécificités métier</li>
          </ul>
        </div>

        <!-- Satellite 3 : Sécuriser (Pérennisation & TMA) -->
        <div class="satellite-card sat-right">
          <div class="sat-badge">3. SÉCURISER</div>
          <h5>Formation, Conduite & TMA</h5>
          <ul>
            <li><strong>Accompagnement au changement</strong> : autonomie et adhésion des utilisateurs</li>
            <li><strong>Support expert & TMA</strong> : maintenance corrective, évolutive et suivi SLA</li>
            <li><strong>Amélioration continue</strong> : audits post-démarrage et optimisation des KPI</li>
          </ul>
        </div>
      </div>

      <!-- Les 4 Principes directeurs de l'architecture métier -->
      <div class="principles-grid">
        <div class="principle-card">
          <span class="p-num">01</span>
          <h5>Process-First</h5>
          <p>Le catalogue logiciel ne dicte pas le processus. Nous partons toujours de vos règles métier réelles et de vos flux physiques.</p>
        </div>
        <div class="principle-card">
          <span class="p-num">02</span>
          <h5>System-of-Record Clair</h5>
          <p>Définition rigoureuse de qui détient la donnée source (ERP, CRM, WMS) et qui exécute l'événement d'orchestration.</p>
        </div>
        <div class="principle-card">
          <span class="p-num">03</span>
          <h5>Gestion des Exceptions</h5>
          <p>Chaque réclamation et chaque déduction est dotée d'un responsable identifié (Owner), d'un motif qualifié et d'un engagement de SLA.</p>
        </div>
        <div class="principle-card">
          <span class="p-num">04</span>
          <h5>Mesure de Performance Commune</h5>
          <p>Le DSO seul ne suffit pas : nous mesurons le taux d'automatisation (STP), le bon du premier coup (FTR) et le cash non alloué.</p>
        </div>
      </div>

      <!-- Tableau comparatif : Le positionnement unique de Fluxym -->
      <div class="market-comparison">
        <h4>Pourquoi choisir Fluxym ? Un positionnement unique sur le marché</h4>
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Type d'acteur</th>
                <th>Ce qu'ils apportent</th>
                <th>Leur limite constatée</th>
                <th>La valeur ajoutée Fluxym</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cabinets d'audit & conseil</strong><br><small>Deloitte, PwC, EY, KPMG</small></td>
                <td>Cadrage stratégique du BFR, accès direction générale.</td>
                <td>Ils cadrent mais n'intègrent pas la solution technique.</td>
                <td rowspan="3" class="fluxym-diff-cell">
                  <div class="diff-highlight">
                    <strong>La double compétence rare :</strong><br>
                    L'expertise métier du poste client <em>ET</em> la maîtrise pointue de l'intégration technologique Esker au sein de la même équipe projet.
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>ESN généralistes</strong><br><small>Capgemini, Sopra Steria, Inetum</small></td>
                <td>Capacité de déploiement à grande échelle.</td>
                <td>L'O2C est une ligne parmi d'autres, pas une spécialité métier.</td>
              </tr>
              <tr>
                <td><strong>Services externalisés & Assureurs</strong><br><small>Allianz Trade, Coface, factors</small></td>
                <td>Portage financier du risque et du recouvrement.</td>
                <td>Ils pallient le risque sans corriger les causes racines du processus.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
