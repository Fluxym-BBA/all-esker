/* =========================================================================
   1. DONNÉES
   ========================================================================= */
const CDN  = "https://26096000.fs1.hubspotusercontent-eu1.net/hubfs/26096000/";
const F_O2C = CDN + "Vid%C3%A9o%20d%C3%A9mo%20Esker%20O2C/";
const F_S2P = F_O2C + "Vid%C3%A9o%20d%C3%A9mo%20Esker%20S2P/";

const M = [
{id:"so", code:"SRC", suite:"S2P", label:"Sourcing", icon:"🔎", c:"#8CC63F",
 desc:"Digitalisez vos appels d'offres et enchères inversées avec Market Dojo. Centralisez les consultations, comparez les réponses fournisseurs et sécurisez vos décisions d'attribution.",
 videos:[{t:"Présentation globale du module Sourcing Esker (Market Dojo)", sz:"34 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Sourcing%20Esker%20(Market%20Dojo)%20(C).mp4"}]},

{id:"sm", code:"SM", suite:"S2P", label:"Supplier Management", icon:"🤝", c:"#00A7E1",
 desc:"Référencez, qualifiez et suivez vos fournisseurs dans un référentiel unique. Onboarding en self-service via le portail, contrôle des données et pilotage du risque fournisseur.",
 videos:[{t:"Présentation globale du module Gestion des Fournisseurs", sz:"29 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Gestion%20des%20Fournisseurs%20(C).mp4"}]},

{id:"ctm", code:"CTM", suite:"S2P", label:"Contract Management", icon:"📄", c:"#5B6B7A",
 desc:"Centralisez le cycle de vie contractuel : rédaction assistée, circuits de validation, signature électronique, alertes d'échéance et suivi des engagements.",
 videos:[{t:"Présentation globale du module Contrats Esker", sz:"29 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Contrats%20Esker%20(C).mp4"}]},

{id:"pr", code:"PROC", suite:"S2P", label:"Procurement", icon:"🛒", c:"#2E3F4F",
 desc:"Canalisez la dépense vers les contrats négociés : catalogues et punch-out, demandes d'achat guidées, workflows d'approbation, commandes et réceptions.",
 videos:[{t:"Présentation globale du module Achats Esker", sz:"27 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Achats%20Esker%20(C).mp4"}]},

{id:"ap", code:"AP", suite:"S2P", label:"Accounts Payable & Compliance", icon:"🧾", c:"#F5A623",
 desc:"Automatisez le traitement des factures fournisseurs : capture IA, rapprochement commande/réception, workflows d'approbation, conformité et facturation électronique.",
 videos:[{t:"Présentation globale du module Factures Fournisseurs Esker", sz:"30 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Factures%20Fournisseurs%20Esker%20(C).mp4"}]},

{id:"em", code:"EM", suite:"S2P", label:"Expense Management", icon:"✈️", c:"#E8465A",
 desc:"Simplifiez les notes de frais : saisie mobile avec reconnaissance du justificatif, contrôle automatique de la politique de dépense et remboursement accéléré.",
 videos:[{t:"Présentation globale du module Notes de Frais Esker", sz:"30 Mo", u:F_S2P+"Pr%C3%A9sentation%20globale%20du%20module%20Notes%20de%20Frais%20Esker%20(C).mp4"}]},

{id:"crm", code:"CRM", suite:"O2C", label:"Credit Management", icon:"📊", c:"#7D8B99",
 desc:"Évaluez et surveillez le risque client en continu : scoring, encours et limites de crédit, demandes d'ouverture de compte et validation des blocages de commande.",
 videos:[]},

{id:"cim", code:"CIM", suite:"O2C", label:"Customer Inquiry Management", icon:"💬", c:"#2E3F4F",
 desc:"Centralisez toutes les demandes clients dans une boîte partagée intelligente : qualification automatique, routage vers le bon interlocuteur et suivi des délais de réponse.",
 videos:[]},

{id:"om", code:"OM", suite:"O2C", label:"Order Management", icon:"📦", c:"#F5A623",
 desc:"Automatisez la saisie des commandes clients, quel que soit le canal (e-mail, PDF, EDI, portail). Détection des écarts, contrôle des prix et intégration directe à l'ERP.",
 videos:[]},

{id:"id", code:"ID", suite:"O2C", label:"Invoice Delivery & Compliance", icon:"📤", c:"#E8465A",
 desc:"Émettez et distribuez vos factures clients sur tous les canaux, en conformité avec les obligations de facturation électronique en France et à l'international.",
 videos:[{t:"Présentation globale du module Factures Clients Esker", sz:"27 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Factures%20Clients%20(C).mp4"}]},

{id:"ca", code:"CA", suite:"O2C", label:"Cash Application", icon:"💰", c:"#8CC63F",
 desc:"Lettrez automatiquement les encaissements : rapprochement IA des règlements et des avis de paiement, traitement des écarts et imputation comptable immédiate.",
 videos:[
  {t:"Présentation globale du module Encaissements Clients", sz:"40 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Encaissements%20Clients%20(C).mp4"},
  {t:"Présentation détaillée (version longue)", sz:"50 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Encaissements%20Clients%20%20(%20V%20longue)%20(C).mp4"}
 ]},

{id:"cd", code:"C&D", suite:"O2C", label:"Claims & Deductions", icon:"⚖️", c:"#4FC3D9",
 desc:"Traitez les litiges et déductions clients de bout en bout : qualification du motif, collecte des preuves, workflow de résolution et suivi du taux de recouvrement.",
 videos:[]},

{id:"com", code:"COM", suite:"O2C", label:"Collections Management", icon:"📞", c:"#00A7E1",
 desc:"Pilotez le recouvrement avec des stratégies de relance personnalisées, une priorisation intelligente des dossiers et une vision temps réel du DSO.",
 videos:[{t:"Présentation globale du module Collection Management", sz:"37 Mo", u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Collection%20Management%20(C).mp4"}]}
];

const ORDER_S2P = ["so","sm","ctm","pr","ap","em"];
const ORDER_O2C = ["crm","cim","om","id","ca","cd","com"];
const ALL_ORDER = ORDER_S2P.concat(ORDER_O2C);
const byId = id => M.find(m => m.id === id);
const TOTV = M.reduce((a,m) => a + m.videos.length, 0);
const WITHVID = M.filter(m => m.videos.length).map(m => m.id);

