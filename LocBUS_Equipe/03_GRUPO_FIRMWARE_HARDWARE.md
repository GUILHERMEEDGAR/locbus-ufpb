# Grupo 3 — Firmware e Hardware

## 1. Firmware, relação com o LocBUS e responsabilidades do grupo

### 1.1 O que é firmware

**Firmware** é o programa gravado diretamente em um dispositivo eletrônico, como uma ESP32.

No LocBUS, o firmware é o código que define como cada ESP deve se comportar fisicamente.

Ele determina, por exemplo:

- como a ESP inicia;
- como utiliza o Bluetooth Low Energy (BLE);
- como se conecta ao Wi-Fi;
- como se conecta ao MQTT;
- quais dados envia;
- quais dados recebe;
- quando considera que o ônibus foi detectado;
- quando envia uma confirmação;
- como reage a falhas de comunicação.

Em termos simples:

```text
hardware = a ESP física

firmware = o programa gravado dentro dela
```

No projeto atual, os dois principais firmwares salvos são:

```text
data/ServidorESP/bleenvio/bleenvio.ino
```

para a:

```text
ESP do ônibus
```

e:

```text
data/ServidorESP/wifiserver_2/wifiserver_2.ino
```

para a:

```text
ESP do CCHLA
```

A futura ESP do CI ainda não possui um firmware definitivo e validado.

O Grupo 3 trabalha justamente na camada em que o sistema digital entra em contato com o mundo físico.

A cadeia simplificada é:

```text
ônibus físico
    ↓
ESP do ônibus
    ↓ BLE
ESP do ponto
    ↓ Wi-Fi / MQTT
restante do LocBUS
```

Por isso, erros no firmware podem impedir que o restante do sistema receba corretamente os eventos físicos.

---

### 1.2 Responsabilidades do Grupo 3

O **Grupo 3 — Firmware e Hardware** é responsável principalmente por:

- ESP do ônibus;
- ESP do CCHLA;
- futura ESP do CI;
- BLE;
- firmware;
- presença física;
- RSSI;
- debounce;
- histerese;
- timeout;
- calibração física;
- múltiplos ônibus.

Também deverá participar das decisões que relacionem:

```text
detecção física
↓
evento
↓
payload
↓
MQTT
```

porque o firmware é a origem de parte importante dos dados do LocBUS.

---

### 1.3 Conceitos que fazem parte da responsabilidade do grupo

Os conceitos abaixo fazem parte da área de atuação do Grupo 3, mas **nem todos já existem no LocBUS atual**.

Para evitar confusão, cada conceito está classificado como:

```text
JÁ EXISTE NO PROJETO
EXISTE PARCIALMENTE
IDEIA FUTURA
```

---

#### RSSI

**Situação no LocBUS:**

```text
IDEIA FUTURA
```

`RSSI` significa **Received Signal Strength Indicator**, ou indicador de intensidade do sinal recebido.

No contexto do LocBUS, ele pode ser usado como uma informação auxiliar para estimar se a ESP do ônibus está:

```text
mais próxima
```

ou:

```text
mais distante
```

da ESP instalada no ponto.

Em geral, quanto menos negativo o valor de RSSI, mais forte é o sinal recebido.

Exemplo simplificado:

```text
-45 dBm → sinal mais forte
-80 dBm → sinal mais fraco
```

Entretanto, RSSI não deve ser tratado sozinho como uma medida exata de distância, porque pode variar com:

- obstáculos;
- posição da antena;
- pessoas;
- veículos;
- paredes;
- interferências;
- orientação física das ESPs.

No firmware atual analisado, **não existe uma lógica implementada de decisão baseada em RSSI**.

Por isso, no LocBUS ele deve ser considerado, neste momento, uma **ideia futura de apoio à detecção de presença/proximidade**.

---

#### Debounce

**Situação no LocBUS:**

```text
IDEIA FUTURA
```

`Debounce` é uma técnica usada para evitar que várias leituras muito próximas no tempo sejam interpretadas como vários eventos diferentes.

No LocBUS, o problema poderia ser:

```text
ônibus chega ao ponto
↓
ESP detecta
↓
detecta novamente
↓
detecta novamente
↓
sistema cria vários eventos
```

Com debounce, o sistema pode ignorar repetições dentro de uma janela curta de tempo.

A ideia é evitar:

```text
uma presença física
```

virar:

```text
várias chegadas falsas
```

No estado atual do projeto, **essa lógica ainda não está implementada de forma específica como debounce**.

Ela está registrada como uma possibilidade futura para tornar a detecção física mais estável.

---

#### Histerese

**Situação no LocBUS:**

```text
IDEIA FUTURA
```

`Histerese` é uma técnica usada para evitar que o sistema fique mudando de estado repetidamente quando uma medição está próxima de um limite.

Exemplo:

se futuramente o RSSI for utilizado e ficar oscilando próximo ao limite usado para considerar o ônibus presente, sem histerese o sistema poderia fazer:

```text
PRESENTE
AUSENTE
PRESENTE
AUSENTE
```

em poucos segundos.

Com histerese, podem existir critérios diferentes para:

```text
entrar no estado PRESENTE
```

e:

```text
sair do estado PRESENTE
```

Isso ajuda a tornar a detecção mais estável.

No LocBUS atual, **não existe uma lógica de histerese implementada**.

Ela é uma ideia futura que poderá ser avaliada principalmente se RSSI ou outro critério de proximidade passar a fazer parte da detecção.

---

#### Timeout

**Situação no LocBUS:**

```text
EXISTE PARCIALMENTE
```

`Timeout` é um limite máximo de tempo de espera.

No projeto atual, esse conceito **já existe em algumas partes**, mas não em todas.

Na ESP do CCHLA existem limites de tempo para tentativas relacionadas a:

```text
Wi-Fi
MQTT
```

Por outro lado, no firmware atual do ônibus existem pontos em que a ESP pode ficar esperando indefinidamente:

```text
esperando uma conexão BLE
```

ou:

```text
esperando confirmação "OK"
```

Nessas etapas, ainda não existe um timeout adequado.

Uma evolução futura poderia definir algo como:

```text
se não houver resposta após determinado tempo,
encerrar a tentativa e seguir para uma ação segura
```

Portanto, o conceito de timeout **já está presente parcialmente no projeto**, mas ainda precisa ser ampliado e melhor definido para a comunicação BLE e para outros estados de espera.

---

#### Calibração física

**Situação no LocBUS:**

```text
IDEIA FUTURA / ETAPA FUTURA DE TESTES
```

A **calibração física** consiste em testar o sistema no ambiente real para descobrir quais parâmetros funcionam melhor.

No LocBUS, isso pode envolver testes como:

- onde posicionar a ESP do portão;
- onde posicionar a ESP do ônibus;
- qual alcance BLE é adequado;
- quais valores de RSSI aparecem com o ônibus perto ou longe;
- quanto tempo confirmar ausência;
- quanto tempo usar para debounce;
- como obstáculos afetam a comunicação;
- se o ônibus parado próximo ao portão continua sendo detectado.

Esses valores não devem ser definidos apenas por teoria ou por tentativa no código.

Eles precisam ser testados fisicamente no ambiente em que o sistema será usado.

No momento, **a calibração física ainda não foi realizada como uma etapa formal do projeto**.

Ela deverá acontecer depois que a comunicação básica estiver estabilizada e quando os critérios de presença forem definidos.

---

#### Múltiplos ônibus

**Situação no LocBUS:**

```text
IDEIA FUTURA
```

O protótipo atual está concentrado em **um ônibus**.

Entretanto, o LocBUS deve ser pensado para permitir futuramente vários ônibus.

Isso significa que o sistema deverá conseguir diferenciar algo como:

```text
BUS01
BUS02
BUS03
...
```

No estado atual:

```text
multiônibus ainda não está implementado
```

O firmware e o contrato de comunicação não poderão depender de um único valor genérico que não identifique qual ônibus foi detectado.

Esse assunto se relaciona diretamente com a arquitetura futura de:

```text
bus_id
gate_id
event
event_id
timestamp
```

mas essa estrutura também ainda não está implementada.

---

### 1.4 Resumo do estado desses conceitos

| Conceito | Situação atual |
|---|---|
| RSSI | Ideia futura |
| Debounce | Ideia futura |
| Histerese | Ideia futura |
| Timeout | Existe parcialmente |
| Calibração física | Etapa futura de testes |
| Múltiplos ônibus | Ideia futura |

Essa classificação deve ser mantida durante o trabalho do grupo para evitar que uma IA ou um integrante interprete uma proposta futura como uma funcionalidade já presente no firmware atual.

## 2. Leitura humana obrigatória

```text
00_CONTEXTO_GERAL_LOCBUS.md
AUD_11_validacao_complementar_firmware.md
AUD_16_diagnostico_firmware_comunicacao.md
ARQ_03_nova_arquitetura_presenca_eventos.md
ARQ_04_ideias_futuras_hardware_firmware.md
DID_01_logica_backend_valores_0_1.md
```

## 3. Enviar para a IA

```text
00_CONTEXTO_GERAL_LOCBUS.md
03_GRUPO_FIRMWARE_HARDWARE.md
AUD_04_contrato_dados_mqtt.md
AUD_05_verificacao_logica_estado.md
AUD_11_validacao_complementar_firmware.md
AUD_12_regras_negocio_atual.md
AUD_16_diagnostico_firmware_comunicacao.md
ARQ_03_nova_arquitetura_presenca_eventos.md
ARQ_04_ideias_futuras_hardware_firmware.md
ARQ_05_regras_negocio_futuras.md
DID_01_logica_backend_valores_0_1.md
data/ServidorESP/bleenvio/bleenvio.ino
data/ServidorESP/wifiserver_2/wifiserver_2.ino
data/ServidorESP/GeradorDeCSV.py
data/ServidorESP/emqxsl-ca.crt
```

## 4. Estado atual conhecido

- ESP ônibus existe;
- ESP CCHLA existe;
- ESP CI ainda não existe;
- teste atual não gerou mensagem live;
- causa ainda em diagnóstico;
- UUIDs salvos são compatíveis;
- ônibus envia `A`;
- CCHLA pode publicar `A` ou `1`;
- backend aceita `0/1`.

## 5. Arquitetura futura candidata

```text
DESCONHECIDO
AUSENTE
PRESENTE
```

```text
AUSENTE -> PRESENTE = ARRIVED
PRESENTE -> PRESENTE = nada
PRESENTE -> AUSENTE = DEPARTED
```

## 6. Próximo teste já planejado

```text
ESP ônibus = DESLIGADA
ESP CCHLA = DESLIGADA
GeradorDeCSV.py = DESLIGADO
FastAPI = DESLIGADO
```

Depois ligar somente a ESP do ônibus e observar o Serial Monitor a `115200 baud`.

## 7. O que não fazer imediatamente e por quê

O projeto está no meio de um diagnóstico físico e os arquivos salvos nem sempre representam com certeza absoluta o firmware atualmente gravado em cada ESP.

Por isso, algumas ações devem ser evitadas até que os testes atuais sejam concluídos.

A intenção não é impedir a evolução do grupo, mas evitar que uma alteração prematura apague evidências importantes ou misture problemas antigos com novos.

### 7.1 Não regravar firmware sem validar

**O que significa**

Não fazer upload imediato de `bleenvio.ino`, `wifiserver_2.ino` ou de versões modificadas para as ESPs antes de compreender o comportamento atual.

**Por que evitar agora**

O projeto ainda está tentando descobrir em qual etapa a comunicação física está falhando.

Se o firmware for substituído antes do diagnóstico, deixamos de saber se:

```text
o problema já existia
```

ou:

```text
foi introduzido pela nova gravação
```

Além disso, ainda há incerteza sobre quais versões estão efetivamente gravadas nas ESPs.

A sequência mais segura é:

```text
observar
↓
registrar logs
↓
comparar com o código salvo
↓
identificar a falha
↓
só então decidir se é necessário regravar
```

---

### 7.2 Não assumir `A/0/1` como protocolo definitivo

**O que significa**

Não criar novas funcionalidades tomando como definitivo que:

```text
A = ônibus
1 = CCHLA
0 = CI
```

será necessariamente o formato final da comunicação.

**Por que evitar agora**

Atualmente os valores possuem responsabilidades misturadas.

`A` está ligado à identificação do ônibus, enquanto `0` e `1` estão ligados à lógica dos pontos/estado utilizada pelo backend.

O firmware do CCHLA também possui caminhos diferentes em que pode publicar `A` ou `1`.

Isso mostra que o contrato ainda não está suficientemente consistente para ser expandido sem discussão.

A arquitetura futura já considera campos explícitos como:

```text
bus_id
gate_id
event
event_id
timestamp
```

mas esses campos ainda não estão implementados.

---

### 7.3 Não alterar o contrato MQTT sozinho

**O que significa**

O Grupo 3 não deve modificar por conta própria:

- tópico;
- estrutura do payload;
- nomes dos campos;
- significado dos valores;
- política de retained;
- identificação de ônibus/ponto;
- formato definitivo dos eventos.

**Por que evitar agora**

O MQTT é a interface entre:

```text
Grupo 3 — Firmware/Hardware
```

e:

```text
Grupo 2 — Telemetria/MQTT
```

e os dados depois são consumidos pelo:

```text
Grupo 1 — Backend
```

Se o firmware mudar o formato sozinho, o coletor ou o backend podem deixar de entender as mensagens.

Qualquer mudança de contrato precisa ser coordenada entre os grupos afetados.

---

### 7.4 Não concluir a causa da falha sem logs

**O que significa**

Não afirmar que o problema atual está no:

- BLE;
- Wi-Fi;
- MQTT;
- TLS;
- certificado;
- broker;
- firmware do ônibus;
- firmware do CCHLA;

sem evidência suficiente.

**Por que evitar agora**

O teste realizado até agora comprovou que:

- o coletor conecta ao broker;
- o coletor recebe retained;
- o CSV é criado;
- não foi observada mensagem live durante o teste com as duas ESPs.

Isso ainda não informa em qual ponto da cadeia a comunicação parou.

É necessário observar os logs das próprias ESPs para separar etapas como:

```text
boot
↓
BLE advertising
↓
scan
↓
conexão BLE
↓
Wi-Fi
↓
MQTT
↓
publish
↓
confirmação
```

Por isso, o próximo teste previsto utiliza o Serial Monitor.

---

### 7.5 O que o grupo deve fazer no lugar dessas ações

Durante o diagnóstico inicial, o caminho recomendado é:

```text
1. observar o firmware atual;
2. registrar logs;
3. testar uma etapa por vez;
4. comparar resultado físico com o código salvo;
5. separar fato de hipótese;
6. documentar o resultado;
7. discutir contratos compartilhados;
8. somente depois alterar e regravar.
```

## 8. Prompt pronto para a IA

Com as atualizações deste guia, o prompt precisa ser mais completo. A IA deve atuar como orientador técnico do grupo, compreender os conceitos físicos envolvidos e preservar o diagnóstico atual antes de sugerir alterações.

```text
Você está me auxiliando no GRUPO 3 — FIRMWARE E HARDWARE
do projeto LocBUS.

Quero que você atue como um orientador técnico experiente em:

- ESP32;
- firmware;
- Bluetooth Low Energy (BLE);
- Wi-Fi;
- MQTT aplicado a dispositivos IoT;
- testes de hardware;
- sistemas de presença;
- depuração por Serial Monitor.

Explique de forma didática e não presuma que eu já conheço todos
os conceitos técnicos.

Antes de qualquer futura implementação, explique:

1. o que pretende alterar;
2. por que a alteração seria necessária;
3. como testar;
4. quais riscos existem;
5. quais outros grupos serão afetados.

Leia integralmente todos os arquivos anexados antes de sugerir
mudanças.

REGRAS DA DOCUMENTAÇÃO

AUD_ = auditoria do estado observado.
DID_ = explicação didática.
ARQ_ = decisão, proposta ou arquitetura futura.

O código atual é a fonte de verdade sobre o que está
implementado nos arquivos salvos.

IMPORTANTE:

Os arquivos salvos podem não corresponder com certeza absoluta
ao firmware atualmente gravado nas ESPs.

Portanto, diferencie:

CÓDIGO SALVO
vs.
COMPORTAMENTO FÍSICO OBSERVADO
vs.
FIRMWARE EFETIVAMENTE GRAVADO

quando isso não estiver comprovado.

ARQ_ NÃO significa que algo já esteja implementado.

SEGURANÇA

Não reproduza credenciais.
Use:

[REDACTED]

quando necessário.

RESPONSABILIDADE DO GRUPO 3

O grupo é responsável principalmente por:

- ESP do ônibus;
- ESP do CCHLA;
- futura ESP do CI;
- firmware;
- BLE;
- presença física;
- RSSI;
- debounce;
- histerese;
- timeout;
- calibração física;
- múltiplos ônibus.

NESTA PRIMEIRA CONVERSA:

NÃO implemente nada.
NÃO altere arquivos.
NÃO regrave firmware.
NÃO proponha upload imediato.

PARTE 1 — EXPLIQUE OS FIRMWARES

Analise individualmente:

- bleenvio.ino;
- wifiserver_2.ino.

Para cada um informe:

1. em qual ESP deve ser gravado;
2. papel físico da ESP;
3. setup();
4. loop();
5. funções principais;
6. callbacks;
7. estados de espera;
8. comunicação utilizada;
9. dados enviados;
10. dados recebidos;
11. logs existentes;
12. possíveis bloqueios;
13. dependências externas.

PARTE 2 — RECONSTRUA A CADEIA FÍSICA

Mostre:

ESP do ônibus
    ↓ BLE
ESP do CCHLA
    ↓ Wi-Fi
Broker MQTT
    ↓
restante do LocBUS

Para cada etapa informe:

- o que deveria acontecer;
- qual evidência comprova que passou;
- qual log pode ser observado;
- qual falha é possível.

PARTE 3 — EXPLIQUE OS CONCEITOS DO GRUPO

Explique no contexto específico do LocBUS:

- RSSI;
- debounce;
- histerese;
- timeout;
- calibração física;
- múltiplos ônibus.

Para cada conceito diga:

1. qual problema tenta resolver;
2. se já está implementado ou não;
3. como poderia ser testado futuramente;
4. quais riscos existem se for usado incorretamente.

Não trate nenhum desses conceitos como já implementado sem
evidência no código.

PARTE 4 — ANALISE O PROBLEMA DA PRESENÇA

Considere o caso real em que o ônibus pode permanecer estacionado
próximo ao portão do CCHLA ou do CI.

Explique por que:

detecção BLE repetida
!=
nova chegada ou saída

Analise a arquitetura candidata:

DESCONHECIDO
AUSENTE
PRESENTE

e:

AUSENTE -> PRESENTE = ARRIVED
PRESENTE -> PRESENTE = nenhum evento
PRESENTE -> AUSENTE = DEPARTED

Diferencie o que é:

- problema atual comprovado;
- proposta futura;
- ponto ainda não definido;
- parâmetro que exigirá calibração física.

PARTE 5 — ANALISE A INCONSISTÊNCIA A / 0 / 1

Explique:

- onde A é produzido;
- onde A é recebido;
- onde A pode ser publicado;
- onde 1 é forçado;
- papel atual de 0 e 1;
- impacto no backend.

Não proponha um protocolo definitivo sem alinhamento com os
Grupos 1 e 2.

PARTE 6 — BLOQUEIOS E TIMEOUTS

Procure no código:

- loops sem timeout;
- espera de conexão BLE;
- espera de confirmação;
- reconexões Wi-Fi;
- reconexões MQTT;
- operações de rede dentro de callbacks.

Classifique cada risco e explique de forma simples o que poderia
acontecer fisicamente.

PARTE 7 — ESTADO DO DIAGNÓSTICO ATUAL

Use os testes já documentados e diferencie:

- COMPROVADO PELO CÓDIGO;
- COMPROVADO PELOS TESTES FÍSICOS;
- DECISÃO FUTURA;
- HIPÓTESE;
- INCERTO.

Não conclua que a causa atual está no BLE, Wi-Fi, MQTT, TLS,
certificado ou broker sem evidência.

PARTE 8 — POR QUE NÃO REGRAVAR AINDA

Explique tecnicamente por que, neste estágio, devemos primeiro:

observar
↓
registrar logs
↓
comparar com o código salvo
↓
identificar a falha
↓
só depois alterar/regravar

Informe quais evidências seriam suficientes para recomendar uma
nova gravação.

PARTE 9 — PRÓXIMOS TESTES

Considere que o próximo teste planejado é a ESP do ônibus isolada
no Serial Monitor a 115200 baud.

Monte um roteiro não destrutivo, etapa por etapa.

Em TODA etapa indique explicitamente:

ESP ônibus = LIGADA/DESLIGADA
ESP CCHLA = LIGADA/DESLIGADA
GeradorDeCSV.py = LIGADO/DESLIGADO
FastAPI = LIGADO/DESLIGADO

Explique:

- o que observar;
- quais logs esperar;
- o que cada resultado significa;
- quando manter ligado;
- quando desligar;
- quando encerrar o teste.

Não avance automaticamente para regravação.

PARTE 10 — DEPENDÊNCIAS COM OUTROS GRUPOS

Mostre o que depende de:

Grupo 2 — Telemetria/MQTT
Grupo 1 — Backend
Grupo 5 — Testes/Integração

Informe quais decisões o Grupo 3 pode tomar sozinho e quais
precisam de alinhamento.

PARTE 11 — FONTES PRIMÁRIAS

Indique quais arquivos devem ser usados como fonte primária para
futuras tarefas do grupo.

Finalize com:

ESTADO DE PRONTIDÃO DO GRUPO 3

Informe:

1. o que já está compreendido;
2. o que ainda precisa ser testado fisicamente;
3. o que impede uma regravação segura agora;
4. quais decisões dependem de outros grupos;
5. quais parâmetros exigirão calibração física;
6. qual seria uma sequência segura de trabalho para o grupo.

Não altere nenhum arquivo.
Não implemente nenhuma correção.
Não regrave nenhuma ESP.
Aguarde minha próxima instrução.
```
