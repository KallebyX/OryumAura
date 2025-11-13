# 🌟 OryumAura - Sistema de Gestão de Assistência Social

<div align="center">

**Sistema completo de gestão para Secretaria de Assistência Social de Cacapava do Sul**

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KallebyX/OryumAura)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deploy](#-deploy)

</div>

---

## 📖 Sobre o Projeto

OryumAura é um sistema completo de gestão para secretarias de assistência social, desenvolvido especificamente para atender às necessidades do município de Cacapava do Sul. O sistema oferece ferramentas modernas para gestão de beneficiários, programas sociais, agendamentos, CRAS, CREAS e muito mais.

### 🎯 Objetivos

- **Centralizar** informações de beneficiários e programas sociais
- **Otimizar** processos administrativos e atendimentos
- **Garantir** conformidade com LGPD e regulamentações
- **Facilitar** acesso dos cidadãos aos serviços sociais
- **Melhorar** tomada de decisões com dados e relatórios

---

## ✨ Features

### 🏛️ Módulo Administrativo
- ✅ Gestão completa de beneficiários
- ✅ Cadastro e acompanhamento de famílias
- ✅ Integração com CadÚnico
- ✅ Gestão de programas sociais
- ✅ Sistema de agendamentos
- ✅ Relatórios e estatísticas

### 👥 CRAS & CREAS
- ✅ Registro de visitas domiciliares
- ✅ Gestão de atividades PAIF
- ✅ Gestão de casos especializados
- ✅ Medidas protetivas

### 📰 Portal do Cidadão
- ✅ Notícias e comunicados
- ✅ Consulta de programas
- ✅ Agendamento online

### 🤖 Inteligência Artificial
- ✅ Chatbot com IA
- ✅ Análise de vulnerabilidade
- ✅ Recomendações inteligentes

---

## 🛠 Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS
**Backend:** Node.js, Express.js, PostgreSQL/SQLite
**Deploy:** Vercel, Vercel Postgres

---

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+
- npm

### Instalação Local

1. **Clone e instale**

```bash
git clone https://github.com/KallebyX/OryumAura.git
cd OryumAura
npm install
```

2. **Configure variáveis de ambiente**

```bash
cp .env.example .env
```

3. **Inicialize o banco de dados**

```bash
npm run seed
```

4. **Inicie a aplicação**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

5. **Acesse** [http://localhost:5173](http://localhost:5173)

**Login padrão:**
```
CPF: 00000000000
Senha: admin123
```

---

## 🌐 Deploy na Vercel

Consulte o [**VERCEL_DEPLOY_GUIDE.md**](VERCEL_DEPLOY_GUIDE.md) para instruções completas de deploy.

**Resumo:**
1. Importe projeto na Vercel
2. Adicione Vercel Postgres
3. Configure variáveis de ambiente
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KallebyX/OryumAura)

---

## 📚 Scripts Disponíveis

```bash
npm run dev          # Frontend dev server
npm run server       # Backend server
npm run build        # Build produção
npm run seed         # Popular banco SQLite
npm run init-postgres # Inicializar Postgres
```

---

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Controle de acesso (RBAC)
- ✅ Rate limiting
- ✅ Criptografia de senhas
- ✅ Auditoria LGPD
- ✅ Headers de segurança

---

## 📁 Estrutura

```
OryumAura/
├── api/              # Backend Express
├── components/       # Componentes React
├── pages/           # Páginas
├── services/        # API calls
├── scripts/         # Scripts utilitários
└── public/          # Estáticos
```

---

## 📝 License

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Feito com ❤️ para transformar a assistência social através da tecnologia**

**⭐ Se este projeto foi útil, dê uma estrela! ⭐**

</div>
