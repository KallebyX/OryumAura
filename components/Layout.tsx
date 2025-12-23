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
import { Bell, Search, LogOut, Moon, Sun, Command } from 'lucide-react';
import { motion } from 'framer-motion';


const Header: React.FC<{ onOpenCommandPalette: () => void }> = ({ onOpenCommandPalette }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20 transition-colors">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and Search */}
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-3">
                            <CacapavaDoSulIcon className="w-10 h-10" />
                            <div className="hidden lg:block">
                                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                                    Assistência Social
                                </h1>
                                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                    Caçapava do Sul
                                </p>
                            </div>
                        </div>

                        {/* Command Palette Trigger */}
                        <div className="hidden md:flex flex-1 max-w-md ml-8">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={onOpenCommandPalette}
                                className="relative w-full group"
                            >
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" size={20} />
                                <div className="w-full pl-10 pr-20 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-left text-gray-500 dark:text-gray-400 group-hover:border-green-500 dark:group-hover:border-green-400 transition-colors cursor-pointer">
                                    Buscar ou executar comando...
                                </div>
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                                    <Command size={12} />K
                                </kbd>
                            </motion.button>
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun size={20} className="text-yellow-500" />
                            ) : (
                                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
                            )}
                        </motion.button>

                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* User Menu */}
                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        {user.nome.split(' ').slice(0, 2).join(' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                        {user.cargo}
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-lg shadow-red-500/30"
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
      // Verifica se o script existe antes de remover
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}


const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { isOpen, setIsOpen, commands } = useCommandPalette();

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
                {user && <Sidebar />}
                <div className={`${user ? 'lg:ml-64' : ''} min-h-screen flex flex-col`}>
                    <Header onOpenCommandPalette={() => setIsOpen(true)} />
                    <main className="flex-grow p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                            <p>© 2025 Oryum Aura - Sistema de Assistência Social</p>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <p>Versão 3.0 - Todos os direitos reservados</p>
                                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded">
                                    ⌘K para buscar
                                </kbd>
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
