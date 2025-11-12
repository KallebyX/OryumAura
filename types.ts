// === TYPES EXISTENTES ===

export interface User {
  id: number;
  nome: string;
  cpf: string;
  cargo: 'beneficiario' | 'servidor' | 'coordenador' | 'secretario';
  pontos: number;
  nivel: number;
  pontosProximoNivel: number;
  token?: string;
  enrolledCourses: number[];
  appliedJobs: number[];
}

export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluido';
  servidor_id: number;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  familiaAssociada?: string;
  dataCriacao: string;
}

export interface Course {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
}

export interface ForumPost {
    id: number;
    titulo: string;
    conteudo: string;
    autor_nome: string;
    data: string;
    respostas: number;
    curtidas: number;
}

export interface Job {
    id: number;
    titulo: string;
    empresa: string;
    descricao: string;
    localidade: string;
    tipo: 'Integral' | 'Meio Período' | 'Remoto';
}

export interface Family {
    id: number;
    nome_responsavel: string;
    cpf_responsavel: string;
    renda_familiar: number;
    bairro: string;
    membros: number;
    cadunico_atualizado: boolean;
    data_cadastro: string;
}

export interface SecretaryStats {
    totalBeneficiarios: number;
    totalFamilias: number;
    tarefasConcluidasMes: number;
    mediaEngajamentoCursos: number;
    tasksByStatus: { name: string, value: number }[];
    coursesByCategory: { name: string, value: number }[];
    recentActivity: { id: number, text: string, time: string, type: 'user' | 'task' | 'course' }[];
}

export interface News {
  id: number;
  title: string;
  content: string;
  author: string;
  category?: string;
  published?: boolean;
  createdAt: string;
}

export interface Appointment {
  id: number;
  beneficiary_id: number;
  beneficiary_name?: string;
  beneficiary_cpf?: string;
  server_id?: number;
  title: string;
  description: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Pendente' | 'Em Andamento' | 'Realizado' | 'Cancelado';
  scheduled_date?: string;
  createdAt: string;
}

export interface Beneficiary {
  id: number;
  name: string;
  cpf: string;
  nis?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  email?: string;
  bairro?: string;
  renda_familiar?: number;
  membros_familia?: number;
  vulnerabilidade_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Program {
  id: number;
  name: string;
  description?: string;
  eligibility_criteria?: string;
  enrollment_date?: string;
  status?: 'Ativo' | 'Inativo' | 'Suspenso';
  created_at?: string;
}

// === NOVOS TYPES - MÓDULO CRAS ===

export interface HomeVisit {
  id: number;
  beneficiary_id: number;
  beneficiary_name?: string;
  server_id: number;
  server_name?: string;
  visit_date: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  observations?: string;
  family_composition?: string;
  housing_conditions?: string;
  sanitation?: string;
  vulnerabilities?: string;
  photos?: string;
  status: 'Agendada' | 'Realizada' | 'Cancelada';
  created_at?: string;
}

export interface PAIFActivity {
  id: number;
  title: string;
  description?: string;
  activity_type: 'Oficina' | 'Palestra' | 'Grupo' | 'Atendimento Individual' | 'Visita';
  date: string;
  location?: string;
  responsible_server_id?: number;
  responsible_name?: string;
  max_participants?: number;
  status: 'Planejada' | 'Em Andamento' | 'Concluída' | 'Cancelada';
  created_at?: string;
}

export interface PAIFParticipant {
  activity_id: number;
  beneficiary_id: number;
  name?: string;
  cpf?: string;
  attendance?: 'Presente' | 'Ausente' | 'Justificado';
  notes?: string;
}

export interface SCFVEnrollment {
  id: number;
  beneficiary_id: number;
  beneficiary_name?: string;
  birthDate?: string;
  age_group: '0-6 anos' | '6-15 anos' | '15-17 anos' | '18-59 anos' | '60+ anos';
  enrollment_date?: string;
  status: 'Ativo' | 'Inativo' | 'Concluído';
  observations?: string;
}

// === NOVOS TYPES - MÓDULO CREAS ===

export interface CREASCase {
  id: number;
  beneficiary_id: number;
  beneficiary_name?: string;
  beneficiary_cpf?: string;
  birthDate?: string;
  case_number: string;
  case_type:
    | 'Violência Física'
    | 'Violência Psicológica'
    | 'Violência Sexual'
    | 'Negligência'
    | 'Abandono'
    | 'Trabalho Infantil'
    | 'Exploração Sexual'
    | 'Situação de Rua'
    | 'Violência Doméstica'
    | 'Outro';
  severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  description?: string;
  opened_date?: string;
  status: 'Aberto' | 'Em Acompanhamento' | 'Encaminhado' | 'Concluído' | 'Arquivado';
  responsible_server_id?: number;
  responsible_name?: string;
  confidential?: boolean;
}

export interface ProtectiveMeasure {
  id: number;
  case_id: number;
  measure_type: string;
  description?: string;
  institution?: string;
  start_date?: string;
  end_date?: string;
  status: 'Ativa' | 'Concluída' | 'Revogada';
  created_at?: string;
}

export interface CaseDeadline {
  id: number;
  case_id: number;
  case_number?: string;
  case_type?: string;
  beneficiary_name?: string;
  deadline_type: string;
  deadline_date: string;
  description?: string;
  status: 'Pendente' | 'Cumprido' | 'Atrasado';
  notification_sent?: boolean;
  created_at?: string;
}

export interface CaseForwarding {
  id: number;
  case_id: number;
  institution: string;
  contact_person?: string;
  contact_phone?: string;
  forwarding_date?: string;
  reason?: string;
  response?: string;
  response_date?: string;
}

// === NOVOS TYPES - MÓDULO DE BENEFÍCIOS ===

export interface EventualBenefit {
  id: number;
  beneficiary_id: number;
  beneficiary_name?: string;
  beneficiary_cpf?: string;
  benefit_type:
    | 'Cesta Básica'
    | 'Auxílio Funeral'
    | 'Auxílio Natalidade'
    | 'Material de Construção'
    | 'Documentação'
    | 'Passagem'
    | 'Outro';
  quantity?: number;
  value?: number;
  request_date?: string;
  approval_date?: string;
  delivery_date?: string;
  status: 'Solicitado' | 'Em Análise' | 'Aprovado' | 'Negado' | 'Entregue';
  justification?: string;
  approved_by?: number;
  delivered_by?: number;
  observations?: string;
}

export interface BenefitRenewal {
  id: number;
  beneficiary_id: number;
  program_id: number;
  renewal_date: string;
  notification_sent?: boolean;
  renewed?: boolean;
  created_at?: string;
}

// === NOVOS TYPES - DOCUMENTOS ===

export interface GeneratedDocument {
  id: number;
  document_type:
    | 'Ofício'
    | 'Relatório Social'
    | 'Termo de Encaminhamento'
    | 'Declaração'
    | 'Parecer Social'
    | 'Estudo Social'
    | 'Termo de Visita'
    | 'Outro';
  beneficiary_id?: number;
  beneficiary_name?: string;
  case_id?: number;
  title: string;
  content: string;
  template_name?: string;
  generated_by: number;
  generated_by_name?: string;
  generated_at?: string;
  file_path?: string;
  signed?: boolean;
  signature_date?: string;
}

// === NOVOS TYPES - AUDITORIA LGPD ===

export interface AuditLog {
  id: number;
  user_id: number;
  user_name?: string;
  action: string;
  resource: string;
  resource_id?: number;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp?: string;
}

export interface DataExportRequest {
  id: number;
  beneficiary_id: number;
  requested_by: number;
  request_date?: string;
  status: 'Pendente' | 'Processando' | 'Concluído' | 'Negado';
  export_file_path?: string;
  completion_date?: string;
}

export interface DataDeletionRequest {
  id: number;
  beneficiary_id: number;
  requested_by: number;
  request_date?: string;
  justification: string;
  status: 'Pendente' | 'Em Análise' | 'Aprovado' | 'Negado' | 'Executado';
  reviewed_by?: number;
  review_date?: string;
  execution_date?: string;
}

// === NOVOS TYPES - PORTAL DO CIDADÃO ===

export interface AnonymousReport {
  id: number;
  report_type:
    | 'Violência Doméstica'
    | 'Abuso Infantil'
    | 'Negligência'
    | 'Trabalho Infantil'
    | 'Exploração'
    | 'Outro';
  description: string;
  location?: string;
  report_date?: string;
  status: 'Recebida' | 'Em Análise' | 'Encaminhada' | 'Resolvida';
  assigned_to?: number;
  assigned_to_name?: string;
  protocol_number?: string;
}

export interface ChatbotMessage {
  id: number;
  user_id?: number;
  session_id: string;
  message: string;
  sender: 'user' | 'bot';
  intent?: string;
  confidence?: number;
  timestamp?: string;
}

export interface Notification {
  id: number;
  beneficiary_id: number;
  title: string;
  message: string;
  type: 'Agendamento' | 'Benefício' | 'Renovação' | 'Informativo' | 'Alerta';
  channel: 'Sistema' | 'WhatsApp' | 'SMS' | 'Email';
  sent?: boolean;
  read?: boolean;
  sent_at?: string;
  read_at?: string;
  created_at?: string;
}

// === NOVOS TYPES - IA E PREDIÇÃO ===

export interface VulnerabilityPrediction {
  id: number;
  beneficiary_id: number;
  beneficiary_name?: string;
  beneficiary_cpf?: string;
  prediction_score: number;
  risk_level: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  factors?: string | string[];
  recommendations?: string | string[];
  prediction_date?: string;
  model_version?: string;
}

export interface AIInsight {
  id: number;
  insight_type:
    | 'Padrão Identificado'
    | 'Anomalia Detectada'
    | 'Recomendação'
    | 'Alerta'
    | 'Tendência';
  title: string;
  description: string;
  related_beneficiaries?: string;
  related_bairro?: string;
  severity: 'Info' | 'Baixa' | 'Média' | 'Alta';
  actionable?: boolean;
  created_at?: string;
  acknowledged?: boolean;
  acknowledged_by?: number;
  acknowledged_by_name?: string;
  acknowledged_at?: string;
}

// === NOVOS TYPES - OUTROS ===

export interface CadUnicoData {
  cpf: string;
  nis?: string;
  name?: string;
  renda_per_capita?: number;
  last_sync?: string;
}

export interface ReportStats {
  totalBeneficiaries?: number;
  totalAppointments?: number;
  totalPrograms?: number;
  totalCREASCases?: number;
  appointmentsByStatus?: { name: string; count: number }[];
  beneficiariesByProgram?: { name: string; count: number }[];
  beneficiariesByBairro?: { bairro: string; count: number }[];
  vulnerabilityByBairro?: { bairro: string; avg_score: number }[];
  eventualBenefitsByType?: { benefit_type: string; count: number }[];
  creasCasesByType?: { case_type: string; count: number }[];
  homeVisitsByMonth?: { month: string; count: number }[];
}

export interface SUASReport {
  periodo: string;
  municipio: string;
  secretaria: string;
  dados: {
    total_familias: number;
    atendimentos_mes: number;
    visitas_mes: number;
    atividades_paif_mes: number;
    total_scfv: number;
    casos_creas_ativos: number;
    beneficios_entregues_mes: number;
  };
}
