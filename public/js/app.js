/**
 * ZsirafVision - Videoton TV Player (Tökéletes, Éles HD Kép, Inaktív Analóg Gombok)
 */

(function () {
  'use strict';

  // State
  let channels = [];
  let currentChannelIndex = 0;
  let isMuted = false;
  let currentVolume = 1.0;
  let hls = null;
  let osdTimeout = null;
  let adjustmentTimeout = null;

  // DOM Elements
  const video = document.getElementById('tv-video');
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

  function showLoading(msg = 'ADÁS BETÖLTÉSE...') {
    tuningText.textContent = msg;
    tuningIndicator.classList.add('active');
  }

  function hideLoading() {
    tuningIndicator.classList.remove('active');
  }

  // Show adjustment banner (volume, mute)
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

  // Play Channel
  function playChannel(index) {
    if (!channels.length) return;
    if (index < 0) index = channels.length - 1;
    if (index >= channels.length) index = 0;
    currentChannelIndex = index;

    const channel = channels[currentChannelIndex];

    // Update OSD
    osdName.textContent = channel.name;
    osdNumber.textContent = channel.channel_number || String(channel.id).padStart(2, '0');
    osdCategory.textContent = channel.group || 'Magyar TV';
    osdContainer.classList.remove('fade-out');
    clearTimeout(osdTimeout);
    osdTimeout = setTimeout(() => {
      osdContainer.classList.add('fade-out');
    }, 4500);

    // Update Active item in Drawer
    highlightActiveDrawerItem();

    showLoading(`${channel.name} BETÖLTÉSE...`);

    // Direct stream playback (all curated channels are verified HTTPS with CORS)
    const streamUrl = channel.url;

    // Destroy previous Hls instance
    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 8000,
        manifestLoadingMaxRetry: 2
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hideLoading();
        video.play().catch((err) => {
          console.warn('Autoplay blocked, muting video to allow playback:', err);
          video.muted = true;
          isMuted = true;
          btnMute.textContent = '🔇';
          video.play().catch((e) => console.error('Play failed completely:', e));
        });
      });

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
              tuningText.textContent = 'AZ ADÁS JELENLEG NEM ELÉRHETŐ';
              setTimeout(hideLoading, 3000);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
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

  // Volume Adjustment
  function setVolume(val) {
    currentVolume = Math.max(0, Math.min(1, val));
    video.volume = currentVolume;
    video.muted = false;
    isMuted = false;
    btnMute.textContent = currentVolume === 0 ? '🔇' : '🔊';
    showAdjustment('HANGERŐ', `${Math.round(currentVolume * 100)}%`, currentVolume * 100);
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
      // Find actual index in global channels array
      const globalIdx = channels.findIndex((c) => c.id === ch.id || c.name === ch.name);
      const actualIdx = globalIdx !== -1 ? globalIdx : (ch.id ? ch.id - 1 : 0);

      const item = document.createElement('div');
      item.className = `channel-item ${actualIdx === currentChannelIndex ? 'active' : ''}`;
      item.dataset.index = actualIdx;

      const numSpan = document.createElement('span');
      numSpan.className = 'channel-item-num';
      numSpan.textContent = ch.channel_number || (ch.id ? String(ch.id).padStart(2, '0') : '00');

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
        if (!isNaN(idx) && idx >= 0 && idx < channels.length) {
          playChannel(idx);
        }
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
      playChannel(0);
    } catch (e) {
      console.error('Failed to load channels:', e);
      osdName.textContent = 'HIBA';
      osdCategory.textContent = 'channels.json nem található';
    }
  }

  // Navigation Buttons
  btnPrev.addEventListener('click', () => playChannel(currentChannelIndex - 1));
  btnNext.addEventListener('click', () => playChannel(currentChannelIndex + 1));

  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    video.muted = isMuted;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
    showAdjustment('NÉMÍTÁS', isMuted ? 'BE' : 'KI', isMuted ? 0 : currentVolume * 100);
  });

  btnFullscreen.addEventListener('click', () => {
    // Fullscreen for the video itself for crystal clear fullscreen viewing!
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else {
        const cabinet = document.getElementById('tv-cabinet');
        if (cabinet.requestFullscreen) cabinet.requestFullscreen();
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
        if (e.key >= '0' && e.key <= '9') {
          const num = parseInt(e.key, 10);
          if (num > 0 && num <= channels.length) {
            playChannel(num - 1);
          }
        }
        break;
    }
  });

  loadChannels();
})();
