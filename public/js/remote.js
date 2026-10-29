/**
 * ZsirafVision - Mobile TV Remote Client Logic
 * Version: 3.7
 * Peer-to-Peer WebRTC communication via PeerJS
 */

(function () {
  'use strict';

  // Elements
  const statusDot = document.getElementById('status-dot');
  const connLabel = document.getElementById('conn-label');
  const dispChName = document.getElementById('disp-ch-name');
  const dispChNum = document.getElementById('disp-ch-num');
  const dispChGroup = document.getElementById('disp-ch-group');
  const dispVol = document.getElementById('disp-vol');
  const pairingBox = document.getElementById('pairing-box');
  const manualRoomCode = document.getElementById('manual-room-code');
  const btnManualPair = document.getElementById('btn-manual-pair');

  // Controls
  const btnPower = document.getElementById('btn-power');
  const btnSleep = document.getElementById('btn-sleep');
  const btnMute = document.getElementById('btn-mute');
  const btnChUp = document.getElementById('btn-ch-up');
  const btnChDown = document.getElementById('btn-ch-down');
  const btnVolUp = document.getElementById('btn-vol-up');
  const btnVolDown = document.getElementById('btn-vol-down');
  const btnDpadUp = document.getElementById('btn-dpad-up');
  const btnDpadDown = document.getElementById('btn-dpad-down');
  const btnDpadLeft = document.getElementById('btn-dpad-left');
  const btnDpadRight = document.getElementById('btn-dpad-right');
  const btnDpadOk = document.getElementById('btn-dpad-ok');
  const btnOpenGuide = document.getElementById('btn-open-guide');
  const btnOpenEpg = document.getElementById('btn-open-epg');
  const btnFav = document.getElementById('btn-fav');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const numButtons = document.querySelectorAll('.num-btn[data-num]');
  const btnNumPrev = document.getElementById('btn-num-prev');
  const btnNumNext = document.getElementById('btn-num-next');

  // State
  let peer = null;
  let conn = null;
  let roomCode = null;

  function haptic() {
    try {
      if (navigator.vibrate) navigator.vibrate(35);
    } catch (e) {}
  }

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function setStatus(connected, text) {
    if (connected) {
      statusDot.classList.add('connected');
      connLabel.textContent = text || 'Csatlakoztatva';
      pairingBox.classList.remove('active');
    } else {
      statusDot.classList.remove('connected');
      connLabel.textContent = text || 'Kapcsolódás...';
    }
  }

  function sendCommand(action, data = {}) {
    haptic();
    if (conn && conn.open) {
      conn.send({ type: 'command', action, ...data });
    } else {
      console.warn('Cannot send command, not connected');
    }
  }

  function connectToTV(targetRoom) {
    if (!targetRoom) {
      pairingBox.classList.add('active');
      return;
    }
    roomCode = targetRoom.toUpperCase().trim();
    setStatus(false, `Kapcsolódás: ${roomCode}`);

    if (peer) {
      try { peer.destroy(); } catch (e) {}
    }

    // Connect as client peer
    peer = new Peer({
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('open', (id) => {
      console.log('[Remote] Peer ready with ID:', id);
      const tvPeerId = 'zsiraf-tv-' + roomCode;
      conn = peer.connect(tvPeerId, { reliable: true });

      conn.on('open', () => {
        console.log('[Remote] Connected to TV:', tvPeerId);
        setStatus(true, 'TV Aktív');
        sendCommand('requestState');
      });

      conn.on('data', (msg) => {
        if (msg && msg.type === 'state') {
          updateDisplay(msg);
        }
      });

      conn.on('close', () => {
        console.warn('[Remote] Connection closed');
        setStatus(false, 'Megszakadt');
      });

      conn.on('error', (err) => {
        console.error('[Remote] Conn error:', err);
        setStatus(false, 'Hiba');
      });
    });

    peer.on('error', (err) => {
      console.error('[Remote] Peer error:', err);
      setStatus(false, 'Szerver hiba');
      pairingBox.classList.add('active');
    });
  }

  function updateDisplay(state) {
    if (state.channelName) dispChName.textContent = state.channelName;
    if (state.channelNumber) dispChNum.textContent = `CH ${state.channelNumber}`;
    if (state.group) dispChGroup.textContent = state.group;
    if (state.volume !== undefined) {
      const volPct = Math.round(state.volume * 100);
      dispVol.textContent = state.isMuted ? 'NÉMÍTVA' : `VOL ${volPct}%`;
    }
    if (state.isStandby) {
      dispChName.textContent = 'STANDBY';
      dispChGroup.textContent = 'Készenléti Mód';
    }
  }

  // Bind Buttons
  btnPower.addEventListener('click', () => sendCommand('power'));
  btnSleep.addEventListener('click', () => sendCommand('sleep'));
  btnMute.addEventListener('click', () => sendCommand('mute'));

  btnChUp.addEventListener('click', () => sendCommand('chUp'));
  btnChDown.addEventListener('click', () => sendCommand('chDown'));
  btnVolUp.addEventListener('click', () => sendCommand('volUp'));
  btnVolDown.addEventListener('click', () => sendCommand('volDown'));

  btnDpadUp.addEventListener('click', () => sendCommand('chUp'));
  btnDpadDown.addEventListener('click', () => sendCommand('chDown'));
  btnDpadLeft.addEventListener('click', () => sendCommand('volDown'));
  btnDpadRight.addEventListener('click', () => sendCommand('volUp'));
  btnDpadOk.addEventListener('click', () => sendCommand('ok'));

  btnOpenGuide.addEventListener('click', () => sendCommand('toggleGuide'));
  btnOpenEpg.addEventListener('click', () => sendCommand('toggleEpg'));
  btnFav.addEventListener('click', () => sendCommand('toggleFav'));
  btnFullscreen.addEventListener('click', () => sendCommand('toggleFullscreen'));

  numButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-num');
      sendCommand('digit', { digit: num });
    });
  });

  btnNumPrev.addEventListener('click', () => sendCommand('chDown'));
  btnNumNext.addEventListener('click', () => sendCommand('chUp'));

  btnManualPair.addEventListener('click', () => {
    const val = manualRoomCode.value.trim();
    if (val) {
      connectToTV(val);
    }
  });

  // Init
  const initialRoom = getQueryParam('room');
  if (initialRoom) {
    connectToTV(initialRoom);
  } else {
    pairingBox.classList.add('active');
    setStatus(false, 'Kód szükséges');
  }
})();
