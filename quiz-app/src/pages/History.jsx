import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Book, ArrowRight, Activity, Trash2, Download, Upload, BarChart2, Filter } from 'lucide-react';
import './History.css';

const subjects = {
  'bilgisayar-aglari': { name: 'Bilgisayar Ağları', color: '#3b82f6' },
  'bilisim-sistemleri': { name: 'Bilişim Sistemleri Analiz', color: '#10b981' },
  'gorsel-programlama': { name: 'Görsel Programlama', color: '#8b5cf6' },
  'karar-teorisi': { name: 'Karar Teorisi ve Analizi', color: '#f59e0b' },
  'makine-ogrenmesi': { name: 'Makine Öğrenmesi', color: '#ec4899' },
  'mobil-programlama': { name: 'Mobil Programlama', color: '#06b6d4' },
  'karma-test': { name: 'Karma Test (Tüm Dersler)', color: '#a78bfa' }
};

const History = () => {
  const navigate = useNavigate();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const fileInputRef = useRef(null);

  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      saved.sort((a, b) => new Date(b.date) - new Date(a.date));
      return saved;
    } catch {
      return [];
    }
  });

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('quizHistory', JSON.stringify(newHistory));
    } catch {
      /* ignore */
    }
  };

  const handleDelete = (indexToDelete) => {
    if (window.confirm('Bu test sonucunu silmek istediğinizden emin misiniz?')) {
      const newHistory = history.filter((_, idx) => idx !== indexToDelete);
      saveHistory(newHistory);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('TÜM sınav geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      saveHistory([]);
    }
  };

  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gaia_quiz_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportHistory = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          const merged = [...importedData, ...history].sort((a, b) => new Date(b.date) - new Date(a.date));
          saveHistory(merged);
          alert(`${importedData.length} kayıt başarıyla içeri aktarıldı!`);
        } else {
          alert('Geçersiz dosya formatı.');
        }
      } catch {
        alert('Dosya okuma hatası oluştu.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch {
      return dateString;
    }
  };

  const getSubjectInfo = (id) => {
    return subjects[id] || { name: id, color: '#6c5ce7' };
  };

  const analytics = useMemo(() => {
    if (history.length === 0) return null;

    let totalQs = 0;
    let totalCorrects = 0;
    const subjectScores = {};

    history.forEach(rec => {
      if (!rec.answers) return;
      const t = rec.answers.length;
      const c = rec.answers.filter(a => a.selected === a.correct).length;
      totalQs += t;
      totalCorrects += c;

      if (!subjectScores[rec.subjectId]) {
        subjectScores[rec.subjectId] = { correct: 0, total: 0 };
      }
      subjectScores[rec.subjectId].correct += c;
      subjectScores[rec.subjectId].total += t;
    });

    const avgScore = totalQs > 0 ? Math.round((totalCorrects / totalQs) * 100) : 0;

    let bestSubjectKey = null;
    let bestSubjectPct = -1;
    Object.keys(subjectScores).forEach(sKey => {
      const s = subjectScores[sKey];
      const pct = Math.round((s.correct / s.total) * 100);
      if (pct > bestSubjectPct) {
        bestSubjectPct = pct;
        bestSubjectKey = sKey;
      }
    });

    return {
      totalTests: history.length,
      totalQuestions: totalQs,
      avgScore,
      bestSubject: bestSubjectKey ? getSubjectInfo(bestSubjectKey).name : '-'
    };
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (selectedSubjectFilter === 'all') return history;
    return history.filter(h => h.subjectId === selectedSubjectFilter);
  }, [history, selectedSubjectFilter]);

  return (
    <div className="history-container animate-fade-in">
      <div className="history-header">
        <div>
          <h2>Sınav Geçmişiniz</h2>
          <p>Önceki performanslarınızı ve gelişiminizi takip edin</p>
        </div>

        {history.length > 0 && (
          <div className="history-header-actions">
            <button className="btn-secondary text-sm" onClick={handleExportHistory} title="Dışa Aktar">
              <Download size={15} /> Dışa Aktar
            </button>
            <button className="btn-secondary text-sm" onClick={() => fileInputRef.current?.click()} title="İçeri Aktar">
              <Upload size={15} /> İçeri Aktar
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportHistory} 
              accept=".json" 
              style={{ display: 'none' }} 
            />
            <button className="btn-secondary text-sm btn-clear-history" onClick={handleClearAll} title="Geçmişi Temizle">
              <Trash2 size={15} /> Temizle
            </button>
          </div>
        )}
      </div>

      {analytics && (
        <div className="analytics-summary-card glass-panel mb-8">
          <div className="analytics-stat">
            <div className="analytics-icon"><Activity size={20} /></div>
            <div>
              <span className="analytics-val">{analytics.totalTests}</span>
              <span className="analytics-lbl">Toplam Sınav</span>
            </div>
          </div>
          <div className="analytics-stat">
            <div className="analytics-icon"><BarChart2 size={20} /></div>
            <div>
              <span className="analytics-val">%{analytics.avgScore}</span>
              <span className="analytics-lbl">Ortalama Başarı</span>
            </div>
          </div>
          <div className="analytics-stat">
            <div className="analytics-icon"><Book size={20} /></div>
            <div>
              <span className="analytics-val">{analytics.totalQuestions}</span>
              <span className="analytics-lbl">Çözülen Soru</span>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-filter-bar">
          <Filter size={16} className="text-muted" />
          <span className="filter-label">Ders Filtrele:</span>
          <select 
            value={selectedSubjectFilter} 
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="history-select-filter"
          >
            <option value="all">Tüm Dersler</option>
            {Object.keys(subjects).map(sKey => (
              <option key={sKey} value={sKey}>{subjects[sKey].name}</option>
            ))}
          </select>
        </div>
      )}
      
      {filteredHistory.length === 0 ? (
        <div className="history-empty glass-panel text-center">
          <Activity size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>
            {history.length === 0 ? 'Henüz Hiç Test Çözmediniz' : 'Seçilen derse ait geçmiş bulunamadı'}
          </h3>
          <p>İlk testinize hemen başlayın ve gelişim istatistiklerinizi görün.</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/')}>Test Çözmeye Başla</button>
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map((record, index) => {
            const total = record.answers ? record.answers.length : 0;
            const correct = record.answers ? record.answers.filter(a => a.selected === a.correct).length : 0;
            const blank = record.answers ? record.answers.filter(a => a.selected === null || a.selected === undefined).length : 0;
            const wrong = total - correct - blank;
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
            const subInfo = getSubjectInfo(record.subjectId);
            
            let scoreColor = 'var(--success)';
            if (percentage < 50) scoreColor = 'var(--error)';
            else if (percentage < 75) scoreColor = 'var(--warning)';
            
            return (
              <div key={index} className="history-card glass-panel animate-fade-in-delayed" style={{ animationDelay: `${index * 0.04}s` }}>
                <div className="hc-top">
                  <div className="hc-badge" style={{ backgroundColor: `${subInfo.color}18`, color: subInfo.color }}>
                    <Book size={14} /> {subInfo.name}
                  </div>
                  <div className="hc-date">
                    <Clock size={14} /> {formatDate(record.date)}
                  </div>
                </div>
                
                <div className="hc-middle">
                  <div className="hc-score">
                    <span className="hc-score-val" style={{ color: scoreColor }}>%{percentage}</span>
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
                    <button className="hc-action-btn delete-btn" onClick={() => handleDelete(index)} aria-label="Sil" title="Sil">
                      <Trash2 size={16} />
                    </button>
                    <button className="hc-action-btn view-btn" onClick={() => navigate('/results', { state: { resultData: record } })} aria-label="Detayları Gör" title="Detayları Gör">
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
