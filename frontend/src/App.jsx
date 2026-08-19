import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Layout from "./components/common/Layout";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/auth/Profile";

// Main Pages (Footer - Dados/Resumos)
import Dashboard from "./components/dashboard/Dashboard";
import EvolucaoPatrimonial from "./components/evolucao/EvolucaoPatrimonial";
import Contas from "./components/contas/Contas";
import Ativos from "./components/ativos/Ativos";
import Passivos from "./components/passivos/Passivos";
import Investimentos from "./components/investimentos/Investimentos";
import ExercicioList from "./components/exercicios/ExercicioList";
import ExercicioForm from "./components/exercicios/ExercicioForm";

// Configurações (Engrenagem - Cadastros/Padrões)
import AtivosPadrao from "./components/padroes/AtivosPadrao";
import PassivosPadrao from "./components/padroes/PassivosPadrao";
import InvestimentosPadrao from "./components/padroes/InvestimentosPadrao";
import CategoriasAtivo from "./components/categorias/CategoriasAtivo";
import CategoriasPassivo from "./components/categorias/CategoriasPassivo";
import TiposInvestimento from "./components/categorias/TiposInvestimento";
import ProdutosInvestimento from "./components/categorias/ProdutosInvestimento";

// Ferramentas
import ExportarRelatorios from "./components/exportar/ExportarRelatorios";
import Notificacoes from "./components/notificacoes/Notificacoes";
import AnalisesAvancadas from "./components/analises/AnalisesAvancadas";

// Cada rota autenticada segue o mesmo padrão: PrivateRoute > Layout > Página.
// Antes esse bloco de 6 linhas era copiado manualmente em cada uma das ~19
// rotas (ver histórico do git); esse helper elimina a duplicação e garante
// que toda página nova já nasça com o BottomNav/Layout corretos.
const page = (Component) => (
  <PrivateRoute>
    <Layout>
      <Component />
    </Layout>
  </PrivateRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* 🔥 ADIÇÃO DAS FUTURE FLAGS PARA ELIMINAR O AVISO DO CONSOLE */}
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />

          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ============================================ */}
            {/* ROTAS DO FOOTER - DADOS E RESUMOS */}
            {/* ============================================ */}
            <Route path="/" element={page(Dashboard)} />
            <Route path="/evolucao" element={page(EvolucaoPatrimonial)} />
            <Route path="/contas" element={page(Contas)} />
            <Route path="/ativos" element={page(Ativos)} />
            <Route path="/passivos" element={page(Passivos)} />
            <Route path="/investimentos" element={page(Investimentos)} />
            <Route path="/exercicios" element={page(ExercicioList)} />
            <Route path="/exercicios/:id" element={page(ExercicioForm)} />
            <Route path="/perfil" element={page(Profile)} />

            {/* ============================================ */}
            {/* ROTAS DA ENGRENAGEM - CADASTROS/PADRÕES */}
            {/* ============================================ */}
            <Route path="/categorias-ativos" element={page(CategoriasAtivo)} />
            <Route
              path="/categorias-passivos"
              element={page(CategoriasPassivo)}
            />
            <Route
              path="/tipos-investimento"
              element={page(TiposInvestimento)}
            />
            <Route
              path="/produtos-investimento"
              element={page(ProdutosInvestimento)}
            />
            <Route path="/ativos-padrao" element={page(AtivosPadrao)} />
            <Route path="/passivos-padrao" element={page(PassivosPadrao)} />
            <Route
              path="/investimentos-padrao"
              element={page(InvestimentosPadrao)}
            />

            {/* ============================================ */}
            {/* ROTAS DE FERRAMENTAS */}
            {/* ============================================ */}
            <Route path="/exportar" element={page(ExportarRelatorios)} />
            <Route path="/notificacoes" element={page(Notificacoes)} />
            <Route path="/analises" element={page(AnalisesAvancadas)} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
