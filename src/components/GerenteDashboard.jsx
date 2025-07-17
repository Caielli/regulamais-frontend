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
  LineChart,
  Line,
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
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';

const GerenteDashboard = () => {
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

      // Carregar estatísticas relevantes para gerente
      const [
        supplierStatsResult,
        productStatsResult,
        marketplaceStatsResult,
        receivingStatsResult
      ] = await Promise.all([
        httpsCallable(functions, 'getSupplierStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getProductStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getMarketplaceStats')({ empresaId: getEmpresaId() }),
        httpsCallable(functions, 'getRecebimentoStats')({ empresaId: getEmpresaId() })
      ]);

      const dashboardStats = {
        suppliers: supplierStatsResult.data.success ? supplierStatsResult.data.data : {},
        products: productStatsResult.data.success ? productStatsResult.data.data : {},
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

  // Calcular KPIs
  const supplierApprovalRate = stats.suppliers.total > 0 
    ? Math.round((stats.suppliers.aprovados / stats.suppliers.total) * 100)
    : 0;

  const productActiveRate = stats.products.total > 0
    ? Math.round((stats.products.ativos / stats.products.total) * 100)
    : 0;

  const marketplaceSuccessRate = stats.marketplace.total > 0
    ? Math.round((stats.marketplace.finalizadas / stats.marketplace.total) * 100)
    : 0;

  // Dados para gráficos
  const performanceData = [
    { name: 'Fornecedores', aprovacao: supplierApprovalRate, meta: 85 },
    { name: 'Produtos', ativacao: productActiveRate, meta: 90 },
    { name: 'Marketplace', sucesso: marketplaceSuccessRate, meta: 75 },
    { name: 'Recebimentos', qualidade: 92, meta: 95 }
  ];

  const monthlyTrends = [
    { month: 'Jan', fornecedores: 12, produtos: 25, propostas: 8 },
    { month: 'Fev', fornecedores: 15, produtos: 30, propostas: 12 },
    { month: 'Mar', fornecedores: 18, produtos: 28, propostas: 15 },
    { month: 'Abr', fornecedores: 22, produtos: 35, propostas: 18 },
    { month: 'Mai', fornecedores: 25, produtos: 32, propostas: 22 },
    { month: 'Jun', fornecedores: 28, produtos: 38, propostas: 25 }
  ];

  const categoryDistribution = [
    { name: 'Laticínios', value: 30, color: '#0088FE' },
    { name: 'Carnes', value: 25, color: '#00C49F' },
    { name: 'Cereais', value: 20, color: '#FFBB28' },
    { name: 'Frutas', value: 15, color: '#FF8042' },
    { name: 'Outros', value: 10, color: '#8884D8' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Gerencial</h1>
        <p className="text-gray-600">Indicadores de performance e gestão operacional</p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taxa de Aprovação</p>
              <p className="text-2xl font-bold text-gray-900">{supplierApprovalRate}%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% vs mês anterior
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Produtos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.products.ativos || 0}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                {productActiveRate}% do total
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Propostas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.marketplace.ativas || 0}</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Zap className="h-3 w-3 mr-1" />
                {stats.marketplace.total || 0} total
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Qualidade Média</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Award className="h-3 w-3 mr-1" />
                Excelente
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance vs Metas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance vs Metas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="aprovacao" fill="#8884d8" name="Taxa Aprovação %" />
              <Bar dataKey="ativacao" fill="#82ca9d" name="Taxa Ativação %" />
              <Bar dataKey="sucesso" fill="#ffc658" name="Taxa Sucesso %" />
              <Bar dataKey="qualidade" fill="#ff7300" name="Qualidade %" />
              <Bar dataKey="meta" fill="#e0e0e0" name="Meta %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendências Mensais */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tendências de Crescimento</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fornecedores" stroke="#8884d8" name="Fornecedores" strokeWidth={2} />
            <Line type="monotone" dataKey="produtos" stroke="#82ca9d" name="Produtos" strokeWidth={2} />
            <Line type="monotone" dataKey="propostas" stroke="#ffc658" name="Propostas" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Métricas Operacionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Eficiência Operacional</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo Médio de Aprovação</span>
              <span className="text-sm font-medium">2.5 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de Rejeição</span>
              <span className="text-sm font-medium text-red-600">8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfação do Cliente</span>
              <span className="text-sm font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo de Resposta</span>
              <span className="text-sm font-medium">4.2h</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas de Gestão</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  5 fornecedores pendentes
                </p>
                <p className="text-xs text-yellow-600">Requer aprovação</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Meta de qualidade atingida
                </p>
                <p className="text-xs text-blue-600">92% este mês</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Crescimento de 15%
                </p>
                <p className="text-xs text-green-600">Novos produtos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Próximas Ações</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Revisar fornecedores
                </p>
                <p className="text-xs text-gray-600">Hoje, 14:00</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Relatório mensal
                </p>
                <p className="text-xs text-gray-600">Amanhã, 09:00</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Reunião de equipe
                </p>
                <p className="text-xs text-gray-600">Sexta, 10:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Performance */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.suppliers.total || 0}</p>
            <p className="text-sm opacity-90">Fornecedores Totais</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{supplierApprovalRate}%</p>
            <p className="text-sm opacity-90">Taxa de Aprovação</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.products.ativos || 0}</p>
            <p className="text-sm opacity-90">Produtos Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm opacity-90">Qualidade Média</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerenteDashboard;

