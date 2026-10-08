const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 or 13.33 x 7.5
  pptx.title = 'LocBUS: Apresentação Oral IEEE Latin America';
  pptx.company = 'Universidade Federal da Paraíba (UFPB)';
  pptx.author = 'Guilherme Edgar C. S. R. Guedes';

  // Palette
  const C_BG = '070B14';
  const C_CARD = '0F172A';
  const C_CARD2 = '141E33';
  const C_BORDER = '1F2D48';
  const C_ACCENT = '0284C7';
  const C_ACCENT_LIGHT = '38BDF8';
  const C_EMERALD = '10B981';
  const C_EMERALD_LIGHT = '34D399';
  const C_AMBER = 'F59E0B';
  const C_ROSE = 'FB7185';
  const C_WHITE = 'FFFFFF';
  const C_TEXT = 'F8FAFC';
  const C_SUB = 'CBD5E1';
  const C_MUTED = '94A3B8';

  const assetsDir = path.resolve(__dirname, '../apresentacao_15min/assets');
  const imgMobile = path.join(assetsDir, 'mobile_interface_pwa.png');
  const imgArch = path.join(assetsDir, 'fig1_arquitetura.png');
  const imgDesktop = path.join(assetsDir, 'desktop_mapa_ao_vivo.png');
  const imgField = path.join(assetsDir, 'validacao_campo_telemetria.png');

  // Helper: Header bar on slide
  function addSlideHeader(slide, category, timing, title, subtitle) {
    // Category pill
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.4, w: 4.5, h: 0.32,
      fontFace: 'Segoe UI', fontSize: 10, bold: true,
      color: C_ACCENT_LIGHT, fill: { color: '0E2238' },
      align: 'left', valign: 'middle',
      margin: [0, 8, 0, 8]
    });

    // Timing
    slide.addText(timing, {
      x: 8.5, y: 0.4, w: 4.0, h: 0.32,
      fontFace: 'Consolas', fontSize: 10,
      color: C_MUTED, align: 'right', valign: 'middle'
    });

    // Title
    slide.addText(title, {
      x: 0.8, y: 0.78, w: 11.7, h: 0.6,
      fontFace: 'Segoe UI', fontSize: 22, bold: true,
      color: C_WHITE, valign: 'top'
    });

    // Subtitle
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8, y: 1.35, w: 11.7, h: 0.35,
        fontFace: 'Segoe UI', fontSize: 13,
        color: C_ACCENT_LIGHT, valign: 'top'
      });
    }
  }

  // ==========================================
  // SLIDE 1: Capa
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };

    // Badge
    slide.addText('ARTIGO CIENTÍFICO & PROPOSTA DE ENGENHARIA • IEEE LATIN AMERICA', {
      x: 0.8, y: 0.8, w: 6.5, h: 0.35,
      fontFace: 'Segoe UI', fontSize: 10, bold: true,
      color: C_ACCENT_LIGHT, fill: { color: '0E2238' },
      margin: [0, 10, 0, 10]
    });

    // Timing
    slide.addText('⏱️ 00:00 - 00:45 (45s)', {
      x: 9.0, y: 0.8, w: 3.5, h: 0.35,
      fontFace: 'Consolas', fontSize: 11, color: C_MUTED, align: 'right'
    });

    // Title
    slide.addText('LocBUS: Arquitetura Híbrida de Telemetria e Rastreamento Veicular Colaborativo de Baixo Custo', {
      x: 0.8, y: 1.35, w: 11.7, h: 1.3,
      fontFace: 'Segoe UI', fontSize: 26, bold: true,
      color: C_WHITE, lineSpacingMultiple: 1.15
    });

    // Subtitle
    slide.addText('Rastreamento Inteligente de Transporte Universitário Intercampi sem Computador de Bordo 4G', {
      x: 0.8, y: 2.75, w: 11.7, h: 0.45,
      fontFace: 'Segoe UI', fontSize: 15,
      color: C_ACCENT_LIGHT
    });

    // 4 Stat boxes
    const stats = [
      { num: 'R$ 0', lbl: 'CUSTO CONECTIVIDADE VEICULAR', col: C_EMERALD_LIGHT },
      { num: '< R$ 40', lbl: 'HARDWARE VEICULAR (ESP32)', col: C_ACCENT_LIGHT },
      { num: '< 350ms', lbl: 'LATÊNCIA STREAMING SSE', col: C_WHITE },
      { num: '100%', lbl: 'CONFORME À LGPD (SEM PII)', col: C_ACCENT_LIGHT }
    ];

    stats.forEach((st, i) => {
      const boxX = 0.8 + i * 2.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: boxX, y: 3.45, w: 2.8, h: 1.45,
        fill: { color: C_CARD2 }, line: { color: C_BORDER, width: 1 },
        rectRadius: 0.1
      });
      slide.addText(st.num, {
        x: boxX, y: 3.65, w: 2.8, h: 0.65,
        fontFace: 'Consolas', fontSize: 24, bold: true,
        color: st.col, align: 'center'
      });
      slide.addText(st.lbl, {
        x: boxX, y: 4.35, w: 2.8, h: 0.45,
        fontFace: 'Segoe UI', fontSize: 9, bold: true,
        color: C_MUTED, align: 'center'
      });
    });

    // Footer Author Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.3, w: 11.7, h: 1.4,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 },
      rectRadius: 0.1
    });

    slide.addText('Guilherme Edgar C. S. R. Guedes & Equipe LocBUS', {
      x: 1.1, y: 5.48, w: 7.5, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_WHITE
    });
    slide.addText('Universidade Federal da Paraíba (UFPB) • Campus I (João Pessoa) / Campus IV (Rio Tinto)', {
      x: 1.1, y: 5.9, w: 7.5, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 11, color: C_MUTED
    });

    // Tech pills on right
    slide.addText('FASTAPI  •  ESP32 BLE  •  LEAFLET PWA  •  SSE STREAM', {
      x: 8.5, y: 5.65, w: 3.7, h: 0.4,
      fontFace: 'Consolas', fontSize: 10, bold: true,
      color: C_ACCENT_LIGHT, align: 'right'
    });

    slide.addNotes("Tempo sugerido: 45s\n\nO que falar: 'Olá a todos, bom dia/boa tarde. Meu nome é Guilherme Guedes e hoje vou apresentar a proposta do nosso projeto intitulado LocBUS: Uma arquitetura híbrida de telemetria e rastreamento veicular colaborativo de baixo custo para o transporte universitário intercampi. Nosso trabalho foca em resolver um problema histórico de imprevisibilidade no deslocamento dos estudantes da UFPB, propondo uma solução de alta fidelidade técnica, mas com custo de implantação e operação praticamente nulo.'");
  }

  // ==========================================
  // SLIDE 2: Contexto Operacional UFPB
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Contextualização Operacional', '⏱️ 00:45 - 02:00 (1m15s)',
      'O Cenário do Transporte Universitário Intercampi (UFPB)',
      'Deslocamento diário contínuo em malha urbana mista e tráfego saturado'
    );

    // Left Card: Dimensão
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 3.7,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('📍 Dimensão da Operação', {
      x: 1.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText([
      { text: '• Ligação obrigatória entre ', options: { bold: false } },
      { text: 'Campus I (Castelo Branco)', options: { bold: true, color: C_WHITE } },
      { text: ' e ', options: { bold: false } },
      { text: 'Centro de Informática (Mangabeira)', options: { bold: true, color: C_WHITE } },
      { text: ';\n• Percurso viário superior a ', options: { bold: false } },
      { text: '14 km por ciclo completo', options: { bold: true, color: C_WHITE } },
      { text: ';\n• Atravessa corredores de tráfego intenso (Av. Sérgio Guerra / Bancários);\n• ', options: { bold: false } },
      { text: '8 paradas principais:', options: { bold: true, color: C_WHITE } },
      { text: ' CCHLA, Reitoria, RU, CCEN, CT, CE, Praça da Paz e CI Mangabeira.', options: { bold: false } }
    ], {
      x: 1.1, y: 2.5, w: 5.1, h: 2.8,
      fontFace: 'Segoe UI', fontSize: 12, color: C_SUB, lineSpacingMultiple: 1.3
    });

    // Right Card: Impactos
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 3.7,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('⚠️ Impactos da Falta de Previsibilidade', {
      x: 7.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ROSE
    });
    slide.addText([
      { text: '✕ Passageiros aguardam nas paradas no escuro, sem saber se o ônibus acabou de passar ou se atrasará 30 min;\n\n', options: { color: C_SUB } },
      { text: '✕ Exposição a intempéries climáticas e vulnerabilidade de segurança pública nos pontos isolados;\n\n', options: { color: C_SUB } },
      { text: '✕ Superlotação repentina nas paradas e atrasos em avaliações acadêmicas e aulas práticas.', options: { color: C_SUB } }
    ], {
      x: 7.1, y: 2.5, w: 5.1, h: 2.8,
      fontFace: 'Segoe UI', fontSize: 12, lineSpacingMultiple: 1.3
    });

    // Bottom Itinerary Strip
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.75, w: 11.7, h: 1.1,
      fill: { color: '0A1122' }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('ITINERÁRIO ESTRATÉGICO: 1. CCHLA → 2. Reitoria → 3. RU → 4. CCEN → 5. CT → 6. Praça da Paz → 7. Mangabeira Shopping → 8. CI Mangabeira', {
      x: 1.0, y: 6.0, w: 11.3, h: 0.6,
      fontFace: 'Segoe UI', fontSize: 11, bold: true, color: C_ACCENT_LIGHT, align: 'center'
    });

    slide.addNotes("Tempo sugerido: 1m15s\n\nO que falar: 'Para contextualizar: a UFPB possui uma estrutura multicampi em João Pessoa. Diariamente, centenas de alunos precisam transitar entre o Campus I, no Castelo Branco, e o Centro de Informática, em Mangabeira. O trajeto do ônibus circular intercampi possui mais de 14 quilômetros, atravessando corredores urbanos com semáforos e trânsito intenso. Hoje, o passageiro não sabe se o ônibus acabou de passar ou se ainda vai demorar 30 minutos, gerando ansiedade e perda de aulas.'");
  }

  // ==========================================
  // SLIDE 3: O Problema de Pesquisa
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Problema de Pesquisa', '⏱️ 02:00 - 03:30 (1m30s)',
      'A Assimetria Informacional e o Dilema de Custos',
      'Por que o transporte público universitário ainda opera sem rastreamento em tempo real?'
    );

    // Left Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 3.5,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('🏛️ O Dilema da Universidade Pública', {
      x: 1.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_AMBER
    });
    slide.addText([
      { text: '• Orçamento Custeio Rígido: ', options: { bold: true, color: C_WHITE } },
      { text: 'Impossibilidade de assumir despesas mensais recorrentes com chips 4G M2M;\n\n', options: { color: C_SUB } },
      { text: '• Frotas Mistas e Terceirizadas: ', options: { bold: true, color: C_WHITE } },
      { text: 'Ônibus alugados não permitem instalação invasiva na fiação ou na rede CAN do veículo;\n\n', options: { color: C_SUB } },
      { text: '• Sistemas Proprietários Fechados: ', options: { bold: true, color: C_WHITE } },
      { text: 'Softwares industriais exigem licenças caras e dependência de fornecedor.', options: { color: C_SUB } }
    ], {
      x: 1.1, y: 2.5, w: 5.1, h: 2.7,
      fontFace: 'Segoe UI', fontSize: 11.5, lineSpacingMultiple: 1.25
    });

    // Right Card: Pergunta de pesquisa
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 3.5,
      fill: { color: '0A1428' }, line: { color: C_ACCENT, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText('🎯 A Pergunta Científica', {
      x: 7.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText([
      { text: '"É possível alcançar a mesma ', options: { italic: true } },
      { text: 'confiabilidade e precisão determinística', options: { bold: true, color: C_WHITE, italic: true } },
      { text: ' de um rastreador veicular dedicado, aproveitando a ', options: { italic: true } },
      { text: 'conectividade e sensores dos smartphones dos passageiros', options: { bold: true, color: C_WHITE, italic: true } },
      { text: ', eliminando o custo de planos de dados e blindando o sistema contra o ruído de pedestres?"\n\n', options: { italic: true } },
      { text: '➜ Resposta LocBUS: ', options: { bold: true, color: C_EMERALD_LIGHT } },
      { text: 'Simbiose entre rádio veicular de curto alcance e sensoriamento móvel participativo.', options: { color: C_SUB } }
    ], {
      x: 7.1, y: 2.5, w: 5.1, h: 2.7,
      fontFace: 'Segoe UI', fontSize: 12, color: C_SUB, lineSpacingMultiple: 1.3
    });

    // 3 Stat boxes at bottom
    const costStats = [
      { num: 'R$ 2.500', lbl: 'CUSTO RASTREADOR AVL / VEÍCULO', col: C_ROSE },
      { num: 'R$ 100/mês', lbl: 'MENSALIDADE 4G M2M POR ÔNIBUS', col: C_ROSE },
      { num: 'R$ 0/mês', lbl: 'GASTO MENSAL NA ABORDAGEM LOCBUS', col: C_EMERALD_LIGHT }
    ];

    costStats.forEach((st, i) => {
      const bX = 0.8 + i * 3.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: bX, y: 5.55, w: 3.8, h: 1.35,
        fill: { color: C_CARD2 }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
      });
      slide.addText(st.num, {
        x: bX, y: 5.7, w: 3.8, h: 0.6,
        fontFace: 'Consolas', fontSize: 22, bold: true, color: st.col, align: 'center'
      });
      slide.addText(st.lbl, {
        x: bX, y: 6.3, w: 3.8, h: 0.4,
        fontFace: 'Segoe UI', fontSize: 9.5, bold: true, color: C_MUTED, align: 'center'
      });
    });

    slide.addNotes("Tempo sugerido: 1m30s\n\nO que falar: 'Identificamos um problema claro: a falta de previsibilidade do transporte universitário. A solução óbvia do mercado privado seria instalar rastreadores AVL industriais nos ônibus. No entanto, em universidades federais e frotas terceirizadas, isso custaria de R$ 1.500 a R$ 2.500 por veículo, além de mensalidades de chips 4G M2M que o orçamento institucional não suporta. Nossa pergunta de pesquisa foi: é possível alcançar a mesma confiabilidade de um rastreador dedicado, aproveitando a conectividade dos próprios passageiros, mas sem cair nas falhas típicas de aplicativos comunitários?'");
  }

  // ==========================================
  // SLIDE 4: Estado da Arte I (AVL)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Estado da Arte I • Sistemas AVL', '⏱️ 03:30 - 05:00 (1m30s)',
      'Sistemas AVL (Automatic Vehicle Location) Convencionais',
      'O padrão industrial da iniciativa privada e suas barreiras no setor público'
    );

    // Left Card: Vantagens
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 4.4,
      fill: { color: C_CARD }, line: { color: C_EMERALD, width: 1 }, rectRadius: 0.1
    });
    slide.addText('✓ Vantagens Técnicas Consolidadas', {
      x: 1.1, y: 2.1, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_EMERALD_LIGHT
    });
    slide.addText([
      { text: '• Receptores GNSS veiculares de alta sensibilidade com taxa de atualização de 1 a 5 Hz;\n\n', options: { color: C_SUB } },
      { text: '• Transmissão ininterrupta via modem celular dedicado (GPRS / 4G / LTE);\n\n', options: { color: C_SUB } },
      { text: '• Funcionamento autônomo e independente da ação de passageiros;\n\n', options: { color: C_SUB } },
      { text: '• Possibilidade de telemetria CAN integrada (velocidade de roda, RPM, combustível).', options: { color: C_SUB } }
    ], {
      x: 1.1, y: 2.6, w: 5.1, h: 3.4,
      fontFace: 'Segoe UI', fontSize: 12, lineSpacingMultiple: 1.3
    });

    // Right Card: Desvantagens
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 4.4,
      fill: { color: C_CARD }, line: { color: C_ROSE, width: 1 }, rectRadius: 0.1
    });
    slide.addText('✕ Desvantagens e Barreiras Críticas', {
      x: 7.1, y: 2.1, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ROSE
    });
    slide.addText([
      { text: '• Custo de Aquisição: ', options: { bold: true, color: C_WHITE } },
      { text: 'R$ 1.500 a R$ 2.500 por equipamento veicular homologado;\n\n', options: { color: C_SUB } },
      { text: '• Custo Recorrente Vitalício: ', options: { bold: true, color: C_WHITE } },
      { text: 'R$ 60 a R$ 120 mensais por chip M2M contratado;\n\n', options: { color: C_SUB } },
      { text: '• Instalação Invasiva: ', options: { bold: true, color: C_WHITE } },
      { text: 'Corte de chicote elétrico e conexão na bateria, vetada por operadores de frotas terceirizadas;\n\n', options: { color: C_SUB } },
      { text: '• Inviabilidade no Setor Público: ', options: { bold: true, color: C_WHITE } },
      { text: 'Risco de descontinuidade contratual e orçamentos contingenciados.', options: { color: C_SUB } }
    ], {
      x: 7.1, y: 2.6, w: 5.1, h: 3.4,
      fontFace: 'Segoe UI', fontSize: 12, lineSpacingMultiple: 1.3
    });

    // Bottom note
    slide.addText('Diagnóstico: Excelente para grandes operadores metropolitanos com capital intensivo; inviável e deficitário para frotas universitárias públicas.', {
      x: 0.8, y: 6.4, w: 11.7, h: 0.5,
      fontFace: 'Segoe UI', fontSize: 11, italic: true, color: C_MUTED, align: 'center'
    });

    slide.addNotes("Tempo sugerido: 1m30s\n\nO que falar: 'No Estado da Arte, analisamos inicialmente os sistemas AVL industriais. Eles são consagrados em grandes operadores comerciais: possuem receptores GPS potentes e transmitem a posição via modem 4G direto para a nuvem. Eles funcionam muito bem, mas apresentam grandes barreiras para o nosso cenário: exigem modificação elétrica no veículo, geram custos mensais contínuos e são financeiramente inviáveis para frotas públicas de pequeno e médio porte.'");
  }

  // ==========================================
  // SLIDE 5: Estado da Arte II (Crowdsourcing vs BLE)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Estado da Arte II • Crowdsourcing & IoT', '⏱️ 05:00 - 06:30 (1m30s)',
      'Crowdsourcing Comunitário e Tecnologias de Proximidade (BLE)',
      'A contraposição entre sensoriamento puramente móvel e balizas locais de rádio'
    );

    // Left Card: Crowdsourcing
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 4.4,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('📱 Crowdsourcing Puro (Waze / Moovit)', {
      x: 1.1, y: 2.1, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText([
      { text: '• Custo de Hardware Zero: ', options: { bold: true, color: C_WHITE } },
      { text: 'Aproveita os sensores já existentes nos celulares da comunidade;\n\n', options: { color: C_SUB } },
      { text: '✕ Falha Crítica 1 (Falsos Positivos): ', options: { bold: true, color: C_ROSE } },
      { text: 'Não diferencia se o passageiro está dentro do ônibus ou caminhando a pé na calçada ao lado da parada;\n\n', options: { color: C_SUB } },
      { text: '✕ Falha Crítica 2 (Vulnerabilidade): ', options: { bold: true, color: C_ROSE } },
      { text: 'Vulnerável a coordenadas adulteradas (GPS spoofing) ou motoristas de aplicativo que abrem o app por engano.', options: { color: C_SUB } }
    ], {
      x: 1.1, y: 2.6, w: 5.1, h: 3.4,
      fontFace: 'Segoe UI', fontSize: 12, lineSpacingMultiple: 1.3
    });

    // Right Card: BLE
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 4.4,
      fill: { color: C_CARD }, line: { color: C_EMERALD, width: 1 }, rectRadius: 0.1
    });
    slide.addText('📻 Balizas de Proximidade (Bluetooth Low Energy)', {
      x: 7.1, y: 2.1, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_EMERALD_LIGHT
    });
    slide.addText([
      { text: '• Microtransmissores Autônomos (ESP32 / iBeacon): ', options: { bold: true, color: C_WHITE } },
      { text: 'Custo unitário inferior a R$ 40 por veículo;\n\n', options: { color: C_SUB } },
      { text: '• Alimentação Passiva: ', options: { bold: true, color: C_WHITE } },
      { text: 'Conectado direto na porta USB 5V do painel (consumo < 0.4W), sem alterar fiação do ônibus;\n\n', options: { color: C_SUB } },
      { text: '• Imunidade Determinística: ', options: { bold: true, color: C_WHITE } },
      { text: 'Alcance calibrado para 6 a 8 metros garante que somente quem está dentro da carroceria capture o rádio.', options: { color: C_SUB } }
    ], {
      x: 7.1, y: 2.6, w: 5.1, h: 3.4,
      fontFace: 'Segoe UI', fontSize: 12, lineSpacingMultiple: 1.3
    });

    // Bottom banner
    slide.addText('💡 Oportunidade Científica: Usar o sinal físico BLE como chave criptográfica para autenticar e canalizar o GPS dos passageiros!', {
      x: 0.8, y: 6.4, w: 11.7, h: 0.5,
      fontFace: 'Segoe UI', fontSize: 11, bold: true, color: C_EMERALD_LIGHT, align: 'center'
    });

    slide.addNotes("Tempo sugerido: 1m30s\n\nO que falar: 'Na outra ponta, olhamos para as soluções de Crowdsourcing puro, como Moovit e Waze. Elas não exigem nenhum hardware no ônibus, o que é ótimo. Mas têm uma falha fatal: se um aluno com o app aberto estiver caminhando a pé na calçada perto da parada, o sistema pode achar que o ônibus está ali! Além disso, qualquer usuário mal-intencionado pode injetar coordenadas falsas. Por outro lado, a tecnologia Bluetooth Low Energy (BLE) nos dá uma ferramenta de ouro: balizas de proximidade de menos de 40 reais que transmitem identificadores criptografados a poucos metros.'");
  }

  // ==========================================
  // SLIDE 6: A Lacuna Tecnológica (Tabela)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'A Lacuna Tecnológica', '⏱️ 06:30 - 08:00 (1m30s)',
      'Matriz de Decisão: Onde as Soluções Atuais Falham',
      'Identificação da oportunidade científica que fundamenta a arquitetura LocBUS'
    );

    // Table rows
    const tableData = [
      [
        { text: 'CRITÉRIO DE AVALIAÇÃO', options: { bold: true, color: C_MUTED, fill: { color: '0A1122' } } },
        { text: 'AVL COMERCIAL 4G', options: { bold: true, color: C_MUTED, fill: { color: '0A1122' } } },
        { text: 'CROWDSOURCING PURO', options: { bold: true, color: C_MUTED, fill: { color: '0A1122' } } },
        { text: 'LOCBUS (NOSSA PROPOSTA)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ],
      [
        { text: 'Custo de Hardware Veicular', options: { bold: true, color: C_WHITE } },
        { text: 'Alto (> R$ 1.500)', options: { color: C_SUB } },
        { text: 'Nulo (R$ 0)', options: { color: C_SUB } },
        { text: 'Mínimo (< R$ 40 - ESP32)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ],
      [
        { text: 'Mensalidade de Conectividade', options: { bold: true, color: C_WHITE } },
        { text: 'Obrigatório (R$ 60-120/mês)', options: { color: C_ROSE } },
        { text: 'Não (Dados do usuário)', options: { color: C_SUB } },
        { text: 'Zero (Planos dos passageiros)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ],
      [
        { text: 'Imunidade a Ruídos de Pedestres', options: { bold: true, color: C_WHITE } },
        { text: 'Total', options: { color: C_SUB } },
        { text: 'Vulnerável (Confunde pedestre)', options: { color: C_ROSE } },
        { text: 'Total (Autenticação Rádio BLE)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ],
      [
        { text: 'Resistência a GPS Spoofing', options: { bold: true, color: C_WHITE } },
        { text: 'Alta', options: { color: C_SUB } },
        { text: 'Baixa (Injeção de coordenadas)', options: { color: C_ROSE } },
        { text: 'Alta (BLE + Geofencing 80m)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ],
      [
        { text: 'Latência de Difusão ao Usuário', options: { bold: true, color: C_WHITE } },
        { text: '5 a 15 segundos', options: { color: C_SUB } },
        { text: '15 a 60 segundos', options: { color: C_SUB } },
        { text: '< 350 ms (Streaming SSE)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ],
      [
        { text: 'Instalação Física no Veículo', options: { bold: true, color: C_WHITE } },
        { text: 'Invasiva (Chicote / CAN)', options: { color: C_ROSE } },
        { text: 'Nenhuma', options: { color: C_SUB } },
        { text: 'Plug & Play (USB 5V do painel)', options: { bold: true, color: C_EMERALD_LIGHT, fill: { color: '0C2822' } } }
      ]
    ];

    slide.addTable(tableData, {
      x: 0.8, y: 1.85, w: 11.7, h: 4.2,
      fontFace: 'Segoe UI', fontSize: 11,
      align: 'left', valign: 'middle',
      border: { pt: 1, color: C_BORDER },
      fill: { color: C_CARD }
    });

    slide.addText('🎯 O LocBUS preenche a lacuna exata: custo de conectividade zero com a confiabilidade determinística de um rastreador embarcado.', {
      x: 0.8, y: 6.3, w: 11.7, h: 0.5,
      fontFace: 'Segoe UI', fontSize: 12, bold: true, color: C_ACCENT_LIGHT, align: 'center'
    });

    slide.addNotes("Tempo sugerido: 1m30s\n\nO que falar: 'Aqui chegamos ao coração da nossa contribuição: a Lacuna Tecnológica. Existe um abismo entre o rastreador veicular caro e o aplicativo comunitário impreciso. O que faltava na literatura e na indústria é uma solução híbrida: um sistema que utilize a presença física confirmada por um rádio de baixíssimo custo no ônibus para validar e canalizar o GPS dos smartphones dos passageiros, filtrando matematicamente todo o ruído. Essa é a proposta do LocBUS.'");
  }

  // ==========================================
  // SLIDE 7: A Solução LocBUS
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'A Solução Proposta', '⏱️ 08:00 - 09:30 (1m30s)',
      'A Proposta LocBUS: Telemetria Híbrida Simbiótica',
      'Fusão inteligente entre rádio veicular de curto alcance e sensoriamento móvel participativo'
    );

    // Left: 4 steps card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 7.2, h: 4.9,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('⚙️ Fluxo Operacional Simbiótico', {
      x: 1.1, y: 2.05, w: 6.6, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 15, bold: true, color: C_ACCENT_LIGHT
    });

    const steps = [
      { num: '1', title: 'Validação de Presença Física', desc: 'O estudante embarca no ônibus. A PWA detecta o sinal de rádio RSSI do ESP32 veicular (> -75 dBm) via Web Bluetooth.', col: C_ACCENT_LIGHT },
      { num: '2', title: 'Coleta Oportunista GNSS', desc: 'O smartphone inicia a transmissão do seu GPS com intervalo estrito de Δt = 4 segundos (economizando bateria móvel).', col: C_EMERALD_LIGHT },
      { num: '3', title: 'Filtragem e Limpeza em Nuvem', desc: 'O backend FastAPI valida a posição no geofence da rota (80m) e descarta saltos anômalos acima de 65 km/h.', col: C_AMBER },
      { num: '4', title: 'Difusão Instantânea aos Usuários', desc: 'A posição consolidada é distribuída instantaneamente para quem espera nas paradas via Server-Sent Events (< 350 ms).', col: C_ACCENT_LIGHT }
    ];

    steps.forEach((st, idx) => {
      const sY = 2.55 + idx * 1.05;
      slide.addText(st.num, {
        x: 1.1, y: sY, w: 0.4, h: 0.4,
        fontFace: 'Segoe UI', fontSize: 12, bold: true,
        color: st.col, fill: { color: '0A1E35' }, align: 'center', valign: 'middle'
      });
      slide.addText([
        { text: st.title + '\n', options: { bold: true, color: C_WHITE, fontSize: 11.5 } },
        { text: st.desc, options: { bold: false, color: C_SUB, fontSize: 10.5 } }
      ], {
        x: 1.6, y: sY - 0.05, w: 6.1, h: 0.95,
        fontFace: 'Segoe UI', lineSpacingMultiple: 1.15
      });
    });

    // Right: Real Mobile PWA Screenshot
    if (fs.existsSync(imgMobile)) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 8.3, y: 1.85, w: 4.2, h: 4.9,
        fill: { color: '0A1020' }, line: { color: '334155', width: 2 }, rectRadius: 0.15
      });
      slide.addText('PWA MOBILE • COMPARTILHAR GPS', {
        x: 8.3, y: 1.95, w: 4.2, h: 0.3,
        fontFace: 'Segoe UI', fontSize: 9, bold: true, color: C_EMERALD_LIGHT, align: 'center'
      });
      slide.addImage({
        path: imgMobile,
        x: 8.5, y: 2.3, w: 3.8, h: 4.3,
        sizing: { type: 'contain' }
      });
    }

    slide.addNotes("Tempo sugerido: 1m30s\n\nO que falar: 'O LocBUS funciona como uma simbiose inteligente: colocamos um pequeno beacon BLE alimentado na entrada USB do ônibus. Quando o estudante entra no veículo, o smartphone dele detecta o rádio com sinal forte e valida: estou fisicamente dentro do ônibus. A partir desse momento, e apenas enquanto estiver a bordo, a aplicação web transmite a posição do GPS do celular com intervalo de 4 segundos. O ônibus é rastreado sem gastar 1 centavo com chip 4G institucional.'");
  }

  // ==========================================
  // SLIDE 8: Requisitos de Engenharia
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Engenharia de Software', '⏱️ 09:30 - 10:30 (1m00s)',
      'Requisitos de Engenharia (RFs e RNFs)',
      'Critérios rigorosos de especificação técnica para viabilidade em produção'
    );

    // Left: RFs
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 4.9,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('📋 Requisitos Funcionais (RFs)', {
      x: 1.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText([
      { text: '• RF01 (Autenticação BLE): ', options: { bold: true, color: C_WHITE } },
      { text: 'Rastreamento colaborativo só é aceito mediante validação do rádio veicular;\n\n', options: { color: C_SUB } },
      { text: '• RF02 (Geofencing Contínuo): ', options: { bold: true, color: C_WHITE } },
      { text: 'Descarte imediato de telemetria além de 80 metros do eixo viário oficial da UFPB;\n\n', options: { color: C_SUB } },
      { text: '• RF03 (Filtro Cinemático): ', options: { bold: true, color: C_WHITE } },
      { text: 'Descarte de saltos de GPS ou velocidades computadas superiores a 65 km/h;\n\n', options: { color: C_SUB } },
      { text: '• RF04 (Clustering Ponderado): ', options: { bold: true, color: C_WHITE } },
      { text: 'Agregação de múltiplos passageiros ponderada pelo inverso da acurácia (1/σ);\n\n', options: { color: C_SUB } },
      { text: '• RF05 (Difusão SSE): ', options: { bold: true, color: C_WHITE } },
      { text: 'Publicação contínua unidirecional via Server-Sent Events.', options: { color: C_SUB } }
    ], {
      x: 1.1, y: 2.55, w: 5.1, h: 4.0,
      fontFace: 'Segoe UI', fontSize: 11, lineSpacingMultiple: 1.2
    });

    // Right: RNFs
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 4.9,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('⚡ Requisitos Não-Funcionais (RNFs)', {
      x: 7.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_EMERALD_LIGHT
    });
    slide.addText([
      { text: '• RNF01 (Latência Estrita): ', options: { bold: true, color: C_WHITE } },
      { text: 'Latência fim a fim inferior a 500 ms (atingido ~220 ms nos testes reais);\n\n', options: { color: C_SUB } },
      { text: '• RNF02 (Eficiência Energética): ', options: { bold: true, color: C_WHITE } },
      { text: 'Throttling de 4 segundos e cache oportunista W3C para preservar bateria do celular;\n\n', options: { color: C_SUB } },
      { text: '• RNF03 (Universalidade PWA): ', options: { bold: true, color: C_WHITE } },
      { text: 'Execução direta no navegador Web, dispensando downloads em lojas de apps;\n\n', options: { color: C_SUB } },
      { text: '• RNF04 (Privacidade e LGPD): ', options: { bold: true, color: C_WHITE } },
      { text: 'Transmissão 100% anônima em memória volátil com TTL; zero gravação em disco de CPF, IMEI ou identificadores pessoais.', options: { color: C_SUB } }
    ], {
      x: 7.1, y: 2.55, w: 5.1, h: 4.0,
      fontFace: 'Segoe UI', fontSize: 11, lineSpacingMultiple: 1.2
    });

    slide.addNotes("Tempo sugerido: 1m00s\n\nO que falar: 'Estruturamos nosso projeto sobre requisitos de engenharia rigorosos. Do lado funcional: geofencing com limite estrito de 80 metros da rota viária, teto cinemático de 65 km/h e clustering de múltiplos colaboradores. Do lado não funcional: latência de atualização abaixo de 500 milissegundos via Server-Sent Events, proteção estrita de bateria móvel e conformidade total com a LGPD, sem coletar CPF, nome, IMEI ou identificadores de usuário.'");
  }

  // ==========================================
  // SLIDE 9: Arquitetura em 4 Camadas (Diagrama Real)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Arquitetura de Sistemas', '⏱️ 10:30 - 12:00 (1m30s)',
      'Arquitetura Desacoplada em 4 Camadas',
      'Do nó veicular físico à difusão em tempo real no navegador do passageiro'
    );

    // Frame with Real Architecture Diagram
    if (fs.existsSync(imgArch)) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: 1.85, w: 11.7, h: 4.1,
        fill: { color: C_WHITE }, line: { color: '334155', width: 2 }, rectRadius: 0.1
      });
      slide.addImage({
        path: imgArch,
        x: 1.0, y: 1.95, w: 11.3, h: 3.9,
        sizing: { type: 'contain' }
      });
    }

    // 4 Layer summary pills at bottom
    const layers = [
      { title: '1. Veículo', desc: 'ESP32 iBeacon USB (0.4W)' },
      { title: '2. Borda', desc: 'PWA + Web Bluetooth + W3C GPS' },
      { title: '3. Nuvem', desc: 'FastAPI + Geofence + SSE Broker' },
      { title: '4. Cliente', desc: 'Leaflet.js + ETA Dinâmico' }
    ];

    layers.forEach((ly, i) => {
      const lX = 0.8 + i * 2.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: lX, y: 6.1, w: 2.8, h: 0.75,
        fill: { color: C_CARD2 }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.08
      });
      slide.addText(ly.title, {
        x: lX, y: 6.15, w: 2.8, h: 0.35,
        fontFace: 'Segoe UI', fontSize: 10.5, bold: true, color: C_ACCENT_LIGHT, align: 'center'
      });
      slide.addText(ly.desc, {
        x: lX, y: 6.45, w: 2.8, h: 0.35,
        fontFace: 'Segoe UI', fontSize: 8.5, color: C_SUB, align: 'center'
      });
    });

    slide.addNotes("Tempo sugerido: 1m30s\n\nO que falar: 'Nossa arquitetura é desacoplada em quatro camadas: na base física veicular, temos o ESP32 operando como iBeacon. Na borda, o passageiro roda uma PWA leve que dispensa instalação pela Google Play ou App Store. No backend, escolhemos Python assíncrono com FastAPI e um buffer volátil de alta velocidade em memória. E na apresentação, um mapa interativo em Leaflet que renderiza em tempo real as coordenadas e o rastro viário.'");
  }

  // ==========================================
  // SLIDE 10: Modelagem Matemática & Algoritmos
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Modelagem Matemática & Algoritmos', '⏱️ 12:00 - 13:15 (1m15s)',
      'Geofencing Haversine e Clustering Ponderado',
      'Como o sistema garante estabilidade espacial e elimina coordenadas aberrantes'
    );

    // Left Card: Geofencing
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 4.8,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('📐 Validação Esférica de Geofencing', {
      x: 1.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText('Cálculo da distância geodésica mínima entre o ponto móvel P(φ, λ) e o segmento viário oficial S(φ, λ):', {
      x: 1.1, y: 2.5, w: 5.1, h: 0.6,
      fontFace: 'Segoe UI', fontSize: 11.5, color: C_SUB
    });

    // Formula Box 1
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: 3.15, w: 5.1, h: 1.2,
      fill: { color: '0A1122' }, line: { color: C_ACCENT, width: 1.5 }, rectRadius: 0.08
    });
    slide.addText('d = 2R · arcsin(√(sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)))\n\nCondição de Aceite:  d ≤ 80 metros', {
      x: 1.2, y: 3.25, w: 4.9, h: 1.0,
      fontFace: 'Consolas', fontSize: 12, bold: true, color: C_EMERALD_LIGHT, align: 'center'
    });

    slide.addText('Descarte Automático: Se o passageiro enviar coordenada além de 80m do eixo viário (ex: caminhando na calçada oposta ou em comércio vizinho), o backend rejeita o ponto antes do cálculo do ônibus.', {
      x: 1.1, y: 4.5, w: 5.1, h: 1.8,
      fontFace: 'Segoe UI', fontSize: 11.5, color: C_SUB, lineSpacingMultiple: 1.25
    });

    // Right Card: Clustering
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 4.8,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('🎯 Centróide Ponderado por Inverso da Acurácia', {
      x: 7.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText('Quando múltiplos passageiros transmitem simultaneamente a bordo do mesmo veículo:', {
      x: 7.1, y: 2.5, w: 5.1, h: 0.6,
      fontFace: 'Segoe UI', fontSize: 11.5, color: C_SUB
    });

    // Formula Box 2
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: 3.15, w: 5.1, h: 1.2,
      fill: { color: '0A1122' }, line: { color: C_ACCENT, width: 1.5 }, rectRadius: 0.08
    });
    slide.addText('wₖ = 1 / max(σₖ, 1.0)\n\nX_bus = ( Σ wₖ · Xₖ ) / ( Σ wₖ )', {
      x: 7.2, y: 3.25, w: 4.9, h: 1.0,
      fontFace: 'Consolas', fontSize: 13, bold: true, color: C_ACCENT_LIGHT, align: 'center'
    });

    slide.addText('Efeito Estatístico: Se um passageiro possui smartphone moderno com acurácia de 3 metros (w = 0.33) e outro possui aparelho antigo com margem de 20 metros (w = 0.05), o sinal de alta qualidade tem peso 6.6x superior na rota.', {
      x: 7.1, y: 4.5, w: 5.1, h: 1.8,
      fontFace: 'Segoe UI', fontSize: 11.5, color: C_SUB, lineSpacingMultiple: 1.25
    });

    slide.addNotes("Tempo sugerido: 1m15s\n\nO que falar: 'Como resolvemos o problema da imprecisão do GPS dentro do ônibus? Criamos um estimador ponderado: quando vários passageiros estão a bordo ao mesmo tempo, cada celular envia sua coordenada e sua margem de erro. O nosso backend calcula o centróide ponderado pelo inverso da acurácia. Ou seja: um celular topo de linha com acurácia de 3 metros terá um peso estatístico muito superior a um aparelho antigo com margem de 20 metros. O resultado é uma posição veicular consolidada muito mais estável do que a de qualquer passageiro isolado.'");
  }

  // ==========================================
  // SLIDE 11: Resultados da PoC & Teste de Campo
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Validação Experimental', '⏱️ 13:15 - 14:15 (1m00s)',
      'Resultados da PoC: Simulação e Teste de Campo Real',
      'Evidências empíricas da estabilidade do sistema em bancada e em vias públicas'
    );

    // Left Frame: Desktop map
    if (fs.existsSync(imgDesktop)) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: 1.85, w: 5.7, h: 3.5,
        fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
      });
      slide.addText('Aplicação Principal: Rota UFPB (24 Testes Pytest OK)', {
        x: 1.0, y: 1.95, w: 5.3, h: 0.3,
        fontFace: 'Segoe UI', fontSize: 9.5, bold: true, color: C_EMERALD_LIGHT
      });
      slide.addImage({
        path: imgDesktop,
        x: 0.9, y: 2.3, w: 5.5, h: 2.9,
        sizing: { type: 'contain' }
      });
    }

    // Right Frame: Field test
    if (fs.existsSync(imgField)) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 6.8, y: 1.85, w: 5.7, h: 3.5,
        fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
      });
      slide.addText('Teste de Campo em Vias Reais (Pedras de Fogo - PB)', {
        x: 7.0, y: 1.95, w: 5.3, h: 0.3,
        fontFace: 'Segoe UI', fontSize: 9.5, bold: true, color: C_ACCENT_LIGHT
      });
      slide.addImage({
        path: imgField,
        x: 6.9, y: 2.3, w: 5.5, h: 2.9,
        sizing: { type: 'contain' }
      });
    }

    // 4 Stat boxes
    const results = [
      { num: '24 / 24', lbl: 'TESTES PYTEST APROVADOS', col: C_EMERALD_LIGHT },
      { num: '~220 ms', lbl: 'LATÊNCIA MÉDIA SSE', col: C_WHITE },
      { num: '31 Pts', lbl: 'CICLO COMPLETO SIMULADO', col: C_ACCENT_LIGHT },
      { num: '100%', lbl: 'CONTINUIDADE EM CAMPO', col: C_EMERALD_LIGHT }
    ];

    results.forEach((st, i) => {
      const bX = 0.8 + i * 2.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: bX, y: 5.55, w: 2.8, h: 1.35,
        fill: { color: C_CARD2 }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
      });
      slide.addText(st.num, {
        x: bX, y: 5.7, w: 2.8, h: 0.55,
        fontFace: 'Consolas', fontSize: 20, bold: true, color: st.col, align: 'center'
      });
      slide.addText(st.lbl, {
        x: bX, y: 6.3, w: 2.8, h: 0.4,
        fontFace: 'Segoe UI', fontSize: 8.5, bold: true, color: C_MUTED, align: 'center'
      });
    });

    slide.addNotes("Tempo sugerido: 1m00s\n\nO que falar: 'Nossos resultados preliminares da Prova de Conceito comprovam a tese: temos 24 testes unitários e de integração cobrindo todo o ciclo circular de 31 pontos da rota da UFPB. Além disso, executamos um teste de campo com telemetria contínua em condições móveis reais em vias públicas, validando o streaming de dados, o algoritmo de fallback de GPS e a contagem contínua de pontos com latência abaixo de 300 milissegundos.'");
  }

  // ==========================================
  // SLIDE 12: Conclusão & Próximos Passos
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addSlideHeader(slide, 'Conclusão & Impacto', '⏱️ 14:15 - 15:00 (45s)',
      'Conclusão, Próximos Passos e Contribuição',
      'Democratização da telemetria de transporte público com engenharia frugal e aberta'
    );

    // Left: Conclusão
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.85, w: 5.7, h: 3.5,
      fill: { color: C_CARD }, line: { color: C_EMERALD, width: 1 }, rectRadius: 0.1
    });
    slide.addText('🎓 Conclusão Científica & Técnica', {
      x: 1.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_EMERALD_LIGHT
    });
    slide.addText([
      { text: '• A fusão de microbalizas BLE (< R$ 40) com conectividade participativa ', options: { color: C_SUB } },
      { text: 'elimina definitivamente a dependência de modems 4G veiculares pagos', options: { bold: true, color: C_WHITE } },
      { text: ';\n\n• A combinação de ', options: { color: C_SUB } },
      { text: 'geofencing contínuo e clustering ponderado', options: { bold: true, color: C_WHITE } },
      { text: ' resolveu a clássica fraqueza de ruído e pedestres do crowdsourcing comum;\n\n• A arquitetura provou ser viável para ', options: { color: C_SUB } },
      { text: 'implantação imediata em universidades públicas', options: { bold: true, color: C_EMERALD_LIGHT } },
      { text: ' e frotas municipais com restrição de custeio.', options: { color: C_SUB } }
    ], {
      x: 1.1, y: 2.5, w: 5.1, h: 2.7,
      fontFace: 'Segoe UI', fontSize: 11.5, lineSpacingMultiple: 1.25
    });

    // Right: Cronograma
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.85, w: 5.7, h: 3.5,
      fill: { color: C_CARD }, line: { color: C_BORDER, width: 1 }, rectRadius: 0.1
    });
    slide.addText('🚀 Cronograma de Continuidade', {
      x: 7.1, y: 2.05, w: 5.1, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C_ACCENT_LIGHT
    });
    slide.addText([
      { text: '1. Fase Piloto Físico: ', options: { bold: true, color: C_WHITE } },
      { text: 'Instalação física dos primeiros protótipos de ESP32 nos circulares oficiais da UFPB;\n\n', options: { color: C_SUB } },
      { text: '2. Validação Discente em Escala: ', options: { bold: true, color: C_WHITE } },
      { text: 'Testes de usabilidade e adesão com turmas do Centro de Informática (Mangabeira);\n\n', options: { color: C_SUB } },
      { text: '3. Predição Preditiva de ETA: ', options: { bold: true, color: C_WHITE } },
      { text: 'Refinamento com dados históricos de congestionamento nos horários de pico.', options: { color: C_SUB } }
    ], {
      x: 7.1, y: 2.5, w: 5.1, h: 2.7,
      fontFace: 'Segoe UI', fontSize: 11.5, lineSpacingMultiple: 1.25
    });

    // Bottom Thank You Banner
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.55, w: 11.7, h: 1.35,
      fill: { color: '0E2238' }, line: { color: C_ACCENT, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText('Muito obrigado pela atenção!', {
      x: 1.0, y: 5.7, w: 11.3, h: 0.45,
      fontFace: 'Segoe UI', fontSize: 18, bold: true, color: C_WHITE, align: 'center'
    });
    slide.addText('Estamos abertos às dúvidas, considerações e questionamentos da banca examinadora.', {
      x: 1.0, y: 6.2, w: 11.3, h: 0.4,
      fontFace: 'Segoe UI', fontSize: 12, color: C_ACCENT_LIGHT, align: 'center'
    });

    slide.addNotes("Tempo sugerido: 45s\n\nO que falar: 'Para concluir: o LocBUS comprova que com engenharia de software e fusão sensorial inteligente é possível entregar um serviço de alto nível à comunidade acadêmica sem depender de grandes licitações de hardware caro. Nossos próximos passos envolvem a instalação piloto das balizas nos ônibus da UFPB e testes de usabilidade com os estudantes. Muito obrigado pela atenção de todos e estamos abertos às dúvidas da banca!'");
  }

  // Export
  const outputPath = path.resolve(__dirname, '../apresentacao_15min/LocBUS_Apresentacao_15min.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Apresentação PowerPoint gerada com sucesso em: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Erro ao gerar apresentação PowerPoint:', err);
  process.exit(1);
});
