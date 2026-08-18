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
import BottomNav from "./components/common/BottomNav";
import ThemeToggle from "./components/common/ThemeToggle";
import SettingsMenu from "./components/common/SettingsMenu";

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

// 🔥 CRIAÇÃO DE UM LAYOUT SEGURO PARA EVITAR REPETIÇÃO DE CÓDIGO
const PrivateLayout = ({ children }) => {
  return (
    <PrivateRoute>
      <div className="fixed-bottom-nav-safe-area">
        {children}
        <BottomNav />
        <SettingsMenu />
        <ThemeToggle />
      </div>
    </PrivateRoute>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-x-hidden">
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
              {/* Rotas públicas (sem menu, sem layout fixo) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ============================================ */}
              {/* ROTAS PROTEGIDAS (TODAS COM O MESMO LAYOUT SEGURO) */}
              {/* ============================================ */}
              <Route
                path="/"
                element={
                  <PrivateLayout>
                    <Dashboard />
                  </PrivateLayout>
                }
              />
              <Route
                path="/evolucao"
                element={
                  <PrivateLayout>
                    <EvolucaoPatrimonial />
                  </PrivateLayout>
                }
              />
              <Route
                path="/contas"
                element={
                  <PrivateLayout>
                    <Contas />
                  </PrivateLayout>
                }
              />
              <Route
                path="/ativos"
                element={
                  <PrivateLayout>
                    <Ativos />
                  </PrivateLayout>
                }
              />
              <Route
                path="/passivos"
                element={
                  <PrivateLayout>
                    <Passivos />
                  </PrivateLayout>
                }
              />
              <Route
                path="/investimentos"
                element={
                  <PrivateLayout>
                    <Investimentos />
                  </PrivateLayout>
                }
              />
              <Route
                path="/exercicios"
                element={
                  <PrivateLayout>
                    <ExercicioList />
                  </PrivateLayout>
                }
              />
              <Route
                path="/exercicios/:id"
                element={
                  <PrivateLayout>
                    <ExercicioForm />
                  </PrivateLayout>
                }
              />
              <Route
                path="/perfil"
                element={
                  <PrivateLayout>
                    <Profile />
                  </PrivateLayout>
                }
              />
              <Route
                path="/categorias-ativos"
                element={
                  <PrivateLayout>
                    <CategoriasAtivo />
                  </PrivateLayout>
                }
              />
              <Route
                path="/categorias-passivos"
                element={
                  <PrivateLayout>
                    <CategoriasPassivo />
                  </PrivateLayout>
                }
              />
              <Route
                path="/tipos-investimento"
                element={
                  <PrivateLayout>
                    <TiposInvestimento />
                  </PrivateLayout>
                }
              />
              <Route
                path="/produtos-investimento"
                element={
                  <PrivateLayout>
                    <ProdutosInvestimento />
                  </PrivateLayout>
                }
              />
              <Route
                path="/ativos-padrao"
                element={
                  <PrivateLayout>
                    <AtivosPadrao />
                  </PrivateLayout>
                }
              />
              <Route
                path="/passivos-padrao"
                element={
                  <PrivateLayout>
                    <PassivosPadrao />
                  </PrivateLayout>
                }
              />
              <Route
                path="/investimentos-padrao"
                element={
                  <PrivateLayout>
                    <InvestimentosPadrao />
                  </PrivateLayout>
                }
              />
              <Route
                path="/exportar"
                element={
                  <PrivateLayout>
                    <ExportarRelatorios />
                  </PrivateLayout>
                }
              />
              <Route
                path="/notificacoes"
                element={
                  <PrivateLayout>
                    <Notificacoes />
                  </PrivateLayout>
                }
              />
              <Route
                path="/analises"
                element={
                  <PrivateLayout>
                    <AnalisesAvancadas />
                  </PrivateLayout>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
