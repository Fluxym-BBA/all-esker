/* =========================================================================
   MOTEUR DE DÉMONSTRATION INTERACTIVE (STYLE GUIDEFLOW)
   Gestion des 11 étapes, animations, synthétiseur audio et interactions
   ========================================================================= */

(function () {
  'use strict';

  let currentStepIndex = 0;
  let isSoundEnabled = true;
  let audioCtx = null;
  const visitedSteps = new Set([0]);

  // Éléments du DOM
  const iframe = document.getElementById('stageIframe');
  const progressBar = document.getElementById('progressBar');
  const stepCurrentNum = document.getElementById('stepCurrentNum');
  const stepTotalNum = document.getElementById('stepTotalNum');
  const hotspot = document.getElementById('hotspotTarget');
  const guideCard = document.getElementById('guideCard');
  const guideKicker = document.getElementById('guideKicker');
  const guideTitle = document.getElementById('guideTitle');
  const guideNarrative = document.getElementById('guideNarrative');
  const guideAction = document.getElementById('guideAction');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const drawer = document.getElementById('drawerPanel');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerList = document.getElementById('drawerList');
  const toast = document.getElementById('playerToast');

  // Initialisation du synthétiseur audio (Web Audio API)
  function playChime(type) {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      if (type === 'next') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'prev') {
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(440.00, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio non supporté ou bloqué
    }
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // Rendu de l'étape courante
  function renderStep(index, playAudio = true) {
    if (index < 0 || index >= DEMO_STEPS.length) return;

    currentStepIndex = index;
    visitedSteps.add(index);
    const step = DEMO_STEPS[index];

    // Mise à jour de l'iframe si le fichier change
    if (!iframe.src.endsWith(step.file)) {
      iframe.src = step.file;
    }

    // Mise à jour des compteurs et de la barre de progression
    stepCurrentNum.textContent = String(index + 1);
    stepTotalNum.textContent = String(DEMO_STEPS.length);
    const progressPercent = ((index + 1) / DEMO_STEPS.length) * 100;
    progressBar.style.width = progressPercent + '%';

    // Remplissage du texte de l'infobulle
    guideKicker.textContent = step.kicker;
    guideTitle.textContent = step.title;
    guideNarrative.textContent = step.narrative;
    guideAction.textContent = step.action;

    // État des boutons
    btnPrev.disabled = index === 0;
    if (index === DEMO_STEPS.length - 1) {
      btnNext.innerHTML = 'Terminer ✓';
    } else {
      btnNext.innerHTML = 'Étape suivante →';
    }

    // Positionnement du Hotspot
    const hs = step.hotspot;
    hotspot.style.top = hs.top;
    hotspot.style.left = hs.left;
    hotspot.style.width = hs.width;
    hotspot.style.height = hs.height;
    hotspot.className = 'hotspot-target shape-' + (hs.shape || 'rect');

    // Positionnement intelligent de l'infobulle (Tooltip)
    positionGuideCard(step);

    // Mise à jour du tiroir
    updateDrawerItems();

    if (playAudio) {
      playChime('next');
    }
  }

  function positionGuideCard(step) {
    const pos = (step.tooltip && step.tooltip.position) || 'bottom';
    const hs = step.hotspot;
    
    // Convertir les pourcentages en coordonnées dans la zone de visualisation
    const stage = document.querySelector('.player-stage');
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;

    const hsTopPx = (parseFloat(hs.top) / 100) * stageH;
    const hsLeftPx = (parseFloat(hs.left) / 100) * stageW;
    const hsW = parseFloat(hs.width) || 120;
    const hsH = parseFloat(hs.height) || 60;

    const cardW = 380;
    const cardH = 260; // estimation

    let top = 0;
    let left = 0;

    if (pos === 'bottom' || pos === 'bottom-left' || pos === 'bottom-right') {
      top = hsTopPx + hsH + 20;
      if (pos === 'bottom-left') {
        left = hsLeftPx - cardW + hsW;
      } else if (pos === 'bottom-right') {
        left = hsLeftPx;
      } else {
        left = hsLeftPx + (hsW / 2) - (cardW / 2);
      }
    } else if (pos === 'top' || pos === 'top-left' || pos === 'top-right') {
      top = hsTopPx - cardH - 20;
      left = hsLeftPx + (hsW / 2) - (cardW / 2);
    } else if (pos === 'left') {
      top = hsTopPx - 20;
      left = hsLeftPx - cardW - 24;
    } else if (pos === 'right') {
      top = hsTopPx - 20;
      left = hsLeftPx + hsW + 24;
    }

    // Garde-fous pour ne pas dépasser les bords de l'écran
    top = Math.max(16, Math.min(top, stageH - cardH - 20));
    left = Math.max(16, Math.min(left, stageW - cardW - 20));

    guideCard.style.top = top + 'px';
    guideCard.style.left = left + 'px';
  }

  // Construction du tiroir (Sommaire des étapes)
  function buildDrawer() {
    drawerList.innerHTML = '';
    DEMO_STEPS.forEach((step, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'drawer-item' + (idx === currentStepIndex ? ' active' : '');
      item.setAttribute('data-step', idx);
      item.innerHTML = `
        <span class="drawer-item-num">${idx + 1}</span>
        <div class="drawer-item-content">
          <div class="drawer-item-kicker">${step.kicker}</div>
          <div class="drawer-item-title">${step.title}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        closeDrawer();
        renderStep(idx);
      });
      drawerList.appendChild(item);
    });
  }

  function updateDrawerItems() {
    const items = drawerList.querySelectorAll('.drawer-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentStepIndex);
      item.classList.toggle('visited', visitedSteps.has(idx) && idx !== currentStepIndex);
      const numSpan = item.querySelector('.drawer-item-num');
      if (visitedSteps.has(idx) && idx !== currentStepIndex) {
        numSpan.textContent = '✓';
      } else {
        numSpan.textContent = String(idx + 1);
      }
    });
  }

  function openDrawer() {
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
  }

  // Navigation
  function nextStep() {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      renderStep(currentStepIndex + 1);
    } else {
      showToast('Félicitations ! Vous avez terminé les 11 étapes de la visite guidée.');
    }
  }

  function prevStep() {
    if (currentStepIndex > 0) {
      playChime('prev');
      renderStep(currentStepIndex - 1, false);
    }
  }

  function restartTour() {
    renderStep(0);
    showToast('Visite réinitialisée à l’étape 1');
  }

  // Mode plein écran
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // Événements et déclencheurs
  hotspot.addEventListener('click', () => {
    // Effet d'animation de clic
    hotspot.style.transform = 'scale(0.96)';
    setTimeout(() => {
      hotspot.style.transform = '';
      nextStep();
    }, 150);
  });

  btnNext.addEventListener('click', nextStep);
  btnPrev.addEventListener('click', prevStep);

  document.getElementById('btnDrawer').addEventListener('click', openDrawer);
  document.getElementById('btnCloseDrawer').addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  document.getElementById('btnRestart').addEventListener('click', restartTour);
  document.getElementById('btnFullscreen').addEventListener('click', toggleFullScreen);

  const btnSound = document.getElementById('btnSound');
  btnSound.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    btnSound.innerHTML = isSoundEnabled
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Son : Actif'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> Son : Muet';
    showToast(isSoundEnabled ? 'Effets sonores activés' : 'Effets sonores désactivés');
  });

  // Clavier
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextStep();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevStep();
    } else if (e.key === 'Escape') {
      closeDrawer();
    } else if (e.key === 'm' || e.key === 'M') {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullScreen();
    }
  });

  // Redimensionnement de fenêtre : repositionner l'infobulle
  window.addEventListener('resize', () => {
    positionGuideCard(DEMO_STEPS[currentStepIndex]);
  });

  // Démarrage initial
  buildDrawer();
  renderStep(0, false);

})();
