# Grupo 2 — Telemetria, MQTT e Dados

## 1. MQTT, comunicação das ESPs, geração dos CSVs e responsabilidades do grupo

### 1.1 O que é MQTT

MQTT é um protocolo de comunicação muito utilizado em sistemas de Internet das Coisas (IoT).

Ele funciona seguindo uma lógica de **publicação e assinatura**:

```text
dispositivo publica uma mensagem
        ↓
broker MQTT recebe
        ↓
clientes inscritos naquele tópico recebem a mensagem
```

O broker funciona como um intermediário. Os dispositivos não precisam se comunicar diretamente com todos os sistemas que utilizarão os dados.

No LocBUS, a função do MQTT é transportar os dados produzidos pelos módulos físicos até o sistema que registra a telemetria.

Um conceito importante é o **tópico MQTT**. Ele funciona como um endereço lógico para organizar as mensagens.

Exemplo atual:

```text
tele/Pc1/state
```

A ESP do ponto publica nesse tópico e o coletor do LocBUS assina:

```text
tele/#
```

O caractere `#` indica que o coletor pode receber os tópicos existentes abaixo de `tele/`.

---

### 1.2 Como as ESPs se comunicam

No projeto atual, existem dois tipos de comunicação principais:

```text
Bluetooth Low Energy (BLE)
```

e:

```text
Wi-Fi + MQTT
```

A ESP do ônibus não envia os dados diretamente para o site.

Primeiro, ela se comunica por **Bluetooth Low Energy** com a ESP localizada no ponto.

A ESP do ponto funciona como uma ponte entre o ônibus e a infraestrutura de rede.

O processo simplificado é:

```text
┌─────────────────┐
│  ESP DO ÔNIBUS  │
│  servidor BLE   │
└────────┬────────┘
         │
         │ Bluetooth / BLE
         ▼
┌─────────────────┐
│ ESP DO PORTÃO   │
│ cliente BLE     │
│ Wi-Fi + MQTT    │
└────────┬────────┘
         │
         │ Wi-Fi / Internet
         ▼
┌─────────────────┐
│   EMQX CLOUD    │
│  Broker MQTT    │
└────────┬────────┘
         │
         │ MQTT
         ▼
┌─────────────────┐
│ GeradorDeCSV.py │
└────────┬────────┘
         │
         ▼
┌────────────────────────────┐
│ TelemetriaYYYY-MM-DD.csv   │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────┐
│ Backend LocBUS  │
│      + site     │
└─────────────────┘
```

Em palavras simples:

1. a ESP do ônibus anuncia/transmite informações por BLE;
2. a ESP do ponto encontra o ônibus e recebe essas informações;
3. a ESP do ponto utiliza Wi-Fi para acessar a Internet;
4. ela publica os dados no broker MQTT;
5. o `GeradorDeCSV.py` recebe as mensagens;
6. os dados são armazenados em arquivos CSV;
7. o backend utiliza esses arquivos para produzir as informações mostradas no site.

---

### 1.3 Servidor MQTT utilizado — EMQX Cloud

O projeto utiliza um broker criado na plataforma **EMQX Cloud**.

Página de acesso:

https://accounts.emqx.com/signin

O EMQX Cloud é um serviço online que permite criar e administrar um broker MQTT sem precisar manter manualmente toda a infraestrutura do servidor.

De forma resumida, no painel da EMQX é possível configurar e consultar informações como:

- deployment/broker;
- endereço do broker;
- portas disponíveis;
- conexão com TLS;
- autenticação de clientes;
- usuários e senhas;
- informações necessárias para que dispositivos e aplicações se conectem.

No tipo de conexão utilizado pelo LocBUS, a comunicação é protegida por TLS e utiliza certificado de autoridade certificadora (CA).

A porta atualmente utilizada no projeto é:

```text
8883
```

que corresponde à conexão MQTT protegida por TLS na configuração adotada.

O EMQX funciona como o ponto intermediário entre quem **publica** e quem **assina** as mensagens:

```text
ESP do ponto
    ↓ publica
EMQX Broker
    ↓ distribui
GeradorDeCSV.py
    ↓ recebe
```

O endereço, usuário, senha e outros dados sensíveis não devem ser colocados em documentação pública nem reproduzidos por uma IA.

---

### 1.4 Como os arquivos CSV são gerados

O código responsável por registrar a telemetria no computador é:

```text
data/ServidorESP/GeradorDeCSV.py
```

Ele funciona como um **cliente MQTT assinante**.

De forma simplificada:

```text
GeradorDeCSV.py inicia
        ↓
usa certificado TLS
        ↓
conecta ao broker EMQX
        ↓
assina tele/#
        ↓
recebe mensagens MQTT
        ↓
grava mensagens válidas no CSV do dia
```

O certificado utilizado pelo coletor fica em:

```text
data/ServidorESP/emqxsl-ca.crt
```

Esse certificado permite que o cliente valide a conexão TLS com o servidor.

Os arquivos de telemetria são armazenados em:

```text
data/telemetria/
```

A nomenclatura atual é diária:

```text
TelemetriaYYYY-MM-DD.csv
```

Exemplo:

```text
Telemetria2026-09-07.csv
```

Ao iniciar, o coletor pode criar o arquivo do dia com o cabeçalho mesmo antes de receber uma nova mensagem.

Quando passa da meia-noite, o nome do arquivo é recalculado para que as próximas mensagens sejam gravadas no CSV correspondente ao novo dia.

---

### 1.5 Responsabilidades do Grupo 2

O **Grupo 2 — Telemetria, MQTT e Dados** é responsável principalmente pela parte da cadeia que conecta os dados publicados pelas ESPs ao armazenamento utilizado pelo backend.

As responsabilidades incluem:

- broker MQTT;
- comunicação MQTT entre dispositivos e coletor;
- `GeradorDeCSV.py`;
- TLS e certificados;
- tópicos MQTT;
- payloads;
- retained;
- timestamps;
- geração e estrutura dos CSVs;
- contrato de dados;
- validação dos dados recebidos;
- retenção e organização dos arquivos de telemetria;
- externalização futura de configurações e credenciais;
- preparação futura do formato de eventos para múltiplos ônibus e múltiplos pontos.

O grupo atua principalmente nesta parte:

```text
ESP do ponto
    ↓
MQTT / EMQX
    ↓
GeradorDeCSV.py
    ↓
CSV
    ↓
Backend
```

Como essa camada faz a ligação entre Firmware/Hardware e Backend, mudanças no formato das mensagens devem ser coordenadas com os Grupos 1 e 3.

## 2. Leitura humana obrigatória

```text
00_CONTEXTO_GERAL_LOCBUS.md
AUD_04_contrato_dados_mqtt.md
AUD_06_ciclo_vida_telemetria.md
AUD_07_configuracoes_mqtt.md
ARQ_02_plano_externalizacao_mqtt.md
AUD_16_diagnostico_firmware_comunicacao.md
```

## 3. Enviar para a IA

```text
00_CONTEXTO_GERAL_LOCBUS.md
02_GRUPO_TELEMETRIA_MQTT.md
AUD_04_contrato_dados_mqtt.md
AUD_06_ciclo_vida_telemetria.md
AUD_07_configuracoes_mqtt.md
AUD_08_estrutura_telemetria_fluxo_ativo.txt
AUD_12_regras_negocio_atual.md
AUD_14_preparacao_baseline_funcional.md
AUD_15_baseline_funcional_site.md
AUD_16_diagnostico_firmware_comunicacao.md
ARQ_01_plano_externalizacao_preliminar.txt
ARQ_02_plano_externalizacao_mqtt.md
ARQ_05_regras_negocio_futuras.md
data/ServidorESP/GeradorDeCSV.py
app/config.py
app/services.py
data/ServidorESP/emqxsl-ca.crt
```

Se a tarefa envolver a origem física dos dados, incluir também os dois `.ino`.

## 4. Firmwares relacionados, estrutura dos CSVs e problemas conhecidos

Antes de analisar os problemas da telemetria, é importante compreender os arquivos que produzem os dados e como eles chegam ao CSV.

### 4.1 `bleenvio.ino` — ESP do ônibus

Arquivo:

```text
data/ServidorESP/bleenvio/bleenvio.ino
```

Deve ser gravado na:

```text
ESP do ônibus
```

Na versão atualmente salva, essa ESP funciona como um **servidor BLE**.

Sua função básica é:

1. iniciar o Bluetooth Low Energy;
2. anunciar um serviço BLE;
3. aguardar uma ESP cliente se conectar;
4. enviar uma identificação;
5. aguardar uma confirmação da ESP do ponto;
6. reiniciar o ciclo.

Na versão analisada, a identificação transmitida é:

```text
A
```

Esse valor foi pensado como identificação do ônibus A.

---

### 4.2 `wifiserver_2.ino` — ESP do CCHLA

Arquivo:

```text
data/ServidorESP/wifiserver_2/wifiserver_2.ino
```

Deve ser gravado na:

```text
ESP do CCHLA
```

Essa ESP possui três funções principais:

```text
cliente BLE
+
cliente Wi-Fi
+
cliente MQTT
```

De forma resumida:

1. conecta-se ao Wi-Fi;
2. conecta-se ao broker MQTT utilizando TLS;
3. procura a ESP do ônibus por BLE;
4. conecta-se ao ônibus;
5. recebe/lê o valor transmitido;
6. publica uma informação no tópico MQTT;
7. envia uma confirmação ao ônibus.

Na implementação analisada, existem caminhos diferentes em que o valor publicado pode ser:

```text
A
```

ou:

```text
1
```

Essa diferença é um dos problemas que ainda precisa ser resolvido.

---

### 4.3 ESP do CI

A arquitetura prevista inclui uma terceira ESP:

```text
ESP do CI
```

Ela deverá exercer uma função semelhante à ESP do CCHLA, mas representando o ponto CI.

Entretanto:

```text
a ESP física do CI ainda não existe
```

e ainda não há um firmware definitivo e validado para esse módulo.

Não deve ser criado um protocolo definitivo para o CI sem alinhamento com os grupos responsáveis por Firmware/Hardware, Telemetria/MQTT e Backend.

---

### 4.4 `GeradorDeCSV.py`

Arquivo:

```text
data/ServidorESP/GeradorDeCSV.py
```

Esse programa roda no computador/servidor e funciona como cliente MQTT assinante.

Ele:

- conecta ao broker;
- utiliza TLS;
- assina `tele/#`;
- recebe mensagens;
- identifica mensagens retained;
- não grava retained como novo evento;
- grava mensagens live no CSV diário;
- cria o arquivo diário quando necessário.

---

### 4.5 Arquivos CSV de telemetria

Os arquivos gerados ficam em:

```text
data/telemetria/
```

com nomes no formato:

```text
TelemetriaYYYY-MM-DD.csv
```

O cabeçalho atual é:

```csv
timestamp_utc,timestamp_local,topic,value,raw_payload
```

Cada coluna possui uma função:

| Campo | Significado |
|---|---|
| `timestamp_utc` | data e hora do recebimento registradas em UTC |
| `timestamp_local` | data e hora convertidas para o horário local |
| `topic` | tópico MQTT de onde a mensagem foi recebida |
| `value` | valor interpretado pelo coletor a partir do payload |
| `raw_payload` | conteúdo bruto recebido na mensagem MQTT |

Os timestamps são gerados pelo **computador que executa o coletor**, e não diretamente pelas ESPs.

O coletor registra o conteúdo recebido, mas o backend atual utiliza principalmente:

```text
timestamp_utc
value
```

e aceita como valores válidos de estado principalmente:

```text
0
1
```

Isso significa que outros campos são preservados no CSV mesmo quando ainda não são plenamente utilizados pelo backend.

---

### 4.6 Problemas conhecidos

#### 4.6.1 Assinatura ampla `tele/#`

**Descrição**

O coletor assina:

```text
tele/#
```

Isso permite receber qualquer tópico que esteja abaixo de `tele/`.

**Por que é um problema**

Se futuramente houver vários ônibus, pontos ou dispositivos publicando nesse espaço, diferentes fontes podem acabar sendo gravadas juntas.

O sistema precisará utilizar corretamente o `topic` e/ou campos explícitos de identificação.

---

#### 4.6.2 Backend atual ignora `topic`

**Descrição**

O CSV preserva o tópico de origem, mas o backend atual trabalha principalmente com `timestamp_utc` e `value`.

**Por que é um problema**

Com apenas um ponto isso pode funcionar como protótipo, mas em uma arquitetura com vários pontos e ônibus o sistema precisa saber **quem publicou** cada evento.

---

#### 4.6.3 Contrato atual mistura `A`, `0` e `1`

**Descrição**

A cadeia atual possui significados diferentes:

```text
A = identificação utilizada pelo firmware do ônibus
1 = CCHLA na lógica atual
0 = CI na lógica atual
```

O firmware da ESP do CCHLA também possui caminhos diferentes em que pode publicar `A` ou forçar `1`.

**Por que é um problema**

Identidade do ônibus, identidade do ponto e estado não deveriam ficar misturados em um único valor.

Esse problema é uma das motivações para um contrato futuro mais estruturado.

---

#### 4.6.4 Credenciais hardcoded

**Descrição**

Há informações de conexão gravadas diretamente dentro de arquivos de código.

`hardcoded` significa que o valor foi escrito diretamente no código, em vez de ser carregado de uma configuração externa.

**Por que é um problema**

Isso dificulta:

- segurança;
- compartilhamento do projeto;
- versionamento;
- troca de servidor;
- uso em outras máquinas.

A externalização das configurações já foi planejada, mas ainda não foi implementada.

---

#### 4.6.5 Política de retained precisa ser definida com clareza

**Descrição**

O firmware analisado publica utilizando `retain=true`.

Quando uma nova publicação retained é feita, o broker guarda o último valor daquele tópico para entregá-lo também a futuros assinantes.

O coletor atual ignora mensagens que chegam marcadas como retained ao se conectar.

**Por que é um problema**

O projeto precisa distinguir claramente:

```text
último estado armazenado pelo broker
```

de:

```text
novo evento físico ocorrido naquele momento
```

Importante: `retain=true` não significa automaticamente que uma publicação nova será ignorada por um assinante que já estava conectado. Uma nova publicação pode ser entregue normalmente como mensagem live e, ao mesmo tempo, ficar armazenada para futuros assinantes.

---

#### 4.6.6 Retenção de CSV ainda está misturada à janela do Histórico

**Descrição**

A quantidade de dias usada pelo Histórico também está relacionada à rotina de exclusão de arquivos antigos.

**Por que é um problema**

São políticas diferentes:

```text
quantos dias exibir no site
```

e:

```text
por quanto tempo preservar os CSVs
```

A intenção futura é desacoplar essas duas decisões.

---

#### 4.6.7 Credenciais e configurações do servidor ainda precisam ser externalizadas

**Descrição**

Broker, usuário, senha e outras informações sensíveis ainda fazem parte da configuração atual do código.

**Por que é um problema**

A migração anterior de servidor mostrou que alterações de infraestrutura podem exigir mudanças em vários arquivos.

A direção futura é utilizar configuração externa, mantendo exemplos seguros para a equipe.

---

#### 4.6.8 Contrato futuro de eventos ainda não foi implementado

**Descrição**

Já foi discutida uma estrutura futura contendo campos como:

```text
bus_id
gate_id
event
event_id
timestamp
```

mas isso ainda é arquitetura futura.

**Por que é um problema**

Os grupos não devem começar a programar assumindo um formato definitivo antes de alinharem juntos o contrato.

## 5. Estado comprovado

`GeradorDeCSV.py` já foi testado e:

- conecta ao broker;
- assina `tele/#`;
- cria CSV diário;
- recebe retained;
- não grava retained no CSV;
- não recebeu mensagem live no teste com as ESPs.

## 6. Não decidir sozinho

- semântica física de eventos;
- protocolo definitivo das ESPs;
- regras de domínio;
- política visual do frontend.

## 7. Prompt pronto para a IA

Com as atualizações deste guia, o prompt precisa ser mais completo. A IA deve compreender não apenas MQTT e CSV, mas também a origem física dos dados, o papel dos dois firmwares, a função do EMQX Cloud e os limites entre o Grupo 2 e os demais grupos.

```text
Você está me auxiliando no GRUPO 2 — TELEMETRIA, MQTT E DADOS
do projeto LocBUS.

Quero que você atue como um orientador técnico experiente em
MQTT, IoT, Python, comunicação entre dispositivos, TLS e
organização de dados de telemetria.

Explique tudo de forma didática. Antes de qualquer futura
implementação, mostre o que será alterado, por que seria
necessário e quais outros grupos seriam afetados.

Leia integralmente todos os arquivos anexados antes de propor
qualquer mudança.

REGRAS DA DOCUMENTAÇÃO

AUD_ = auditoria do estado observado.
DID_ = explicação didática.
ARQ_ = decisão, proposta ou arquitetura futura.

IMPORTANTE:

ARQ_ NÃO significa que algo já esteja implementado.

O código atual é a fonte de verdade sobre o que está efetivamente
implementado.

Quando houver divergência entre documentação e código:

1. identifique;
2. não corrija silenciosamente;
3. mostre o comportamento atual;
4. mostre a decisão futura relacionada;
5. mantenha a divergência explícita até validação da equipe.

SEGURANÇA

Nunca reproduza senhas, tokens, chaves, host sensível, usuário ou
outra credencial literal encontrada nos arquivos.

Use:

[REDACTED]

quando necessário.

RESPONSABILIDADE DO GRUPO 2

Este grupo é responsável principalmente por:

- MQTT;
- EMQX/broker;
- TLS;
- certificados;
- tópicos;
- payloads;
- retained;
- GeradorDeCSV.py;
- geração dos CSVs;
- timestamps;
- contrato de telemetria;
- validação dos dados;
- retenção dos arquivos;
- externalização futura de configurações;
- preparação da camada de dados para múltiplos ônibus e pontos.

NÃO devemos decidir sozinhos:

- significado físico de ARRIVED/DEPARTED;
- firmware definitivo;
- protocolo físico das ESPs;
- regras internas de domínio do backend;
- apresentação visual do frontend.

NESTA PRIMEIRA CONVERSA, NÃO IMPLEMENTE NADA E NÃO ALTERE
ARQUIVOS.

PARTE 1 — RECONSTRUA A COMUNICAÇÃO COMPLETA

Explique, usando os arquivos fornecidos:

ESP do ônibus
    ↓ BLE
ESP do CCHLA
    ↓ Wi-Fi + MQTT/TLS
EMQX Broker
    ↓
GeradorDeCSV.py
    ↓
CSV diário
    ↓
Backend

Para cada etapa diga:

- quem envia;
- quem recebe;
- qual tecnologia é usada;
- qual arquivo de código participa;
- quais dados são transportados;
- o que está comprovado e o que ainda é incerto.

PARTE 2 — FIRMWARES RELACIONADOS

Analise:

- bleenvio.ino;
- wifiserver_2.ino.

Informe:

1. em qual ESP cada arquivo deve ser gravado;
2. papel BLE de cada ESP;
3. o que é transmitido;
4. como ocorre a confirmação;
5. onde Wi-Fi entra na cadeia;
6. onde MQTT entra na cadeia;
7. quais valores A, 0 e 1 aparecem;
8. quais inconsistências existem.

Não proponha regravação ainda.

PARTE 3 — MQTT E EMQX

Explique o MQTT no contexto específico do LocBUS:

- publisher;
- subscriber;
- broker;
- topic;
- payload;
- QoS;
- retained;
- TLS;
- autenticação.

Analise a configuração do EMQX somente a partir dos arquivos e
da documentação fornecida.

Não exponha credenciais.

Diferencie claramente:

mensagem live
vs.
mensagem retained entregue após uma assinatura.

PARTE 4 — GeradorDeCSV.py

Analise o código detalhadamente.

Explique:

- inicialização;
- criação do CSV;
- conexão TLS;
- conexão MQTT;
- assinatura tele/#;
- callback de mensagem;
- tratamento de retained;
- geração de timestamps;
- rollover diário;
- flush/fsync;
- reconexão;
- possíveis erros.

PARTE 5 — CONTRATO DO CSV

Confirme no código o cabeçalho:

timestamp_utc,timestamp_local,topic,value,raw_payload

Para cada campo:

- origem;
- tipo/conteúdo;
- quem preenche;
- quem utiliza atualmente;
- utilidade futura.

Informe também quais campos o backend atualmente ignora.

PARTE 6 — ESTADO COMPROVADO PELOS TESTES

Considere o baseline físico já documentado.

Diferencie:

- COMPROVADO PELO CÓDIGO;
- COMPROVADO PELOS TESTES;
- BUG/PROBLEMA CONFIRMADO;
- DECISÃO FUTURA;
- HIPÓTESE;
- INCERTO.

Inclua especialmente:

- conexão do GeradorDeCSV.py ao broker;
- assinatura tele/#;
- criação do CSV diário;
- recebimento de [RET];
- ausência de [MSG] no teste físico;
- comportamento com ESP do CCHLA isolada.

PARTE 7 — PROBLEMAS CONHECIDOS

Analise, sem implementar:

- assinatura ampla tele/#;
- backend ignorando topic;
- mistura A/0/1;
- credenciais hardcoded;
- política de retained;
- retenção física dos CSVs;
- externalização da configuração;
- contrato futuro ainda não implementado.

Para cada problema:

1. explique a causa ou, se não estiver comprovada, marque INCERTO;
2. diga por que é um problema;
3. indique arquivos envolvidos;
4. indique grupos afetados;
5. diga qual evidência ainda falta.

PARTE 8 — DEPENDÊNCIAS ENTRE GRUPOS

Mostre as interfaces:

Grupo 3 — Firmware/Hardware
    ↓
Grupo 2 — Telemetria/MQTT
    ↓
Grupo 1 — Backend
    ↓
Grupo 4 — Frontend

Indique claramente quais decisões o Grupo 2 pode tomar sozinho e
quais exigem alinhamento.

Considere o Grupo 5 como responsável por testes e integração.

PARTE 9 — ARQUITETURA FUTURA

Leia os arquivos ARQ_ e diferencie:

- decisões já encaminhadas;
- propostas;
- pontos ainda indefinidos.

Analise especialmente a estrutura candidata:

bus_id
gate_id
event
event_id
timestamp

Não trate esses campos como implementados se estiverem apenas nos
documentos de arquitetura futura.

PARTE 10 — FONTES PRIMÁRIAS

Ao final, informe quais arquivos devem ser tratados como fonte
primária para futuras tarefas deste grupo.

Finalize com:

ESTADO DE PRONTIDÃO DO GRUPO 2

Informe:

1. o que já está suficientemente compreendido;
2. o que pode começar a ser trabalhado;
3. o que depende dos testes físicos do Grupo 3;
4. o que depende de decisão conjunta com o Backend;
5. quais problemas precisam permanecer abertos;
6. qual seria uma sequência segura de trabalho para este grupo.

Não altere nenhum arquivo.
Não implemente nenhuma correção.
Aguarde minha próxima instrução.
```
