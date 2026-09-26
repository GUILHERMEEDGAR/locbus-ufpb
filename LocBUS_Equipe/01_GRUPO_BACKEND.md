# Grupo 1 — Backend e Regras de Negócio

## 1. Estrutura do LocBUS e responsabilidades do grupo

Antes de tratar especificamente do backend, é importante compreender onde essa parte está localizada dentro do projeto.

De forma simplificada, a estrutura principal do LocBUS está organizada assim:

```text
LocBUS/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── domain.py
│   ├── services.py
│   ├── Templates/
│   │   └── arquivos HTML/Jinja do site
│   └── static/
│       └── imagens, estilos, mapas e recursos estáticos
│
├── data/
│   ├── ServidorESP/
│   │   ├── GeradorDeCSV.py
│   │   ├── emqxsl-ca.crt
│   │   ├── bleenvio/
│   │   │   └── bleenvio.ino
│   │   └── wifiserver_2/
│   │       └── wifiserver_2.ino
│   │
│   └── telemetria/
│       └── TelemetriaYYYY-MM-DD.csv
│
├── tools/
│   └── ferramentas auxiliares
│
└── Notas/
    ├── Auditorias/
    ├── Documentos_Didaticos/
    ├── Decisoes_e_Arquitetura/
    └── Equipe/
```

### 1.1 O que são os quatro arquivos principais do Grupo 1

Os quatro arquivos principais do Grupo 1 ficam dentro da pasta `app/` e dividem entre si as responsabilidades centrais do backend.

#### `app/main.py`

É o **ponto principal de entrada da aplicação FastAPI**.

De forma geral, esse arquivo é responsável por:

- criar/configurar a aplicação FastAPI;
- definir as rotas/endpoints HTTP;
- receber requisições do navegador;
- chamar funções da camada de serviços;
- entregar dados para os templates;
- expor endpoints usados pelo frontend, como os relacionados ao status e à revisão da telemetria;
- participar do fluxo de inicialização da aplicação.

Em termos simplificados:

```text
navegador
    ↓
main.py
    ↓
services.py
    ↓
dados processados
    ↓
main.py
    ↓
template / resposta HTTP
```

O `main.py` deve concentrar a coordenação das requisições, evitando acumular regras de negócio que pertencem a outras camadas.

---

#### `app/config.py`

É o arquivo de **configurações e constantes utilizadas pelo backend**.

Ele reúne parâmetros que precisam ser usados por diferentes partes do sistema, evitando espalhar valores fixos por vários arquivos.

Entre os tipos de informação associados a essa camada estão, por exemplo:

- caminhos de arquivos e diretórios;
- limites do Histórico;
- quantidade de dias considerada;
- tempos utilizados em regras atuais;
- nomes de arquivos;
- parâmetros compartilhados pelo backend.

Em termos simplificados:

```text
config.py
    ↓
fornece constantes/configurações
    ↓
main.py / services.py / outras partes do backend
```

Esse arquivo é importante porque várias limitações atuais do sistema também estão relacionadas a configurações que precisam ser revistas no futuro, como a separação entre janela de exibição do Histórico e política de retenção dos CSVs.

---

#### `app/domain.py`

É o arquivo responsável por representar **estruturas e conceitos do domínio do LocBUS**.

Em vez de trabalhar apenas com dicionários e valores soltos, o backend pode utilizar estruturas próprias para representar informações como o estado atual do ônibus.

Um dos conceitos centrais identificados nas análises é o `StatusLocBUS`, usado para organizar informações que serão posteriormente apresentadas pela aplicação.

A função dessa camada é aproximar o código dos conceitos reais do projeto.

Em termos simplificados:

```text
dados brutos
    ↓
services.py interpreta
    ↓
estrutura de domínio
    ↓
domain.py
    ↓
status coerente para a aplicação
```

À medida que a arquitetura futura evoluir, esse arquivo tende a ser importante para representar de forma mais clara conceitos como:

- estado físico;
- situação da telemetria;
- eventos;
- ônibus;
- pontos monitorados.

Esses conceitos futuros ainda não devem ser considerados implementados apenas porque já foram discutidos em arquivos `ARQ_`.

---

#### `app/services.py`

É o arquivo que concentra grande parte da **lógica de processamento e das regras atuais do backend**.

Nas análises já realizadas, ele aparece como a camada responsável por tarefas como:

- localizar e ler arquivos de telemetria;
- selecionar os dados relevantes;
- validar valores recebidos;
- interpretar `0` e `1`;
- comparar valores atual e anterior;
- inferir chegada, saída, rota e espera;
- montar informações de status;
- reconstruir o Histórico;
- calcular informações auxiliares usadas pela interface;
- fornecer metadados da telemetria;
- participar do tratamento de arquivos antigos.

Em termos simplificados:

```text
CSV de telemetria
    ↓
services.py
    ↓
interpretação + regras de negócio
    ↓
domain.py / estruturas de retorno
    ↓
main.py
    ↓
frontend
```

Por concentrar boa parte das regras atuais, `services.py` é também um dos arquivos mais importantes para o Grupo 1 revisar com cuidado.

---

### 1.2 Como esses quatro arquivos trabalham juntos

Uma visão resumida da relação entre eles é:

```text
config.py
   ↓
fornece parâmetros
   ↓

CSV / telemetria
   ↓
services.py
   ↓
interpreta e aplica regras
   ↓
domain.py
   ↓
organiza os conceitos/estruturas
   ↓
main.py
   ↓
expõe endpoints e entrega dados ao frontend
```

Essa separação é útil para que o grupo evite colocar toda a lógica dentro de um único arquivo.

O **Grupo 1 — Backend e Regras de Negócio** é responsável principalmente pela camada que recebe os dados já coletados, interpreta a telemetria e transforma essas informações em estados e estruturas que serão consumidos pelo site.

As responsabilidades principais são:

- `app/main.py`;
- `app/config.py`;
- `app/domain.py`;
- `app/services.py`;
- manutenção e evolução do backend FastAPI;
- regras de negócio;
- estado atual do ônibus;
- interpretação da telemetria;
- histórico;
- fallback;
- tratamento de erros;
- coerência entre status atual e histórico;
- preparação do backend para múltiplos ônibus e múltiplos pontos.

O backend está no meio da cadeia geral do LocBUS:

```text
Firmware/Hardware
    ↓
Telemetria/MQTT
    ↓
BACKEND E REGRAS DE NEGÓCIO
    ↓
Frontend/UX
```

Por isso, alterações que mudem contratos compartilhados com firmware, MQTT, dados ou frontend não devem ser feitas isoladamente por este grupo.

## 2. Leitura humana obrigatória

```text
00_CONTEXTO_GERAL_LOCBUS.md
DID_01_logica_backend_valores_0_1.md
AUD_12_regras_negocio_atual.md
ARQ_05_regras_negocio_futuras.md
AUD_15_baseline_funcional_site.md
```

## 3. Enviar para a IA

```text
00_CONTEXTO_GERAL_LOCBUS.md
01_GRUPO_BACKEND.md
AUD_02_fluxo_execucao.md
AUD_04_contrato_dados_mqtt.md
AUD_05_verificacao_logica_estado.md
AUD_06_ciclo_vida_telemetria.md
AUD_12_regras_negocio_atual.md
AUD_15_baseline_funcional_site.md
DID_01_logica_backend_valores_0_1.md
ARQ_03_nova_arquitetura_presenca_eventos.md
ARQ_05_regras_negocio_futuras.md
app/main.py
app/config.py
app/domain.py
app/services.py
```

Consulta opcional: `AUD_01`, `AUD_03`, `AUD_08`, `AUD_09`.

## 4. Problemas conhecidos

Os itens abaixo são problemas, limitações ou comportamentos já identificados no backend atual. Cada um deles deverá ser tratado com base nas evidências das auditorias e nos testes já realizados.

### 4.1 Fallback sintético

**Descrição do problema**

Quando não existe telemetria válida, o backend ainda pode produzir um estado artificial, com informações como:

```text
estado = CHEGOU
centro = CCHLA
ETA = 15–25 min
```

mesmo quando os dados disponíveis não permitem afirmar que o ônibus realmente está no CCHLA.

**Por que isso é um problema**

A ausência de telemetria não deve ser interpretada como uma posição conhecida do ônibus. Esse comportamento pode fazer o site apresentar ao usuário uma informação que não foi comprovada pelos dados.

A direção futura é representar explicitamente situações como ausência, erro ou antiguidade da telemetria, sem inventar uma localização.

---

### 4.2 ETA exibido mesmo sem telemetria válida

**Descrição do problema**

O sistema ainda pode apresentar uma estimativa de tempo, atualmente na faixa de:

```text
15–25 min
```

mesmo quando a telemetria está indisponível ou não há dados suficientes para saber a situação real do ônibus.

**Por que isso é um problema**

Um ETA só é útil quando existe uma base de dados válida para sustentá-lo. Exibir uma estimativa nessas condições pode transmitir uma precisão que o sistema não possui.

---

### 4.3 Lógica de confiabilidade do ETA ainda não representa uma confiabilidade real

**Descrição do problema**

A classificação atual de confiabilidade utiliza principalmente o tempo desde a última telemetria e gera níveis como:

```text
Alta
Média
Baixa
Indisponível
```

Na prática, isso representa mais a **atualidade da telemetria** do que a precisão real da estimativa de chegada.

**Por que isso é um problema**

Atualidade dos dados e confiabilidade do ETA são conceitos diferentes. Misturá-los pode fazer o usuário interpretar que existe uma medida real de precisão da estimativa quando essa lógica ainda não foi implementada de fato.

No futuro, o backend deverá separar esses dois conceitos.

---

### 4.4 Primeiro evento ambíguo

**Descrição do problema**

A lógica atual depende da comparação entre o valor mais recente e o valor anterior. Quando existe somente um primeiro evento válido, não há contexto anterior suficiente para determinar com segurança o que ocorreu antes dele.

**Por que isso é um problema**

O sistema pode precisar assumir uma chegada ou saída sem saber se o ônibus:

- já estava naquele ponto;
- acabou de chegar;
- acabou de sair;
- iniciou o sistema já em movimento.

Isso pode gerar um estado inicial incorreto.

---

### 4.5 Status e Histórico utilizam regras paralelas

**Descrição do problema**

O estado atual e o Histórico não são construídos exatamente pela mesma lógica interna.

O status utiliza principalmente a comparação entre valores, enquanto o Histórico reconstrói segmentos de rota e de espera utilizando contexto próprio.

**Por que isso é um problema**

Os mesmos dados podem acabar produzindo interpretações diferentes em duas partes do sistema.

A direção futura é fazer status e histórico consumirem uma representação comum de eventos.

---

### 4.6 Bug das miniaturas do Histórico

**Descrição do problema**

Foi confirmado no baseline que algumas miniaturas do Histórico estão associadas à direção oposta da rota mostrada no texto.

Exemplos:

```text
CI -> CCHLA
mostra a miniatura CCHLA -> CI

CCHLA -> CI
mostra a miniatura CI -> CCHLA
```

O mesmo problema ocorre com as imagens de espera no CCHLA e no CI.

**Por que isso é um problema**

A imagem contradiz a informação textual e pode confundir o usuário sobre o sentido real da rota.

Além da correção técnica desse bug, também está sendo discutido se ainda é uma boa ideia manter miniaturas de mapas dentro do Histórico.

Essa decisão fica a cargo do grupo responsável pela experiência visual do sistema, principalmente o **Grupo 4 — Frontend e UX**, podendo ser alinhada com o **Grupo 5 — Mapas, ETA, Testes e Integração**.

O Grupo Backend deve fornecer os dados corretos para o Histórico, mas não deve decidir sozinho se a miniatura deve permanecer na interface.

---

### 4.7 Possível problema de ordenação do Histórico

**Descrição do problema**

Já foi relatado que, em algumas situações, o primeiro item exibido no Histórico pode não corresponder ao evento cronologicamente mais recente.

Esse comportamento não foi reproduzido no baseline atual.

**Por que isso é um problema**

O primeiro item deveria representar corretamente o evento mais recente. Uma ordenação incorreta pode levar o usuário a interpretar de forma errada a movimentação atual ou mais recente do ônibus.

Por ainda não ter sido reproduzido, este item deve ser tratado como:

```text
PENDENTE DE REPRODUÇÃO
```

---

### 4.8 `HISTORY_DAYS` está ligado à exclusão física dos CSVs

**Descrição do problema**

A configuração relacionada à quantidade de dias do Histórico também participa da rotina que pode excluir arquivos antigos de telemetria.

**Por que isso é um problema**

São duas decisões diferentes:

```text
quantos dias devem aparecer no site
```

e:

```text
por quanto tempo os arquivos devem permanecer armazenados
```

A intenção já discutida é permitir que o site mostre aproximadamente os últimos 7 dias, sem apagar automaticamente arquivos mais antigos apenas porque eles deixaram de aparecer na interface.

---

### 4.9 `telemetria.csv` como fallback não é uma solução definitiva adequada

**Descrição do problema**

Historicamente, o arquivo `telemetria.csv` servia como fallback para evitar que o site quebrasse quando não existisse um CSV diário válido.

**Por que isso é um problema**

Esse mecanismo pode mascarar a ausência real de dados.

O backend futuro deverá conseguir tratar diretamente situações como:

```text
SEM_TELEMETRIA
TELEMETRIA_ANTIGA
TELEMETRIA_INVALIDA
ERRO_TELEMETRIA
```

sem precisar utilizar um arquivo artificial para simular continuidade.

---

### 4.10 Contrato atual do backend ainda depende de `0` e `1`

**Descrição do problema**

O backend atual interpreta principalmente:

```text
0
1
```

mas os firmwares analisados já apresentam situações em que a identificação `A` pode aparecer na cadeia de comunicação.

**Por que isso é um problema**

Isso mostra que ainda existe uma diferença entre:

```text
identidade do ônibus
```

e:

```text
estado/ponto utilizado pelo backend
```

Esse contrato não deve ser alterado somente pelo Grupo Backend. Qualquer mudança deve ser definida em conjunto com os grupos responsáveis por Firmware/Hardware e Telemetria/MQTT.

## 5. Direções futuras

- separar estado físico e estado da telemetria;
- suportar `DESCONHECIDO`;
- não inventar ETA;
- eventos explícitos;
- status e histórico consumindo a mesma representação;
- multiônibus e multipontos.

## 6. Não decidir sozinho

- payload MQTT definitivo;
- semântica física de presença;
- protocolo do firmware;
- nomes de campos compartilhados com frontend/dados.

## 7. Prompt pronto para a IA

O prompt abaixo foi atualizado para que a IA não apenas leia os documentos, mas também valide diretamente no código o papel de `main.py`, `config.py`, `domain.py` e `services.py`, identifique dependências entre eles e evite confundir decisões futuras com funcionalidades já implementadas.

```text
Você está me auxiliando no GRUPO 1 — BACKEND E REGRAS DE NEGÓCIO
do projeto LocBUS.

Quero que você atue como um orientador técnico experiente em
backend Python/FastAPI, arquitetura de software e regras de negócio.

Explique de forma didática, ajude a interpretar os arquivos,
identifique riscos e dependências e, antes de qualquer futura
implementação, explique o que seria alterado e por quê.

Leia integralmente todos os arquivos anexados antes de propor
qualquer mudança.

REGRAS DOS DOCUMENTOS

AUD_ = auditoria do estado observado.
DID_ = explicação didática.
ARQ_ = decisão, proposta ou arquitetura futura.

IMPORTANTE:

ARQ_ NÃO significa que algo já esteja implementado.

O código atual é a fonte de verdade sobre o que está efetivamente
implementado.

Se houver divergência entre documentação e código:

1. identifique a divergência;
2. não a corrija silenciosamente;
3. informe qual comportamento o código possui atualmente;
4. informe qual decisão futura está documentada;
5. mantenha a divergência explícita até validação da equipe.

RESPONSABILIDADE DO GRUPO 1

Nosso grupo é responsável principalmente por:

- app/main.py;
- app/config.py;
- app/domain.py;
- app/services.py;
- FastAPI;
- regras de negócio;
- estado atual do ônibus;
- interpretação da telemetria;
- histórico;
- fallback;
- tratamento de erros;
- coerência entre status e histórico;
- preparação futura para múltiplos ônibus e múltiplos pontos.

NÃO devemos decidir sozinhos contratos compartilhados de:

- firmware;
- MQTT;
- payload;
- eventos físicos;
- nomes de campos compartilhados;
- apresentação visual do frontend.

Quando uma mudança atingir outro grupo, sinalize explicitamente
qual grupo precisa participar da decisão.

NESTA PRIMEIRA CONVERSA, NÃO IMPLEMENTE NADA E NÃO ALTERE ARQUIVOS.

PRIMEIRO, FAÇA UMA LEITURA ESTRUTURAL DO BACKEND

Analise individualmente:

1. app/main.py
2. app/config.py
3. app/domain.py
4. app/services.py

Para cada arquivo, informe:

- qual é sua responsabilidade atual;
- quais funções/classes/constantes principais possui;
- quais outros arquivos ele chama ou utiliza;
- quem depende dele;
- quais regras de negócio estão presentes;
- quais responsabilidades parecem estar no lugar correto;
- quais responsabilidades estão excessivamente misturadas;
- quais problemas conhecidos estão relacionados a ele.

Depois, produza um fluxo mostrando como os quatro arquivos
trabalham juntos desde a leitura da telemetria até a resposta
entregue ao frontend.

EM SEGUIDA, ANALISE O ESTADO DO BACKEND

1. resuma o funcionamento atual;
2. explique a lógica atual de 0 e 1;
3. explique como o status atual é construído;
4. explique como o Histórico é construído;
5. explique o comportamento quando não existe telemetria válida;
6. explique o papel atual do ETA e de sua classificação de
   confiabilidade/atualidade;
7. explique como os CSVs são selecionados e utilizados;
8. identifique qualquer rotina de exclusão/limpeza de telemetria.

CLASSIFIQUE TODAS AS CONCLUSÕES COMO:

- COMPROVADO PELO CÓDIGO;
- COMPROVADO PELO BASELINE;
- BUG CONFIRMADO;
- PROBLEMA RELATADO / PENDENTE DE REPRODUÇÃO;
- DECISÃO FUTURA;
- HIPÓTESE;
- INCERTO.

PROBLEMAS CONHECIDOS

Verifique no código e na documentação, sem assumir previamente a
causa, os seguintes pontos:

- fallback sintético;
- ETA mostrado sem telemetria válida;
- confiabilidade do ETA baseada principalmente na idade dos dados;
- primeiro evento ambíguo;
- regras paralelas de status e Histórico;
- miniaturas invertidas do Histórico;
- possível problema de ordenação do Histórico;
- acoplamento entre HISTORY_DAYS e exclusão física;
- uso histórico de telemetria.csv como fallback;
- dependência do contrato atual 0/1.

Para cada item:

1. diga se está comprovado no código, no baseline ou apenas relatado;
2. identifique os arquivos/funções envolvidos;
3. explique por que é um problema;
4. indique quais outros grupos podem ser afetados;
5. NÃO implemente a correção ainda.

ARQUITETURA FUTURA

Leia os arquivos ARQ_ fornecidos e explique separadamente:

- o que já foi decidido como direção;
- o que ainda é apenas proposta;
- o que ainda precisa de definição conjunta;
- o que exigiria mudança em Firmware/Hardware;
- o que exigiria mudança em Telemetria/MQTT;
- o que exigiria mudança no Frontend.

Não trate DESCONHECIDO, AUSENTE, PRESENTE, ARRIVED, DEPARTED,
bus_id, gate_id, event_id ou novos estados de telemetria como
implementados se eles existirem apenas na documentação futura.

INTERFACES COM OUTROS GRUPOS

Mostre explicitamente as interfaces:

Firmware/Hardware
    ↓
Telemetria/MQTT
    ↓
Backend
    ↓
Frontend

e informe quais contratos o Grupo 1 pode modificar sozinho e
quais exigem alinhamento.

FONTES PRIMÁRIAS

Ao final, indique quais documentos e arquivos de código devem ser
tratados como fontes primárias para futuras tarefas do Grupo 1.

Finalize com uma seção chamada:

ESTADO DE PRONTIDÃO DO GRUPO 1

Nessa seção informe:

1. se já existe contexto suficiente para começar a receber tarefas;
2. quais pontos ainda precisam ser reproduzidos/testados;
3. quais decisões dependem de outros grupos;
4. quais divergências entre código e documentação precisam ser
   mantidas em observação;
5. qual seria uma sequência segura de trabalho para o grupo.

Não altere nenhum arquivo.
Não implemente nenhuma correção.
Aguarde minha próxima instrução.
```
