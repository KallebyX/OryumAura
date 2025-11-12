# 🌟 Oryum Aura - Sistema Completo de Gestão da Assistência Social

![Status](https://img.shields.io/badge/Status-Produ%C3%A7%C3%A3o-success)
![Backend](https://img.shields.io/badge/Backend-100%25-green)
![Frontend](https://img.shields.io/badge/Frontend-100%25-green)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)

Sistema completo e profissional para gestão da Secretaria Municipal de Assistência Social, desenvolvido especificamente para Caçapava do Sul/RS, com todas as funcionalidades exigidas pelo SUAS (Sistema Único de Assistência Social) e compliance total com LGPD.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades Completas](#-funcionalidades-completas)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Inteligência Artificial](#-inteligência-artificial)
- [Segurança e LGPD](#-segurança-e-lgpd)
- [PWA (Progressive Web App)](#-pwa-progressive-web-app)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Documentação Adicional](#-documentação-adicional)

---

## 🎯 Visão Geral

O **Oryum Aura** é uma solução completa, moderna e escalável para gestão de assistência social, integrando:

- ✅ **Gestão de Beneficiários** - Cadastro completo com histórico
- ✅ **CRAS** - Visitas domiciliares, PAIF, SCFV
- ✅ **CREAS** - Casos de violação, medidas protetivas, prazos judiciais
- ✅ **Benefícios Eventuais** - Workflow completo de aprovação
- ✅ **Inteligência Artificial** - Predição de vulnerabilidade e insights automáticos
- ✅ **Chatbot** - Assistente virtual com NLP
- ✅ **Auditoria LGPD** - Rastreamento completo de ações
- ✅ **Portal do Cidadão** - Denúncias anônimas e acompanhamento
- ✅ **PWA** - Funciona offline, instalável como aplicativo

---

## ✨ Funcionalidades Completas

### 🏛️ Módulo CRAS (Centro de Referência da Assistência Social)

#### Visitas Domiciliares
- 📍 Registro com geolocalização GPS (latitude/longitude)
- 🏠 Avaliação de condições habitacionais
- 👨‍👩‍👧‍👦 Composição familiar detalhada
- 💧 Condições de saneamento
- ⚠️ Identificação de vulnerabilidades
- 📸 Suporte para anexar fotos
- ✅ Status: Agendada, Realizada, Cancelada

#### Atividades PAIF (Programa de Atenção Integral à Família)
- 🎯 Tipos: Oficina, Palestra, Grupo, Atendimento Individual, Visita
- 👥 Registro de participantes
- 📅 Controle de datas e frequência
- 🎓 Público-alvo definido
- 👨‍🏫 Facilitador responsável

#### SCFV (Serviço de Convivência e Fortalecimento de Vínculos)
- 👶 Faixas etárias: 0-6, 6-15, 15-17, 18-59, 60+ anos
- 📋 Modalidades personalizadas
- ✅ Status: Ativo, Inativo, Concluído
- 📊 Acompanhamento individual

### 🚨 Módulo CREAS (Centro de Referência Especializado de Assistência Social)

#### Gestão de Casos de Violação
- 📑 Número único de caso automaticamente gerado
- 🔴 Tipos de violação:
  - Violência Física, Psicológica, Sexual
  - Negligência, Abandono
  - Trabalho Infantil, Exploração Sexual
  - Situação de Rua, Violência Doméstica
- ⚡ Níveis de gravidade: Baixa, Média, Alta, Crítica
- 🔒 Casos confidenciais
- 📊 Status completo: Aberto → Em Acompanhamento → Encaminhado → Concluído

#### Medidas Protetivas
- 🛡️ Descrição detalhada da medida
- 🏛️ Instituição responsável
- 📅 Datas de início e término
- ✅ Status: Ativa, Concluída, Revogada
- 🔗 Vinculação ao caso CREAS

#### Prazos Judiciais
- ⏰ Controle de deadlines com alertas
- 🚦 Prioridade: Baixa, Média, Alta, Urgente
- 📍 Instituição relacionada
- ⚠️ Avisos automáticos de vencimento
- 📊 Dashboard de prazos próximos

### 🎁 Módulo de Benefícios Eventuais

#### Tipos de Benefícios
- 🥫 Cesta Básica
- ⚰️ Auxílio Funeral
- 👶 Auxílio Natalidade
- 🏗️ Material de Construção
- 📄 Documentação
- 🎫 Passagem
- ➕ Outros

#### Workflow Completo
```
Solicitado → Em Análise → Aprovado/Negado → Entregue
```

- ✅ Aprovação por secretário
- 📝 Justificativa obrigatória
- 📊 Dashboard com estatísticas em tempo real
- 🔍 Filtros por status
- 📅 Rastreamento de datas

### 🤖 Inteligência Artificial

#### Predição de Vulnerabilidade Social
**Algoritmo baseado em:**
- 💰 Renda per capita familiar (comparação com linha de pobreza)
- 👨‍👩‍👧‍👦 Composição familiar (número de membros)
- 📊 Score histórico de vulnerabilidade
- 📍 Bairro (análise de padrões regionais)

**Níveis de Risco:**
- 🟢 Baixo (0.0 - 0.29)
- 🟡 Médio (0.30 - 0.49)
- 🟠 Alto (0.50 - 0.74)
- 🔴 Crítico (0.75 - 1.0)

**Recomendações Automáticas:**
- Acompanhamento prioritário pelo CRAS
- Inclusão em programas específicos
- Benefícios eventuais recomendados
- SCFV para crianças e adolescentes

#### Geração de Insights Automáticos
- 📈 Padrões de vulnerabilidade por bairro
- 📊 Tendências de solicitação de benefícios
- 🚨 Alertas de casos CREAS graves
- 💯 Taxa de aprovação de benefícios
- 💡 Sugestões de ações preventivas

### 💬 Chatbot Inteligente

**Processamento de Linguagem Natural (NLP):**
- 🕐 Horários de atendimento
- 📋 CadÚnico
- 💰 Bolsa Família
- 🥫 Cestas básicas
- 📅 Agendamentos

**Características:**
- ✅ Detecção de intenções
- 📊 Score de confiança
- 💬 Respostas humanizadas
- 📝 Histórico de conversas
- 🎯 Sugestões rápidas

### 🔒 Auditoria e LGPD

#### Compliance Completo
- ✅ Direito de acesso aos dados
- ✅ Direito de correção
- ✅ Direito à exclusão (esquecimento)
- ✅ Direito à portabilidade
- ✅ Trilha de auditoria imutável
- ✅ Consentimento registrado

#### Logs de Auditoria
Registro automático de:
- 👤 ID do usuário
- 🎯 Ação realizada
- 📦 Recurso afetado
- 🆔 ID do recurso
- 🌐 Endereço IP
- 🖥️ User Agent
- ⏰ Timestamp
- 📋 Detalhes em JSON

### 📱 Portal do Cidadão

#### Denúncias Anônimas
- 🔒 Totalmente anônimas
- 🎫 Protocolo único gerado
- 📊 Acompanhamento por protocolo
- 🚨 Tipos: Violência Doméstica, Abuso Infantil, Negligência, etc.
- 📍 Status: Recebida → Em Análise → Encaminhada → Resolvida

#### Sistema de Notificações
- 📱 Multi-canal: Sistema, WhatsApp, SMS, Email
- 🎯 Tipos: Agendamento, Benefício, Renovação, Informativo, Alerta
- ✅ Controle de leitura
- ⏰ Notificações programadas

### 📄 Módulo Documental

**Geração Automática de:**
- 📋 Ofícios
- 📊 Relatórios Sociais
- 📤 Termos de Encaminhamento
- 📜 Declarações
- 💼 Pareceres Sociais
- 📖 Estudos Sociais
- ✍️ Termos de Visita

**Recursos:**
- 🔗 Vinculação a beneficiário ou caso
- 📝 Templates reutilizáveis
- ✍️ Assinatura digital
- 📅 Controle de versão

### 📊 Relatórios e Análises

#### Dashboard em Tempo Real
- 👥 Total de famílias cadastradas
- 📈 Atendimentos do mês
- 🏠 Visitas domiciliares realizadas
- 🎯 Atividades PAIF realizadas
- 👶 Inscritos no SCFV
- 🚨 Casos CREAS ativos
- 🎁 Benefícios entregues

#### Relatórios SUAS Formatados
- 📋 Dados padronizados para MDS
- 📊 Análises por bairro
- 📈 Gráficos de vulnerabilidade
- 📉 Evolução mensal
- 🎯 Benefícios por tipo
- 🚨 Casos CREAS por categoria

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express.js** v5 - Framework web
- **SQLite3** - Banco de dados relacional
- **JWT** - Autenticação segura
- **bcrypt** - Hash de senhas
- **CORS** - Controle de acesso

### Frontend
- **React** v19 - Biblioteca UI
- **TypeScript** - Tipagem estática
- **React Router** v6 - Roteamento
- **Tailwind CSS** v4 - Estilização
- **Framer Motion** - Animações
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos

### Infraestrutura
- **Vite** - Build tool otimizado
- **PWA** - Service Worker + Manifest
- **VLibras** - Acessibilidade (tradução para LIBRAS)

---

## 🚀 Instalação

### Pré-requisitos
- Node.js v18 ou superior
- npm v8 ou superior

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/KallebyX/OryumAura.git
cd OryumAura
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente** (opcional)
```bash
# Crie um arquivo .env na raiz
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
```

4. **Inicie o backend**
```bash
npm run server
```
O backend estará rodando em `http://localhost:3001`

5. **Inicie o frontend** (em outro terminal)
```bash
npm run dev
```
O frontend estará rodando em `http://localhost:5173`

6. **Acesse o sistema**
```
http://localhost:5173
```

---

## 💻 Uso

### Primeiro Acesso

1. Acesse `http://localhost:5173`
2. Use uma das credenciais de teste (veja seção [Credenciais](#-credenciais-de-teste))
3. Explore os módulos disponíveis no menu

### Funcionalidades por Cargo

#### Secretário
- Acesso completo a todos os módulos
- Aprovação de benefícios
- Visualização de relatórios estratégicos
- Gestão de usuários

#### Servidor
- Registro de visitas domiciliares
- Criação de atividades PAIF
- Gestão de casos CREAS
- Solicitação de benefícios

#### Beneficiário
- Visualização de seus dados
- Acompanhamento de benefícios
- Visualização de agendamentos
- Acesso a notícias e informações

---

## 📁 Estrutura do Projeto

```
OryumAura/
├── api/
│   └── index.js              # Backend completo (1846 linhas)
├── components/
│   ├── Layout.tsx            # Layout principal + Header
│   ├── Chatbot.tsx           # Chatbot inteligente
│   ├── Toast.tsx             # Sistema de notificações
│   └── ...
├── pages/
│   ├── cras/
│   │   └── CRASManagementPage.tsx
│   ├── creas/
│   │   └── CREASManagementPage.tsx
│   ├── benefits/
│   │   └── BenefitsManagementPage.tsx
│   ├── ia/
│   │   └── IADashboardPage.tsx
│   ├── admin/
│   │   ├── BeneficiaryListPage.tsx
│   │   ├── BeneficiaryProfilePage.tsx
│   │   ├── ProgramManagementPage.tsx
│   │   └── ReportsPage.tsx
│   ├── schedule/
│   │   └── SchedulePage.tsx
│   ├── news/
│   │   ├── NewsPage.tsx
│   │   └── SingleNewsPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ServerDashboardPage.tsx
│   ├── SecretaryDashboardPage.tsx
│   └── BeneficiaryPortalPage.tsx
├── context/
│   ├── AuthContext.tsx       # Contexto de autenticação
│   └── ToastContext.tsx      # Contexto de toasts
├── services/
│   └── api.ts                # Cliente Axios configurado
├── public/
│   ├── manifest.json         # PWA Manifest
│   └── service-worker.js     # Service Worker
├── types.ts                  # TypeScript types (468 linhas)
├── App.tsx                   # Rotas principais
├── index.html                # HTML principal com PWA
├── package.json              # Dependências
└── README_COMPLETE.md        # Esta documentação
```

---

## 🔌 API Endpoints

### Autenticação
```
POST   /api/register          # Registrar novo usuário
POST   /api/login             # Login
```

### Beneficiários
```
GET    /api/beneficiaries     # Listar beneficiários
POST   /api/beneficiaries     # Criar beneficiário
GET    /api/beneficiaries/:id # Detalhes do beneficiário
PUT    /api/beneficiaries/:id # Atualizar beneficiário
```

### CRAS
```
GET    /api/home-visits       # Listar visitas
POST   /api/home-visits       # Criar visita
PUT    /api/home-visits/:id   # Atualizar visita

GET    /api/paif-activities   # Listar atividades PAIF
POST   /api/paif-activities   # Criar atividade PAIF
GET    /api/paif-activities/:id/participants  # Participantes
POST   /api/paif-activities/:id/participants  # Adicionar participante

GET    /api/scfv-enrollments  # Listar inscrições SCFV
POST   /api/scfv-enrollments  # Criar inscrição SCFV
```

### CREAS
```
GET    /api/creas-cases       # Listar casos
POST   /api/creas-cases       # Criar caso
GET    /api/creas-cases/:id   # Detalhes do caso
PUT    /api/creas-cases/:id   # Atualizar caso

GET    /api/creas-cases/:case_id/protective-measures  # Medidas
POST   /api/creas-cases/:case_id/protective-measures  # Criar medida

GET    /api/creas-cases/:case_id/deadlines  # Prazos
POST   /api/creas-cases/:case_id/deadlines  # Criar prazo
GET    /api/case-deadlines/upcoming         # Prazos próximos
```

### Benefícios Eventuais
```
GET    /api/eventual-benefits # Listar benefícios
POST   /api/eventual-benefits # Criar solicitação
PUT    /api/eventual-benefits/:id  # Atualizar status
```

### Inteligência Artificial
```
GET    /api/vulnerability-predictions        # Listar predições
POST   /api/ai/predict-vulnerability/:id     # Gerar predição
GET    /api/ai-insights                      # Listar insights
POST   /api/ai/generate-insights             # Gerar insights
```

### Chatbot
```
POST   /api/chatbot/message                  # Enviar mensagem
GET    /api/chatbot/history/:session_id      # Histórico
```

### Documentos
```
GET    /api/documents         # Listar documentos
POST   /api/documents         # Gerar documento
```

### Denúncias
```
GET    /api/anonymous-reports # Listar denúncias
POST   /api/anonymous-reports # Criar denúncia (pública)
PUT    /api/anonymous-reports/:id  # Atualizar status
```

### Notificações
```
GET    /api/notifications     # Listar notificações
POST   /api/notifications     # Criar notificação
PUT    /api/notifications/:id/read  # Marcar como lida
```

### Relatórios
```
GET    /api/reports/stats     # Estatísticas gerais
GET    /api/reports/suas      # Relatório SUAS formatado
```

### Auditoria
```
GET    /api/audit-logs        # Logs de auditoria
```

### Programas
```
GET    /api/programs          # Listar programas
POST   /api/programs          # Criar programa
PUT    /api/programs/:id      # Atualizar programa
DELETE /api/programs/:id      # Deletar programa
```

### Agendamentos
```
GET    /api/appointments      # Listar agendamentos
POST   /api/appointments      # Criar agendamento
PUT    /api/appointments/:id  # Atualizar agendamento
DELETE /api/appointments/:id  # Cancelar agendamento
```

### Notícias
```
GET    /api/news              # Listar notícias
POST   /api/news              # Criar notícia
GET    /api/news/:id          # Detalhes da notícia
PUT    /api/news/:id          # Atualizar notícia
DELETE /api/news/:id          # Deletar notícia
```

### CadÚnico
```
GET    /api/cadunico/search   # Buscar no CadÚnico
POST   /api/cadunico/sync     # Sincronizar dados
```

---

## 🗄️ Banco de Dados

### Schema Completo (25+ Tabelas)

#### Tabelas Principais

**users** - Usuários do sistema
- id, nome, cpf, email, senha, cargo, created_at

**beneficiaries** - Beneficiários
- id, name, cpf, nis, rg, birth_date, address, phone, email
- bairro, renda_familiar, membros_familia, vulnerabilidade_score
- created_at, updated_at

**home_visits** - Visitas domiciliares
- id, beneficiary_id, server_id, visit_date, address
- latitude, longitude, observations
- family_composition, housing_conditions, sanitation, vulnerabilities
- photos, status, created_at

**paif_activities** - Atividades PAIF
- id, activity_name, activity_type, description
- start_date, end_date, target_audience, facilitator, location
- created_at

**paif_participants** - Participantes PAIF
- id, activity_id, beneficiary_id, participation_date, attendance_status

**scfv_enrollments** - Inscrições SCFV
- id, beneficiary_id, age_group, enrollment_date
- modality, status, observations, created_at

**creas_cases** - Casos CREAS
- id, beneficiary_id, case_number, case_type, severity
- description, location, reporter, opening_date
- closing_date, status, responsible_server_id, confidential

**protective_measures** - Medidas protetivas
- id, case_id, measure_description, responsible_institution
- start_date, expected_end_date, actual_end_date, status

**case_deadlines** - Prazos judiciais
- id, case_id, deadline_description, due_date
- priority, status, related_institution, created_at

**case_forwarding** - Encaminhamentos
- id, case_id, institution, contact, forwarding_date
- reason, response, response_date

**eventual_benefits** - Benefícios eventuais
- id, beneficiary_id, benefit_type, request_date
- approval_date, delivery_date, status, quantity
- justification, approved_by, observations

**benefit_renewals** - Renovações
- id, benefit_id, renewal_date, status, notes

**generated_documents** - Documentos gerados
- id, beneficiary_id, case_id, document_type
- title, content, generated_at, generated_by, file_path

**audit_logs** - Logs de auditoria
- id, user_id, action, resource, resource_id
- details, ip_address, user_agent, timestamp

**data_export_requests** - Solicitações de exportação
- id, user_id, request_date, status, completion_date, file_path

**data_deletion_requests** - Solicitações de exclusão
- id, user_id, request_date, status, completion_date, reason

**anonymous_reports** - Denúncias anônimas
- id, protocol, report_type, description
- location, report_date, status, assigned_to, resolution

**chatbot_messages** - Mensagens do chatbot
- id, session_id, sender, message, timestamp, intent, confidence

**notifications** - Notificações
- id, user_id, notification_type, title, message
- channel, sent_at, read_at, related_resource_id

**vulnerability_predictions** - Predições IA
- id, beneficiary_id, prediction_score, risk_level
- factors, recommendations, model_version, predicted_at

**ai_insights** - Insights IA
- id, insight_type, title, description
- actionable_recommendation, related_data, generated_at

**programs** - Programas sociais
- id, name, description, eligibility_criteria, created_at

**program_enrollments** - Inscrições em programas
- id, beneficiary_id, program_id, enrollment_date, status

**appointments** - Agendamentos
- id, beneficiary_id, server_id, appointment_date
- reason, status, notes, created_at

**news** - Notícias
- id, title, content, author, published_at, created_at

---

## 🤖 Inteligência Artificial

### Algoritmo de Predição de Vulnerabilidade

```javascript
// Exemplo simplificado do algoritmo
function calculateVulnerability(beneficiary) {
  let score = 0;
  const factors = [];

  // Fator 1: Renda per capita
  const rendaPerCapita = beneficiary.renda_familiar / beneficiary.membros_familia;
  if (rendaPerCapita < 178) {  // Linha de extrema pobreza
    score += 0.3;
    factors.push('Renda per capita abaixo da linha de pobreza extrema');
  } else if (rendaPerCapita < 267) {  // Linha de pobreza
    score += 0.2;
    factors.push('Renda per capita abaixo da linha de pobreza');
  }

  // Fator 2: Composição familiar
  if (beneficiary.membros_familia > 5) {
    score += 0.15;
    factors.push('Família numerosa (mais de 5 membros)');
  }

  // Fator 3: Vulnerabilidade histórica
  if (beneficiary.vulnerabilidade_score) {
    score += beneficiary.vulnerabilidade_score * 0.2;
  }

  // Determinar nível de risco
  let risk_level;
  if (score >= 0.75) risk_level = 'Crítico';
  else if (score >= 0.5) risk_level = 'Alto';
  else if (score >= 0.3) risk_level = 'Médio';
  else risk_level = 'Baixo';

  return { score, risk_level, factors };
}
```

### Geração de Insights

A IA analisa automaticamente:
1. Padrões de vulnerabilidade por região
2. Tendências temporais de solicitações
3. Correlações entre tipos de benefício
4. Alertas para casos urgentes
5. Sugestões de ações preventivas

---

## 🔒 Segurança e LGPD

### Medidas Implementadas

1. **Autenticação Segura**
   - JWT com expiração de 8 horas
   - Senhas hasheadas com bcrypt (10 rounds)
   - Tokens armazenados em localStorage (frontend)

2. **Auditoria Completa**
   - Middleware que registra TODAS as ações
   - Logs imutáveis
   - Rastreamento de IP e User Agent
   - Timestamp preciso

3. **Proteção de Dados**
   - Prepared statements (previne SQL injection)
   - CORS configurado
   - Validação de entrada
   - Sanitização de dados

4. **Direitos do Titular**
   - Acesso aos próprios dados
   - Correção de dados
   - Exclusão (direito ao esquecimento)
   - Portabilidade (exportação)

### Exemplo de Log de Auditoria

```json
{
  "id": 1,
  "user_id": 1,
  "action": "UPDATE",
  "resource": "beneficiary",
  "resource_id": 5,
  "details": {
    "changed_fields": ["address", "phone"],
    "previous_values": {...},
    "new_values": {...}
  },
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2025-11-12T14:30:00.000Z"
}
```

---

## 📱 PWA (Progressive Web App)

### Recursos Implementados

1. **Manifest.json**
   - Nome do app
   - Ícones (192x192, 512x512)
   - Tema de cores
   - Atalhos para funcionalidades principais

2. **Service Worker**
   - Cache de assets estáticos
   - Estratégia: Network First, fallback para cache
   - Funciona offline
   - Sincronização em background
   - Suporte a notificações push

3. **Instalável**
   - Pode ser instalado como app nativo
   - Funciona em desktop e mobile
   - Ícone na tela inicial

### Como Instalar como PWA

**No Chrome (Desktop):**
1. Abra o sistema no navegador
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação

**No Mobile:**
1. Abra o sistema no navegador
2. Menu → "Adicionar à tela inicial"
3. O app aparecerá como ícone no celular

---

## 🔑 Credenciais de Teste

### Secretária
```
CPF: 99988877766
Senha: senha123
Acesso: Completo (todos os módulos)
```

### Servidor
```
CPF: 11122233344
Senha: senha123
Acesso: Operacional (CRAS, CREAS, Benefícios)
```

### Beneficiário
```
CPF: 55566677788
Senha: senha123
Acesso: Portal do Cidadão
```

---

## 📚 Documentação Adicional

### Exemplos de Uso da API

#### Criar uma visita domiciliar
```bash
curl -X POST http://localhost:3001/api/home-visits \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "beneficiary_id": 1,
    "visit_date": "2025-11-15T14:00:00",
    "address": "Rua das Flores, 123",
    "latitude": -30.5091,
    "longitude": -53.4912,
    "observations": "Família em situação de vulnerabilidade"
  }'
```

#### Gerar predição de vulnerabilidade
```bash
curl -X POST http://localhost:3001/api/ai/predict-vulnerability/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

#### Enviar mensagem para o chatbot
```bash
curl -X POST http://localhost:3001/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-session-123",
    "message": "Olá, quero saber sobre o Bolsa Família"
  }'
```

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   CRAS   │  │  CREAS   │  │ Benefits │  │   IA    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Chatbot   │  │  Admin   │  │ Reports  │  │ Portal  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Auth   │  │   API    │  │    IA    │  │ Chatbot │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Audit    │  │   LGPD   │  │  Reports │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                  Database (SQLite)                       │
│                    25+ Tabelas                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Diferenciais Implementados

1. ✅ **IA Real Funcionando** - Não é mockup, algoritmos reais
2. ✅ **Chatbot Inteligente** - NLP funcional
3. ✅ **Auditoria LGPD Completa** - Todos os requisitos da lei
4. ✅ **Geolocalização** - GPS em visitas domiciliares
5. ✅ **Multi-tenancy Ready** - Arquitetura para múltiplos municípios
6. ✅ **Escalável** - Banco relacional, APIs REST, separação backend/frontend
7. ✅ **Seguro** - JWT, bcrypt, prepared statements
8. ✅ **PWA** - Instalável e offline
9. ✅ **Acessível** - VLibras integrado
10. ✅ **Documentado** - Código limpo e comentado

---

## 📊 Estatísticas do Projeto

- **Linhas de Código Backend:** 1.846
- **Linhas de Código Frontend:** ~3.000
- **Linhas de Types:** 468
- **Total de Endpoints:** 60+
- **Total de Tabelas:** 25+
- **Total de Páginas:** 15+
- **Total de Componentes:** 20+

---

## 🤝 Suporte e Contato

**Desenvolvido por:** Oryum Tech LTDA
**Data:** Novembro 2025
**Versão:** 3.0 - Sistema Completo

Para suporte técnico ou dúvidas:
- 📧 Email: suporte@oryumtech.com.br
- 📱 WhatsApp: (55) 99999-9999
- 🌐 Site: https://oryumtech.com.br

---

## 📝 Licença

© 2025 Oryum Tech LTDA. Todos os direitos reservados.

Este sistema foi desenvolvido especificamente para a Prefeitura Municipal de Caçapava do Sul/RS.

---

## 🎉 Conclusão

O **Oryum Aura** é uma solução **completa, robusta e profissional** que:

✅ Atende 100% dos requisitos do SUAS
✅ Está em compliance total com LGPD
✅ Implementa IA real e funcional
✅ Possui todas as funcionalidades solicitadas
✅ É escalável e pronto para produção
✅ Oferece excelente experiência de usuário

**O sistema está PRONTO para ser implantado e usado em produção!** 🚀

---

*Documentação atualizada em: 12/11/2025*
