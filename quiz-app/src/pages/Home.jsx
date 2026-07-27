import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ChevronRight, Search, Shuffle, RefreshCw, Trophy, Flame } from 'lucide-react';
import questionsData from '../data/questions.json';
import './Home.css';

const subjectsList = [
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
  const [tipIndex, setTipIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [history] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('quizHistory') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
      setAnimKey(prev => prev + 1);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const nextTip = () => {
    setTipIndex(prev => (prev + 1) % tips.length);
    setAnimKey(prev => prev + 1);
  };

  const handleSelect = (id) => {
    navigate(`/quiz/${id}`);
  };

  const handleMixQuiz = () => {
    navigate('/quiz/karma-test');
  };

  const filteredSubjects = useMemo(() => {
    return subjectsList.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const subjectStats = useMemo(() => {
    const stats = {};
    subjectsList.forEach(s => {
      const records = history.filter(h => h.subjectId === s.id);
      if (records.length > 0) {
        const lastRecord = records[0];
        const total = lastRecord.answers.length;
        const correct = lastRecord.answers.filter(a => a.selected === a.correct).length;
        const percent = Math.round((correct / total) * 100);
        stats[s.id] = { count: records.length, lastScore: percent };
      } else {
        stats[s.id] = null;
      }
    });
    return stats;
  }, [history]);

  const totalQuestionsAvailable = useMemo(() => {
    return Object.values(questionsData).reduce((sum, qList) => sum + (Array.isArray(qList) ? qList.length : 0), 0);
  }, []);

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section">
        <div className="badge-test">
          <Flame size={14} style={{ marginRight: '6px' }} />
          Sınav Simülasyon Platformu
        </div>
        <h1 className="hero-title">
          <span>GA</span><span className="hero-title-accent">IA</span>
        </h1>
        <p className="hero-description">
          Modern ve interaktif sınav simülasyonları ile ders bilginizi test edin, eksiklerinizi anında görün. Toplam {totalQuestionsAvailable} soru hazır!
        </p>

        <div className="hero-actions">
          <button className="btn-primary mix-quiz-btn" onClick={handleMixQuiz}>
            <Shuffle size={18} /> Karma Test Çöz (Tüm Dersler)
          </button>
        </div>
      </div>

      <div key={animKey} className="tip-card glass-panel animate-fade-in-delayed">
        <div className="tip-icon-wrapper">
          <Lightbulb className="tip-icon" size={24} />
        </div>
        <div className="tip-content">
          <div className="tip-header-row">
            <h4 className="tip-title">Günün İpucu</h4>
            <button className="tip-next-btn" onClick={nextTip} title="Sonraki İpucu">
              <RefreshCw size={14} />
            </button>
          </div>
          <p className="tip-text">{tips[tipIndex]}</p>
        </div>
      </div>

      <div className="section-header-wrap">
        <div className="section-header">
          <h2>Çalışma Alanları</h2>
          <p>Bilginizi test etmek istediğiniz dersi seçin</p>
        </div>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Ders veya konu ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="subjects-grid">
        {filteredSubjects.map((subject, index) => {
          const stat = subjectStats[subject.id];
          const questionCount = questionsData[subject.id]?.length || 0;

          return (
            <div 
              key={subject.id} 
              className="subject-card glass-panel"
              onClick={() => handleSelect(subject.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="subject-card-top">
                <div className="subject-icon-box" style={{ background: `${subject.color}18`, color: subject.color }}>
                  <span className="subject-emoji">{subject.icon}</span>
                </div>
                <div className="subject-badge">{questionCount} Soru</div>
              </div>

              <div className="subject-info">
                <h3 className="subject-name">{subject.name}</h3>
                <p className="subject-desc">{subject.desc}</p>
              </div>

              <div className="subject-footer">
                {stat ? (
                  <div className="subject-score-badge" style={{ color: stat.lastScore >= 75 ? 'var(--success)' : stat.lastScore >= 50 ? 'var(--warning)' : 'var(--error)' }}>
                    <Trophy size={14} /> Son Skor: %{stat.lastScore}
                  </div>
                ) : (
                  <span className="subject-status-new">Henüz Çözülmedi</span>
                )}
                
                <div className="subject-action">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubjects.length === 0 && (
          <div className="no-search-results glass-panel">
            <p>"{searchQuery}" aramanıza uygun ders bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
