/* =========================================================================
   SCÉNARIO DE DÉMONSTRATION INTERACTIVE ESKER - FACTURES FOURNISSEURS
   11 étapes réelles sans voile gris, avec pulsations DOM et navigation libre
   ========================================================================= */

const DEMO_STEPS = [
  {
    id: 1,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "01 · TABLEAU DE BORD (NIVEAU 1)",
    title: "Tableau de bord & Graphique à 3 niveaux de détail",
    narrative: "Parcourez librement le tableau de bord. Au centre, le rapport « Factures en attente par approbateur » est mis en exergue : Marc concentre 12 factures (44,4 %). En haut, la tuile « 40 Assignées au comptable » permet aussi d'accéder directement à la corbeille comptable.",
    action: "Cliquez sur le secteur de Marc (44,4 %) dans le graphique central."
  },
  {
    id: 2,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "02 · TABLEAU DE BORD (NIVEAU 2)",
    title: "Drill-down sur Marc : Répartition par fournisseur",
    narrative: "Sans quitter le tableau de bord, le graphique affiche désormais les fournisseurs dont les factures sont en attente d'approbation chez Marc. ACME Supply Company représente 4 factures (33,3 %).",
    action: "Cliquez sur ACME SUPPLY COMPANY (4 factures) dans le graphique."
  },
  {
    id: 3,
    pageGroup: "dashboard",
    file: "steps/step1.html",
    kicker: "03 · TABLEAU DE BORD (NIVEAU 3)",
    title: "Drill-down sur Acme : Camaïeu de dates d'échéance",
    narrative: "Troisième niveau de détail directement dans le graphique : la balance âgée d'Acme sous forme de camaïeu d'échéances (Non échue, 0j - 30j, 60j - 90j).",
    action: "Cliquez sur le titre « Factures en attente par approbateur » au-dessus du graphique."
  },
  {
    id: 4,
    pageGroup: "report",
    file: "steps/step4.html",
    kicker: "04 · RAPPORT DÉTAILLÉ (NIVEAU 1)",
    title: "Ouverture du rapport complet avec table des factures",
    narrative: "Le rapport complet affiche le graphique en haut et la liste détaillée de toutes les factures en attente en dessous. Les 3 niveaux de sélection vont filtrer dynamiquement le tableau inférieur.",
    action: "Cliquez sur le secteur de Marc (12 factures · 44,4 %) dans le graphique."
  },
  {
    id: 5,
    pageGroup: "report",
    file: "steps/step4.html",
    kicker: "05 · RAPPORT DÉTAILLÉ (NIVEAU 2)",
    title: "Synchronisation du rapport sur le portefeuille de Marc",
    narrative: "En cliquant sur Marc, le tableau inférieur s'est automatiquement filtré sur les 12 enregistrements dont Marc est propriétaire.",
    action: "Cliquez sur ACME Supply Company (4 factures) dans le graphique."
  },
  {
    id: 6,
    pageGroup: "report",
    file: "steps/step4.html",
    kicker: "06 · RAPPORT DÉTAILLÉ (NIVEAU 3)",
    title: "Focalisation sur la facture échue entre 60 et 90 jours",
    narrative: "Le tableau inférieur affiche maintenant les 4 factures d'Acme classées par tranche d'échéance. La facture n° 281270 (6 271,20 USD) est bloquée entre 60 et 90 jours.",
    action: "Cliquez sur la ligne de la facture 281270 (tranche 60j - 90j) dans le tableau."
  },
  {
    id: 7,
    pageGroup: "invoice_acme",
    file: "steps/step7.html",
    kicker: "07 · FACTURE BLOQUÉE (ACME 281270)",
    title: "Consultation de la facture 281270 en attente chez Marc",
    narrative: "Vous pouvez défiler librement dans le volet de gauche (statut « En attente de l'entrée de biens et services », commande 4500012171, workflow bloqué chez Marc) et zoomer sur le PDF à droite.",
    action: "Cliquez sur l'icône de Conversation interne (en haut à droite) pour écrire à Marc."
  },
  {
    id: 8,
    pageGroup: "invoice_acme",
    file: "steps/step7.html",
    kicker: "08 · CONVERSATION INTERNE",
    title: "Échange collaboratif avec Marc directement sur la facture",
    narrative: "Le panneau de conversation interne s'ouvre à droite : Marc GestionnaireCC a été ajouté à la discussion avec un message lui demandant ce qui bloque la réception.",
    action: "Cliquez sur « Quitter » (en haut à droite) pour passer aux 40 factures du comptable."
  },
  {
    id: 9,
    pageGroup: "admin_list",
    file: "steps/step9.html",
    kicker: "09 · CORBEILLE COMPTABLE (40 FACTURES)",
    title: "Les 40 factures assignées au comptable : Filtres & Colonnes",
    narrative: "Testez librement les filtres en haut (saisissez un nom ou un montant), cliquez sur l'icône crayon à droite pour masquer/afficher des colonnes, ou cliquez sur l'une des deux factures mises en évidence.",
    action: "Cliquez sur la ligne Stark Industries (Cas 1) ou sur la ligne ACME FR (Cas 2 : Facture PA)."
  },
  {
    id: 10,
    pageGroup: "invoice_stark",
    file: "steps/step10.html",
    kicker: "10 · FACTURE AVEC COMMANDE (STARK INDUSTRIES)",
    title: "Rapprochement commande 4500000007, écart HT et exception",
    narrative: "Survolez les champs entourés en orange : écart sur le Montant HT (3 032,82 €), écart de quantité (186 vs 185) et de montant (+6,32 €) sur la 3e ligne de poste (CNT50922), exception « Quantity mismatch » levée et workflow mis à jour.",
    action: "Explorez la fiche puis cliquez sur « Quitter » pour voir la facture électronique PA."
  },
  {
    id: 11,
    pageGroup: "invoice_pdp",
    file: "steps/step11.html",
    kicker: "11 · FACTURE ÉLECTRONIQUE (PLATEFORME AGRÉÉE)",
    title: "Multi-documents (PDF, XML, BC, BL), contrat inconnu & alerte IBAN",
    narrative: "Cliquez sur les 4 vignettes du panneau « Documents » pour afficher la facture PDF, le flux XML Factur-X, le bon de commande et le bon de livraison. Survolez le contrat « CONTRAT-2025-KRE-0147 » (inexistant dans Esker) et l'alerte IBAN (aucune coordonnée bancaire connue pour ce fournisseur).",
    action: "Cliquez sur les 4 documents joints et survolez les alertes contrat et IBAN."
  }
];
