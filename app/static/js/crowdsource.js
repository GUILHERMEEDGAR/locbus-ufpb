/**
 * crowdsource.js - Módulo de Telemetria Colaborativa e Comunicação em Tempo Real via Server-Sent Events (SSE).
 * Substitui o polling por streaming de eventos contínuo com baixa latência e consumo otimizado.
 */

let watchId = null;
let lastSendTimestamp = 0;
const THROTTLE_INTERVAL_MS = 4000; // Intervalo de 4s (Δt = 4s conforme especificação do artigo IEEE e ensaio de campo)
let collaborativePointsSent = 0;
let isRetryingLowAccuracy = false;

// Elementos DOM de Ação Colaborativa
const btnToggleCollab = document.getElementById('btn-toggle-collab');
const btnStopCollab = document.getElementById('btn-stop-collab');
const btnFloatingShare = document.getElementById('btn-floating-share');
const floatingShareLabel = document.getElementById('floating-share-label');
const lgpdModal = document.getElementById('lgpd-modal');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalConfirm = document.getElementById('btn-modal-confirm');

const collabCard = document.getElementById('collab-card');
const collabActiveBar = document.getElementById('collab-active-bar');
const metricAcc = document.getElementById('metric-acc');
const metricSpeed = document.getElementById('metric-speed');

// Elementos DOM do Banner de Feedback
const collabFeedbackBanner = document.getElementById('collab-feedback-banner');
const feedbackText = document.getElementById('feedback-text');
const feedbackIcon = document.getElementById('feedback-icon');
const btnDismissFeedback = document.getElementById('btn-dismiss-feedback');
let feedbackTimeout = null;

function showCollabFeedback(msg, isError = true) {
  if (!collabFeedbackBanner || !feedbackText) return;
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  feedbackText.textContent = msg;
  if (feedbackIcon) feedbackIcon.textContent = isError ? '⚠️' : 'ℹ️';
  if (isError) {
    collabFeedbackBanner.classList.add('is-error');
  } else {
    collabFeedbackBanner.classList.remove('is-error');
  }
  collabFeedbackBanner.style.display = 'flex';
  feedbackTimeout = setTimeout(() => {
    if (collabFeedbackBanner) collabFeedbackBanner.style.display = 'none';
  }, 8000);
}

if (btnDismissFeedback) {
  btnDismissFeedback.addEventListener('click', () => {
    if (collabFeedbackBanner) collabFeedbackBanner.style.display = 'none';
  });
}

// Elementos DOM de Status
const routeOrigem = document.getElementById('route-origem');
const routeDestino = document.getElementById('route-destino');
const etaValue = document.getElementById('eta-value');
const locationValue = document.getElementById('location-value');
const lastUpdate = document.getElementById('last-update');
const sourceText = document.getElementById('source-text');

// Elementos do Badge SSE e Trânsito
const sseBadge = document.getElementById('sse-badge');
const sseStatusLabel = document.getElementById('sse-status-label');
const trackingModeBadge = document.getElementById('tracking-mode-badge');

// Elementos da Timeline de Paradas
const btnToggleTimeline = document.getElementById('btn-toggle-timeline');
const stopsTimelineTrack = document.getElementById('stops-timeline-track');
const timelineToggleText = document.getElementById('timeline-toggle-text');

if (btnToggleTimeline && stopsTimelineTrack) {
  btnToggleTimeline.addEventListener('click', () => {
    const isCollapsed = stopsTimelineTrack.classList.toggle('collapsed');
    btnToggleTimeline.setAttribute('aria-expanded', !isCollapsed);
    if (timelineToggleText) {
      timelineToggleText.textContent = isCollapsed ? 'Expandir' : 'Recolher';
    }
    const arrow = btnToggleTimeline.querySelector('.timeline-arrow-icon');
    if (arrow) arrow.textContent = isCollapsed ? '▸' : '▾';
  });
}

// 1. Gerenciamento do Modal de Consentimento (LGPD)
function triggerCollabModal() {
  if (watchId !== null) {
    stopCrowdsourcing();
  } else {
    if (lgpdModal) lgpdModal.style.display = 'flex';
  }
}

if (btnToggleCollab) {
  btnToggleCollab.addEventListener('click', triggerCollabModal);
}

if (btnFloatingShare) {
  btnFloatingShare.addEventListener('click', triggerCollabModal);
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
  // Se estiver rodando dentro do App Android Nativo, aciona o Foreground Service de segundo plano
  if (window.AndroidBridge && typeof window.AndroidBridge.startBackgroundTracking === 'function') {
    window.AndroidBridge.startBackgroundTracking();
  }

  // Registra callback para atualizações vindas do serviço nativo em segundo plano
  window.onNativeLocationUpdate = function(lat, lng, acc, speedKmh, heading, count) {
    collaborativePointsSent = count;
    const accRound = Math.round(acc);
    let accQuality = 'Regular';
    if (accRound <= 10) accQuality = 'Excelente';
    else if (accRound <= 25) accQuality = 'Boa';

    if (metricAcc) {
      metricAcc.textContent = `Acurácia: ±${accRound}m • Ponto #${count} (2º Plano Ativo)`;
    }
    if (metricSpeed) {
      metricSpeed.textContent = `Velocidade: ${Math.round(speedKmh)} km/h`;
    }
    if (typeof updateBusMarker === 'function') {
      updateBusMarker(lat, lng, acc, true);
    }
  };

  if (!('geolocation' in navigator)) {
    showCollabFeedback('Seu dispositivo ou navegador não suporta geolocalização por GPS.', true);
    return;
  }

  // Reseta variáveis para envio imediato no primeiro ponto
  lastSendTimestamp = 0;
  collaborativePointsSent = 0;
  isRetryingLowAccuracy = false;

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
  if (collabFeedbackBanner) collabFeedbackBanner.style.display = 'none';

  if (btnFloatingShare) {
    btnFloatingShare.classList.add('is-transmitting');
    if (floatingShareLabel) floatingShareLabel.textContent = 'Transmitindo';
  }
}

// 3. Callback de Sucesso do GPS
function onGeoSuccess(position) {
  const coords = position.coords;
  const now = Date.now();
  isRetryingLowAccuracy = false;

  // Atualiza métricas na barra ativa do usuário com classificação de acurácia
  const acc = Math.round(coords.accuracy);
  let accQuality = 'Regular';
  if (acc <= 10) accQuality = 'Excelente';
  else if (acc <= 25) accQuality = 'Boa';

  if (metricAcc) {
    metricAcc.textContent = `Acurácia: ±${acc}m (${accQuality})`;
  }
  if (metricSpeed) {
    const speedKmh = coords.speed ? Math.round(coords.speed * 3.6) : 0;
    metricSpeed.textContent = `Velocidade: ${speedKmh} km/h`;
  }

  // Se o rastreamento nativo em segundo plano estiver ativo, o próprio serviço Android já faz o POST
  if (window.AndroidBridge && typeof window.AndroidBridge.isBackgroundTrackingActive === 'function' && window.AndroidBridge.isBackgroundTrackingActive()) {
    return;
  }

  // Envio imediato no primeiro sinal (lastSendTimestamp === 0) ou se atingiu o throttling (4s)
  if (lastSendTimestamp !== 0 && (now - lastSendTimestamp < THROTTLE_INTERVAL_MS)) {
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

  // Envia via API assíncrona — o servidor valida geofencing de 200m e faz broadcast via SSE
  fetch('/api/v1/telemetry/collaborative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(async res => {
    if (res.ok) {
      collaborativePointsSent++;
      if (metricAcc) {
        metricAcc.textContent = `Acurácia: ±${acc}m • Ponto #${collaborativePointsSent}`;
      }
      if (typeof updateBusMarker === 'function') {
        updateBusMarker(coords.latitude, coords.longitude, coords.accuracy, true);
      }
    } else if (res.status === 422) {
      // Coordenada fora do geofence ou velocidade acima do limite
      const errData = await res.json().catch(() => ({}));
      const detail = errData.detail || 'Ponto fora da rota homologada.';
      console.warn('[LocBUS Transmissão 422]', detail);
      showCollabFeedback(`Aviso de Rota: ${detail}`, true);
    } else {
      showCollabFeedback(`Falha ao registrar ponto: HTTP ${res.status}`, true);
    }
  })
  .catch(err => {
    console.warn('Erro ao transmitir telemetria colaborativa:', err);
  });
}

// 4. Callback de Erro do GPS com Fallback Inteligente
function onGeoError(error) {
  console.warn('Erro de Geolocalização:', error);

  // Se timeout de satélite e ainda não tentou fallback, chaveia para localização por rede/Wi-Fi
  if ((error.code === 3 || error.code === 2) && !isRetryingLowAccuracy) {
    isRetryingLowAccuracy = true;
    showCollabFeedback('Sinal de satélite demorou. Ativando localização assistida por rede...', false);

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    const fallbackOptions = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000
    };

    watchId = navigator.geolocation.watchPosition(
      onGeoSuccess,
      onGeoFinalError,
      fallbackOptions
    );
    return;
  }

  onGeoFinalError(error);
}

function onGeoFinalError(error) {
  isRetryingLowAccuracy = false;
  let msg = 'Erro ao obter sinal GPS.';

  if (error.code === 1) {
    msg = 'Permissão de localização negada.';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!window.isSecureContext && !isLocal) {
      msg += ' Navegadores móveis exigem HTTPS para geolocalização. Teste via localhost ou ative o bypass no chrome://flags.';
    } else {
      msg += ' Ative a permissão de localização nas configurações do site para colaborar.';
    }
  } else if (error.code === 2) {
    msg = 'Sinal de GPS indisponível no momento. Verifique se o GPS do aparelho está ligado.';
  } else if (error.code === 3) {
    msg = 'Tempo limite esgotado para obter coordenadas de GPS.';
  }

  showCollabFeedback(msg, true);
  stopCrowdsourcing();
}

// 5. Encerramento do Rastreamento
function stopCrowdsourcing() {
  if (window.AndroidBridge && typeof window.AndroidBridge.stopBackgroundTracking === 'function') {
    window.AndroidBridge.stopBackgroundTracking();
  }
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  isRetryingLowAccuracy = false;
  lastSendTimestamp = 0;
  collabCard.style.display = 'flex';
  collabActiveBar.style.display = 'none';

  if (btnFloatingShare) {
    btnFloatingShare.classList.remove('is-transmitting');
    if (floatingShareLabel) floatingShareLabel.textContent = 'Transmitir GPS';
  }
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

// Atualiza a Timeline das Paradas da Linha (estilo Cittamobi / Citymapper)
function updateStopsTimeline(nextStop, progressPct, destino) {
  const nodes = document.querySelectorAll('.stop-node');
  if (!nodes || nodes.length === 0) return;

  let activeIndex = -1;
  const cleanNext = (nextStop || '').toLowerCase();

  nodes.forEach((node, index) => {
    const stopKey = (node.getAttribute('data-stop') || '').toLowerCase();
    if (cleanNext && (cleanNext.includes(stopKey) || stopKey.includes(cleanNext))) {
      activeIndex = index;
    }
  });

  // Se não localizou pelo texto da parada, aproxima pela porcentagem de progresso (0% a 100%)
  if (activeIndex === -1 && progressPct !== undefined && progressPct !== null) {
    activeIndex = Math.min(nodes.length - 1, Math.floor((progressPct / 100) * nodes.length));
  }

  nodes.forEach((node, index) => {
    node.classList.remove('passed', 'active', 'upcoming');
    if (index < activeIndex) {
      node.classList.add('passed');
    } else if (index === activeIndex) {
      node.classList.add('active');
    } else {
      node.classList.add('upcoming');
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

  // Atualiza Badge do Modo de Rastreamento (estilo Transit)
  if (trackingModeBadge && status.modo_rastreamento) {
    trackingModeBadge.className = 'tracking-mode-badge';
    if (status.modo_rastreamento === 'BLE_FIXO') {
      trackingModeBadge.textContent = 'BLE Fixo';
      trackingModeBadge.classList.add('mode-ble');
    } else if (status.modo_rastreamento === 'COLABORATIVO_PASSAGEIRO') {
      trackingModeBadge.textContent = 'Colaborativo (GPS)';
      trackingModeBadge.classList.add('mode-collab');
    } else {
      trackingModeBadge.textContent = 'Estimado';
      trackingModeBadge.classList.add('mode-estimated');
    }
  }

  // Atualiza Próxima Parada e Barra de Progresso
  if (nextStopName && status.proxima_parada) nextStopName.textContent = status.proxima_parada;
  if (status.progresso_percentual !== undefined && status.progresso_percentual !== null) {
    if (progressPct) progressPct.textContent = `${status.progresso_percentual}% da rota`;
    if (progressBarFill) progressBarFill.style.width = `${status.progresso_percentual}%`;
  }

  // Atualiza nós da Timeline de Paradas
  updateStopsTimeline(status.proxima_parada, status.progresso_percentual, status.destino);

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
    console.log(`[LocBUS Realtime] Ônibus ativo em: ${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)} (há ${c.age_seconds || 0}s)`);
  }
}

// 7. Motor de Comunicação em Tempo Real (SSE + Watchdog Híbrido Resiliente)
let sseSource = null;
let watchdogInterval = null;
let lastStatusReceivedTimestamp = Date.now();

function setSSEBadgeState(state, labelText) {
  if (!sseBadge || !sseStatusLabel) return;
  sseBadge.classList.remove('connected', 'reconnecting');
  sseBadge.classList.add(state);
  sseStatusLabel.textContent = labelText;
}

function pollSystemStatus() {
  fetch('/api/v1/status')
    .then(res => res.json())
    .then(status => {
      lastStatusReceivedTimestamp = Date.now();
      applyStatusToUI(status);
    })
    .catch(err => console.debug('Aguardando servidor...', err));
}

function startWatchdog() {
  if (watchdogInterval) return;
  // Se o SSE ficar sem entregar atualização por mais de 3.5 segundos, faz poll de contingência
  watchdogInterval = setInterval(() => {
    if (Date.now() - lastStatusReceivedTimestamp > 3500) {
      pollSystemStatus();
    }
  }, 3000);
}

function initSSE() {
  // Dispara primeira leitura imediatamente para carregar dados
  pollSystemStatus();
  startWatchdog();

  if (!('EventSource' in window)) {
    console.warn('Navegador sem suporte nativo a EventSource. Modo Polling contínuo ativo.');
    setSSEBadgeState('reconnecting', 'Modo Polling');
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
    };

    sseSource.addEventListener('status', function(event) {
      try {
        lastStatusReceivedTimestamp = Date.now();
        const status = JSON.parse(event.data);
        applyStatusToUI(status);
      } catch (err) {
        console.error('Erro ao decodificar evento SSE status:', err);
      }
    });

    // 8. Listener para Confirmações Colaborativas de Parada em Tempo Real
    sseSource.addEventListener('stop_report', function(event) {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.report) {
          handleIncomingStopReport(payload.report);
        }
      } catch (err) {
        console.error('Erro ao processar stop_report SSE:', err);
      }
    });

    sseSource.onerror = function() {
      setSSEBadgeState('reconnecting', 'Reconectando...');
      // Watchdog já garante polling de contingência a cada 3s automaticamente
    };
  } catch (err) {
    console.error('Falha ao instanciar EventSource:', err);
  }
}

// ==========================================================================
// 9. GERENCIAMENTO DE SELEÇÃO DE PARADA E CONFIRMAÇÃO DE CHEGADA
// ==========================================================================
const userStopSelect = document.getElementById('user-stop-select');
const userStopActionBox = document.getElementById('user-stop-action-box');
const userStopCard = document.getElementById('user-stop-card');
const btnAutoDetectStop = document.getElementById('btn-auto-detect-stop');
const stopStatusBanner = document.getElementById('stop-status-banner');
const stopStatusText = document.getElementById('stop-status-text');
const stopStatusIcon = document.getElementById('stop-status-icon');
const stopFeedbackMsg = document.getElementById('stop-feedback-msg');

const btnReportArrived = document.getElementById('btn-report-arrived');
const btnReportWaiting = document.getElementById('btn-report-waiting');
const btnReportDeparted = document.getElementById('btn-report-departed');

function showStopFeedback(text, type = 'success') {
  if (!stopFeedbackMsg) return;
  stopFeedbackMsg.textContent = text;
  stopFeedbackMsg.className = `stop-feedback-msg ${type}`;
  stopFeedbackMsg.style.display = 'block';
  setTimeout(() => {
    if (stopFeedbackMsg) stopFeedbackMsg.style.display = 'none';
  }, 6000);
}

function handleIncomingStopReport(report) {
  if (!report) return;

  // Se o ônibus chegou, aciona o badge animado no mapa
  if (report.status === 'chegou' && typeof window.markStopArrival === 'function') {
    window.markStopArrival(report.stop_id);
  }

  // Se a parada relatada for a mesma que o usuário está olhando, atualiza o banner
  if (userStopSelect && String(userStopSelect.value) === String(report.stop_id)) {
    updateStopStatusBanner(report);
  }
}

function updateStopStatusBanner(report) {
  if (!stopStatusText || !stopStatusIcon) return;
  if (!report) {
    stopStatusIcon.textContent = '📢';
    stopStatusText.textContent = 'Sem relatos recentes nesta parada. Seja o primeiro a avisar!';
    return;
  }

  if (report.status === 'chegou') {
    stopStatusIcon.textContent = '🚌';
    stopStatusText.innerHTML = `<strong>Ônibus no ponto!</strong> Confirmado por passageiro local (${report.human_time}).`;
  } else if (report.status === 'nao_chegou') {
    stopStatusIcon.textContent = '⏳';
    stopStatusText.innerHTML = `<strong>Em espera:</strong> Passageiro aguardando nesta parada (${report.human_time}).`;
  } else if (report.status === 'partiu') {
    stopStatusIcon.textContent = '💨';
    stopStatusText.innerHTML = `<strong>Ônibus partiu:</strong> Partida recente confirmada (${report.human_time}).`;
  }
}

function fetchStopReports(stopId) {
  fetch('/api/v1/stops/reports')
    .then(r => r.json())
    .then(data => {
      const reports = data.reports || {};
      const stopReport = reports[stopId];
      updateStopStatusBanner(stopReport);
    })
    .catch(err => console.debug('Aviso ao carregar relatos da parada:', err));
}

function sendStopReport(status) {
  if (!userStopSelect || !userStopSelect.value) {
    showStopFeedback('Selecione primeiro a sua parada!', 'info');
    return;
  }

  const selectedOpt = userStopSelect.selectedOptions[0];
  const stopId = parseInt(userStopSelect.value, 10);
  const stopName = selectedOpt.dataset.name || selectedOpt.textContent;
  const lat = selectedOpt.dataset.lat ? parseFloat(selectedOpt.dataset.lat) : null;
  const lon = selectedOpt.dataset.lon ? parseFloat(selectedOpt.dataset.lon) : null;

  const payload = {
    stop_id: stopId,
    stop_name: stopName,
    status: status,
    latitude: lat,
    longitude: lon
  };

  fetch('/api/v1/stops/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(data => {
      if (status === 'chegou') {
        showStopFeedback(`🎉 Confirmado! Você avisou que o circular chegou em ${stopName}.`, 'success');
        if (typeof window.markStopArrival === 'function') {
          window.markStopArrival(stopId);
        }
      } else if (status === 'nao_chegou') {
        showStopFeedback(`⏳ Registrado! Você está aguardando em ${stopName}.`, 'info');
      } else if (status === 'partiu') {
        showStopFeedback(`💨 Registrado! Você avisou que o ônibus partiu de ${stopName}.`, 'info');
      }

      if (data.summary) {
        updateStopStatusBanner(data.summary);
      }
    })
    .catch(err => {
      console.error('Erro ao enviar relato:', err);
      showStopFeedback('Falha de rede ao registrar relato.', 'info');
    });
}

function initUserStopCard() {
  if (!userStopSelect) return;

  // Mudança de Parada
  userStopSelect.addEventListener('change', () => {
    const stopId = userStopSelect.value;
    if (!stopId) {
      if (userStopActionBox) userStopActionBox.style.display = 'none';
      if (userStopCard) userStopCard.classList.remove('has-selected-stop');
      return;
    }

    if (userStopActionBox) userStopActionBox.style.display = 'flex';
    if (userStopCard) userStopCard.classList.add('has-selected-stop');

    // Centraliza no mapa se a função estiver disponível
    if (typeof window.selectUserStop === 'function') {
      window.selectUserStop(stopId);
    }

    fetchStopReports(stopId);
  });

  // Botões de Confirmação
  if (btnReportArrived) {
    btnReportArrived.addEventListener('click', () => sendStopReport('chegou'));
  }
  if (btnReportWaiting) {
    btnReportWaiting.addEventListener('click', () => sendStopReport('nao_chegou'));
  }
  if (btnReportDeparted) {
    btnReportDeparted.addEventListener('click', () => sendStopReport('partiu'));
  }

  // Detecção Automática da Parada Mais Próxima (GPS)
  if (btnAutoDetectStop && 'geolocation' in navigator) {
    btnAutoDetectStop.addEventListener('click', () => {
      btnAutoDetectStop.disabled = true;
      btnAutoDetectStop.textContent = 'Buscando GPS...';

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          btnAutoDetectStop.disabled = false;
          btnAutoDetectStop.textContent = '📍 Perto de mim';

          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;

          let bestDist = Infinity;
          let bestOption = null;

          const options = Array.from(userStopSelect.options).filter(o => o.value && o.dataset.lat);
          options.forEach(opt => {
            const sLat = parseFloat(opt.dataset.lat);
            const sLon = parseFloat(opt.dataset.lon);
            const d = Math.hypot(userLat - sLat, userLon - sLon);
            if (d < bestDist) {
              bestDist = d;
              bestOption = opt;
            }
          });

          if (bestOption) {
            userStopSelect.value = bestOption.value;
            userStopSelect.dispatchEvent(new Event('change'));
            showStopFeedback(`📍 Parada mais próxima detectada: ${bestOption.dataset.name}!`, 'success');
          }
        },
        (err) => {
          btnAutoDetectStop.disabled = false;
          btnAutoDetectStop.textContent = '📍 Perto de mim';
          showStopFeedback('Não foi possível obter sinal de GPS para detectar a parada.', 'info');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  // Restaura parada salva no localStorage
  try {
    const saved = localStorage.getItem('locbus_waiting_stop_id');
    if (saved && userStopSelect.querySelector(`option[value="${saved}"]`)) {
      userStopSelect.value = saved;
      userStopSelect.dispatchEvent(new Event('change'));
    }
  } catch (e) {}
}

// Inicializa a comunicação e os componentes assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  initSSE();
  initUserStopCard();
});

