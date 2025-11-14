# 🗺️ OryumAura Roadmap - v2.1.0 e além

## 📋 Status do Projeto

**Versão Atual:** v2.0.0 (Enterprise Ready)
**Próxima Release:** v2.1.0 (Testes & Qualidade)
**Objetivo:** Sistema production-grade com 80%+ cobertura de testes

---

## 🔥 Prioridade CRÍTICA (v2.1.0)

### 1. ✅ Implementar Testes Automatizados
**Status:** 🔴 Não iniciado
**Prioridade:** Crítica
**Complexidade:** Alta
**Estimativa:** 2-3 semanas

**Escopo:**
- Configurar Vitest + React Testing Library
- Testes unitários (80% cobertura):
  - Validação de CPF (`api/middleware/security.js`)
  - Helpers de refresh token
  - Componentes React (Layout, Modal, Toast)
  - Context providers (AuthContext, ToastContext)
- Testes de integração com Supertest:
  - Endpoints de autenticação
  - CRUD de beneficiários
  - Sistema de agendamentos
- Testes E2E com Playwright:
  - Fluxo de login
  - Cadastro de beneficiário
  - Criação de agendamento

**Critérios de Aceitação:**
- [ ] Cobertura ≥ 80%
- [ ] CI/CD rodando testes automaticamente
- [ ] Documentação de como rodar testes

**Labels:** `priority:critical`, `type:testing`, `size:L`

---

### 2. 🔧 Corrigir Erros TypeScript
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Complexidade:** Média
**Estimativa:** 1 semana

**Problemas Identificados:**
- `components/Layout.tsx`: Prop `vw` inválida
- `pages/ServerDashboardPage.tsx`: Tipos do Framer Motion
- `pages/schedule/SchedulePage.tsx`: Propriedade `date` e `time` faltando
- `pages/cras/CRASManagementPage.tsx`: Campos de PAIFActivity
- `pages/creas/CREASManagementPage.tsx`: Campos de CREASCase
- `pages/ia/IADashboardPage.tsx`: Campos de AIInsight

**Escopo:**
- Atualizar interface `Appointment` em `types.ts`
- Corrigir tipos do Framer Motion
- Adicionar campos faltantes nas interfaces
- Remover props inválidas

**Critérios de Aceitação:**
- [ ] `npx tsc --noEmit` sem erros
- [ ] Todos os tipos corretos
- [ ] CI/CD passando

**Labels:** `priority:high`, `type:bug`, `size:M`

---

### 3. 📚 Documentação Swagger/OpenAPI
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Complexidade:** Média
**Estimativa:** 1 semana

**Escopo:**
- Instalar `swagger-jsdoc` e `swagger-ui-express`
- Documentar todos os 60+ endpoints
- Adicionar exemplos de request/response
- Schemas de validação
- Códigos de erro
- Autenticação JWT

**Endpoints a Documentar:**
- Autenticação (login, refresh, logout)
- Beneficiários (CRUD)
- Programas (CRUD)
- Agendamentos (CRUD)
- CRAS (visitas, PAIF, SCFV)
- CREAS (casos, medidas, prazos)
- IA (predições, insights)
- Auditoria (logs LGPD)

**Critérios de Aceitação:**
- [ ] Swagger UI em `/api/docs`
- [ ] Todos endpoints documentados
- [ ] Exemplos funcionais
- [ ] Export OpenAPI 3.0 JSON

**Labels:** `priority:high`, `type:documentation`, `size:M`

---

## 🚀 Prioridade ALTA (v2.2.0)

### 4. ⚡ Implementar Paginação em Listagens
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Complexidade:** Média
**Estimativa:** 3-5 dias

**Endpoints Afetados:**
- `GET /api/beneficiaries`
- `GET /api/programs`
- `GET /api/appointments`
- `GET /api/news`
- `GET /api/home-visits`
- `GET /api/creas-cases`
- `GET /api/eventual-benefits`
- `GET /api/audit-logs`

**Especificação:**
```javascript
// Query params
?page=1&limit=20&sort=created_at&order=desc

// Response
{
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 500,
    totalPages: 25,
    hasNext: true,
    hasPrev: false
  }
}
```

**Critérios de Aceitação:**
- [ ] Todos endpoints principais paginados
- [ ] Cursor-based pagination para performance
- [ ] Frontend atualizado com infinite scroll
- [ ] Documentação atualizada

**Labels:** `priority:high`, `type:feature`, `size:M`

---

### 5. 🔐 Validação de CPF em Todos Endpoints
**Status:** 🟡 Parcial (implementado, não aplicado)
**Prioridade:** Alta
**Complexidade:** Baixa
**Estimativa:** 2 dias

**Escopo:**
- Aplicar validação de CPF do `api/middleware/security.js`
- Endpoints de criação/atualização:
  - `POST /api/beneficiaries`
  - `PUT /api/beneficiaries/:id`
  - `POST /api/register`
  - `POST /api/login`

**Validação Existente:**
```javascript
// Valida formato e dígitos verificadores
validateCPF(cpf) // true/false
```

**Critérios de Aceitação:**
- [ ] CPF validado em todos endpoints relevantes
- [ ] Mensagem de erro clara
- [ ] Testes unitários da validação
- [ ] Documentação atualizada

**Labels:** `priority:high`, `type:security`, `size:S`

---

### 6. 💾 Implementar Redis Caching
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Complexidade:** Média
**Estimativa:** 1 semana

**Escopo:**
- Instalar `ioredis`
- Configurar conexão Redis
- Estratégias de cache:
  - **Cache-aside:** Listagens (5min TTL)
  - **Write-through:** Dados críticos
  - **Invalidação:** Em updates/deletes

**Endpoints Prioritários:**
- `GET /api/beneficiaries` (5min)
- `GET /api/programs` (15min)
- `GET /api/news` (10min)
- `GET /api/cadunico/search` (30min)

**Critérios de Aceitação:**
- [ ] Redis configurado em Docker Compose
- [ ] Cache em endpoints principais
- [ ] Invalidação automática
- [ ] Logs de hit/miss
- [ ] Redução de 70%+ em queries DB

**Labels:** `priority:high`, `type:performance`, `size:M`

---

## 📦 Prioridade MÉDIA (v2.3.0)

### 7. 📤 Sistema de Upload de Arquivos
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Complexidade:** Alta
**Estimativa:** 2 semanas

**Escopo:**
- Escolher storage: MinIO (self-hosted) ou AWS S3
- Upload multipart com validação:
  - Tipos: PDF, JPEG, PNG, DOCX
  - Tamanho máximo: 10MB
  - Scan de vírus (ClamAV)
- Compressão de imagens (Sharp)
- Thumbnails automáticos
- URLs assinadas (signed URLs)

**Features:**
- Upload de documentos do beneficiário
- Fotos em visitas domiciliares
- Anexos em denúncias
- Avatar de usuários

**Critérios de Aceitação:**
- [ ] Upload funcional
- [ ] Validação de tipos e tamanho
- [ ] Compressão automática
- [ ] Controle de acesso (JWT)
- [ ] Listagem e deleção
- [ ] Integração com formulários existentes

**Labels:** `priority:medium`, `type:feature`, `size:L`

---

### 8. 🔄 WebSockets para Notificações em Tempo Real
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Complexidade:** Alta
**Estimativa:** 1-2 semanas

**Escopo:**
- Instalar `socket.io` no backend
- Criar contexto WebSocket no frontend
- Eventos em tempo real:
  - Novo agendamento criado
  - Status de benefício alterado
  - Prazo judicial próximo (CREAS)
  - Nova denúncia anônima
  - Mensagem do chatbot

**Arquitetura:**
```javascript
// Backend
io.on('connection', (socket) => {
  socket.join(`user:${userId}`);
  // Emitir eventos específicos por sala
});

// Frontend
useWebSocket((event) => {
  switch(event.type) {
    case 'NEW_APPOINTMENT':
      showToast(event.data);
      break;
  }
});
```

**Critérios de Aceitação:**
- [ ] Socket.io configurado
- [ ] Autenticação JWT no handshake
- [ ] Eventos principais implementados
- [ ] Reconexão automática
- [ ] Badge de notificações não lidas
- [ ] Histórico persistido no banco

**Labels:** `priority:medium`, `type:feature`, `size:L`

---

### 9. 🔷 Migrar Backend para TypeScript
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Complexidade:** Alta
**Estimativa:** 2-3 semanas

**Escopo:**
- Renomear `api/index.js` → `api/index.ts`
- Adicionar types para:
  - Express Request/Response
  - Database models
  - JWT payload
  - API responses
- Refatorar estrutura:
  ```
  api/
  ├── src/
  │   ├── routes/
  │   ├── controllers/
  │   ├── services/
  │   ├── models/
  │   ├── middleware/
  │   └── types/
  ├── tsconfig.json
  └── index.ts
  ```

**Benefícios:**
- Type safety
- Autocomplete melhor
- Refactoring mais seguro
- Menos bugs em runtime

**Critérios de Aceitação:**
- [ ] 100% TypeScript
- [ ] Zero erros de compilação
- [ ] Modularização completa
- [ ] Testes atualizados
- [ ] Build otimizado

**Labels:** `priority:medium`, `type:refactor`, `size:XL`

---

### 10. 📖 Storybook para Componentes
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Complexidade:** Média
**Estimativa:** 1 semana

**Escopo:**
- Instalar `@storybook/react`
- Documentar componentes:
  - Layout
  - Sidebar
  - Modal
  - Toast
  - LoadingSpinner
  - SkeletonLoader
  - Chatbot
  - NewsManager

**Stories:**
```typescript
// Modal.stories.tsx
export default {
  title: 'Components/Modal',
  component: Modal,
};

export const Default = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Modal content'
  }
};
```

**Critérios de Aceitação:**
- [ ] Storybook configurado
- [ ] 10+ componentes documentados
- [ ] Controles interativos
- [ ] Dark mode preview
- [ ] Deploy automático (Chromatic)

**Labels:** `priority:medium`, `type:documentation`, `size:M`

---

## 🎨 Prioridade BAIXA (Backlog)

### 11. 📱 Aplicativo Mobile (React Native)
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Complexidade:** Muito Alta
**Estimativa:** 2-3 meses

**Escopo:**
- Portal do Cidadão mobile-first
- Features:
  - Consulta de benefícios
  - Agendamentos
  - Denúncias anônimas
  - Chatbot
  - Notificações push

**Labels:** `priority:low`, `type:feature`, `size:XXL`

---

### 12. 🔍 Elasticsearch para Busca Full-Text
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Complexidade:** Alta
**Estimativa:** 2 semanas

**Escopo:**
- Busca inteligente em:
  - Beneficiários (nome, CPF, endereço)
  - Programas sociais
  - Notícias
  - Casos CREAS

**Labels:** `priority:low`, `type:feature`, `size:L`

---

### 13. 🤖 Machine Learning Avançado
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Complexidade:** Muito Alta
**Estimativa:** 1-2 meses

**Escopo:**
- TensorFlow.js no backend
- Modelos:
  - Predição de evasão escolar
  - Risco de violência doméstica
  - Fraude em benefícios
  - Cluster de vulnerabilidade por região

**Labels:** `priority:low`, `type:feature`, `size:XXL`

---

## 📊 Métricas de Sucesso

### v2.1.0 (Testes & Qualidade)
- ✅ Cobertura de testes ≥ 80%
- ✅ Zero erros TypeScript
- ✅ Swagger completo
- ✅ CI/CD 100% verde

### v2.2.0 (Performance)
- ✅ Paginação em todos endpoints
- ✅ Redis reduz queries em 70%+
- ✅ Response time < 200ms
- ✅ Validação CPF completa

### v2.3.0 (Features)
- ✅ Upload de arquivos funcional
- ✅ WebSockets em tempo real
- ✅ Backend 100% TypeScript
- ✅ Storybook publicado

---

## 🤝 Como Contribuir

1. **Escolha uma issue** da lista
2. **Comente** que vai trabalhar nela
3. **Crie uma branch:** `feat/nome-da-feature`
4. **Implemente** seguindo os padrões
5. **Teste** localmente
6. **Abra PR** referenciando a issue
7. **Aguarde review**

---

## 📅 Timeline Estimado

```
Q1 2025 (Jan-Mar)
├─ v2.1.0 - Testes & Qualidade
│  ├─ Semana 1-2: Testes automatizados
│  ├─ Semana 3: Corrigir TypeScript
│  └─ Semana 4: Swagger

Q2 2025 (Abr-Jun)
├─ v2.2.0 - Performance
│  ├─ Semana 1: Paginação
│  ├─ Semana 2-3: Redis caching
│  └─ Semana 4: Validação CPF

Q3 2025 (Jul-Set)
└─ v2.3.0 - Features
   ├─ Semana 1-2: Upload de arquivos
   ├─ Semana 3-4: WebSockets
   └─ Migração TypeScript (paralelo)
```

---

**Última atualização:** 2025-11-14
**Versão do documento:** 1.0.0
