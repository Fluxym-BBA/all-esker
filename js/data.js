const CDN = "https://26096000.fs1.hubspotusercontent-eu1.net/hubfs/26096000/";
const F_S2P = CDN + "F_S2P/";
const F_O2C = CDN + "F_O2C/";
const F_DEMO_O2C = CDN + "Vid%C3%A9o%20d%C3%A9mo%20Esker%20O2C/";

const M = [
  {id:"so", code:"SRC", suite:"S2P", label:"Sourcing", icon:"🔎", c:"#8CC63F",
   desc:"Digitalisez vos appels d'offres et enchères inversées avec Market Dojo. Centralisez les consultations, comparez les réponses fournisseurs et sécurisez vos décisions d'attribution.",
   videos:[{t:"Présentation globale du module Sourcing Esker (Market Dojo)", sz:"34 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Sourcing%20Esker%20(Market%20Dojo)%20(C).mp4"}]},

  {id:"sm", code:"SM", suite:"S2P", label:"Supplier Management", icon:"🤝", c:"#00A7E1",
   desc:"Référencez, qualifiez et suivez vos fournisseurs dans un référentiel unique. Onboarding en self-service via le portail, contrôle des données et pilotage du risque fournisseur.",
   videos:[{t:"Présentation globale du module Gestion des Fournisseurs", sz:"29 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Gestion%20des%20Fournisseurs%20(C).mp4"}]},

  {id:"ctm", code:"CTM", suite:"S2P", label:"Contract Management", icon:"📄", c:"#5B6B7A",
   desc:"Centralisez le cycle de vie contractuel : rédaction assistée, circuits de validation, signature électronique, alertes d'échéance et suivi des engagements.",
   videos:[{t:"Présentation globale du module Contrats Esker", sz:"29 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Contrats%20Esker%20(C).mp4"}]},

  {id:"pr", code:"PROC", suite:"S2P", label:"Procurement", icon:"🛒", c:"#2E3F4F",
   desc:"Canalisez la dépense vers les contrats négociés : catalogues et punch-out, demandes d'achat guidées, workflows d'approbation, commandes et réceptions.",
   videos:[{t:"Présentation globale du module Achats Esker", sz:"27 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Achats%20Esker%20(C).mp4"}]},

  {id:"ap", code:"AP", suite:"S2P", label:"Accounts Payable & Compliance", icon:"🧾", c:"#F5A623",
   desc:"Automatisez le traitement des factures fournisseurs : capture IA, rapprochement commande/réception, workflows d'approbation, conformité et facturation électronique.",
   videos:[{t:"Présentation globale du module Factures Fournisseurs Esker", sz:"30 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Factures%20Fournisseurs%20Esker%20(C).mp4"}]},

  {id:"em", code:"EM", suite:"S2P", label:"Expense Management", icon:"✈️", c:"#E8465A",
   desc:"Simplifiez les notes de frais : saisie mobile avec reconnaissance du justificatif, contrôle automatique de la politique de dépense et remboursement accéléré.",
   videos:[{t:"Présentation globale du module Notes de Frais Esker", sz:"30 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Notes%20de%20Frais%20Esker%20(C).mp4"}]},

  {id:"crm", code:"CRM", suite:"O2C", label:"Credit Management", icon:"📊", c:"#7D8B99",
   desc:"Évaluez et surveillez le risque client en continu : scoring, encours et limites de crédit, demandes d'ouverture de compte et validation des blocages de commande.",
   videos:[]},

  {id:"cim", code:"CIM", suite:"O2C", label:"Customer Inquiry Management", icon:"💬", c:"#2E3F4F",
   desc:"Centralisez toutes les demandes clients dans une boîte partagée intelligente : qualification automatique, routage vers le bon interlocuteur et suivi des délais de réponse.",
   videos:[]},

  {id:"om", code:"OM", suite:"O2C", label:"Order Management", icon:"📦", c:"#F5A623",
   desc:"Automatisez la saisie des commandes clients, quel que soit le canal (e-mail, PDF, EDI, portail). Détection des écarts, contrôle des prix et intégration directe à l'ERP.",
   videos:[]},

  {id:"id", code:"ID", suite:"O2C", label:"Invoice Delivery & Compliance", icon:"📤", c:"#E8465A",
   desc:"Émettez et distribuez vos factures clients sur tous les canaux, en conformité avec les obligations de facturation électronique en France et à l'international.",
   videos:[{t:"Présentation globale du module Factures Clients Esker", sz:"27 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Factures%20Clients%20(C).mp4"}]},

  {id:"ca", code:"CA", suite:"O2C", label:"Cash Application", icon:"💰", c:"#8CC63F",
   desc:"Lettrez automatiquement les encaissements : rapprochement IA des règlements et des avis de paiement, traitement des écarts et imputation comptable immédiate.",
   videos:[
    {t:"Présentation globale du module Encaissements Clients", sz:"40 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Encaissements%20Clients%20(C).mp4"},
    {t:"Présentation détaillée (version longue)", sz:"50 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Encaissements%20Clients%20%20(%20V%20longue)%20(C).mp4"}
   ]},

  {id:"cd", code:"C&D", suite:"O2C", label:"Claims & Deductions", icon:"⚖️", c:"#4FC3D9",
   desc:"Traitez les litiges et déductions clients de bout en bout : qualification du motif, collecte des preuves, workflow de résolution et suivi du taux de recouvrement.",
   videos:[]},

  {id:"com", code:"COM", suite:"O2C", label:"Collections Management", icon:"📞", c:"#00A7E1",
   desc:"Pilotez le recouvrement avec des stratégies de relance personnalisées, une priorisation intelligente des dossiers et une vision temps réel du DSO.",
   videos:[{t:"Présentation globale du module Collection Management", sz:"37 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Collection%20Management%20(C).mp4"}]}
];

const ORDER_S2P = ["so","sm","ctm","pr","ap","em"];
const ORDER_O2C = ["crm","cim","om","id","ca","cd","com"];
const ALL_ORDER = ORDER_S2P.concat(ORDER_O2C);
const byId = id => M.find(m => m.id === id);
const TOTV = M.reduce((a, m) => a + m.videos.length, 0);
const WITHVID = M.filter(m => m.videos.length).map(m => m.id);

// =============================================================================
// MATRICE DES SYNERGIES SOURCE-TO-PAY (2 niveaux de granularité)
// =============================================================================
const S2P_SYNERGIES = [
  {
    id: "so-ctm",
    from: "so", to: "ctm",
    name: "Sourcing × Contrats",
    lvl1: "Négociation transformée en engagement",
    pitch: "L'offre retenue lors de l'appel d'offres génère directement le contrat cadre dans Esker. Grilles tarifaires, indexations et SLA sont verrouillés juridiquement sans aucune ressaisie.",
    benefit: "Éradication des fuites de valeur (contract leakage) et sécurisation immédiate du P&L."
  },
  {
    id: "so-sm",
    from: "so", to: "sm",
    name: "Sourcing × Fournisseurs",
    lvl1: "Fournisseur sourcé, tiers certifié",
    pitch: "L'attribution d'un marché déclenche l'onboarding complet sur le portail : collecte des documents légaux (Kbis, URSSAF, RSE/ESG) et vérification bancaire avant toute contractualisation.",
    benefit: "Conformité légale préalable (Sapin II / Devoir de vigilance) : aucun engagement sur tiers non audité."
  },
  {
    id: "sm-pr",
    from: "sm", to: "pr",
    name: "Fournisseurs × Achats",
    lvl1: "Achat sur tiers qualifié",
    pitch: "Seuls les fournisseurs certifiés et à jour sont sélectionnables dans les demandes d'achat. En cas d'alerte risque ou d'attestation expirée, le fournisseur est gelé pour les nouvelles commandes.",
    benefit: "Fin des achats hors contrat (maverick buying) et protection active de la chaîne d'approvisionnement."
  },
  {
    id: "ctm-pr",
    from: "ctm", to: "pr",
    name: "Contrats × Achats",
    lvl1: "Commandes sous plafond contractuel",
    pitch: "Les bons de commande sont rattachés au contrat cadre. Pour les prestations récurrentes (ex. prestation de développeur à 100 k€/an ou contrats d'entretien), l'échéancier est décrémenté en temps réel.",
    benefit: "Alerte précoce avant tout dépassement de plafond budgétaire contractuel et zéro régularisation en urgence."
  },
  {
    id: "ctm-ap",
    from: "ctm", to: "ap",
    name: "Contrats × Factures",
    lvl1: "Forfaits rapprochés sans commande",
    pitch: "Pour les dépenses récurrentes régulières (baux, maintenance, abonnements), la facture entrante est directement rapprochée du calendrier contractuel prévisionnel.",
    benefit: "Suppression du coût administratif des bons de commande récurrents tout en maintenant un contrôle strict à 2 voies."
  },
  {
    id: "pr-ap",
    from: "pr", to: "ap",
    name: "Achats × Factures",
    lvl1: "Rapprochement 3 voies & FNP",
    pitch: "Rapprochement ligne à ligne entre la commande, la réception (service fait) et la facture. La commande passe à l'état Facturée, la charge constatée solde l'engagement budgétaire et les réceptions non facturées alimentent en continu le calcul des FNP.",
    benefit: "Clôtures comptables fiabilisées en quelques heures et cut-off irréprochable sans double imputation."
  },
  {
    id: "sm-ap",
    from: "sm", to: "ap",
    name: "Fournisseurs × Factures",
    lvl1: "Paiement sécurisé zéro fraude",
    pitch: "Lors de la capture de facture, l'IBAN, le BIC et les identifiants fiscaux sont comparés au référentiel certifié du module Fournisseurs (et vérifiés avec des bases externes). En cas de discordance, blocage immédiat du Bon à Payer.",
    benefit: "Protection totale contre la fraude au faux président et au changement d'IBAN."
  },
  {
    id: "em-ap",
    from: "em", to: "ap",
    name: "Notes de frais × Factures",
    lvl1: "Flux comptable tiers unifié",
    pitch: "Notes de frais et factures fournisseurs partagent le même moteur de règles fiscales : extraction et contrôle des plafonds de TVA déductible, archivage à valeur probante et flux de mise en paiement unique.",
    benefit: "Sécurisation fiscale face aux contrôles URSSAF/fiscaux et réduction drastique des coûts du back-office comptable."
  },
  {
    id: "ai-teams",
    from: "pr", to: "ap",
    name: "Synergy IA × Teams / MCP",
    lvl1: "Gouvernance IA sans connexion",
    pitch: "Validation des demandes d'achat et factures directement dans Microsoft Teams ou à la voix via Synergy. Les approbateurs occasionnels n'ont plus besoin d'ouvrir l'application, tout en conservant une traçabilité d'audit complète.",
    benefit: "Temps de cycle divisés par 3 sans rogner sur la matrice de délégation de pouvoirs (DoA)."
  }
];

// =============================================================================
// CHAÎNE FINANCIÈRE : DISTINCTION BUDGET VS TRÉSORERIE
// =============================================================================
const FINANCIAL_CHAIN = [
  {
    step: "1. Demande d'achat",
    badge: "Pré-engagement",
    tag: "Budget",
    desc: "Réservation préventive de crédit. Bloque la dépense à la source si l'enveloppe budgétaire est insuffisante, avant d'engager commercialement l'entreprise.",
    c: "#13b4e2"
  },
  {
    step: "2. Bon de commande",
    badge: "Engagement juridique ferme",
    tag: "Budget",
    desc: "Consommation ferme de l'enveloppe budgétaire. L'entreprise est juridiquement liée au fournisseur selon les prix et conditions négociés.",
    c: "#163467"
  },
  {
    step: "3. Réception (Service fait)",
    badge: "Provision de cut-off (FNP)",
    tag: "Comptabilité",
    desc: "Constatation de la livraison ou de la prestation réalisée. Fait générateur de la dette alimentant automatiquement les Factures Non Parvenues (FNP).",
    c: "#6b51ed"
  },
  {
    step: "4. Facture validée",
    badge: "Charge constatée (P&L)",
    tag: "Esker solde l'engagement",
    desc: "L'enregistrement comptable de la facture solde l'engagement de commande initial et éteint la provision FNP. Génère le Bon à Payer (BAP).",
    c: "#ffcf63"
  },
  {
    step: "5. Règlement bancaire",
    badge: "Trésorerie / Cash-out",
    tag: "ERP & Banque / TMS",
    desc: "Décaissement effectif (crédit banque 512). Opéré par l'ERP et le système de trésorerie selon les campagnes de paiement sur la base du BAP certifié par Esker.",
    c: "#7eefa0"
  }
];

// =============================================================================
// CONFIGURATION DÉTAILLÉE DU MODULE E-PROCUREMENT (XP)
// =============================================================================
const XP_IMG = "assets/procurement/";
const XP_ICONS = {
  kpi:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  box:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  layers:'<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
  euro:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5a4.5 4.5 0 1 0 0 7M7 10.5h6M7 13.5h6"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  check:'<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16.2 9"/>',
  sync:'<path d="M20 8a8.5 8.5 0 0 0-15.4-1.6M4 4v3.5h3.5M4 16a8.5 8.5 0 0 0 15.4 1.6M20 20v-3.5h-3.5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  receipt:'<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  zoom:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  expand:'<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'
};
const XP_SVG = (p, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||1.8}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const XP_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

const XP = {
  pr: {
    kicker: "Procurement · Source-to-Pay",
    shots: {
      dashboard:  {t:"Tableau de bord acheteur", d:"Indicateurs clés et graphiques personnalisables"},
      catalogue:  {t:"Catalogue d'achat", d:"Une expérience proche d'un site marchand"},
      comparaison:{t:"Comparaison d'articles", d:"Choisir la meilleure offre en un coup d'œil"},
      score:      {t:"Score fournisseur", d:"Évaluation par catégories et sous-catégories"},
      ges:        {t:"Émissions de gaz à effet de serre", d:"L'impact carbone des achats, visible"},
      validation: {t:"Circuit de validation", d:"Le bon valideur, automatiquement"},
      commande:   {t:"Bon de commande", d:"Créé et envoyé dès l'approbation"},
      mobile:     {t:"Application mobile", d:"Consulter et approuver en déplacement"},
      reception:  {t:"Réception des biens et services", d:"Partielle ou totale, ligne à ligne"},
      portail:    {t:"Portail fournisseurs", d:"Commandes, confirmations et échanges 24 h/24"},
      erp:        {t:"Intégration ERP", d:"Une application, de multiples ERP"},
      "tableau-de-bord-complet": {t:"Tableau de bord acheteur, écran complet", d:"Actions en attente, indicateurs, dépenses, processus, fournisseurs", tall:true},
      "demande-devis": {t:"Demande d'achat créée depuis un devis PDF", d:"Le devis à droite, les lignes générées à gauche", tall:true}
    },
    videos: [
      {
        main: true,
        tag: "Vue d'ensemble",
        t: "Le module Achats de A à Z",
        nm: "la présentation globale du module Achats",
        dur: "≈ 7 min",
        len: 440,
        img: "dashboard",
        d: "Tableaux de bord, demande d'achat sous tous ses formats, Synergy, approbation, commande automatique et portail fournisseur.",
        // Synchronisation exacte issue de la transcription réelle Word
        ch: [
          [0, "Introduction"],
          [28, "Portail demandeur"],
          [56, "Formats de demande & impact carbone"],
          [107, "Devis PDF analysé en 30 s"],
          [153, "Catalogue Punch-out Amazon"],
          [180, "Scoring & évaluation fournisseurs"],
          [203, "Gains de saisie (÷3 à 5)"],
          [229, "Commande Synergy IA"],
          [285, "Circuit d'approbation & délégation"],
          [329, "Validation & commande automatique"],
          [380, "Portail fournisseur & réception"]
        ]
      },
      {
        tag: "Cas d'usage",
        t: "Une commande, plusieurs sites de livraison",
        nm: "la démo « Commande multi-sites »",
        dur: "≈ 4 min",
        len: 235,
        img: "commande",
        u: F_DEMO_O2C + "E-Proc%20(Commande%20Multi-sites)%20(c).mp4",
        d: "Ventiler un même article sur plusieurs adresses, approuver à la voix et envoyer une commande unique au fournisseur.",
        ch: [
          [0, "Le besoin multi-sites"],
          [47, "Ventilation par site"],
          [93, "Approbation vocale Synergy"],
          [141, "Commande unique générée"],
          [190, "Réception côté fournisseur"]
        ]
      },
      {
        tag: "Cas d'usage",
        t: "Commandes récurrentes, zéro saisie",
        nm: "la démo « Commandes récurrentes »",
        dur: "≈ 4 min 30",
        len: 275,
        img: "reception",
        u: F_DEMO_O2C + "E-Proc%20(Gestion%20des%20Commandes%20r%C3%A9currentes)%20(c).mp4",
        d: "Synergy crée douze échéances en une phrase, la réception se fait toute seule et les factures non parvenues restent justes.",
        ch: [
          [0, "Deux approches de récurrence"],
          [82, "12 échéances par Synergy"],
          [158, "Réception automatique mensuelle"],
          [186, "Factures non parvenues fiabilisées"],
          [231, "Association au contrat cadre"]
        ]
      },
      {
        tag: "Cas d'usage",
        t: "Modifier une commande après envoi",
        nm: "la démo « Modifier une commande »",
        dur: "≈ 9 min 30",
        len: 575,
        img: "portail",
        u: F_DEMO_O2C + "E-Proc%20(Modifier%20des%20Commandes)%20(c).mp4",
        d: "Approbation dans Teams, ajustement par le fournisseur sur son portail, garde-fou budgétaire et avenants synchronisés avec l'ERP.",
        ch: [
          [0, "Modes de saisie avancés"],
          [112, "Devis et copier-coller Excel"],
          [197, "Approbation Teams (bientôt)"],
          [274, "Le fournisseur ajuste sur son portail"],
          [374, "Garde-fou budgétaire infranchissable"],
          [432, "Avenants et réceptions partielles"],
          [551, "Particularités du catalogue Punch-out"]
        ]
      }
    ],
    pains: [
      {k:"budget", w:2, ic:"euro", v:"bud", tag:"Budget",
       p:"Le dépassement, on le découvre à la facture.",
       ps:"Chaque service dépense, la finance consolide après coup. Les arbitrages arrivent toujours trop tard.",
       g:"Chaque équipe pilote son budget, <em>avant</em> d'engager.",
       gs:"Consommé, engagé, disponible : visible par service dès la demande d'achat. Les équipes deviennent responsables de leurs dépenses, la direction financière garde la main."},
      {k:"ia", w:2, ic:"spark", v:"ia", tag:"Intelligence artificielle",
       p:"L'IA dans les achats ? Oui. Mais qui contrôle ?",
       ps:"Des outils grand public, des données qui sortent de l'entreprise, des décisions sans trace.",
       g:"L'IA à chaque étape. <em>Vos règles</em> restent la loi.",
       gs:"Synergy lit les devis, crée les demandes, prépare les échéances et guide les valideurs. Droits, seuils et circuits d'approbation s'appliquent toujours, chaque action est tracée."},
      {k:"teams", w:2, ic:"chat", v:"chat", tag:"Utilisateurs occasionnels",
       p:"Pour valider 300 €, il faut un compte, un mot de passe et une formation.",
       ps:"Résultat : les utilisateurs occasionnels contournent l'outil, ou bloquent le circuit.",
       g:"Ils restent dans Teams. <em>Esker vient à eux.</em>",
       gs:"Demander, suivre, approuver depuis Teams (bientôt disponible) ou depuis tout agent IA connecté à Esker via MCP. Même gouvernance, même sécurité, aucune connexion de plus."},
      {k:"devis", w:1, ic:"doc", v:"pdf", tag:"Saisie",
       p:"Recopier un devis à la main, ligne par ligne.",
       ps:"Références, quantités, prix : chaque erreur de frappe se paie plus tard.",
       g:"Déposez le PDF. <em>30 s</em> plus tard, la demande est prête.",
       gs:"L'IA lit le devis et crée chaque ligne."},
      {k:"valid", w:1, ic:"check", v:"ok", tag:"Validation",
       p:"Les validations dorment dans les boîtes mail.",
       ps:"Et le demandeur relance, encore et encore.",
       g:"Un clic, sur mobile, <em>ou à la voix</em>.",
       gs:"Rappels automatiques, délégation en cas d'absence."},
      {k:"four", w:2, ic:"globe", v:"dial", tag:"Fournisseurs",
       p:"« Où en est ma commande ? » Au téléphone, tous les jours.",
       ps:"Confirmations par e-mail, délais flous, modifications perdues dans les échanges.",
       g:"Le fournisseur confirme et ajuste lui-même, <em>24 h/24</em>.",
       gs:"Dans son portail, sans jamais dépasser le montant approuvé. Chaque échange est tracé, vos équipes ne courent plus après personne."},
      {k:"erp", w:2, ic:"sync", v:"sync", tag:"ERP",
       p:"Tout ressaisir dans l'ERP, et espérer que ça colle.",
       ps:"Double saisie, écarts de montants, réceptions oubliées.",
       g:"Commandes, réceptions, avenants : <em>l'ERP suit tout seul</em>.",
       gs:"Synchronisation native avec SAP et de multiples ERP, connectée dès la semaine 3 du projet."}
    ],
    steps: [
      {ic:"kpi", lab:"Pilotage", core:"Décider sur des chiffres", h:"Piloter sur des chiffres, pas sur des intuitions",
       p:"Chaque profil ouvre Esker sur son propre tableau de bord : l'acheteur voit l'activité globale, le demandeur uniquement ce qui le concerne.",
       b:["Vues, indicateurs et graphiques 100 % personnalisables","Conformité et exceptions : achats avec ou sans commande","Visibilité dès le départ sur les dépenses engagées"],
       shot:"dashboard", go:[0,0,"les tableaux de bord"]},
      {ic:"cart", lab:"Demande", core:"Acheter comme en ligne", h:"Acheter aussi simplement que sur un site marchand",
       p:"Catalogue interne, site fournisseur en punch-out, devis PDF, copier-coller depuis Excel ou simple phrase à l'agent Synergy : chacun commande comme il en a l'habitude.",
       b:["Devis PDF transformé en lignes en moins de 30 secondes","Punch-out : le panier du site fournisseur revient dans la demande","Temps de création divisé par 3, voire par 5"],
       shot:"catalogue", go:[0,56,"la création d'une demande"]},
      {ic:"shield", lab:"Validation", core:"Approuver partout", h:"Valider en un clic, où que l'on soit",
       p:"La demande suit automatiquement le bon circuit d'approbation. Le valideur décide depuis un e-mail, son mobile ou en parlant à Synergy.",
       b:["Rappels automatiques et délégation en cas d'absence","Budget visible avant d'engager la dépense","Approbation à la voix ; approbation dans Teams bientôt disponible"],
       shot:"validation", go:[0,285,"l'approbation"]},
      {ic:"doc", lab:"Commande", core:"Zéro ressaisie", h:"De la demande à la commande, sans ressaisie",
       p:"Dès l'approbation, la commande peut être créée et envoyée automatiquement. L'acheteur garde la main pour regrouper, ventiler ou modifier.",
       b:["Une commande unique livrée sur plusieurs sites","Commandes groupées pour obtenir des remises","Avenants numérotés et synchronisés avec l'ERP"],
       shot:"commande", go:[1,141,"la commande multi-sites"]},
      {ic:"phone", lab:"Mobilité", core:"Le bureau en poche", h:"Le bureau dans la poche",
       p:"Consulter une demande, l'approuver ou suivre une commande : tout se fait aussi depuis un smartphone, ou simplement à la voix.",
       b:["Approbation depuis n'importe où","Détail des articles commandés","Notification dès qu'une action est attendue"],
       shot:"mobile", go:[1,93,"l'approbation à la voix"]},
      {ic:"box", lab:"Réception", core:"Préparer le paiement", h:"Réceptionner, c'est déjà préparer le paiement",
       p:"Le demandeur réceptionne lui-même, partiellement ou totalement. Pour les prestations récurrentes, la réception se fait même toute seule à la date prévue.",
       b:["Réceptions partielles et reliquats suivis ligne à ligne","Réception automatique des commandes récurrentes","Factures non parvenues justes à chaque clôture"],
       shot:"reception", go:[2,158,"la réception automatique"]},
      {ic:"globe", lab:"Fournisseurs", core:"Collaborer 24 h/24", h:"Vos fournisseurs travaillent avec vous, 24 h/24",
       p:"Le fournisseur reçoit la commande, la confirme ou propose un ajustement depuis son portail. Chaque échange est tracé.",
       b:["Confirmation, ajustement de quantités ou de dates","Garde-fou : impossible de dépasser le montant approuvé","Chat intégré pour clarifier une commande"],
       shot:"portail", go:[3,274,"le portail fournisseur"]},
      {ic:"layers", lab:"ERP", core:"L'ERP reste maître", h:"Votre ERP reste la référence",
       p:"Commandes, réceptions et avenants remontent dans l'ERP. Esker s'appuie sur plus de 35 ans d'expertise en intégration.",
       b:["Une application qui fonctionne avec de multiples ERP","100 % connecté à SAP MM","Connexion ERP activée dès la semaine 3 du projet"],
       shot:"erp", go:null}
    ],
    personas: [
      {ic:"user", n:"Demandeur", steps:[1,4,5], q:"Obtenir ce dont j'ai besoin, sans formulaire interminable ni relance.",
       g:[["Demande simplifiée","Catalogue, devis ou justificatifs en quelques clics"],["Toujours informé","Notifié par e-mail dès que la demande est approuvée"],["−50 % de temps","Sur le traitement de ses demandes"]]},
      {ic:"check", n:"Valideur", steps:[2,4,0], q:"Approuver vite et bien, même quand ma boîte e-mail déborde.",
       g:[["Approuver de partout","E-mail, mobile ou à la voix"],["Ne rien laisser passer","Rappels réguliers et délégation en cas d'absence"],["Décider sur des faits","Métriques en temps réel"]]},
      {ic:"cart", n:"Acheteur", steps:[3,6,0,1], q:"Les bons produits, commandés au bon prix et livrés à l'heure.",
       g:[["Commandes en un clic","Créées directement depuis les demandes"],["Commandes groupées","Pour négocier des remises"],["Portail et chat","Clarifier une commande sans téléphone"]]},
      {ic:"euro", n:"Trésorier", steps:[0,7], q:"Savoir ce qui va sortir, et quand.",
       g:[["Engagements visibles","Avant même l'arrivée de la facture"],["Paiements maîtrisés","Autorisation et suivi des règlements"],["Opportunités","Repérer les paiements anticipés possibles"]]},
      {ic:"receipt", n:"Comptable fournisseurs", steps:[5,6,7], q:"Des factures qui se rapprochent seules de la commande et de la réception.",
       g:[["Moins d'administratif","Capture intelligente et vérification automatique"],["Statut clair","Chat du portail pour répondre aux fournisseurs"],["Archivage","Retrouver une facture en quelques secondes"]]},
      {ic:"kpi", n:"DAF", steps:[0,2,7], q:"Réduire les coûts, maîtriser le cash et prévenir la fraude.",
       g:[["Dépenses visibles tôt","Dès la demande d'achat"],["Budgets tenus","Contrôle avant engagement"],["Productivité","Taux d'automatisation suivi en continu"]]}
    ],
    screens: [
      {k:"tableau-de-bord-complet", tab:"Tableau de bord acheteur", ar:1.2325, spots:[
        {z:[.004,.112,.987,.232], t:"Tout ce qui attend votre action", d:"Demandes à approuver, confirmations, livraisons attendues : rien ne reste coincé, tout est compté."},
        {z:[.087,.047,.337,.077], t:"Acheter en un clic", d:"Nouvelle demande d'achat ou de devis, directement depuis l'accueil."},
        {z:[.240,.086,.741,.105], t:"Le catalogue, comme un site marchand", d:"On cherche, on compare, on ajoute au panier. Sans formation."},
        {z:[.004,.315,.353,.384], t:"Les chiffres clés des 12 derniers mois", d:"Demandes, commandes, montant commandé : la réalité des achats, sans export Excel."},
        {z:[.004,.389,.561,.525], t:"Où part l'argent", d:"Dépenses par mois, par fournisseur, par catégorie. Le budget se pilote, il ne se subit plus."},
        {z:[.004,.541,.987,.829], t:"Vos processus, chronométrés", d:"Délai d'approbation par valideur, durée du cycle de commande : on voit enfin où ça bloque."},
        {z:[.004,.839,.561,.975], t:"Vos fournisseurs, jugés sur les faits", d:"Délais de livraison et respect des dates, fournisseur par fournisseur."},
        {z:[.936,.003,.999,.018], t:"Synergy Agent, toujours à portée", d:"L'agent IA est accessible depuis chaque écran de l'application."}]},
      {k:"demande-devis", tab:"Demande créée depuis un devis", ar:1.6056, spots:[
        {z:[.553,.016,.999,.270], t:"Le devis PDF, lu par l'IA", d:"Le document du fournisseur reste affiché à côté de la demande, pour tout contrôler d'un regard."},
        {z:[.008,.146,.543,.705], t:"Chaque ligne du devis, créée toute seule", d:"Référence, quantité, prix, fournisseur, date de livraison : rien à recopier."},
        {z:[.005,.051,.273,.107], t:"La demande pré-remplie, le montant calculé", d:"Description, société, montant HT : prêts avant même d'avoir tapé une lettre."},
        {z:[.026,.121,.543,.139], t:"Toutes les façons d'acheter", d:"Catalogue, Amazon ou devis : chacun achète comme il en a l'habitude, dans le même flux."},
        {z:[.005,.819,.543,.866], t:"Le devis reste attaché", d:"Pour le valideur, l'acheteur et l'auditeur. Plus jamais « vous l'avez reçu où, ce devis ? »."},
        {z:[.005,.870,.543,.969], t:"Le circuit de validation, connu d'avance", d:"Demandeur, approbateur, acheteur : chacun sait qui valide après lui."}]}
    ],
    strip: ["dashboard","catalogue","comparaison","score","ges","validation","commande","mobile","reception","portail","erp"],
    road: [["Sem. 1","Démarrage"],["Sem. 3","Connexion ERP activée"],["Sem. 4","Solution standard prête"],["Sem. 5","Atelier de travail"],["Sem. 7","Configuration personnalisée"],["Sem. 12","Tests utilisateurs"],["Sem. 14","Mise en production"]]
  }
};
