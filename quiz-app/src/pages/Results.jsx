import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, List, MinusCircle, Star, Share2, Clock, RotateCcw, Check } from 'lucide-react';
import './Results.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, correct, wrong, blank, starred
  const [copied, setCopied] = useState(false);

  const resultData = location.state?.resultData;

  if (!resultData || !resultData.answers || resultData.answers.length === 0) {
    return (
      <div className="results-empty-container text-center animate-fade-in">
        <div className="glass-panel" style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Sonuç Bulunamadı</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>İncelenecek sınav verisi mevcut değil. Lütfen önce bir testi tamamlayın.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  const total = resultData.answers.length;
  let correctCount = 0;
  let wrongCount = 0;
  let blankCount = 0;
  let starredCount = 0;

  resultData.answers.forEach(ans => {
    if (ans.isStarred) starredCount++;
    if (ans.selected === null || ans.selected === undefined) blankCount++;
    else if (ans.selected === ans.correct) correctCount++;
    else wrongCount++;
  });

  const percentage = Math.round((correctCount / total) * 100);

  let scoreColor = 'var(--success)';
  if (percentage < 50) scoreColor = 'var(--error)';
  else if (percentage < 75) scoreColor = 'var(--warning)';

  const chartData = {
    labels: ['Doğru', 'Yanlış', 'Boş'],
    datasets: [{
      data: [correctCount, wrongCount, blankCount],
      backgroundColor: [
        'rgba(16, 185, 129, 0.85)', 
        'rgba(239, 68, 68, 0.85)',
        'rgba(245, 158, 11, 0.85)'
      ],
      borderWidth: 0,
      hoverOffset: 6
    }],
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 41, 0.9)',
        padding: 12,
        titleFont: { family: 'Inter', size: 14 },
        bodyFont: { family: 'Inter', size: 14 },
        cornerRadius: 8,
      }
    }
  };

  const filteredAnswers = resultData.answers.filter(ans => {
    if (filter === 'all') return true;
    if (filter === 'correct') return ans.selected === ans.correct;
    if (filter === 'wrong') return ans.selected !== null && ans.selected !== undefined && ans.selected !== ans.correct;
    if (filter === 'blank') return ans.selected === null || ans.selected === undefined;
    if (filter === 'starred') return !!ans.isStarred;
    return true;
  });

  const handleRetakeMistakes = () => {
    const missedQuestions = resultData.answers
      .filter(ans => ans.selected !== ans.correct)
      .map(ans => ({
        id: ans.questionId || Math.random(),
        question: ans.question,
        options: ans.options,
        correct: ans.correct,
        explanation: ans.explanation
      }));

    if (missedQuestions.length === 0) {
      alert("Tebrikler! Yanlış veya boş bıraktığınız soru yok.");
      return;
    }

    navigate(`/quiz/${resultData.subjectId || 'custom'}`, {
      state: { customQuestions: missedQuestions }
    });
  };

  const handleShareResult = () => {
    const shareText = `🎓 GAIA Sınav Sonucum:\n- Başarı Oranı: %${percentage}\n- Doğru: ${correctCount} | Yanlış: ${wrongCount} | Boş: ${blankCount}\n- Toplam Soru: ${total}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert(shareText);
    }
  };

  const formatSecs = (s) => {
    if (!s) return null;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m > 0 ? `${m} dk ` : ''}${sec} sn`;
  };

  return (
    <div className="results-container animate-fade-in">
      <div className="results-header text-center">
        <h1 className="results-title">Sınav Analizi</h1>
        <p className="results-subtitle">
          Testi tamamladınız! İşte detaylı performans analiziniz.
        </p>
        {resultData.elapsedSeconds && (
          <div className="elapsed-time-badge">
            <Clock size={14} /> Toplam Süre: {formatSecs(resultData.elapsedSeconds)}
          </div>
        )}
      </div>
      
      <div className="score-dashboard glass-panel">
        <div className="score-chart-wrapper">
          <div className="doughnut-container">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="doughnut-center-text" style={{ color: scoreColor }}>
              <span className="percent-value">%{percentage}</span>
              <span className="percent-label">Başarı</span>
            </div>
          </div>
        </div>

        <div className="score-stats">
          <div className="stat-card">
            <div className="stat-icon-box success-bg"><CheckCircle size={24} /></div>
            <div className="stat-info">
              <span className="stat-num">{correctCount}</span>
              <span className="stat-name">Doğru</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-box error-bg"><XCircle size={24} /></div>
            <div className="stat-info">
              <span className="stat-num">{wrongCount}</span>
              <span className="stat-name">Yanlış</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-box neutral-bg"><MinusCircle size={24} /></div>
            <div className="stat-info">
              <span className="stat-num">{blankCount}</span>
              <span className="stat-name">Boş Bırakılan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <div>
            <h2>Soru İnceleme & Çözümler</h2>
            <p>Tüm soruları, işaretlediğiniz şıkları ve açıklamalarını gözden geçirin</p>
          </div>
          
          <div className="filter-tabs">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tümü ({total})</button>
            <button className={`filter-btn ${filter === 'correct' ? 'active' : ''}`} onClick={() => setFilter('correct')}>Doğru ({correctCount})</button>
            <button className={`filter-btn ${filter === 'wrong' ? 'active' : ''}`} onClick={() => setFilter('wrong')}>Yanlış ({wrongCount})</button>
            <button className={`filter-btn ${filter === 'blank' ? 'active' : ''}`} onClick={() => setFilter('blank')}>Boş ({blankCount})</button>
            {starredCount > 0 && (
              <button className={`filter-btn starred ${filter === 'starred' ? 'active' : ''}`} onClick={() => setFilter('starred')}>
                <Star size={12} fill="#f59e0b" style={{ marginRight: '4px' }} /> Yıldızlı ({starredCount})
              </button>
            )}
          </div>
        </div>
        
        <div className="review-list">
          {filteredAnswers.map((ans, idx) => {
            const originalIndex = resultData.answers.findIndex(a => a.question === ans.question);
            const isCorrect = ans.selected === ans.correct;
            const isBlank = ans.selected === null || ans.selected === undefined;

            return (
              <div key={originalIndex !== -1 ? originalIndex : idx} className="review-card glass-panel animate-fade-in-delayed" style={{ animationDelay: `${idx * 0.04}s` }}>
                <div className="review-card-top">
                  <div className="review-q-badge">Soru {originalIndex !== -1 ? originalIndex + 1 : idx + 1}</div>
                  {ans.isStarred && (
                    <div className="starred-badge">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> Yıldızlandı
                    </div>
                  )}
                </div>

                <h3 className="review-q-text">{ans.question}</h3>
                
                <div className="review-compare">
                  <div className={`compare-item ${isCorrect ? 'actual-correct' : isBlank ? 'user-blank' : 'user-wrong'}`}>
                    <div className="compare-icon">
                      {isCorrect ? <CheckCircle size={18} /> : isBlank ? <MinusCircle size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="compare-content">
                      <span className="compare-label">Sizin Cevabınız</span>
                      <span className="compare-value">{isBlank ? 'Boş Bırakıldı' : ans.options ? ans.options[ans.selected] : `Şık ${ans.selected + 1}`}</span>
                    </div>
                  </div>
                  
                  {!isCorrect && (
                    <div className="compare-item actual-correct">
                      <div className="compare-icon"><CheckCircle size={18} /></div>
                      <div className="compare-content">
                        <span className="compare-label">Doğru Cevap</span>
                        <span className="compare-value">{ans.options ? ans.options[ans.correct] : `Şık ${ans.correct + 1}`}</span>
                      </div>
                    </div>
                  )}
                </div>

                {ans.explanation && (
                  <div className="review-explanation">
                    <h4 className="exp-title">Çözüm Açıklaması</h4>
                    <p className="exp-text">{ans.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredAnswers.length === 0 && (
            <div className="text-center glass-panel" style={{ padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>Bu filtreye uygun soru bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>

      <div className="results-actions">
        {wrongCount + blankCount > 0 && (
          <button className="btn-secondary" onClick={handleRetakeMistakes}>
            <RotateCcw size={18} /> Eksikleri Tekrar Çöz ({wrongCount + blankCount})
          </button>
        )}
        <button className="btn-secondary" onClick={handleShareResult}>
          {copied ? <Check size={18} color="var(--success)" /> : <Share2 size={18} />} 
          {copied ? 'Kopyalandı!' : 'Sonucu Paylaş'}
        </button>
        <button className="btn-secondary" onClick={() => navigate('/history')}>
          <List size={18} /> Geçmiş Sonuçlar
        </button>
        <button className="btn-primary" onClick={() => navigate('/')}>
          <RefreshCw size={18} /> Yeni Teste Başla
        </button>
      </div>
    </div>
  );
};

export default Results;
