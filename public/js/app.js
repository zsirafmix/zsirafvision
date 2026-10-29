/**
 * ZsirafVision - Online TV Player
 * Version: 4.2
 * Használati Útmutató & Súgó (Help), Műsorújság (EPG), 6 nyelvű felület, Utolsó csatorna megjegyzése, Kedvencek, Elalvásidőzítő, Dual MQTT+WebRTC Mobil távirányító (QR), Fekvő PWA app
 */

(function () {
  'use strict';

  // State
  let channels = [];
  let hungarianChannels = [];
  let worldChannels = null;
  let adultChannels = null;
  let epgDatabase = {};
  let currentChannelIndex = 0;
  let isMuted = false;
  let currentVolume = 1.0;
  let hls = null;
  let osdTimeout = null;
  let adjustmentTimeout = null;
  let statsInterval = null;
  let lastDroppedFrames = 0;

  // New v3.9 State
  let favorites = [];
  let sleepTimerSec = 0;
  let sleepInterval = null;
  let isStandby = false;
  let tvPeer = null;
  let remoteConn = null;
  let roomCode = null;
  let qrCodeInstance = null;
  let mqttTvClient = null;

  // Smart TV Detection (Samsung Tizen, LG webOS, etc.)
  const isSmartTV = /SMART-TV|Tizen|Web0S|NetCast|Maple|SamsungBrowser|HbbTV|SmartTV/i.test(navigator.userAgent);
  if (isSmartTV) {
    document.body.classList.add('is-smart-tv');
    console.log('[ZsirafVision v4.1] Smart TV mód aktiválva:', navigator.userAgent);
  }

  let videoWatchdogTimer = null;

  // DOM Elements
  const video = document.getElementById('tv-video');
  const osdContainer = document.getElementById('osd-container');
  const osdName = document.getElementById('osd-name');
  const osdNumber = document.getElementById('osd-number');
  const osdCategory = document.getElementById('osd-category');
  const osdFavBtn = document.getElementById('osd-fav-btn');
  const osdAdjustment = document.getElementById('osd-adjustment');
  const adjustmentLabel = document.getElementById('adjustment-label');
  const adjustmentBar = document.getElementById('adjustment-bar');
  const adjustmentValue = document.getElementById('adjustment-value');
  const tuningIndicator = document.getElementById('tuning-indicator');
  const tuningText = document.getElementById('tuning-text');
  const playOverlay = document.getElementById('play-overlay');

  // Controls & Modals
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOpenGuide = document.getElementById('btn-open-guide');
  const btnCloseGuide = document.getElementById('btn-close-guide');
  const btnMute = document.getElementById('btn-mute');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnToggleEpg = document.getElementById('btn-toggle-epg');
  const btnCloseEpg = document.getElementById('btn-close-epg');
  const epgSidebar = document.getElementById('epg-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const epgChannelName = document.getElementById('epg-channel-name');
  const epgProgramsList = document.getElementById('epg-programs-list');
  const guideDrawer = document.getElementById('channel-guide-drawer');
  const searchInput = document.getElementById('channel-search-input');
  const sourceSelect = document.getElementById('source-select');
  const categoryPillsContainer = document.getElementById('category-pills');
  const channelListScroll = document.getElementById('channel-list-scroll');
  const langSelect = document.getElementById('lang-select');
  const drawerLangSelect = document.getElementById('drawer-lang-select');

  // Red Report Button & Modal
  const btnRedReport = document.getElementById('btn-red-report');
  const reportModal = document.getElementById('report-modal');
  const btnCloseReport = document.getElementById('btn-close-report');
  const btnCancelReport = document.getElementById('btn-cancel-report');
  const btnSubmitReport = document.getElementById('btn-submit-report');
  const reportPreview = document.getElementById('report-preview');
  const reportUserNote = document.getElementById('report-user-note');
  const reportStatusMsg = document.getElementById('report-status-msg');

  // Technical Stats Modal
  const btnToggleStats = document.getElementById('btn-toggle-stats');
  const statsModal = document.getElementById('stats-modal');
  const btnCloseStats = document.getElementById('btn-close-stats');
  const btnRefreshStats = document.getElementById('btn-refresh-stats');
  const statServerStatus = document.getElementById('stat-server-status');
  const statServerRegion = document.getElementById('stat-server-region');
  const statChName = document.getElementById('stat-ch-name');
  const statVideoRes = document.getElementById('stat-video-res');
  const statVideoBitrate = document.getElementById('stat-video-bitrate');
  const statVideoBuffer = document.getElementById('stat-video-buffer');
  const statDroppedFrames = document.getElementById('stat-dropped-frames');
  const statPing = document.getElementById('stat-ping');

  // Sleep Timer & Standby Elements
  const btnSleep = document.getElementById('btn-sleep');
  const sleepModal = document.getElementById('sleep-modal');
  const btnCloseSleep = document.getElementById('btn-close-sleep');
  const sleepStatusDisplay = document.getElementById('sleep-status-display');
  const sleepOptBtns = document.querySelectorAll('.sleep-opt-btn');
  const standbyOverlay = document.getElementById('standby-overlay');
  const btnStandbyWake = document.getElementById('btn-standby-wake');

  // Mobile Remote Elements
  const btnRemote = document.getElementById('btn-remote');
  const remoteModal = document.getElementById('remote-modal');
  const btnCloseRemote = document.getElementById('btn-close-remote');
  const qrCodeContainer = document.getElementById('qr-code-container');
  const remoteRoomCodeText = document.getElementById('remote-room-code-text');
  const remoteStatusMsg = document.getElementById('remote-status-msg');
  const remoteDirectLink = document.getElementById('remote-direct-link');

  // Help & User Manual Elements (v4.0)
  const btnHelp = document.getElementById('btn-help');
  const helpModal = document.getElementById('help-modal');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const btnCancelHelp = document.getElementById('btn-cancel-help');
  const helpLangSelect = document.getElementById('help-lang-select');
  const helpSearchInput = document.getElementById('help-search-input');
  const btnHelpClear = document.getElementById('btn-help-clear');
  const helpCategoryChips = document.getElementById('help-category-chips');
  const helpContentContainer = document.getElementById('help-content-container');
  let helpActiveCategory = 'all';
  let helpFilterText = '';

  // Multi-Language Management (i18n)
  let currentLang = 'hu';

  function t(key) {
    if (window.ZsirafI18N && window.ZsirafI18N.t) {
      return window.ZsirafI18N.t(key, currentLang);
    }
    return key;
  }

  function detectInitialLanguage() {
    try {
      const saved = localStorage.getItem('zsirafvision_lang');
      if (saved && window.ZsirafI18N && window.ZsirafI18N.DICTIONARY[saved]) return saved;
      const navLang = (navigator.language || navigator.userLanguage || 'hu').toLowerCase();
      if (navLang.startsWith('en')) return 'en';
      if (navLang.startsWith('de')) return 'de';
      if (navLang.startsWith('fr')) return 'fr';
      if (navLang.startsWith('es')) return 'es';
      if (navLang.startsWith('ru')) return 'ru';
    } catch (e) {}
    return 'hu';
  }

  function setLanguage(lang) {
    if (!window.ZsirafI18N || !window.ZsirafI18N.DICTIONARY[lang]) lang = 'hu';
    currentLang = lang;
    try {
      localStorage.setItem('zsirafvision_lang', lang);
    } catch (e) {}

    document.documentElement.lang = lang;
    if (langSelect && langSelect.value !== lang) langSelect.value = lang;
    if (drawerLangSelect && drawerLangSelect.value !== lang) drawerLangSelect.value = lang;
    if (helpLangSelect && helpLangSelect.value !== lang) helpLangSelect.value = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = window.ZsirafI18N.t(key, lang);
      if (val) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = window.ZsirafI18N.t(key, lang);
      if (val) el.title = val;
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      const val = window.ZsirafI18N.t(key, lang);
      if (val) el.placeholder = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = window.ZsirafI18N.t(key, lang);
      if (val) el.innerHTML = val;
    });

    updateEpgForCurrentChannel();
    if (channels && channels.length) {
      setupCategories();
    }
    updateSleepUI();
    if (osdFavBtn && channels[currentChannelIndex]) {
      const isFav = favorites.includes(channels[currentChannelIndex].name);
      osdFavBtn.title = isFav ? t('favRemove') : t('favAdd');
    }
    if (helpModal && helpModal.classList.contains('open')) {
      renderHelpContent();
    }
  }

  if (langSelect) {
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }
  if (drawerLangSelect) {
    drawerLangSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  // ==========================================================================
  // Favorites Management
  // ==========================================================================
  function loadFavorites() {
    try {
      const saved = localStorage.getItem('zsirafvision_favorites');
      if (saved) {
        favorites = JSON.parse(saved);
        if (!Array.isArray(favorites)) favorites = [];
      }
    } catch (e) {
      favorites = [];
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem('zsirafvision_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }

  function toggleFavorite(channelName) {
    if (!channelName) return;
    const idx = favorites.indexOf(channelName);
    if (idx !== -1) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(channelName);
    }
    saveFavorites();

    const currentCh = channels[currentChannelIndex];
    if (currentCh && currentCh.name === channelName && osdFavBtn) {
      const isFav = favorites.includes(channelName);
      osdFavBtn.classList.toggle('active', isFav);
      osdFavBtn.setAttribute('title', isFav ? t('favRemove') : t('favAdd'));
    }

    setupCategories();
    applyFilter();
    broadcastTVState();
  }

  if (osdFavBtn) {
    osdFavBtn.addEventListener('click', () => {
      const cur = channels[currentChannelIndex];
      if (cur) toggleFavorite(cur.name);
    });
  }

  // ==========================================================================
  // Sleep Timer & Standby Logic
  // ==========================================================================
  function formatSleepTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateSleepUI() {
    if (sleepTimerSec > 0) {
      const formatted = formatSleepTime(sleepTimerSec);
      if (sleepStatusDisplay) sleepStatusDisplay.textContent = `${t('sleepActive')}: ${formatted}`;
      if (btnSleep) {
        btnSleep.classList.add('active');
        btnSleep.title = `${t('navSleep')} (${formatted})`;
      }
    } else {
      if (sleepStatusDisplay) sleepStatusDisplay.textContent = t('sleepOff');
      if (btnSleep) {
        btnSleep.classList.remove('active');
        btnSleep.title = t('navSleep');
      }
    }
  }

  function setSleepTimer(minutes) {
    if (sleepInterval) {
      clearInterval(sleepInterval);
      sleepInterval = null;
    }

    if (minutes <= 0) {
      sleepTimerSec = 0;
      updateSleepUI();
      showAdjustment(t('navSleep'), t('sleepOff'), 0);
      broadcastTVState();
      return;
    }

    sleepTimerSec = minutes * 60;
    updateSleepUI();
    showAdjustment(t('navSleep'), `${minutes} ${t('minutes') || 'perc'}`, 100);
    broadcastTVState();

    sleepInterval = setInterval(() => {
      sleepTimerSec--;
      if (sleepTimerSec <= 10 && sleepTimerSec > 0) {
        // Soft volume fade-out before standby
        const fadeVol = (sleepTimerSec / 10) * currentVolume;
        video.volume = Math.max(0, fadeVol);
      }
      if (sleepTimerSec <= 0) {
        clearInterval(sleepInterval);
        sleepInterval = null;
        sleepTimerSec = 0;
        updateSleepUI();
        enterStandby();
      } else {
        updateSleepUI();
      }
    }, 1000);
  }

  function enterStandby() {
    isStandby = true;
    video.pause();
    if (standbyOverlay) standbyOverlay.classList.add('active');
    broadcastTVState();
  }

  function exitStandby() {
    isStandby = false;
    video.volume = currentVolume;
    if (standbyOverlay) standbyOverlay.classList.remove('active');
    video.play().catch(e => console.warn('Wake play error:', e));
    broadcastTVState();
  }

  function openSleepModal() {
    if (sleepModal) sleepModal.classList.add('open');
    updateSleepUI();
  }

  function closeSleepModal() {
    if (sleepModal) sleepModal.classList.remove('open');
  }

  if (btnSleep) btnSleep.addEventListener('click', openSleepModal);
  if (btnCloseSleep) btnCloseSleep.addEventListener('click', closeSleepModal);
  if (btnStandbyWake) btnStandbyWake.addEventListener('click', exitStandby);

  if (sleepOptBtns) {
    sleepOptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const min = parseInt(btn.dataset.min, 10);
        setSleepTimer(isNaN(min) ? 0 : min);
        closeSleepModal();
      });
    });
  }

  // ==========================================================================
  // Comprehensive User Manual & Help System (v4.0)
  // ==========================================================================
  function openHelpModal() {
    if (!helpModal) return;
    helpModal.classList.add('open');
    if (helpLangSelect) helpLangSelect.value = currentLang;
    renderHelpContent();
  }

  function closeHelpModal() {
    if (!helpModal) return;
    helpModal.classList.remove('open');
  }

  function formatHelpText(text) {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  function renderHelpContent() {
    if (!helpContentContainer) return;
    const guide = (window.ZsirafI18N && window.ZsirafI18N.getHelpGuide)
      ? window.ZsirafI18N.getHelpGuide(currentLang)
      : [];

    const query = helpFilterText.trim().toLowerCase();

    const filtered = guide.filter(item => {
      if (helpActiveCategory !== 'all' && item.category !== helpActiveCategory) {
        return false;
      }
      if (!query) return true;
      const titleMatch = item.title && item.title.toLowerCase().includes(query);
      const summaryMatch = item.summary && item.summary.toLowerCase().includes(query);
      const detailsMatch = item.details && item.details.some(d => d.toLowerCase().includes(query));
      return titleMatch || summaryMatch || detailsMatch;
    });

    if (filtered.length === 0) {
      helpContentContainer.innerHTML = `
        <div class="help-empty-result">
          <p>⚠️ ${currentLang === 'hu' ? 'Nincs a keresésnek megfelelő találat az útmutatóban.' : (currentLang === 'de' ? 'Keine passenden Einträge in der Anleitung gefunden.' : (currentLang === 'fr' ? 'Aucun résultat trouvé dans le guide.' : (currentLang === 'es' ? 'No se encontraron resultados en la guía.' : (currentLang === 'ru' ? 'В руководстве ничего не найдено.' : 'No matching results found in the user guide.'))))}</p>
        </div>
      `;
      return;
    }

    const cardsHtml = filtered.map(item => {
      const detailsHtml = (item.details || []).map(step => {
        return `<li>${formatHelpText(step)}</li>`;
      }).join('');

      return `
        <article class="help-card" data-category="${item.category}">
          <div class="help-card-header">
            <span class="help-card-icon">${item.icon}</span>
            <h4 class="help-card-title">${item.title}</h4>
          </div>
          <div class="help-card-summary">${item.summary}</div>
          <ul class="help-card-details">
            ${detailsHtml}
          </ul>
        </article>
      `;
    }).join('');

    helpContentContainer.innerHTML = cardsHtml;
  }

  if (btnHelp) btnHelp.addEventListener('click', openHelpModal);
  if (btnCloseHelp) btnCloseHelp.addEventListener('click', closeHelpModal);
  if (btnCancelHelp) btnCancelHelp.addEventListener('click', closeHelpModal);
  if (helpModal) {
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) closeHelpModal();
    });
  }
  if (helpLangSelect) {
    helpLangSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }
  if (helpSearchInput) {
    helpSearchInput.addEventListener('input', (e) => {
      helpFilterText = e.target.value;
      if (btnHelpClear) {
        btnHelpClear.classList.toggle('visible', !!helpFilterText);
      }
      renderHelpContent();
    });
  }
  if (btnHelpClear) {
    btnHelpClear.addEventListener('click', () => {
      if (helpSearchInput) {
        helpSearchInput.value = '';
        helpFilterText = '';
        btnHelpClear.classList.remove('visible');
        renderHelpContent();
        helpSearchInput.focus();
      }
    });
  }
  if (helpCategoryChips) {
    helpCategoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.help-chip');
      if (!chip) return;
      helpCategoryChips.querySelectorAll('.help-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      helpActiveCategory = chip.getAttribute('data-cat') || 'all';
      renderHelpContent();
    });
  }

  // ==========================================================================
  // Mobile Remote Control (PeerJS WebRTC)
  // ==========================================================================
  function generateRoomCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  // MQTT Cloud Relay for instant remote pairing (100% works across CGNAT/Firewalls)
  function initMqttServer() {
    if (typeof Paho === 'undefined' || !Paho.MQTT) {
      console.warn('Paho MQTT not loaded');
      return;
    }
    if (mqttTvClient) {
      try { mqttTvClient.disconnect(); } catch (e) {}
      mqttTvClient = null;
    }

    const brokerHosts = ['broker.hivemq.com', 'broker.emqx.io'];
    let hostIdx = 0;

    function tryConnect() {
      if (!roomCode) return;
      const host = brokerHosts[hostIdx];
      const clientId = 'zsiraftv_' + roomCode + '_' + Math.random().toString(16).substr(2, 6);
      try {
        mqttTvClient = new Paho.MQTT.Client(host, 8884, '/mqtt', clientId);

        mqttTvClient.onMessageArrived = (m) => {
          try {
            const data = JSON.parse(m.payloadString);
            handleRemoteCommand(data);
            if (remoteStatusMsg) {
              remoteStatusMsg.textContent = '🟢 ' + t('remoteConnected');
              remoteStatusMsg.classList.add('connected');
            }
          } catch (e) {
            console.warn('MQTT parse error:', e);
          }
        };

        mqttTvClient.onConnectionLost = (res) => {
          console.warn('MQTT TV connection lost:', res.errorMessage);
          hostIdx = (hostIdx + 1) % brokerHosts.length;
          setTimeout(tryConnect, 2000);
        };

        mqttTvClient.connect({
          useSSL: true,
          timeout: 5,
          keepAliveInterval: 30,
          onSuccess: () => {
            console.log('[ZsirafVision v4.1] MQTT TV Bridge online on', host);
            mqttTvClient.subscribe('zsirafvision/' + roomCode + '/cmd');
            if (remoteStatusMsg && !remoteConn) {
              remoteStatusMsg.textContent = t('remoteWaiting');
            }
          },
          onFailure: (err) => {
            console.warn('MQTT TV connect fail on', host, err);
            hostIdx = (hostIdx + 1) % brokerHosts.length;
            setTimeout(tryConnect, 3000);
          }
        });
      } catch (err) {
        console.error('MQTT setup error:', err);
      }
    }

    tryConnect();
  }

  function initRemoteServer() {
    if (!roomCode) {
      roomCode = generateRoomCode();
    }
    if (remoteRoomCodeText) {
      remoteRoomCodeText.textContent = roomCode;
    }

    // Start MQTT Cloud Bridge (Reliable 100% firewall traversal)
    initMqttServer();

    if (typeof Peer === 'undefined') {
      console.warn('PeerJS library not loaded.');
      if (remoteStatusMsg) remoteStatusMsg.textContent = 'PeerJS nem elérhető';
      return;
    }

    const peerId = 'zsiraf-tv-' + roomCode.toUpperCase();

    try {
      if (tvPeer) {
        try { tvPeer.destroy(); } catch (e) {}
        tvPeer = null;
      }

      tvPeer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      tvPeer.on('open', (id) => {
        console.log('[ZsirafVision v4.1] PeerJS TV server online. Peer ID:', id);
        if (remoteRoomCodeText) remoteRoomCodeText.textContent = roomCode;
        if (remoteStatusMsg && !remoteConn) {
          remoteStatusMsg.textContent = t('remoteWaiting');
        }
        updateRemoteModalQr();
      });

      tvPeer.on('connection', (conn) => {
        remoteConn = conn;
        console.log('[ZsirafVision v4.1] Remote connected from mobile via WebRTC!');
        if (remoteStatusMsg) {
          remoteStatusMsg.textContent = '🟢 ' + t('remoteConnected');
          remoteStatusMsg.classList.add('connected');
        }

        conn.on('open', () => {
          broadcastTVState();
        });

        conn.on('data', (data) => {
          handleRemoteCommand(data);
        });

        conn.on('close', () => {
          console.log('[ZsirafVision v4.1] Remote disconnected');
          remoteConn = null;
          if (remoteStatusMsg) {
            remoteStatusMsg.textContent = t('remoteWaiting');
            remoteStatusMsg.classList.remove('connected');
          }
        });
      });

      tvPeer.on('error', (err) => {
        console.warn('[ZsirafVision v4.1] PeerJS error:', err);
        if (err.type === 'unavailable-id') {
          roomCode = generateRoomCode();
          if (remoteRoomCodeText) remoteRoomCodeText.textContent = roomCode;
          setTimeout(initRemoteServer, 600);
        } else if (remoteStatusMsg && !remoteConn) {
          remoteStatusMsg.textContent = 'Kapcsolódási hiba, újracsatlakozás...';
        }
      });
    } catch (err) {
      console.error('Failed to initialize PeerJS:', err);
    }
  }

  function handleRemoteCommand(data) {
    if (!data) return;
    const cmd = data.cmd || data.action;
    if (!cmd) return;

    switch (cmd) {
      case 'power':
        if (isStandby) {
          exitStandby();
        } else {
          enterStandby();
        }
        break;
      case 'wake':
        if (isStandby) exitStandby();
        break;
      case 'chUp':
        playChannel(currentChannelIndex + 1);
        break;
      case 'chDown':
        playChannel(currentChannelIndex - 1);
        break;
      case 'volUp':
        setVolume(currentVolume + 0.05);
        break;
      case 'volDown':
        setVolume(currentVolume - 0.05);
        break;
      case 'mute':
        btnMute.click();
        broadcastTVState();
        break;
      case 'ok':
        if (isStandby) {
          exitStandby();
        } else if (isMuted) {
          btnMute.click();
        }
        break;
      case 'toggleFav':
        const cur = channels[currentChannelIndex];
        if (cur) toggleFavorite(cur.name);
        break;
      case 'toggleGuide':
        if (guideDrawer.classList.contains('open')) {
          closeSidebars();
        } else {
          btnOpenGuide.click();
        }
        break;
      case 'toggleEpg':
        if (epgSidebar.classList.contains('open')) {
          closeSidebars();
        } else {
          btnToggleEpg.click();
        }
        break;
      case 'toggleFullscreen':
        btnFullscreen.click();
        break;
      case 'sleep':
        const currentMin = Math.round(sleepTimerSec / 60);
        let nextMin = 15;
        if (currentMin >= 90) nextMin = 0;
        else if (currentMin >= 60) nextMin = 90;
        else if (currentMin >= 30) nextMin = 60;
        else if (currentMin >= 15) nextMin = 30;
        setSleepTimer(nextMin);
        break;
      case 'digit':
        if (typeof data.digit !== 'undefined') {
          const num = parseInt(data.digit, 10);
          if (num > 0 && num <= channels.length) {
            playChannel(num - 1);
          }
        }
        break;
      case 'requestState':
      case 'getState':
        broadcastTVState();
        break;
    }
  }

  function broadcastTVState() {
    if (!roomCode) return;
    const currentCh = channels[currentChannelIndex] || {};
    const stateObj = {
      type: 'state',
      channelName: currentCh.name || 'ZsirafVision',
      channelNumber: currentCh.channel_number || (currentCh.id ? String(currentCh.id).padStart(2, '0') : '00'),
      group: currentCh.group || '',
      isFav: favorites.includes(currentCh.name),
      volume: Math.round(currentVolume * 100),
      isMuted: isMuted,
      isStandby: isStandby,
      sleepTimerSec: sleepTimerSec
    };

    // 1. MQTT Cloud Relay (Fast, 100% reliable)
    if (mqttTvClient && mqttTvClient.isConnected && mqttTvClient.isConnected()) {
      try {
        const msg = new Paho.MQTT.Message(JSON.stringify(stateObj));
        msg.destinationName = 'zsirafvision/' + roomCode + '/state';
        mqttTvClient.send(msg);
      } catch (e) {}
    }

    // 2. PeerJS Direct WebRTC P2P (if connected)
    if (remoteConn && remoteConn.open) {
      try {
        remoteConn.send(stateObj);
      } catch (e) {}
    }
  }

  function updateRemoteModalQr() {
    if (!roomCode) {
      roomCode = generateRoomCode();
    }
    if (remoteRoomCodeText) {
      remoteRoomCodeText.textContent = roomCode;
    }
    const baseUrl = window.location.href.split('#')[0].split('?')[0].replace('index.html', '');
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const remoteUrl = `${cleanBase}remote.html?room=${roomCode}`;

    if (remoteDirectLink) {
      remoteDirectLink.href = remoteUrl;
    }

    if (qrCodeContainer && typeof QRCode !== 'undefined') {
      qrCodeContainer.innerHTML = '';
      qrCodeInstance = new QRCode(qrCodeContainer, {
        text: remoteUrl,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  function openRemoteModal() {
    if (!roomCode) {
      roomCode = generateRoomCode();
    }
    if (remoteRoomCodeText) {
      remoteRoomCodeText.textContent = roomCode;
    }
    if (!tvPeer || tvPeer.destroyed) {
      initRemoteServer();
    }
    updateRemoteModalQr();
    if (remoteModal) remoteModal.classList.add('open');
  }

  function closeRemoteModal() {
    if (remoteModal) remoteModal.classList.remove('open');
  }

  if (btnRemote) btnRemote.addEventListener('click', openRemoteModal);
  if (btnCloseRemote) btnCloseRemote.addEventListener('click', closeRemoteModal);

  function showLoading(msg) {
    tuningText.textContent = msg || t('tuning');
    tuningIndicator.classList.add('active');
  }

  function hideLoading() {
    tuningIndicator.classList.remove('active');
  }

  function showAdjustment(label, valueText, percentage) {
    adjustmentLabel.textContent = label;
    adjustmentValue.textContent = valueText;
    adjustmentBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    osdAdjustment.classList.add('active');
    clearTimeout(adjustmentTimeout);
    adjustmentTimeout = setTimeout(() => {
      osdAdjustment.classList.remove('active');
    }, 1800);
  }

  // ==========================================================================
  // EPG / Műsorújság Logic
  // ==========================================================================
  async function loadEpgDatabase() {
    try {
      const res = await fetch(`epg.json?t=${Date.now()}`);
      if (res.ok) {
        epgDatabase = await res.json();
        updateEpgForCurrentChannel();
      }
    } catch (e) {
      console.warn('EPG fetch failed:', e);
    }
  }

  function updateEpgForCurrentChannel() {
    if (!channels.length) return;
    const channel = channels[currentChannelIndex];
    if (!channel) return;

    epgChannelName.textContent = channel.name;
    epgProgramsList.innerHTML = '';

    // Search programs for channel
    let programs = epgDatabase[channel.name];
    if (!programs) {
      // Try loose match
      for (const [k, v] of Object.entries(epgDatabase)) {
        if (k.toLowerCase().includes(channel.name.toLowerCase()) || channel.name.toLowerCase().includes(k.toLowerCase())) {
          programs = v;
          break;
        }
      }
    }

    // If no static XMLTV data, dynamically generate a realistic, rich schedule!
    if ((!programs || !programs.length) && window.ZsirafI18N && window.ZsirafI18N.generateSchedule) {
      programs = window.ZsirafI18N.generateSchedule(channel, currentLang);
    }

    if (programs && programs.length) {
      // Find currently playing program based on local time
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();

      let activeIndex = -1;

      // 1. First pass: exact interval match
      for (let i = 0; i < programs.length; i++) {
        const p = programs[i];
        if (!p.start || !p.stop) continue;
        const [sh, sm] = p.start.split(':').map(Number);
        const [eh, em] = p.stop.split(':').map(Number);
        if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) continue;

        const startMin = sh * 60 + sm;
        const stopMin = eh * 60 + em;

        if (stopMin > startMin) {
          // Daytime / normal slot within same day
          if (currentMin >= startMin && currentMin < stopMin) {
            activeIndex = i;
            break;
          }
        } else {
          // Midnight rollover (e.g. 23:30 - 01:00)
          if (currentMin >= startMin || currentMin < stopMin) {
            activeIndex = i;
            break;
          }
        }
      }

      // 2. Second pass fallback if gaps in schedule or past the last show
      if (activeIndex === -1) {
        for (let i = 0; i < programs.length; i++) {
          const p = programs[i];
          if (!p.stop) continue;
          const [eh, em] = p.stop.split(':').map(Number);
          if (isNaN(eh) || isNaN(em)) continue;
          const stopMin = eh * 60 + em;
          if (stopMin > currentMin) {
            activeIndex = i;
            break;
          }
        }
      }

      // 3. Ultimate fallback: default to first program
      if (activeIndex === -1) {
        activeIndex = 0;
      }

      let activeElement = null;

      programs.forEach((p, idx) => {
        const isActive = (idx === activeIndex);
        const item = document.createElement('div');
        item.className = `epg-prog-item ${isActive ? 'active currently-playing' : ''}`;

        const timeRow = document.createElement('div');
        timeRow.className = 'epg-time-row';
        timeRow.innerHTML = `<span>${p.start} - ${p.stop}</span> ${isActive ? `<span class="epg-live-indicator">🔴 ${t('epgLive')}</span>` : ''}`;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'epg-prog-title';
        titleDiv.textContent = p.title;

        item.appendChild(timeRow);
        item.appendChild(titleDiv);

        if (p.desc) {
          const descDiv = document.createElement('div');
          descDiv.className = 'epg-prog-desc';
          descDiv.textContent = p.desc;
          item.appendChild(descDiv);
        }

        epgProgramsList.appendChild(item);
        if (isActive) {
          activeElement = item;
        }
      });

      // Smooth scroll to currently playing program so user immediately sees it
      if (activeElement) {
        setTimeout(() => {
          activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 100);
      }
    } else {
      epgProgramsList.innerHTML = `
        <div class="epg-empty">
          <p>${t('epgNoInfo')}</p>
          <p style="margin-top: 8px; font-size: 0.75rem; color: #555;">${t('epgContinuous')}</p>
        </div>
      `;
    }
  }

  // ==========================================================================
  // Channel Playback & State Persistence
  // ==========================================================================
  function playChannel(index) {
    if (!channels.length) return;
    if (index < 0) index = channels.length - 1;
    if (index >= channels.length) index = 0;
    currentChannelIndex = index;

    const channel = channels[currentChannelIndex];

    // Save last watched channel and current source/country in localStorage
    try {
      if (channel) {
        let src = 'HU';
        if (channels === adultChannels) {
          src = 'XXX';
        } else if (sourceSelect.value === 'WORLD') {
          src = 'WORLD';
        }
        localStorage.setItem('zsirafvision_last_channel_name', channel.name);
        if (channel.url) localStorage.setItem('zsirafvision_last_channel_url', channel.url);
        localStorage.setItem('zsirafvision_last_source', src);
      }
    } catch (e) {
      console.warn('Could not save channel to localStorage:', e);
    }

    // Update OSD
    osdName.textContent = channel.name;
    osdNumber.textContent = channel.channel_number || (channel.id ? String(channel.id).padStart(2, '0') : '00');
    osdCategory.textContent = channel.group || 'Online TV';
    if (osdFavBtn) {
      const isFav = favorites.includes(channel.name);
      osdFavBtn.classList.toggle('active', isFav);
      osdFavBtn.title = isFav ? t('favRemove') : t('favAdd');
    }
    osdContainer.classList.remove('fade-out');
    clearTimeout(osdTimeout);
    osdTimeout = setTimeout(() => {
      osdContainer.classList.add('fade-out');
    }, 4500);

    highlightActiveDrawerItem();
    updateEpgForCurrentChannel();
    showLoading(`${channel.name} ${t('tuning')}`);
    broadcastTVState();

    const streamUrl = channel.url;

    if (hls) {
      hls.destroy();
      hls = null;
    }
    if (videoWatchdogTimer) {
      clearTimeout(videoWatchdogTimer);
      videoWatchdogTimer = null;
    }

    // Clean up any direct video element event handlers from MP4
    video.onloadeddata = null;
    video.oncanplay = null;
    video.onerror = null;

    const isMp4 = streamUrl.toLowerCase().includes('.mp4');

    if (isMp4) {
      video.removeAttribute('src');
      video.load();

      video.src = streamUrl;
      video.muted = isMuted;

      let started = false;
      const onReady = () => {
        if (started) return;
        started = true;
        hideLoading();
        video.play().then(() => {
          if (playOverlay) playOverlay.classList.remove('active');
        }).catch((err) => {
          console.warn('Autoplay requires user interaction:', err);
          if (playOverlay) playOverlay.classList.add('active');
        });
      };

      video.onloadeddata = onReady;
      video.oncanplay = onReady;
      video.onerror = (e) => {
        console.error('MP4 playback error:', e);
        tuningText.textContent = t('streamUnavailable');
        setTimeout(hideLoading, 3000);
      };
      video.load();
      return;
    }

    // HLS stream (.m3u8)
    if (video.src) {
      video.removeAttribute('src');
      video.load();
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        // Samsung Smart TV-n (Tizen) a Web Worker demuxer nem továbbítja megbízhatóan a videó frame-eket (fekete kép, csak hang).
        // enableWorker: false esetén a főszálon azonnal, zökkenőmentesen renderelődik a kép.
        enableWorker: false,
        lowLatencyMode: false,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 20000,
        fragLoadingTimeOut: 25000,
        fragLoadingMaxRetry: 4,
        backBufferLength: isSmartTV ? 15 : 30,
        maxBufferLength: isSmartTV ? 10 : 20,
        maxMaxBufferLength: isSmartTV ? 20 : 30,
        maxBufferSize: isSmartTV ? 25 * 1000 * 1000 : 50 * 1000 * 1000,
        defaultAudioCodec: 'mp4a.40.2'
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hideLoading();
        // Modern browsers require muted autoplay for un-interacted pages
        video.muted = isMuted;
        
        video.play().then(() => {
          if (playOverlay) playOverlay.classList.remove('active');
        }).catch((err) => {
          console.warn('Autoplay requires user interaction:', err);
          if (playOverlay) playOverlay.classList.add('active');
        });

        // Smart TV Video Watchdog:
        // Ha 4 másodperc elteltével szól a hang (currentTime > 0.5s), de a videoWidth még mindig 0 (nincs kép),
        // automatikusan megpróbáljuk a natív Tizen lejátszóra váltást (video.src = streamUrl)
        videoWatchdogTimer = setTimeout(() => {
          if (!video.paused && video.currentTime > 0.5 && (video.videoWidth === 0 || video.videoHeight === 0)) {
            console.warn('[Smart TV Watchdog] Hang van, de kép nincs (videoWidth: 0). Átváltás natív Tizen HLS-re...');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
              if (hls) {
                hls.destroy();
                hls = null;
              }
              video.removeAttribute('src');
              video.load();
              video.src = streamUrl;
              video.play().catch(e => console.error('Native TV fallback error:', e));
            }
          }
        }, 4000);
      });

      const onVideoHasFrames = () => {
        if (video.videoWidth > 0 && videoWatchdogTimer) {
          clearTimeout(videoWatchdogTimer);
          videoWatchdogTimer = null;
        }
      };
      video.addEventListener('loadedmetadata', onVideoHasFrames, { once: true });
      video.addEventListener('timeupdate', onVideoHasFrames);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              tuningText.textContent = 'HÁLÓZATI HIBA';
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              tuningText.textContent = 'HELYREÁLLÍTÁS...';
              hls.recoverMediaError();
              break;
            default:
              if (video.canPlayType('application/vnd.apple.mpegurl')) {
                console.warn('Hls.js végzetes hiba, váltás natív HLS-re...');
                hls.destroy();
                hls = null;
                video.src = streamUrl;
                video.load();
                video.play().catch(() => {});
              } else {
                tuningText.textContent = t('streamUnavailable');
                setTimeout(hideLoading, 3000);
                hls.destroy();
                hls = null;
              }
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari iOS/macOS vagy Smart TV natív mód
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        hideLoading();
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        tuningText.textContent = 'JELVESZTÉS';
        setTimeout(hideLoading, 3000);
      });
    }
  }

  // Volume
  function setVolume(val) {
    currentVolume = Math.max(0, Math.min(1, val));
    video.volume = currentVolume;
    video.muted = false;
    isMuted = false;
    btnMute.textContent = currentVolume === 0 ? '🔇' : '🔊';
    showAdjustment(t('volume') || 'HANGERŐ', `${Math.round(currentVolume * 100)}%`, currentVolume * 100);
    broadcastTVState();
  }

  // ==========================================================================
  // Drawer & Filter Logic
  // ==========================================================================
  function renderDrawer(channelsToRender) {
    channelListScroll.innerHTML = '';
    if (!channelsToRender.length) {
      const activePill = categoryPillsContainer.querySelector('.cat-pill.active');
      const isFavTab = activePill && activePill.dataset.category === 'FAV';
      channelListScroll.innerHTML = isFavTab
        ? `<div style="padding: 28px 16px; text-align: center; color: #888; font-size: 0.85rem; line-height: 1.5;">${t('favEmpty')}</div>`
        : `<div style="padding: 20px; text-align: center; color: #777;">${t('noResults') || 'Nincs találat.'}</div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    channelsToRender.forEach((ch) => {
      const globalIdx = channels.findIndex((c) => c.id === ch.id || c.name === ch.name);
      const actualIdx = globalIdx !== -1 ? globalIdx : 0;

      const item = document.createElement('div');
      item.className = `channel-item ${actualIdx === currentChannelIndex ? 'active' : ''} ${ch.is_adult ? 'adult-channel' : ''}`;
      item.dataset.index = actualIdx;

      const numSpan = document.createElement('span');
      numSpan.className = 'channel-item-num';
      numSpan.textContent = ch.channel_number || (ch.id ? String(ch.id).padStart(2, '0') : '00');

      const logoImg = document.createElement('img');
      logoImg.className = 'channel-item-logo';
      logoImg.referrerPolicy = 'no-referrer';
      const fallbackSvg = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23222"/><text y="55" x="50" font-size="30" text-anchor="middle" fill="%23666">TV</text></svg>';
      logoImg.src = ch.logo || fallbackSvg;
      logoImg.loading = 'lazy';
      logoImg.onerror = () => {
        logoImg.onerror = null;
        logoImg.src = fallbackSvg;
      };

      const infoDiv = document.createElement('div');
      infoDiv.className = 'channel-item-info';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'channel-item-name';
      nameDiv.textContent = ch.name;

      const catDiv = document.createElement('div');
      catDiv.className = 'channel-item-category';
      catDiv.textContent = ch.group;

      infoDiv.appendChild(nameDiv);
      infoDiv.appendChild(catDiv);

      const favBtn = document.createElement('button');
      const isFav = favorites.includes(ch.name);
      favBtn.className = `ch-item-fav-btn ${isFav ? 'active' : ''}`;
      favBtn.setAttribute('title', isFav ? t('favRemove') : t('favAdd'));
      favBtn.textContent = '⭐';
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(ch.name);
      });

      item.appendChild(numSpan);
      item.appendChild(logoImg);
      item.appendChild(infoDiv);
      item.appendChild(favBtn);

      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        if (!isNaN(idx) && idx >= 0 && idx < channels.length) {
          playChannel(idx);
        }
        closeSidebars();
      });

      fragment.appendChild(item);
    });

    channelListScroll.appendChild(fragment);
  }

  function highlightActiveDrawerItem() {
    const items = channelListScroll.querySelectorAll('.channel-item');
    items.forEach((it) => {
      if (parseInt(it.dataset.index, 10) === currentChannelIndex) {
        it.classList.add('active');
        it.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        it.classList.remove('active');
      }
    });
  }

  function setupCategories() {
    const groups = new Set();
    channels.forEach((c) => {
      if (c.group) groups.add(c.group);
    });

    const activePill = categoryPillsContainer.querySelector('.cat-pill.active');
    const prevCat = activePill ? activePill.dataset.category : 'ALL';

    categoryPillsContainer.innerHTML = '';

    const allPill = document.createElement('button');
    allPill.className = `cat-pill ${prevCat === 'ALL' ? 'active' : ''}`;
    allPill.dataset.category = 'ALL';
    allPill.textContent = `${t('catAll') || 'Mind'} (${channels.length})`;
    categoryPillsContainer.appendChild(allPill);

    const favPill = document.createElement('button');
    favPill.className = `cat-pill fav-cat-pill ${prevCat === 'FAV' ? 'active' : ''}`;
    favPill.dataset.category = 'FAV';
    favPill.textContent = `⭐ ${t('navFavorites')} (${favorites.length})`;
    categoryPillsContainer.appendChild(favPill);

    Array.from(groups).sort().forEach((grp) => {
      const count = channels.filter((c) => c.group === grp).length;
      const pill = document.createElement('button');
      pill.className = `cat-pill ${prevCat === grp ? 'active' : ''}`;
      pill.dataset.category = grp;
      pill.textContent = `${grp} (${count})`;
      categoryPillsContainer.appendChild(pill);
    });

    if (!categoryPillsContainer.querySelector('.cat-pill.active')) {
      allPill.classList.add('active');
    }
  }

  categoryPillsContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.cat-pill');
    if (pill) {
      categoryPillsContainer.querySelectorAll('.cat-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilter();
    }
  });

  async function applyFilter() {
    const activePill = categoryPillsContainer.querySelector('.cat-pill.active');
    const selectedCategory = activePill ? activePill.dataset.category : 'ALL';
    const query = searchInput.value.toLowerCase().trim();

    // Check for secret XXX query
    if (query === 'xxx' || query === ':xxx') {
      if (!adultChannels) {
        try {
          const res = await fetch(`adult.json?t=${Date.now()}`);
          adultChannels = await res.json();
        } catch (e) {
          console.error('Failed to load adult channels:', e);
        }
      }
      if (adultChannels) {
        if (channels !== adultChannels) {
          channels = adultChannels;
          setupCategories();
        }
        let filtered = adultChannels;
        if (selectedCategory === 'FAV') {
          filtered = filtered.filter((c) => favorites.includes(c.name));
        } else if (selectedCategory !== 'ALL') {
          filtered = filtered.filter((c) => c.group === selectedCategory);
        }
        renderDrawer(filtered);
        return;
      }
    } else {
      // If user typed something else, restore base channels (Hungarian or World)
      if (channels === adultChannels) {
        channels = (sourceSelect.value === 'WORLD' && worldChannels) ? worldChannels : hungarianChannels;
        setupCategories();
      }
    }

    let filtered = channels;
    if (selectedCategory === 'FAV') {
      filtered = filtered.filter((c) => favorites.includes(c.name));
    } else if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((c) => c.group === selectedCategory);
    }
    if (query) {
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(query) || (c.channel_number && c.channel_number.includes(query))
      );
    }
    renderDrawer(filtered);
  }

  // ==========================================================================
  // Source / Country Selector (Hungarian default vs iptv-org World)
  // ==========================================================================
  sourceSelect.addEventListener('change', async () => {
    const selected = sourceSelect.value;
    try {
      localStorage.setItem('zsirafvision_last_source', selected);
    } catch (e) {}

    if (selected === 'HU') {
      channels = hungarianChannels;
      setupCategories();
      applyFilter();
      playChannel(0);
    } else if (selected === 'WORLD') {
      showLoading(t('loadingWorld'));
      if (!worldChannels) {
        try {
          const res = await fetch('https://iptv-org.github.io/iptv/index.country.m3u');
          const text = await res.text();
          const parsed = parseM3uWorld(text);
          worldChannels = parsed;
        } catch (e) {
          console.error('Failed to fetch world channels:', e);
          tuningText.textContent = t('errorLoadingWorld');
          setTimeout(hideLoading, 3000);
          return;
        }
      }
      channels = worldChannels;
      hideLoading();
      setupCategories();
      applyFilter();
      playChannel(0);
    }
  });

  function parseM3uWorld(m3uText) {
    const lines = m3uText.split('\n');
    const list = [];
    let idCounter = 1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF')) {
        const lastComma = line.rfind ? line.rfind(',') : line.lastIndexOf(',');
        const name = lastComma !== -1 ? line.substring(lastComma + 1).trim() : 'Világ Csatorna';
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const group = groupMatch ? groupMatch[1] : 'Nemzetközi';
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const logo = logoMatch ? logoMatch[1] : '';

        // Next line url
        let j = i + 1;
        while (j < lines.length && lines[j].trim().startsWith('#')) j++;
        if (j < lines.length && lines[j].trim().startsWith('http')) {
          const rawUrl = lines[j].trim();
          // Route through Vercel Proxy
          const proxyUrl = `https://zsirafvision-vercel.vercel.app/api/proxy?url=${encodeURIComponent(rawUrl)}`;
          list.push({
            id: `w_${idCounter}`,
            channel_number: String(idCounter).padStart(3, '0'),
            name,
            url: proxyUrl,
            logo,
            group
          });
          idCounter++;
          i = j;
        }
      }
    }
    return list;
  }

  // ==========================================================================
  // Red Report Button & Diagnostics Gathering
  // ==========================================================================
  function gatherDiagnostics() {
    const ch = channels[currentChannelIndex] || {};
    let resolution = 'Ismeretlen';
    if (video.videoWidth && video.videoHeight) {
      resolution = `${video.videoWidth}x${video.videoHeight}`;
    }

    let bufferSec = 0;
    if (video.buffered && video.buffered.length > 0) {
      bufferSec = Math.round(video.buffered.end(video.buffered.length - 1) - video.currentTime);
    }

    let dropped = 0;
    if (video.getVideoPlaybackQuality) {
      dropped = video.getVideoPlaybackQuality().droppedVideoFrames || 0;
    }

    return {
      channelName: ch.name || 'Ismeretlen',
      channelNumber: ch.channel_number || '00',
      category: ch.group || '',
      streamUrl: ch.url || '',
      resolution,
      readyState: video.readyState,
      networkState: video.networkState,
      currentTime: Math.round(video.currentTime),
      bufferedSeconds: bufferSec,
      droppedFrames: dropped,
      isPaused: video.paused,
      isMuted: video.muted,
      volume: Math.round(video.volume * 100),
      isSmartTV: isSmartTV,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      hlsStats: hls ? {
        levels: hls.levels ? hls.levels.length : 0,
        currentLevel: hls.currentLevel,
        liveSyncPosition: hls.liveSyncPosition
      } : null
    };
  }

  btnRedReport.addEventListener('click', () => {
    const diag = gatherDiagnostics();
    reportPreview.textContent = JSON.stringify(diag, null, 2);
    reportUserNote.value = '';
    reportStatusMsg.textContent = '';
    reportModal.classList.add('open');
  });

  function closeReportModal() {
    reportModal.classList.remove('open');
  }

  btnCloseReport.addEventListener('click', closeReportModal);
  btnCancelReport.addEventListener('click', closeReportModal);

  btnSubmitReport.addEventListener('click', async () => {
    btnSubmitReport.disabled = true;
    reportStatusMsg.style.color = '#ffeedd';
    reportStatusMsg.textContent = 'Adatok küldése folyamatban...';

    const diag = gatherDiagnostics();
    diag.userNote = reportUserNote.value.trim();

    try {
      const res = await fetch('https://zsirafvision-vercel.vercel.app/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diag)
      });
      const data = await res.json();
      if (data.success) {
        reportStatusMsg.style.color = 'var(--crt-phosphor)';
        reportStatusMsg.textContent = `✓ Sikeres feltöltés! Azononosító: ${data.id}. Köszönjük a visszajelzést!`;
        setTimeout(() => {
          closeReportModal();
          btnSubmitReport.disabled = false;
        }, 2200);
      } else {
        throw new Error(data.error || 'Hiba a feltöltés során');
      }
    } catch (err) {
      reportStatusMsg.style.color = '#ff6b77';
      reportStatusMsg.textContent = `Sikertelen küldés: ${err.message}`;
      btnSubmitReport.disabled = false;
    }
  });

  // ==========================================================================
  // Technical Stats Modal
  // ==========================================================================
  async function refreshStats() {
    const startTime = performance.now();
    try {
      const res = await fetch('https://zsirafvision-vercel.vercel.app/api/stats');
      const pingMs = Math.round(performance.now() - startTime);
      if (res.ok) {
        const data = await res.json();
        statServerStatus.textContent = data.status || 'ONLINE';
        statServerRegion.textContent = data.region || 'iad1';
        statPing.textContent = `${pingMs} ms`;
      }
    } catch (e) {
      statServerStatus.textContent = 'OFFLINE / Hiba';
      statServerStatus.className = 'stat-value text-red';
    }

    const ch = channels[currentChannelIndex];
    statChName.textContent = ch ? ch.name : '-';
    statVideoRes.textContent = video.videoWidth ? `${video.videoWidth}x${video.videoHeight} HD` : 'Betöltés...';

    if (hls && hls.levels && hls.currentLevel >= 0 && hls.levels[hls.currentLevel]) {
      const lvl = hls.levels[hls.currentLevel];
      statVideoBitrate.textContent = `${Math.round(lvl.bitrate / 1000)} kbps`;
    } else {
      statVideoBitrate.textContent = 'Automatikus (VBR)';
    }

    if (video.buffered && video.buffered.length > 0) {
      const buf = Math.round(video.buffered.end(video.buffered.length - 1) - video.currentTime);
      statVideoBuffer.textContent = `${buf} mp`;
    } else {
      statVideoBuffer.textContent = '0 mp';
    }

    if (video.getVideoPlaybackQuality) {
      const q = video.getVideoPlaybackQuality();
      statDroppedFrames.textContent = q.droppedVideoFrames || 0;
    }
  }

  btnToggleStats.addEventListener('click', () => {
    statsModal.classList.add('open');
    refreshStats();
    if (statsInterval) clearInterval(statsInterval);
    statsInterval = setInterval(refreshStats, 2000);
  });

  function closeStatsModal() {
    statsModal.classList.remove('open');
    if (statsInterval) {
      clearInterval(statsInterval);
      statsInterval = null;
    }
  }

  btnCloseStats.addEventListener('click', closeStatsModal);
  btnRefreshStats.addEventListener('click', refreshStats);

  // ==========================================================================
  // Mobile / Sidebar Navigation
  // ==========================================================================
  function closeSidebars() {
    guideDrawer.classList.remove('open');
    epgSidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
  }

  if (playOverlay) {
    playOverlay.addEventListener('click', () => {
      video.muted = false;
      isMuted = false;
      btnMute.textContent = '🔊';
      video.play().then(() => {
        playOverlay.classList.remove('active');
      }).catch(e => console.error('Play on overlay click error:', e));
    });
  }

  btnOpenGuide.addEventListener('click', () => {
    closeSidebars();
    guideDrawer.classList.add('open');
    sidebarBackdrop.classList.add('active');
    highlightActiveDrawerItem();
    // Intentionally no searchInput.focus() so mobile virtual keyboard does not pop up automatically!
  });

  btnCloseGuide.addEventListener('click', closeSidebars);

  btnToggleEpg.addEventListener('click', () => {
    closeSidebars();
    epgSidebar.classList.add('open');
    sidebarBackdrop.classList.add('active');
  });

  btnCloseEpg.addEventListener('click', closeSidebars);
  sidebarBackdrop.addEventListener('click', closeSidebars);

  btnPrev.addEventListener('click', () => playChannel(currentChannelIndex - 1));
  btnNext.addEventListener('click', () => playChannel(currentChannelIndex + 1));

  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    video.muted = isMuted;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    showAdjustment(t('mute'), isMuted ? t('muteOn') : t('muteOff'), isMuted ? 0 : currentVolume * 100);
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const req = video.requestFullscreen || video.webkitRequestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen;
      if (req) {
        req.call(video).catch(() => {
          const cabinet = document.getElementById('tv-cabinet');
          if (cabinet && cabinet.requestFullscreen) cabinet.requestFullscreen().catch(() => {});
        });
      }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (exit) exit.call(document);
    }
  });

  searchInput.addEventListener('input', applyFilter);

  // Keyboard Shortcuts & Smart TV Remote Control Support
  window.addEventListener('keydown', (e) => {
    // Smart TV Remote specific keyCodes (Samsung Tizen, LG webOS):
    // 10009: Tizen Return/Back button, 427: ChannelUp, 428: ChannelDown, 415: Play, 19: Pause, 413: Stop
    if (e.keyCode === 10009) {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document);
        e.preventDefault();
        return;
      }
      if (guideDrawer.classList.contains('open') || epgSidebar.classList.contains('open') || reportModal.classList.contains('open') || statsModal.classList.contains('open') || sleepModal.classList.contains('open') || remoteModal.classList.contains('open') || (helpModal && helpModal.classList.contains('open'))) {
        closeSidebars();
        closeReportModal();
        closeStatsModal();
        closeSleepModal();
        closeRemoteModal();
        closeHelpModal();
        e.preventDefault();
        return;
      }
    }

    if (e.keyCode === 427) {
      e.preventDefault();
      playChannel(currentChannelIndex + 1);
      return;
    }
    if (e.keyCode === 428) {
      e.preventDefault();
      playChannel(currentChannelIndex - 1);
      return;
    }

    if (document.activeElement === searchInput || document.activeElement === reportUserNote || document.activeElement === helpSearchInput) {
      if (e.key === 'Escape') {
        closeSidebars();
        closeReportModal();
        closeStatsModal();
        closeSleepModal();
        closeRemoteModal();
        closeHelpModal();
        document.activeElement.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ChannelUp':
      case 'MediaTrackNext':
        e.preventDefault();
        playChannel(currentChannelIndex + 1);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ChannelDown':
      case 'MediaTrackPrevious':
        e.preventDefault();
        playChannel(currentChannelIndex - 1);
        break;
      case 'MediaPlay':
      case 'MediaPlayPause':
        e.preventDefault();
        if (video.paused) video.play(); else video.pause();
        break;
      case 'MediaStop':
        e.preventDefault();
        video.pause();
        break;
      case 'Enter':
        if (!guideDrawer.classList.contains('open') && !epgSidebar.classList.contains('open')) {
          if (isMuted) {
            btnMute.click();
          }
        }
        break;
      case '+':
      case '=':
        e.preventDefault();
        setVolume(currentVolume + 0.05);
        break;
      case '-':
      case '_':
        e.preventDefault();
        setVolume(currentVolume - 0.05);
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        btnMute.click();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        btnFullscreen.click();
        break;
      case 'c':
      case 'C':
      case 'l':
      case 'L':
        e.preventDefault();
        if (guideDrawer.classList.contains('open')) {
          closeSidebars();
        } else {
          btnOpenGuide.click();
        }
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        if (epgSidebar.classList.contains('open')) {
          closeSidebars();
        } else {
          btnToggleEpg.click();
        }
        break;
      case 'h':
      case 'H':
      case '?':
        e.preventDefault();
        if (helpModal && helpModal.classList.contains('open')) {
          closeHelpModal();
        } else {
          openHelpModal();
        }
        break;
      case 'Escape':
        closeSidebars();
        closeReportModal();
        closeStatsModal();
        closeSleepModal();
        closeRemoteModal();
        closeHelpModal();
        break;
      default:
        if (e.key >= '0' && e.key <= '9') {
          const num = parseInt(e.key, 10);
          if (num > 0 && num <= channels.length) {
            playChannel(num - 1);
          }
        }
        break;
    }
  });

  // Initial Load with Last Channel and Country Memory
  async function loadChannels() {
    try {
      // Set initial language
      const initLang = detectInitialLanguage();
      setLanguage(initLang);

      // Load Favorites from LocalStorage
      loadFavorites();

      // Initialize PeerJS Remote Server in background
      setTimeout(initRemoteServer, 800);

      const res = await fetch(`channels.json?t=${Date.now()}`);
      hungarianChannels = await res.json();

      // Read saved channel and country/source
      const savedSource = localStorage.getItem('zsirafvision_last_source') || 'HU';
      const savedChannelName = localStorage.getItem('zsirafvision_last_channel_name');
      const savedChannelUrl = localStorage.getItem('zsirafvision_last_channel_url');

      if (savedSource === 'WORLD') {
        sourceSelect.value = 'WORLD';
        showLoading(t('loadingWorld'));
        try {
          const wRes = await fetch('https://iptv-org.github.io/iptv/index.country.m3u');
          const wText = await wRes.text();
          worldChannels = parseM3uWorld(wText);
          channels = worldChannels;
        } catch (we) {
          console.warn('Fallback to HU channels:', we);
          channels = hungarianChannels;
          sourceSelect.value = 'HU';
        }
      } else if (savedSource === 'XXX') {
        try {
          const aRes = await fetch(`adult.json?t=${Date.now()}`);
          if (aRes.ok) {
            adultChannels = await aRes.json();
            channels = adultChannels;
          } else {
            channels = hungarianChannels;
          }
        } catch (ae) {
          channels = hungarianChannels;
        }
      } else {
        sourceSelect.value = 'HU';
        channels = hungarianChannels;
      }

      setupCategories();
      renderDrawer(channels);

      // Locate previously watched channel
      let targetIndex = 0;
      if (savedChannelName || savedChannelUrl) {
        const found = channels.findIndex(c =>
          (savedChannelName && c.name.toLowerCase() === savedChannelName.toLowerCase()) ||
          (savedChannelUrl && c.url === savedChannelUrl)
        );
        if (found !== -1) {
          targetIndex = found;
        }
      }

      playChannel(targetIndex);
      loadEpgDatabase();
    } catch (e) {
      console.error('Failed to load channels:', e);
      osdName.textContent = 'HIBA';
      osdCategory.textContent = 'channels.json nem található';
    }
  }

  loadChannels();

  // Service Worker Registration for PWA (v4.2)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js?v=4.2').then((reg) => {
        console.log('[ZsirafVision v4.2] Service Worker regisztrálva:', reg.scope);
      }).catch((err) => {
        console.warn('[ZsirafVision v4.2] Service Worker hiba:', err);
      });
    });
  }

  // PWA Fullscreen Landscape Lock Support
  window.addEventListener('load', () => {
    if (window.matchMedia && (window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: standalone)').matches)) {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    }
  });
})();
