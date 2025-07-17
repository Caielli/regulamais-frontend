import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  User,
  Mail,
  Phone,
  Building,
  AlertTriangle,
  Loader2,
  UserCheck,
  UserX
} from 'lucide-react';

const UsersPage = () => {
  const { user, hasPermission, getEmpresaId } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user, filterRole, filterStatus, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const listUsers = httpsCallable(functions, 'listUsers');
      const result = await listUsers({ 
        page: 1,
        limit: 100,
        funcao: filterRole === 'todos' ? undefined : filterRole,
        status: filterStatus === 'todos' ? undefined : filterStatus,
        search: searchTerm || undefined,
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        setUsers(result.data.data.users || []);
      } else {
        setError(result.data.message || 'Erro ao carregar usuários');
        setUsers([]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao conectar com o servidor');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    if (!hasPermission('manage_users')) {
      setError('Você não tem permissão para criar usuários');
      return;
    }
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditUser = (userData) => {
    if (!hasPermission('manage_users')) {
      setError('Você não tem permissão para editar usuários');
      return;
    }
    setSelectedUser(userData);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeactivateUser = async (userId, action) => {
    try {
      setSubmitting(true);
      setError('');

      const deactivateUser = httpsCallable(functions, 'deactivateUser');
      const result = await deactivateUser({
        userId,
        action, // 'activate' ou 'deactivate'
        empresaId: getEmpresaId()
      });

      if (result.data.success) {
        await loadUsers();
      } else {
        setError(result.data.message || 'Erro ao processar ação');
      }
    } catch (error) {
      console.error('Erro ao processar usuário:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      setSubmitting(true);
      setError('');

      const empresaId = getEmpresaId();
      const dataToSave = {
        ...userData,
        empresaId,
        id_empresa: empresaId
      };

      if (modalMode === 'create') {
        const createUser = httpsCallable(functions, 'createUser');
        const result = await createUser(dataToSave);
        
        if (result.data.success) {
          await loadUsers();
          setShowModal(false);
          setSelectedUser(null);
        } else {
          setError(result.data.message || 'Erro ao criar usuário');
        }
      } else if (modalMode === 'edit') {
        const updateUser = httpsCallable(functions, 'updateUser');
        const result = await updateUser({
          userId: selectedUser.uid || selectedUser.id,
          ...dataToSave
        });
        
        if (result.data.success) {
          await loadUsers();
          setShowModal(false);
          setSelectedUser(null);
        } else {
          setError(result.data.message || 'Erro ao atualizar usuário');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'gerente':
        return 'bg-blue-100 text-blue-800';
      case 'administrador':
        return 'bg-green-100 text-green-800';
      case 'recebedor':
        return 'bg-yellow-100 text-yellow-800';
      case 'fornecedor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'gerente':
        return 'Gerente';
      case 'administrador':
        return 'Administrador';
      case 'recebedor':
        return 'Recebedor';
      case 'fornecedor':
        return 'Fornecedor';
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin':
        return <Shield className="h-4 w-4" />;
      case 'gerente':
        return <Building className="h-4 w-4" />;
      case 'administrador':
        return <UserCheck className="h-4 w-4" />;
      case 'recebedor':
        return <CheckCircle className="h-4 w-4" />;
      case 'fornecedor':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativo':
        return <CheckCircle className="h-4 w-4" />;
      case 'inativo':
        return <XCircle className="h-4 w-4" />;
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(userItem => {
    const matchesSearch = !searchTerm || 
      userItem.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'todos' || userItem.funcao === filterRole;
    const matchesStatus = filterStatus === 'todos' || userItem.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
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
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
          </div>
          {hasPermission('manage_users') && (
            <button
              onClick={handleCreateUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Usuário</span>
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
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Função
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas as funções</option>
                <option value="superadmin">Super Admin</option>
                <option value="gerente">Gerente</option>
                <option value="administrador">Administrador</option>
                <option value="recebedor">Recebedor</option>
                <option value="fornecedor">Fornecedor</option>
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
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadUsers}
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

      {/* Lista de Usuários */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando usuários...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterRole !== 'todos' || filterStatus !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando um novo usuário.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.uid || userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userItem.funcao)}`}>
                        {getRoleIcon(userItem.funcao)}
                        <span className="ml-1">{getRoleLabel(userItem.funcao)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          {userItem.email}
                        </div>
                        {userItem.telefone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 text-gray-400 mr-1" />
                            {userItem.telefone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userItem.status)}`}>
                        {getStatusIcon(userItem.status)}
                        <span className="ml-1">{getStatusLabel(userItem.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userItem.ultimo_login ? 
                        new Date(userItem.ultimo_login).toLocaleDateString('pt-BR') : 
                        'Nunca'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(userItem)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {hasPermission('manage_users') && (
                          <>
                            <button
                              onClick={() => handleEditUser(userItem)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {userItem.status === 'ativo' ? (
                              <button
                                onClick={() => handleDeactivateUser(userItem.uid || userItem.id, 'deactivate')}
                                disabled={submitting}
                                className="text-red-600 hover:text-red-900"
                                title="Desativar"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeactivateUser(userItem.uid || userItem.id, 'activate')}
                                disabled={submitting}
                                className="text-green-600 hover:text-green-900"
                                title="Ativar"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
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

      {/* Modal de Usuário */}
      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
            setError('');
          }}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
};

// Componente Modal para Usuário
const UserModal = ({ mode, user: userToEdit, onSave, onClose, submitting, error }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    funcao: 'recebedor',
    status: 'ativo',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (userToEdit && mode !== 'create') {
      setFormData({
        nome: userToEdit.nome || '',
        email: userToEdit.email || '',
        telefone: userToEdit.telefone || '',
        funcao: userToEdit.funcao || 'recebedor',
        status: userToEdit.status || 'ativo',
        password: '',
        confirmPassword: ''
      });
    }
  }, [userToEdit, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'create' && formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    
    const dataToSave = { ...formData };
    if (mode === 'edit') {
      delete dataToSave.password;
      delete dataToSave.confirmPassword;
    }
    
    onSave(dataToSave);
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' && 'Novo Usuário'}
              {mode === 'edit' && 'Editar Usuário'}
              {mode === 'view' && 'Visualizar Usuário'}
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
                  Nome Completo *
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
                  Email *
                </label>
                <input
                  type="email"
                  required
                  readOnly={isReadOnly || mode === 'edit'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  readOnly={isReadOnly}
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Função *
                </label>
                <select
                  required
                  disabled={isReadOnly}
                  value={formData.funcao}
                  onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recebedor">Recebedor</option>
                  <option value="administrador">Administrador</option>
                  <option value="gerente">Gerente</option>
                  <option value="fornecedor">Fornecedor</option>
                  <option value="superadmin">Super Admin</option>
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
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>

            {mode === 'create' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                  />
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

export default UsersPage;

