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

// Traçado realista das vias (Campus I CCHLA -> Castelo Branco -> Av. Sérgio Guerra / Bancários -> CI Mangabeira)
const ROUTE_POLYLINE = [
  [-7.1397, -34.8450], // Terminal CCHLA (Campus I)
  [-7.1408, -34.8436], // Saída do CCHLA
  [-7.1425, -34.8420], // Rotatória Reitoria / Praça da Alegria
  [-7.1438, -34.8410], // Próximo ao CCS / HU
  [-7.1455, -34.8398], // Acesso Via Expressa Padre Zé
  [-7.1472, -34.8378], // Início Av. Sérgio Guerra (Bancários)
  [-7.1510, -34.8335], // Praça da Paz (Bancários)
  [-7.1542, -34.8290], // Av. Sérgio Guerra / Comércio
  [-7.1578, -34.8242], // Trevo / Viaduto de Mangabeira
  [-7.1605, -34.8210], // Av. Alfredo Ferreira da Rocha
  [-7.1627, -34.8182], // Terminal CI (Centro de Informática)
];

function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Centro intermediário entre Campus I e Mangabeira
  map = L.map('map', {
    zoomControl: true,
    attributionControl: true
  }).setView([-7.1512, -34.8316], 13);

  // 1. Camada de Ruas Reais Coloridas (OpenStreetMap) - Mostra todas as ruas, praças e bairros
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
  });

  // 2. Camada de Satélite Real (Esri World Imagery) - Fotografias de satélite reais de alta resolução
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank">Esri</a>'
  });

  // 3. Camada Carto Voyager (Moderna / Clean)
  const voyagerLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://carto.com/" target="_blank">CARTO</a>'
  });

  // Define OpenStreetMap como camada ativa padrão
  osmLayer.addTo(map);

  // Controle de alternância de camadas no canto superior direito
  const baseMaps = {
    "🗺️ Mapa Real (Ruas OSM)": osmLayer,
    "🛰️ Satélite Real (Esri HD)": satelliteLayer,
    "🏙️ Carto Voyager (Clean)": voyagerLayer
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

  // Marcadores personalizados dos terminais
  const iconTerminal = L.divIcon({
    className: 'custom-terminal-icon',
    html: `<div style="background: #1e40af; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 2.5px solid #fff; box-shadow: 0 3px 8px rgba(0,0,0,0.5);">🚏</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  L.marker(CCHLA_COORDS, { icon: iconTerminal })
    .addTo(map)
    .bindPopup('<strong>Terminal CCHLA (Campus I)</strong><br>Ponto de parada no estacionamento do CCHLA.');

  L.marker(CI_COORDS, { icon: iconTerminal })
    .addTo(map)
    .bindPopup('<strong>Terminal CI (Mangabeira)</strong><br>Ponto final em frente ao Centro de Informática.');

  // Ajusta a visão para enquadrar todo o percurso
  map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

  // Exporta referência global para redimensionamento dinâmico
  window.map = map;

  // Garante re-renderização completa dos blocos após montagem no DOM
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);
}

function updateBusMarker(lat, lon, accuracy = null, isCollab = false) {
  if (!map) return;

  const busColor = isCollab ? '#10b981' : '#2563eb';
  const pulseEffect = isCollab ? 'box-shadow: 0 0 14px #10b981;' : 'box-shadow: 0 0 10px #2563eb;';

  const busIcon = L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div style="
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
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initMap);
