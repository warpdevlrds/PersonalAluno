# Guia de Contribuição

Obrigado por considerar contribuir com o PersonalAluno! Este documento fornece diretrizes e padrões para contribuições.

## 🚀 Como Contribuir

### 1. Preparando o Ambiente

1. Faça um fork do repositório
2. Clone seu fork localmente
3. Configure o ambiente de desenvolvimento:
   ```bash
   npm install
   cp .env.example .env
   ```
4. Configure suas variáveis de ambiente

### 2. Desenvolvimento

#### Branches
- `main`: Produção
- `develop`: Desenvolvimento
- `feature/*`: Novas funcionalidades
- `bugfix/*`: Correções de bugs
- `hotfix/*`: Correções urgentes

#### Commits
Utilizamos o padrão Conventional Commits:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

Exemplo:
```bash
git commit -m "feat: adiciona sistema de notificações"
```

### 3. Código

#### Estilo
- Use TypeScript
- Siga o ESLint
- Mantenha a formatação do Prettier
- Documente funções complexas

#### Componentes
- Um componente por arquivo
- Nomes PascalCase
- Props tipadas
- Documentação com JSDoc

Exemplo:
```tsx
interface ButtonProps {
  /** Texto do botão */
  label: string;
  /** Callback de clique */
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}
```

#### Hooks
- Prefixo `use`
- Uma responsabilidade
- Documentação clara
- Tratamento de erros

#### Testes
- Testes unitários para utils
- Testes de componentes
- Testes de integração
- Cobertura mínima: 80%

### 4. Pull Requests

1. Atualize sua branch com a develop
2. Execute os testes
3. Verifique o lint
4. Crie o PR com:
   - Descrição clara
   - Screenshots (se UI)
   - Testes realizados
   - Breaking changes

### 5. Review

- PRs precisam de 1 aprovação
- CI deve passar
- Conflitos resolvidos
- Documentação atualizada

## 🐛 Reportando Bugs

1. Verifique se já existe uma issue
2. Use o template de bug
3. Forneça:
   - Passos para reproduzir
   - Comportamento esperado
   - Comportamento atual
   - Screenshots
   - Ambiente (browser, OS)

## 💡 Sugestões

1. Verifique issues existentes
2. Use o template de feature
3. Descreva:
   - Problema resolvido
   - Solução proposta
   - Alternativas consideradas
   - Screenshots/mockups

## 📝 Documentação

- README atualizado
- Comentários claros
- Exemplos práticos
- Documentação técnica

## ⚖️ Código de Conduta

- Seja respeitoso
- Aceite feedback
- Foco na qualidade
- Ajude outros
- Siga as diretrizes

## 🙏 Agradecimentos

Suas contribuições tornam o projeto melhor!

## ❓ Dúvidas

- Abra uma issue
- Use as discussions
- Entre em contato