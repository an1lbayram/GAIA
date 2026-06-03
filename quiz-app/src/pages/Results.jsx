import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, List, MinusCircle } from 'lucide-react';
import './Results.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, correct, wrong, blank
  const resultData = location.state?.resultData;

  if (!resultData) {
    return (
      <div className="results-empty-container text-center animate-fade-in">
        <div className="glass-panel" style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Sonuç bulunamadı</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Lütfen önce bir testi tamamlayın.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  const total = resultData.answers.length;
  let correctCount = 0;
  let wrongCount = 0;
  let blankCount = 0;

  resultData.answers.forEach(ans => {
    if (ans.selected === null) blankCount++;
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
        'rgba(16, 185, 129, 0.8)', 
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)', 
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)'
      ],
      borderWidth: 0,
      hoverOffset: 4
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
    if (filter === 'wrong') return ans.selected !== null && ans.selected !== ans.correct;
    if (filter === 'blank') return ans.selected === null;
    return true;
  });

  return (
    <div className="results-container animate-fade-in">
      <div className="results-header text-center">
        <h1 className="results-title">Sınav Analizi</h1>
        <p className="results-subtitle">Testi tamamladınız, işte detaylı sonuçlarınız.</p>
      </div>
      
      <div className="score-dashboard glass-panel">
        <div className="score-chart-wrapper">
          <div className="doughnut-container">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="doughnut-center-text" style={{ color: scoreColor }}>
              <span className="percent-value">{percentage}%</span>
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
            <div className="stat-icon-box neutral-bg" style={{background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)'}}><MinusCircle size={24} /></div>
            <div className="stat-info">
              <span className="stat-num">{blankCount}</span>
              <span className="stat-name">Boş Bırakılan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="review-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Soru Kontrolü</h2>
            <p>Tüm soruları ve doğru cevapları detaylıca inceleyin</p>
          </div>
          
          <div className="filter-tabs">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tümü ({total})</button>
            <button className={`filter-btn ${filter === 'correct' ? 'active' : ''}`} onClick={() => setFilter('correct')}>Doğru ({correctCount})</button>
            <button className={`filter-btn ${filter === 'wrong' ? 'active' : ''}`} onClick={() => setFilter('wrong')}>Yanlış ({wrongCount})</button>
            <button className={`filter-btn ${filter === 'blank' ? 'active' : ''}`} onClick={() => setFilter('blank')}>Boş ({blankCount})</button>
          </div>
        </div>
        
        <div className="review-list">
          {filteredAnswers.map((ans, idx) => {
            const originalIndex = resultData.answers.findIndex(a => a.question === ans.question);
            const isCorrect = ans.selected === ans.correct;
            const isBlank = ans.selected === null;

            return (
              <div key={originalIndex} className="review-card glass-panel animate-fade-in-delayed" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="review-q-badge">Soru {originalIndex + 1}</div>
                <h3 className="review-q-text">{ans.question}</h3>
                
                <div className="review-compare">
                  <div className={`compare-item ${isCorrect ? 'actual-correct' : isBlank ? 'user-blank' : 'user-wrong'}`}>
                    <div className="compare-icon">
                      {isCorrect ? <CheckCircle size={18} /> : isBlank ? <MinusCircle size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="compare-content">
                      <span className="compare-label">Sizin Cevabınız</span>
                      <span className="compare-value">{isBlank ? 'Boş Bırakıldı' : ans.options[ans.selected]}</span>
                    </div>
                  </div>
                  
                  {!isCorrect && (
                    <div className="compare-item actual-correct">
                      <div className="compare-icon"><CheckCircle size={18} /></div>
                      <div className="compare-content">
                        <span className="compare-label">Doğru Cevap</span>
                        <span className="compare-value">{ans.options[ans.correct]}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="review-explanation">
                  <h4 className="exp-title">Açıklama / Çözüm</h4>
                  <p className="exp-text">{ans.explanation}</p>
                </div>
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
