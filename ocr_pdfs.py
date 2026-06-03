import fitz
import easyocr
import glob
import json
import numpy as np
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("Initializing EasyOCR for Turkish...")
reader = easyocr.Reader(['tr'], gpu=False) # Fallback to CPU to avoid CUDA errors if not available

pdfs = glob.glob("Sorular/**/*.pdf", recursive=True)
results = {}

for pdf_path in pdfs:
    safe_path = pdf_path.encode('cp1254', 'ignore').decode('cp1254', 'ignore')
    print(f"Processing: {safe_path}")
    doc = fitz.open(pdf_path)
    
    # Check if text is readable normally
    text = ""
    for page in doc:
        text += page.get_text()
        
    if len(text.strip()) > 100:
        print(f"  -> Extracted {len(text)} chars normally.")
        results[safe_path] = text
        continue
        
    # If not, use OCR
    print(f"  -> No text found, running OCR on {len(doc)} pages...")
    ocr_text = ""
    for i, page in enumerate(doc):
        print(f"     Page {i+1} OCR...")
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # 2x zoom for better OCR
        img_data = pix.samples
        img_array = np.frombuffer(img_data, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        
        # if image has alpha, convert to RGB
        if pix.n == 4:
            import cv2
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
            
        page_results = reader.readtext(img_array, detail=0, paragraph=True)
        ocr_text += "\n".join(page_results) + "\n"
        
    results[safe_path] = ocr_text

print("Saving results to ocr_results.json...")
with open("ocr_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done!")
