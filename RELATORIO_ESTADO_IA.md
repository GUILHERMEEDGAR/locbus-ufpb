# 📋 RELATÓRIO DE ESTADO & CHECKPOINT DA I.A. (LocBUS / Prof3)

> **ATENÇÃO I.A. (LEITURA OBRIGATÓRIA NO INÍCIO DE CADA SESSÃO):**
> Este arquivo é o seu **painel de contexto persistente** e **ponto de restauração**.
> Se você travar, sofrer timeout ou reiniciar a sessão, leia este arquivo imediatamente para recuperar o contexto do projeto, o que foi feito por último e quais são os próximos passos.
>
> **REGRA DE OURO ANTI-TRAVAMENTO:**
> 1. Nunca entre em cadeias de pensamento ("thinking") excessivamente longas ou circulares. Seja direto e pragmático.
> 2. Sempre divida tarefas grandes em passos curtos e verificáveis.
> 3. Atualize a seção `[STATUS ATUAL & PRÓXIMOS PASSOS]` deste arquivo ao concluir marcos importantes.

---

## 1. 🎯 Visão Geral do Projeto
- **Nome do Projeto**: LocBUS (PoC / Sistema de Telemetria e Monitoramento de Frota de Ônibus)
- **Tecnologias**:
  - **Backend**: Python 3.12+, FastAPI, Uvicorn, Pydantic v2
  - **Frontend / Templates**: Jinja2 (`app/Templates/index.html`), Vanilla JS (`tabs.js`, etc.), CSS personalizado
  - **Testes**: Pytest (`tests/`)
  - **Armazenamento / Dados**: JSON / arquivos em `data/telemetria/`
- **Diretório Raiz**: `e:\prof3`

---

## 2. 📍 Status Atual & Ponto de Parada
- **Status do Sistema**: **PoC Estável e Funcional** (17/17 testes passando via `python -m pytest`).
- **Último Commit**: `76c4e60 feat: baseline funcional com modulo colaborativo, pwa, sse e suite de testes`
- **Modificações Atuais em Andamento (Working Tree)**:
  - **Rota Circular Completa**: `app/main.py` expandido para 31 waypoints cobrindo o trajeto completo de **Ida (CCHLA -> CI)** e **Volta (CI -> CCHLA)** com nomes de pontos reais da UFPB/Bancários/Mangabeira.
  - **Controle Interativo da Simulação**: `app/static/js/simulation.js` e `app/Templates/index.html` com controles aprimorados de play/pause, velocidade e avanço passo a passo.
  - **Interface & Mapa**: `app/static/js/map.js` e `app/static/css/style.css` atualizados com traçado e marcadores dinâmicos.
  - **Buffer Colaborativo**: Ajuste em `simulation_step` para sincronizar o ponto exato da simulação limpando posições defasadas.

---

## 3. 🛡️ Protocolo Anti-Congelamento (Anti-Hang Guidelines)
Para evitar que a I.A. "pense demais e trave":
1. **Raciocínio Conciso**: Ir direto ao ponto; evitar monólogos internos longos ou hipóteses desnecessárias.
2. **Execução Incremental**: Fazer 1 ou 2 alterações por vez e validar logo em seguida.
3. **Registro Contínuo**: Registrar mudanças críticas neste arquivo.
4. **Respostas Diretas ao Usuário**: Notificar o usuário com clareza e síntese.

---

## 4. 📝 Histórico de Ações Recentes
| Data / Hora | Ação Executada | Arquivos Envolvidos | Status |
| :--- | :--- | :--- | :--- |
| *26/09/2026* | Configuração de diretrizes anti-hang e relatório de auto-leitura | `RELATORIO_ESTADO_IA.md`, `GEMINI.md` | ✅ Concluído |
| *26/09/2026* | Expansão da rota de simulação para ida e volta completa (31 waypoints) | `app/main.py`, `simulation.js`, `map.js` | 🔄 Em andamento no working tree |
| *26/09/2026* | Criação do `pytest.ini` e validação direta de 17/17 testes | `pytest.ini`, `tests/` | ✅ 17/17 Passando |
| *26/09/2026* | Elaboração do Roteiro Técnico Priorizado (P0 a P5) | `ROTEIRO_PRIORIZADO_PROJETO.md` | ✅ Concluído |

---

## 5. 🚀 Próximos Passos Imediatos (Backlog Ativo)
- [x] Validar que todos os testes automatizados continuam passando (17/17).
- [x] Criar `pytest.ini` para execução padrão do pytest.
- [x] Elaborar o roteiro técnico priorizado completo (`ROTEIRO_PRIORIZADO_PROJETO.md`).
- [ ] Confirmar com o usuário o commit das alterações do working tree (P0).
- [ ] Executar os itens da Prioridade 1 (Crowdsourcing e fluxo em tempo real).
