#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera LocBUS_Apresentacao_IEEE.pptx com 12 slides completos em 16:9.
Utiliza python-pptx com estética dark-mode profissional, cards visuais,
tabelas comparativas, fórmulas, notas de orador e imagens reais do projeto.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_PATH = os.path.join("apresentacao_15min", "LocBUS_Apresentacao_IEEE.pptx")
ASSETS_DIR = os.path.join("apresentacao_15min", "assets")

# Paleta Dark Mode Premium
COLOR_BG = RGBColor(7, 11, 20)         # #070B14
COLOR_CARD = RGBColor(15, 23, 42)       # #0F172A
COLOR_CARD_BORDER = RGBColor(30, 41, 59) # #1E293B
COLOR_PRIMARY = RGBColor(56, 189, 248)  # Sky blue #38BDF8
COLOR_SECONDARY = RGBColor(2, 132, 199) # Deep sky #0284C7
COLOR_SUCCESS = RGBColor(16, 185, 129)  # Emerald #10B981
COLOR_TEXT_MAIN = RGBColor(248, 250, 252) # Slate 50
COLOR_TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
COLOR_AMBER = RGBColor(245, 158, 11)    # Amber #F59E0B

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLOR_BG

def add_header(slide, tag_text, title_text, slide_num, total_slides=12):
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.9))
    tf = header_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

    p_tag = tf.paragraphs[0]
    p_tag.text = f"{tag_text.upper()}  •  SLIDE {slide_num}/{total_slides}"
    p_tag.font.name = "Arial"
    p_tag.font.size = Pt(10)
    p_tag.font.bold = True
    p_tag.font.color.rgb = COLOR_PRIMARY

    p_title = tf.add_paragraph()
    p_title.text = title_text
    p_title.font.name = "Arial"
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_TEXT_MAIN
    p_title.space_before = Pt(3)

def add_card(slide, left, top, width, height, bg_color=COLOR_CARD, border_color=COLOR_CARD_BORDER):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1.5)
    return shape

def add_speaker_notes(slide, notes_text):
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.text = notes_text

def main():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 1: Capa Oficial
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    tag_box = s1.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(0.4))
    tf_tag = tag_box.text_frame
    p = tf_tag.paragraphs[0]
    p.text = "IEEE LATIN AMERICA TRANSACTIONS  •  SESSÃO TÉCNICA"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    title_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(1.8))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p = tf_title.paragraphs[0]
    p.text = "LocBUS: Telemetria e Rastreamento Veicular Colaborativo"
    p.font.name = "Arial"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_MAIN

    p_sub = tf_title.add_paragraph()
    p_sub.text = "Arquitetura Híbrida de Baixo Custo para o Transporte Universitário Intercampi"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = COLOR_PRIMARY
    p_sub.space_before = Pt(8)

    metrics = [
        ("R$ 0,00", "Conectividade Veicular", "Zero chips 4G M2M / operadoras", COLOR_SUCCESS),
        ("< R$ 40", "Hardware por Ônibus", "Apenas 1 ESP32 USB 5V (0.4W)", COLOR_PRIMARY),
        ("~220 ms", "Latência Ponta a Ponta", "Streaming reativo Server-Sent Events", COLOR_SUCCESS),
        ("100%", "Conformidade LGPD", "Sem contas, buffer volátil efêmero", COLOR_AMBER)
    ]
    card_w = Inches(2.65)
    card_h = Inches(2.0)
    start_left = Inches(1.0)
    top_pos = Inches(3.2)
    spacing = Inches(0.24)

    for i, (val, title, desc, accent) in enumerate(metrics):
        cx = start_left + i * (card_w + spacing)
        add_card(s1, cx, top_pos, card_w, card_h)
        tb = s1.shapes.add_textbox(cx + Inches(0.15), top_pos + Inches(0.15), card_w - Inches(0.3), card_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p1 = tf.paragraphs[0]
        p1.text = val
        p1.font.name = "Arial"
        p1.font.size = Pt(28)
        p1.font.bold = True
        p1.font.color.rgb = accent

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_MAIN
        p2.space_before = Pt(8)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.name = "Arial"
        p3.font.size = Pt(10)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_before = Pt(4)

    auth_box = s1.shapes.add_textbox(Inches(1.0), Inches(5.6), Inches(11.3), Inches(1.2))
    tf_auth = auth_box.text_frame
    p_a1 = tf_auth.paragraphs[0]
    p_a1.text = "Autor Principal: Guilherme Edgar C. S. R. Guedes  •  Orientação & Equipe de Pesquisa LocBUS"
    p_a1.font.name = "Arial"
    p_a1.font.size = Pt(13)
    p_a1.font.bold = True
    p_a1.font.color.rgb = COLOR_TEXT_MAIN

    p_a2 = tf_auth.add_paragraph()
    p_a2.text = "Universidade Federal da Paraíba (UFPB) — Centro de Informática & Campus I / Campus IV"
    p_a2.font.name = "Arial"
    p_a2.font.size = Pt(11)
    p_a2.font.color.rgb = COLOR_TEXT_MUTED
    p_a2.space_before = Pt(4)

    add_speaker_notes(s1, "00:45 min | Cumprimente os membros da banca e os presentes. Apresente seu nome, afiliação (UFPB) e o título do trabalho. Enfatize que o objetivo central da pesquisa foi resolver um gargalo histórico de mobilidade com telemetria frugal de custo zero de conexão veicular.")

    # =========================================================================
    # SLIDE 2: Contextualização Operacional (O Cenário da UFPB)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Contexto Operacional", "O Transporte Universitário Intercampi da UFPB", 2)

    add_card(s2, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.4))
    tb_c2 = s2.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.6), Inches(5.0))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True

    items_s2 = [
        ("Extensão Crítica da Rota", "O Circular UFPB conecta o Campus I (Castelo Branco) ao Centro de Informática (Mangabeira), cobrindo mais de 14 km por ciclo."),
        ("Gargalos de Tráfego", "O trajeto atravessa o bairro dos Bancários, região de altíssima densidade veicular e frequentes engarrafamentos em horários de pico."),
        ("8 Paradas Acadêmicas Fundamentais", "CCHLA -> Reitoria -> Centro de Convivência (RU) -> CCEN -> Centro de Tecnologia (CT) -> Praça da Paz -> Mangabeira Shopping -> Centro de Informática (CI)."),
        ("Vulnerabilidade do Estudante", "A incerteza quanto ao horário exato do circular expõe alunos e servidores à chuva, sol e riscos de segurança pública em paradas isoladas à noite.")
    ]
    for i, (title, desc) in enumerate(items_s2):
        p_t = tf_c2.paragraphs[0] if i == 0 else tf_c2.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_PRIMARY
        if i > 0:
            p_t.space_before = Pt(10)

        p_d = tf_c2.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(3)

    add_card(s2, Inches(7.1), Inches(1.5), Inches(5.4), Inches(5.4))
    transit_img_path = os.path.join(ASSETS_DIR, "transit_mobile_detalhes.png")
    if os.path.exists(transit_img_path):
        s2.shapes.add_picture(transit_img_path, Inches(7.3), Inches(1.7), width=Inches(5.0))

    add_speaker_notes(s2, "01:15 min | Detalhe o trajeto de 14 km entre Castelo Branco e Mangabeira. Explique que o tráfego nos Bancários torna o cumprimento de tabelas horárias estáticas impossível, gerando ansiedade e perda de aulas para a comunidade universitária.")

    # =========================================================================
    # SLIDE 3: O Problema de Pesquisa & Dilema Financeiro
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Problema & Motivação", "O Dilema Financeiro e Técnico do Rastreamento Público", 3)

    col_w = Inches(3.7)
    col_h = Inches(4.3)
    
    cards_s3 = [
        ("Custo de Aquisição AVL", "R$ 1.500 a R$ 2.500", "Módulos industriais embarcados (AVL) exigem instalação invasiva na fiação e na rede CAN dos ônibus, invalidando garantias de frotas licitadas.", COLOR_AMBER),
        ("Custo Recorrente 4G M2M", "R$ 60 a R$ 120 / mês / bus", "Universidades e municípios pequenos operam em restrição orçamentária contínua e frequentemente sofrem com cancelamento de linhas por falta de verba para chips M2M.", COLOR_AMBER),
        ("A Pergunta Científica", "Questão de Pesquisa", "É possível alcançar a acurácia de rastreadores dedicados usando apenas a conectividade e os smartphones dos passageiros, filtrando ruído e eliminando custos de operadora?", COLOR_PRIMARY)
    ]
    for i, (tag, val, desc, col_color) in enumerate(cards_s3):
        cx = Inches(0.8) + i * (col_w + Inches(0.3))
        add_card(s3, cx, Inches(1.6), col_w, col_h)
        tb = s3.shapes.add_textbox(cx + Inches(0.2), Inches(1.8), col_w - Inches(0.4), col_h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = tag.upper()
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = col_color

        p2 = tf.add_paragraph()
        p2.text = val
        p2.font.name = "Arial"
        p2.font.size = Pt(20)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_MAIN
        p2.space_before = Pt(8)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.name = "Arial"
        p3.font.size = Pt(11.5)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_before = Pt(12)

    add_card(s3, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.8), bg_color=COLOR_CARD)
    tb_bot = s3.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.3), Inches(0.7))
    p_b = tb_bot.text_frame.paragraphs[0]
    p_b.text = "🎯 Paradoxo de Frotas Terceirizadas: A universidade não pode modificar os veículos locados, mas precisa prestar contas do itinerário aos alunos em tempo real."
    p_b.font.name = "Arial"
    p_b.font.size = Pt(11.5)
    p_b.font.color.rgb = COLOR_SUCCESS

    add_speaker_notes(s3, "01:30 min | Apresente a dor orçamentária dos órgãos públicos: manter frotas com chips 4G dedicados gera custos de manutenção e burocracia licitatória contínuos. Lance a pergunta central de pesquisa.")

    # =========================================================================
    # SLIDE 4: Estado da Arte I — Sistemas AVL Tradicionais
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Estado da Arte I", "Sistemas AVL (Automatic Vehicle Location) Dedicados", 4)

    add_card(s4, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.4))
    tb_l4 = s4.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(5.0))
    tf_l4 = tb_l4.text_frame
    tf_l4.word_wrap = True

    p = tf_l4.paragraphs[0]
    p.text = "CONCEITO E OPERAÇÃO DOS SISTEMAS AVL"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    bullets_l4 = [
        "Hardware Embarcado Rígido: Módulos GPS veiculares acoplados a modems 4G/LTE com antenas externas na lataria.",
        "Integração com Bateria do Veículo: Ligação direta no chicote elétrico (12V/24V) e telemetria na porta OBD-II/CAN.",
        "Transmissão Ininterrupta: Envio contínuo de pacotes TCP/UDP para servidores centrais a taxas de 1 a 5 Hz.",
        "Autonomia Operacional: Funciona independentemente da presença de passageiros a bordo."
    ]
    for b in bullets_l4:
        p_b = tf_l4.add_paragraph()
        p_b.text = f"• {b}"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(11.5)
        p_b.font.color.rgb = COLOR_TEXT_MUTED
        p_b.space_before = Pt(10)

    add_card(s4, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    tb_r4 = s4.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(5.0))
    tf_r4 = tb_r4.text_frame
    tf_r4.word_wrap = True

    p = tf_r4.paragraphs[0]
    p.text = "VANTAGENS vs LIMITAÇÕES CRÍTICAS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    pros_cons = [
        ("Vantagem: Alta Precisão & Confiabilidade", "Dados contínuos de odometria, ignição e velocidade sem interrupções.", COLOR_SUCCESS),
        ("Gargalo 1: Custo Proibitivo de Aquisição", "Cada módulo comercial custa entre R$ 1.500 e R$ 2.500.", COLOR_AMBER),
        ("Gargalo 2: Custo Recorrente de Conectividade", "Planos de dados corporativos M2M oneram permanentemente o orçamento.", COLOR_AMBER),
        ("Gargalo 3: Inviabilidade em Ônibus Alugados", "Empresas locadoras proíbem corte de fiação e instalação invasiva.", COLOR_AMBER)
    ]
    for title, desc, col in pros_cons:
        p_t = tf_r4.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = col
        p_t.space_before = Pt(8)

        p_d = tf_r4.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    add_speaker_notes(s4, "01:30 min | Discorra sobre os sistemas AVL clássicos. Destaque que eles são excelentes para empresas privadas ricas, mas inviáveis para universidades públicas com contratos de locação de veículos sem alteração de fiação.")

    # =========================================================================
    # SLIDE 5: Estado da Arte II — Crowdsourcing Puro vs. Balizas BLE
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Estado da Arte II", "Crowdsourcing Comunitário Puro vs. Balizas BLE", 5)

    add_card(s5, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.4))
    tb_c5 = s5.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(5.0))
    tf_c5 = tb_c5.text_frame
    tf_c5.word_wrap = True

    p = tf_c5.paragraphs[0]
    p.text = "CROWDSOURCING PURO (Ex: Waze, Moovit)"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER

    points_cs = [
        "Vantagem Aparente: Custo zero de hardware adicional, aproveitando os smartphones da população.",
        "Falha do Falso Positivo (Pedestres): Alguém caminhando na calçada ou de bicicleta próximo à rota é erroneamente registrado como ônibus.",
        "Vulnerabilidade a GPS Spoofing: Aplicativos podem forjar coordenadas fictícias e corromper o feed de dados.",
        "Consumo de Bateria do Usuário: Rastreamento contínuo em primeiro e segundo plano sem controle dinâmico."
    ]
    for pt in points_cs:
        p_p = tf_c5.add_paragraph()
        p_p.text = f"• {pt}"
        p_p.font.name = "Arial"
        p_p.font.size = Pt(11.5)
        p_p.font.color.rgb = COLOR_TEXT_MUTED
        p_p.space_before = Pt(10)

    add_card(s5, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    tb_ble = s5.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(5.0))
    tf_ble = tb_ble.text_frame
    tf_ble.word_wrap = True

    p = tf_ble.paragraphs[0]
    p.text = "O PODER DO BLUETOOTH LOW ENERGY (BLE)"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    points_ble = [
        "Hardware Ultra-Econômico: Microcontrolador ESP32 operando como iBeacon custa menos de R$ 40,00.",
        "Alimentação Não-Invasiva: Plugado diretamente em qualquer carregador veicular USB 5V (consumo < 0.4W).",
        "Prova Criptográfica de Presença: Raio de alcance calibrado (6 a 8 metros com RSSI > -75 dBm) garante que apenas passageiros fisicamente dentro do salão transmitem.",
        "Imunidade Total a Pedestres: Quem está na calçada ou no ponto não ativa a transmissão."
    ]
    for pt in points_ble:
        p_p = tf_ble.add_paragraph()
        p_p.text = f"• {pt}"
        p_p.font.name = "Arial"
        p_p.font.size = Pt(11.5)
        p_p.font.color.rgb = COLOR_TEXT_MUTED
        p_p.space_before = Pt(10)

    add_speaker_notes(s5, "01:30 min | Contraponto fundamental do artigo: crowdsourcing puro falha por ruído de pedestres e spoofing. O BLE entra como âncora determinística de presença física a bordo, custando meros R$ 40 em uma porta USB comum.")

    # =========================================================================
    # SLIDE 6: A Lacuna Tecnológica (Tabela Comparativa de Decisão)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Lacuna Tecnológica", "Matriz Comparativa das Abordagens de Rastreamento", 6)

    rows = 7
    cols = 4
    left = Inches(0.8)
    top = Inches(1.5)
    width = Inches(11.7)
    height = Inches(4.5)

    table_shape = s6.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    table.columns[0].width = Inches(2.7)
    table.columns[1].width = Inches(3.0)
    table.columns[2].width = Inches(3.0)
    table.columns[3].width = Inches(3.0)

    table_data = [
        ["Critério de Engenharia", "AVL Comercial 4G", "Crowdsourcing Puro", "LocBUS (Nossa Proposta)"],
        ["Custo de Hardware", "R$ 1.500 - R$ 2.500", "R$ 0,00", "< R$ 40 (ESP32 USB)"],
        ["Mensalidade de Conectividade", "R$ 60 - R$ 120 / mês", "R$ 0,00", "R$ 0,00 (Conexão do Passageiro)"],
        ["Imunidade a Pedestres", "Total (100%)", "Baixa (Falsos Positivos)", "Determinística (RSSI > -75dBm)"],
        ["Resistência a Spoofing", "Alta", "Nula (Vulnerável)", "Alta (Clustering + Geofencing)"],
        ["Instalação no Veículo", "Invasiva (Fiação / CAN)", "Nenhuma", "Plug-and-play USB 5V"],
        ["Consumo de Bateria do App", "N/A", "Alto (GPS Constante)", "Otimizado (Δt = 4s intermitente)"]
    ]

    for r_idx, row in enumerate(table_data):
        for c_idx, cell_value in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = cell_value
            cell.fill.solid()
            p = cell.text_frame.paragraphs[0]
            p.font.name = "Arial"
            
            if r_idx == 0:
                cell.fill.fore_color.rgb = COLOR_CARD_BORDER
                p.font.bold = True
                p.font.size = Pt(11.5)
                p.font.color.rgb = COLOR_PRIMARY if c_idx == 3 else COLOR_TEXT_MAIN
            else:
                cell.fill.fore_color.rgb = COLOR_CARD
                p.font.size = Pt(10.5)
                if c_idx == 3:
                    p.font.bold = True
                    p.font.color.rgb = COLOR_SUCCESS
                elif c_idx == 1:
                    p.font.color.rgb = COLOR_AMBER if "R$" in cell_value or "Invasiva" in cell_value else COLOR_TEXT_MUTED
                else:
                    p.font.color.rgb = COLOR_TEXT_MUTED

    add_card(s6, Inches(0.8), Inches(6.2), Inches(11.7), Inches(0.8), bg_color=COLOR_CARD)
    tb_c6 = s6.shapes.add_textbox(Inches(1.0), Inches(6.25), Inches(11.3), Inches(0.7))
    p_v = tb_c6.text_frame.paragraphs[0]
    p_v.text = "💡 Síntese: O LocBUS une o custo zero de conectividade do crowdsourcing com o determinismo e a confiabilidade de um rastreador veicular dedicado."
    p_v.font.name = "Arial"
    p_v.font.size = Pt(12)
    p_v.font.bold = True
    p_v.font.color.rgb = COLOR_PRIMARY

    add_speaker_notes(s6, "01:30 min | Apresente a tabela comparativa. Passe ponto a ponto mostrando que o LocBUS entrega o melhor dos dois mundos: custo de hardware quase nulo sem abrir mão da precisão e segurança contra ruídos.")

    # =========================================================================
    # SLIDE 7: A Solução LocBUS (Telemetria Híbrida Simbiótica)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "A Solução LocBUS", "Telemetria Híbrida Simbiótica em 4 Etapas", 7)

    add_card(s7, Inches(0.8), Inches(1.5), Inches(6.8), Inches(5.4))
    tb_s7 = s7.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(6.4), Inches(5.0))
    tf_s7 = tb_s7.text_frame
    tf_s7.word_wrap = True

    steps = [
        ("1. Emissão de Beacon a Bordo", "O ESP32 alimentado na tomada USB do circular emite pacotes iBeacon BLE em intervalos de 500ms com UUID fixo e potência calibrada."),
        ("2. Detecção Automática pela PWA", "O passageiro abre a PWA. A API Web Bluetooth detecta o sinal de proximidade (RSSI > -75 dBm) e confirma o embarque real sem intervenção humana."),
        ("3. Transmissão Amortecida (Edge GNSS)", "O smartphone passa a transmitir suas coordenadas GNSS via HTTPS a cada 4 segundos, mitigando aquecimento e consumo de bateria."),
        ("4. Agregação e Streaming SSE", "A nuvem valida geofencing e velocidade, calcula o centróide ponderado dos passageiros e despacha a posição para o mapa via Server-Sent Events.")
    ]
    for i, (title, desc) in enumerate(steps):
        p_t = tf_s7.paragraphs[0] if i == 0 else tf_s7.add_paragraph()
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(12.5)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_PRIMARY
        if i > 0:
            p_t.space_before = Pt(10)

        p_d = tf_s7.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    add_card(s7, Inches(7.9), Inches(1.5), Inches(4.6), Inches(5.4))
    mobile_img = os.path.join(ASSETS_DIR, "mobile_interface_pwa.png")
    if os.path.exists(mobile_img):
        s7.shapes.add_picture(mobile_img, Inches(8.3), Inches(1.7), width=Inches(3.8))

    add_speaker_notes(s7, "01:30 min | Descreva a telemetria simbiótica. Mostre a imagem do smartphone à direita: o botão de 'A bordo' e a detecção de beacon automática. Explique o envio a cada 4 segundos como solução de baixo consumo de energia.")

    # =========================================================================
    # SLIDE 8: Requisitos de Engenharia (RFs e RNFs)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Engenharia de Software", "Requisitos Funcionais e Não-Funcionais da Plataforma", 8)

    add_card(s8, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.4))
    tb_rf = s8.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(5.0))
    tf_rf = tb_rf.text_frame
    tf_rf.word_wrap = True

    p = tf_rf.paragraphs[0]
    p.text = "REQUISITOS FUNCIONAIS (RF)"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    rfs = [
        ("RF01 - Prova Criptográfica BLE", "Autenticação determinística de embarque via beacon sem login cadastral."),
        ("RF02 - Geofencing Esférico (80m)", "Descarte instantâneo de coordenadas com desvio > 80m da rota viária."),
        ("RF03 - Filtro Cinemático de Velocidade", "Teto máximo de 65 km/h para expurgar telemetrias de veículos particulares."),
        ("RF04 - Centróide Ponderado por Acurácia", "Fusão de dados de múltiplos passageiros priorizando sensores mais precisos."),
        ("RF05 - Streaming Contínuo SSE", "Distribuição unidirecional em tempo real via HTTP para clientes web e mobile.")
    ]
    for code, desc in rfs:
        p_c = tf_rf.add_paragraph()
        p_c.text = f"• {code}"
        p_c.font.name = "Arial"
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = COLOR_TEXT_MAIN
        p_c.space_before = Pt(8)

        p_d = tf_rf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    add_card(s8, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    tb_rnf = s8.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(5.0))
    tf_rnf = tb_rnf.text_frame
    tf_rnf.word_wrap = True

    p = tf_rnf.paragraphs[0]
    p.text = "REQUISITOS NÃO-FUNCIONAIS (RNF)"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_SUCCESS

    rnfs = [
        ("RNF01 - Latência Extremo-a-Extremo < 500ms", "Propagação instantânea do evento de telemetria até a renderização no mapa."),
        ("RNF02 - Eficiência Energética de Bateria", "Envio intermitente controlado (Δt = 4s) sem drenagem prematura do aparelho."),
        ("RNF03 - Arquitetura PWA Sem Fricção", "Disponível diretamente pelo navegador sem exigência de download na Google Play / App Store."),
        ("RNF04 - Privacidade por Projeto (LGPD)", "Buffer exclusivamente em memória volátil com TTL (Time-to-Live); nenhum dado pessoal ou IP é persistido em disco.")
    ]
    for code, desc in rnfs:
        p_c = tf_rnf.add_paragraph()
        p_c.text = f"• {code}"
        p_c.font.name = "Arial"
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = COLOR_TEXT_MAIN
        p_c.space_before = Pt(8)

        p_d = tf_rnf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    add_speaker_notes(s8, "01:00 min | Apresente com objetividade os requisitos de engenharia. Destaque a conformidade com a LGPD: não há cadastro, não há senhas, e o buffer de memória descarta coordenadas com Time-to-Live.")

    # =========================================================================
    # SLIDE 9: Arquitetura Desacoplada em 4 Camadas
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Arquitetura do Sistema", "Pipeline de 4 Camadas Submetido ao IEEE", 9)

    add_card(s9, Inches(0.8), Inches(1.5), Inches(5.0), Inches(5.4))
    tb_l9 = s9.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(4.6), Inches(5.0))
    tf_l9 = tb_l9.text_frame
    tf_l9.word_wrap = True

    p = tf_l9.paragraphs[0]
    p.text = "FLUXO MULTICAMADAS DESACOPLADO"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    layers = [
        ("Camada 1: Veículo (ESP32 BLE)", "iBeacon de 0.4W conectado na tomada USB. Emissão a 2.4 GHz sem acesso a dados."),
        ("Camada 2: Borda (Smartphone PWA)", "Web Bluetooth API, W3C Geolocation e HTTPS assíncrono com ciclo de 4s."),
        ("Camada 3: Nuvem (FastAPI Core)", "Filtros de Geofencing Haversine, cálculo de centróides e broker SSE em memória."),
        ("Camada 4: Cliente (Leaflet.js)", "Renderização dinâmica de polilinhas, marcadores em tempo real e cálculo de ETA.")
    ]
    for name, desc in layers:
        p_n = tf_l9.add_paragraph()
        p_n.text = f"• {name}"
        p_n.font.name = "Arial"
        p_n.font.size = Pt(11)
        p_n.font.bold = True
        p_n.font.color.rgb = COLOR_TEXT_MAIN
        p_n.space_before = Pt(10)

        p_d = tf_l9.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    add_card(s9, Inches(6.1), Inches(1.5), Inches(6.4), Inches(5.4))
    diag_img = os.path.join(ASSETS_DIR, "fig1_arquitetura.png")
    if os.path.exists(diag_img):
        s9.shapes.add_picture(diag_img, Inches(6.3), Inches(1.7), width=Inches(6.0))

    add_speaker_notes(s9, "01:30 min | Apresente a Figura 1 do artigo. Mostre o fluxo em 4 camadas: do beacon físico no ônibus até o mapa do usuário na parada. Destaque o desacoplamento de responsabilidades e a elegância da arquitetura reativa.")

    # =========================================================================
    # SLIDE 10: Modelagem Matemática & Algoritmos
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Modelagem Algorítmica", "Filtragem Cinemática e Centróide Ponderado por Acurácia", 10)

    add_card(s10, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.4))
    tb_m1 = s10.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(5.0))
    tf_m1 = tb_m1.text_frame
    tf_m1.word_wrap = True

    p = tf_m1.paragraphs[0]
    p.text = "1. GEOFENCING HAVERSINE DA ROTA"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    m1_points = [
        "Fórmula Esférica da Distância:",
        "a = sen²(Δφ/2) + cos(φ₁) · cos(φ₂) · sen²(Δλ/2)",
        "d = 2 · R · atan2(√a, √(1−a))",
        "Regra de Decisão do Backend:",
        "Se min(d(P_k, Rota)) > 80 metros -> Pacote descartado por anomalia de trajetória.",
        "Se V_k > 65 km/h -> Descarte imediato (imunidade a carros e motos particulares ultrapassando o ônibus)."
    ]
    for pt in m1_points:
        p_pt = tf_m1.add_paragraph()
        p_pt.text = pt
        p_pt.font.name = "Arial"
        if "a =" in pt or "d =" in pt:
            p_pt.font.bold = True
            p_pt.font.size = Pt(12)
            p_pt.font.color.rgb = COLOR_SUCCESS
        elif "Se" in pt:
            p_pt.font.size = Pt(10.5)
            p_pt.font.color.rgb = COLOR_TEXT_MUTED
        else:
            p_pt.font.size = Pt(11)
            p_pt.font.bold = True
            p_pt.font.color.rgb = COLOR_TEXT_MAIN
        p_pt.space_before = Pt(6)

    add_card(s10, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    tb_m2 = s10.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(5.0))
    tf_m2 = tb_m2.text_frame
    tf_m2.word_wrap = True

    p = tf_m2.paragraphs[0]
    p.text = "2. FUSÃO SENSORIAL POR ACURÁCIA INVERSA"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    m2_points = [
        "Cálculo do Peso de Cada Smartphone:",
        "w_k = 1 / max(σ_k, 1.0)",
        "Posição Final do Ônibus (Centróide):",
        "X_bus = ( Σ w_k · X_k ) / ( Σ w_k )",
        "Poder Prático da Equação:",
        "Um aparelho topo de linha com acurácia de 3 metros recebe peso w = 0.33.",
        "Um celular básico com precisão degradada de 20 metros recebe peso w = 0.05.",
        "Resultado: O sinal de maior qualidade domina o centróide com 6.6x mais peso matemático."
    ]
    for pt in m2_points:
        p_pt = tf_m2.add_paragraph()
        p_pt.text = pt
        p_pt.font.name = "Arial"
        if "w_k =" in pt or "X_bus =" in pt:
            p_pt.font.bold = True
            p_pt.font.size = Pt(12.5)
            p_pt.font.color.rgb = COLOR_PRIMARY
        elif "Um" in pt or "Resultado:" in pt:
            p_pt.font.size = Pt(10.5)
            p_pt.font.color.rgb = COLOR_TEXT_MUTED
        else:
            p_pt.font.size = Pt(11)
            p_pt.font.bold = True
            p_pt.font.color.rgb = COLOR_TEXT_MAIN
        p_pt.space_before = Pt(6)

    add_speaker_notes(s10, "01:15 min | Explique a beleza matemática: o algoritmo trata as variações dos sensores dos celulares de forma elegante, atribuindo 6.6 vezes mais peso a um sinal com precisão de 3m do que a um com 20m. A fórmula Haversine descarta quem está fora da rua do ônibus.")

    # =========================================================================
    # SLIDE 11: Resultados da PoC e Teste de Campo em Vias Reais
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Resultados Experimentais", "Validação em Bancada e Teste de Campo em Vias Públicas", 11)

    add_card(s11, Inches(0.8), Inches(1.4), Inches(11.7), Inches(0.9), bg_color=COLOR_CARD)
    tb_stat = s11.shapes.add_textbox(Inches(1.0), Inches(1.45), Inches(11.3), Inches(0.8))
    p_s = tb_stat.text_frame.paragraphs[0]
    p_s.text = "✅ 24 Testes Unitários & Integração (100% OK)   •   Simulação 31 Waypoints CCHLA <-> CI   •   Latência Média: ~220 ms"
    p_s.font.name = "Arial"
    p_s.font.size = Pt(13)
    p_s.font.bold = True
    p_s.font.color.rgb = COLOR_SUCCESS

    add_card(s11, Inches(0.8), Inches(2.45), Inches(5.6), Inches(4.5))
    desk_img = os.path.join(ASSETS_DIR, "desktop_mapa_ao_vivo.png")
    if os.path.exists(desk_img):
        s11.shapes.add_picture(desk_img, Inches(0.9), Inches(2.55), width=Inches(5.4))

    add_card(s11, Inches(6.8), Inches(2.45), Inches(5.7), Inches(4.5))
    field_img = os.path.join(ASSETS_DIR, "validacao_campo_telemetria.png")
    if os.path.exists(field_img):
        s11.shapes.add_picture(field_img, Inches(7.0), Inches(2.55), width=Inches(5.3))

    add_speaker_notes(s11, "01:00 min | Apresente as duas evidências concretas: à esquerda, o mapa em tempo real operando com a rota oficial UFPB e 24 testes automatizados 100% aprovados. À direita, a comprovação do teste de campo em movimento em vias públicas com latência de ~220 ms.")

    # =========================================================================
    # SLIDE 12: Conclusão & Próximos Passos
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Conclusão & Futuro", "Impacto da Engenharia Frugal e Próximos Passos", 12)

    add_card(s12, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.4))
    tb_c12 = s12.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(5.0))
    tf_c12 = tb_c12.text_frame
    tf_c12.word_wrap = True

    p = tf_c12.paragraphs[0]
    p.text = "CONTRIBUIÇÕES PRINCIPAIS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    contribs = [
        "Viabilidade Técnica Comprovada: Rastreamento em nível de produção sem custos com contratos de operadoras celulares nos veículos.",
        "Engenharia Frugal Acessível: Um hardware de menos de R$ 40 viabiliza a modernização do transporte de qualquer instituição de ensino pública.",
        "Privacidade Rigorosa por Projeto: Zero armazenamento de dados de passageiros, cumprindo integralmente a LGPD.",
        "Experiência Map-First: Solução PWA instantânea que remove a barreira de instalação de aplicativos pesados."
    ]
    for c in contribs:
        p_c = tf_c12.add_paragraph()
        p_c.text = f"• {c}"
        p_c.font.name = "Arial"
        p_c.font.size = Pt(11)
        p_c.font.color.rgb = COLOR_TEXT_MUTED
        p_c.space_before = Pt(10)

    add_card(s12, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    tb_rd = s12.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(5.0))
    tf_rd = tb_rd.text_frame
    tf_rd.word_wrap = True

    p = tf_rd.paragraphs[0]
    p.text = "ROADMAP & PRÓXIMOS PASSOS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_SUCCESS

    steps_rd = [
        ("Fase 1: Piloto Físico no Circular UFPB", "Instalação definitiva das balizas USB nos circulares ativos de João Pessoa."),
        ("Fase 2: Validação Discente em Massa", "Adoção pelos discentes e servidores do Centro de Informática e Campus I."),
        ("Fase 3: ETA Inteligente Preditivo", "Integração de modelo de aprendizado de máquina treinado no histórico de tráfego dos Bancários."),
        ("Agradecimentos", "Agradecemos à UFPB, aos avaliadores do IEEE Latin America Transactions e abrimos a sessão para perguntas da banca.")
    ]
    for title, desc in steps_rd:
        p_t = tf_rd.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_MAIN
        p_t.space_before = Pt(8)

        p_d = tf_rd.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    add_speaker_notes(s12, "00:45 min | Feche com firmeza reiterando o compromisso social e científico da engenharia frugal. Agradeça à banca examinadora e coloque-se à disposição para os questionamentos técnicos.")

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    prs.save(OUTPUT_PATH)
    print(f"SUCESSO: Apresentacao gerada em: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
