import React from 'react';
import '../styles/Footer.css';

import { Link } from 'react-router-dom';

function Footer() {
  
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-social">
          <a href="https://www.facebook.com" className="footer-social-icon">Facebook</a>
          <a href="https://www.twitter.com" className="footer-social-icon">Twitter</a>
          <a href="https://www.instagram.com" className="footer-social-icon">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Proyecto final de curso.</p>
        <Link to="/privacity"  className="privacy-link">Política de privacidad</Link>
      </div>
    </footer>
  );
}

export default Footer;
