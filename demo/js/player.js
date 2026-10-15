/* =========================================================================
   MOTEUR DU LECTEUR INTERACTIF ESKER (TRANSITIONS IN-PLACE & ZÉRO VOILE)
   ========================================================================= */

(function () {
  'use strict';

  let currentStepIndex = 0;
  let currentGroup = null;
  let isSoundEnabled = true;
  let audioCtx = null;
  const visitedSteps = new Set([0]);

  const iframe = document.getElementById('stageIframe');
  const stepPillsContainer = document.getElementById('headerStepPills');
  const guideDock = document.getElementById('guideDock');
  const guideExpandPill = document.getElementById('guideExpandPill');
  const guideKicker = document.getElementById('guideKicker');
  const guideTitle = document.getElementById('guideTitle');
  const guideNarrative = document.getElementById('guideNarrative');
  const guideAction = document.getElementById('guideAction');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnFocusTarget = document.getElementById('btnFocusTarget');
  const btnQuitDemo = document.getElementById('btnQuitDemo');
  const btnCollapseDock = document.getElementById('btnCollapseDock');
  const drawer = document.getElementById('drawerPanel');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerList = document.getElementById('drawerList');
  const toast = document.getElementById('playerToast');

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
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.11);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(440.00, now + 0.11);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {}
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }

  function buildHeaderPills() {
    stepPillsContainer.innerHTML = '';
    DEMO_STEPS.forEach(function (step, idx) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'step-pill' + (idx === 0 ? ' active' : '');
      btn.textContent = String(idx + 1);
      btn.title = step.kicker + ' — ' + step.title;
      btn.addEventListener('click', function () {
        renderStep(idx, true);
      });
      stepPillsContainer.appendChild(btn);
    });
  }

  function updateHeaderPills() {
    const pills = stepPillsContainer.querySelectorAll('.step-pill');
    pills.forEach(function (p, idx) {
      p.classList.toggle('active', idx === currentStepIndex);
      p.classList.toggle('visited', visitedSteps.has(idx) && idx !== currentStepIndex);
    });
  }

  function renderStep(index, playAudio) {
    if (index < 0 || index >= DEMO_STEPS.length) return;

    const prevGroup = currentGroup;
    currentStepIndex = index;
    visitedSteps.add(index);
    const step = DEMO_STEPS[index];
    currentGroup = step.pageGroup;

    // Si on reste sur le même groupe d'écran (ex. Dashboard 1-3, Rapport 4-6, Facture Acme 7-8),
    // on effectue la transition in-place sans recharger l'iframe !
    if (prevGroup && prevGroup === step.pageGroup && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'ESKER_SET_STEP', step: step.id }, '*');
    } else {
      iframe.onload = function () {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'ESKER_SET_STEP', step: step.id }, '*');
        }
      };
      iframe.src = step.file;
    }

    guideKicker.textContent = step.kicker;
    guideTitle.textContent = step.title;
    guideNarrative.textContent = step.narrative;
    guideAction.textContent = step.action;

    btnPrev.disabled = index === 0;
    const quitEnabled = [6, 7, 10, 11].includes(step.id);
    btnQuitDemo.hidden = !quitEnabled;
    btnNext.innerHTML = index === DEMO_STEPS.length - 1 ? ' Recommencer ↺' : 'Étape suivante →';

    updateHeaderPills();
    updateDrawerItems();

    if (playAudio) {
      playChime('next');
    }
  }

  function buildDrawer() {
    drawerList.innerHTML = '';
    DEMO_STEPS.forEach(function (step, idx) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'drawer-item' + (idx === currentStepIndex ? ' active' : '');
      item.innerHTML =
        '<span class="drawer-item-num">' + (idx + 1) + '</span>' +
        '<div><div class="drawer-item-kicker">' + step.kicker + '</div>' +
        '<div class="drawer-item-title">' + step.title + '</div></div>';
      item.addEventListener('click', function () {
        closeDrawer();
        renderStep(idx, true);
      });
      drawerList.appendChild(item);
    });
  }

  function updateDrawerItems() {
    const items = drawerList.querySelectorAll('.drawer-item');
    items.forEach(function (item, idx) {
      item.classList.toggle('active', idx === currentStepIndex);
      item.classList.toggle('visited', visitedSteps.has(idx) && idx !== currentStepIndex);
      const numSpan = item.querySelector('.drawer-item-num');
      numSpan.textContent = (visitedSteps.has(idx) && idx !== currentStepIndex) ? '✓' : String(idx + 1);
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

  function nextStep() {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      renderStep(currentStepIndex + 1, true);
    } else {
      renderStep(0, true);
      showToast('Retour à l’étape 1 du parcours');
    }
  }

  function prevStep() {
    if (currentStepIndex > 0) {
      playChime('prev');
      renderStep(currentStepIndex - 1, false);
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  }

  // Écoute des clics effectués directement sur les éléments Esker dans l'iframe
  window.addEventListener('message', function (e) {
    const data = e.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'ESKER_GOTO_STEP') {
      const targetIdx = DEMO_STEPS.findIndex(function (s) { return s.id === data.step; });
      if (targetIdx !== -1) {
        renderStep(targetIdx, true);
      }
    }
  });

  btnQuitDemo.addEventListener('click', function () {
    const dashboardIndex = DEMO_STEPS.findIndex(function (s) { return s.id === 8; });
    renderStep(dashboardIndex === -1 ? 0 : dashboardIndex, true);
    showToast('Retour au tableau de bord');
  });

  btnNext.addEventListener('click', nextStep);
  btnPrev.addEventListener('click', prevStep);

  btnFocusTarget.addEventListener('click', function () {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'ESKER_FOCUS_TARGET' }, '*');
    }
  });

  btnCollapseDock.addEventListener('click', function () {
    guideDock.classList.add('collapsed');
    guideExpandPill.classList.add('visible');
  });

  guideExpandPill.addEventListener('click', function () {
    guideDock.classList.remove('collapsed');
    guideExpandPill.classList.remove('visible');
  });

  document.getElementById('btnDrawer').addEventListener('click', openDrawer);
  document.getElementById('btnCloseDrawer').addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);
  document.getElementById('btnRestart').addEventListener('click', function () {
    renderStep(0, true);
    showToast('Parcours réinitialisé à l’étape 1');
  });
  document.getElementById('btnFullscreen').addEventListener('click', toggleFullScreen);

  const btnSound = document.getElementById('btnSound');
  btnSound.addEventListener('click', function () {
    isSoundEnabled = !isSoundEnabled;
    btnSound.textContent = isSoundEnabled ? '🔊 Son' : '🔇 Muet';
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextStep();
    } else if (e.key === 'ArrowLeft') {
      prevStep();
    } else if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  buildHeaderPills();
  buildDrawer();
  renderStep(0, false);

})();
