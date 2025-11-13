import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { apiLogin, apiFetchProfile } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (cpf: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há token salvo ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await apiFetchProfile();

          // Mapeia os campos do backend para o tipo User do frontend
          const mappedUser: User = {
            id: profile.id,
            nome: profile.name,
            cpf: profile.cpf,
            cargo: profile.role === 'secretaria' ? 'secretario' : profile.role,
            pontos: 0,
            nivel: 1,
            pontosProximoNivel: 100,
            token: token,
            enrolledCourses: [],
            appliedJobs: []
          };

          setUser(mappedUser);
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (cpf: string, senha: string) => {
    try {
      setLoading(true);

      // Faz login no backend
      const response = await apiLogin(cpf, senha);

      if (!response.access_token) {
        throw new Error('Token não recebido do servidor');
      }

      // Salva o token no localStorage
      localStorage.setItem('token', response.access_token);

      // Busca o perfil do usuário
      const profile = await apiFetchProfile();

      // Mapeia os campos do backend para o tipo User do frontend
      const mappedUser: User = {
        id: profile.id,
        nome: profile.name,
        cpf: profile.cpf,
        cargo: profile.role === 'secretaria' ? 'secretario' : profile.role,
        pontos: 0,
        nivel: 1,
        pontosProximoNivel: 100,
        token: response.access_token,
        enrolledCourses: [],
        appliedJobs: []
      };

      setUser(mappedUser);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
