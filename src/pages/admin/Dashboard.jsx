import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { connectSocket } from '../../services/socket';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/admin/products/stats').then(r => setStats(r.data));
    api.get('/admin/chat/rooms').then(r => setRooms(r.data.rooms));
    api.get('/admin/chat/unread').then(r => setUnread(r.data.count));

    const socket = connectSocket();
    socket.emit('join_admin');
    socket.on('room_updated', () => {
      api.get('/admin/chat/rooms').then(r => setRooms(r.data.rooms));
      api.get('/admin/chat/unread').then(r => setUnread(r.data.count));
    });
    return () => socket.off('room_updated');
  }, []);

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <div className="admin-logo">📱 Admin</div>
        <nav className="admin-nav">
          <Link to="/admin" className="active">🏠 Dashboard</Link>
          <Link to="/admin/produtos">📦 Produtos</Link>
          <Link to="/admin/categorias">🏷️ Categorias</Link>
          <Link to="/admin/chat">💬 Chat {unread > 0 && <span className="admin-badge">{unread}</span>}</Link>
          <Link to="/admin/configuracoes">⚙️ Configurações</Link>
          <Link to="/">🌐 Ver Loja</Link>
        </nav>
      </div>

      <main className="admin-main">
        <h1>Dashboard</h1>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div><div className="stat-value">{stats?.totalProducts ?? '-'}</div><div className="stat-label">Produtos ativos</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗃️</div>
            <div><div className="stat-value">{stats?.totalStock ?? '-'}</div><div className="stat-label">Total em estoque</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div><div className="stat-value">{rooms.filter(r => r.status === 'open').length}</div><div className="stat-label">Conversas abertas</div></div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div><div className="stat-value">{stats?.lowStock?.length ?? 0}</div><div className="stat-label">Estoque baixo</div></div>
          </div>
        </div>

        {stats?.lowStock?.length > 0 && (
          <div className="admin-section">
            <h2>⚠️ Produtos com estoque baixo</h2>
            <table className="admin-table">
              <thead><tr><th>Produto</th><th>Estoque</th><th>Condição</th><th></th></tr></thead>
              <tbody>
                {stats.lowStock.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><span style={{ color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)', fontWeight: 600 }}>{p.stock}</span></td>
                    <td><span className={`badge badge-${p.condition}`}>{p.condition}</span></td>
                    <td><Link to="/admin/produtos" className="btn btn-sm btn-secondary">Editar</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rooms.length > 0 && (
          <div className="admin-section">
            <h2>💬 Conversas recentes</h2>
            <div className="room-list">
              {rooms.slice(0, 5).map(r => (
                <Link key={r.id} to={`/admin/chat?room=${r.id}`} className="room-item">
                  <div className="room-avatar">{r.user_name[0].toUpperCase()}</div>
                  <div className="room-info">
                    <div className="room-name">{r.user_name} {r.unread > 0 && <span className="admin-badge">{r.unread}</span>}</div>
                    <div className="room-last">{r.last_message || 'Sem mensagens'}</div>
                  </div>
                  <div className={`room-status ${r.status}`}>{r.status}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
