import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Book, Target, ArrowRight, Activity, Trash2 } from 'lucide-react';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistory(saved);
  }, []);

  const handleDelete = (indexToDelete) => {
    if (window.confirm('Bu test sonucunu silmek istediğinizden emin misiniz?')) {
      const newHistory = history.filter((_, idx) => idx !== indexToDelete);
      setHistory(newHistory);
      localStorage.setItem('quizHistory', JSON.stringify(newHistory));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const getSubjectInfo = (id) => {
    const subjects = {
      'bilgisayar-aglari': { name: 'Bilgisayar Ağları', color: '#3b82f6' },
      'bilisim-sistemleri': { name: 'Bilişim Sistemleri Analiz', color: '#10b981' },
      'gorsel-programlama': { name: 'Görsel Programlama', color: '#8b5cf6' },
      'karar-teorisi': { name: 'Karar Teorisi ve Analizi', color: '#f59e0b' },
      'makine-ogrenmesi': { name: 'Makine Öğrenmesi', color: '#ec4899' },
      'mobil-programlama': { name: 'Mobil Programlama', color: '#06b6d4' }
    };
    return subjects[id] || { name: id, color: '#6c5ce7' };
  };

  return (
    <div className="history-container animate-fade-in">
      <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
        <h2>Sınav Geçmişiniz</h2>
        <p>Önceki performanslarınızı ve gelişiminizi takip edin</p>
      </div>
      
      {history.length === 0 ? (
        <div className="history-empty glass-panel text-center">
          <Activity size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>Henüz hiç test çözmediniz</h3>
          <p>İlk testinize hemen başlayın ve sonuçlarınızı burada görün.</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/')}>Testlere Göz At</button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((record, index) => {
            const total = record.answers.length;
            const correct = record.answers.filter(a => a.selected === a.correct).length;
            const blank = record.answers.filter(a => a.selected === null).length;
            const wrong = total - correct - blank;
            const percentage = Math.round((correct / total) * 100);
            const subInfo = getSubjectInfo(record.subjectId);
            
            let scoreColor = 'var(--success)';
            if (percentage < 50) scoreColor = 'var(--error)';
            else if (percentage < 75) scoreColor = 'var(--warning)';
            
            return (
              <div key={index} className="history-card glass-panel animate-fade-in-delayed" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="hc-top">
                  <div className="hc-badge" style={{ backgroundColor: `${subInfo.color}15`, color: subInfo.color }}>
                    <Book size={14} /> {subInfo.name}
                  </div>
                  <div className="hc-date">
                    <Clock size={14} /> {formatDate(record.date)}
                  </div>
                </div>
                
                <div className="hc-middle">
                  <div className="hc-score">
                    <span className="hc-score-val" style={{ color: scoreColor }}>{percentage}%</span>
                    <span className="hc-score-label">Başarı Oranı</span>
                  </div>
                  <div className="hc-chart-mini">
                    <svg viewBox="0 0 36 36" className="circular-chart-mini">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="circle" stroke={scoreColor} strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                  </div>
                </div>
                
                <div className="hc-bottom">
                  <div className="hc-stats-grid">
                    <div className="hc-stat">
                      <span className="dot dot-success"></span>
                      <strong>{correct}</strong> D
                    </div>
                    <div className="hc-stat">
                      <span className="dot dot-error"></span>
                      <strong>{wrong}</strong> Y
                    </div>
                    <div className="hc-stat">
                      <span className="dot dot-neutral"></span>
                      <strong>{blank}</strong> B
                    </div>
                    <div className="hc-stat">
                      <span className="dot dot-total"></span>
                      <strong>{total}</strong> T
                    </div>
                  </div>
                  
                  <div className="hc-actions">
                    <button className="hc-action-btn delete-btn" onClick={() => handleDelete(index)} aria-label="Sil">
                      <Trash2 size={16} />
                    </button>
                    <button className="hc-action-btn view-btn" onClick={() => navigate('/results', { state: { resultData: record } })} aria-label="Detayları Gör">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
