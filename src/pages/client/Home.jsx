import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/client/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/products/featured').then(r => setFeatured(r.data.products));
    api.get('/categories').then(r => setCategories(r.data.categories));
    api.get('/settings').then(r => setSettings(r.data.settings));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-tag">✨ Loja Oficial</span>
            <h1>{settings.hero_title || 'iPhones Originais com Garantia'}</h1>
            <p>{settings.hero_subtitle || 'Novos e Seminovos com procedência e qualidade garantida'}</p>
            <div className="hero-actions">
              <Link to="/catalogo" className="btn btn-primary btn-lg">Ver Catálogo</Link>
              <Link to="/catalogo?condition=seminovo" className="btn btn-secondary btn-lg">Seminovos</Link>
            </div>
            <div className="hero-stats">
              <div><strong>100%</strong><span>Originais</span></div>
              <div><strong>Garantia</strong><span>em todos</span></div>
              <div><strong>Suporte</strong><span>via chat</span></div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-phone">📱</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Categorias</h2>
            <div className="categories-grid">
              {categories.filter(c => c.product_count > 0).map(cat => (
                <Link key={cat.id} to={`/catalogo?category=${cat.slug}`} className="category-chip">
                  {cat.name}
                  <span className="category-count">{cat.product_count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section section-gray">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Destaques</h2>
              <Link to="/catalogo" className="btn btn-secondary btn-sm">Ver todos →</Link>
            </div>
            <div className="grid grid-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA WhatsApp */}
      {settings.store_whatsapp && (
        <section className="section">
          <div className="container">
            <div className="cta-card">
              <div>
                <h3>Tem alguma dúvida?</h3>
                <p>Fale diretamente com a gente pelo WhatsApp</p>
              </div>
              <a href={`https://wa.me/55${settings.store_whatsapp?.replace(/\D/g, '')}`}
                className="btn btn-primary" target="_blank" rel="noreferrer">
                📲 Chamar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
