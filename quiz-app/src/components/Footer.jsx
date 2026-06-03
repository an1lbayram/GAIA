import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <Sparkles size={16} className="footer-sparkle" />
          <span className="footer-brand">GAIA</span>
        </div>
        
        <div className="footer-center">
          <span>Created by</span>
          <a href="https://an1lbayram.github.io/" target="_blank" rel="noopener noreferrer" className="footer-author">
            an1lbayram
          </a>
        </div>
        
        <div className="footer-right">
          <a href="https://an1lbayram.github.io/" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Website">
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
