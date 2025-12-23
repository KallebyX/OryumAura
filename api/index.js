import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import winston from 'winston';
import helmet from 'helmet';
import crypto from 'crypto';
import { connectDB, createNeonTables, seedNeonDatabase } from './db.js';

// Carrega variáveis de ambiente
dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'sqlite';

// ====================================================================
// VALIDAÇÕES DE SEGURANÇA CRÍTICAS
// ====================================================================

// Validação obrigatória do JWT_SECRET (mínimo 32 caracteres)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('\n❌ ERRO CRÍTICO DE SEGURANÇA: JWT_SECRET não configurado ou muito curto!\n');
  console.error('O sistema não pode iniciar sem um JWT_SECRET seguro (mínimo 32 caracteres).\n');
  console.error('📝 Instruções de configuração:\n');
  console.error('1. Gere um secret seguro:');
  console.error('   openssl rand -base64 32\n');
  console.error('2. Configure a variável de ambiente:');
  console.error('   - Local: adicione JWT_SECRET=<seu-secret> no arquivo .env');
  console.error('   - Vercel: Settings → Environment Variables → JWT_SECRET\n');
  console.error('📚 Veja mais em: VERCEL_SETUP.md ou DEPLOYMENT.md\n');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '8h';
const DB_PATH = process.env.DB_PATH || './database.db';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Configuração do Winston Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// ====================================================================
// MIDDLEWARES DE SEGURANÇA
// ====================================================================

// Helmet.js - Headers de segurança recomendados pela OWASP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Permite Tailwind inline styles
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny' // Previne clickjacking
  },
  noSniff: true, // X-Content-Type-Options: nosniff
  xssFilter: true, // X-XSS-Protection
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// Configuração de CORS restritiva
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Rate Limiting - Proteção contra ataques de força bruta
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Muitas requisições. Por favor, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting mais restritivo para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: { error: 'Muitas tentativas de login. Por favor, aguarde 15 minutos.' },
  skipSuccessfulRequests: true
});

app.use('/api/', limiter);

// Middleware de logging de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Variável global para o banco de dados (será inicializada assincronamente)
let db = null;

// Conecta ao banco de dados (SQLite ou Neon)
async function initializeDatabase() {
  try {
    db = await connectDB(logger);
    logger.info(`Banco de dados conectado (tipo: ${db.type})`);

    // Se for Neon/Postgres, cria as tabelas e faz seed
    if (db.type === 'neon') {
      await createNeonTables(logger);
      await seedNeonDatabase(logger);
    }

    return db;
  } catch (error) {
    logger.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Para SQLite em desenvolvimento, mantemos a conexão síncrona para compatibilidade
if (DB_TYPE === 'sqlite') {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      logger.error('Erro ao conectar ao banco de dados SQLite:', err);
      process.exit(1);
    }
    logger.info(`Conectado ao banco de dados SQLite em: ${DB_PATH}`);
  });
}

// ====================================================================
// INICIALIZAÇÃO DO BANCO PARA NEON/POSTGRES (Serverless)
// ====================================================================

// Promise para rastrear inicialização do banco
let dbInitPromise = null;
let dbInitialized = DB_TYPE === 'sqlite'; // SQLite já é síncrono

// Para Neon/Postgres, inicializa o banco imediatamente
if (DB_TYPE === 'neon' || DB_TYPE === 'postgres') {
  dbInitPromise = initializeDatabase()
    .then(() => {
      dbInitialized = true;
      logger.info('✅ Banco Neon/Postgres inicializado com sucesso');
    })
    .catch((error) => {
      logger.error('❌ Falha ao inicializar banco Neon/Postgres:', error);
    });
}

// Middleware para garantir que o banco está pronto antes de processar requisições
const ensureDbReady = async (req, res, next) => {
  if (dbInitialized && db) {
    return next();
  }

  if (dbInitPromise) {
    try {
      await dbInitPromise;
      if (db) {
        return next();
      }
    } catch (error) {
      logger.error('Erro ao aguardar inicialização do banco:', error);
    }
  }

  return res.status(503).json({
    error: 'Serviço temporariamente indisponível. Banco de dados não está pronto.',
    retry_after: 5
  });
};

// Aplica o middleware para todas as rotas /api/
app.use('/api/', ensureDbReady);

// ====================================================================
// HELPERS PARA QUERIES UNIFICADAS (SQLite e Neon)
// ====================================================================

// Helper para executar query com SELECT (retorna todas as linhas)
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (db.type === 'neon') {
      db.all(sql, params).then(resolve).catch(reject);
    } else {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }
  });
};

// Helper para executar query com SELECT (retorna uma linha)
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (db.type === 'neon') {
      db.get(sql, params).then(resolve).catch(reject);
    } else {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }
  });
};

// Helper para executar query INSERT/UPDATE/DELETE
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (db.type === 'neon') {
      db.run(sql, params).then(resolve).catch(reject);
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    }
  });
};

// Middleware de auditoria LGPD (fire-and-forget, não bloqueia a resposta)
const auditLog = (req, action, resource, resourceId, details = null) => {
  if (!req.user) return;
  const sql = `INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    req.user.id,
    action,
    resource,
    resourceId,
    details ? JSON.stringify(details) : null,
    req.ip,
    req.get('user-agent')
  ];
  // Executa sem aguardar (fire-and-forget)
  dbRun(sql, params).catch((err) => {
    logger.error('Erro ao registrar log de auditoria:', err);
  });
};

// Helper para validação de requests
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
  }
  next();
};

// Validadores comuns
const passwordValidator = body('senha')
  .isLength({ min: 8 })
  .withMessage('Senha deve ter no mínimo 8 caracteres')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Senha deve conter letras maiúsculas, minúsculas e números');

const cpfValidator = body('cpf')
  .isLength({ min: 11, max: 11 })
  .withMessage('CPF deve ter 11 dígitos')
  .isNumeric()
  .withMessage('CPF deve conter apenas números');

// Serializa a criação do banco de dados para garantir a ordem de execução
// NOTA: db.serialize() é específico do SQLite - só executar para SQLite
if (DB_TYPE === 'sqlite' && db) {
db.serialize(() => {
  // === TABELAS EXISTENTES ===

  db.run(`CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    nis TEXT,
    birthDate TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    bairro TEXT,
    renda_familiar REAL,
    membros_familia INTEGER,
    vulnerabilidade_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    eligibility_criteria TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS beneficiary_programs (
    beneficiary_id INTEGER,
    program_id INTEGER,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Ativo', 'Inativo', 'Suspenso')) DEFAULT 'Ativo',
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(program_id) REFERENCES programs(id),
    PRIMARY KEY (beneficiary_id, program_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cadunico_data (
    cpf TEXT PRIMARY KEY,
    nis TEXT,
    name TEXT,
    renda_per_capita REAL,
    last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('secretaria', 'servidor', 'beneficiario')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT 0,
    revoked_at DATETIME,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id)`);

  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    category TEXT,
    published BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    server_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Baixa', 'Média', 'Alta')) NOT NULL DEFAULT 'Média',
    status TEXT CHECK(status IN ('Pendente', 'Em Andamento', 'Realizado', 'Cancelado')) NOT NULL DEFAULT 'Pendente',
    scheduled_date DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(server_id) REFERENCES users(id)
  )`);

  // === NOVAS TABELAS - MÓDULO CRAS ===

  db.run(`CREATE TABLE IF NOT EXISTS home_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    server_id INTEGER NOT NULL,
    visit_date DATETIME NOT NULL,
    address TEXT,
    latitude REAL,
    longitude REAL,
    observations TEXT,
    family_composition TEXT,
    housing_conditions TEXT,
    sanitation TEXT,
    vulnerabilities TEXT,
    photos TEXT,
    status TEXT CHECK(status IN ('Agendada', 'Realizada', 'Cancelada')) DEFAULT 'Agendada',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(server_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS paif_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT CHECK(activity_type IN ('Oficina', 'Palestra', 'Grupo', 'Atendimento Individual', 'Visita')),
    date DATETIME NOT NULL,
    location TEXT,
    responsible_server_id INTEGER,
    max_participants INTEGER,
    status TEXT CHECK(status IN ('Planejada', 'Em Andamento', 'Concluída', 'Cancelada')) DEFAULT 'Planejada',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(responsible_server_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS paif_participants (
    activity_id INTEGER,
    beneficiary_id INTEGER,
    attendance TEXT CHECK(attendance IN ('Presente', 'Ausente', 'Justificado')),
    notes TEXT,
    PRIMARY KEY (activity_id, beneficiary_id),
    FOREIGN KEY(activity_id) REFERENCES paif_activities(id),
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS scfv_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    age_group TEXT CHECK(age_group IN ('0-6 anos', '6-15 anos', '15-17 anos', '18-59 anos', '60+ anos')),
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Ativo', 'Inativo', 'Concluído')) DEFAULT 'Ativo',
    observations TEXT,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id)
  )`);

  // === NOVAS TABELAS - MÓDULO CREAS ===

  db.run(`CREATE TABLE IF NOT EXISTS creas_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    case_number TEXT UNIQUE NOT NULL,
    case_type TEXT CHECK(case_type IN (
      'Violência Física',
      'Violência Psicológica',
      'Violência Sexual',
      'Negligência',
      'Abandono',
      'Trabalho Infantil',
      'Exploração Sexual',
      'Situação de Rua',
      'Violência Doméstica',
      'Outro'
    )) NOT NULL,
    severity TEXT CHECK(severity IN ('Baixa', 'Média', 'Alta', 'Crítica')) NOT NULL,
    description TEXT,
    opened_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Aberto', 'Em Acompanhamento', 'Encaminhado', 'Concluído', 'Arquivado')) DEFAULT 'Aberto',
    responsible_server_id INTEGER,
    confidential BOOLEAN DEFAULT 1,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(responsible_server_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS protective_measures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    measure_type TEXT NOT NULL,
    description TEXT,
    institution TEXT,
    start_date DATETIME,
    end_date DATETIME,
    status TEXT CHECK(status IN ('Ativa', 'Concluída', 'Revogada')) DEFAULT 'Ativa',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES creas_cases(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS case_deadlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    deadline_type TEXT NOT NULL,
    deadline_date DATETIME NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('Pendente', 'Cumprido', 'Atrasado')) DEFAULT 'Pendente',
    notification_sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES creas_cases(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS case_forwarding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    institution TEXT NOT NULL,
    contact_person TEXT,
    contact_phone TEXT,
    forwarding_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    response TEXT,
    response_date DATETIME,
    FOREIGN KEY(case_id) REFERENCES creas_cases(id)
  )`);

  // === NOVAS TABELAS - MÓDULO DE BENEFÍCIOS ===

  db.run(`CREATE TABLE IF NOT EXISTS eventual_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    benefit_type TEXT CHECK(benefit_type IN (
      'Cesta Básica',
      'Auxílio Funeral',
      'Auxílio Natalidade',
      'Material de Construção',
      'Documentação',
      'Passagem',
      'Outro'
    )) NOT NULL,
    quantity INTEGER DEFAULT 1,
    value REAL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    approval_date DATETIME,
    delivery_date DATETIME,
    status TEXT CHECK(status IN ('Solicitado', 'Em Análise', 'Aprovado', 'Negado', 'Entregue')) DEFAULT 'Solicitado',
    justification TEXT,
    approved_by INTEGER,
    delivered_by INTEGER,
    observations TEXT,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(approved_by) REFERENCES users(id),
    FOREIGN KEY(delivered_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS benefit_renewals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    program_id INTEGER NOT NULL,
    renewal_date DATETIME NOT NULL,
    notification_sent BOOLEAN DEFAULT 0,
    renewed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(program_id) REFERENCES programs(id)
  )`);

  // === NOVAS TABELAS - DOCUMENTOS ===

  db.run(`CREATE TABLE IF NOT EXISTS generated_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_type TEXT CHECK(document_type IN (
      'Ofício',
      'Relatório Social',
      'Termo de Encaminhamento',
      'Declaração',
      'Parecer Social',
      'Estudo Social',
      'Termo de Visita',
      'Outro'
    )) NOT NULL,
    beneficiary_id INTEGER,
    case_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    template_name TEXT,
    generated_by INTEGER NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_path TEXT,
    signed BOOLEAN DEFAULT 0,
    signature_date DATETIME,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(case_id) REFERENCES creas_cases(id),
    FOREIGN KEY(generated_by) REFERENCES users(id)
  )`);

  // === NOVAS TABELAS - AUDITORIA LGPD ===

  db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id INTEGER,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS data_export_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    requested_by INTEGER NOT NULL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Pendente', 'Processando', 'Concluído', 'Negado')) DEFAULT 'Pendente',
    export_file_path TEXT,
    completion_date DATETIME,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(requested_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    requested_by INTEGER NOT NULL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    justification TEXT NOT NULL,
    status TEXT CHECK(status IN ('Pendente', 'Em Análise', 'Aprovado', 'Negado', 'Executado')) DEFAULT 'Pendente',
    reviewed_by INTEGER,
    review_date DATETIME,
    execution_date DATETIME,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY(requested_by) REFERENCES users(id),
    FOREIGN KEY(reviewed_by) REFERENCES users(id)
  )`);

  // === NOVAS TABELAS - PORTAL DO CIDADÃO ===

  db.run(`CREATE TABLE IF NOT EXISTS anonymous_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_type TEXT CHECK(report_type IN (
      'Violência Doméstica',
      'Abuso Infantil',
      'Negligência',
      'Trabalho Infantil',
      'Exploração',
      'Outro'
    )) NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Recebida', 'Em Análise', 'Encaminhada', 'Resolvida')) DEFAULT 'Recebida',
    assigned_to INTEGER,
    protocol_number TEXT UNIQUE,
    FOREIGN KEY(assigned_to) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS chatbot_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    sender TEXT CHECK(sender IN ('user', 'bot')) NOT NULL,
    intent TEXT,
    confidence REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK(type IN ('Agendamento', 'Benefício', 'Renovação', 'Informativo', 'Alerta')) NOT NULL,
    channel TEXT CHECK(channel IN ('Sistema', 'WhatsApp', 'SMS', 'Email')) DEFAULT 'Sistema',
    sent BOOLEAN DEFAULT 0,
    read BOOLEAN DEFAULT 0,
    sent_at DATETIME,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id)
  )`);

  // === TABELAS - IA E PREDIÇÃO ===

  db.run(`CREATE TABLE IF NOT EXISTS vulnerability_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    prediction_score REAL NOT NULL,
    risk_level TEXT CHECK(risk_level IN ('Baixo', 'Médio', 'Alto', 'Crítico')) NOT NULL,
    factors TEXT,
    recommendations TEXT,
    prediction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    model_version TEXT,
    FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    insight_type TEXT CHECK(insight_type IN (
      'Padrão Identificado',
      'Anomalia Detectada',
      'Recomendação',
      'Alerta',
      'Tendência'
    )) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    related_beneficiaries TEXT,
    related_bairro TEXT,
    severity TEXT CHECK(severity IN ('Info', 'Baixa', 'Média', 'Alta')) DEFAULT 'Info',
    actionable BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT 0,
    acknowledged_by INTEGER,
    acknowledged_at DATETIME,
    FOREIGN KEY(acknowledged_by) REFERENCES users(id)
  )`);

  // Adiciona usuários de exemplo
  db.get("SELECT count(*) as count FROM users", (err, row) => {
    if (err) { console.error("Erro ao verificar usuários:", err.message); return; }
    if (row && row.count === 0) {
        const stmt = db.prepare("INSERT INTO users (name, cpf, password_hash, role) VALUES (?, ?, ?, ?)");
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync("senha123", salt);

        stmt.run("Cristina Osório Spode", "99988877766", passwordHash, "secretaria");
        stmt.run("Ana Paula Silva", "11122233344", passwordHash, "servidor");
        stmt.run("Maria da Silva", "55566677788", passwordHash, "beneficiario");

        stmt.finalize(() => {
            console.log('Usuários de exemplo inseridos na tabela users.');
        });
    }
  });

  // Adiciona dados de exemplo
  db.get("SELECT count(*) as count FROM beneficiaries", (err, row) => {
      if (err) { console.error("Erro ao verificar beneficiários:", err.message); return; }
      if(row && row.count === 0) {
          const stmt = db.prepare("INSERT INTO beneficiaries (name, cpf, nis, birthDate, address, phone, bairro, renda_familiar, membros_familia, vulnerabilidade_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
          stmt.run("Maria da Silva", "123.456.789-00", "12345678901", "1985-05-20", "Rua das Flores, 123", "(55) 99999-8888", "Centro", 450.00, 4, 0.65);
          stmt.run("João Pereira", "987.654.321-00", "09876543210", "1990-02-15", "Av. Principal, 456", "(55) 98888-7777", "Bairro Norte", 680.00, 3, 0.45);
          stmt.run("Ana Costa", "456.789.123-00", "45678912300", "1978-11-08", "Rua São José, 789", "(55) 97777-6666", "Vila Nova", 320.00, 5, 0.78);
          stmt.run("Carlos Santos", "789.123.456-00", "78912345600", "1982-07-22", "Av. Brasil, 321", "(55) 96666-5555", "Centro", 890.00, 2, 0.35);
          stmt.finalize(() => {
            console.log('Dados de exemplo inseridos na tabela beneficiaries.');
          });
      }
  });

  db.get("SELECT count(*) as count FROM programs", (err, row) => {
      if (err) { console.error("Erro ao verificar programas:", err.message); return; }
      if(row && row.count === 0) {
          const stmt = db.prepare("INSERT INTO programs (name, description) VALUES (?, ?)");
          stmt.run("Programa Criança Feliz", "Programa de visitação domiciliar para primeira infância");
          stmt.run("Bolsa Família", "Transferência de renda para famílias em situação de pobreza");
          stmt.run("Auxílio Gás", "Auxílio financeiro para compra de gás de cozinha");
          stmt.run("SCFV", "Serviço de Convivência e Fortalecimento de Vínculos");
          stmt.run("BPC", "Benefício de Prestação Continuada");
          stmt.finalize();
          console.log('Dados de exemplo inseridos na tabela programs.');
      }
  });

  db.get("SELECT count(*) as count FROM news", (err, row) => {
      if (err) { console.error("Erro ao verificar notícias:", err.message); return; }
      if(row && row.count === 0) {
          const stmt = db.prepare("INSERT INTO news (title, content, author, category) VALUES (?, ?, ?, ?)");
          stmt.run("Campanha do Agasalho 2025", "A Secretaria de Assistência Social lança a Campanha do Agasalho 2025. Doe roupas e cobertores em bom estado nos pontos de coleta.", "Prefeitura de Caçapava do Sul", "Campanha");
          stmt.run("Abertura de Inscrições para Cursos", "Estão abertas as inscrições para cursos profissionalizantes gratuitos. Mais informações no CRAS.", "Secretaria de Assistência Social", "Educação");
          stmt.finalize();
          console.log('Dados de exemplo inseridos na tabela news.');
      }
  });
});
} // Fim do if (DB_TYPE === 'sqlite')


// === MIDDLEWARE DE AUTENTICAÇÃO ===

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ====================================================================
// REFRESH TOKEN HELPERS
// ====================================================================

/**
 * Gera um refresh token seguro e o armazena no banco de dados
 * @param {number} userId - ID do usuário
 * @param {string} ipAddress - IP do cliente
 * @param {string} userAgent - User agent do cliente
 * @returns {Promise<string>} - O refresh token gerado
 */
const generateRefreshToken = async (userId, ipAddress, userAgent) => {
  // Gera token aleatório seguro (64 bytes = 128 caracteres hex)
  const token = crypto.randomBytes(64).toString('hex');

  // Refresh token expira em 7 dias
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const sql = `INSERT INTO refresh_tokens (user_id, token, expires_at, ip_address, user_agent)
               VALUES (?, ?, ?, ?, ?)`;

  try {
    await dbRun(sql, [userId, token, expiresAt.toISOString(), ipAddress, userAgent]);
    return token;
  } catch (err) {
    logger.error('Erro ao salvar refresh token:', err);
    throw err;
  }
};

/**
 * Valida um refresh token e retorna os dados do usuário
 * @param {string} token - O refresh token
 * @returns {Promise<object>} - Dados do usuário
 */
const validateRefreshToken = async (token) => {
  // SQL compatível com SQLite e Postgres
  const sql = DB_TYPE === 'sqlite'
    ? `SELECT rt.*, u.id, u.cpf, u.name, u.role
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token = ?
         AND rt.revoked = 0
         AND datetime(rt.expires_at) > datetime('now')`
    : `SELECT rt.*, u.id, u.cpf, u.name, u.role
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token = ?
         AND rt.revoked = FALSE
         AND rt.expires_at > NOW()`;

  try {
    const row = await dbGet(sql, [token]);
    if (!row) {
      throw new Error('Refresh token inválido ou expirado');
    }
    return row;
  } catch (err) {
    logger.error('Erro ao validar refresh token:', err);
    throw err;
  }
};

/**
 * Revoga um refresh token específico
 * @param {string} token - O refresh token a ser revogado
 * @returns {Promise<void>}
 */
const revokeRefreshToken = async (token) => {
  const sql = DB_TYPE === 'sqlite'
    ? `UPDATE refresh_tokens SET revoked = 1, revoked_at = datetime('now') WHERE token = ?`
    : `UPDATE refresh_tokens SET revoked = TRUE, revoked_at = NOW() WHERE token = ?`;

  try {
    await dbRun(sql, [token]);
  } catch (err) {
    logger.error('Erro ao revogar refresh token:', err);
    throw err;
  }
};

/**
 * Revoga todos os refresh tokens de um usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<void>}
 */
const revokeAllUserTokens = async (userId) => {
  const sql = DB_TYPE === 'sqlite'
    ? `UPDATE refresh_tokens SET revoked = 1, revoked_at = datetime('now') WHERE user_id = ? AND revoked = 0`
    : `UPDATE refresh_tokens SET revoked = TRUE, revoked_at = NOW() WHERE user_id = ? AND revoked = FALSE`;

  try {
    await dbRun(sql, [userId]);
  } catch (err) {
    logger.error('Erro ao revogar todos os tokens do usuário:', err);
    throw err;
  }
};


// === ROTAS DE AUTENTICAÇÃO ===

app.post('/api/login', authLimiter, [
  body('cpf').notEmpty().withMessage('CPF é obrigatório').isLength({ min: 11, max: 11 }).withMessage('CPF inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
], validateRequest, async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE cpf = ?";
    const user = await dbGet(sql, [cpf]);

    if (!user) {
      return res.status(401).json({ "error": "Credenciais inválidas." });
    }

    const isPasswordCorrect = bcrypt.compareSync(senha, user.password_hash);
    if (!isPasswordCorrect) {
      logger.warn(`Tentativa de login falha para CPF: ${cpf}`);
      return res.status(401).json({ "error": "Credenciais inválidas." });
    }

    // Gera access_token de curta duração (15 minutos)
    const access_token = jwt.sign(
      { id: user.id, cpf: user.cpf, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '15m' } // Access token de curta duração
    );

    // Gera refresh_token de longa duração (7 dias) e armazena no banco
    const refresh_token = await generateRefreshToken(
      user.id,
      req.ip,
      req.get('user-agent')
    );

    logger.info(`Login bem-sucedido para usuário: ${user.name} (${user.cpf})`);

    res.json({
      access_token,
      refresh_token,
      expires_in: 900, // 15 minutos em segundos
      token_type: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Erro no login:', error);
    return res.status(500).json({ "error": "Erro ao processar requisição." });
  }
});

/**
 * POST /api/refresh
 * Renova o access_token usando um refresh_token válido
 */
app.post('/api/refresh', [
  body('refresh_token').notEmpty().withMessage('Refresh token é obrigatório')
], validateRequest, async (req, res) => {
  const { refresh_token } = req.body;

  try {
    // Valida o refresh token
    const tokenData = await validateRefreshToken(refresh_token);

    // Gera novo access_token
    const newAccessToken = jwt.sign(
      {
        id: tokenData.id,
        cpf: tokenData.cpf,
        role: tokenData.role,
        name: tokenData.name
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    logger.info(`Token renovado para usuário: ${tokenData.name} (${tokenData.cpf})`);

    res.json({
      access_token: newAccessToken,
      expires_in: 900, // 15 minutos
      token_type: 'Bearer'
    });
  } catch (error) {
    logger.warn('Tentativa de refresh com token inválido:', error.message);
    return res.status(401).json({
      error: 'Refresh token inválido ou expirado.',
      message: 'Por favor, faça login novamente.'
    });
  }
});

/**
 * POST /api/logout
 * Revoga o refresh_token do usuário
 */
app.post('/api/logout', authenticateToken, async (req, res) => {
  const { refresh_token } = req.body;

  try {
    if (refresh_token) {
      // Revoga o refresh token específico
      await revokeRefreshToken(refresh_token);
    } else {
      // Revoga todos os tokens do usuário
      await revokeAllUserTokens(req.user.id);
    }

    logger.info(`Logout realizado para usuário: ${req.user.name} (${req.user.cpf})`);

    res.json({
      message: 'Logout realizado com sucesso.'
    });
  } catch (error) {
    logger.error('Erro ao fazer logout:', error);
    return res.status(500).json({
      error: 'Erro ao processar logout.'
    });
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
    res.json({
        id: req.user.id,
        cpf: req.user.cpf,
        name: req.user.name,
        role: req.user.role
    });
});


// === ROTAS DE BENEFICIÁRIOS ===

app.get('/api/beneficiaries', authenticateToken, async (req, res) => {
  try {
    const { search, bairro, vulnerabilidade } = req.query;
    let sql = "SELECT * FROM beneficiaries WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (name LIKE ? OR cpf LIKE ? OR nis LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (bairro) {
      sql += " AND bairro = ?";
      params.push(bairro);
    }

    if (vulnerabilidade) {
      sql += " AND vulnerabilidade_score >= ?";
      params.push(parseFloat(vulnerabilidade));
    }

    sql += " ORDER BY name";

    const rows = await dbAll(sql, params);
    auditLog(req, 'LIST', 'beneficiaries', null);
    res.json({ "message": "success", "data": rows });
  } catch (err) {
    logger.error('Erro ao listar beneficiários:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.get('/api/beneficiaries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM beneficiaries WHERE id = ?";
    const row = await dbGet(sql, [id]);
    if (row) {
      auditLog(req, 'VIEW', 'beneficiaries', id);
      res.json({ "message": "success", "data": row });
    } else {
      res.status(404).json({ "message": "Beneficiário não encontrado." });
    }
  } catch (err) {
    logger.error('Erro ao buscar beneficiário:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.post('/api/beneficiaries', authenticateToken, async (req, res) => {
  try {
    const { name, cpf, nis, birthDate, address, phone, email, bairro, renda_familiar, membros_familia } = req.body;
    // Usar birth_date para Postgres, birthDate para SQLite
    const dateColumn = DB_TYPE === 'sqlite' ? 'birthDate' : 'birth_date';
    const sql = `INSERT INTO beneficiaries (name, cpf, nis, ${dateColumn}, address, phone, email, bairro, renda_familiar, membros_familia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, cpf, nis, birthDate, address, phone, email, bairro, renda_familiar, membros_familia];
    const result = await dbRun(sql, params);
    auditLog(req, 'CREATE', 'beneficiaries', result.lastID, { name, cpf });
    res.status(201).json({ "message": "success", "data": { id: result.lastID, ...req.body } });
  } catch (err) {
    logger.error('Erro ao criar beneficiário:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.put('/api/beneficiaries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cpf, nis, birthDate, address, phone, email, bairro, renda_familiar, membros_familia } = req.body;
    const dateColumn = DB_TYPE === 'sqlite' ? 'birthDate' : 'birth_date';
    const sql = `UPDATE beneficiaries SET name = ?, cpf = ?, nis = ?, ${dateColumn} = ?, address = ?, phone = ?, email = ?, bairro = ?, renda_familiar = ?, membros_familia = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const params = [name, cpf, nis, birthDate, address, phone, email, bairro, renda_familiar, membros_familia, id];
    const result = await dbRun(sql, params);
    auditLog(req, 'UPDATE', 'beneficiaries', id, { name, cpf });
    res.json({ "message": "success", "data": { id, ...req.body }, "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao atualizar beneficiário:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.delete('/api/beneficiaries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM beneficiaries WHERE id = ?';
    const result = await dbRun(sql, [id]);
    auditLog(req, 'DELETE', 'beneficiaries', id);
    res.json({ "message": "deleted", "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao deletar beneficiário:', err);
    res.status(400).json({ "error": err.message });
  }
});


// === ROTAS DE PROGRAMAS ===

app.get('/api/programs', authenticateToken, async (req, res) => {
  try {
    const sql = "SELECT * FROM programs ORDER BY name";
    const rows = await dbAll(sql, []);
    res.json({ "message": "success", "data": rows });
  } catch (err) {
    logger.error('Erro ao listar programas:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.post('/api/programs', authenticateToken, async (req, res) => {
  try {
    const { name, description, eligibility_criteria } = req.body;
    if (!name) { return res.status(400).json({ "error": "O nome do programa é obrigatório." }); }
    const sql = `INSERT INTO programs (name, description, eligibility_criteria) VALUES (?, ?, ?)`;
    const result = await dbRun(sql, [name, description, eligibility_criteria]);
    auditLog(req, 'CREATE', 'programs', result.lastID, { name });
    res.status(201).json({ "message": "success", "data": { id: result.lastID, name, description, eligibility_criteria } });
  } catch (err) {
    logger.error('Erro ao criar programa:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.put('/api/programs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, eligibility_criteria } = req.body;
    if (!name) { return res.status(400).json({ "error": "O nome do programa é obrigatório." }); }
    const sql = `UPDATE programs SET name = ?, description = ?, eligibility_criteria = ? WHERE id = ?`;
    const result = await dbRun(sql, [name, description, eligibility_criteria, id]);
    auditLog(req, 'UPDATE', 'programs', id, { name });
    res.json({ "message": "success", "data": { id, name, description, eligibility_criteria }, "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao atualizar programa:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.delete('/api/programs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM beneficiary_programs WHERE program_id = ?', [id]);
    const sql = 'DELETE FROM programs WHERE id = ?';
    const result = await dbRun(sql, [id]);
    auditLog(req, 'DELETE', 'programs', id);
    res.json({ "message": "deleted", "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao deletar programa:', err);
    res.status(400).json({ "error": err.message });
  }
});


// === ROTAS DE ASSOCIAÇÃO BENEFICIÁRIO-PROGRAMA ===

app.get('/api/beneficiaries/:id/programs', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT p.id, p.name, p.description, bp.enrollment_date, bp.status FROM programs p JOIN beneficiary_programs bp ON p.id = bp.program_id WHERE bp.beneficiary_id = ?`;
    const rows = await dbAll(sql, [id]);
    res.json({ "message": "success", "data": rows });
  } catch (err) {
    logger.error('Erro ao listar programas do beneficiário:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.post('/api/beneficiaries/:id/programs', authenticateToken, async (req, res) => {
  try {
    const { id: beneficiary_id } = req.params;
    const { program_id } = req.body;
    const sql = `INSERT INTO beneficiary_programs (beneficiary_id, program_id) VALUES (?, ?)`;
    await dbRun(sql, [beneficiary_id, program_id]);
    auditLog(req, 'ENROLL', 'beneficiary_programs', null, { beneficiary_id, program_id });
    res.status(201).json({ "message": "success" });
  } catch (err) {
    logger.error('Erro ao associar beneficiário ao programa:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.delete('/api/beneficiaries/:beneficiary_id/programs/:program_id', authenticateToken, async (req, res) => {
  try {
    const { beneficiary_id, program_id } = req.params;
    const sql = 'DELETE FROM beneficiary_programs WHERE beneficiary_id = ? AND program_id = ?';
    const result = await dbRun(sql, [beneficiary_id, program_id]);
    auditLog(req, 'UNENROLL', 'beneficiary_programs', null, { beneficiary_id, program_id });
    res.json({ "message": "deleted", "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao desassociar beneficiário do programa:', err);
    res.status(400).json({ "error": err.message });
  }
});


// === ROTAS DE NOTÍCIAS ===

app.get('/api/news', async (req, res) => {
  try {
    // SQLite usa createdAt, Postgres usa created_at
    const orderColumn = DB_TYPE === 'sqlite' ? 'createdAt' : 'created_at';
    const sql = `SELECT * FROM news ORDER BY ${orderColumn} DESC`;
    const rows = await dbAll(sql, []);
    res.json({ "message": "success", "data": rows });
  } catch (err) {
    logger.error('Erro ao buscar notícias:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user.name;
    const sql = `INSERT INTO news (title, content, author, category) VALUES (?, ?, ?, ?)`;
    const result = await dbRun(sql, [title, content, author, category]);
    auditLog(req, 'CREATE', 'news', result.lastID, { title });
    res.status(201).json({ "message": "success", "data": { id: result.lastID, title, content, author, category } });
  } catch (err) {
    logger.error('Erro ao criar notícia:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM news WHERE id = ?';
    const result = await dbRun(sql, [id]);
    auditLog(req, 'DELETE', 'news', id);
    res.json({ "message": "deleted", "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao deletar notícia:', err);
    res.status(400).json({ "error": err.message });
  }
});


// === ROTAS DE AGENDAMENTOS ===

app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { server_id, beneficiary_id, status } = req.query;
    // SQLite usa createdAt, Postgres usa created_at
    const createdAtCol = DB_TYPE === 'sqlite' ? 'createdAt' : 'created_at';
    let sql = `
      SELECT a.*, b.name as beneficiary_name, b.cpf as beneficiary_cpf
      FROM appointments a
      JOIN beneficiaries b ON a.beneficiary_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (server_id) {
      sql += ' AND a.server_id = ?';
      params.push(server_id);
    }
    if (beneficiary_id) {
      sql += ' AND a.beneficiary_id = ?';
      params.push(beneficiary_id);
    }
    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ` ORDER BY a.${createdAtCol} DESC`;

    const rows = await dbAll(sql, params);
    res.json({ "message": "success", "data": rows });
  } catch (err) {
    logger.error('Erro ao listar agendamentos:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.get('/api/beneficiaries/:id/appointments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const createdAtCol = DB_TYPE === 'sqlite' ? 'createdAt' : 'created_at';
    const sql = `SELECT * FROM appointments WHERE beneficiary_id = ? ORDER BY ${createdAtCol} DESC`;
    const rows = await dbAll(sql, [id]);
    res.json({ "message": "success", "data": rows });
  } catch (err) {
    logger.error('Erro ao listar agendamentos do beneficiário:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { beneficiary_id, title, description, priority, scheduled_date } = req.body;
    const server_id = req.user.id;
    const sql = `INSERT INTO appointments (beneficiary_id, server_id, title, description, priority, scheduled_date) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [beneficiary_id, server_id, title, description, priority, scheduled_date];
    const result = await dbRun(sql, params);
    const newAppointmentId = result.lastID;
    auditLog(req, 'CREATE', 'appointments', newAppointmentId, { beneficiary_id, title });
    const row = await dbGet("SELECT * FROM appointments WHERE id = ?", [newAppointmentId]);
    res.status(201).json({ "message": "success", "data": row });
  } catch (err) {
    logger.error('Erro ao criar agendamento:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, scheduled_date } = req.body;
    const fields = [], params = [];

    if (title !== undefined) { fields.push("title = ?"); params.push(title); }
    if (description !== undefined) { fields.push("description = ?"); params.push(description); }
    if (priority !== undefined) { fields.push("priority = ?"); params.push(priority); }
    if (status !== undefined) { fields.push("status = ?"); params.push(status); }
    if (scheduled_date !== undefined) { fields.push("scheduled_date = ?"); params.push(scheduled_date); }

    if (fields.length === 0) { return res.status(400).json({ "error": "Nenhum campo para atualizar fornecido." }); }
    params.push(id);

    const sql = `UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`;
    const result = await dbRun(sql, params);
    auditLog(req, 'UPDATE', 'appointments', id, { status, title });
    const row = await dbGet("SELECT * FROM appointments WHERE id = ?", [id]);
    res.json({ "message": "success", "data": row, "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao atualizar agendamento:', err);
    res.status(400).json({ "error": err.message });
  }
});

app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM appointments WHERE id = ?';
    const result = await dbRun(sql, [id]);
    auditLog(req, 'DELETE', 'appointments', id);
    res.json({ "message": "deleted", "changes": result.changes });
  } catch (err) {
    logger.error('Erro ao deletar agendamento:', err);
    res.status(400).json({ "error": err.message });
  }
});


// === ROTAS MÓDULO CRAS - VISITAS DOMICILIARES ===

app.get('/api/home-visits', authenticateToken, (req, res) => {
  const { beneficiary_id, server_id, status } = req.query;
  let sql = `
    SELECT hv.*, b.name as beneficiary_name, u.name as server_name
    FROM home_visits hv
    JOIN beneficiaries b ON hv.beneficiary_id = b.id
    JOIN users u ON hv.server_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND hv.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (server_id) {
    sql += ' AND hv.server_id = ?';
    params.push(server_id);
  }
  if (status) {
    sql += ' AND hv.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY hv.visit_date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/home-visits', authenticateToken, (req, res) => {
  const { beneficiary_id, visit_date, address, latitude, longitude, observations, family_composition, housing_conditions, sanitation, vulnerabilities } = req.body;
  const server_id = req.user.id;
  const sql = `INSERT INTO home_visits (beneficiary_id, server_id, visit_date, address, latitude, longitude, observations, family_composition, housing_conditions, sanitation, vulnerabilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [beneficiary_id, server_id, visit_date, address, latitude, longitude, observations, family_composition, housing_conditions, sanitation, vulnerabilities];

  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'home_visits', this.lastID, { beneficiary_id, visit_date });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body, server_id } });
  });
});

app.put('/api/home-visits/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, observations, family_composition, housing_conditions, sanitation, vulnerabilities, photos } = req.body;
  const fields = [], params = [];

  if (status !== undefined) { fields.push("status = ?"); params.push(status); }
  if (observations !== undefined) { fields.push("observations = ?"); params.push(observations); }
  if (family_composition !== undefined) { fields.push("family_composition = ?"); params.push(family_composition); }
  if (housing_conditions !== undefined) { fields.push("housing_conditions = ?"); params.push(housing_conditions); }
  if (sanitation !== undefined) { fields.push("sanitation = ?"); params.push(sanitation); }
  if (vulnerabilities !== undefined) { fields.push("vulnerabilities = ?"); params.push(vulnerabilities); }
  if (photos !== undefined) { fields.push("photos = ?"); params.push(photos); }

  if (fields.length === 0) { return res.status(400).json({ "error": "Nenhum campo para atualizar fornecido." }); }
  params.push(id);

  const sql = `UPDATE home_visits SET ${fields.join(', ')} WHERE id = ?`;
  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'UPDATE', 'home_visits', id);
    res.json({ "message": "success", "changes": this.changes });
  });
});


// === ROTAS MÓDULO CRAS - ATIVIDADES PAIF ===

app.get('/api/paif-activities', authenticateToken, (req, res) => {
  const { status, date_from, date_to } = req.query;
  let sql = `SELECT pa.*, u.name as responsible_name FROM paif_activities pa LEFT JOIN users u ON pa.responsible_server_id = u.id WHERE 1=1`;
  const params = [];

  if (status) {
    sql += ' AND pa.status = ?';
    params.push(status);
  }
  if (date_from) {
    sql += ' AND pa.date >= ?';
    params.push(date_from);
  }
  if (date_to) {
    sql += ' AND pa.date <= ?';
    params.push(date_to);
  }

  sql += ' ORDER BY pa.date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/paif-activities', authenticateToken, (req, res) => {
  const { title, description, activity_type, date, location, max_participants } = req.body;
  const responsible_server_id = req.user.id;
  const sql = `INSERT INTO paif_activities (title, description, activity_type, date, location, responsible_server_id, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [title, description, activity_type, date, location, responsible_server_id, max_participants];

  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'paif_activities', this.lastID, { title, date });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body, responsible_server_id } });
  });
});

app.get('/api/paif-activities/:id/participants', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT pp.*, b.name, b.cpf
    FROM paif_participants pp
    JOIN beneficiaries b ON pp.beneficiary_id = b.id
    WHERE pp.activity_id = ?
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/paif-activities/:id/participants', authenticateToken, (req, res) => {
  const { id: activity_id } = req.params;
  const { beneficiary_id, attendance, notes } = req.body;
  const sql = `INSERT INTO paif_participants (activity_id, beneficiary_id, attendance, notes) VALUES (?, ?, ?, ?)`;

  db.run(sql, [activity_id, beneficiary_id, attendance, notes], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'ADD_PARTICIPANT', 'paif_participants', null, { activity_id, beneficiary_id });
    res.status(201).json({ "message": "success" });
  });
});


// === ROTAS MÓDULO CRAS - SCFV ===

app.get('/api/scfv-enrollments', authenticateToken, (req, res) => {
  const { beneficiary_id, status, age_group } = req.query;
  let sql = `
    SELECT se.*, b.name as beneficiary_name, b.birthDate
    FROM scfv_enrollments se
    JOIN beneficiaries b ON se.beneficiary_id = b.id
    WHERE 1=1
  `;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND se.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (status) {
    sql += ' AND se.status = ?';
    params.push(status);
  }
  if (age_group) {
    sql += ' AND se.age_group = ?';
    params.push(age_group);
  }

  sql += ' ORDER BY se.enrollment_date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/scfv-enrollments', authenticateToken, (req, res) => {
  const { beneficiary_id, age_group, observations } = req.body;
  const sql = `INSERT INTO scfv_enrollments (beneficiary_id, age_group, observations) VALUES (?, ?, ?)`;

  db.run(sql, [beneficiary_id, age_group, observations], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'scfv_enrollments', this.lastID, { beneficiary_id, age_group });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body } });
  });
});


// === ROTAS MÓDULO CREAS - CASOS ===

app.get('/api/creas-cases', authenticateToken, (req, res) => {
  const { beneficiary_id, status, case_type, severity } = req.query;
  let sql = `
    SELECT cc.*, b.name as beneficiary_name, b.cpf, u.name as responsible_name
    FROM creas_cases cc
    JOIN beneficiaries b ON cc.beneficiary_id = b.id
    LEFT JOIN users u ON cc.responsible_server_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND cc.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (status) {
    sql += ' AND cc.status = ?';
    params.push(status);
  }
  if (case_type) {
    sql += ' AND cc.case_type = ?';
    params.push(case_type);
  }
  if (severity) {
    sql += ' AND cc.severity = ?';
    params.push(severity);
  }

  sql += ' ORDER BY cc.opened_date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.get('/api/creas-cases/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT cc.*, b.name as beneficiary_name, b.cpf, b.birthDate, u.name as responsible_name
    FROM creas_cases cc
    JOIN beneficiaries b ON cc.beneficiary_id = b.id
    LEFT JOIN users u ON cc.responsible_server_id = u.id
    WHERE cc.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    if (row) {
      auditLog(req, 'VIEW', 'creas_cases', id);
      res.json({ "message": "success", "data": row });
    } else {
      res.status(404).json({ "message": "Caso não encontrado." });
    }
  });
});

app.post('/api/creas-cases', authenticateToken, (req, res) => {
  const { beneficiary_id, case_type, severity, description } = req.body;
  const responsible_server_id = req.user.id;

  // Gera número do caso
  const case_number = `CREAS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const sql = `INSERT INTO creas_cases (beneficiary_id, case_number, case_type, severity, description, responsible_server_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [beneficiary_id, case_number, case_type, severity, description, responsible_server_id];

  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'creas_cases', this.lastID, { beneficiary_id, case_number, case_type });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, case_number, ...req.body, responsible_server_id } });
  });
});

app.put('/api/creas-cases/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, description, severity } = req.body;
  const fields = [], params = [];

  if (status !== undefined) { fields.push("status = ?"); params.push(status); }
  if (description !== undefined) { fields.push("description = ?"); params.push(description); }
  if (severity !== undefined) { fields.push("severity = ?"); params.push(severity); }

  if (fields.length === 0) { return res.status(400).json({ "error": "Nenhum campo para atualizar fornecido." }); }
  params.push(id);

  const sql = `UPDATE creas_cases SET ${fields.join(', ')} WHERE id = ?`;
  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'UPDATE', 'creas_cases', id, { status });
    res.json({ "message": "success", "changes": this.changes });
  });
});


// === ROTAS MÓDULO CREAS - MEDIDAS PROTETIVAS ===

app.get('/api/creas-cases/:case_id/protective-measures', authenticateToken, (req, res) => {
  const { case_id } = req.params;
  const sql = `SELECT * FROM protective_measures WHERE case_id = ? ORDER BY created_at DESC`;
  db.all(sql, [case_id], (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/creas-cases/:case_id/protective-measures', authenticateToken, (req, res) => {
  const { case_id } = req.params;
  const { measure_type, description, institution, start_date, end_date } = req.body;
  const sql = `INSERT INTO protective_measures (case_id, measure_type, description, institution, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [case_id, measure_type, description, institution, start_date, end_date], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'protective_measures', this.lastID, { case_id, measure_type });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body } });
  });
});


// === ROTAS MÓDULO CREAS - PRAZOS JUDICIAIS ===

app.get('/api/creas-cases/:case_id/deadlines', authenticateToken, (req, res) => {
  const { case_id } = req.params;
  const sql = `SELECT * FROM case_deadlines WHERE case_id = ? ORDER BY deadline_date ASC`;
  db.all(sql, [case_id], (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/creas-cases/:case_id/deadlines', authenticateToken, (req, res) => {
  const { case_id } = req.params;
  const { deadline_type, deadline_date, description } = req.body;
  const sql = `INSERT INTO case_deadlines (case_id, deadline_type, deadline_date, description) VALUES (?, ?, ?, ?)`;

  db.run(sql, [case_id, deadline_type, deadline_date, description], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'case_deadlines', this.lastID, { case_id, deadline_type });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body } });
  });
});

app.get('/api/case-deadlines/upcoming', authenticateToken, (req, res) => {
  const sql = `
    SELECT cd.*, cc.case_number, cc.case_type, b.name as beneficiary_name
    FROM case_deadlines cd
    JOIN creas_cases cc ON cd.case_id = cc.id
    JOIN beneficiaries b ON cc.beneficiary_id = b.id
    WHERE cd.status = 'Pendente' AND cd.deadline_date >= date('now')
    ORDER BY cd.deadline_date ASC
    LIMIT 20
  `;
  db.all(sql, [], (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});


// === ROTAS MÓDULO BENEFÍCIOS EVENTUAIS ===

app.get('/api/eventual-benefits', authenticateToken, (req, res) => {
  const { beneficiary_id, benefit_type, status } = req.query;
  let sql = `
    SELECT eb.*, b.name as beneficiary_name, b.cpf
    FROM eventual_benefits eb
    JOIN beneficiaries b ON eb.beneficiary_id = b.id
    WHERE 1=1
  `;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND eb.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (benefit_type) {
    sql += ' AND eb.benefit_type = ?';
    params.push(benefit_type);
  }
  if (status) {
    sql += ' AND eb.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY eb.request_date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/eventual-benefits', authenticateToken, (req, res) => {
  const { beneficiary_id, benefit_type, quantity, value, justification } = req.body;
  const sql = `INSERT INTO eventual_benefits (beneficiary_id, benefit_type, quantity, value, justification) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [beneficiary_id, benefit_type, quantity, value, justification], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'eventual_benefits', this.lastID, { beneficiary_id, benefit_type });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body } });
  });
});

app.put('/api/eventual-benefits/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, observations } = req.body;
  const fields = ['status = ?'], params = [status];
  const approved_by = req.user.id;

  if (observations !== undefined) { fields.push("observations = ?"); params.push(observations); }

  if (status === 'Aprovado') {
    fields.push("approval_date = CURRENT_TIMESTAMP");
    fields.push("approved_by = ?");
    params.push(approved_by);
  }
  if (status === 'Entregue') {
    fields.push("delivery_date = CURRENT_TIMESTAMP");
    fields.push("delivered_by = ?");
    params.push(approved_by);
  }

  params.push(id);

  const sql = `UPDATE eventual_benefits SET ${fields.join(', ')} WHERE id = ?`;
  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'UPDATE', 'eventual_benefits', id, { status });
    res.json({ "message": "success", "changes": this.changes });
  });
});


// === ROTAS DOCUMENTOS ===

app.get('/api/documents', authenticateToken, (req, res) => {
  const { beneficiary_id, document_type } = req.query;
  let sql = `
    SELECT gd.*, b.name as beneficiary_name, u.name as generated_by_name
    FROM generated_documents gd
    LEFT JOIN beneficiaries b ON gd.beneficiary_id = b.id
    LEFT JOIN users u ON gd.generated_by = u.id
    WHERE 1=1
  `;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND gd.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (document_type) {
    sql += ' AND gd.document_type = ?';
    params.push(document_type);
  }

  sql += ' ORDER BY gd.generated_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/documents', authenticateToken, (req, res) => {
  const { document_type, beneficiary_id, case_id, title, content, template_name } = req.body;
  const generated_by = req.user.id;
  const sql = `INSERT INTO generated_documents (document_type, beneficiary_id, case_id, title, content, template_name, generated_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [document_type, beneficiary_id, case_id, title, content, template_name, generated_by], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'CREATE', 'generated_documents', this.lastID, { document_type, title });
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body, generated_by } });
  });
});


// === ROTAS DENÚNCIAS ANÔNIMAS ===

app.get('/api/anonymous-reports', authenticateToken, (req, res) => {
  const { status } = req.query;
  let sql = `
    SELECT ar.*, u.name as assigned_to_name
    FROM anonymous_reports ar
    LEFT JOIN users u ON ar.assigned_to = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    sql += ' AND ar.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY ar.report_date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/anonymous-reports', (req, res) => {
  const { report_type, description, location } = req.body;
  const protocol_number = `DENUNCIA-${Date.now()}`;
  const sql = `INSERT INTO anonymous_reports (report_type, description, location, protocol_number) VALUES (?, ?, ?, ?)`;

  db.run(sql, [report_type, description, location, protocol_number], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.status(201).json({ "message": "success", "data": { id: this.lastID, protocol_number } });
  });
});

app.put('/api/anonymous-reports/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;
  const fields = [], params = [];

  if (status !== undefined) { fields.push("status = ?"); params.push(status); }
  if (assigned_to !== undefined) { fields.push("assigned_to = ?"); params.push(assigned_to); }

  if (fields.length === 0) { return res.status(400).json({ "error": "Nenhum campo para atualizar fornecido." }); }
  params.push(id);

  const sql = `UPDATE anonymous_reports SET ${fields.join(', ')} WHERE id = ?`;
  db.run(sql, params, function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'UPDATE', 'anonymous_reports', id, { status });
    res.json({ "message": "success", "changes": this.changes });
  });
});


// === ROTAS NOTIFICAÇÕES ===

app.get('/api/notifications', authenticateToken, (req, res) => {
  const { beneficiary_id, read } = req.query;
  let sql = `SELECT * FROM notifications WHERE 1=1`;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (read !== undefined) {
    sql += ' AND read = ?';
    params.push(read === 'true' ? 1 : 0);
  }

  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/notifications', authenticateToken, (req, res) => {
  const { beneficiary_id, title, message, type, channel } = req.body;
  const sql = `INSERT INTO notifications (beneficiary_id, title, message, type, channel) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [beneficiary_id, title, message, type, channel], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body } });
  });
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE notifications SET read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ?`;
  db.run(sql, [id], function(err) {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "changes": this.changes });
  });
});


// === ROTAS IA - PREDIÇÃO DE VULNERABILIDADE ===

app.get('/api/vulnerability-predictions', authenticateToken, (req, res) => {
  const { beneficiary_id, risk_level } = req.query;
  let sql = `
    SELECT vp.*, b.name as beneficiary_name, b.cpf
    FROM vulnerability_predictions vp
    JOIN beneficiaries b ON vp.beneficiary_id = b.id
    WHERE 1=1
  `;
  const params = [];

  if (beneficiary_id) {
    sql += ' AND vp.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  if (risk_level) {
    sql += ' AND vp.risk_level = ?';
    params.push(risk_level);
  }

  sql += ' ORDER BY vp.prediction_date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

// Função de IA simulada para predição de vulnerabilidade
app.post('/api/ai/predict-vulnerability/:beneficiary_id', authenticateToken, (req, res) => {
  const { beneficiary_id } = req.params;

  // Busca dados do beneficiário
  db.get('SELECT * FROM beneficiaries WHERE id = ?', [beneficiary_id], (err, beneficiary) => {
    if (err) { return res.status(400).json({ "error": err.message }); }
    if (!beneficiary) { return res.status(404).json({ "error": "Beneficiário não encontrado" }); }

    // Algoritmo simples de predição baseado em fatores de risco
    let score = 0;
    const factors = [];

    // Fator 1: Renda familiar per capita
    const rendaPerCapita = (beneficiary.renda_familiar || 0) / (beneficiary.membros_familia || 1);
    if (rendaPerCapita < 178) {
      score += 0.3;
      factors.push('Renda per capita abaixo da linha de pobreza extrema');
    } else if (rendaPerCapita < 267) {
      score += 0.2;
      factors.push('Renda per capita abaixo da linha de pobreza');
    }

    // Fator 2: Composição familiar
    if (beneficiary.membros_familia > 5) {
      score += 0.15;
      factors.push('Família numerosa (mais de 5 membros)');
    }

    // Fator 3: Score de vulnerabilidade existente
    if (beneficiary.vulnerabilidade_score) {
      score = (score + beneficiary.vulnerabilidade_score) / 2;
    }

    // Determina nível de risco
    let risk_level;
    if (score >= 0.75) risk_level = 'Crítico';
    else if (score >= 0.5) risk_level = 'Alto';
    else if (score >= 0.3) risk_level = 'Médio';
    else risk_level = 'Baixo';

    // Gera recomendações
    const recommendations = [];
    if (score >= 0.5) {
      recommendations.push('Acompanhamento prioritário pelo CRAS');
      recommendations.push('Avaliação para inclusão em programas de transferência de renda');
    }
    if (rendaPerCapita < 178) {
      recommendations.push('Inscrição no Bolsa Família');
      recommendations.push('Oferta de cestas básicas mensais');
    }
    if (beneficiary.membros_familia > 5) {
      recommendations.push('Encaminhamento para planejamento familiar');
      recommendations.push('Inscrição de crianças no SCFV');
    }

    // Salva predição no banco
    const sql = `INSERT INTO vulnerability_predictions (beneficiary_id, prediction_score, risk_level, factors, recommendations, model_version) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      beneficiary_id,
      score.toFixed(3),
      risk_level,
      JSON.stringify(factors),
      JSON.stringify(recommendations),
      'v1.0-simple-rules'
    ];

    db.run(sql, params, function(err) {
      if (err) { return res.status(400).json({ "error": err.message }); }

      // Atualiza score no beneficiário
      db.run('UPDATE beneficiaries SET vulnerabilidade_score = ? WHERE id = ?', [score, beneficiary_id], (err) => {
        if (err) console.error('Erro ao atualizar score:', err.message);
      });

      auditLog(req, 'AI_PREDICTION', 'vulnerability_predictions', this.lastID, { beneficiary_id, risk_level });

      res.json({
        "message": "success",
        "data": {
          id: this.lastID,
          beneficiary_id,
          prediction_score: score.toFixed(3),
          risk_level,
          factors,
          recommendations
        }
      });
    });
  });
});


// === ROTAS IA - INSIGHTS ===

app.get('/api/ai-insights', authenticateToken, (req, res) => {
  const { acknowledged, severity } = req.query;
  let sql = `
    SELECT ai.*, u.name as acknowledged_by_name
    FROM ai_insights ai
    LEFT JOIN users u ON ai.acknowledged_by = u.id
    WHERE 1=1
  `;
  const params = [];

  if (acknowledged !== undefined) {
    sql += ' AND ai.acknowledged = ?';
    params.push(acknowledged === 'true' ? 1 : 0);
  }
  if (severity) {
    sql += ' AND ai.severity = ?';
    params.push(severity);
  }

  sql += ' ORDER BY ai.created_at DESC LIMIT 50';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});

// Gera insights automáticos baseados em dados
app.post('/api/ai/generate-insights', authenticateToken, (req, res) => {
  const insights = [];

  // Insight 1: Bairros com maior concentração de vulnerabilidade
  db.all(`
    SELECT bairro, COUNT(*) as count, AVG(vulnerabilidade_score) as avg_score
    FROM beneficiaries
    WHERE bairro IS NOT NULL AND vulnerabilidade_score IS NOT NULL
    GROUP BY bairro
    HAVING count >= 3
    ORDER BY avg_score DESC
    LIMIT 3
  `, [], (err, rows) => {
    if (err) console.error(err);

    if (rows && rows.length > 0) {
      rows.forEach(row => {
        const severity = row.avg_score >= 0.7 ? 'Alta' : row.avg_score >= 0.5 ? 'Média' : 'Baixa';
        const sql = `INSERT INTO ai_insights (insight_type, title, description, related_bairro, severity) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [
          'Padrão Identificado',
          `Alta vulnerabilidade detectada no bairro ${row.bairro}`,
          `O bairro ${row.bairro} apresenta ${row.count} famílias com score médio de vulnerabilidade de ${(row.avg_score * 100).toFixed(1)}%. Recomenda-se intensificar ações do CRAS na região.`,
          row.bairro,
          severity
        ]);
      });
    }
  });

  // Insight 2: Benefícios eventuais mais solicitados
  db.all(`
    SELECT benefit_type, COUNT(*) as count, SUM(CASE WHEN status = 'Aprovado' OR status = 'Entregue' THEN 1 ELSE 0 END) as approved
    FROM eventual_benefits
    GROUP BY benefit_type
    ORDER BY count DESC
    LIMIT 3
  `, [], (err, rows) => {
    if (err) console.error(err);

    if (rows && rows.length > 0) {
      const topBenefit = rows[0];
      const approvalRate = ((topBenefit.approved / topBenefit.count) * 100).toFixed(1);
      const sql = `INSERT INTO ai_insights (insight_type, title, description, severity) VALUES (?, ?, ?, ?)`;
      db.run(sql, [
        'Tendência',
        `Demanda elevada por ${topBenefit.benefit_type}`,
        `Foram solicitadas ${topBenefit.count} unidades de ${topBenefit.benefit_type} no período, com taxa de aprovação de ${approvalRate}%. Considere ajustar o estoque e critérios de elegibilidade.`,
        'Info'
      ]);
    }
  });

  // Insight 3: Casos CREAS críticos não resolvidos
  db.all(`
    SELECT COUNT(*) as count, severity
    FROM creas_cases
    WHERE status IN ('Aberto', 'Em Acompanhamento') AND severity IN ('Alta', 'Crítica')
    GROUP BY severity
  `, [], (err, rows) => {
    if (err) console.error(err);

    if (rows && rows.length > 0) {
      const criticalCount = rows.find(r => r.severity === 'Crítica')?.count || 0;
      const highCount = rows.find(r => r.severity === 'Alta')?.count || 0;

      if (criticalCount > 0 || highCount > 0) {
        const sql = `INSERT INTO ai_insights (insight_type, title, description, severity, actionable) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [
          'Alerta',
          `${criticalCount + highCount} casos CREAS graves pendentes`,
          `Há ${criticalCount} casos críticos e ${highCount} casos de alta gravidade em acompanhamento. Revisar priorização e alocar recursos adicionais se necessário.`,
          'Alta',
          1
        ]);
      }
    }
  });

  auditLog(req, 'AI_INSIGHTS', 'ai_insights', null);
  res.json({ "message": "Insights gerados com sucesso. Aguarde alguns segundos e consulte a lista de insights." });
});


// === ROTAS CHATBOT ===

app.post('/api/chatbot/message', (req, res) => {
  const { session_id, message, user_id } = req.body;

  // Salva mensagem do usuário
  const sql1 = `INSERT INTO chatbot_messages (user_id, session_id, message, sender) VALUES (?, ?, ?, 'user')`;
  db.run(sql1, [user_id || null, session_id, message], function(err) {
    if (err) { return res.status(400).json({ "error": err.message }); }

    // Lógica simples de resposta do bot
    let botResponse = '';
    let intent = 'unknown';
    let confidence = 0.5;

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('horário') || lowerMessage.includes('funcionamento') || lowerMessage.includes('atendimento')) {
      botResponse = '🕒 O CRAS funciona de segunda a sexta-feira, das 8h às 17h. Para agendamentos, ligue (55) 3281-1234.';
      intent = 'horario';
      confidence = 0.9;
    } else if (lowerMessage.includes('cadastro') || lowerMessage.includes('cadunico') || lowerMessage.includes('cadastrar')) {
      botResponse = '📋 Para fazer o CadÚnico, você precisa trazer: RG, CPF, comprovante de residência, e comprovante de renda de todos os membros da família. Agende seu atendimento presencial no CRAS.';
      intent = 'cadastro';
      confidence = 0.85;
    } else if (lowerMessage.includes('bolsa') || lowerMessage.includes('benefício')) {
      botResponse = '💰 O Bolsa Família é um programa federal de transferência de renda. Para se inscrever, você precisa estar no CadÚnico com renda de até R$ 218,00 por pessoa. Posso te ajudar a agendar um atendimento?';
      intent = 'beneficios';
      confidence = 0.8;
    } else if (lowerMessage.includes('cesta') || lowerMessage.includes('básica')) {
      botResponse = '🛒 Cestas básicas são distribuídas mensalmente para famílias em situação de vulnerabilidade. Para solicitar, compareça ao CRAS com RG, CPF e comprovante de renda.';
      intent = 'cesta_basica';
      confidence = 0.85;
    } else if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde')) {
      botResponse = '👋 Olá! Eu sou a assistente virtual do Oryum Aura. Como posso ajudar você hoje? Posso te informar sobre:\n\n- Horários de atendimento\n- Programas sociais (Bolsa Família, BPC)\n- CadÚnico\n- Cestas básicas\n- Agendamentos';
      intent = 'saudacao';
      confidence = 0.95;
    } else if (lowerMessage.includes('agendar') || lowerMessage.includes('marcar')) {
      botResponse = '📅 Para agendar um atendimento, entre em contato pelo telefone (55) 3281-1234 ou compareça pessoalmente ao CRAS no horário de funcionamento.';
      intent = 'agendamento';
      confidence = 0.8;
    } else {
      botResponse = '🤔 Desculpe, não entendi sua pergunta. Você pode me perguntar sobre:\n\n- Horários de atendimento\n- Programas sociais\n- CadÚnico\n- Cestas básicas\n- Agendamentos\n\nOu digite "falar com atendente" para ser direcionado.';
      intent = 'unknown';
      confidence = 0.3;
    }

    // Salva resposta do bot
    const sql2 = `INSERT INTO chatbot_messages (user_id, session_id, message, sender, intent, confidence) VALUES (?, ?, ?, 'bot', ?, ?)`;
    db.run(sql2, [user_id || null, session_id, botResponse, intent, confidence], function(err) {
      if (err) {
        logger.error('Erro ao salvar mensagem do chatbot:', err);
        return res.status(500).json({ "error": "Erro ao processar mensagem." });
      }

      // Retorna estrutura compatível com o frontend
      res.json({
        "data": {
          "message": {
            id: this.lastID,
            session_id: session_id,
            sender: 'bot',
            message: botResponse,
            timestamp: new Date().toISOString(),
            intent,
            confidence
          }
        }
      });
    });
  });
});

app.get('/api/chatbot/history/:session_id', (req, res) => {
  const { session_id } = req.params;
  const sql = `SELECT * FROM chatbot_messages WHERE session_id = ? ORDER BY timestamp ASC`;
  db.all(sql, [session_id], (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});


// === ROTAS DE RELATÓRIOS ===

app.get('/api/reports/stats', authenticateToken, (req, res) => {
  const queries = {
    totalBeneficiaries: "SELECT COUNT(*) as count FROM beneficiaries",
    totalAppointments: "SELECT COUNT(*) as count FROM appointments",
    totalPrograms: "SELECT COUNT(*) as count FROM programs",
    totalCREASCases: "SELECT COUNT(*) as count FROM creas_cases WHERE status IN ('Aberto', 'Em Acompanhamento')",
    appointmentsByStatus: "SELECT status, COUNT(*) as count FROM appointments GROUP BY status",
    beneficiariesByProgram: `SELECT p.name, COUNT(bp.beneficiary_id) as count FROM programs p LEFT JOIN beneficiary_programs bp ON p.id = bp.program_id GROUP BY p.name`,
    beneficiariesByBairro: "SELECT bairro, COUNT(*) as count FROM beneficiaries WHERE bairro IS NOT NULL GROUP BY bairro",
    vulnerabilityByBairro: "SELECT bairro, AVG(vulnerabilidade_score) as avg_score FROM beneficiaries WHERE bairro IS NOT NULL AND vulnerabilidade_score IS NOT NULL GROUP BY bairro",
    eventualBenefitsByType: "SELECT benefit_type, COUNT(*) as count FROM eventual_benefits GROUP BY benefit_type",
    creasCasesByType: "SELECT case_type, COUNT(*) as count FROM creas_cases GROUP BY case_type",
    homeVisitsByMonth: "SELECT strftime('%Y-%m', visit_date) as month, COUNT(*) as count FROM home_visits GROUP BY month ORDER BY month DESC LIMIT 12"
  };

  const results = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        if (!res.headersSent) { res.status(500).json({ "error": `Failed to fetch ${key}: ${err.message}` }); }
        return;
      }
      if (key.startsWith('total')) { results[key] = rows[0].count; }
      else { results[key] = rows; }

      completedQueries++;
      if (completedQueries === totalQueries) { res.json({ "message": "success", "data": results }); }
    });
  });
});

app.get('/api/reports/suas', authenticateToken, (req, res) => {
  // Relatório formatado para o SUAS (Sistema Único de Assistência Social)
  const report = {
    periodo: new Date().toISOString().split('T')[0],
    municipio: 'Caçapava do Sul - RS',
    secretaria: 'Secretaria Municipal de Assistência Social'
  };

  // Dados agregados para o SUAS
  db.all(`
    SELECT
      (SELECT COUNT(*) FROM beneficiaries) as total_familias,
      (SELECT COUNT(*) FROM appointments WHERE status = 'Realizado' AND createdAt >= date('now', '-1 month')) as atendimentos_mes,
      (SELECT COUNT(*) FROM home_visits WHERE status = 'Realizada' AND visit_date >= date('now', '-1 month')) as visitas_mes,
      (SELECT COUNT(*) FROM paif_activities WHERE status = 'Concluída' AND date >= date('now', '-1 month')) as atividades_paif_mes,
      (SELECT COUNT(DISTINCT beneficiary_id) FROM scfv_enrollments WHERE status = 'Ativo') as total_scfv,
      (SELECT COUNT(*) FROM creas_cases WHERE status IN ('Aberto', 'Em Acompanhamento')) as casos_creas_ativos,
      (SELECT COUNT(*) FROM eventual_benefits WHERE status = 'Entregue' AND delivery_date >= date('now', '-1 month')) as beneficios_entregues_mes
  `, [], (err, row) => {
    if (err) { return res.status(400).json({ "error": err.message }); }
    report.dados = row[0];
    auditLog(req, 'EXPORT', 'reports_suas', null);
    res.json({ "message": "success", "data": report });
  });
});


// === ROTAS CADÚNICO ===

app.get('/api/cadunico/search', authenticateToken, (req, res) => {
  const { cpf } = req.query;
  if (!cpf) { return res.status(400).json({ "error": "CPF é obrigatório" }); }
  const sql = "SELECT * FROM cadunico_data WHERE cpf = ?";
  db.get(sql, [cpf], (err, row) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    auditLog(req, 'SEARCH', 'cadunico_data', null, { cpf });
    if (row) { res.json({ "message": "success", "data": row }); }
    else { res.status(404).json({ "message": "CPF não encontrado na base de dados local do CadÚnico." }); }
  });
});

app.post('/api/cadunico/sync', authenticateToken, (req, res) => {
  const { cpf, nis, name, renda_per_capita } = req.body;
  const sql = `INSERT OR REPLACE INTO cadunico_data (cpf, nis, name, renda_per_capita, last_sync) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  db.run(sql, [cpf, nis, name, renda_per_capita], function(err) {
    if (err) { return res.status(400).json({ "error": err.message }); }
    auditLog(req, 'SYNC', 'cadunico_data', null, { cpf, nis });
    res.json({ "message": "Dados do CadÚnico sincronizados com sucesso" });
  });
});


// === ROTAS AUDITORIA ===

app.get('/api/audit-logs', authenticateToken, (req, res) => {
  const { user_id, action, resource, date_from, date_to } = req.query;
  let sql = `
    SELECT al.*, u.name as user_name
    FROM audit_logs al
    JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (user_id) {
    sql += ' AND al.user_id = ?';
    params.push(user_id);
  }
  if (action) {
    sql += ' AND al.action = ?';
    params.push(action);
  }
  if (resource) {
    sql += ' AND al.resource = ?';
    params.push(resource);
  }
  if (date_from) {
    sql += ' AND al.timestamp >= ?';
    params.push(date_from);
  }
  if (date_to) {
    sql += ' AND al.timestamp <= ?';
    params.push(date_to);
  }

  sql += ' ORDER BY al.timestamp DESC LIMIT 1000';

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    res.json({ "message": "success", "data": rows });
  });
});


// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected'
  });
});

// === MIDDLEWARE DE TRATAMENTO DE ERROS (deve vir no final) ===
// Handler para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

// Handler centralizado de erros
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Não expõe detalhes do erro em produção
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProduction ? 'Erro interno do servidor' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// Inicia o servidor
async function startServer() {
  // Para Neon/Postgres, inicializa o banco assincronamente
  if (DB_TYPE === 'neon' || DB_TYPE === 'postgres') {
    try {
      await initializeDatabase();
      logger.info('✅ Banco Neon inicializado com sucesso');
    } catch (error) {
      logger.error('❌ Falha ao inicializar banco Neon:', error);
      process.exit(1);
    }
  }

  app.listen(port, () => {
    logger.info(`🚀 Oryum Aura API rodando em http://localhost:${port}`);
    logger.info(`📊 Total de endpoints implementados: 60+`);
    logger.info(`🔐 Autenticação JWT ativada`);
    logger.info(`📝 Sistema de auditoria LGPD ativo`);
    logger.info(`🤖 IA de predição e chatbot implementados`);
    logger.info(`🔒 Rate limiting e CORS configurados`);
    logger.info(`📋 Logging com Winston ativado`);
    logger.info(`💾 Banco de dados: ${DB_TYPE.toUpperCase()}`);
  });
}

// Exporta o app para Vercel Serverless
export default app;

// Inicia o servidor se não estiver sendo importado como módulo
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
