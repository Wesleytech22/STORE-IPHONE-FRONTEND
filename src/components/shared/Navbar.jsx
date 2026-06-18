import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📱</span>
          <span className="logo-text">Guedes<strong>iPhone</strong></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</Link>
          <Link to="/catalogo?condition=novo" onClick={() => setMenuOpen(false)}>Novos</Link>
          <Link to="/catalogo?condition=seminovo" onClick={() => setMenuOpen(false)}>Seminovos</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>
                  Painel Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-sm btn-secondary">Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>Entrar</Link>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
