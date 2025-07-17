import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Building2,
  Calendar,
  Scale,
  AlertTriangle,
  Loader2,
  Star,
  FileText
} from 'lucide-react';

const ReceivingsPage = () => {
  const { user, hasPermission, getEmpresaId } = useAuth();
  const [recebimentos, setRecebimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedRecebimento, setSelectedRecebimento] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadRecebimentos();
    }
  }, [user, filterStatus, searchTerm]);

  const loadRecebimentos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const listRecebimentos = httpsCallable(functions, 'listRecebimentos');
      const result = await listRecebimentos({ 
        page: 1,
        limit: 100,
        status: filterStatus === 'todos' ? undefined : filterStatus,
        search: searchTerm || undefined,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        setRecebimentos(result.data.data.recebimentos || []);
      } else {
        setError(result.data.message || 'Erro ao carregar recebimentos');
        setRecebimentos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar recebimentos:', error);
      setError('Erro ao conectar com o servidor');
      setRecebimentos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecebimento = () => {
    if (!hasPermission('manage_receivings')) {
      setError('Você não tem permissão para criar recebimentos');
      return;
    }
    setSelectedRecebimento(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditRecebimento = (recebimentoData) => {
    if (!hasPermission('manage_receivings')) {
      setError('Você não tem permissão para editar recebimentos');
      return;
    }
    setSelectedRecebimento(recebimentoData);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewRecebimento = (recebimentoData) => {
    setSelectedRecebimento(recebimentoData);
    setModalMode('view');
    setShowModal(true);
  };

  const handleValidateQuality = async (recebimentoId, itemId, validationData) => {
    try {
      setSubmitting(true);
      setError('');

      const validateQuality = httpsCallable(functions, 'validateQuality');
      const result = await validateQuality({
        recebimentoId,
        itemId,
        ...validationData,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        await loadRecebimentos();
      } else {
        setError(result.data.message || 'Erro ao validar qualidade');
      }
    } catch (error) {
      console.error('Erro ao validar qualidade:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalizeRecebimento = async (recebimentoId, action) => {
    try {
      setSubmitting(true);
      setError('');

      const finalizeRecebimento = httpsCallable(functions, 'finalizeRecebimento');
      const result = await finalizeRecebimento({
        recebimentoId,
        action, // 'approve' ou 'reject'
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        await loadRecebimentos();
      } else {
        setError(result.data.message || 'Erro ao finalizar recebimento');
      }
    } catch (error) {
      console.error('Erro ao finalizar recebimento:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveRecebimento = async (recebimentoData) => {
    try {
      setSubmitting(true);
      setError('');

      const empresaId = getEmpresaId();
      const dataToSave = {
        ...recebimentoData,
        empresaId,
        id_empresa: empresaId
      };

      if (modalMode === 'create') {
        const createRecebimento = httpsCallable(functions, 'createRecebimento');
        const result = await createRecebimento(dataToSave);
        
        if (result.data.success) {
          await loadRecebimentos();
          setShowModal(false);
          setSelectedRecebimento(null);
        } else {
          setError(result.data.message || 'Erro ao criar recebimento');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar recebimento:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_analise':
        return 'bg-blue-100 text-blue-800';
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_analise':
        return 'Em Análise';
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'em_analise':
        return <Eye className="h-4 w-4" />;
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredRecebimentos = recebimentos.filter(recebimento => {
    const matchesSearch = !searchTerm || 
      recebimento.numero_recebimento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recebimento.fornecedor_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || recebimento.status === filterStatus;
    
    return matchesSearch && matchesStatus;
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
            <h1 className="text-2xl font-bold text-gray-900">Recebimentos</h1>
            <p className="text-gray-600">Controle de qualidade e recebimento de produtos</p>
          </div>
          {hasPermission('manage_receivings') && (
            <button
              onClick={handleCreateRecebimento}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Recebimento</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Número, fornecedor..."
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
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadRecebimentos}
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

      {/* Lista de Recebimentos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando recebimentos...</span>
        </div>
      ) : filteredRecebimentos.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum recebimento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece registrando um novo recebimento.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recebimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecebimentos.map((recebimento) => (
                  <tr key={recebimento.id_recebimento || recebimento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Truck className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {recebimento.numero_recebimento}
                          </div>
                          <div className="text-sm text-gray-500">
                            {recebimento.observacoes}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{recebimento.fornecedor_nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {recebimento.data_recebimento ? 
                            new Date(recebimento.data_recebimento).toLocaleDateString('pt-BR') : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {recebimento.itens ? recebimento.itens.length : 0} item(s)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(recebimento.status)}`}>
                        {getStatusIcon(recebimento.status)}
                        <span className="ml-1">{getStatusLabel(recebimento.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRecebimento(recebimento)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {hasPermission('manage_receivings') && (
                          <>
                            {recebimento.status === 'pendente' && (
                              <button
                                onClick={() => handleEditRecebimento(recebimento)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {recebimento.status === 'em_analise' && (
                              <>
                                <button
                                  onClick={() => handleFinalizeRecebimento(recebimento.id_recebimento || recebimento.id, 'approve')}
                                  disabled={submitting}
                                  className="text-green-600 hover:text-green-900"
                                  title="Aprovar"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleFinalizeRecebimento(recebimento.id_recebimento || recebimento.id, 'reject')}
                                  disabled={submitting}
                                  className="text-red-600 hover:text-red-900"
                                  title="Rejeitar"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Recebimento */}
      {showModal && (
        <RecebimentoModal
          mode={modalMode}
          recebimento={selectedRecebimento}
          onSave={handleSaveRecebimento}
          onClose={() => {
            setShowModal(false);
            setSelectedRecebimento(null);
            setError('');
          }}
          submitting={submitting}
          error={error}
          onValidateQuality={handleValidateQuality}
        />
      )}
    </div>
  );
};

// Componente Modal para Recebimento
const RecebimentoModal = ({ mode, recebimento, onSave, onClose, submitting, error, onValidateQuality }) => {
  const [formData, setFormData] = useState({
    numero_recebimento: '',
    fornecedor_id: '',
    data_recebimento: '',
    observacoes: '',
    itens: []
  });

  useEffect(() => {
    if (recebimento && mode !== 'create') {
      setFormData({
        numero_recebimento: recebimento.numero_recebimento || '',
        fornecedor_id: recebimento.fornecedor_id || '',
        data_recebimento: recebimento.data_recebimento ? recebimento.data_recebimento.split('T')[0] : '',
        observacoes: recebimento.observacoes || '',
        itens: recebimento.itens || []
      });
    }
  }, [recebimento, mode]);

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
              {mode === 'create' && 'Novo Recebimento'}
              {mode === 'edit' && 'Editar Recebimento'}
              {mode === 'view' && 'Visualizar Recebimento'}
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
              <h4 className="text-md font-medium text-gray-900 mb-3">Informações do Recebimento</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Recebimento *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={isReadOnly}
                    value={formData.numero_recebimento}
                    onChange={(e) => setFormData({ ...formData, numero_recebimento: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Recebimento *
                  </label>
                  <input
                    type="date"
                    required
                    readOnly={isReadOnly}
                    value={formData.data_recebimento}
                    onChange={(e) => setFormData({ ...formData, data_recebimento: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                rows={3}
                readOnly={isReadOnly}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre o recebimento..."
              />
            </div>

            {/* Itens do Recebimento (apenas no modo view) */}
            {mode === 'view' && formData.itens && formData.itens.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Itens Recebidos</h4>
                <div className="space-y-3">
                  {formData.itens.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.produto_nome}</p>
                          <p className="text-xs text-gray-500">Produto</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.quantidade} {item.unidade}
                          </p>
                          <p className="text-xs text-gray-500">Quantidade</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status_qualidade === 'aprovado' ? 'bg-green-100 text-green-800' :
                            item.status_qualidade === 'rejeitado' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status_qualidade === 'aprovado' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {item.status_qualidade === 'rejeitado' && <XCircle className="h-3 w-3 mr-1" />}
                            {item.status_qualidade === 'pendente' && <Clock className="h-3 w-3 mr-1" />}
                            {item.status_qualidade || 'Pendente'}
                          </span>
                        </div>
                      </div>
                      
                      {item.observacoes_qualidade && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">
                            <strong>Observações:</strong> {item.observacoes_qualidade}
                          </p>
                        </div>
                      )}

                      {item.status_qualidade === 'pendente' && (
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => onValidateQuality(recebimento.id_recebimento, item.id, {
                              status: 'aprovado',
                              observacoes: 'Item aprovado na validação de qualidade'
                            })}
                            className="text-green-600 hover:text-green-900 text-sm"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => onValidateQuality(recebimento.id_recebimento, item.id, {
                              status: 'rejeitado',
                              observacoes: 'Item rejeitado na validação de qualidade'
                            })}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Rejeitar
                          </button>
                        </div>
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

export default ReceivingsPage;

