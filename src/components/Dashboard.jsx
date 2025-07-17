import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SuperadminDashboard from './SuperadminDashboard';
import GerenteDashboard from './GerenteDashboard';
import FornecedorDashboard from './FornecedorDashboard';
import RecebedorDashboard from './RecebedorDashboard';
import AdministradorDashboard from './AdministradorDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usuário não encontrado</p>
      </div>
    );
  }

  // Renderizar dashboard baseado na função do usuário
  switch (user.funcao) {
    case 'superadmin':
      return <SuperadminDashboard />;
    case 'gerente':
      return <GerenteDashboard />;
    case 'administrador':
      return <AdministradorDashboard />;
    case 'recebedor':
      return <RecebedorDashboard />;
    case 'fornecedor':
      return <FornecedorDashboard />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Função de usuário não reconhecida: {user.funcao}</p>
        </div>
      );
  }
};

export default Dashboard;

