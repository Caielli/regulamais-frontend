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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  Building2,
  Package,
  FileText,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Activity,
  DollarSign,
  Target
} from 'lucide-react';

const SuperadminDashboard = () => {
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

      // Carregar estatísticas de todos os módulos
      const [
        supplierStatsResult,
        productStatsResult,
        documentStatsResult,
        marketplaceStatsResult,
        receivingStatsResult
      ] = await Promise.all([
        httpsCallable(functions, 'getSupplierStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getProductStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getDocumentStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getMarketplaceStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getRecebimentoStats')({ empresaId: getEmpresaId() })
      ]);

      const dashboardStats = {
        suppliers: supplierStatsResult.data.success ? supplierStatsResult.data.data : {},
        products: productStatsResult.data.success ? productStatsResult.data.data : {},
        documents: documentStatsResult.data.success ? documentStatsResult.data.data : {},
        marketplace: marketplaceStatsResult.data.success ? marketplaceStatsResult.data.data : {},
        receivings: receivingStatsResult.data.success ? receivingStatsResult.data.data : {}
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  // Preparar dados para gráficos
  const supplierStatusData = [
    { name: 'Aprovados', value: stats.suppliers.aprovados || 0, color: '#00C49F' },
    { name: 'Pendentes', value: stats.suppliers.pendentes || 0, color: '#FFBB28' },
    { name: 'Rejeitados', value: stats.suppliers.rejeitados || 0, color: '#FF8042' }
  ];

  const productStatusData = [
    { name: 'Ativos', value: stats.products.ativos || 0, color: '#00C49F' },
    { name: 'Inativos', value: stats.products.inativos || 0, color: '#FF8042' },
    { name: 'Descontinuados', value: stats.products.descontinuados || 0, color: '#8884D8' }
  ];

  const monthlyData = [
    { month: 'Jan', propostas: 12, recebimentos: 8, documentos: 15 },
    { month: 'Fev', propostas: 19, recebimentos: 12, documentos: 18 },
    { month: 'Mar', propostas: 15, recebimentos: 10, documentos: 22 },
    { month: 'Abr', propostas: 25, recebimentos: 18, documentos: 20 },
    { month: 'Mai', propostas: 22, recebimentos: 15, documentos: 25 },
    { month: 'Jun', propostas: 30, recebimentos: 22, documentos: 28 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Superadmin</h1>
        <p className="text-gray-600">Visão geral completa do sistema</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Fornecedores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suppliers.total || 0}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.suppliers.aprovados || 0} aprovados
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
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {stats.documents.pendentes || 0} pendentes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Propostas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.marketplace.total || 0}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                {stats.marketplace.ativas || 0} ativas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taxa de Aprovação</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.suppliers.total > 0 
                  ? Math.round((stats.suppliers.aprovados / stats.suppliers.total) * 100)
                  : 0}%
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recebimentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.receivings.total || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Documentos Expirados</p>
              <p className="text-2xl font-bold text-red-600">{stats.documents.expirados || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
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

        {/* Status dos Produtos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status dos Produtos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {productStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendências Mensais */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tendências Mensais</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="propostas" stroke="#8884d8" name="Propostas" />
            <Line type="monotone" dataKey="recebimentos" stroke="#82ca9d" name="Recebimentos" />
            <Line type="monotone" dataKey="documentos" stroke="#ffc658" name="Documentos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alertas e Notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas Importantes</h3>
          <div className="space-y-3">
            {stats.documents.expirados > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {stats.documents.expirados} documento(s) expirado(s)
                  </p>
                  <p className="text-xs text-red-600">Requer atenção imediata</p>
                </div>
              </div>
            )}
            
            {stats.suppliers.pendentes > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {stats.suppliers.pendentes} fornecedor(es) pendente(s)
                  </p>
                  <p className="text-xs text-yellow-600">Aguardando aprovação</p>
                </div>
              </div>
            )}

            {stats.documents.pendentes > 0 && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {stats.documents.pendentes} documento(s) para revisar
                  </p>
                  <p className="text-xs text-blue-600">Aguardando análise</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Novo fornecedor aprovado
                </p>
                <p className="text-xs text-green-600">Há 2 horas</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  5 novos produtos cadastrados
                </p>
                <p className="text-xs text-blue-600">Há 4 horas</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Documento aprovado
                </p>
                <p className="text-xs text-purple-600">Há 6 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboard;

