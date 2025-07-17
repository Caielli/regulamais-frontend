import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Truck, 
  Package, 
  FileText, 
  ClipboardCheck, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const { user, isRole } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/app/dashboard', icon: Home, roles: ['superadmin', 'gerente', 'administrador', 'recebedor', 'fornecedor'] }
    ];

    const roleSpecificItems = {
      superadmin: [
        // Ajustado para rotas existentes no WebApp.jsx
        { name: 'Fornecedores', href: '/app/suppliers', icon: Building2 }, // Usando SuppliersPage para "Empresas"
        { name: 'Usuários', href: '/app/users', icon: Users },
        { name: 'Relatórios', href: '/app/reports', icon: BarChart3 },
        { name: 'Configurações', href: '/app/settings', icon: Settings }
      ],
      gerente: [
        { name: 'Fornecedores', href: '/app/suppliers', icon: Truck },
        { name: 'Produtos', href: '/app/products', icon: Package },
        { name: 'Documentos', href: '/app/documents', icon: FileText },
        { name: 'Recebimentos', href: '/app/receivings', icon: ClipboardCheck },
        { name: 'Marketplace', href: '/app/marketplace', icon: ShoppingCart },
        { name: 'Usuários', href: '/app/users', icon: Users },
        { name: 'Relatórios', href: '/app/reports', icon: BarChart3 },
        { name: 'Configurações', href: '/app/settings', icon: Settings }
      ],
      administrador: [
        { name: 'Fornecedores', href: '/app/suppliers', icon: Truck },
        { name: 'Produtos', href: '/app/products', icon: Package },
        { name: 'Documentos', href: '/app/documents', icon: FileText },
        { name: 'Usuários', href: '/app/users', icon: Users },
        { name: 'Configurações', href: '/app/settings', icon: Settings }
      ],
      recebedor: [
        { name: 'Recebimentos', href: '/app/receivings', icon: ClipboardCheck },
        { name: 'Documentos', href: '/app/documents', icon: FileText },
        { name: 'Fornecedores', href: '/app/suppliers', icon: Truck },
        { name: 'Produtos', href: '/app/products', icon: Package }
      ],
      fornecedor: [
        { name: 'Meus Documentos', href: '/app/documents', icon: FileText },
        { name: 'Marketplace', href: '/app/marketplace', icon: ShoppingCart },
        { name: 'Minhas Propostas', href: '/app/propostas', icon: ClipboardCheck }
      ]
    };

    const userRole = user?.funcao;
    const specificItems = roleSpecificItems[userRole] || [];

    return [...baseItems, ...specificItems.map(item => ({ ...item, roles: [userRole] }))];
  };

  const menuItems = getMenuItems();

  const isActive = (href) => {
    // Verifica se a rota atual é exatamente o href ou começa com o href (para rotas aninhadas)
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-purple-900">
      {/* Header with Logo only - sem texto redundante */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-blue-700/50">
        <div className="flex items-center">
          <img 
            src="/logo-white.png" 
            alt="Regula Mais" 
            className="h-8 w-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-8 h-8 bg-white rounded-lg items-center justify-center">
            <span className="text-blue-900 font-bold text-lg">R</span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="lg:hidden text-white hover:text-blue-200 p-1"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-blue-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium truncate">
              {user?.displayName || user?.email}
            </p>
            <p className="text-blue-200 text-xs">
              {user?.funcao === 'superadmin' && 'Super Administrador'}
              {user?.funcao === 'gerente' && 'Gerente'}
              {user?.funcao === 'administrador' && 'Administrador'}
              {user?.funcao === 'recebedor' && 'Recebedor'}
              {user?.funcao === 'fornecedor' && 'Fornecedor'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${active 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className={`
                mr-3 h-5 w-5 transition-colors duration-200
                ${active ? 'text-white' : 'text-blue-200 group-hover:text-white'}
              `} />
              {item.name}
              {active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-blue-700/50">
        <div className="text-center">
          <p className="text-blue-200 text-xs">
            © 2025 Regula Mais
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Sistema de Gestão de Qualidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
