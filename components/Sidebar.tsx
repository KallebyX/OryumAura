import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
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
  const { isDarkMode } = useDarkMode();
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
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-lg mx-2 ${
              isChild ? 'pl-8' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="text-gray-600 dark:text-gray-400"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {item.icon}
              </motion.span>
              {isOpen && (
                <span className="font-medium">{item.name}</span>
              )}
            </div>
            {isOpen && (
              <motion.span
                className="text-gray-400 dark:text-gray-500"
                animate={{ rotate: isExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} />
              </motion.span>
            )}
          </motion.button>
          <AnimatePresence>
            {isExpanded && isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden"
              >
                {item.children?.map(child => renderMenuItem(child, true))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.path!}
        className={`relative group flex items-center justify-between px-4 py-3 mx-2 transition-all rounded-lg ${
          active
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${isChild ? 'pl-8' : ''}`}
      >
        {active && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <div className="flex items-center gap-3">
          <motion.span
            className={active ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {item.icon}
          </motion.span>
          {isOpen && (
            <span className={`font-medium ${active ? 'text-white' : ''}`}>
              {item.name}
            </span>
          )}
        </div>
        {isOpen && item.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className={`text-xs px-2 py-0.5 rounded-full text-white font-semibold ${item.badgeColor || 'bg-blue-500'} shadow-lg`}
          >
            {item.badge}
          </motion.span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-40 border-r border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">OA</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">Oryum Aura</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sistema SUAS</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:block hidden text-gray-600 dark:text-gray-400"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-white truncate">
                  {user.nome.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
            >
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Versão 3.0 - Sistema Completo
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  © 2025 Oryum Tech
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-lg shadow-green-500/30 z-20 lg:hidden"
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
