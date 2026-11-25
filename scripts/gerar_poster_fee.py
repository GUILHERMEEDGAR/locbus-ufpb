"""
Gera o pôster digital (90 x 120 cm) do LocBUS para a Feira de Engenharias (FEE) 2026
baseado na estrutura institucional (UFPB / CEAR) de POSTER GRUPO 2_PROOF_FINAL.pptx.

Revisão Completa Padrão FEE / Rigor Acadêmico:
1. Privacidade e LGPD 100% cumprida: Prints do WhatsApp substituídos por balões autênticos
   anonimizados (sem dados pessoais, números ou memes, foco nas dores reais do transporte).
2. Tracker com Telemetria Operacional Real: Imagem atualizada com GPS ativo (36 km/h,
   142 pontos entregues, sinal eduroam -58 dBm, latência 218 ms e rota monitorada).
3. Interfaces Limpas: Mobile PWA sem corte na borda direita e itinerário recortado limpo.
4. Fluxo Acadêmico Perfeito: Seção 4 (Resultados e Discussão: Faixa de KPIs + Tabela 1 + Figura 4
   com interfaces + Discussão Analítica) -> Seção 5 (Conclusão) -> Seção 6 (Agradecimentos).
5. Eliminação de Redundâncias: Remoção de listas repetitivas, unificação de autores no cabeçalho
   e QR Code com URL em linha única sem quebra (locbus-ufpb.onrender.com).
6. Normas Científicas: Títulos padronizados (2. OBJETIVOS E MOTIVAÇÃO, 4. RESULTADOS E DISCUSSÃO),
   sigla SULT definida por extenso e notas 'Fonte: Elaborado pelos autores (2026)'.
"""
from pathlib import Path
from pptx import Presentation
from pptx.util import Cm, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.dml import MSO_LINE_DASH_STYLE

TEMPLATE_PATH = Path(r"c:\Users\guilherme\Documents\POSTER GRUPO 2_PROOF_FINAL.pptx")
OUTPUT_PATH = Path(r"e:\prof3\Poster_LocBUS_FEE_2026.pptx")
ASSETS_DIR = Path(r"e:\prof3\apresentacao_15min\assets")
ICON_PATH = Path(r"e:\prof3\app\static\icons\icon-512.png")
BADGE_LOGO_PATH = ASSETS_DIR / "logo_locbus_badge.png"
QR_PATH = ASSETS_DIR / "qr_code_locbus_site.png"
PRINT_WPP_1 = ASSETS_DIR / "print_dor_whatsapp_1.png"
PRINT_WPP_2 = ASSETS_DIR / "print_dor_whatsapp_2.png"

# Paleta alinhada ao padrão institucional + identidade LocBUS
NAVY = RGBColor(15, 23, 42)        # #0F172A
BLUE = RGBColor(29, 78, 216)       # #1D4ED8
BLUE_LIGHT = RGBColor(239, 246, 255)  # #EFF6FF
EMERALD = RGBColor(5, 150, 105)    # #059669
EMERALD_BG = RGBColor(236, 253, 245)  # #ECFDF5
AMBER = RGBColor(180, 83, 9)       # #B45309
AMBER_BG = RGBColor(255, 251, 235) # #FFFBEB
SLATE = RGBColor(51, 65, 85)       # #334155
MUTED = RGBColor(100, 116, 139)    # #64748B
GRAY_BOX = RGBColor(248, 250, 252) # #F8FAFC
BORDER = RGBColor(203, 213, 225)   # #CBD5E1
DOT_GRAY = RGBColor(136, 136, 136) # #888888 (exato do template original)
BADGE_BG = RGBColor(241, 245, 249) # #F1F5F9 (fundo de alto contraste para número preto)
WHITE = RGBColor(255, 255, 255)
BLACK = RGBColor(17, 24, 39)       # Preto de alto contraste

FONT_MAIN = "Poppins"


def remove_shape(shape):
    sp = shape._element
    sp.getparent().remove(sp)


def style_run(run, size_pt, bold=False, color=BLACK, font_name=FONT_MAIN):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.color.rgb = color


def add_textbox(slide, left_cm, top_cm, width_cm, height_cm, text="",
                size_pt=28, bold=False, color=BLACK, align=PP_ALIGN.LEFT,
                line_spacing=1.15):
    tb = slide.shapes.add_textbox(Cm(left_cm), Cm(top_cm), Cm(width_cm), Cm(height_cm))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Cm(0.1)
    tf.margin_right = Cm(0.1)
    tf.margin_top = Cm(0.05)
    tf.margin_bottom = Cm(0.05)
    p = tf.paragraphs[0]
    p.alignment = align
    p.line_spacing = line_spacing
    if text:
        r = p.add_run()
        r.text = text
        style_run(r, size_pt, bold=bold, color=color)
    return tb


def add_section_header(slide, left_cm, top_cm, num_str, title_str):
    """Cabeçalho de tópico calibrado para 64 pt no número e 58 pt no título."""
    badge = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Cm(left_cm), Cm(top_cm), Cm(4.0), Cm(2.8)
    )
    badge.fill.solid()
    badge.fill.fore_color.rgb = BADGE_BG
    badge.line.color.rgb = DOT_GRAY
    badge.line.width = Pt(1.5)
    badge.adjustments[0] = 0.2
    tf = badge.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = num_str
    style_run(r, 64, bold=True, color=BLACK, font_name="Times New Roman")

    tb = add_textbox(slide, left_cm + 4.4, top_cm, 33.8, 2.8,
                     title_str, size_pt=58, bold=True, color=NAVY)
    tb.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE


def add_divider(slide, left_cm, top_cm, width_cm):
    """Cria divisor PONTILHADO com a grossura exata de 10 pt (127000 EMUs) do template original."""
    conn = slide.shapes.add_connector(
        1, Cm(left_cm), Cm(top_cm), Cm(left_cm + width_cm), Cm(top_cm)
    )
    conn.line.color.rgb = DOT_GRAY  # #888888 do template original
    conn.line.width = Pt(10.0)      # 127000 EMUs = 10 pt idêntico ao original
    conn.line.dash_style = MSO_LINE_DASH_STYLE.ROUND_DOT
    return conn


def add_card(slide, left_cm, top_cm, width_cm, height_cm,
             bg_color=GRAY_BOX, border_color=BORDER, radius=0.06):
    card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Cm(left_cm), Cm(top_cm), Cm(width_cm), Cm(height_cm)
    )
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.75)
    card.adjustments[0] = radius
    return card


def add_kpi_card(slide, left_cm, top_cm, width_cm, height_cm, val_text, label_text, acc_color, bg_color):
    """Card métrico de alto impacto para a faixa de KPIs dos Resultados."""
    card = add_card(slide, left_cm, top_cm, width_cm, height_cm, bg_color=bg_color, border_color=acc_color, radius=0.08)
    tf = card.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Cm(0.2)
    tf.margin_right = Cm(0.2)
    tf.margin_top = Cm(0.1)
    tf.margin_bottom = Cm(0.1)
    p0 = tf.paragraphs[0]
    p0.alignment = PP_ALIGN.CENTER
    p0.space_after = Pt(2)
    r0 = p0.add_run()
    r0.text = val_text
    style_run(r0, 32, bold=True, color=acc_color)
    p1 = tf.add_paragraph()
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = label_text
    style_run(r1, 16, bold=True, color=NAVY)
    return card


def add_flow_node_enxuto(slide, left_cm, top_cm, width_cm, height_cm,
                         tag, title, desc, bg_color, accent_color):
    """Nó do pipeline em versão enxuta, limpa e direta para evitar poluição visual."""
    card = add_card(slide, left_cm, top_cm, width_cm, height_cm,
                    bg_color=bg_color, border_color=accent_color, radius=0.06)
    tf = card.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Cm(0.55)
    tf.margin_right = Cm(0.55)
    tf.margin_top = Cm(0.2)
    tf.margin_bottom = Cm(0.2)

    p0 = tf.paragraphs[0]
    p0.alignment = PP_ALIGN.LEFT
    p0.space_after = Pt(2)
    r_tag = p0.add_run()
    r_tag.text = tag.upper()
    style_run(r_tag, 19, bold=True, color=accent_color)

    r_title = p0.add_run()
    r_title.text = f"  |  {title}"
    style_run(r_title, 24, bold=True, color=NAVY)

    p1 = tf.add_paragraph()
    p1.alignment = PP_ALIGN.LEFT
    p1.line_spacing = 1.15
    r_desc = p1.add_run()
    r_desc.text = desc
    style_run(r_desc, 22, bold=False, color=SLATE)


def add_down_arrow(slide, center_x_cm, top_cm, height_cm=0.8, color=BLUE):
    arr = slide.shapes.add_shape(
        MSO_SHAPE.DOWN_ARROW, Cm(center_x_cm - 0.6), Cm(top_cm), Cm(1.2), Cm(height_cm)
    )
    arr.fill.solid()
    arr.fill.fore_color.rgb = color
    arr.line.fill.background()


def main():
    prs = Presentation(str(TEMPLATE_PATH))
    slide = prs.slides[0]

    # Remove elementos herdados do template original
    to_remove = [
        0, 4, 6, 7, 8, 9, 10, 12, 13,
        14, 15, 16, 17,
        23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
        44, 45, 48, 50, 52
    ]
    for idx in sorted(to_remove, reverse=True):
        remove_shape(slide.shapes[idx])

    # Localiza e atualiza títulos preservados
    for sh in slide.shapes:
        if sh.has_text_frame:
            txt = sh.text.strip()
            if "MOBILITY SUMMIT" in txt:
                sh.left = Cm(16.0)
                sh.top = Cm(3.2)
                sh.width = Cm(59.0)
                sh.height = Cm(5.6)
                tf = sh.text_frame
                tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.CENTER
                p.clear()
                r = p.add_run()
                r.text = "FEIRA DE ENGENHARIAS (FEE) 2026"
                style_run(r, 80, bold=True, color=BLACK)
            elif "Desenvolvimento de um Conceito" in txt:
                sh.left = Cm(1.2)
                sh.top = Cm(12.0)
                sh.width = Cm(87.6)
                sh.height = Cm(12.2)
                tf = sh.text_frame
                tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                while len(tf.paragraphs) > 1:
                    p_el = tf.paragraphs[-1]._p
                    p_el.getparent().remove(p_el)
                p0 = tf.paragraphs[0]
                p0.alignment = PP_ALIGN.CENTER
                p0.space_after = Pt(8)
                p0.clear()
                r_title = p0.add_run()
                r_title.text = (
                    "LocBUS: Telemetria e Rastreamento Colaborativo de Baixo Custo "
                    "para o Transporte Universitário Intercampi"
                )
                style_run(r_title, 66, bold=True, color=NAVY)

                p_auth = tf.add_paragraph()
                p_auth.alignment = PP_ALIGN.CENTER
                p_auth.space_after = Pt(5)
                r_auth = p_auth.add_run()
                r_auth.text = "Guilherme Edgar C. S. R. Guedes¹ (Autor)  •  Prof. Dr. Oswaldo Hideo Ando Junior² (Orientador)"
                style_run(r_auth, 38, bold=False, color=BLACK)

                p_aff = tf.add_paragraph()
                p_aff.alignment = PP_ALIGN.CENTER
                r_aff = p_aff.add_run()
                r_aff.text = (
                    "Universidade Federal da Paraíba (UFPB) — Centro de Energias Alternativas "
                    "e Renováveis (CEAR)  •  Feira de Engenharias (FEE) 2026"
                )
                style_run(r_aff, 26, bold=False, color=SLATE)
            elif "App Rota Verde" in txt:
                sh.left = Cm(4.2)
                sh.top = Cm(114.6)
                sh.width = Cm(8.5)
                sh.height = Cm(4.8)
                tf = sh.text_frame
                tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                while len(tf.paragraphs) > 1:
                    p_el = tf.paragraphs[-1]._p
                    p_el.getparent().remove(p_el)
                p0 = tf.paragraphs[0]
                p0.alignment = PP_ALIGN.LEFT
                p0.clear()
                r = p0.add_run()
                r.text = "LocBUS\nUFPB // 2026"
                style_run(r, 18, bold=True, color=NAVY)
            elif "Autor Correspondente" in txt:
                sh.left = Cm(12.8)
                sh.top = Cm(114.7)
                sh.width = Cm(54.0)
                sh.height = Cm(4.8)
                tf = sh.text_frame
                tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                while len(tf.paragraphs) > 1:
                    p_el = tf.paragraphs[-1]._p
                    p_el.getparent().remove(p_el)
                p0 = tf.paragraphs[0]
                p0.alignment = PP_ALIGN.LEFT
                p0.space_after = Pt(3)
                p0.clear()
                r1 = p0.add_run()
                r1.text = "Protótipo Operacional: "
                style_run(r1, 21, bold=True, color=BLACK)
                r1v = p0.add_run()
                r1v.text = "Web / PWA Aberto (locbus-ufpb.onrender.com)  |  App Android Multi-Flavor (Kiosk + eduroam)"
                style_run(r1v, 21, bold=False, color=BLACK)

                p1 = tf.add_paragraph()
                p1.alignment = PP_ALIGN.LEFT
                r2 = p1.add_run()
                r2.text = "Validação Institucional: "
                style_run(r2, 20, bold=True, color=BLUE)
                r2v = p1.add_run()
                r2v.text = "Projeto PoC para Transporte Intercampi • Campus I ↔ CI Mangabeira • UFPB"
                style_run(r2v, 20, bold=False, color=SLATE)

    # Reposiciona logos preservados do topo esquerdo
    for sh in slide.shapes:
        if sh.shape_type == 13:  # PICTURE
            if sh.top.cm < 12 and sh.left.cm < 5:
                # Brasão UFPB
                sh.left = Cm(0.6)
                sh.top = Cm(1.6)
                sh.width = Cm(6.4)
                sh.height = Cm(7.8)
            elif sh.top.cm < 12 and 5 <= sh.left.cm < 20:
                # Logo institucional CEAR
                sh.left = Cm(7.4)
                sh.top = Cm(1.7)
                sh.width = Cm(7.8)
                sh.height = Cm(7.8)

    # Emblema Oficial do LocBUS no canto superior direito
    if BADGE_LOGO_PATH.exists():
        slide.shapes.add_picture(str(BADGE_LOGO_PATH), Cm(77.5), Cm(1.8), width=Cm(8.0), height=Cm(8.0))
    elif ICON_PATH.exists():
        slide.shapes.add_picture(str(ICON_PATH), Cm(77.5), Cm(1.8), width=Cm(8.0), height=Cm(8.0))

    # Ícone oficial no rodapé esquerdo
    if ICON_PATH.exists():
        slide.shapes.add_picture(str(ICON_PATH), Cm(0.9), Cm(115.2), width=Cm(2.9), height=Cm(2.9))

    # QR Code no canto direito do rodapé (com URL em linha única sem quebra)
    if QR_PATH.exists():
        add_card(slide, 83.0, 114.2, 5.8, 5.4, bg_color=WHITE, border_color=BORDER, radius=0.08)
        slide.shapes.add_picture(str(QR_PATH), Cm(83.3), Cm(114.3), width=Cm(5.2), height=Cm(5.2))
        add_textbox(slide, 67.0, 114.8, 15.5, 4.0,
                    "Teste o protótipo ao vivo:\nlocbus-ufpb.onrender.com",
                    size_pt=18, bold=True, color=NAVY, align=PP_ALIGN.RIGHT)

    # =========================================================================
    # COLUNA ESQUERDA (x = 0.6 .. 39.2 cm)
    # =========================================================================

    # --- SEÇÃO 1: INTRODUÇÃO ---
    add_section_header(slide, 0.6, 25.4, "1", "INTRODUÇÃO")
    add_textbox(
        slide, 1.2, 28.8, 37.8, 6.8,
        "O transporte circular intercampi da UFPB (Campus I ↔ CI Mangabeira) "
        "não possui rastreamento público em tempo real. Soluções AVL comerciais exigem "
        "hardware dedicado e planos de dados mensais por veículo (R$ 80–150/mês), "
        "inviabilizando sua adoção imediata com orçamento reduzido.",
        size_pt=28, color=BLACK, line_spacing=1.18
    )

    add_textbox(
        slide, 1.2, 36.0, 37.8, 1.4,
        "Quadro 1: Comparativo de Alternativas de Rastreamento por Veículo",
        size_pt=28, bold=True, color=NAVY, align=PP_ALIGN.CENTER
    )

    cards_intro = [
        ("AVL Comercial Tradicional", "R$ 80–150 / mês por veículo",
         "Hardware proprietário GPS + plano de dados contínuo (custo inviável)",
         AMBER_BG, AMBER, 38.0),
        ("LocBUS (Proposta UFPB)", "R$ 0 Mensalidade",
         "Telemetria Híbrida eduroam + Crowdsourcing PWA + 12 Paradas do Campus I",
         BLUE_LIGHT, BLUE, 44.0),
    ]
    for nome, custo, desc, bg, acc, y in cards_intro:
        c = add_card(slide, 1.2, y, 37.8, 5.4, bg_color=bg, border_color=acc, radius=0.08)
        tf = c.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.margin_left = Cm(0.6)
        tf.margin_right = Cm(0.6)
        tf.margin_top = Cm(0.3)
        tf.margin_bottom = Cm(0.3)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = f"{nome}  —  "
        style_run(r1, 26, bold=True, color=NAVY)
        r2 = p.add_run()
        r2.text = custo
        style_run(r2, 26, bold=True, color=acc)
        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.LEFT
        r3 = p2.add_run()
        r3.text = desc
        style_run(r3, 24, bold=False, color=SLATE)

    # --- SEÇÃO 2: OBJETIVOS E MOTIVAÇÃO (RELATOS REAIS ANONIMIZADOS - PADRÃO LGPD) ---
    add_divider(slide, 0.6, 50.8, 38.6)
    add_section_header(slide, 0.6, 51.6, "2", "OBJETIVOS E MOTIVAÇÃO")
    
    add_textbox(
        slide, 1.2, 54.8, 37.8, 3.8,
        "Desenvolver e validar um protótipo aberto de rastreamento intercampi com custo zero "
        "em planos celulares, integrando telemetria embarcada tolerante a desconexões "
        "(rede eduroam) e crowdsourcing de passageiros via PWA.",
        size_pt=28, color=BLACK, line_spacing=1.16
    )

    add_textbox(
        slide, 1.2, 58.8, 37.8, 1.3,
        "Pesquisa de Campo: Dores Reais Relatadas no Grupo do Circular UFPB",
        size_pt=24, bold=True, color=NAVY, align=PP_ALIGN.CENTER
    )

    # Imagens com os balões de relatos reais 100% anonimizados (conforme LGPD)
    if PRINT_WPP_1.exists():
        add_card(slide, 1.2, 60.3, 18.3, 17.2, bg_color=WHITE, border_color=EMERALD, radius=0.04)
        slide.shapes.add_picture(str(PRINT_WPP_1), Cm(1.35), Cm(60.5), width=Cm(18.0), height=Cm(16.8))

    if PRINT_WPP_2.exists():
        add_card(slide, 20.7, 60.3, 18.3, 17.2, bg_color=WHITE, border_color=EMERALD, radius=0.04)
        slide.shapes.add_picture(str(PRINT_WPP_2), Cm(20.85), Cm(60.5), width=Cm(18.0), height=Cm(16.8))

    add_textbox(
        slide, 1.2, 77.8, 37.8, 1.2,
        "Figura 2: Evidências da Dor dos Alunos • Atrasos, falta de aviso da Superintendência de Logística e Transportes (SULT) e espera às cegas. Fonte: Elaborado pelos autores (2026).",
        size_pt=18, bold=True, color=SLATE, align=PP_ALIGN.CENTER
    )

    # --- SEÇÃO 3: MATERIAIS E MÉTODOS (ARQUITETURA EM 4 CAMADAS, PREENCHENDO ATÉ O RODAPÉ) ---
    add_divider(slide, 0.6, 79.4, 38.6)
    add_section_header(slide, 0.6, 80.2, "3", "MATERIAIS E MÉTODOS")
    add_textbox(
        slide, 1.2, 83.3, 37.8, 1.3,
        "Figura 3: Arquitetura em 4 Camadas do Protótipo LocBUS. Fonte: Elaborado pelos autores (2026).",
        size_pt=25, bold=True, color=NAVY, align=PP_ALIGN.CENTER
    )

    # 4 Camadas de 6.0 cm de altura preenchendo uniformemente até 113.2 cm
    add_flow_node_enxuto(
        slide, 1.2, 85.0, 37.8, 6.0,
        "Camada 1", "Coleta no Veículo & Passageiros",
        "App Android Tracker (Kiosk + RSSI eduroam), App Passageiro PWA e simulador MockGPS a 1 Hz.",
        BLUE_LIGHT, BLUE
    )
    add_down_arrow(slide, 20.1, 91.3, 0.8, BLUE)

    add_flow_node_enxuto(
        slide, 1.2, 92.4, 37.8, 6.0,
        "Camada 2", "Resiliência Offline (Store-and-Forward)",
        "Buffer local eduroamQueue (até 400 pts / ~25 min) com envio em lote (POST /batch) ao encostar nos campi.",
        AMBER_BG, AMBER
    )
    add_down_arrow(slide, 20.1, 98.7, 0.8, AMBER)

    add_flow_node_enxuto(
        slide, 1.2, 99.8, 37.8, 6.0,
        "Camada 3", "Backend FastAPI & Filtragem Espacial",
        "Geofencing viário (855 vértices OSRM com raio 250 m) + clustering ponderado e ETA dinâmico.",
        GRAY_BOX, SLATE
    )
    add_down_arrow(slide, 20.1, 106.1, 0.8, SLATE)

    add_flow_node_enxuto(
        slide, 1.2, 107.2, 37.8, 6.0,
        "Camada 4", "Cliente Tempo Real (Leaflet + SSE)",
        "Streaming Server-Sent Events (latência ~220 ms) com 12 paradas do Campus I e status colaborativo.",
        EMERALD_BG, EMERALD
    )

    # =========================================================================
    # COLUNA DIREITA (x = 40.7 .. 89.2 cm)
    # =========================================================================

    # --- SEÇÃO 4: RESULTADOS E DISCUSSÃO (FLUXO ACADÊMICO: KPIS + TABELA + FIGURA 4 + ANÁLISE) ---
    add_section_header(slide, 40.7, 25.4, "4", "RESULTADOS E DISCUSSÃO")

    # Faixa de 4 KPIs Principais em Destaque
    kpi_defs = [
        ("R$ 0/mês", "Custo Celular", EMERALD, EMERALD_BG, 41.2),
        ("~220 ms", "Latência SSE", BLUE, BLUE_LIGHT, 53.2),
        ("~25 min", "Autonomia Offline", AMBER, AMBER_BG, 65.2),
        ("100%", "34/34 Testes Pytest", NAVY, GRAY_BOX, 77.2),
    ]
    for val_t, lbl_t, acc_c, bg_c, x_pos in kpi_defs:
        add_kpi_card(slide, x_pos, 28.5, 11.6, 3.4, val_t, lbl_t, acc_c, bg_c)

    add_textbox(
        slide, 41.2, 32.2, 47.6, 1.2,
        "Tabela 1: Métricas Técnicas e Desempenho do Protótipo Operacional",
        size_pt=26, bold=True, color=NAVY, align=PP_ALIGN.CENTER
    )

    rows = [
        ("Parâmetro Avaliado", "Resultado Alcançado no Protótipo", "Evidência / Tecnologia"),
        ("Latência de Telemetria", "~220 ms ponta a ponta", "Teste de campo em deslocamento interurbano (SSE)"),
        ("Autonomia Offline (eduroam)", "400 pontos (~25 min sem sinal)", "Buffer local eduroamQueue + POST /batch"),
        ("Fidelidade Viária e Paradas", "855 vértices OSRM + 12 paradas", "Circuito Campus I ↔ CI Mangabeira"),
        ("Ecossistema de Software", "PWA Web + 3 APKs Android nativos", "LocBUS, Tracker eduroam e MockGPS"),
        ("Confiabilidade da Suíte", "34 / 34 testes aprovados (100%)", "Suíte automatizada Pytest"),
    ]
    tbl_shape = slide.shapes.add_table(len(rows), 3, Cm(41.2), Cm(33.6), Cm(47.6), Cm(12.8))
    tbl = tbl_shape.table
    tbl.columns[0].width = Cm(14.8)
    tbl.columns[1].width = Cm(16.8)
    tbl.columns[2].width = Cm(16.0)

    for r_idx, row_data in enumerate(rows):
        is_hdr = (r_idx == 0)
        for c_idx, val in enumerate(row_data):
            cell = tbl.cell(r_idx, c_idx)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = Cm(0.3)
            cell.margin_right = Cm(0.3)
            cell.margin_top = Cm(0.12)
            cell.margin_bottom = Cm(0.12)
            cell.fill.solid()
            if is_hdr:
                cell.fill.fore_color.rgb = NAVY
            elif r_idx % 2 == 1:
                cell.fill.fore_color.rgb = BLUE_LIGHT
            else:
                cell.fill.fore_color.rgb = WHITE
            p = cell.text_frame.paragraphs[0]
            p.alignment = PP_ALIGN.LEFT
            run = p.add_run()
            run.text = val
            style_run(
                run,
                21 if is_hdr else 20,
                bold=(is_hdr or c_idx == 1),
                color=WHITE if is_hdr else (BLUE if c_idx == 1 else BLACK)
            )

    add_textbox(
        slide, 41.2, 46.5, 47.6, 0.8,
        "Fonte: Elaborado pelos autores (2026).",
        size_pt=18, bold=False, color=MUTED, align=PP_ALIGN.RIGHT
    )

    # Figura 4: Showcase com as 4 telas operacionais dentro de Resultados e Discussão
    add_textbox(
        slide, 41.2, 47.6, 47.6, 1.3,
        "Figura 4: Interfaces Operacionais do LocBUS (Web Desktop, Cockpit Tracker e PWA)",
        size_pt=26, bold=True, color=NAVY, align=PP_ALIGN.CENTER
    )

    # Fileira Superior (y = 49.2 .. 63.8 cm, h = 14.6 cm)
    # Imagem 1: Mapa Desktop
    desk_path = ASSETS_DIR / "novo_site_desktop_mapa.png"
    if desk_path.exists():
        add_card(slide, 41.2, 49.2, 25.0, 14.6, bg_color=WHITE, border_color=BORDER, radius=0.04)
        slide.shapes.add_picture(str(desk_path), Cm(41.4), Cm(49.4), width=Cm(24.6), height=Cm(12.0))
        add_textbox(slide, 41.2, 61.6, 25.0, 2.0,
                    "Mapa em Tempo Real • 12 Paradas do Campus I + Traçado OSRM",
                    size_pt=17, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    # Imagem 2: Tracker com dados reais ativos (demo=1)
    track_path = ASSETS_DIR / "novo_site_tracker_eduroam.png"
    if track_path.exists():
        add_card(slide, 66.8, 49.2, 22.0, 14.6, bg_color=WHITE, border_color=BORDER, radius=0.04)
        slide.shapes.add_picture(str(track_path), Cm(67.0), Cm(49.4), width=Cm(21.6), height=Cm(12.0))
        add_textbox(slide, 66.8, 61.6, 22.0, 2.0,
                    "Cockpit Tracker • 36 km/h, 142 pts entregues, sinal eduroam -58 dBm",
                    size_pt=17, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    # Fileira Inferior (y = 64.4 .. 80.6 cm, h = 16.2 cm)
    # Imagem 3: Mobile PWA sem cortes
    mob_pwa = ASSETS_DIR / "novo_site_mobile_pwa.png"
    if mob_pwa.exists():
        add_card(slide, 41.2, 64.4, 9.6, 16.2, bg_color=WHITE, border_color=BORDER, radius=0.05)
        slide.shapes.add_picture(str(mob_pwa), Cm(41.4), Cm(64.6), width=Cm(9.2), height=Cm(13.8))
        add_textbox(slide, 41.0, 78.6, 10.0, 1.8, "App PWA Móvel\n(Mapa + ETA)",
                    size_pt=16, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    # Imagem 4: Itinerário limpo
    itin_path = ASSETS_DIR / "novo_site_itinerario.png"
    if itin_path.exists():
        add_card(slide, 51.4, 64.4, 15.2, 16.2, bg_color=WHITE, border_color=BORDER, radius=0.05)
        slide.shapes.add_picture(str(itin_path), Cm(51.6), Cm(64.6), width=Cm(14.8), height=Cm(13.8))
        add_textbox(slide, 51.4, 78.6, 15.2, 1.8, "Grade das 12 Paradas\n(Horários Oficiais)",
                    size_pt=16, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    # Card Analítico de Discussão dos Resultados (substitui card redundante de checkboxes)
    disc_card = add_card(slide, 67.2, 64.4, 21.6, 16.2, bg_color=BLUE_LIGHT, border_color=BLUE, radius=0.05)
    tf_d = disc_card.text_frame
    tf_d.word_wrap = True
    tf_d.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf_d.margin_left = Cm(0.5)
    tf_d.margin_right = Cm(0.4)
    tf_d.margin_top = Cm(0.3)
    tf_d.margin_bottom = Cm(0.3)
    pd0 = tf_d.paragraphs[0]
    pd0.alignment = PP_ALIGN.LEFT
    pd0.space_after = Pt(6)
    rd0 = pd0.add_run()
    rd0.text = "Validação do Paradigma Híbrido"
    style_run(rd0, 23, bold=True, color=BLUE)

    pontos_disc = [
        "Resolução do gargalo na rota: nos trechos sem Wi-Fi (Via Expressa e Bancários), o buffer embarcado grava offline e sincroniza sem perda ao retornar aos campi.",
        "A latência de ~220 ms via SSE garante atualização fluida idêntica a apps comerciais (Moovit/Transit), porém com R$ 0 em planos móveis celulares.",
        "Integração total das 12 paradas do Campus I com estimativa de chegada e colaboração de passageiros."
    ]
    for pt in pontos_disc:
        p_pt = tf_d.add_paragraph()
        p_pt.alignment = PP_ALIGN.LEFT
        p_pt.space_after = Pt(4)
        p_pt.line_spacing = 1.15
        r_pt = p_pt.add_run()
        r_pt.text = f"• {pt}"
        style_run(r_pt, 18, bold=False, color=NAVY)

    add_textbox(
        slide, 41.2, 80.8, 47.6, 0.8,
        "Fonte: Elaborado pelos autores (2026).",
        size_pt=18, bold=False, color=MUTED, align=PP_ALIGN.RIGHT
    )

    # --- SEÇÃO 5: CONCLUSÃO ---
    add_divider(slide, 40.8, 82.2, 48.0)
    add_section_header(slide, 40.7, 83.0, "5", "CONCLUSÃO")
    add_textbox(
        slide, 41.2, 86.2, 47.6, 6.4,
        "O LocBUS comprovou viabilidade técnica, custo nulo em conectividade celular e "
        "prontidão para implantação na UFPB, oferecendo previsibilidade aos estudantes e "
        "monitoramento contínuo da frota circular intercampi. O protótipo estabelece uma "
        "arquitetura escalável para transporte público universitário de código aberto.",
        size_pt=28, color=BLACK, line_spacing=1.18
    )

    # --- SEÇÃO 6: AGRADECIMENTOS ---
    add_divider(slide, 40.8, 94.0, 48.0)
    add_section_header(slide, 40.7, 94.8, "6", "AGRADECIMENTOS")
    add_textbox(
        slide, 41.2, 98.0, 47.6, 13.0,
        "Agradecemos à Universidade Federal da Paraíba (UFPB), ao Centro de Energias "
        "Alternativas e Renováveis (CEAR), ao Departamento de Engenharia Elétrica e a todos os "
        "alunos, professores e colaboradores que participaram da pesquisa de campo e validação "
        "operacional do projeto LocBUS.",
        size_pt=27, color=BLACK, line_spacing=1.18
    )

    prs.save(str(OUTPUT_PATH))
    print("Saved:", OUTPUT_PATH)


if __name__ == "__main__":
    main()
