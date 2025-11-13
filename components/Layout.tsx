import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from './Toast';
import { CacapavaDoSulIcon } from './CacapavaDoSulIcon';
import Chatbot from './Chatbot';
import Sidebar from './Sidebar';
import { Bell, Search, LogOut } from 'lucide-react';


const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and Search */}
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-3">
                            <CacapavaDoSulIcon className="w-10 h-10" />
                            <div className="hidden lg:block">
                                <h1 className="text-lg font-bold text-gray-800">
                                    Assistência Social
                                </h1>
                                <p className="text-xs text-prefeitura-verde font-semibold">
                                    Caçapava do Sul
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md ml-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar beneficiários, casos..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell size={22} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {user.nome.split(' ').slice(0, 2).join(' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user.cargo}
                                    </p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline">Sair</span>
                                </button>
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
      document.body.removeChild(script);
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

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {user && <Sidebar />}
            <div className={`${user ? 'lg:ml-64' : ''} min-h-screen flex flex-col`}>
                <Header />
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
                <footer className="bg-white border-t border-gray-200 py-4 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                        <p>© 2025 Oryum Aura - Sistema de Assistência Social</p>
                        <p className="mt-2 sm:mt-0">Versão 3.0 - Todos os direitos reservados</p>
                    </div>
                </footer>
            </div>
            <ToastContainer />
            <VLibras />
            <Chatbot />
        </div>
    );
};

export default Layout;
