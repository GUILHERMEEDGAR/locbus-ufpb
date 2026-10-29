# 📋 RELATÓRIO DE ESTADO & CHECKPOINT DA I.A. (LocBUS / Prof3)

> **ATENÇÃO I.A. (LEITURA OBRIGATÓRIA NO INÍCIO DE CADA SESSÃO):**
> Este arquivo é o seu **painel de contexto persistente** e **ponto de restauração**.
> Se você travar, sofrer timeout ou reiniciar a sessão, leia este arquivo imediatamente.
>
> **REGRA DE OURO ANTI-TRAVAMENTO:**
> 1. Raciocínio ágil e direto — sem cadeia de pensamento circular.
> 2. Passos curtos e verificáveis — 1 ou 2 mudanças por vez, sempre testar.
> 3. Atualizar este arquivo ao concluir marcos relevantes.

---

## 1. 🎯 Visão Geral do Projeto
- **Nome**: LocBUS — PoC de Telemetria e Rastreamento Colaborativo de Ônibus Intercampi (UFPB)
- **Aluno/Responsável**: Guilherme Edgar C.S.R. Guedes — Grupo 4 (Frontend & UX)
- **Entregável Acadêmico**: `Atividade_PoC_LocBUS_Guilherme_Guedes.html` — SIGAA / Setembro 2026
- **Tecnologias**:
  - Backend: Python 3.14, FastAPI, Uvicorn, Pydantic v2
  - Frontend: Jinja2, Vanilla JS, CSS próprio (Inter font)
  - Mapa: Leaflet.js (tiles CartoDB)
  - Testes: Pytest (18 testes)
  - PWA: manifest.webmanifest + Service Worker
- **Servidor local**: `http://127.0.0.1:8000` (Uvicorn rodando em background)

---

## 2. 📍 Estado Real do Projeto (28/10/2026 · Atualizado)

### ✅ Telemetria de Intensidade de Sinal, Tempo de Conexão e Latência eduroam no Tracker
- **Implementação Realizada:**
  - **Módulo Visual Cockpit (`app/Templates/tracker.html`):**
    - Painel dedicado **"Telemetria de Sinal eduroam"** com indicador visual de 4 barras reativas (`signal-bars`), mostrador numérico em dBm (`RSSI`) e classificação de qualidade (Excelente, Bom, Regular, Fraco).
    - Cronômetro de tempo de conexão contínua na rede eduroam (`wifi-connected-timer`) e cálculo em tempo real da taxa percentual de cobertura na rota.
    - Medidor de latência HTTP (Ping RTT em ms) avaliado em tempo real a cada envio de telemetria.
    - Contador de zonas / reconexões cruzadas na viagem.
    - Feed cronológico rolável (**Registro de Cobertura e Transições de Sinal**) com logs de entrada, atenuação e reconexão.
  - **Ponte Nativa Android (`android/app/src/main/java/br/edu/ufpb/locbus/MainActivity.java` e `AndroidManifest.xml`):**
    - Permissão `ACCESS_WIFI_STATE` adicionada.
    - Método nativo `getWifiTelemetry()` via `WifiManager` e `ConnectivityManager` expondo SSID, BSSID, RSSI em dBm, nível de 0 a 4 barras, velocidade de link (Mbps) e frequência (2.4 GHz vs 5 GHz).
    - Polling e injeção automática em tempo real para o WebView (`window.onNativeWifiUpdate`).
    - Fallback gracioso para navegadores web comuns via Network Information API e latência HTTP.
  - **Backend & Schemas (`app/domain.py`, `app/services.py`):**
    - `CollaborativeIn` e `CollaborativePoint` enriquecidos com campos opcionais: `wifi_ssid`, `wifi_rssi`, `wifi_level` e `wifi_link_speed`.
  - **Testes Automatizados:** 34 testes aprovados (100% no Pytest, incluindo `test_tracker_eduroam_telemetry_elements` e `test_eduroam_batch_telemetry`).

### ✅ Integração das 12 Paradas Oficiais do Campus I ao Mapa Interativo
- **Implementação Realizada:**
  - **Mapeamento Georreferenciado Oficial (OpenStreetMap / UFPB):**
    1. ETS (Escola Técnica de Saúde): `[-7.13410, -34.84226]`
    2. Complexo Esportivo (DEF / Ginásio): `[-7.13432, -34.84318]`
    3. Editora UFPB (Alameda da Oiticica): `[-7.13600, -34.84650]`
    4. CCTA (Centro de Comunicação, Turismo e Artes): `[-7.13804, -34.84950]`
    5. CCHLA (Centro de Ciências Humanas, Letras e Artes): `[-7.13955, -34.85062]`
    6. CT (Centro de Tecnologia): `[-7.14493, -34.85066]`
    7. CCJ (Centro de Ciências Jurídicas): `[-7.14187, -34.84888]`
    8. Centro de Biotecnologia (CBIOTEC): `[-7.14100, -34.84661]`
    9. CCEN (Centro de Ciências Exatas e da Natureza): `[-7.13944, -34.84522]`
    10. INOVA (Agência UFPB de Inovação Tecnológica / Sucupira): `[-7.13756, -34.84350]`
    11. CCS (Centro de Ciências da Saúde): `[-7.13539, -34.84191]`
    12. Departamento de Fonoaudiologia: `[-7.13454, -34.84103]`
  - **Marcadores Interativos no Leaflet (`app/static/js/map.js`):**
    - Pins com numeração sequencial (1 a 12), visual gradiente azul real e borda branca em alto contraste.
    - Tooltips dinâmicos ao passar o cursor e Popups completos com botão "🎯 Centralizar Aqui".
    - Circuito viário interno traçado em linha pontilhada (`CAMPUS_LOOP_POLYLINE`).
    - Camada dedicada `🚏 12 Paradas do Campus I` integrada ao controle de camadas do Leaflet.
    - Botão flutuante `🚏 12 Paradas` no mapa (`window.focusCampusArea`) para enquadrar todas as paradas em um clique.
  - **Interface & Itinerário (`app/Templates/index.html` e `app/services.py`):**
    - Seção dedicada na Aba 3 (Itinerário) com lista interativa das 12 paradas e atalhos para focar no mapa.
### ✅ Compilação e Disponibilização dos APKs Nativos Android v1.7.0 (Passageiro & Ônibus Tracker)
- **Estrutura Multi-Flavor no Gradle (`android/app/build.gradle`):**
  - **Flavor `passenger`:**
    - App Label: "LocBUS"
    - Application ID: `br.edu.ufpb.locbus`
    - URL Padrão: `https://locbus-ufpb.onrender.com`
    - Binários: `LocBUS-v1.7.0.apk` e `LocBUS.apk` (raiz e `app/static/downloads/`)
  - **Flavor `tracker` (Celular Fixo no Ônibus):**
    - App Label: "LocBUS Tracker"
    - Application ID: `br.edu.ufpb.locbus.tracker` (permite instalar ambos no mesmo celular sem conflito)
    - URL Padrão: `https://locbus-ufpb.onrender.com/tracker` (abre direto no cockpit com Store-and-Forward eduroam e Telemetria de Sinal nativa)
    - Modo Kiosk / Display: `FLAG_KEEP_SCREEN_ON` para manter a tela 100% ativa no painel do veículo
    - Foreground Service Autônomo: Disparo imediato do serviço com notificação persistente e `PARTIAL_WAKE_LOCK`
    - Telemetria de Hardware: Permissão `ACCESS_WIFI_STATE` e método nativo `getWifiTelemetry()`
    - Binários: `LocBUS-Tracker-v1.7.0.apk` e `LocBUS-Tracker.apk` (raiz e `app/static/downloads/`)
- **Sincronização Gradle:** `versionCode 9`, `versionName "1.7.0"`.
- **Interface Web:** Cards de download atualizados na Aba 4 de `index.html` e botão dedicado no cockpit de bordo `tracker.html`.


---
- **Cenário Real & Solução de Engenharia:**
  - O ônibus utiliza exclusivamente o Wi-Fi acadêmico **eduroam**, que possui sinal nos Campi (Campus I e CI Mangabeira), mas perde conexão durante o deslocamento pelas vias públicas intermediárias (Via Expressa, Bancários).
  - Implementação do paradigma **Store-and-Forward (Tolerância a Desconexões)**:
    - **A coleta de GPS nunca para**: Mesmo 100% offline, os satélites de GPS continuam sendo capturados e alimentam os mostradores de bordo em tempo real.
    - **Fila Persistente no Veículo (`eduroamQueue`)**: Coordenadas com timestamps UTC precisos são armazenadas localmente no buffer com persistência (`localStorage`), suportando até 400 pontos (mais de 25 minutos contínuos sem sinal).
    - **Endpoint de Ingestão em Lote (`POST /api/v1/telemetry/collaborative/batch`)**: Novo endpoint backend em `main.py` e `services.py` que recebe o lote acumulado e incorpora os waypoints no buffer do sistema.
    - **Auto-Despejo na Reconexão**: Assim que o veículo ingressa no alcance de qualquer antena eduroam, o rastreador detecta a rede e descarrega todo o lote acumulado instantaneamente, posicionando o circular no mapa com exatidão histórica.
    - **Feedback Visual no Cockpit**: Mostrador dedicado `🌐 Buffer Offline (eduroam)` indicando quantos pontos estão salvos no veículo e o estado da rede (`eduroam: Conectado` / `Sem eduroam (Gravando)`).
  - **Testes Backend:** 33 testes aprovados com 100% no Pytest (`test_tracker.py` com `test_eduroam_batch_telemetry`).

---
- **Implementação Realizada:**
  - **Aplicativo Embarcado Dedicado (`/tracker`, `/onibus`, `/motorista`):**
    - Desenvolvido especificamente para rodar **100% do tempo no celular, tablet ou central multimídia fixada no painel do ônibus**.
    - **Zero-Click Auto-Start**: Ao abrir a página, o transmissor de GPS inicia imediatamente sem necessidade de login ou cliques adicionais.
    - **Screen Wake Lock API Integrada**: Mantém a tela do dispositivo permanentemente acesa, impedindo que o Android/iOS suspenda o processo ou desligue a antena de GPS em modo de economia de energia.
    - **Motor de Transmissão Contínua (WatchPosition + Watchdog)**: Envio a cada 3.5 segundos com timer de contingência automático caso o veículo esteja parado em semáforos ou terminais.
    - **Cockpit Industrial Dark Mode**:
      - Status visual gigante: `🟢 TRANSMITINDO AO VIVO` com taxa e pulso.
      - Velocímetro digital em destaque (`km/h`).
      - Coordenadas geográficas com precisão métrica (`± X m`).
      - Contador de pontos transmitidos e cronômetro contínuo de Uptime.
      - Monitor de nível de bateria e status de carregador (`🔌`).
      - Mini radar tático com Leaflet e Google Maps mostrando o veículo se movendo ao longo do traçado viário.
      - Suporte a Modo Tela Cheia (`⛶`).
  - **Manifesto PWA Dedicado (`/manifest-tracker.webmanifest`):**
    - Permite instalar como aplicativo nativo standalone no tablet do ônibus.
  - **Link de Acesso Rápido:**
    - Adicionado botão `📡 Modo Ônibus` na barra superior do aplicativo de passageiros para chaveamento instantâneo.
  - **Testes Backend:** 32 testes aprovados com 100% no Pytest (`test_tracker.py`).

---
- **Implementação Realizada:**
  - **Componente "Estou Esperando no Ponto" (`index.html` e `style.css`):**
    - Card flutuante interativo que permite ao passageiro escolher onde está esperando entre as 12 paradas oficiais do Campus I e os terminais CCHLA, CI e Praça da Paz.
    - Botão *"📍 Perto de mim"* para detecção automática da parada mais próxima via GPS nativo do dispositivo.
    - Destaque visual no mapa com marcador animado de halo pulsante (`👤 Você está aqui: [Nome da Parada]`).
    - Integração direta nos Popups do Leaflet: botão *"📍 Esperando aqui"* em cada pin da parada para seleção rápida no mapa.
  - **Confirmação Colaborativa de Chegada do Ônibus (Crowdsourcing de Espera):**
    - Painel tátil de ações quando a parada está selecionada:
      - 🚌 **"Chegou no Ponto!"** (Confirmação verde de chegada instantânea do circular)
      - ⏳ **"Ainda Não Chegou"** (Sinaliza passageiro em espera)
      - 💨 **"Acabou de Partir"** (Registra que o ônibus já passou pelo ponto)
    - Banner de status com histórico recente de relatos daquela parada (ex: *"Confirmado por passageiro local há 2 min"*).
  - **Backend & Tempo Real (FastAPI + SSE):**
    - Criação dos modelos `StopReportIn` e `StopReportOut` em `domain.py`.
    - Gerenciador em memória `StopReportsManager` em `services.py` com expiração controlada (TTL).
    - Endpoints `POST /api/v1/stops/report` e `GET /api/v1/stops/reports`.
    - Transmissão instantânea do evento SSE `stop_report` para todos os clientes conectados.
    - Pins das paradas no mapa recebem badge animado `🚌 Chegou!` quando um relato de chegada é recebido.
  - **Testes Backend:** 29 testes aprovados com 100% no Pytest (`test_stop_reports.py`).
  - **Versionamento:** Atualizado para `v1.5.0` no Service Worker, HTML e CSS.

---
- **Causa Raiz Identificada no Feedback do Usuário:**
  - O print do usuário mostrou o mapa com o visual anterior (bolinhas azuis e polylines retas ligando 4 -> 5 -> 6 -> 7 -> 8 cortando blocos e prédios).
  - O Service Worker estava operando com estratégia Cache-First para a raiz HTML (`/`), mantendo a versão anterior sem as curvas em cache do navegador. Além disso, o array `ROUTE_POLYLINE` de fallback continha apenas as coordenadas puras dos 12 pontos em linha reta.
- **Implementação e Blindagem Total (v1.4.3):**
  - **Injeção Nativa da Geometria Viária OSRM no `map.js`**: Os 855 pontos do OSRM (curvas do asfalto, rotatórias, Alameda da Oiticica, Via Expressa Padre Zé, contornos e avenidas) foram injetados diretamente em `ROUTE_POLYLINE` e `CAMPUS_LOOP_POLYLINE` no próprio `map.js`. Não há mais nenhum ponto em linha reta nem risco de race condition.
  - **Atualização do Service Worker para Network-First no HTML**: O Service Worker agora busca sempre o HTML mais atualizado da rede (`fetch(req)`) e apenas faz fallback para cache se estiver sem internet.
  - **Auto-Update e Purga de Cache Imediata**: `pwa.js` chama `reg.update()` e o Service Worker deleta imediatamente todos os caches legados ao subir para `locbus-v1.4.3-cache`.
  - **Camadas e Marcadores Oficiais Google Maps**: Google Roadmap HD ativado, pins 3D Teardrop SVG estilizados no padrão clássico Google com numeração e popups com link para Google Maps.
  - **Testes Backend:** 25 testes aprovados com 100% no Pytest.

---

## 3. 📍 Histórico (07/10/2026)

### ✅ Rastreamento em Segundo Plano & APK v1.3.0 — CONCLUÍDOS
- **Problema Solucionado:** O aplicativo Android WebView suspendia a coleta de GPS quando a tela era desligada ou o app ficava em segundo plano.
- **Implementação Realizada:**
  - **Foreground Service Android Nativo (`LocationForegroundService`/`LocationService.java`):**
    - Executa em segundo plano com permissão `FOREGROUND_SERVICE_LOCATION` e `WAKE_LOCK`.
    - Notificação persistente de baixo ruído na barra de status: exibe contador de pontos transmitidos, acurácia e velocidade em tempo real.
    - Notifica `MainActivity` e envia telemetria periodicamente via HTTP direto para a nuvem FastAPI (`https://locbus-ufpb.onrender.com/api/v1/telemetry/collaborative`).
  - **Ponte Nativa JavaScript (`AndroidBridge`):**
    - `@JavascriptInterface` acoplado ao WebView (`startBackgroundTracking`, `stopBackgroundTracking`, `isBackgroundTrackingActive`).
    - Integração no `app/static/js/crowdsource.js` para ligar o serviço ao clicar em "Transmitir GPS" e parar ao encerrar.
  - **Versionamento & Build:**
    - Versão atualizada para `v1.3.0` (versionCode `6`).
    - Binários gerados e sincronizados: `LocBUS-v1.3.0.apk` e `LocBUS.apk` (na raiz e em `app/static/downloads/`).
  - **Testes Backend:** 24 testes executados com 100% de aprovação no Pytest.

### ✅ Correção do Buffer de Telemetria & Clustering por Raio de Vizinhança
- **Problema Solucionado:** Ao reiniciar simulações no Ponto A (CCHLA) após concluir o trajeto no Ponto B (CI), o buffer acumulava pontos dos dois terminais (janela TTL de 3 min), calculando uma média ponderada no meio do caminho (~4 km de erro) e retendo o sentido invertido.
- **Implementação Realizada:**
  - **Clustering Espacial de Vizinhança (`app/services.py`):** A consolidação geográfica agora ancora no ponto mais recente (`active_points[-1]`) e só agrega pontos vizinhos dentro do raio de tolerância (`COLLABORATIVE_CLUSTER_RADIUS_METERS = 350.0`). Pontos antigos de outro terminal a quilômetros de distância são 100% isolados.
  - **Detecção de Salto Espacial Abrupto:** Ao receber um novo ponto com salto $> 600\text{ m}$ em relação ao último registrado (reinício de simulação), o buffer purga automaticamente os resíduos defasados.
  - **Tolerância de Terminais & Reset de Sentido:** Expansão da detecção de terminal para $350\text{ m}$, garantindo que inícios no CCHLA forcem sentido `"CI"`, além da função `reset_direcao_circular("CI")` acoplada ao endpoint `/api/v1/simulation/reset`.
  - **Suíte de Testes:** Adicionado `test_simulation_restart_isolation_from_previous_terminal` (25 testes passando 100% no Pytest).

---

## 3. 📍 Histórico Anterior (01/10/2026)

### ✅ Slides Interativos — CONCLUÍDOS
- **Arquivo:** `apresentacao_15min/slides_interativos.html` (60KB, 12 slides)
- **Design Premium:** Dark mode glassmorphism, backdrop-filter, CSS vars, Inter/JetBrains Mono
- **Features Implementadas:**
  - ✅ 12 slides com `<section>` tags e navegação por teclado (←→ Space Home End)
  - ✅ Timer 15 min com alertas visuais (verde → âmbar → vermelho)
  - ✅ Painel de Notas/Roteiro do palestrante (tecla N)
  - ✅ Barra de progresso animada
  - ✅ Modo tela cheia com auto-hide do HUD (tecla F)
  - ✅ Zoom em imagens (clique → overlay)
  - ✅ Pontos de navegação por slide
  - ✅ Fórmula Haversine e clustering ponderado (slide 10)
  - ✅ Tabela comparativa AVL/Crowdsourcing/LocBUS (slide 6)
  - ✅ Conteúdo IEEE Latin America com referências a ESP32, BLE, FastAPI, SSE
- **Backup disponível:** `apresentacao_15min/slides_interativos_bk.html`

### ✅ Apresentação PowerPoint (.PPTX) & Roteiro — CONCLUÍDOS
- **Arquivo PPTX:** [`apresentacao_15min/LocBUS_Apresentacao_IEEE.pptx`](file:///e:/prof3/apresentacao_15min/LocBUS_Apresentacao_IEEE.pptx) (~1.46 MB, 12 slides)
- **Roteiro Completo de Fala (15 min):** [`apresentacao_15min/ROTEIRO_DE_FALA_15MIN.md`](file:///e:/prof3/apresentacao_15min/ROTEIRO_DE_FALA_15MIN.md)
- **Script Gerador:** [`scripts/gerar_pptx.py`](file:///e:/prof3/scripts/gerar_pptx.py)
- **Características:**
  - Formato 16:9 Widescreen de alta definição
  - Paleta Dark Mode com tipografia corporativa/acadêmica
  - 12 slides com cards de métricas, tabelas comparativas e equações
  - Imagens reais do projeto embutidas (`mobile_interface_pwa.png`, `fig1_arquitetura.png`, `desktop_mapa_ao_vivo.png`, `validacao_campo_telemetria.png`, `transit_mobile_detalhes.png`)
  - **Notas do Orador (Speaker Notes)** embutidas nativamente em cada slide com o roteiro de fala cronometrado para 15 minutos

## 3. 📍 Estado Real do Projeto (26/09/2026 · 22h)

### Commits no repositório
| Hash | Descrição |
|---|---|
| `db1888d` | redesign(ui): Inter, SVG logo, paleta grafite, sem glassmorphism |
| `cc2096c` | docs: relatório estado IA |
| `a07738f` | feat(p1-p3): feedback GPS, BLE vs Colaborativo, clustering test |
| `fc955b5` | feat(p0): rota circular 31 pts, controles simulação, pytest.ini |
| `76c4e60` | feat: baseline funcional (colaborativo, PWA, SSE, testes) |

- ✅ Geofencing Contínuo por Segmentos (Fim da Rejeição 422 no Meio da Rota): A distância agora é calculada em relação a cada **segmento da via** (`dist_point_to_segment_km` e `dist_point_to_corridor_km`), e não apenas vértices discretos espaçados. Tolerância ajustada para **250m** e velocidade máxima permitida para **85 km/h**, permitindo que simulações do Lockito e veículos reais trafeguem em qualquer trecho da Av. Sérgio Guerra ou Campus I sem serem descartados.
- ✅ Watchdog Híbrido SSE + Polling de Contingência (Tempo Real Garantido no Desktop): Adicionado mecanismo em `crowdsource.js` que verifica a entrega contínua de eventos SSE. Caso o Cloudflare ou proxy atrase o streaming por mais de 3.5s, o watchdog dispara polling imediato em `/api/v1/status`, garantindo que o ônibus nunca fique parado na visão desktop.
- ✅ Modo Seguir Ônibus (Auto-Follow Inteligente): Ao clicar em `🎯 Focar Ônibus`, o mapa passa a acompanhar a movimentação do ônibus suavemente (`map.panTo`), pausando automaticamente se o usuário arrastar a tela manualmente.
- ✅ Cache Invalidation Total: Versão atualizada para `v=3.2` nos scripts e no Service Worker (`locbus-v3.2-cache`), impedindo que navegadores de desktop ou celular rodem códigos JS defasados em cache.
- ✅ Interface Map-First Transit (Moovit / Transit style): Mapa em 100% viewport, bottom sheet móvel (56vh com flex-shrink fix), card flutuante desktop, badge de linha, ETA vivo e linha do tempo de 8 paradas dinâmicas.
- ✅ Eliminação do Jogo Horizontal (Zero Overflow): Corrigido o `minmax(0, 1fr)` em `.transit-status-strip`, aplicado `touch-action: pan-y` e `overflow-x: hidden !important` no `.transit-sheet`.
- ✅ Camadas de Mapa 100% Livres de API: `🗺️ Mapa Real (Ruas OSM)` e `🛰️ Satélite Real (Esri HD)`.
- ✅ APK Android Nativo Versionado (`LocBUS-v1.1.0.1.apk`): Compilado via Gradle (versionCode 3, versionName 1.1.0.1, 5.57 MB) disponível em `app/static/downloads/LocBUS-v1.1.0.1.apk` e na raiz.

---

## 3. 🛡️ Protocolo Anti-Congelamento
1. **Raciocínio conciso**: direto ao problema, sem análise circular.
2. **Execução incremental**: máximo 2 arquivos por passo, testar imediatamente.
3. **Registro**: atualizar este arquivo a cada marco concluído.
4. **Respostas diretas**: nada de textos colossais, código limpo e confirmações pontuais.

---

| 25/10/2026 | **Adequação Formal Completa do Artigo Científico IEEE Latin America (LaTeX e PDF)**: reestruturação integral do artigo atendendo a 100% dos requisitos acadêmicos — (1) Introdução, (2) Objetivos Geral e Específicos formalizados, (3) Contribuições Tecnológicas, (4) Estado da Arte com Portfólio Bibliográfico (Mapeamento Sistemático) e Portfólio Tecnológico (análise de patentes/mercado e Tabela Comparativa I), (5) Metodologia formal fundamentada em *Design Science Research* (DSR) e Prototipagem Evolutiva, (6) Arquitetura e Tabela II de Requisitos do Sistema (RF e RNF) derivados das lacunas do Estado da Arte com modelagem matemática, (7) Seção dedicada ao Desenvolvimento do MVP/PoC (FastAPI, Cockpit Tracker, PWA Passenger, 12 paradas do Campus I e Crowdsourcing de Espera); compilação com êxito via Puppeteer/KaTeX | `artigo_ieee_la/artigo_locbus_ieee_la.tex`, `artigo_ieee_la/artigo_locbus_ieee_la.pdf`, `scripts/generate_ieee_pdf.js` | ✅ Concluído (PDF Gerado) |
| 18/10/2026 | **Atualização Integral e Compilação do Artigo Científico IEEE Latin America (PDF)**: incorporação dos 5 pilares arquiteturais, formulação matemática (geofencing segmentado OSRM, clustering por vizinhança 350m, Store-and-Forward sobre eduroam), mapeamento das 12 paradas oficiais do Campus I, módulo colaborativo de espera, suíte de 33 testes automatizados (100% OK), latência SSE (278 ms) e campanha de campo; PDF vetorial gerado via Puppeteer/KaTeX (678 kB) | `artigo_ieee_la/artigo_locbus_ieee_la.tex`, `artigo_ieee_la/artigo_locbus_ieee_la.pdf`, `scripts/generate_ieee_pdf.js` | ✅ Concluído (PDF Gerado) |
| 07/10/2026 | Correção de deploy Render: suporte a requisições HEAD (`405 Method Not Allowed`), proteção contra lista vazia em `obter_historico_viagens` (`IndexError`) com fallback para ambiente em nuvem | `app/main.py`, `app/services.py` | ✅ Concluído (Deploy automático no Render) |
| 07/10/2026 | Publicação do repositório no GitHub: criação do repositório público `GUILHERMEEDGAR/locbus-ufpb`, push inicial completo da branch `main` com Dockerfile, infra CEAR, APKs e automação Render | Git / GitHub CLI | ✅ Concluído (`https://github.com/GUILHERMEEDGAR/locbus-ufpb`) |
| 07/10/2026 | Preparação Cloud & CEAR (v1.2.1): criação de Dockerfile, render.yaml, docker-compose.yml e Nginx para o CEAR; APK recompilado e assinado (`LocBUS-v1.2.1.apk`) apontando para URL fixa na nuvem (`locbus-ufpb.onrender.com`) | `Dockerfile`, `render.yaml`, `docker-compose.yml`, `infra_cear/`, `LocBUS-v1.2.1.apk` | ✅ Concluído (Guia gerado) |
| 07/10/2026 | Correção e Lançamento da v1.2.0 final: assinatura digital adicionada (`signingConfig signingConfigs.debug` em release), eliminando erro de "pacote inválido" no Android; remoção completa de simulação e testes da UI; novo APK assinado gerado (`LocBUS-v1.2.0.apk`) | `build.gradle`, `AndroidManifest.xml`, `LocBUS-v1.2.0.apk`, `LocBUS.apk` | ✅ Concluído (APK 4.56 MB assinado) |
| 01/10/2026 | Resolução do erro do LibreOffice no Windows: troca de `soffice.exe` para `soffice.com` (evita timeout de stdio pipe do Node.js) | `.vscode/settings.json`, `Antigravity IDE/User/settings.json`, `libreoffice-converter.js` | ✅ Concluído (`soffice.com` testado e validado) |
| 01/10/2026 | Geração de apresentação nativa PowerPoint (.pptx) com 12 slides 16:9, notas de orador e imagens reais | `apresentacao_15min/LocBUS_Apresentacao_15min.pptx`, `scripts/generate_powerpoint.js` | ✅ Concluído (1.63 MB) |
| 01/10/2026 | Overhaul completo dos Slides Interativos (15 min) com imagens reais, zoom modal e gaveta de notas (Tecla N) | `apresentacao_15min/slides_interativos.html`, `apresentacao_15min/assets/` | ✅ Concluído (Validação Puppeteer OK) |
| 01/10/2026 | Criação do Pacote Completo de Contexto & Mega-Prompt para Gamma / Canva / ChatGPT / Claude | `apresentacao_15min/PACOTE_COMPLETO_PARA_OUTRAS_IAS.md` | ✅ Concluído |
| 30/09/2026 | Atualização completa dos entregáveis do professor (SIGAA) | `Atividade_PoC_LocBUS_Guilherme_Guedes.html`, `Atividade_PoC_LocBUS_Guilherme_Guedes.pdf`, `ROTEIRO_PRIORIZADO_PROJETO.md` | ✅ Concluído (PDF 8 págs gerado) |
| 30/09/2026 | Correção Geofencing contínuo por segmentos e Watchdog híbrido SSE | `app/services.py`, `app/config.py`, `app/static/js/crowdsource.js`, `app/static/js/map.js` | ✅ Concluído (24/24 testes OK) |
| 30/09/2026 | Build e Versionamento de APK Android v1.1.0.1 | `android/app/build.gradle`, `LocBUS-v1.1.0.1.apk` | ✅ Concluído (versionCode 3) |
| 26/09/2026 | Criação do sistema de checkpoint e GEMINI.md | `RELATORIO_ESTADO_IA.md`, `GEMINI.md` | ✅ |
| 26/09/2026 | Rota circular 31 pts, controles simulação, pytest.ini | `app/main.py`, `simulation.js`, `map.js`, `pytest.ini` | ✅ |
| 26/09/2026 | Banner GPS, BLE/Colaborativo/Estimado, clustering test | `services.py`, `crowdsource.js`, `style.css`, `index.html`, `test_collaborative.py` | ✅ |
| 26/09/2026 | Redesign visual completo (Inter, SVG, grafite) | `style.css`, `base.html`, `index.html` | ✅ |
| 26/09/2026 | Roteiro revisado com estado real e novas prioridades | `ROTEIRO_PRIORIZADO_PROJETO.md` | ✅ |
| 26/09/2026 | Setup ambiente Android (Node.js LTS v24 + Bubblewrap CLI instalados) | Terminal / Winget / Npm | ✅ |
| 26/09/2026 | Projeto Android Nativo gerado e compilado com Gradle 8.9 (`LocBUS.apk`) | `android/`, `LocBUS.apk` (5.3 MB) | ✅ |
| 27/09/2026 | Correção definitiva de escala mobile: grid 4 abas, bloqueio overflow-x, limpeza de cache WebView (`clearCache(true)`) | `style.css`, `base.html`, `MainActivity.java`, `sw.js`, `LocBUS.apk` | ✅ |
| 27/09/2026 | Testes de ciclo completo da rota circular (31 waypoints, 22/22 testes passando) | `tests/test_simulation.py` | ✅ |
| 27/09/2026 | Atualização do documento SIGAA com Seção 9 de Evidências Reais da PoC | `Atividade_PoC_LocBUS_Guilherme_Guedes.html` | ✅ |
| 30/09/2026 | Criação da aplicação de teste independente de telemetria GPS em Pedras de Fogo (PB) | `app_pedras_de_fogo/`, `run_pedras_de_fogo.py`, `iniciar_teste_pedras_de_fogo.bat`, `tests/test_pedras_de_fogo.py` | ✅ |
| 30/09/2026 | Correção de tiles do mapa (OpenStreetMap e Satélite Esri sem exigência de API Key) | `app_pedras_de_fogo/static/app.js`, `style.css` | ✅ |
| 30/09/2026 | Resolução de compartilhamento GPS: detecção de contexto inseguro (HTTP/celular), fallback alta/baixa precisão, modo marcação manual e modal de ajuda | `app_pedras_de_fogo/static/app.js`, `style.css`, `index.html` | ✅ |
| 30/09/2026 | Servidor de teste Pedras de Fogo reativado em background na porta 8001 | `run_pedras_de_fogo.py` | ✅ |
| 30/09/2026 | Fix na contagem de pontos: cache rápido de satélite (`getCurrentPosition`), sanitização de payload, feedback de busca e efeito visual verde no contador | `app_pedras_de_fogo/static/app.js`, `style.css`, `index.html` | ✅ |
| 30/09/2026 | Correção definitiva de mobile: mapa fixado no topo (order: -1), botão de envio manual de 1 clique (`btn-send-manual`), toques diretos no mapa e inicialização resiliente sem dependência de DOMContentLoaded tardio | `app_pedras_de_fogo/static/app.js`, `style.css`, `index.html` | ✅ |
| 30/09/2026 | Instalação do Puppeteer local como alternativa robusta ao browser_subagent e criação do script `scripts/inspect_page.js` | `scripts/inspect_page.js`, `package.json` | ✅ |
| 30/09/2026 | Descoberta e correção do bug crítico que bloqueava o envio de telemetria: elemento inexistente `valHeading` lançava `TypeError` em `updatePosition` abortando o envio | `app_pedras_de_fogo/static/app.js` | ✅ |
| 30/09/2026 | Correção em `startGPS`: remoção da chamada órfã `stopManualPicker()`, validação e teste com GPS simulado via Puppeteer registrando Ponto #1 com sucesso | `app_pedras_de_fogo/static/app.js`, `scripts/inspect_page.js` | ✅ |
| 30/09/2026 | **Validação em Campo 100% Concluída**: usuário confirmou funcionamento perfeito do compartilhamento GPS em tempo real e contagem contínua de pontos | Teste Pedras de Fogo | ✅ |
| 30/09/2026 | Redação completa do Artigo IEEE Latin America (`artigo_locbus_ieee_la.tex`) com Introdução, Estado da Arte (Tabela Comparativa), Lacuna, Requisitos e Metodologia | `artigo_ieee_la/artigo_locbus_ieee_la.tex` | ✅ |
| 30/09/2026 | Elaboração do Roteiro de Apresentação Oral de 15 minutos e Slides Interativos com cronômetro integrado | `apresentacao_15min/ROTEIRO_APRESENTACAO_15MIN.md`, `slides_interativos.html` | ✅ |
| 30/09/2026 | Unificação do motor de rastreamento de Pedras de Fogo no projeto principal: throttling 4s (Δt=4s), envio imediato no 1º ponto, fallback de satélite e feedback claro de geofencing | `app/static/js/crowdsource.js` | ✅ |
| 30/09/2026 | Redesign Transit App & Cittamobi: cabeçalho com badge da linha, chip de modo dinâmico, timeline de paradas com nós interativos e botão flutuante de focar ônibus no mapa | `index.html`, `style.css`, `map.js`, `crowdsource.js` | ✅ |

---

## 5. 🚀 Próximas Tarefas por Prioridade
- [x] **P4**: Testes de ciclo completo de simulação e estados BLE/Colaborativo (22/22 testes)
- [x] **P5**: Atualizar documento `Atividade_PoC_LocBUS_Guilherme_Guedes.html` com evidências reais
- [ ] **P1/P3**: Refinamento final do painel de simulação (substituir emojis ▶ ⏭ 🔄 por ícones SVG)
- [ ] **P2**: ETA dinâmico de carregamento inicial e badge de sentido no card de status
