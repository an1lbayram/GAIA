import fitz
import easyocr
import glob
import json
import numpy as np
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

def run_ocr():
    print("Initializing EasyOCR for Turkish...")
    reader = easyocr.Reader(['tr'], gpu=False)

    pdfs = glob.glob("../Sorular/**/*.pdf", recursive=True)
    results = {}

    for pdf_path in pdfs:
        print(f"Processing: {pdf_path}")
        doc = fitz.open(pdf_path)
        
        text = ""
        for page in doc:
            text += page.get_text()
            
        if len(text.strip()) > 100:
            print(f"  -> Extracted {len(text)} chars normally.")
            results[pdf_path] = text
            continue
            
        print(f"  -> No text found, running OCR on {len(doc)} pages...")
        ocr_text = ""
        for i, page in enumerate(doc):
            print(f"     Page {i+1} OCR...")
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_data = pix.samples
            img_array = np.frombuffer(img_data, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
            
            if pix.n == 4:
                import cv2
                img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
                
            page_results = reader.readtext(img_array, detail=0, paragraph=True)
            ocr_text += "\n".join(page_results) + "\n"
            
        results[pdf_path] = ocr_text

    out_path = "ocr_results.json"
    print(f"Saving results to {out_path}...")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("Done!")

if __name__ == '__main__':
    run_ocr()
