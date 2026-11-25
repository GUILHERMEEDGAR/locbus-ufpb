from pptx import Presentation

prs = Presentation(r"c:\Users\guilherme\Documents\POSTER GRUPO 2_PROOF_FINAL.pptx")
slide = prs.slides[0]

for i, sh in enumerate(slide.shapes):
    if sh.has_text_frame:
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                if r.text.strip():
                    sz = r.font.size.pt if r.font.size else "None"
                    fn = r.font.name or "None"
                    b = r.font.bold
                    t = r.text.strip().replace('\n', ' ')[:45]
                    print(f"Shape {i:2d} | {fn:15s} | {sz:5} pt | bold={str(b):5s} | {t}")
