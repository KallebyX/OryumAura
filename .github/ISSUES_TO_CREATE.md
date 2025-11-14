# 📋 Issues para Criar no GitHub

Execute este comando para criar as issues automaticamente:

```bash
gh issue create --title "TÍTULO" --body "DESCRIÇÃO" --label "labels" --assignee @me
```

Ou crie manualmente copiando o conteúdo abaixo.

---

## Issue #1: Implementar Testes Automatizados (Vitest + Supertest + Playwright)

**Título:** `[CRITICAL] Implementar testes automatizados - Cobertura 80%+`

**Labels:** `priority:critical`, `type:testing`, `size:L`, `v2.1.0`

**Descrição:**
```markdown
## 🎯 Objetivo

Implementar suite completa de testes automatizados para garantir qualidade e confiabilidade do código.

## 📊 Meta de Cobertura

**Target:** ≥ 80% de cobertura de código

## 🔧 Tecnologias

- **Unit tests:** Vitest + React Testing Library
- **Integration tests:** Supertest
- **E2E tests:** Playwright

## 📦 Escopo

### Testes Unitários (Vitest)

**Backend:**
- [ ] `api/middleware/security.js` - Validação de CPF
- [ ] Helpers de refresh token
- [ ] Funções de auditoria LGPD
- [ ] Validadores de input

**Frontend:**
- [ ] Componentes: Layout, Modal, Toast, LoadingSpinner
- [ ] Contexts: AuthContext, ToastContext
- [ ] Hooks customizados
- [ ] Utils e helpers

### Testes de Integração (Supertest)

- [ ] Autenticação (login, refresh, logout)
- [ ] CRUD de beneficiários
- [ ] Sistema de agendamentos
- [ ] Inscrição em programas
- [ ] Fluxo de benefícios eventuais
- [ ] Auditoria LGPD

### Testes E2E (Playwright)

- [ ] Fluxo completo de login
- [ ] Cadastro de novo beneficiário
- [ ] Criação de agendamento
- [ ] Solicitação de benefício
- [ ] Navegação do portal do cidadão

## ✅ Critérios de Aceitação

- [ ] Coverage report ≥ 80%
- [ ] CI/CD executando testes automaticamente
- [ ] Documentação de como rodar testes localmente
- [ ] Scripts npm configurados:
  - `npm test` - Todos os testes
  - `npm run test:unit` - Unitários
  - `npm run test:integration` - Integração
  - `npm run test:e2e` - E2E
  - `npm run test:coverage` - Com coverage
- [ ] Badge de coverage no README

## 📚 Referências

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Playwright](https://playwright.dev/)

## 🔗 Relacionado

- Roadmap v2.1.0
- #2 (Corrigir erros TypeScript - depende desta issue)
```

---

## Issue #2: Corrigir Erros TypeScript Existentes

**Título:** `[HIGH] Corrigir 30+ erros TypeScript - Zero compilation errors`

**Labels:** `priority:high`, `type:bug`, `size:M`, `v2.1.0`

**Descrição:**
```markdown
## 🐛 Problema

Atualmente o projeto tem 30+ erros TypeScript que foram identificados durante a refatoração enterprise.

## 📝 Erros Identificados

### Components

**`components/Layout.tsx:100`**
```
Property 'vw' does not exist on type DetailedHTMLProps
```
- [ ] Remover prop `vw` inválida

### Pages

**`pages/ServerDashboardPage.tsx:59,94,239`**
```
Type '{ y: number; opacity: number; transition: { type: string; }; }' is not assignable to type 'Variants'
Property 'date' does not exist on type 'Appointment'
```
- [ ] Corrigir tipos do Framer Motion
- [ ] Adicionar campo `date` em `Appointment`

**`pages/schedule/SchedulePage.tsx:59,60,61`**
```
Property 'reason' does not exist on type 'Appointment'
Property 'date' does not exist on type 'Appointment'
Property 'time' does not exist on type 'Appointment'
```
- [ ] Atualizar interface `Appointment` em `types.ts`

**`pages/cras/CRASManagementPage.tsx`**
```
Property 'activity_name' does not exist on type 'PAIFActivity'
Property 'start_date' does not exist on type 'PAIFActivity'
Property 'facilitator' does not exist on type 'PAIFActivity'
Property 'modality' does not exist on type 'SCFVEnrollment'
```
- [ ] Corrigir interface `PAIFActivity`
- [ ] Corrigir interface `SCFVEnrollment`

**`pages/creas/CREASManagementPage.tsx`**
```
Property 'opening_date' does not exist on type 'CREASCase'
Property 'location' does not exist on type 'CREASCase'
Property 'reporter' does not exist on type 'CREASCase'
Property 'measure_description' does not exist on type 'ProtectiveMeasure'
Property 'responsible_institution' does not exist on type 'ProtectiveMeasure'
Property 'expected_end_date' does not exist on type 'ProtectiveMeasure'
Property 'due_date' does not exist on type 'CaseDeadline'
Property 'deadline_description' does not exist on type 'CaseDeadline'
Property 'priority' does not exist on type 'CaseDeadline'
Property 'related_institution' does not exist on type 'CaseDeadline'
```
- [ ] Atualizar todas interfaces CREAS em `types.ts`

**`pages/ia/IADashboardPage.tsx`**
```
Property 'predicted_at' does not exist on type 'VulnerabilityPrediction'
Property 'actionable_recommendation' does not exist on type 'AIInsight'
Property 'related_data' does not exist on type 'AIInsight'
Property 'generated_at' does not exist on type 'AIInsight'
```
- [ ] Corrigir interfaces de IA

## ✅ Critérios de Aceitação

- [ ] `npx tsc --noEmit` retorna 0 erros
- [ ] Todas interfaces em `types.ts` atualizadas
- [ ] Props React corrigidas
- [ ] CI/CD passando sem warnings
- [ ] Documentação de tipos atualizada

## 🔧 Como Testar

```bash
npm run type-check
# ou
npx tsc --noEmit
```

## 🔗 Relacionado

- Issue #1 (Testes dependem de tipos corretos)
```

---

## Issue #3: Documentação Swagger/OpenAPI - 60+ Endpoints

**Título:** `[HIGH] Adicionar documentação Swagger/OpenAPI para todos endpoints`

**Labels:** `priority:high`, `type:documentation`, `size:M`, `v2.1.0`

**Descrição:**
```markdown
## 🎯 Objetivo

Documentar todos os 60+ endpoints da API usando Swagger/OpenAPI para facilitar integração e desenvolvimento.

## 📦 Dependências

```bash
npm install swagger-jsdoc swagger-ui-express
npm install @types/swagger-jsdoc @types/swagger-ui-express --save-dev
```

## 🔧 Implementação

### 1. Configuração Inicial

```javascript
// api/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OryumAura API',
      version: '2.0.0',
      description: 'API de Gestão de Assistência Social'
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Development' },
      { url: 'https://oryumaura.vercel.app', description: 'Production' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./api/routes/*.js', './api/index.js']
};

const specs = swaggerJsdoc(options);
export { specs, swaggerUi };
```

### 2. Endpoints a Documentar

- [ ] **Autenticação** (3 endpoints)
  - POST /api/login
  - POST /api/refresh
  - POST /api/logout

- [ ] **Beneficiários** (6 endpoints)
  - GET /api/beneficiaries
  - POST /api/beneficiaries
  - GET /api/beneficiaries/:id
  - PUT /api/beneficiaries/:id
  - DELETE /api/beneficiaries/:id
  - GET /api/beneficiaries/:id/programs

- [ ] **Programas** (5 endpoints)
- [ ] **Agendamentos** (6 endpoints)
- [ ] **CRAS** (9 endpoints)
- [ ] **CREAS** (10 endpoints)
- [ ] **Benefícios Eventuais** (3 endpoints)
- [ ] **IA** (4 endpoints)
- [ ] **Auditoria** (1 endpoint)
- [ ] **Outros** (13 endpoints)

### 3. Exemplo de Documentação

```javascript
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autentica usuário e retorna tokens JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - senha
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *               senha:
 *                 type: string
 *                 example: "SenhaSegura123!"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 expires_in:
 *                   type: number
 *       401:
 *         description: Credenciais inválidas
 */
```

## ✅ Critérios de Aceitação

- [ ] Swagger UI acessível em `/api/docs`
- [ ] Todos os 60+ endpoints documentados
- [ ] Exemplos de request/response para cada endpoint
- [ ] Schemas de validação documentados
- [ ] Códigos de erro documentados
- [ ] Autenticação JWT explicada
- [ ] Export OpenAPI 3.0 JSON disponível
- [ ] README atualizado com link para docs

## 🔗 Relacionado

- ROADMAP.md - v2.1.0
```

---

## Issue #4: Implementar Paginação em Listagens

**Título:** `[HIGH] Implementar paginação cursor-based em 8+ endpoints`

**Labels:** `priority:high`, `type:feature`, `size:M`, `v2.2.0`

**Descrição:**
```markdown
## 🎯 Objetivo

Implementar paginação eficiente (cursor-based) em todos os endpoints de listagem para melhorar performance e UX.

## 📊 Endpoints Afetados

- [ ] GET /api/beneficiaries
- [ ] GET /api/programs
- [ ] GET /api/appointments
- [ ] GET /api/news
- [ ] GET /api/home-visits
- [ ] GET /api/creas-cases
- [ ] GET /api/eventual-benefits
- [ ] GET /api/audit-logs

## 🔧 Especificação

### Query Parameters

```
?page=1&limit=20&sort=created_at&order=desc&cursor=eyJpZCI6MTIzfQ==
```

### Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false,
    "nextCursor": "eyJpZCI6MTQwfQ==",
    "prevCursor": "eyJpZCI6MTAwfQ=="
  }
}
```

## 🎨 Frontend Updates

- [ ] Componente de paginação reutilizável
- [ ] Infinite scroll para mobile
- [ ] Loading states
- [ ] Empty states

## ✅ Critérios de Aceitação

- [ ] Todos endpoints principais paginados
- [ ] Cursor-based para performance
- [ ] Parâmetros de ordenação funcionais
- [ ] Frontend atualizado
- [ ] Documentação Swagger atualizada
- [ ] Redução de 80%+ em tempo de resposta para listas grandes

## 🔗 Relacionado

- Issue #6 (Redis caching)
```

---

## Issue #5: Validação de CPF em Todos Endpoints Relevantes

**Título:** `[HIGH] Aplicar validação de CPF em endpoints de criação/atualização`

**Labels:** `priority:high`, `type:security`, `size:S`, `v2.2.0`

**Descrição:**
```markdown
## 🔐 Objetivo

Aplicar a validação de CPF existente (`api/middleware/security.js`) em todos os endpoints que manipulam CPFs.

## ✅ Validação Existente

```javascript
// api/middleware/security.js
export function validateCPF(cpf) {
  // Remove formatação
  cpf = cpf.replace(/[^\d]/g, '');

  // Valida formato e dígitos verificadores
  // Retorna true/false
}
```

## 🔧 Endpoints a Atualizar

- [ ] POST /api/beneficiaries - Validar CPF do beneficiário
- [ ] PUT /api/beneficiaries/:id - Validar se CPF mudou
- [ ] POST /api/register - Validar CPF do novo usuário
- [ ] POST /api/login - Validar formato antes de buscar
- [ ] GET /api/cadunico/search - Validar CPF na busca

## 📝 Implementação

```javascript
// Adicionar ao middleware validator
const cpfValidator = body('cpf')
  .notEmpty()
  .custom((value) => {
    if (!validateCPF(value)) {
      throw new Error('CPF inválido');
    }
    return true;
  });

// Aplicar nas rotas
app.post('/api/beneficiaries', [
  cpfValidator,
  // outros validators...
], handler);
```

## ✅ Critérios de Aceitação

- [ ] Validação aplicada em todos endpoints relevantes
- [ ] Mensagem de erro clara e em português
- [ ] Testes unitários da validação
- [ ] Documentação Swagger atualizada
- [ ] CI/CD passando

## 🔗 Relacionado

- Issue #1 (Testes)
- Issue #3 (Swagger)
```

---

## Issue #6: Implementar Redis Caching

**Título:** `[HIGH] Implementar Redis caching - Redução 70%+ queries DB`

**Labels:** `priority:high`, `type:performance`, `size:M`, `v2.2.0`

**Descrição:**
```markdown
## ⚡ Objetivo

Implementar sistema de caching com Redis para reduzir carga no banco de dados e melhorar response times.

## 📦 Setup

```bash
npm install ioredis
```

```yaml
# docker-compose.yml - já configurado
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

## 🎯 Estratégias de Cache

### 1. Cache-Aside (Read-Through)

**Endpoints:**
- GET /api/beneficiaries (TTL: 5min)
- GET /api/programs (TTL: 15min)
- GET /api/news (TTL: 10min)

```javascript
async function getBeneficiaries(req, res) {
  const cacheKey = `beneficiaries:${JSON.stringify(req.query)}`;

  // Tenta buscar do cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Se não estiver no cache, busca do banco
  const data = await db.query('SELECT * FROM beneficiaries');

  // Salva no cache com TTL
  await redis.setex(cacheKey, 300, JSON.stringify(data));

  return res.json(data);
}
```

### 2. Write-Through

**Endpoints de modificação invalidam cache:**
- POST /api/beneficiaries
- PUT /api/beneficiaries/:id
- DELETE /api/beneficiaries/:id

```javascript
async function createBeneficiary(req, res) {
  // Cria no banco
  const newBeneficiary = await db.insert(req.body);

  // Invalida cache relacionado
  await redis.del('beneficiaries:*');

  return res.json(newBeneficiary);
}
```

## 📊 Métricas

- [ ] Implementar logs de cache hit/miss
- [ ] Dashboard de métricas Redis
- [ ] Redução de 70%+ em queries ao banco
- [ ] Response time < 100ms para cached queries

## ✅ Critérios de Aceitação

- [ ] Redis configurado e rodando
- [ ] Cache implementado em 5+ endpoints principais
- [ ] Invalidação automática em updates
- [ ] Logs de hit rate
- [ ] Testes de carga comprovando melhoria
- [ ] Documentação de estratégias de cache

## 🔗 Relacionado

- Issue #4 (Paginação)
- docker-compose.yml
```

---

## Issue #7: Sistema de Upload de Arquivos (MinIO/S3)

**Título:** `[MEDIUM] Implementar upload de arquivos com MinIO ou S3`

**Labels:** `priority:medium`, `type:feature`, `size:L`, `v2.3.0`

**Descrição:**
```markdown
## 📤 Objetivo

Implementar sistema completo de upload, armazenamento e gerenciamento de arquivos.

## 🎯 Use Cases

1. **Documentos do Beneficiário**
   - RG, CPF, comprovante de residência
   - Formatos: PDF, JPEG, PNG
   - Tamanho máximo: 10MB cada
   - Múltiplos arquivos por beneficiário

2. **Fotos em Visitas Domiciliares**
   - Evidências fotográficas
   - Compressão automática
   - Thumbnails gerados
   - Geolocalização (EXIF)

3. **Anexos em Denúncias Anônimas**
   - Upload anônimo
   - Sem metadados identificáveis
   - Criptografia at-rest

4. **Avatar de Usuários**
   - Crop e resize automático (200x200)
   - Formato WebP
   - CDN delivery

## 🔧 Tecnologias

**Opção A: MinIO (Self-hosted)**
```bash
npm install minio
```

**Opção B: AWS S3**
```bash
npm install @aws-sdk/client-s3
```

## 📝 Features

- [ ] Upload multipart
- [ ] Validação de tipo (MIME)
- [ ] Validação de tamanho
- [ ] Scan de vírus (ClamAV)
- [ ] Compressão de imagens (Sharp)
- [ ] Geração de thumbnails
- [ ] URLs assinadas (signed URLs)
- [ ] Controle de acesso (JWT)
- [ ] Listagem e deleção
- [ ] Progress tracking

## 🔐 Segurança

- JWT obrigatório para upload
- Validação de ownership
- Signed URLs com expiração
- Rate limiting (5 uploads/minuto)
- Quarentena para scan de vírus

## ✅ Critérios de Aceitação

- [ ] Upload funcional
- [ ] Validações implementadas
- [ ] Compressão automática
- [ ] Integração com formulários
- [ ] API REST completa
- [ ] Frontend com preview
- [ ] Testes E2E

## 🔗 Relacionado

- Issue #8 (WebSockets para progress)
```

---

## Issue #8: WebSockets para Notificações em Tempo Real

**Título:** `[MEDIUM] Implementar WebSockets com Socket.io para notificações`

**Labels:** `priority:medium`, `type:feature`, `size:L`, `v2.3.0`

**Descrição:**
```markdown
## 🔄 Objetivo

Implementar notificações em tempo real usando WebSockets para melhorar UX e responsividade.

## 📦 Setup

```bash
npm install socket.io socket.io-client
```

## 🎯 Eventos em Tempo Real

### Notificações do Sistema

- [ ] **NEW_APPOINTMENT** - Novo agendamento criado
- [ ] **APPOINTMENT_UPDATED** - Status alterado
- [ ] **BENEFIT_STATUS_CHANGED** - Benefício aprovado/rejeitado
- [ ] **DEADLINE_APPROACHING** - Prazo judicial próximo (CREAS)
- [ ] **NEW_ANONYMOUS_REPORT** - Nova denúncia anônima
- [ ] **CHATBOT_MESSAGE** - Resposta do chatbot

### Presença Online

- [ ] Mostrar servidores online
- [ ] Status "digitando..." no chatbot
- [ ] Indicador de atividade recente

## 🏗️ Arquitetura

### Backend

```javascript
import { Server } from 'socket.io';

const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN }
});

// Autenticação JWT no handshake
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  // Entrar em sala específica do usuário
  socket.join(`user:${socket.user.id}`);

  // Secretários entram em sala de administradores
  if (socket.user.role === 'secretaria') {
    socket.join('admin');
  }
});

// Emitir evento
io.to(`user:${userId}`).emit('NEW_APPOINTMENT', data);
```

### Frontend

```typescript
import { io } from 'socket.io-client';

// Context Provider
export function WebSocketProvider({ children }) {
  const { accessToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (accessToken) {
      const newSocket = io(API_URL, {
        auth: { token: accessToken },
        reconnection: true,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [accessToken]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Hook para usar em componentes
export function useWebSocket(eventType, callback) {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    if (socket) {
      socket.on(eventType, callback);
      return () => socket.off(eventType, callback);
    }
  }, [socket, eventType, callback]);
}
```

## 🎨 UI Components

- [ ] Badge de notificações não lidas
- [ ] Dropdown de notificações
- [ ] Toast para eventos importantes
- [ ] Histórico persistido no banco

## ✅ Critérios de Aceitação

- [ ] Socket.io configurado
- [ ] Autenticação JWT funcional
- [ ] 6+ eventos implementados
- [ ] Reconexão automática
- [ ] Testes E2E
- [ ] Documentação de eventos

## 🔗 Relacionado

- Issue #7 (Upload progress)
- Issue #3 (Swagger para eventos)
```

---

## Issue #9: Migrar Backend para TypeScript

**Título:** `[MEDIUM] Migrar backend completo para TypeScript + Modularização`

**Labels:** `priority:medium`, `type:refactor`, `size:XL`, `v2.3.0`

**Descrição:**
```markdown
## 🔷 Objetivo

Migrar backend de JavaScript para TypeScript e modularizar código em controllers, services, models.

## 📊 Status Atual

- ❌ `api/index.js` com 2.100+ linhas
- ❌ Tudo em um único arquivo
- ❌ JavaScript puro
- ⚠️ Dificuldade de manutenção

## 🎯 Status Desejado

- ✅ 100% TypeScript
- ✅ Modularização completa
- ✅ Type safety
- ✅ Autocomplete
- ✅ Refactoring seguro

## 🏗️ Nova Estrutura

```
api/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── beneficiaries.routes.ts
│   │   ├── cras.routes.ts
│   │   ├── creas.routes.ts
│   │   └── ...
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── BeneficiariesController.ts
│   │   └── ...
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── BeneficiaryService.ts
│   │   ├── TokenService.ts
│   │   └── ...
│   ├── models/
│   │   ├── User.ts
│   │   ├── Beneficiary.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── ...
│   ├── types/
│   │   ├── express.d.ts
│   │   ├── api.types.ts
│   │   └── ...
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── logger.ts
│   │   └── ...
│   └── index.ts
├── tsconfig.json
├── nodemon.json
└── package.json
```

## 📝 Exemplo de Implementação

### Controller

```typescript
// controllers/BeneficiariesController.ts
import { Request, Response } from 'express';
import { BeneficiaryService } from '../services/BeneficiaryService';

export class BeneficiariesController {
  private service: BeneficiaryService;

  constructor() {
    this.service = new BeneficiaryService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const beneficiaries = await this.service.findAll(req.query);
      res.json(beneficiaries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

### Service

```typescript
// services/BeneficiaryService.ts
import { Beneficiary, BeneficiaryFilters } from '../types/api.types';
import { db } from '../utils/database';

export class BeneficiaryService {
  async findAll(filters: BeneficiaryFilters): Promise<Beneficiary[]> {
    // Lógica de negócio
    const beneficiaries = await db.query('SELECT * FROM beneficiaries');
    return beneficiaries;
  }

  async findById(id: number): Promise<Beneficiary | null> {
    const beneficiary = await db.get('SELECT * FROM beneficiaries WHERE id = ?', [id]);
    return beneficiary;
  }

  // ... outros métodos
}
```

### Types

```typescript
// types/api.types.ts
export interface Beneficiary {
  id: number;
  name: string;
  cpf: string;
  vulnerability_score: number;
  created_at: Date;
}

export interface BeneficiaryFilters {
  search?: string;
  bairro?: string;
  vulnerabilidade?: 'baixa' | 'media' | 'alta' | 'critica';
}
```

## 📦 Dependências

```bash
npm install -D typescript @types/node @types/express
npm install -D ts-node-dev nodemon
```

## ✅ Critérios de Aceitação

- [ ] 100% do código em TypeScript
- [ ] Zero erros de compilação
- [ ] Modularização completa (routes/controllers/services)
- [ ] Types para todas as interfaces
- [ ] Build otimizado (`npm run build`)
- [ ] Testes atualizados
- [ ] CI/CD funcionando
- [ ] Documentação atualizada

## 📚 Fases de Migração

1. **Fase 1:** Setup TypeScript + estrutura de pastas
2. **Fase 2:** Migrar middleware e utils
3. **Fase 3:** Criar services
4. **Fase 4:** Criar controllers
5. **Fase 5:** Modularizar rotas
6. **Fase 6:** Types e interfaces
7. **Fase 7:** Testes
8. **Fase 8:** Remoção de código antigo

## 🔗 Relacionado

- Issue #2 (Corrigir erros TypeScript)
- Issue #1 (Testes)
```

---

## Issue #10: Storybook para Componentes React

**Título:** `[MEDIUM] Implementar Storybook para documentação de componentes`

**Labels:** `priority:medium`, `type:documentation`, `size:M`, `v2.3.0`

**Descrição:**
```markdown
## 📖 Objetivo

Criar biblioteca de componentes interativa com Storybook para facilitar desenvolvimento e colaboração.

## 📦 Setup

```bash
npx storybook@latest init
```

## 🎨 Componentes a Documentar

### Core Components (Prioridade Alta)

- [ ] Layout
- [ ] Sidebar
- [ ] Modal
- [ ] Toast
- [ ] LoadingSpinner
- [ ] SkeletonLoader
- [ ] Button (se houver componente customizado)
- [ ] Input (se houver componente customizado)

### Feature Components (Prioridade Média)

- [ ] Chatbot
- [ ] NewsManager
- [ ] Pagination (quando implementado)
- [ ] FileUpload (quando implementado)

## 📝 Exemplo de Story

```typescript
// components/Modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Conteúdo do modal',
  },
};

export const WithLongContent: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: (
      <div>
        <h2>Título Longo</h2>
        <p>Conteúdo muito longo...</p>
      </div>
    ),
  },
};
```

## 🎯 Features

- [ ] Stories para todos componentes
- [ ] Controles interativos
- [ ] Documentação JSDoc
- [ ] Dark mode toggle
- [ ] Responsive preview
- [ ] Accessibility checks
- [ ] Chromatic para visual regression

## ✅ Critérios de Aceitação

- [ ] Storybook configurado e rodando
- [ ] 10+ componentes documentados
- [ ] Controles funcionais
- [ ] Deploy automático (Chromatic ou GitHub Pages)
- [ ] Link no README
- [ ] Accessibilidade verificada

## 🚀 Deploy

```bash
npm run build-storybook
# Deploy para GitHub Pages ou Chromatic
```

## 🔗 Relacionado

- Issue #2 (TypeScript)
- Componentes em `/components`
```

---

## Como Criar as Issues

### Opção 1: GitHub CLI (Recomendado)

```bash
# Instalar gh se necessário
# brew install gh (macOS)
# https://cli.github.com/ (outros)

# Autenticar
gh auth login

# Criar issues
gh issue create \
  --title "[CRITICAL] Implementar testes automatizados - Cobertura 80%+" \
  --body-file .github/issues/issue-1.md \
  --label "priority:critical,type:testing,size:L,v2.1.0"

# Repetir para todas as 10 issues...
```

### Opção 2: GitHub Web (Manual)

1. Vá para https://github.com/KallebyX/OryumAura/issues
2. Clique em "New issue"
3. Copie o conteúdo de cada issue acima
4. Adicione os labels manualmente
5. Submeta

### Opção 3: Script Automatizado

Crie um arquivo `create-issues.sh`:

```bash
#!/bin/bash

# Issue #1
gh issue create \
  --title "[CRITICAL] Implementar testes automatizados - Cobertura 80%+" \
  --body "$(cat .github/ISSUES_TO_CREATE.md | sed -n '/Issue #1/,/---/p')" \
  --label "priority:critical,type:testing,size:L,v2.1.0"

# Issue #2
gh issue create \
  --title "[HIGH] Corrigir 30+ erros TypeScript - Zero compilation errors" \
  --body "$(cat .github/ISSUES_TO_CREATE.md | sed -n '/Issue #2/,/---/p')" \
  --label "priority:high,type:bug,size:M,v2.1.0"

# ... continuar para todas as 10 issues
```

```bash
chmod +x create-issues.sh
./create-issues.sh
```

---

**Total de Issues:** 10
**Prioridade Crítica:** 1
**Prioridade Alta:** 5
**Prioridade Média:** 4
