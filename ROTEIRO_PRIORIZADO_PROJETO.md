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

## 🔵 PRIORIDADE 5 (P5) — Documento da Entrega SIGAA *(Prazo: Setembro/2026)*
*Este é o entregável acadêmico final. Deve refletir a PoC funcional com evidências reais.*

- [ ] Atualizar [Atividade_PoC_LocBUS_Guilherme_Guedes.html](file:///e:/prof3/Atividade_PoC_LocBUS_Guilherme_Guedes.html) com:
  - Seção 7 (Lacuna e Oportunidade) já está boa — manter.
  - Adicionar **Seção 8 ampliada** com print/evidências das funcionalidades implementadas:
    - Simulação de rota circular (31 pontos)
    - Mapa Leaflet com traçado real
    - Modal LGPD
    - Banner de feedback do crowdsourcing
    - Diferenciação de fonte BLE/Colaborativo
- [ ] Gerar **PDF de entrega** a partir do HTML (`Ctrl+P` no navegador ou via `wkhtmltopdf`).
- [ ] Exportar **log dos 18 testes passando** como evidência de qualidade.

---

## ⬜ PRIORIDADE 6 (P6) — Melhorias Futuras (pós-entrega)
*Não bloqueante para a entrega do SIGAA. Backlog para evolução.*

- [ ] Implementar **Map-Matching** real: fixar coordenada colaborativa na polilinha da rota ao invés de usar lat/lon livre.
- [ ] Configurar **variáveis de ambiente** via `.env` (separar `MQTT_BROKER`, `MQTT_USER`, `MQTT_PASSWORD` do código).
- [ ] Adicionar **histórico visual** na aba Histórico: gráfico de barras de viagens por dia.
- [ ] PWA: atualizar ícone SVG com o novo logotipo geométrico.
- [ ] Implementar **notificação push** real (Web Push API) no lugar do fallback de `Notification` do browser.

---

## 📊 Resumo de Status por Área

| Área | Status | Cobertura de Testes |
|---|---|---|
| Backend (FastAPI + SSE) | ✅ Completo | ✅ 8 endpoints testados |
| Crowdsourcing (GPS + LGPD) | ✅ Completo | ✅ Validação de geofence + velocidade + clustering |
| Simulação de Rota | ✅ Completo (31 pts) | ✅ Teste de step + reset |
| PWA (manifest + SW) | ✅ Completo | ✅ 5 testes PWA |
| SSE (Streaming) | ✅ Completo | ✅ 3 testes SSE |
| Design / UX | 🔄 90% (P1 em aberto) | — |
| ETA Dinâmico na UI | 🔄 Backend OK, UI incompleta | — |
| Documento SIGAA | ⏳ Pendente (P5) | — |
