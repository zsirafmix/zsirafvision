/**
 * ZsirafVision - Mobile TV Remote Client Logic
 * Version: 3.8
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
  let mqttClient = null;

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
    const payload = JSON.stringify({ type: 'command', cmd: action, action, ...data });

    // 1. Send via MQTT Cloud Bridge (Fastest, 100% reliable)
    if (mqttClient && mqttClient.isConnected && mqttClient.isConnected()) {
      try {
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = 'zsirafvision/' + roomCode + '/cmd';
        mqttClient.send(msg);
      } catch (e) {
        console.warn('MQTT send error:', e);
      }
    }

    // 2. Also send via PeerJS (if WebRTC P2P is open)
    if (conn && conn.open) {
      try {
        conn.send({ type: 'command', cmd: action, action, ...data });
      } catch (e) {}
    }
  }

  function connectToTV(targetRoom) {
    if (!targetRoom) {
      pairingBox.classList.add('active');
      return;
    }
    roomCode = targetRoom.toUpperCase().trim();
    if (manualRoomCode) manualRoomCode.value = roomCode;
    setStatus(false, `Kapcsolódás: ${roomCode}`);

    // ==========================================
    // 1. MQTT Cloud Bridge (Zero NAT issues)
    // ==========================================
    if (mqttClient) {
      try { mqttClient.disconnect(); } catch (e) {}
      mqttClient = null;
    }

    const brokerHosts = ['broker.hivemq.com', 'broker.emqx.io'];
    let hostIdx = 0;

    function tryMqtt() {
      if (typeof Paho === 'undefined' || !Paho.MQTT) {
        console.warn('Paho MQTT not available');
        return;
      }

      const host = brokerHosts[hostIdx];
      const clientId = 'zsirafrem_' + roomCode + '_' + Math.random().toString(16).substr(2, 6);

      try {
        mqttClient = new Paho.MQTT.Client(host, 8884, '/mqtt', clientId);

        mqttClient.onMessageArrived = (m) => {
          try {
            const state = JSON.parse(m.payloadString);
            if (state && state.type === 'state') {
              updateDisplay(state);
              setStatus(true, 'TV Csatlakoztatva');
            }
          } catch (e) {}
        };

        mqttClient.onConnectionLost = (res) => {
          console.warn('Remote MQTT connection lost:', res.errorMessage);
          hostIdx = (hostIdx + 1) % brokerHosts.length;
          setTimeout(tryMqtt, 2000);
        };

        mqttClient.connect({
          useSSL: true,
          timeout: 5,
          keepAliveInterval: 30,
          onSuccess: () => {
            console.log('[Remote v3.9] Connected to MQTT broker:', host);
            setStatus(true, 'TV Csatlakoztatva');
            mqttClient.subscribe('zsirafvision/' + roomCode + '/state');
            // Request current state from TV
            sendCommand('requestState');
          },
          onFailure: (err) => {
            console.warn('[Remote] MQTT connect failed on', host, err);
            hostIdx = (hostIdx + 1) % brokerHosts.length;
            setTimeout(tryMqtt, 2500);
          }
        });
      } catch (err) {
        console.error('MQTT Remote init error:', err);
      }
    }

    tryMqtt();

    // ==========================================
    // 2. PeerJS Direct WebRTC P2P (Parallel)
    // ==========================================
    if (peer) {
      try { peer.destroy(); } catch (e) {}
      peer = null;
    }

    if (typeof Peer !== 'undefined') {
      try {
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
          console.log('[Remote v3.9] Peer ready with ID:', id);
          const tvPeerId = 'zsiraf-tv-' + roomCode;
          conn = peer.connect(tvPeerId, { reliable: true });

          conn.on('open', () => {
            console.log('[Remote v3.9] WebRTC Connected to TV:', tvPeerId);
            setStatus(true, 'TV Csatlakoztatva');
            sendCommand('requestState');
          });

          conn.on('data', (msg) => {
            if (msg && msg.type === 'state') {
              updateDisplay(msg);
              setStatus(true, 'TV Csatlakoztatva');
            }
          });

          conn.on('close', () => {
            console.warn('[Remote] WebRTC Connection closed');
          });

          conn.on('error', (err) => {
            console.error('[Remote] WebRTC Conn error:', err);
          });
        });

        peer.on('error', (err) => {
          console.warn('[Remote] Peer error:', err);
        });
      } catch (e) {}
    }
  }

  function updateDisplay(state) {
    if (state.channelName) dispChName.textContent = state.channelName;
    if (state.channelNumber) dispChNum.textContent = `CH ${state.channelNumber}`;
    if (state.group) dispChGroup.textContent = state.group;
    if (state.volume !== undefined) {
      const volVal = state.volume > 1 ? Math.round(state.volume) : Math.round(state.volume * 100);
      dispVol.textContent = state.isMuted ? 'NÉMÍTVA' : `VOL ${volVal}%`;
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
