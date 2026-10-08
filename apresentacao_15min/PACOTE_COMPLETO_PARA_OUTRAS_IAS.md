# 📦 PACOTE COMPLETO DE CONTEXTO & ASSETS VISUAIS — APRESENTAÇÃO LocBUS (15 MIN)

> **Destinado a:** Apresentação oral do artigo submetido ao **IEEE Latin America Transactions**  
> **Tema:** *LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo para o Transporte Universitário Intercampi*  
> **Autor Principal:** Guilherme Edgar C. S. R. Guedes & Equipe LocBUS  
> **Instituição:** Universidade Federal da Paraíba (UFPB)  
> **Tempo Alvo:** 15 minutos (recomendado: 13m30s a 14m00s)

---

## 🌟 1. Opções para Apresentar o seu Trabalho

Você tem **duas formas excelentes** de conduzir esta apresentação:

### Opção A: Usar o Slide Interativo Nativo do Projeto (Já Atualizado e Pronto!)
* **Arquivo:** [`apresentacao_15min/slides_interativos.html`](file:///e:/prof3/apresentacao_15min/slides_interativos.html)
* **Vantagens Únicas:**
  1. **Cronômetro Integrado (15 min):** Fica no topo da tela, avisa visualmente em 13:00 (alerta amarelo) e 14:30 (alerta vermelho), com botão de pausar/retomar;
  2. **Modo Apresentador com Roteiro de Fala (Tecla `N`):** Gaveta retrátil na base que mostra exatamente o que falar e o tempo de cada slide em tempo real;
  3. **Imagens Reais Embarcadas:** Mockups mobile, mapa desktop real da rota UFPB, evidências do teste em vias públicas e o diagrama oficial da arquitetura;
  4. **Zoom Interativo:** Qualquer imagem pode ser clicada para abrir em tela cheia com alta resolução;
  5. **Controle Total:** Navegue com as Setas `←` / `→`, Barra de `Espaço`, `F` (Tela Cheia), `Home` e `End`.

---

### Opção B: Gerar Apresentação em Outra I.A. (Gamma.app, Canva, Claude, ChatGPT, Beautiful.ai)
Se você preferir gerar slides no **Gamma.app**, **Canva**, **Beautiful.ai** ou **Marp**, utilize o **Mega-Prompt** e os **Assets Visuais** preparados nas seções abaixo.

---

## 🖼️ 2. Galeria de Imagens Oficiais do Projeto (Prontas para Upload)

Todas as imagens reais foram copiadas e padronizadas no diretório [`apresentacao_15min/assets/`](file:///e:/prof3/apresentacao_15min/assets/):

| Arquivo de Imagem | Caminho Local | O que Mostra | Onde Usar no Slide |
| :--- | :--- | :--- | :--- |
| **`fig1_arquitetura.png`** | [`apresentacao_15min/assets/fig1_arquitetura.png`](file:///e:/prof3/apresentacao_15min/assets/fig1_arquitetura.png) | **Diagrama Arquitetural de 4 Camadas** (Veículo ESP32 BLE $\to$ Borda Smartphone PWA $\to$ Nuvem FastAPI $\to$ Cliente Leaflet). | **Slide 9** (Arquitetura de Sistemas) |
| **`desktop_mapa_ao_vivo.png`** | [`apresentacao_15min/assets/desktop_mapa_ao_vivo.png`](file:///e:/prof3/apresentacao_15min/assets/desktop_mapa_ao_vivo.png) | **Interface Web Map-First do LocBUS** com ônibus ativo na rota, paradas do itinerário, tempo real SSE e card flutuante. | **Slide 11** (Resultados da PoC) ou **Slide 7** (A Solução) |
| **`mobile_interface_pwa.png`** | [`apresentacao_15min/assets/mobile_interface_pwa.png`](file:///e:/prof3/apresentacao_15min/assets/mobile_interface_pwa.png) | **Mockup do PWA em Smartphone** destacando o botão *"A bordo deste circular? Transmitir GPS"*. | **Slide 7** (A Solução LocBUS) |
| **`validacao_campo_telemetria.png`** | [`apresentacao_15min/assets/validacao_campo_telemetria.png`](file:///e:/prof3/apresentacao_15min/assets/validacao_campo_telemetria.png) | **Evidência do Teste de Campo em Vias Reais** (Pedras de Fogo - PB), comprovando telemetria em movimento contínuo e latência ~220ms. | **Slide 11** (Validação Experimental) |
| **`transit_mobile_detalhes.png`** | [`apresentacao_15min/assets/transit_mobile_detalhes.png`](file:///e:/prof3/apresentacao_15min/assets/transit_mobile_detalhes.png) | **Visão Detalhada da Linha do Tempo de Paradas**, nós ativos do itinerário e cálculo de progresso da rota (45%). | **Slide 2** (Contextualização) ou **Slide 8** (Requisitos) |

---

## 🤖 3. Mega-Prompt para Colar em Ferramentas Externas (Gamma, Canva, ChatGPT, Claude)

> **Instrução:** Copie o bloco de texto abaixo e cole diretamente no seu assistente ou ferramenta de slides de preferência.

```text
Você é um especialista sênior em design de apresentações acadêmicas e corporativas para conferências de tecnologia e engenharia IEEE.

Por favor, crie uma apresentação completa de 12 slides com design premium, técnico e visualmente impactante para uma fala de 15 minutos baseada no artigo científico submetido à IEEE Latin America Transactions:

TÍTULO: LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo
SUBTÍTULO: Rastreamento Inteligente de Transporte Universitário Intercampi sem Dependência de Modems 4G Veiculares
AUTORES: Guilherme Edgar C. S. R. Guedes & Equipe LocBUS
INSTITUIÇÃO: Universidade Federal da Paraíba (UFPB) - Campus I (João Pessoa) e Campus IV (Rio Tinto)

DIRETRIZES VISUAIS E DE DESIGN:
- Tema: Dark Mode profissional de alto nível (fundo grafite/azul-noite #070B14, cartões #0F172A e #141E33, detalhes em Azul Céu #0284C7 e #38BDF8, destaques positivos em Verde Esmeralda #10B981).
- Tipografia: Moderna e geométrica (Inter, Montserrat ou Roboto) com fontes monoespaçadas (JetBrains Mono) para números e equações.
- Layout: 16:9 widescreen, respiração visual, sem paredes densas de texto. Priorize caixas de métricas (stat cards), tabelas comparativas limpas, diagramas e espaços para screenshots reais do software.

ESTRUTURA COMPLETA DOS 12 SLIDES:

SLIDE 1: Capa Oficial
- Título do Projeto: LocBUS
- Subtítulo: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo
- Métricas em destaque: Custo Conectividade Veicular = R$ 0 | Hardware Veicular < R$ 40 | Latência SSE < 350ms | 100% Conforme LGPD
- Autores e Afiliação: Guilherme Edgar C. S. R. Guedes | UFPB

SLIDE 2: Contextualização Operacional (O Cenário da UFPB)
- Problema real: Transporte circular gratuito ligando o Campus I (Castelo Branco) ao Centro de Informática (Mangabeira).
- Percurso extenso (> 14 km por ciclo) sujeito a tráfego urbano pesado nos Bancários.
- 8 paradas acadêmicas principais (CCHLA, Reitoria, Convivência/RU, CCEN, CT, Praça da Paz, Mangabeira Shopping, CI).
- Dores: Falta de previsão, espera no escuro, vulnerabilidade climática e de segurança pública.

SLIDE 3: O Problema de Pesquisa & Dilema Financeiro
- O dilema público: Universidades não têm orçamento para contratar computadores de bordo AVL industriais (R$ 1.500 - R$ 2.500/veículo) nem pagar mensalidades de chips 4G M2M (R$ 60 - R$ 120/mês/ônibus).
- Frotas terceirizadas não permitem intervenção elétrica na fiação ou na rede CAN.
- A Pergunta Científica: "Como alcançar a precisão de um rastreador veicular dedicado utilizando apenas a conectividade e os smartphones dos passageiros, eliminando o custo recorrente e filtrando o ruído de pedestres?"

SLIDE 4: Estado da Arte I — Sistemas AVL Tradicionais
- O que são: GPS veicular homologado + Modem 4G/LTE + interface de telemetria CAN.
- Prós: Alta precisão (1 a 5 Hz), ininterrupto, independente de passageiros.
- Contras: Custo de aquisição proibitivo, custo mensal de dados contínuo, instalação invasiva que invalida garantias de operadoras terceirizadas.

SLIDE 5: Estado da Arte II — Crowdsourcing Puro vs. Balizas BLE
- Crowdsourcing comunitário (Waze, Moovit): Custo zero de hardware, porém confunde pedestres caminhando na calçada com o ônibus e é vulnerável a GPS spoofing.
- Balizas de Proximidade (ESP32 / BLE): Custam menos de R$ 40, consomem < 0.4W via porta USB 5V e oferecem alcance curto calibrado (6-8 metros), provando a presença física a bordo.

SLIDE 6: A Lacuna Tecnológica (Tabela Comparativa de Decisão)
- Tabela de 3 colunas: AVL Comercial 4G vs. Crowdsourcing Puro vs. LocBUS (Nossa Proposta).
- Critérios: Custo de Hardware, Mensalidade de Dados, Imunidade a Pedestres, Resistência a Spoofing, Latência e Instalação.
- Veredito: O LocBUS une o custo zero de conectividade com a imunidade determinística de um rastreador de bordo.

SLIDE 7: A Solução LocBUS (Telemetria Híbrida Simbiótica)
- Fluxo em 4 passos:
  1. O ESP32 emite beacon no interior do ônibus;
  2. A PWA do passageiro detecta o sinal de proximidade (> -75 dBm) via Web Bluetooth e confirma embarque;
  3. O celular transmite o GNSS a cada Δt = 4s (preservando bateria);
  4. O backend agrega os pontos e transmite aos passageiros nas paradas via SSE.
- [INSERIR IMAGEM: assets/mobile_interface_pwa.png]

SLIDE 8: Requisitos de Engenharia (RFs e RNFs)
- Funcionais: Autenticação por rádio BLE (RF01), Geofencing contínuo de 80m (RF02), Filtro cinemático de 65 km/h (RF03), Clustering ponderado inverso da acurácia (RF04), Streaming SSE (RF05).
- Não-Funcionais: Latência < 500ms (RNF01), Economia de bateria (RNF02), Universalidade PWA sem download de lojas (RNF03), Conformidade total LGPD em memória volátil com TTL (RNF04).

SLIDE 9: Arquitetura Desacoplada em 4 Camadas
- Camada 1: Veículo (ESP32 iBeacon USB 5V, 0.4W);
- Camada 2: Borda (Smartphone PWA, Web Bluetooth, W3C Geolocation);
- Camada 3: Nuvem (FastAPI, Geofencing Haversine, Buffer Volátil, SSE Broker);
- Camada 4: Cliente (Leaflet.js, Polilinha da rota, ETA dinâmico).
- [INSERIR IMAGEM: assets/fig1_arquitetura.png]

SLIDE 10: Modelagem Matemática & Algoritmos
- Geofencing Esférico (Distância Haversine <= 80 metros da rota viária).
- Centróide Ponderado por Inverso da Acurácia:
  w_k = 1 / max(sigma_k, 1.0)
  X_bus = sum(w_k * X_k) / sum(w_k)
- Explicação: Smartphones com precisão de 3m recebem 6.6x mais peso que celulares imprecisos com margem de 20m.

SLIDE 11: Resultados da PoC e Teste de Campo em Vias Reais
- 24 testes unitários e de integração no Pytest com 100% de aprovação.
- Simulação de ciclo circular completo de 31 waypoints (CCHLA <-> CI Mangabeira).
- Teste de campo com telemetria contínua em movimento em vias reais (Pedras de Fogo - PB) com latência média de ~220 ms.
- [INSERIR IMAGEM 1: assets/desktop_mapa_ao_vivo.png]
- [INSERIR IMAGEM 2: assets/validacao_campo_telemetria.png]

SLIDE 12: Conclusão & Próximos Passos
- Conclusão: Viabilidade científica e técnica comprovada para órgãos públicos sem orçamento para chips 4G.
- Roadmap: Fase 1 (instalação piloto nos circulares UFPB), Fase 2 (validação discente no Centro de Informática), Fase 3 (predição inteligente de ETA por histórico de tráfego).
- Agradecimentos e Abertura para Perguntas da Banca.
```

---

## 📋 4. Roteiro de Fala Integrado por Slide (Speech Script)

Se você for apresentar ao vivo ou gravar vídeo, use esta minutagem exata:

* **Slide 1 (00:45 min):** Cumprimente a banca, apresente seu nome, o projeto LocBUS e a proposta de telemetria sem modems 4G veiculares.
* **Slide 2 (01:15 min):** Explique o contexto da UFPB: trajeto longo de mais de 14 km entre Castelo Branco e Mangabeira, 8 paradas e a angústia dos estudantes que não sabem a posição do ônibus.
* **Slide 3 (01:30 min):** Destaque o dilema financeiro: rastreador de R$ 2.500 e mensalidades 4G são incompatíveis com orçamento público. Apresente a pergunta de pesquisa.
* **Slide 4 (01:30 min):** Descreva o Estado da Arte dos sistemas AVL tradicionais: bons para frotas ricas, mas caros e invasivos na fiação do ônibus.
* **Slide 5 (01:30 min):** Aponte as falhas do Waze/Moovit (ruído de pedestres) e introduza a oportunidade do ESP32 por menos de R$ 40 na tomada USB.
* **Slide 6 (01:30 min):** Apresente a Matriz de Decisão: mostre a Lacuna Tecnológica que o LocBUS preenche com precisão.
* **Slide 7 (01:30 min):** Mostre o fluxo simbiótico de 4 passos com o print do celular na tela.
* **Slide 8 (01:00 min):** Passe com firmeza pelos requisitos de engenharia (Geofencing 80m, teto 65 km/h, LGPD e PWA).
* **Slide 9 (01:30 min):** Apresente o Diagrama Arquitetural de 4 camadas submetido ao IEEE.
* **Slide 10 (01:15 min):** Explique a matemática simples e elegante: Haversine e Centróide ponderado pelo inverso da acurácia.
* **Slide 11 (01:00 min):** Mostre as duas evidências visuais: a aplicação desktop na rota da UFPB com 24 testes OK e a validação de campo em vias reais em movimento.
* **Slide 12 (00:45 min):** Feche com o impacto de engenharia frugal e abra para perguntas.
