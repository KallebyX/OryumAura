# 🚀 Scripts do OryumAura

## create-issues.sh

Script automatizado para criar todas as 10 issues prioritárias do roadmap v2.1.0 - v2.3.0.

### 📋 Pré-requisitos

1. **GitHub CLI instalado:**
   ```bash
   # macOS
   brew install gh

   # Windows
   winget install --id GitHub.cli

   # Linux (Debian/Ubuntu)
   sudo apt install gh

   # Ou veja: https://cli.github.com/
   ```

2. **Autenticado no GitHub:**
   ```bash
   gh auth login
   ```

### ▶️ Como Usar

```bash
# 1. Navegue até o diretório do projeto
cd OryumAura

# 2. Execute o script
./scripts/create-issues.sh

# Ou com bash
bash scripts/create-issues.sh
```

### 📊 O Que Será Criado

O script cria **10 issues** organizadas por prioridade:

| # | Título | Prioridade | Size | Milestone |
|---|--------|-----------|------|-----------|
| 1 | Testes automatizados (80% coverage) | CRITICAL | L | v2.1.0 |
| 2 | Corrigir erros TypeScript (30+ erros) | HIGH | M | v2.1.0 |
| 3 | Swagger/OpenAPI (60+ endpoints) | HIGH | M | v2.1.0 |
| 4 | Paginação cursor-based | HIGH | M | v2.2.0 |
| 5 | Validação CPF completa | HIGH | S | v2.2.0 |
| 6 | Redis caching (70%+ redução) | HIGH | M | v2.2.0 |
| 7 | Upload de arquivos (MinIO/S3) | MEDIUM | L | v2.3.0 |
| 8 | WebSockets tempo real | MEDIUM | L | v2.3.0 |
| 9 | Backend TypeScript | MEDIUM | XL | v2.3.0 |
| 10 | Storybook componentes | MEDIUM | M | v2.3.0 |

### ✅ Após Criar as Issues

1. **Criar Milestones:**
   ```bash
   gh milestone create v2.1.0 --title "Testes & Qualidade" --due-date 2025-03-31
   gh milestone create v2.2.0 --title "Performance" --due-date 2025-06-30
   gh milestone create v2.3.0 --title "Features" --due-date 2025-09-30
   ```

2. **Atribuir Issues aos Milestones:**
   ```bash
   # v2.1.0 - Issues #1, #2, #3
   gh issue edit 1 --milestone v2.1.0
   gh issue edit 2 --milestone v2.1.0
   gh issue edit 3 --milestone v2.1.0

   # v2.2.0 - Issues #4, #5, #6
   gh issue edit 4 --milestone v2.2.0
   gh issue edit 5 --milestone v2.2.0
   gh issue edit 6 --milestone v2.2.0

   # v2.3.0 - Issues #7, #8, #9, #10
   gh issue edit 7 --milestone v2.3.0
   gh issue edit 8 --milestone v2.3.0
   gh issue edit 9 --milestone v2.3.0
   gh issue edit 10 --milestone v2.3.0
   ```

3. **Se Atribuir a Si Mesmo:**
   ```bash
   gh issue edit 1 --assignee @me
   # Ou para todas de uma vez
   for i in {1..10}; do gh issue edit $i --assignee @me; done
   ```

### 🐛 Troubleshooting

**Erro: "gh: command not found"**
```bash
# Instale o GitHub CLI primeiro
# Veja: https://cli.github.com/manual/installation
```

**Erro: "authentication required"**
```bash
# Autentique-se
gh auth login
# Escolha: GitHub.com → HTTPS → Login with browser
```

**Erro: "permission denied"**
```bash
# Torne o script executável
chmod +x scripts/create-issues.sh
```

### 📚 Referências

- [ROADMAP.md](../ROADMAP.md) - Planejamento completo
- [.github/ISSUES_TO_CREATE.md](../.github/ISSUES_TO_CREATE.md) - Detalhes das issues
- [GitHub CLI Manual](https://cli.github.com/manual/)

---

**Última atualização:** 2025-11-14
