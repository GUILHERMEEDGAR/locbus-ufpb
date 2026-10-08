# 🎤 Roteiro Completo de Apresentação Oral (15 Minutos)
## LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo

> **Tempo Total Máximo:** 15 minutos (recomendado: 13 a 14 minutos para sobrar margem de segurança).  
> **Apresentador:** Guilherme Edgar C. S. R. Guedes & Equipe LocBUS  
> **Público-alvo:** Professor e colegas da disciplina de Engenharia / Projeto.

---

## ⏱️ Mapa de Tempo da Apresentação
| Slide | Título / Assunto | Tempo Alvo | Tempo Acumulado |
| :--- | :--- | :---: | :---: |
| **01** | Capa e Apresentação da Equipe | 00:45 min | 00:45 min |
| **02** | Contextualização: O Transporte Intercampi da UFPB | 01:15 min | 02:00 min |
| **03** | O Problema de Pesquisa e Impactos Reais | 01:30 min | 03:30 min |
| **04** | Estado da Arte: Sistemas AVL Tradicionais | 01:30 min | 05:00 min |
| **05** | Estado da Arte: Crowdsourcing Puro e Soluções IoT | 01:30 min | 06:30 min |
| **06** | A Lacuna Tecnológica Identificada | 01:30 min | 08:00 min |
| **07** | A Solução Proposta: LocBUS | 01:30 min | 09:30 min |
| **08** | Requisitos de Engenharia (RFs e RNFs) | 01:00 min | 10:30 min |
| **09** | Arquitetura em 4 Camadas da Solução | 01:30 min | 12:00 min |
| **10** | Algoritmo: Geofencing e Clustering Ponderado | 01:15 min | 13:15 min |
| **11** | Resultados Preliminares da PoC e Teste de Campo | 01:00 min | 14:15 min |
| **12** | Conclusão, Próximos Passos e Agradecimentos | 00:45 min | 15:00 min |

---

## 📑 Roteiro Slide a Slide com Script de Fala

---

### Slide 1: Capa
* **Título:** LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo
* **Subtítulo:** Rastreamento Inteligente de Transporte Intercampi sem Dependência de Computadores de Bordo 4G
* **Autores:** Guilherme Edgar C. S. R. Guedes & Equipe LocBUS
* **Instituição:** Universidade Federal da Paraíba (UFPB)

> 🎙️ **O que falar (00:45 min):**  
> *"Olá a todos, bom dia/boa tarde. Meu nome é Guilherme Guedes e hoje vou apresentar a proposta do nosso projeto intitulado **LocBUS: Uma arquitetura híbrida de telemetria e rastreamento veicular colaborativo de baixo custo para o transporte universitário intercampi**. Nosso trabalho foca em resolver um problema histórico de imprevisibilidade no deslocamento dos estudantes da UFPB, propondo uma solução de alta fidelidade técnica, mas com custo de implantação e operação praticamente nulo."*

---

### Slide 2: Contextualização — O Cenário da UFPB
* **Pontos no Slide:**
  * Transporte Intercampi gratuito ligando Campus I ao Centro de Informática (Mangabeira);
  * Rota viária extensa (> 14 km por ciclo) com tráfego urbano misto;
  * 8 paradas acadêmicas principais (CCHLA, Reitoria, CCEN, CT, CE, CI, etc.);
  * Horários e intervalos sujeitos a engarrafamentos e variações climáticas.

> 🎙️ **O que falar (01:15 min):**  
> *"Para contextualizar: a UFPB possui uma estrutura multicampi em João Pessoa. Diariamente, centenas de alunos precisam transitar entre o Campus I, no Castelo Branco, e o Centro de Informática, em Mangabeira. O trajeto do ônibus circular intercampi possui mais de 14 quilômetros, atravessando corredores urbanos com semáforos e trânsito intenso. Hoje, o passageiro não sabe se o ônibus acabou de passar ou se ainda vai demorar 30 minutos, gerando ansiedade e perda de aulas."*

---

### Slide 3: O Problema de Pesquisa
* **Pontos no Slide:**
  * **Assimetria Informacional Total:** Passageiros esperam no escuro nas paradas;
  * **Superlotação e Ineficiência:** Alunos acumulam nas paradas sem saber a posição do ônibus;
  * **Inviabilidade Financeira Tradicional:** Instalar computadores AVL proprietários custa milhares de reais por veículo, inviável para frotas universitárias com orçamento público restrito;
  * **Pergunta de Pesquisa:** *Como rastrear com alta precisão uma frota de ônibus em tempo real sem exigir hardware veicular caro e sem assinaturas de internet móvel 4G para os veículos?*

> 🎙️ **O que falar (01:30 min):**  
> *"Identificamos um problema claro: a falta de previsibilidade do transporte universitário. A solução óbvia do mercado privado seria instalar rastreadores AVL industriais nos ônibus. No entanto, em universidades federais e frotas terceirizadas, isso custaria de R$ 1.500 a R$ 2.500 por veículo, além de mensalidades de chips 4G M2M que o orçamento institucional não suporta. Nossa pergunta de pesquisa foi: é possível alcançar a mesma confiabilidade de um rastreador dedicado, aproveitando a conectividade dos próprios passageiros, mas sem cair nas falhas típicas de aplicativos comunitários?"*

---

### Slide 4: Estado da Arte — Sistemas AVL Convencionais
* **Pontos no Slide:**
  * **Sistemas AVL (Automatic Vehicle Location):** GPS veicular + Modem 4G/LTE + Interface CAN;
  * **Vantagens:** Alta precisão determinística, telemetria ininterrupta;
  * **Desvantagens Críticas:**
    * Custo de aquisição e manutenção proibitivo;
    * Dependência de mensalidade de planos de dados veiculares;
    * Instalação invasiva na fiação e bateria do ônibus.

> 🎙️ **O que falar (01:30 min):**  
> *"No Estado da Arte, analisamos inicialmente os sistemas AVL industriais. Eles são consagrados em grandes operadores comerciais: possuem receptores GPS potentes e transmitem a posição via modem 4G direto para a nuvem. Eles funcionam muito bem, mas apresentam grandes barreiras para o nosso cenário: exigem modificação elétrica no veículo, geram custos mensais contínuos e são financeiramente inviáveis para frotas públicas de pequeno e médio porte."*

---

### Slide 5: Estado da Arte — Crowdsourcing Puro e IoT
* **Pontos no Slide:**
  * **Crowdsourcing Puro (Waze, Moovit, CittaMobi):** Usa o smartphone do usuário;
    * *Limitação:* Não diferencia pedestre de passageiro embarcado; vulnerável a ruídos e spoofing;
  * **Balizas de Proximidade (BLE / Beacons):**
    * Baixíssimo custo (< R$ 40 com ESP32);
    * Consumo mínimo (< 0.4W);
    * Alimentação simples via porta USB do painel;
    * Comunicação local por rádio sem necessidade de internet própria.

> 🎙️ **O que falar (01:30 min):**  
> *"Na outra ponta, olhamos para as soluções de Crowdsourcing puro, como Moovit e Waze. Elas não exigem nenhum hardware no ônibus, o que é ótimo. Mas têm uma falha fatal: se um aluno com o app aberto estiver caminhando a pé na calçada perto da parada, o sistema pode achar que o ônibus está ali! Além disso, qualquer usuário mal-intencionado pode injetar coordenadas falsas. Por outro lado, a tecnologia Bluetooth Low Energy (BLE) nos dá uma ferramenta de ouro: balizas de proximidade de menos de 40 reais que transmitem identificadores criptografados a poucos metros."*

---

### Slide 6: A Lacuna Tecnológica Identificada
* **Pontos no Slide (Gráfico / Destaque visual):**
  * AVL Tradicional = **Alta Confiabilidade**, mas **Custo Proibitivo**;
  * Crowdsourcing Puro = **Custo Zero**, mas **Baixa Confiabilidade e Vulnerável a Ruído**;
  * **A Lacuna:** Uma arquitetura que una o **custo zero de conectividade veicular** com a **confiabilidade determinística de bordo**.

> 🎙️ **O que falar (01:30 min):**  
> *"Aqui chegamos ao coração da nossa contribuição: a Lacuna Tecnológica. Existe um abismo entre o rastreador veicular caro e o aplicativo comunitário impreciso. O que faltava na literatura e na indústria é uma solução híbrida: um sistema que utilize a presença física confirmada por um rádio de baixíssimo custo no ônibus para validar e canalizar o GPS dos smartphones dos passageiros, filtrando matematicamente todo o ruído. Essa é a proposta do LocBUS."*

---

### Slide 7: A Proposta LocBUS
* **Pontos no Slide:**
  * **Nó Veicular BLE:** Transmissor autônomo instalado no ônibus (ESP32 USB);
  * **Coleta Oportunista:** O passageiro embarcado valida a presença física e fornece a telemetria;
  * **Validação em 3 Etapas:** Geofencing (80m) + Filtro Cinemático (65 km/h) + Média Ponderada;
  * **Entrega Instantânea:** PWA leve com mapa Leaflet e streaming SSE (< 500ms).

> 🎙️ **O que falar (01:30 min):**  
> *"O LocBUS funciona como uma simbiose inteligente: colocamos um pequeno beacon BLE alimentado na entrada USB do ônibus. Quando o estudante entra no veículo, o smartphone dele detecta o rádio com sinal forte e valida: 'estou fisicamente dentro do ônibus'. A partir desse momento, e apenas enquanto estiver a bordo, a aplicação web transmite a posição do GPS do celular com intervalo de 4 segundos. O ônibus é rastreado sem gastar 1 centavo com chip 4G institucional."*

---

### Slide 8: Requisitos de Engenharia
* **Pontos no Slide:**
  * **RF01:** Rastreamento colaborativo autenticado por proximidade BLE;
  * **RF02:** Geofencing de rota viária com envelope de tolerância de 80 metros;
  * **RF03:** Descarte cinemático de velocidades anômalas (> 65 km/h);
  * **RF04:** Clustering centróide ponderado pelo inverso da acurácia ($w_i = 1/\text{acc}_i$);
  * **RNF01:** Latência de difusão SSE inferior a 500 ms;
  * **RNF04:** Conformidade com a LGPD: sem armazenamento de dados pessoais ou identificadores de hardware.

> 🎙️ **O que falar (01:00 min):**  
> *"Estruturamos nosso projeto sobre requisitos de engenharia rigorosos. Do lado funcional: geofencing com limite estrito de 80 metros da rota viária, teto cinemático de 65 km/h e clustering de múltiplos colaboradores. Do lado não funcional: latência de atualização abaixo de 500 milissegundos via Server-Sent Events, proteção estrita de bateria móvel e conformidade total com a LGPD, sem coletar CPF, nome, IMEI ou identificadores de usuário."*

---

### Slide 9: Arquitetura em 4 Camadas
* **Pontos no Slide:**
  1. **Camada Veicular:** ESP32 Broadcaster iBeacon (5V USB, 0.4W);
  2. **Camada de Borda (Smartphone):** Web PWA, APIs Geolocation e Web Bluetooth;
  3. **Camada de Nuvem (Backend):** Python 3.14 + FastAPI + Buffer Volátil em Memória + SSE Broker;
  4. **Camada de Apresentação:** Leaflet.js, Tiles CartoDB/OpenStreetMap, responsividade mobile-first.

> 🎙️ **O que falar (01:30 min):**  
> *"Nossa arquitetura é desacoplada em quatro camadas: na base física veicular, temos o ESP32 operando como iBeacon. Na borda, o passageiro roda uma PWA leve que dispensa instalação pela Google Play ou App Store. No backend, escolhemos Python assíncrono com FastAPI e um buffer volátil de alta velocidade em memória. E na apresentação, um mapa interativo em Leaflet que renderiza em tempo real as coordenadas e o rastro viário."*

---

### Slide 10: Algoritmo de Agregação e Clustering
* **Pontos no Slide:**
  * **Distância Haversine para Geofence:**
    $$d(P, S) = 2 R \arcsin\left(\sqrt{\sin^2(\Delta\phi/2) + \cos\phi_1\cos\phi_2\sin^2(\Delta\lambda/2)}\right) \le 80\text{ m}$$
  * **Clustering Ponderado por Inverso da Acurácia:**
    $$w_k = \frac{1}{\sigma_k}, \quad \mathbf{X}_{\text{bus}} = \frac{\sum w_k \mathbf{X}_k}{\sum w_k}$$
  * Benefício: Se 5 passageiros estão no ônibus, o celular com erro de 3m tem peso muito maior que o celular com erro de 25m!

> 🎙️ **O que falar (01:15 min):**  
> *"Como resolvemos o problema da imprecisão do GPS dentro do ônibus? Criamos um estimador ponderado: quando vários passageiros estão a bordo ao mesmo tempo, cada celular envia sua coordenada e sua margem de erro. O nosso backend calcula o centróide ponderado pelo inverso da acurácia. Ou seja: um celular topo de linha com acurácia de 3 metros terá um peso estatístico muito superior a um aparelho antigo com margem de 20 metros. O resultado é uma posição veicular consolidada muito mais estável do que a de qualquer passageiro isolado."*

---

### Slide 11: Resultados da PoC e Teste de Campo
* **Pontos no Slide:**
  * **Suíte de Testes Automatizados:** 24 testes no Pytest (100% aprovados);
  * **Simulação de Ciclo Completo:** 31 waypoints (Ida CCHLA $\to$ CI e Volta CI $\to$ CCHLA);
  * **Teste de Campo em Condições Reais:** Aplicação independente testada em malha viária em Pedras de Fogo (PB);
  * **Desempenho Aferido:** Latência média SSE de 220 ms; acurácia espacial média de 5 a 12 metros; streaming contínuo estável.

> 🎙️ **O que falar (01:00 min):**  
> *"Nossos resultados preliminares da Prova de Conceito comprovam a tese: temos 24 testes unitários e de integração cobrindo todo o ciclo circular de 31 pontos da rota da UFPB. Além disso, executamos um teste de campo com telemetria contínua em condições móveis reais em vias públicas, validando o streaming de dados, o algoritmo de fallback de GPS e a contagem contínua de pontos com latência abaixo de 300 milissegundos."*

---

### Slide 12: Conclusão e Próximos Passos
* **Pontos no Slide:**
  * **Conclusão:** O LocBUS demonstra que a fusão de BLE de baixo custo com sensoriamento participativo soluciona a telemetria pública com custo zero de conectividade veicular;
  * **Próximos Passos:**
    * Instalação física dos protótipos de beacon nos ônibus intercampi da UFPB;
    * Teste beta com comunidade discente real nas linhas regulares;
    * Refinamento preditivo de ETA com dados históricos de congestionamento.
  * *Obrigado! Aberto a perguntas.*

> 🎙️ **O que falar (00:45 min):**  
> *"Para concluir: o LocBUS comprova que com engenharia de software e fusão sensorial inteligente é possível entregar um serviço de alto nível à comunidade acadêmica sem depender de grandes licitações de hardware caro. Nossos próximos passos envolvem a instalação piloto das balizas nos ônibus da UFPB e testes de usabilidade com os estudantes. Muito obrigado pela atenção de todos e estamos abertos às dúvidas da banca!"*

---

## 💡 Dicas de Ouro para a Apresentação Oral
1. **Controle do Tempo:** Treine a fala duas vezes em voz alta com um cronômetro. Se você terminar em 13 minutos e 30 segundos, está no tempo ideal.
2. **Postura Segura:** Quando falar da **Lacuna Tecnológica**, enfatize a Tabela Comparativa: ela é o diferencial acadêmico que os professores mais valorizam.
3. **Se perguntarem sobre a bateria do celular do passageiro:** Responda com firmeza: *"Implementamos um throttling de 4 segundos e usamos a API W3C com cache oportunista, resultando em impacto de bateria praticamente imperceptível durante viagens de 20 minutos."*
4. **Se perguntarem sobre a LGPD:** Responda: *"O sistema é estritamente anônimo. O backend opera com buffers voláteis em memória com descarte automático por TTL; nenhum identificador pessoal, MAC Address ou IMEI é armazenado em disco."*
