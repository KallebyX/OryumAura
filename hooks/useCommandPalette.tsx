import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Shield,
  LogOut,
  User,
  Package
} from 'lucide-react';
import { CommandItem } from '../components/CommandPalette';

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'home',
      label: 'Ir para Início',
      icon: <Home size={18} />,
      section: 'Navegação',
      keywords: ['inicio', 'home', 'dashboard'],
      onSelect: () => {
        const path = user?.cargo === 'secretario' ? '/secretary' :
                     user?.cargo === 'servidor' ? '/dashboard' : '/portal';
        navigate(path);
      }
    },
    {
      id: 'beneficiaries',
      label: 'Lista de Beneficiários',
      icon: <Users size={18} />,
      section: 'Navegação',
      keywords: ['beneficiarios', 'usuarios', 'pessoas'],
      onSelect: () => navigate('/admin/beneficiaries')
    },
    {
      id: 'programs',
      label: 'Gestão de Programas',
      icon: <FileText size={18} />,
      section: 'Navegação',
      keywords: ['programas', 'projetos'],
      onSelect: () => navigate('/admin/programs')
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <BarChart3 size={18} />,
      section: 'Navegação',
      keywords: ['relatorios', 'estatisticas', 'analytics'],
      onSelect: () => navigate('/admin/reports')
    },
    {
      id: 'cras',
      label: 'CRAS',
      icon: <MapPin size={18} />,
      section: 'Serviços',
      keywords: ['cras', 'centro', 'assistencia'],
      onSelect: () => navigate('/cras')
    },
    {
      id: 'creas',
      label: 'CREAS',
      icon: <AlertTriangle size={18} />,
      section: 'Serviços',
      keywords: ['creas', 'especializado'],
      onSelect: () => navigate('/creas')
    },
    {
      id: 'benefits',
      label: 'Benefícios',
      icon: <Gift size={18} />,
      section: 'Serviços',
      keywords: ['beneficios', 'auxilio'],
      onSelect: () => navigate('/benefits')
    },
    {
      id: 'ia',
      label: 'Inteligência Artificial',
      icon: <Brain size={18} />,
      section: 'Ferramentas',
      keywords: ['ia', 'ai', 'inteligencia', 'artificial'],
      onSelect: () => navigate('/ia')
    },
    {
      id: 'audit',
      label: 'Auditoria LGPD',
      icon: <Shield size={18} />,
      section: 'Ferramentas',
      keywords: ['auditoria', 'lgpd', 'privacidade', 'dados'],
      onSelect: () => navigate('/audit')
    },
    {
      id: 'stats',
      label: 'Estatísticas',
      icon: <BarChart3 size={18} />,
      section: 'Ferramentas',
      keywords: ['estatisticas', 'graficos', 'metricas'],
      onSelect: () => navigate('/stats')
    },
    {
      id: 'schedule',
      label: 'Agendamentos',
      icon: <Calendar size={18} />,
      section: 'Ferramentas',
      keywords: ['agendamentos', 'calendario', 'agenda'],
      onSelect: () => navigate('/schedule')
    },
    {
      id: 'news',
      label: 'Notícias',
      icon: <Newspaper size={18} />,
      section: 'Conteúdo',
      keywords: ['noticias', 'news', 'artigos'],
      onSelect: () => navigate('/news')
    },
    {
      id: 'showcase',
      label: 'Biblioteca de Componentes',
      icon: <Package size={18} />,
      section: 'Desenvolvimento',
      keywords: ['componentes', 'ui', 'design', 'showcase'],
      onSelect: () => navigate('/showcase')
    },

    // Actions
    {
      id: 'profile',
      label: 'Meu Perfil',
      icon: <User size={18} />,
      section: 'Ações',
      keywords: ['perfil', 'usuario', 'conta'],
      onSelect: () => {
        // Navigate to profile if it exists
        console.log('Navigate to profile');
      }
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings size={18} />,
      section: 'Ações',
      keywords: ['configuracoes', 'settings', 'opcoes'],
      onSelect: () => {
        console.log('Open settings');
      }
    },
    {
      id: 'logout',
      label: 'Sair',
      icon: <LogOut size={18} />,
      section: 'Ações',
      keywords: ['sair', 'logout', 'desconectar'],
      onSelect: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  // Filter commands based on user role
  const filteredCommands = commands.filter(cmd => {
    // Some commands are only for specific roles
    if (cmd.id === 'programs' || cmd.id === 'audit') {
      return user?.cargo === 'secretario';
    }
    if (cmd.id === 'beneficiaries' || cmd.id === 'reports') {
      return user?.cargo === 'secretario' || user?.cargo === 'servidor';
    }
    return true;
  });

  return {
    isOpen,
    setIsOpen,
    commands: filteredCommands
  };
};
