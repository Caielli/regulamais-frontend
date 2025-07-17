import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log('🔍 AuthContext: onAuthStateChanged triggered', firebaseUser ? 'User logged in' : 'User logged out');
        
        if (firebaseUser) {
          console.log('🔍 AuthContext: Firebase user UID:', firebaseUser.uid);
          console.log('🔍 AuthContext: Firebase user email:', firebaseUser.email);
          
          // Validar se o UID existe
          if (!firebaseUser.uid) {
            console.error('❌ AuthContext: UID do usuário está undefined');
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            return;
          }

          try {
            // Buscar perfil completo do usuário via Cloud Function
            console.log('🔍 AuthContext: Chamando getUser com UID:', firebaseUser.uid);
            const getUser = httpsCallable(functions, 'getUser');
            
            // Chamar a função com o parâmetro correto
            const result = await getUser({ 
              userId: firebaseUser.uid 
            });
            
            console.log('🔍 AuthContext: Resultado da getUser:', result);
            console.log('🔍 AuthContext: result.data:', result.data);
            
            if (result.data && result.data.success) {
              const profile = result.data.data;
              console.log('✅ AuthContext: Perfil do usuário carregado:', profile);
              
              setUser(firebaseUser);
              setUserProfile(profile);
            } else {
              console.error('❌ AuthContext: Erro na resposta da getUser:', result.data);
              
              // Se o usuário não existe no Firestore, criar um perfil básico
              const basicProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                nome: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                funcao: 'usuario', // Função padrão
                status: 'ativo',
                empresaId: 'default', // Empresa padrão
                data_criacao: new Date().toISOString(),
                ultimo_login: new Date().toISOString()
              };
              
              console.log('⚠️ AuthContext: Usando perfil básico:', basicProfile);
              setUser(firebaseUser);
              setUserProfile(basicProfile);
            }
          } catch (functionError) {
            console.error('❌ AuthContext: Erro ao chamar getUser:', functionError);
            console.error('❌ AuthContext: Detalhes do erro:', functionError.message);
            
            // Criar perfil básico em caso de erro
            const basicProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              nome: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              funcao: 'usuario',
              status: 'ativo',
              empresaId: 'default',
              data_criacao: new Date().toISOString(),
              ultimo_login: new Date().toISOString()
            };
            
            console.log('⚠️ AuthContext: Usando perfil básico devido ao erro:', basicProfile);
            setUser(firebaseUser);
            setUserProfile(basicProfile);
          }
        } else {
          console.log('🔍 AuthContext: Usuário deslogado');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ AuthContext: Erro geral no processamento:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔍 AuthContext: Tentando login com email:', email);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ AuthContext: Login Firebase bem-sucedido:', result.user.uid);
      
      // O perfil será carregado automaticamente pelo onAuthStateChanged
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ AuthContext: Erro no login:', error);
      let message = 'Erro ao fazer login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          message = 'Senha incorreta';
          break;
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        case 'auth/user-disabled':
          message = 'Usuário desabilitado';
          break;
        case 'auth/too-many-requests':
          message = 'Muitas tentativas. Tente novamente mais tarde';
          break;
        case 'auth/invalid-credential':
          message = 'Credenciais inválidas. Verifique email e senha';
          break;
        default:
          message = error.message;
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔍 AuthContext: Fazendo logout');
      
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      
      console.log('✅ AuthContext: Logout bem-sucedido');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Erro no logout:', error);
      return { success: false, message: 'Erro ao fazer logout' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('🔍 AuthContext: Tentando registrar usuário:', userData.email);
      
      // Criar usuário via Cloud Function (que também cria no Firebase Auth)
      const createUser = httpsCallable(functions, 'createUser');
      const result = await createUser(userData);
      
      if (result.data.success) {
        console.log('✅ AuthContext: Usuário criado via Cloud Function');
        // Fazer login automaticamente após registro
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      } else {
        console.error('❌ AuthContext: Erro ao criar usuário:', result.data.message);
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      console.error('❌ AuthContext: Erro no registro:', error);
      return { success: false, message: 'Erro ao criar usuário' };
    } finally {
      setLoading(false);
    }
  };

  const isRole = (roleToCheck) => {
    const hasRole = userProfile && userProfile.funcao === roleToCheck;
    console.log('🔍 AuthContext: Verificando role:', roleToCheck, 'Resultado:', hasRole);
    return hasRole;
  };

  const hasPermission = (permission) => {
    if (!userProfile) {
      console.log('🔍 AuthContext: Sem perfil, negando permissão:', permission);
      return false;
    }
    
    const permissions = {
      superadmin: ['all'],
      gerente: [
        'view_dashboard', 'manage_suppliers', 'manage_products', 
        'manage_documents', 'manage_receivings', 'manage_marketplace',
        'manage_users', 'view_reports', 'manage_settings'
      ],
      administrador: [
        'view_dashboard', 'manage_suppliers', 'manage_products',
        'manage_documents', 'manage_users', 'manage_settings'
      ],
      recebedor: [
        'view_dashboard', 'view_suppliers', 'view_products',
        'view_documents', 'manage_receivings'
      ],
      fornecedor: [
        'view_dashboard', 'view_documents', 'manage_marketplace',
        'view_own_data'
      ],
      usuario: [
        'view_dashboard'
      ]
    };

    const userPermissions = permissions[userProfile.funcao] || [];
    const hasAccess = userPermissions.includes('all') || userPermissions.includes(permission);
    
    console.log('🔍 AuthContext: Verificando permissão:', permission, 'Role:', userProfile.funcao, 'Resultado:', hasAccess);
    return hasAccess;
  };

  const getEmpresaId = () => {
    const empresaId = userProfile?.empresaId || userProfile?.id_empresa || 'default';
    console.log('🔍 AuthContext: EmpresaId:', empresaId);
    return empresaId;
  };

  const getUserData = () => {
    if (!user || !userProfile) {
      console.log('🔍 AuthContext: getUserData - sem dados');
      return null;
    }
    
    const userData = {
      uid: user.uid,
      email: user.email,
      nome: userProfile.nome,
      funcao: userProfile.funcao,
      empresaId: getEmpresaId(),
      status: userProfile.status,
      displayName: userProfile.nome,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: userProfile.data_criacao,
      lastLogin: userProfile.ultimo_login
    };
    
    console.log('🔍 AuthContext: getUserData:', userData);
    return userData;
  };

  const value = {
    // Estados
    user: getUserData(),
    userProfile,
    loading,
    
    // Funções de autenticação
    login,
    logout,
    register,
    
    // Funções de autorização
    isRole,
    hasPermission,
    getEmpresaId,
    
    // Dados do usuário
    getUserData
  };

  console.log('🔍 AuthContext: Provider value:', {
    hasUser: !!value.user,
    hasProfile: !!userProfile,
    loading,
    userRole: userProfile?.funcao
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

