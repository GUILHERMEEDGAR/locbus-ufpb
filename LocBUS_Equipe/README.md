# Pacote de Onboarding — LocBUS

Esta pasta organiza o material que será utilizado pelos novos integrantes e pelas IAs escolhidas por cada grupo para dar continuidade ao projeto.

O onboarding passa a utilizar **dois prompts obrigatórios**, enviados em sequência.

---

## 1. Arquivos principais

```text
00_CONTEXTO_GERAL_LOCBUS.md
PROMPT_GERAL_PROJETO_IA.md

01_GRUPO_BACKEND.md
02_GRUPO_TELEMETRIA_MQTT.md
03_GRUPO_FIRMWARE_HARDWARE.md
04_GRUPO_FRONTEND_UX.md
05_GRUPO_MAPAS_ETA_TESTES.md
```

### `00_CONTEXTO_GERAL_LOCBUS.md`

Documento de leitura humana comum a todos os integrantes.

Apresenta:

- origem do LocBUS;
- funcionamento geral;
- módulos físicos;
- arquitetura atual;
- lógica `0/1`;
- site;
- problemas gerais;
- arquitetura futura;
- mapas;
- pasta `Notas/`;
- divisão da equipe.

### `PROMPT_GERAL_PROJETO_IA.md`

É o **PROMPT 1**, obrigatório para a IA de qualquer grupo.

Sua função é fazer a IA compreender o LocBUS como um projeto único antes de receber uma responsabilidade específica.

Esse prompt contém o contexto geral necessário para a IA compreender:

- objetivo do projeto;
- arquitetura atual;
- hardware;
- BLE;
- MQTT;
- EMQX;
- CSV;
- backend;
- frontend;
- mapas;
- problemas conhecidos;
- diagnóstico físico atual;
- arquitetura futura;
- documentação;
- fases;
- segurança;
- divisão entre os cinco grupos.

A primeira resposta da IA deve apenas consolidar o contexto.

**Nenhuma implementação deve começar nessa etapa.**

---

## 2. Estrutura de trabalho com a IA

Cada integrante/grupo utilizará **dois prompts iniciais**.

### PROMPT 1 — Contexto geral do projeto

Todos os grupos utilizam o mesmo arquivo:

```text
PROMPT_GERAL_PROJETO_IA.md
```

Esse prompt deve ser enviado primeiro.

A IA deverá:

```text
compreender o LocBUS
    ↓
reconstruir a arquitetura geral
    ↓
identificar estado atual
    ↓
distinguir código atual e arquitetura futura
    ↓
confirmar que está pronta para receber o grupo
```

Não deve implementar nada.

### PROMPT 2 — Contexto específico do grupo

Depois que a IA responder corretamente ao Prompt 1, o integrante envia o prompt específico contido no guia do seu grupo:

```text
01_GRUPO_BACKEND.md
02_GRUPO_TELEMETRIA_MQTT.md
03_GRUPO_FIRMWARE_HARDWARE.md
04_GRUPO_FRONTEND_UX.md
05_GRUPO_MAPAS_ETA_TESTES.md
```

O Prompt 2 explica:

- responsabilidade do grupo;
- arquivos relacionados;
- problemas específicos;
- decisões futuras da área;
- dependências com outros grupos;
- testes;
- limites de atuação.

A IA só deve começar a receber tarefas de implementação **depois de compreender os dois níveis de contexto**.

---

## 3. Ordem recomendada para cada integrante

### Etapa 1 — Leitura humana geral

Ler:

```text
00_CONTEXTO_GERAL_LOCBUS.md
```

O objetivo é que o integrante compreenda o projeto antes de delegar análises à IA.

### Etapa 2 — Leitura humana do próprio grupo

Ler o guia correspondente:

```text
Grupo 1 → 01_GRUPO_BACKEND.md

Grupo 2 → 02_GRUPO_TELEMETRIA_MQTT.md

Grupo 3 → 03_GRUPO_FIRMWARE_HARDWARE.md

Grupo 4 → 04_GRUPO_FRONTEND_UX.md

Grupo 5 → 05_GRUPO_MAPAS_ETA_TESTES.md
```

### Etapa 3 — Realizar as leituras específicas indicadas no guia

Cada arquivo de grupo informa quais documentos devem ser lidos manualmente.

Esses documentos permitem ao integrante compreender as decisões e problemas da própria área antes de trabalhar com código.

### Etapa 4 — Abrir uma nova conversa com a IA

A IA pode ser a ferramenta escolhida pelo integrante.

A recomendação é utilizá-la como:

```text
orientador técnico
+
apoio para análise
+
apoio para testes
+
apoio para implementação
+
apoio para documentação
```

e não apenas como gerador automático de código.

### Etapa 5 — Enviar o PROMPT 1

Copiar e colar o conteúdo de:

```text
PROMPT_GERAL_PROJETO_IA.md
```

Aguardar a IA responder e verificar se ela compreendeu corretamente:

- objetivo;
- arquitetura;
- estado atual;
- problemas;
- futuro;
- documentação;
- segurança.

Se houver erro importante na interpretação, corrigir antes de continuar.

### Etapa 6 — Anexar os arquivos específicos do grupo

O guia de cada grupo possui uma seção:

```text
Enviar para a IA
```

Anexar os documentos e arquivos de código listados nessa seção.

Evite enviar toda a pasta `Notas/` sem necessidade.

### Etapa 7 — Enviar o PROMPT 2

Copiar e colar o prompt específico existente no guia do grupo.

A IA deverá então aprofundar somente a área correspondente.

### Etapa 8 — Revisar o estado de prontidão

A resposta ao Prompt 2 deverá terminar com uma seção de:

```text
ESTADO DE PRONTIDÃO DO GRUPO
```

O integrante deve verificar se:

- a IA entendeu os arquivos;
- não confundiu `ARQ_` com código implementado;
- identificou os problemas corretos;
- reconheceu dependências com outros grupos;
- não inventou informações;
- preservou itens incertos.

### Etapa 9 — Só depois iniciar tarefas

A sequência recomendada é:

```text
contexto geral
    ↓
contexto do grupo
    ↓
análise
    ↓
validação
    ↓
planejamento
    ↓
teste
    ↓
implementação controlada
```

---

## 4. Regra dos documentos

A pasta `Notas/` utiliza três prefixos importantes:

```text
AUD_ = auditoria do estado observado

DID_ = explicação didática

ARQ_ = decisão, proposta ou arquitetura futura
```

A IA deve compreender que:

```text
ARQ_
```

não significa:

```text
já implementado
```

---

## 5. Fonte de verdade

Quando houver conflito entre documentação e código:

```text
1. o código atual é a fonte de verdade sobre o que está implementado;
2. a documentação fornece contexto;
3. a divergência deve ser registrada;
4. não deve ser corrigida silenciosamente;
5. decisões compartilhadas devem ser alinhadas com os outros grupos.
```

---

## 6. Divisão dos grupos

```text
GRUPO 1 — Backend e regras de negócio

GRUPO 2 — Telemetria, MQTT e dados

GRUPO 3 — Firmware e hardware

GRUPO 4 — Frontend e UX

GRUPO 5 — Mapas, ETA, testes e integração
```

Todos utilizam o mesmo:

```text
PROMPT 1 — PROMPT_GERAL_PROJETO_IA.md
```

e depois utilizam seu próprio:

```text
PROMPT 2 — disponível dentro do guia do grupo
```

---

## 7. Regra de segurança

Não compartilhar em prompts ou respostas:

- senhas;
- tokens;
- chaves;
- credenciais;
- segredos.

Quando uma IA encontrar um valor sensível, deve utilizar:

```text
[REDACTED]
```

---

## 8. Objetivo desta organização

A estrutura em dois prompts existe para evitar que cada grupo desenvolva sua parte de forma isolada sem compreender o restante do sistema.

A ideia é:

```text
TODOS compreendem primeiro o LocBUS
                ↓
cada grupo aprofunda sua área
                ↓
mudanças são feitas com consciência das interfaces
                ↓
o projeto continua funcionando como um único sistema
```

Essa organização também facilita testar diferentes IAs, porque todas recebem primeiro o mesmo contexto geral antes de receberem as instruções específicas de cada grupo.
