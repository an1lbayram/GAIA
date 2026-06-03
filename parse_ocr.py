import json
import re

with open('ocr_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Subjects mapping
subjects_map = {
    "Bilgisayar Ağları": "bilgisayar-aglari",
    "Bilişim Sistemleri Analiz ve Tasarımı": "bilisim-sistemleri",
    "Görsel Programlama": "gorsel-programlama",
    "Karar Teorisi ve Analizi": "karar-teorisi",
    "Makine Öğrenmesi": "makine-ogrenmesi",
    "Mobil Programlama": "mobil-programlama"
}

output_data = {
    "bilgisayar-aglari": [],
    "bilisim-sistemleri": [],
    "gorsel-programlama": [],
    "karar-teorisi": [],
    "makine-ogrenmesi": [],
    "mobil-programlama": []
}

def parse_text_to_questions(text):
    questions = []
    # Try to find questions by number: "1.", "2 -", etc.
    # We will use a regex to split the text into blocks starting with number
    blocks = re.split(r'\n(?=\d{1,2}[\.\-\)])', '\n' + text)
    
    for block in blocks:
        block = block.strip()
        if not block: continue
        
        # extract options A) B) C) D) E)
        # some might have A) or a)
        options_split = re.split(r'\n(?=[A-Ea-e][\)\.])', '\n' + block)
        if len(options_split) < 2:
            # try finding them inline
            options_split = re.split(r'\s+(?=[A-Ea-e][\)\.])', block)
            
        if len(options_split) >= 2:
            q_text = options_split[0].strip()
            # clean up question text
            q_text = re.sub(r'^\d{1,2}[\.\-\)]\s*', '', q_text)
            
            opts = []
            for opt in options_split[1:]:
                opts.append(opt.strip())
            
            if len(opts) >= 2:
                # find correct answer if it has special char or just default to 0
                correct_idx = 0
                for i, o in enumerate(opts):
                    # sometimes OCR captures bullet point or bold as weird chars
                    if ' ' in o or '\u2588' in o:
                        correct_idx = i
                        
                questions.append({
                    "id": len(questions) + 1,
                    "question": q_text[:500], # limit length to avoid massive garbage
                    "options": opts[:5], # max 5 options
                    "correct": correct_idx,
                    "explanation": "Bu soru PDF'ten otomatik aktarılmıştır. Açıklamalar yapay zeka tarafından eklenecektir."
                })
    return questions

for path, text in data.items():
    subject_key = None
    for tr_name, key in subjects_map.items():
        if tr_name in path:
            subject_key = key
            break
            
    if subject_key:
        parsed = parse_text_to_questions(text)
        # Avoid duplicates (since we have A and B booklets)
        existing_qs = [q['question'] for q in output_data[subject_key]]
        for p in parsed:
            # simple duplicate check by first 20 chars
            if not any(e[:20] == p['question'][:20] for e in existing_qs):
                output_data[subject_key].append(p)

# Assign IDs
for k, v in output_data.items():
    for i, q in enumerate(v):
        q['id'] = i + 1

with open('quiz-app/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("Parsed and saved to questions.json")
