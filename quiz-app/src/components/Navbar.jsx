import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, History, Home, X, Timer } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme, isPomoOpen, setIsPomoOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-icon">🎓</span>
          <span className="logo-text">GA<span className="logo-accent">IA</span></span>
        </Link>

        <nav className="navbar-nav">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={18} />
            <span>Ana Sayfa</span>
          </Link>
          <Link to="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
            <History size={18} />
            <span>Geçmiş</span>
          </Link>
        </nav>

        <div className="navbar-actions">
          <button 
            className={`icon-btn ${isPomoOpen ? 'active' : ''}`} 
            onClick={() => setIsPomoOpen(!isPomoOpen)} 
            aria-label="Pomodoro Zamanlayıcı"
            title="Pomodoro Zamanlayıcı"
          >
            <Timer size={18} />
          </button>
          <button 
            className="icon-btn" 
            onClick={toggleTheme} 
            aria-label="Tema Değiştir"
            title={theme === 'light' ? 'Koyu Moda Geç' : 'Aydınlık Moda Geç'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            className="icon-btn mobile-toggle" 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Menüyü Aç/Kapat"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="mobile-nav animate-fade-in">
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsOpen(false)}>
            <Home size={18}/> Ana Sayfa
          </Link>
          <Link to="/history" className={isActive('/history') ? 'active' : ''} onClick={() => setIsOpen(false)}>
            <History size={18}/> Geçmiş
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
