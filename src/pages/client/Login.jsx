import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = tab === 'login'
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password, form.phone);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocorreu um erro. Tente novamente.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📱 GuedesIphone</div>
        <div className="login-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Entrar</button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Criar conta</button>
        </div>
        <form onSubmit={submit} className="login-form">
          {tab === 'register' && (
            <>
              <input className="input" name="name" placeholder="Seu nome" value={form.name} onChange={handle} required />
              <input className="input" name="phone" placeholder="Telefone (opcional)" value={form.phone} onChange={handle} />
            </>
          )}
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required />
          <input className="input" name="password" type="password" placeholder="Senha" value={form.password} onChange={handle} required />
          {error && <div className="login-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
        <div className="login-back"><Link to="/">← Voltar à loja</Link></div>
      </div>
    </div>
  );
}
