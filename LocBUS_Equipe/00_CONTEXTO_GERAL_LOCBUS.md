# Contexto Geral do LocBUS para a Nova Equipe

## 1. Objetivo deste documento

Este arquivo é o ponto de entrada comum para todos os novos integrantes do LocBUS.

Ele não substitui as auditorias detalhadas já existentes em `Notas/`. Sua função é permitir que qualquer pessoa compreenda rapidamente:

- o que é o LocBUS;
- como o sistema funciona atualmente;
- quais partes já foram validadas;
- quais problemas e bugs já foram identificados;
- quais decisões futuras já foram discutidas;
- em que ponto o projeto está;
- como utilizar a documentação existente;
- como trabalhar com uma IA sem misturar o estado atual com propostas futuras.

---

## 2. O que é o LocBUS e de onde surgiu a ideia

O LocBUS surgiu como um produto desenvolvido na disciplina **Profissional III**, do curso de Engenharia Elétrica da UFPB, no período **2025.2**. A disciplina tinha como foco a mobilidade elétrica e, como atividade final, propunha o desenvolvimento de um projeto para apresentação na Feira de Engenharia e Energia do CEAR.

Durante a busca por problemas reais de mobilidade que pudessem ser abordados pelo projeto, foi identificada uma dificuldade recorrente relacionada ao ônibus circular da UFPB: embora exista um itinerário oficial, os horários previstos não representam necessariamente o momento exato em que o ônibus estará em cada ponto. Isso gera incerteza para estudantes que dependem do circular para se deslocar entre diferentes áreas da universidade.

A ideia do LocBUS é, portanto, complementar o itinerário oficial com **informações de telemetria**, permitindo acompanhar de forma mais útil o estado do ônibus e sua movimentação entre pontos da rota.

No estágio atual, o desenvolvimento e os testes estão concentrados principalmente na rota:

```text
CCHLA <-> CI
```

A proposta é que o sistema reconheça eventos associados à passagem do ônibus pelos pontos monitorados e transforme esses dados em informações compreensíveis para o usuário do site.

### 2.1 Lógica atual dos valores `0` e `1`

Na lógica atual do projeto:

```text
1 = CCHLA
0 = CI
```

O backend utiliza o **valor anterior** e o **valor atual** para inferir se o ônibus chegou a um ponto ou saiu dele.

| Valor anterior | Valor atual | Interpretação |
|---|---|---|
| `1` | `0` | Saiu do CCHLA e chegou ao CI |
| `0` | `0` | Chegou ao CI e depois saiu em direção ao CCHLA |
| `0` | `1` | Saiu do CI e chegou ao CCHLA |
| `1` | `1` | Chegou ao CCHLA e depois saiu em direção ao CI |

Uma forma simples de visualizar é:

```text
                  ROTA CCHLA -> CI

        CCHLA                               CI
        valor 1                           valor 0
          ●  ───────────────────────────────►  ●

          1 -> 0
          saiu do CCHLA e chegou ao CI


                  ROTA CI -> CCHLA

        CCHLA                               CI
        valor 1                           valor 0
          ●  ◄───────────────────────────────  ●

          0 -> 1
          saiu do CI e chegou ao CCHLA
```

As repetições representam o ônibus associado ao mesmo ponto em dois registros consecutivos e, pela regra atual, são interpretadas como nova saída:

```text
0 -> 0
chegou ao CI e depois saiu em direção ao CCHLA

1 -> 1
chegou ao CCHLA e depois saiu em direção ao CI
```

Essa lógica é importante para compreender o sistema atual, mas **não deve ser tratada como a arquitetura definitiva do LocBUS**.

---

## 3. Módulos físicos e arquitetura atual

### 3.1 Ideia dos módulos

A arquitetura física idealizada atualmente considera **três módulos principais**, cada um com uma ESP:

```text
Módulo 1 — ESP do ônibus
Módulo 2 — ESP do CCHLA
Módulo 3 — ESP do CI
```

### 3.2 Módulo do ônibus

A ESP instalada no ônibus funciona atualmente como **servidor BLE**.

Sua função é:

- anunciar sua presença via BLE;
- disponibilizar um serviço BLE;
- transmitir uma identificação;
- aguardar confirmação da ESP instalada no ponto.

Firmware de referência:

```text
data/ServidorESP/bleenvio/bleenvio.ino
```

Na versão analisada, o payload enviado é:

```text
A
```

### 3.3 Módulo do CCHLA

A ESP do CCHLA funciona como:

```text
cliente BLE
+
cliente Wi-Fi
+
cliente MQTT
```

Ela procura o ônibus por BLE, recebe sua identificação, conecta-se ao Wi-Fi e ao broker MQTT, publica o dado e envia uma confirmação ao ônibus.

Firmware de referência:

```text
data/ServidorESP/wifiserver_2/wifiserver_2.ino
```

### 3.4 Módulo do CI

A ideia é que o CI também possua uma ESP própria com função semelhante à ESP do CCHLA, mas representando o ponto CI.

Entretanto:

```text
A ESP física do CI ainda não existe.
```

Também ainda **não existe um firmware definitivo e validado para esse terceiro módulo**. Ele deverá ser criado somente quando a arquitetura dos pontos estiver suficientemente definida.

### 3.5 Arquitetura atual do sistema

```text
ESP do ônibus
    ↓ BLE
ESP do ponto (atualmente CCHLA)
    ↓ Wi-Fi + TLS + MQTT
Broker EMQX
    ↓
GeradorDeCSV.py
    ↓
TelemetriaYYYY-MM-DD.csv
    ↓
Backend FastAPI
    ↓
Regras de negócio
    ↓
Frontend Jinja/HTML/CSS
    ↓
Usuário
```

Em termos simples:

1. a ESP do ônibus anuncia sua presença;
2. a ESP do ponto detecta o ônibus;
3. a ESP do ponto publica uma informação no broker MQTT;
4. o `GeradorDeCSV.py` recebe as mensagens;
5. os dados são gravados em CSV;
6. o backend lê e interpreta a telemetria;
7. o site apresenta o resultado ao usuário.

A cadeia física completa ainda não está totalmente validada.

---

## 4. Estado atual das fases

A divisão em fases foi criada para fornecer um **norte de organização** durante a auditoria, validação e evolução do LocBUS.

Ela não deve ser interpretada como uma sequência rígida. Com os novos grupos:

- diferentes fases podem avançar ao mesmo tempo;
- uma fase futura pode começar antes de outra;
- novas fases podem surgir;
- prioridades podem mudar;
- cada grupo pode evoluir em ritmo diferente.

Assim, a lista abaixo representa principalmente o estado de organização do projeto até este momento.

```text
FASE 0 — Proteção / Git                         PARCIAL
FASE 1 — Inventário estrutural                  CONCLUÍDA
FASE 2 — Fluxo de execução                      CONCLUÍDA
FASE 3 — Dependências                           CONCLUÍDA
FASE 4 — Dados / MQTT                           CONCLUÍDA para o estágio atual
FASE 5 — Regras de negócio                      CONCLUÍDA
FASE 6 — Mapas e ferramentas                    CONCLUÍDA
FASE 7A — Preparação do baseline                CONCLUÍDA
FASE 7B — Baseline funcional do site            CONCLUÍDA
FASE 7C — Baseline físico ESP/BLE/MQTT          EM ANDAMENTO / PAUSADA
FASE 8 — Bugs e casos extremos                  NÃO INICIADA formalmente
FASE 9 — Segurança / configuração               PENDENTE
FASE 10 — Arquitetura / testabilidade           PENDENTE
FASE 11 — Frontend / UX                         PENDENTE
FASE 12 — Crescimento futuro                    PENDENTE
FASE 13 — Roadmap final                         PENDENTE
FASE 14 — Primeiro baseline Git limpo           PENDENTE
FASE 15 — Implementação controlada              PENDENTE
```

---

## 5. Como funciona o site e qual é o baseline atual

O site atual é construído com FastAPI, templates Jinja, HTML, CSS e recursos estáticos.

### 5.1 Mapa

Apresenta o estado atual inferido do ônibus, podendo mostrar:

- centro/ponto associado;
- rota atual;
- última verificação;
- classificação de atualidade/confiabilidade;
- estimativa de tempo;
- mapa estático correspondente ao estado ou rota;
- mensagens quando os dados estão indisponíveis.

### 5.2 Histórico

Apresenta uma sequência cronológica de eventos ou segmentos interpretados a partir da telemetria, incluindo:

- data;
- horário;
- origem e destino;
- períodos de espera;
- rotas;
- miniaturas dos mapas.

### 5.3 Itinerário

Apresenta os horários programados do ônibus circular com base nas informações oficiais utilizadas no projeto.

Ele não representa a localização precisa em tempo real do ônibus.

### 5.4 Sobre

Apresenta:

- descrição do LocBUS;
- propósito;
- integrantes;
- responsabilidades;
- imagens e elementos visuais do projeto.

### 5.5 Baseline funcional validado

Já foram validados:

- FastAPI inicia normalmente;
- `/status` responde;
- `/telemetry-meta` responde;
- polling do frontend funciona;
- aba Mapa funciona;
- aba Histórico funciona, com bugs conhecidos;
- aba Itinerário funciona;
- aba Sobre funciona;
- recursos estáticos carregam;
- os CSVs permaneceram íntegros durante o teste.

O baseline da cadeia física completa ainda não foi concluído.

---

## 6. Principais problemas já confirmados no software

Os problemas identificados foram distribuídos entre os cinco grupos de acordo com a área responsável.

Este documento apresenta apenas uma visão geral. Os detalhes técnicos de cada problema serão explicados no arquivo individual do grupo responsável.

### 6.1 Fallback do backend

Quando não existe telemetria válida, o backend ainda pode produzir valores sintéticos como:

```text
estado = CHEGOU
centro = CCHLA
ETA = 15–25 min
```

### 6.2 ETA com dados indisponíveis

A interface ainda pode exibir `15–25 min` mesmo quando a telemetria está indisponível.

### 6.3 "Confiabilidade ETA"

A ideia de uma **confiabilidade do ETA** surgiu para tentar informar ao usuário o quanto a estimativa apresentada poderia ser considerada atual ou confiável.

A intenção era evitar que o site exibisse apenas um tempo estimado sem indicar se aquele valor estava baseado em uma telemetria recente ou em dados já antigos.

Na lógica atual, essa classificação está associada principalmente ao tempo decorrido desde a última telemetria válida, usando níveis como:

```text
Alta
Média
Baixa
Indisponível
```

Entretanto, isso ainda **não representa uma confiabilidade real do ETA**, pois mede principalmente a atualidade dos dados e não a precisão da estimativa de tempo.

Por esse motivo, essa lógica precisa ser **repensada e implementada de fato** no futuro, separando melhor conceitos como:

```text
atualidade da telemetria
```

e:

```text
confiabilidade da estimativa de chegada
```

Assim, o sistema poderá informar de forma mais correta se os dados estão recentes e, separadamente, qual é o nível de confiança do ETA calculado.

### 6.4 Histórico

Há bug confirmado de associação de miniaturas:

- `CI -> CCHLA` mostra a miniatura da rota oposta;
- `CCHLA -> CI` mostra a miniatura da rota oposta;
- mapas de "Aguardando" também aparecem invertidos.

Há ainda um problema de ordenação relatado anteriormente, mas não reproduzido no baseline atual.

### 6.5 Texto sobre Google Maps

A interface menciona Google Maps e um "check-up de 5 em 5 minutos", mas o runtime atual não executa esse cálculo.

### 6.6 Histórico e status

O status e o histórico atuais não compartilham uma única máquina de estados.

### 6.7 Retenção de CSV

`HISTORY_DAYS` está ligado tanto à janela de histórico quanto à exclusão física de arquivos antigos.

### 6.8 Segurança e portabilidade

Ainda existem:

- credenciais hardcoded (**informações gravadas diretamente dentro do código, em vez de serem carregadas de um arquivo de configuração ou variável externa**);
- caminhos absolutos;
- configuração MQTT embutida;
- scripts auxiliares dependentes do ambiente local.

---

## 7. Estado físico, firmware e diagnóstico atual

Assim como os problemas de software, os assuntos de hardware, firmware, BLE e MQTT foram divididos entre os grupos responsáveis.

Aqui é apresentada apenas a visão geral. Os detalhes técnicos, hipóteses e próximos testes serão explicados nos arquivos individuais dos grupos relacionados.

Atualmente existem:

```text
ESP do ônibus = disponível
ESP do CCHLA = disponível
ESP do CI = ainda inexistente
```

O teste físico confirmou:

- `GeradorDeCSV.py` conecta ao broker;
- assina `tele/#`;
- cria o CSV diário;
- recebe valor retained antigo;
- a ESP do CCHLA sozinha não gera evento indevido;
- com as duas ESPs próximas, não foi observada mensagem live no coletor;
- a causa ainda está em diagnóstico.

Os firmwares salvos apresentam uma inconsistência:

```text
ESP do ônibus envia: A
ESP do CCHLA pode publicar: A ou 1
Backend aceita: 0 ou 1
```

O próximo diagnóstico planejado é observar a ESP do ônibus isolada pelo Serial Monitor a `115200 baud`.

---

## 8. Arquitetura atual e arquitetura futura já discutida

### 8.1 Arquitetura atual

Atualmente, o LocBUS trabalha com:

```text
1 = CCHLA
0 = CI
```

A comparação entre valor anterior e atual permite ao backend inferir chegada, saída, rota ou espera.

Essa estratégia permitiu construir rapidamente um protótipo funcional, mas possui limitações porque um único valor acaba concentrando significados de ponto, presença, estado e movimento.

### 8.2 Por que pensar em uma nova arquitetura

A necessidade de uma arquitetura futura surgiu principalmente por causa de uma limitação física importante da detecção atual.

A lógica original foi pensada considerando que o ônibus chegaria ao ponto, seria detectado e depois se afastaria. Porém, na prática, o ônibus **nem sempre fica estacionado longe do portão do CCHLA ou do CI**. Em alguns momentos, ele pode permanecer parado muito próximo ao próprio portão onde está a ESP responsável pela detecção.

Isso cria um problema: enquanto o ônibus continua próximo ao ponto, a ESP pode detectá-lo várias vezes.

Na lógica antiga, detecções repetidas podem acabar sendo interpretadas como novos eventos, mesmo que fisicamente nada tenha acontecido.

Por exemplo:

```text
ônibus chega ao CCHLA
    ↓
fica parado próximo ao portão
    ↓
ESP continua detectando o ônibus
    ↓
novas detecções podem ser interpretadas
como novas chegadas ou saídas
```

Ou seja:

```text
detecção repetida
!=
nova passagem do ônibus
```

A arquitetura futura foi pensada justamente para separar **presença física** de **evento de chegada ou saída**.

Em vez de tratar cada detecção como um novo acontecimento, o sistema poderá manter um estado de presença e somente gerar um evento quando houver uma mudança real de estado.

### 8.3 Arquitetura futura

#### Presença física

A proposta é trabalhar com estados como:

```text
DESCONHECIDO
AUSENTE
PRESENTE
```

O significado é:

- `DESCONHECIDO`: o sistema ainda não possui informação suficiente para afirmar se o ônibus está ou não naquele ponto;
- `AUSENTE`: o ônibus não está sendo considerado presente naquele ponto;
- `PRESENTE`: o ônibus está sendo considerado presente naquele ponto.

Possíveis transições:

```text
AUSENTE -> PRESENTE = ARRIVED
PRESENTE -> PRESENTE = nenhum novo evento
PRESENTE -> AUSENTE = DEPARTED
```

O ponto principal é que:

```text
PRESENTE -> PRESENTE
```

não gera uma nova chegada.

Assim, se o ônibus permanecer parado próximo ao portão e continuar sendo detectado, o sistema entende apenas que ele **continua presente**, evitando criar eventos falsos.

Da mesma forma, a saída poderá ser confirmada apenas quando houver evidência suficiente de que o ônibus deixou realmente a área de detecção.

#### Estado da telemetria

Além da presença física, também foi pensado em separar a situação dos dados recebidos.

A proposta é utilizar estados como:

```text
TELEMETRIA_OK
TELEMETRIA_ANTIGA
SEM_TELEMETRIA
TELEMETRIA_INVALIDA
ERRO_TELEMETRIA
```

Isso permite distinguir duas coisas diferentes:

```text
onde o ônibus está
```

de:

```text
quão confiáveis ou disponíveis estão os dados
```

Por exemplo, o sistema pode ter como último estado conhecido:

```text
PRESENTE no CCHLA
```

mas, ao mesmo tempo, informar:

```text
TELEMETRIA_ANTIGA
```

se já passou muito tempo desde a última atualização.

#### Eventos estruturados

Estrutura candidata:

```text
bus_id
gate_id
event
event_id
timestamp
```

Exemplo:

```text
bus_id = BUS01
gate_id = CCHLA
event = ARRIVED
```

A ideia é separar claramente:

- qual ônibus;
- qual ponto;
- qual evento ocorreu;
- qual evento é único;
- quando aconteceu.

### 8.4 Como pensamos em implementar

A ideia geral é evoluir gradualmente:

```text
detecção física
    ↓
estado de presença
    ↓
evento explícito
    ↓
MQTT
    ↓
armazenamento
    ↓
backend
    ↓
status + histórico
    ↓
frontend
```

A implementação definitiva ainda não está fechada e deverá ser coordenada entre os grupos.

---

## 9. Mapas

### 9.1 Origem histórica

Os mapas foram gerados na primeira versão do LocBUS, quando ainda era usado a biblioteca Streamlit. A Streamlit funciona como backend e frontend ao mesmo tempo, servindo para aplicações mais rápidas e simples. Por isso, gerar os mapas todas vez que o ônibus mudasse de rota seria algo que exigiria demais e foi pensado em uma outra solução.

A solução foi já deixar os mapas gerados previamente e apenas selecionar o mapa de acordo com a rota que o ônibus estiver atualmente, de modo que seja apenas uma seleção de imagens ao invés da geração dos mesmos. Como não há GPS, então os mapas foram criados traçado a rota no Google My Maps e exportado em arquivos .KMZ

Assim:

```text
gera o mapa uma vez
    ↓
salva em PNG
    ↓
durante a execução apenas seleciona
o PNG correspondente
```

Arquivos usados atualmente incluem:

```text
aguardando_CCHLA.png
aguardando_CI.png
Rota_CCHLA_CI.png
Rota_CI_CCHLA.png
```

### 9.2 Fluxo oficial de regeneração

```text
Google Maps / Google My Maps
    ↓
KMZ/KML
    ↓
build_maps_from_kml.py
    +
mapa_base.png
    +
mapa_base_bbox.json
    +
ícones
    ↓
PNGs finais
```

`generate_overlays_osm.py` permanece como ferramenta alternativa/experimental.

---

## 10. A pasta `Notas/`

### 10.1 O que é e para que serve

A pasta `Notas/` funciona como a **memória técnica e organizacional do LocBUS**.

Ela registra:

- análises;
- auditorias;
- decisões;
- explicações;
- hipóteses;
- arquitetura;
- planejamento;
- problemas encontrados;
- contexto histórico.

### 10.2 O que é um arquivo `.md`

A extensão `.md` significa **Markdown**.

É um formato de texto simples que permite organizar conteúdo com:

- títulos;
- subtítulos;
- listas;
- tabelas;
- blocos de código;
- links;
- destaques.

Ele é útil porque:

- é leve;
- pode ser lido em qualquer editor;
- funciona bem no VS Code e GitHub;
- é simples de versionar;
- é adequado para documentação técnica;
- pode ser facilmente enviado para uma IA.

### 10.3 Organização interna

```text
Notas/
├── README.md
├── 00_planejamento_atual_locbus.txt
├── Auditorias/
├── Documentos_Didaticos/
├── Decisoes_e_Arquitetura/
└── Equipe/
```

#### `Auditorias/`

Contém análises do estado observado do projeto.

#### `Documentos_Didaticos/`

Contém explicações para facilitar a compreensão de partes do projeto.

#### `Decisoes_e_Arquitetura/`

Contém decisões, propostas futuras, alternativas e arquitetura pretendida.

#### `Equipe/`

Contém os documentos criados para onboarding, divisão dos grupos, leituras recomendadas, arquivos a enviar para IA e prompts de orientação.

### 10.4 Prefixos utilizados

```text
AUD_ = auditoria do estado observado

DID_ = explicação didática

ARQ_ = decisão, proposta ou arquitetura futura
```

---

## 11. Regra sobre fonte de verdade

Quando houver conflito entre documentação e código:

```text
1. O código atual é a fonte de verdade sobre o que está implementado.
2. A documentação explica o contexto e as decisões.
3. Não corrigir silenciosamente a divergência.
4. Registrar a divergência.
5. Levar a decisão para alinhamento da equipe.
```

---

## 12. Uso de IA pela equipe

Cada grupo poderá utilizar a IA de sua preferência como ferramenta de apoio.

A recomendação é usá-la como um **orientador técnico**, e não apenas como gerador de código.

O integrante pode pedir explicitamente:

```text
Atue como um orientador técnico experiente nesta área do projeto.
Explique de forma didática, ajude a interpretar os arquivos,
identifique riscos e dependências, proponha testes e, antes de
implementar mudanças, explique o que será alterado e por quê.
```

A IA deve ajudar o integrante a:

- compreender o projeto;
- interpretar o código;
- revisar decisões;
- planejar alterações;
- identificar impactos;
- criar testes;
- documentar resultados;
- aprender durante o desenvolvimento.

### 12.1 O que deve ser enviado para a IA

A IA deve receber:

- este documento;
- o guia específico do grupo;
- os arquivos listados no guia;
- os arquivos de código relacionados à tarefa.

Evite enviar toda a pasta `Notas/` como contexto inicial sem necessidade.

A IA deve distinguir:

```text
IMPLEMENTADO ATUALMENTE
ANALISADO / AUDITADO
DECIDIDO PARA O FUTURO
INCERTO
```

Antes de implementar qualquer mudança, a IA deve informar:

1. o que entendeu;
2. o que está comprovado;
3. o que é decisão futura;
4. o que permanece incerto;
5. quais outros grupos serão afetados.

---

## 13. Divisão em cinco grupos

```text
GRUPO 1 — Backend e regras de negócio

GRUPO 2 — Telemetria, MQTT e dados

GRUPO 3 — Firmware e hardware

GRUPO 4 — Frontend e UX

GRUPO 5 — Mapas, ETA, testes e integração
```

Cada grupo possui um guia próprio com:

- responsabilidade;
- leitura humana;
- arquivos para a IA;
- código relevante;
- problemas conhecidos;
- decisões futuras;
- limites de atuação;
- prompt inicial pronto para a IA.
