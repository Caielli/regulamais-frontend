import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  MessageCircle,
  Calendar,
  Package,
  Building2,
  AlertTriangle,
  Loader2,
  Star,
  TrendingUp
} from 'lucide-react';

const MarketplacePage = () => {
  const { user, hasPermission, getEmpresaId, isRole } = useAuth();
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadPropostas();
    }
  }, [user, filterStatus, filterCategory, searchTerm]);

  const loadPropostas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const listPropostas = httpsCallable(functions, 'listPropostas');
      const result = await listPropostas({ 
        page: 1,
        limit: 100,
        status: filterStatus === 'todos' ? undefined : filterStatus,
        categoria: filterCategory === 'todos' ? undefined : filterCategory,
        search: searchTerm || undefined,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        setPropostas(result.data.data.propostas || []);
      } else {
        setError(result.data.message || 'Erro ao carregar propostas');
        setPropostas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      setError('Erro ao conectar com o servidor');
      setPropostas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposta = () => {
    if (!hasPermission('manage_marketplace')) {
      setError('Você não tem permissão para criar propostas');
      return;
    }
    setSelectedProposta(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditProposta = (propostaData) => {
    if (!hasPermission('manage_marketplace')) {
      setError('Você não tem permissão para editar propostas');
      return;
    }
    setSelectedProposta(propostaData);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewProposta = (propostaData) => {
    setSelectedProposta(propostaData);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDemonstrarInteresse = async (propostaId) => {
    try {
      setSubmitting(true);
      setError('');

      const demonstrarInteresse = httpsCallable(functions, 'demonstrarInteresse');
      const result = await demonstrarInteresse({
        propostaId,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        await loadPropostas();
      } else {
        setError(result.data.message || 'Erro ao demonstrar interesse');
      }
    } catch (error) {
      console.error('Erro ao demonstrar interesse:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResponderInteresse = async (propostaId, interesseId, acao) => {
    try {
      setSubmitting(true);
      setError('');

      const responderInteresse = httpsCallable(functions, 'responderInteresse');
      const result = await responderInteresse({
        propostaId,
        interesseId,
        acao, // 'aceitar' ou 'rejeitar'
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        await loadPropostas();
      } else {
        setError(result.data.message || 'Erro ao responder interesse');
      }
    } catch (error) {
      console.error('Erro ao responder interesse:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProposta = async (propostaData) => {
    try {
      setSubmitting(true);
      setError('');

      const empresaId = getEmpresaId();
      const dataToSave = {
        ...propostaData,
        empresaId,
        id_empresa: empresaId
      };

      if (modalMode === 'create') {
        const createProposta = httpsCallable(functions, 'createProposta');
        const result = await createProposta(dataToSave);
        
        if (result.data.success) {
          await loadPropostas();
          setShowModal(false);
          setSelectedProposta(null);
        } else {
          setError(result.data.message || 'Erro ao criar proposta');
        }
      } else if (modalMode === 'edit') {
        const updateProposta = httpsCallable(functions, 'updateProposta');
        const result = await updateProposta({
          propostaId: selectedProposta.id_proposta || selectedProposta.id,
          ...dataToSave
        });
        
        if (result.data.success) {
          await loadPropostas();
          setShowModal(false);
          setSelectedProposta(null);
        } else {
          setError(result.data.message || 'Erro ao atualizar proposta');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'finalizada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'expirada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ativa':
        return 'Ativa';
      case 'finalizada':
        return 'Finalizada';
      case 'cancelada':
        return 'Cancelada';
      case 'expirada':
        return 'Expirada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativa':
        return <CheckCircle className="h-4 w-4" />;
      case 'finalizada':
        return <Star className="h-4 w-4" />;
      case 'cancelada':
        return <XCircle className="h-4 w-4" />;
      case 'expirada':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const isExpiringSoon = (dataVencimento) => {
    if (!dataVencimento) return false;
    const today = new Date();
    const expiry = new Date(dataVencimento);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const filteredPropostas = propostas.filter(proposta => {
    const matchesSearch = !searchTerm || 
      proposta.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.produto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.empresa_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || proposta.status === filterStatus;
    const matchesCategory = filterCategory === 'todos' || proposta.categoria === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600">Propostas comerciais e oportunidades de negócio</p>
          </div>
          {hasPermission('manage_marketplace') && (
            <button
              onClick={handleCreateProposta}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nova Proposta</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Título, produto, empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
                <option value="expirada">Expirada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas as categorias</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Carnes">Carnes</option>
                <option value="Cereais">Cereais</option>
                <option value="Frutas">Frutas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadPropostas}
                disabled={loading}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                <span>Filtrar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Propostas */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando propostas...</span>
        </div>
      ) : filteredPropostas.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma proposta encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'todos' || filterCategory !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando uma nova proposta.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPropostas.map((proposta) => (
            <div key={proposta.id_proposta || proposta.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {proposta.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {proposta.produto}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="h-4 w-4 mr-1" />
                      {proposta.empresa_nome}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposta.status)}`}>
                    {getStatusIcon(proposta.status)}
                    <span className="ml-1">{getStatusLabel(proposta.status)}</span>
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantidade:</span>
                    <span className="font-medium">{proposta.quantidade} {proposta.unidade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium text-green-600">
                      R$ {proposta.preco_unitario?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vencimento:</span>
                    <span className={`font-medium ${
                      isExpiringSoon(proposta.data_vencimento) ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {proposta.data_vencimento ? 
                        new Date(proposta.data_vencimento).toLocaleDateString('pt-BR') : 
                        'Não definido'
                      }
                    </span>
                  </div>
                </div>

                {proposta.descricao && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {proposta.descricao}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {proposta.interesses && proposta.interesses.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        {proposta.interesses.length} interesse(s)
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProposta(proposta)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {/* Botão de interesse para fornecedores */}
                    {isRole('fornecedor') && proposta.status === 'ativa' && (
                      <button
                        onClick={() => handleDemonstrarInteresse(proposta.id_proposta || proposta.id)}
                        disabled={submitting}
                        className="text-red-600 hover:text-red-900"
                        title="Demonstrar Interesse"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    )}

                    {hasPermission('manage_marketplace') && (
                      <button
                        onClick={() => handleEditProposta(proposta)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Proposta */}
      {showModal && (
        <PropostaModal
          mode={modalMode}
          proposta={selectedProposta}
          onSave={handleSaveProposta}
          onClose={() => {
            setShowModal(false);
            setSelectedProposta(null);
            setError('');
          }}
          submitting={submitting}
          error={error}
          onResponderInteresse={handleResponderInteresse}
        />
      )}
    </div>
  );
};

// Componente Modal para Proposta
const PropostaModal = ({ mode, proposta, onSave, onClose, submitting, error, onResponderInteresse }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    produto: '',
    categoria: 'Laticínios',
    quantidade: '',
    unidade: 'kg',
    preco_unitario: '',
    data_vencimento: '',
    descricao: '',
    especificacoes: '',
    status: 'ativa'
  });

  useEffect(() => {
    if (proposta && mode !== 'create') {
      setFormData({
        titulo: proposta.titulo || '',
        produto: proposta.produto || '',
        categoria: proposta.categoria || 'Laticínios',
        quantidade: proposta.quantidade || '',
        unidade: proposta.unidade || 'kg',
        preco_unitario: proposta.preco_unitario || '',
        data_vencimento: proposta.data_vencimento ? proposta.data_vencimento.split('T')[0] : '',
        descricao: proposta.descricao || '',
        especificacoes: proposta.especificacoes || '',
        status: proposta.status || 'ativa'
      });
    }
  }, [proposta, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' && 'Nova Proposta'}
              {mode === 'edit' && 'Editar Proposta'}
              {mode === 'view' && 'Visualizar Proposta'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Informações da Proposta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={isReadOnly}
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produto *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={isReadOnly}
                    value={formData.produto}
                    onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    required
                    disabled={isReadOnly}
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Laticínios">Laticínios</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Cereais">Cereais</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    disabled={isReadOnly}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ativa">Ativa</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detalhes Comerciais */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Detalhes Comerciais</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    required
                    readOnly={isReadOnly}
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade *
                  </label>
                  <select
                    required
                    disabled={isReadOnly}
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="l">Litro (l)</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="unidade">Unidade</option>
                    <option value="caixa">Caixa</option>
                    <option value="pacote">Pacote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Unitário (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    readOnly={isReadOnly}
                    value={formData.preco_unitario}
                    onChange={(e) => setFormData({ ...formData, preco_unitario: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    readOnly={isReadOnly}
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Descrições */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={4}
                    readOnly={isReadOnly}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição da proposta..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especificações
                  </label>
                  <textarea
                    rows={4}
                    readOnly={isReadOnly}
                    value={formData.especificacoes}
                    onChange={(e) => setFormData({ ...formData, especificacoes: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Especificações técnicas..."
                  />
                </div>
              </div>
            </div>

            {/* Interesses (apenas no modo view) */}
            {mode === 'view' && proposta && proposta.interesses && proposta.interesses.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Interesses Demonstrados</h4>
                <div className="space-y-2">
                  {proposta.interesses.map((interesse, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {interesse.empresa_nome}
                        </p>
                        <p className="text-xs text-gray-500">
                          {interesse.data_interesse ? 
                            new Date(interesse.data_interesse).toLocaleDateString('pt-BR') : 
                            'Data não disponível'
                          }
                        </p>
                      </div>
                      {interesse.status === 'pendente' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onResponderInteresse(proposta.id_proposta, interesse.id, 'aceitar')}
                            className="text-green-600 hover:text-green-900"
                            title="Aceitar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onResponderInteresse(proposta.id_proposta, interesse.id, 'rejeitar')}
                            className="text-red-600 hover:text-red-900"
                            title="Rejeitar"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {interesse.status !== 'pendente' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          interesse.status === 'aceito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {interesse.status === 'aceito' ? 'Aceito' : 'Rejeitado'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isReadOnly && (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{mode === 'create' ? 'Criar' : 'Salvar'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;

