/* =========================================================================
   SCÉNARIO DE DÉMONSTRATION INTERACTIVE ESKER - FACTURES FOURNISSEURS
   10 étapes fluides :
   - Zéro lien externe vers Esker
   - Drill-down 3 niveaux sur le tableau de bord puis arrivée directe au niveau 3 du rapport
   - Retour par le tableau de bord avant les 40 factures du comptable + navigation Accueil libre
   - Synergy Agent cliquable en haut à droite sur toutes les vues qui le proposent
   ========================================================================= */

const DEMO_STEPS = [
  {
    id: 1,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "01 · TABLEAU DE BORD (NIVEAU 1)",
    title: "Graphique central « Factures en attente par approbateur »",
    narrative: "Le rapport central présente la répartition des factures en attente par approbateur. Vous pouvez également cliquer à tout moment sur « Synergy Agent » en haut à droite pour ouvrir l'assistant IA Esker.",
    action: "Cliquez sur le secteur de Marc (12 factures · 44,4 %) dans le graphique."
  },
  {
    id: 2,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "02 · TABLEAU DE BORD (NIVEAU 2)",
    title: "Drill-down sur Marc : Fournisseurs en attente d'approbation",
    narrative: "Directement dans le tableau de bord, le graphique détaille les fournisseurs dont les factures sont bloquées chez Marc. ACME Supply Company représente 4 factures (33,3 %).",
    action: "Cliquez sur le secteur ACME SUPPLY COMPANY (4 factures) dans le graphique."
  },
  {
    id: 3,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "03 · TABLEAU DE BORD (NIVEAU 3)",
    title: "Drill-down sur Acme : Camaïeu de dates d'échéance",
    narrative: "Le 3e niveau révèle la balance âgée d'Acme sous forme de camaïeu d'échéances (Non échue, 0j - 30j, 60j - 90j). Ouvrons maintenant le rapport sous-jacent directement à ce 3e niveau.",
    action: "Cliquez sur le titre « Factures en attente par approbateur » au-dessus du graphique."
  },
  {
    id: 4,
    pageGroup: "report",
    file: "steps/step6.html",
    kicker: "04 · RAPPORT FILTRÉ (NIVEAU 3 DIRECT)",
    title: "Rapport détaillé filtré sur les échéances d'ACME Supply Company",
    narrative: "On arrive directement au 3e niveau du rapport : le tableau en dessous du graphique est déjà filtré sur les 4 factures d'Acme chez Marc, classées par tranche d'échéance.",
    action: "Cliquez sur la facture n° 281270 échue entre 60 et 90 jours (6 271,20 USD)."
  },
  {
    id: 5,
    pageGroup: "invoice_acme",
    file: "steps/step7.html",
    kicker: "05 · FACTURE BLOQUÉE (ACME 281270)",
    title: "Consultation de la facture 281270 en attente chez Marc",
    narrative: "À gauche, les détails de la facture (commande 4500012171, motif « En attente de l'entrée de biens et services » et workflow bloqué chez Marc). À droite, le PDF de la facture.",
    action: "Cliquez sur l'icône de Conversation interne (en haut à droite) pour écrire à Marc."
  },
  {
    id: 6,
    pageGroup: "invoice_acme",
    file: "steps/step7.html",
    kicker: "06 · CONVERSATION INTERNE",
    title: "Échange collaboratif avec Marc directement sur la facture",
    narrative: "Le panneau de conversation interne s'ouvre à droite : Marc GestionnaireCC a été ajouté à la discussion avec un message lui demandant ce qui bloque la validation.",
    action: "Cliquez sur « Quitter » (en haut à droite) pour revenir au tableau de bord."
  },
  {
    id: 7,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "07 · RETOUR AU TABLEAU DE BORD",
    title: "Focus sur les 40 factures assignées au comptable (& Synergy Agent)",
    narrative: "De retour sur le tableau de bord d'accueil, focalisons-nous en haut sur les « Factures en cours » (ou testez le bouton doré « Synergy Agent » en haut à droite).",
    action: "Cliquez sur la tuile « 40 Assignées au comptable » pour ouvrir la corbeille comptable."
  },
  {
    id: 8,
    pageGroup: "admin_list",
    file: "steps/step9.html",
    kicker: "08 · CORBEILLE COMPTABLE (40 FACTURES)",
    title: "Les 40 factures à traiter : Filtres, Colonnes, Accueil & Synergy Agent",
    narrative: "Testez les filtres en haut, personnalisez les colonnes (icône crayon), ouvrez Synergy Agent en haut à droite ou cliquez sur l'onglet « ACCUEIL » pour naviguer librement.",
    action: "Cliquez sur la ligne Stark Industries (Cas 1) ou sur la ligne ACME FR (Cas 2 : Facture PA)."
  },
  {
    id: 9,
    pageGroup: "invoice_stark",
    file: "steps/step10.html",
    kicker: "09 · FACTURE AVEC COMMANDE (STARK INDUSTRIES)",
    title: "Rapprochement commande 4500000007, écart HT et exception",
    narrative: "Survolez les champs en orange et les badges ⓘ : écart sur le Montant HT (3 032,82 €), écart de quantité (186 vs 185) et de montant (+6,32 €) sur la ligne 3 (CNT50922), exception « Quantity mismatch » et workflow.",
    action: "Explorez la fiche puis cliquez sur « Quitter » pour voir la facture électronique PA."
  },
  {
    id: 10,
    pageGroup: "invoice_pdp",
    file: "steps/step11.html",
    kicker: "10 · FACTURE ÉLECTRONIQUE (PLATEFORME AGRÉÉE)",
    title: "Multi-documents (PDF, XML, BC, BL), contrat inconnu & alerte IBAN",
    narrative: "Cliquez sur les 4 vignettes du panneau « Documents » pour afficher la facture PDF, le flux XML Factur-X, le bon de commande et le bon de livraison. Survolez le contrat « CONTRAT-2025-KRE-0147 » (inexistant dans Esker) et l'alerte IBAN.",
    action: "Cliquez sur les 4 documents joints et survolez les alertes contrat et IBAN."
  }
];
