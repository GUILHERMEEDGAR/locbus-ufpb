/**
 * crowdsource.js - Módulo de Telemetria Colaborativa e Comunicação em Tempo Real via Server-Sent Events (SSE).
 * Substitui o polling por streaming de eventos contínuo com baixa latência e consumo otimizado.
 */

let watchId = null;
let lastSendTimestamp = 0;
const THROTTLE_INTERVAL_MS = 10000; // Envia no máximo a cada 10s para poupar bateria e dados móveis

// Elementos DOM de Ação Colaborativa
const btnToggleCollab = document.getElementById('btn-toggle-collab');
const btnStopCollab = document.getElementById('btn-stop-collab');
const lgpdModal = document.getElementById('lgpd-modal');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalConfirm = document.getElementById('btn-modal-confirm');

const collabCard = document.getElementById('collab-card');
const collabActiveBar = document.getElementById('collab-active-bar');
const metricAcc = document.getElementById('metric-acc');
const metricSpeed = document.getElementById('metric-speed');

// Elementos DOM de Status
const routeOrigem = document.getElementById('route-origem');
const routeDestino = document.getElementById('route-destino');
const etaValue = document.getElementById('eta-value');
const locationValue = document.getElementById('location-value');
const lastUpdate = document.getElementById('last-update');
const sourceText = document.getElementById('source-text');

// Elementos do Badge SSE
const sseBadge = document.getElementById('sse-badge');
const sseStatusLabel = document.getElementById('sse-status-label');

// 1. Gerenciamento do Modal de Consentimento (LGPD)
if (btnToggleCollab) {
  btnToggleCollab.addEventListener('click', () => {
    if (watchId !== null) {
      stopCrowdsourcing();
    } else {
      lgpdModal.style.display = 'flex';
    }
  });
}

if (btnModalCancel) {
  btnModalCancel.addEventListener('click', () => {
    lgpdModal.style.display = 'none';
  });
}

if (btnModalConfirm) {
  btnModalConfirm.addEventListener('click', () => {
    lgpdModal.style.display = 'none';
    startCrowdsourcing();
  });
}

if (btnStopCollab) {
  btnStopCollab.addEventListener('click', stopCrowdsourcing);
}

// 2. Início do Rastreamento do Passageiro
function startCrowdsourcing() {
  if (!('geolocation' in navigator)) {
    alert('Seu dispositivo ou navegador não suporta geolocalização por GPS.');
    return;
  }

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 0
  };

  watchId = navigator.geolocation.watchPosition(
    onGeoSuccess,
    onGeoError,
    geoOptions
  );

  collabCard.style.display = 'none';
  collabActiveBar.style.display = 'flex';
}

// 3. Callback de Sucesso do GPS
function onGeoSuccess(position) {
  const coords = position.coords;
  const now = Date.now();

  // Atualiza métricas na barra ativa do usuário
  if (metricAcc) metricAcc.textContent = `Acurácia: ± ${Math.round(coords.accuracy)}m`;
  if (metricSpeed) {
    const speedKmh = coords.speed ? Math.round(coords.speed * 3.6) : 0;
    metricSpeed.textContent = `Velocidade: ${speedKmh} km/h`;
  }

  // Throttling: transmite no máximo a cada 10s para não saturar bateria nem conexão
  if (now - lastSendTimestamp < THROTTLE_INTERVAL_MS) {
    return;
  }
  lastSendTimestamp = now;

  const payload = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy,
    speed: coords.speed ? coords.speed * 3.6 : null,
    heading: coords.heading || null,
    client_timestamp: new Date().toISOString()
  };

  // Envia via API assíncrona — o servidor automaticamente faz broadcast via SSE
  fetch('/api/v1/telemetry/collaborative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (typeof updateBusMarker === 'function') {
      updateBusMarker(coords.latitude, coords.longitude, coords.accuracy, true);
    }
  })
  .catch(err => {
    console.warn('Erro ao transmitir telemetria colaborativa:', err);
  });
}

// 4. Callback de Erro do GPS
function onGeoError(error) {
  console.warn('Erro de Geolocalização:', error);
  let msg = 'Erro ao obter sinal GPS.';
  if (error.code === 1) msg = 'Permissão de localização negada pelo usuário.';
  else if (error.code === 2) msg = 'Sinal de GPS indisponível no momento.';
  else if (error.code === 3) msg = 'Tempo limite esgotado para obter coordenadas.';

  alert(msg);
  stopCrowdsourcing();
}

// 5. Encerramento do Rastreamento
function stopCrowdsourcing() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  collabCard.style.display = 'flex';
  collabActiveBar.style.display = 'none';
}

// Elementos da Barra de Progresso e Alerta
const nextStopName = document.getElementById('next-stop-name');
const progressPct = document.getElementById('progress-pct');
const progressBarFill = document.getElementById('progress-bar-fill');
const btnProximityAlert = document.getElementById('btn-proximity-alert');
const alertLabel = document.getElementById('alert-label');

let proximityAlertEnabled = false;
let proximityAlertTriggered = false;

// Sistema de Som Web Audio API (Chime de Notificação sem arquivos externos)
function playArrivalChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880.00, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440.00, now);
    osc2.frequency.setValueAtTime(659.25, now + 0.15);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  } catch (err) {
    console.debug('Áudio indisponível:', err);
  }
}

// Configuração do Botão de Alerta de Proximidade
if (btnProximityAlert) {
  btnProximityAlert.addEventListener('click', () => {
    proximityAlertEnabled = !proximityAlertEnabled;
    proximityAlertTriggered = false;

    if (proximityAlertEnabled) {
      btnProximityAlert.classList.add('alert-active');
      if (alertLabel) alertLabel.textContent = 'Alerta Ativo: Avisará quando < 5 min';

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else {
      btnProximityAlert.classList.remove('alert-active', 'alert-triggered');
      if (alertLabel) alertLabel.textContent = 'Avisar quando estiver perto (< 5 min)';
    }
  });
}

// 6. Atualização Centralizada da Interface (UI)
function applyStatusToUI(status) {
  if (!status) return;

  if (routeOrigem && status.origem) routeOrigem.textContent = status.origem;
  if (routeDestino && status.destino) routeDestino.textContent = status.destino;
  if (etaValue && status.eta_minutos) etaValue.textContent = status.eta_minutos;
  if (locationValue && status.centro_atual) locationValue.textContent = status.centro_atual;
  if (lastUpdate && status.ultima_atualizacao) lastUpdate.textContent = `Última leitura: ${status.ultima_atualizacao}`;
  if (sourceText && status.confiabilidade) sourceText.textContent = status.confiabilidade;

  // Atualiza Próxima Parada e Barra de Progresso
  if (nextStopName && status.proxima_parada) nextStopName.textContent = status.proxima_parada;
  if (status.progresso_percentual !== undefined && status.progresso_percentual !== null) {
    if (progressPct) progressPct.textContent = `${status.progresso_percentual}% da rota`;
    if (progressBarFill) progressBarFill.style.width = `${status.progresso_percentual}%`;
  }

  // Verifica Alerta de Proximidade (< 5 minutos)
  if (proximityAlertEnabled && !proximityAlertTriggered && status.eta_minutos) {
    const etaMatch = status.eta_minutos.match(/(\d+)\s*min/);
    if (etaMatch) {
      const minutes = parseInt(etaMatch[1], 10);
      if (minutes <= 5) {
        proximityAlertTriggered = true;
        playArrivalChime();
        if (btnProximityAlert) btnProximityAlert.classList.add('alert-triggered');
        if (alertLabel) alertLabel.textContent = `🚌 Ônibus próximo (${status.eta_minutos})!`;

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('LocBUS se aproximando!', {
            body: `O circular está a cerca de ${status.eta_minutos}. Próxima parada: ${status.proxima_parada || 'seu ponto'}.`,
            icon: '/static/icons/icon-192.png'
          });
        }
      }
    }
  }

  // Atualiza marcador geoespacial no mapa Leaflet
  if (status.detalhes_colaboracao && status.detalhes_colaboracao.active) {
    const c = status.detalhes_colaboracao;
    if (typeof updateBusMarker === 'function') {
      updateBusMarker(c.latitude, c.longitude, c.accuracy, true);
    }
  }
}

// 7. Motor de Comunicação em Tempo Real (Server-Sent Events - SSE)
let sseSource = null;
let fallbackPollInterval = null;

function setSSEBadgeState(state, labelText) {
  if (!sseBadge || !sseStatusLabel) return;
  sseBadge.classList.remove('connected', 'reconnecting');
  sseBadge.classList.add(state);
  sseStatusLabel.textContent = labelText;
}

function initSSE() {
  if (!('EventSource' in window)) {
    console.warn('Navegador sem suporte nativo a EventSource. Ativando polling de fallback.');
    setSSEBadgeState('reconnecting', 'Modo Polling');
    startFallbackPolling();
    return;
  }

  try {
    if (sseSource) {
      sseSource.close();
    }

    setSSEBadgeState('reconnecting', 'Conectando...');
    sseSource = new EventSource('/api/v1/events');

    sseSource.onopen = function() {
      setSSEBadgeState('connected', 'SSE Tempo Real');
      stopFallbackPolling();
    };

    sseSource.addEventListener('status', function(event) {
      try {
        const status = JSON.parse(event.data);
        applyStatusToUI(status);
      } catch (err) {
        console.error('Erro ao decodificar evento SSE status:', err);
      }
    });

    sseSource.onerror = function() {
      setSSEBadgeState('reconnecting', 'Reconectando...');
      // Caso a conexão SSE caia por mais de 6 segundos, aciona polling de segurança
      if (!fallbackPollInterval) {
        setTimeout(() => {
          if (sseSource && sseSource.readyState !== EventSource.OPEN) {
            startFallbackPolling();
          }
        }, 6000);
      }
    };
  } catch (err) {
    console.error('Falha ao instanciar EventSource:', err);
    startFallbackPolling();
  }
}

function pollSystemStatus() {
  fetch('/api/v1/status')
    .then(res => res.json())
    .then(status => applyStatusToUI(status))
    .catch(err => console.debug('Aguardando servidor...', err));
}

function startFallbackPolling() {
  if (fallbackPollInterval) return;
  fallbackPollInterval = setInterval(pollSystemStatus, 5000);
  pollSystemStatus();
}

function stopFallbackPolling() {
  if (fallbackPollInterval) {
    clearInterval(fallbackPollInterval);
    fallbackPollInterval = null;
  }
}

// Inicializa a conexão SSE assim que a página é carregada
document.addEventListener('DOMContentLoaded', initSSE);
