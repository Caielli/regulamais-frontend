import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertTriangle,
  Loader2,
  Star,
  TrendingUp
} from 'lucide-react';

const SuppliersPage = () => {
  const { user, hasPermission, getEmpresaId } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Adicionado estado para mensagens de sucesso
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      loadSuppliers();
      loadStats();
    }
  }, [user, filterStatus, searchTerm]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const listSuppliers = httpsCallable(functions, 'listSuppliers');
      const result = await listSuppliers({ 
        page: 1,
        limit: 100,
        status: filterStatus === 'todos' ? undefined : filterStatus,
        search: searchTerm || undefined,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        setSuppliers(result.data.data.items || []);
      } else {
        setError(result.data.message || 'Erro ao carregar fornecedores');
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError('Erro ao conectar com o servidor');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const getSupplierStats = httpsCallable(functions, 'getSupplierStats');
      const result = await getSupplierStats({ empresaId: getEmpresaId() });

      if (result.data.success) {
        setStats(result.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreateSupplier = () => {
    if (!hasPermission('manage_suppliers')) {
      setError('Você não tem permissão para criar fornecedores');
      return;
    }
    setSelectedSupplier(null);
    setModalMode('create');
    setError(''); // Limpar erros anteriores
    setSuccess(''); // Limpar sucessos anteriores
    setShowModal(true);
  };

  const handleEditSupplier = (supplierData) => {
    if (!hasPermission('manage_suppliers')) {
      setError('Você não tem permissão para editar fornecedores');
      return;
    }
    setSelectedSupplier(supplierData);
    setModalMode('edit');
    setError(''); // Limpar erros anteriores
    setSuccess(''); // Limpar sucessos anteriores
    setShowModal(true);
  };

  const handleViewSupplier = (supplierData) => {
    setSelectedSupplier(supplierData);
    setModalMode('view');
    setError(''); // Limpar erros anteriores
    setSuccess(''); // Limpar sucessos anteriores
    setShowModal(true);
  };

  const handleApproveSupplier = async (supplierId, action) => {
    try {
      setSubmitting(true);
      setError('');

      const approveSupplier = httpsCallable(functions, 'approveSupplier');
      const result = await approveSupplier({
        supplier_id: supplierId,
        aprovar: action === 'approve',
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        await loadSuppliers();
        await loadStats();
        setSuccess(`Fornecedor ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      } else {
        setError(result.data.message || 'Erro ao processar aprovação');
      }
    } catch (error) {
      console.error('Erro ao aprovar fornecedor:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSupplier = async (supplierData) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const empresaId = getEmpresaId();
      const dataToSave = {
        ...supplierData,
        id_empresa: empresaId
      };

      if (modalMode === 'create') {
        const createSupplier = httpsCallable(functions, 'createSupplier');
        const result = await createSupplier(dataToSave);
        
        if (result.data.success) {
          await loadSuppliers();
          await loadStats();
          setSuccess('Fornecedor criado com sucesso!');
          
          // Fechar modal após 2 segundos para mostrar a mensagem
          setTimeout(() => {
            setShowModal(false);
            setSelectedSupplier(null);
            setSuccess('');
          }, 2000);
        } else {
          setError(result.data.message || 'Erro ao criar fornecedor');
        }
      } else if (modalMode === 'edit') {
        const updateSupplier = httpsCallable(functions, 'updateSupplier');
        const result = await updateSupplier({
          supplier_id: selectedSupplier.id || selectedSupplier.id_fornecedor,
          ...dataToSave
        });
        
        if (result.data.success) {
          await loadSuppliers();
          await loadStats();
          setSuccess('Fornecedor atualizado com sucesso!');
          
          // Fechar modal após 2 segundos para mostrar a mensagem
          setTimeout(() => {
            setShowModal(false);
            setSelectedSupplier(null);
            setSuccess('');
          }, 2000);
        } else {
          setError(result.data.message || 'Erro ao atualizar fornecedor');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
    setError('');
    setSuccess('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'inativo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Filtrar fornecedores
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = !searchTerm || 
      supplier.nome_empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cnpj?.includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || supplier.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (!hasPermission('view_suppliers')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Você não tem permissão para visualizar fornecedores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600">Gerencie seus fornecedores e parceiros</p>
        </div>
        
        {hasPermission('manage_suppliers') && (
          <button
            onClick={handleCreateSupplier}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Fornecedor
          </button>
        )}
      </div>

      {/* Mensagens de erro/sucesso globais (fora do modal) */}
      {error && !showModal && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && !showModal && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.por_status?.aprovado || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.por_status?.pendente || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
                <p className="text-2xl font-bold text-gray-900">{stats.performance?.rating_medio?.toFixed(1) || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Nome, CNPJ, email..."
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
              <option value="aprovado">Aprovado</option>
              <option value="pendente">Pendente</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando fornecedores...</span>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum fornecedor encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece cadastrando um novo fornecedor.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.nome_empresa}
                          </div>
                          <div className="text-sm text-gray-500">
                            {supplier.categoria}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.cnpj}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.nome_contato}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {supplier.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {supplier.telefone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                        {getStatusIcon(supplier.status)}
                        <span className="ml-1">{supplier.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-900">
                          {supplier.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewSupplier(supplier)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {hasPermission('manage_suppliers') && (
                          <>
                            <button
                              onClick={() => handleEditSupplier(supplier)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            {supplier.status === 'pendente' && (
                              <>
                                <button
                                  onClick={() => handleApproveSupplier(supplier.id, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                  disabled={submitting}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleApproveSupplier(supplier.id, 'reject')}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={submitting}
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

      {/* Modal */}
      {showModal && (
        <SupplierModal
          mode={modalMode}
          supplier={selectedSupplier}
          onSave={handleSaveSupplier}
          onClose={handleCloseModal}
          submitting={submitting}
          error={error}
          success={success}
        />
      )}
    </div>
  );
};

// Componente Modal para Fornecedor - CORRIGIDO
const SupplierModal = ({ mode, supplier, onSave, onClose, submitting, error, success }) => {
  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    nome_contato: '',
    categoria: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    observacoes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (supplier && mode !== 'create') {
      setFormData({
        nome_empresa: supplier.nome_empresa || '',
        cnpj: supplier.cnpj || '',
        email: supplier.email || '',
        telefone: supplier.telefone || '',
        nome_contato: supplier.nome_contato || '',
        categoria: supplier.categoria || '',
        endereco: {
          logradouro: supplier.endereco?.logradouro || '',
          numero: supplier.endereco?.numero || '',
          complemento: supplier.endereco?.complemento || '',
          bairro: supplier.endereco?.bairro || '',
          cidade: supplier.endereco?.cidade || '',
          estado: supplier.endereco?.estado || '',
          cep: supplier.endereco?.cep || ''
        },
        observacoes: supplier.observacoes || ''
      });
    }
  }, [supplier, mode]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome_empresa.trim()) {
      errors.nome_empresa = 'Nome da empresa é obrigatório';
    }
    
    if (!formData.cnpj.trim()) {
      errors.cnpj = 'CNPJ é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.telefone.trim()) {
      errors.telefone = 'Telefone é obrigatório';
    }
    
    if (!formData.nome_contato.trim()) {
      errors.nome_contato = 'Nome do contato é obrigatório';
    }
    
    if (!formData.categoria) {
      errors.categoria = 'Categoria é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isReadOnly = mode === 'view';

  const categorias = [
    { value: 'frutas_verduras', label: 'Frutas e Verduras' },
    { value: 'carnes_aves', label: 'Carnes e Aves' },
    { value: 'laticinios', label: 'Laticínios' },
    { value: 'graos_cereais', label: 'Grãos e Cereais' },
    { value: 'bebidas', label: 'Bebidas' },
    { value: 'condimentos', label: 'Condimentos' },
    { value: 'embalagens', label: 'Embalagens' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'limpeza', label: 'Limpeza' },
    { value: 'descartaveis', label: 'Descartáveis' },
    { value: 'congelados', label: 'Congelados' },
    { value: 'padaria_confeitaria', label: 'Padaria e Confeitaria' },
    { value: 'outros', label: 'Outros' }
  ];

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' && 'Novo Fornecedor'}
              {mode === 'edit' && 'Editar Fornecedor'}
              {mode === 'view' && 'Visualizar Fornecedor'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Mensagens de erro e sucesso DENTRO do modal */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Informações Básicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={isReadOnly}
                    value={formData.nome_empresa}
                    onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.nome_empresa ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  />
                  {formErrors.nome_empresa && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.nome_empresa}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={isReadOnly}
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.cnpj ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                    placeholder="00.000.000/0000-00"
                  />
                  {formErrors.cnpj && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.cnpj}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    readOnly={isReadOnly}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    readOnly={isReadOnly}
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.telefone ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                    placeholder="(00) 00000-0000"
                  />
                  {formErrors.telefone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.telefone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Contato *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={isReadOnly}
                    value={formData.nome_contato}
                    onChange={(e) => setFormData({ ...formData, nome_contato: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.nome_contato ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  />
                  {formErrors.nome_contato && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.nome_contato}</p>
                  )}
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
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.categoria ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoria && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.categoria}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    readOnly={isReadOnly}
                    value={formData.endereco.logradouro}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, logradouro: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    readOnly={isReadOnly}
                    value={formData.endereco.numero}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, numero: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    readOnly={isReadOnly}
                    value={formData.endereco.complemento}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, complemento: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    readOnly={isReadOnly}
                    value={formData.endereco.bairro}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, bairro: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    readOnly={isReadOnly}
                    value={formData.endereco.cidade}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, cidade: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    disabled={isReadOnly}
                    value={formData.endereco.estado}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, estado: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  >
                    <option value="">Selecione</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    readOnly={isReadOnly}
                    value={formData.endereco.cep}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, cep: e.target.value }
                    })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                    placeholder="00000-000"
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
                className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isReadOnly ? 'bg-gray-50' : ''
                }`}
                placeholder="Informações adicionais sobre o fornecedor..."
              />
            </div>

            {/* Botões */}
            {!isReadOnly && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {mode === 'create' ? 'Criar Fornecedor' : 'Salvar Alterações'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;

<cd styleName={cd..AlertTriangle}></cd>