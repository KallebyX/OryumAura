# Acessibilidade - OryumAura

Este documento descreve as práticas de acessibilidade implementadas no OryumAura, conforme as diretrizes WCAG 2.1 Nível AA.

## 🎯 Objetivos de Acessibilidade

O OryumAura foi desenvolvido para ser utilizável por TODOS os cidadãos, incluindo:
- Pessoas com deficiências visuais (cegas ou com baixa visão)
- Pessoas com deficiências motoras
- Pessoas com deficiências auditivas
- Pessoas com deficiências cognitivas
- Idosos com dificuldades tecnológicas
- Usuários de tecnologias assistivas

## ♿ Recursos de Acessibilidade Implementados

### 1. Navegação por Teclado

**TODAS as funcionalidades podem ser acessadas via teclado:**

#### Atalhos Globais
- `Cmd/Ctrl + K` - Abrir paleta de comandos
- `Esc` - Fechar modais/diálogos
- `Tab` - Navegar para próximo elemento
- `Shift + Tab` - Navegar para elemento anterior
- `Enter` / `Space` - Ativar botões e links

#### Componentes Específicos

**Tabelas:**
- `↑↓` - Navegar entre linhas
- `Enter` - Selecionar linha

**Command Palette:**
- `↑↓` - Navegar entre opções
- `Enter` - Selecionar comando
- `Esc` - Fechar

**Modals/Dialogs:**
- `Esc` - Fechar
- `Tab` - Navegar dentro do modal (com "trap focus")

**Dropdowns:**
- `Enter/Space` - Abrir/fechar
- `↑↓` - Navegar opções
- `Enter` - Selecionar opção
- `Esc` - Fechar sem selecionar

### 2. Leitores de Tela

**Compatibilidade Total com:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS, iOS)
- TalkBack (Android)

**Implementações:**
- ✅ ARIA labels em todos os elementos interativos
- ✅ ARIA roles semânticos
- ✅ ARIA live regions para atualizações dinâmicas
- ✅ Descrições alternativas para ícones
- ✅ Anúncios de mudanças de estado
- ✅ Feedback audível para ações

**Exemplos:**

```html
<!-- Botão com label descritivo -->
<button aria-label="Fechar modal de confirmação">
  <X size={20} />
</button>

<!-- Input com label associado -->
<label htmlFor="email">Email</label>
<input id="email" aria-required="true" aria-invalid="false" />

<!-- Live region para toasts -->
<div role="alert" aria-live="polite">
  Operação concluída com sucesso!
</div>

<!-- Status de loading -->
<div role="status" aria-busy="true" aria-label="Carregando dados">
  <LoadingSpinner />
</div>
```

### 3. Contraste de Cores

**Todos os textos atendem mínimos WCAG AA:**
- Texto normal: ≥ 4.5:1
- Texto grande (≥18pt): ≥ 3:1
- Elementos UI: ≥ 3:1

**Paleta de Cores Acessível:**

| Elemento | Light Mode | Dark Mode | Contraste |
|----------|------------|-----------|-----------|
| Texto principal | #374151 em #F9FAFB | #E5E7EB em #111827 | 12.6:1 |
| Texto secundário | #6B7280 em #FFFFFF | #9CA3AF em #1F2937 | 7.5:1 |
| Botão primário | #FFFFFF em #2E7D32 | #111827 em #22C55E | 5.2:1 |
| Links | #2E7D32 em #FFFFFF | #22C55E em #111827 | 4.8:1 |

### 4. Foco Visível

**Indicadores de foco claros em todos os elementos:**

```css
.focus-ring {
  @apply focus:outline-none
         focus:ring-2
         focus:ring-green-600
         focus:ring-offset-2
         dark:focus:ring-green-500;
}
```

**Características:**
- Anel de foco verde (#2E7D32) com 2px
- Offset de 2px para separação visual
- Visível em fundos claros e escuros
- Nunca removido (`outline: none` apenas com `ring` alternativo)

### 5. Tamanhos de Toque

**Área mínima de 44×44px para todos os alvos de toque:**
- ✅ Botões: 44px altura mínima
- ✅ Links: padding adequado
- ✅ Checkboxes/radios: 20px com área de toque 44px
- ✅ Ícones clicáveis: área expandida

```tsx
// Exemplo de área de toque expandida
<button className="p-4"> {/* 16px padding = 44px total */}
  <Icon size={20} />
</button>
```

### 6. Formulários Acessíveis

**Todos os campos de formulário têm:**
- ✅ Labels visíveis e associados
- ✅ Instruções claras
- ✅ Mensagens de erro descritivas
- ✅ Validação inline
- ✅ Indicação de campos obrigatórios
- ✅ Autocomplete adequado

**Exemplo:**

```tsx
<Input
  id="email"
  label="Email"
  type="email"
  required
  error="Email inválido. Formato esperado: usuario@dominio.com"
  helperText="Usaremos este email para contato"
  aria-describedby="email-helper email-error"
  autoComplete="email"
/>
```

### 7. Responsividade e Zoom

**Suporte a zoom até 200% sem perda de funcionalidade:**
- ✅ Layout flexível (grid/flexbox)
- ✅ Unidades relativas (rem, em, %)
- ✅ Texto escalável
- ✅ Sem rolagem horizontal
- ✅ Breakpoints adequados

**Breakpoints:**
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### 8. Modo Escuro

**Reduz fadiga visual e melhora legibilidade:**
- ✅ Toggle simples no header
- ✅ Preferência salva em localStorage
- ✅ Transições suaves
- ✅ Contraste mantido

```tsx
// Usar dark mode toggle
const { isDarkMode, toggleDarkMode } = useDarkMode();
```

### 9. VLibras

**Tradutor de Libras integrado:**
- ✅ Plugin oficial VLibras Gov.br
- ✅ Disponível em todas as páginas
- ✅ Traduz todo conteúdo textual
- ✅ Acessível via botão flutuante

### 10. Estrutura Semântica

**HTML semântico correto:**

```html
<header> <!-- Cabeçalho da página -->
<nav> <!-- Navegação principal -->
<main> <!-- Conteúdo principal -->
  <article> <!-- Artigo ou seção independente -->
  <section> <!-- Seção temática -->
  <aside> <!-- Conteúdo relacionado -->
</main>
<footer> <!-- Rodapé -->
```

**Hierarquia de Headings:**
```
h1 - Título principal (1 por página)
  h2 - Seções principais
    h3 - Subseções
      h4 - Detalhes
```

## 📋 Checklist de Teste de Acessibilidade

### Testes Manuais

- [ ] **Navegação por teclado**
  - [ ] Tab percorre todos elementos interativos
  - [ ] Ordem de foco lógica
  - [ ] Foco visível em todos elementos
  - [ ] Nenhuma "armadilha de teclado"
  - [ ] Skip links funcionam

- [ ] **Leitor de tela**
  - [ ] Todos elementos têm labels
  - [ ] Conteúdo dinâmico é anunciado
  - [ ] Formulários são compreensíveis
  - [ ] Erros são lidos claramente
  - [ ] Navegação por landmarks funciona

- [ ] **Zoom e responsividade**
  - [ ] Zoom 200% funcional
  - [ ] Sem rolagem horizontal
  - [ ] Texto legível em todos tamanhos
  - [ ] Funciona em mobile (320px)

- [ ] **Contraste**
  - [ ] Texto tem contraste mínimo 4.5:1
  - [ ] Botões tem contraste mínimo 3:1
  - [ ] Ícones importantes tem contraste adequado

- [ ] **Formulários**
  - [ ] Labels visíveis
  - [ ] Erros descritivos
  - [ ] Campos obrigatórios indicados
  - [ ] Autocomplete configurado

### Ferramentas Automatizadas

**Recomendadas para testes contínuos:**

1. **Lighthouse (Chrome DevTools)**
   ```
   - Acessibilidade Score ≥ 90
   - Sem erros críticos
   ```

2. **axe DevTools**
   ```
   - Extensão Chrome/Firefox
   - Testa WCAG 2.1 AA
   ```

3. **WAVE**
   ```
   - WebAIM Wave Extension
   - Identifica erros estruturais
   ```

4. **Screen Reader**
   ```
   - NVDA (Windows - Free)
   - VoiceOver (Mac - Built-in)
   ```

### Comando de Teste

```bash
# Executar audit de acessibilidade
npm run accessibility-audit

# Testes E2E com acessibilidade
npm run test:a11y
```

## 🚀 Próximos Passos

### Em Desenvolvimento

- [ ] Testes automatizados de acessibilidade (Jest + axe-core)
- [ ] Documentação em Libras (vídeos)
- [ ] Modo de alto contraste adicional
- [ ] Narração de texto (Text-to-Speech)
- [ ] Reduç ão de movimento (respect prefers-reduced-motion)

### Roadmap

- [ ] Certificação de conformidade WCAG 2.1 AA
- [ ] Selo de acessibilidade eMAG
- [ ] Auditoria externa
- [ ] Treinamento de equipe

## 📚 Recursos e Referências

**Diretrizes:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [eMAG - Modelo de Acessibilidade em Governo Eletrônico](https://www.gov.br/governodigital/pt-br/acessibilidade-digital)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

**Ferramentas:**
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [VLibras](https://www.gov.br/governodigital/pt-br/vlibras)

**Legislação Brasileira:**
- Lei Brasileira de Inclusão (LBI) - Lei 13.146/2015
- Decreto 5.296/2004
- Lei de Acesso à Informação - Lei 12.527/2011

## 💡 Dicas para Desenvolvedores

### Sempre faça:

1. **Teste com teclado** antes de submeter código
2. **Use HTML semântico** (não abuse de divs)
3. **Adicione ARIA labels** em ícones e botões sem texto
4. **Teste com leitor de tela** periodicamente
5. **Mantenha ordem de foco lógica**
6. **Valide contraste** de novas cores

### Nunca faça:

1. ❌ Remover outline sem substituto
2. ❌ Usar apenas cor para transmitir informação
3. ❌ Criar "keyboard traps"
4. ❌ Usar placeholders como labels
5. ❌ Desabilitar zoom
6. ❌ Autoplay de vídeos/áudios

## 📞 Contato

Problemas de acessibilidade? Reportar para:
- **Email**: acessibilidade@oryumaura.gov.br
- **GitHub Issues**: [github.com/OryumAura/issues](https://github.com)

---

**Última atualização**: Novembro 2025
**Versão**: 3.0
**Conformidade**: WCAG 2.1 AA (em certificação)
