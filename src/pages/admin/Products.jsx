import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', original_price: '', stock: '', category_id: '', condition: 'novo', storage: '', color: '', battery_health: '', is_featured: false });
  const [images, setImages] = useState([]);

  const load = () => {
    api.get(`/products?limit=50${search ? '&search=' + search : ''}`).then(r => { setProducts(r.data.products); setTotal(r.data.total); });
  };

  useEffect(() => { load(); }, [search]);
  useEffect(() => { api.get('/categories').then(r => setCategories(r.data.categories)); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', price: '', original_price: '', stock: '', category_id: '', condition: 'novo', storage: '', color: '', battery_health: '', is_featured: false }); setImages([]); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, is_featured: p.is_featured === 1 }); setImages([]); setShowForm(true); };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(f => fd.append('images', f));
    try {
      if (editing) await api.put(`/admin/products/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false); load();
    } catch (err) { alert(err.response?.data?.error || 'Erro'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remover produto?')) return;
    await api.delete(`/admin/products/${id}`); load();
  };

  const toggle = async (p) => {
    await api.put(`/admin/products/${p.id}`, { ...p, is_active: p.is_active === 1 ? 0 : 1 });
    load();
  };

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <div className="admin-logo">📱 Admin</div>
        <nav className="admin-nav">
          <Link to="/admin">🏠 Dashboard</Link>
          <Link to="/admin/produtos" className="active">📦 Produtos</Link>
          <Link to="/admin/categorias">🏷️ Categorias</Link>
          <Link to="/admin/chat">💬 Chat</Link>
          <Link to="/admin/configuracoes">⚙️ Configurações</Link>
          <Link to="/">🌐 Ver Loja</Link>
        </nav>
      </div>
      <main className="admin-main">
        <h1>Produtos ({total})</h1>
        <div className="admin-toolbar">
          <input className="input" placeholder="Buscar produto..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openCreate}>+ Novo Produto</button>
        </div>

        {showForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-card">
              <div className="admin-form-header">
                <h3>{editing ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={submit} className="admin-form">
                <div className="form-row">
                  <div><label>Nome *</label><input className="input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
                  <div><label>Categoria</label>
                    <select className="input" value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))}>
                      <option value="">Selecione</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div><label>Descrição</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
                <div className="form-row">
                  <div><label>Preço *</label><input className="input" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required /></div>
                  <div><label>Preço original</label><input className="input" type="number" step="0.01" value={form.original_price} onChange={e => setForm(f => ({...f, original_price: e.target.value}))} /></div>
                  <div><label>Estoque</label><input className="input" type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} /></div>
                </div>
                <div className="form-row">
                  <div><label>Condição</label>
                    <select className="input" value={form.condition} onChange={e => setForm(f => ({...f, condition: e.target.value}))}>
                      <option value="novo">Novo</option><option value="seminovo">Seminovo</option><option value="usado">Usado</option>
                    </select>
                  </div>
                  <div><label>Armazenamento</label><input className="input" placeholder="256GB" value={form.storage} onChange={e => setForm(f => ({...f, storage: e.target.value}))} /></div>
                  <div><label>Cor</label><input className="input" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} /></div>
                </div>
                <div className="form-row">
                  <div><label>Saúde da bateria (%)</label><input className="input" type="number" min="0" max="100" value={form.battery_health} onChange={e => setForm(f => ({...f, battery_health: e.target.value}))} /></div>
                  <div className="form-check"><label><input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} /> Produto em destaque</label></div>
                </div>
                <div><label>Imagens</label><input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} /></div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-section">
          <table className="admin-table">
            <thead><tr><th>Produto</th><th>Preço</th><th>Estoque</th><th>Condição</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.images?.[0] && <img src={`${API_URL}${p.images[0]}`} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        {p.storage && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.storage} • {p.color}</div>}
                      </div>
                    </div>
                  </td>
                  <td>R$ {p.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td><span style={{ color: p.stock === 0 ? 'var(--danger)' : p.stock <= 2 ? 'var(--warning)' : 'inherit', fontWeight: p.stock <= 2 ? 600 : 400 }}>{p.stock}</span></td>
                  <td><span className={`badge badge-${p.condition}`}>{p.condition}</span></td>
                  <td><span style={{ color: p.is_active ? 'var(--success)' : 'var(--text-light)' }}>{p.is_active ? '● Ativo' : '○ Inativo'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => toggle(p)}>{p.is_active ? 'Desativar' : 'Ativar'}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(p.id)}>Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
