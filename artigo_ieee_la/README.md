# 📄 Artigo Científico - IEEE Latin America Transactions (IEEE LA)

## 📌 Título do Artigo
**LocBUS: Arquitetura Híbrida de Telemetria, Rastreamento Colaborativo e Tolerância a Desconexões para Transporte Universitário Intercampi**

### ✍️ Autoria & Filiação
- **Guilherme Edgar C. S. R. Guedes** (Membro Estudante IEEE)
- Universidade Federal da Paraíba (UFPB) — João Pessoa / Rio Tinto / Mamanguape - PB
- Contato: `guilherme.guedes@academico.ufpb.br`

---

## 📂 Estrutura de Arquivos do Diretório
- `artigo_locbus_ieee_la.tex`: Código-fonte completo em LaTeX no formato oficial `IEEEtran` (versão atualizada com todas as seções, formulações matemáticas, tabelas, 33 testes automatizados, tolerância a desconexões e validação em campo).
- `fig1.png`: Diagrama de blocos da arquitetura em 4 camadas desacopladas (BLE, Borda Móvel, Nuvem/Backend, Exibição PWA).
- `fig2_transit.png`: Interface de passageiro mobile com georreferenciamento das 12 paradas oficiais do Campus I da UFPB e confirmação colaborativa de espera.
- `fig3_validacao_campo.png`: Evidência instrumental da campanha de validação em campo real com telemetria contínua, odômetro, velocímetro e precisão métrica.
- `fig4_desktop.png`: Visão desktop com rastreamento ao vivo, mapa Leaflet e itinerário viário OSRM.
- `IEEEtran.cls` / `New_IEEEtran_how-to.tex`: Pacotes e documentação de referência da classe IEEEtran.

---

## 🚀 Como Compilar o Artigo

### Opção 1: Overleaf (Recomendado)
1. Crie um novo projeto no [Overleaf](https://www.overleaf.com/) (*Blank Project*).
2. Faça o upload dos seguintes arquivos desta pasta:
   - `artigo_locbus_ieee_la.tex`
   - `fig1.png`
   - `fig2_transit.png`
   - `fig3_validacao_campo.png`
3. Renomeie o arquivo principal para `main.tex` ou defina `artigo_locbus_ieee_la.tex` como arquivo de compilação.
4. Clique em **Recompile** (motor `pdfLaTeX`).

### Opção 2: Localmente via TeX Live ou MiKTeX (Terminal)
```bash
pdflatex artigo_locbus_ieee_la.tex
pdflatex artigo_locbus_ieee_la.tex  # Segunda passagem para referências cruzadas e índices
```

---

## 📊 Principais Conteúdos Incorporados nesta Versão:
1. **Resumo & Abstract Atualizados**: Síntese integral dos 5 pilares do projeto (BLE, Tracker Cockpit Android, Store-and-Forward eduroam, Geofencing segmentado e Crowdsourcing de espera).
2. **Formulação Matemática Completa**:
   - Projeção ortogonal vetorial contínua em segmentos viários reais ($D(\mathbf{P}, R) \le 250\text{ m}$).
   - Filtro cinemático de velocidade urbana ($v \le 85\text{ km/h}$).
   - *Clustering* centróide ponderado pelo inverso da acurácia instrumental ($w_i = 1/\text{acc}_i$) com raio de vizinhança ($R_{\text{cluster}} = 350\text{ m}$) e expurgo de saltos abruptos ($> 600\text{ m}$).
3. **Mecanismo Store-and-Forward sobre eduroam**:
   - Buffer circular local de até 400 pontos para tolerância a áreas sem sinal institucional.
   - Endpoint de ingestão em lote `POST /api/v1/telemetry/collaborative/batch`.
4. **Arquitetura Multi-Flavor Android Nativa**:
   - Flavor `passenger` e Flavor `tracker` com `Foreground Service` e `Wake Lock` ininterrupto.
5. **Mapeamento das 12 Paradas Oficiais do Campus I**:
   - Tabela georreferenciada completa com latitude/longitude oficiais e módulo colaborativo de confirmação de parada.
6. **Resultados Experimentais Detalhados**:
   - Tabela dos 33 testes de regressão do Pytest (100% aprovados).
   - Métricas de desempenho SSE (latência de $278 \pm 34\text{ ms}$, consumo $< 1,2\text{ kB/s}$).
   - Resultados de resiliência a desconexão e dados da campanha em campo real.
