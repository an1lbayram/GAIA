import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import { ArrowRight, CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';
import './Quiz.css';

const Quiz = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const subjectQuestions = questionsData[subjectId];
    if (subjectQuestions) {
      const shuffled = [...subjectQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
    } else {
      setQuestions([]);
    }
  }, [subjectId]);

  if (questions.length === 0) {
    return (
      <div className="quiz-empty-container animate-fade-in">
        <div className="glass-panel text-center" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2>Bu ders için soru bulunamadı.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>İçerik yakında eklenecektir.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selected: index,
        correct: currentQuestion.correct,
        question: currentQuestion.question,
        explanation: currentQuestion.explanation,
        options: currentQuestion.options
      }
    }));
  };

  const handleFinishEarly = () => {
    if (window.confirm("Testi erken bitirmek istediğinize emin misiniz? Cevaplamadığınız kalan sorular boş bırakılmış sayılacak.")) {
      const remainingAnswers = {};
      for (let i = currentIndex; i < questions.length; i++) {
        const q = questions[i];
        if (!answers[q.id]) {
          remainingAnswers[q.id] = {
            selected: null,
            correct: q.correct,
            question: q.question,
            explanation: q.explanation,
            options: q.options
          };
        }
      }
      
      const allAnswersObj = { ...answers, ...remainingAnswers };
      
      const resultData = {
        subjectId,
        date: new Date().toISOString(),
        answers: Object.values(allAnswersObj)
      };
      
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      history.push(resultData);
      localStorage.setItem('quizHistory', JSON.stringify(history));
      
      navigate('/results', { state: { resultData } });
    }
  };

  const handleNext = (skipped = false) => {
    if (skipped && !isAnswered) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          selected: null,
          correct: currentQuestion.correct,
          question: currentQuestion.question,
          explanation: currentQuestion.explanation,
          options: currentQuestion.options
        }
      }));
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const resultData = {
        subjectId,
        date: new Date().toISOString(),
        answers: Object.values(answers)
      };
      
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      history.push(resultData);
      localStorage.setItem('quizHistory', JSON.stringify(history));
      
      navigate('/results', { state: { resultData } });
    }
  };

  return (
    <div className="quiz-container animate-fade-in">
      <div className="quiz-header">
        <div className="quiz-progress-wrapper">
          <div className="quiz-progress-info">
            <div>
              <span className="quiz-subject-label">Test İlerlemesi</span>
              <span className="quiz-step">Soru {currentIndex + 1} / {questions.length}</span>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={handleFinishEarly}>
              Testi Bitir
            </button>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="question-card glass-panel animate-fade-in-delayed">
        <div className="q-badge">Soru {currentIndex + 1}</div>
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
            {currentIndex === questions.length - 1 ? 'Boş Bırak ve Bitir' : 'Boş Bırak ve Geç'} 
            <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn-primary next-btn" onClick={() => handleNext(false)}>
            {currentIndex === questions.length - 1 ? 'Testi Bitir ve Sonuçları Gör' : 'Sonraki Soru'} 
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
