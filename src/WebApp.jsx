import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Importe seus componentes existentes
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SuppliersPage from './components/SuppliersPage';
import ProductsPage from './components/ProductsPage';
import DocumentsPage from './components/DocumentsPage';
import MarketplacePage from './components/MarketplacePage';
import ReceivingsPage from './components/ReceivingsPage';
import UsersPage from './components/UsersPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';

// Dashboards específicos
import AdministradorDashboard from './components/AdministradorDashboard';
import FornecedorDashboard from './components/FornecedorDashboard';
import GerenteDashboard from './components/GerenteDashboard';
import RecebedorDashboard from './components/RecebedorDashboard';
import SuperadminDashboard from './components/SuperadminDashboard';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/app/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.funcao)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

const WebApp = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Rotas para Dashboards Específicos */}
          <Route path="dashboard/superadmin" element={<PrivateRoute allowedRoles={["superadmin"]}><SuperadminDashboard /></PrivateRoute>} />
          <Route path="dashboard/gerente" element={<PrivateRoute allowedRoles={["gerente"]}><GerenteDashboard /></PrivateRoute>} />
          <Route path="dashboard/administrador" element={<PrivateRoute allowedRoles={["administrador"]}><AdministradorDashboard /></PrivateRoute>} />
          <Route path="dashboard/recebedor" element={<PrivateRoute allowedRoles={["recebedor"]}><RecebedorDashboard /></PrivateRoute>} />
          <Route path="dashboard/fornecedor" element={<PrivateRoute allowedRoles={["fornecedor"]}><FornecedorDashboard /></PrivateRoute>} />

          {/* Rotas para Páginas Gerais */}
          <Route path="suppliers" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "administrador", "recebedor"]}><SuppliersPage /></PrivateRoute>} />
          <Route path="products" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "administrador", "recebedor"]}><ProductsPage /></PrivateRoute>} />
          <Route path="documents" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "administrador", "recebedor", "fornecedor"]}><DocumentsPage /></PrivateRoute>} />
          <Route path="marketplace" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "fornecedor"]}><MarketplacePage /></PrivateRoute>} />
          <Route path="receivings" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "recebedor"]}><ReceivingsPage /></PrivateRoute>} />
          <Route path="users" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "administrador"]}><UsersPage /></PrivateRoute>} />
          <Route path="reports" element={<PrivateRoute allowedRoles={["superadmin", "gerente"]}><ReportsPage /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute allowedRoles={["superadmin", "gerente", "administrador"]}><SettingsPage /></PrivateRoute>} />

          {/* Rotas específicas do fornecedor */}
          <Route path="propostas" element={<PrivateRoute allowedRoles={["fornecedor"]}><MarketplacePage /></PrivateRoute>} />
        </Route>

        {/* Catch-all para rotas não encontradas dentro do /app */}
        <Route path="*" element={<Navigate to="/app/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default WebApp;
