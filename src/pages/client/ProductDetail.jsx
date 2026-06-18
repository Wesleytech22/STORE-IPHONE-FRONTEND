import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './ProductDetail.css';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${slug}`).then(r => setProduct(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="product-detail-loading">Carregando...</div>;
  if (!product) return (
    <div className="product-detail-404">
      <h2>Produto não encontrado</h2>
      <Link to="/catalogo" className="btn btn-primary">Voltar ao catálogo</Link>
    </div>
  );

  const images = product.images?.length
    ? product.images.map(i => `${API_URL}${i}`)
    : ['https://placehold.co/600x600/f5f5f7/1d1d1f?text=iPhone'];

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100) : null;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Início</Link> / <Link to="/catalogo">Catálogo</Link> / {product.name}
        </div>

        <div className="product-detail__layout">
          <div className="product-detail__gallery">
            <div className="product-detail__main-img">
              <img src={images[imgIdx]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbs">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" className={imgIdx === i ? 'active' : ''} onClick={() => setImgIdx(i)} />
                ))}
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <span className={`badge badge-${product.condition}`}>{product.condition}</span>
            {product.category_name && <span className="product-detail__category">{product.category_name}</span>}
            <h1>{product.name}</h1>

            <div className="product-detail__price-block">
              {discount && <span className="product-detail__discount">-{discount}% OFF</span>}
              {product.original_price && (
                <div className="product-detail__original">
                  R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              )}
              <div className="product-detail__price">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="product-detail__specs">
              {product.storage && <div className="spec"><span>Armazenamento</span><strong>{product.storage}</strong></div>}
              {product.color && <div className="spec"><span>Cor</span><strong>{product.color}</strong></div>}
              {product.battery_health && <div className="spec"><span>Bateria</span><strong>{product.battery_health}%</strong></div>}
              <div className="spec"><span>Estoque</span><strong>{product.stock > 0 ? `${product.stock} un.` : 'Indisponível'}</strong></div>
            </div>

            {product.description && <p className="product-detail__description">{product.description}</p>}

            <div className="product-detail__actions">
              {product.stock > 0 ? (
                <div className="product-detail__cta">
                  <p>Interessado? Fale com a gente pelo chat ou WhatsApp!</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary btn-lg" onClick={() => document.querySelector('.chat-fab')?.click()}>
                      💬 Falar no Chat
                    </button>
                  </div>
                </div>
              ) : (
                <div className="product-detail__unavailable">😕 Produto indisponível no momento</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
