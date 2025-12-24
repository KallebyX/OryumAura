import { neon, neonConfig } from '@neondatabase/serverless';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'sqlite'; // 'sqlite' ou 'neon'
const DB_PATH = process.env.DB_PATH || './database.db';
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

let db = null;
let neonSql = null;

// Configuração do Neon para edge/serverless
neonConfig.fetchConnectionCache = true;

// Função para conectar ao banco de dados
export async function connectDB(logger) {
  if (DB_TYPE === 'neon' || DB_TYPE === 'postgres') {
    if (!DATABASE_URL) {
      logger.error('DATABASE_URL ou NEON_DATABASE_URL não configurado!');
      throw new Error('DATABASE_URL não configurado para Neon');
    }

    logger.info('Usando Neon Postgres como banco de dados');

    // Cria conexão com Neon
    neonSql = neon(DATABASE_URL);

    return {
      type: 'neon',
      query: async (query, params = []) => {
        try {
          // Converte placeholders ? para $1, $2, etc (estilo PostgreSQL)
          let pgQuery = query;
          let paramIndex = 1;
          while (pgQuery.includes('?')) {
            pgQuery = pgQuery.replace('?', `$${paramIndex}`);
            paramIndex++;
          }

          // Usa neonSql.query() para queries com placeholders (ao invés de template literals)
          const result = await neonSql.query(pgQuery, params);
          return result.rows || result;
        } catch (error) {
          logger.error('Erro na query Neon:', error);
          throw error;
        }
      },
      get: async (query, params = []) => {
        try {
          let pgQuery = query;
          let paramIndex = 1;
          while (pgQuery.includes('?')) {
            pgQuery = pgQuery.replace('?', `$${paramIndex}`);
            paramIndex++;
          }

          // Usa neonSql.query() para queries com placeholders (ao invés de template literals)
          const result = await neonSql.query(pgQuery, params);
          const rows = result.rows || result;
          return rows[0];
        } catch (error) {
          logger.error('Erro na query Neon:', error);
          throw error;
        }
      },
      run: async (query, params = []) => {
        try {
          let pgQuery = query;
          let paramIndex = 1;
          while (pgQuery.includes('?')) {
            pgQuery = pgQuery.replace('?', `$${paramIndex}`);
            paramIndex++;
          }

          // Para INSERT com RETURNING
          if (pgQuery.toUpperCase().includes('INSERT') && !pgQuery.toUpperCase().includes('RETURNING')) {
            pgQuery = pgQuery.replace(/;?\s*$/, ' RETURNING id;');
          }

          // Usa neonSql.query() para queries com placeholders (ao invés de template literals)
          const result = await neonSql.query(pgQuery, params);
          const rows = result.rows || result;
          return {
            lastID: rows[0]?.id || null,
            changes: rows.length || result.rowCount || 1
          };
        } catch (error) {
          logger.error('Erro na query Neon:', error);
          throw error;
        }
      },
      all: async (query, params = []) => {
        try {
          let pgQuery = query;
          let paramIndex = 1;
          while (pgQuery.includes('?')) {
            pgQuery = pgQuery.replace('?', `$${paramIndex}`);
            paramIndex++;
          }

          // Usa neonSql.query() para queries com placeholders (ao invés de template literals)
          const result = await neonSql.query(pgQuery, params);
          return result.rows || result;
        } catch (error) {
          logger.error('Erro na query Neon:', error);
          throw error;
        }
      },
      // Método raw para queries já em formato PostgreSQL
      raw: async (query, params = []) => {
        try {
          // Usa neonSql.query() para queries com placeholders (ao invés de template literals)
          const result = await neonSql.query(query, params);
          return result.rows || result;
        } catch (error) {
          logger.error('Erro na query Neon (raw):', error);
          throw error;
        }
      }
    };
  } else {
    // SQLite (desenvolvimento local)
    return new Promise((resolve, reject) => {
      db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          logger.error('Erro ao conectar ao banco de dados SQLite:', err);
          reject(err);
        } else {
          logger.info(`Conectado ao banco de dados SQLite em: ${DB_PATH}`);

          // Wrapper para compatibilidade
          const dbWrapper = {
            type: 'sqlite',
            query: (query, params = []) => {
              return new Promise((resolve, reject) => {
                db.all(query, params, (err, rows) => {
                  if (err) reject(err);
                  else resolve(rows);
                });
              });
            },
            get: (query, params = []) => {
              return new Promise((resolve, reject) => {
                db.get(query, params, (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                });
              });
            },
            run: (query, params = []) => {
              return new Promise((resolve, reject) => {
                db.run(query, params, function(err) {
                  if (err) reject(err);
                  else resolve({ lastID: this.lastID, changes: this.changes });
                });
              });
            },
            all: (query, params = []) => {
              return new Promise((resolve, reject) => {
                db.all(query, params, (err, rows) => {
                  if (err) reject(err);
                  else resolve(rows);
                });
              });
            },
            raw: (query, params = []) => {
              return new Promise((resolve, reject) => {
                db.all(query, params, (err, rows) => {
                  if (err) reject(err);
                  else resolve(rows);
                });
              });
            }
          };

          resolve(dbWrapper);
        }
      });
    });
  }
}

// Função para criar as tabelas no Neon Postgres
export async function createNeonTables(logger) {
  if (DB_TYPE !== 'neon' && DB_TYPE !== 'postgres') return;

  if (!DATABASE_URL) {
    logger.error('DATABASE_URL não configurado');
    return;
  }

  logger.info('Criando tabelas no Neon Postgres...');
  const sql = neon(DATABASE_URL);

  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('secretaria', 'servidor', 'coordenador', 'beneficiario')),
        phone VARCHAR(20),
        email VARCHAR(255) UNIQUE,
        address TEXT,
        birth_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela users criada');

    // Beneficiaries table
    await sql`
      CREATE TABLE IF NOT EXISTS beneficiaries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        nis TEXT,
        birth_date TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        bairro TEXT,
        renda_familiar REAL,
        membros_familia INTEGER,
        vulnerabilidade_score REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela beneficiaries criada');

    // Programs table
    await sql`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        eligibility_criteria TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela programs criada');

    // Beneficiary Programs junction table
    await sql`
      CREATE TABLE IF NOT EXISTS beneficiary_programs (
        beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
        program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Ativo', 'Inativo', 'Suspenso')) DEFAULT 'Ativo',
        PRIMARY KEY (beneficiary_id, program_id)
      )
    `;
    logger.info('✅ Tabela beneficiary_programs criada');

    // CadUnico Data table
    await sql`
      CREATE TABLE IF NOT EXISTS cadunico_data (
        cpf TEXT PRIMARY KEY,
        nis TEXT,
        name TEXT,
        renda_per_capita REAL,
        last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela cadunico_data criada');

    // News table
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT,
        category TEXT,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela news criada');

    // Appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        server_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ('Baixa', 'Média', 'Alta')) NOT NULL DEFAULT 'Média',
        status TEXT CHECK(status IN ('Pendente', 'Em Andamento', 'Realizado', 'Cancelado')) NOT NULL DEFAULT 'Pendente',
        scheduled_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela appointments criada');

    // Home Visits table (CRAS module)
    await sql`
      CREATE TABLE IF NOT EXISTS home_visits (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        server_id INTEGER NOT NULL REFERENCES users(id),
        visit_date TIMESTAMP NOT NULL,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela home_visits criada');

    // PAIF Activities table
    await sql`
      CREATE TABLE IF NOT EXISTS paif_activities (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        activity_type TEXT CHECK(activity_type IN ('Oficina', 'Palestra', 'Grupo', 'Atendimento Individual', 'Visita')),
        date TIMESTAMP NOT NULL,
        location TEXT,
        responsible_server_id INTEGER REFERENCES users(id),
        max_participants INTEGER,
        status TEXT CHECK(status IN ('Planejada', 'Em Andamento', 'Concluída', 'Cancelada')) DEFAULT 'Planejada',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela paif_activities criada');

    // PAIF Participants table
    await sql`
      CREATE TABLE IF NOT EXISTS paif_participants (
        activity_id INTEGER REFERENCES paif_activities(id) ON DELETE CASCADE,
        beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
        attendance TEXT CHECK(attendance IN ('Presente', 'Ausente', 'Justificado')),
        notes TEXT,
        PRIMARY KEY (activity_id, beneficiary_id)
      )
    `;
    logger.info('✅ Tabela paif_participants criada');

    // SCFV Enrollments table
    await sql`
      CREATE TABLE IF NOT EXISTS scfv_enrollments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        age_group TEXT CHECK(age_group IN ('0-6 anos', '6-15 anos', '15-17 anos', '18-59 anos', '60+ anos')),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Ativo', 'Inativo', 'Concluído')) DEFAULT 'Ativo',
        observations TEXT
      )
    `;
    logger.info('✅ Tabela scfv_enrollments criada');

    // CREAS Cases table
    await sql`
      CREATE TABLE IF NOT EXISTS creas_cases (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
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
        opened_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Aberto', 'Em Acompanhamento', 'Encaminhado', 'Concluído', 'Arquivado')) DEFAULT 'Aberto',
        responsible_server_id INTEGER REFERENCES users(id),
        confidential BOOLEAN DEFAULT TRUE
      )
    `;
    logger.info('✅ Tabela creas_cases criada');

    // Protective Measures table
    await sql`
      CREATE TABLE IF NOT EXISTS protective_measures (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES creas_cases(id) ON DELETE CASCADE,
        measure_type TEXT NOT NULL,
        description TEXT,
        institution TEXT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        status TEXT CHECK(status IN ('Ativa', 'Concluída', 'Revogada')) DEFAULT 'Ativa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela protective_measures criada');

    // Case Deadlines table (CREAS)
    await sql`
      CREATE TABLE IF NOT EXISTS case_deadlines (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES creas_cases(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        deadline_date TIMESTAMP NOT NULL,
        status TEXT CHECK(status IN ('Pendente', 'Concluído', 'Atrasado')) DEFAULT 'Pendente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela case_deadlines criada');

    // Eventual Benefits table
    await sql`
      CREATE TABLE IF NOT EXISTS eventual_benefits (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        benefit_type TEXT NOT NULL CHECK(benefit_type IN (
          'Cesta Básica',
          'Auxílio Funeral',
          'Auxílio Natalidade',
          'Passagem',
          'Documentação',
          'Outro'
        )),
        description TEXT,
        quantity INTEGER DEFAULT 1,
        status TEXT CHECK(status IN ('Solicitado', 'Aprovado', 'Entregue', 'Negado')) DEFAULT 'Solicitado',
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        delivered_at TIMESTAMP,
        approved_by INTEGER REFERENCES users(id)
      )
    `;
    logger.info('✅ Tabela eventual_benefits criada');

    // Documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL CHECK(document_type IN (
          'Ofício',
          'Relatório Social',
          'Termo de Encaminhamento',
          'Declaração',
          'Parecer Técnico',
          'Outro'
        )),
        title TEXT NOT NULL,
        content TEXT,
        generated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela documents criada');

    // Anonymous Reports table
    await sql`
      CREATE TABLE IF NOT EXISTS anonymous_reports (
        id SERIAL PRIMARY KEY,
        report_type TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT,
        contact TEXT,
        status TEXT CHECK(status IN ('Recebido', 'Em Análise', 'Encaminhado', 'Resolvido', 'Arquivado')) DEFAULT 'Recebido',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela anonymous_reports criada');

    // Notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT CHECK(type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela notifications criada');

    // Vulnerability Predictions table (AI)
    await sql`
      CREATE TABLE IF NOT EXISTS vulnerability_predictions (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        prediction_score REAL NOT NULL,
        risk_level TEXT CHECK(risk_level IN ('Baixo', 'Médio', 'Alto', 'Crítico')) NOT NULL,
        factors TEXT,
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela vulnerability_predictions criada');

    // AI Insights table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_insights (
        id SERIAL PRIMARY KEY,
        insight_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        data TEXT,
        priority TEXT CHECK(priority IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média',
        status TEXT CHECK(status IN ('Novo', 'Visualizado', 'Implementado', 'Descartado')) DEFAULT 'Novo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela ai_insights criada');

    // Chatbot Sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS chatbot_sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela chatbot_sessions criada');

    // Chatbot Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chatbot_messages (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela chatbot_messages criada');

    // Refresh Tokens table (for JWT refresh token rotation)
    await sql`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        revoked BOOLEAN DEFAULT FALSE,
        revoked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela refresh_tokens criada');

    // Audit Logs table (LGPD compliance)
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id INTEGER,
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logger.info('✅ Tabela audit_logs criada');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_beneficiaries_cpf ON beneficiaries(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_creas_cases_status ON creas_cases(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_eventual_benefits_status ON eventual_benefits(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id)`;
    logger.info('✅ Índices criados');

    logger.info('🎉 Todas as tabelas Neon criadas com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar tabelas no Neon:', error);
    throw error;
  }
}

// Função para seed inicial do banco Neon
export async function seedNeonDatabase(logger) {
  if (DB_TYPE !== 'neon' && DB_TYPE !== 'postgres') return;

  if (!DATABASE_URL) {
    logger.error('DATABASE_URL não configurado');
    return;
  }

  const sql = neon(DATABASE_URL);
  const bcrypt = await import('bcryptjs');

  try {
    // Verifica se já existe usuário admin
    const adminExists = await sql`SELECT id FROM users WHERE cpf = '00000000000'`;

    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.default.hash('Admin@123', 10);

      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('00000000000', 'Administrador', ${hashedPassword}, 'secretaria', 'admin@oryumaura.com')
      `;
      logger.info('✅ Usuário admin padrão criado (CPF: 00000000000, Senha: Admin@123)');
    }

    // Adiciona usuários de teste
    const serverExists = await sql`SELECT id FROM users WHERE cpf = '11122233344'`;
    if (serverExists.length === 0) {
      const hashedPassword = await bcrypt.default.hash('Senha@123', 10);
      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('11122233344', 'Maria Servidor', ${hashedPassword}, 'servidor', 'servidor@oryumaura.com')
      `;
      logger.info('✅ Usuário servidor criado');
    }

    const benefExists = await sql`SELECT id FROM users WHERE cpf = '55566677788'`;
    if (benefExists.length === 0) {
      const hashedPassword = await bcrypt.default.hash('Senha@123', 10);
      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('55566677788', 'João Beneficiário', ${hashedPassword}, 'beneficiario', 'beneficiario@oryumaura.com')
      `;
      logger.info('✅ Usuário beneficiário criado');
    }

    // Programas padrão
    const programsExist = await sql`SELECT COUNT(*) as count FROM programs`;
    if (programsExist[0].count === 0) {
      await sql`INSERT INTO programs (name, description, eligibility_criteria) VALUES ('Bolsa Família', 'Programa de transferência de renda', 'Renda per capita até R$ 218,00')`;
      await sql`INSERT INTO programs (name, description, eligibility_criteria) VALUES ('BPC', 'Benefício de Prestação Continuada', 'Idosos 65+ ou PCD com renda familiar até 1/4 salário mínimo')`;
      await sql`INSERT INTO programs (name, description, eligibility_criteria) VALUES ('Auxílio Brasil', 'Programa de transferência de renda', 'Famílias em situação de pobreza e extrema pobreza')`;
      logger.info('✅ Programas padrão criados');
    }

    logger.info('🎉 Seed do banco Neon concluído!');
  } catch (error) {
    logger.error('Erro no seed do Neon:', error);
    throw error;
  }
}

export default { connectDB, createNeonTables, seedNeonDatabase };
