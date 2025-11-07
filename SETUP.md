# Guia de Configuração Completo

## 1. Configuração do Supabase

### Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação (2-3 minutos)

### Configurar Banco de Dados
1. No painel do Supabase, vá em "SQL Editor"
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a execução completa

### Obter Credenciais
1. Vá em "Settings" > "API"
2. Copie a "Project URL" → `VITE_SUPABASE_URL`
3. Copie a "anon public" key → `VITE_SUPABASE_ANON_KEY`
4. Cole no arquivo `.env`

### Configurar Storage (Opcional)
1. Vá em "Storage"
2. Crie um bucket chamado "avatars"
3. Crie um bucket chamado "workout-media"
4. Configure as políticas de acesso

## 2. Configuração do Stripe

### Criar Conta
1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta ou faça login
3. Ative o modo de teste

### Obter Chave Pública
1. Vá em "Developers" > "API keys"
2. Copie a "Publishable key" → `VITE_STRIPE_PUBLIC_KEY`
3. Cole no arquivo `.env`

### Criar Produtos (Opcional)
1. Vá em "Products"
2. Crie 3 produtos: Básico, Pro, Premium
3. Configure preços mensais
4. Anote os Price IDs

## 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
VITE_STRIPE_PUBLIC_KEY=pk_test_sua-chave-aqui
```

## 4. Instalação de Dependências

```bash
npm install
```

## 5. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:8080

## 6. Build para Produção

```bash
npm run build
```

Os arquivos estarão em `dist/`

## 7. Deploy

### Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel.

### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

Configure as variáveis de ambiente no painel da Netlify.

## 8. Testar PWA

### Desktop
1. Abra no Chrome/Edge
2. Abra DevTools (F12)
3. Vá em "Application" > "Service Workers"
4. Verifique se está registrado
5. Teste offline desconectando a rede

### Mobile
1. Acesse via HTTPS
2. Adicione à tela inicial
3. Abra como app
4. Teste funcionalidades offline

## 9. Troubleshooting

### Service Worker não registra
- Certifique-se de estar em HTTPS ou localhost
- Limpe o cache do navegador
- Verifique o console por erros

### Supabase não conecta
- Verifique as credenciais no `.env`
- Confirme que o projeto está ativo
- Verifique as políticas RLS

### Build falha
- Limpe node_modules: `rm -rf node_modules && npm install`
- Limpe o cache: `rm -rf dist .vite`
- Verifique versão do Node (v18+)

## 10. Próximos Passos

- [ ] Configurar domínio customizado
- [ ] Adicionar analytics
- [ ] Configurar notificações push
- [ ] Implementar testes automatizados
- [ ] Configurar CI/CD
- [ ] Adicionar monitoramento de erros (Sentry)
