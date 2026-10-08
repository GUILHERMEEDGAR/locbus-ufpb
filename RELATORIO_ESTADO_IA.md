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

## 2. 📍 Estado Real do Projeto (01/10/2026 · Atualizado)

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
