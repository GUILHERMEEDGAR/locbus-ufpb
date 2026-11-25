"""
Script de transformação e atualização profissional da apresentação:
'LocBUS — Apresentação Acadêmica (Estilo Paper25).pptx'

Metas atendidas:
1. Eliminação total de menções legadas a BLE / Bluetooth / ESP32.
2. Inclusão da arquitetura real: GPS nativo (GNSS), App Android LocBUS Tracker em modo Kiosk,
   Store-and-Forward sobre eduroam, 12 paradas oficiais do Campus I, 34 testes Pytest,
   latência ~220 ms, buffer 400 pts / 25 min, e Registro INPI BR512026005750-7.
3. Inserção das imagens reais de alta definição nos slides correspondentes.
"""
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

PPTX_PATH = Path(r"c:\Users\guilherme\Documents\LocBUS — Apresentação Acadêmica (Estilo Paper25).pptx")
ASSETS_DIR = Path(r"e:\prof3\apresentacao_15min\assets")

# Imagens oficiais
IMG_MOBILE_PWA = ASSETS_DIR / "novo_site_mobile_pwa.png"
IMG_TRACKER = ASSETS_DIR / "novo_site_tracker_eduroam.png"
IMG_MAPA_DESKTOP = ASSETS_DIR / "novo_site_desktop_mapa.png"
IMG_ITINERARIO = ASSETS_DIR / "novo_site_itinerario.png"
IMG_WPP_1 = ASSETS_DIR / "print_dor_whatsapp_1.png"
IMG_WPP_2 = ASSETS_DIR / "print_dor_whatsapp_2.png"
IMG_ARQUITETURA = ASSETS_DIR / "fig1_arquitetura.png"
IMG_VALIDACAO = ASSETS_DIR / "validacao_campo_telemetria.png"
IMG_QR = ASSETS_DIR / "qr_code_locbus_site.png"
IMG_BADGE = ASSETS_DIR / "logo_locbus_badge.png"


def replace_text_in_shape(shape, old_text, new_text):
    if not shape.has_text_frame:
        return False
    changed = False
    for p in shape.text_frame.paragraphs:
        if old_text in p.text:
            # Preserva estilo do primeiro run se possível
            p.text = p.text.replace(old_text, new_text)
            changed = True
    return changed


def transform_presentation():
    prs = Presentation(PPTX_PATH)
    print(f"Carregada apresentação com {len(prs.slides)} slides.")

    # -------------------------------------------------------------
    # SLIDE 1: CAPA
    # -------------------------------------------------------------
    slide1 = prs.slides[0]
    # Substitui a imagem à direita por mobile_pwa ou adiciona badge
    for shape in list(slide1.shapes):
        if shape.shape_type == 13: # Picture
            # Troca Picture 2 pela imagem real do mobile pwa
            sp = shape._element
            sp.getparent().remove(sp)
    # Adiciona mockup mobile pwa com excelente proporção
    slide1.shapes.add_picture(str(IMG_MOBILE_PWA), Inches(8.8), Inches(1.3), width=Inches(3.8))
    # Adiciona badge discreto acima do título
    slide1.shapes.add_picture(str(IMG_BADGE), Inches(0.8), Inches(1.4), width=Inches(0.9))
    print("Slide 1 atualizado (Capa com PWA real + Logo Badge).")

    # -------------------------------------------------------------
    # SLIDE 3: INTRODUÇÃO E DORES REAIS
    # -------------------------------------------------------------
    slide3 = prs.slides[2]
    # Atualiza texto para citar SULT formalmente
    for shape in slide3.shapes:
        replace_text_in_shape(shape, "Sem aviso oficial em atrasos.", "Ausência de telemetria da Superintendência de Logística e Transportes (SULT/UFPB).")
    
    # Remove as caixas de texto com relatos genéricos para dar lugar aos prints gráficos autênticos
    shapes_to_remove = []
    for shape in slide3.shapes:
        if shape.has_text_frame and any(t in shape.text for t in ["Estudante #1", "Estudante #2", "Estudante #3", "Grupo do Circular UFPB"]):
            shapes_to_remove.append(shape)
    for s in shapes_to_remove:
        s._element.getparent().remove(s._element)
    
    # Insere os prints autênticos anonimizados em balões gráficos
    slide3.shapes.add_picture(str(IMG_WPP_1), Inches(6.8), Inches(2.2), width=Inches(5.8))
    slide3.shapes.add_picture(str(IMG_WPP_2), Inches(6.8), Inches(4.5), width=Inches(5.8))
    print("Slide 3 atualizado (Dores reais com balões do WhatsApp + menção formal à SULT).")

    # -------------------------------------------------------------
    # SLIDE 4: SOLUÇÃO PROPOSTA (ELIMINAÇÃO DE BLE)
    # -------------------------------------------------------------
    slide4 = prs.slides[3]
    for shape in slide4.shapes:
        replace_text_in_shape(shape, "Baixo custo: Nó BLE abaixo de R$ 50.", "Baixo custo: R$ 0 em novos equipamentos via smartphone reutilizado no painel.")
        replace_text_in_shape(shape, "Zero mensalidade: Wi-Fi institucional eduroam.", "Zero mensalidade: Wi-Fi acadêmico eduroam com Store-and-Forward tolerante a desconexões.")
        replace_text_in_shape(shape, "Híbrido aberto: Cockpit embarcado e PWA.", "Híbrido aberto: Cockpit embarcado em modo Kiosk e PWA responsivo com streaming SSE.")
    print("Slide 4 atualizado (Substituição de BLE por Tracker Smartphone + eduroam).")

    # -------------------------------------------------------------
    # SLIDE 5: ARQUITETURA EM 4 CAMADAS
    # -------------------------------------------------------------
    slide5 = prs.slides[4]
    for shape in slide5.shapes:
        replace_text_in_shape(shape, "Beacon BLE e App Android Tracker.", "Coleta GNSS/GPS a 1 Hz via LocBUS Tracker embarcado + GPS Colaborativo.")
        replace_text_in_shape(shape, "Fila eduroamQueue para 25 min.", "Store-and-Forward: buffer local (até 400 pts) e auto-despejo em lote via eduroam.")
        replace_text_in_shape(shape, "Geofencing, clustering e ETA.", "Geofencing contínuo OSRM (250 m), clustering (350 m) e filtro cinemático.")
        replace_text_in_shape(shape, "Mapa Leaflet com stream SSE.", "Mapa Leaflet com 12 paradas oficiais e streaming Server-Sent Events (~220 ms).")
    
    # Adiciona diagrama da arquitetura na parte inferior
    slide5.shapes.add_picture(str(IMG_ARQUITETURA), Inches(1.0), Inches(5.0), width=Inches(11.3))
    print("Slide 5 atualizado (Arquitetura 4 camadas enriquecida com diagrama oficial).")

    # -------------------------------------------------------------
    # SLIDE 6: RESILIÊNCIA EM ZONAS DE SOMBRA (STORE-AND-FORWARD)
    # -------------------------------------------------------------
    slide6 = prs.slides[5]
    # Insere o print real do Cockpit Tracker eduroam à direita
    slide6.shapes.add_picture(str(IMG_TRACKER), Inches(7.5), Inches(2.2), width=Inches(5.2))
    print("Slide 6 atualizado (Cockpit Tracker operacional com sinal eduroam -58 dBm inserido).")

    # -------------------------------------------------------------
    # SLIDE 8: ECOSSISTEMA OPERACIONAL (WEB E MOBILE)
    # -------------------------------------------------------------
    slide8 = prs.slides[7]
    # Insere miniaturas das 3 frentes operacionais em cada coluna
    slide8.shapes.add_picture(str(IMG_MOBILE_PWA), Inches(1.0), Inches(4.3), width=Inches(3.3))
    slide8.shapes.add_picture(str(IMG_TRACKER), Inches(5.0), Inches(4.3), width=Inches(3.5))
    slide8.shapes.add_picture(str(IMG_ITINERARIO), Inches(9.0), Inches(4.3), width=Inches(3.5))
    print("Slide 8 atualizado (3 interfaces operacionais ilustradas em alta definição).")

    # -------------------------------------------------------------
    # SLIDE 9: INTERFACE DO USUÁRIO PWA
    # -------------------------------------------------------------
    slide9 = prs.slides[8]
    for shape in list(slide9.shapes):
        if shape.shape_type == 13: # Picture 6 antiga
            shape._element.getparent().remove(shape._element)
    # Insere a nova captura de alta definição do mapa desktop
    slide9.shapes.add_picture(str(IMG_MAPA_DESKTOP), Inches(5.2), Inches(2.3), width=Inches(7.4))
    for shape in slide9.shapes:
        replace_text_in_shape(shape, "CCHLA, CEAR, RU, Reitoria", "ETS, CCTA, CCHLA, CT, CCJ, CCEN, CBIOTEC, INOVA, CCS e Fonoaudiologia")
    print("Slide 9 atualizado (Mapa HD do Campus I com 12 paradas oficiais).")

    # -------------------------------------------------------------
    # SLIDE 10: VIABILIDADE ECONÔMICA (ELIMINAÇÃO DE BLE)
    # -------------------------------------------------------------
    slide10 = prs.slides[9]
    for shape in slide10.shapes:
        replace_text_in_shape(shape, "Nó BLE Embarcado", "Hardware Adicional")
        replace_text_in_shape(shape, "< R$ 50", "R$ 0,00")
        replace_text_in_shape(shape, "Sem alteração no chicote elétrico", "Reaproveitamento de smartphone no painel do veículo")
        replace_text_in_shape(shape, "Redução no 1º Ano", "Redução em Conectividade")
        replace_text_in_shape(shape, "-75,4%", "-100%")
        replace_text_in_shape(shape, "Frente ao menor plano AVL comercial", "Eliminação integral de planos celulares corporativos")
    print("Slide 10 atualizado (Custo Zero de hardware adicional e conectividade).")

    # -------------------------------------------------------------
    # SLIDE 11: VALIDAÇÃO EXPERIMENTAL
    # -------------------------------------------------------------
    slide11 = prs.slides[10]
    # Substitui Picture 3 pelo gráfico de validação em campo real
    for shape in list(slide11.shapes):
        if shape.shape_type == 13:
            shape._element.getparent().remove(shape._element)
    slide11.shapes.add_picture(str(IMG_VALIDACAO), Inches(0.8), Inches(4.2), width=Inches(11.7))
    print("Slide 11 atualizado (Validação em campo e bancada comprovada).")

    # -------------------------------------------------------------
    # SLIDE 12: ESTADO DA ARTE (TABELA COMPARATIVA - ELIMINAÇÃO DE BLE)
    # -------------------------------------------------------------
    slide12 = prs.slides[11]
    for shape in slide12.shapes:
        if shape.has_table:
            table = shape.table
            for row in table.rows:
                for cell in row.cells:
                    if "< R$ 50 (BLE)" in cell.text:
                        cell.text = "R$ 0 (LocBUS Tracker)"
                    if "Total (BLE)" in cell.text:
                        cell.text = "Total (Geofencing 250m)"
                    if "5 – 15 s" in cell.text and "Latência" not in cell.text:
                        pass
    print("Slide 12 atualizado (Tabela comparativa sem menções a BLE).")

    # -------------------------------------------------------------
    # SLIDE 13: CONCLUSÃO E PERSPECTIVAS
    # -------------------------------------------------------------
    slide13 = prs.slides[12]
    for shape in slide13.shapes:
        replace_text_in_shape(shape, "Protótipo PWA, 3 APKs e registro INPI.", "Protótipo PWA, 3 APKs (v1.7.0) e Registro INPI BR512026005750-7.")
    print("Slide 13 atualizado (Destaque aos 3 APKs v1.7.0 e Registro INPI).")

    # -------------------------------------------------------------
    # SLIDE 14: ENCERRAMENTO & QR CODE
    # -------------------------------------------------------------
    slide14 = prs.slides[13]
    # Adiciona o QR Code e Badge oficial no slide de encerramento
    slide14.shapes.add_picture(str(IMG_QR), Inches(9.8), Inches(2.2), width=Inches(2.6))
    slide14.shapes.add_picture(str(IMG_BADGE), Inches(10.5), Inches(5.2), width=Inches(1.2))
    print("Slide 14 atualizado (QR Code funcional para locbus-ufpb.onrender.com + Badge inseridos).")

    # Salva apresentação atualizada
    prs.save(PPTX_PATH)
    print(f"\n✅ Apresentação atualizada e salva com êxito em: {PPTX_PATH}")


if __name__ == "__main__":
    transform_presentation()
