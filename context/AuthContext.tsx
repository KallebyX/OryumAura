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
  // Iniciar sem usuário logado para permitir login
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (cpf: string, senha: string) => {
    // Login simples baseado no CPF - sem validação de senha complexa
    let demoUser: User | null = null;
    
    if (cpf === "99988877766") {
      // Secretária
      demoUser = {
        id: 1,
        nome: "Secretária Exemplo",
        cpf: cpf,
        cargo: "secretario",
        pontos: 100,
        nivel: 1,
        pontosProximoNivel: 50,
        token: "demo-token-secretaria",
        enrolledCourses: [],
        appliedJobs: []
      };
    } else if (cpf === "11122233344") {
      // Servidor
      demoUser = {
        id: 2,
        nome: "Servidor Exemplo",
        cpf: cpf,
        cargo: "servidor",
        pontos: 75,
        nivel: 1,
        pontosProximoNivel: 25,
        token: "demo-token-servidor",
        enrolledCourses: [],
        appliedJobs: []
      };
    } else if (cpf === "55566677788") {
      // Beneficiário
      demoUser = {
        id: 3,
        nome: "Beneficiário Exemplo",
        cpf: cpf,
        cargo: "beneficiario",
        pontos: 50,
        nivel: 1,
        pontosProximoNivel: 50,
        token: "demo-token-beneficiario",
        enrolledCourses: [1],
        appliedJobs: [1]
      };
    }
    
    if (demoUser) {
      setUser(demoUser);
    } else {
      throw new Error('CPF não encontrado');
    }
  };

  const logout = () => {
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
