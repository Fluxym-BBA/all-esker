/* =========================================================================
   SCÉNARIO DE DÉMONSTRATION GUIDÉE ESKER - FACTURES FOURNISSEURS (11 ÉTAPES)
   Conçu pour Fluxym - Démo commerciale & avant-vente interactive
   ========================================================================= */

const DEMO_STEPS = [
  {
    id: 1,
    file: "steps/step1.html",
    kicker: "01 · TABLEAU DE BORD",
    title: "Tableau de bord dynamique & Drill-down 3 niveaux",
    narrative: "Esker offre une visibilité temps réel sur l'ensemble du cycle fournisseur. Ce rapport central « Factures en attente par approbateur » permet de descendre jusqu'au niveau de détail le plus fin en 3 clics.",
    action: "Cliquez sur le segment de Marc (44,4 %) dans le graphique pour analyser son portefeuille.",
    hotspot: {
      top: "43%",
      left: "47%",
      width: "120px",
      height: "70px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom-left"
    }
  },
  {
    id: 2,
    file: "steps/step2.html",
    kicker: "02 · DRILL-DOWN NIVEAU 1",
    title: "Filtrage par approbateur : Focus sur Marc",
    narrative: "Le graphique s'est recalculé instantanément : on visualise maintenant tous les fournisseurs en attente d'approbation chez Marc. Acme Supply Company représente le volume le plus critique.",
    action: "Cliquez sur la barre ACME SUPPLY COMPANY pour inspecter l'ancienneté de sa dette.",
    hotspot: {
      top: "46%",
      left: "37%",
      width: "220px",
      height: "50px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom-right"
    }
  },
  {
    id: 3,
    file: "steps/step3.html",
    kicker: "03 · DRILL-DOWN NIVEAU 2",
    title: "Balance âgée d'un fournisseur sous forme de camaïeu",
    narrative: "Troisième niveau de détail : la répartition par tranche de retard (balance âgée). On identifie immédiatement des factures échues à plus de 60 jours chez ce fournisseur.",
    action: "Cliquez sur le titre du rapport « Factures en attente par approbateur » pour ouvrir la vue détaillée.",
    hotspot: {
      top: "27.5%",
      left: "40%",
      width: "260px",
      height: "36px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom"
    }
  },
  {
    id: 4,
    file: "steps/step4.html",
    kicker: "04 · RAPPORT DÉTAILLÉ",
    title: "Vue rapport avec synchronisation graphique / tableau",
    narrative: "La vue détaillée Esker combine la représentation graphique et la table de données sous-jacente. Toutes les factures de l'entreprise sont répertoriées avec leurs statuts.",
    action: "Cliquez à nouveau sur le segment Marc pour synchroniser le tableau inférieur.",
    hotspot: {
      top: "32%",
      left: "48%",
      width: "140px",
      height: "80px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom-left"
    }
  },
  {
    id: 5,
    file: "steps/step5.html",
    kicker: "05 · FILTRAGE DYNAMIQUE",
    title: "Tableau filtré en direct sur le portefeuille de Marc",
    narrative: "Le tableau inférieur s'est immédiatement restreint aux 12 factures assignées à Marc. Aucun export Excel n'est nécessaire : l'analyse est interactive et sécurisée.",
    action: "Cliquez sur le fournisseur ACME Supply Company pour isoler ses factures.",
    hotspot: {
      top: "35%",
      left: "37%",
      width: "210px",
      height: "45px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom-right"
    }
  },
  {
    id: 6,
    file: "steps/step6.html",
    kicker: "06 · CIBLAGE CRITIQUE",
    title: "Identification de la facture en retard (60j - 90j)",
    narrative: "Dans le tableau, la facture n° 281270 d'Acme Supply (6 271,20 USD) est échue depuis plus de 60 jours avec le motif « En attente de l'entrée de biens et services ».",
    action: "Cliquez sur la ligne de la facture 281270 pour ouvrir sa fiche complète.",
    hotspot: {
      top: "62%",
      left: "22%",
      width: "480px",
      height: "34px",
      shape: "rect"
    },
    tooltip: {
      position: "top"
    }
  },
  {
    id: 7,
    file: "steps/step7.html",
    kicker: "07 · FICHE DE FACTURE",
    title: "Fiche facture complète & Visualisation du document PDF",
    narrative: "À gauche, les données extraites automatiquement et rapprochées de l'ERP. À droite, le document original. Le statut est « En attente de réception ».",
    action: "Cliquez sur l'icône de conversation interne pour interpeller Marc sans quitter Esker.",
    hotspot: {
      top: "14.5%",
      left: "91.8%",
      width: "42px",
      height: "42px",
      shape: "circle"
    },
    tooltip: {
      position: "left"
    }
  },
  {
    id: 8,
    file: "steps/step8.html",
    kicker: "08 · COLLABORATION INTÉGRÉE",
    title: "Résolution collaborative des litiges dans l'outil",
    narrative: "Fini les e-mails perdus : le fil de discussion est directement rattaché à la facture avec mention `@Marc`. Tous les échanges sont tracés et auditables.",
    action: "Cliquez sur « Factures fournisseurs » pour basculer sur la vue globale du comptable.",
    hotspot: {
      top: "4.8%",
      left: "14.5%",
      width: "160px",
      height: "36px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom"
    }
  },
  {
    id: 9,
    file: "steps/step9.html",
    kicker: "09 · ESPACE COMPTABLE",
    title: "Espace de travail du comptable : 40 factures à traiter",
    narrative: "La vue comptable regroupe les arrivées du jour. Chaque utilisateur peut personnaliser ses colonnes, filtres, tris et affichages selon ses priorités.",
    action: "Cliquez sur la ligne Stark Industries (ST2610131135-01) pour examiner son cas.",
    hotspot: {
      top: "39%",
      left: "15%",
      width: "700px",
      height: "36px",
      shape: "rect"
    },
    tooltip: {
      position: "top"
    }
  },
  {
    id: 10,
    file: "steps/step10.html",
    kicker: "10 · RAPPROCHEMENT 3 VOIES",
    title: "Rapprochement avec commande & Gestion d'un écart de montant",
    narrative: "Facture avec commande n° 4500000007. Esker a rapproché les lignes de postes et détecté une exception sur le montant hors taxes, avec workflow d'escalade automatique.",
    action: "Cliquez pour découvrir le traitement d'une facture électronique certifiée PDP.",
    hotspot: {
      top: "18%",
      left: "48%",
      width: "280px",
      height: "45px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom"
    }
  },
  {
    id: 11,
    file: "steps/step11.html",
    kicker: "11 · FACTURE ÉLECTRONIQUE (PDP)",
    title: "Facturation Électronique conforme PDP : Alertes et sécurité",
    narrative: "Reçue via la Plateforme Agréée avec pièces jointes multiples. Esker applique des contrôles stricts : alerte rouge sur un IBAN non reconnu et détection d'une référence contrat inexistante.",
    action: "Vous avez terminé la visite ! Vous pouvez revoir une étape ou contacter Fluxym.",
    hotspot: {
      top: "33%",
      left: "14%",
      width: "360px",
      height: "45px",
      shape: "rect"
    },
    tooltip: {
      position: "bottom-right"
    }
  }
];
