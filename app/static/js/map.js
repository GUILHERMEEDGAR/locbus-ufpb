/**
 * map.js - Gerenciamento do mapa interativo Leaflet para o LocBUS
 * Inclui camadas de mapa real: Ruas detalhadas (OpenStreetMap), Satélite Real HD (Esri) e Voyager.
 */

let map = null;
let busMarker = null;
let accuracyCircle = null;
let routeLine = null;

// Coordenadas dos Pontos Terminais Oficiais
const CCHLA_COORDS = [-7.1397, -34.8450];
const CI_COORDS = [-7.1627, -34.8182];

// Traçado viário realista completo (Circuito Circular CCHLA <-> CI: Ida e Volta)
const ROUTE_POLYLINE = [
  // --- Sentido Ida: Campus I CCHLA -> CI Mangabeira ---
  [-7.1397, -34.8450], // Terminal CCHLA (Campus I)
  [-7.1404, -34.8442], // Saída do CCHLA
  [-7.1415, -34.8430], // Via interna Campus I
  [-7.1425, -34.8420], // Rotatória Reitoria / Praça da Alegria
  [-7.1438, -34.8410], // Centro de Ciências da Saúde (CCS)
  [-7.1448, -34.8404], // Hospital Universitário Lauro Wanderley (HULW)
  [-7.1458, -34.8395], // Acesso Via Expressa Padre Zé
  [-7.1472, -34.8378], // Início Av. Sérgio Guerra (Bancários)
  [-7.1492, -34.8356], // Av. Sérgio Guerra (Comércios / Bancos)
  [-7.1510, -34.8335], // Praça da Paz (Bancários)
  [-7.1530, -34.8308], // Av. Sérgio Guerra (Bancários Sul)
  [-7.1555, -34.8272], // Aproximação do Viaduto de Mangabeira
  [-7.1578, -34.8242], // Trevo / Viaduto de Mangabeira
  [-7.1598, -34.8218], // Av. Alfredo Ferreira da Rocha
  [-7.1615, -34.8196], // Rua do Centro de Informática
  [-7.1627, -34.8182], // Terminal CI (Centro de Informática)

  // --- Sentido Volta: CI Mangabeira -> Campus I CCHLA ---
  [-7.1615, -34.8196], // Retorno Av. Alfredo Ferreira da Rocha
  [-7.1598, -34.8218], // Av. Alfredo Ferreira da Rocha norte
  [-7.1578, -34.8242], // Viaduto de Mangabeira
  [-7.1555, -34.8272], // Início Av. Sérgio Guerra norte
  [-7.1530, -34.8308], // Av. Sérgio Guerra (altura Shopping Sul)
  [-7.1510, -34.8335], // Praça da Paz (Retorno)
  [-7.1492, -34.8356], // Av. Sérgio Guerra norte
  [-7.1472, -34.8378], // Saída dos Bancários / Trevo Castelo Branco
  [-7.1458, -34.8395], // Via Expressa Padre Zé rumo ao Campus I
  [-7.1448, -34.8404], // Entrada Campus I / Hospital Universitário
  [-7.1438, -34.8410], // Passando pelo CCS
  [-7.1425, -34.8420], // Praça da Alegria / Reitoria
  [-7.1408, -34.8436], // Acesso final ao CCHLA
  [-7.1397, -34.8450], // Retorno ao Terminal CCHLA
];

// Paradas intermediárias oficiais
const INTERMEDIATE_STOPS = [
  { name: "Reitoria / Praça da Alegria", coords: [-7.1425, -34.8420] },
  { name: "CCS / Hospital Universitário (HULW)", coords: [-7.1448, -34.8404] },
  { name: "Praça da Paz (Bancários)", coords: [-7.1510, -34.8335] },
  { name: "Trevo / Viaduto de Mangabeira", coords: [-7.1578, -34.8242] },
];

function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Centro intermediário entre Campus I e Mangabeira
  map = L.map('map', {
    zoomControl: true,
    attributionControl: true
  }).setView([-7.1512, -34.8316], 13);

  // 1. Camada de Ruas Reais Coloridas (OpenStreetMap)
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
  });

  // 2. Camada de Satélite Real (Esri World Imagery)
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank">Esri</a>'
  });

  // Define OpenStreetMap como camada ativa padrão
  osmLayer.addTo(map);

  // Controle de alternância de camadas (100% livres e sem exigência de API)
  const baseMaps = {
    "🗺️ Mapa Real (Ruas OSM)": osmLayer,
    "🛰️ Satélite Real (Esri HD)": satelliteLayer
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

  // Desenha a linha da rota oficial com contraste
  routeLine = L.polyline(ROUTE_POLYLINE, {
    color: '#2563eb',
    weight: 5,
    opacity: 0.85,
    dashArray: '6, 8',
    lineCap: 'round'
  }).addTo(map);

  // Marcadores personalizados dos terminais principais
  const iconTerminal = L.divIcon({
    className: 'custom-terminal-icon',
    html: `<div style="background: #1e40af; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid #fff; box-shadow: 0 3px 8px rgba(0,0,0,0.5);">🚏</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  L.marker(CCHLA_COORDS, { icon: iconTerminal })
    .addTo(map)
    .bindPopup('<strong>Terminal CCHLA (Campus I)</strong><br>Ponto de parada e embarque no estacionamento do CCHLA.');

  L.marker(CI_COORDS, { icon: iconTerminal })
    .addTo(map)
    .bindPopup('<strong>Terminal CI (Mangabeira)</strong><br>Ponto final e embarque de retorno em frente ao Centro de Informática.');

  // Marcadores discretos das paradas intermediárias oficiais
  INTERMEDIATE_STOPS.forEach(stop => {
    L.circleMarker(stop.coords, {
      radius: 6,
      fillColor: '#3b82f6',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    })
    .addTo(map)
    .bindPopup(`<strong>Parada Oficial:</strong><br>${stop.name}`);
  });

  // Ajusta a visão para enquadrar todo o percurso
  // Garante marcador inicial do ônibus no ponto de origem
  updateBusMarker(CCHLA_COORDS[0], CCHLA_COORDS[1], 15.0, false);

  // Ajusta a visão para enquadrar todo o percurso
  map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

  // Exporta referência global para redimensionamento dinâmico
  window.map = map;

  // Garante re-renderização completa dos blocos após montagem no DOM
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);
}

let isAutoFollowActive = false;
let userHasInteractedWithMap = false;

function getAdjustedCenter(targetLatLng, targetZoom) {
  if (window.innerWidth <= 768) {
    const point = map.project(targetLatLng, targetZoom);
    const offsetY = window.innerHeight * 0.22;
    const adjustedPoint = L.point(point.x, point.y + offsetY);
    return map.unproject(adjustedPoint, targetZoom);
  } else {
    const point = map.project(targetLatLng, targetZoom);
    const offsetX = 190;
    const adjustedPoint = L.point(point.x - offsetX, point.y);
    return map.unproject(adjustedPoint, targetZoom);
  }
}

function updateBusMarker(lat, lon, accuracy = null, isCollab = false) {
  if (!map) return;

  const busColor = isCollab ? '#10b981' : '#2563eb';
  const pulseEffect = isCollab ? 'box-shadow: 0 0 14px #10b981;' : 'box-shadow: 0 0 10px #2563eb;';

  const busIcon = L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div id="bus-marker-element" style="
        background: ${busColor}; 
        color: #ffffff; 
        width: 38px; 
        height: 38px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px; 
        border: 3px solid #ffffff; 
        ${pulseEffect}
        transition: all 0.4s ease;
      ">🚌</div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  if (!busMarker) {
    busMarker = L.marker([lat, lon], { icon: busIcon }).addTo(map);
  } else {
    busMarker.setLatLng([lat, lon]);
    busMarker.setIcon(busIcon);
  }

  // Raio de acurácia do GPS
  if (accuracy && accuracy > 0) {
    if (!accuracyCircle) {
      accuracyCircle = L.circle([lat, lon], {
        radius: accuracy,
        color: busColor,
        fillColor: busColor,
        fillOpacity: 0.18,
        weight: 1.5
      }).addTo(map);
    } else {
      accuracyCircle.setLatLng([lat, lon]);
      accuracyCircle.setRadius(accuracy);
    }
  } else if (accuracyCircle) {
    map.removeLayer(accuracyCircle);
    accuracyCircle = null;
  }

  // Acompanhamento suave da câmera se modo Foco estiver ativo
  if (isAutoFollowActive) {
    const targetCenter = getAdjustedCenter(L.latLng(lat, lon), map.getZoom());
    map.panTo(targetCenter, { animate: true, duration: 0.6 });
  }
}

// Centraliza a visão do mapa suavemente no ônibus com compensação de painel (estilo Uber / Transit)
function recenterBus() {
  if (!map) return;
  
  if (!busMarker) {
    updateBusMarker(CCHLA_COORDS[0], CCHLA_COORDS[1], 15.0, false);
  }

  isAutoFollowActive = true;
  const targetLatLng = busMarker.getLatLng();
  const targetZoom = Math.max(map.getZoom(), 16);

  map.invalidateSize();
  const targetCenter = getAdjustedCenter(targetLatLng, targetZoom);
  map.flyTo(targetCenter, targetZoom, { duration: 0.8 });

  // Feedback visual no botão
  const btnRecenter = document.getElementById('btn-recenter-bus');
  if (btnRecenter) {
    btnRecenter.classList.add('focused-active');
    const label = btnRecenter.querySelector('.recenter-label');
    const prevText = label ? label.textContent : '';
    if (label) label.textContent = 'Seguindo Ônibus';
    setTimeout(() => {
      if (label && isAutoFollowActive) label.textContent = '🎯 Focado';
    }, 1800);
  }

  // Efeito de destaque no elemento visual do ônibus
  const markerElem = document.getElementById('bus-marker-element');
  if (markerElem) {
    markerElem.style.transform = 'scale(1.35)';
    setTimeout(() => {
      if (markerElem) markerElem.style.transform = 'scale(1)';
    }, 450);
  }
}

window.recenterBus = recenterBus;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  const btnRecenter = document.getElementById('btn-recenter-bus');
  if (btnRecenter) {
    btnRecenter.addEventListener('click', recenterBus);
  }

  // Se o usuário arrastar o mapa manualmente, desativa o auto-follow para não conflitar com a navegação do usuário
  if (map) {
    map.on('dragstart', () => {
      isAutoFollowActive = false;
      userHasInteractedWithMap = true;
      if (btnRecenter) {
        btnRecenter.classList.remove('focused-active');
        const label = btnRecenter.querySelector('.recenter-label');
        if (label) label.textContent = 'Focar Ônibus';
      }
    });
  }
});
