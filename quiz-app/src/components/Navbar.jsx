import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, History, Home, X, Timer } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme, isPomoOpen, setIsPomoOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">GA<span className="logo-accent">IA</span></span>
        </Link>

        <nav className="navbar-nav">
          <Link to="/" className="nav-item">
            <Home size={18} />
            <span>Ana Sayfa</span>
          </Link>
          <Link to="/history" className="nav-item">
            <History size={18} />
            <span>Geçmiş</span>
          </Link>
        </nav>

        <div className="navbar-actions">
          <button className={`icon-btn ${isPomoOpen ? 'active' : ''}`} onClick={() => setIsPomoOpen(!isPomoOpen)} aria-label="Pomodoro">
            <Timer size={18} />
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Tema Değiştir">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button className="icon-btn mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menü">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="mobile-nav animate-fade-in">
          <Link to="/" onClick={() => setIsOpen(false)}><Home size={18}/> Ana Sayfa</Link>
          <Link to="/history" onClick={() => setIsOpen(false)}><History size={18}/> Geçmiş</Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
