import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import './Home.css';

const subjects = [
  { id: 'bilgisayar-aglari', name: 'Bilgisayar Ağları', icon: '🌐', color: '#3b82f6', desc: 'Ağ protokolleri, katmanlar ve topolojiler' },
  { id: 'bilisim-sistemleri', name: 'Bilişim Sistemleri Analiz ve Tasarımı', icon: '📊', color: '#10b981', desc: 'Sistem yaşam döngüsü, UML ve modelleme' },
  { id: 'gorsel-programlama', name: 'Görsel Programlama', icon: '🎨', color: '#8b5cf6', desc: 'UI tasarımı, event-driven mimari ve C#' },
  { id: 'karar-teorisi', name: 'Karar Teorisi ve Analizi', icon: '⚖️', color: '#f59e0b', desc: 'Belirsizlik altında karar, ağaç modelleri' },
  { id: 'makine-ogrenmesi', name: 'Makine Öğrenmesi', icon: '🤖', color: '#ec4899', desc: 'Sınıflandırma, kümeleme ve algoritmalar' },
  { id: 'mobil-programlama', name: 'Mobil Programlama', icon: '📱', color: '#06b6d4', desc: 'Flutter, native UI ve mobil mimariler' },
];

const tips = [
  "Bilgisayar Ağları: Ağ iletişiminde cihazları MAC adresleriyle yönlendiren katman Veri Bağı Katmanı'dır (Data Link Layer).",
  "Makine Öğrenmesi: k-En Yakın Komşu (k-NN) algoritması 'bana arkadaşını söyle, sana kim olduğunu söyleyeyim' mantığıyla çalışır.",
  "Karar Teorisi: Olasılıkların bilinemediği durumlarda alınan kararlara 'Belirsizlik Altında Karar' denir.",
  "Bilişim Sistemleri: Şelale (Waterfall) modeli, kullanıcı gereksinimlerinin en başından çok net olduğu projeler için uygundur.",
  "Görsel Programlama: 'ClickOnce' teknolojisi uygulamanızı ağ üzerinde hızlıca yayınlayıp kurmanızı sağlar.",
  "Mobil Programlama: Flutter'da ekranı yatay eksende bölmek için 'Row', dikey eksende bölmek için 'Column' kullanılır."
];

const Home = () => {
  const navigate = useNavigate();
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      setAnimKey(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (id) => {
    navigate(`/quiz/${id}`);
  };

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section">
        <div className="badge-test">Sürüm 1.0 (Beta)</div>
        <h1 className="hero-title">
          <span>GA</span><span className="hero-title-accent" style={{ display: 'inline' }}>IA</span>
        </h1>
        <p className="hero-description">
          Modern ve interaktif sınav simülasyonları ile bilgilerinizi tazeleyin, eksiklerinizi anında tespit edin.
        </p>
      </div>

      <div key={animKey} className="tip-card glass-panel animate-fade-in-delayed">
        <div className="tip-icon-wrapper">
          <Lightbulb className="tip-icon" size={24} />
        </div>
        <div className="tip-content">
          <h4 className="tip-title">Günün İpucu</h4>
          <p className="tip-text">{currentTip}</p>
        </div>
      </div>

      <div className="section-header">
        <h2>Çalışma Alanları</h2>
        <p>Bilginizi test etmek istediğiniz dersi seçin</p>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div 
            key={subject.id} 
            className="subject-card glass-panel"
            onClick={() => handleSelect(subject.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="subject-icon-box" style={{ background: `${subject.color}15`, color: subject.color }}>
              <span className="subject-emoji">{subject.icon}</span>
            </div>
            <div className="subject-info">
              <h3 className="subject-name">{subject.name}</h3>
              <p className="subject-desc">{subject.desc}</p>
            </div>
            <div className="subject-action">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
