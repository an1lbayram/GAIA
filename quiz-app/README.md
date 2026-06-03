# Sınav Hazırlık Platformu (Quiz App) 🎓

Modern, hızlı ve interaktif bir Sınav Hazırlık ve Soru Çözüm uygulaması. Bu proje, üniversite derslerine ait (Bilgisayar Ağları, Makine Öğrenmesi, Görsel Programlama vb.) PDF formatındaki sınav sorularının yapay zeka destekli OCR yöntemleriyle ayrıştırılıp, modern bir web arayüzünde çözülebilmesini sağlamak amacıyla geliştirilmiştir.

## ✨ Özellikler

- **Modern ve Şık Arayüz (UI/UX):** "Glassmorphism" (Cam efekti) tasarımı, akıcı animasyonlar ve responsive (mobil uyumlu) yapı.
- **Karanlık / Aydınlık Mod (Dark & Light Mode):** Göz yormayan, cihaz tercihine veya kullanıcı seçimine göre değişebilen tema desteği.
- **PWA (Progressive Web App) Desteği:** Uygulamayı telefonunuza veya bilgisayarınıza normal bir uygulama gibi indirebilir, internet bağlantınız kopsa dahi önbelleğe alınan verilerle kullanmaya devam edebilirsiniz.
- **Anlık Geri Bildirim ve Açıklamalar:** Soruları çözerken doğru/yanlış anında bildirilir ve her soru için açıklayıcı çözüm metni sunulur.
- **Gelişmiş Sonuç Ekranı:** Test bitiminde başarı oranınız dairesel barlar ve **Chart.js** pasta grafikleri ile görselleştirilir. Yanlış yaptığınız sorular detaylıca listelenir.
- **Geçmiş (Sınav Geçmişi):** Çözdüğünüz tüm testler tarih ve saat bilgisiyle birlikte tarayıcıya (localStorage) kaydedilir ve Geçmiş sayfasından takip edilebilir.
- **Dahili Admin Paneli:** Veritabanındaki (JSON) soruların doğru cevaplarını ve açıklamalarını arayüz üzerinden düzenleyip, güncel `questions.json` dosyasını tek tıkla indirebilmenizi sağlayan gizli bir kontrol paneli içerir (`/admin` rotası).

## 🛠️ Kullanılan Teknolojiler

- **Frontend Core:** React, Vite
- **Styling:** Vanilla CSS (CSS Variables, Glassmorphism), Lucide React (İkonlar)
- **Veri Görselleştirme:** Chart.js, react-chartjs-2
- **State Management & Routing:** React Router DOM, React Context (Hooks)
- **Data Pipeline (Arka Plan İşlemi):** EasyOCR (Python) - Taranmış resim tabanlı PDF'lerden soru çekimi için kullanılmıştır.

## 🚀 Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler
- [Node.js](https://nodejs.org/) (Sürüm 18 veya üzeri önerilir)
- NPM veya Yarn

### Adımlar

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme (Development) sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Uygulama varsayılan olarak `http://localhost:5173/` adresinde çalışacaktır.

3. Üretime Hazır Hale Getirme (Build):
   ```bash
   npm run build
   ```
   Bu komut sonucunda `dist` klasörü oluşturulur ve uygulamanız herhangi bir statik sunucuda (Vercel, Netlify, Github Pages vb.) yayınlanmaya hazır hale gelir.

## 📝 Admin Paneli ve Veri Yönetimi

Uygulamanın soru veritabanı `src/data/questions.json` içerisinde tutulmaktadır. 

1. Uygulama çalışırken menüden veya `http://localhost:5173/admin` adresinden **Admin Paneline** girin.
2. Hatalı okunan soruları veya varsayılan (A) olarak işaretlenmiş doğru cevapları ve açıklamaları kendi isteğinize göre arayüzden düzenleyin.
3. **"questions.json İndir"** butonuna tıklayın.
4. İnen dosyayı projenizin `src/data/questions.json` dizinindeki eski dosyayla değiştirin.
5. Değişikliklerin kalıcı olması için geliştirme sunucusunu baştan başlatın (veya yeniden `npm run build` komutunu çalıştırın).

## 🔒 Güvenlik ve Performans Notları
- Bu proje, statik (istemci taraflı) bir uygulama olarak tasarlanmıştır ve backend gerektirmez.
- `questions.json` boyutu zamanla çok artarsa lazy-loading stratejileri eklenebilir ancak mevcut ~1500 soru için performansı mükemmel düzeydedir.
- PWA yapısı sayesinde performansı oldukça yüksektir.
