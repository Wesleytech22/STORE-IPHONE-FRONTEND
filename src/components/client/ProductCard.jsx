import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function ProductCard({ product }) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100) : null;

  const image = product.images?.[0]
    ? `${API_URL}${product.images[0]}`
    : 'https://placehold.co/400x400/f5f5f7/1d1d1f?text=iPhone';

  return (
    <Link to={`/produto/${product.slug}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img src={image} alt={product.name} className="product-card__image" />
        {discount && <span className="product-card__discount">-{discount}%</span>}
        {product.is_featured === 1 && <span className="product-card__badge">Destaque</span>}
      </div>
      <div className="product-card__info">
        <div className="product-card__condition">
          <span className={`badge badge-${product.condition}`}>{product.condition}</span>
          {product.storage && <span className="product-card__storage">{product.storage}</span>}
          {product.battery_health && <span className="product-card__battery">🔋 {product.battery_health}%</span>}
        </div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__pricing">
          {product.original_price && (
            <span className="product-card__original">
              R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          <span className="product-card__price">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        {product.stock === 0 && <span className="product-card__out">Sem estoque</span>}
        {product.stock > 0 && product.stock <= 2 && (
          <span className="product-card__low">Últimas {product.stock} unidades!</span>
        )}
      </div>
    </Link>
  );
}
