import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from './Toast';
import { CacapavaDoSulIcon } from './CacapavaDoSulIcon';
import Chatbot from './Chatbot';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';
import CommandPalette from './CommandPalette';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useDarkMode } from '../context/DarkModeContext';
import { Bell, Search, LogOut, Moon, Sun, Command, Sparkles, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC<{ onOpenCommandPalette: () => void }> = ({ onOpenCommandPalette }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-20 transition-all duration-300">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800" />

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Search */}
          <div className="flex items-center gap-6 flex-1">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <CacapavaDoSulIcon className="w-10 h-10" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Assistencia Social
                </h1>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  Cacapava do Sul
                </p>
              </div>
            </div>

            {/* Command Palette Trigger */}
            <div className="hidden md:flex flex-1 max-w-md">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onOpenCommandPalette}
                className="relative w-full group"
              >
                <div className="
                  flex items-center gap-3 w-full px-4 py-2.5
                  bg-slate-100/80 dark:bg-slate-800/80
                  border border-slate-200/60 dark:border-slate-700/60
                  rounded-xl
                  text-slate-500 dark:text-slate-400
                  transition-all duration-200
                  group-hover:border-primary-300 dark:group-hover:border-primary-700
                  group-hover:bg-white dark:group-hover:bg-slate-800
                  group-hover:shadow-lg group-hover:shadow-primary-500/5
                ">
                  <Search size={18} className="flex-shrink-0 group-hover:text-primary-500 transition-colors" />
                  <span className="flex-1 text-left text-sm">Buscar ou executar comando...</span>
                  <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm">
                    <Command size={11} />K
                  </kbd>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="
                p-2.5 rounded-xl
                text-slate-500 dark:text-slate-400
                hover:text-slate-700 dark:hover:text-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-200
              "
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} className="text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                relative p-2.5 rounded-xl
                text-slate-500 dark:text-slate-400
                hover:text-slate-700 dark:hover:text-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-200
              "
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </motion.button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

            {/* User Menu & Logout */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user.nome.split(' ').slice(0, 2).join(' ')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {user.cargo}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="
                    flex items-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-gradient-to-r from-danger-500 to-danger-600
                    hover:from-danger-600 hover:to-danger-700
                    text-white font-semibold text-sm
                    shadow-lg shadow-danger-500/25
                    transition-all duration-200
                  "
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sair</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const VLibras: React.FC = () => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(script);

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isOpen, setIsOpen, commands } = useCommandPalette();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        </div>

        {user && <Sidebar />}

        <div className={`relative ${user ? 'lg:ml-[280px]' : ''} min-h-screen flex flex-col transition-all duration-300`}>
          <Header onOpenCommandPalette={() => setIsOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="relative border-t border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Sparkles size={14} className="text-primary-500" />
                  <span>2025 Oryum Aura - Sistema de Assistencia Social</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400 dark:text-slate-500">
                    Versao 3.0
                  </span>
                  <kbd className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <Command size={11} />K para buscar
                  </kbd>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <ToastContainer />
        <VLibras />
        <Chatbot />

        {/* Global Command Palette */}
        <CommandPalette
          items={commands}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
