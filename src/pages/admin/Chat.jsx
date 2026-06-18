import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { connectSocket } from '../../services/socket';
import './Admin.css';

export default function AdminChat() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchParams] = useSearchParams();
  const bottomRef = useRef();
  const socketRef = useRef();
  const { user } = { user: JSON.parse(localStorage.getItem('user') || '{}') };

  useEffect(() => {
    loadRooms();
    socketRef.current = connectSocket();
    socketRef.current.emit('join_admin');
    socketRef.current.on('room_updated', loadRooms);
    socketRef.current.on('new_message', (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => { socketRef.current?.off('room_updated'); socketRef.current?.off('new_message'); };
  }, []);

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId && rooms.length) {
      const r = rooms.find(r => r.id === roomId);
      if (r) openRoom(r);
    }
  }, [rooms, searchParams]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadRooms = () => api.get('/admin/chat/rooms').then(r => setRooms(r.data.rooms));

  const openRoom = (room) => {
    setActiveRoom(room);
    socketRef.current?.emit('join_room', room.id);
    api.get(`/chat/messages/${room.id}`).then(r => setMessages(r.data.messages));
  };

  const send = () => {
    if (!input.trim() || !activeRoom) return;
    socketRef.current?.emit('send_message', {
      roomId: activeRoom.id, senderName: user.name || 'Admin',
      senderRole: 'admin', senderId: user.id, message: input.trim()
    });
    setInput('');
  };

  const close = async (roomId) => {
    await api.put(`/admin/chat/rooms/${roomId}/close`);
    loadRooms();
    if (activeRoom?.id === roomId) setActiveRoom(null);
  };

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <div className="admin-logo">📱 Admin</div>
        <nav className="admin-nav">
          <Link to="/admin">🏠 Dashboard</Link>
          <Link to="/admin/produtos">📦 Produtos</Link>
          <Link to="/admin/categorias">🏷️ Categorias</Link>
          <Link to="/admin/chat" className="active">💬 Chat</Link>
          <Link to="/admin/configuracoes">⚙️ Configurações</Link>
          <Link to="/">🌐 Ver Loja</Link>
        </nav>
      </div>
      <main className="admin-main" style={{ padding: 0, display: 'flex', overflow: 'hidden', height: '100vh' }}>
        <div className="chat-admin-rooms">
          <div className="chat-admin-rooms-header">Conversas</div>
          {rooms.length === 0 && <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma conversa ainda</div>}
          {rooms.map(r => (
            <div key={r.id}
              className={`chat-admin-room-item ${activeRoom?.id === r.id ? 'active' : ''}`}
              onClick={() => openRoom(r)}>
              <div className="room-avatar" style={{ flexShrink: 0 }}>{r.user_name[0].toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {r.user_name} {r.unread > 0 && <span className="admin-badge">{r.unread}</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.last_message || 'Sem mensagens'}
                </div>
              </div>
              <div className={`room-status ${r.status}`}>{r.status}</div>
            </div>
          ))}
        </div>

        <div className="chat-admin-window">
          {!activeRoom ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Selecione uma conversa
            </div>
          ) : (
            <>
              <div className="chat-admin-window-header">
                <div>
                  <div style={{ fontWeight: 600 }}>{activeRoom.user_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{activeRoom.user_email}</div>
                </div>
                {activeRoom.status === 'open' && (
                  <button className="btn btn-sm btn-secondary" onClick={() => close(activeRoom.id)}>Encerrar conversa</button>
                )}
              </div>
              <div className="chat-admin-messages">
                {messages.map(m => (
                  <div key={m.id} className={`chat-message ${m.sender_role}`}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{m.sender_name}</div>
                    <div className="chat-bubble">{m.message}</div>
                    <div className="chat-time">{new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              {activeRoom.status === 'open' && (
                <div className="chat-admin-input">
                  <input className="input" placeholder="Responder..." value={input}
                    onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
                  <button className="btn btn-primary" onClick={send}>Enviar</button>
                </div>
              )}
              {activeRoom.status === 'closed' && (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, borderTop: '1px solid var(--border)' }}>
                  Conversa encerrada
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
