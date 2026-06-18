import React, { useState, useEffect, useRef } from 'react';
import { connectSocket } from '../../services/socket';
import api from '../../services/api';
import './ChatWidget.css';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('form'); // form | chat
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [room, setRoom] = useState(null);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    if (open && step === 'chat' && room) {
      socketRef.current = connectSocket();
      socketRef.current.emit('join_room', room.id);
      socketRef.current.on('new_message', (msg) => {
        setMessages(prev => [...prev, msg]);
        if (!open) setUnread(u => u + 1);
      });
      return () => socketRef.current?.off('new_message');
    }
  }, [open, step, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => { if (open) setUnread(0); }, [open]);

  const startChat = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/chat/room', { name, email });
      setRoom(data.room);
      setMessages(data.messages);
      setStep('chat');
    } catch { alert('Erro ao iniciar chat'); }
  };

  const send = () => {
    if (!input.trim() || !room) return;
    socketRef.current?.emit('send_message', {
      roomId: room.id, senderName: name,
      senderRole: 'customer', message: input.trim()
    });
    setInput('');
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">G</div>
              <div>
                <div className="chat-title">Guedes iPhone</div>
                <div className="chat-status">🟢 Online</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {step === 'form' ? (
            <form className="chat-form" onSubmit={startChat}>
              <p>Olá! Para iniciar a conversa, informe seus dados:</p>
              <input className="input" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
              <input className="input" type="email" placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button className="btn btn-primary" type="submit">Iniciar conversa</button>
            </form>
          ) : (
            <>
              <div className="chat-messages">
                <div className="chat-welcome">
                  👋 Olá, <strong>{name}</strong>! Como posso te ajudar?
                </div>
                {messages.map(m => (
                  <div key={m.id} className={`chat-message ${m.sender_role}`}>
                    <div className="chat-bubble">{m.message}</div>
                    <div className="chat-time">{new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="chat-input-area">
                <input
                  className="input" placeholder="Digite sua mensagem..." value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button className="btn btn-primary btn-sm" onClick={send}>Enviar</button>
              </div>
            </>
          )}
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
        {unread > 0 && !open && <span className="chat-badge">{unread}</span>}
      </button>
    </div>
  );
}
