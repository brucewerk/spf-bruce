# SPF - Sistema Planilha Financeira by BruCe

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)

> **Sistema completo de gestão financeira pessoal** - Transforme sua planilha de controle patrimonial em uma aplicação web moderna, responsiva e segura.

## 📊 Sobre o Projeto

O **SPF - Sistema Planilha Financeira** é uma aplicação full-stack desenvolvida para substituir planilhas de controle financeiro, oferecendo uma experiência moderna, mobile-first e com recursos avançados de visualização e análise.

### 🎯 Motivação

Este projeto nasceu da necessidade de transformar uma planilha Excel complexa em um sistema web robusto, permitindo:

- 📱 Acesso mobile com interface responsiva
- 🔒 Controle de múltiplos usuários com autenticação segura
- 📊 Visualizações interativas com gráficos dinâmicos
- 📈 Análises avançadas e projeções
- 📄 Exportação de relatórios em PDF e Excel

## ✨ Funcionalidades

### 🏠 Dashboard

- Cards com indicadores financeiros (Ativos, Passivos, Variação)
- Gráfico de evolução patrimonial com legendas interativas
- Gráfico de comparação Ativos vs Passivos
- Composição de ativos por categoria

### 📅 Exercícios Financeiros

- Criação de exercícios mensais/anuais
- Carregamento automático de ativos, passivos e investimentos padrão
- Edição completa de valores
- Cópia de valores do mês anterior
- Visualização de evolução mensal

### 📊 Gestão de Dados

- **Ativos**: Cadastro e visualização com gráficos por categoria
- **Passivos**: Controle de despesas com indicadores de pagamento
- **Investimentos**: Carteira completa com rendimentos
- **Contas Bancárias**: Saldos e informações de contas

### ⚙️ Configurações (Menu Engrenagem)

- **Categorias**: Ativos, Despesas, Tipos e Produtos de Investimento
- **Padrões**: Configurações que carregam automaticamente nos novos exercícios
  - Ativos Padrão
  - Despesas Padrão
  - Investimentos Padrão

### 📈 Análises e Relatórios

- **Evolução Patrimonial**: Visualização acumulada com tabela detalhada
- **Análises Avançadas**: Métricas de crescimento, eficiência e projeções
- **Exportação**: Relatórios em PDF e Excel
- **Notificações**: Alertas inteligentes sobre sua situação financeira

## 🛠️ Tecnologias

### Frontend

- **React 18** com Vite
- **Tailwind CSS** com suporte a tema claro/escuro
- **Recharts** para gráficos interativos
- **React Router DOM** para navegação
- **Lucide React** para ícones
- **React Hot Toast** para notificações

### Backend

- **Node.js** com Express
- **MongoDB Atlas** com Mongoose
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **PDFMake** e **ExcelJS** para geração de relatórios

### Infraestrutura

- **Vercel** para deploy do frontend
- **Render** para deploy do backend
- **GitHub** para controle de versão

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- MongoDB Atlas (ou local)
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/brucewerk/spf-bruce.git
cd spf-bruce

# Instale as dependências do backend
cd backend
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite com suas credenciais do MongoDB

# Instale as dependências do frontend
cd ../frontend
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite com a URL da API
```
