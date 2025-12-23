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
  Shield,
  Sparkles,
  Layers,
  TrendingUp,
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
  const [isHovering, setIsHovering] = useState(false);

  const menuItems: MenuItem[] = [
    {
      name: 'Inicio',
      path: user?.cargo === 'secretario' ? '/secretary' : user?.cargo === 'servidor' ? '/dashboard' : '/portal',
      icon: <Home size={20} />,
      roles: ['secretario', 'servidor', 'beneficiario']
    },
    {
      name: 'Administracao',
      icon: <Layers size={20} />,
      roles: ['secretario', 'servidor'],
      children: [
        {
          name: 'Beneficiarios',
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
          name: 'Relatorios',
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
      badgeColor: 'bg-success-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'CREAS',
      path: '/creas',
      icon: <AlertTriangle size={20} />,
      badge: 'Novo',
      badgeColor: 'bg-warning-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Beneficios',
      path: '/benefits',
      icon: <Gift size={20} />,
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Inteligencia Artificial',
      path: '/ia',
      icon: <Brain size={20} />,
      badge: 'IA',
      badgeColor: 'bg-accent-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Auditoria LGPD',
      path: '/audit',
      icon: <Shield size={20} />,
      roles: ['secretario']
    },
    {
      name: 'Estatisticas',
      path: '/stats',
      icon: <TrendingUp size={20} />,
      badge: 'Pro',
      badgeColor: 'bg-primary-500',
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Agendamentos',
      path: '/schedule',
      icon: <Calendar size={20} />,
      roles: ['secretario', 'servidor']
    },
    {
      name: 'Noticias',
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

  const sidebarWidth = isOpen ? 280 : 80;

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
            className={`
              w-full flex items-center justify-between px-4 py-3 mx-2 rounded-xl
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800/50
              hover:text-slate-900 dark:hover:text-white
              transition-all duration-200
              ${isChild ? 'pl-12' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                >
                  {item.name}
                </motion.span>
              )}
            </div>
            {isOpen && (
              <motion.span
                animate={{ rotate: isExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400 dark:text-slate-500"
              >
                <ChevronDown size={16} />
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
                className="overflow-hidden"
              >
                {item.children?.map(child => renderMenuItem(child, true))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link key={item.name} to={item.path!}>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex items-center justify-between px-4 py-3 mx-2 rounded-xl
            transition-all duration-200 group
            ${isChild ? 'ml-6' : ''}
            ${active
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }
          `}
        >
          {active && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}

          <div className="flex items-center gap-3">
            <motion.span
              className="flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {item.icon}
            </motion.span>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                {item.name}
              </motion.span>
            )}
          </div>

          {isOpen && item.badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className={`
                text-2xs px-2 py-0.5 rounded-full text-white font-bold
                ${item.badgeColor || 'bg-primary-500'}
                shadow-lg
              `}
            >
              {item.badge}
            </motion.span>
          )}
        </motion.div>
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        onHoverStart={() => !isOpen && setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed left-0 top-0 h-screen z-40
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          flex flex-col
          transition-shadow duration-300
          ${isOpen ? 'shadow-elevation-5' : 'shadow-elevation-2'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-slate-900" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                    Oryum Aura
                  </h2>
                  <p className="text-2xs text-slate-500 dark:text-slate-400 font-medium">
                    Sistema SUAS
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 mx-auto"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`
              p-2 rounded-lg
              text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition-colors
              ${!isOpen ? 'hidden' : ''}
            `}
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* User Info */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-b border-slate-200/60 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success-500 rounded-full border-2 border-white dark:border-slate-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {user.nome.split(' ').slice(0, 2).join(' ')}
                  </p>
                  <p className="text-2xs text-slate-500 dark:text-slate-400 capitalize font-medium">
                    {user.cargo}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-slate-200/60 dark:border-slate-800"
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/5 dark:to-accent-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-primary-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Versao 3.0
                  </span>
                </div>
                <p className="text-2xs text-slate-500 dark:text-slate-400">
                  2025 Oryum Tech
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
            className="
              fixed bottom-6 left-6 p-4 z-50
              bg-gradient-to-r from-primary-500 to-accent-500
              text-white rounded-2xl
              shadow-lg shadow-primary-500/30
              lg:hidden
            "
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
