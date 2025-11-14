# 🚀 Configuração do Vercel

## ⚠️ IMPORTANTE: Variáveis de Ambiente Obrigatórias

O sistema **requer** que o `JWT_SECRET` esteja configurado para funcionar. Siga os passos abaixo:

---

## 📋 Passo a Passo

### 1. Gerar JWT Secret Seguro

No seu terminal local, execute:

```bash
openssl rand -base64 32
```

**Copie o resultado.** Exemplo de saída:
```
a8K3mN9pQ2rS4tU6vW8xY0zA1bC3dE5fG7hI9jK1lM3n=
```

### 2. Configurar no Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **OryumAura**
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `JWT_SECRET` | `[Cole aqui o secret gerado]` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Production |

**⚠️ CRÍTICO:** O `JWT_SECRET` deve ter **no mínimo 32 caracteres**.

### 3. Redeploy

Após configurar as variáveis:

```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

Ou no Vercel Dashboard:
- **Deployments** → Último deploy → **⋯** → **Redeploy**

---

## 🔧 Troubleshooting

### Erro: "JWT_SECRET não configurado"

**Causa:** Variável de ambiente não foi configurada no Vercel.

**Solução:**
1. Verifique que `JWT_SECRET` está em **Environment Variables**
2. Certifique-se que está em **Production**
3. Faça redeploy

### Erro: "JWT_SECRET muito curto"

**Causa:** Secret tem menos de 32 caracteres.

**Solução:**
```bash
# Gere um novo secret
openssl rand -base64 32

# Atualize no Vercel
```

### Erro: CORS

**Causa:** `CORS_ORIGIN` não corresponde ao domínio.

**Solução:**
```bash
# Configure no Vercel
CORS_ORIGIN=https://seu-app.vercel.app
```

---

## ✅ Verificação

Após o deploy, teste:

```bash
curl https://seu-app.vercel.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T..."
}
```

---

## 📚 Referências

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OryumAura DEPLOYMENT.md](./DEPLOYMENT.md)
- [OryumAura CHANGELOG.md](./CHANGELOG.md)
