/* =========================================================================
   SUITES : données des niveaux 1 (suite), des synergies inter-modules
   (formalisme SOURCE-CIBLE) et de l'argumentaire Standalone vs En synergie.
   Sources documentaires : spécifications fonctionnelles Esker S2P & O2C
   (SharePoint Fluxym, interrogées via l'agent Esker le 14/10/2026).
   statut : "ok" disponible nativement, "cfg" selon configuration / option,
            "soon" bientôt / à venir
   ========================================================================= */
const SUITE_FAM = {
  eng: {n:"Contrats, prix et budgets",     c:"#6b51ed"},
  sup: {n:"Fournisseurs, risque et fraude", c:"#13b4e2"},
  inv: {n:"Factures, clôture et paiement",  c:"#f0a020"},
  ret: {n:"Pilotage 360° et retours",       c:"#e04f8b"},
  ai:  {n:"IA transverse",                  c:"#12a37d"}
};
const SUITE_STATUS = {ok:"Disponible (natif)", cfg:"Selon configuration", soon:"Bientôt / à venir"};

const SUITES = {
  S2P: {
    key:"S2P", slug:"s2p", name:"Source-to-Pay", short:"Achats et dépenses",
    title:"Source-to-Pay : un seul flux, <em>de l'appel d'offres à la facture</em>",
    lead:"Six modules sur une même plateforme. Chaque code indique le module source et le module cible (ex. SM-AP-1 : de Fournisseurs vers Factures). Filtrez par module ou par enjeu métier pour isoler les synergies et comparer la valeur de chaque module seul (Standalone) ou combiné à la suite.",
    order:["so","sm","ctm","pr","ap","em"],
    acr:{so:"SO", sm:"SM", ctm:"CTM", pr:"PR", ap:"AP", em:"EM"},
    role:{so:"Mettre en concurrence", sm:"Référencer et homologuer", ctm:"Cadrer engagements et échéances",
          pr:"Demander, commander, réceptionner", ap:"Rapprocher et valider", em:"Dépenses collaborateurs"},
    short_name:{so:"Sourcing", sm:"Fournisseurs", ctm:"Contrats", pr:"Achats", ap:"Factures", em:"Notes de frais"},
    pitch:{
      so:{
        full:"Esker Sourcing (Market Dojo)",
        solo:[
          "Digitalisation rapide des appels d'offres (RFI, RFP, RFQ) et enchères électroniques inversées, à la demande ou par abonnement.",
          "Gains achats directs sur les familles négociées (en moyenne 16 % sur les enchères) et réduction de 50 % du temps de consultation.",
          "Grilles d'évaluation multicritères automatisées et comparatif structuré des offres fournisseurs."
        ],
        syn:[
          "Amont (SM-SO) : constitution instantanée des panels à consulter à partir des fournisseurs déjà qualifiés et scorés dans SM.",
          "Aval (SO-SM) : l'attribution d'un appel d'offres déclenche sans ressaisie l'homologation administrative du fournisseur lauréat.",
          "Aval (SO-CTM & SO-PR) : génération du contrat brouillon dans CTM et alimentation des catalogues d'articles négociés dans PR."
        ]
      },
      sm:{
        full:"Supplier Management (Gestion des fournisseurs)",
        solo:[
          "Portail fournisseur en libre-service : collecte et relance automatique des pièces légales (Kbis, vigilance URSSAF, RIB, assurances) avec contrôle IA.",
          "Maîtrise des risques et conformité réglementaire (Sapin II, devoir de vigilance, connecteurs Dun & Bradstreet, EcoVadis, Sis ID).",
          "Synchronisation propre et gouvernée du référentiel tiers avec l'ERP."
        ],
        syn:[
          "Garde-fou opérationnel (SM-PR & SM-CTM) : blocage ou alerte si un opérationnel tente de commander ou contracter avec un tiers non conforme.",
          "Rempart anti-fraude (SM-AP-1) : contrôle automatique de l'IBAN lu sur chaque facture face au RIB homologué dans SM.",
          "Tour de contrôle 360° (CTM-SM, PR-SM, AP-SM) : la fiche fournisseur consolide contrats, commandes, score OTIF et statuts de paiement."
        ]
      },
      ctm:{
        full:"Contract Management (Gestion des contrats)",
        solo:[
          "Contrathèque centralisée et sécurisée avec recherche plein texte, extraction IA des clauses/dates et gestion des avenants.",
          "Circuits d'approbation juridique et financier avec signature électronique native (DocuSign, Adobe Sign).",
          "Alertes automatiques d'échéance et de préavis pour éliminer les reconductions tacites subies."
        ],
        syn:[
          "Exécution en 1 clic (CTM-PR-1 & CTM-PR-2) : création directe d'une demande d'achat depuis le contrat et contrôle des plafonds d'engagement.",
          "Touchless sur les factures sans commande (CTM-AP) : les calendriers de facturation pré-approuvés valident automatiquement loyers et abonnements dans AP.",
          "Contrat financièrement vivant (PR-CTM & AP-CTM) : suivi en temps réel du Total engagé (PR) et du Total facturé (AP) face à l'enveloppe contractuelle."
        ]
      },
      pr:{
        full:"E-Procurement (Demandes d'achat & Commandes)",
        solo:[
          "Expérience d'achat guidée (catalogues internes, Punch-Out Amazon Business / Manutan, devis PDF lu par IA en 30 s) favorisant l'adoption.",
          "Contrôle budgétaire a priori : vérification temps réel de l'enveloppe disponible avant l'émission du bon de commande.",
          "Enregistrement des réceptions (Goods Receipts) totales ou partielles sur web et mobile (Esker Anywhere)."
        ],
        syn:[
          "Moteur du Touchless comptable (PR-AP-1) : chaque commande et réception validée prépare le rapprochement automatique 2 ou 3 voies avec héritage analytique.",
          "Clôture comptable accélérée (PR-AP-2) : calcul exact et automatisé des provisions pour Factures Non Parvenues (FNP = Réceptionné PR − Facturé AP).",
          "Achats sous contrôle (SM-PR & CTM-PR) : commandes restreintes aux tiers qualifiés et imputées sur les tarifs et plafonds des contrats."
        ]
      },
      ap:{
        full:"Accounts Payable (Factures fournisseurs)",
        solo:[
          "Capture omnicanale et lecture IA (Synergy AI) des factures en-tête et lignes, conforme Facturation Électronique (PA / e-invoicing).",
          "Rapprochement automatique avec les commandes de l'ERP, circuits de validation des factures sans commande et gestion des litiges.",
          "Intégration ERP temps réel, calcul des FNP et archivage légal à valeur probante."
        ],
        syn:[
          "Taux de Touchless maximal (PR-AP-1 & CTM-AP) : réconciliation native avec les commandes/réceptions de PR ET les échéanciers de contrats CTM.",
          "Sécurité et portail fournisseur (SM-AP-1, SM-AP-2, AP-SM) : contrôle IBAN anti-fraude, PO-Flip en 1 clic, visibilité des paiements 24/7 et escompte dynamique.",
          "Décaissement unifié (EM-AP) : transformation en 1 clic des notes de frais approuvées en factures à payer dans le même flux ERP."
        ]
      },
      em:{
        full:"Expense Management (Notes de frais)",
        solo:[
          "Saisie mobile instantanée (Esker Anywhere) : photo du reçu avec OCR/IA, indemnités kilométriques Google Maps et ventilation multi-TVA.",
          "Contrôle automatique de la politique voyages (plafonds par nature, doublons, dépenses week-end).",
          "Réconciliation automatique des relevés de cartes corporate (Visa, Mastercard, Amex) et gestion des avances."
        ],
        syn:[
          "Chaîne comptable unifiée (EM-AP) : l'action « Approuver et créer une facture » génère automatiquement la pièce à payer dans AP avec justificatifs et TVA.",
          "Pilotage budgétaire complet (EM-PR) : partage des mêmes Centres de coût et Codes projet pour consolider achats commandés et frais de mission.",
          "Réduction des achats sauvages (EM-SM) : détection des marchands récurrents payés par carte pour les rapatrier sous contrat."
        ]
      }
    },
    syn:[
      /* === 10 SYNERGIES MAJEURES (core: true — affichées par défaut) === */
      {n:"SO-SM", from:"so", to:"sm", fam:"sup", side:"up", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Homologation auto du fournisseur lauréat",
       p:"L'attribution d'un appel d'offres dans Sourcing lance directement l'onboarding du fournisseur retenu.",
       d:[
         "À l'adjudication (Award) dans Sourcing, les données du fournisseur lauréat alimentent la table S2P - Fournisseurs dans SM.",
         "Si le tiers est nouveau, Esker déclenche automatiquement la demande d'enregistrement et l'invitation au portail fournisseur.",
         "Collecte et vérification IA des pièces légales (Kbis, vigilance URSSAF, RIB, assurance, questionnaire RSE) avant toute commande.",
         "Gain : zéro ressaisie entre l'acheteur négociateur et l'homologation administrative."
       ]},
      {n:"SO-CTM", from:"so", to:"ctm", fam:"eng", side:"up", core:true, lvl:2.6, tp:0.38, st:"cfg",
       t:"De l'appel d'offres au contrat",
       p:"Le fournisseur retenu, les montants et les grilles négociées génèrent la fiche contrat.",
       d:[
         "L'attribution du marché crée une fiche contrat à l'état Brouillon dans Contract Management.",
         "Reprise du fournisseur retenu, des montants ou plafonds négociés, des dates d'effet, de la devise et des documents joints.",
         "Enchaînement direct avec le workflow de validation juridique/financier et la signature électronique (DocuSign / Adobe Sign).",
         "Gain : contractualisation immédiate des économies négociées et piste d'audit continue."
       ]},
      {n:"SM-PR", from:"sm", to:"pr", fam:"sup", side:"down", core:true, lvl:2.3, tp:0.36, st:"ok",
       t:"On n'achète qu'aux fournisseurs validés",
       p:"Seuls les fournisseurs homologués dans SM peuvent être commandés sans blocage dans Achats.",
       d:[
         "Lors de la saisie d'une demande d'achat dans PR, le champ fournisseur interroge en temps réel la table S2P - Fournisseurs gérée par SM.",
         "Si le fournisseur est bloqué ou non qualifié, la commande est bloquée ; s'il est en cours d'enregistrement, l'émission du BC est retenue.",
         "Le panneau Transmission des commandes de la fiche SM détermine automatiquement le canal d'envoi du BC (portail, e-mail PDF, EDI/cXML ou Punch-Out).",
         "Gain : 100 % des dépenses opérationnelles sont orientées vers des tiers conformes et actifs."
       ]},
      {n:"CTM-PR-1", from:"ctm", to:"pr", fam:"eng", side:"up", core:true, lvl:1.0, tp:0.28, st:"ok",
       t:"Demande d'achat en 1 clic depuis le contrat",
       p:"Depuis un contrat actif, un bouton génère une demande d'achat pré-remplie aux tarifs négociés.",
       d:[
         "Dans la fiche contrat (CTM), le panneau Articles du catalogue expose les articles liés et le bouton natif « Créer une demande d'achat ».",
         "La demande d'achat s'ouvre dans PR pré-remplie avec le fournisseur, le numéro de contrat (ContractNumber) et les tarifs contractuels.",
         "Supprime toute erreur de référence ou de prix lors des commandes passées en exécution d'un accord-cadre."
       ]},
      {n:"PR-CTM", from:"pr", to:"ctm", fam:"ret", side:"down", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Suivi temps réel de l'engagé sur contrat",
       p:"Chaque commande approuvée dans Achats incrémente le Total engagé du contrat et alerte au seuil.",
       d:[
         "Dès qu'une commande rattachée à un contrat est approuvée dans PR, son montant HT met à jour les compteurs Total engagé et Commandé dans CTM.",
         "Les commandes et lignes d'articles commandés remontent automatiquement dans les onglets dédiés de la fiche contrat.",
         "Si le cumul atteint le seuil d'alerte paramétré (ex. 80 % du plafond du contrat), un e-mail prévient le propriétaire du contrat.",
         "Gain : pilotage en continu du taux de consommation (Contract Burn Rate) avant épuisement du contrat."
       ]},
      {n:"CTM-AP", from:"ctm", to:"ap", fam:"eng", side:"up", core:true, lvl:3.2, tp:0.50, st:"ok",
       t:"Factures récurrentes sans commande (Touchless)",
       p:"Les factures d'abonnement ou de loyer se valident seules face au calendrier de facturation du contrat.",
       d:[
         "Pour les contrats périodiques sans bon de commande (loyers, abonnements, maintenance), CTM porte un Calendrier de facturation pré-approuvé.",
         "L'échéancier définit la périodicité, le montant attendu, les tolérances d'écart (en € ou %) et l'imputation analytique.",
         "À l'arrivée de la facture dans AP, Esker la rapproche de l'échéance du contrat : si elle est dans la tolérance, elle passe en 100 % Touchless sans relancer les valideurs.",
         "Exemple type : une prestation annuelle de 100 k€ facturée 8,3 k€ chaque mois."
       ]},
      {n:"PR-AP-1", from:"pr", to:"ap", fam:"inv", side:"up", core:true, lvl:1.0, tp:0.28, st:"ok",
       t:"Rapprochement 2 et 3 voies & héritage analytique",
       p:"La facture est comparée ligne à ligne à la commande et à la réception, et hérite de l'imputation.",
       d:[
         "Les bons de commande validés et les réceptions (Goods Receipts) enregistrés dans PR alimentent en temps réel le moteur de réconciliation d'AP.",
         "À réception de la facture, Synergy AI rapproche chaque ligne (2-way match sur montant/service ou 3-way match sur quantité × prix unitaire).",
         "Si l'écart est dans la tolérance, la facture hérite automatiquement des comptes généraux, centres de coûts et projets saisis lors de la DA et passe en Touchless.",
         "En cas d'écart de prix ou de quantité non reçue, le workflow route automatiquement la facture vers l'acheteur ou le réceptionnaire identifié sur le BC."
       ],
       note:"Sans le module Achats, le rapprochement dans AP reste possible avec des commandes importées de l'ERP, mais sans saisie des réceptions par les opérationnels ni contrôle du budget avant d'engager."},
      {n:"SM-AP-1", from:"sm", to:"ap", fam:"sup", side:"down", core:true, lvl:3.6, tp:0.52, st:"ok",
       t:"IBAN contrôlé, fraude au RIB bloquée",
       p:"L'IBAN lu par IA sur chaque facture est comparé au RIB homologué dans Fournisseurs avant paiement.",
       d:[
         "Sur chaque facture capturée dans AP, Synergy AI extrait l'IBAN imprimé et le compare aux coordonnées bancaires certifiées dans la fiche SM.",
         "Toute demande de changement de RIB dans SM suit un workflow d'approbation à double regard et peut être vérifiée via Sis ID / Trustpair.",
         "Si l'IBAN de la facture diffère ou n'est pas validé, AP lève une alerte bloquante qui interdit la mise en paiement."
       ]},
      {n:"AP-SM", from:"ap", to:"sm", fam:"ret", side:"up", core:true, lvl:4.8, tp:0.52, st:"ok",
       t:"Statuts de paiement portail & escompte dynamique",
       p:"Les statuts de facture sont publiés en temps réel sur le portail fournisseur, supprimant 70 % des appels.",
       d:[
         "AP publie en temps réel sur le portail SM et dans l'onglet Factures de la fiche fournisseur le statut de chaque pièce (Reçue, En approbation, Bloquée, Approuvée, Payée).",
         "Élimine 60 à 80 % des appels et e-mails entrants des fournisseurs demandant « Où en est le règlement de ma facture ? ».",
         "Sur les factures approuvées (statut À payer), le fournisseur peut demander sur le portail un paiement anticipé contre escompte (Dynamic Discounting, selon activation)."
       ]},
      {n:"EM-AP", from:"em", to:"ap", fam:"inv", side:"down", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Note de frais convertie en facture à payer",
       p:"Après validation, la note de frais génère en 1 clic une pièce comptable prête au décaissement dans AP.",
       d:[
         "Lorsqu'une note de frais est approuvée dans EM, l'action du contrôleur sur « Approuver et créer une facture » génère automatiquement la pièce dans AP.",
         "Toutes les lignes d'imputation comptable, la ventilation multi-taux de TVA calculée dans EM et le PDF des justificatifs sont attachés à la pièce AP.",
         "Les remboursements collaborateurs et les relevés de cartes corporate suivent exactement le même moteur d'intégration ERP et d'audit que les factures fournisseurs."
       ]},

      /* === 12 SYNERGIES AVANCÉES (core: false — visibles en mode « Toutes les synergies » ou par filtre module / famille) === */
      {n:"SM-SO", from:"sm", to:"so", fam:"sup", side:"down", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Panel qualifié et scoré pour consultation",
       p:"L'acheteur sélectionne son panel d'appel d'offres parmi les fournisseurs qualifiés et notés dans SM.",
       d:[
         "Le référentiel S2P - Fournisseurs (catégories d'achats, statuts de conformité, scores financiers D&B et scores RSE EcoVadis) est synchronisé avec Sourcing.",
         "Permet d'inviter en quelques clics un panel de fournisseurs déjà conformes et d'exclure en amont les tiers en défaillance ou sous sanction."
       ]},
      {n:"SO-PR", from:"so", to:"pr", fam:"eng", side:"up", core:false, lvl:4.0, tp:0.54, st:"cfg",
       t:"Grilles négociées vers catalogues d'achats",
       p:"Les bordereaux de prix unitaires remportés en appel d'offres alimentent les catalogues d'Achats.",
       d:[
         "Les articles, prix unitaires, paliers de quantité, devises et délais négociés lors des RFQ ou enchères mettent à jour la table des articles de PR (P2P - Items).",
         "Transforme immédiatement les économies théoriques négociées en économies réellement appliquées sur les commandes des opérationnels."
       ]},
      {n:"SM-CTM", from:"sm", to:"ctm", fam:"sup", side:"up", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Statut d'homologation et score de risque sur le contrat",
       p:"La fiche contrat affiche en temps réel la conformité et le niveau de risque du fournisseur.",
       d:[
         "Le panneau Contact fournisseur d'un contrat CTM pointe directement sur la fiche SM du tiers.",
         "Affiche le badge de statut d'onboarding et la jauge de risque global (documents légaux expirés, score financier D&B, score RSE).",
         "Un contrôle bloquant ou une alerte empêche d'activer un contrat si le fournisseur est bloqué ou non conforme dans SM."
       ]},
      {n:"CTM-SM", from:"ctm", to:"sm", fam:"ret", side:"down", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Portefeuille contrats dans la fiche fournisseur 360°",
       p:"La fiche fournisseur regroupe tous les contrats actifs, leurs montants engagés et leurs préavis.",
       d:[
         "L'écran récapitulatif Entité fournisseur dans SM comporte un onglet natif Contrats.",
         "Consolide dynamiquement tous les contrats actifs, en négociation, arrivant à échéance ou expirés liés à ce fournisseur dans CTM.",
         "Donne à l'acheteur une vision complète de l'exposition contractuelle lors des revues de performance fournisseur (Business Reviews)."
       ]},
      {n:"CTM-PR-2", from:"ctm", to:"pr", fam:"eng", side:"up", core:false, lvl:2.35, tp:0.72, st:"ok",
       t:"Contrôle des dates d'effet et du plafond contractuel",
       p:"Chaque demande d'achat rattachée à un contrat vérifie sa validité et son plafond financier.",
       d:[
         "Lorsqu'un demandeur rattache une DA à un contrat dans PR, Esker vérifie que la date du jour est comprise dans les dates d'effet du contrat.",
         "Le montant de la demande est contrôlé face aux seuils (Montant min / Montant max) définis dans le panneau Seuils des dépenses du contrat CTM.",
         "En cas de dépassement du plafond maximal autorisé, une alerte ou un blocage intervient dès la demande d'achat."
       ]},
      {n:"PR-SM", from:"pr", to:"sm", fam:"ret", side:"up", core:false, lvl:3.3, tp:0.68, st:"ok",
       t:"Réceptions et score de performance logistique (OTIF)",
       p:"Les réceptions et délais réels constatés dans Achats alimentent la notation du fournisseur dans SM.",
       d:[
         "Tous les bons de commande émis dans PR remontent dans l'onglet Commandes de la fiche SM et sur le portail fournisseur (accusé de réception, avis d'expédition ASN).",
         "Les données de réception (respect des délais de livraison, conformité des quantités livrées, litiges) alimentent les Scorecards d'évaluation fournisseur dans SM."
       ]},
      {n:"PR-AP-2", from:"pr", to:"ap", fam:"inv", side:"up", core:false, lvl:2.35, tp:0.72, st:"ok",
       t:"Calcul automatisé des provisions FNP en clôture",
       p:"Les réceptions validées dans Achats mais non encore facturées dans AP génèrent les écritures de FNP.",
       d:[
         "À chaque arrêté comptable mensuel ou trimestriel, Esker compare les réceptions enregistrées dans PR (Service fait / BL) et les factures comptabilisées dans AP.",
         "Tout écart (Réceptionné PR > Facturé AP) alimente automatiquement l'état des provisions pour Factures Non Parvenues (FNP / Accruals) prêt à comptabiliser."
       ]},
      {n:"AP-PR", from:"ap", to:"pr", fam:"ret", side:"down", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Mise à jour du reliquat facturé et clôture du BC",
       p:"La validation de la facture dans AP met à jour les lignes du bon de commande et son statut dans Achats.",
       d:[
         "Dès qu'une facture fournisseur est validée dans AP, les quantités et montants facturés sont répercutés ligne à ligne sur le bon de commande dans PR.",
         "Le statut du BC passe automatiquement à Facturé partiellement ou Clôturé/Facturé, avec un lien direct pour ouvrir le PDF de la facture depuis la commande."
       ]},
      {n:"AP-CTM", from:"ap", to:"ctm", fam:"ret", side:"down", core:false, lvl:2.4, tp:0.58, st:"ok",
       t:"Consommation facturée réelle sur la fiche contrat",
       p:"Chaque facture comptabilisée dans AP met à jour le Total facturé et la courbe mensuelle du contrat.",
       d:[
         "Dès qu'une facture rattachée à un contrat (avec ou sans commande) est comptabilisée dans AP, elle incrémente les compteurs Facturé (avec commande) ou Facturé (sans commande) dans CTM.",
         "La facture s'affiche dans l'onglet Factures du contrat et alimente le graphique de consommation mensuelle ; une alerte part si le plafond du contrat est dépassé."
       ]},
      {n:"SM-AP-2", from:"sm", to:"ap", fam:"inv", side:"down", core:false, lvl:4.4, tp:0.36, st:"ok",
       t:"Dépôt portail et conversion BC en facture (PO-Flip)",
       p:"Sur le portail géré via SM, le fournisseur dépose ses factures ou convertit son BC en facture en 1 clic.",
       d:[
         "Le portail fournisseur permet au fournisseur de consulter ses bons de commande et de les transformer en facture électronique en un clic (PO-Flip).",
         "La facture reprend exactement les lignes, quantités et tarifs du BC et arrive directement dans AP prête pour un rapprochement Touchless sans écart."
       ]},
      {n:"EM-PR", from:"em", to:"pr", fam:"eng", side:"down", core:false, lvl:2.5, tp:0.64, st:"ok",
       t:"Consolidation analytique sur les budgets projets",
       p:"Notes de frais et demandes d'achat partagent les mêmes centres de coûts et codes projets.",
       d:[
         "EM et PR s'appuient sur les mêmes tables maîtres analytiques (S2P - Centres de coût, S2P - Codes projet, S2P - Codes société).",
         "Les frais de mission imputés sur un code projet dans EM se consolident avec les achats commandés sur ce même projet dans PR pour suivre le coût de revient complet."
       ]},
      {n:"EM-SM", from:"em", to:"sm", fam:"sup", side:"down", core:false, lvl:5.0, tp:0.54, st:"cfg",
       t:"Détection des achats sauvages payés par carte",
       p:"L'analyse des marchands récurrents en notes de frais identifie les dépenses à rapatrier sous contrat.",
       d:[
         "L'exploitation des dépenses issues des notes de frais et des flux de cartes corporate (Visa, Mastercard, Amex) dans EM met en évidence les marchands récurrents.",
         "Permet à la Direction des Achats de repérer les achats de fournitures ou d'abonnements payés par carte hors processus pour les rattacher à des fournisseurs homologués dans SM."
       ]}
    ],
    ai:{t:"Synergy, l'IA à chaque étape", st:"ok",
        p:"Lire un devis, vérifier la conformité d'un Kbis, extraire les clauses d'un contrat, rapprocher une facture ligne à ligne ou lire un reçu mobile : Esker Synergy IA agit sur les 6 modules avec les mêmes droits et la même piste d'audit.",
        d:[
          "Synergy IA : disponible nativement dans les 6 modules S2P (extraction, suggestion analytique, détection d'anomalies et de doublons)",
          "Approbation et demande dans Microsoft Teams (module Achats) : bientôt (annoncée dans la démo Achats)",
          "Agents IA connectés via MCP (Model Context Protocol) : à venir"
        ]},
    chain:true
  },

  O2C: {
    key:"O2C", slug:"o2c", name:"Order-to-Cash", short:"Clients et encaissements",
    title:"Order-to-Cash : <em>du risque crédit à l'encaissement</em>",
    lead:"Sept modules sur un référentiel client et un portail uniques. Chaque code indique le module source et le module cible (ex. CM-OM : de Crédit client vers Commandes). Filtrez par module ou par enjeu pour explorer les synergies.",
    preview:false,
    order:["crm","cim","om","id","ca","cd","com"],
    acr:{crm:"CM", cim:"CS", om:"OM", id:"ID", ca:"CA", cd:"CD", com:"CL"},
    role:{crm:"Évaluer le risque client", cim:"Centraliser les demandes", om:"Valider les commandes", id:"Diffuser les factures",
          ca:"Lettrer les encaissements", cd:"Résoudre litiges et déductions", com:"Piloter le recouvrement"},
    short_name:{crm:"Crédit", cim:"Demandes clients", om:"Commandes", id:"Factures clients", ca:"Encaissements", cd:"Litiges", com:"Recouvrement"},
    pitch:{
      crm:{
        full:"Credit Management (Gestion du risque crédit)",
        solo:[
          "Onboarding crédit digitalisé (formulaire web client) et workflows d'approbation des limites de crédit.",
          "Connecteurs natifs aux agences de notation et assureurs-crédit (D&B, Ellisphere, Creditsafe, Coface, Allianz Trade).",
          "Calcul automatisé du score de risque et alertes de veille sur défaillance."
        ],
        syn:[
          "Aval (CM-OM) : blocage préventif automatique (Credit Hold) des commandes clients dépassant la limite de crédit autorisée.",
          "Amont (CL-CM) : réévaluation dynamique du score de risque selon les retards de paiement réels et promesses non tenues dans Recouvrement."
        ]
      },
      cim:{
        full:"Customer Inquiries (Service client)",
        solo:[
          "Boîte de réception collaborative intelligente remplaçant les boîtes Outlook partagées de l'ADV.",
          "Détection automatique de l'intention et du sentiment par Synergy AI pour prioriser les demandes urgentes.",
          "Réponses assistées par IA générative (Synergy-GPT) et suivi des SLA."
        ],
        syn:[
          "Amont (OM-CS) : accès direct aux statuts de commande en temps réel pour répondre dès le premier contact.",
          "Aval (CS-CD) : conversion en 1 clic d'un e-mail de réclamation client en dossier de litige structuré dans CD."
        ]
      },
      om:{
        full:"Order Management (Prise de commandes clients)",
        solo:[
          "Capture omnicanale et extraction IA sans modèle des commandes clients (PDF, e-mail, Excel, EDI) avec 80 % de gain de temps.",
          "Contrôles métiers automatisés (références articles, tarifs, quantités minimales) avant création dans l'ERP.",
          "Visibilité temps réel des commandes en anomalie."
        ],
        syn:[
          "Amont (CM-OM) : sécurisation financière dès la réception de la commande par contrôle temps réel de l'exposition crédit.",
          "Aval (OM-CS & OM-ID) : partage du statut de commande avec le Service Client et annexion du bon de commande original à la facture."
        ]
      },
      id:{
        full:"Invoice Delivery (Facturation client)",
        solo:[
          "Diffusion omnicanale automatisée (Portail, e-mail, EDI, Peppol, Plateforme Agréée e-invoicing dans +60 pays, courrier).",
          "Archivage légal à valeur probante et réduction jusqu'à 80 % des coûts d'envoi.",
          "Portail client en libre-service 24/7."
        ],
        syn:[
          "Aval (ID-CL) : preuve horodatée de réception et d'ouverture de la facture transmise au Recouvrement (fin de l'excuse « facture non reçue »).",
          "Aval (ID-CA) : paiement en ligne sur le portail transmis nativement à Encaissements pour un lettrage automatique à 100 %."
        ]
      },
      ca:{
        full:"Cash Application (Lettrage des encaissements)",
        solo:[
          "Rapprochement automatique par IA des relevés bancaires (CAMT.053, MT940, BAI2) et des avis de paiement (PDF, Excel, e-mail) avec les factures ouvertes.",
          "Taux élevé de lettrage automatique réduisant le cash non affecté (Unapplied Cash)."
        ],
        syn:[
          "Aval (CA-CD) : lors d'un paiement partiel, lettrage immédiat du cash reçu et création automatique d'un dossier de déduction dans CD pour l'écart.",
          "Aval (CA-CL) : arrêt immédiat des relances et sortie de la liste d'appels dès qu'un virement est lettré le matin."
        ]
      },
      cd:{
        full:"Claims & Deductions (Litiges et déductions)",
        solo:[
          "Centralisation, qualification par motif (Reason Codes : casse, écart de prix, pénalité GSA) et workflow de résolution des litiges.",
          "Collaboration structurée entre Finance, ADV, Logistique et Commercial avec suivi des SLA.",
          "Génération automatisée des demandes d'avoir ou des courriers de rejet."
        ],
        syn:[
          "Amont (CA-CD & CS-CD) : ouverture sans ressaisie des dossiers de litige depuis un paiement partiel ou un e-mail client.",
          "Aval (CD-CL) : suspension automatique des relances sur le montant contesté pendant l'instruction et reprise automatique après résolution."
        ]
      },
      com:{
        full:"Collections Management (Recouvrement)",
        solo:[
          "Automatisation des relances préventives et curatives (e-mail, courrier, SMS) et agenda d'appels priorisé par IA.",
          "Suivi des promesses de paiement, plans d'apurement et tableaux de bord DSO / CEI."
        ],
        syn:[
          "Amont (ID-CL, CA-CL, CD-CL) : relances 100 % pertinentes grâce à la preuve de lecture de facture, au gel des factures en litige et à l'arrêt dès lettrage.",
          "Aval (CL-CM) : escalade automatique vers Crédit Client pour réviser la limite d'un compte en retard critique."
        ]
      }
    },
    syn:[
      {n:"CM-OM", from:"crm", to:"om", fam:"eng", side:"up", core:true, lvl:2.2, tp:0.50, st:"ok",
       t:"Contrôle de limite de crédit dès la commande",
       p:"Toute commande dépassant l'exposition crédit autorisée est mise en attente (Credit Hold) avant l'ERP.",
       d:[
         "À la validation d'une commande dans OM, Esker vérifie l'exposition temps réel gérée par CM (encours facturé + commandes en cours + nouvelle commande).",
         "En cas de dépassement ou de compte bloqué, la commande passe en attente de crédit et alerte l'analyste dans CM.",
         "Dès approbation d'une dérogation ou relèvement de limite dans CM, la commande est libérée automatiquement dans OM."
       ]},
      {n:"OM-CS", from:"om", to:"cim", fam:"ret", side:"down", core:true, lvl:1.1, tp:0.50, st:"ok",
       t:"Statuts de commande temps réel pour le Service Client",
       p:"L'agent Service Client voit l'avancement exact de la commande et convertit un e-mail en commande.",
       d:[
         "Lorsqu'un client écrit pour demander le statut de sa commande, Synergy AI dans CS interroge directement OM et propose la réponse avec les pièces liées.",
         "Inversement, un bon de commande reçu sur la boîte du Service Client (CS) est transféré en 1 clic vers OM pour extraction."
       ]},
      {n:"OM-ID", from:"om", to:"id", fam:"inv", side:"up", core:true, lvl:1.1, tp:0.50, st:"cfg",
       t:"Bon de commande original rattaché à la facture",
       p:"Le bon de commande capturé dans OM suit le dossier et peut être annexé au PDF de la facture.",
       d:[
         "Le bon de commande initial du client, capturé et archivé dans OM, est lié à la facture correspondante dans ID.",
         "Selon les exigences du client acheteur, ID joint automatiquement la copie du BC initial à la facture pour éviter tout rejet."
       ]},
      {n:"ID-CL", from:"id", to:"com", fam:"inv", side:"up", core:true, lvl:3.4, tp:0.52, st:"ok",
       t:"Preuve de réception et d'ouverture de la facture",
       p:"Le chargé de recouvrement sait en temps réel si la facture a été reçue, lue ou téléchargée.",
       d:[
         "Toute facture diffusée par ID alimente la balance âgée dans CL avec sa traçabilité de diffusion (reçue, ouverte sur le portail, ou en rebond e-mail).",
         "Élimine le premier motif de retard (« Je n'ai jamais reçu votre facture ») et permet le renvoi du duplicata en 1 clic."
       ]},
      {n:"ID-CA", from:"id", to:"ca", fam:"inv", side:"up", core:true, lvl:1.1, tp:0.50, st:"ok",
       t:"Paiement sur le portail lettré à 100 %",
       p:"Une facture payée en ligne sur le portail client est lettrée automatiquement sans intervention humaine.",
       d:[
         "Le portail alimenté par ID permet au client de payer ses factures en ligne (carte bancaire, prélèvement SEPA / ACH).",
         "Le détail des factures réglées est transmis nativement à CA pour un rapprochement automatique à 100 %."
       ]},
      {n:"CA-CD", from:"ca", to:"cd", fam:"inv", side:"up", core:true, lvl:1.1, tp:0.50, st:"ok",
       t:"Paiement partiel converti en dossier de déduction",
       p:"Lors d'un règlement partiel, CA lettre le cash reçu et ouvre automatiquement le litige résiduel dans CD.",
       d:[
         "Si un client pratique une retenue ou un paiement partiel (Short Payment), CA comptabilise immédiatement le montant encaissé.",
         "L'écart résiduel crée automatiquement un dossier dans CD avec l'avis de paiement joint et le motif (Reason Code) extrait par Synergy AI."
       ]},
      {n:"CD-CL", from:"cd", to:"com", fam:"sup", side:"down", core:true, lvl:1.1, tp:0.50, st:"ok",
       t:"Suspension automatique des relances en cas de litige",
       p:"Un litige ouvert dans CD gèle automatiquement les relances sur le montant contesté dans Recouvrement.",
       d:[
         "Dès qu'une facture (ou une partie de facture) est en litige dans CD, son statut passe en En litige dans CL, ce qui suspend les relances automatiques sur la part contestée.",
         "Dès que le litige est résolu ou rejeté dans CD, la facture réintègre automatiquement le scénario de relance CL."
       ]},
      {n:"CA-CL", from:"ca", to:"com", fam:"ret", side:"up", core:false, lvl:2.3, tp:0.56, st:"ok",
       t:"Arrêt immédiat des relances dès le lettrage",
       p:"Dès qu'un paiement est lettré dans CA, la facture sort instantanément de la liste d'appels CL.",
       d:[
         "La réconciliation effectuée le matin dans CA met immédiatement à jour l'encours ouvert dans Esker, avant même les traitements batch de nuit.",
         "Garantit qu'aucun chargé de recouvrement n'appelle un client qui vient de payer."
       ]},
      {n:"CS-CD", from:"cim", to:"cd", fam:"sup", side:"down", core:false, lvl:2.8, tp:0.48, st:"ok",
       t:"E-mail de réclamation converti en litige suivi",
       p:"Un e-mail client signalant une avarie ou un écart de prix devient en 1 clic un dossier d'instruction CD.",
       d:[
         "Synergy AI dans CS catégorise les e-mails entrants portant sur une contestation de facture ou un problème de livraison.",
         "L'agent crée en 1 clic la fiche de réclamation dans CD avec toutes les pièces jointes et l'historique de la conversation."
       ]},
      {n:"CL-CM", from:"com", to:"crm", fam:"eng", side:"down", core:false, lvl:4.2, tp:0.50, st:"ok",
       t:"Comportement de paiement réel vers révision du crédit",
       p:"Les retards constatés et promesses non tenues dans CL déclenchent une revue de limite de crédit dans CM.",
       d:[
         "Le délai moyen de paiement réel (ADP), la balance âgée et les promesses non respectées dans CL alimentent en continu le score de risque dans CM.",
         "Au-delà d'un seuil de retard critique, CM déclenche automatiquement une demande de révision de la limite de crédit."
       ]}
    ],
    ai:{t:"Synergy, l'IA à chaque étape", st:"ok",
        p:"Extraire les commandes sans modèle, détecter l'intention des e-mails clients, prioriser les appels de recouvrement, lettrer les avis de paiement et qualifier les déductions : Synergy IA accélère tout le cycle Order-to-Cash.",
        d:["Synergy IA : disponible sur les 7 modules Order-to-Cash"]},
    chain:false
  }
};

/* Chaîne financière : exemple d'une prestation de 100 k€ par an (montants en k€) */
const FIN_STEPS = [
  {k:"start", t:"Départ", s:"Budget annuel du service : 100 k€", d:"Rien n'est encore demandé : tout le budget est disponible.",
   b:{pre:0, eng:0, con:0}, fnp:0, paid:0, scope:"esker"},
  {k:"da", t:"Demande d'achat", s:"Pré-engagement", d:"Le demandeur saisit la prestation annuelle de 100 k€. Le budget la réserve avant même la commande.",
   b:{pre:100, eng:0, con:0}, fnp:0, paid:0, scope:"esker"},
  {k:"po", t:"Commande", s:"Engagement", d:"La demande est approuvée et la commande part : l'entreprise est engagée envers le fournisseur.",
   b:{pre:0, eng:100, con:0}, fnp:0, paid:0, scope:"esker"},
  {k:"gr", t:"Réception de janvier", s:"Service fait", d:"Le mois de prestation est réceptionné. Tant que la facture n'est pas arrivée, ces 8,3 k€ sont une facture non parvenue.",
   b:{pre:0, eng:100, con:0}, fnp:8.3, paid:0, scope:"esker"},
  {k:"inv", t:"Facture de janvier", s:"Charge constatée", d:"La facture est rapprochée de la commande et de la réception : 8,3 k€ passent d'engagé à consommé. C'est ici que l'engagement est soldé.",
   b:{pre:0, eng:91.7, con:8.3}, fnp:0, paid:0, scope:"esker"},
  {k:"pay", t:"Paiement", s:"Trésorerie", d:"Le paiement part de l'ERP ou de la banque. Le budget ne bouge pas : la charge était déjà constatée à l'étape précédente.",
   b:{pre:0, eng:91.7, con:8.3}, fnp:0, paid:8.3, scope:"erp"}
];
