# ⏱️ ROTEIRO DE PITCH OFICIAL (5 A 6:30 MINUTOS) — FEIRA DE ENGENHARIAS (FEE 2026)
**Projeto:** LocBUS — Sistema Híbrido de Telemetria e Rastreamento Colaborativo de Baixo Custo para o Transporte Universitário  
**Autor & Apresentador:** Guilherme Edgar C. S. R. Guedes (Grupo 4 / CEAR / UFPB)  
**Orientador:** Prof. Dr. Oswaldo Hideo Ando Junior  
**Público-Alvo:** Banca Avaliadora Rigorosa (Doutores em Telecomunicações, Redes e Computação) e Visitantes da FEE  

---

## 🎯 TABELA DE GESTÃO TEMPORAL E DENSIDADE VERBAL (CRONOMETRAGEM ALVO: 5 MINUTOS E 35 SEGUNDOS)
*Taxa média calibrada: 130 a 138 palavras/minuto, intercaladas com ações físicas no pôster e no protótipo.*

| Bloco | Janela de Tempo | Duração | Palavras Faladas | Foco / Ação Prática |
|---|---|---|---|---|
| **1. Gancho & Dor Real** | `00:00 - 00:45` | 45 seg | 102 palavras | Dor do WhatsApp, SULT e citação da Tabela 1 (AVL vs LocBUS) |
| **2. Arquitetura 4 Camadas** | `00:45 - 02:00` | 1 min 15 seg | 170 palavras | Gestos no Pôster: Camadas 1 (GPS), 2 (eduroam), 3 (FastAPI) e 4 (PWA) |
| **3. Demonstração ao Vivo** | `02:00 - 03:45` | 1 min 45 seg | 225 palavras | 4 Cliques: Mapa 12 Paradas, Tracker 36 km/h, Flush eduroam e PWA Passageiro |
| **4. Resultados & Métricas** | `03:45 - 04:45` | 1 min 00 seg | 136 palavras | Faixa de KPIs (R$ 0, 220 ms, 25 min, 34/34 Pytest) e Discussão |
| **5. Conclusão & Impacto** | `04:45 - 05:35` | 50 seg | 112 palavras | Impacto social na UFPB, código aberto e transição segura para a banca |
| **TOTAL CONSOLIDADO** | `00:00 - 05:35` | **5m 35s** | **745 palavras** | **Janela Perfeita (Alvo FEE: 5:00 a 6:30)** |

---

## 🗣️ ROTEIRO SEGUNDO A SEGUNDO (FALA COMPLETA + GESTOS VISUAIS)

### BLOCO 1: O Gancho e a Dor da Comunidade Acadêmica (00:00 - 00:45)
*(Postura firme, contato visual direto com a banca, voz pausada e assertiva)*

> *"Bom dia, professores avaliadores e visitantes da Feira de Engenharias. Quem aqui já precisou se deslocar entre os centros da UFPB e ficou na parada com uma única dúvida angustiante: 'Será que o circular já passou ou ainda vai demorar?'*
> 
> *(Aponte com a mão para a Seção 2 do Pôster - Figura 2 com os relatos de WhatsApp)*
> 
> *Diariamente, milhares de estudantes enfrentam essa escuridão informacional. Nos grupos de WhatsApp, relatos reais como 'Alguém sabe onde anda o bus?', 'Nem o circular de 10:20 passou' e o clássico estresse de correr atrás de um ônibus que era um alarme falso são constantes.*
> 
> *(Aponte para a Tabela Comparativa na Seção 1 do Pôster)*
> 
> *A solução convencional de mercado seria contratar um sistema AVL comercial com modem 4G dedicado. Só que isso custa entre 150 e 300 reais por mês por veículo, exigindo contratos de telefonia que o orçamento da universidade pública não consegue sustentar. O **LocBUS** nasceu para romper esse paradigma: telemetria em tempo real com **custo zero de mensalidade de dados**."*

---

### BLOCO 2: Fundamentação e Arquitetura em 4 Camadas (00:45 - 02:00)
*(Aponte para o centro do pôster: Seção 3 - Figura 3 - Diagrama em 4 Camadas)*

> *"Como isso é tecnicamente possível? O LocBUS integra hardware de baixo custo à infraestrutura que a UFPB já possui, estruturado em quatro camadas estritas de engenharia:*
> 
> *(Aponte para a Camada 1: Hardware & Coleta)*
> * **Na Camada 1**, temos um smartphone Android comum fixado no painel do ônibus rodando o aplicativo nativo **LocBUS Tracker**, que coleta satélites GPS e telemetria de hardware a 1 Hertz contínuo, com Foreground Service e WakeLock impedindo a suspensão da CPU.*
> 
> *(Aponte para a Camada 2: Rede & Tolerância a Desconexões)*
> * **Na Camada 2**, o diferencial do projeto: o ônibus não tem chip de dados de operadora. Ele opera 100% sobre o Wi-Fi acadêmico **eduroam**. Como há zonas de sombra entre os centros e vias públicas, implementamos o paradigma **Store-and-Forward**. Quando o veículo sai da cobertura eduroam, ele armazena as coordenadas em um buffer local persistente. Assim que se aproxima de qualquer prédio universitário com sinal, ele descarrega o pacote em lote instantaneamente.*
> 
> *(Aponte para a Camada 3: Processamento & Filtragem)*
> * **Na Camada 3**, nosso backend assíncrono em Python com FastAPI aplica geofencing contínuo na malha OSRM de 855 vértices e clustering espacial por raio de vizinhança de 350 metros, eliminando ruídos e saltos espaciais.*
> 
> *(Aponte para a Camada 4: Aplicação & Visualização)*
> * **E na Camada 4**, os passageiros recebem a posição exata via Server-Sent Events (SSE) em nosso PWA responsivo, sem precisar instalar nada, ou por aplicativo nativo Android."*

---

### BLOCO 3: Demonstração do Protótipo Operacional ao Vivo (02:00 - 03:45)
*(Vire-se para o notebook/celular sobre a bancada. A tela já deve estar aberta com o mapa interativo)*

> *(Clique 1: Mostre o Mapa Interativo de Passageiros)*
> *"Vamos ver a engenharia em execução prática. Aqui na tela principal, temos o mapa georreferenciado com as **12 paradas oficiais do Campus I** — da Escola Técnica de Saúde, passando pela Editora, CCTA, CCHLA, até o CT e Fonoaudiologia. Clicando no botão flutuante **'🚏 12 Paradas'**, o mapa centraliza instantaneamente todo o anel viário.*
> 
> *(Clique 2: Alterne para a aba ou janela do Cockpit Tracker)*
> *Agora, observem o que o motorista enxerga no painel do ônibus através do **LocBUS Tracker**. Temos um velocímetro digital aferindo 36 km/h, contador de pontos transmitidos e este mostrador crítico de telemetria de rede: a intensidade de sinal eduroam em tempo real em menos 58 dBm e a latência de 218 milissegundos.*
> 
> *(Clique 3: Simulação de Perda e Recuperação eduroam - Store-and-Forward)*
> *Vejam o que acontece quando o ônibus entra na zona de sombra sem eduroam: o transmissor não falha. O buffer offline entra em ação imediatamente, acumulando os waypoints na memória segura do dispositivo. E no exato milissegundo em que o veículo reencontra a antena eduroam da Reitoria ou do CCHLA — como neste disparo em lote —, todo o trajeto acumulado é incorporado ao backend sem perder nenhum metro do percurso.*
> 
> *(Clique 4: Volte para a visão do Passageiro / Aba 2 Crowdsourcing)*
> *E do lado do estudante, na aba colaborativa, quem está na parada pode confirmar com um clique a chegada do circular ('Chegou no Ponto'), alimentando uma camada adicional de validação cruzada que informa os colegas em menos de 300 milissegundos."*

---

### BLOCO 4: Resultados Técnicos e Métricas de Validação (03:45 - 04:45)
*(Retorne o olhar e aponte para a Seção 4 do Pôster: Faixa de KPIs e Tabela 1)*

> *"Esses mecanismos foram submetidos a rigorosos testes de bancada e campanhas de validação de campo:*
> 
> *(Destaque os 4 números da Faixa de KPIs com convicção)*
> 1. * **R$ 0 de Custo Celular Mensal:** economia de 100% em planos de dados corporativos para a reitoria;*
> 2. * **Latência de ponta a ponta de ~220 milissegundos** via streaming SSE contínuo;*
> 3. * **Autonomia Offline de até 400 waypoints (~25 minutos)** de gravação contínua sem sinal eduroam, superando com folga o tempo de trânsito entre os campi;*
> 4. * **E do ponto de vista de robustez de software:** alcançamos **100% de aprovação na nossa suíte de testes automatizados com 34 de 34 testes no Pytest**, validando a integridade do buffer batch, filtros de geofencing, proteção anti-injeção e contingências do Service Worker PWA."*

---

### BLOCO 5: Conclusão, Impacto Institucional e Encerramento (04:45 - 05:35)
*(Postura ereta, tom conclusivo, seguro e institucional)*

> *(Aponte para a Seção 5: Conclusão)*
> *"Concluímos que o LocBUS não é apenas uma prova de conceito teórica, mas uma solução viável e imediata para um problema crônico que afeta a rotina acadêmica da UFPB.*
> 
> *Ao unir o hardware que já existe nos bolsos e painéis à rede eduroam institucional, entregamos um sistema de rastreamento inteligente, auditável, de baixo custo e com respeito estrito à privacidade e à LGPD.*
> 
> *(Aponte para o QR Code de Acesso no rodapé do Pôster)*
> *O projeto tem código aberto, arquitetura reproduzível e protótipo funcional online em `locbus-ufpb.onrender.com`. Convidamos os professores a testarem o aplicativo em seus próprios celulares agora mesmo através do QR Code.*
> 
> *Muito obrigado pela atenção, e passo a palavra à ilustre banca avaliadora para a nossa arguição técnica."*

---

## 🛠️ PLANO DE CONTINGÊNCIA IMEDIATO PARA O PROTÓTIPO (SE A REDE DA FEIRA OSCILAR)
Se a internet da feira falhar ou o Render demorar para responder:
1. **Ambiente Local já ativo:** Deixe o servidor rodando em background no notebook (`http://127.0.0.1:8000`).
2. **Modo Demo Nativo no Tracker:** Abra `http://127.0.0.1:8000/tracker?demo=1`. Ele carrega os 142 pontos, 36 km/h, -58 dBm e rota sem precisar de satélite de verdade.
3. **Efeito Didático Positivo:** Se a conexão cair, use isso a seu favor: *"Vejam, a rede do evento acabou de oscilar, e é exatamente aqui que o nosso buffer Store-and-Forward brilha: o sistema armazena tudo offline e não quebra a aplicação!"*
