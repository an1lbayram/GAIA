# GAIA - Sınav Hazırlık Platformu 🎓

Modern, hızlı ve interaktif bir Sınav Hazırlık ve Soru Çözüm uygulaması. Bu proje, üniversite derslerine ait (Bilgisayar Ağları, Makine Öğrenmesi, Görsel Programlama vb.) PDF formatındaki sınav sorularının yapay zeka destekli OCR yöntemleriyle ayrıştırılıp, modern bir web arayüzünde çözülebilmesini sağlamak amacıyla geliştirilmiştir.

## ✨ Özellikler

- **Modern ve Şık Arayüz (UI/UX):** "Glassmorphism" (Cam efekti) tasarımı, akıcı animasyonlar, "Yukarı Çık" butonu ve tam responsive (mobil uyumlu) yapı.
- **Karanlık / Aydınlık Mod (Dark & Light Mode):** Göz yormayan, cihaz tercihine veya kullanıcı seçimine göre değişebilen özel renk paletli tema desteği.
- **Gelişmiş Pomodoro Sayacı:** Çalışma seanslarınızı yönetmeniz için menüye entegre edilmiş akıllı zamanlayıcı. 
  - *Otomatik Döngü Takibi:* 4 çalışma seansından sonra otomatik büyük mola.
  - *Özelleştirilebilir Süreler:* 25/5, 40/10 veya 90/30 (Ders/Mola) dakika seçenekleri.
  - *Sesli Bildirim:* Molaya girerken ve derse başlarken çalan yüksek sesli alarm sekansı.
- **Sınav Çözüm Deneyimi:** Soruları çözerken "Boş Bırak ve Geç" seçeneğini kullanabilirsiniz. Dilerseniz testi erken bitirebilirsiniz (boş bırakılan sorular uyarısı ile birlikte). Soruların doğru ve yanlış cevaplarına ait açıklamalar anında sunulur.
- **Gelişmiş Sonuç Ekranı:** Test bitiminde başarı oranınız dairesel barlar ve **Chart.js** pasta grafikleri ile görselleştirilir. Doğru, yanlış ve boş yaptığınız sorular detaylıca listelenir.
- **Kapsamlı Geçmiş Yönetimi:** Çözdüğünüz tüm testler tarayıcıya kaydedilir. Geçmiş sayfasından her bir testin "Doğru, Yanlış, Boş" oranlarını istatistiksel olarak görebilir ve isterseniz silebilirsiniz.
- **PWA (Progressive Web App) Desteği:** Uygulamayı telefonunuza veya bilgisayarınıza normal bir uygulama gibi indirebilir, önbelleğe alınan verilerle kullanmaya devam edebilirsiniz.

## 🛠️ Kullanılan Teknolojiler

- **Frontend Core:** React, Vite
- **Styling:** Vanilla CSS (CSS Variables, Glassmorphism), Lucide React (İkonlar)
- **Veri Görselleştirme:** Chart.js, react-chartjs-2
- **State Management & Routing:** React Router DOM, React Context (Hooks)
- **Data Pipeline (Arka Plan İşlemi):** EasyOCR (Python) - Taranmış resim tabanlı PDF'lerden soru çekimi için kullanılmıştır.

## 🚀 Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için Node.js ortamına veya özel Node kurucumuza (`launcher.js`) ihtiyacınız vardır.

### Adımlar

1. Gerekli bağımlılıkları indirmek ve uygulamayı başlatmak için ana dizindeki `launcher.js` dosyasını çalıştırın:
   ```bash
   node launcher.js
   ```
2. Başlatıcı ekran (`http://localhost:3050`) üzerinden **"Uygulamayı Başlat"** butonuna tıklayın. Sistem `quiz-app` klasöründeki bağımlılıkları otomatik kontrol edip yükleyecek ve Vite geliştirme sunucusunu (`http://localhost:5173/`) ayağa kaldıracaktır.

3. Eğer manuel kurmak isterseniz:
   ```bash
   cd quiz-app
   npm install
   npm run dev
   ```

4. Üretime Hazır Hale Getirme (Build):
   ```bash
   cd quiz-app
   npm run build
   ```
   Bu komut sonucunda `dist` klasörü oluşturulur ve uygulamanız herhangi bir statik sunucuda (Vercel, Netlify, Github Pages vb.) yayınlanmaya hazır hale gelir.

## 🔒 Güvenlik ve Performans Notları
- Bu proje, statik (istemci taraflı) bir uygulama olarak tasarlanmıştır ve backend gerektirmez. JSON veritabanı (`src/data/questions.json`) üzerinden okuma yapar.
- PWA yapısı sayesinde performansı oldukça yüksektir.

<br>
<p align="center">
  <b>Created by <a href="https://an1lbayram.github.io/">an1lbayram</a></b>
</p>
