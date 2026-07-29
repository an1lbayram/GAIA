import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import questionsData from '../data/questions.json';
import { ArrowRight, CheckCircle, XCircle, AlertCircle, Award, Star, Clock, Volume2, VolumeX } from 'lucide-react';
import './Quiz.css';

const shuffleArray = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const getQuestionsForSubject = (subjectId, customQuestions) => {
  if (customQuestions && Array.isArray(customQuestions)) {
    return customQuestions;
  }
  if (subjectId === 'karma-test') {
    const allQs = [];
    Object.keys(questionsData).forEach(sKey => {
      if (Array.isArray(questionsData[sKey])) {
        questionsData[sKey].forEach(q => allQs.push({ ...q, subjectId: sKey }));
      }
    });
    return shuffleArray(allQs).slice(0, 20);
  }
  const subjectQs = questionsData[subjectId];
  if (subjectQs) {
    return shuffleArray(subjectQs);
  }
  return [];
};

const Quiz = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [questions] = useState(() => 
    getQuestionsForSubject(subjectId, location.state?.customQuestions)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersMap, setAnswersMap] = useState({});
  const [starredQuestions, setStarredQuestions] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  // Elapsed timer effect
  useEffect(() => {
    if (questions.length === 0) return;
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [questions.length]);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  // Sound feedback helper
  const playFeedbackSound = useCallback((isCorrect) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      /* silent catch */
    }
  }, [soundEnabled]);

  const toggleStar = (qId) => {
    setStarredQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleOptionClick = useCallback((optionIdx) => {
    if (selectedAnswer !== null || !currentQuestion) return;
    
    setSelectedAnswer(optionIdx);
    setShowExplanation(true);

    const isCorrect = optionIdx === currentQuestion.correct;
    playFeedbackSound(isCorrect);

    setAnswersMap(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        options: currentQuestion.options,
        correct: currentQuestion.correct,
        selected: optionIdx,
        explanation: currentQuestion.explanation,
        isStarred: !!starredQuestions[currentQuestion.id]
      }
    }));
  }, [selectedAnswer, currentQuestion, starredQuestions, playFeedbackSound]);

  const finishQuiz = useCallback((updatedMap) => {
    const finalAnswers = questions.map(q => {
      if (updatedMap[q.id]) {
        return {
          ...updatedMap[q.id],
          isStarred: !!starredQuestions[q.id]
        };
      }
      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        correct: q.correct,
        selected: null,
        explanation: q.explanation,
        isStarred: !!starredQuestions[q.id]
      };
    });

    const resultData = {
      subjectId: subjectId || 'custom',
      date: new Date().toISOString(),
      elapsedSeconds: elapsedTime,
      answers: finalAnswers
    };

    try {
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      history.unshift(resultData);
      localStorage.setItem('quizHistory', JSON.stringify(history));
    } catch {
      /* ignore storage errors */
    }

    navigate('/results', { state: { resultData } });
  }, [questions, starredQuestions, subjectId, elapsedTime, navigate]);

  const handleFinishEarly = () => {
    if (window.confirm("Testi erken bitirmek istediğinize emin misiniz? Cevaplamadığınız sorular boş bırakılacak.")) {
      finishQuiz(answersMap);
    }
  };

  const handleNext = useCallback((skipped = false) => {
    let currentMap = answersMap;

    if (skipped && !isAnswered && currentQuestion) {
      currentMap = {
        ...answersMap,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          options: currentQuestion.options,
          correct: currentQuestion.correct,
          selected: null,
          explanation: currentQuestion.explanation,
          isStarred: !!starredQuestions[currentQuestion.id]
        }
      };
      setAnswersMap(currentMap);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishQuiz(currentMap);
    }
  }, [answersMap, isAnswered, currentQuestion, starredQuestions, currentIndex, questions.length, finishQuiz]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentQuestion) return;

      const keyUpper = e.key.toUpperCase();
      let optIdx = -1;
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        optIdx = parseInt(e.key, 10) - 1;
      } else if (['A', 'B', 'C', 'D', 'E'].includes(keyUpper)) {
        optIdx = keyUpper.charCodeAt(0) - 65;
      }

      if (optIdx >= 0 && optIdx < currentQuestion.options.length && !isAnswered) {
        handleOptionClick(optIdx);
      } else if ((e.key === 'Enter' || e.key === 'ArrowRight')) {
        if (isAnswered) {
          handleNext(false);
        } else if (e.key === 'ArrowRight') {
          handleNext(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isAnswered, handleOptionClick, handleNext]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-empty-container animate-fade-in">
        <div className="glass-panel text-center" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2>Soru Bulunamadı</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Seçtiğiniz ders için henüz soru tanımlanmamıştır.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container animate-fade-in">
      <div className="quiz-header">
        <div className="quiz-progress-wrapper">
          <div className="quiz-progress-info">
            <div>
              <span className="quiz-subject-label">
                {subjectId === 'karma-test' ? '🔀 Karma Sınav Simülasyonu' : 'Test İlerlemesi'}
              </span>
              <span className="quiz-step">Soru {currentIndex + 1} / {questions.length}</span>
            </div>

            <div className="quiz-header-right">
              <div className="quiz-timer-badge">
                <Clock size={14} /> {formatTimer(elapsedTime)}
              </div>

              <button 
                className="sound-toggle-btn" 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button 
                className="btn-finish-early"
                onClick={handleFinishEarly}
              >
                Testi Bitir
              </button>
            </div>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="question-card glass-panel animate-fade-in-delayed">
        <div className="q-card-header">
          <div className="q-badge">Soru {currentIndex + 1}</div>
          <button 
            className={`star-btn ${starredQuestions[currentQuestion.id] ? 'starred' : ''}`}
            onClick={() => toggleStar(currentQuestion.id)}
            title={starredQuestions[currentQuestion.id] ? 'Yıldızı Kaldır' : 'Soruyu Yıldızla'}
          >
            <Star size={18} fill={starredQuestions[currentQuestion.id] ? '#f59e0b' : 'none'} />
          </button>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            let className = "option-btn";
            if (isAnswered) {
              if (index === currentQuestion.correct) className += " correct";
              else if (index === selectedAnswer) className += " incorrect";
              else className += " disabled";
            }

            return (
              <button 
                key={index} 
                className={className}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
              >
                <div className="option-marker">{String.fromCharCode(65 + index)}</div>
                <div className="option-text">{option}</div>
                {isAnswered && index === currentQuestion.correct && <CheckCircle className="status-icon" size={20} />}
                {isAnswered && index === selectedAnswer && index !== currentQuestion.correct && <XCircle className="status-icon" size={20} />}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className={`explanation-box glass-panel animate-fade-in ${selectedAnswer === currentQuestion.correct ? 'success' : 'error'}`}>
          <div className="explanation-header">
            {selectedAnswer === currentQuestion.correct ? (
              <><Award size={20} /> <strong>Tebrikler, Doğru!</strong></>
            ) : (
              <><AlertCircle size={20} /> <strong>Yanlış Cevap</strong></>
            )}
          </div>
          <p className="explanation-text">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="quiz-footer visible">
        {!isAnswered ? (
          <button className="btn-secondary next-btn" onClick={() => handleNext(true)}>
            {currentIndex === questions.length - 1 ? 'Boş Bırak ve Bitir' : 'Boş Bırak ve Geç (Sağ Ok)'} 
            <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn-primary next-btn" onClick={() => handleNext(false)}>
            {currentIndex === questions.length - 1 ? 'Testi Bitir ve Sonuçları Gör' : 'Sonraki Soru (Enter)'} 
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
