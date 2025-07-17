import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  Building2,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Activity,
  Shield,
  Settings,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Database
} from 'lucide-react';

const AdministradorDashboard = () => {
  const { user, getEmpresaId } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Carregar estatísticas relevantes para administrador
      const [
        supplierStatsResult,
        productStatsResult,
        documentStatsResult
      ] = await Promise.all([
        httpsCallable(functions, 'getSupplierStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getProductStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getDocumentStats')({ empresaId: getEmpresaId() })
      ]);

      const dashboardStats = {
        suppliers: supplierStatsResult.data.success ? supplierStatsResult.data.data : {},
        products: productStatsResult.data.success ? productStatsResult.data.data : {},
        documents: documentStatsResult.data.success ? documentStatsResult.data.data : {}
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Dados para gráficos
  const supplierStatusData = [
    { name: 'Aprovados', value: stats.suppliers.aprovados || 0, color: '#00C49F' },
    { name: 'Pendentes', value: stats.suppliers.pendentes || 0, color: '#FFBB28' },
    { name: 'Rejeitados', value: stats.suppliers.rejeitados || 0, color: '#FF8042' }
  ];

  const documentStatusData = [
    { name: 'Aprovados', value: stats.documents.aprovados || 0, color: '#00C49F' },
    { name: 'Pendentes', value: stats.documents.pendentes || 0, color: '#FFBB28' },
    { name: 'Rejeitados', value: stats.documents.rejeitados || 0, color: '#FF8042' },
    { name: 'Expirados', value: stats.documents.expirados || 0, color: '#8884D8' }
  ];

  const weeklyActivity = [
    { day: 'Seg', fornecedores: 4, produtos: 8, documentos: 6 },
    { day: 'Ter', fornecedores: 6, produtos: 12, documentos: 8 },
    { day: 'Qua', fornecedores: 3, produtos: 10, documentos: 5 },
    { day: 'Qui', fornecedores: 8, produtos: 15, documentos: 10 },
    { day: 'Sex', fornecedores: 5, produtos: 9, documentos: 7 },
    { day: 'Sab', fornecedores: 2, produtos: 4, documentos: 3 },
    { day: 'Dom', fornecedores: 1, produtos: 2, documentos: 1 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Gestão operacional e controle de processos</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Fornecedores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suppliers.total || 0}</p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {stats.suppliers.pendentes || 0} pendentes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.products.total || 0}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                {stats.products.ativos || 0} ativos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.documents.total || 0}</p>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {stats.documents.expirados || 0} expirados
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Atividade</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Sistema ativo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status dos Fornecedores */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status dos Fornecedores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supplierStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplierStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status dos Documentos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status dos Documentos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={documentStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {documentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Atividade Semanal */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Semanal</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="fornecedores" fill="#8884d8" name="Fornecedores" />
            <Bar dataKey="produtos" fill="#82ca9d" name="Produtos" />
            <Bar dataKey="documentos" fill="#ffc658" name="Documentos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Painel de Controle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarefas Pendentes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tarefas Pendentes</h3>
          <div className="space-y-3">
            {stats.suppliers.pendentes > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Aprovar fornecedores
                    </p>
                    <p className="text-xs text-yellow-600">
                      {stats.suppliers.pendentes} pendentes
                    </p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {stats.suppliers.pendentes}
                </span>
              </div>
            )}

            {stats.documents.pendentes > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Revisar documentos
                    </p>
                    <p className="text-xs text-blue-600">
                      {stats.documents.pendentes} pendentes
                    </p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {stats.documents.pendentes}
                </span>
              </div>
            )}

            {stats.documents.expirados > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Documentos expirados
                    </p>
                    <p className="text-xs text-red-600">
                      Requer atenção imediata
                    </p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {stats.documents.expirados}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Métricas de Qualidade */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Qualidade</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de Aprovação</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.suppliers.total > 0 ? (stats.suppliers.aprovados / stats.suppliers.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {stats.suppliers.total > 0 ? Math.round((stats.suppliers.aprovados / stats.suppliers.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Produtos Ativos</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${stats.products.total > 0 ? (stats.products.ativos / stats.products.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {stats.products.total > 0 ? Math.round((stats.products.ativos / stats.products.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Documentos Válidos</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${stats.documents.total > 0 ? ((stats.documents.total - stats.documents.expirados) / stats.documents.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {stats.documents.total > 0 ? Math.round(((stats.documents.total - stats.documents.expirados) / stats.documents.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Eficiência Geral</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <UserCheck className="h-5 w-5 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800">Aprovar Fornecedores</p>
                <p className="text-xs text-blue-600">{stats.suppliers.pendentes || 0} pendentes</p>
              </div>
            </button>

            <button className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Package className="h-5 w-5 text-green-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-green-800">Gerenciar Produtos</p>
                <p className="text-xs text-green-600">{stats.products.total || 0} cadastrados</p>
              </div>
            </button>

            <button className="w-full flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <FileText className="h-5 w-5 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-purple-800">Revisar Documentos</p>
                <p className="text-xs text-purple-600">{stats.documents.pendentes || 0} pendentes</p>
              </div>
            </button>

            <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Configurações</p>
                <p className="text-xs text-gray-600">Sistema e usuários</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Resumo do Sistema */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-2">Status do Sistema</h3>
            <p className="text-sm opacity-90">
              Sistema operando normalmente com {stats.suppliers.total || 0} fornecedores, {stats.products.total || 0} produtos e {stats.documents.total || 0} documentos gerenciados.
            </p>
          </div>
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-2" />
            <div className="text-right">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm opacity-90">Eficiência</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministradorDashboard;

