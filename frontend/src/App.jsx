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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <>
                      <Dashboard />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/evolucao"
                element={
                  <PrivateRoute>
                    <>
                      <EvolucaoPatrimonial />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/contas"
                element={
                  <PrivateRoute>
                    <>
                      <Contas />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/ativos"
                element={
                  <PrivateRoute>
                    <>
                      <Ativos />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/passivos"
                element={
                  <PrivateRoute>
                    <>
                      <Passivos />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/investimentos"
                element={
                  <PrivateRoute>
                    <>
                      <Investimentos />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/exercicios"
                element={
                  <PrivateRoute>
                    <>
                      <ExercicioList />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/exercicios/:id"
                element={
                  <PrivateRoute>
                    <>
                      <ExercicioForm />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/perfil"
                element={
                  <PrivateRoute>
                    <>
                      <Profile />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              {/* ============================================ */}
              {/* ROTAS DA ENGRENAGEM - CADASTROS/PADRÕES */}
              {/* ============================================ */}

              <Route
                path="/categorias-ativos"
                element={
                  <PrivateRoute>
                    <>
                      <CategoriasAtivo />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/categorias-passivos"
                element={
                  <PrivateRoute>
                    <>
                      <CategoriasPassivo />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/tipos-investimento"
                element={
                  <PrivateRoute>
                    <>
                      <TiposInvestimento />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/produtos-investimento"
                element={
                  <PrivateRoute>
                    <>
                      <ProdutosInvestimento />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/ativos-padrao"
                element={
                  <PrivateRoute>
                    <>
                      <AtivosPadrao />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/passivos-padrao"
                element={
                  <PrivateRoute>
                    <>
                      <PassivosPadrao />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/investimentos-padrao"
                element={
                  <PrivateRoute>
                    <>
                      <InvestimentosPadrao />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              {/* ============================================ */}
              {/* ROTAS DE FERRAMENTAS */}
              {/* ============================================ */}

              <Route
                path="/exportar"
                element={
                  <PrivateRoute>
                    <>
                      <ExportarRelatorios />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/notificacoes"
                element={
                  <PrivateRoute>
                    <>
                      <Notificacoes />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
                }
              />

              <Route
                path="/analises"
                element={
                  <PrivateRoute>
                    <>
                      <AnalisesAvancadas />
                      <BottomNav />
                      <SettingsMenu />
                      <ThemeToggle />
                    </>
                  </PrivateRoute>
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
