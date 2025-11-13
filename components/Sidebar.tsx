import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Users,
  MapPin,
  AlertTriangle,
  Gift,
  Brain,
  FileText,
  Calendar,
  Newspaper,
  Settings,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  MessageCircle
} from 'lucide-react';

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  children?: MenuItem[];
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['admin']);

  const menuItems: MenuItem[] = [
    {
      name: 'Início',
      path: user?.cargo === 'secretario' ? '/secretary' : user?.cargo === 'servidor' ? '/dashboard' : '/portal',
      icon: <Home size={20} />,
      roles: ['secretario', 'servidor', 'beneficiario']
    },
    {
      name: 'Administração',
      icon: <Settings size={20} />,
      roles: ['secretario', 'servidor'],
      children: [
        {
          name: 'Beneficiários',
          path: '/admin/beneficiaries',
          icon: <Users size={18} />,
          roles: ['secretario', 'servidor']
        },
        {
          name: 'Programas',
          path: '/admin/programs',
          icon: <FileText size={18} />,
          roles: ['secretario']
        },
        {
          name: 'Relatórios',
          path: '/admin/reports',
          icon: <BarChart3 size={18} />,
          roles: ['secretario']
        }
      ]
    },
    {
      name: 'CRAS',
      path: '/cras',
      icon: <MapPin size={20} />,
      badge: 'Novo',
      badgeColor: 'bg-green-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'CREAS',
      path: '/creas',
      icon: <AlertTriangle size={20} />,
      badge: 'Novo',
      badgeColor: 'bg-red-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Benefícios',
      path: '/benefits',
      icon: <Gift size={20} />,
      badge: 'Novo',
      badgeColor: 'bg-purple-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Inteligência Artificial',
      path: '/ia',
      icon: <Brain size={20} />,
      badge: 'IA',
      badgeColor: 'bg-blue-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Auditoria LGPD',
      path: '/audit',
      icon: <Shield size={20} />,
      roles: ['secretario']
    },
    {
      name: 'Estatísticas',
      path: '/stats',
      icon: <BarChart3 size={20} />,
      badge: 'Pro',
      badgeColor: 'bg-indigo-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Agendamentos',
      path: '/schedule',
      icon: <Calendar size={20} />,
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Notícias',
      path: '/news',
      icon: <Newspaper size={20} />,
      roles: ['secretario', 'servidor', 'beneficiario']
    }
  ];

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const hasAccess = (roles?: string[]) => {
    if (!roles || !user) return false;
    return roles.includes(user.cargo);
  };

  const renderMenuItem = (item: MenuItem, isChild: boolean = false) => {
    if (!hasAccess(item.roles)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.name);
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
              isChild ? 'pl-8' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{item.icon}</span>
              {isOpen && (
                <span className="font-medium">{item.name}</span>
              )}
            </div>
            {isOpen && (
              <span className="text-gray-400">
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
            )}
          </button>
          {isExpanded && isOpen && (
            <div className="bg-gray-50">
              {item.children?.map(child => renderMenuItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.path!}
        className={`flex items-center justify-between px-4 py-3 transition-all ${
          active
            ? 'bg-prefeitura-verde text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isChild ? 'pl-8' : ''}`}
      >
        <div className="flex items-center gap-3">
          <span className={active ? 'text-white' : 'text-gray-600'}>
            {item.icon}
          </span>
          {isOpen && (
            <span className={`font-medium ${active ? 'text-white' : ''}`}>
              {item.name}
            </span>
          )}
        </div>
        {isOpen && item.badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-blue-500'}`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-prefeitura-verde rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">OA</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Oryum Aura</h2>
                <p className="text-xs text-gray-500">Sistema SUAS</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:block hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-prefeitura-verde to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user.nome.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.cargo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="overflow-y-auto h-[calc(100vh-180px)] py-4">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Versão 3.0 - Sistema Completo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                © 2025 Oryum Tech
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 p-4 bg-prefeitura-verde text-white rounded-full shadow-lg z-20 lg:hidden"
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;
