#!/bin/bash

# Script para criar todas as 10 issues do OryumAura automaticamente
# Requer: GitHub CLI (gh) instalado e autenticado

set -e

echo "🚀 Criando 10 issues para OryumAura..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Issue #1 - CRITICAL: Testes Automatizados
echo -e "${BLUE}[1/10]${NC} Criando Issue #1: Testes Automatizados..."
gh issue create \
  --title "[CRITICAL] Implementar testes automatizados - Cobertura 80%+" \
  --body "## 🎯 Objetivo

Implementar suite completa de testes automatizados para garantir qualidade e confiabilidade do código.

## 📊 Meta de Cobertura
**Target:** ≥ 80% de cobertura de código

## 🔧 Tecnologias
- Unit tests: Vitest + React Testing Library
- Integration tests: Supertest
- E2E tests: Playwright

## 📦 Escopo

### Testes Unitários
- api/middleware/security.js - Validação de CPF
- Helpers de refresh token
- Componentes: Layout, Modal, Toast
- Contexts: AuthContext, ToastContext

### Testes de Integração
- Autenticação (login, refresh, logout)
- CRUD de beneficiários
- Sistema de agendamentos
- Auditoria LGPD

### Testes E2E
- Fluxo de login
- Cadastro de beneficiário
- Criação de agendamento

## ✅ Critérios de Aceitação
- Coverage ≥ 80%
- CI/CD executando testes
- Scripts npm configurados
- Badge de coverage no README

Veja: ROADMAP.md v2.1.0" \
  --label "priority:critical,type:testing,size:L" && echo -e "${GREEN}✓${NC} Issue #1 criada"

# Issue #2 - HIGH: Corrigir TypeScript
echo -e "${BLUE}[2/10]${NC} Criando Issue #2: Corrigir Erros TypeScript..."
gh issue create \
  --title "[HIGH] Corrigir 30+ erros TypeScript - Zero compilation errors" \
  --body "## 🐛 Problema
30+ erros TypeScript identificados durante refatoração enterprise.

## 📝 Principais Erros

**components/Layout.tsx**
- Property 'vw' does not exist

**pages/ServerDashboardPage.tsx**
- Framer Motion types incorretos
- Property 'date' missing in Appointment

**pages/schedule/SchedulePage.tsx**
- Properties 'reason', 'date', 'time' missing

**pages/cras/CRASManagementPage.tsx**
- PAIFActivity interfaces incompletas
- SCFVEnrollment fields missing

**pages/creas/CREASManagementPage.tsx**
- CREASCase interfaces desatualizadas
- ProtectiveMeasure fields missing
- CaseDeadline properties missing

**pages/ia/IADashboardPage.tsx**
- AIInsight interfaces incorretas

## ✅ Critérios de Aceitação
- npx tsc --noEmit retorna 0 erros
- Interfaces em types.ts atualizadas
- CI/CD passando
- Documentação atualizada

Veja: ROADMAP.md v2.1.0" \
  --label "priority:high,type:bug,size:M" && echo -e "${GREEN}✓${NC} Issue #2 criada"

# Issue #3 - HIGH: Swagger Documentation
echo -e "${BLUE}[3/10]${NC} Criando Issue #3: Documentação Swagger..."
gh issue create \
  --title "[HIGH] Adicionar documentação Swagger/OpenAPI - 60+ endpoints" \
  --body "## 🎯 Objetivo
Documentar todos os 60+ endpoints da API usando Swagger/OpenAPI.

## 📦 Dependências
\`\`\`bash
npm install swagger-jsdoc swagger-ui-express
npm install @types/swagger-jsdoc @types/swagger-ui-express --save-dev
\`\`\`

## 🔧 Endpoints a Documentar
- Autenticação (3): login, refresh, logout
- Beneficiários (6): CRUD + programs
- Programas (5): CRUD + enroll
- Agendamentos (6): CRUD + status
- CRAS (9): visitas, PAIF, SCFV
- CREAS (10): casos, medidas, prazos
- Benefícios Eventuais (3)
- IA (4): predições, insights
- Auditoria (1): logs LGPD

## ✅ Critérios de Aceitação
- Swagger UI em /api/docs
- Todos endpoints documentados
- Exemplos de request/response
- Schemas de validação
- Códigos de erro
- Export OpenAPI 3.0 JSON

Veja: ROADMAP.md v2.1.0" \
  --label "priority:high,type:documentation,size:M" && echo -e "${GREEN}✓${NC} Issue #3 criada"

# Issue #4 - HIGH: Paginação
echo -e "${BLUE}[4/10]${NC} Criando Issue #4: Paginação..."
gh issue create \
  --title "[HIGH] Implementar paginação cursor-based em 8+ endpoints" \
  --body "## 🎯 Objetivo
Implementar paginação eficiente (cursor-based) em todos endpoints de listagem.

## 📊 Endpoints Afetados
- GET /api/beneficiaries
- GET /api/programs
- GET /api/appointments
- GET /api/news
- GET /api/home-visits
- GET /api/creas-cases
- GET /api/eventual-benefits
- GET /api/audit-logs

## 🔧 Especificação
Query params: ?page=1&limit=20&sort=created_at&order=desc

Response format:
\`\`\`json
{
  \"data\": [...],
  \"pagination\": {
    \"page\": 1,
    \"limit\": 20,
    \"total\": 500,
    \"totalPages\": 25,
    \"hasNext\": true,
    \"hasPrev\": false
  }
}
\`\`\`

## ✅ Critérios de Aceitação
- Todos endpoints principais paginados
- Cursor-based para performance
- Frontend atualizado (infinite scroll)
- Documentação Swagger atualizada
- Redução 80%+ em response time

Veja: ROADMAP.md v2.2.0" \
  --label "priority:high,type:feature,size:M" && echo -e "${GREEN}✓${NC} Issue #4 criada"

# Issue #5 - HIGH: Validação CPF
echo -e "${BLUE}[5/10]${NC} Criando Issue #5: Validação CPF..."
gh issue create \
  --title "[HIGH] Aplicar validação de CPF em endpoints de criação/atualização" \
  --body "## 🔐 Objetivo
Aplicar validação de CPF existente (api/middleware/security.js) em todos endpoints relevantes.

## 🔧 Endpoints a Atualizar
- POST /api/beneficiaries
- PUT /api/beneficiaries/:id
- POST /api/register
- POST /api/login
- GET /api/cadunico/search

## ✅ Critérios de Aceitação
- Validação aplicada em todos endpoints
- Mensagem de erro clara em português
- Testes unitários da validação
- Documentação Swagger atualizada
- CI/CD passando

Veja: ROADMAP.md v2.2.0" \
  --label "priority:high,type:security,size:S" && echo -e "${GREEN}✓${NC} Issue #5 criada"

# Issue #6 - HIGH: Redis Caching
echo -e "${BLUE}[6/10]${NC} Criando Issue #6: Redis Caching..."
gh issue create \
  --title "[HIGH] Implementar Redis caching - Redução 70%+ queries DB" \
  --body "## ⚡ Objetivo
Implementar sistema de caching com Redis para reduzir carga no banco.

## 📦 Setup
\`\`\`bash
npm install ioredis
\`\`\`

## 🎯 Estratégias de Cache

**Cache-Aside (Read-Through)**
- GET /api/beneficiaries (TTL: 5min)
- GET /api/programs (TTL: 15min)
- GET /api/news (TTL: 10min)

**Write-Through**
Invalidação automática em:
- POST/PUT/DELETE beneficiaries
- POST/PUT/DELETE programs

## 📊 Métricas
- Logs de cache hit/miss
- Dashboard Redis
- Redução 70%+ queries
- Response time < 100ms cached

## ✅ Critérios de Aceitação
- Redis configurado e rodando
- Cache em 5+ endpoints principais
- Invalidação automática
- Testes de carga comprovando melhoria

Veja: ROADMAP.md v2.2.0" \
  --label "priority:high,type:performance,size:M" && echo -e "${GREEN}✓${NC} Issue #6 criada"

# Issue #7 - MEDIUM: Upload de Arquivos
echo -e "${BLUE}[7/10]${NC} Criando Issue #7: Upload de Arquivos..."
gh issue create \
  --title "[MEDIUM] Implementar upload de arquivos com MinIO ou S3" \
  --body "## 📤 Objetivo
Sistema completo de upload, armazenamento e gerenciamento de arquivos.

## 🎯 Use Cases
1. Documentos do Beneficiário (PDF, JPEG, PNG - 10MB max)
2. Fotos em Visitas Domiciliares (compressão + thumbnails)
3. Anexos em Denúncias Anônimas (anônimo)
4. Avatar de Usuários (crop + resize 200x200)

## 🔧 Tecnologias
Opção A: MinIO (self-hosted)
Opção B: AWS S3

## 📝 Features
- Upload multipart
- Validação tipo/tamanho
- Scan de vírus (ClamAV)
- Compressão (Sharp)
- Signed URLs
- Controle acesso JWT
- Rate limiting

## ✅ Critérios de Aceitação
- Upload funcional
- Validações implementadas
- Integração com formulários
- API REST completa
- Frontend com preview
- Testes E2E

Veja: ROADMAP.md v2.3.0" \
  --label "priority:medium,type:feature,size:L" && echo -e "${GREEN}✓${NC} Issue #7 criada"

# Issue #8 - MEDIUM: WebSockets
echo -e "${BLUE}[8/10]${NC} Criando Issue #8: WebSockets..."
gh issue create \
  --title "[MEDIUM] Implementar WebSockets com Socket.io para notificações" \
  --body "## 🔄 Objetivo
Notificações em tempo real usando WebSockets.

## 📦 Setup
\`\`\`bash
npm install socket.io socket.io-client
\`\`\`

## 🎯 Eventos em Tempo Real
- NEW_APPOINTMENT - Novo agendamento
- APPOINTMENT_UPDATED - Status alterado
- BENEFIT_STATUS_CHANGED - Benefício aprovado/rejeitado
- DEADLINE_APPROACHING - Prazo judicial próximo
- NEW_ANONYMOUS_REPORT - Nova denúncia
- CHATBOT_MESSAGE - Resposta do chatbot

## 🎨 UI Components
- Badge notificações não lidas
- Dropdown de notificações
- Toast para eventos importantes
- Histórico no banco

## ✅ Critérios de Aceitação
- Socket.io configurado
- Autenticação JWT no handshake
- 6+ eventos implementados
- Reconexão automática
- Testes E2E

Veja: ROADMAP.md v2.3.0" \
  --label "priority:medium,type:feature,size:L" && echo -e "${GREEN}✓${NC} Issue #8 criada"

# Issue #9 - MEDIUM: Backend TypeScript
echo -e "${BLUE}[9/10]${NC} Criando Issue #9: Backend TypeScript..."
gh issue create \
  --title "[MEDIUM] Migrar backend completo para TypeScript + Modularização" \
  --body "## 🔷 Objetivo
Migrar backend de JavaScript para TypeScript e modularizar em controllers/services/models.

## 📊 Status Atual
- api/index.js com 2.100+ linhas
- Tudo em um único arquivo
- JavaScript puro

## 🎯 Status Desejado
- 100% TypeScript
- Modularização completa
- Type safety
- Refactoring seguro

## 🏗️ Nova Estrutura
\`\`\`
api/src/
├── routes/
├── controllers/
├── services/
├── models/
├── middleware/
├── types/
└── utils/
\`\`\`

## ✅ Critérios de Aceitação
- 100% TypeScript
- Zero erros de compilação
- Modularização completa
- Testes atualizados
- CI/CD funcionando

Veja: ROADMAP.md v2.3.0" \
  --label "priority:medium,type:refactor,size:XL" && echo -e "${GREEN}✓${NC} Issue #9 criada"

# Issue #10 - MEDIUM: Storybook
echo -e "${BLUE}[10/10]${NC} Criando Issue #10: Storybook..."
gh issue create \
  --title "[MEDIUM] Implementar Storybook para documentação de componentes" \
  --body "## 📖 Objetivo
Criar biblioteca de componentes interativa com Storybook.

## 📦 Setup
\`\`\`bash
npx storybook@latest init
\`\`\`

## 🎨 Componentes a Documentar

**Core (Alta Prioridade)**
- Layout
- Sidebar
- Modal
- Toast
- LoadingSpinner
- SkeletonLoader

**Feature (Média Prioridade)**
- Chatbot
- NewsManager
- Pagination
- FileUpload

## 🎯 Features
- Stories para todos componentes
- Controles interativos
- Documentação JSDoc
- Dark mode toggle
- Responsive preview
- Accessibility checks

## ✅ Critérios de Aceitação
- Storybook configurado
- 10+ componentes documentados
- Controles funcionais
- Deploy automático (Chromatic)
- Link no README

Veja: ROADMAP.md v2.3.0" \
  --label "priority:medium,type:documentation,size:M" && echo -e "${GREEN}✓${NC} Issue #10 criada"

echo ""
echo -e "${GREEN}✅ Todas as 10 issues foram criadas com sucesso!${NC}"
echo ""
echo "📊 Resumo:"
echo "  • 1 issue CRÍTICA"
echo "  • 5 issues ALTA prioridade"
echo "  • 4 issues MÉDIA prioridade"
echo ""
echo "🔗 Veja todas: https://github.com/KallebyX/OryumAura/issues"
echo ""
echo "🎯 Próximos passos:"
echo "  1. Revisar as issues criadas"
echo "  2. Criar milestones (v2.1.0, v2.2.0, v2.3.0)"
echo "  3. Começar pela Issue #1 (Testes - CRITICAL)"
