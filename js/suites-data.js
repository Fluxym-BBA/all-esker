/* =========================================================================
   SUITES : données des niveaux 1 (suite), des synergies inter-modules
   (formalisme SOURCE-CIBLE) et du Studio Standalone vs En synergie.
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
    lead:"Six modules sur une même plateforme. Chaque code indique le module émetteur et le module récepteur (ex. SM-AP-1 : de Fournisseurs vers Factures). Sélectionnez un ou plusieurs modules pour isoler leurs synergies, cliquez sur le + d'un flux pour l'inspecter, ou comparez la valeur d'un module seul (Standalone) face à la suite.",
    order:["so","sm","ctm","pr","ap","em"],
    acr:{so:"SO", sm:"SM", ctm:"CTM", pr:"PR", ap:"AP", em:"EM"},
    role:{so:"Mettre en concurrence", sm:"Référencer et homologuer", ctm:"Cadrer engagements et échéances",
          pr:"Demander, commander, réceptionner", ap:"Rapprocher et valider", em:"Dépenses collaborateurs"},
    short_name:{so:"Sourcing", sm:"Fournisseurs", ctm:"Contrats", pr:"Achats", ap:"Factures", em:"Notes de frais"},
    pitch:{
      so:{
        full:"Esker Sourcing (Market Dojo)",
        solo:[
          {k:"Consultations rapides", d:"Digitalisation des appels d'offres (RFI, RFP, RFQ) et enchères électroniques inversées, à la demande ou par abonnement."},
          {k:"Gains achats directs", d:"En moyenne 16 % d'économies sur les enchères et réduction de 50 % du temps de préparation des consultations."},
          {k:"Comparatif multicritères", d:"Pondération automatisée des réponses techniques, commerciales et RSE des soumissionnaires."}
        ],
        limit:"Déployé seul : le fournisseur retenu doit être ressaisi manuellement dans le référentiel tiers, et les tarifs négociés doivent être recopiés dans le contrat et les catalogues.",
        syn:[
          {k:"Panel sécurisé en amont (SM-SO)", d:"Constitution instantanée des listes de soumissionnaires à partir des fournisseurs déjà qualifiés et scorés dans SM."},
          {k:"Homologation sans ressaisie (SO-SM)", d:"L'attribution d'un appel d'offres déclenche automatiquement l'onboarding administratif du fournisseur lauréat."},
          {k:"Gains verrouillés en aval (SO-CTM & SO-PR)", d:"Création du contrat brouillon dans CTM et alimentation des catalogues d'articles négociés dans PR."}
        ],
        upsell:"Rebond commercial : proposer Fournisseurs (SM) et Contrats (CTM) pour qu'aucun gain négocié sur appel d'offres ne se perde avant la première commande."
      },
      sm:{
        full:"Supplier Management (Gestion des fournisseurs)",
        solo:[
          {k:"Onboarding self-service", d:"Portail de collecte et relance automatique des pièces légales (Kbis, vigilance URSSAF, RIB, assurances) avec contrôle IA."},
          {k:"Conformité & risques tiers", d:"Mise en conformité Loi Sapin II, devoir de vigilance et connecteurs natifs Dun & Bradstreet, EcoVadis et Sis ID."},
          {k:"Référentiel ERP propre", d:"Workflow d'approbation des créations et modifications de fiches tiers synchronisé avec l'ERP."}
        ],
        limit:"Déployé seul : l'homologation reste déconnectée de la prise de commande quotidienne et du contrôle automatique des factures entrantes.",
        syn:[
          {k:"Garde-fou sur les engagements (SM-PR & SM-CTM)", d:"Blocage ou alerte immédiate si un opérationnel tente de commander ou contracter avec un tiers non conforme."},
          {k:"Bouclier anti-fraude au RIB (SM-AP-1)", d:"Comparaison automatique de l'IBAN lu sur chaque facture avec le RIB certifié dans SM avant tout paiement."},
          {k:"Fiche fournisseur 360° (CTM-SM, PR-SM, AP-SM)", d:"Un seul écran réunit les contrats actifs, le score logistique OTIF et les statuts de factures/paiements."}
        ],
        upsell:"Rebond commercial : ajouter Achats (PR) et Factures (AP) pour transformer le référentiel fournisseur en verrou opérationnel contre les achats sauvages et la fraude au virement."
      },
      ctm:{
        full:"Contract Management (Gestion des contrats)",
        solo:[
          {k:"Contrathèque intelligente", d:"Centralisation sécurisée avec recherche plein texte, extraction IA des clauses/dates et suivi des avenants."},
          {k:"Signature électronique", d:"Workflows d'approbation juridique et financier avec signature native DocuSign ou Adobe Sign."},
          {k:"Fin des reconductions subies", d:"Alertes automatiques d'échéance et de préavis envoyées aux propriétaires des contrats."}
        ],
        limit:"Déployé seul : le contrat reste un document PDF statique ; impossible de savoir en temps réel combien a déjà été commandé ou facturé dessus.",
        syn:[
          {k:"Passage de commande en 1 clic (CTM-PR-1 & CTM-PR-2)", d:"Création directe d'une demande d'achat depuis le contrat et contrôle automatique des plafonds d'engagement."},
          {k:"Touchless sur les abonnements (CTM-AP)", d:"Les calendriers de facturation pré-approuvés valident automatiquement les factures de loyers ou de maintenance dans AP."},
          {k:"Suivi du consommé temps réel (PR-CTM & AP-CTM)", d:"Incrémentation automatique des compteurs Total engagé (PR) et Total facturé (AP) face à l'enveloppe du contrat."}
        ],
        upsell:"Rebond commercial : coupler Contrats (CTM) avec Factures (AP) et Achats (PR) pour rendre le contrat financièrement exécutable et automatiser les factures récurrentes sans commande."
      },
      pr:{
        full:"E-Procurement (Demandes d'achat & Commandes)",
        solo:[
          {k:"Expérience type e-commerce", d:"Catalogues hébergés, Punch-Out (Amazon Business, Manutan) et création de DA en 30 s depuis un devis PDF lu par IA."},
          {k:"Contrôle budgétaire a priori", d:"Vérification temps réel du budget disponible par centre de coût ou projet avant toute approbation."},
          {k:"Réceptions web & mobile", d:"Saisie des réceptions (Goods Receipts) totales ou partielles par les demandeurs sur ordinateur ou mobile."}
        ],
        limit:"Déployé seul : la comptabilité doit encore ressaisir ou rapprocher les factures dans un autre outil sans héritage natif des réceptions et imputations.",
        syn:[
          {k:"Moteur du Touchless comptable (PR-AP-1)", d:"Chaque commande et réception validée prépare le rapprochement automatique 2 ou 3 voies avec héritage analytique complet."},
          {k:"Clôture mensuelle instantanée (PR-AP-2)", d:"Calcul automatisé des provisions pour Factures Non Parvenues (FNP = Réceptionné PR − Facturé AP)."},
          {k:"Conformité achats garantie (SM-PR & CTM-PR-1)", d:"Commandes restreintes aux fournisseurs homologués et imputées sur les tarifs et plafonds des contrats."}
        ],
        upsell:"Rebond commercial : pour un client déjà équipé de Factures (AP), ajouter Achats (PR) fait bondir le taux de factures Touchless au-delà de 80 % et sécurise le budget avant la dépense."
      },
      ap:{
        full:"Accounts Payable (Factures fournisseurs)",
        solo:[
          {k:"Capture IA & Facturation Électronique", d:"Reconnaissance Synergy AI en-tête et lignes et conformité réglementaire Plateforme Agréée (PA / e-invoicing)."},
          {k:"Rapprochement & Workflows", d:"Réconciliation avec les commandes de l'ERP, circuits d'approbation des factures sans commande et gestion des litiges."},
          {k:"Intégration ERP & Archivage", d:"Comptabilisation temps réel multi-ERP, écritures de FNP et archivage probant sur 10 ans."}
        ],
        limit:"Déployé seul : les factures « sans commande » demandent encore une validation manuelle récurrente et les opérationnels ne saisissent pas leurs réceptions dans Esker.",
        syn:[
          {k:"Touchless sur 100 % des typologies (PR-AP-1 & CTM-AP)", d:"Rapprochement natif avec les commandes/réceptions de PR ET avec les échéanciers de contrats CTM pour le hors-commande."},
          {k:"Zéro appel fournisseur & anti-fraude (SM-AP-1, SM-AP-2, AP-SM)", d:"Contrôle IBAN automatique, PO-Flip portail en 1 clic, visibilité des paiements 24/7 (-70 % d'appels) et escompte dynamique."},
          {k:"Décaissements unifiés (EM-AP)", d:"Conversion en 1 clic des notes de frais validées en pièces comptables prêtes au remboursement."}
        ],
        upsell:"Rebond commercial : sur la base installée AP, proposer Contrats (CTM) pour automatiser les factures récurrentes sans PO, et Fournisseurs (SM) pour bloquer la fraude au RIB."
      },
      em:{
        full:"Expense Management (Notes de frais)",
        solo:[
          {k:"Saisie mobile zéro papier", d:"Photo du reçu dans Esker Anywhere avec lecture IA, barèmes kilométriques Google Maps et ventilation multi-TVA."},
          {k:"Contrôle de politique voyages", d:"Détection automatique des dépassements de plafonds, dépenses week-end et justificatifs en doublon."},
          {k:"Cartes corporate & avances", d:"Rapprochement automatique des flux bancaires (Visa, Mastercard, Amex) avec les reçus photographiés."}
        ],
        limit:"Déployé seul : nécessite une interface comptable dédiée pour les remboursements et laisse dans l'ombre les achats sauvages payés par carte.",
        syn:[
          {k:"Circuit comptable unique (EM-AP)", d:"Le bouton « Approuver et créer une facture » génère automatiquement la pièce à payer dans AP avec justificatifs et TVA ventilée."},
          {k:"Coût complet par projet (EM-PR)", d:"Partage des mêmes tables Centres de coût et Codes projet pour consolider achats commandés et frais de mission."},
          {k:"Chasse aux achats sauvages (EM-SM)", d:"Identification des marchands récurrents payés par carte pour rapatrier ces dépenses sous contrat fournisseur."}
        ],
        upsell:"Rebond commercial : un client équipé de Factures (AP) déploie Notes de frais (EM) sur le même socle analytique sans créer de nouveau flux d'intégration ERP."
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
      {n:"CTM-PR-1", from:"ctm", to:"pr", fam:"eng", side:"up", core:true, lvl:1.0, tp:0.26, st:"ok",
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
      {n:"PR-AP-1", from:"pr", to:"ap", fam:"inv", side:"up", core:true, lvl:1.0, tp:0.26, st:"ok",
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

      /* === 12 SYNERGIES AVANCÉES S2P === */
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
      {n:"CTM-PR-2", from:"ctm", to:"pr", fam:"eng", side:"up", core:false, lvl:2.35, tp:0.74, st:"ok",
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
      {n:"PR-AP-2", from:"pr", to:"ap", fam:"inv", side:"up", core:false, lvl:2.35, tp:0.74, st:"ok",
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
      {n:"SM-AP-2", from:"sm", to:"ap", fam:"inv", side:"down", core:false, lvl:4.4, tp:0.34, st:"ok",
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
      {n:"EM-SM", from:"em", to:"sm", fam:"sup", side:"down", core:false, lvl:5.1, tp:0.54, st:"cfg",
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
    lead:"Sept modules sur un compte client 360° et un portail uniques. Chaque code indique le module source et le module cible (ex. CM-OM : de Crédit client vers Commandes). Sélectionnez un ou plusieurs modules pour isoler leurs synergies ou préparer votre rebond commercial.",
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
          {k:"Onboarding crédit digital", d:"Formulaire web client en libre-service, collecte des bilans et workflows d'approbation des limites de crédit."},
          {k:"Agences & assureurs-crédit", d:"Connecteurs natifs D&B, Ellisphere, Creditsafe, Coface et Allianz Trade."},
          {k:"Scoring & veille", d:"Calcul automatisé du score de risque et alertes en temps réel sur défaillance ou changement de notation."}
        ],
        limit:"Déployé seul : l'analyste crédit ne voit pas les commandes en cours de saisie avant facturation et ne peut pas déclencher d'appel de recouvrement prioritaire en un clic.",
        syn:[
          {k:"Verrou sur les commandes (CM-OM & OM-CM)", d:"Mise en attente automatique (Credit Hold) des commandes dépassant l'encours autorisé et visibilité du carnet d'ordres non facturés."},
          {k:"Pilotage du recouvrement (CM-CL & CL-CM)", d:"Adaptation automatique de la stratégie de relance selon la classe de risque et réévaluation du score selon le délai réel de paiement (ADP)."},
          {k:"Déblocage immédiat au paiement (CA-CM)", d:"Recalcul instantané de l'exposition crédit dès qu'un encaissement est lettré dans CA."}
        ],
        upsell:"Rebond commercial : ajouter Commandes (OM) et Recouvrement (CL) pour que les règles de crédit bloquent réellement les commandes à risque et pilotent la priorité des relances."
      },
      cim:{
        full:"Customer Inquiries (Service client / Demandes clients)",
        solo:[
          {k:"Boîte ADV collaborative", d:"Remplace les boîtes Outlook partagées par une file unifiée avec attribution, suivi des SLA et détection de doublons."},
          {k:"Tri par IA (Synergy AI)", d:"Classification automatique de chaque e-mail entrant par intention (commande, question livraison, facture, litige) et analyse de tonalité."},
          {k:"Réponses assistées Synergy-GPT", d:"Génération de projets de réponse contextualisés et bibliothèque de modèles."}
        ],
        limit:"Déployé seul : l'agent Service Client doit encore basculer dans l'ERP ou interroger la comptabilité pour trouver un bon de livraison, une facture ou l'état d'un litige.",
        syn:[
          {k:"Passerelle directe vers Commandes (CS-OM & OM-CS)", d:"Envoi automatique des commandes en saisie OM et remontée directe des avis d'expédition (ASN) et liens de tracking transporteur dans CS."},
          {k:"Autonomie sur les factures (CS-ID & ID-CS)", d:"Accès immédiat au duplicata PDF de la facture et aux dates exactes de consultation par le client sur le portail."},
          {k:"Industrialisation des réclamations (CS-CD & CD-CS)", d:"Conversion en 1 clic d'un e-mail de réclamation en dossier de litige CD et visibilité sur l'avancement de l'avoir."}
        ],
        upsell:"Rebond commercial : un client équipé de Commandes (OM) qui ajoute Demandes clients (CS) élimine 100 % du tri manuel dans sa boîte ADV et divise par 3 son délai de réponse."
      },
      om:{
        full:"Order Management (Prise de commandes clients)",
        solo:[
          {k:"Capture IA sans modèle", d:"Extraction automatique des commandes PDF, e-mail, Excel ou EDI avec jusqu'à 80 % de gain de temps de saisie pour l'ADV."},
          {k:"Contrôles métiers avant ERP", d:"Vérification automatique des références articles, tarifs, quantités minimales et unités avant création dans SAP / ERP."},
          {k:"Pilotage de la charge ADV", d:"Tableaux de bord temps réel des commandes en anomalie, des délais de traitement et de la productivité."}
        ],
        limit:"Déployé seul : les commandes arrivent mélangées aux questions clients dans la boîte mail, et l'exposition crédit n'est vérifiée qu'après coup dans l'ERP.",
        syn:[
          {k:"Sécurisation crédit en amont (CM-OM & OM-CM)", d:"Contrôle temps réel de la limite de crédit avant validation et actualisation de l'exposition engagée."},
          {k:"Portail client unifié (OM-ID)", d:"Le client retrouve au même endroit ses commandes, ses avis d'expédition (ASN) et ses factures liées à son numéro de PO."},
          {k:"Preuve contractuelle en cas de litige (OM-CD)", d:"Le bon de commande original du client archivé dans OM est consultable en 1 clic par l'analyste litiges."}
        ],
        upsell:"Rebond commercial : compléter Commandes (OM) par Demandes clients (CS) en amont et Facturation (ID) en aval pour offrir un portail client de bout en bout."
      },
      id:{
        full:"Invoice Delivery (Facturation client & Portail)",
        solo:[
          {k:"Diffusion omnicanale & PA", d:"Envoi automatisé (Portail, e-mail, EDI, Peppol, Plateforme Agréée e-invoicing dans +60 pays, courrier éditique)."},
          {k:"Archivage légal probant", d:"Coffre-fort électronique certifié et portail client en libre-service 24/7."},
          {k:"Économies directes", d:"Réduction jusqu'à 80 % des coûts d'éditique et d'affranchissement et suppression du délai postal."}
        ],
        limit:"Déployé seul : la facture est livrée avec preuve de lecture, mais personne n'exploite automatiquement cette preuve pour relancer ni pour lettrer les virements en banque.",
        syn:[
          {k:"Accélérateur de recouvrement (ID-CL & CL-ID)", d:"La preuve d'ouverture de la facture alimente CL (fin du prétexte « facture non reçue ») et chaque relance embarque le lien de paiement portail."},
          {k:"Socle du lettrage automatique (ID-CA & CA-ID)", d:"Les factures ouvertes et paiements portail alimentent CA pour un lettrage automatique, qui met à jour le statut « Payée » sur le portail."},
          {k:"Service client informé (ID-CS)", d:"Partage du PDF certifié et des dates de première/dernière consultation avec le Service Client."}
        ],
        upsell:"Rebond commercial : sur une base installée Facturation (ID), ajouter Recouvrement (CL) et Encaissements (CA) transforme le portail de facturation en machine à encaisser le cash."
      },
      ca:{
        full:"Cash Application (Lettrage des encaissements)",
        solo:[
          {k:"Rapprochement bancaire par IA", d:"Lecture automatique des relevés bancaires (CAMT.053, MT940, BAI2) et des avis de paiement (PDF, Excel, e-mail)."},
          {k:"Élimination du cash non affecté", d:"Taux de lettrage automatique de 85 % à 95 % même sur des paiements groupés multi-factures ou avec escompte."}
        ],
        limit:"Déployé seul : lorsqu'un client paie partiellement (déduction), le comptable reste bloqué pour qualifier l'écart et faire valider un avoir par les métiers.",
        syn:[
          {k:"Traitement industriel des paiements partiels (CA-CD & CD-CA)", d:"CA lettre immédiatement le cash reçu et crée automatiquement un dossier de déduction dans CD pour l'écart résiduel."},
          {k:"Arrêt immédiat des relances (CA-CL & CL-CA)", d:"Les factures payées le matin sortent instantanément des listes d'appels CL, et les promesses de paiement CL guident le lettrage CA."},
          {k:"Libération instantanée du crédit (CA-CM)", d:"Le paiement lettré reconstitue aussitôt la ligne de crédit disponible dans CM."}
        ],
        upsell:"Rebond commercial : coupler Encaissements (CA) avec Litiges & Déductions (CD) pour ne plus jamais bloquer un lettrage sur un paiement partiel."
      },
      cd:{
        full:"Claims & Deductions (Litiges et déductions)",
        solo:[
          {k:"Qualification structurée", d:"Catégorisation par motif (Reason Codes : casse transport, écart de prix, pénalité GSA, remise) et calcul de cause racine."},
          {k:"Workflow inter-services", d:"Circuit d'instruction collaboratif entre Finance, ADV, Logistique et Commercial avec suivi des SLA."},
          {k:"Émission d'avoirs ou rejets", d:"Génération automatisée des demandes de notes de crédit dans l'ERP ou des courriers de refus documentés."}
        ],
        limit:"Déployé seul : les litiges doivent être saisis manuellement et le recouvrement risque de continuer à relancer des factures pourtant contestées.",
        syn:[
          {k:"Alimentation zéro ressaisie (CA-CD, CL-CD, CS-CD)", d:"Création automatique du dossier de litige depuis un moins-perçu au lettrage (CA), un appel de relance (CL) ou un e-mail client (CS)."},
          {k:"Gel coordonné des relances (CD-CL)", d:"Toute facture en litige passe au statut Disputed dans CL, suspendant les relances automatiques sur le montant contesté."},
          {k:"Vérification commande & crédit (OM-CD & CD-CM)", d:"Accès en 1 clic au bon de commande original (OM) et neutralisation du litige légitime dans la revue de crédit (CM)."}
        ],
        upsell:"Rebond commercial : indispensable en complément d'Encaissements (CA) et de Recouvrement (CL) pour récupérer les déductions abusives et assainir la balance âgée."
      },
      com:{
        full:"Collections Management (Recouvrement)",
        solo:[
          {k:"Relances multicanales automatisées", d:"Scénarios préventifs et curatifs (e-mail, courrier, SMS, portail) adaptés au profil payeur."},
          {k:"Agenda d'appels priorisé par IA", d:"Liste quotidienne d'appels classée selon le risque et l'enjeu cash, avec suivi des promesses de paiement."},
          {k:"Pilotage du DSO & prévisions", d:"Tableaux de bord DSO, CEI (Collection Effectiveness Index), balance âgée dynamique et prévisions d'encaissement."}
        ],
        limit:"Déployé seul : risque de relancer un client qui a payé le matin même ou qui a déjà ouvert une réclamation auprès du service client.",
        syn:[
          {k:"Relances 100 % fiables (ID-CL, CA-CL, CD-CL)", d:"Preuve d'ouverture de facture (ID), arrêt immédiat dès lettrage (CA) et suspension automatique sur litige ouvert (CD)."},
          {k:"Boucle complète avec le Crédit (CM-CL & CL-CM)", d:"Stratégie de relance pilotée par le score de risque CM et déclenchement automatique d'une révision de crédit en cas de promesse rompue."},
          {k:"Conversion en paiement ou litige (CL-ID, CL-CA, CL-CD)", d:"Lien de paiement en ligne dans chaque relance, promesse guidant le lettrage et déclaration de litige en 1 clic."}
        ],
        upsell:"Rebond commercial : un client équipé de Recouvrement (CL) maximise son gain DSO en ajoutant Encaissements (CA) et Litiges (CD) pour concentrer 100 % des appels sur le vrai retard."
      }
    },
    syn:[
      /* === 10 SYNERGIES MAJEURES O2C (core: true — affichées par défaut) === */
      {n:"CM-OM", from:"crm", to:"om", fam:"eng", side:"up", core:true, lvl:1.9, tp:0.42, st:"ok",
       t:"Blocage automatique commande sur risque",
       p:"Lors de la validation d'une commande dans OM, Esker contrôle la solvabilité et bloque en cas de dépassement.",
       d:[
         "Contrôle temps réel des règles définies dans CM (statut de blocage client, limite de crédit autorisée, catégorie de risque, encours disponible).",
         "Si le plafond est dépassé, la commande est mise en attente (Credit Hold) avec alerte visuelle immédiate pour l'ADV.",
         "Pourquoi équiper les deux : sécurise le chiffre d'affaires dès la prise de commande avant toute expédition."
       ]},
      {n:"CS-OM", from:"cim", to:"om", fam:"eng", side:"up", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Transfert automatique commandes et questions",
       p:"L'IA de Service Client trie la boîte ADV et route les commandes directement dans OM.",
       d:[
         "Le moteur Synergy AI de CS analyse les e-mails entrants : ceux qualifiés en commande (Order) créent automatiquement une commande à valider dans OM.",
         "Les questions portant sur une commande existante (Order question) sont rattachées directement au fil de conversation de la commande dans OM.",
         "Pourquoi équiper les deux : élimine 100 % du tri manuel dans la boîte mail partagée de l'ADV."
       ]},
      {n:"OM-CS", from:"om", to:"cim", fam:"ret", side:"down", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Suivi commande, ASN et tracking transporteur",
       p:"L'agent Service Client visualise les colis, l'avis d'expédition et le lien transporteur pour répondre en 1 clic.",
       d:[
         "Face à une demande « Où en est ma commande ? », CS interroge OM et affiche les confirmations de commande, les avis d'expédition (ASN) et les liens de tracking.",
         "Synergy-GPT rédige automatiquement la réponse client avec les données exactes de livraison.",
         "Pourquoi équiper les deux : résolution dès le premier contact des demandes de suivi de livraison."
       ]},
      {n:"OM-ID", from:"om", to:"id", fam:"inv", side:"up", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Portail unifié commande, expédition et facture",
       p:"Le client retrouve sur un seul portail ses commandes, ses bons de livraison et ses factures liées.",
       d:[
         "L'activation du profil O2C - Customer réunit sur le même portail client les commandes soumises (OM), les avis d'expédition (ASN) et les factures (ID).",
         "Selon les exigences du client, ID peut joindre automatiquement la copie du bon de commande initial capturé dans OM au PDF de la facture.",
         "Pourquoi équiper les deux : guichet digital unique pour le client final et zéro rejet de facture pour pièce manquante."
       ]},
      {n:"ID-CL", from:"id", to:"com", fam:"inv", side:"up", core:true, lvl:3.2, tp:0.54, st:"ok",
       t:"Preuve de remise et lecture de facture",
       p:"Le chargé de recouvrement voit si la facture a été reçue, ouverte ou téléchargée sur le portail.",
       d:[
         "Les factures diffusées par ID alimentent CL avec leurs dates de première et dernière consultation (First/Last view date) et leur statut de remise.",
         "Permet d'attacher le duplicata certifié ou le relevé de compte en un clic lors d'une relance.",
         "Pourquoi équiper les deux : supprime définitivement l'excuse n°1 des retards de paiement (« Je n'ai pas reçu la facture »)."
       ]},
      {n:"ID-CA", from:"id", to:"ca", fam:"inv", side:"up", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Référentiel factures et paiement portail lettré",
       p:"Les factures émises et les paiements effectués sur le portail alimentent directement le moteur de lettrage.",
       d:[
         "Les factures diffusées dans ID alimentent la table des créances ouvertes (Open AR) avec montants, devises et conditions d'escompte pour CA.",
         "Tout règlement effectué en ligne sur le portail client (CB, prélèvement SEPA / ACH) est réconcilié automatiquement à 100 % dans CA.",
         "Pourquoi équiper les deux : taux de rapprochement automatique maximal dès la réception des fonds."
       ]},
      {n:"CA-CD", from:"ca", to:"cd", fam:"inv", side:"up", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Création auto de déduction sur moins-perçu",
       p:"Lors d'un paiement partiel, CA lettre le cash reçu et ouvre automatiquement le dossier de litige dans CD.",
       d:[
         "Lorsqu'un paiement partiel (Short payment) est détecté sur un virement ou un avis de paiement dans CA, la partie encaissée est comptabilisée sans attendre.",
         "L'écart résiduel instancie automatiquement un dossier dans le workflow Claim/Deduction de CD avec le montant déduit, le motif extrait par IA et l'avis de paiement joint.",
         "Pourquoi équiper les deux : aucun paiement partiel ne bloque plus le lettrage et aucune déduction abusive ne passe sous le radar."
       ]},
      {n:"CD-CL", from:"cd", to:"com", fam:"sup", side:"up", core:true, lvl:1.0, tp:0.50, st:"ok",
       t:"Gel automatique des relances sur litige",
       p:"Toute facture en litige dans CD passe en statut contesté dans CL et suspend ses relances automatiques.",
       d:[
         "Dès qu'une réclamation ou déduction est ouverte dans CD, la facture passe au statut Disputed dans CL avec affichage du motif et de la cause racine.",
         "Les relances automatiques sont gelées sur le montant litigieux pendant toute l'instruction, puis reprennent automatiquement si le litige est rejeté.",
         "Pourquoi équiper les deux : protège la relation commerciale en n'envoyant jamais de mise en demeure sur un litige en cours de traitement."
       ]},
      {n:"CA-CL", from:"ca", to:"com", fam:"ret", side:"down", core:true, lvl:2.1, tp:0.42, st:"ok",
       t:"Arrêt immédiat des relances dès le lettrage",
       p:"Un paiement lettré le matin dans CA stoppe aussitôt les relances et clôt la promesse de règlement dans CL.",
       d:[
         "Tout règlement alloué dans CA met à jour le solde ouvert et marque la facture comme réconciliée dans l'environnement partagé.",
         "Stoppe immédiatement les relances automatiques et passe les promesses de paiement associées au statut Completed dans CL.",
         "Pourquoi équiper les deux : aucun chargé de recouvrement n'appelle plus un client qui a payé le matin même."
       ]},
      {n:"CL-CM", from:"com", to:"crm", fam:"ret", side:"down", core:true, lvl:4.9, tp:0.50, st:"ok",
       t:"Révision du score crédit selon comportement payeur",
       p:"Les retards moyens (ADP) et promesses rompues dans CL recalculent le score de risque dans CM.",
       d:[
         "Les indicateurs de paiement issus de CL (Average Days to Pay, Payer rating, promesses non tenues) alimentent la Credit Scorecard de CM.",
         "De plus, dès que l'appel de recouvrement demandé par l'analyste crédit est effectué dans CL, la revue de crédit en attente (On hold) reprend automatiquement dans CM.",
         "Pourquoi équiper les deux : un pilotage du risque fondé sur l'expérience réelle de paiement et non sur les seuls bilans passés."
       ]},

      /* === 12 SYNERGIES AVANCÉES O2C === */
      {n:"OM-CM", from:"om", to:"crm", fam:"ret", side:"down", core:false, lvl:2.0, tp:0.66, st:"ok",
       t:"Actualisation temps réel de l'encours engagé",
       p:"Les commandes non encore facturées incrémentent l'exposition future du client et déclenchent une alerte crédit.",
       d:[
         "La validation ou l'import des commandes ouvertes (Uninvoiced orders) dans OM met à jour l'exposition engagée du client dans CM.",
         "Si une commande fait franchir le seuil d'exposition future (Potential Future Exposure), CM déclenche automatiquement une revue de crédit."
       ]},
      {n:"CM-CL", from:"crm", to:"com", fam:"eng", side:"up", core:false, lvl:5.0, tp:0.50, st:"ok",
       t:"Stratégie de relance pilotée par le risque",
       p:"La classe de risque calculée dans CM adapte la stratégie de relance et déclenche des appels prioritaires.",
       d:[
         "La mise à jour de la catégorie de risque dans CM affecte dynamiquement le client à la stratégie de recouvrement correspondante dans CL (relances plus précoces sur profil risqué).",
         "Depuis une revue de crédit avec commandes bloquées, le bouton « Request collection call » crée directement un appel prioritaire dans CL."
       ]},
      {n:"CA-CM", from:"ca", to:"crm", fam:"ret", side:"up", core:false, lvl:4.1, tp:0.35, st:"ok",
       t:"Libération immédiate de la ligne de crédit",
       p:"Dès le lettrage bancaire dans CA, l'encours disponible est reconstitué dans CM sans attendre la nuit.",
       d:[
         "Le rapprochement d'un règlement dans CA diminue immédiatement l'encours ouvert (Open AR) utilisé par CM.",
         "Permet aux règles automatiques de libérer sans délai les commandes en attente de crédit."
       ]},
      {n:"CD-CM", from:"cd", to:"crm", fam:"sup", side:"down", core:false, lvl:4.1, tp:0.36, st:"cfg",
       t:"Neutralisation des litiges légitimes dans le risque",
       p:"L'analyste crédit distingue l'encours sain en retard des montants contestés en cours d'instruction.",
       d:[
         "Les montants qualifiés dans CD (Disputed amount) sont isolés dans la revue de crédit CM.",
         "Évite de pénaliser le score ou de bloquer les commandes d'un bon client dont le retard résulte d'une erreur logistique ou tarifaire interne."
       ]},
      {n:"CS-ID", from:"cim", to:"id", fam:"inv", side:"up", core:false, lvl:2.5, tp:0.42, st:"ok",
       t:"Récupération immédiate de duplicata de facture",
       p:"Depuis un e-mail demandant une copie de facture, l'agent CS joint le PDF original issu d'ID.",
       d:[
         "Lorsqu'un e-mail entrant est qualifié en « Invoice question » dans CS, le gestionnaire accède directement au PDF archivé dans ID et au lien portail.",
         "Permet à l'ADV de répondre au premier contact sans solliciter la comptabilité clients."
       ]},
      {n:"ID-CS", from:"id", to:"cim", fam:"ret", side:"down", core:false, lvl:2.4, tp:0.52, st:"ok",
       t:"Traçabilité d'envoi et de lecture pour le support",
       p:"Le Service Client vérifie en temps réel quand et par quel canal la facture a été envoyée et ouverte.",
       d:[
         "ID expose dans CS le canal de diffusion (portail, e-mail, EDI, courrier), l'adresse destinataire et les dates exactes d'ouverture par le client."
       ]},
      {n:"CS-CD", from:"cim", to:"cd", fam:"sup", side:"down", core:false, lvl:3.3, tp:0.46, st:"cfg",
       t:"Qualification d'un e-mail client en dossier litige",
       p:"Un e-mail signalant une avarie ou une erreur de prix est transmis avec ses preuves dans le workflow CD.",
       d:[
         "Les e-mails classés en réclamation (Claim) par l'IA dans CS sont routés vers CD avec le BL émargé, les photos et le numéro de facture extrait."
       ]},
      {n:"OM-CD", from:"om", to:"cd", fam:"eng", side:"up", core:false, lvl:2.4, tp:0.52, st:"ok",
       t:"Vérification du bon de commande original en litige",
       p:"L'analyste litiges consulte en 1 clic le bon de commande original du client capturé dans OM.",
       d:[
         "Lors d'une contestation de tarif, de remise ou de quantité commandée dans CD, l'analyste ouvre directement le PDF du PO client archivé dans OM."
       ]},
      {n:"CL-ID", from:"com", to:"id", fam:"inv", side:"down", core:false, lvl:3.2, tp:0.66, st:"ok",
       t:"Relances embarquant le lien de paiement portail",
       p:"Chaque e-mail de relance et relevé de compte CL inclut le renvoi de facture et le lien de paiement en ligne ID.",
       d:[
         "Les courriers et e-mails de relance générés par CL intègrent nativement le bouton d'accès direct au portail de paiement ID et l'action « Pay on behalf of customer »."
       ]},
      {n:"CA-ID", from:"ca", to:"id", fam:"ret", side:"down", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Mise à jour du statut Payée sur le portail client",
       p:"Dès l'allocation du règlement dans CA, le portail client ID affiche la facture soldée et le détail du paiement.",
       d:[
         "Le lettrage effectué dans CA actualise en temps réel le solde restant dû et alimente l'onglet Payments du portail client ID."
       ]},
      {n:"CD-CA", from:"cd", to:"ca", fam:"ret", side:"down", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Lien dossier litige et apurement par avoir dans CA",
       p:"L'opérateur de lettrage voit le dossier CD sur la ligne de facture et l'avoir validé apure le solde.",
       d:[
         "L'écran de lettrage CA affiche le numéro cliquable du dossier CD, la date, le motif et le montant contesté ; l'avoir émis après résolution solde automatiquement le poste ouvert."
       ]},
      {n:"CL-CD", from:"com", to:"cd", fam:"sup", side:"down", core:false, lvl:1.0, tp:0.50, st:"ok",
       t:"Déclaration de litige en 1 clic pendant un appel",
       p:"Lors d'un appel de relance dans CL, le gestionnaire déclare un litige qui ouvre directement le workflow CD.",
       d:[
         "Depuis la fiche facture dans CL, le bouton « Dispute » permet de saisir le motif, le montant contesté et les pièces jointes pour lancer l'instruction dans CD."
       ]}
    ],
    ai:{t:"Synergy, l'IA à chaque étape", st:"ok",
        p:"Trier la boîte mail ADV, extraire les commandes sans modèle, prédire le risque de retard, lettrer les avis de paiement complexes et qualifier les déductions : Synergy IA accélère les 7 modules Order-to-Cash.",
        d:[
          "Synergy IA : disponible nativement sur les 7 modules Order-to-Cash",
          "Synergy-GPT : rédaction assistée des réponses clients dans Demandes clients (CS)",
          "Auto-apprentissage continu sur les habitudes de commande et de règlement de chaque client"
        ]},
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
