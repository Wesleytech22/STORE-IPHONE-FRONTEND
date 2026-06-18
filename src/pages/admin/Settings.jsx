import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

export default function AdminSettings() {
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/settings').then(r => setForm(r.data.settings || {})); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.put('/admin/settings', form);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const h = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <div className="admin-logo">📱 Admin</div>
        <nav className="admin-nav">
          <Link to="/admin">🏠 Dashboard</Link>
          <Link to="/admin/produtos">📦 Produtos</Link>
          <Link to="/admin/categorias">🏷️ Categorias</Link>
          <Link to="/admin/chat">💬 Chat</Link>
          <Link to="/admin/configuracoes" className="active">⚙️ Configurações</Link>
          <Link to="/">🌐 Ver Loja</Link>
        </nav>
      </div>
      <main className="admin-main">
        <h1>Configurações da Loja</h1>
        <form onSubmit={submit}>
          <div className="admin-section">
            <h2>Informações</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['store_name','Nome da loja'],['store_phone','Telefone'],['store_whatsapp','WhatsApp (só números)'],['store_instagram','Instagram'],['store_address','Endereço'],['store_hours','Horário de funcionamento']].map(([name, label]) => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>
                  <input className="input" name={name} value={form[name] || ''} onChange={h} />
                </div>
              ))}
            </div>
          </div>
          <div className="admin-section">
            <h2>Página inicial</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['hero_title','Título do banner'],['hero_subtitle','Subtítulo do banner']].map(([name, label]) => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>
                  <input className="input" name={name} value={form[name] || ''} onChange={h} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button type="submit" className="btn btn-primary btn-lg">Salvar configurações</button>
            {saved && <span style={{ color: 'var(--success)', fontWeight: 500 }}>✓ Salvo com sucesso!</span>}
          </div>
        </form>
      </main>
    </div>
  );
}
