import axios from 'axios';

// Determina a URL base da API dinamicamente
const getBaseURL = () => {
  // Em produção (Vercel), usa a URL relativa
  if (typeof window !== 'undefined') {
    // Verifica se estamos em produção
    if (window.location.hostname !== 'localhost') {
      return '/api';
    }
  }
  // Em desenvolvimento, usa localhost
  return process.env.API_URL || 'http://localhost:3001/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === FUNÇÕES DE AUTENTICAÇÃO (CONECTADAS AO BACKEND) ===

export const apiLogin = async (cpf: string, senha: string) => {
  try {
    const response = await api.post('/login', { cpf, senha });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao fazer login');
  }
};

export const apiFetchProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar perfil');
  }
};

// === FUNÇÕES DE BENEFICIÁRIOS (CONECTADAS AO BACKEND) ===

export const apiFetchBeneficiaries = async () => {
  try {
    const response = await api.get('/beneficiaries');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar beneficiários');
  }
};

export const apiFetchBeneficiaryById = async (id: string) => {
  try {
    const response = await api.get(`/beneficiaries/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar beneficiário');
  }
};

export const apiFetchBeneficiaryPrograms = async (id: string) => {
  try {
    const response = await api.get(`/beneficiaries/${id}/programs`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar programas do beneficiário');
  }
};

// === FUNÇÕES DE PROGRAMAS (CONECTADAS AO BACKEND) ===

export const apiFetchPrograms = async () => {
  try {
    const response = await api.get('/programs');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar programas');
  }
};

// === FUNÇÕES DE NOTÍCIAS (CONECTADAS AO BACKEND) ===

export const apiFetchNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar notícias');
  }
};

// === FUNÇÕES DE ATENDIMENTOS (CONECTADAS AO BACKEND) ===

export const apiFetchAppointments = async (params?: any) => {
  try {
    const response = await api.get('/appointments', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar atendimentos');
  }
};

// === FUNÇÕES PARA PORTAL DO CIDADÃO ===
// Mantendo dados mock temporariamente até implementação no backend

const mockCourses = [
  { id: 1, titulo: 'Curso de Informática Básica', descricao: 'Aprenda os fundamentos da informática', categoria: 'Tecnologia' },
  { id: 2, titulo: 'Curso de Culinária', descricao: 'Técnicas básicas de culinária', categoria: 'Gastronomia' },
  { id: 3, titulo: 'Artesanato e Reciclagem', descricao: 'Transforme materiais recicláveis em arte', categoria: 'Artesanato' },
  { id: 4, titulo: 'Cuidador de Idosos', descricao: 'Formação para cuidadores profissionais', categoria: 'Saúde' }
];

const mockJobs = [
  { id: 1, titulo: 'Auxiliar Administrativo', empresa: 'Prefeitura Municipal', descricao: 'Vaga para auxiliar administrativo na secretaria', localidade: 'Centro', tipo: 'Integral' as const },
  { id: 2, titulo: 'Recepcionista', empresa: 'Clínica Médica São José', descricao: 'Atendimento ao público e agenda médica', localidade: 'Vila Nova', tipo: 'Meio Período' as const },
  { id: 3, titulo: 'Cozinheira', empresa: 'Restaurante do Centro', descricao: 'Preparação de refeições para restaurante', localidade: 'Centro', tipo: 'Integral' as const },
  { id: 4, titulo: 'Vendedor', empresa: 'Loja de Roupas Fashion', descricao: 'Vendas e atendimento ao cliente', localidade: 'Rua Principal', tipo: 'Meio Período' as const }
];

const mockForumPosts = [
  { id: 1, titulo: 'Dúvidas sobre auxílio emergencial', autor_nome: 'Maria Silva', conteudo: 'Como solicitar o auxílio? Quais documentos?', data: '2024-01-15', respostas: 5, curtidas: 8 },
  { id: 2, titulo: 'Inscrição no CRAS', autor_nome: 'João Santos', conteudo: 'Documentos necessários para cadastro', data: '2024-01-14', respostas: 3, curtidas: 6 },
  { id: 3, titulo: 'Vagas de emprego na região', autor_nome: 'Ana Costa', conteudo: 'Alguém sabe de vagas abertas?', data: '2024-01-13', respostas: 7, curtidas: 12 },
  { id: 4, titulo: 'Cursos gratuitos disponíveis', autor_nome: 'Pedro Oliveira', conteudo: 'Lista de cursos profissionalizantes gratuitos', data: '2024-01-12', respostas: 9, curtidas: 15 }
];

export const apiFetchCourses = async () => {
    // Retornar dados mock para demonstração
    return mockCourses;
}

export const apiEnrollCourse = async (token: string, courseId: number) => {
    // Simular inscrição bem-sucedida
    return { message: 'Inscrição realizada com sucesso!' };
}

export const apiFetchForumPosts = async () => {
    // Retornar dados mock para demonstração
    return mockForumPosts;
}

export const apiCreateForumPost = async (token: string, title: string, content: string) => {
    // Simular criação de post
    const newPost = {
        id: Date.now(),
        titulo: title,
        conteudo: content,
        autor_nome: 'Usuário Demo',
        data: new Date().toISOString().split('T')[0],
        respostas: 0,
        curtidas: 0
    };
    return newPost;
}

export const apiFetchJobs = async () => {
    // Retornar dados mock para demonstração
    return mockJobs;
}

export const apiApplyForJob = async (token: string, jobId: number) => {
    // Simular candidatura bem-sucedida
    return { message: 'Candidatura enviada com sucesso!' };
}

export default api;
