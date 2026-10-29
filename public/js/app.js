/**
 * ZsirafVision - Online TV Player
 * Műsorújság (EPG), Hibajelentő (Red Button), Technikai adatok, iptv-org és Secret XXX támogatással
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

  function showLoading(msg = 'ADÁS BETÖLTÉSE...') {
    tuningText.textContent = msg;
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

    if (programs && programs.length) {
      programs.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = `epg-prog-item ${idx === 0 ? 'active' : ''}`;

        const timeRow = document.createElement('div');
        timeRow.className = 'epg-time-row';
        timeRow.innerHTML = `<span>${p.start} - ${p.stop}</span> ${idx === 0 ? '<span class="epg-live-indicator">ÉLŐBEN</span>' : ''}`;

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
      });
    } else {
      epgProgramsList.innerHTML = `
        <div class="epg-empty">
          <p>Ehhez a csatornához jelenleg nem áll rendelkezésre részletes műsorinformáció.</p>
          <p style="margin-top: 8px; font-size: 0.75rem; color: #555;">(Folyamatos adás)</p>
        </div>
      `;
    }
  }

  // ==========================================================================
  // Channel Playback
  // ==========================================================================
  function playChannel(index) {
    if (!channels.length) return;
    if (index < 0) index = channels.length - 1;
    if (index >= channels.length) index = 0;
    currentChannelIndex = index;

    const channel = channels[currentChannelIndex];

    // Update OSD
    osdName.textContent = channel.name;
    osdNumber.textContent = channel.channel_number || (channel.id ? String(channel.id).padStart(2, '0') : '00');
    osdCategory.textContent = channel.group || 'Online TV';
    osdContainer.classList.remove('fade-out');
    clearTimeout(osdTimeout);
    osdTimeout = setTimeout(() => {
      osdContainer.classList.add('fade-out');
    }, 4500);

    highlightActiveDrawerItem();
    updateEpgForCurrentChannel();
    showLoading(`${channel.name} BETÖLTÉSE...`);

    const streamUrl = channel.url;

    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 2
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hideLoading();
        // Modern browsers require muted autoplay for un-interacted pages
        video.muted = true;
        isMuted = true;
        btnMute.textContent = '🔇';
        
        video.play().then(() => {
          if (playOverlay) playOverlay.classList.remove('active');
        }).catch((err) => {
          console.warn('Autoplay requires user interaction:', err);
          if (playOverlay) playOverlay.classList.add('active');
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
      // Safari iOS/macOS
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
    showAdjustment('HANGERŐ', `${Math.round(currentVolume * 100)}%`, currentVolume * 100);
  }

  // ==========================================================================
  // Drawer & Filter Logic
  // ==========================================================================
  function renderDrawer(channelsToRender) {
    channelListScroll.innerHTML = '';
    if (!channelsToRender.length) {
      channelListScroll.innerHTML = '<div style="padding: 20px; text-align: center; color: #777;">Nincs találat.</div>';
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

      item.appendChild(numSpan);
      item.appendChild(logoImg);
      item.appendChild(infoDiv);

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
        channels = adultChannels;
        renderDrawer(adultChannels);
        return;
      }
    }

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

  // ==========================================================================
  // Source / Country Selector (Hungarian default vs iptv-org World)
  // ==========================================================================
  sourceSelect.addEventListener('change', async () => {
    const selected = sourceSelect.value;
    if (selected === 'HU') {
      channels = hungarianChannels;
      setupCategories();
      applyFilter();
      playChannel(0);
    } else if (selected === 'WORLD') {
      showLoading('VILÁG CSATORNÁK BETÖLTÉSE...');
      if (!worldChannels) {
        try {
          const res = await fetch('https://iptv-org.github.io/iptv/index.country.m3u');
          const text = await res.text();
          const parsed = parseM3uWorld(text);
          worldChannels = parsed;
        } catch (e) {
          console.error('Failed to fetch world channels:', e);
          tuningText.textContent = 'HIBA A VILÁG CSATORNÁK BETÖLTÉSEKOR';
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
    searchInput.focus();
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
    showAdjustment('NÉMÍTÁS', isMuted ? 'BE' : 'KI', isMuted ? 0 : currentVolume * 100);
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else {
        const cabinet = document.getElementById('tv-cabinet');
        if (cabinet.requestFullscreen) cabinet.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  searchInput.addEventListener('input', applyFilter);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === searchInput || document.activeElement === reportUserNote) {
      if (e.key === 'Escape') {
        closeSidebars();
        closeReportModal();
        closeStatsModal();
        document.activeElement.blur();
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
      case 'Escape':
        closeSidebars();
        closeReportModal();
        closeStatsModal();
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

  // Initial Load
  async function loadChannels() {
    try {
      const res = await fetch(`channels.json?t=${Date.now()}`);
      hungarianChannels = await res.json();
      channels = hungarianChannels;
      setupCategories();
      renderDrawer(channels);
      playChannel(0);
      loadEpgDatabase();
    } catch (e) {
      console.error('Failed to load channels:', e);
      osdName.textContent = 'HIBA';
      osdCategory.textContent = 'channels.json nem található';
    }
  }

  loadChannels();
})();
