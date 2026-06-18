import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/client/ProductCard';
import './Catalog.css';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const condition = searchParams.get('condition') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (condition) params.set('condition', condition);

    api.get(`/products?${params}`).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
    }).finally(() => setLoading(false));
  }, [search, category, condition, page]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="catalog">
      <div className="container">
        <div className="catalog-header">
          <h1>Catálogo</h1>
          <p>{total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
        </div>

        <div className="catalog-layout">
          <aside className="catalog-filters">
            <div className="filter-group">
              <label>Buscar</label>
              <input className="input" placeholder="Nome do produto..." defaultValue={search}
                onChange={e => setFilter('search', e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Categoria</label>
              <div className="filter-chips">
                <button className={`filter-chip ${!category ? 'active' : ''}`} onClick={() => setFilter('category', '')}>Todas</button>
                {categories.map(c => (
                  <button key={c.id} className={`filter-chip ${category === c.slug ? 'active' : ''}`}
                    onClick={() => setFilter('category', c.slug)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Condição</label>
              <div className="filter-chips">
                {['', 'novo', 'seminovo', 'usado'].map(c => (
                  <button key={c} className={`filter-chip ${condition === c ? 'active' : ''}`}
                    onClick={() => setFilter('condition', c)}>
                    {c || 'Todas'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="catalog-products">
            {loading ? (
              <div className="catalog-loading">Carregando produtos...</div>
            ) : products.length === 0 ? (
              <div className="catalog-empty">
                <p>Nenhum produto encontrado.</p>
                <button className="btn btn-secondary" onClick={() => setSearchParams({})}>Limpar filtros</button>
              </div>
            ) : (
              <>
                <div className="grid grid-3">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-btn ${page === p ? 'active' : ''}`}
                        onClick={() => setFilter('page', p)}>{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
