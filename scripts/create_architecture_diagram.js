/**
 * scripts/create_architecture_diagram.js
 * Gera o diagrama técnico oficial da arquitetura do LocBUS em fig1.png
 */
const puppeteer = require('puppeteer');
const path = require('path');

const svgHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@500&display=swap">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1000px;
      height: 520px;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .diagram-container {
      width: 100%;
      height: 100%;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      background: #f8fafc;
      padding: 20px;
      display: grid;
      grid-template-columns: 205px 60px 215px 55px 215px 50px 175px;
      align-items: center;
    }
    .box {
      background: #ffffff;
      border: 1.5px solid #94a3b8;
      border-radius: 10px;
      padding: 14px 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      height: 420px;
      position: relative;
    }
    .box.active {
      border-color: #0284c7;
      box-shadow: 0 6px 12px -2px rgba(2, 132, 199, 0.15);
    }
    .layer-tag {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0284c7;
      margin-bottom: 6px;
    }
    .box-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    .component-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .component-item {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 11px;
      color: #334155;
      line-height: 1.35;
    }
    .component-item strong {
      display: block;
      color: #0f172a;
      font-size: 11.5px;
      margin-bottom: 2px;
    }
    .arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-weight: 800;
      font-size: 18px;
      text-align: center;
    }
    .arrow-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      margin-top: 4px;
      text-align: center;
    }
    .protocol-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 5px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="diagram-container">
    <!-- Camada 1: Hardware Embarcado -->
    <div class="box">
      <span class="layer-tag">Camada 1: Veículo</span>
      <div class="box-title">Nó Veicular BLE (Beacon Fixo)</div>
      <div class="component-list">
        <div class="component-item">
          <strong>ESP32-WROOM-32</strong>
          Firmware iBeacon broadcaster contínuo a 500ms
          <span class="protocol-badge">BLE 4.2 / 5.0</span>
        </div>
        <div class="component-item">
          <strong>Identificador Veicular</strong>
          UUID institucional fixo + Major (ID Ônibus) + Minor (Linha)
        </div>
        <div class="component-item">
          <strong>Alimentação Passiva</strong>
          5V / 1A via porta USB do painel (Consumo: &lt; 0.4W)
        </div>
        <div class="component-item" style="background:#e0f2fe; border-color:#7dd3fc;">
          <strong>Vantagem Operacional</strong>
          Custo &lt; R$ 40, sem chip 4G e sem conexão na rede CAN
        </div>
      </div>
    </div>

    <!-- Seta 1: BLE Advertising -->
    <div class="arrow">
      <span>➔</span>
      <span class="arrow-label">Beaconing (RSSI &gt; -75dBm)</span>
    </div>

    <!-- Camada 2: Borda / Smartphone -->
    <div class="box active">
      <span class="layer-tag">Camada 2: Borda</span>
      <div class="box-title">Smartphone do Passageiro (PWA)</div>
      <div class="component-list">
        <div class="component-item">
          <strong>Detecção de Proximidade</strong>
          Web Bluetooth valida presença física a bordo do ônibus
        </div>
        <div class="component-item">
          <strong>Coleta GNSS Oportunista</strong>
          W3C Geolocation API (Latitude, Longitude, Acurácia &sigma;)
        </div>
        <div class="component-item">
          <strong>Controle Energético</strong>
          Throttling temporal fixo de 4s para proteger a bateria
        </div>
        <div class="component-item">
          <strong>Privacidade e LGPD</strong>
          Transmissão anônima de telemetria sem dados pessoais (PII)
        </div>
      </div>
    </div>

    <!-- Seta 2: HTTPS Telemetry -->
    <div class="arrow">
      <span>➔</span>
      <span class="arrow-label">POST JSON (4G / 5G)</span>
    </div>

    <!-- Camada 3: Nuvem / Backend -->
    <div class="box active">
      <span class="layer-tag">Camada 3: Nuvem</span>
      <div class="box-title">Microsserviço de Ingestão (FastAPI)</div>
      <div class="component-list">
        <div class="component-item">
          <strong>Geofencing Estrito (80m)</strong>
          Fórmula de Haversine descarta pontos fora da rota oficial
        </div>
        <div class="component-item">
          <strong>Filtro Cinemático</strong>
          Rejeita saltos espaciais e velocidades &gt; 65 km/h
        </div>
        <div class="component-item">
          <strong>Clustering Ponderado</strong>
          Média centróide ponderada pelo inverso da acurácia (w = 1/&sigma;)
        </div>
        <div class="component-item">
          <strong>Streaming em Tempo Real</strong>
          Broker assíncrono SSE com broadcast para clientes
        </div>
      </div>
    </div>

    <!-- Seta 3: SSE Events -->
    <div class="arrow">
      <span>➔</span>
      <span class="arrow-label">SSE Stream (&lt; 350ms)</span>
    </div>

    <!-- Camada 4: Apresentação -->
    <div class="box">
      <span class="layer-tag">Camada 4: Cliente</span>
      <div class="box-title">Interface Web (Leaflet / PWA)</div>
      <div class="component-list">
        <div class="component-item">
          <strong>Mapa Interativo</strong>
          Tiles CartoDB / OSM com polilinha da rota CCHLA &harr; CI
        </div>
        <div class="component-item">
          <strong>Rastro e Posição</strong>
          Marcador veicular pulsante atualizado via streaming contínuo
        </div>
        <div class="component-item">
          <strong>ETA Dinâmico</strong>
          Tempo estimado para as 8 paradas acadêmicas
        </div>
        <div class="component-item">
          <strong>Modo Offline PWA</strong>
          Service Worker e manifest para instalação na tela inicial
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function generateDiagram() {
  const outputPath = path.resolve(__dirname, '../artigo_ieee_la/fig1.png');
  console.log('[Diagram] Gerando diagrama arquitetural de alta definição para fig1.png...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 520, deviceScaleFactor: 2 });
    await page.setContent(svgHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`[Diagram] fig1.png gerado com sucesso em:\n${outputPath}`);
  } catch (err) {
    console.error('[Diagram Error]', err.message);
  } finally {
    await browser.close();
  }
}

generateDiagram();
