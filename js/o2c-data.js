/* =========================================================================
   O2C : CONTENU DES 7 MODULES, DU PROCESSUS ET DES SERVICES FLUXYM
   Source unique : deck « Slide-deck-02C V1.5 » (slides 16 à 36 et 41).
   Règle : aucun chiffre, exemple ou nom propre absent du deck.
   Les noms de clients et de sociétés concurrentes (slides marquées INTERNE)
   ne sont volontairement pas repris sur ce site public.
   ========================================================================= */
window.O2C = {
  mods: {
    crm: {
      acr: "CM", owner: "Credit / AR",
      title: "Crédit client : <em>de la prospection à l'archivage</em>",
      lead: "Une solution tout-en-un pour décider vite, protéger la trésorerie et garder chaque décision de crédit traçable.",
      flow: ["Prospection", "Nouveaux clients", "Surveillance du risque", "Performance", "Archivage"],
      steps: [
        ["Intégration", "Configuration & intégration ERP", "sync", "Raccordement à tout ERP.", ["Fichiers .csv transmis par e-mail, SFTP, Esker Loader ou webservices"]],
        ["Ouverture", "Demande d'ouverture de compte", "doc", "Le client ouvre son compte à partir d'un formulaire en ligne.", ["Modèles personnalisables", "Envoi par e-mail, lien ou site web", "Rappels automatiques", "Signature DocuSign"]],
        ["Approbation", "Approbations crédit", "check", "Les dossiers à faible risque sont approuvés automatiquement.", ["Workflow de validation", "Contrôle des références"]],
        ["Agences", "Intégration API avec des tiers", "globe", "Les scores des agences sont consultés directement dans l'interface.", ["Ellisphere, D&B, Experian, Creditsafe", "Credit Risk Monitor"]],
        ["Risque", "Suivi du risque crédit", "shield", "Une vue 360° du client pour suivre le risque en continu.", ["Alertes limite et score", "Score interne de 0 à 100", "Règles et suggestions (IA)"]],
        ["Échanges", "Collaboration crédit / ventes", "chat", "Crédit et ventes échangent dans l'outil, avec traçabilité.", ["Conversations internes crédit / ventes", "Vérifications de crédit demandées par les commerciaux"]],
        ["Pilotage", "Visibilité & performance", "kpi", "Le pilotage de l'activité crédit au quotidien.", ["Tableau de bord personnalisable", "KPI : délai de création client, niveau d'automatisation", "Rapports"]],
        ["Archivage", "Suivi & archivage", "lock", "Chaque décision reste retrouvable.", ["Demandes conservées un an", "Toutes les décisions de crédit enregistrées et traçables"]]
      ],
      adv: [["Décisions de crédit sécurisées", "Workflows et règles conformes à la politique crédit"], ["Gain de temps", "Faible risque automatisé, équipes concentrées sur les clients les plus risqués"], ["Décisions plus rapides", "Données internes et agences de scoring centralisées dans une seule interface"], ["Trésorerie protégée", "Risque calculé dès la prospection, alertes en temps réel"], ["Ventes et crédit alignés", "Collaboration tracée, accès illimité aux utilisateurs"], ["Auditabilité & amélioration continue", "Historique complet des décisions, KPI de performance"]],
      use: {img: "assets/o2c/cm-recommandations-ia.webp", alt: "Écran Esker Credit Management : recommandations de l'IA Synergy", k: "Cas d'usage · Crédit client", h: "Décider vite sans naviguer dans plusieurs fenêtres", caps: []},
      proc: {stages: [0, 1], cover: "Onboarding + décision / surveillance crédit", sor: "CRM / ERP · ERP / crédit"},
      syn: [["om", "Blocage automatique de la commande selon le risque"], ["com", "Stratégie de relance adaptée au risque"], ["ca", "Libération immédiate de la ligne de crédit"]]
    },
    cim: {
      acr: "CS", owner: "Customer Service / ADV", badge: "ISO 27001",
      title: "Demandes clients : <em>un assistant IA pour la boîte e-mail partagée</em>",
      lead: "Une brique de la suite Order-to-Cash Esker pour le service client B2B : interface unifiée, datalake et agents IA.",
      kpis: [{n: 90, s: " %", l: "précision de classification"}, {t: "4h/j → 4h/sem", l: "temps de redirection"}, {t: "24-48h → immédiat", l: "temps de réponse"}],
      steps: [
        ["Classement", "Classification instantanée", "spark", "Le NLP analyse le contenu des e-mails et catégorise chaque demande.", ["Produit, prix, commande…"]],
        ["Routage", "Redirection automatisée", "sync", "La demande est orientée vers la bonne personne ou la bonne application.", []],
        ["Agent IA", "Agent IA (Agentic AI)", "spark", "Il retrouve les données, propose et génère des réponses.", ["Sentiments, résumé, traduction"]],
        ["Connecteurs", "Intégration outils internes", "layers", "API et connecteurs clé en main SAP & Salesforce.", ["ERP, CRM, PIM, WMS, TMS"]],
        ["Échanges", "Plateforme collaborative", "chat", "Conversations internes (collègues + IA) et externes (clients et tiers).", ["Via modèles GenAI"]],
        ["Temps réel", "Visibilité temps réel", "kpi", "Tâches catégorisées, temps de réponse et de résolution.", ["Tableaux de bord personnalisables"]]
      ],
      adv: [["Meilleure expérience client", "Réponses plus rapides et pertinentes"], ["Réponse accélérée", "Traitement assisté par l'IA de bout en bout"], ["Visibilité gagnée", "KPI et tendances pour piloter la performance"], ["Collaboration renforcée", "Service client, supply chain, commerce, finance"], ["Équipes plus satisfaites", "Moins de tâches répétitives, plus de valeur"]],
      proc: {stages: [2], cover: "Transverse : demandes, statuts et interactions clients", sor: "ERP / CRM"},
      syn: [["om", "Transfert automatique des commandes et questions"], ["id", "Récupération de duplicata de facture"], ["cd", "Qualification d'un e-mail en dossier litige"]]
    },
    om: {
      acr: "OM", owner: "Customer Service / ADV",
      title: "Commandes : <em>de la réception à l'intégration ERP</em>",
      lead: "Automatiser la commande client sur tous les canaux, avec des contrôles ERP et un mode touchless.",
      kpis: [{n: 84.2, s: " %", d: 1, l: "automatisation dès le 1er jour (Synergy)"}, {t: "~14 sem.", l: "de la mise en production"}],
      flow: ["Client", "Moteur d'IA", "Files d'attente", "Validation ADV", "Enregistrement ERP", "Confirmation & archivage"],
      steps: [
        ["Réception", "Réception des commandes", "cart", "Une interface unique pour tous les canaux et tous les formats.", ["EDI, e-mail, portail, e-commerce, mobile", "Tri des e-mails par IA"]],
        ["Extraction", "Extraction des données IA", "spark", "Esker Synergy reconnaît immédiatement les commandes (deep learning).", ["Teaching et auto-apprentissage", "OCR + texte"]],
        ["Contrôle", "Vérification des données", "check", "Contrôle par rapport au référentiel ERP.", ["Détection d'anomalies", "Mode touchless", "Conversations internes et clients"]],
        ["Intégration", "Intégration ERP", "sync", "Connecteurs SAP & Oracle, middleware, API/webservices, EDI, fichiers.", ["Confirmations et préavis d'expédition"]],
        ["Analyse", "Analyse des données", "kpi", "Tableaux de bord 100 % personnalisables.", ["Tendances d'automatisation", "Vues par profil", "Mobile Esker Anywhere"]],
        ["Spécifiques", "Commandes spécifiques", "layers", "Les cas particuliers sont pris en charge.", ["Commandes référençant un devis (SAP)", "Découpage automatique en plusieurs commandes ERP"]]
      ],
      adv: [["Saisie automatisée", "L'IA capture les données dès la 1re commande"], ["Visibilité sur l'EDI", "L'EDI passe d'un niveau technique à opérationnel"], ["Traitement touchless", "Commandes conformes traitées sans intervention"], ["Moins d'erreurs", "Contrôles ERP et détection d'anomalies intégrés"], ["Collaboration fluide", "Conversations internes et clients sur la commande"], ["Expérience client B2C", "Confirmations et suivi lisibles, portail et mobile"]],
      proc: {stages: [2, 3], cover: "Commande forte ; exécution / livraison = visibilité partielle", sor: "ERP / CRM · ERP + WMS/TMS"},
      syn: [["crm", "Actualisation de l'encours engagé"], ["cim", "Suivi de commande, ASN et tracking"], ["id", "Portail unifié commande, expédition et facture"]]
    },
    id: {
      acr: "ID", owner: "Billing / Treasury",
      title: "Factures clients : <em>diffusées et archivées, en conformité, via tout média</em>",
      lead: "Diffuser et archiver les factures, en conformité, sur tous les canaux attendus par vos clients.",
      kpis: [{t: "2h37 → 5 min", l: "traitement d'un lot de 500"}, {n: 60, s: "+ pays", l: "conformité e-invoicing"}],
      flow: ["ERP", "Traitement IA", "Diffusion tout média", "Portail & paiement", "Archivage conforme"],
      steps: [
        ["Intégration", "Intégration ERP", "sync", "Tous ERP, multi-ERP.", ["Formats PDF/XML/IDOC", "Esker Loader, transmission sécurisée"]],
        ["Traitement", "Traitement des factures", "spark", "L'IA découpe, extrait (en-tête et lignes) et route.", ["Mise en forme multi-formats"]],
        ["Diffusion", "Diffusion tout média", "receipt", "Courrier, e-mail, portail, EDI.", ["Visibilité temps réel", "Validation et documents associés"]],
        ["Conformité", "E-invoicing & conformité", "shield", "60+ pays couverts via un réseau de partenaires ; EDI.", ["France : plateforme agréée immatriculée"]],
        ["Portail", "Portail web & paiement", "user", "Collaboration avec le client 24/7.", ["Contestation, 8 langues", "Paiement en ligne (carte, prélèvement)"]],
        ["Archivage", "Archivage", "lock", "En ligne 24/7, conforme UE (data centers en France).", ["Infrastructure sécurisée redondante"]]
      ],
      adv: [["Diffusion en un temps record", "Facture papier : 5 min au lieu de 2h37"], ["Économies dès le 1er jour", "7 centres courrier, 10 M de docs/mois"], ["Conformité internationale", "60+ pays, piste d'audit fiable"], ["Visibilité totale", "Statut de diffusion et de paiement suivis"], ["Transition au rythme du client", "Papier et électronique gérés en parallèle"]],
      use: {img: "assets/o2c/id-journal-factures.webp", alt: "Écran Esker Invoice Delivery : journal des factures et statuts de transmission", k: "Cas d'usage · Facturation", h: "La bonne facture, au bon format, automatiquement", caps: ["Facture émise depuis l'ERP", "Facture reçue sans litige de forme", "Format et canal attendus par le client, conformité e-invoicing"]},
      proc: {stages: [4, 5], cover: "Création de facture généralement dans l'ERP / Billing ; diffusion & conformité Esker", sor: "ERP / Billing · PA / e-invoicing + ERP"},
      syn: [["com", "Alimentation des créances et PDF certifiés"], ["ca", "Référentiel des factures ouvertes pour le lettrage"], ["cim", "Preuve de remise et consultation"]]
    },
    ca: {
      acr: "CA", owner: "Billing / Treasury",
      title: "Encaissements : <em>des paiements rapprochés automatiquement</em>",
      lead: "Rapprocher les paiements automatiquement, avec une extraction alimentée par l'IA.",
      kpis: [{n: 93, s: " %", l: "traitement automatique des avis"}, {n: 50, s: " %", l: "capacité réaffectable"}, {n: 73, s: " %", p: "jusqu'à ", l: "de réconciliation plus rapide (Hackett Group)"}],
      flow: ["Sources bancaires & lockbox", "Extraction IA", "Rapprochement", "Exceptions", "Réconciliation ERP"],
      steps: [
        ["Extraction", "Extraction IA (Synergy)", "spark", "Quatre niveaux d'extraction.", ["Reconnaissance immédiate (deep learning + NLP)", "Auto-apprentissage", "Teaching", "OCR"]],
        ["Lettrage", "Rapprochement automatique", "check", "Les paiements sont rapprochés aux postes non soldés.", ["Possible même sans avis de paiement"]],
        ["Options", "Options configurables", "layers", "Les règles de gestion se paramètrent.", ["Devises, sous/surpaiement", "Escompte, retenue à la source", "Paiement à solde nul"]],
        ["Exceptions", "Gestion des exceptions", "chat", "Des suggestions intelligentes pour chaque écart.", ["Conversations internes et externes sur chaque écart"]],
        ["Intégration", "Intégration ERP", "sync", "Rapprochement en temps réel dans SAP (BAPI).", ["Ou fichier de réconciliation pour tout ERP"]],
        ["Suivi", "Suivi & audit", "kpi", "Tableaux de bord personnalisables.", ["Taux d'automatisation", "Cash non alloué", "Rapports"]]
      ],
      adv: [["Réconciliation accélérée", "Jusqu'à 73 % plus rapide (Hackett Group)"], ["Revenus sécurisés", "Comptes clients plus précis, moins de relances inutiles"], ["Visibilité sur le cash", "Rentrées de fonds suivies en temps réel"], ["Équipes soulagées", "Moins de saisie, fin de mois moins stressante"], ["Audits facilités", "Traçabilité complète des paiements alloués"]],
      use: {img: "assets/o2c/ca-rapprochement-avis.webp", alt: "Écran Esker Cash Application : rapprochement d'un paiement avec l'avis de paiement", k: "Cas d'usage · Lettrage", h: "Rapprocher les paiements sans ressaisie", caps: ["Paiement unique de plusieurs dizaines de factures", "Gain de temps considérable, plus aucune erreur", "Rapprochement automatique avec les factures ouvertes"]},
      proc: {stages: [8], cover: "Rapprochement, affectation, exceptions", sor: "Banque + ERP AR"},
      syn: [["id", "Statut de paiement actualisé sur le portail"], ["cd", "Création automatique d'une déduction"], ["com", "Arrêt des relances et promesses"]]
    },
    cd: {
      acr: "CD", owner: "Billing / Treasury · Supply Chain / Ops",
      title: "Litiges clients : <em>de la réception à la résolution</em>",
      lead: "Automatiser la gestion des déductions et des réclamations, avec décisions et pièces rattachées au dossier.",
      flow: ["Client (sous-paiement)", "Rapprochement IA du justificatif", "Workflow", "Validation", "ERP & archivage"],
      steps: [
        ["IA", "Reconnaissance IA (Synergy)", "spark", "First Time Recognition, auto-apprentissage, teaching, OCR.", ["E-mails et Excel/CSV"]],
        ["Workflow", "Workflow d'approbation", "check", "Configurable et flexible.", ["Multi-niveaux par montant", "Touchless possible à chaque étape"]],
        ["Types", "Tous types de réclamations", "box", "Trade et non-trade.", ["Réclamations multi-types éclatées en workflows enfants"]],
        ["Échanges", "Collaboration", "chat", "Conversations internes et clients.", ["Modèles", "Pièces jointes rattachées à la réclamation"]],
        ["ERP / TPM", "Intégration ERP / TPM", "sync", "Connectivity Suite.", ["Notes de crédit, ajustements", "Provisions de promotion", "RPA portails"]],
        ["Analyse", "Dashboard & analytics", "kpi", "Pilotage de l'activité.", ["Days Deductions Outstanding", "Analyse par type, date, client", "Piste d'audit"]]
      ],
      adv: [["Résolution accélérée", "Déductions traitées et rapprochées plus vite"], ["Déductions maîtrisées", "Provisions suivies, alerte si dépassement"], ["Collaboration fluide", "Analyste, ventes, supply chain et client alignés"], ["Visibilité & conformité", "Suivi centralisé et traçabilité complète"], ["Moins de manuel", "IA et RPA sur les documents et les portails"]],
      use: {img: "assets/o2c/cd-deduction-rapprochement.webp", alt: "Écran Esker : déduction identifiée lors du rapprochement d'un paiement", k: "Cas d'usage · Litiges et réclamations", h: "Sortir les litiges des boîtes mail", caps: ["Réclamation qualifiée", "Décision et geste commercial tracés", "Circuit de validation interne, avec historique complet"]},
      proc: {stages: [3, 8], cover: "Claims Management · Deductions Management", sor: "ERP / WMS / TMS (claims) · Banque + ERP AR (déductions)"},
      syn: [["com", "Gel des relances sur litiges"], ["ca", "Visibilité du litige et apurement par avoir"], ["cim", "Suivi de résolution"]]
    },
    com: {
      acr: "CL", owner: "Credit / AR",
      title: "Recouvrement : <em>encaisser plus, réduire le DSO</em>",
      lead: "Maximiser l'encaissement et réduire le DSO grâce à l'IA, sans abîmer la relation client.",
      flow: ["Import AR", "Collecte & relances", "Collaboration", "Risque crédit", "Monitoring", "Portail client"],
      steps: [
        ["IA", "Recouvrement piloté par l'IA", "spark", "Stratégie, segmentation, prédictions de paiement.", ["Niveaux de risque", "Appels priorisés"]],
        ["Relances", "Méthodes de relance", "phone", "États de compte, relances multi-niveaux, lettres, appels.", ["Messages en masse & modèles"]],
        ["Échanges", "Collaboration", "chat", "Messagerie NLP, tâches, gestion des litiges.", ["Sync Salesforce", "Accès illimité"]],
        ["Pilotage", "Dashboard & monitoring", "kpi", "CEI & DSO, AR aging.", ["Prévision de recouvrement", "Rapports personnalisés"]],
        ["Risque", "Risque crédit", "shield", "Limites, performance de paiement, plans de paiement.", ["Option Credit Management"]],
        ["Portail", "Portail & global", "globe", "Portail client / paiement.", ["Multi-sites, 16 langues", "Multi-devises, archivage"]]
      ],
      adv: [["DSO réduit", "Recouvrement priorisé et sécurisé du revenu"], ["Effort ciblé", "L'IA oriente vers les appels prioritaires"], ["Visibilité sur l'encaissement", "Prévision du cash à 30/60/90/120 jours"], ["Cash culture partagée", "AR, ventes et finance collaborent"], ["Relation client préservée", "Le bon message, au bon moment, au bon client"]],
      proc: {stages: [6], cover: "Priorisation, scénarios, promesses, actions", sor: "ERP AR"},
      syn: [["crm", "Révision du crédit selon le comportement payeur"], ["ca", "Lettrage guidé par les promesses"], ["id", "Relance avec lien de paiement"], ["cd", "Déclaration de litige pendant un appel"]]
    }
  },

  names: {crm: "Crédit", cim: "Demandes clients", om: "Commandes", id: "Factures clients", ca: "Encaissements", cd: "Litiges", com: "Recouvrement"},

  /* Slide 18 : processus métier, couverture Esker, systèmes de référence */
  stages: [
    {n: "0", t: "Data / onboarding", mods: ["crm"], sor: "CRM / ERP", note: "Onboarding et décision de crédit."},
    {n: "1", t: "Crédit & risque", mods: ["crm"], sor: "ERP / crédit", note: "Décision et surveillance du risque crédit."},
    {n: "2", t: "Demande / commande", mods: ["om", "cim"], sor: "ERP / CRM", note: "Commande forte ; les demandes clients sont transverses."},
    {n: "3", t: "Exécution / livraison", mods: ["om", "cd"], sor: "ERP + WMS/TMS", note: "Visibilité partielle : Esker ne remplace pas les systèmes logistiques."},
    {n: "4", t: "Facturation", mods: ["id"], sor: "ERP / Billing", note: "La création de la facture reste généralement dans l'ERP / Billing."},
    {n: "5", t: "Transmission / réception facture", mods: ["id"], sor: "PA / e-invoicing + ERP", note: "Diffusion et conformité assurées par Esker."},
    {n: "6", t: "Créance / recouvrement", mods: ["com"], sor: "ERP AR", note: "Priorisation, scénarios, promesses, actions."},
    {n: "7", t: "Paiement", mods: [], sor: "Banque / PSP", note: "Paiement bancaire / PSP : hors cœur Esker."},
    {n: "8", t: "Cash application / lettrage", mods: ["ca", "cd"], sor: "Banque + ERP AR", note: "Rapprochement, affectation, exceptions et déductions."}
  ],
  reading: "Esker orchestre et automatise une large partie de l'O2C, mais ne remplace pas les systèmes qui exécutent la logistique, calculent la facture ou réalisent le paiement bancaire.",
  principles: [
    {t: "Process-first", d: "Ne pas faire du catalogue Esker le modèle du processus."},
    {t: "System-of-record clair", d: "Définir qui détient la donnée et qui exécute l'événement."},
    {t: "Exceptions", d: "Claims et deductions doivent avoir owner, reason code et SLA."},
    {t: "Mesure commune", d: "Le DSO seul ne suffit pas : STP, FTR, litiges, unapplied cash…"}
  ],

  /* Slides 16, 17 et 20 à 23 : services autour de la suite */
  phases: {eval: "Évaluer", dep: "Déployer", sec: "Sécuriser"},
  phase_items: {
    eval: ["Diagnostic et cadrage", "Qualification des référentiels", "Nettoyage de données"],
    dep: ["Gestion de projet", "Conception et design", "Intégration SI", "Déploiement"],
    sec: ["Formation", "Accompagnement au changement", "Support et TMA"]
  },
  services: [
    {lab: "Référentiels", core: "Qualification des référentiels", ph: "eval", ic: "layers", t: "Qualification des référentiels | Data Cleansing", head: "Qualifier le point de départ",
      v: "Dimensionner la remise en qualité des référentiels et éviter de reproduire les défauts dans la cible.",
      w: "Des référentiels clients, articles, entités ou conditions de paiement dispersés alimentent les rejets, les traitements manuels et des analyses contradictoires.",
      l: ["Cartographie des référentiels et des ERP", "Scorecard de qualité (complétude, unicité, cohérence, fraîcheur, traçabilité)", "Dictionnaire des champs critiques", "Backlog de remédiation priorisé", "Rôles de gouvernance des données"]},
    {lab: "Cadrage", core: "Cadrage, diagnostic, ateliers", ph: "eval", ic: "zoom", t: "Cadrage | Diagnostic | Ateliers", head: "Objectiver l'existant",
      v: "Un diagnostic opposable, concentré sur les causes qui pèsent réellement sur le cash.",
      w: "Commerce, service client, finance et SI vivent le même processus sous des angles différents. Le diagnostic construit une base factuelle commune.",
      l: ["Chaîne faits → écarts → causes → priorités", "Baseline KPI documentée avec définition, source, périmètre et propriétaire", "Irritants hiérarchisés par impact, effort et risque"]},
    {lab: "Déploiement", core: "Conception, intégration & déploiement", ph: "dep", ic: "sync", t: "Conception, intégration & déploiement", head: "De la conception à la mise en œuvre",
      v: "Aligner les métiers, finance et SI sur une trajectoire finançable, séquencée et gouvernable. Conserver le contrôle du rythme, de la qualité de service et des écarts au modèle cible.",
      w: "Le diagnostic ne crée de valeur que s'il débouche sur des choix explicites : ambition, périmètre, architecture, séquencement, coûts, risques et gouvernance. Le déploiement par pilote ou par vagues maîtrise les dépendances et réinjecte les enseignements dans les vagues suivantes.",
      l: ["TO-BE et règles de gestion, options d'architecture et d'interfaces, rôles et RACI", "Business case scénarisé, roadmap, lots et dépendances", "Conception détaillée, paramétrage et interfaces, reprise de données, recette", "Charte et critères de succès du pilote, bilan KPI et décision documentée de passage à l'échelle", "Kit de déploiement, critères de readiness par vague, plan de support"]},
    {lab: "Adoption", core: "Formations, changements & amélioration continue", ph: "sec", ic: "user", t: "Formations, Changements & amélioration continue", head: "Asseoir le projet par la formation et l'accompagnement",
      v: "Rendre les équipes autonomes et tenir la performance au-delà de la mise en production.",
      w: "Le go-live marque le début de l'usage réel. Sans compétences, gouvernance et mesure, les contournements dégradent progressivement la performance. L'accompagnement au changement est nécessaire pour optimiser la chaîne de processus et l'adoption.",
      l: ["Parcours de formation par rôle", "Cockpit adoption, qualité, performance et gouvernance", "Revue des exceptions et des causes racines", "Backlog d'amélioration et suivi des gains"]},
    {lab: "TMA", core: "TMA : maintenance applicative", ph: "sec", ic: "shield", t: "TMA | Maintenance applicative", head: "Renforcer la phase post-hypercare",
      v: "Sécuriser la continuité de service et les évolutions post go-live.",
      w: "Support applicatif, suivi des tickets, corrections de paramétrage et d'interfaces, assistance utilisateurs, évolutions, pilotage TMA et engagements de service.",
      l: ["130+ projets, 100+ clients, hotline et TMA"]}
  ],
  convictions: [
    {t: "Cadrer avant d'outiller", d: "Comprendre votre stratégie et votre organisation, vos processus et vos données."},
    {t: "Mesurer avant de promettre", d: "Tracer les définitions, les sources et les hypothèses de gains."},
    {t: "Tester avant de déployer", d: "Mettre en place un dispositif de pilotage et d'apprentissage des décisions."},
    {t: "Transférer les bonnes pratiques", d: "Installer les compétences, la gouvernance et les améliorations internes adéquates."}
  ],
  value: "Relier les métiers, les données, le SI, le projet et l'adoption jusqu'à une décision documentée.",

  /* Slide 41 : acteurs (sans noms de sociétés) */
  market_stats: [
    {n: 700, s: " Md€", l: "de crédit interentreprises en France (environ)"},
    {n: 60, s: " Md€", p: "près de ", l: "de créances impayées par an"},
    {n: 25, s: " %", l: "des défaillances liées à des retards ou défauts de paiement"}
  ],
  market_src: "Xerfi, « Les services de gestion du compte clients » (réf. 25SAE56, oct. 2025).",
  actors: [
    {t: "Cabinets d'audit et de conseil", a: "Cadrage BFR, transformation finance, accès à la direction générale", d: "Ils cadrent, ils n'intègrent pas la solution"},
    {t: "Conseil en transformation finance", a: "Diagnostic, organisation cible, conduite du changement", d: "Maîtrise limitée des solutions O2C du marché"},
    {t: "ESN et intégrateurs généralistes", a: "Capacité de delivery et intégration ERP à grande échelle", d: "L'O2C est une ligne parmi d'autres, pas une spécialité"},
    {t: "Services externalisés du poste client", a: "Externaliser le risque et le recouvrement plutôt qu'automatiser le processus", d: "Ils portent le risque, ils ne corrigent pas le processus"},
    {t: "Spécialistes du credit management", a: "Expertise métier sur la relance, les litiges et le risque client", d: "Peu ou pas de capacité d'intégration SI"},
    {t: "Services professionnels des éditeurs", a: "Connaissance maximale de leur propre produit", d: "Aucune indépendance sur le choix de la solution"}
  ],
  place: "L'expertise métier O2C et la maîtrise de la solution dans la même équipe, avec une indépendance sur le processus cible.",
  nota: "Aucun de ces acteurs n'est concurrent sur tout le périmètre : la concurrence se joue brique par brique."
};
