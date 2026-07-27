import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import History from './pages/History';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Pomodoro from './components/Pomodoro';
import { ArrowUp } from 'lucide-react';
import './App.css'; 

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isPomoOpen, setIsPomoOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar theme={theme} toggleTheme={toggleTheme} isPomoOpen={isPomoOpen} setIsPomoOpen={setIsPomoOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:subjectId" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <Footer />
        <Pomodoro isOpen={isPomoOpen} setIsOpen={setIsPomoOpen} />
        
        {showScroll && (
          <button 
            className="scroll-up-btn animate-fade-in" 
            onClick={scrollToTop} 
            aria-label="Yukarı Çık"
            title="Yukarı Çık"
          >
            <ArrowUp size={22} />
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
