import json
import re
import os

def parse_ocr():
    ocr_file = 'ocr_results.json'
    if not os.path.exists(ocr_file):
        print("ocr_results.json file not found.")
        return

    with open(ocr_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    subjects_map = {
        "Bilgisayar Ağları": "bilgisayar-aglari",
        "Bilişim Sistemleri Analiz ve Tasarımı": "bilisim-sistemleri",
        "Görsel Programlama": "gorsel-programlama",
        "Karar Teorisi ve Analizi": "karar-teorisi",
        "Makine Öğrenmesi": "makine-ogrenmesi",
        "Mobil Programlama": "mobil-programlama"
    }

    output_data = {key: [] for key in subjects_map.values()}

    def parse_text_to_questions(text):
        questions = []
        blocks = re.split(r'\n(?=\d{1,2}[\.\-\)])', '\n' + text)
        
        for block in blocks:
            block = block.strip()
            if not block:
                continue
            
            options_split = re.split(r'\n(?=[A-Ea-e][\)\.])', '\n' + block)
            if len(options_split) < 2:
                options_split = re.split(r'\s+(?=[A-Ea-e][\)\.])', block)
                
            if len(options_split) >= 2:
                q_text = options_split[0].strip()
                q_text = re.sub(r'^\d{1,2}[\.\-\)]\s*', '', q_text)
                
                opts = [opt.strip() for opt in options_split[1:]]
                
                if len(opts) >= 2:
                    correct_idx = 0
                    for i, o in enumerate(opts):
                        if ' ' in o or '\u2588' in o:
                            correct_idx = i
                            
                    questions.append({
                        "id": len(questions) + 1,
                        "question": q_text[:500],
                        "options": opts[:5],
                        "correct": correct_idx,
                        "explanation": "Bu soru PDF'ten otomatik aktarılmıştır."
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
            existing_qs = [q['question'] for q in output_data[subject_key]]
            for p in parsed:
                if not any(e[:20] == p['question'][:20] for e in existing_qs):
                    output_data[subject_key].append(p)

    for k, v in output_data.items():
        for i, q in enumerate(v):
            q['id'] = i + 1

    target_path = os.path.join('..', 'quiz-app', 'src', 'data', 'questions.json')
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Parsed and saved to {target_path}")

if __name__ == '__main__':
    parse_ocr()
