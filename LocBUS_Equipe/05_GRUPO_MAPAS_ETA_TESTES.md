# Grupo 5 — Mapas, ETA, Testes e Integração

## 1. Responsabilidade

### Mapas
- KMZ/KML;
- geração offline;
- PNGs estáticos;
- ferramentas auxiliares.

### ETA
- estudar evolução dos valores fixos;
- separar ETA dinâmico de mapa dinâmico.

### Testes e integração
- preservar baselines;
- criar testes de regressão;
- validar integração entre os grupos.

## 2. Leitura humana obrigatória

```text
00_CONTEXTO_GERAL_LOCBUS.md
AUD_13_mapas_ferramentas.md
AUD_14_preparacao_baseline_funcional.md
AUD_15_baseline_funcional_site.md
ARQ_05_regras_negocio_futuras.md
ARQ_06_fluxo_oficial_mapas.md
```

## 3. Enviar para a IA

```text
00_CONTEXTO_GERAL_LOCBUS.md
05_GRUPO_MAPAS_ETA_TESTES.md
AUD_03_dependencias.md
AUD_06_ciclo_vida_telemetria.md
AUD_12_regras_negocio_atual.md
AUD_13_mapas_ferramentas.md
AUD_14_preparacao_baseline_funcional.md
AUD_15_baseline_funcional_site.md
AUD_16_diagnostico_firmware_comunicacao.md
ARQ_05_regras_negocio_futuras.md
ARQ_06_fluxo_oficial_mapas.md
app/static/map_builder/build_maps_from_kml.py
tools/generate_overlays_osm.py
app/services.py
app/main.py
```

Adicionar KMZ, bbox e PNGs quando a tarefa envolver mapas.

## 4. Estado dos mapas

```text
Google Maps / Google My Maps
-> KMZ
-> build_maps_from_kml.py
-> PNGs estáticos
```

`generate_overlays_osm.py` é alternativo/experimental.

## 5. Estado do ETA

- valores atuais são fixos/provisórios;
- pode aparecer ETA sem telemetria válida;
- confiabilidade atual mede principalmente idade da telemetria;
- `35 min` no Histórico ainda precisa ter significado recuperado.

## 6. Papel nos testes

O grupo deve preservar e evoluir:

- baseline do site;
- endpoints;
- mapas;
- histórico;
- telemetria;
- integração;
- futuramente cadeia ESP -> MQTT -> CSV -> backend -> frontend.

## 7. Não decidir sozinho

- semântica física de eventos;
- payload MQTT;
- estados de domínio;
- política final de frontend;
- arquitetura definitiva de firmware.

## 8. Prompt pronto para a IA

```text
Você está me auxiliando no GRUPO 5 — MAPAS, ETA, TESTES E INTEGRAÇÃO do projeto LocBUS.

Leia integralmente todos os arquivos anexados antes de sugerir mudanças.

AUD_ = estado auditado.
ARQ_ = decisão/proposta futura.
O código atual é a fonte de verdade sobre o implementado.
ARQ_ não significa implementação existente.

RESPONSABILIDADE DO GRUPO
- mapas;
- KMZ/KML;
- geradores offline;
- ETA;
- baselines;
- testes de regressão;
- integração entre Hardware, MQTT, Backend e Frontend.

NESTA PRIMEIRA CONVERSA, NÃO IMPLEMENTE NADA.

Primeiro:
1. reconstrua o fluxo atual dos mapas;
2. reconstrua o estado atual do ETA;
3. explique o baseline funcional existente;
4. classifique achados como COMPROVADO PELO CÓDIGO, COMPROVADO PELOS TESTES, BUG CONFIRMADO, DECISÃO FUTURA, EXPERIMENTAL ou INCERTO;
5. identifique testes que devem ser preservados como regressão;
6. identifique pontos de integração entre os cinco grupos;
7. liste mudanças que exigem validação cruzada;
8. sinalize conflitos entre documentação e código;
9. aguarde minha próxima instrução.

Finalize com ESTADO DE PRONTIDÃO DO GRUPO 5, informando o que pode ser testado imediatamente, quais decisões de ETA continuam abertas e quais integrações exigem coordenação entre grupos.
```
