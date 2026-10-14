/* =========================================================================
   SUITES : données des niveaux 1 (suite) et des synergies entre modules
   Source des synergies S2P : agent Esker (14/10/2026), à valider par Fluxym.
   statut : "ok" disponible, "cfg" selon configuration, "soon" bientôt / à venir
   ========================================================================= */
const SUITE_FAM = {
  eng: {n:"Engagement et budget",      c:"#6b51ed"},
  sup: {n:"Fournisseurs et sécurité",  c:"#13b4e2"},
  inv: {n:"Factures et clôture",       c:"#f0a020"},
  ai:  {n:"IA transverse",             c:"#12a37d"}
};
const SUITE_STATUS = {ok:"Disponible", cfg:"Selon configuration", soon:"Bientôt / à venir"};

const SUITES = {
  S2P: {
    key:"S2P", slug:"s2p", name:"Source-to-Pay", short:"Achats et dépenses",
    title:"Source-to-Pay : un seul flux, <em>de l'appel d'offres à la facture</em>",
    lead:"Six modules, une seule plateforme. Survolez un module ou une flèche pour voir ce qui circule entre eux ; cliquez pour entrer dans le détail.",
    order:["so","sm","ctm","pr","ap","em"],
    role:{so:"Mettre en concurrence", sm:"Référencer et homologuer", ctm:"Cadrer engagements et échéances",
          pr:"Demander, commander, réceptionner", ap:"Rapprocher et valider", em:"Dépenses hors commande"},
    short_name:{so:"Sourcing", sm:"Fournisseurs", ctm:"Contrats", pr:"Achats", ap:"Factures", em:"Notes de frais"},
    syn:[
      {n:"S1", from:"so", to:"ctm", fam:"eng", side:"up", st:"ok",
       t:"De l'appel d'offres au contrat",
       p:"Le fournisseur retenu et ses prix passent directement dans le contrat.",
       d:["L'attribution crée le contrat, sans ressaisie","Grilles tarifaires et dates reprises telles que négociées","Historique des offres rattaché au contrat pour l'audit"]},
      {n:"S2", from:"so", to:"sm", fam:"sup", side:"down", st:"ok",
       t:"Homologuer qui l'on consulte",
       p:"Un fournisseur consulté entre directement dans le circuit d'homologation.",
       d:["Questionnaires, RIB, Kbis et attestations collectés sur le portail","Le fournisseur complète lui-même ses informations","Plus de fournisseur « hors radar » après un appel d'offres"]},
      {n:"S3", from:"sm", to:"pr", fam:"sup", side:"down", st:"ok",
       t:"On n'achète qu'aux fournisseurs validés",
       p:"Seuls les fournisseurs homologués sont proposés dans les demandes d'achat.",
       d:["Statuts homologué, en attente ou bloqué","Contrôle dès la saisie de la demande","Un fournisseur bloqué ne reçoit plus de commande"]},
      {n:"S4", from:"ctm", to:"pr", fam:"eng", side:"up", st:"cfg",
       t:"Le contrat plafonne les commandes",
       p:"Chaque commande rattachée au contrat consomme son montant, sous contrôle.",
       d:["Ligne de commande rattachée au contrat","Suivi du commandé par rapport au plafond contractuel","Alerte ou blocage quand le plafond est atteint, selon le paramétrage","Tarifs du contrat appliqués à la commande"]},
      {n:"S5", from:"ctm", to:"ap", fam:"eng", side:"up", st:"ok",
       t:"Factures récurrentes sans commande",
       p:"Les factures d'un abonnement ou d'une prestation se rapprochent de l'échéancier du contrat.",
       d:["Échéancier de facturation porté par le contrat","Contrôle de la date et du montant attendus, avec tolérance","Approbation automatique possible quand tout est conforme","Exemple : une prestation de 100 k€ par an facturée chaque mois"]},
      {n:"S6", from:"pr", to:"ap", fam:"inv", side:"up", st:"ok",
       t:"Rapprochement 2 et 3 voies, factures non parvenues",
       p:"La facture est comparée à la commande et à ce qui a réellement été reçu.",
       d:["Écarts de prix et de quantités signalés ligne par ligne","Les lignes de commande passent au statut facturé","Les réceptions non facturées alimentent les factures non parvenues","Un clic pour passer de la facture à la commande, et inversement"],
       note:"Sans le module Achats, le rapprochement reste possible avec des commandes venant de l'ERP, mais sans réception par les opérationnels ni contrôle du budget avant d'engager."},
      {n:"S7", from:"sm", to:"ap", fam:"sup", side:"down", st:"ok",
       t:"IBAN contrôlé, fraude bloquée",
       p:"L'IBAN de chaque facture est comparé à celui du fournisseur homologué.",
       d:["Blocage automatique en cas d'écart","Changement de RIB validé par un second regard","Protection contre la fraude au changement de coordonnées bancaires"]},
      {n:"S8", from:"em", to:"ap", fam:"inv", side:"down", st:"ok",
       t:"Mêmes règles pour toutes les dépenses",
       p:"Notes de frais et factures suivent les mêmes contrôles et la même comptabilisation.",
       d:["Même plan analytique et mêmes centres de coûts","Mêmes règles de TVA","Même export vers la comptabilité"]}
    ],
    ai:{t:"Synergy, l'IA à chaque étape", st:"ok",
        p:"Lire un devis, créer une demande en une phrase, guider le valideur : l'IA est présente dans chaque module, sous les mêmes droits et la même traçabilité.",
        d:["Synergy : disponible dans les modules","Approbation dans Microsoft Teams : bientôt (annoncée dans la démo)","Agents IA connectés via MCP : à venir"]},
    chain:true
  },
  O2C: {
    key:"O2C", slug:"o2c", name:"Order-to-Cash", short:"Clients et encaissements",
    title:"Order-to-Cash : <em>de la commande client à l'encaissement</em>",
    lead:"Aperçu. Les synergies Order-to-Cash restent à construire ensemble ; voici les quatre plus évidentes.",
    preview:true,
    order:["crm","cim","om","id","ca","cd","com"],
    role:{crm:"Évaluer le risque client", cim:"Centraliser les demandes", om:"Saisir les commandes", id:"Émettre les factures",
          ca:"Lettrer les encaissements", cd:"Traiter litiges et déductions", com:"Piloter le recouvrement"},
    short_name:{crm:"Crédit", cim:"Demandes clients", om:"Commandes", id:"Factures clients", ca:"Encaissements", cd:"Litiges", com:"Recouvrement"},
    syn:[
      {n:"O1", from:"crm", to:"om", fam:"eng", side:"up", st:"cfg", t:"Encours vérifié à la commande",
       p:"La commande d'un client à risque est signalée ou bloquée avant d'être saisie.", d:["Limite de crédit contrôlée à la commande","Blocage ou alerte selon la politique de crédit"]},
      {n:"O2", from:"om", to:"id", fam:"inv", side:"up", st:"ok", t:"De la commande à la facture",
       p:"La facture reprend la commande sans ressaisie.", d:["Données de commande réutilisées","Moins d'erreurs, moins de litiges"]},
      {n:"O3", from:"ca", to:"com", fam:"inv", side:"up", st:"ok", t:"On ne relance pas un client qui vient de payer",
       p:"Un paiement lettré arrête aussitôt les relances.", d:["Lettrage et recouvrement partagent les mêmes données","Relances ciblées sur ce qui reste dû"]},
      {n:"O4", from:"cim", to:"cd", fam:"sup", side:"down", st:"cfg", t:"Litiges remontés et traités au même endroit",
       p:"Une réclamation client devient un litige suivi, avec ses preuves.", d:["Qualification du motif","Suivi jusqu'à la résolution"]}
    ],
    ai:{t:"Synergy, l'IA à chaque étape", st:"ok", p:"L'IA lit les commandes, qualifie les demandes et prépare les relances.", d:["Synergy : disponible"]},
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
