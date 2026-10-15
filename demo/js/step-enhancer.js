/* =========================================================================
   MOTEUR D'INTERACTIVITÉ IN-PAGE (DOM RÉEL ESKER) — VERSION L12
   1. Zéro lien sortant vers Esker (interception totale + href neutralisés)
   2. Drill-down 3 niveaux sur le tableau de bord puis accès direct au niveau 3 du rapport
   3. Encadrements internes nets (inset box-shadow) et pastilles ⓘ dans les titres
   4. Retour par le tableau de bord avant les 40 factures + onglet Accueil actif partout
   5. Volet « Synergy Agent » fonctionnel partout où le bouton existe en haut à droite
   ========================================================================= */

(function () {
  'use strict';

  let currentStep = window.ESKER_STEP_ID || 1;
  let activeBadges = [];
  let hoverTooltip = null;
  let originalInvoiceImgSrc = null;

  // Catalogue fourni par Bruno, conservé aussi en JSON dans demo/data/.
  // Les opérateurs null ne sont pas complétés par hypothèse : seul l’opérateur
  // par défaut est affiché tant que le catalogue Esker ne les confirme pas.
  const FILTER_CATALOG = {"catalogue":"Filtres - Factures fournisseurs","version":"0.1.0","langue":"fr-FR","statut":"prototype_a_completer","objectif":"Décrire les champs de filtre disponibles dans l'espace de travail Factures fournisseurs et les opérateurs associés, afin de générer une interface de démonstration HTML.","source":{"type":"captures_ecran","fichiers":["image-1.png","image.png"],"perimetre_observe":"Écran Factures fournisseurs (Accueil), liste Factures fournisseurs","limite":"Les champs visibles sont recensés. Les opérateurs de Code société sont confirmés par la capture de la liste déroulante. Les opérateurs des autres champs doivent être confirmés par le HTML source ou par des captures complémentaires."},"operator_catalog":[{"id":"equals","label":"égal à","label_html":"égal à","category":"comparison","confirmed_for":["code_societe"]},{"id":"not_equals","label":"différent de","label_html":"différent de","category":"comparison","confirmed_for":["code_societe"]},{"id":"starts_with","label":"commence par","label_html":"commence par","category":"text","confirmed_for":["code_societe"]},{"id":"contains","label":"contient","label_html":"contient","category":"text","confirmed_for":["code_societe"]},{"id":"not_contains","label":"ne contient pas","label_html":"ne contient pas","category":"text","confirmed_for":["code_societe"]},{"id":"less_than","label":"inférieur à","label_html":"inférieur à","category":"comparison","confirmed_for":["code_societe"]},{"id":"less_or_equal","label":"inférieur ou égal à","label_html":"inférieur ou égal à","category":"comparison","confirmed_for":["code_societe"]},{"id":"greater_than","label":"supérieur à","label_html":"supérieur à","category":"comparison","confirmed_for":["code_societe"]},{"id":"greater_or_equal","label":"supérieur ou égal à","label_html":"supérieur ou égal à","category":"comparison","confirmed_for":["code_societe"]}],"fields":[{"id":"code_societe","label":"Code société","display_order":1,"input_type":"text","input_type_status":"inferred_from_screen","default_operator":"equals","default_operator_label":"égal à","available_operators":["equals","not_equals","starts_with","contains","not_contains","less_than","less_or_equal","greater_than","greater_or_equal"],"operator_status":"confirmed_by_screenshot","value_example":"FR01"},{"id":"nom_fournisseur","label":"Nom du fournisseur","display_order":2,"input_type":"text","input_type_status":"inferred_from_screen","default_operator":"starts_with","default_operator_label":"commence par","available_operators":null,"operator_status":"to_validate_from_html_or_screenshot","value_example":"ACME"},{"id":"date_facture","label":"Date de facture","display_order":3,"input_type":"date","input_type_status":"inferred_from_label","default_operator":"equals","default_operator_label":"égal à","available_operators":null,"operator_status":"to_validate_from_html_or_screenshot","value_example":"2026-10-15","value_format":"YYYY-MM-DD"},{"id":"numero_facture","label":"Numéro de facture","display_order":4,"input_type":"text","input_type_status":"inferred_from_screen","default_operator":"equals","default_operator_label":"égal à","available_operators":null,"operator_status":"to_validate_from_html_or_screenshot","value_example":"FAC-2026-001"},{"id":"etat_facture","label":"État de la facture","display_order":5,"input_type":"select_or_text","input_type_status":"to_validate_from_html","default_operator":"equals","default_operator_label":"égal à","available_operators":null,"operator_status":"to_validate_from_html_or_screenshot","value_example":"À valider"}],"ui_defaults_observed":{"filter_group":"Factures assignées au comptable","visible_invoice_count":41,"filter_rows_visible":4,"actions":["Ajouter un critère","Appliquer"],"additional_filter_area":"État de la facture"},"integration_notes":{"recommended_format":"JSON","reason":"Le JSON permet de conserver les labels, les identifiants techniques, l'ordre d'affichage, les types de valeurs, les opérateurs et le statut de validation dans une structure facilement consommable par JavaScript.","recommended_usage":"Charger le fichier côté JavaScript, générer la liste des champs, puis filtrer la liste des opérateurs selon fields[].available_operators.","fallback_behavior":"Si available_operators vaut null, afficher uniquement le champ et son opérateur par défaut, ou utiliser une configuration temporaire explicitement marquée comme hypothèse."}};

  function notifyParentStep(targetStep) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'ESKER_GOTO_STEP', step: targetStep }, '*');
    }
  }

  /* =========================================================================
     INTERCEPTION GLOBALE DES LIENS & NAVIGATION PAR ONGLETS ESKER (ACCUEIL / FACTURES)
     ========================================================================= */
  document.addEventListener('click', function (e) {
    const a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;

    const href = a.getAttribute('href') || '';
    const origHref = a.getAttribute('data-esk-href') || '';

    // Bloquer systématiquement toute tentative de navigation vers un serveur Esker externe
    if (href.indexOf('esker.com') !== -1 || href.indexOf('.aspx') !== -1 || origHref) {
      e.preventDefault();
    }

    // Navigation libre via les onglets de la barre de menu Esker
    const tabText = (a.textContent || '').trim().toUpperCase();
    if (a.classList.contains('tabs-tab') || a.id === 'header-logo-left') {
      if (tabText === 'ACCUEIL' || a.id === 'header-logo-left') {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(8);
      } else if (tabText === 'FACTURES FOURNISSEURS') {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(9);
      } else if (tabText === 'RAPPORTS') {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(4);
      }
    }
  }, true);

  document.addEventListener('click', function(e) {
    // Si on clique sur le bouton Synergy Agent ou un de ses enfants, ne pas intercepter
    if (e.target && e.target.closest && e.target.closest('#header-synergy-agent-button, #reactChatPanelRoot')) return;
    const el=e.target && e.target.closest ? e.target.closest('a,button,[role="tab"]') : null;
    if(!el) return;
    // Si l'élément est le bouton Synergy Agent, ignorer
    if (el.id === 'header-synergy-agent-button' || el.closest('#reactChatPanelRoot')) return;
    const text=(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
    if(text === 'ACCUEIL' || text === 'ESKER') { e.preventDefault(); e.stopImmediatePropagation(); notifyParentStep(8); }
    else if(text === 'FACTURES FOURNISSEURS') { e.preventDefault(); e.stopImmediatePropagation(); notifyParentStep(9); }
  }, true);

  /* =========================================================================
     VOLET LATÉRAL « SYNERGY AGENT » (ACTIF SUR TOUTES LES PAGES QUI ONT LE BOUTON)
     ========================================================================= */
  function setupSynergyAgentGlobal() {
    const synBtn = document.getElementById('header-synergy-agent-button');
    let chatTd = document.getElementById('reactChatPanelRoot');

    if (!synBtn) return;
    if (!chatTd) {
      chatTd = document.createElement('div');
      chatTd.id = 'reactChatPanelRoot';
      chatTd.className = 'synergy-panel synergy-panel-fallback';
      document.body.appendChild(chatTd);
    }

    synBtn.classList.add('esk-synergy-ready');
    synBtn.title = 'Cliquez pour ouvrir ou fermer le volet Synergy Agent';
    chatTd.classList.add('synergy-panel');
    chatTd.style.verticalAlign = 'top';

    // Injecter le DOM complet de Synergy Agent s'il n'est pas encore présent
    if (!chatTd.querySelector('#chatbot-container') && window.ESKER_INPLACE_STATES && window.ESKER_INPLACE_STATES.synergy_panel_html) {
      chatTd.innerHTML = window.ESKER_INPLACE_STATES.synergy_panel_html;
    }
    chatTd.style.display = chatTd.dataset.synergyOpen === 'true' ? 'table-cell' : 'none';

    const openPanel = () => {
      if (!chatTd.querySelector('#chatbot-container') && window.ESKER_INPLACE_STATES && window.ESKER_INPLACE_STATES.synergy_panel_html) {
        chatTd.innerHTML = window.ESKER_INPLACE_STATES.synergy_panel_html;
        bindPanelEvents();
      }
      chatTd.dataset.synergyOpen = 'true';
      chatTd.style.display = 'table-cell';
      chatTd.style.height = 'calc(100vh - 56px)';
      chatTd.style.minHeight = '100%';
      synBtn.classList.add('header-synergy-button-open');
      const input = chatTd.querySelector('#message-input');
      if (input) setTimeout(() => input.focus(), 80);
      setTimeout(updateAllBadges, 60);
    };
    const closePanel = () => {
      chatTd.dataset.synergyOpen = 'false';
      chatTd.style.display = 'none';
      synBtn.classList.remove('header-synergy-button-open');
      setTimeout(updateAllBadges, 60);
    };

    function bindPanelEvents() {
      const closeIcon = chatTd.querySelector('.chat-close');
      if (closeIcon) {
        const closeBtn = closeIcon.closest('.chatbot-header-button') || closeIcon;
        closeBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          closePanel();
        };
      }

      const expandIcon = chatTd.querySelector('.chat-expand-arrow');
      const chatContainer = chatTd.querySelector('.esk-chat-container');
      if (expandIcon && chatContainer) {
        const expandBtn = expandIcon.closest('.chatbot-header-button') || expandIcon;
        expandBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          const expanded = chatContainer.classList.toggle('expanded');
          chatContainer.style.minWidth = expanded ? '560px' : '400px';
          chatContainer.style.maxWidth = expanded ? '560px' : '400px';
          setTimeout(updateAllBadges, 60);
        };
      }

      const msgInput = chatTd.querySelector('#message-input');
      const sendArrow = chatTd.querySelector('#message-input-arrow');
      const msgList = chatTd.querySelector('#message-list-container');
      const sendSynergyMessage = () => {
        if (!msgInput || !msgList) return;
        const text = msgInput.value.trim();
        if (!text) return;
        const userMsg = document.createElement('div');
        userMsg.className = 'message-container';
        userMsg.innerHTML = '<div class="user-name-container"><div class="icon-assistant"></div><span class="user-name">Vous</span></div><div class="fade-animation"><div class="message-content lighter-table"><p></p></div></div>';
        userMsg.querySelector('p').textContent = text;
        msgList.appendChild(userMsg);
        msgInput.value = '';
        if (sendArrow) sendArrow.classList.add('disable');
        msgList.scrollTop = msgList.scrollHeight;
        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.className = 'message-container';
          botMsg.innerHTML = '<div class="user-name-container"><div class="icon-assistant"></div><span class="user-name">Synergy</span></div><div class="fade-animation"><div class="message-content lighter-table"><p></p></div></div>';
          botMsg.querySelector('p').textContent = "Je peux vous orienter vers les factures en retard, les blocages d'approbation et les écarts de rapprochement dans cette démonstration.";
          msgList.appendChild(botMsg);
          msgList.scrollTop = msgList.scrollHeight;
        }, 350);
      };
      if (msgInput) {
        msgInput.oninput = () => {
          if (sendArrow) sendArrow.classList.toggle('disable', !msgInput.value.trim());
        };
        msgInput.onkeydown = e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendSynergyMessage();
          }
        };
      }
      if (sendArrow) sendArrow.onclick = e => { e.preventDefault(); sendSynergyMessage(); };
    }

    if (!synBtn.dataset.synergyBound) {
      synBtn.dataset.synergyBound = 'true';
      synBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (chatTd.dataset.synergyOpen === 'true') closePanel();
        else openPanel();
      });
      bindPanelEvents();
    }
  }

  function ensureHoverTooltip() {
    if (!hoverTooltip) {
      hoverTooltip = document.createElement('div');
      hoverTooltip.className = 'esk-hover-tooltip';
      document.body.appendChild(hoverTooltip);
    }
    return hoverTooltip;
  }

  function bindTooltip(el, title, text) {
    if (!el || el.dataset.tooltipBound) return;
    el.dataset.tooltipBound = 'true';
    el.addEventListener('mouseenter', function () {
      const tip = ensureHoverTooltip();
      tip.innerHTML = '<strong>' + title + '</strong>' + text;
      tip.classList.add('visible');
      positionTooltipNearElement(el);
    });
    el.addEventListener('mouseleave', function () {
      if (hoverTooltip) hoverTooltip.classList.remove('visible');
    });
  }

  function positionTooltipNearElement(targetEl) {
    if (!hoverTooltip || !targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const w = hoverTooltip.offsetWidth || 330;
    const h = hoverTooltip.offsetHeight || 85;

    let top = rect.top - h - 10;
    let left = rect.left;

    if (top < 12) {
      top = rect.bottom + 10;
    }
    if (left + w > window.innerWidth - 16) {
      left = window.innerWidth - w - 16;
    }
    left = Math.max(12, left);

    hoverTooltip.style.top = Math.round(top) + 'px';
    hoverTooltip.style.left = Math.round(left) + 'px';
  }

  function addPanelInfoPill(panelId, pillLabel, tooltipTitle, tooltipText) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.classList.add('esk-pulse-secondary');
    const titleEl = panel.querySelector('.border-title') || panel.querySelector('.modtitle');
    if (!titleEl) return;

    const pill = document.createElement('span');
    pill.className = 'esk-panel-info-pill';
    pill.textContent = 'ⓘ ' + pillLabel;
    titleEl.appendChild(pill);
    bindTooltip(pill, tooltipTitle, tooltipText);
  }

  function clearStepDecorations() {
    document.querySelectorAll('.esk-pulse-primary, .esk-pulse-secondary, .esk-svg-pulse, .esk-pulse-row, .esk-pulse-row-amber').forEach(function (el) {
      el.classList.remove('esk-pulse-primary', 'esk-pulse-secondary', 'esk-svg-pulse', 'esk-pulse-row', 'esk-pulse-row-amber');
    });
    document.querySelectorAll('.esk-panel-info-pill').forEach(function (p) {
      if (p.parentNode) p.parentNode.removeChild(p);
    });
    activeBadges.forEach(function (b) {
      if (b.el && b.el.parentNode) b.el.parentNode.removeChild(b.el);
    });
    activeBadges = [];
    if (hoverTooltip) hoverTooltip.classList.remove('visible');
  }

  function createFloatingBadge(targetEl, label, onClick, options) {
    if (!targetEl) return null;
    const opts = options || {};
    const badge = document.createElement('div');
    badge.className = 'esk-floating-badge' + (opts.amber ? ' amber' : '');
    badge.innerHTML = '<span class="dot"></span><span>' + label + '</span>';
    badge.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) onClick();
    });
    document.body.appendChild(badge);

    const item = { el: badge, target: targetEl, pos: opts.pos || 'top', offsetY: opts.offsetY || 0, offsetX: opts.offsetX || 0 };
    activeBadges.push(item);
    updateBadgePosition(item);
    return badge;
  }

  function updateBadgePosition(item) {
    if (!item.target || !item.el) return;
    const rect = item.target.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      item.el.style.display = 'none';
      return;
    }
    item.el.style.display = 'inline-flex';
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const bw = item.el.offsetWidth || 220;
    const bh = item.el.offsetHeight || 30;

    let top = rect.top + scrollY - bh - 10 + item.offsetY;
    let left = rect.left + scrollX + (rect.width / 2) - (bw / 2) + item.offsetX;

    if (item.pos === 'bottom') {
      top = rect.bottom + scrollY + 10 + item.offsetY;
    } else if (item.pos === 'right') {
      top = rect.top + scrollY + (rect.height / 2) - (bh / 2) + item.offsetY;
      left = rect.right + scrollX + 12 + item.offsetX;
    } else if (item.pos === 'left') {
      top = rect.top + scrollY + (rect.height / 2) - (bh / 2) + item.offsetY;
      left = rect.left + scrollX - bw - 12 + item.offsetX;
    }

    left = Math.max(12, Math.min(left, document.documentElement.clientWidth + scrollX - bw - 12));
    top = Math.max(8, top);

    item.el.style.top = Math.round(top) + 'px';
    item.el.style.left = Math.round(left) + 'px';
  }

  function updateAllBadges() {
    activeBadges.forEach(updateBadgePosition);
  }

  window.addEventListener('scroll', updateAllBadges, true);
  window.addEventListener('resize', updateAllBadges);

  function focusPrimaryTarget() {
    const primary = document.querySelector('.esk-pulse-primary, .esk-svg-pulse, .esk-pulse-row');
    if (primary) {
      primary.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      setTimeout(updateAllBadges, 350);
    }
  }

  /* =========================================================================
     ÉTAPES 1, 2, 3 & 7 : TABLEAU DE BORD (DRILL-DOWN 3 NIVEAUX & FOCUS 40 FACTURES)
     ========================================================================= */
  function setupDashboardStep(stepId, shouldScroll) {
    const chartBox = document.getElementById('DashReport_AP_Invoices pending per approver');
    const levelMap = {1: 1, 2: 1, 3: 2, 4: 3, 8: 1};
    const dashLevel = levelMap[stepId] || 1;
    if (chartBox && window.ESKER_INPLACE_STATES && window.ESKER_INPLACE_STATES['dash_level_' + dashLevel]) chartBox.innerHTML = window.ESKER_INPLACE_STATES['dash_level_' + dashLevel];

    const firstStep = stepId === 1;
    const counter40 = document.getElementById('DashCounter_AP_InvoicesInAccountingDepartment');
    if (counter40) {
      counter40.onclick = e => { e.preventDefault(); e.stopPropagation(); notifyParentStep(9); };
      counter40.classList.add(stepId === 8 ? 'esk-pulse-primary' : 'esk-pulse-secondary');
      if (stepId === 1 || stepId === 8) createFloatingBadge(counter40, '🎯 40 factures assignées au comptable : cliquez ici pour ouvrir la corbeille', ()=>notifyParentStep(9), {pos:'bottom'});
    }

    setupDashboardHoverExplanations();

    if (!chartBox) return;
    const reportLink = chartBox.querySelector('.dashReportLink');
    const titleCell = chartBox.querySelector('.dashReportTitleCell');
    if (reportLink) {
      reportLink.setAttribute('href','javascript:void(0)');
      reportLink.style.cursor = 'pointer';
      reportLink.title = 'Cliquer pour ouvrir le rapport détaillé Factures en attente (Étape 5)';
      reportLink.onclick = e => { e.preventDefault(); e.stopPropagation(); notifyParentStep(5); };
    }
    if (titleCell) {
      titleCell.style.cursor = 'pointer';
      titleCell.title = 'Cliquer pour ouvrir le rapport détaillé Factures en attente (Étape 5)';
      titleCell.onclick = e => { e.preventDefault(); e.stopPropagation(); notifyParentStep(5); };
    }

    chartBox.querySelectorAll('.highcharts-breadcrumbs-button').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='true'; btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation(); const t=btn.textContent||''; notifyParentStep(t.includes('Marc')?2:1);}); });

    if (stepId === 2 || stepId === 8 || stepId === 1) {
      const labels=Array.from(chartBox.querySelectorAll('.highcharts-data-label')).filter(l=>l.textContent.includes('Marc'));
      const slice=chartBox.querySelector('.highcharts-point.highcharts-color-0');
      if (slice) {
        slice.style.cursor = 'pointer';
        slice.onclick = e => { e.preventDefault(); e.stopPropagation(); notifyParentStep(3); };
      }
      labels.forEach(l => {
        l.style.cursor = 'pointer';
        l.onclick = e => { e.preventDefault(); e.stopPropagation(); notifyParentStep(3); };
      });
    }

    if (stepId === 2) {
      const labels=Array.from(chartBox.querySelectorAll('.highcharts-data-label')).filter(l=>l.textContent.includes('Marc')); const slice=chartBox.querySelector('.highcharts-point.highcharts-color-0'); const target=labels.at(-1)||slice;
      if(slice){slice.classList.add('esk-svg-pulse'); slice.onclick=e=>{e.preventDefault();e.stopPropagation();notifyParentStep(3);};}
      labels.forEach(l=>{l.style.cursor='pointer';l.onclick=e=>{e.preventDefault();e.stopPropagation();notifyParentStep(3);}});
      createFloatingBadge(target||chartBox,'🎯 Marc : 12 factures · 44,4 %',()=>notifyParentStep(3),{pos:'bottom'});
    } else if (stepId === 3) {
      const labels=Array.from(chartBox.querySelectorAll('.highcharts-data-label')).filter(l=>l.textContent.toUpperCase().includes('ACME')); const slice=chartBox.querySelector('.highcharts-point.highcharts-color-0'); const target=labels.at(-1)||slice;
      if(slice){slice.classList.add('esk-svg-pulse');slice.onclick=e=>{e.preventDefault();e.stopPropagation();notifyParentStep(4);};}
      labels.forEach(l=>{l.style.cursor='pointer';l.onclick=e=>{e.preventDefault();e.stopPropagation();notifyParentStep(4);}});
      createFloatingBadge(target||chartBox,'🎯 ACME Supply Company : 4 factures · 33,3 %',()=>notifyParentStep(4),{pos:'bottom'});
    } else if (stepId === 4) {
      const target=titleCell||reportLink;
      if(target){target.classList.add('esk-pulse-primary');createFloatingBadge(target,'🎯 Niveau 3 : ouvrez le rapport filtré sur Acme',()=>notifyParentStep(5),{pos:'top'});}
    }

    if (firstStep) { window.scrollTo({top:0, behavior:'auto'}); }
    else if (stepId === 8) { window.scrollTo({top:0, behavior:'auto'}); }
    else if (shouldScroll) setTimeout(()=>{chartBox.scrollIntoView({behavior:'smooth',block:'center'});updateAllBadges();},80);
    setTimeout(updateAllBadges,80);
  }

    function setupDashboardHoverExplanations() {
    const add = (el, title, text) => {
      if (!el || el.dataset.hoverExplanation) return;
      el.dataset.hoverExplanation = 'true';
      el.classList.add('esk-dash-hoverable');
      bindTooltip(el, title, text);
    };

    const search = document.querySelector('input[placeholder*="Recherch"], input[aria-label*="Recherch"]');
    add(search, 'Recherche universelle intelligente', 'Recherchez instantanément par numéro de facture, référence de commande, nom de fournisseur ou montant pour accéder directement à la pièce comptable recherchée.');

    const workspace = document.querySelector('.header-menu-with-synergy, #header-contents');
    add(workspace, 'Espaces de travail & Processus Esker', 'Basculez en un clic entre la gestion des factures fournisseurs, les bons de commande, les fournisseurs référencés, les campagnes de paiement et les rapports décisionnels.');

    // Explications métier précises pour chaque compteur
    const counterMap = {
      "DashCounter_AP_InvoiceBatchesToSplit": [
        "Lots à découper (Capture)",
        "Fichiers multi-factures en attente de découpage manuel ou assisté par IA. Permet d'éliminer les goulots d'étranglement dès l'acquisition pour éviter que des factures ne restent invisibles dans la file de traitement."
      ],
      "DashCounter_AP_InvoicesInAccountingDepartment": [
        "Assignées au comptable (40 factures)",
        "Volume de factures en cours de contrôle ou de saisie par l'équipe comptable. Thermomètre de charge : plus ce volume baisse à périmètre constant, plus le taux d'automatisation (Touchless) est performant."
      ],
      "DashCounter_AP_InvoicesToApprove": [
        "Assignées aux approbateurs (20 factures)",
        "Factures en attente de visa chez les opérationnels (acheteurs, managers de centres de coûts). Permet d'identifier et relancer de façon ciblée les directions métier qui retardent le cycle de validation."
      ],
      "DashCounter_AP_InvoicesOnHold": [
        "En attente (7 factures en litige)",
        "Factures bloquées pour litige tarifaire, service non fait ou attente d'avoir. Isole les contestations actives pour sécuriser les décaissements et accélérer les résolutions de litiges."
      ],
      "DashCounter_AP_InvoicesToPay": [
        "En attente de paiement (8 factures)",
        "Factures validées et comptabilisées prêtes pour la prochaine campagne de règlement. Donne au Trésorier une visibilité exacte sur les décaissements certains à court terme."
      ],
      "DashCounter_AP_InvoicesInError": [
        "En erreur d'interface (1 facture)",
        "Factures bloquées techniquement (échec de synchronisation ERP, données de base manquantes). Alerte immédiate évitant qu'une anomalie système ne devienne un retard de paiement."
      ],
      "DashCounter_AP_Invoices overdue": [
        "Montant échu (228 k€ / 24 factures)",
        "Dettes fournisseurs dont la date d'échéance contractuelle est dépassée sans règlement. Indicateur direct de risque d'amendes administratives (Loi LME), de pénalités et d'interruption de livraisons."
      ],
      "DashCounter_AP_Potentially Invoices overdue": [
        "Risque de retard (7,07 k€ / 4 factures)",
        "Factures non soldées arrivant à échéance sous 5 à 10 jours avec risque de dépassement. Permet de prioriser les validations par urgence financière plutôt qu'au fil de l'eau."
      ],
      "DashCounter_AP_Invoices with available discounts": [
        "Escomptes disponibles (108 $ / 1 facture)",
        "Montant potentiel de remises pour paiement anticipé encore captables. Transforme la comptabilité fournisseurs en centre de profit en optimisant le rendement des liquidités de trésorerie."
      ],
      "DashCounter_AP_VendorStatementsToApprove": [
        "Relevés fournisseurs à rapprocher (1 relevé)",
        "Relevés de comptes reçus des partenaires en attente de cadrage. Permet de détecter les pièces manquantes et les doublons avant la clôture mensuelle pour sécuriser les provisions (FNP/CCA)."
      ]
    };

    Object.keys(counterMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        add(el, counterMap[id][0], counterMap[id][1]);
      }
    });

    // Explications métier précises pour chaque graphique
    const reportMap = {
      "DashReport_AP_TimePerStep": [
        "Délai moyen de traitement par état",
        "Mesure la durée moyenne passée par une facture à chaque étape (Capture, Saisie, Approbation, Contrôle, Validation ERP). Permet de localiser immédiatement les goulots d'étranglement pour fluidifier le cycle global."
      ],
      "DashReport_AP_Invoices verified by month": [
        "Factures vérifiées par mois",
        "Volume mensuel de factures contrôlées par l'équipe comptable. Permet de mesurer l'évolution de la productivité dans le temps, d'anticiper la saisonnalité (clôtures) et de calibrer les effectifs."
      ],
      "DashReport_AP_Average processing time": [
        "Délai moyen de traitement par fournisseur",
        "Temps moyen de cycle entre réception et bon à payer par tiers. Isole les fournisseurs générant des anomalies récurrentes pour alimenter les négociations achats et imposer la facturation électronique."
      ],
      "DashReport_AP_Time By ApproverCDL": [
        "Délai moyen d'approbation par approbateur",
        "Classement des valideurs métier en fonction de leur temps de réponse. Permet au management d'ajuster les règles d'escalade, de fixer des délégations temporaires et d'éradiquer les rétentions injustifiées."
      ],
      "DashReport_AP_SLA over time": [
        "Délai moyen de traitement par mois",
        "Évolution historique du temps de traitement global par rapport aux engagements de service (SLA). Démontre le ROI de la dématérialisation (ex. réduction de 25 à 4 jours de cycle) et la conformité légale."
      ],
      "DashReport_AP_Invoices pending per vendor": [
        "Factures en attente par fournisseur",
        "Concentration du stock d'impayés en cours par partenaire stratégique. Prévient les suspensions de livraisons et les appels au standard comptable en traitant en priorité les fournisseurs clés."
      ],
      "DashReport_AP_Invoices pending per approver": [
        "Factures en attente par approbateur (Graphique central interactif)",
        "Répartition des factures actuellement retenues par chaque valideur. Permet d'organiser des relances ciblées avant la clôture mensuelle pour garantir l'exhaustivité des engagements comptables."
      ],
      "DashReport_AP_PaidOnTime": [
        "Factures payées à temps",
        "Taux de conformité des règlements à l'échéance contractuelle. Indicateur audité par la direction générale et les commissaires aux comptes, garantissant l'image de marque et la négociation d'escomptes."
      ],
      "DashReport_AP_InvoicesWithHolds": [
        "Factures précédemment mises en attente",
        "Proportion de factures ayant subi un gel au cours de leur traitement. Révèle les coûts de non-qualité amont (commandes mal passées, réceptions en retard en entrepôt) pour agir sur les causes racines."
      ],
      "DashReport_AP_Invoices by submission method": [
        "Factures par mode de réception (3 derniers mois)",
        "Répartition des canaux d'entrée (E-mail PDF, EDI, Portail, Factur-X, Papier). Permet de piloter la transition vers les flux structurés de la réforme électronique pour maximiser le traitement automatisé."
      ],
      "DashReport_AP_Invoices PO vs Non-PO trend": [
        "Répartition des factures avec et sans commande",
        "Ratio factures associées à un bon de commande (PO) vs frais généraux directs (Non-PO). Pilote l'adhésion à la politique Achats 'No PO, No Pay' et maximise le rapprochement automatique 3-way matching."
      ],
      "DashReport_AP_User per profile": [
        "Utilisateurs par profil",
        "Ventilation des utilisateurs actifs par profil (Comptables, Approbateurs, Gestionnaires, Administrateurs). Permet de gérer la sécurité des accès et la séparation des tâches de contrôle."
      ],
      "DashReport_AP_InvoicesByDueDate": [
        "Balance âgée",
        "Ventilation des dettes exigibles par tranches d'antériorité (Non échues, 1-30j, 31-60j, 61-90j, >90j). Offre au DAF et Trésorier une vue claire du passif pour arbitrer les priorités de trésorerie."
      ],
      "DashReport_AP_PaymentForecast": [
        "Prévisions de paiements",
        "Calendrier prévisionnel des montants à décaisser sur les semaines à venir. Permet d'anticiper les besoins en liquidités, d'optimiser les lignes de crédit et de lisser les tirages bancaires."
      ],
      "DashReport_AP_DiscountForecast": [
        "Escomptes disponibles",
        "Calendrier des remises financières pour paiement anticipé à capturer. Permet de générer un gain financier direct sur les liquidités dormantes en accélérant les factures éligibles."
      ],
      "DashReport_AP_DPO": [
        "Délai moyen de paiement (DPO)",
        "Days Payable Outstanding : nombre moyen de jours mis pour régler les dettes fournisseurs. Indicateur clé du BFR permettant d'équilibrer trésorerie préservée et ponctualité exemplaire."
      ],
      "DashReport_AP_InvoicesCompanyCodes": [
        "Factures par code société",
        "Ventilation de l'activité comptable par entité juridique ou filiale du groupe. Permet de mesurer la charge des centres de services partagés (CSP) et d'identifier les filiales en retard de traitement."
      ],
      "DashReport_AP_ProcessedDocuments60Days": [
        "Factures des 60 derniers jours",
        "Volume de documents traités sur les 2 derniers mois. Permet de suivre le rythme opérationnel à court terme et la réactivité immédiate du centre de traitement."
      ],
      "DashReport_AP_ProcessedDocuments6Months": [
        "Factures des 6 derniers mois",
        "Volume semestriel consolidé. Permet de mesurer la trajectoire de productivité et de lisser les effets de saisonnalité entre clôtures semestrielles."
      ],
      "DashReport_AP_ProcessedDocuments3Years": [
        "Factures des 3 dernières années",
        "Volume pluriannuel traité sur la plateforme. Démontre la capacité de montée en charge de la solution sans augmentation linéaire des coûts de gestion comptable."
      ]
    };

    Object.keys(reportMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        add(el, reportMap[id][0], reportMap[id][1]);
      }
    });

    document.querySelectorAll('.dashButtonContent').forEach(el => {
      add(el, 'Action rapide opérationnelle', 'Lancement immédiat d\'une opération comptable clé : téléversement de factures, import de relevés bancaires ou exportation des écritures validées.');
    });
  }

  /* =========================================================================
     ÉTAPE 4 : RAPPORT DÉTAILLÉ (OUVERT DIRECTEMENT AU NIVEAU 3 FILTRÉ SUR ACME)
     ========================================================================= */
  function setupReportStep() {
    const reportDiv=document.getElementById('reportDiv');
    if(reportDiv && window.ESKER_INPLACE_STATES && window.ESKER_INPLACE_STATES.report_level_6) reportDiv.innerHTML=window.ESKER_INPLACE_STATES.report_level_6;
    if(!reportDiv) return;
    const link=Array.from(reportDiv.querySelectorAll('a')).find(a=>a.textContent.trim()==='281270'); const row=link?link.closest('tr'):null; const target=row||link;
    if(row){row.classList.add('esk-pulse-row');row.onclick=e=>{e.preventDefault();e.stopPropagation();notifyParentStep(6);};}
    if(target){createFloatingBadge(link||target,'🎯 La sélection du graphique filtre la liste : ouvrez la facture 281270 (60–90 jours)',()=>notifyParentStep(6),{pos:'top'}); setTimeout(()=>{const r=target.getBoundingClientRect(); window.scrollTo({top:Math.max(0,window.scrollY+r.top-190),behavior:'smooth'}); updateAllBadges();},120);}
    setTimeout(updateAllBadges,180);
  }

  function bindInvoiceQuitButtons(targetStep, badgeText) {
    const candidates = [];
    const header = document.getElementById('header-quit-button');
    if (header) candidates.push(header);
    document.querySelectorAll('.form-footer a, .FooterButtons a').forEach(function (el) {
      const text = (el.textContent || '').trim();
      if (text === 'Quitter' && !el.classList.contains('sf-hidden') && !el.classList.contains('HiddenRunTime')) candidates.push(el);
    });
    Array.from(new Set(candidates)).forEach(function (quitBtn) {
      quitBtn.classList.add('esk-pulse-primary');
      quitBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(targetStep);
      };
      if (!quitBtn.dataset.eskQuitBound) {
        quitBtn.dataset.eskQuitBound = 'true';
        createFloatingBadge(quitBtn, badgeText || '🎯 Cliquez sur Quitter pour revenir au tableau de bord', function () {
          notifyParentStep(targetStep);
        }, { pos: 'bottom', offsetX: -110 });
      }
    });
  }

  /* =========================================================================
     ÉTAPES 5 & 6 : FACTURE BLOQUÉE ACME (281270) & CONVERSATION INTERNE MARC
     ========================================================================= */
  function setupAcmeInvoiceStep(stepId) {
    const leftPane = document.getElementById('form-content-left');
    const rightPane = document.getElementById('form-content-right');
    const chatPane = document.getElementById('form-content-internalconversation');
    const chatBtn = document.getElementById('header-internalconversation-button');

    // Pastilles ⓘ propres dans les barres de titre des panneaux (sans tirets coupés ni survol intrusif)
    addPanelInfoPill(
      'Invoice_Processing',
      'En attente de réception',
      'Statut : Facture mise en attente',
      'Facture avec commande n° 4500012171 bloquée avec le motif « En attente de l’entrée de biens et services ».'
    );
    addPanelInfoPill(
      'WorkflowDataPanel',
      'Bloquée chez Marc',
      'Workflow d’approbation',
      'La facture est en attente chez Marc GestionnaireCC (« waiting for GR »).'
    );

    if (stepId === 6) {
      if (leftPane) leftPane.style.cssText = 'top:0%;bottom:0%;left:0%;width:54%;display:block';
      if (rightPane) rightPane.style.cssText = 'top:0%;bottom:0%;left:54%;width:46%;display:block';
      if (chatPane) {
        chatPane.style.cssText = 'top:0%;bottom:0%;left:100%;width:25%;display:none';
        chatPane.classList.add('sf-hidden');
      }
      if (chatBtn) {
        chatBtn.classList.remove('isActivated');
        chatBtn.classList.add('esk-pulse-primary');
        chatBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          notifyParentStep(7);
        };
        createFloatingBadge(chatBtn, '🎯 Cliquez sur Conversation interne pour interpeller Marc', function () {
          notifyParentStep(7);
        }, { pos: 'bottom', offsetX: -90 });
      }
      bindInvoiceQuitButtons(8, '🎯 Cliquez sur Quitter pour revenir au tableau de bord');
    } else if (stepId === 7) {
      if (leftPane) leftPane.style.cssText = 'top:0%;bottom:0%;left:0%;width:41%;display:block';
      if (rightPane) rightPane.style.cssText = 'top:0%;bottom:0%;left:41%;width:35%;display:block';
      if (chatPane) {
        chatPane.classList.remove('sf-hidden');
        chatPane.style.cssText = 'top:0%;bottom:0%;left:75%;width:25%;display:block';
      }
      if (chatBtn) {
        chatBtn.classList.add('isActivated');
        chatBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          notifyParentStep(6);
        };
      }

      addPanelInfoPill(
        'InternalConversationPanel',
        'Chat avec @Marc',
        'Collaboration interne traçable',
        'Marc GestionnaireCC a été ajouté à la conversation directement sur la facture.'
      );

      // Bouton Quitter ramenant au tableau de bord (Étape 8)
      bindInvoiceQuitButtons(8, '🎯 Cliquez sur Quitter pour revenir au tableau de bord');
    }

    setupPreviewControls();
    setTimeout(updateAllBadges, 60);
  }

  /* =========================================================================
     ÉTAPE 8 : LISTE DES 40 FACTURES ASSIGNÉES AU COMPTABLE
     ========================================================================= */

  function setupFilterDropdowns(filterPanel) {
    if (!filterPanel || filterPanel.dataset.dropdownEnhanced) return;
    filterPanel.dataset.dropdownEnhanced = 'true';

    // Infobulle explicative sur les critères de filtres
    bindTooltip(
      filterPanel,
      'Critères de filtrage configurables',
      'Vous pouvez ajouter autant de critères de filtrage que nécessaire grâce au bouton « + » en bas à gauche. Chaque champ et chaque opérateur s\'adaptent dynamiquement aux règles de gestion de l\'entreprise.'
    );

    // Infobulle sur le bouton Ajouter un filtre (+)
    const addBtn = filterPanel.querySelector('.ConditionListAddButton, button[title*="Ajouter"], a[title*="Ajouter"]');
    if (addBtn) {
      addBtn.style.cursor = 'pointer';
      bindTooltip(
        addBtn,
        'Ajouter un critère de filtrage',
        'Cliquez pour ajouter une nouvelle condition de filtrage (ET logique). Vous pouvez combiner autant de critères que nécessaire pour affiner la corbeille de factures.'
      );
    }

    // Rendre les champs de saisie de valeur directement interactifs
    const editInputs = filterPanel.querySelectorAll('input[id*="_edit"]');
    editInputs.forEach(inp => {
      inp.classList.remove('sf-hidden');
      inp.style.display = 'block';
      inp.style.backgroundColor = '#ffffff';
      inp.style.border = '1px solid #d1d5db';
      inp.style.borderRadius = '4px';
      inp.style.padding = '4px 8px';
      inp.style.width = '100%';
      inp.style.fontSize = '12px';
      inp.placeholder = 'Filtrer en direct…';
      inp.removeAttribute('readonly');
      inp.removeAttribute('disabled');
      inp.style.pointerEvents = 'auto';
    });

    const tagifySpans = filterPanel.querySelectorAll('tags span.tagify__input');
    tagifySpans.forEach((span, idx) => {
      span.setAttribute('contenteditable', 'true');
      span.style.cursor = 'text';
      span.addEventListener('input', () => {
        if (editInputs[idx]) editInputs[idx].value = span.textContent.trim();
        runLiveTableFilter();
      });
    });
  }

  function setupAdminListStep() {
    const grid = document.getElementById('tpl_ih_adminList_MainGrid');
    if (!grid) return;

    // Mettre en évidence que l'onglet ACCUEIL en haut à gauche permet de revenir au tableau de bord
    const homeTab = document.getElementById(':r0:-tab-home');
    if (homeTab) {
      homeTab.style.cursor = 'pointer';
      homeTab.title = 'Revenir au tableau de bord Accueil';
    }

    // Ligne 1 : Stark Industries (ST2610131135-01) -> Étape 10
    const linkStark = Array.from(grid.querySelectorAll('a')).find(function (a) {
      return a.textContent.trim() === 'ST2610131135-01';
    });
    const rowStark = linkStark ? linkStark.closest('tr') : grid.querySelector('tr.edr-L1');
    if (rowStark) {
      rowStark.classList.add('esk-pulse-row');
      rowStark.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(10);
      });
      createFloatingBadge(linkStark || rowStark, '🎯 Cas 1 : Cliquez sur la ligne Stark Industries (Facture avec commande & écart)', function () {
        notifyParentStep(10);
      }, { pos: 'top' });
    }

    // Ligne 2 : ACME FR (BBA-261001183030) -> Étape 11 (Facture électronique PA)
    const linkPdp = Array.from(grid.querySelectorAll('a')).find(function (a) {
      return a.textContent.trim() === 'BBA-261001183030';
    });
    const rowPdp = linkPdp ? linkPdp.closest('tr') : grid.querySelector('tr.edr-L2');
    if (rowPdp) {
      rowPdp.classList.add('esk-pulse-row-amber');
      rowPdp.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(11);
      });
      createFloatingBadge(linkPdp || rowPdp, '⚡ Cas 2 : Cliquez sur ACME FR / BBA-261001183030 (Facture électronique PA)', function () {
        notifyParentStep(11);
      }, { amber: true, pos: 'bottom' });
    }

    // Rendre les filtres du haut réellement fonctionnels sur les 40 lignes
    const filterPanel = document.getElementById('tpl_ih_adminList_displayed_filters_panel');
    const applyBtn = document.getElementById('tpl_ih_adminList_displayedFilters_applyBtn');
    setupFilterDropdowns(filterPanel);
    if (filterPanel && !filterPanel.dataset.enhanced) {
      filterPanel.dataset.enhanced = 'true';
      const filterInputs = Array.from(filterPanel.querySelectorAll('input[type="text"], input:not([type])'));
      filterInputs.forEach(function (inp) {
        inp.removeAttribute('readonly');
        inp.removeAttribute('disabled');
        inp.style.pointerEvents = 'auto';
        inp.style.backgroundColor = '#ffffff';
        inp.placeholder = 'Filtrer en direct...';
        inp.addEventListener('input', runLiveTableFilter);
      });
      if (applyBtn) {
        applyBtn.addEventListener('click', function (e) {
          e.preventDefault();
          runLiveTableFilter();
        });
      }
    }

    function runLiveTableFilter() {
      if (!filterPanel) return;
      const terms = [];
      filterPanel.querySelectorAll('tr.ConditionListRow').forEach(row => {
        const editInp = row.querySelector('input[id*="_edit"]');
        const tagifySpan = row.querySelector('tags span.tagify__input');
        const val = (editInp && editInp.value ? editInp.value : (tagifySpan ? tagifySpan.textContent : '')).trim().toLowerCase();
        if (val) terms.push(val);
      });
      const dataRows = Array.from(grid.querySelectorAll('tr')).filter(function (r) {
        return r.className && r.className.indexOf('edr-L') !== -1;
      });
      let visibleCount = 0;
      dataRows.forEach(function (r) {
        const txt = r.textContent.toLowerCase();
        const match = terms.every(function (t) { return txt.indexOf(t) !== -1; });
        r.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      const counterVal = document.querySelector('#tpl_ih_adminList_ctl04_counterDisplay span, .ViewCounter span');
      if (counterVal) {
        counterVal.textContent = terms.length > 0 ? String(visibleCount) : '40';
      }
      setTimeout(updateAllBadges, 50);
    }

    // Bouton de personnalisation des colonnes en haut à droite
    const viewBtns = document.getElementById('tpl_ih_adminList_frontViewButtons');
    if (viewBtns && !viewBtns.dataset.enhanced) {
      viewBtns.dataset.enhanced = 'true';
      viewBtns.style.cursor = 'pointer';
      viewBtns.title = 'Personnaliser les colonnes (ajouter, masquer, réordonner)';
      bindTooltip(
        viewBtns,
        'Personnalisation complète des colonnes',
        'Les colonnes de la vue sont totalement configurables : vous pouvez en ajouter, en masquer, réordonner leur disposition ou enregistrer des vues personnalisées adaptées à chaque rôle comptable.'
      );
      viewBtns.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleColumnModal(grid);
      });
    }

    setTimeout(updateAllBadges, 80);
  }

  function toggleColumnModal(grid) {
    let existing = document.getElementById('eskColModal');
    if (existing) {
      existing.remove();
      return;
    }
    const headerRow = grid.querySelector('tr.AdminList_Header_Row') || grid.querySelector('tr');
    if (!headerRow) return;
    const headers = Array.from(headerRow.children);

    const modal = document.createElement('div');
    modal.id = 'eskColModal';
    modal.className = 'esk-col-modal';
    modal.innerHTML = '<div class="esk-col-modal-head"><span>Personnaliser les colonnes</span><button type="button" style="background:none;border:none;color:#fff;font-size:16px;cursor:pointer" id="eskColClose">✕</button></div><div class="esk-col-modal-body" id="eskColBody"></div>';
    document.body.appendChild(modal);

    document.getElementById('eskColClose').onclick = function () { modal.remove(); };
    const body = document.getElementById('eskColBody');

    headers.forEach(function (th, colIdx) {
      const labelTxt = th.textContent.trim();
      if (!labelTxt) return;
      const lbl = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = th.style.display !== 'none';
      cb.addEventListener('change', function () {
        const displayVal = cb.checked ? '' : 'none';
        Array.from(grid.querySelectorAll('tr')).forEach(function (tr) {
          if (tr.children[colIdx]) tr.children[colIdx].style.display = displayVal;
        });
        setTimeout(updateAllBadges, 50);
      });
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(labelTxt));
      body.appendChild(lbl);
    });
  }

  /* =========================================================================
     ÉTAPE 9 : FACTURE AVEC COMMANDE STARK INDUSTRIES (ST2610131135-01)
     ========================================================================= */
  function setupStarkInvoiceStep() {
    const poInput = document.querySelector('input[value="4500000007"]');
    if (poInput) {
      poInput.classList.add('esk-pulse-secondary');
      bindTooltip(
        poInput,
        'Facture avec commande n° 4500000007',
        'Rapprochement automatique avec les 5 postes commandés et réceptionnés sur la commande 4500000007.'
      );
    }

    const htWarn = document.querySelector('#HeaderDataPanel input.fieldWarning');
    if (htWarn) {
      htWarn.classList.add('esk-pulse-primary');
      bindTooltip(
        htWarn,
        '⚠️ Écart sur le Montant HT (3 032,82 EUR)',
        'Le montant HT facturé par Stark Industries (3 032,82 EUR) ne correspond pas au total commandé/réceptionné (3 026,50 EUR), soit un écart de +6,32 EUR.'
      );
      createFloatingBadge(htWarn, '⚠️ Écart Montant HT (+6,32 €) · Survolez le champ', function () {
        const lineItems = document.getElementById('Line_items');
        if (lineItems) lineItems.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, { amber: true, pos: 'right' });
    }

    const lineWarns = document.querySelectorAll('#Line_items input.fieldWarning');
    lineWarns.forEach(function (inp) {
      inp.classList.add('esk-pulse-secondary');
      const val = inp.value || '';
      if (val.indexOf('186') !== -1) {
        bindTooltip(
          inp,
          '⚠️ Écart de quantité sur le poste CNT50922',
          '186,00 unités facturées par Stark Industries contre 185,00 unités commandées / réceptionnées à facturer (+1 unité).'
        );
      } else {
        bindTooltip(
          inp,
          '⚠️ Écart de montant sur le poste CNT50922',
          '1 175,52 EUR facturés contre 1 169,20 EUR attendus sur la commande, soit un écart de +6,32 EUR (+0,54 %).'
        );
      }
    });

    addPanelInfoPill(
      'ExceptionsType',
      'Exception levée : Quantity mismatch',
      'Exception de facture levée automatiquement',
      'L’écart de quantité sur le poste 3 déclenche automatiquement l’exception « Quantity mismatch ».'
    );

    addPanelInfoPill(
      'WorkflowDataPanel',
      'Escalade vers Éric Demandeur',
      'Workflow de résolution d’écart',
      'Le circuit de validation route automatiquement la facture vers Éric Demandeur (Contrôleur) pour arbitrer l’écart.'
    );

    bindInvoiceQuitButtons(8, '🎯 Revenir au tableau de bord');

    setupPreviewControls();
    setTimeout(updateAllBadges, 80);
  }

  /* =========================================================================
     ÉTAPE 10 : FACTURE ÉLECTRONIQUE PA (BBA-261001183030) & MULTI-DOCUMENTS
     ========================================================================= */
  function setupPdpInvoiceStep() {
    const topWarn = document.getElementById('TopPaneWarning');
    if (topWarn) {
      topWarn.classList.add('esk-pulse-secondary');
      bindTooltip(
        topWarn,
        '🚨 Alerte sécurité : IBAN non reconnu',
        'L’IBAN extrait sur la facture ne correspond pas aux coordonnées bancaires connues car aucun RIB n’est enregistré pour ACME FR dans Esker.'
      );
    }

    const contractInput = document.querySelector('input[value="CONTRAT-2025-KRE-0147"]');
    if (contractInput) {
      contractInput.classList.add('esk-pulse-primary');
      bindTooltip(
        contractInput,
        '⚠️ Référence du contrat inexistante (CONTRAT-2025-KRE-0147)',
        'La référence « CONTRAT-2025-KRE-0147 » présente sur la facture électronique n’existe pas dans la base des contrats Esker.'
      );
      createFloatingBadge(contractInput, '⚠️ Contrat inexistant dans Esker · Survolez', function () {
        contractInput.focus();
      }, { amber: true, pos: 'right' });
    }

    const ibanInput = document.querySelector('input[value="FR7630004170100001234567805"]');
    if (ibanInput) {
      ibanInput.classList.add('esk-pulse-secondary');
      bindTooltip(
        ibanInput,
        '⚠️ IBAN sur la facture : FR76 3000 4170 1000 0123 4567 805',
        'Cet IBAN extrait de la facture ne correspond à aucune coordonnée bancaire enregistrée pour ce fournisseur.'
      );
    }

    addPanelInfoPill(
      'BankDetailsPane',
      'Aucune coordonnée bancaire connue',
      'Table Coordonnées bancaires de ACME FR : Vide',
      '« Aucun élément à afficher » : aucune coordonnée bancaire n’étant enregistrée pour ACME FR, Esker lève immédiatement l’alerte IBAN.'
    );

    addPanelInfoPill(
      'French_B2B_compliance_pane',
      'Reçue via Plateforme Agréée (PA)',
      'Conformité Facturation Électronique',
      'Facture de service (S1) reçue et contrôlée via la Plateforme Agréée (PA) avec statut « Mise à disposition ».'
    );

    bindInvoiceQuitButtons(8, '🎯 Revenir au tableau de bord');

    setupMultiDocumentsCarousel();
    setupPreviewControls();
    setTimeout(updateAllBadges, 80);
  }

  function setupMultiDocumentsCarousel() {
    const docsPanel = document.getElementById('DocumentsPanel');
    const previewContent = document.getElementById('PreviewControl0content');
    const previewImg = previewContent ? previewContent.querySelector('img') : null;
    const htmlPreviewContainer = previewContent ? previewContent.querySelector('.preview-html-iframe-container') : null;
    const previewTitle = document.querySelector('#PreviewPanel .border-title');
    const docsTitle = document.querySelector('#DocumentsPanel .border-title');

    if (!docsPanel || !previewContent || !previewImg) return;

    if (!originalInvoiceImgSrc) {
      originalInvoiceImgSrc = previewImg.getAttribute('src');
    }

    const doc1Thumb = docsPanel.querySelector('.document[title="8bf27b52G0a36000.pdf"] img');
    if (doc1Thumb && originalInvoiceImgSrc) {
      doc1Thumb.setAttribute('src', originalInvoiceImgSrc);
      doc1Thumb.style.display = 'inline-block';
      doc1Thumb.style.maxHeight = '84px';
    }

    docsPanel.classList.add('esk-pulse-primary');
    createFloatingBadge(docsPanel, '📄 4 documents joints : Cliquez sur les vignettes 1, 2, 3, 4 pour les afficher à droite', null, { pos: 'bottom' });

    const docItems = Array.from(docsPanel.querySelectorAll('.document'));
    docItems.forEach(function (docEl, idx) {
      docEl.style.cursor = 'pointer';
      docEl.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        docItems.forEach(function (d) {
          d.classList.remove('selected');
          const p = d.querySelector('.page');
          if (p) p.classList.remove('selected');
        });
        docEl.classList.add('selected');
        const pageEl = docEl.querySelector('.page');
        if (pageEl) pageEl.classList.add('selected');

        const docName = docEl.getAttribute('title') || ('Document ' + (idx + 1));
        if (docsTitle) docsTitle.textContent = 'Documents - ' + docName;
        if (previewTitle) previewTitle.textContent = 'Prévisualisation du document - ' + docName + ' - 1/1';

        renderDocumentInPreview(idx, docName, previewImg, htmlPreviewContainer);
      });
    });
  }

  function renderDocumentInPreview(docIndex, docName, previewImg, htmlContainer) {
    if (!previewImg || !htmlContainer) return;

    if (docIndex === 0) {
      previewImg.style.display = '';
      htmlContainer.style.display = 'none';
      return;
    }

    previewImg.style.display = 'none';
    htmlContainer.style.display = 'block';
    htmlContainer.style.position = 'absolute';
    htmlContainer.style.inset = '0';
    htmlContainer.style.background = '#ffffff';
    htmlContainer.style.padding = '28px 36px';
    htmlContainer.style.overflowY = 'auto';
    htmlContainer.style.fontFamily = 'Roboto, Arial, sans-serif';
    htmlContainer.style.boxSizing = 'border-box';

    if (docIndex === 1) {
      htmlContainer.innerHTML = `
        <div style="background:#0f2448;color:#fff;padding:12px 18px;border-radius:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong style="font-size:14px;color:#13b4e2">FLUX STRUCTURÉ FACTUR-X (CII UN/CEFACT)</strong>
            <div style="font-size:12px;color:#9fb3ce">Fichier : factur-x.xml · Profil EN 16931 (Comfort) · Reçu via Plateforme Agréée (PA)</div>
          </div>
          <span style="background:#13b4e2;color:#fff;font-weight:700;font-size:11px;padding:4px 10px;border-radius:12px">XML CERTIFIÉ PA</span>
        </div>
        <pre style="background:#162238;color:#e2f1ff;padding:18px;border-radius:8px;font:12.5px/1.55 Consolas,Monaco,monospace;overflow-x:auto;border:1px solid #2b446e">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
                          xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"&gt;
  &lt;rsm:ExchangedDocument&gt;
    &lt;ram:ID&gt;<span style="color:#ffcf63;font-weight:bold">BBA-261001183030</span>&lt;/ram:ID&gt;
    &lt;ram:TypeCode&gt;380&lt;/ram:TypeCode&gt;
    &lt;ram:IssueDateTime&gt;&lt;udt:DateTimeString format="102"&gt;20261001&lt;/udt:DateTimeString&gt;&lt;/ram:IssueDateTime&gt;
  &lt;/rsm:ExchangedDocument&gt;
  &lt;rsm:SupplyChainTradeTransaction&gt;
    &lt;ram:ApplicableHeaderTradeAgreement&gt;
      &lt;ram:SellerTradeParty&gt;
        &lt;ram:Name&gt;ACME FRANCE&lt;/ram:Name&gt;
        &lt;ram:SpecifiedLegalOrganization&gt;&lt;ram:ID schemeID="0002"&gt;23511615900002&lt;/ram:ID&gt;&lt;/ram:SpecifiedLegalOrganization&gt;
      &lt;/ram:SellerTradeParty&gt;
      &lt;ram:BuyerTradeParty&gt;
        &lt;ram:Name&gt;KREAMOB SA&lt;/ram:Name&gt;
        &lt;ram:SpecifiedLegalOrganization&gt;&lt;ram:ID schemeID="0002"&gt;33319112028662&lt;/ram:ID&gt;&lt;/ram:SpecifiedLegalOrganization&gt;
      &lt;/ram:BuyerTradeParty&gt;
      &lt;ram:BuyerOrderReferencedDocument&gt;
        &lt;ram:IssuerAssignedID&gt;PO-1001&lt;/ram:IssuerAssignedID&gt;
      &lt;/ram:BuyerOrderReferencedDocument&gt;
      &lt;ram:ContractReferencedDocument&gt;
        &lt;!-- ⚠️ Référence de contrat absente du référentiel Esker --&gt;
        &lt;ram:IssuerAssignedID&gt;<span style="background:#d8262e;color:#fff;padding:1px 6px;border-radius:3px;font-weight:bold">CONTRAT-2025-KRE-0147</span>&lt;/ram:IssuerAssignedID&gt;
      &lt;/ram:ContractReferencedDocument&gt;
    &lt;/ram:ApplicableHeaderTradeAgreement&gt;
    &lt;ram:ApplicableHeaderTradeSettlement&gt;
      &lt;ram:InvoiceCurrencyCode&gt;EUR&lt;/ram:InvoiceCurrencyCode&gt;
      &lt;ram:SpecifiedTradeSettlementPaymentMeans&gt;
        &lt;!-- 🚨 IBAN non présent dans les coordonnées bancaires du fournisseur ACME FR --&gt;
        &lt;ram:PayeePartyCreditorFinancialAccount&gt;
          &lt;ram:IBANID&gt;<span style="background:#f5a623;color:#121212;padding:1px 6px;border-radius:3px;font-weight:bold">FR7630004170100001234567805</span>&lt;/ram:IBANID&gt;
        &lt;/ram:PayeePartyCreditorFinancialAccount&gt;
      &lt;/ram:SpecifiedTradeSettlementPaymentMeans&gt;
      &lt;ram:SpecifiedTradeSettlementHeaderMonetarySummation&gt;
        &lt;ram:TaxBasisTotalAmount&gt;7200.00&lt;/ram:TaxBasisTotalAmount&gt;
        &lt;ram:TaxTotalAmount currencyID="EUR"&gt;1440.00&lt;/ram:TaxTotalAmount&gt;
        &lt;ram:GrandTotalAmount&gt;8640.00&lt;/ram:GrandTotalAmount&gt;
        &lt;ram:DuePayableAmount&gt;8640.00&lt;/ram:DuePayableAmount&gt;
      &lt;/ram:SpecifiedTradeSettlementHeaderMonetarySummation&gt;
    &lt;/ram:ApplicableHeaderTradeSettlement&gt;
  &lt;/rsm:SupplyChainTradeTransaction&gt;
&lt;/rsm:CrossIndustryInvoice&gt;</pre>`;
    } else if (docIndex === 2) {
      htmlContainer.innerHTML = `
        <div style="border:1px solid #d5dde8;padding:32px;border-radius:6px;background:#fff;color:#1e293b">
          <div style="display:flex;justify-content:space-between;border-bottom:3px solid #163467;padding-bottom:18px;margin-bottom:24px">
            <div>
              <h2 style="margin:0;color:#163467;font-size:22px">KREAMOB SA</h2>
              <p style="margin:4px 0 0;font-size:12px;color:#64748b">10 avenue du Maréchal Foch · 06230 VILLEFRANCHE-SUR-MER<br>SIRET : 33319112028662 · TVA : FR12333191120</p>
            </div>
            <div style="text-align:right">
              <div style="background:#163467;color:#fff;padding:6px 14px;font-weight:700;font-size:15px;border-radius:4px">BON DE COMMANDE</div>
              <p style="margin:8px 0 0;font-size:13px"><strong>N° Commande :</strong> PO-1001<br><strong>Date :</strong> 15/09/2026<br><strong>Réf. Dossier :</strong> REF-KREAMOB-2026</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;font-size:13px">
            <div style="background:#f8fafc;padding:12px;border-radius:6px">
              <strong style="color:#163467">FOURNISSEUR :</strong><br>ACME FRANCE<br>15 rue les Ulysses, 69006 LYON
            </div>
            <div style="background:#f8fafc;padding:12px;border-radius:6px">
              <strong style="color:#163467">LIEU DE LIVRAISON :</strong><br>KREAMOB — Entrepôt Logistique Sud<br>ZI Les Trois Moulins, 06600 ANTIBES
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
            <thead>
              <tr style="background:#163467;color:#fff;text-align:left">
                <th style="padding:8px 10px">Réf.</th>
                <th style="padding:8px 10px">Désignation</th>
                <th style="padding:8px 10px;text-align:right">Qté</th>
                <th style="padding:8px 10px;text-align:right">Prix net HT</th>
                <th style="padding:8px 10px;text-align:right">Total HT</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #e2e8f0">
                <td style="padding:10px">CAM-0001</td>
                <td style="padding:10px">Campagne marketing digitale Q4 (Forfait service S1)</td>
                <td style="padding:10px;text-align:right">1</td>
                <td style="padding:10px;text-align:right">4 500,00 €</td>
                <td style="padding:10px;text-align:right;font-weight:700">4 500,00 €</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0">
                <td style="padding:10px">CRE-0002</td>
                <td style="padding:10px">Création contenu et visuels multi-supports</td>
                <td style="padding:10px;text-align:right">1</td>
                <td style="padding:10px;text-align:right">2 700,00 €</td>
                <td style="padding:10px;text-align:right;font-weight:700">2 700,00 €</td>
              </tr>
            </tbody>
          </table>
          <div style="text-align:right;font-size:14px">
            <div>Total HT : <strong>7 200,00 €</strong></div>
            <div>TVA (20 %) : <strong>1 440,00 €</strong></div>
            <div style="font-size:16px;color:#163467;margin-top:6px">Total TTC commandé : <strong>8 640,00 €</strong></div>
          </div>
        </div>`;
    } else if (docIndex === 3) {
      htmlContainer.innerHTML = `
        <div style="border:1px solid #d5dde8;padding:32px;border-radius:6px;background:#fff;color:#1e293b">
          <div style="display:flex;justify-content:space-between;border-bottom:3px solid #008995;padding-bottom:18px;margin-bottom:24px">
            <div>
              <h2 style="margin:0;color:#008995;font-size:22px">ACME FRANCE</h2>
              <p style="margin:4px 0 0;font-size:12px;color:#64748b">15 rue les Ulysses · 69006 LYON</p>
            </div>
            <div style="text-align:right">
              <div style="background:#008995;color:#fff;padding:6px 14px;font-weight:700;font-size:15px;border-radius:4px">BON DE LIVRAISON / RÉCEPTION</div>
              <p style="margin:8px 0 0;font-size:13px"><strong>N° BL :</strong> BL-2026-0925<br><strong>Date d'exécution :</strong> 25/09/2026<br><strong>Commande associée :</strong> PO-1001</p>
            </div>
          </div>
          <p style="font-size:13px;background:#f0fdf4;border-left:4px solid #16a34a;padding:10px 14px;color:#166534;margin-bottom:20px">
            <strong>✓ Prestations réceptionnées et validées sans réserve le 25/09/2026</strong> par KREAMOB — Entrepôt Logistique Sud (Quai 7).
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
            <thead>
              <tr style="background:#008995;color:#fff;text-align:left">
                <th style="padding:8px 10px">Réf.</th>
                <th style="padding:8px 10px">Prestation livrée</th>
                <th style="padding:8px 10px;text-align:right">Qté commandée</th>
                <th style="padding:8px 10px;text-align:right">Qté livrée</th>
                <th style="padding:8px 10px">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #e2e8f0">
                <td style="padding:10px">CAM-0001</td>
                <td style="padding:10px">Campagne marketing digitale Q4</td>
                <td style="padding:10px;text-align:right">1</td>
                <td style="padding:10px;text-align:right;font-weight:700">1</td>
                <td style="padding:10px;color:#16a34a;font-weight:700">Conforme ✓</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0">
                <td style="padding:10px">CRE-0002</td>
                <td style="padding:10px">Création contenu et visuels multi-supports</td>
                <td style="padding:10px;text-align:right">1</td>
                <td style="padding:10px;text-align:right;font-weight:700">1</td>
                <td style="padding:10px;color:#16a34a;font-weight:700">Conforme ✓</td>
              </tr>
            </tbody>
          </table>
        </div>`;
    }
  }

  function setupPreviewControls() {
    const previewPanel = document.getElementById('PreviewPanel');
    if (!previewPanel || previewPanel.dataset.zoomEnhanced) return;
    previewPanel.dataset.zoomEnhanced = 'true';

    let scale = 1;
    let rotation = 0;
    const pagePreview = previewPanel.querySelector('.page_preview');
    const zoomMinus = previewPanel.querySelector('.zoomMinus');
    const zoomPlus = previewPanel.querySelector('.zoomPlus');
    const zoomSelect = previewPanel.querySelector('select[name="zoom"]');
    const rotLeft = previewPanel.querySelector('.rotationLeft');
    const rotRight = previewPanel.querySelector('.rotationRight');

    function applyTransform() {
      if (!pagePreview) return;
      pagePreview.style.transformOrigin = 'top left';
      pagePreview.style.transition = 'transform 0.2s ease';
      pagePreview.style.transform = 'scale(' + scale + ') rotate(' + rotation + 'deg)';
    }

    if (zoomPlus) {
      zoomPlus.addEventListener('click', function (e) {
        e.preventDefault();
        scale = Math.min(2.5, +(scale + 0.2).toFixed(2));
        applyTransform();
      });
    }
    if (zoomMinus) {
      zoomMinus.addEventListener('click', function (e) {
        e.preventDefault();
        scale = Math.max(0.4, +(scale - 0.2).toFixed(2));
        applyTransform();
      });
    }
    if (zoomSelect) {
      zoomSelect.removeAttribute('tabindex');
      zoomSelect.addEventListener('change', function () {
        const v = zoomSelect.value;
        if (v === 'width' || v === 'height') scale = 1;
        else scale = (parseFloat(v) || 100) / 100;
        applyTransform();
      });
    }
    if (rotLeft) {
      rotLeft.addEventListener('click', function (e) {
        e.preventDefault();
        rotation = (rotation - 90) % 360;
        applyTransform();
      });
    }
    if (rotRight) {
      rotRight.addEventListener('click', function (e) {
        e.preventDefault();
        rotation = (rotation + 90) % 360;
        applyTransform();
      });
    }
  }

  /* =========================================================================
     INITIALISATION & ÉCOUTE DES MESSAGES DU LECTEUR PARENT
     ========================================================================= */
  function applyStep(stepId, isInPlaceTransition) {
    currentStep = stepId;
    window.ESKER_STEP_ID = stepId;
    clearStepDecorations();
    setupSynergyAgentGlobal();

    document.querySelectorAll('form').forEach(function (f) {
      f.onsubmit = function (e) { e.preventDefault(); return false; };
    });

    if ([1, 2, 3, 4, 8].includes(stepId)) {
      setupDashboardStep(stepId, !isInPlaceTransition || [2, 3, 4].includes(stepId));
    } else if (stepId === 5) {
      setupReportStep();
    } else if (stepId === 6 || stepId === 7) {
      setupAcmeInvoiceStep(stepId);
    } else if (stepId === 9) {
      setupAdminListStep();
    } else if (stepId === 10) {
      setupStarkInvoiceStep();
    } else if (stepId === 11) {
      setupPdpInvoiceStep();
    }
  }

  window.addEventListener('message', function (e) {
    const data = e.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'ESKER_SET_STEP') {
      applyStep(data.step, true);
    } else if (data.type === 'ESKER_FOCUS_TARGET') {
      focusPrimaryTarget();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyStep(currentStep, false); });
  } else {
    applyStep(currentStep, false);
  }

})();
