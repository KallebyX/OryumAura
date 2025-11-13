import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  console.log('🚀 Inicializando banco de dados Postgres...');

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
        birthDate TEXT,
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
        beneficiary_id INTEGER REFERENCES beneficiaries(id),
        program_id INTEGER REFERENCES programs(id),
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

    // News table
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT,
        category TEXT,
        published BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela news criada');

    // Appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id),
        server_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ('Baixa', 'Média', 'Alta')) NOT NULL DEFAULT 'Média',
        status TEXT CHECK(status IN ('Pendente', 'Em Andamento', 'Realizado', 'Cancelado')) NOT NULL DEFAULT 'Pendente',
        scheduled_date TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela appointments criada');

    // Home Visits table (CRAS module)
    await sql`
      CREATE TABLE IF NOT EXISTS home_visits (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id),
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
        status TEXT CHECK(status IN ('Planejada', 'Em Andamento', 'Concluída', 'Cancelada')) DEFAULT 'Planejada',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela paif_activities criada');

    // PAIF Participants table
    await sql`
      CREATE TABLE IF NOT EXISTS paif_participants (
        activity_id INTEGER REFERENCES paif_activities(id),
        beneficiary_id INTEGER REFERENCES beneficiaries(id),
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
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id),
        age_group TEXT CHECK(age_group IN ('0-6 anos', '6-15 anos', '15-17 anos', '18-59 anos', '60+ anos')),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('Ativo', 'Inativo', 'Concluído')) DEFAULT 'Ativo',
        observations TEXT
      )
    `;
    console.log('✅ Tabela scfv_enrollments criada');

    // CREAS Cases table
    await sql`
      CREATE TABLE IF NOT EXISTS creas_cases (
        id SERIAL PRIMARY KEY,
        beneficiary_id INTEGER NOT NULL REFERENCES beneficiaries(id),
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
    console.log('✅ Tabela creas_cases criada');

    // Protective Measures table
    await sql`
      CREATE TABLE IF NOT EXISTS protective_measures (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES creas_cases(id),
        measure_type TEXT NOT NULL,
        description TEXT,
        institution TEXT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        status TEXT CHECK(status IN ('Ativa', 'Concluída', 'Revogada')) DEFAULT 'Ativa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela protective_measures criada');

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
    console.log('✅ Tabela audit_logs criada');

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
    console.log('✅ Tabela tasks criada');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_beneficiaries_cpf ON beneficiaries(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)`;
    console.log('✅ Índices criados');

    // Insert default admin user if not exists
    const adminExists = await sql`SELECT id FROM users WHERE cpf = '00000000000'`;

    if (adminExists.rows.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await sql`
        INSERT INTO users (cpf, name, password_hash, role, email)
        VALUES ('00000000000', 'Administrador', ${hashedPassword}, 'secretaria', 'admin@oryumaura.com')
      `;
      console.log('✅ Usuário admin padrão criado (CPF: 00000000000, Senha: admin123)');
    }

    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente no painel da Vercel');
    console.log('2. Certifique-se de que DB_TYPE=postgres está definido');
    console.log('3. Adicione o Vercel Postgres ao seu projeto');
    console.log('4. Faça o deploy e teste a aplicação');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Execute if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { initializeDatabase };
