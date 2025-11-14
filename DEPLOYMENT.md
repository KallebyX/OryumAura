# 🚀 OryumAura - Enterprise Deployment Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Option 1: Vercel (Recommended for MVP)](#option-1-vercel-recommended-for-mvp)
  - [Option 2: Docker (Production)](#option-2-docker-production)
  - [Option 3: Kubernetes (Enterprise)](#option-3-kubernetes-enterprise)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js 20.x or higher
- npm 9.x or higher
- Git
- OpenSSL (for generating secrets)

### For Docker Deployment
- Docker 24.x or higher
- Docker Compose v2.x or higher

### For Kubernetes Deployment
- kubectl
- Helm 3.x
- Access to a Kubernetes cluster

---

## Environment Setup

### 1. Generate Secure Secrets

```bash
# Generate JWT Secret (minimum 32 characters)
openssl rand -base64 32

# Generate Database Password
openssl rand -base64 24

# Generate Redis Password
openssl rand -base64 24
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# CRITICAL: Replace ALL placeholder values
NODE_ENV=production
PORT=3001

# Database (use your generated password)
DB_TYPE=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=oryumaura
DB_USER=oryumaura
DB_PASSWORD=<YOUR_GENERATED_DB_PASSWORD>

# JWT (use your generated secret)
JWT_SECRET=<YOUR_GENERATED_JWT_SECRET>
JWT_EXPIRATION=15m

# CORS (use your actual domain)
CORS_ORIGIN=https://yourdomain.com

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<YOUR_GENERATED_REDIS_PASSWORD>
```

---

## Deployment Options

## Option 1: Vercel (Recommended for MVP)

### Pros
- ✅ Zero DevOps required
- ✅ Auto-scaling
- ✅ Global CDN
- ✅ Free tier available
- ✅ GitHub integration

### Cons
- ⚠️ Serverless limitations
- ⚠️ Cold starts possible
- ⚠️ Limited control

### Steps

1. **Fork or clone the repository**
   ```bash
   git clone https://github.com/KallebyX/OryumAura.git
   cd OryumAura
   ```

2. **Install Vercel CLI** (optional, for local testing)
   ```bash
   npm install -g vercel
   ```

3. **Configure Vercel Project**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables in Vercel**
   Go to Project Settings → Environment Variables and add:
   - `JWT_SECRET` (generated value)
   - `CORS_ORIGIN` (your Vercel domain)
   - `NODE_ENV=production`

5. **Deploy**
   ```bash
   # Automatic via GitHub
   git push origin main

   # Or manual via CLI
   vercel --prod
   ```

6. **Verify Deployment**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

---

## Option 2: Docker (Production)

### Pros
- ✅ Full control
- ✅ Consistent environments
- ✅ Easy local testing
- ✅ Scalable

### Cons
- ⚠️ Requires server management
- ⚠️ Manual scaling

### Steps

1. **Prepare Environment**
   ```bash
   cp .env.docker .env
   # Edit .env with your values
   ```

2. **Build Docker Image**
   ```bash
   docker build -t oryumaura:latest .
   ```

3. **Run with Docker Compose**
   ```bash
   # Production
   docker-compose up -d

   # Development
   docker-compose -f docker-compose.dev.yml up
   ```

4. **Initialize Database**
   ```bash
   docker-compose exec app node scripts/init-postgres.js
   docker-compose exec app node scripts/seed-database.js
   ```

5. **Verify Deployment**
   ```bash
   curl http://localhost:3001/api/health

   # Check logs
   docker-compose logs -f app
   ```

### Scaling with Docker Compose

```yaml
# docker-compose.yml
services:
  app:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

---

## Option 3: Kubernetes (Enterprise)

### Pros
- ✅ Auto-scaling
- ✅ Self-healing
- ✅ Rolling updates
- ✅ High availability

### Cons
- ⚠️ Complex setup
- ⚠️ Requires K8s knowledge

### Steps

1. **Create Namespace**
   ```bash
   kubectl create namespace oryumaura
   ```

2. **Create Secrets**
   ```bash
   kubectl create secret generic oryumaura-secrets \
     --from-literal=jwt-secret=$(openssl rand -base64 32) \
     --from-literal=db-password=$(openssl rand -base64 24) \
     --from-literal=redis-password=$(openssl rand -base64 24) \
     -n oryumaura
   ```

3. **Deploy PostgreSQL**
   ```bash
   helm install postgres bitnami/postgresql \
     --set auth.postgresPassword=$(kubectl get secret oryumaura-secrets -o jsonpath='{.data.db-password}' | base64 -d) \
     --set auth.database=oryumaura \
     -n oryumaura
   ```

4. **Deploy Redis**
   ```bash
   helm install redis bitnami/redis \
     --set auth.password=$(kubectl get secret oryumaura-secrets -o jsonpath='{.data.redis-password}' | base64 -d) \
     -n oryumaura
   ```

5. **Deploy Application**
   ```bash
   kubectl apply -f k8s/deployment.yaml -n oryumaura
   kubectl apply -f k8s/service.yaml -n oryumaura
   kubectl apply -f k8s/ingress.yaml -n oryumaura
   ```

6. **Verify Deployment**
   ```bash
   kubectl get pods -n oryumaura
   kubectl logs -f deployment/oryumaura -n oryumaura
   ```

---

## Post-Deployment

### 1. Health Checks

```bash
# API Health
curl https://your-domain.com/api/health

# Expected response
{"status":"ok","timestamp":"2025-11-14T..."}
```

### 2. Create Admin User

```bash
# Via API
curl -X POST https://your-domain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Administrador",
    "cpf": "00000000000",
    "senha": "YourSecurePassword123!",
    "role": "secretaria"
  }'
```

### 3. Configure HTTPS

#### For Docker/K8s with Nginx
- Use Let's Encrypt with Certbot
- Mount certificates in nginx container
- Update nginx.conf with SSL configuration

#### For Vercel
- Automatic HTTPS via Vercel's CDN

### 4. Setup Monitoring

- Configure application logs
- Setup error tracking (Sentry)
- Enable application performance monitoring (APM)

---

## Monitoring & Maintenance

### Health Monitoring

```bash
# Check application health
curl https://your-domain.com/api/health

# Check database connection
docker-compose exec postgres pg_isready

# Check Redis
docker-compose exec redis redis-cli ping
```

### Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# All services
docker-compose logs -f
```

### Backups

```bash
# Database backup
docker-compose exec postgres pg_dump -U oryumaura oryumaura > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U oryumaura oryumaura < backup_20251114.sql
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Verify
docker-compose logs -f app
```

---

## Troubleshooting

### Issue: Application won't start

**Symptoms:**
```
❌ ERRO CRÍTICO DE SEGURANÇA: JWT_SECRET não configurado
```

**Solution:**
```bash
# Generate and set JWT_SECRET
export JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env
```

### Issue: Database connection failed

**Symptoms:**
```
Error: connect ECONNREFUSED
```

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Issue: CORS errors in browser

**Symptoms:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solution:**
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=https://your-actual-domain.com

# Restart application
docker-compose restart app
```

### Issue: Refresh token not working

**Symptoms:**
```
401 Unauthorized: Refresh token inválido ou expirado
```

**Solution:**
```bash
# Check if refresh_tokens table exists
docker-compose exec postgres psql -U oryumaura -c "\dt refresh_tokens"

# If not, reinitialize database
docker-compose exec app node scripts/init-postgres.js
```

---

## Security Checklist

Before going to production, ensure:

- [ ] JWT_SECRET is cryptographically secure (32+ chars)
- [ ] Database password is strong and unique
- [ ] Redis password is set
- [ ] CORS is configured for your specific domain (not *)
- [ ] HTTPS is enabled
- [ ] Environment files (.env) are in .gitignore
- [ ] Secrets are stored securely (not in code)
- [ ] Rate limiting is enabled
- [ ] Helmet.js security headers are active
- [ ] Database backups are configured
- [ ] Monitoring and logging are set up

---

## Performance Optimization

### For Docker
- Use multi-stage builds (✅ already implemented)
- Enable BuildKit: `DOCKER_BUILDKIT=1 docker build`
- Use layer caching
- Minimize image size

### For Application
- Enable compression middleware
- Implement Redis caching
- Use CDN for static assets
- Enable database query optimization
- Implement pagination for large datasets

---

## Support

### Documentation
- Main README: `/README.md`
- CHANGELOG: `/CHANGELOG.md`
- API Docs: (Coming soon - Swagger)

### Community
- Issues: https://github.com/KallebyX/OryumAura/issues
- Discussions: https://github.com/KallebyX/OryumAura/discussions

---

**Last Updated:** 2025-11-14
**Version:** 2.0.0
