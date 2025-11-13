# 🚀 Guia de Deploy na Vercel - OryumAura

Este guia vai te ajudar a fazer o deploy completo do OryumAura na Vercel, incluindo frontend e backend.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 18+ instalado localmente (para testes)

---

## 🔧 Passo 1: Preparar o Repositório

### 1.1 Fazer commit de todas as alterações

```bash
git add .
git commit -m "feat: Configurar projeto para deploy na Vercel"
git push origin main
```

---

## ☁️ Passo 2: Criar Projeto na Vercel

### 2.1 Importar o projeto

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New..."** → **"Project"**
3. Selecione seu repositório Git
4. Clique em **"Import"**

### 2.2 Configurar o projeto

**Framework Preset:** Vite
**Root Directory:** `./` (raiz do projeto)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

---

## 🗄️ Passo 3: Adicionar Vercel Postgres

### 3.1 Criar banco de dados

1. No dashboard do seu projeto na Vercel
2. Vá em **"Storage"** → **"Create Database"**
3. Selecione **"Postgres"**
4. Escolha o plano (Free para começar)
5. Escolha a região (escolha a mais próxima do seu público)
6. Clique em **"Create"**

### 3.2 Conectar ao projeto

1. Selecione o banco de dados criado
2. Vá em **".env.local"** tab
3. As variáveis de ambiente serão adicionadas automaticamente ao projeto

> ✅ **Variáveis automáticas:** POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_USER, etc.

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Acessar configurações

1. No dashboard do projeto
2. Vá em **"Settings"** → **"Environment Variables"**

### 4.2 Adicionar variáveis obrigatórias

Adicione as seguintes variáveis de ambiente:

| Variável | Valor | Ambiente | Descrição |
|----------|-------|----------|-----------|
| `NODE_ENV` | `production` | Production | Ambiente de produção |
| `DB_TYPE` | `postgres` | Production | Tipo de banco de dados |
| `JWT_SECRET` | `[gere um secret forte]` | Production, Preview, Development | Secret para JWT |
| `JWT_EXPIRATION` | `8h` | Production, Preview, Development | Tempo de expiração do token |
| `CORS_ORIGIN` | `https://seu-projeto.vercel.app` | Production | URL do frontend |
| `VITE_API_URL` | `https://seu-projeto.vercel.app` | Production | URL da API |
| `GEMINI_API_KEY` | `sua-chave-gemini` | Production, Preview | API Key do Gemini AI |

### 4.3 Gerar JWT_SECRET forte

Execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole na variável `JWT_SECRET`.

### 4.4 Configurar CORS_ORIGIN

Após o primeiro deploy, você receberá uma URL da Vercel (ex: `https://oryum-aura.vercel.app`).

**Importante:** Atualize a variável `CORS_ORIGIN` e `VITE_API_URL` com essa URL.

---

## 🎯 Passo 5: Fazer o Deploy

### 5.1 Deploy automático

1. Faça push para a branch principal:

```bash
git push origin main
```

2. A Vercel fará o deploy automaticamente
3. Acompanhe o progresso no dashboard

### 5.2 Deploy manual (alternativo)

```bash
npm install -g vercel
vercel login
vercel
```

---

## 🗃️ Passo 6: Inicializar o Banco de Dados

Após o primeiro deploy bem-sucedido, você precisa criar as tabelas no Postgres.

### 6.1 Executar script de inicialização

**Opção 1: Via Vercel CLI**

```bash
vercel env pull .env.production
npm run init-postgres
```

**Opção 2: Via painel da Vercel**

1. Acesse **Storage** → Seu banco Postgres
2. Vá em **"Query"**
3. Execute manualmente o SQL do arquivo `scripts/init-postgres.js`

### 6.2 Verificar tabelas criadas

No painel do Postgres:
- Vá em **"Data"** tab
- Verifique se as tabelas foram criadas:
  - `users`
  - `beneficiaries`
  - `programs`
  - `appointments`
  - `news`
  - `audit_logs`
  - etc.

---

## ✅ Passo 7: Testar a Aplicação

### 7.1 Acessar a aplicação

1. Acesse a URL fornecida pela Vercel (ex: `https://oryum-aura.vercel.app`)

### 7.2 Fazer login com usuário padrão

```
CPF: 00000000000
Senha: admin123
```

> ⚠️ **IMPORTANTE:** Altere a senha padrão imediatamente após o primeiro acesso!

### 7.3 Verificar funcionalidades

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] API responde (teste endpoints em /api/...)
- [ ] Navegação entre páginas
- [ ] Criação de beneficiários
- [ ] Visualização de notícias

---

## 🔧 Passo 8: Configurações Adicionais (Opcional)

### 8.1 Domínio customizado

1. Vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio
4. Siga as instruções de DNS

**Importante:** Após adicionar domínio customizado:
- Atualize `CORS_ORIGIN` com o novo domínio
- Atualize `VITE_API_URL` com o novo domínio
- Faça redeploy

### 8.2 Configurar alertas

1. Vá em **"Settings"** → **"Notifications"**
2. Configure alertas de deploy
3. Configure alertas de erro

### 8.3 Monitoramento

1. Acesse **"Analytics"** para métricas de uso
2. Configure **"Log Drains"** para logs centralizados (opcional)

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

**Solução:**
1. Verifique se `DB_TYPE=postgres` está definido
2. Verifique se o Vercel Postgres está conectado ao projeto
3. Verifique se as variáveis `POSTGRES_*` foram adicionadas automaticamente

### Erro: "CORS policy"

**Solução:**
1. Verifique se `CORS_ORIGIN` está configurado com a URL correta (sem `/` no final)
2. Se usar múltiplos domínios, separe por vírgula: `https://app1.com,https://app2.com`
3. Faça redeploy após alterar

### Erro: "JWT token invalid"

**Solução:**
1. Verifique se `JWT_SECRET` está configurado
2. Limpe o localStorage do navegador
3. Faça login novamente

### Build falha

**Solução:**
1. Verifique os logs no dashboard da Vercel
2. Teste o build localmente: `npm run build`
3. Verifique se todas as dependências estão no `package.json`

### API não responde

**Solução:**
1. Verifique se `api/index.js` está sendo detectado
2. Verifique logs da função em **"Functions"** tab
3. Verifique se `vercel.json` está configurado corretamente

---

## 📊 Monitoramento e Logs

### Ver logs em tempo real

```bash
vercel logs [project-name] --follow
```

### Ver logs de uma função específica

```bash
vercel logs [project-name] --scope=api/index.js
```

---

## 🔄 Atualizações Futuras

### Deploy automático

Todo push para `main` fará deploy automático em produção.

### Preview deployments

Branches e Pull Requests geram preview deployments automaticamente.

### Rollback

1. Vá em **"Deployments"**
2. Encontre o deployment anterior
3. Clique nos três pontos → **"Promote to Production"**

---

## 🔒 Segurança

### Checklist de segurança

- [ ] `JWT_SECRET` é forte e único (min. 64 caracteres)
- [ ] Senha padrão do admin foi alterada
- [ ] `CORS_ORIGIN` está configurado corretamente (não usar `*` em produção)
- [ ] Variáveis de ambiente sensíveis não estão no código
- [ ] HTTPS está habilitado (automático na Vercel)
- [ ] Rate limiting está ativo

### Recomendações adicionais

1. **Adicione autenticação de dois fatores** na sua conta Vercel
2. **Configure branch protection** no GitHub
3. **Revise logs regularmente** em busca de atividades suspeitas
4. **Mantenha dependências atualizadas**: `npm outdated`

---

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Guide](https://expressjs.com/)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no dashboard da Vercel
2. Consulte este guia de troubleshooting
3. Verifique a documentação oficial da Vercel
4. Entre em contato com o suporte da Vercel (planos pagos)

---

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Teste todas as funcionalidades
2. ✅ Altere senha do usuário admin
3. ✅ Configure domínio customizado (opcional)
4. ✅ Configure backup do banco de dados
5. ✅ Configure monitoramento de uptime
6. ✅ Documente processos internos
7. ✅ Treine usuários finais

---

**Desenvolvido com ❤️ para a assistência social de Cacapava do Sul**

---

## 📝 Changelog

### v1.0.0 (2025-11-13)
- ✅ Configuração inicial para Vercel
- ✅ Migração de SQLite para Postgres
- ✅ Otimizações de build e performance
- ✅ Melhorias de segurança
- ✅ Documentação completa de deploy
