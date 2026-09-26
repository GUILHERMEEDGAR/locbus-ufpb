# Grupo 4 — Frontend e UX

## 1. Finalidade do frontend, UX e responsabilidades do grupo

### 1.1 O que é o frontend

O **frontend** é a parte do sistema com a qual o usuário interage diretamente.

No LocBUS, ele corresponde principalmente ao que aparece no navegador:

- textos;
- botões;
- abas;
- mapas;
- informações de rota;
- Histórico;
- Itinerário;
- página Sobre;
- avisos;
- estados de erro;
- estimativas;
- organização visual;
- comportamento da interface em diferentes tamanhos de tela.

Em termos simplificados:

```text
Backend
    ↓ fornece dados
Frontend
    ↓ organiza e apresenta
Usuário
```

O frontend não é responsável por decidir sozinho o significado de um estado ou de uma regra de negócio. Sua função principal é **receber informações do sistema e apresentá-las de forma clara, coerente, acessível e agradável**.

---

### 1.2 O que é UX

`UX` significa **User Experience**, ou **Experiência do Usuário**.

UX não se limita à aparência do site.

Ela envolve toda a experiência de uso, por exemplo:

- se o usuário entende rapidamente o que está acontecendo;
- se encontra a informação que procura;
- se os textos são claros;
- se a navegação é simples;
- se a interface transmite confiança;
- se os avisos são compreensíveis;
- se o usuário consegue utilizar o site no celular sem dificuldade;
- se a quantidade de informação é adequada;
- se o site parece rápido e organizado;
- se os elementos visuais ajudam ou atrapalham.

Uma interface pode ser visualmente bonita e ainda ter uma UX ruim caso seja confusa, carregada ou difícil de utilizar.

No LocBUS, frontend e UX devem ser trabalhados juntos:

```text
visual
+
clareza
+
organização
+
facilidade de uso
+
informação correta
```

---

### 1.3 Direção visual desejada para o LocBUS

O visual atual do site é funcional, mas deverá passar por uma revisão.

A intenção é evoluir para uma interface:

- mais limpa;
- menos carregada;
- focada nas informações realmente necessárias;
- moderna;
- atrativa;
- fácil de compreender;
- coerente entre todas as abas;
- adequada ao uso cotidiano pelos estudantes.

O objetivo não é simplesmente "deixar mais bonito".

A mudança deve ajudar o usuário a responder rapidamente perguntas como:

```text
Onde o ônibus está?
Está em rota ou aguardando?
Para onde está indo?
Quando foi a última atualização?
Os dados estão confiáveis/atuais?
Qual é o itinerário?
```

Informações secundárias devem ser organizadas de forma que não disputem atenção com o que é mais importante.

Também deve haver cuidado para não apresentar visualmente como certeza aquilo que o backend ainda considera:

```text
indisponível
incerto
antigo
ou apenas estimado
```

---

### 1.4 Participação do autor do frontend atual

O frontend atual foi desenvolvido por **Victor Quirino**.

Ele possui várias ideias para a evolução visual e funcional da interface e poderá apresentá-las ao grupo durante o desenvolvimento.

Essas ideias devem ser tratadas como uma fonte importante de contexto, principalmente porque ele conhece:

- as decisões que levaram ao visual atual;
- limitações já percebidas durante o desenvolvimento;
- elementos que podem ser mantidos;
- elementos que podem ser removidos;
- novas possibilidades de organização da interface.

Isso não significa que o grupo deva apenas reproduzir essas ideias.

O ideal é:

```text
ideias existentes
+
análise do grupo
+
testes de usabilidade
+
necessidades reais do projeto
    ↓
nova interface
```

O Grupo 4 possui liberdade para propor soluções novas, desde que respeite as regras e os contratos definidos pelo restante do sistema.

---

### 1.5 Responsabilidades do Grupo 4

O **Grupo 4 — Frontend e UX** é responsável principalmente por:

- aba Mapa;
- aba Histórico;
- aba Itinerário;
- aba Sobre;
- navegação;
- HTML/Jinja;
- CSS;
- organização dos componentes;
- responsividade;
- clareza visual;
- apresentação de estados;
- apresentação de erros;
- apresentação de ETA;
- mensagens ao usuário;
- hierarquia das informações;
- coerência visual entre as abas;
- acessibilidade e facilidade de uso;
- futura atualização visual geral.

O grupo deve trabalhar principalmente com a pergunta:

```text
Como transformar os dados do LocBUS
em uma experiência clara e útil para o usuário?
```

---

### 1.6 O site deve funcionar em notebook, tablet e celular

A interface deverá ser **responsiva**, ou seja, adaptar-se corretamente a diferentes tamanhos de tela.

Os principais ambientes considerados são:

```text
notebook / desktop
tablet
celular
```

A mesma informação pode precisar ser organizada de formas diferentes em cada dispositivo.

Exemplo:

```text
NOTEBOOK
mapa + informações lado a lado

TABLET
blocos reorganizados conforme a largura

CELULAR
conteúdo em coluna, com prioridade para
status, rota e informações principais
```

Algumas ideias que o grupo pode explorar:

- usar layouts com `flexbox` e/ou `CSS Grid`;
- utilizar `media queries`;
- evitar larguras fixas desnecessárias;
- adaptar tamanhos de fonte;
- aumentar áreas clicáveis em telas touch;
- reorganizar cartões em uma única coluna no celular;
- reduzir informações secundárias em telas pequenas;
- criar menus/navegação apropriados para mobile;
- garantir que mapas e imagens não ultrapassem a largura disponível;
- priorizar as informações mais importantes no topo;
- testar diferentes resoluções diretamente no navegador;
- evitar tabelas largas que obriguem o usuário a fazer rolagem horizontal;
- considerar componentes expansíveis para detalhes menos importantes;
- manter contraste, legibilidade e espaçamento adequados.

Essas são apenas sugestões iniciais.

O grupo possui **liberdade para criar e propor soluções**, desde que:

- preserve a clareza;
- mantenha as informações corretas;
- não altere sozinho regras de negócio;
- teste em diferentes tamanhos de tela;
- documente decisões relevantes;
- mantenha alinhamento com os demais grupos quando a mudança depender de dados ou estados do backend.

## 2. Leitura humana obrigatória

```text
00_CONTEXTO_GERAL_LOCBUS.md
AUD_15_baseline_funcional_site.md
ARQ_05_regras_negocio_futuras.md
ARQ_06_fluxo_oficial_mapas.md
```

## 3. Enviar para a IA

```text
00_CONTEXTO_GERAL_LOCBUS.md
04_GRUPO_FRONTEND_UX.md
AUD_12_regras_negocio_atual.md
AUD_13_mapas_ferramentas.md
AUD_15_baseline_funcional_site.md
ARQ_05_regras_negocio_futuras.md
ARQ_06_fluxo_oficial_mapas.md
app/Templates/base.html
app/Templates/index.html
app/domain.py
app/services.py
```

Adicionar CSS, imagens e outros arquivos estáticos quando a tarefa exigir.

## 4. Estado atual

```text
Mapa = funcional
Histórico = funcional com bugs
Itinerário = funcional
Sobre = funcional
```

## 5. Problemas conhecidos

- ETA aparece mesmo com telemetria indisponível;
- texto Google Maps/check-up está desatualizado;
- miniaturas do Histórico estão invertidas;
- possível problema de ordenação ainda não reproduzido;
- utilidade futura das miniaturas ainda será avaliada;
- visual de todas as abas deverá ser revisto.

## 6. Regra central

O frontend decide **como mostrar**, mas não deve decidir sozinho **o que um estado significa**.

## 7. Não decidir sozinho

- significado de estados;
- limites temporais da telemetria;
- semântica de ETA;
- formato de eventos;
- contrato da API.

## 8. Prompt pronto para a IA

Com as atualizações deste guia, o prompt também precisa ser ampliado para que a IA compreenda que o objetivo do grupo não é apenas modificar CSS, mas revisar a experiência do usuário, a hierarquia das informações e a responsividade do LocBUS.

```text
Você está me auxiliando no GRUPO 4 — FRONTEND E UX
do projeto LocBUS.

Quero que você atue como um orientador técnico experiente em:

- frontend web;
- HTML;
- CSS;
- Jinja;
- design responsivo;
- UX (User Experience);
- arquitetura de informação;
- acessibilidade;
- interfaces para sistemas de monitoramento/telemetria.

Explique suas análises de forma didática.

Antes de qualquer futura implementação, explique:

1. o que pretende modificar;
2. qual problema de UX ou frontend isso resolve;
3. quais dados ou regras do backend estão envolvidos;
4. como a mudança deve funcionar em notebook, tablet e celular;
5. como validar se a alteração realmente melhorou a interface.

Leia integralmente todos os arquivos anexados antes de sugerir
alterações.

REGRAS DA DOCUMENTAÇÃO

AUD_ = auditoria do estado observado.
DID_ = explicação didática.
ARQ_ = decisão, proposta ou arquitetura futura.

O código atual é a fonte de verdade sobre o que está implementado.

ARQ_ não significa que algo já esteja implementado.

Se houver divergência entre documentação e código:

1. identifique;
2. não corrija silenciosamente;
3. informe o comportamento atual;
4. informe a decisão futura documentada;
5. mantenha a divergência explícita até validação.

RESPONSABILIDADE DO GRUPO 4

O grupo é responsável principalmente por:

- HTML/Jinja;
- CSS;
- aba Mapa;
- aba Histórico;
- aba Itinerário;
- aba Sobre;
- navegação;
- responsividade;
- hierarquia visual;
- clareza das informações;
- apresentação de estados;
- apresentação de erros;
- apresentação de ETA;
- mensagens ao usuário;
- experiência em notebook, tablet e celular;
- evolução visual geral do site.

CONTEXTO VISUAL

O site atual é funcional, mas deverá evoluir para uma interface:

- mais limpa;
- moderna;
- atrativa;
- menos carregada;
- focada nas informações necessárias;
- coerente entre as abas;
- adaptável a notebook, tablet e celular.

O autor do frontend atual, Victor Quirino, possui ideias para a
evolução da interface e poderá apresentá-las ao grupo.

Essas ideias são contexto importante, mas o grupo possui liberdade
para propor soluções novas.

REGRA CRÍTICA

O frontend pode decidir:

COMO mostrar uma informação.

Mas não deve decidir sozinho:

O QUE a informação significa.

Exemplos que dependem do Backend:

- significado de estado;
- TELEMETRIA_ANTIGA;
- SEM_TELEMETRIA;
- ETA;
- regras do Histórico;
- validade dos dados.

NESTA PRIMEIRA CONVERSA:

NÃO implemente nada.
NÃO altere arquivos.

PARTE 1 — ENTENDA O FRONTEND ATUAL

Analise:

- base.html;
- index.html;
- CSS fornecido;
- recursos estáticos relevantes;
- dados recebidos de domain.py/services.py.

Explique:

1. estrutura geral da interface;
2. navegação;
3. componentes principais;
4. como cada aba é montada;
5. quais dados do backend são usados;
6. onde existe lógica visual condicionada ao estado;
7. como ocorre a atualização/polling atual.

PARTE 2 — ANALISE CADA ABA

Analise separadamente:

MAPA
HISTÓRICO
ITINERÁRIO
SOBRE

Para cada uma, informe:

- finalidade;
- informações apresentadas;
- elementos visuais;
- problemas conhecidos;
- informações excessivas ou ausentes;
- oportunidades de melhoria;
- dependências com Backend;
- dependências com Mapas/ETA.

PARTE 3 — UX

Avalie a interface considerando:

- clareza;
- hierarquia de informação;
- facilidade de navegação;
- legibilidade;
- excesso de conteúdo;
- consistência;
- feedback ao usuário;
- estados de erro;
- telemetria indisponível;
- telemetria antiga;
- informações estimadas;
- confiança transmitida pela interface.

Identifique informações que podem induzir o usuário a acreditar
que um dado é mais preciso ou atual do que realmente é.

PARTE 4 — RESPONSIVIDADE

Avalie separadamente a experiência esperada em:

- notebook/desktop;
- tablet;
- celular.

Identifique no código atual:

- larguras fixas;
- componentes que podem quebrar;
- imagens/mapas grandes;
- tabelas largas;
- navegação inadequada para mobile;
- textos ou cartões que podem ficar apertados.

Proponha, sem implementar ainda, estratégias como:

- CSS Grid;
- Flexbox;
- media queries;
- reorganização de cartões;
- navegação mobile;
- componentes expansíveis;
- priorização de conteúdo.

Não trate essas sugestões como decisões finais.

PARTE 5 — DIREÇÃO VISUAL

Considere que a direção desejada é:

mais limpa
+
moderna
+
atrativa
+
informações necessárias
+
uso rápido

Mas não proponha apenas mudanças estéticas.

Para cada sugestão futura, explique:

1. qual problema resolve;
2. qual benefício traz para o usuário;
3. se afeta desktop, tablet ou celular;
4. se depende de outro grupo.

PARTE 6 — PROBLEMAS CONHECIDOS

Verifique especialmente:

- ETA exibido mesmo com telemetria indisponível;
- texto sobre Google Maps/check-up desatualizado;
- miniaturas invertidas no Histórico;
- possível problema de ordenação;
- discussão sobre manter ou remover miniaturas;
- necessidade de revisão visual de todas as abas.

Classifique cada item como:

- FUNCIONALIDADE CONFIRMADA;
- BUG CONFIRMADO;
- PROBLEMA RELATADO;
- DECISÃO FUTURA;
- INCERTO.

Não implemente correções nesta primeira conversa.

PARTE 7 — MINIATURAS DO HISTÓRICO

Não assuma que elas devem permanecer.

Analise vantagens e desvantagens de:

- manter miniaturas;
- remover;
- substituir por ícones;
- permitir mapa sob demanda.

Considere que a decisão final pertence principalmente ao Grupo 4,
com possível alinhamento com o Grupo 5.

PARTE 8 — DEPENDÊNCIAS COM OUTROS GRUPOS

Mostre quais decisões dependem de:

Grupo 1 — Backend e Regras de Negócio;
Grupo 5 — Mapas, ETA, Testes e Integração;
Grupo 2 — Telemetria/MQTT, quando a apresentação depender da
qualidade/disponibilidade dos dados.

Indique claramente o que o Grupo 4 pode decidir sozinho e o que
exige alinhamento.

PARTE 9 — FONTES PRIMÁRIAS

Indique quais arquivos devem ser tratados como fontes primárias
para futuras tarefas do grupo.

Finalize com uma seção:

ESTADO DE PRONTIDÃO DO GRUPO 4

Informe:

1. o que já está suficientemente compreendido;
2. quais áreas podem ser redesenhadas sem depender de mudanças no backend;
3. quais áreas dependem de regras ainda não finalizadas;
4. quais problemas precisam ser reproduzidos;
5. quais aspectos precisam ser testados em notebook, tablet e celular;
6. qual seria uma sequência segura para iniciar a evolução visual.

Não altere nenhum arquivo.
Não implemente nenhuma correção.
Aguarde minha próxima instrução.
```
