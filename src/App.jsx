import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import ChatWidget from './components/client/ChatWidget';
import Home from './pages/client/Home';
import Catalog from './pages/client/Catalog';
import ProductDetail from './pages/client/ProductDetail';
import Login from './pages/client/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import AdminChat from './pages/admin/Chat';
import Settings from './pages/admin/Settings';
import './pages/admin/AdminForm.css';
import './pages/admin/ChatAdmin.css';

const ProtectedAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return children;
};

const ClientLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <ChatWidget />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
          <Route path="/catalogo" element={<ClientLayout><Catalog /></ClientLayout>} />
          <Route path="/produto/:slug" element={<ClientLayout><ProductDetail /></ClientLayout>} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedAdmin><Dashboard /></ProtectedAdmin>} />
          <Route path="/admin/produtos" element={<ProtectedAdmin><Products /></ProtectedAdmin>} />
          <Route path="/admin/categorias" element={<ProtectedAdmin><Categories /></ProtectedAdmin>} />
          <Route path="/admin/chat" element={<ProtectedAdmin><AdminChat /></ProtectedAdmin>} />
          <Route path="/admin/configuracoes" element={<ProtectedAdmin><Settings /></ProtectedAdmin>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
