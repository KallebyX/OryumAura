# 📋 Checklist de Deploy - OryumAura na Vercel

Use este checklist para garantir que o deploy foi realizado corretamente.

## ✅ Antes do Deploy

### Preparação do Código
- [x] Build local testado (`npm run build`)
- [x] Código commitado no Git
- [x] Branch principal atualizada
- [x] Dependências atualizadas
- [x] Variáveis de ambiente documentadas

### Arquivos de Configuração
- [x] `vercel.json` configurado
- [x] `.env.production.example` criado
- [x] `vite.config.ts` otimizado para produção
- [x] `package.json` com scripts corretos

### Segurança
- [x] Headers de segurança configurados
- [x] Rate limiting implementado
- [x] Validação de inputs
- [x] Auditoria LGPD implementada

---

## 🚀 Durante o Deploy

### 1. Criar Projeto na Vercel
- [ ] Importar repositório Git
- [ ] Selecionar Framework: Vite
- [ ] Configurar Build Command: `npm run build`
- [ ] Configurar Output Directory: `dist`

### 2. Adicionar Vercel Postgres
- [ ] Criar novo banco Postgres
- [ ] Conectar ao projeto
- [ ] Verificar variáveis `POSTGRES_*` adicionadas automaticamente

### 3. Configurar Variáveis de Ambiente

**Obrigatórias:**
- [ ] `NODE_ENV` = `production`
- [ ] `DB_TYPE` = `postgres`
- [ ] `JWT_SECRET` = `[gerado com crypto.randomBytes]`
- [ ] `JWT_EXPIRATION` = `8h`
- [ ] `CORS_ORIGIN` = `https://seu-projeto.vercel.app`
- [ ] `VITE_API_URL` = `https://seu-projeto.vercel.app`

**Opcionais:**
- [ ] `GEMINI_API_KEY` = `sua-chave-gemini`
- [ ] `RATE_LIMIT_WINDOW_MS` = `900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS` = `100`
- [ ] `LOG_LEVEL` = `info`

### 4. Deploy Inicial
- [ ] Clicar em "Deploy"
- [ ] Aguardar conclusão do build
- [ ] Verificar logs de build
- [ ] Anotar URL gerada

### 5. Atualizar Variáveis com URL Real
- [ ] Atualizar `CORS_ORIGIN` com URL da Vercel
- [ ] Atualizar `VITE_API_URL` com URL da Vercel
- [ ] Fazer redeploy

---

## 🗃️ Após o Deploy

### Inicializar Banco de Dados

**Opção 1: Via Vercel CLI**
```bash
vercel env pull .env.production
npm run init-postgres
```

**Opção 2: Via SQL direto no painel Vercel**
- [ ] Acessar Storage → seu banco Postgres
- [ ] Ir em "Query" tab
- [ ] Executar script de `scripts/init-postgres.js`

### Verificar Tabelas Criadas
- [ ] `users`
- [ ] `beneficiaries`
- [ ] `programs`
- [ ] `appointments`
- [ ] `news`
- [ ] `audit_logs`
- [ ] `home_visits`
- [ ] `paif_activities`
- [ ] `creas_cases`
- [ ] `protective_measures`

---

## 🧪 Testes Pós-Deploy

### Funcionalidades Básicas
- [ ] Aplicação carrega sem erros
- [ ] Login funciona (CPF: 00000000000, Senha: admin123)
- [ ] Dashboard carrega corretamente
- [ ] Navegação entre páginas funciona

### Rotas de API
- [ ] `/api/login` responde
- [ ] `/api/profile` retorna dados do usuário
- [ ] `/api/beneficiaries` retorna lista
- [ ] `/api/programs` retorna programas
- [ ] `/api/news` retorna notícias

### Performance
- [ ] Lighthouse Score > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Sem erros no console

### Segurança
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] Headers de segurança presentes
- [ ] Rate limiting funcionando
- [ ] JWT expira corretamente
- [ ] CORS bloqueando origens não autorizadas

---

## 🔐 Segurança Pós-Deploy

### Ações Imediatas
- [ ] Alterar senha do usuário admin padrão
- [ ] Verificar JWT_SECRET é único e forte
- [ ] Confirmar CORS_ORIGIN não é `*`
- [ ] Revisar logs de auditoria

### Recomendações
- [ ] Habilitar 2FA na conta Vercel
- [ ] Configurar notificações de deploy
- [ ] Configurar branch protection no GitHub
- [ ] Documentar credenciais em local seguro
- [ ] Criar backup manual do banco de dados

---

## 📊 Monitoramento

### Configurar Alertas
- [ ] Alertas de erro (via Vercel)
- [ ] Alertas de downtime
- [ ] Alertas de uso excessivo

### Métricas para Acompanhar
- [ ] Número de usuários ativos
- [ ] Tempo de resposta da API
- [ ] Taxa de erro
- [ ] Uso do banco de dados

---

## 🎨 Melhorias Futuras (Opcional)

### Domínio Personalizado
- [ ] Comprar domínio
- [ ] Adicionar na Vercel (Settings → Domains)
- [ ] Atualizar CORS_ORIGIN e VITE_API_URL
- [ ] Configurar SSL (automático)

### Analytics
- [ ] Adicionar Google Analytics
- [ ] Configurar Vercel Analytics
- [ ] Implementar tracking de eventos

### CI/CD
- [ ] Configurar GitHub Actions
- [ ] Testes automáticos antes do deploy
- [ ] Lint e formatação automática

---

## 📞 Em Caso de Problemas

### Erros Comuns

**1. Database connection failed**
- Verificar `DB_TYPE=postgres`
- Verificar variáveis `POSTGRES_*`
- Verificar se banco foi criado

**2. CORS policy error**
- Verificar `CORS_ORIGIN` está correto
- Verificar não tem `/` no final da URL
- Fazer redeploy

**3. JWT token invalid**
- Verificar `JWT_SECRET` está definido
- Limpar localStorage do navegador
- Fazer login novamente

**4. Build failed**
- Verificar logs no dashboard
- Testar build local: `npm run build`
- Verificar dependências no package.json

### Recursos de Suporte
- [Documentação Vercel](https://vercel.com/docs)
- [Guia de Deploy](VERCEL_DEPLOY_GUIDE.md)
- [README do Projeto](README.md)

---

## ✅ Deploy Concluído!

Quando todos os itens acima estiverem marcados:

- [ ] Deploy está funcionando 100%
- [ ] Todos os testes passaram
- [ ] Segurança verificada
- [ ] Documentação atualizada
- [ ] Equipe foi notificada
- [ ] Usuários podem acessar

**🎉 Parabéns! Seu sistema OryumAura está no ar!**

---

**Data do Deploy:** _________________

**URL de Produção:** _________________

**Responsável:** _________________

**Observações:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
