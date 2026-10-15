/* =========================================================================
   FICHES DÉTAILLÉES & CONTENU MÉTIER DES 7 MODULES ORDER-TO-CASH (O2C)
   Données extraites des présentations stratégiques Fluxym & Esker
   ========================================================================= */

const O2C_DETAILS = {
  crm: {
    kicker: "Credit Management · Order-to-Cash",
    tagline: "Sécuriser le chiffre d'affaires dès l'entrée en relation et maîtriser le risque d'impayé en continu.",
    metrics: [
      { num: "100 %", label: "Dossiers à faible risque validés sans intervention" },
      { num: "0", label: "Aller-retour ou double saisie entre CRM et ERP" },
      { num: "360°", label: "Visibilité temps réel sur l'exposition de crédit" }
    ],
    briques: [
      { t: "Formulaire d'ouverture en ligne", d: "Modèles d'onboarding personnalisables, envoi par e-mail ou lien portail, rappels automatiques et signature DocuSign." },
      { t: "Scoring externe via API", d: "Interconnexion native avec Ellisphere, Dun & Bradstreet, Creditsafe, Experian pour rapatrier bilans et notations sans quitter l'outil." },
      { t: "Score interne sur mesure (0-100)", d: "Formule d'évaluation personnalisée combinant les ratios financiers d'agences et l'historique payeur réel constaté dans vos comptes." },
      { t: "Workflows d'approbation crédit", d: "Validation instantanée selon les matrices de délégation et escalade automatique vers la direction financière pour les encours majeurs." },
      { t: "Surveillance continue du risque", d: "Alertes immédiates en cas d'incident de paiement, de dégradation de score ou de dépassement de limite autorisée." },
      { t: "Collaboration Ventes & Crédit", d: "Conversations internes intégrées sur la fiche client pour arbitrer rapidement le déblocage des commandes stratégiques." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "Décider vite sans naviguer dans plusieurs fenêtres",
      desc: "L'analyste crédit consulte sur un tableau de bord unique l'encours engagé dans l'ERP, les factures ouvertes, les commandes bloquées et les scores externes consolidés pour prendre une décision motivée en quelques secondes.",
      img: "assets/usecases/credit-decision.webp"
    },
    process: {
      step: "0. Data / Onboarding & 1. Crédit et Risque",
      role: "Fixation des plafonds de crédit, onboarding client conforme et arbitrage des blocages",
      system: "CRM Commercial (Salesforce, HubSpot) / ERP Finance (SAP, Oracle)",
      synergy: "Alimente le module Commandes (OM) pour bloquer les expéditions à risque et le Recouvrement (Collections) pour adapter les scénarios de relance."
    }
  },

  cim: {
    kicker: "Customer Inquiry Management · Order-to-Cash",
    tagline: "Un assistant d'IA générative pour la boîte e-mail partagée du service client B2B et de l'ADV.",
    metrics: [
      { num: "90 %", label: "Précision de classification automatique par IA (NLP)" },
      { num: "4h → 4h", label: "Temps de tri réduit de 4h par jour à 4h par semaine" },
      { num: "Immédiat", label: "Délai de réponse réduit de 24-48h à un traitement direct" }
    ],
    briques: [
      { t: "Classification NLP instantanée", d: "L'intelligence artificielle analyse le contenu sémantique des e-mails entrants et catégorise chaque demande (prix, délai, duplicata, litige)." },
      { t: "Redirection automatisée", d: "Orientation directe du message vers le gestionnaire ADV compétent ou l'application métier concernée sans intervention manuelle." },
      { t: "Agentic AI (Génération de réponses)", d: "Génération de propositions de réponses contextualisées avec analyse de sentiment, résumé de fil de discussion et traduction automatique." },
      { t: "Intégration écosystème SI", d: "Connecteurs prépackagés avec les ERP (SAP, Oracle) et CRM (Salesforce) pour récupérer instantanément les statuts de commande et de livraison." },
      { t: "Plateforme collaborative", d: "Conversations internes partagées entre service client, logistique, commerce et comptabilité pour résoudre les cas complexes." },
      { t: "Tableaux de bord de réactivité", d: "Pilotage en temps réel du volume de sollicitations, du temps de première réponse et du délai moyen de résolution par canal." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "Automatiser le traitement des demandes répétitives",
      desc: "Lorsqu'un client demande un duplicata de facture ou un état d'avancement de commande, Synergy extrait les pièces de l'ERP et prépare la réponse e-mail prête à envoyer, libérant l'ADV des tâches chronophages.",
      img: "assets/usecases/litiges-reclamations.webp"
    },
    process: {
      step: "2. Demande & Interactions Clients (Transverse)",
      role: "Prise en charge omnicanale, qualification des intentions et coordination des réponses",
      system: "Messagerie partagée / CRM / ERP Commercial / WMS Logistique",
      synergy: "Transfère les commandes vers Order Management (OM) et aiguille les contestations de facturation vers Claims & Deductions (CD)."
    }
  },

  om: {
    kicker: "Order Management · Order-to-Cash",
    tagline: "Automatiser la saisie et l'intégration des commandes clients, de la réception à l'ERP.",
    metrics: [
      { num: "84,2 %", label: "Taux d'automatisation des commandes dès le premier jour" },
      { num: "~14 sem.", label: "Délai moyen de mise en production opérationnelle" },
      { num: "100 %", label: "Visibilité opérationnelle sur les flux de commandes et EDI" }
    ],
    briques: [
      { t: "Réception omnicanale unifiée", d: "Guichet unique traitant tous les canaux d'entrée : e-mails avec pièces jointes PDF, flux EDI, commandes portail web ou mobiles." },
      { t: "Extraction Synergy Deep Learning", d: "Reconnaissance intelligente des en-têtes et lignes d'articles dès le premier document, avec auto-apprentissage continu." },
      { t: "Contrôle de conformité ERP", d: "Vérification automatique des références articles, des prix négociés, des remises et des adresses de livraison par rapport à l'ERP." },
      { t: "Traitement Touchless direct", d: "Les commandes strictement conformes sont injectées immédiatement dans l'ERP sans aucune intervention humaine." },
      { t: "Gestion des commandes complexes", d: "Rapprochement avec les devis (SAP), découpage automatique des commandes multi-sites ou ventilation sur plusieurs entrepôts." },
      { t: "Confirmations et visibilité client", d: "Génération automatique d'accusés de réception détaillés et partage du statut de préparation sur le portail client." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "Intégration d'une commande complexe sans ressaisie",
      desc: "Une commande PDF reçue par e-mail contenant plusieurs dizaines de lignes est lue par l'IA, réconciliée avec le contrat ERP, vérifiée sur les stocks disponibles et injectée en quelques secondes dans l'ERP.",
      img: "assets/usecases/credit-decision.webp"
    },
    process: {
      step: "2. Commande & 3. Exécution / Expédition",
      role: "Vérification des engagements contractuels, saisie ERP et déclenchement de la livraison",
      system: "ERP Commercial / WMS Entrepôt / Plateforme EDI",
      synergy: "Interroge Credit Management (CM) pour vérifier l'encours et alimente Invoice Delivery (ID) pour la facturation à l'expédition."
    }
  },

  id: {
    kicker: "Invoice Delivery & Compliance · Order-to-Cash",
    tagline: "Diffuser et archiver 100 % des factures clients, en conformité fiscale et sur tous les canaux.",
    metrics: [
      { num: "5 min", label: "Au lieu de 2h37 pour le traitement d'un lot de 500 factures" },
      { num: "60+", label: "Pays couverts pour la conformité e-invoicing internationale" },
      { num: "10 ans", label: "Archivage électronique à valeur probante en France" }
    ],
    briques: [
      { t: "Intégration multi-ERP universelle", d: "Récupération des flux de facturation depuis tout ERP ou système de facturation (PDF, XML, IDoc, EDI) via connecteurs sécurisés." },
      { t: "Génération du lisible et découpage", d: "Mise en page graphique automatique des factures à partir des données brutes ERP et découpage intelligent des flux en lots." },
      { t: "Diffusion omnicanale intelligente", d: "Routage selon les préférences de chaque client : Plateforme Agréée (PA), Peppol, Chorus Pro, e-mail sécurisé, portail ou courrier papier." },
      { t: "Conformité e-invoicing mondiale", d: "Respect des mandats fiscaux dans plus de 60 pays et immatriculation officielle en tant que Plateforme Agréée (PDP) en France." },
      { t: "Portail client 24/7 & Paiement", d: "Espace self-service permettant aux clients de consulter leurs factures, déclarer une contestation et payer en ligne (CB, prélèvement)." },
      { t: "Archivage à valeur probante", d: "Conservation légale pendant 10 ans sur infrastructure certifiée ISO 27001 et hébergée en data centers en France." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "La bonne facture, au bon format, automatiquement",
      desc: "Dès l'émission de la facture par l'ERP, Esker identifie le canal attendu par le client (Chorus Pro pour le secteur public, Factur-X via PA pour les entreprises, portail ou courrier) et garantit la conformité légale de bout en bout.",
      img: "assets/usecases/facturation-format.webp"
    },
    process: {
      step: "4. Facturation & 5. Transmission / Réception Facture",
      role: "Mise en conformité fiscale, distribution omnicanale et traçabilité de la remise",
      system: "ERP Facturation / Billing / Plateforme Agréée (PA / PDP) / Réseau Peppol",
      synergy: "Met à disposition les factures certifiées pour le Recouvrement (Collections) et alimente le référentiel des créances pour Cash Application (CA)."
    }
  },

  ca: {
    kicker: "Cash Application · Order-to-Cash",
    tagline: "Rapprocher et lettrer automatiquement les règlements avec les factures ouvertes grâce à l'IA.",
    metrics: [
      { num: "73 %", label: "Accélération du délai de rapprochement bancaire (Hackett Group)" },
      { num: "93 %", label: "Taux de traitement automatique des avis de paiement" },
      { num: "50 %", label: "Temps d'équipe réalloué à des analyses financières à valeur ajoutée" }
    ],
    briques: [
      { t: "Capture IA multi-sources", d: "Extraction automatique des données depuis les relevés bancaires, les avis de paiement (remittance advices) reçus par e-mail et les chèques." },
      { t: "Rapprochement automatique avancé", d: "Algorithmes intelligents capables de réconcilier un paiement unique couvrant des dizaines de factures, même sans avis formel." },
      { t: "Gestion des sous/sur-paiements", d: "Paramétrage fin des règles de tolérance : escomptes déduits, retenues à la source, écarts de change et règlements partiels." },
      { t: "Résolution assistée des exceptions", d: "Suggestions intelligentes proposées au comptable pour les cas ambigus et outils de collaboration interne avec les commerciaux." },
      { t: "Intégration comptable temps réel", d: "Lettrage direct dans SAP via BAPI en temps réel ou génération de fichiers de réconciliation prêts pour tout ERP." },
      { t: "Tableaux de bord de trésorerie", d: "Suivi en direct du taux de lettrage automatique, du montant de cash non alloué (unapplied cash) et des délais de traitement." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "Rapprocher les paiements complexes sans ressaisie",
      desc: "Un virement bancaire global de 145 000 € réglant 38 factures avec des déductions commerciales est rapproché automatiquement de l'avis de paiement reçu par e-mail, lettré dans l'ERP en quelques secondes sans aucune ressaisie manuelle.",
      img: "assets/usecases/lettrage-automatique.webp"
    },
    process: {
      step: "7. Paiement & 8. Cash Application / Lettrage",
      role: "Réconciliation bancaire, lettrage comptable des postes ouverts et détection des écarts",
      system: "Banque (Relevés MT940, CAMT.053) / PSP / ERP Comptabilité Clients (AR)",
      synergy: "Actualise immédiatement l'encours dans Credit Management (CM) et arrête les relances dans Collections Management (COM)."
    }
  },

  cd: {
    kicker: "Claims & Deductions · Order-to-Cash",
    tagline: "Automatiser la gestion des litiges et des déductions, de la détection à la résolution.",
    metrics: [
      { num: "-40 %", label: "Réduction du délai moyen de résolution des litiges (DDO)" },
      { num: "100 %", label: "Déductions justifiées et rattachées à leur pièce d'origine" },
      { num: "0", label: "Avoir émis sans validation commerciale et financière tracée" }
    ],
    briques: [
      { t: "Capture automatique des réclamations", d: "Extraction des motifs de déduction et pièces justificatives depuis les avis de paiement, e-mails ou portails clients." },
      { t: "Workflows d'approbation multi-niveaux", d: "Routage collaboratif de la réclamation vers le responsable compétent (Commerce pour accord commercial, Logistique pour litige de transport, ADV)." },
      { t: "Éclatement des litiges mixtes", d: "Scission automatique d'une réclamation complexe en sous-dossiers traités en parallèle par les différents services." },
      { t: "Génération automatique d'avoirs", d: "Après approbation, création directe de la note de crédit ou de l'ajustement comptable dans l'ERP sans ressaisie." },
      { t: "Contrôle des budgets promotionnels", d: "Vérification des déductions commerciales par rapport aux accords contractuels et provisions de trade marketing." },
      { t: "Pilotage du DDO (Days Deductions Outstanding)", d: "Analyse approfondie des causes récurrentes de litiges par client, gamme de produits ou transporteur pour stopper les pertes de marge." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "Sortir les réclamations et litiges des boîtes mail",
      desc: "Une déduction de 2 400 € pour pénalité logistique est qualifiée automatiquement par l'IA, soumise au responsable logistique avec le bon de livraison émargé, et validée dans un circuit transparent avec piste d'audit complète.",
      img: "assets/usecases/litiges-reclamations.webp"
    },
    process: {
      step: "6. Créance / Gestion des Exceptions & Litiges",
      role: "Qualification des motifs d'écart, arbitrage collaboratif et émission des avoirs justifiés",
      system: "ERP / TPM (Trade Promotion Management) / WMS Transport",
      synergy: "Reçoit les écarts constatés par Cash Application (CA) et neutralise temporairement la relance dans Collections Management (COM)."
    }
  },

  com: {
    kicker: "Collections Management · Order-to-Cash",
    tagline: "Piloter le recouvrement avec l'IA pour réduire le DSO et préserver la relation client.",
    metrics: [
      { num: "-6 à -12j", label: "Réduction moyenne constatée sur le DSO (Délai moyen de paiement)" },
      { num: "+25 %", label: "Efficacité accrue des équipes de recouvrement" },
      { num: "100 %", label: "Traçabilité des promesses de paiement et des actions menées" }
    ],
    briques: [
      { t: "Recouvrement prédictif piloté par l'IA", d: "Segmentation dynamique des comptes et priorisation quotidienne des relances en fonction du niveau de risque et des montants en jeu." },
      { t: "Scénarios de relance omnicanaux", d: "Envoi automatisé de relevés de compte, e-mails personnalisés avec duplicatas et liens de paiement, courriers et tâches d'appel." },
      { t: "File d'appels intelligente", d: "Génération guidée de l'agenda quotidien des chargés de recouvrement pour concentrer les appels téléphoniques sur les dossiers critiques." },
      { t: "Suivi des promesses de paiement", d: "Enregistrement précis des engagements pris par les clients et alertes automatiques en cas de rupture d'échéancier." },
      { t: "Collaboration transverse Ventes/Finance", d: "Partage transparent de l'état du recouvrement avec les équipes commerciales pour éviter les démarches contradictoires." },
      { t: "Prévisions d'encaissement de cash", d: "Projections fiables des rentrées de trésorerie à 30, 60, 90 et 120 jours pour éclairer les décisions financières." }
    ],
    usecase: {
      tag: "Cas d'usage emblématique",
      title: "Relancer au bon moment, avec le bon ton et la bonne pièce",
      desc: "Le chargé de recouvrement contacte un client grand compte en disposant sous les yeux de l'historique complet, des promesses passées et des factures en souffrance directement téléchargeables, pour obtenir un engagement de règlement sans friction.",
      img: "assets/usecases/credit-decision.webp"
    },
    process: {
      step: "6. Créance / Recouvrement Amiable & Contentieux",
      role: "Scénarios de relance, négociation des échéanciers et sécurisation des rentrées de fonds",
      system: "ERP Comptabilité Clients (AR) / CRM Commercial / Plateforme de paiement",
      synergy: "S'appuie sur le score de Credit Management (CM) pour adapter la fermeté des relances et se coordonne avec Claims (CD) pour geler les factures contestées."
    }
  }
};
