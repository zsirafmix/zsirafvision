/**
 * ZsirafVision - Videoton Retro IPTV Player Application
 */

(function () {
  'use strict';

  // State
  let channels = [];
  let currentChannelIndex = 0;
  let isPoweredOn = true;
  let isMuted = false;
  let currentVolume = 0.8;
  let currentBrightness = 1.0;
  let currentContrast = 1.0;
  let dialAngle = 0;
  let hls = null;
  let staticAnimFrame = null;
  let osdTimeout = null;
  let adjustmentTimeout = null;
  let isTuning = false;
  let audioCtx = null;

  // DOM Elements
  const video = document.getElementById('tv-video');
  const staticCanvas = document.getElementById('static-canvas');
  const crtPowerLayer = document.getElementById('crt-power-layer');
  const osdContainer = document.getElementById('osd-container');
  const osdName = document.getElementById('osd-name');
  const osdNumber = document.getElementById('osd-number');
  const osdCategory = document.getElementById('osd-category');
  const osdAdjustment = document.getElementById('osd-adjustment');
  const adjustmentLabel = document.getElementById('adjustment-label');
  const adjustmentBar = document.getElementById('adjustment-bar');
  const adjustmentValue = document.getElementById('adjustment-value');
  const tuningIndicator = document.getElementById('tuning-indicator');
  const tuningText = document.getElementById('tuning-text');

  const powerButton = document.getElementById('power-button');
  const powerLed = document.getElementById('power-led');
  const rotaryDial = document.getElementById('rotary-dial');
  const channelKnob = document.getElementById('channel-knob');
  const knobVolume = document.getElementById('knob-volume');
  const dialVolume = document.getElementById('dial-volume');
  const knobBrightness = document.getElementById('knob-brightness');
  const dialBrightness = document.getElementById('dial-brightness');
  const knobContrast = document.getElementById('knob-contrast');
  const dialContrast = document.getElementById('dial-contrast');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOpenGuide = document.getElementById('btn-open-guide');
  const btnCloseGuide = document.getElementById('btn-close-guide');
  const btnMute = document.getElementById('btn-mute');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const guideDrawer = document.getElementById('channel-guide-drawer');
  const searchInput = document.getElementById('channel-search-input');
  const categoryPillsContainer = document.getElementById('category-pills');
  const channelListScroll = document.getElementById('channel-list-scroll');
  const channelCountBadge = document.getElementById('channel-count-badge');

  // Check if running on local proxy server
  const isLocalServer = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.port === '8888' ||
                        window.location.protocol === 'http:';

  // Initialize Web Audio API for Retro Sound Effects
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesize rotary switch click sound
  function playClickSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  // Synthesize CRT turn on pop
  function playPowerSound(turnOn) {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      if (turnOn) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(15734, audioCtx.currentTime + 0.25); // 15.7kHz CRT whistle!
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      }
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  // Canvas-based Static Snow Animation
  function initStaticNoise() {
    const ctx = staticCanvas.getContext('2d');
    let width = (staticCanvas.width = 240);
    let height = (staticCanvas.height = 180);

    function renderNoise() {
      if (isTuning && isPoweredOn) {
        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = (Math.random() * 255) | 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      staticAnimFrame = requestAnimationFrame(renderNoise);
    }
    renderNoise();
  }

  function startStatic(showTuningText = true, message = 'HANGOLÁS...') {
    isTuning = true;
    staticCanvas.classList.add('active');
    if (showTuningText) {
      tuningText.textContent = message;
      tuningIndicator.classList.add('active');
    }
  }

  function stopStatic() {
    isTuning = false;
    staticCanvas.classList.remove('active');
    tuningIndicator.classList.remove('active');
  }

  // Update CRT video filters (brightness, contrast)
  function updateVideoFilters() {
    video.style.filter = `brightness(${currentBrightness}) contrast(${currentContrast})`;
  }

  // Show adjustment banner
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

  // Build Proxy URL when running on local server or fallback
  function getStreamUrl(channel) {
    const rawUrl = channel.url;
    if (isLocalServer) {
      let p = `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
      if (channel.ua) p += `&ua=${encodeURIComponent(channel.ua)}`;
      if (channel.referrer) p += `&ref=${encodeURIComponent(channel.referrer)}`;
      return p;
    }
    // Running on GitHub Pages:
    // If stream is HTTPS, use direct URL
    if (rawUrl.startsWith('https://')) {
      return rawUrl;
    }
    // If stream is HTTP and we are on HTTPS, browser blocks it.
    // We try a public CORS proxy
    return `https://corsproxy.io/?url=${encodeURIComponent(rawUrl)}`;
  }

  // Play Channel
  function playChannel(index, triggerSound = true) {
    if (!channels.length || !isPoweredOn) return;
    if (index < 0) index = channels.length - 1;
    if (index >= channels.length) index = 0;
    currentChannelIndex = index;

    const channel = channels[currentChannelIndex];
    if (triggerSound) playClickSound();

    // Rotate dial by 30 degrees per channel
    dialAngle = (currentChannelIndex % 12) * 30;
    rotaryDial.style.transform = `rotate(${dialAngle}deg)`;

    // Update OSD
    osdName.textContent = channel.name;
    osdNumber.textContent = channel.channel_number || String(channel.id).padStart(2, '0');
    osdCategory.textContent = channel.group || 'Általános';
    osdContainer.classList.remove('fade-out');
    clearTimeout(osdTimeout);
    osdTimeout = setTimeout(() => {
      osdContainer.classList.add('fade-out');
    }, 4500);

    // Update Active item in Drawer
    highlightActiveDrawerItem();

    // Start static noise while tuning
    startStatic(true, `${channel.name} BETÖLTÉSE...`);

    const streamUrl = getStreamUrl(channel);

    // Destroy previous Hls instance
    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOut: 15000
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        stopStatic();
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              tuningText.textContent = 'JELVESZTÉS / HÁLÓZATI HIBA';
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              tuningText.textContent = 'ADÁSHIBA (Helyreállítás...)';
              hls.recoverMediaError();
              break;
            default:
              tuningText.textContent = 'A CSATORNA JELENLEG NEM ELÉRHETŐ';
              setTimeout(stopStatic, 4000);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        stopStatic();
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        tuningText.textContent = 'JELVESZTÉS';
      });
    }
  }

  // Toggle TV Power
  function togglePower() {
    isPoweredOn = !isPoweredOn;
    playPowerSound(isPoweredOn);

    if (isPoweredOn) {
      powerLed.classList.add('active');
      crtPowerLayer.classList.remove('power-off');
      crtPowerLayer.classList.add('animating-on');
      setTimeout(() => {
        crtPowerLayer.classList.remove('animating-on');
      }, 550);
      playChannel(currentChannelIndex, false);
    } else {
      powerLed.classList.remove('active');
      crtPowerLayer.classList.add('animating-off');
      setTimeout(() => {
        crtPowerLayer.classList.remove('animating-off');
        crtPowerLayer.classList.add('power-off');
      }, 450);
      if (hls) {
        hls.destroy();
        hls = null;
      }
      video.pause();
      stopStatic();
    }
  }

  // Volume Adjustment
  function setVolume(val) {
    currentVolume = Math.max(0, Math.min(1, val));
    video.volume = currentVolume;
    video.muted = false;
    isMuted = false;
    btnMute.textContent = currentVolume === 0 ? '🔇' : '🔊';
    const deg = (currentVolume - 0.5) * 180;
    dialVolume.style.transform = `rotate(${deg}deg)`;
    showAdjustment('HANGERŐ', `${Math.round(currentVolume * 100)}%`, currentVolume * 100);
  }

  // Brightness Adjustment
  function setBrightness(val) {
    currentBrightness = Math.max(0.4, Math.min(1.8, val));
    updateVideoFilters();
    const deg = ((currentBrightness - 0.4) / 1.4 - 0.5) * 180;
    dialBrightness.style.transform = `rotate(${deg}deg)`;
    const pct = Math.round(((currentBrightness - 0.4) / 1.4) * 100);
    showAdjustment('FÉNYERŐ', `${pct}%`, pct);
  }

  // Contrast Adjustment
  function setContrast(val) {
    currentContrast = Math.max(0.4, Math.min(2.0, val));
    updateVideoFilters();
    const deg = ((currentContrast - 0.4) / 1.6 - 0.5) * 180;
    dialContrast.style.transform = `rotate(${deg}deg)`;
    const pct = Math.round(((currentContrast - 0.4) / 1.6) * 100);
    showAdjustment('KONTRASZT', `${pct}%`, pct);
  }

  // Drawer & Categories Rendering
  function renderDrawer(channelsToRender) {
    channelListScroll.innerHTML = '';
    if (!channelsToRender.length) {
      channelListScroll.innerHTML = '<div style="padding: 20px; text-align: center; color: #777;">Nincs találat.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();
    channelsToRender.forEach((ch) => {
      const item = document.createElement('div');
      item.className = `channel-item ${ch.id - 1 === currentChannelIndex ? 'active' : ''}`;
      item.dataset.index = ch.id - 1;

      const numSpan = document.createElement('span');
      numSpan.className = 'channel-item-num';
      numSpan.textContent = ch.channel_number || String(ch.id).padStart(2, '0');

      const logoImg = document.createElement('img');
      logoImg.className = 'channel-item-logo';
      logoImg.src = ch.logo || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23222"/><text y="55" x="50" font-size="30" text-anchor="middle" fill="%23666">TV</text></svg>';
      logoImg.loading = 'lazy';
      logoImg.onerror = () => {
        logoImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23222"/><text y="55" x="50" font-size="30" text-anchor="middle" fill="%23666">TV</text></svg>';
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

      item.appendChild(numSpan);
      item.appendChild(logoImg);
      item.appendChild(infoDiv);

      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        playChannel(idx);
        guideDrawer.classList.remove('open');
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

  // Setup Categories
  function setupCategories() {
    const groups = new Set();
    channels.forEach((c) => {
      if (c.group) groups.add(c.group);
    });

    categoryPillsContainer.innerHTML = '';
    const allPill = document.createElement('button');
    allPill.className = 'cat-pill active';
    allPill.dataset.category = 'ALL';
    allPill.textContent = `Mind (${channels.length})`;
    categoryPillsContainer.appendChild(allPill);

    Array.from(groups).sort().forEach((grp) => {
      const count = channels.filter((c) => c.group === grp).length;
      const pill = document.createElement('button');
      pill.className = 'cat-pill';
      pill.dataset.category = grp;
      pill.textContent = `${grp} (${count})`;
      categoryPillsContainer.appendChild(pill);
    });

    // Click on Category Pill
    categoryPillsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('cat-pill')) {
        categoryPillsContainer.querySelectorAll('.cat-pill').forEach((p) => p.classList.remove('active'));
        e.target.classList.add('active');
        applyFilter();
      }
    });
  }

  function applyFilter() {
    const activePill = categoryPillsContainer.querySelector('.cat-pill.active');
    const selectedCategory = activePill ? activePill.dataset.category : 'ALL';
    const query = searchInput.value.toLowerCase().trim();

    let filtered = channels;
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((c) => c.group === selectedCategory);
    }
    if (query) {
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(query) || (c.channel_number && c.channel_number.includes(query))
      );
    }
    renderDrawer(filtered);
  }

  // Load Channels Data
  async function loadChannels() {
    try {
      const res = await fetch('channels.json');
      channels = await res.json();
      channelCountBadge.textContent = `${channels.length} CSATORNA`;
      setupCategories();
      renderDrawer(channels);

      // Start on first channel
      playChannel(0, false);
    } catch (e) {
      console.error('Failed to load channels:', e);
      osdName.textContent = 'HIBA';
      osdCategory.textContent = 'channels.json nem található';
    }
  }

  // Event Listeners for Physical Controls
  powerButton.addEventListener('click', togglePower);

  // Rotary Knob Click / Turn
  channelKnob.addEventListener('click', () => {
    playChannel(currentChannelIndex + 1);
  });

  channelKnob.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      playChannel(currentChannelIndex + 1);
    } else {
      playChannel(currentChannelIndex - 1);
    }
  });

  // Volume Knob Wheel
  knobVolume.addEventListener('wheel', (e) => {
    e.preventDefault();
    setVolume(currentVolume + (e.deltaY < 0 ? 0.05 : -0.05));
  });

  // Brightness Knob Wheel
  knobBrightness.addEventListener('wheel', (e) => {
    e.preventDefault();
    setBrightness(currentBrightness + (e.deltaY < 0 ? 0.05 : -0.05));
  });

  // Contrast Knob Wheel
  knobContrast.addEventListener('wheel', (e) => {
    e.preventDefault();
    setContrast(currentContrast + (e.deltaY < 0 ? 0.05 : -0.05));
  });

  // Quick Nav Buttons
  btnPrev.addEventListener('click', () => playChannel(currentChannelIndex - 1));
  btnNext.addEventListener('click', () => playChannel(currentChannelIndex + 1));

  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    video.muted = isMuted;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    showAdjustment('NÉMÍTÁS', isMuted ? 'BE' : 'KI', isMuted ? 0 : currentVolume * 100);
  });

  btnFullscreen.addEventListener('click', () => {
    const cabinet = document.getElementById('tv-cabinet');
    if (!document.fullscreenElement) {
      if (cabinet.requestFullscreen) {
        cabinet.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  btnOpenGuide.addEventListener('click', () => {
    guideDrawer.classList.add('open');
    highlightActiveDrawerItem();
    searchInput.focus();
  });

  btnCloseGuide.addEventListener('click', () => {
    guideDrawer.classList.remove('open');
  });

  searchInput.addEventListener('input', applyFilter);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === searchInput) {
      if (e.key === 'Escape') {
        guideDrawer.classList.remove('open');
        searchInput.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        playChannel(currentChannelIndex + 1);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        playChannel(currentChannelIndex - 1);
        break;
      case ' ':
        e.preventDefault();
        togglePower();
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
          guideDrawer.classList.remove('open');
        } else {
          btnOpenGuide.click();
        }
        break;
      case 'Escape':
        guideDrawer.classList.remove('open');
        break;
      default:
        // Direct number entry
        if (e.key >= '0' && e.key <= '9') {
          const num = parseInt(e.key, 10);
          if (num > 0 && num <= channels.length) {
            playChannel(num - 1);
          }
        }
        break;
    }
  });

  // Start static generator and load data on launch
  initStaticNoise();
  loadChannels();
})();
