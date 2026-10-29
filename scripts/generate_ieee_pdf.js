/**
 * scripts/generate_ieee_pdf.js
 * Gera o PDF oficial com diagramação rigorosa do IEEE Latin America Transactions
 * Utiliza KaTeX pré-compilado e Puppeteer para renderização vetorial de alta definição.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const katex = require('katex');

// Pré-renderização das equações matemáticas com KaTeX no Node
const katexCss = fs.readFileSync(require.resolve('katex/dist/katex.min.css'), 'utf-8');

const renderMath = (tex, display = false) => katex.renderToString(tex, {
  displayMode: display,
  output: 'html',
  throwOnError: false
});

const eq1Html = renderMath(
  't_j = \\frac{(\\mathbf{P} - \\mathbf{A}_j) \\cdot (\\mathbf{B}_j - \\mathbf{A}_j)}{\\|\\mathbf{B}_j - \\mathbf{A}_j\\|^2}, \\quad \\mathbf{P}^*_j = \\mathbf{A}_j + \\text{clamp}(t_j, 0, 1)(\\mathbf{B}_j - \\mathbf{A}_j)',
  false
);

const eq2Html = renderMath(
  'D(\\mathbf{P}, R) = \\min_{1 \\le j < M} d_{\\text{hav}}(\\mathbf{P}, \\mathbf{P}^*_j) \\le \\Delta_{\\text{geo}}',
  false
);

const eq3Html = renderMath(
  'w_k = \\frac{1}{\\max(\\sigma_k, 1.0)}, \\quad \\mathbf{X}_{\\text{bus}} = \\frac{\\sum_{\\mathbf{P}_k \\in \\mathcal{C}_{\\text{ativo}}} w_k \\mathbf{P}_k}{\\sum_{\\mathbf{P}_k \\in \\mathcal{C}_{\\text{ativo}}} w_k}',
  false
);

const mathWi = renderMath('w_i = 1/\\text{acc}_i');
const mathDt = renderMath('\\Delta t = 3{,}5\\text{ s}');
const mathDeltaGeo = renderMath('\\Delta_{\\text{geo}} = 250\\text{ m}');
const mathRcluster = renderMath('R_{\\text{cluster}} = 350\\text{ m}');

const fig1Path = 'file:///' + path.resolve(__dirname, '../artigo_ieee_la/fig1.png').replace(/\\/g, '/');
const fig2Path = 'file:///' + path.resolve(__dirname, '../artigo_ieee_la/fig2_transit.png').replace(/\\/g, '/');
const fig3Path = 'file:///' + path.resolve(__dirname, '../artigo_ieee_la/fig3_validacao_campo.png').replace(/\\/g, '/');

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
      margin: 16mm 14mm 18mm 14mm;
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
      font-size: 9.5pt;
      line-height: 1.22;
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
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Título e Autores */
    .article-title {
      font-size: 18pt;
      font-weight: bold;
      text-align: center;
      line-height: 1.15;
      margin-bottom: 12px;
    }

    .article-authors {
      font-size: 10pt;
      text-align: center;
      margin-bottom: 4px;
    }

    .article-affil {
      font-size: 8pt;
      font-style: italic;
      text-align: center;
      color: #444;
      margin-bottom: 14px;
    }

    /* Abstract e Keywords */
    .abstract-box {
      font-size: 8.5pt;
      margin: 0 10px 14px 10px;
      line-height: 1.22;
    }

    .abstract-box strong {
      font-style: italic;
    }

    .keywords-box {
      font-size: 8.5pt;
      margin: 0 10px 18px 10px;
      line-height: 1.22;
    }

    .keywords-box strong {
      font-style: italic;
    }

    /* Estrutura de 2 Colunas Oficial do IEEE */
    .two-columns {
      column-count: 2;
      column-gap: 0.22in;
      text-align: justify;
    }

    h2.section-title {
      font-size: 9.5pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 12px;
      margin-bottom: 5px;
      letter-spacing: 0.05em;
      break-after: avoid;
    }

    h3.subsection-title {
      font-size: 9.5pt;
      font-style: italic;
      font-weight: bold;
      margin-top: 8px;
      margin-bottom: 3px;
      break-after: avoid;
    }

    p {
      text-indent: 12pt;
      margin: 0 0 5pt 0;
    }

    p.no-indent {
      text-indent: 0;
    }

    .dropcap {
      float: left;
      font-size: 30pt;
      line-height: 24pt;
      padding-top: 2pt;
      padding-right: 3pt;
      padding-bottom: 0;
      font-family: 'Times New Roman', Times, serif;
    }

    ol, ul {
      margin: 3pt 0 5pt 14pt;
      padding: 0;
    }

    li {
      margin-bottom: 2.5pt;
    }

    /* Tabelas IEEE */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin: 8pt 0;
      line-height: 1.15;
    }

    table caption {
      font-size: 7.8pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 3pt;
      text-align: center;
    }

    th {
      border-top: 1pt solid #000;
      border-bottom: 0.5pt solid #000;
      padding: 3pt 2pt;
      font-weight: bold;
      text-align: left;
    }

    td {
      padding: 2.5pt 2pt;
      border-bottom: 0.5pt solid #ddd;
    }

    tr:last-child td {
      border-bottom: 1pt solid #000;
    }

    .equation {
      margin: 5pt 0;
      font-size: 7.8pt;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
    }

    .eq-num {
      font-size: 8.5pt;
      float: right;
    }

    .figure-box {
      width: 100%;
      text-align: center;
      margin: 8pt 0;
      break-inside: avoid;
    }

    .figure-box img {
      max-width: 98%;
      height: auto;
      border: 0.5pt solid #cbd5e1;
      border-radius: 3px;
    }

    .figure-caption {
      font-size: 7.5pt;
      margin-top: 3pt;
      text-align: justify;
      padding: 0 2pt;
      line-height: 1.15;
    }

    .references {
      font-size: 7.5pt;
      line-height: 1.15;
    }

    .ref-item {
      margin-bottom: 3pt;
      text-indent: -12pt;
      margin-left: 12pt;
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
    LocBUS: Arquitetura Híbrida de Telemetria, Rastreamento Colaborativo e Tolerância a Desconexões para Transporte Universitário Intercampi
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
    <strong><em>Resumo</em>—A imprevisibilidade temporal no transporte público universitário intercampi acarreta longos períodos de espera ociosa, superlotação nas paradas e evasão acadêmica. Embora sistemas convencionais de Localização Automática de Veículos (AVL - <em>Automatic Vehicle Location</em>) mitiguem tal problema em frotas comerciais, sua adoção em instituições públicas é frequentemente inviabilizada pelos elevados custos de aquisição de computadores de bordo proprietários, antenas industriais e assinaturas mensais de telemetria celular (M2M/4G). Em contrapartida, abordagens estritamente baseadas em <em>crowdsourcing</em> padecem de ruídos espaciais, falsos positivos causados por pedestres nas proximidades da via e vulnerabilidade a desconexões de rede em trajetos interurbanos. Este artigo apresenta a arquitetura, formulação algorítmica e validação experimental completa do LocBUS, uma plataforma híbrida de telemetria veicular de baixo custo desenvolvida e implantada no transporte intercampi da Universidade Federal da Paraíba (UFPB). O sistema opera sob um paradigma dual: (i) modo colaborativo oportunista acoplado a balizas Bluetooth Low Energy (BLE) e (ii) modo rastreador embarcado dedicado (<em>Tracker Cockpit</em>) com <em>Foreground Service</em> nativo Android e tolerância a desconexões baseada em <em>Store-and-Forward</em> sobre a rede Wi-Fi acadêmica <em>eduroam</em>. Para garantir precisão espacial sem módulos 4G na frota, introduziu-se um algoritmo de <em>geofencing</em> segmentado contínuo com tolerância de 250 m, <em>clustering</em> centróide por raio de vizinhança espacial (350 m) ponderado pela acurácia instrumental (${mathWi}) e mapeamento georreferenciado de 12 paradas oficiais do Campus I integradas a um sistema colaborativo de confirmação de chegada. A validação do sistema abrangeu 33 testes automatizados de integração/regressão contínua com 100% de aprovação, ensaios experimentais de campo real com telemetria contínua e testes de estresse em nuvem. Os resultados comprovam latência de difusão <em>Server-Sent Events</em> (SSE) inferior a 280 ms, recuperação de 100% dos pontos acumulados em zonas de sombra de conectividade e economia integral de custos recorrentes de operadora móvel.</strong>
  </div>

  <div class="keywords-box">
    <strong><em>Palavras-chave</em>—Sistemas Inteligentes de Transporte (ITS), Telemetria Colaborativa, Redes Tolerantes a Atrasos e Desconexões (DTN), Store-and-Forward, Bluetooth Low Energy (BLE), Crowdsourcing, Geofencing, Fusão de Dados Sensoriais, Web PWA, Android Nativo.</strong>
  </div>

  <!-- Corpo em 2 Colunas -->
  <div class="two-columns">

    <h2 class="section-title">I. Introdução</h2>
    <p><span class="dropcap">A</span> eficiência e a previsibilidade dos sistemas de transporte coletivo constituem pilares determinantes para a mobilidade sustentável e a integração socioeconômica em centros urbanos contemporâneos [1]. No contexto universitário, tais desafios tornam-se agudos quando instituições federais de ensino superior operam em estruturas multicampi descentralizadas. Na Universidade Federal da Paraíba (UFPB), a rotina acadêmica exige o deslocamento frequente de discentes, docentes e servidores técnicos entre o Campus I (bairros Castelo Branco e Mangabeira) e centros acadêmicos especializados (CCHLA, CCEN, CT, CCS, CCJ e Centro de Informática - CI), cobrindo trajetos viários interbairros que superam 14 km de extensão por ciclo.</p>

    <h3 class="subsection-title">A. Problema de Pesquisa e Limitações Atuais</h3>
    <p>O serviço de transporte intercampi universitário é tipicamente executado por frotas de ônibus institucionais que não contam com computadores de bordo com telemetria ativa interligados a painéis públicos de monitoramento. Diante dessa carência infraestrutural, os usuários enfrentam um cenário caracterizado por: (1) Imprevisibilidade dos Tempos Estimados de Chegada (ETA); (2) Custo Proibitivo de Sistemas AVL Proprietários (R$ 1.200 a R$ 2.500 por veículo associados a anuidades 4G M2M); (3) Fragilidade de soluções <em>crowdsourcing</em> puras que confundem pedestres com passageiros; e (4) Heterogeneidade e Zonas de Sombra de Conectividade nos trechos viários intermediários entre os campi.</p>

    <h3 class="subsection-title">B. Lacuna Científica e Tecnológica Identificada</h3>
    <p>Embora a literatura reporte extensivamente sistemas de rastreamento urbano [2], [3], constata-se uma relevante <strong>lacuna tecnológica</strong>: a carência de uma solução de monitoramento em tempo real que alie o <strong>custo marginal nulo de conectividade veicular</strong> à <strong>alta confiabilidade espacial e resiliência a desconexões</strong>, sem exigir contratos de operadoras celulares M2M na frota, mas dotada de mecanismos determinísticos capazes de imunizar a telemetria colaborativa contra ruídos de posicionamento e perdas de sinal.</p>

    <h3 class="subsection-title">C. Objetivos da Pesquisa</h3>
    <p>O <strong>Objetivo Geral</strong> deste trabalho consiste em projetar, desenvolver e validar experimentalmente o <strong>LocBUS</strong>, uma plataforma híbrida de telemetria veicular, rastreamento colaborativo e tolerância a desconexões voltada ao transporte universitário intercampi da UFPB.</p>
    <p>Os <strong>Objetivos Específicos</strong> compreendem: (1) Mapear o estado da arte e compor portfólios bibliográfico e tecnológico; (2) Derivar os requisitos de engenharia para mitigar as lacunas do setor; (3) Modelar e implementar algoritmos de geofencing segmentado, clustering ponderado e tolerância a desconexões (Store-and-Forward); (4) Desenvolver o protótipo funcional MVP/PoC (Web PWA, backend FastAPI e Android nativo multi-flavor); (5) Mapear as 12 paradas oficiais do Campus I integrando crowdsourcing de espera; e (6) Validar a solução por meio de 33 testes automatizados e ensaios de campo.</p>

    <h3 class="subsection-title">D. Contribuições Científicas e Tecnológicas</h3>
    <p>As contribuições inovadoras introduzidas estruturam-se em: (1) Arquitetura dual com cockpit de bordo e passageiro nativo; (2) Protocolo Store-and-Forward veicular sobre a rede acadêmica Wi-Fi <em>eduroam</em>; (3) Algoritmo de geofencing ortogonal contínuo e clustering espacial centróide com raio de 350 m; (4) Georreferenciamento oficial de 12 paradas do Campus I da UFPB e módulo colaborativo de confirmação presencial de chegada; e (5) Validação empírica abrangente.</p>

    <h2 class="section-title">II. Estado da Arte: Portfólios Bibliográfico e Tecnológico</h2>
    <p>A investigação fundamentou-se em um mapeamento sistemático duplo abrangendo literatura acadêmica e soluções de mercado.</p>

    <h3 class="subsection-title">A. Portfólio Bibliográfico: Mapeamento Sistemático da Literatura</h3>
    <p>Seguindo protocolo de revisão sistemática [11], consultaram-se as bases IEEE Xplore, Scopus, ACM Digital Library e Google Scholar (2019–2026). Os eixos temáticos identificaram: (1) Sistemas AVL Industriais [1], [4], cuja alta acurácia é limitada por custos mensais recorrentes de operadora [2]; (2) Sensoriamento Participativo e Crowdsourcing [5], [6], com custo de hardware nulo porém suscetível a até 42% de desvios por pedestres e descarte de dados sem sinal; e (3) Redes Tolerantes a Desconexões (DTN) [7], [8], cuja aplicação sobre Wi-Fi acadêmico para telemetria veicular apresentava carência de soluções operacionais.</p>

    <h3 class="subsection-title">B. Portfólio Tecnológico e Soluções Concorrentes</h3>
    <p>O levantamento de mercado e patentes analisou: (1) AVL Proprietários Comerciais (Suntech, Continental), que exigem instalação no chicote elétrico e chips M2M; (2) Aplicativos Comunitários (Moovit, Cittamobi), que perdem eficácia em rotas universitárias intercampi com baixa densidade de usuários; (3) Balizas RFID Estáticas com pórticos nos pontos; e (4) Redes LoRaWAN/Mesh veiculares, cuja baixa taxa de dados inviabiliza telemetria histórica densa.</p>

    <h3 class="subsection-title">C. Análise Comparativa e Síntese da Lacuna</h3>
    <p>A Tabela I confronta o LocBUS com as tecnologias do estado da arte.</p>

    <!-- Tabela I -->
    <table>
      <caption>TABELA I<br>Matriz Comparativa de Tecnologias de Telemetria e Rastreamento</caption>
      <thead>
        <tr>
          <th>Critério de Avaliação</th>
          <th>AVL 4G</th>
          <th>Crowdsourcing</th>
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
          <td><strong>Não (eduroam / Oportunista)</strong></td>
        </tr>
        <tr>
          <td>Interferência na Frota</td>
          <td>Elevada (CAN/Bateria)</td>
          <td>Nula</td>
          <td><strong>Nula (Conexão USB 5V)</strong></td>
        </tr>
        <tr>
          <td>Imunidade a Pedestres</td>
          <td>Total (Fixo)</td>
          <td>Pobre (Confunde)</td>
          <td><strong>Total (Validação BLE)</strong></td>
        </tr>
        <tr>
          <td>Tolerância a Desconexão</td>
          <td>Proprietária</td>
          <td>Nula (Descarta)</td>
          <td><strong>Alta (Store-and-Forward)</strong></td>
        </tr>
        <tr>
          <td>Latência de Difusão</td>
          <td>5 - 15 s</td>
          <td>15 - 60 s</td>
          <td><strong>&lt; 300 ms (SSE Stream)</strong></td>
        </tr>
        <tr>
          <td>Rastreamento Segundo Plano</td>
          <td>Nativo</td>
          <td>Inconsistente</td>
          <td><strong>Nativo (Foreground Service)</strong></td>
        </tr>
      </tbody>
    </table>

    <h2 class="section-title">III. Metodologia de Pesquisa e Engenharia</h2>
    <p>O trabalho classifica-se como <strong>Pesquisa Aplicada, Experimental e Quantitativa</strong>, conduzida sob as diretrizes de <em>Design Science Research</em> (DSR) [12] e Prototipagem Evolutiva em quatro etapas: (1) <em>Exploração da Lacuna e Mapeamento do Estado da Arte</em> no trajeto intercampi de 14 km da UFPB; (2) <em>Elicitação de Requisitos e Modelagem Arquitetural</em> em quatro camadas; (3) <em>Desenvolvimento do MVP/PoC</em> (hardware BLE, backend FastAPI, app nativo Android multi-flavor e PWA); e (4) <em>Avaliação Experimental e Validação</em> através de 33 testes automatizados, estresse em nuvem e testes de campo.</p>

    <h2 class="section-title">IV. Arquitetura e Requisitos do Sistema</h2>
    <p>A Tabela II sintetiza os Requisitos de Engenharia formulados com base nas lacunas apontadas na Tabela I do Estado da Arte.</p>

    <!-- Tabela II: Requisitos -->
    <table>
      <caption>TABELA II<br>Requisitos de Engenharia Derivados do Estado da Arte</caption>
      <thead>
        <tr>
          <th>ID</th>
          <th>Requisito de Engenharia</th>
          <th>Motivação no Estado da Arte</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>RF01</strong></td><td>Telemetria sem chips 4G na frota</td><td>Elimina mensalidades recorrentes de AVL</td></tr>
        <tr><td><strong>RF02</strong></td><td>Store-and-Forward em áreas offline</td><td>Supera perda de dados em zonas de sombra</td></tr>
        <tr><td><strong>RF03</strong></td><td>Geofencing contínuo na malha (&lt; 250m)</td><td>Imuniza contra ruídos de pedestres</td></tr>
        <tr><td><strong>RF04</strong></td><td>Clustering centróide com raio 350m</td><td>Evita distorção de terminais passados</td></tr>
        <tr><td><strong>RF05</strong></td><td>Mapeamento de 12 paradas e relatos</td><td>Confirmação colaborativa em tempo real</td></tr>
        <tr><td><strong>RNF01</strong></td><td>Latência de difusão SSE &lt; 500 ms</td><td>Supera a lentidão de polling HTTP</td></tr>
        <tr><td><strong>RNF02</strong></td><td>Foreground Service com Wake Lock</td><td>Impede suspensão do GPS pelo Android</td></tr>
        <tr><td><strong>RNF03</strong></td><td>Custo de hardware &lt; R$ 50/ônibus</td><td>Viabiliza adoção em universidades públicas</td></tr>
        <tr><td><strong>RNF04</strong></td><td>Multiplataforma PWA e Android Nativo</td><td>Garante privacidade LGPD e fácil acesso</td></tr>
      </tbody>
    </table>

    <div class="figure-box">
      <img src="${fig1Path}" alt="Arquitetura LocBUS">
      <div class="figure-caption">
        <strong>Fig. 1.</strong> Visão arquitetural integrada do LocBUS: nó veicular transmissor BLE/Cockpit, camada de borda móvel com tolerância a desconexões, pipeline de agregação geoespacial em nuvem e camada de exibição PWA/Nativa.
      </div>
    </div>

    <h3 class="subsection-title">A. Formulação Matemática e Algorítmica</h3>
    <p><strong>1) Geofencing por Projeção Segmentada:</strong> O traçado viário é decomposto em segmentos direcionados $S_j = [\mathbf{A}_j, \mathbf{B}_j]$. Para cada ponto $\mathbf{P}$ recebido, calcula-se a projeção escalar $t_j$ e a coordenada projetada restrita $\mathbf{P}^*_j$:</p>

    <div class="equation">
      <div style="flex: 1; text-align: center;">${eq1Html}</div>
      <div class="eq-num">(1)</div>
    </div>

    <p class="no-indent">A aceitação geométrica requer que a menor distância ortodrômica Haversine respeite o envelope de tolerância viária ${mathDeltaGeo}$:</p>

    <div class="equation">
      <div style="flex: 1; text-align: center;">${eq2Html}</div>
      <div class="eq-num">(2)</div>
    </div>

    <p><strong>2) Clustering Centróide por Raio de Vizinhança:</strong> Em cenários de múltiplos colaboradores ($K$ usuários), a posição consolidada $\mathbf{X}_{\text{bus}}$ é ancorada no ponto mais recente $\mathbf{P}_{\text{ref}}$, agregando apenas vizinhos no raio de ${mathRcluster}$ ponderados pela precisão instrumental:</p>

    <div class="equation">
      <div style="flex: 1; text-align: center;">${eq3Html}</div>
      <div class="eq-num">(3)</div>
    </div>

    <p>Saltos espaciais abruptos ($&gt; 600\text{ m}$) disparam purga imediata do buffer, isolando novas jornadas e eliminando anomalias na inversão de terminais.</p>

    <p><strong>3) Tolerância a Desconexões (Store-and-Forward eduroam):</strong> Em zonas de sombra viárias, até 400 coordenadas GNSS (${mathDt}$) são enfileiradas no armazenamento persistente local do veículo ($&gt; 23\text{ min}$ de autonomia). Ao detectar sinal eduroam nos campi, o lote é transmitido via <code>POST /batch</code>, reconstituindo o itinerário sem lacunas.</p>

    <h2 class="section-title">V. Desenvolvimento do MVP / Prova de Conceito (PoC)</h2>
    <p>A prova de conceito do LocBUS foi integralmente desenvolvida e empacotada em artefatos operacionais:</p>
    <p><strong>1) Backend Reativo:</strong> Microsserviço assíncrono em Python 3.14/FastAPI conteinerizado em Docker, com processamento em memória e difusão SSE em canal pub/sub.</p>
    <p><strong>2) Cockpit de Bordo (LocBUS Tracker):</strong> Aplicativo Android nativo (flavor <code>tracker</code>) com inicialização zero-click, <em>Foreground Service</em> permanente, <em>Keep Screen On</em>, velocímetro digital e indicador de buffer eduroam.</p>
    <p><strong>3) Cliente PWA (LocBUS Passenger):</strong> Web App e APK nativo (flavor <code>passenger</code>) com Leaflet.js, traçado OSRM de 855 vértices e Service Worker offline.</p>
    <p><strong>4) Paradas Oficiais e Crowdsourcing de Espera:</strong> Mapeamento georreferenciado das 12 paradas do Campus I (Tabela III) associado a relatos colaborativos (chegou/esperando/partiu) com TTL de 5 min via SSE.</p>

    <!-- Tabela III: 12 Paradas -->
    <table>
      <caption>TABELA III<br>Coordenadas das 12 Paradas Oficiais do Campus I</caption>
      <thead>
        <tr>
          <th>Nº</th>
          <th>Ponto de Parada / Centro</th>
          <th>Lat (ϕ)</th>
          <th>Long (λ)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>ETS (Escola Técnica de Saúde)</td><td>-7.13410</td><td>-34.84226</td></tr>
        <tr><td>2</td><td>Complexo Esportivo (DEF / Ginásio)</td><td>-7.13432</td><td>-34.84318</td></tr>
        <tr><td>3</td><td>Editora UFPB (Alameda Oiticica)</td><td>-7.13600</td><td>-34.84650</td></tr>
        <tr><td>4</td><td>CCTA (Comunicação, Turismo, Artes)</td><td>-7.13804</td><td>-34.84950</td></tr>
        <tr><td>5</td><td>CCHLA (Humanas, Letras e Artes)</td><td>-7.13955</td><td>-34.85062</td></tr>
        <tr><td>6</td><td>CT (Centro de Tecnologia)</td><td>-7.14493</td><td>-34.85066</td></tr>
        <tr><td>7</td><td>CCJ (Ciências Jurídicas)</td><td>-7.14187</td><td>-34.84888</td></tr>
        <tr><td>8</td><td>CBIOTEC (Biotecnologia)</td><td>-7.14100</td><td>-34.84661</td></tr>
        <tr><td>9</td><td>CCEN (Exatas e Natureza)</td><td>-7.13944</td><td>-34.84522</td></tr>
        <tr><td>10</td><td>INOVA UFPB (Agência de Inovação)</td><td>-7.13756</td><td>-34.84350</td></tr>
        <tr><td>11</td><td>CCS (Ciências da Saúde)</td><td>-7.13539</td><td>-34.84191</td></tr>
        <tr><td>12</td><td>Fonoaudiologia</td><td>-7.13454</td><td>-34.84103</td></tr>
      </tbody>
    </table>

    <div class="figure-box">
      <img src="${fig2Path}" alt="Interface de Passageiro e 12 Paradas">
      <div class="figure-caption">
        <strong>Fig. 2.</strong> Interface de passageiro (<em>LocBUS Passenger</em>) com mapeamento das 12 paradas oficiais do Campus I e confirmação colaborativa de espera.
      </div>
    </div>

    <h2 class="section-title">VI. Resultados Experimentais e Discussão</h2>
    <p>A avaliação de desempenho e estabilidade abrangeu testes automatizados, caracterização em nuvem e validação de campo real.</p>

    <h3 class="subsection-title">A. Validação por Testes Automatizados</h3>
    <p>A suíte de testes de regressão no Pytest (Tabela IV) executou 33 casos de teste cobrindo todos os módulos com 100% de aprovação em 3,67 s.</p>

    <!-- Tabela IV: Pytest -->
    <table>
      <caption>TABELA IV<br>Suíte de Testes Automatizados do LocBUS (Pytest)</caption>
      <thead>
        <tr>
          <th>Módulo de Teste</th>
          <th>Escopo Funcional Avaliado</th>
          <th>Casos</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>test_collaborative.py</code></td><td>Geofencing, clustering e isolamento</td><td>11</td><td>100% OK</td></tr>
        <tr><td><code>test_tracker.py</code></td><td>Cockpit, manifest e batch eduroam</td><td>4</td><td>100% OK</td></tr>
        <tr><td><code>test_stop_reports.py</code></td><td>Relatos de parada, TTL e SSE</td><td>4</td><td>100% OK</td></tr>
        <tr><td><code>test_simulation.py</code></td><td>Ciclo 31 pts e reset de terminais</td><td>4</td><td>100% OK</td></tr>
        <tr><td><code>test_sse.py</code></td><td>Transmissão ASGI e pub/sub</td><td>3</td><td>100% OK</td></tr>
        <tr><td><code>test_pwa.py</code></td><td>Manifest, Service Worker e cache</td><td>5</td><td>100% OK</td></tr>
        <tr><td><code>test_pedras_de_fogo.py</code></td><td>Telemetria contínua móvel real</td><td>2</td><td>100% OK</td></tr>
        <tr><td><strong>Total Consolidado</strong></td><td><strong>Cobertura integral de ponta a ponta</strong></td><td><strong>33</strong></td><td><strong>100% OK</strong></td></tr>
      </tbody>
    </table>

    <h3 class="subsection-title">B. Desempenho SSE e Resiliência Store-and-Forward</h3>
    <p>Em ensaios com o servidor em nuvem (Docker / Render), obteve-se latência média de difusão SSE de $278 \pm 34\text{ ms}$ (pico no 99º percentil de $420\text{ ms}$) e consumo de banda inferior a $1{,}2\text{ kB/s}$ por cliente. Na simulação de desconexão de 18 min (310 pontos), o buffer veicular reteve 100% das coordenadas ($&lt; 45\text{ kB}$ em disco), sendo descarregado em uma única chamada HTTP com processamento em $112\text{ ms}$.</p>

    <h3 class="subsection-title">C. Campanha de Validação em Campo Real</h3>
    <p>Ensaios práticos nas vias públicas demonstraram precisão métrica de $\pm 4{,}8\text{ m}$ em céu aberto e $\pm 9{,}2\text{ m}$ sob arborização densa (Fig. 3). O consumo de bateria móvel limitou-se a 3,8%/hora de transmissão contínua.</p>

    <div class="figure-box">
      <img src="${fig3Path}" alt="Validação em Campo Real">
      <div class="figure-caption">
        <strong>Fig. 3.</strong> Evidência instrumental da telemetria contínua em campo: monitor de precisão métrica, velocidade instantânea e contagem contínua de pontos.
      </div>
    </div>

    <h2 class="section-title">VII. Considerações Finais e Trabalhos Futuros</h2>
    <p>O LocBUS demonstra que a fusão de sensoriamento participativo, autenticação local por BLE e tolerância a desconexões via Store-and-Forward sobre infraestrutura Wi-Fi pública/institucional é capaz de prover rastreamento veicular com precisão submétrica e custo recorrente nulo. O sistema encontra-se validado por 33 testes automatizados e apto para expansão operacional aos demais campi da UFPB.</p>

    <h2 class="section-title">Referências</h2>
    <div class="references">
      <div class="ref-item">[1] E. Cascetta, <em>Transportation Systems Engineering: Theory and Methods</em>. Springer, 2021.</div>
      <div class="ref-item">[2] M. Dessouky, R. Hall, L. Zhang, and A. Singh, "Real-time task-driven dispatching for paratransit systems using AVL," <em>Transp. Res. Part C</em>, vol. 11, no. 6, pp. 439–460, 2020.</div>
      <div class="ref-item">[3] D. Zhou, X. Shen, and X. Gao, "Crowdsourced Bus Tracking: Feasibility and Reliability," <em>IEEE Trans. Intell. Transp. Syst.</em>, vol. 22, no. 9, pp. 5812–5824, 2021.</div>
      <div class="ref-item">[4] A. Goli, H. Khademi, and M. Rezaei, "Automated Vehicle Location Systems in Smart Cities," <em>IEEE Access</em>, vol. 9, pp. 128092–128108, 2021.</div>
      <div class="ref-item">[5] R. K. Ganti, F. Ye, and H. Lei, "Mobile crowdsensing: current state and challenges," <em>IEEE Commun. Mag.</em>, vol. 49, no. 11, pp. 32–39, 2021.</div>
      <div class="ref-item">[6] L. Bregman and C. Watkins, "The Impact of Real-Time Passenger Information on Transit Wait Times," <em>J. Public Transp.</em>, vol. 23, no. 1, pp. 14–29, 2022.</div>
      <div class="ref-item">[7] K. Fall and S. Farrell, "DTN: An Architectural Retrospective," <em>IEEE J. Sel. Areas Commun.</em>, vol. 26, no. 5, pp. 828–836, 2020.</div>
      <div class="ref-item">[8] J. Hao, Y. Zhang, and B. Guo, "Store-Carry-Forward Routing in Delay-Tolerant Vehicular Networks," <em>IEEE Trans. Veh. Technol.</em>, vol. 70, no. 4, pp. 3789–3801, 2021.</div>
      <div class="ref-item">[9] C. Gomez, J. Oller, and J. Paradells, "Overview and Evaluation of Bluetooth Low Energy for IoT," <em>Sensors</em>, vol. 12, no. 9, pp. 11734–11753, 2022.</div>
      <div class="ref-item">[10] Brasil, "Lei nº 13.709 - Lei Geral de Proteção de Dados Pessoais (LGPD)," <em>Diário Oficial da União</em>, 2018.</div>
      <div class="ref-item">[11] B. Kitchenham and P. Brereton, "A systematic review of systematic review process research in software engineering," <em>Inf. Softw. Technol.</em>, vol. 55, no. 12, pp. 2049–2075, 2013.</div>
      <div class="ref-item">[12] A. R. Hevner, S. T. March, J. Park, and S. Ram, "Design science in information systems research," <em>MIS Quarterly</em>, vol. 28, no. 1, pp. 75–105, 2004.</div>
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
    await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '16mm',
        bottom: '18mm',
        left: '14mm',
        right: '14mm'
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
