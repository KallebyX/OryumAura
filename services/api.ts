import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Dados mock para demonstração
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

const mockBeneficiaries = [
  { id: 1, name: 'Maria da Silva', cpf: '123.456.789-00', nis: '12345678901', birthDate: '1985-05-20', address: 'Rua das Flores, 123, Centro', phone: '(55) 99999-8888' },
  { id: 2, name: 'João Pereira', cpf: '987.654.321-00', nis: '09876543210', birthDate: '1990-02-15', address: 'Av. Principal, 456, Bairro Norte', phone: '(55) 98888-7777' },
  { id: 3, name: 'Ana Costa', cpf: '456.789.123-00', nis: '45678912300', birthDate: '1978-11-08', address: 'Rua São José, 789, Vila Nova', phone: '(55) 97777-6666' },
  { id: 4, name: 'Carlos Santos', cpf: '789.123.456-00', nis: '78912345600', birthDate: '1982-07-22', address: 'Av. Brasil, 321, Centro', phone: '(55) 96666-5555' }
];

const mockAppointments = [
  { id: 1, title: 'Atualização CadÚnico', description: 'Beneficiária precisa atualizar endereço e renda familiar', priority: 'Alta', status: 'Pendente', beneficiary_name: 'Maria da Silva', beneficiary_id: 1, createdAt: '2024-01-15' },
  { id: 2, title: 'Solicitação de Cesta Básica', description: 'Beneficiário desempregado, primeira vez solicitando', priority: 'Média', status: 'Em Andamento', beneficiary_name: 'João Pereira', beneficiary_id: 2, createdAt: '2024-01-14' },
  { id: 3, title: 'Inscrição SCFV', description: 'Inscrever filho de 8 anos no Serviço de Convivência', priority: 'Baixa', status: 'Realizado', beneficiary_name: 'Ana Costa', beneficiary_id: 3, createdAt: '2024-01-13' },
  { id: 4, title: 'Renovação Bolsa Família', description: 'Renovação do benefício para família de 4 pessoas', priority: 'Alta', status: 'Pendente', beneficiary_name: 'Carlos Santos', beneficiary_id: 4, createdAt: '2024-01-12' }
];

const mockPrograms = [
  { id: 1, name: 'Programa Criança Feliz' },
  { id: 2, name: 'Bolsa Família' },
  { id: 3, name: 'Auxílio Gás' },
  { id: 4, name: 'Serviço de Convivência e Fortalecimento de Vínculos' },
  { id: 5, name: 'Programa de Aquisição de Alimentos' }
];

const mockNews = [
  { id: 1, title: 'Campanha do Agasalho 2025', content: 'A Secretaria de Assistência Social lança a Campanha do Agasalho 2025. Doe roupas e cobertores em bom estado nos pontos de coleta.', author: 'Prefeitura de Caçapava do Sul', date: '2024-01-15' },
  { id: 2, title: 'Abertura de Inscrições para Cursos', content: 'Estão abertas as inscrições para cursos profissionalizantes gratuitos. Mais informações no CRAS.', author: 'Secretaria de Assistência Social', date: '2024-01-14' },
  { id: 3, title: 'Mutirão de Documentação', content: 'Nos dias 20 e 21 de janeiro, haverá mutirão para emissão de documentos gratuitos.', author: 'Prefeitura Municipal', date: '2024-01-13' }
];

export const apiLogin = async (cpf: string, senha: string) => {
  // Simular login sempre bem-sucedido para demonstração
  return { access_token: 'demo-token-' + cpf };
};

export const apiFetchProfile = async (token: string) => {
  // Simular perfil do usuário para demonstração
  return {
    id: 1,
    nome: 'Usuário Demo',
    cpf: '99988877766',
    cargo: 'secretario'
  };
};

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

// Novas funções para dados de exemplo
export const apiFetchBeneficiaries = async () => {
    return { data: mockBeneficiaries };
}

export const apiFetchAppointments = async (params?: any) => {
    return { data: mockAppointments };
}

export const apiFetchPrograms = async () => {
    return { data: mockPrograms };
}

export const apiFetchNews = async () => {
    return { data: mockNews };
}

export const apiFetchBeneficiaryById = async (id: string) => {
    const beneficiary = mockBeneficiaries.find(b => b.id === parseInt(id));
    return { data: beneficiary };
}

export const apiFetchBeneficiaryPrograms = async (id: string) => {
    // Simular programas do beneficiário
    return { data: mockPrograms.slice(0, 2) };
}

export default api;
