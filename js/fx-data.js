/* =========================================================================
   fx-data.js : adaptateur de contenu. Les vues ne lisent jamais les fichiers de
   données directement : elles passent par FX.content(id), FX.stages(suite) et
   FX.synFor(...). Aucun texte n'est inventé ici, tout vient du deck et des
   fichiers data.js, suites-data.js, module-data.js, o2c-data.js.
   ========================================================================= */
(function () {
  "use strict";
  /* démonstrations interactives : une entrée par module, ajoutez la vôtre ici */
  FX.DEMOS = {
    ap: {url: "demo/index.html", label: "Démo interactive : Factures fournisseurs", d: "Parcourez le traitement d'une facture fournisseur, de la capture IA à la comptabilisation."}
  };

  const O = () => window.O2C;

  /* normalise une brique de roue : tableau O2C [lab, core, ic, p, b] ou objet E-Procurement */
  const brick = s => Array.isArray(s) ? {lab: s[0], core: s[1], ic: s[2], p: s[3], b: s[4] || []} : {lab: s.lab, core: s.core, ic: s.ic, p: s.p, b: s.b || [], h: s.h, shot: s.shot, k: s.k};

  FX.content = id => {
    const m = FX.mod(id), sk = m.suite, S = SUITES[sk], P = (S.pitch || {})[id] || null;
    const o = O() && O().mods ? O().mods[id] : null;
    const x = typeof XP !== "undefined" ? XP[id] : null;
    const c = {
      id, m, sk, S, P, color: m.c, icon: m.icon, name: m.label,
      short: (S.short_name || {})[id] || m.label, acr: (S.acr || {})[id] || m.code, role: (S.role || {})[id] || "",
      desc: m.desc, title: "", lead: m.desc, owner: "", badge: "", flow: null, kpis: null,
      bricks: null, adv: null, pains: null, personas: null, use: null, proc: null, road: null,
      videos: m.videos || [], xvideos: null, demo: FX.DEMOS[id] || null, hasWheel: false
    };
    if (o) {
      c.title = o.title; c.lead = o.lead; c.owner = o.owner; c.badge = o.badge || "";
      c.flow = o.flow || null; c.kpis = o.kpis || null; c.adv = o.adv || null; c.use = o.use || null;
      c.bricks = o.steps.map(brick); c.hasWheel = true; c.kicker = FX.suiteName(sk) + " · " + o.acr;
      if (o.proc) c.proc = {cover: o.proc.cover, sor: o.proc.sor, stages: o.proc.stages.map(i => O().stages[i]).filter(Boolean)};
    } else if (x) {
      c.title = "Du besoin à la commande, <em>sans friction</em>";
      c.lead = m.desc; c.kicker = x.kicker;
      c.bricks = x.steps.map(brick); c.hasWheel = true; c.pains = x.pains; c.personas = x.personas; c.road = x.road;
      c.xvideos = x.videos; c.shots = x.shots;
    } else {
      c.title = "<em>" + E(m.label) + "</em>"; c.kicker = FX.suiteName(sk) + " · " + c.acr;
    }
    return c;
  };

  /* synergies d'une suite, filtrées sur un module */
  FX.synFor = (sk, id) => SUITES[sk].syn.filter(s => s.from === id || s.to === id);
  FX.famOf = f => SUITE_FAM[f] || {n: f, c: "#13b4e2"};

  /* étapes du parcours "Mon enjeu" : une roue par monde */
  const O2C_LAB = ["Onboarding", "Crédit", "Commande", "Livraison", "Facturation", "Transmission", "Recouvrement", "Paiement", "Lettrage"];
  const O2C_IC = ["user", "shield", "cart", "box", "receipt", "globe", "chat", "euro", "sync"];
  const S2P_IC = {so: "zoom", sm: "shield", ctm: "doc", pr: "cart", ap: "receipt", em: "phone"};
  FX.stages = sk => {
    if (sk === "S2P") {
      return ORDER_S2P.map((id, i) => {
        const S = SUITES.S2P, P = S.pitch[id];
        return {i, lab: S.short_name[id], core: S.role[id], ic: S2P_IC[id] || "layers", t: S.short_name[id],
          note: FX.mod(id).desc, mods: [id], sor: "", solo: P.solo.map(s => s.k), limit: P.limit};
      });
    }
    return O().stages.map((s, i) => ({
      i, lab: O2C_LAB[i] || s.t, core: s.t, ic: O2C_IC[i] || "layers", t: s.t, note: s.note, mods: s.mods, sor: s.sor,
      solo: s.mods.length ? [].concat.apply([], s.mods.map(id => SUITES.O2C.pitch[id].solo.map(p => p.k))).slice(0, 4) : [], limit: ""
    }));
  };
})();
