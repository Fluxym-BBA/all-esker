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
        notifyParentStep(7);
      } else if (tabText === 'FACTURES FOURNISSEURS') {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(8);
      } else if (tabText === 'RAPPORTS') {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(4);
      }
    }
  }, true);

  document.addEventListener('click', function(e) {
    const el=e.target && e.target.closest ? e.target.closest('a,button,[role="tab"]') : null;
    if(!el) return;
    const text=(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
    if(text === 'ACCUEIL' || text === 'ESKER') { e.preventDefault(); e.stopImmediatePropagation(); notifyParentStep(8); }
    else if(text === 'FACTURES FOURNISSEURS') { e.preventDefault(); e.stopImmediatePropagation(); notifyParentStep(9); }
  }, true);

  /* =========================================================================
     VOLET LATÉRAL « SYNERGY AGENT » (ACTIF SUR TOUTES LES PAGES QUI ONT LE BOUTON)
     ========================================================================= */
  function setupSynergyAgentGlobal() {
    const synBtn = document.getElementById('header-synergy-agent-button');
    if (!synBtn) return;

    synBtn.classList.add('esk-synergy-ready');
    synBtn.title = 'Ouvrir Synergy Agent';

    let overlay = document.getElementById('esk-synergy-overlay');
    if (!overlay) {
      overlay = document.createElement('aside');
      overlay.id = 'esk-synergy-overlay';
      overlay.className = 'esk-synergy-overlay';
      overlay.setAttribute('aria-label', 'Synergy Agent');
      overlay.innerHTML = `
        <div class="esk-synergy-head">
          <div><strong>Synergy Agent</strong><small>Assistant intelligent Esker</small></div>
          <div class="esk-synergy-head-actions"><button type="button" data-syn-expand title="Agrandir">⤢</button><button type="button" data-syn-close title="Fermer">×</button></div>
        </div>
        <div class="esk-synergy-intro">Interrogez vos factures, vos échéances, vos fournisseurs, vos workflows et vos indicateurs sans quitter l'espace de travail.</div>
        <div class="esk-synergy-quick-btns">
          <button type="button" class="esk-synergy-qbtn" data-syn-prompt="Quelles sont les factures en retard ?">Factures en retard</button>
          <button type="button" class="esk-synergy-qbtn" data-syn-prompt="Quelles factures sont bloquées chez Marc ?">Blocages chez Marc</button>
          <button type="button" class="esk-synergy-qbtn" data-syn-prompt="Montre-moi les écarts de rapprochement.">Écarts de rapprochement</button>
        </div>
        <div class="esk-synergy-messages" data-syn-messages>
          <div class="esk-synergy-message assistant"><strong>Synergy Agent</strong><p>Je peux vous aider à retrouver une facture, expliquer un blocage, analyser les échéances ou résumer les exceptions détectées.</p></div>
        </div>
        <form class="esk-synergy-form" data-syn-form><input type="text" data-syn-input placeholder="Posez une question à Synergy Agent…"><button type="submit">➤</button></form>`;
      document.body.appendChild(overlay);
    }

    const openPanel = () => {
      overlay.classList.add('open');
      synBtn.classList.add('header-synergy-button-open');
      const input=overlay.querySelector('[data-syn-input]');
      if(input) setTimeout(()=>input.focus(),80);
    };
    const closePanel = () => {
      overlay.classList.remove('open');
      synBtn.classList.remove('header-synergy-button-open');
    };

    if (!synBtn.dataset.synergyBound) {
      synBtn.dataset.synergyBound='true';
      synBtn.addEventListener('click', function(e){ e.preventDefault(); e.stopImmediatePropagation(); if(overlay.classList.contains('open')) closePanel(); else openPanel(); }, true);
      overlay.querySelector('[data-syn-close]').addEventListener('click', closePanel);
      overlay.querySelector('[data-syn-expand]').addEventListener('click', function(){ overlay.classList.toggle('expanded'); });
      const messages=overlay.querySelector('[data-syn-messages]');
      const input=overlay.querySelector('[data-syn-input]');
      const send=(text)=>{
        text=(text||'').trim(); if(!text) return;
        const user=document.createElement('div'); user.className='esk-synergy-message user'; user.innerHTML='<strong>Vous</strong><p></p>'; user.querySelector('p').textContent=text; messages.appendChild(user); input.value=''; messages.scrollTop=messages.scrollHeight;
        setTimeout(()=>{ const bot=document.createElement('div'); bot.className='esk-synergy-message assistant'; bot.innerHTML='<strong>Synergy Agent</strong><p>Dans cette démo, je peux vous orienter vers les factures en retard, les factures assignées au comptable, les blocages d\'approbation et les écarts de rapprochement. Les données affichées correspondent aux écrans capturés dans Esker.</p>'; messages.appendChild(bot); messages.scrollTop=messages.scrollHeight; },350);
      };
      overlay.querySelector('[data-syn-form]').addEventListener('submit',e=>{e.preventDefault();send(input.value);});
      overlay.querySelectorAll('[data-syn-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.synPrompt)));
    }
  }

  /* =========================================================================
     INFOBULLES PROPRES (UNICITÉ SUR LES CHAMPS EN ANOMALIE & PASTILLES ⓘ)
     ========================================================================= */
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
    if (reportLink) { reportLink.setAttribute('href','javascript:void(0)'); reportLink.onclick=e=>{e.preventDefault();e.stopPropagation(); if(stepId===4) notifyParentStep(5);}; }
    if (titleCell) { titleCell.style.cursor = stepId===4 ? 'pointer':'default'; titleCell.onclick=e=>{e.preventDefault();e.stopPropagation(); if(stepId===4) notifyParentStep(5);}; }

    chartBox.querySelectorAll('.highcharts-breadcrumbs-button').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='true'; btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation(); const t=btn.textContent||''; notifyParentStep(t.includes('Marc')?2:1);}); });

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
    const add=(el,title,text)=>{ if(!el||el.dataset.hoverExplanation) return; el.dataset.hoverExplanation='true'; el.classList.add('esk-dash-hoverable'); bindTooltip(el,title,text); };
    const search=document.querySelector('input[placeholder*="Recherch"], input[aria-label*="Recherch"]');
    add(search,'Recherche universelle','Recherchez une facture, un numéro de commande ou un fournisseur pour retrouver rapidement les informations utiles.');
    document.querySelectorAll('[data-testid="counter"]').forEach(el=>add(el,el.textContent.trim().replace(/\s+/g,' '),'Ce compteur donne une vue immédiate du volume à traiter et permet d\'ouvrir la liste correspondante.'));
    document.querySelectorAll('.dashButtonContent').forEach(el=>add(el,el.textContent.trim().replace(/\s+/g,' '),'Action rapide du poste Factures Fournisseurs : import, export ou téléchargement de documents.'));
    document.querySelectorAll('.dashReportContent').forEach(el=>{const title=el.querySelector('.dashReportTitleCell,.dashReportTitle,.dashReportLink'); const t=title?title.textContent.trim().replace(/\s+/g,' '):''; if(t) add(el,t,'Ce rapport transforme les données du processus en indicateur exploitable pour piloter les délais, les blocages, les paiements ou les fournisseurs.');});
    const workspace=document.querySelector('.header-menu-with-synergy, #header-contents');
    add(workspace,'Espaces de travail','Naviguez entre les tables, les factures fournisseurs, les exportations, les fournisseurs, les propositions de paiement et les rapports.');
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

    if (stepId === 5) {
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
          notifyParentStep(6);
        };
        createFloatingBadge(chatBtn, '🎯 Cliquez sur Conversation interne pour interpeller Marc', function () {
          notifyParentStep(6);
        }, { pos: 'bottom', offsetX: -90 });
      }
    } else if (stepId === 6) {
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
          notifyParentStep(5);
        };
      }

      addPanelInfoPill(
        'InternalConversationPanel',
        'Chat avec @Marc',
        'Collaboration interne traçable',
        'Marc GestionnaireCC a été ajouté à la conversation directement sur la facture.'
      );

      // Bouton Quitter ramenant au Tableau de bord (Étape 7) pour cliquer sur les 40 factures
      const quitBtn = document.getElementById('header-quit-button') || document.querySelector('.Quit-button');
      if (quitBtn) {
        quitBtn.classList.add('esk-pulse-primary');
        quitBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          notifyParentStep(7);
        };
        createFloatingBadge(quitBtn, '🎯 Cliquez sur Quitter pour revenir au Tableau de bord', function () {
          notifyParentStep(7);
        }, { pos: 'bottom', offsetX: -110 });
      }
    }

    setupPreviewControls();
    setTimeout(updateAllBadges, 60);
  }

  /* =========================================================================
     ÉTAPE 8 : LISTE DES 40 FACTURES ASSIGNÉES AU COMPTABLE
     ========================================================================= */

  function setupFilterDropdowns(filterPanel) {
    if (!filterPanel || filterPanel.dataset.dropdownEnhanced) return;
    filterPanel.dataset.dropdownEnhanced='true';
    const labels={
      'égal à':'égal à','commence par':'commence par','contient':'contient','différent de':'différent de','ne commence pas par':'ne commence pas par','ne contient pas':'ne contient pas',
      'antérieur à':'antérieur à','postérieur à':'postérieur à','compris entre':'compris entre','aujourd’hui':'aujourd’hui','aujourd hui':'aujourd’hui','ce mois-ci':'ce mois-ci'
    };
    let menu=null;
    const close=()=>{if(menu){menu.remove();menu=null;}};
    document.addEventListener('click',e=>{if(menu && !menu.contains(e.target) && !e.target.closest('.esk-filter-select-enhanced')) close();},true);
    filterPanel.querySelectorAll('select').forEach(sel=>{
      sel.classList.add('esk-filter-select-enhanced');
      sel.addEventListener('mousedown',e=>{e.preventDefault();},true);
      sel.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();close();
        menu=document.createElement('div');menu.className='esk-select-dropdown';
        const r=sel.getBoundingClientRect(); menu.style.left=Math.max(8,r.left)+'px';menu.style.top=(r.bottom+4)+'px';menu.style.minWidth=Math.max(210,r.width)+'px';
        const search=document.createElement('div');search.className='esk-select-search';search.innerHTML='<input type="search" placeholder="Rechercher une option…">';menu.appendChild(search);
        const opts=document.createElement('div');opts.className='esk-select-options';menu.appendChild(opts);
        const all=Array.from(sel.options).map((o,i)=>({o,i,text:(labels[o.textContent.trim().toLowerCase()]||o.textContent.trim()||o.value||'Option '+(i+1))}));
        const render=(term='')=>{opts.innerHTML='';all.filter(x=>x.text.toLowerCase().includes(term.toLowerCase())).forEach(x=>{const b=document.createElement('button');b.type='button';b.className='esk-select-opt';b.textContent=x.text;b.onclick=ev=>{ev.preventDefault();sel.selectedIndex=x.i;sel.dispatchEvent(new Event('change',{bubbles:true}));close();};opts.appendChild(b);});};
        render();search.querySelector('input').addEventListener('input',ev=>render(ev.target.value));document.body.appendChild(menu);search.querySelector('input').focus();
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

    // Ligne 1 : Stark Industries (ST2610131135-01) -> Étape 9
    const linkStark = Array.from(grid.querySelectorAll('a')).find(function (a) {
      return a.textContent.trim() === 'ST2610131135-01';
    });
    const rowStark = linkStark ? linkStark.closest('tr') : grid.querySelector('tr.edr-L1');
    if (rowStark) {
      rowStark.classList.add('esk-pulse-row');
      rowStark.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(9);
      });
      createFloatingBadge(linkStark || rowStark, '🎯 Cas 1 : Cliquez sur la ligne Stark Industries (Facture avec commande & écart)', function () {
        notifyParentStep(9);
      }, { pos: 'top' });
    }

    // Ligne 2 : ACME FR (BBA-261001183030) -> Étape 10 (Facture électronique PA)
    const linkPdp = Array.from(grid.querySelectorAll('a')).find(function (a) {
      return a.textContent.trim() === 'BBA-261001183030';
    });
    const rowPdp = linkPdp ? linkPdp.closest('tr') : grid.querySelector('tr.edr-L2');
    if (rowPdp) {
      rowPdp.classList.add('esk-pulse-row-amber');
      rowPdp.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(10);
      });
      createFloatingBadge(linkPdp || rowPdp, '⚡ Cas 2 : Cliquez sur ACME FR / BBA-261001183030 (Facture électronique PA)', function () {
        notifyParentStep(10);
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
      const inputs = Array.from(filterPanel.querySelectorAll('input[type="text"], input:not([type])'));
      const terms = inputs.map(function (i) { return i.value.trim().toLowerCase(); }).filter(Boolean);
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
      viewBtns.title = 'Personnaliser les colonnes affichées';
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

    const quitBtn = document.getElementById('header-quit-button') || document.querySelector('.Quit-button');
    if (quitBtn) {
      quitBtn.classList.add('esk-pulse-primary');
      quitBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(9);
      };
      createFloatingBadge(quitBtn, '🎯 Revenir à la liste des 40 factures pour choisir le cas suivant', function () {
        notifyParentStep(9);
      }, { pos: 'bottom', offsetX: -140 });
    }

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

    const quitBtn = document.getElementById('header-quit-button') || document.querySelector('.Quit-button');
    if (quitBtn) {
      quitBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        notifyParentStep(8);
      };
    }

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
      setupDashboardStep(stepId, !isInPlaceTransition);
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
