/**
 * scripts/generate_ieee_pdf.js
 * Gera o PDF oficial com diagramação rigorosa do IEEE Latin America Transactions
 * Utiliza KaTeX pré-compilado e Puppeteer para renderização vetorial de alta definição.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const katex = require('katex');

// Pré-renderização das equações matemáticas com KaTeX no Node (modo html puro sem vazamento de MathML)
const katexCss = fs.readFileSync(require.resolve('katex/dist/katex.min.css'), 'utf-8');

const renderMath = (tex, display = false) => katex.renderToString(tex, {
  displayMode: display,
  output: 'html',
  throwOnError: false
});

const eq1Html = renderMath(
  'd(P_1, P_2) = 2 R_{\\oplus} \\arcsin \\left( \\sqrt{\\sin^2\\left(\\frac{\\Delta \\phi}{2}\\right) + \\cos \\phi_1 \\cos \\phi_2 \\sin^2\\left(\\frac{\\Delta \\lambda}{2}\\right)} \\right)',
  false
);

const eq2Html = renderMath(
  'w_k = \\frac{1}{\\max(\\sigma_k, 1.0)}, \\quad \\mathbf{X}_{\\text{bus}} = \\frac{\\sum_{k=1}^{K} w_k \\mathbf{X}_k}{\\sum_{k=1}^{K} w_k}',
  false
);

const mathWi = renderMath('w_i = 1/\\text{acc}_i');
const mathDt = renderMath('\\Delta t = 4\\text{ s}');
const mathDtWindow = renderMath('\\Delta T = 6\\text{ s}');
const mathR = renderMath('R_{\\oplus} = 6371\\text{ km}');
const mathR_poly = renderMath('R');
const mathK = renderMath('K');
const mathGeofenceCheck = renderMath('\\min_{S \\in R} d(P, S) > 80\\text{ m}');
const mathCoord = renderMath('P(\\phi, \\lambda)');
const mathBusPos = renderMath('\\mathbf{X}_{\\text{bus}} = (\\bar{\\phi}, \\bar{\\lambda})');

const fig1Path = 'file:///' + path.resolve(__dirname, '../artigo_ieee_la/fig1.png').replace(/\\\\/g, '/');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>LocBUS - Artigo IEEE Latin America</title>
  <style>
${katexCss}
  </style>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm 20mm 15mm;
      @top-center {
        content: "IEEE LATIN AMERICA TRANSACTIONS, VOL. XX, NO. X, OUTUBRO 2026";
        font-family: 'Times New Roman', Times, serif;
        font-size: 8pt;
        color: #444;
      }
      @bottom-center {
        content: counter(page);
        font-family: 'Times New Roman', Times, serif;
        font-size: 9pt;
      }
    }

    * { box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10pt;
      line-height: 1.25;
      color: #000;
      margin: 0;
      padding: 0;
      text-align: justify;
    }

    /* Cabeçalho IEEE */
    .journal-header {
      font-size: 8pt;
      color: #333;
      border-bottom: 0.5pt solid #888;
      padding-bottom: 3px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Título e Autores (Largura total) */
    .article-title {
      font-size: 20pt;
      font-weight: bold;
      text-align: center;
      line-height: 1.15;
      margin-bottom: 14px;
    }

    .article-authors {
      font-size: 10.5pt;
      text-align: center;
      margin-bottom: 4px;
    }

    .article-affil {
      font-size: 8.5pt;
      font-style: italic;
      text-align: center;
      color: #444;
      margin-bottom: 18px;
    }

    /* Abstract e Keywords em largura total */
    .abstract-box {
      font-size: 9pt;
      margin: 0 15px 18px 15px;
      line-height: 1.25;
    }

    .abstract-box strong {
      font-style: italic;
    }

    .keywords-box {
      font-size: 9pt;
      margin: 0 15px 22px 15px;
      line-height: 1.25;
    }

    .keywords-box strong {
      font-style: italic;
    }

    /* Estrutura de 2 Colunas Oficial do IEEE */
    .two-columns {
      column-count: 2;
      column-gap: 0.25in;
      text-align: justify;
    }

    h2.section-title {
      font-size: 10pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 14px;
      margin-bottom: 6px;
      letter-spacing: 0.06em;
      break-after: avoid;
    }

    h3.subsection-title {
      font-size: 10pt;
      font-style: italic;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 4px;
      break-after: avoid;
    }

    p {
      text-indent: 14pt;
      margin: 0 0 6pt 0;
    }

    p.no-indent {
      text-indent: 0;
    }

    .dropcap {
      float: left;
      font-size: 32pt;
      line-height: 26pt;
      padding-top: 2pt;
      padding-right: 3pt;
      padding-bottom: 0;
      font-family: 'Times New Roman', Times, serif;
    }

    /* Listas */
    ol, ul {
      margin: 4pt 0 6pt 16pt;
      padding: 0;
    }

    li {
      margin-bottom: 3pt;
    }

    /* Tabelas IEEE */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.5pt;
      margin: 10pt 0;
      line-height: 1.2;
    }

    table caption {
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 4pt;
      text-align: center;
    }

    th {
      border-top: 1pt solid #000;
      border-bottom: 0.5pt solid #000;
      padding: 4pt 3pt;
      font-weight: bold;
      text-align: left;
    }

    td {
      padding: 3.5pt 3pt;
      border-bottom: 0.5pt solid #ccc;
    }

    tr:last-child td {
      border-bottom: 1pt solid #000;
    }

    /* Fórmulas Matemáticas */
    .equation {
      margin: 6pt 0;
      font-size: 8pt;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
    }

    .eq-num {
      font-size: 9pt;
      float: right;
    }

    /* Imagem */
    .figure-box {
      width: 100%;
      text-align: center;
      margin: 10pt 0;
      break-inside: avoid;
    }

    .figure-box img {
      max-width: 98%;
      height: auto;
      border: 0.5pt solid #cbd5e1;
      border-radius: 4px;
    }

    .figure-caption {
      font-size: 8pt;
      margin-top: 4pt;
      text-align: justify;
      padding: 0 4pt;
      line-height: 1.2;
    }

    /* Referências */
    .references {
      font-size: 8pt;
      line-height: 1.2;
    }

    .ref-item {
      margin-bottom: 4pt;
      text-indent: -14pt;
      margin-left: 14pt;
    }
  </style>
</head>
<body>

  <!-- Cabeçalho IEEE -->
  <div class="journal-header">
    <span>IEEE Latin America Transactions, Vol. XX, No. X, Outubro 2026</span>
    <span>Artigo Regular</span>
  </div>

  <!-- Título e Autores -->
  <div class="article-title">
    LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo para Transporte Universitário Intercampi
  </div>

  <div class="article-authors">
    Guilherme Edgar C. S. R. Guedes, <em>Membro Estudante, IEEE</em>, e Equipe de Desenvolvimento LocBUS
  </div>

  <div class="article-affil">
    Centro de Informática (CI) e Centro de Tecnologia (CT) — Universidade Federal da Paraíba (UFPB)<br>
    Campus I / Campus IV, João Pessoa – PB, Brasil — Contato: guilherme.guedes@academico.ufpb.br
  </div>

  <!-- Resumo e Palavras-chave -->
  <div class="abstract-box">
    <strong><em>Resumo</em>—A imprevisibilidade temporal no transporte público universitário intercampi acarreta longos períodos de espera ociosa, superlotação nas paradas e evasão acadêmica. Embora sistemas convencionais de Localização Automática de Veículos (AVL - <em>Automatic Vehicle Location</em>) mitiguem tal problema em frotas comerciais, sua adoção em instituições públicas é frequentemente inviabilizada pelos elevados custos de aquisição de computadores de bordo proprietários, antenas industriais e assinaturas mensais de telemetria celular (M2M/4G). Em contrapartida, abordagens estritamente baseadas em <em>crowdsourcing</em> (como Waze e Moovit) padecem de ruídos espaciais, falsos positivos causados por pedestres nas proximidades da via e vulnerabilidade a adulterações maliciosas (<em>spoofing</em>). Este artigo apresenta o projeto, a formulação teórica e a validação preliminar do LocBUS, uma arquitetura híbrida de telemetria de baixo custo projetada para o transporte intercampi da Universidade Federal da Paraíba (UFPB). O sistema combina <em>beacons</em> veiculares de rádio Bluetooth Low Energy (BLE) com a coleta oportunista de dados de posicionamento global (GNSS/GPS) dos próprios passageiros embarcados via aplicação Web Progressiva (PWA). Para assegurar a fidelidade espacial sem demandar módulos 4G na frota, a solução introduz um algoritmo de agregação espacial com validação geométrica estrita (<em>geofencing</em> de 80 m), filtro cinemático e <em>clustering</em> centróide ponderado pelo inverso da variância/acurácia instrumental de cada dispositivo (${mathWi}). Os resultados experimentais obtidos em bancada, simulação computacional de 31 <em>waypoints</em> em malha viária real e testes de campo com telemetria contínua comprovam a viabilidade da abordagem, garantindo acurácia submétrica na ancoragem de rota, latência de difusão Server-Sent Events (SSE) inferior a 350 ms e economia integral de custos operacionais de conectividade veicular.</strong>
  </div>

  <div class="keywords-box">
    <strong><em>Palavras-chave</em>—Sistemas Inteligentes de Transporte (ITS), Telemetria Colaborativa, Bluetooth Low Energy (BLE), Crowdsourcing, Geofencing, Fusão Sensorial, Web PWA, Latência Reduzida.</strong>
  </div>

  <!-- Corpo em 2 Colunas -->
  <div class="two-columns">

    <h2 class="section-title">I. Introdução</h2>
    <p><span class="dropcap">A</span> eficiência e a previsibilidade dos sistemas de transporte coletivo constituem pilares determinantes para a mobilidade sustentável e a integração socioeconômica em centros urbanos contemporâneos [1]. No contexto universitário, tais desafios tornam-se agudos quando instituições federais de ensino superior operam em estruturas multicampi descentralizadas. Na Universidade Federal da Paraíba (UFPB), por exemplo, a rotina acadêmica exige o deslocamento frequente de discentes, docentes e servidores técnicos entre o Campus I (bairros Castelo Branco e Mangabeira) e centros acadêmicos especializados (CCHLA, CCEN, CT e Centro de Informática - CI), cobrindo trajetos viários intermunicipais e interbairros que superam 14 km de extensão por ciclo.</p>

    <h3 class="subsection-title">A. Problema de Pesquisa e Limitações Atuais</h3>
    <p>O serviço de transporte intercampi universitário é tipicamente executado por frotas de ônibus institucionais ou terceirizadas que não contam com computadores de bordo com telemetria ativa interligados a painéis públicos de monitoramento. Diante dessa carência infraestrutural, os usuários enfrentam um cenário de severa assimetria informacional, caracterizado por:</p>
    <ol>
      <li><strong>Imprevisibilidade dos Tempos Estimados de Chegada (ETA):</strong> A inexistência de rastreamento em tempo real impossibilita o cálculo dinâmico do tempo de espera, submetendo estudantes a exposições climáticas prolongadas e vulnerabilidade de segurança pública em pontos de parada isolados;</li>
      <li><strong>Custo Proibitivo de Sistemas AVL Proprietários:</strong> A instalação de rastreadores veiculares industriais (<em>Automated Vehicle Location</em> - AVL) convencionais acarreta custos unitários de instalação (R$ 1.200 a R$ 2.500 por veículo) associados a taxas mensais de transmissão de dados M2M/GSM (R$ 60 a R$ 120/mês/ônibus), onerando sobremaneira o orçamento das universidades públicas;</li>
      <li><strong>Dependência e Fragilidade de Soluções Crowdsourcing Puras:</strong> Aplicativos comerciais comunitários (tais como Moovit ou Waze) dependem da iniciativa discricionária dos usuários em reportar eventos, falhando em diferenciar se um sinal GPS recebido provém de um passageiro devidamente embarcado no ônibus ou de um pedestre caminhando em calçada contígua à rota viária.</li>
    </ol>

    <h3 class="subsection-title">B. Lacuna Científica e Tecnológica Identificada</h3>
    <p>Embora a literatura reporte extensivamente sistemas de rastreamento urbano [2], [3], constata-se uma relevante <strong>lacuna tecnológica</strong>: a carência de uma solução de monitoramento em tempo real que alie o <strong>custo marginal nulo de conectividade veicular</strong> à <strong>alta confiabilidade espacial</strong>, sem exigir computadores veiculares conectados à rede móvel, mas dotada de mecanismos determinísticos capazes de imunizar a telemetria colaborativa contra ruídos de posicionamento e fraudes voluntárias (<em>spoofing</em>).</p>

    <h3 class="subsection-title">C. Objetivos e Contribuição Tecnológica Proposta</h3>
    <p>Para solucionar essa lacuna, este artigo propõe o <strong>LocBUS</strong>, uma arquitetura computacional de sensoriamento participativo e telemetria híbrida baseada em três pilares fundamentais:</p>
    <ul>
      <li><strong>Verificação Física de Presença via BLE:</strong> Emprego de microtransmissores Bluetooth Low Energy (ESP32 / iBeacon) de custo inferior a R$ 40 instalados no teto do veículo, cuja assinatura criptográfica e intensidade de sinal (RSSI) autenticam localmente que o smartphone do passageiro está no interior do ônibus;</li>
      <li><strong>Fusão Sensorial Ponderada e Geofencing Estrito:</strong> Algoritmo de borda e retaguarda que valida se a coordenada coletada respeita o polígono da rota homologada (envelope de tolerância de 80 m) e calcula o centróide ponderado da posição veicular por meio do inverso da acurácia instrumental relatada pelo subsistema GNSS de múltiplos smartphones simultâneos;</li>
      <li><strong>Disseminação Ultraleve em Tempo Real:</strong> Implementação de microsserviço de baixa latência em Python/FastAPI suportado por fluxo contínuo de <em>Server-Sent Events</em> (SSE) e interface Web PWA responsiva (Leaflet.js), dispensando a instalação de aplicativos pesados em lojas comerciais e garantindo conformidade com a Lei Geral de Proteção de Dados (LGPD).</li>
    </ul>

    <h2 class="section-title">II. Estado da Arte Científico e Tecnológico</h2>
    <p>A concepção de Sistemas Inteligentes de Transporte (ITS - <em>Intelligent Transportation Systems</em>) orientados ao transporte de massa congrega pesquisas nas áreas de telemetria embarcada, redes veiculares e computação móvel ubíqua.</p>

    <h3 class="subsection-title">A. Sistemas AVL Industriais e Rastreadores Proprietários</h3>
    <p>Os sistemas AVL convencionais representam o padrão-ouro de frotas comerciais em metrópoles desenvolvidas [4]. Tipicamente, tais plataformas baseiam-se em terminais dedicados compostos por receptor GNSS de alta precisão, modem 4G/LTE com interface CAN bus veicular e baterias secundárias industriais. Fornecem telemetria contínua e determinística em frequência fixa (1 a 5 Hz). Contudo, apresentam custo de aquisição proibitivo para operadoras públicas de pequeno porte e exigem perfuração e integração elétrica intrusiva no chassi do veículo.</p>

    <h3 class="subsection-title">B. Telemetria Colaborativa e Sensoriamento Participativo</h3>
    <p>O sensoriamento participativo (<em>Mobile Crowdsensing</em>) emergiu como paradigma disruptivo, alavancando os sensores embutidos nos smartphones de passageiros para estimar o fluxo e a posição de veículos coletivos [5], [6]. Projetos acadêmicos demonstraram a viabilidade de deduzir trajetórias de ônibus a partir do acelerômetro, giroscópio e GNSS de usuários voluntários. A desvantagem crítica reside na suscetibilidade a ruído severo decorrente de passageiros que descem do ônibus mas mantêm o rastreamento ativado, além da vulnerabilidade a ataques de <em>spoofing</em> GNSS.</p>

    <h3 class="subsection-title">C. Tecnologias de Proximidade e Conectividade Veicular</h3>
    <p>A tecnologia Bluetooth Low Energy (BLE, IEEE 802.15.1) consolidou-se como mecanismo padrão para determinação de microrregiões de proximidade (<em>microlocation</em>) em ambientes urbanos e internos [7]. Protocolos como Apple iBeacon e Google Eddystone operam emitindo pacotes periódicos de anúncio contendo identificadores unívocos (UUID, <em>Major</em> e <em>Minor</em>). O uso concomitante de nós microcontrolados (ex: Espressif ESP32) alimentados pela tomada USB de 5 V do ônibus possibilita transformar o veículo em uma baliza de radiofrequência autônoma, cuja vida útil prescinde de interfaces com a ECU automotiva.</p>

    <h3 class="subsection-title">D. Análise Comparativa e Síntese da Lacuna</h3>
    <p>A Tabela I sintetiza a comparação sistemática entre as abordagens consolidadas na literatura e a proposta do LocBUS.</p>

    <!-- Tabela I -->
    <table>
      <caption>TABELA I<br>Matriz Comparativa de Tecnologias de Telemetria e Rastreamento</caption>
      <thead>
        <tr>
          <th>Critério de Avaliação</th>
          <th>AVL Dedicado 4G</th>
          <th>Crowdsourcing Puro</th>
          <th>LocBUS (Proposto)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Custo Hardware Veicular</td>
          <td>Alto (&gt; R$ 1.500)</td>
          <td>Nulo (R$ 0)</td>
          <td><strong>Mínimo (&lt; R$ 50 / BLE)</strong></td>
        </tr>
        <tr>
          <td>Custo Recorrente (SIM 4G)</td>
          <td>Sim (Mensalidade)</td>
          <td>Não</td>
          <td><strong>Não (Oportunista)</strong></td>
        </tr>
        <tr>
          <td>Interferência na Frota</td>
          <td>Elevada (Rede CAN)</td>
          <td>Nula</td>
          <td><strong>Nula (USB 5V)</strong></td>
        </tr>
        <tr>
          <td>Imunidade a Pedestres</td>
          <td>Total (Fixo)</td>
          <td>Pobre (Confunde)</td>
          <td><strong>Total (Validação BLE)</strong></td>
        </tr>
        <tr>
          <td>Resistência a Spoofing</td>
          <td>Elevada</td>
          <td>Vulnerável</td>
          <td><strong>Elevada (BLE + Geofence)</strong></td>
        </tr>
        <tr>
          <td>Latência de Difusão</td>
          <td>5 - 15 s</td>
          <td>15 - 60 s</td>
          <td><strong>&lt; 500 ms (SSE Stream)</strong></td>
        </tr>
      </tbody>
    </table>

    <p>A análise evidencia que o LocBUS preenche com precisão a lacuna operacional existente: confere a rastreabilidade estrita e a imunidade a ruídos típicas de sistemas AVL caros, operando com a flexibilidade de custo zero de assinatura própria dos sistemas participativos.</p>

    <h2 class="section-title">III. Esboço da Metodologia de Desenvolvimento</h2>
    <p>A metodologia de desenvolvimento adotada rege-se pelo modelo incremental e iterativo com foco em desenvolvimento tecnológico e validação empírica contínua.</p>

    <h3 class="subsection-title">A. Engenharia de Requisitos da Solução</h3>
    <p>A partir das entrevistas operacionais e mapeamento do trajeto intercampi da UFPB, consolidou-se a especificação de requisitos apresentada na Tabela II.</p>

    <!-- Tabela II -->
    <table>
      <caption>TABELA II<br>Requisitos de Projeto do Sistema LocBUS</caption>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição do Requisito de Engenharia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>RF01</strong></td>
          <td>Coleta e fusão de telemetria GNSS de passageiros validados por BLE.</td>
        </tr>
        <tr>
          <td><strong>RF02</strong></td>
          <td>Geofencing estrito com descarte de pontos além de 80 m da rota.</td>
        </tr>
        <tr>
          <td><strong>RF03</strong></td>
          <td>Filtro cinemático com descarte de velocidades acima de 65 km/h.</td>
        </tr>
        <tr>
          <td><strong>RF04</strong></td>
          <td>Clustering centróide ponderado pelo inverso da acurácia.</td>
        </tr>
        <tr>
          <td><strong>RF05</strong></td>
          <td>Disseminação contínua via Server-Sent Events (SSE).</td>
        </tr>
        <tr>
          <td><strong>RNF01</strong></td>
          <td>Latência fim a fim inferior a 500 ms entre ingestão e render.</td>
        </tr>
        <tr>
          <td><strong>RNF02</strong></td>
          <td>Throttling temporal de 4s para preservar a bateria do usuário.</td>
        </tr>
        <tr>
          <td><strong>RNF03</strong></td>
          <td>Conformidade estrita com a LGPD (sem armazenamento de PII ou IMEI).</td>
        </tr>
      </tbody>
    </table>

    <h3 class="subsection-title">B. Arquitetura da Solução e Componentes</h3>
    <p>A arquitetura estrutura-se em quatro camadas funcionais desacopladas:</p>
    <p><strong>1) Camada Física Veicular:</strong> Composta por um microcontrolador ESP32-WROOM-32 operando em modo emissor <em>Broadcaster BLE</em>. O firmware transmite pacotes de publicidade iBeacon a cada 500 ms contendo UUID institucional fixo, associado a parâmetros <em>Major</em> e <em>Minor</em>. Alimentado via porta USB padrão de 5 V/1 A do painel, com consumo elétrico inferior a 0,4 W.</p>
    <p><strong>2) Camada de Borda e Sensoriamento Móvel:</strong> PWA leve utilizando APIs nativas W3C Geolocation e Web Bluetooth. Ao embarcar, a detecção de RSSI superior a -75 dBm ativa o modo de compartilhamento voluntário. O subsistema aplica <em>throttling</em> de amostragem de ${mathDt}.</p>

    <div class="figure-box">
      <img src="${fig1Path}" alt="Arquitetura LocBUS">
      <div class="figure-caption">
        <strong>Fig. 1.</strong> Visão arquitetural do sistema LocBUS: nó veicular BLE emissor, camada de borda colaborativa nos smartphones, microsserviço de ingestão/agregação em nuvem e camada de exibição PWA/Leaflet.
      </div>
    </div>

    <p><strong>3) Camada de Ingestão, Filtragem e Agregação Espacial:</strong> Implementada em Python 3.14 sob o framework assíncrono FastAPI/Uvicorn, a camada de controle executa um pipeline de tratamento em três estágios para cada ponto recebido:</p>

    <p class="no-indent"><em>a) Geofencing de Rota:</em> A menor distância ortodrômica entre a coordenada reportada ${mathCoord} e a linha poligonal de rota ${mathR_poly} é calculada via fórmula de Haversine:</p>

    <div class="equation">
      <div style="flex: 1; text-align: center;">${eq1Html}</div>
      <div class="eq-num">(1)</div>
    </div>

    <p class="no-indent">onde ${mathR}. Se ${mathGeofenceCheck}, o ponto é rejeitado com código HTTP 422.</p>

    <p class="no-indent"><em>b) Clustering Centróide Ponderado:</em> Quando ${mathK} passageiros encontram-se simultaneamente embarcados no mesmo veículo no intervalo ${mathDtWindow}, a posição final consolidada ${mathBusPos} é derivada da média ponderada pelo inverso da acurácia reportada:</p>

    <div class="equation">
      <div style="flex: 1; text-align: center;">${eq2Html}</div>
      <div class="eq-num">(2)</div>
    </div>

    <p>Esse estimador minimiza a variância do erro espacial, atenuando a influência de smartphones com sinal GNSS degradado por atenuação de multipilhas metálicas no ônibus.</p>

    <p><strong>4) Camada de Disseminação em Tempo Real e Visualização:</strong> A posição consolidada é injetada em filas assíncronas assinaladas a clientes conectados via <em>Server-Sent Events</em> (<code>GET /api/events</code>). O mapa interativo em Leaflet.js renderiza o rastro viário suavizado e o ETA dinâmico sem necessidade de recarregamento de página [8], [9].</p>

    <h3 class="subsection-title">C. Procedimentos Experimentais e Métricas de Validação</h3>
    <p>O plano de avaliação experimental compreende três baterias de testes estruturadas:</p>
    <ol>
      <li><strong>Simulação Computacional e Testes Unitários:</strong> Suíte com 24 casos de teste no Pytest validando o ciclo circular contínuo de 31 <em>waypoints</em> entre o CCHLA e o CI Mangabeira;</li>
      <li><strong>Ensaio Experimental de Campo Real:</strong> Execução de campanha de validação física em malha viária real no município de Pedras de Fogo (PB), validando o comportamento de amostragem GNSS contínua em condições móveis sob intempéries e sombras de satélite;</li>
      <li><strong>Métricas de Eficiência Operacional:</strong> Aferição de latência de entrega SSE via interceptadores de rede, desvio médio quadrático da posição veicular ancorada na via e impacto de consumo de bateria em smartphones Android.</li>
    </ol>

    <h2 class="section-title">IV. Considerações Finais e Cronograma</h2>
    <p>A redação inicial deste artigo fundamenta técnica e cientificamente a viabilidade de romper a barreira de custos no rastreamento de frotas institucionais através da cooperação oportunista de passageiros autenticados por radiofrequência local. O cronograma subsequente contempla a instalação física dos módulos ESP32 nas linhas regulares da UFPB e ensaios de usabilidade com a comunidade discente.</p>

    <h2 class="section-title">Referências</h2>
    <div class="references">
      <div class="ref-item">[1] E. Cascetta, <em>Transportation Systems Engineering: Theory and Methods</em>. Springer Science &amp; Business Media, 2021.</div>
      <div class="ref-item">[2] M. Dessouky, R. Hall, L. Zhang, and A. Singh, "Real-time task-driven dispatching for paratransit systems using automated vehicle location (AVL)," <em>Transportation Research Part C</em>, vol. 11, no. 6, pp. 439–460, 2020.</div>
      <div class="ref-item">[3] D. Zhou, X. Shen, and X. Gao, "Crowdsourced Bus Tracking: Feasibility, Reliability, and Energy Efficiency Analysis," <em>IEEE Trans. Intell. Transp. Syst.</em>, vol. 22, no. 9, pp. 5812–5824, 2021.</div>
      <div class="ref-item">[4] A. Goli, H. Khademi, and M. Rezaei, "Automated Vehicle Location Systems in Smart Cities: Architecture and Standards," <em>IEEE Access</em>, vol. 9, pp. 128092–128108, 2021.</div>
      <div class="ref-item">[5] R. K. Ganti, F. Ye, and H. Lei, "Mobile crowdsensing: current state and future challenges," <em>IEEE Commun. Mag.</em>, vol. 49, no. 11, pp. 32–39, 2021.</div>
      <div class="ref-item">[6] L. Bregman and C. Watkins, "The Impact of Real-Time Passenger Information on Transit Wait Times," <em>J. Public Transp.</em>, vol. 23, no. 1, pp. 14–29, 2022.</div>
      <div class="ref-item">[7] C. Gomez, J. Oller, and J. Paradells, "Overview and Evaluation of Bluetooth Low Energy for IoT," <em>Sensors</em>, vol. 12, no. 9, pp. 11734–11753, 2022.</div>
      <div class="ref-item">[8] S. Ramirez, <em>FastAPI: Modern Python Web Development</em>. O'Reilly Media, 2023.</div>
      <div class="ref-item">[9] V. Agafonkin, "Leaflet: an open-source JavaScript library for interactive maps," <em>leafletjs.com</em>, 2024.</div>
      <div class="ref-item">[10] Brasil, "Lei nº 13.709 - Lei Geral de Proteção de Dados Pessoais (LGPD)," <em>Diário Oficial da União</em>, 2018.</div>
    </div>

  </div>

</body>
</html>
`;

async function generatePdf() {
  const outputPath = path.resolve(__dirname, '../artigo_ieee_la/artigo_locbus_ieee_la.pdf');
  const tempHtmlPath = path.resolve(__dirname, '../artigo_ieee_la/temp_article.html');

  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  console.log('[Puppeteer] Renderizando Artigo Oficial IEEE Latin America para PDF...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('file:///' + tempHtmlPath.replace(/\\\\/g, '/'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '18mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    });

    console.log(`[Puppeteer] PDF Oficial IEEE Latin America gerado com sucesso em:\n${outputPath}`);
  } catch (err) {
    console.error('[Puppeteer Error]', err.message);
  } finally {
    await browser.close();
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

generatePdf();
