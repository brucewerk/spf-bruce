# SPF - Sistema Planilha Financeira by BruCe

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-blue)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-green)](https://render.com)

</div>

> **Sistema completo de gestão financeira pessoal** - Transforme sua planilha de controle patrimonial em uma aplicação web moderna, responsiva e segura.

## 📊 Sobre o Projeto

O **SPF - Sistema Planilha Financeira** é uma aplicação full-stack desenvolvida para substituir planilhas de controle financeiro, oferecendo uma experiência moderna, mobile-first e com recursos avançados de visualização e análise de dados.

### 🎯 Motivação

Este projeto nasceu da necessidade de transformar uma planilha Excel complexa em um sistema web robusto, permitindo:

- 📱 Acesso mobile com interface responsiva (mobile-first)
- 🔒 Controle de múltiplos usuários com autenticação segura via JWT
- 📊 Visualizações interativas com gráficos dinâmicos (Recharts)
- 📈 Análises avançadas e projeções de patrimônio
- 📄 Exportação de relatórios em PDF e Excel

## ✨ Funcionalidades

### 🏠 Dashboard Central

- Cards com indicadores financeiros (Ativos, Passivos, Variação acumulada)
- Gráfico de evolução patrimonial com legendas interativas
- Gráfico de comparação Ativos vs Passivos
- Gráfico de composição de ativos por categoria (Pizza)

### 📅 Exercícios Financeiros

- Criação de exercícios mensais/anuais
- Carregamento automático de ativos, passivos e investimentos padrão
- Edição completa de valores em tempo real
- Cópia de valores do mês anterior (agiliza o lançamento)
- Visualização de evolução mensal com barra de progresso

### 📊 Gestão de Dados

- **Ativos**: Cadastro e visualização com gráficos por categoria
- **Passivos**: Controle de despesas com indicadores de pagamento e médias
- **Investimentos**: Carteira completa com cálculo de rendimento e IR
- **Contas Bancárias**: Saldos e informações de contas (integração com ativos)

### ⚙️ Configurações (Menu Engrenagem)

- **Categorias**: Ativos, Despesas, Tipos e Produtos de Investimento
- **Padrões**: Configurações que carregam automaticamente nos novos exercícios
  - Ativos Padrão
  - Despesas Padrão
  - Investimentos Padrão

### 📈 Análises e Relatórios

- **Evolução Patrimonial**: Visualização acumulada com tabela detalhada
- **Análises Avançadas**: Métricas de crescimento, eficiência e projeções anuais
- **Exportação**: Relatórios consolidados em PDF e Excel
- **Notificações**: Alertas inteligentes sobre sua situação financeira

## 🛠️ Tecnologias

### Frontend

- [React 18](https://reactjs.org/) com [Vite](https://vitejs.dev/) para build rápido
- [Tailwind CSS](https://tailwindcss.com/) com suporte a tema claro/escuro (Dark Mode)
- [Recharts](https://recharts.org/) para gráficos interativos
- [React Router DOM](https://reactrouter.com/) para navegação SPA
- [Lucide React](https://lucide.dev/) para ícones modernos
- [React Hot Toast](https://react-hot-toast.com/) para notificações
- [Axios](https://axios-http.com/) para requisições HTTP

### Backend

- [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) com [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) para autenticação segura
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) para hash de senhas
- [PDFMake](https://pdfmake.org/) e [ExcelJS](https://github.com/exceljs/exceljs) para geração de relatórios
- [Helmet](https://helmetjs.github.io/) e [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) para segurança

### Infraestrutura

- **Vercel** para deploy do Frontend
- **Render** para deploy do Backend
- **GitHub Actions** para CI/CD e testes automatizados

## 📂 Estrutura do Projeto

```text
spf-bruce/
├── backend/                     # API Node.js + Express
│   ├── api/                     # Função Serverless para Vercel
│   │   └── index.js
│   ├── src/                     # Código fonte do backend
│   │   ├── config/
│   │   │   ├── cors.js
│   │   │   ├── database.js
│   │   │   └── monitoring.js
│   │   ├── controllers/         # Lógica de negócio
│   │   ├── middleware/          # Autenticação, RateLimit, Validação
│   │   ├── models/              # Schemas do MongoDB
│   │   └── routes/              # Definição das rotas da API
│   ├── tests/                   # Testes automatizados (Jest)
│   ├── .env                     # Variáveis de ambiente (MongoDB, JWT)
│   ├── .env.example             # Modelo de variáveis de ambiente
│   ├── package.json
│   └── vercel.json              # Configuração de deploy do backend
│
├── frontend/                    # Aplicação React + Vite
│   ├── public/                  # Ícones e arquivos estáticos
│   │   ├── favicon.ico
│   │   └── favicon.png
│   ├── src/
│   │   ├── components/          # Componentes React (Divididos por módulo)
│   │   │   ├── analises/
│   │   │   ├── ativos/
│   │   │   ├── auth/
│   │   │   ├── categorias/
│   │   │   ├── common/
│   │   │   ├── contas/
│   │   │   ├── dashboard/
│   │   │   ├── evolucao/
│   │   │   ├── exercicios/
│   │   │   ├── exportar/
│   │   │   ├── investimentos/
│   │   │   ├── notificacoes/
│   │   │   ├── padroes/
│   │   │   └── passivos/
│   │   ├── config/              # Configurações (monitoring.js)
│   │   ├── context/             # AuthContext e ThemeContext
│   │   ├── hooks/               # useFetch.js
│   │   ├── services/            # api.js (Axios config)
│   │   ├── utils/               # format.js (formatação de moeda)
│   │   ├── App.jsx              # Componente raiz e rotas
│   │   ├── index.css            # Estilos Tailwind
│   │   └── main.jsx             # Ponto de entrada do React
│   ├── .env                     # Variáveis de ambiente (URL da API)
│   ├── .env.production          # URL da API para produção
│   ├── package.json
│   └── vercel.json              # Configuração de deploy do frontend
│
├── .github/workflows/           # CI/CD (GitHub Actions)
│   └── ci.yml
├── .gitignore                   # Gitignore Global
└── vercel.json                  # Configuração raiz (Monorepo Vercel)
```

==========================================

🚀 Começando
Pré-requisitos
Node.js 18+

MongoDB Atlas (ou instância local do MongoDB)

Git

Instalação e Configuração
bash

### 1. Clone o repositório:

```text
git clone https://github.com/brucewerk/spf-bruce.git
cd spf-bruce
```

### 2. Configure o Backend:

```text
cd backend
npm install
```

### \*Edite o arquivo .env (Crie a partir do .env.example se necessário)

```text
cp .env.example .env
```

### \*Preencha suas credenciais do MongoDB e a chave JWT

### 3. Configure o Frontend:

```text
cd ../frontend
npm install
```

### \*O arquivo .env já existe, verifique se a URL da API está correta:

```text
Ex: VITE_API_URL=http://localhost:5000/api
```

### 4. Rodando Localmente:

### \*Terminal 1 (Backend - porta 5000):

```text
cd backend
npm start
```

### \*ou "npm run dev" para desenvolvimento com nodemon:

### Terminal 2 (Frontend - porta 5173):

```text
cd frontend
npm run dev
```

==========================================

Acesse http://localhost:5173 no seu navegador.

📦 Scripts Disponíveis:

. Backend (backend/package.json):

- npm start -> Inicia o servidor em produção
- npm run dev -> Inicia o servidor com nodemon (hot reload)
- npm test -> Roda a suíte de testes com Jest
- npm run vercel-build -> Comando de build para a Vercel

. Frontend (frontend/package.json):

- npm run dev -> Inicia o servidor de desenvolvimento do Vite
- npm run build -> Gera a build de produção na pasta dist
- npm run preview -> Pré-visualiza a build localmente
- npm run vercel-build -> Comando de build para a Vercel

==========================================

🗺️ Roadmap (Próximas Melhorias)

- Implementação de gráficos de projeção de longo prazo
- Módulo de Orçamento Mensal (Planejamento de gastos)
- Integração com APIs bancárias (Open Finance)
- Notificações push e por e-mail
- Modo offline (PWA)

==========================================

🤝 Como Contribuir:

- Faça um fork do projeto
- Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
- Faça suas alterações e commit (git commit -m 'Add some AmazingFeature')
- Faça o push para a branch (git push origin feature/AmazingFeature)
- Abra um Pull Request

==========================================

📄 Licença:
Distribuído sob a licença MIT.
Veja o arquivo LICENSE para mais informações.

Desenvolvido por BruCe (2026) - Transformando planilhas em sistemas web robustos.

==========================================
