import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/categories').then(r => setCategories(r.data.categories));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/admin/categories/${editing.id}`, form);
    else await api.post('/admin/categories', form);
    setForm({ name: '', description: '' }); setEditing(null); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Remover categoria?')) return;
    await api.delete(`/admin/categories/${id}`); load();
  };

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <div className="admin-logo">📱 Admin</div>
        <nav className="admin-nav">
          <Link to="/admin">🏠 Dashboard</Link>
          <Link to="/admin/produtos">📦 Produtos</Link>
          <Link to="/admin/categorias" className="active">🏷️ Categorias</Link>
          <Link to="/admin/chat">💬 Chat</Link>
          <Link to="/admin/configuracoes">⚙️ Configurações</Link>
          <Link to="/">🌐 Ver Loja</Link>
        </nav>
      </div>
      <main className="admin-main">
        <h1>Categorias</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
          <div className="admin-section">
            <h2>{editing ? 'Editar' : 'Nova'} categoria</h2>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Nome *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Descrição</label>
                <input className="input" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary">Salvar</button>
                {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}>Cancelar</button>}
              </div>
            </form>
          </div>
          <div className="admin-section">
            <h2>Todas as categorias</h2>
            <table className="admin-table">
              <thead><tr><th>Nome</th><th>Produtos</th><th>Ações</th></tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td><div style={{ fontWeight: 500 }}>{c.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.slug}</div></td>
                    <td>{c.product_count}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); }}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}>Remover</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
