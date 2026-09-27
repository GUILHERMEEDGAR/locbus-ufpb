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

## 2. 📍 Estado Real do Projeto (26/09/2026 · 22h)

### Commits no repositório
| Hash | Descrição |
|---|---|
| `db1888d` | redesign(ui): Inter, SVG logo, paleta grafite, sem glassmorphism |
| `cc2096c` | docs: relatório estado IA |
| `a07738f` | feat(p1-p3): feedback GPS, BLE vs Colaborativo, clustering test |
| `fc955b5` | feat(p0): rota circular 31 pts, controles simulação, pytest.ini |
| `76c4e60` | feat: baseline funcional (colaborativo, PWA, SSE, testes) |

### O que está 100% funcional
- ✅ Dashboard renderizando com dados reais do backend
- ✅ Mapa Leaflet com rota viária e 8 paradas marcadas
- ✅ Simulação circular de 31 waypoints (Ida CCHLA→CI + Volta CI→CCHLA)
- ✅ Controles de simulação: play/pause, velocidade 1x/2x/4x, próximo passo, reset
- ✅ Endpoint colaborativo com geofencing (80m), filtro de velocidade (65 km/h max)
- ✅ Buffer volátil com TTL e clustering ponderado pelo inverso da acurácia
- ✅ SSE broadcast em tempo real (heartbeat de 10s)
- ✅ PWA completo: manifest, service worker, ícones, offline banner
- ✅ Modal de consentimento LGPD
- ✅ Banner de feedback amigável de geolocalização (sem `alert()`)
- ✅ Diferenciação de modos: `BLE_FIXO`, `COLABORATIVO_PASSAGEIRO`, `ESTIMADO`
- ✅ 18/18 testes passando

### O que está em andamento / incompleto
- 🔄 **Redesign visual**: aplicado, mas precisa de auditoria de inconsistências (emojis restantes no painel de simulação)
- 🔄 **ETA dinâmico na UI**: calculado no backend, mas o valor inicial exibido ao carregar pode ser o placeholder estático
- ⏳ **Documento SIGAA**: não atualizado com evidências reais da PoC

---

## 3. 🛡️ Protocolo Anti-Congelamento
1. **Raciocínio conciso**: direto ao problema, sem análise circular.
2. **Execução incremental**: máximo 2 arquivos por passo, testar imediatamente.
3. **Registro**: atualizar este arquivo a cada marco concluído.
4. **Respostas diretas**: nada de textos colossais, código limpo e confirmações pontuais.

---

## 4. 📝 Histórico de Ações Recentes
| Data | Ação | Arquivos | Status |
| :--- | :--- | :--- | :--- |
| 26/09/2026 | Criação do sistema de checkpoint e GEMINI.md | `RELATORIO_ESTADO_IA.md`, `GEMINI.md` | ✅ |
| 26/09/2026 | Rota circular 31 pts, controles simulação, pytest.ini | `app/main.py`, `simulation.js`, `map.js`, `pytest.ini` | ✅ |
| 26/09/2026 | Banner GPS, BLE/Colaborativo/Estimado, clustering test | `services.py`, `crowdsource.js`, `style.css`, `index.html`, `test_collaborative.py` | ✅ |
| 26/09/2026 | Redesign visual completo (Inter, SVG, grafite) | `style.css`, `base.html`, `index.html` | ✅ |
| 26/09/2026 | Roteiro revisado com estado real e novas prioridades | `ROTEIRO_PRIORIZADO_PROJETO.md` | ✅ |

---

## 5. 🚀 Próximas Tarefas por Prioridade
- [ ] **P1**: Auditoria visual (emojis restantes, Inter carregando, card de status)
- [ ] **P2**: ETA dinâmico visível no carregamento inicial da página
- [ ] **P3**: Painel de simulação — botões com SVG limpo
- [ ] **P4**: Testes de ciclo completo de simulação e estados BLE/Colaborativo
- [ ] **P5**: Atualizar documento `Atividade_PoC_LocBUS_Guilherme_Guedes.html` com evidências reais → gerar PDF para SIGAA
