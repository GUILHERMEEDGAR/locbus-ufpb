import os
from pptx import Presentation

path = r"c:\Users\guilherme\Documents\LocBUS — Apresentação Acadêmica (Estilo Paper25).pptx"
prs = Presentation(path)
print(f"Total de slides: {len(prs.slides)}")
print(f"Dimensões: {prs.slide_width.inches:.2f} x {prs.slide_height.inches:.2f} polegadas")

for i, slide in enumerate(prs.slides, 1):
    print(f"\n==================== SLIDE {i} ====================")
    images = []
    text_fragments = []
    for s_idx, shape in enumerate(slide.shapes):
        if shape.shape_type == 13: # Picture
            images.append(f"Image [{shape.name}] pos=({shape.left.inches:.2f}, {shape.top.inches:.2f}) dim=({shape.width.inches:.2f}x{shape.height.inches:.2f})")
        elif shape.has_text_frame:
            t = shape.text.strip()
            if t:
                text_fragments.append(f"[{shape.name}] " + t.replace("\n", " \n    "))
    
    print(f"Total Imagens: {len(images)}")
    for img in images:
        print(f"  * {img}")
    print(f"Textos ({len(text_fragments)} blocos):")
    for tf in text_fragments:
        print(f"  - {tf}\n")
