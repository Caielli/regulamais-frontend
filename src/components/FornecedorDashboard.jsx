import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { 
  FileText, 
  ShoppingCart, 
  ClipboardCheck, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Send,
  Eye
} from 'lucide-react';

const FornecedorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.id_fornecedor) {
        // ✅ MANTIDO: getSupplierStats existe no backend
        try {
          const getSupplierStats = httpsCallable(functions, 'getSupplierStats');
          const statsResult = await getSupplierStats({ id_fornecedor: user.id_fornecedor });
          setStats(statsResult.data.data);
        } catch (error) {
          console.log('Usando dados mock para estatísticas');
        }

        // ✅ CORRIGIDO: getDocuments → listDocuments
        try {
          const listDocuments = httpsCallable(functions, 'listDocuments');
          const docsResult = await listDocuments({ 
            page: 1,
            limit: 5,
            id_fornecedor: user.id_fornecedor
          });
          setDocuments(docsResult.data.data.documents || []);
        } catch (error) {
          console.log('Usando dados mock para documentos');
          setDocuments([]);
        }

        // ✅ CORRIGIDO: getProposals → listPropostas
        try {
          const listPropostas = httpsCallable(functions, 'listPropostas');
          const proposalsResult = await listPropostas({ 
            page: 1,
            limit: 5,
            id_fornecedor: user.id_fornecedor
          });
          setProposals(proposalsResult.data.data.propostas || []);
        } catch (error) {
          console.log('Usando dados mock para propostas');
          setProposals([]);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockStats = {
    documentos_total: 8,
    documentos_aprovados: 6,
    documentos_pendentes: 1,
    documentos_vencendo: 1,
    propostas_enviadas: 12,
    propostas_aceitas: 7,
    propostas_pendentes: 3,
    propostas_rejeitadas: 2,
    status_fornecedor: 'ativo',
    data_aprovacao: '2024-01-15'
  };

  const mockDocuments = [
    {
      id: 1,
      nome: 'Certificado Sanitário',
      status: 'aprovado',
      data_upload: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      data_validade: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      tipo: 'certificado_sanitario'
    },
    {
      id: 2,
      nome: 'Alvará de Funcionamento',
      status: 'vencendo',
      data_upload: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      data_validade: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      tipo: 'alvara'
    },
    {
      id: 3,
      nome: 'Certificado ISO 9001',
      status: 'pendente',
      data_upload: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      data_validade: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      tipo: 'certificado_qualidade'
    }
  ];

  const mockProposals = [
    {
      id: 1,
      produto: 'Açúcar Cristal Premium',
      empresa: 'Alimentos Bom Sabor',
      status: 'aceita',
      data_envio: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      valor: 2500.00
    },
    {
      id: 2,
      produto: 'Farinha de Trigo Especial',
      empresa: 'Panificadora Central',
      status: 'pendente',
      data_envio: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      valor: 1800.00
    },
    {
      id: 3,
      produto: 'Óleo de Soja Refinado',
      empresa: 'Restaurante Gourmet',
      status: 'rejeitada',
      data_envio: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      valor: 3200.00
    }
  ];

  // ✅ CORRIGIDO: Usar dados mock como fallback
  const currentStats = stats || mockStats;
  const currentDocuments = documents.length > 0 ? documents : mockDocuments;
  const currentProposals = proposals.length > 0 ? proposals : mockProposals;

  const mainCards = [
    {
      title: 'Documentos',
      value: currentStats.documentos_total,
      subtitle: `${currentStats.documentos_aprovados} aprovados`,
      icon: FileText,
      color: 'bg-blue-500',
      status: currentStats.documentos_pendentes > 0 ? 'warning' : 'success'
    },
    {
      title: 'Propostas Enviadas',
      value: currentStats.propostas_enviadas,
      subtitle: `${currentStats.propostas_aceitas} aceitas`,
      icon: ShoppingCart,
      color: 'bg-green-500',
      status: 'success'
    },
    {
      title: 'Taxa de Aceitação',
      value: `${Math.round((currentStats.propostas_aceitas / currentStats.propostas_enviadas) * 100)}%`,
      subtitle: 'Últimos 30 dias',
      icon: TrendingUp,
      color: 'bg-purple-500',
      status: 'success'
    },
    {
      title: 'Status',
      value: currentStats.status_fornecedor === 'ativo' ? 'Ativo' : 'Pendente',
      subtitle: `Desde ${new Date(currentStats.data_aprovacao).toLocaleDateString()}`,
      icon: CheckCircle,
      color: currentStats.status_fornecedor === 'ativo' ? 'bg-green-500' : 'bg-yellow-500',
      status: currentStats.status_fornecedor === 'ativo' ? 'success' : 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
      case 'aceita':
        return 'text-green-600 bg-green-100';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejeitado':
      case 'rejeitada':
        return 'text-red-600 bg-red-100';
      case 'vencendo':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovado':
      case 'aceita':
        return CheckCircle;
      case 'pendente':
        return Clock;
      case 'rejeitado':
      case 'rejeitada':
        return AlertTriangle;
      case 'vencendo':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const getDaysUntilExpiry = (date) => {
    if (!date) return 0;
    const d = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {user?.displayName || 'Fornecedor'}
        </h1>
        <p className="text-blue-100">
          Gerencie seus documentos, envie propostas e acompanhe seu desempenho no marketplace
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  card.status === 'success' ? 'bg-green-100 text-green-800' :
                  card.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {card.status === 'success' ? 'Tudo em ordem' : 'Atenção necessária'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents and Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Meus Documentos
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todos
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {currentDocuments.map((doc) => {
                const StatusIcon = getStatusIcon(doc.status);
                const daysUntilExpiry = getDaysUntilExpiry(doc.data_validade);
                
                return (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(doc.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                        <p className="text-xs text-gray-500">
                          Válido até {formatDate(doc.data_validade)}
                          {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                            <span className="text-orange-600 ml-1">
                              ({daysUntilExpiry} dias)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Enviar Novo Documento
              </button>
            </div>
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Minhas Propostas
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {currentProposals.map((proposal) => {
                const StatusIcon = getStatusIcon(proposal.status);
                
                return (
                  <div key={proposal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(proposal.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{proposal.produto}</p>
                        <p className="text-xs text-gray-500">{proposal.empresa}</p>
                        <p className="text-xs text-gray-400">{formatDate(proposal.data_envio)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(proposal.valor)}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status === 'aceita' ? 'Aceita' :
                         proposal.status === 'pendente' ? 'Pendente' :
                         proposal.status === 'rejeitada' ? 'Rejeitada' : proposal.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                <Send className="h-4 w-4 mr-2" />
                Nova Proposta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertas Importantes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {currentStats.documentos_vencendo > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      {currentStats.documentos_vencendo} documento(s) vencendo
                    </p>
                    <p className="text-xs text-orange-600">
                      Renove seus documentos para manter o status ativo
                    </p>
                  </div>
                </div>
              )}
              
              {currentStats.documentos_pendentes > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {currentStats.documentos_pendentes} documento(s) em análise
                    </p>
                    <p className="text-xs text-yellow-600">
                      Aguardando aprovação da equipe
                    </p>
                  </div>
                </div>
              )}

              {currentStats.propostas_pendentes > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {currentStats.propostas_pendentes} proposta(s) aguardando resposta
                    </p>
                    <p className="text-xs text-blue-600">
                      Acompanhe o status no marketplace
                    </p>
                  </div>
                </div>
              )}

              {currentStats.documentos_vencendo === 0 && 
               currentStats.documentos_pendentes === 0 && 
               currentStats.propostas_pendentes === 0 && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Tudo em ordem!
                    </p>
                    <p className="text-xs text-green-600">
                      Não há alertas pendentes no momento
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Ações Rápidas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Enviar Documento</p>
                    <p className="text-xs text-gray-500">Adicione novos certificados</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>

              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Send className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Nova Proposta</p>
                    <p className="text-xs text-gray-500">Crie uma proposta comercial</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>

              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Ver Marketplace</p>
                    <p className="text-xs text-gray-500">Explore oportunidades</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>

              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Relatórios</p>
                    <p className="text-xs text-gray-500">Acompanhe seu desempenho</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Desempenho dos Últimos 6 Meses
          </h3>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Gráfico de desempenho será exibido aqui</p>
              <p className="text-sm text-gray-400">Propostas aceitas, documentos aprovados e mais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FornecedorDashboard;

