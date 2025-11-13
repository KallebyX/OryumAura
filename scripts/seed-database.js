import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

const DB_PATH = process.env.DB_PATH || './database.db';

console.log('🌱 Iniciando seed do banco de dados...');
console.log(`📁 Banco de dados: ${DB_PATH}`);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco de dados');
});

// Usuários de teste
const testUsers = [
  {
    name: 'Secretária Municipal',
    cpf: '99988877766',
    password: 'Senha123',
    role: 'secretaria'
  },
  {
    name: 'Servidor CRAS',
    cpf: '11122233344',
    password: 'Senha123',
    role: 'servidor'
  },
  {
    name: 'Beneficiário Teste',
    cpf: '55566677788',
    password: 'Senha123',
    role: 'beneficiario'
  }
];

// Função para inserir usuários
const seedUsers = () => {
  return new Promise((resolve, reject) => {
    console.log('\n👥 Criando usuários de teste...');

    let inserted = 0;
    const total = testUsers.length;

    testUsers.forEach((user, index) => {
      // Verifica se o usuário já existe
      db.get('SELECT id FROM users WHERE cpf = ?', [user.cpf], (err, row) => {
        if (err) {
          console.error(`❌ Erro ao verificar usuário ${user.name}:`, err);
          inserted++;
          if (inserted === total) resolve();
          return;
        }

        if (row) {
          console.log(`⚠️  Usuário ${user.name} (CPF: ${user.cpf}) já existe - pulando`);
          inserted++;
          if (inserted === total) resolve();
          return;
        }

        // Hash da senha
        const passwordHash = bcrypt.hashSync(user.password, 10);

        // Insere o usuário
        db.run(
          'INSERT INTO users (name, cpf, password_hash, role) VALUES (?, ?, ?, ?)',
          [user.name, user.cpf, passwordHash, user.role],
          function(err) {
            if (err) {
              console.error(`❌ Erro ao criar usuário ${user.name}:`, err);
            } else {
              console.log(`✅ Usuário criado: ${user.name} (CPF: ${user.cpf}, Cargo: ${user.role})`);
            }

            inserted++;
            if (inserted === total) resolve();
          }
        );
      });
    });
  });
};

// Função para criar alguns beneficiários de exemplo
const seedBeneficiaries = () => {
  return new Promise((resolve, reject) => {
    console.log('\n📋 Criando beneficiários de exemplo...');

    const beneficiaries = [
      {
        name: 'Maria da Silva',
        cpf: '12345678900',
        nis: '12345678901',
        birthDate: '1985-05-20',
        address: 'Rua das Flores, 123',
        phone: '55999998888',
        bairro: 'Centro',
        renda_familiar: 1200.00,
        membros_familia: 4,
        vulnerabilidade_score: 0.7
      },
      {
        name: 'João Pereira',
        cpf: '98765432100',
        nis: '09876543210',
        birthDate: '1990-02-15',
        address: 'Av. Principal, 456',
        phone: '55988887777',
        bairro: 'Bairro Norte',
        renda_familiar: 800.00,
        membros_familia: 3,
        vulnerabilidade_score: 0.85
      }
    ];

    let inserted = 0;
    const total = beneficiaries.length;

    beneficiaries.forEach(ben => {
      db.get('SELECT id FROM beneficiaries WHERE cpf = ?', [ben.cpf], (err, row) => {
        if (err || row) {
          if (row) console.log(`⚠️  Beneficiário ${ben.name} já existe - pulando`);
          inserted++;
          if (inserted === total) resolve();
          return;
        }

        db.run(
          `INSERT INTO beneficiaries (name, cpf, nis, birthDate, address, phone, bairro, renda_familiar, membros_familia, vulnerabilidade_score)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [ben.name, ben.cpf, ben.nis, ben.birthDate, ben.address, ben.phone, ben.bairro, ben.renda_familiar, ben.membros_familia, ben.vulnerabilidade_score],
          function(err) {
            if (err) {
              console.error(`❌ Erro ao criar beneficiário ${ben.name}:`, err);
            } else {
              console.log(`✅ Beneficiário criado: ${ben.name}`);
            }

            inserted++;
            if (inserted === total) resolve();
          }
        );
      });
    });
  });
};

// Executa o seed
(async () => {
  try {
    await seedUsers();
    await seedBeneficiaries();

    console.log('\n✨ Seed concluído com sucesso!\n');
    console.log('📝 Credenciais de teste:');
    console.log('─────────────────────────────────────');
    console.log('Secretária:');
    console.log('  CPF: 99988877766');
    console.log('  Senha: Senha123');
    console.log('');
    console.log('Servidor:');
    console.log('  CPF: 11122233344');
    console.log('  Senha: Senha123');
    console.log('');
    console.log('Beneficiário:');
    console.log('  CPF: 55566677788');
    console.log('  Senha: Senha123');
    console.log('─────────────────────────────────────\n');

    db.close();
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    db.close();
    process.exit(1);
  }
})();
