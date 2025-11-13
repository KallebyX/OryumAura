import sqlite3 from 'sqlite3';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'sqlite'; // 'sqlite' ou 'postgres'
const DB_PATH = process.env.DB_PATH || './database.db';

let db = null;

// Função para conectar ao banco de dados
export async function connectDB(logger) {
  if (DB_TYPE === 'postgres') {
    logger.info('Usando Vercel Postgres como banco de dados');
    return {
      type: 'postgres',
      query: async (query, params = []) => {
        try {
          const result = await sql.query(query, params);
          return result.rows;
        } catch (error) {
          logger.error('Erro na query Postgres:', error);
          throw error;
        }
      },
      get: async (query, params = []) => {
        try {
          const result = await sql.query(query, params);
          return result.rows[0];
        } catch (error) {
          logger.error('Erro na query Postgres:', error);
          throw error;
        }
      },
      run: async (query, params = []) => {
        try {
          const result = await sql.query(query, params);
          return {
            lastID: result.rows[0]?.id,
            changes: result.rowCount
          };
        } catch (error) {
          logger.error('Erro na query Postgres:', error);
          throw error;
        }
      },
      all: async (query, params = []) => {
        try {
          const result = await sql.query(query, params);
          return result.rows;
        } catch (error) {
          logger.error('Erro na query Postgres:', error);
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
            }
          };

          resolve(dbWrapper);
        }
      });
    });
  }
}

// Função para criar as tabelas no Postgres
export async function createPostgresTables(logger) {
  if (DB_TYPE !== 'postgres') return;

  logger.info('Criando tabelas no Postgres...');

  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('secretario', 'servidor', 'coordenador', 'beneficiario')),
        phone VARCHAR(20),
        address TEXT,
        birth_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Beneficiaries table
    await sql`
      CREATE TABLE IF NOT EXISTS beneficiaries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        birth_date DATE,
        gender VARCHAR(20),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        neighborhood VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(2),
        zip_code VARCHAR(10),
        marital_status VARCHAR(50),
        education_level VARCHAR(100),
        occupation VARCHAR(255),
        monthly_income DECIMAL(10, 2),
        family_id INTEGER,
        nis VARCHAR(20),
        cad_unico_status VARCHAR(50),
        vulnerability_level VARCHAR(50),
        priority_status VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Families table
    await sql`
      CREATE TABLE IF NOT EXISTS families (
        id SERIAL PRIMARY KEY,
        family_head_cpf VARCHAR(11),
        address TEXT,
        neighborhood VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(2),
        zip_code VARCHAR(10),
        total_members INTEGER DEFAULT 1,
        total_income DECIMAL(10, 2),
        per_capita_income DECIMAL(10, 2),
        housing_type VARCHAR(100),
        has_electricity BOOLEAN DEFAULT TRUE,
        has_water BOOLEAN DEFAULT TRUE,
        has_sewage BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Programs table
    await sql`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        eligibility_criteria TEXT,
        benefits TEXT,
        required_documents TEXT,
        contact_info TEXT,
        application_deadline DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Enrollments table
    await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
        program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
        enrollment_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        duration INTEGER DEFAULT 60,
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'scheduled',
        type VARCHAR(100),
        assigned_to INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // News table
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        author_id INTEGER REFERENCES users(id),
        category VARCHAR(100),
        image_url TEXT,
        published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_published BOOLEAN DEFAULT TRUE,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Audit logs table
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

    // Tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to INTEGER REFERENCES users(id),
        beneficiary_id INTEGER REFERENCES beneficiaries(id),
        due_date DATE,
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    logger.info('Tabelas criadas com sucesso no Postgres!');
  } catch (error) {
    logger.error('Erro ao criar tabelas no Postgres:', error);
    throw error;
  }
}
