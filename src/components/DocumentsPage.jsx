import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  Calendar,
  AlertTriangle,
  Loader2,
  File,
  Shield
} from 'lucide-react';

const DocumentsPage = () => {
  const { user, hasPermission, getEmpresaId } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user, filterStatus, filterType, searchTerm]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const listDocuments = httpsCallable(functions, 'listDocuments');
      const result = await listDocuments({ 
        page: 1,
        limit: 100,
        status: filterStatus === 'todos' ? undefined : filterStatus,
        tipo: filterType === 'todos' ? undefined : filterType,
        search: searchTerm || undefined,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        setDocuments(result.data.data.documents || []);
      } else {
        setError(result.data.message || 'Erro ao carregar documentos');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      setError('Erro ao conectar com o servidor');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = () => {
    if (!hasPermission('manage_documents')) {
      setError('Você não tem permissão para criar documentos');
      return;
    }
    setSelectedDocument(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditDocument = (documentData) => {
    if (!hasPermission('manage_documents')) {
      setError('Você não tem permissão para editar documentos');
      return;
    }
    setSelectedDocument(documentData);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewDocument = (documentData) => {
    setSelectedDocument(documentData);
    setModalMode('view');
    setShowModal(true);
  };

  const handleApproveDocument = async (documentId, action) => {
    try {
      setSubmitting(true);
      setError('');

      if (action === 'approve') {
        const approveDocument = httpsCallable(functions, 'approveDocument');
        const result = await approveDocument({
          documentId,
          empresaId: getEmpresaId()
        });

        if (result.data.success) {
          await loadDocuments();
        } else {
          setError(result.data.message || 'Erro ao aprovar documento');
        }
      } else if (action === 'reject') {
        const rejectDocument = httpsCallable(functions, 'rejectDocument');
        const result = await rejectDocument({
          documentId,
          motivo: 'Documento rejeitado pelo administrador',
          empresaId: getEmpresaId()
        });

        if (result.data.success) {
          await loadDocuments();
        } else {
          setError(result.data.message || 'Erro ao rejeitar documento');
        }
      }
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDocument = async (documentData) => {
    try {
      setSubmitting(true);
      setError('');

      const empresaId = getEmpresaId();
      const dataToSave = {
        ...documentData,
        empresaId,
        id_empresa: empresaId
      };

      if (modalMode === 'create') {
        const createDocument = httpsCallable(functions, 'createDocument');
        const result = await createDocument(dataToSave);
        
        if (result.data.success) {
          await loadDocuments();
          setShowModal(false);
          setSelectedDocument(null);
        } else {
          setError(result.data.message || 'Erro ao criar documento');
        }
      } else if (modalMode === 'edit') {
        const updateDocument = httpsCallable(functions, 'updateDocument');
        const result = await updateDocument({
          documentId: selectedDocument.id_documento || selectedDocument.id,
          ...dataToSave
        });
        
        if (result.data.success) {
          await loadDocuments();
          setShowModal(false);
          setSelectedDocument(null);
        } else {
          setError(result.data.message || 'Erro ao atualizar documento');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'expirado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'pendente':
        return 'Pendente';
      case 'rejeitado':
        return 'Rejeitado';
      case 'expirado':
        return 'Expirado';
      default:
        return status;
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
      case 'expirado':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'certificado':
        return <Shield className="h-4 w-4" />;
      case 'licenca':
        return <FileText className="h-4 w-4" />;
      case 'contrato':
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const isExpiringSoon = (dataVencimento) => {
    if (!dataVencimento) return false;
    const today = new Date();
    const expiry = new Date(dataVencimento);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (dataVencimento) => {
    if (!dataVencimento) return false;
    const today = new Date();
    const expiry = new Date(dataVencimento);
    return expiry < today;
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = !searchTerm || 
      document.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.fornecedor_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || document.status === filterStatus;
    const matchesType = filterType === 'todos' || document.tipo === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
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
            <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
            <p className="text-gray-600">Gerencie documentos, certificados e licenças</p>
          </div>
          {hasPermission('manage_documents') && (
            <button
              onClick={handleCreateDocument}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Documento</span>
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
                  placeholder="Nome, número, fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os tipos</option>
                <option value="certificado">Certificado</option>
                <option value="licenca">Licença</option>
                <option value="contrato">Contrato</option>
                <option value="laudo">Laudo</option>
                <option value="outros">Outros</option>
              </select>
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
                <option value="expirado">Expirado</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadDocuments}
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

      {/* Lista de Documentos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando documentos...</span>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'todos' || filterType !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece adicionando um novo documento.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
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
                {filteredDocuments.map((document) => (
                  <tr key={document.id_documento || document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(document.tipo)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {document.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {document.numero}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {document.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {document.fornecedor_nome || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {document.data_vencimento ? (
                          <div className={`flex items-center ${
                            isExpired(document.data_vencimento) ? 'text-red-600' :
                            isExpiringSoon(document.data_vencimento) ? 'text-yellow-600' :
                            'text-gray-900'
                          }`}>
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(document.data_vencimento).toLocaleDateString('pt-BR')}
                            {isExpired(document.data_vencimento) && (
                              <AlertTriangle className="h-3 w-3 ml-1" />
                            )}
                          </div>
                        ) : (
                          'Sem vencimento'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">{getStatusLabel(document.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDocument(document)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {document.arquivo_url && (
                          <a
                            href={document.arquivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                        {hasPermission('manage_documents') && (
                          <>
                            <button
                              onClick={() => handleEditDocument(document)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {document.status === 'pendente' && (
                              <>
                                <button
                                  onClick={() => handleApproveDocument(document.id_documento || document.id, 'approve')}
                                  disabled={submitting}
                                  className="text-green-600 hover:text-green-900"
                                  title="Aprovar"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleApproveDocument(document.id_documento || document.id, 'reject')}
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

      {/* Modal de Documento */}
      {showModal && (
        <DocumentModal
          mode={modalMode}
          document={selectedDocument}
          onSave={handleSaveDocument}
          onClose={() => {
            setShowModal(false);
            setSelectedDocument(null);
            setError('');
          }}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
};

// Componente Modal para Documento
const DocumentModal = ({ mode, document, onSave, onClose, submitting, error }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'certificado',
    numero: '',
    data_emissao: '',
    data_vencimento: '',
    orgao_emissor: '',
    fornecedor_id: '',
    observacoes: '',
    status: 'pendente'
  });

  useEffect(() => {
    if (document && mode !== 'create') {
      setFormData({
        nome: document.nome || '',
        tipo: document.tipo || 'certificado',
        numero: document.numero || '',
        data_emissao: document.data_emissao ? document.data_emissao.split('T')[0] : '',
        data_vencimento: document.data_vencimento ? document.data_vencimento.split('T')[0] : '',
        orgao_emissor: document.orgao_emissor || '',
        fornecedor_id: document.fornecedor_id || '',
        observacoes: document.observacoes || '',
        status: document.status || 'pendente'
      });
    }
  }, [document, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' && 'Novo Documento'}
              {mode === 'edit' && 'Editar Documento'}
              {mode === 'view' && 'Visualizar Documento'}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Documento *
                </label>
                <input
                  type="text"
                  required
                  readOnly={isReadOnly}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  required
                  disabled={isReadOnly}
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="certificado">Certificado</option>
                  <option value="licenca">Licença</option>
                  <option value="contrato">Contrato</option>
                  <option value="laudo">Laudo</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  readOnly={isReadOnly}
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Órgão Emissor
                </label>
                <input
                  type="text"
                  readOnly={isReadOnly}
                  value={formData.orgao_emissor}
                  onChange={(e) => setFormData({ ...formData, orgao_emissor: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Emissão
                </label>
                <input
                  type="date"
                  readOnly={isReadOnly}
                  value={formData.data_emissao}
                  onChange={(e) => setFormData({ ...formData, data_emissao: e.target.value })}
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
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                  <option value="expirado">Expirado</option>
                </select>
              </div>
            </div>

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
                placeholder="Observações adicionais sobre o documento..."
              />
            </div>

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

export default DocumentsPage;

