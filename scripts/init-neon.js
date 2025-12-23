import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL ou NEON_DATABASE_URL nao configurado!');
  console.error('Configure a variavel de ambiente com sua connection string do Neon.');
  console.error('Formato: postgresql://user:password@host/database?sslmode=require');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function initializeDatabase() {
  console.log('🚀 Inicializando banco de dados Neon...');
  console.log('📍 Host:', DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown');

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
    console.log('✅ Tabela users criada');

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
    console.log('✅ Tabela beneficiaries criada');

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
    console.log('✅ Tabela programs criada');

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
    console.log('✅ Tabela beneficiary_programs criada');

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
    console.log('✅ Tabela cadunico_data criada');

    // Refresh Tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        revoked BOOLEAN DEFAULT FALSE,
        revoked_at TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT
      )
    `;
    console.log('✅ Tabela refresh_tokens criada');

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
    console.log('✅ Tabela news criada');

    // Appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        server_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ('Baixa', 'Media', 'Alta')) NOT NULL DEFAULT 'Media',
        status TEXT CHECK(status IN ('Pendente', 'Em Andamento', 'Realizado', 'Cancelado')) NOT NULL DEFAULT 'Pendente',
        scheduled_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela appointments criada');

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
    console.log('✅ Tabela home_visits criada');

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
        status TEXT CHECK(status IN ('Planejada', 'Em Andamento', 'Concluida', 'Cancelada')) DEFAULT 'Planejada',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela paif_activities criada');

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
    console.log('✅ Tabela paif_participants criada');

    // SCFV Enrollments table
    await sql`
      CREATE TABLE IF NOT EXISTS scfv_enrollments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        age_group TEXT CHECK(age_group IN ('0-6 anos', '6-15 anos', '15-17 anos', '18-59 anos', '60+ anos')),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Ativo', 'Inativo', 'Concluido')) DEFAULT 'Ativo',
        observations TEXT
      )
    `;
    console.log('✅ Tabela scfv_enrollments criada');

    // CREAS Cases table
    await sql`
      CREATE TABLE IF NOT EXISTS creas_cases (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        case_number TEXT UNIQUE NOT NULL,
        case_type TEXT NOT NULL,
        severity TEXT CHECK(severity IN ('Baixa', 'Media', 'Alta', 'Critica')) NOT NULL,
        description TEXT,
        opened_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Aberto', 'Em Acompanhamento', 'Encaminhado', 'Concluido', 'Arquivado')) DEFAULT 'Aberto',
        responsible_server_id INTEGER REFERENCES users(id),
        confidential BOOLEAN DEFAULT TRUE
      )
    `;
    console.log('✅ Tabela creas_cases criada');

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
        status TEXT CHECK(status IN ('Ativa', 'Concluida', 'Revogada')) DEFAULT 'Ativa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela protective_measures criada');

    // Case Deadlines table (CREAS)
    await sql`
      CREATE TABLE IF NOT EXISTS case_deadlines (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES creas_cases(id) ON DELETE CASCADE,
        deadline_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        deadline_date TIMESTAMP NOT NULL,
        status TEXT CHECK(status IN ('Pendente', 'Cumprido', 'Atrasado')) DEFAULT 'Pendente',
        notification_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela case_deadlines criada');

    // Case Forwarding table
    await sql`
      CREATE TABLE IF NOT EXISTS case_forwarding (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES creas_cases(id) ON DELETE CASCADE,
        institution TEXT NOT NULL,
        contact_person TEXT,
        contact_phone TEXT,
        forwarding_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        response TEXT,
        response_date TIMESTAMP
      )
    `;
    console.log('✅ Tabela case_forwarding criada');

    // Eventual Benefits table
    await sql`
      CREATE TABLE IF NOT EXISTS eventual_benefits (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        benefit_type TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        value REAL,
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approval_date TIMESTAMP,
        delivery_date TIMESTAMP,
        status TEXT CHECK(status IN ('Solicitado', 'Em Analise', 'Aprovado', 'Negado', 'Entregue')) DEFAULT 'Solicitado',
        justification TEXT,
        approved_by INTEGER REFERENCES users(id),
        delivered_by INTEGER REFERENCES users(id),
        observations TEXT
      )
    `;
    console.log('✅ Tabela eventual_benefits criada');

    // Benefit Renewals table
    await sql`
      CREATE TABLE IF NOT EXISTS benefit_renewals (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
        renewal_date TIMESTAMP NOT NULL,
        notification_sent BOOLEAN DEFAULT FALSE,
        renewed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela benefit_renewals criada');

    // Generated Documents table
    await sql`
      CREATE TABLE IF NOT EXISTS generated_documents (
        id SERIAL PRIMARY KEY,
        document_type TEXT NOT NULL,
        beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
        case_id INTEGER REFERENCES creas_cases(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        template_name TEXT,
        generated_by INTEGER NOT NULL REFERENCES users(id),
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        file_path TEXT,
        signed BOOLEAN DEFAULT FALSE,
        signature_date TIMESTAMP
      )
    `;
    console.log('✅ Tabela generated_documents criada');

    // Anonymous Reports table
    await sql`
      CREATE TABLE IF NOT EXISTS anonymous_reports (
        id SERIAL PRIMARY KEY,
        report_type TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT,
        contact TEXT,
        status TEXT CHECK(status IN ('Recebido', 'Em Analise', 'Encaminhado', 'Resolvido', 'Arquivado')) DEFAULT 'Recebido',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela anonymous_reports criada');

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
    console.log('✅ Tabela notifications criada');

    // Vulnerability Predictions table (AI)
    await sql`
      CREATE TABLE IF NOT EXISTS vulnerability_predictions (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        prediction_score REAL NOT NULL,
        risk_level TEXT CHECK(risk_level IN ('Baixo', 'Medio', 'Alto', 'Critico')) NOT NULL,
        factors TEXT,
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela vulnerability_predictions criada');

    // AI Insights table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_insights (
        id SERIAL PRIMARY KEY,
        insight_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        data TEXT,
        priority TEXT CHECK(priority IN ('Baixa', 'Media', 'Alta')) DEFAULT 'Media',
        status TEXT CHECK(status IN ('Novo', 'Visualizado', 'Implementado', 'Descartado')) DEFAULT 'Novo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela ai_insights criada');

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
    console.log('✅ Tabela chatbot_sessions criada');

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
    console.log('✅ Tabela chatbot_messages criada');

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
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela audit_logs criada');

    // Data Export Requests table (LGPD)
    await sql`
      CREATE TABLE IF NOT EXISTS data_export_requests (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        requested_by INTEGER NOT NULL REFERENCES users(id),
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Pendente', 'Processando', 'Concluido', 'Negado')) DEFAULT 'Pendente',
        export_file_path TEXT,
        completion_date TIMESTAMP
      )
    `;
    console.log('✅ Tabela data_export_requests criada');

    // Data Deletion Requests table (LGPD)
    await sql`
      CREATE TABLE IF NOT EXISTS data_deletion_requests (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
        requested_by INTEGER NOT NULL REFERENCES users(id),
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        status TEXT CHECK(status IN ('Pendente', 'Aprovado', 'Negado', 'Concluido')) DEFAULT 'Pendente',
        approval_date TIMESTAMP,
        approved_by INTEGER REFERENCES users(id),
        completion_date TIMESTAMP
      )
    `;
    console.log('✅ Tabela data_deletion_requests criada');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_beneficiaries_cpf ON beneficiaries(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_creas_cases_status ON creas_cases(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_eventual_benefits_status ON eventual_benefits(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`;
    console.log('✅ Indices criados');

    console.log('\n🎉 Banco de dados Neon inicializado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

async function seedDatabase() {
  console.log('\n📦 Populando banco com dados iniciais...');

  try {
    // Verifica se ja existe usuario admin
    const adminExists = await sql`SELECT id FROM users WHERE cpf = '00000000000'`;

    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('00000000000', 'Administrador', ${hashedPassword}, 'secretaria', 'admin@oryumaura.com')
      `;
      console.log('✅ Usuario admin criado (CPF: 00000000000, Senha: Admin@123)');
    } else {
      console.log('ℹ️ Usuario admin ja existe');
    }

    // Usuario servidor
    const serverExists = await sql`SELECT id FROM users WHERE cpf = '11122233344'`;
    if (serverExists.length === 0) {
      const hashedPassword = await bcrypt.hash('Senha@123', 10);
      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('11122233344', 'Maria Servidor', ${hashedPassword}, 'servidor', 'servidor@oryumaura.com')
      `;
      console.log('✅ Usuario servidor criado (CPF: 11122233344, Senha: Senha@123)');
    }

    // Usuario beneficiario
    const benefExists = await sql`SELECT id FROM users WHERE cpf = '55566677788'`;
    if (benefExists.length === 0) {
      const hashedPassword = await bcrypt.hash('Senha@123', 10);
      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('55566677788', 'Joao Beneficiario', ${hashedPassword}, 'beneficiario', 'beneficiario@oryumaura.com')
      `;
      console.log('✅ Usuario beneficiario criado (CPF: 55566677788, Senha: Senha@123)');
    }

    // Programas padrao
    const programsExist = await sql`SELECT COUNT(*) as count FROM programs`;
    if (programsExist[0].count == 0) {
      await sql`INSERT INTO programs (name, description, eligibility_criteria) VALUES ('Bolsa Familia', 'Programa de transferencia de renda', 'Renda per capita ate R$ 218,00')`;
      await sql`INSERT INTO programs (name, description, eligibility_criteria) VALUES ('BPC', 'Beneficio de Prestacao Continuada', 'Idosos 65+ ou PCD com renda familiar ate 1/4 salario minimo')`;
      await sql`INSERT INTO programs (name, description, eligibility_criteria) VALUES ('Auxilio Brasil', 'Programa de transferencia de renda', 'Familias em situacao de pobreza e extrema pobreza')`;
      console.log('✅ Programas padrao criados');
    }

    // Beneficiarios de exemplo
    const beneficiariesExist = await sql`SELECT COUNT(*) as count FROM beneficiaries`;
    if (beneficiariesExist[0].count == 0) {
      await sql`INSERT INTO beneficiaries (name, cpf, nis, bairro, renda_familiar, membros_familia) VALUES ('Ana Maria Silva', '12345678901', '12345678901', 'Centro', 800, 4)`;
      await sql`INSERT INTO beneficiaries (name, cpf, nis, bairro, renda_familiar, membros_familia) VALUES ('Jose Carlos Santos', '23456789012', '23456789012', 'Vila Nova', 600, 3)`;
      await sql`INSERT INTO beneficiaries (name, cpf, nis, bairro, renda_familiar, membros_familia) VALUES ('Maria Aparecida Oliveira', '34567890123', '34567890123', 'Jardim America', 450, 5)`;
      console.log('✅ Beneficiarios de exemplo criados');
    }

    // Noticias de exemplo
    const newsExist = await sql`SELECT COUNT(*) as count FROM news`;
    if (newsExist[0].count == 0) {
      await sql`INSERT INTO news (title, content, author, category) VALUES ('Bem-vindo ao OryumAura', 'Sistema de gestao social iniciado com sucesso!', 'Sistema', 'Anuncio')`;
      await sql`INSERT INTO news (title, content, author, category) VALUES ('Cadastro Unico Atualizado', 'O sistema de Cadastro Unico foi atualizado com novas funcionalidades.', 'Secretaria', 'Informativo')`;
      console.log('✅ Noticias de exemplo criadas');
    }

    console.log('\n🎉 Seed do banco concluido!');
    console.log('\n📝 Usuarios disponiveis:');
    console.log('   - Admin: CPF 00000000000 / Senha: Admin@123');
    console.log('   - Servidor: CPF 11122233344 / Senha: Senha@123');
    console.log('   - Beneficiario: CPF 55566677788 / Senha: Senha@123');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

// Executa
async function main() {
  try {
    await initializeDatabase();
    await seedDatabase();
    console.log('\n✅ Configuracao completa!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

main();
