/**
 * app.js - Lógica de Rastreamento GPS e Visualização para Pedras de Fogo
 */

// Estado da aplicação
let watchId = null;
let map = null;
let userMarker = null;
let accuracyCircle = null;
let trailPolyline = null;
let trailCoords = [];
let lastSentTime = 0;
const SEND_INTERVAL_MS = 4000; // Envia a cada 4 segundos no máximo

// Simulação local em Pedras de Fogo
let simTimer = null;
let simIndex = 0;
// Rota de teste pelas vias centrais de Pedras de Fogo
const PEDRAS_DE_FOGO_ROUTE = [
  { lat: -7.40210, lon: -35.11640, name: "Praça Central (Igreja Matriz)" },
  { lat: -7.40285, lon: -35.11620, name: "Rua Dr. Fernando Pessoa" },
  { lat: -7.40350, lon: -35.11580, name: "Av. Getúlio Vargas (Comércio)" },
  { lat: -7.40420, lon: -35.11520, name: "Cruzamento Mercado Público" },
  { lat: -7.40500, lon: -35.11470, name: "Saída para Rodovia PB-030" },
  { lat: -7.40410, lon: -35.11400, name: "Retorno Divisa PB/PE (Itambé)" },
  { lat: -7.40310, lon: -35.11480, name: "Rua do Rosário" },
  { lat: -7.40210, lon: -35.11640, name: "Retorno Praça Central" }
];

// Elementos DOM
const btnStartGPS = document.getElementById('btn-start-gps');
const btnStopGPS = document.getElementById('btn-stop-gps');
const btnSimulate = document.getElementById('btn-simulate');
const btnClearTrail = document.getElementById('btn-clear-trail');
const gpsStatusBadge = document.getElementById('gps-status-badge');
const sseStatusBadge = document.getElementById('sse-status-badge');

const valLat = document.getElementById('val-lat');
const valLon = document.getElementById('val-lon');
const valAcc = document.getElementById('val-acc');
const valSpeed = document.getElementById('val-speed');
const valHeading = document.getElementById('val-heading');
const valDistance = document.getElementById('val-distance');
const valPointsSent = document.getElementById('val-points-sent');
const valQualityPill = document.getElementById('val-quality-pill');
const logContainer = document.getElementById('log-container');

const subLat = document.getElementById('sub-lat');
const subLon = document.getElementById('sub-lon');
const gpsSearchingBanner = document.getElementById('gps-searching-banner');
const gpsSearchingText = document.getElementById('gps-searching-text');

let pointsSentCount = 0;

// Inicialização do Mapa Leaflet
function initMap() {
  const initialLat = -7.4021;
  const initialLon = -35.1164;

  map = L.map('map', {
    zoomControl: true,
    attributionControl: false
  }).setView([initialLat, initialLon], 16);

  // Camadas de Mapa 100% gratuitas e sem necessidade de API Key
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
  });

  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank">Esri</a>'
  });

  // Ativa OpenStreetMap como padrão
  osmLayer.addTo(map);

  // Controle de alternância entre Ruas e Satélite
  const baseLayers = {
    "🗺️ Ruas Detalhadas": osmLayer,
    "🛰️ Satélite HD": satelliteLayer
  };
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

  // Marcador de Referência: Marco Zero de Pedras de Fogo
  const refMarker = L.marker([initialLat, initialLon]).addTo(map);
  refMarker.bindPopup("<b>Pedras de Fogo - PB</b><br>Ponto central de referência");

  // Polyline para o rastro do usuário
  trailPolyline = L.polyline([], {
    color: '#0284c7',
    weight: 4,
    opacity: 0.8,
    dashArray: '6, 8'
  }).addTo(map);

  // Permite clicar diretamente em qualquer ponto do mapa para enviar localização instantânea
  map.on('click', (e) => {
    handleMapClick(e);
  });

  // Garante que o mapa calcule a escala correta mesmo em telas móveis
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);
}

// Log na barra lateral
function addLog(msg, type = 'info') {
  if (!logContainer) return;
  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = 'log-item';
  div.innerHTML = `<span class="time">[${time}]</span> ${msg}`;
  logContainer.prepend(div);
}

// Atualização de qualidade do sinal GPS
function updateGpsQuality(accuracy) {
  if (!valQualityPill) return;
  valQualityPill.className = 'quality-pill';
  if (accuracy <= 10) {
    valQualityPill.textContent = 'Excelente (±' + Math.round(accuracy) + 'm)';
    valQualityPill.classList.add('excelente');
  } else if (accuracy <= 25) {
    valQualityPill.textContent = 'Bom (±' + Math.round(accuracy) + 'm)';
    valQualityPill.classList.add('bom');
  } else if (accuracy <= 50) {
    valQualityPill.textContent = 'Regular (±' + Math.round(accuracy) + 'm)';
    valQualityPill.classList.add('regular');
  } else {
    valQualityPill.textContent = 'Fraco (±' + Math.round(accuracy) + 'm)';
    valQualityPill.classList.add('fraco');
  }
}

// Atualização da UI e do Mapa com nova coordenada
function updatePosition(lat, lon, accuracy, speed = 0, heading = null, isSimulated = false) {
  if (valLat) valLat.textContent = Number(lat).toFixed(6);
  if (valLon) valLon.textContent = Number(lon).toFixed(6);
  if (valAcc) valAcc.textContent = `± ${Math.round(accuracy)} m`;
  if (valSpeed) valSpeed.textContent = speed ? `${Math.round(speed)} km/h` : '0 km/h';
  if (valHeading) valHeading.textContent = heading ? `${Math.round(heading)}°` : 'N/D';

  if (subLat) subLat.textContent = isSimulated ? 'Simulação' : 'Coordenada Real';
  if (subLon) subLon.textContent = isSimulated ? 'Simulação' : 'Coordenada Real';

  // Distância até a matriz de Pedras de Fogo
  const distKm = calculateDistanceKm(lat, lon, -7.4021, -35.1164);
  if (valDistance) {
    valDistance.textContent = distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(2)} km`;
  }

  updateGpsQuality(accuracy);

  // Atualizar marcador no mapa
  const latLng = [lat, lon];
  if (!userMarker) {
    const pulseIcon = L.divIcon({
      className: 'user-pulse-icon',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    userMarker = L.marker(latLng, { icon: pulseIcon }).addTo(map);
    accuracyCircle = L.circle(latLng, {
      radius: accuracy,
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.15,
      weight: 1
    }).addTo(map);

    map.setView(latLng, 16);
  } else {
    userMarker.setLatLng(latLng);
    if (accuracyCircle) {
      accuracyCircle.setLatLng(latLng);
      accuracyCircle.setRadius(accuracy);
    }
  }

  // Adicionar ao rastro
  trailCoords.push(latLng);
  trailPolyline.setLatLngs(trailCoords);

  // Centraliza suavemente
  map.panTo(latLng);
}

// Transmissão para a API
async function transmitTelemetry(coords, isSimulated = false) {
  const payload = {
    latitude: Number(coords.latitude),
    longitude: Number(coords.longitude),
    accuracy: Number(coords.accuracy || 10),
    speed: coords.speed && !isNaN(coords.speed) ? Number(coords.speed) * 3.6 : 0.0,
    heading: coords.heading && !isNaN(coords.heading) ? Number(coords.heading) : null,
    client_timestamp: new Date().toISOString(),
    device_id: isSimulated ? "simulador-pedras-de-fogo" : "smartphone-pedras-de-fogo"
  };

  try {
    const res = await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      pointsSentCount++;
      valPointsSent.textContent = pointsSentCount;
      valPointsSent.classList.add('pulse-success');
      setTimeout(() => valPointsSent.classList.remove('pulse-success'), 1200);

      addLog(`✅ <b style="color:#4ade80">Ponto #${pointsSentCount} gravado:</b> [${payload.latitude.toFixed(5)}, ${payload.longitude.toFixed(5)}] (±${Math.round(payload.accuracy)}m)`);
    } else {
      addLog(`❌ Erro no envio: HTTP ${res.status}`);
    }
  } catch (err) {
    addLog(`❌ Falha de conexão com servidor: ${err.message}`);
  }
}

// Handlers de Geolocalização Real e Fallback
let isRetryingLowAccuracy = false;

function onLocationSuccess(position) {
  const c = position.coords;
  const now = Date.now();
  isRetryingLowAccuracy = false;

  if (gpsSearchingBanner) gpsSearchingBanner.style.display = 'none';
  gpsStatusBadge.classList.add('active');
  gpsStatusBadge.querySelector('.status-text').textContent = 'GPS Conectado';

  updatePosition(c.latitude, c.longitude, c.accuracy, c.speed ? c.speed * 3.6 : 0, c.heading, false);

  // Envia imediatamente no primeiro sinal (lastSentTime === 0) ou após intervalo
  if (lastSentTime === 0 || now - lastSentTime >= SEND_INTERVAL_MS) {
    lastSentTime = now;
    transmitTelemetry(c, false);
  }
}

function onLocationError(err) {
  console.warn('Erro GPS:', err);
  let errorMsg = 'Falha ao acessar GPS.';

  // Se timeout ou sinal fraco com alta precisão, tenta fallback com baixa precisão (Wi-Fi/Rede)
  if ((err.code === 3 || err.code === 2) && !isRetryingLowAccuracy) {
    isRetryingLowAccuracy = true;
    addLog('⏳ Sinal de satélite demorou. Tentando modo de localização por rede/Wi-Fi...');
    
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    const fallbackOptions = {
      enableHighAccuracy: false,
      timeout: 25000,
      maximumAge: 10000
    };

    watchId = navigator.geolocation.watchPosition(onLocationSuccess, onLocationFinalError, fallbackOptions);
    return;
  }

  onLocationFinalError(err);
}

function onLocationFinalError(err) {
  isRetryingLowAccuracy = false;
  let errorMsg = 'Falha ao acessar GPS.';

  if (err.code === 1) {
    errorMsg = '❌ Permissão negada. ';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!window.isSecureContext && !isLocal) {
      errorMsg += 'Navegadores móveis bloqueiam GPS em HTTP via IP. Ative no chrome://flags ou teste no PC via localhost.';
      const banner = document.getElementById('context-warning-banner');
      if (banner) banner.style.display = 'block';
    } else {
      errorMsg += 'Verifique se a localização está permitida no navegador e nas configurações do Windows/Celular.';
    }
  } else if (err.code === 2) {
    errorMsg = '📡 Sinal de localização indisponível. Verifique se o GPS ou Wi-Fi está ligado.';
  } else if (err.code === 3) {
    errorMsg = '⏱️ Tempo esgotado ao buscar coordenadas. Tente o botão "Simular Movimento" ou "Marcar no Mapa".';
  }

  addLog(errorMsg);
  alert(errorMsg);
  stopGPS();
}

function startGPS() {
  if (simTimer) stopSimulation();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (!('geolocation' in navigator)) {
    const msg = '❌ A API de Geolocalização foi desativada pelo navegador (comum em conexões HTTP pelo IP do Wi-Fi). Use a opção de Simulação ou ative a flag no Chrome.';
    alert(msg);
    addLog(msg);
    return;
  }

  isRetryingLowAccuracy = false;
  lastSentTime = 0; // Garante envio imediato na primeira coordenada

  btnStartGPS.style.display = 'none';
  btnStopGPS.style.display = 'inline-flex';
  gpsStatusBadge.classList.add('active');
  gpsStatusBadge.querySelector('.status-text').textContent = 'Buscando GPS...';

  if (gpsSearchingBanner) {
    gpsSearchingBanner.style.display = 'flex';
    if (gpsSearchingText) gpsSearchingText.textContent = 'Aguardando satélites do GPS...';
  }

  addLog('🛰️ Conectando aos sensores de GPS do dispositivo...');

  // 1. Tenta fix imediato da última localização conhecida (cache até 60s)
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      addLog('⚡ Localização inicial obtida!');
      onLocationSuccess(pos);
    },
    (err) => {
      console.log('Aguardando satélites via watchPosition:', err.message);
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  );

  // 2. Rastreamento contínuo em alta precisão
  const options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 5000
  };

  try {
    watchId = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, options);
  } catch (e) {
    addLog(`Erro ao iniciar GPS: ${e.message}`);
    alert(`Erro ao iniciar GPS: ${e.message}`);
  }
}

function stopGPS() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  lastSentTime = 0;
  if (gpsSearchingBanner) gpsSearchingBanner.style.display = 'none';

  btnStartGPS.style.display = 'inline-flex';
  btnStopGPS.style.display = 'none';
  gpsStatusBadge.classList.remove('active');
  gpsStatusBadge.querySelector('.status-text').textContent = 'GPS Inativo';

  addLog('Rastreamento GPS pausado.');
}

// Simulação de Caminhada em Pedras de Fogo
function startSimulation() {
  if (watchId !== null) stopGPS();
  if (simTimer) {
    stopSimulation();
    return;
  }

  btnSimulate.textContent = '⏹ Parar Simulação';
  btnSimulate.classList.add('btn-danger');
  btnSimulate.classList.remove('btn-outline');
  gpsStatusBadge.classList.add('active');
  gpsStatusBadge.querySelector('.status-text').textContent = 'Simulação Ativa';

  addLog('Simulação de caminhada iniciada no Centro de Pedras de Fogo.');

  simIndex = 0;
  function step() {
    const pt = PEDRAS_DE_FOGO_ROUTE[simIndex];
    // Variação leve para realismo (ruído GPS de ±3m)
    const noiseLat = (Math.random() - 0.5) * 0.00005;
    const noiseLon = (Math.random() - 0.5) * 0.00005;
    const curLat = pt.lat + noiseLat;
    const curLon = pt.lon + noiseLon;
    const fakeAccuracy = 6.0 + Math.random() * 4.0;
    const fakeSpeed = 18.0 + Math.random() * 12.0;

    updatePosition(curLat, curLon, fakeAccuracy, fakeSpeed, 120, true);
    transmitTelemetry({
      latitude: curLat,
      longitude: curLon,
      accuracy: fakeAccuracy,
      speed: fakeSpeed / 3.6,
      heading: 120
    }, true);

    addLog(`📍 Ponto: ${pt.name}`);
    simIndex = (simIndex + 1) % PEDRAS_DE_FOGO_ROUTE.length;
  }

  step();
  simTimer = setInterval(step, 4000);
}

function stopSimulation() {
  if (simTimer) {
    clearInterval(simTimer);
    simTimer = null;
  }
  btnSimulate.textContent = '🚶 Simular Movimento em Pedras de Fogo';
  btnSimulate.classList.remove('btn-danger');
  btnSimulate.classList.add('btn-outline');
  gpsStatusBadge.classList.remove('active');
  gpsStatusBadge.querySelector('.status-text').textContent = 'GPS Inativo';
  addLog('Simulação pausada.');
}

// Limpar rastro
function clearTrail() {
  trailCoords = [];
  if (trailPolyline) trailPolyline.setLatLngs([]);
  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
  if (accuracyCircle) {
    map.removeLayer(accuracyCircle);
    accuracyCircle = null;
  }
  fetch('/api/clear', { method: 'POST' });
  addLog('Rastro e histórico limpos.');
}

// Conexão SSE
function initSSE() {
  if (!('EventSource' in window)) return;
  const es = new EventSource('/api/events');

  es.onopen = () => {
    sseStatusBadge.classList.add('active');
    sseStatusBadge.querySelector('.status-text').textContent = 'SSE Conectado';
  };

  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      // Recebido broadcast de outro dispositivo ou servidor
      console.log('SSE Broadcast:', data);
    } catch (err) {}
  };

  es.onerror = () => {
    sseStatusBadge.classList.remove('active');
    sseStatusBadge.querySelector('.status-text').textContent = 'SSE Reconectando';
  };
}

// Cálculo auxiliar de distância Haversine
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Envio Manual de 1 Toque
const btnSendManual = document.getElementById('btn-send-manual');

function sendManualPoint() {
  if (simTimer) stopSimulation();
  if (watchId !== null) stopGPS();

  let targetLat = -7.40210;
  let targetLon = -35.11640;

  if (map) {
    const center = map.getCenter();
    targetLat = center.lat;
    targetLon = center.lng;
  }

  // Variação minúscula para permitir registrar múltiplos pontos mesmo se o mapa estiver parado
  const noise = (Math.random() - 0.5) * 0.00008;
  targetLat += noise;
  targetLon += noise;

  addLog(`📍 Ponto manual enviado: [${targetLat.toFixed(5)}, ${targetLon.toFixed(5)}]`);
  updatePosition(targetLat, targetLon, 5.0, 0, null, false);
  transmitTelemetry({
    latitude: targetLat,
    longitude: targetLon,
    accuracy: 5.0,
    speed: 0,
    heading: null
  }, false);
}

function handleMapClick(e) {
  if (!e || !e.latlng) return;
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;
  const accuracy = 5.0;

  addLog(`👉 Toque no mapa: [${lat.toFixed(5)}, ${lon.toFixed(5)}]`);
  updatePosition(lat, lon, accuracy, 0, null, false);
  transmitTelemetry({
    latitude: lat,
    longitude: lon,
    accuracy: accuracy,
    speed: 0,
    heading: null
  }, false);
}

// Verificação de Contexto Seguro (HTTPS / Localhost)
function checkSecurityContext() {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isSecure = window.isSecureContext || isLocal;
  const warningBanner = document.getElementById('context-warning-banner');
  const helpUrlCode = document.getElementById('help-current-url');

  if (helpUrlCode) {
    helpUrlCode.textContent = window.location.origin;
  }

  if (!isSecure && !isLocal) {
    if (warningBanner) {
      warningBanner.style.display = 'block';
    }
    addLog('⚠️ Alerta: Acesso via IP em HTTP. Navegadores de celular bloqueiam GPS por segurança. Veja o botão de ajuda acima.');
  }
}

// Gerenciamento de Modal de Ajuda
function initHelpModal() {
  const modal = document.getElementById('help-modal');
  const btnShowHelp = document.getElementById('btn-show-help');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalOk = document.getElementById('btn-modal-ok');

  if (btnShowHelp && modal) {
    btnShowHelp.addEventListener('click', () => { modal.style.display = 'flex'; });
  }
  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener('click', () => { modal.style.display = 'none'; });
  }
  if (btnModalOk && modal) {
    btnModalOk.addEventListener('click', () => { modal.style.display = 'none'; });
  }
}

// Inicialização Resiliente da Aplicação
function initApp() {
  initMap();
  initSSE();
  checkSecurityContext();
  initHelpModal();

  if (btnStartGPS) btnStartGPS.addEventListener('click', startGPS);
  if (btnStopGPS) btnStopGPS.addEventListener('click', stopGPS);
  if (btnSimulate) btnSimulate.addEventListener('click', startSimulation);
  if (btnSendManual) btnSendManual.addEventListener('click', sendManualPoint);
  if (btnClearTrail) btnClearTrail.addEventListener('click', clearTrail);

  addLog('Sistema de telemetria inicializado com sucesso.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
