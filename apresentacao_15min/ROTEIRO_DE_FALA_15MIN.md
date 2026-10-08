# 🎙️ ROTEIRO DE FALA COMPLETO — APRESENTAÇÃO LocBUS (15 MINUTOS)

> **Artigo:** *LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo para o Transporte Universitário Intercampi*  
> **Apresentador:** Guilherme Edgar C. S. R. Guedes  
> **Instituição:** Universidade Federal da Paraíba (UFPB)  
> **Tempo Total Alvo:** 13m30s a 14m00s (com margem de 1 minuto de segurança para a banca)

---

## 🧭 Dicas Práticas Antes de Começar
1. **Ritmo de Fala:** Fale com tranquilidade e firmeza. Pausas de 1 a 2 segundos entre os slides ajudam a banca a absorver o conteúdo visual.
2. **Postura Técnica:** Destaque termos de engenharia com naturalidade (*"frugalidade de hardware"*, *"ancoragem determinística por rádio"*, *"centróide ponderado"*).
3. **Se usar os slides HTML (`slides_interativos.html`):** Pressione a tecla **`N`** para abrir o lembrete de fala discreto na base e use o cronômetro no topo.
4. **Se usar o PowerPoint (`LocBUS_Apresentacao_IEEE.pptx`):** O Modo de Apresentação exibe estas mesmas anotações na tela do orador.

---

## ⏱️ Cronograma Minuto a Minuto

| Slide | Título / Tema | Tempo Recomendado | Cronômetro Acumulado |
| :---: | :--- | :---: | :---: |
| **1** | Capa Oficial & Apresentação | 00m 45s | `00:45` |
| **2** | Contexto Operacional (UFPB) | 01m 15s | `02:00` |
| **3** | O Problema & O Dilema Financeiro | 01m 30s | `03:30` |
| **4** | Estado da Arte I: Sistemas AVL Tradicionais | 01m 15s | `04:45` |
| **5** | Estado da Arte II: Crowdsourcing Puro vs. BLE | 01m 30s | `06:15` |
| **6** | A Lacuna Tecnológica (Matriz de Decisão) | 01m 15s | `07:30` |
| **7** | A Solução LocBUS (Telemetria Simbiótica) | 01m 30s | `09:00` |
| **8** | Requisitos de Engenharia (RFs e RNFs) | 01m 00s | `10:00` |
| **9** | Arquitetura de 4 Camadas | 01m 30s | `11:30` |
| **10** | Modelagem Matemática & Algoritmos | 01m 15s | `12:45` |
| **11** | Resultados Experimentais & Teste de Campo | 01m 00s | `13:45` |
| **12** | Conclusão, Roadmap & Agradecimentos | 00m 45s | `14:30` |

---

## 📜 Texto de Fala Slide a Slide

### 🔹 SLIDE 1: Capa Oficial
**Tempo:** 00:45 min | **Meta no Cronômetro:** 00:45

> *"Cumprimento a banca examinadora, colegas pesquisadores e todos os presentes.*  
> 
> *Meu nome é **Guilherme Edgar Guedes**, sou da Universidade Federal da Paraíba, e hoje apresento o trabalho intitulado: **LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo para o Transporte Universitário Intercampi**.*  
> 
> *Esta pesquisa nasceu de uma necessidade real das universidades públicas brasileiras: como monitorar com alta fidelidade uma frota de transporte intercampi gastando **zero reais** em chips 4G veiculares, utilizando um hardware embarcado de menos de **40 reais**, entregando latência de **220 milissegundos** e mantendo total conformidade com a LGPD.*  
> 
> *Vamos entender o cenário que motivou esta arquitetura."*

---

### 🔹 SLIDE 2: Contextualização Operacional (O Cenário da UFPB)
**Tempo:** 01:15 min | **Meta no Cronômetro:** 02:00

> *"Para contextualizar, o transporte circular da UFPB realiza uma ligação diária essencial entre o Campus I, no Castelo Branco, e o Centro de Informática, em Mangabeira.*  
> 
> *Estamos falando de um trajeto longo — superior a **14 quilômetros por ciclo completo** — que corta uma das vias mais congestionadas de João Pessoa, o corredor dos Bancários.*  
> 
> *Ao longo da rota, temos **8 paradas acadêmicas prioritárias**, passando pela Reitoria, Convivência, Centros de Ensino e áreas comerciais.*  
> 
> *O grande problema é que tabelas de horários estáticas simplesmente não funcionam no trânsito urbano. Sem saber onde o ônibus está, a comunidade acadêmica enfrenta longos períodos de espera, muitas vezes sob chuva ou à noite em paradas isoladas, gerando atrasos em aulas, exames e sensação de insegurança pública."*

---

### 🔹 SLIDE 3: O Problema de Pesquisa & Dilema Financeiro
**Tempo:** 01:30 min | **Meta no Cronômetro:** 03:30

> *"Por que, então, a universidade simplesmente não instala rastreadores GPS convencionais em todos os veículos?*  
> 
> *Aqui nos deparamos com um duplo dilema:*  
> 
> *Primeiro, o **orçamento**: computadores de bordo AVL industriais custam entre **1.500 e 2.500 reais** por veículo, acrescidos de mensalidades de chips M2M corporativos de 60 a 120 reais por mês por ônibus. No cenário orçamentário das instituições públicas, esses custos recorrentes costumam levar ao cancelamento do serviço ao primeiro contingenciamento.*  
> 
> *Segundo, o **fator contratual**: os circulares pertencem a empresas terceirizadas licitadas, que proíbem intervenções elétricas ou corte de fios no chicote dos ônibus para não perder a garantia dos chassis.*  
> 
> *A partir desse impasse, formulamos a nossa Pergunta Científica:*  
> **'É possível alcançar o determinismo e a precisão de um rastreador veicular dedicado, utilizando exclusivamente os smartphones dos passageiros a bordo, eliminando custos de operadora e filtrando ruídos de pedestres?'**"*

---

### 🔹 SLIDE 4: Estado da Arte I — Sistemas AVL Tradicionais
**Tempo:** 01:15 min | **Meta no Cronômetro:** 04:45

> *"Analisando a literatura e o mercado, os sistemas AVL tradicionais baseiam-se em módulos GPS dedicados, antenas externas na lataria e comunicação celular ininterrupta via redes móveis.*  
> 
> *Eles oferecem excelente precisão e operam de forma autônoma, mesmo com o ônibus vazio.*  
> 
> *No entanto, a barreira de entrada é altíssima: exigem instalação invasiva na rede CAN ou na fiação 24 volts do motor, e a conta mensal de telecomunicações torna-se um fardo permanente. Para o contexto de engenharia pública frugal, essa abordagem é inviável em larga escala."*

---

### 🔹 SLIDE 5: Estado da Arte II — Crowdsourcing Puro vs. Balizas BLE
**Tempo:** 01:30 min | **Meta no Cronômetro:** 06:15

> *"A alternativa moderna adotada por plataformas como Waze e Moovit foi o crowdsourcing comunitário. O custo de hardware é zero, pois aproveita os celulares dos cidadãos.*  
> 
> *Contudo, o crowdsourcing puro possui uma falha arquitetural grave: **o falso positivo de pedestres**. Um aluno caminhando na calçada com o aplicativo aberto, ou andando de bicicleta rente à via, é erroneamente identificado como sendo o circular, distorcendo toda a telemetria.*  
> 
> *Além disso, o crowdsourcing puro é vulnerável a ataques de **GPS spoofing**, onde coordenadas falsas são injetadas no sistema.*  
> 
> *É aqui que entra a nossa proposta com o **Bluetooth Low Energy (BLE)**.*  
> *Um microcontrolador **ESP32**, configurado como iBeacon, custa menos de **40 reais**, consome menos de **0,4 Watts** e pode ser plugado em qualquer porta USB do painel do ônibus.*  
> 
> *Com seu raio de alcance calibrado para 6 a 8 metros e limiar de sinal acima de -75 dBm, ele cria uma **âncora física determinística**: quem está dentro do salão do ônibus é autenticado; quem está na calçada ou na parada é ignorado."*

---

### 🔹 SLIDE 6: A Lacuna Tecnológica (Tabela Comparativa de Decisão)
**Tempo:** 01:15 min | **Meta no Cronômetro:** 07:30

> *"Esta matriz de decisão sintetiza a lacuna de engenharia que o LocBUS preenche:*  
> 
> *Enquanto o AVL Comercial exige milhares de reais em hardware e centenas em mensalidades, e o Crowdsourcing Puro sofre com ruídos e GPS falso, o **LocBUS reúne as maiores virtudes dos dois mundos**.*  
> 
> *Nosso custo veicular de dados é **zero**, o hardware por ônibus fica abaixo de 40 reais na porta USB, a imunidade a pedestres é comprovada fisicamente pelo rádio BLE e o consumo energético do usuário é protegido por um intervalo de transmissão amortecido a cada 4 segundos.*  
> 
> *Ou seja: eliminamos o modem 4G do ônibus sem abrir mão do rigor técnico."*

---

### 🔹 SLIDE 7: A Solução LocBUS (Telemetria Híbrida Simbiótica)
**Tempo:** 01:30 min | **Meta no Cronômetro:** 09:00

> *"Como o LocBUS funciona na prática? Desenvolvemos o que chamamos de **Telemetria Simbiótica em 4 etapas**, ilustrada na tela pelo mockup do nosso PWA:*  
> 
> * **Etapa 1:** O ESP32 no ônibus emite pulsos de presença iBeacon em intervalos de 500ms;  
> * **Etapa 2:** O passageiro acessa a aplicação web no navegador do smartphone. Pela API Web Bluetooth, o aparelho detecta o sinal de proximidade e valida o embarque sem exigir login ou cadastro;  
> * **Etapa 3:** Uma vez a bordo, o smartphone passa a atuar como nó sensor de borda, transmitindo amostras de latitude, longitude e acurácia via HTTPS a cada 4 segundos;  
> * **Etapa 4:** O backend na nuvem recebe essas amostras, aplica nossos filtros cinemáticos e despacha a posição consolidada via **Server-Sent Events** diretamente para o mapa de quem está esperando nas paradas."*

---

### 🔹 SLIDE 8: Requisitos de Engenharia (RFs e RNFs)
**Tempo:** 01:00 min | **Meta no Cronômetro:** 10:00

> *"O sistema foi concebido sob rigorosos requisitos de engenharia de software:*  
> 
> *Entre os **Requisitos Funcionais**, destacamos a autenticação por rádio sem credenciais (RF01), o geofencing de rota de 80 metros (RF02) e o teto cinemático de 65 km/h (RF03) para descartar passageiros que estejam em carros de passeio.*  
> 
> *Nos **Requisitos Não-Funcionais**, garantimos uma latência ponta a ponta abaixo de 500 milissegundos (RNF01) e máxima eficiência de bateria (RNF02).*  
> 
> *Quero dar ênfase especial ao **RNF04 — Privacidade por Projeto (LGPD)**: o LocBUS opera exclusivamente com buffers voláteis em memória RAM dotados de Time-to-Live. Nenhum dado biométrico, identificador de dispositivo ou IP é gravado em disco. O passageiro colabora de forma totalmente anônima."*

---

### 🔹 SLIDE 9: Arquitetura Desacoplada em 4 Camadas
**Tempo:** 01:30 min | **Meta no Cronômetro:** 11:30

> *"Apresento agora a Figura 1 do artigo, demonstrando nossa arquitetura desacoplada em quatro camadas:*  
> 
> *Na **Camada 1 (Veículo)**, temos apenas o hardware frugal do ESP32 emitindo iBeacon.*  
> *Na **Camada 2 (Borda)**, a PWA executa APIs nativas W3C — Geolocation e Web Bluetooth — com zero dependência de download em lojas de aplicativos.*  
> *Na **Camada 3 (Nuvem)**, nosso backend construído em **FastAPI** processa o pipeline assíncrono: valida o geofencing da rota, calcula a fusão sensorial e alimenta o broker SSE.*  
> *E na **Camada 4 (Cliente)**, a biblioteca Leaflet.js renderiza em tempo real a polilinha oficial da UFPB, o marcador dinâmico do circular e a estimativa de tempo de chegada.*  
> 
> *A separação garante que, mesmo que centenas de alunos estejam visualizando o mapa, a carga sobre os nós de borda transmissores permaneça estritamente nula."*

---

### 🔹 SLIDE 10: Modelagem Matemática & Algoritmos
**Tempo:** 01:15 min | **Meta no Cronômetro:** 12:45

> *"Do ponto de vista algorítmico, o LocBUS combina duas formulações elegantes:*  
> 
> *A primeira é o **Geofencing Esférico pela fórmula de Haversine**. A cada pacote recebido, calculamos a distância ortodrômica até o segmento viário mais próximo da rota. Se a distância superar 80 metros, ou a velocidade ultrapassar 65 km/h, o pacote é sumariamente expurgado.*  
> 
> *A segunda formulação resolve a heterogeneidade dos celulares: o **Centróide Ponderado pelo Inverso da Acurácia**.*  
> *O peso de cada transmissão é inversamente proporcional à margem de erro do sensor GPS do celular:*  
> $$w_k = \frac{1}{\max(\sigma_k, 1.0)}$$  
> 
> *Na prática, se um passageiro possui um smartphone avançado com acurácia de 3 metros, e outro passageiro tem um aparelho com erro de 20 metros, o primeiro aparelho terá **6,6 vezes mais peso matemático** no cálculo da coordenada final do ônibus.*  
> *Assim, garantimos estabilidade cartográfica mesmo com aparelhos de baixo custo."*

---

### 🔹 SLIDE 11: Resultados Experimentais & Teste de Campo
**Tempo:** 01:00 min | **Meta no Cronômetro:** 13:45

> *"Validamos o LocBUS em duas frentes complementares, cujos resultados estão expostos na tela:*  
> 
> *Na bancada de testes, submetemos a plataforma a **24 testes automatizados com 100% de sucesso**, simulando o percurso circular completo de 31 waypoints entre o CCHLA e o Centro de Informática com múltiplos clientes conectados simultaneamente.*  
> 
> *No teste de campo em vias públicas — registrado no gráfico à direita em Pedras de Fogo — operamos o sistema em movimento veicular contínuo. Atingimos uma **latência média real de 220 milissegundos**, provando que o streaming reativo via SSE entrega sensação de tempo real equivalente a rastreadores de alto padrão."*

---

### 🔹 SLIDE 12: Conclusão, Roadmap & Agradecimentos
**Tempo:** 00:45 min | **Meta no Cronômetro:** 14:30

> *"Para concluir:*  
> 
> *O LocBUS comprova a viabilidade técnica e científica da **engenharia frugal** aplicada aos transportes públicos. Mostramos que é possível entregar inteligência de frota de alta qualidade sem contrair despesas mensais com operadoras de telefonia e sem violar garantias contratuais de frotas locadas.*  
> 
> *Como próximos passos, nosso roadmap prevê a implantação piloto nos circulares da UFPB, validação discente massiva no Centro de Informática e o treinamento de modelos de Machine Learning para cálculo preditivo de ETA baseado no trânsito histórico dos Bancários.*  
> 
> *Agradeço à Universidade Federal da Paraíba, à equipe do projeto e aos avaliadores do IEEE Latin America Transactions.*  
> 
> *Coloco-me à inteira disposição da banca para perguntas e considerações técnicas. Muito obrigado!"*

---

## 💡 Como Responder às Perguntas mais Prováveis da Banca

### 1. *"E se o ônibus estiver completamente vazio, sem nenhum passageiro a bordo?"*
> **Resposta:**  
> *"Excelente pergunta. No início da linha, o próprio motorista ou os primeiros passageiros a embarcar ativam o nó. No entanto, se o veículo trafegar 100% vazio em um trecho intermediário, o LocBUS exibe visualmente no mapa o estado 'Última posição conhecida há X minutos' com opacidade reduzida, sem inventar trajetórias falsas. Assim que qualquer pessoa com celular embarca na parada seguinte, a telemetria é reconectada instantaneamente em menos de 220ms."*

### 2. *"Por que não utilizar WebSockets em vez de Server-Sent Events (SSE)?"*
> **Resposta:**  
> *"Avaliamos WebSockets na fase inicial. No entanto, o fluxo de dados para os passageiros nas paradas é estritamente unidirecional (do servidor para os clientes). O SSE opera nativamente sobre HTTP/2, possui reconexão automática embutida nos navegadores, atravessa firewalls acadêmicos e proxies sem bloqueios e tem menor overhead de controle que uma conexão bidirecional WebSocket."*

### 3. *"A bateria do passageiro não vai descarregar rápido?"*
> **Resposta:**  
> *"Não, e esse foi um requisito de projeto essencial (RNF02). Em vez de manter o GPS em modo contínuo de alta taxa (1 Hz a 5 Hz), estabelecemos o período de amostragem em $\Delta t = 4$ segundos. Em testes práticos, um percurso de 25 minutos consome menos de 1,5% da carga da bateria do celular."*

### 4. *"Por que um ESP32 e não uma baliza iBeacon comercial pronta?"*
> **Resposta:**  
> *"O ESP32 é reprogramável via firmware, suporta criptografia de rotação de payload se quisermos elevar a segurança contra clones e custa uma fração do valor de balizas industriais fechadas, além de poder ser alimentado diretamente pela porta USB 5V disponível no painel de qualquer veículo moderno."*
