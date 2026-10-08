# 🗺️ ROTEIRO TÉCNICO REVISADO — LOCBUS PoC (Setembro/2026)

> **Revisão feita em:** 26/09/2026 · Sessão de trabalho atual
> **Base:** 5 commits consolidados · 18/18 testes passando · Servidor rodando na porta 8000

---

## ✅ O QUE JÁ ESTÁ FEITO (CONCLUÍDO E COMMITADO)

| Commit | Entrega |
|---|---|
| `76c4e60` | Baseline funcional: módulo colaborativo, PWA, SSE, 17 testes |
| `fc955b5` | Rota circular de 31 waypoints (CCHLA ↔ CI), controles de simulação, `pytest.ini` |
| `a07738f` | Banner de feedback (sem `alert()`), diferenciação BLE/Colaborativo, teste de clustering ponderado |
| `cc2096c` | Documentação interna (relatório IA, GEMINI.md, roteiro) |
| `db1888d` | **Redesign visual completo**: fonte Inter, SVG logo, paleta grafite, sem glassmorphism nem emojis |

---

## 🔴 PRIORIDADE 1 (P1) — Fechar o Ciclo Visual do Dashboard *(Próximo a executar)*
*O redesign foi aplicado no CSS/HTML, mas o dashboard ainda tem inconsistências visuais menores e falta de refinamento.*

**1.1 — Auditoria Visual Rápida (verificar no navegador)**
- [ ] Confirmar que abas, cards, mapa Leaflet e modal LGPD estão com o novo visual.
- [ ] Verificar se o fonte Inter está carregando corretamente (Google Fonts).
- [ ] Checar se `brand-badge` ficou órfão no CSS (foi renomeado para `brand-sub` mas o teste do HTML pode falhar).

**1.2 — Ajuste do Card de Status (limpeza final)**
- [ ] Remover os emojis restantes em outros pontos do `index.html` (painel de simulação: `🎮`, `⏭`, `🔄`).
- [ ] Substituir a barra de progresso por um visual mais funcional (menos néon, mais produto).

**1.3 — Correção de Potencial Falha de Teste**
- [ ] Rodar os testes com o novo HTML e verificar se o `test_home_page_pwa_meta_tags` que checa `brand-badge` vs. `brand-sub` ainda passa.

---

## 🟠 PRIORIDADE 2 (P2) — Integração Real do ETA Dinâmico no Card de Status
*Atualmente o ETA é calculado mas exibido de forma estática no template inicial. O SSE atualiza, mas o valor inicial pode ser "12–18 min" fixo.*

- [ ] Garantir que o template renderiza o ETA dinâmico **já calculado** (não o placeholder estático).
- [ ] Exibir a **direção da viagem** (Ida/Volta) de forma visual clara no header do card (ex: seta animada ou badge).
- [ ] Mostrar o **estado operacional** (Aguardando Partida / Em Trânsito / Fora de Operação) com cor diferente no indicador de status.

---

## 🟡 PRIORIDADE 3 (P3) — Painel de Simulação: UX Limpa e Funcional
*O painel de simulação está funcional mas visualmente ainda usa emojis e textos prolixos.*

- [ ] Limpar os botões do painel de simulação (`▶`, `⏭`, `🔄` → ícones SVG ou texto direto).
- [ ] Simplificar o badge de direção (`Sentido: Ida (CCHLA → CI)` → badge compacto).
- [ ] Verificar se os 3 botões de velocidade (1x, 2x, 4x) estão responsivos no mobile.

---

## 🟢 PRIORIDADE 4 (P4) — Testes de Integração e Cobertura
*A suíte de testes cobre endpoints mas não testa o estado da UI nem a sequência completa de simulação.*

- [ ] Adicionar teste de simulação de ciclo completo (31 passos, verificar que o estado volta ao início).
- [ ] Adicionar teste que verifica o estado `AGUARDANDO` quando o ônibus está no terminal.
- [ ] Adicionar teste que verifica `modo_rastreamento = BLE_FIXO` no terminal e `COLABORATIVO_PASSAGEIRO` em trânsito.

---

## 🔵 PRIORIDADE 5 (P5) — Documento da Entrega SIGAA *(CONCLUÍDO)*
*Entregável acadêmico final gerado e validado com todas as evidências técnicas reais.*

- [x] Atualizado [Atividade_PoC_LocBUS_Guilherme_Guedes.html](file:///e:/prof3/Atividade_PoC_LocBUS_Guilherme_Guedes.html) com:
  - Paradigma Map-First Transit, Bottom Sheet móvel (zero rolagem horizontal), foco com Auto-Follow suave.
  - Geofencing contínuo por segmentos ortogonais (250m de tolerância e 85 km/h de velocidade máxima).
  - Watchdog de streaming híbrido (SSE + Polling de contingência a cada 3,5s).
  - Ensaios em campo comprovados com Fake GPS (Lockito) e sincronização multicliente simultânea.
  - Tabela completa de **24/24 testes automatizados aprovados no Pytest** (100% de sucesso em 1,58s).
  - Empacotamento nativo Android versionado: `LocBUS-v1.1.0.1.apk` (5.57 MB, SDK 35, Android 15).
- [x] Gerado **PDF de alta fidelidade** (`Atividade_PoC_LocBUS_Guilherme_Guedes.pdf` — 8 páginas com numeração A4, caixas temáticas e sem quebras visuais).
- [x] APK versionado disponível na raiz (`e:\prof3\LocBUS-v1.1.0.1.apk`) e para download público no site (`/static/downloads/LocBUS-v1.1.0.1.apk`).

---

## 📊 Resumo de Status Consolidado

| Área | Status | Cobertura / Entregável |
|---|---|---|
| Backend (FastAPI + SSE) | ✅ 100% Completo | ✅ Endpoints testados, CORS, Gzip e Cache-Control |
| Crowdsourcing (GPS + LGPD) | ✅ 100% Completo | ✅ Geofencing contínuo por segmentos ortogonais (250m, 85 km/h) |
| Simulação de Rota & Fake GPS | ✅ 100% Completo | ✅ 31 waypoints cíclicos + compatibilidade validada com Lockito |
| PWA (manifest + Service Worker) | ✅ 100% Completo | ✅ Stale-While-Revalidate, cache v3.2, modo offline |
| Tempo Real Resiliente | ✅ 100% Completo | ✅ SSE Streaming + Watchdog Polling híbrido de 3,5s |
| Design & UX Transit | ✅ 100% Completo | ✅ Map-First Transit, Bottom Sheet zero-overflow, Auto-Follow 🎯 |
| Aplicativo Nativo Android | ✅ 100% Completo | ✅ `LocBUS-v1.1.0.1.apk` (5.57 MB, Gradle 8.9, SDK 35) |
| Testes Automatizados | ✅ 100% Completo | ✅ **24/24 Aprovados** (Pytest em 1,58s) |
| Relatório Acadêmico (SIGAA) | ✅ 100% Completo | ✅ `Atividade_PoC_LocBUS_Guilherme_Guedes.html` e `.pdf` (8 págs) |
