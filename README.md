# PersonalAluno - PWA Completo

Uma aplicação web moderna (PWA) para gerenciamento de alunos e exercícios para personal trainers. Funciona offline, pode ser instalada como app nativo e oferece experiência completa de gerenciamento fitness.

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [Vite](https://vitejs.dev/) - Build tool e dev server
- [React](https://react.dev/) - Biblioteca para construção de interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado do JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [shadcn/ui](https://ui.shadcn.com/) - Componentes React reutilizáveis
- [Supabase](https://supabase.com/) - Backend as a Service
- [Stripe](https://stripe.com/) - Processamento de pagamentos
- [React Query](https://tanstack.com/query/latest) - Gerenciamento de estado e cache
- [React Router](https://reactrouter.com/) - Roteamento
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de esquemas
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker e PWA

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/) (v18 ou superior)
- [npm](https://www.npmjs.com/)
- Git
- Conta no [Supabase](https://supabase.com)
- Conta no [Stripe](https://stripe.com) (opcional)

## 🔧 Instalação e Execução

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd PersonalAluno
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais do Supabase e Stripe.

4. Configure o banco de dados Supabase:
- Crie um projeto no [Supabase](https://supabase.com)
- Execute o script SQL em `supabase-schema.sql` no SQL Editor do Supabase
- Copie as credenciais para o arquivo `.env`

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse a aplicação em [http://localhost:8080](http://localhost:8080)

## 📦 Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run build:dev` - Cria a build de desenvolvimento
- `npm run preview` - Visualiza a build localmente

### Qualidade de Código
- `npm run lint` - Executa a verificação de linting
- `npm run type-check` - Verifica tipos TypeScript
- `npm test` - Executa testes unitários
- `npm run test:coverage` - Gera relatório de cobertura de testes

### Utilitários
- `npm run setup` - Configura o ambiente de desenvolvimento
- `npm run generate` - Gera novos componentes/hooks/páginas
- `npm run clean` - Limpa caches e builds

### Exemplos de Uso

Gerando novo componente:
```bash
npm run generate component Button
```

Gerando novo hook:
```bash
npm run generate hook WindowSize
```

Gerando nova página:
```bash
npm run generate page Settings
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
│   ├── ui/        # Componentes base do shadcn/ui
│   ├── layout/    # Componentes de layout (Header, Sidebar, Navigation)
│   ├── InstallPrompt.tsx  # Prompt de instalação PWA
│   ├── ExerciseCard.tsx
│   ├── StudentCard.tsx
│   └── StatCard.tsx
├── contexts/      # Contextos React (Auth, Data)
├── hooks/         # Hooks customizados
│   ├── use-online.ts      # Detecção online/offline
│   ├── use-workouts.ts    # Gerenciamento de treinos
│   └── use-students.ts    # Gerenciamento de alunos
├── lib/           # Utilitários e helpers
│   ├── supabase.ts        # Cliente Supabase
│   ├── query-client.ts    # Configuração React Query
│   ├── storage.ts
│   └── utils.ts
├── pages/         # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── PersonalDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── StudentsPage.tsx
│   ├── ExercisesPage.tsx
│   ├── CreateWorkoutPage.tsx
│   ├── WorkoutModePage.tsx
│   ├── MessagesPage.tsx
│   ├── ProgressPage.tsx
│   ├── ProfilePage.tsx
│   └── SubscriptionPage.tsx
└── types/         # Definições de tipos TypeScript
```

## ✨ Funcionalidades Implementadas

### PWA
- ✅ Service Worker com Workbox
- ✅ Cache offline inteligente
- ✅ Instalação como app nativo
- ✅ Detecção de status online/offline
- ✅ Atualização automática
- ✅ Manifest.json configurado

### Para Personal Trainers
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de alunos
- ✅ Biblioteca de exercícios
- ✅ Criação de treinos personalizados
- ✅ Sistema de mensagens
- ✅ Alertas de alunos inativos
- ✅ Planos de assinatura

### Para Alunos
- ✅ Dashboard personalizado
- ✅ Visualização de treinos
- ✅ Modo de execução de treino
- ✅ Acompanhamento de progresso
- ✅ Gráficos de evolução
- ✅ Sistema de conquistas
- ✅ Chat com personal

### Backend
- ✅ Integração com Supabase
- ✅ Autenticação segura
- ✅ Banco de dados PostgreSQL
- ✅ Row Level Security (RLS)
- ✅ Storage para mídia
- ✅ React Query para cache

### Pagamentos
- ✅ Integração Stripe preparada
- ✅ Página de planos
- ✅ Sistema de assinaturas

## 🛠️ Desenvolvimento

### Estrutura de Componentes

- Os componentes reutilizáveis devem ser criados na pasta `components`
- Componentes específicos de layout ficam em `components/layout`
- Componentes de UI base ficam em `components/ui`

### Páginas

- Cada página deve ser um componente em `pages/`
- Use o sistema de navegação interno para rotas

### Estilização

- Use classes Tailwind CSS para estilização
- Siga as convenções do shadcn/ui para componentes
- Personalizações podem ser feitas em `tailwind.config.ts`

### Boas Práticas

1. **TypeScript**
   - Use tipos apropriados para props e estados
   - Evite usar `any`
   - Defina interfaces/types em arquivos separados

2. **Componentes**
   - Mantenha componentes pequenos e focados
   - Use composição ao invés de herança
   - Implemente tratamento de erros adequado

3. **Estado**
   - Use React Query para chamadas à API
   - Contextos para estado global
   - Estado local quando apropriado

4. **Performance**
   - Implemente memoização quando necessário
   - Otimize renders com useMemo/useCallback
   - Lazy load para componentes pesados

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📱 Instalação como PWA

### Desktop (Chrome/Edge)
1. Acesse a aplicação
2. Clique no ícone de instalação na barra de endereços
3. Ou vá em Menu > Instalar Personal & Aluno

### Mobile (Android/iOS)
1. Acesse a aplicação no navegador
2. Android: Toque em "Adicionar à tela inicial"
3. iOS: Toque em Compartilhar > Adicionar à Tela de Início

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security no banco de dados
- HTTPS obrigatório em produção
- Tokens JWT seguros
- Validação de dados com Zod

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
