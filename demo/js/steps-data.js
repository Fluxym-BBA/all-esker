/* =========================================================================
   SCÉNARIO DE DÉMONSTRATION INTERACTIVE ESKER - FACTURES FOURNISSEURS (L13)
   ========================================================================= */

const DEMO_STEPS = [
  {
    id: 1,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "01 · VUE D'ENSEMBLE DU TABLEAU DE BORD",
    title: "Exploration libre du tableau de bord Factures Fournisseurs",
    narrative: "Promenez-vous librement sur le tableau de bord et survolez chaque zone (espaces de travail, recherche universelle, actions rapides, compteurs dont les 40 factures assignées au comptable, et les 16 graphiques) pour découvrir leur rôle métier. Cliquez aussi sur « Synergy Agent » en haut à droite !",
    action: "Survolez les éléments du tableau de bord, puis cliquez sur « Étape suivante → » (ou sur le graphique central) pour jouer avec les 3 niveaux."
  },
  {
    id: 2,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "02 · GRAPHIQUE 3 NIVEAUX (NIVEAU 1)",
    title: "Graphique « Factures en attente par approbateur »",
    narrative: "Focus sur le graphique central mis en exergue : on visualise la répartition des 20 factures en attente par approbateur. Marc GestionnaireCC concentre à lui seul 12 factures (44,4 %).",
    action: "Cliquez sur le secteur de Marc (12 factures · 44,4 %) dans le graphique."
  },
  {
    id: 3,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "03 · GRAPHIQUE 3 NIVEAUX (NIVEAU 2)",
    title: "Drill-down sur Marc : Répartition par fournisseur",
    narrative: "Directement dans le tableau de bord, le graphique détaille les fournisseurs dont les factures sont en attente d'approbation chez Marc. ACME Supply Company représente 4 factures (33,3 %).",
    action: "Cliquez sur le secteur ACME SUPPLY COMPANY (4 factures) dans le graphique."
  },
  {
    id: 4,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "04 · GRAPHIQUE 3 NIVEAUX (NIVEAU 3)",
    title: "Drill-down sur Acme : Camaïeu de dates d'échéance",
    narrative: "Le 3e niveau révèle la balance âgée d'Acme sous forme de camaïeu d'échéances (Non échue, 0j - 30j, 60j - 90j). Ouvrons maintenant le rapport sous-jacent directement à ce 3e niveau.",
    action: "Cliquez sur le titre « Factures en attente par approbateur » au-dessus du graphique."
  },
  {
    id: 5,
    pageGroup: "report",
    file: "steps/step6.html",
    kicker: "05 · RAPPORT FILTRÉ (GRAPHIQUE + LISTE)",
    title: "Le graphique filtre dynamiquement la liste des factures en dessous",
    narrative: "Le graphique n'est pas là que pour illustrer : il filtre automatiquement la table des factures juste en dessous selon les 3 niveaux sélectionnés (Marc → Acme → tranches d'échéance), donnant un accès immédiat à la facture recherchée.",
    action: "Cliquez sur la ligne de la facture n° 281270 échue entre 60 et 90 jours (6 271,20 USD)."
  },
  {
    id: 6,
    pageGroup: "invoice_acme",
    file: "steps/step7.html",
    kicker: "06 · FACTURE BLOQUÉE (ACME 281270)",
    title: "Consultation de la facture 281270 en attente chez Marc",
    narrative: "Survolez les pastilles animées à gauche (« En attente de réception », commande 4500012171 et « Bloquée chez Marc » dans le workflow) et consultez le PDF à droite.",
    action: "Cliquez sur l'icône de Conversation interne (en haut à droite) pour écrire à Marc."
  },
  {
    id: 7,
    pageGroup: "invoice_acme",
    file: "steps/step7.html",
    kicker: "07 · CONVERSATION INTERNE",
    title: "Échange collaboratif avec Marc directement sur la facture",
    narrative: "Le panneau de conversation interne s'ouvre à droite : Marc GestionnaireCC a été ajouté à la discussion avec un message lui demandant ce qui bloque la validation.",
    action: "Cliquez sur « Quitter » (en haut à droite) pour revenir au tableau de bord."
  },
  {
    id: 8,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "08 · RETOUR AU TABLEAU DE BORD",
    title: "Focus sur les 40 factures assignées au comptable (& Synergy Agent)",
    narrative: "De retour sur le tableau de bord d'accueil (avec toutes ses infobulles et le volet Synergy Agent accessible en haut à droite), focalisons-nous sur la corbeille comptable.",
    action: "Cliquez sur la tuile « 40 Assignées au comptable » en haut à gauche."
  },
  {
    id: 9,
    pageGroup: "admin_list",
    file: "steps/step9.html",
    kicker: "09 · CORBEILLE COMPTABLE (40 FACTURES)",
    title: "Listes déroulantes de filtres, Colonnes, Accueil & Synergy Agent",
    narrative: "Cliquez sur les listes déroulantes des filtres (Code société, opérateurs « égal à / commence par / contient », valeurs), personnalisez les colonnes (crayon à droite), ouvrez Synergy Agent ou cliquez sur l'onglet « ACCUEIL ».",
    action: "Cliquez sur la 1re ligne Stark Industries (Cas 1) ou sur la 2e ligne ACME FR (Cas 2 : Facture PA)."
  },
  {
    id: 10,
    pageGroup: "invoice_stark",
    file: "steps/step10.html",
    kicker: "10 · FACTURE AVEC COMMANDE (STARK INDUSTRIES)",
    title: "Rapprochement commande 4500000007, écart HT et exception",
    narrative: "Survolez les champs animés en orange : écart sur le Montant HT (3 032,82 €), écart de quantité (186 vs 185) et de montant (+6,32 €) sur la ligne 3 (CNT50922), exception « Quantity mismatch » et workflow.",
    action: "Cliquez sur « Quitter » pour revenir à la liste des 40 factures et choisir le 2e cas (ou sur « Étape suivante → »)."
  },
  {
    id: 11,
    pageGroup: "invoice_pdp",
    file: "steps/step11.html",
    kicker: "11 · FACTURE ÉLECTRONIQUE (PLATEFORME AGRÉÉE)",
    title: "Multi-documents (PDF, XML, BC, BL), contrat inconnu & alerte IBAN",
    narrative: "Cliquez sur les 4 vignettes du panneau « Documents » pour afficher la facture PDF, le flux XML Factur-X, le bon de commande et le bon de livraison. Survolez le contrat « CONTRAT-2025-KRE-0147 » (inexistant dans Esker) et l'alerte IBAN.",
    action: "Cliquez sur les 4 documents joints et survolez les alertes contrat et IBAN."
  }
];
