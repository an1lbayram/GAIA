# 🎓 GAIA - Sınav Hazırlık ve Soru Çözüm Platformu

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Ready-646CFF?logo=vite)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs)
![PWA](https://img.shields.io/badge/PWA-Supported-success?logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green)

**GAIA**, üniversite ve akademik sınavlara hazırlanan öğrenciler için geliştirilmiş modern, hızlı ve interaktif bir sınav hazırlık ve soru çözüm platformudur. PDF formatındaki çıkmış sınav sorularının yapay zeka destekli OCR (EasyOCR) yöntemleriyle ayrıştırılıp, modern bir web arayüzünde çözülebilmesini sağlar.

---

## ✨ Özellikler

- 🎨 **Glassmorphism UI/UX:** Şık cam efektli tasarım, akıcı animasyonlar ve %100 mobil uyumlu (responsive) arayüz.
- 🌙 **Karanlık / Aydınlık Mod (Dark & Light Mode):** Göz yormayan, cihaz seçimine göre otomatik uyum sağlayan tema desteği.
- ⏱️ **Gelişmiş Pomodoro Sayacı:** Çalışma seanslarınızı yönetmek için entegre zamanlayıcı:
  - Otomatik döngü takibi (4 seanstan sonra büyük mola).
  - Özelleştirilebilir süreler (25/5, 40/10, 90/30).
  - Sesli bildirim ve alarm sekansı.
- 📝 **İnteraktif Sınav Deneyimi:** Soruları boş bırakma, anında açıklama görüntüleme ve test tamamlama seçenekleri.
- 📊 **Detaylı İstatistik ve Grafik:** Chart.js pasta grafikleri ve başarı yüzdesi göstergeleri.
- 💾 **Geçmiş Yönetimi:** Çözülen tüm testler yerel olarak saklanır; geçmiş başarı istatistikleri incelenebilir.
- 📱 **PWA Desteği:** Masaüstü veya mobil cihazlara uygulama olarak yüklenebilir, offline çalışır.

---

## 💻 Sistem Gereksinimleri

1. **Node.js** (v18.0.0 veya üzeri): [Node.js İndir](https://nodejs.org/)
2. **Git**: [Git İndir](https://git-scm.com/)

---

## 🚀 Kurulum ve Çalıştırma

### ⚡ Tek Satırda Kurulum ve Çalıştırma (Hızlı Başlangıç)

Terminalinizde (PowerShell / CMD) aşağıdaki komutu yapıştırarak projeyi clone'layabilir ve anında çalıştırabilirsiniz:

```bash
git clone https://github.com/an1lbayram/GAIA.git && cd GAIA && node launcher.js
```

*(Veya manuel npm çalıştırması):*
```bash
git clone https://github.com/an1lbayram/GAIA.git && cd GAIA && npm install && npm run dev
```

---

### 📋 Adım Adım Kurulum (Hiç Bilmeyenler İçin)

#### 1️⃣ Terminal / Komut Satırını Açın
Windows Başlat menüsünden `PowerShell` veya `CMD` uygulamasını açın.

#### 2️⃣ Repoyu Klonlayın
Projeyi bilgisayarınıza indirmek için:
```bash
git clone https://github.com/an1lbayram/GAIA.git
```

#### 3️⃣ Proje Klasörüne Geçin
```bash
cd GAIA
```

#### 4️⃣ Başlatıcıyı (Launcher) Çalıştırın
Sistemdeki paketleri otomatik kontrol edip uygulamayı başlatmak için:
```bash
node launcher.js
```
*(Windows kullanıcıları alternatif olarak `GAIA_Baslat.bat` dosyasına çift tıklayabilir).*

#### 5️⃣ Uygulamayı Açın
Tarayıcınızda açılan başlatıcı ekranından **"Uygulamayı Başlat"** butonuna basın. Vite geliştirme sunucusu (`http://localhost:5173`) otomatik açılacaktır!

---

## 🛠️ Derleme ve Yayınlama (Build)

Uygulamayı üretime hazır statik paket haline getirmek için:

```bash
npm run build
```
Oluşan `quiz-app/dist` klasörünü Vercel, Netlify veya GitHub Pages üzerinde yayınlayabilirsiniz.

---

## 📂 Proje Yapısı

```text
GAIA/
├── GAIA_Baslat.bat           # Windows tek tıkla başlatıcı
├── launcher.js               # Node.js otomatik kurucu ve başlatıcı
├── ocr_pdfs.py               # PDF sorularını okuyan Python EasyOCR betiği
├── parse_ocr.py              # OCR çıktısını JSON soru formatına dönüştürücü
└── quiz-app/                 # React + Vite ana uygulama
    ├── src/                  # Bileşenler, Pomodoro, Grafikler, Soru bankası
    └── package.json          # Uygulama bağımlılıkları
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

**Geliştirici:** [Anıl Bayram](https://github.com/an1lbayram)
