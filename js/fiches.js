/* =========================================================================
   fiches.js : messages marketing Esker, condensés depuis les fiches « Solution
   Summary » fournies par Bruno (PDF). Une entrée par module couvert.
   Champs : src (fiche source), hook (accroche), intro, why (4 bénéfices),
   how (étapes du fonctionnement), stats (chiffres cités par la fiche).
   Rien n'est ajouté qui ne figure pas dans la fiche ou le deck.
   Les 13 modules sont désormais couverts.
   ========================================================================= */
window.FICHES = {
  ap: {
    src: "Fiche Accounts Payable Automation",
    hook: "Sortez la gestion des factures fournisseurs du désordre",
    intro: "Capture des données par l'IA, traitement sans intervention et circuits de validation électroniques : une façon plus simple et plus efficace de piloter la trésorerie.",
    why: [
      {t: "Plus de rapidité et de visibilité", d: "Sur les factures comme sur la clôture, avec les axes de progrès faciles à repérer.", ic: "zoom"},
      {t: "Moins de risque et de fraude", d: "Piste d'audit complète et circuits électroniques qui repèrent les doublons de paiement.", ic: "shield"},
      {t: "De meilleures relations fournisseurs", d: "Paiements dans les délais, litiges résolus vite, échanges en temps réel.", ic: "sync"},
      {t: "Des coûts de traitement réduits", d: "Fin du papier, du transport et de l'archivage physique.", ic: "euro"}
    ],
    how: [
      {t: "Réception et distribution", d: "Les factures sont capturées quel que soit le canal par lequel elles arrivent."},
      {t: "Extraction des données", d: "Les informations de la facture sont lues et structurées."},
      {t: "Vérification et gestion", d: "Contrôles, rapprochement et traitement des écarts."},
      {t: "Validation du paiement", d: "Le circuit électronique porte la facture jusqu'à l'approbation."},
      {t: "Intégration et archivage", d: "Écriture comptable créée dans l'ERP, puis archivage."}
    ]
  },
  so: {
    src: "Fiche Quote Request",
    hook: "Des devis comparés en quelques minutes, par tous vos acheteurs",
    intro: "Un moyen simple et intuitif de collecter et de comparer les devis de plusieurs fournisseurs, y compris pour les acheteurs occasionnels.",
    why: [
      {t: "Autonomie des collaborateurs", d: "Chacun lance une demande de devis sans passer par les achats.", ic: "user"},
      {t: "Des décisions plus rapides", d: "De la demande de devis à l'acceptation d'une offre, en quelques minutes.", ic: "spark"},
      {t: "Conformité et gouvernance", d: "Les règles d'achat de l'entreprise sont appliquées dès la demande.", ic: "shield"},
      {t: "Collaboration fournisseurs", d: "Un portail dédié pour répondre, échanger et suivre.", ic: "globe"}
    ],
    how: [
      {t: "Lancez", d: "Une demande de devis, simplement."},
      {t: "Mobilisez", d: "Les fournisseurs invités répondent depuis leur portail."},
      {t: "Comparez", d: "Les offres reçues, côte à côte."},
      {t: "Attribuez et transférez", d: "L'offre retenue passe en commande."},
      {t: "Gardez le contrôle", d: "Visibilité sur chaque demande en cours."},
      {t: "Tracez", d: "Archives et piste d'audit."}
    ]
  },
  sm: {
    src: "Fiches Supplier Management (indueD, EcoVadis)",
    hook: "Connaître, évaluer et surveiller chacun de vos fournisseurs",
    intro: "Une vision à 360° du risque et de la performance durable de vos fournisseurs, de l'intégration au suivi quotidien.",
    why: [
      {t: "Des risques cachés repérés", d: "Contrôles PEP, sanctions et bénéficiaires effectifs (UBO) avec indueD.", ic: "shield"},
      {t: "Une surveillance continue", d: "Contrôles quotidiens et alertes en cas d'évolution d'un fournisseur.", ic: "zoom"},
      {t: "Des scores qui parlent", d: "Scores pays, activité et sanctions pour prioriser vos actions.", ic: "kpi"},
      {t: "Une performance durable", d: "Évaluations EcoVadis sur 250+ familles d'achat, 185+ pays.", ic: "check"}
    ],
    how: [
      {t: "Intégrer", d: "Collecte des informations du fournisseur à l'enregistrement."},
      {t: "Contrôler", d: "PEP, sanctions, bénéficiaires effectifs : vérifications automatiques."},
      {t: "Évaluer", d: "Notation de 0 à 100 sur 4 thèmes (EcoVadis)."},
      {t: "Surveiller", d: "Contrôles quotidiens, alertes et actions."}
    ],
    gauges: [
      {l: "Environnement", v: 78}, {l: "Travail et droits humains", v: 64}, {l: "Éthique", v: 71}, {l: "Achats responsables", v: 59}
    ],
    gaugeNote: "Illustration du principe de notation de 0 à 100. Valeurs fictives."
  },
  ctm: {
    src: "Fiche Contract Management",
    hook: "Tous vos contrats dans un référentiel unique, sous contrôle",
    intro: "Automatise la gestion des contrats existants et nouveaux via un référentiel central, pour optimiser les opérations et réduire les risques.",
    why: [
      {t: "Un référentiel central", d: "Contrats existants et nouveaux au même endroit.", ic: "layers"},
      {t: "Des échéances maîtrisées", d: "Renouvellement ou résiliation anticipés, sans mauvaise surprise.", ic: "sync"},
      {t: "Des risques réduits", d: "Conformité juridique vérifiée, clauses non conformes repérées.", ic: "shield"},
      {t: "Des données exploitables", d: "Métadonnées et clauses extraites automatiquement.", ic: "kpi"}
    ],
    how: [
      {t: "Création et soumission", d: "Extraction automatique des métadonnées et des clauses."},
      {t: "Révision et validation", d: "Workflows de validation, du juridique à la direction."},
      {t: "Conformité", d: "Clauses non conformes repérées, risques réduits."},
      {t: "Renouvellement ou résiliation", d: "Les échéances sont suivies pour vous."},
      {t: "Analyses et rapports", d: "Une vue claire sur le portefeuille de contrats."}
    ]
  },
  pr: {
    src: "Fiche Procurement",
    hook: "De la demande d'achat au paiement, sans friction",
    intro: "Une plateforme d'achats collaborative et conviviale pour automatiser le processus de commande, de la demande à la réception.",
    why: [
      {t: "Des achats conformes", d: "Catalogues, budgets et circuits de validation appliqués d'office.", ic: "shield"},
      {t: "Une expérience simple", d: "Les demandeurs commandent comme sur un site marchand.", ic: "cart"},
      {t: "Une visibilité totale", d: "Du besoin à la réception, chaque étape est suivie.", ic: "zoom"},
      {t: "Des fournisseurs connectés", d: "Commandes et confirmations échangées automatiquement.", ic: "globe"}
    ],
    how: [
      {t: "Exprimer le besoin", d: "Catalogue, formulaire ou demande libre."},
      {t: "Valider", d: "Circuit d'approbation et contrôle budgétaire."},
      {t: "Commander", d: "Bon de commande envoyé au fournisseur."},
      {t: "Réceptionner", d: "Confirmation de livraison ou de service rendu."},
      {t: "Rapprocher", d: "Commande, réception et facture réunies."}
    ]
  },
  em: {
    src: "Fiche Expense Management",
    hook: "Des notes de frais saisies en un instant, validées sans relance",
    intro: "Gérez plus efficacement les dépenses de vos collaborateurs, de la saisie sur mobile à l'archivage des reçus.",
    why: [
      {t: "Saisie depuis le mobile", d: "Une photo du reçu ou un e-mail suffit, via Esker Anywhere.", ic: "phone"},
      {t: "Des règles appliquées", d: "Reçus obligatoires et politique de dépenses respectée.", ic: "shield"},
      {t: "Des validations fluides", d: "Les approbateurs sont notifiés automatiquement.", ic: "check"},
      {t: "Des reçus bien rangés", d: "Archivés en toute sécurité avec la dépense.", ic: "lock"}
    ],
    how: [
      {t: "Enregistrer une dépense", d: "Photo ou e-mail du reçu, données extraites automatiquement."},
      {t: "Créer une note de frais", d: "Les dépenses sont regroupées en un clic."},
      {t: "Approuver", d: "Le circuit de validation se déclenche seul."},
      {t: "Contrôler et archiver", d: "Les reçus sont archivés avec la note de frais."}
    ]
  },
  crm: {
    src: "Fiche Credit Management",
    hook: "Intégrez vos clients et décidez le crédit avec cohérence",
    intro: "Intégrez rapidement vos nouveaux clients, prenez des décisions de crédit cohérentes et gardez le risque sous contrôle.",
    why: [
      {t: "Des clients intégrés plus vite", d: "Formulaires d'ouverture de compte envoyés automatiquement.", ic: "user"},
      {t: "Une visibilité totale", d: "Situation de crédit, historique, indicateurs clés et documents réunis.", ic: "zoom"},
      {t: "Un crédit sécurisé", d: "Workflows avancés et agences de scoring pour fixer les bonnes conditions.", ic: "shield"},
      {t: "Moins de pertes", d: "Alertes et actions pour réduire provisions et créances douteuses.", ic: "euro"}
    ],
    how: [
      {t: "Enregistrement des nouveaux clients", d: "Formulaires d'ouverture de compte et collecte des documents."},
      {t: "Validation des limites de crédit", d: "Workflows d'approbation et scoring externe."},
      {t: "Gestion des comptes clients", d: "Un référentiel dédié, à jour en continu."},
      {t: "Gestion du risque", d: "Alertes et actions dès qu'un signal apparaît."},
      {t: "Archivage et piste d'audit", d: "Chaque décision est tracée."}
    ]
  },
  cim: {
    src: "Fiche Customer Service Automation",
    hook: "Un assistant digital pour votre Service Client",
    intro: "Suivez toutes les demandes clients et répondez-y en temps réel, avec un assistant qui trie et prépare les réponses.",
    why: [
      {t: "Efficacité de bout en bout", d: "Demandes triées et dirigées sans intervention.", ic: "spark"},
      {t: "Meilleure visibilité", d: "Chaque demande suivie, de la réception à la réponse.", ic: "zoom"},
      {t: "Équipe plus autonome", d: "Réponses suggérées depuis vos systèmes internes.", ic: "user"},
      {t: "Meilleure expérience client", d: "Des réponses plus rapides et plus fiables.", ic: "chat"}
    ],
    how: [
      {t: "Suivre toutes les demandes", d: "E-mails et demandes clients centralisés."},
      {t: "Catégoriser et rediriger", d: "Chaque e-mail part vers la bonne personne ou la bonne application."},
      {t: "Suggérer des réponses", d: "Informations extraites automatiquement des systèmes internes."}
    ]
  },
  om: {
    src: "Fiche Customer Service Automation",
    hook: "Chaque commande saisie, suivie et créée sans ressaisie",
    intro: "Traitez et suivez électroniquement toute commande reçue par fax, e-mail, EDI, portail ou mobile, avec 100 % de précision, de visibilité et d'efficacité.",
    why: [
      {t: "Tous les canaux", d: "Fax, e-mail, EDI, portail, mobile : une seule chaîne.", ic: "layers"},
      {t: "100 % de précision", d: "Saisie automatisée par IA et RPA.", ic: "check"},
      {t: "Une visibilité totale", d: "Chaque commande suivie jusqu'à son expédition.", ic: "zoom"},
      {t: "Une équipe disponible", d: "Moins de saisie, plus de relation client.", ic: "user"}
    ],
    how: [
      {t: "Réception", d: "Fax, e-mail, EDI, portail ou mobile."},
      {t: "Saisie automatisée", d: "Lecture par IA, contrôle des données."},
      {t: "Préavis d'expédition et création ERP", d: "La commande est créée dans l'ERP, le client est prévenu."}
    ],
    stats: [{n: 100, p: "%", l: "de précision, de visibilité et d'efficacité"}]
  },
  id: {
    src: "Fiche Invoice Delivery",
    hook: "Diffusez vos factures comme vos clients les préfèrent",
    intro: "Automatisez la validation, l'envoi et l'archivage de vos factures, quel que soit le canal ou le pays.",
    why: [
      {t: "Plus d'efficacité", d: "Un DSO réduit et un temps de traitement divisé.", ic: "kpi"},
      {t: "Conformité facturation électronique", d: "Plus de 60 pays couverts.", ic: "shield"},
      {t: "Clients satisfaits", d: "E-mail, EDI, portail ou courrier, au choix du client.", ic: "chat"},
      {t: "Erreurs de diffusion repérées", d: "Un portail web et un suivi en continu.", ic: "zoom"}
    ],
    how: [
      {t: "Validation et transmission", d: "Contrôle avant envoi."},
      {t: "Extraction et mise en forme", d: "Document mis en forme pour chaque destinataire."},
      {t: "Diffusion et archivage", d: "Envoi multicanal, archivage jusqu'à 11 ans."},
      {t: "Collaboration et suivi", d: "Statut visible pour vous et pour vos clients."}
    ],
    stats: [
      {n: 7, p: "jours", pre: "jusqu'à", l: "de DSO en moins"},
      {n: 90, p: "%", pre: "plus de", l: "de temps de traitement en moins"},
      {n: 60, p: "pays", pre: "plus de", l: "couverts par la conformité"},
      {n: 24, p: "h", pre: "en moins de", l: "pour un envoi postal"},
      {n: 11, p: "ans", pre: "jusqu'à", l: "d'archivage"}
    ]
  },
  ca: {
    src: "Fiche Cash Application",
    hook: "Éliminez les efforts et les erreurs de réconciliation",
    intro: "Automatisez le rapprochement entre vos paiements et vos factures, quel que soit le format reçu.",
    why: [
      {t: "Moins d'efforts manuels", d: "Les paiements sont rapprochés automatiquement.", ic: "sync"},
      {t: "Moins d'erreurs", d: "Les cas ambigus sont isolés et traités à part.", ic: "check"},
      {t: "Cash visible plus tôt", d: "Une position clients à jour, plus vite.", ic: "euro"},
      {t: "Un ERP toujours à jour", d: "Les écritures de lettrage sont créées pour vous.", ic: "layers"}
    ],
    how: [
      {t: "Centraliser", d: "Relevés et avis de paiement, tous formats."},
      {t: "Extraire et rapprocher", d: "L'IA associe chaque paiement à ses factures."},
      {t: "Traiter les exceptions", d: "Seuls les cas douteux sont soumis à un humain."},
      {t: "Réconcilier dans l'ERP", d: "Lettrage et écritures générés."},
      {t: "Suivre", d: "Tableaux de bord et piste d'audit."}
    ]
  },
  cd: {
    src: "Fiche Claims and Deductions",
    hook: "Ne laissez pas les déductions rogner vos marges",
    intro: "Centralisez les réclamations et les déductions pour les traiter vite et limiter celles qui ne sont pas justifiées.",
    why: [
      {t: "Une visibilité complète", d: "Toutes les réclamations et déductions au même endroit.", ic: "zoom"},
      {t: "Une collaboration fluide", d: "Ventes, finance et logistique travaillent sur le même dossier.", ic: "chat"},
      {t: "Des coûts réduits, un traitement accéléré", d: "Moins de temps passé par dossier.", ic: "spark"},
      {t: "Moins de déductions invalides", d: "Les déductions non justifiées sont contestées avec des preuves.", ic: "shield"}
    ],
    how: [
      {t: "Réception", d: "Déductions et réclamations captées automatiquement."},
      {t: "Vérification des données", d: "Rapprochement avec commandes, livraisons et factures."},
      {t: "Circuits de validation", d: "Le bon interlocuteur reçoit le bon dossier."},
      {t: "Intégration ERP", d: "Écritures et avoirs créés sans ressaisie."}
    ]
  },
  com: {
    src: "Fiche Accounts Receivable (suite)",
    hook: "Un recouvrement priorisé par l'IA, mené en équipe",
    intro: "Automatisez les étapes clés de votre stratégie de recouvrement et concentrez-vous sur les comptes qui comptent.",
    why: [
      {t: "Plus d'efficacité", d: "Les étapes de relance sont automatisées.", ic: "sync"},
      {t: "Plus de visibilité", d: "Une vue claire du portefeuille et des risques.", ic: "zoom"},
      {t: "Un DSO réduit", d: "Les tâches sont priorisées selon les prédictions de l'IA.", ic: "kpi"},
      {t: "Une meilleure expérience client", d: "Des échanges collaboratifs sur les factures en litige.", ic: "chat"}
    ],
    how: [
      {t: "Automatiser la stratégie", d: "Les étapes clés de relance se déclenchent seules."},
      {t: "Prioriser", d: "Prédictions de l'IA et analyse des risques."},
      {t: "Collaborer", d: "Outils partagés pour résoudre les problèmes liés aux factures."}
    ]
  }
};
