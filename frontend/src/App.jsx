import React, { Suspense, lazy } from "react";
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

// Login/Register ficam como import normal (não lazy): são a primeira tela
// que a maioria das visitas vê, então não faz sentido adiar o carregamento
// delas atrás de um Suspense — isso só adicionaria um flash de loading no
// primeiro acesso.
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Todo o resto é lazy-loaded: cada rota vira um chunk JS separado, baixado
// só quando o usuário navega até ela. Antes, todas as ~19 telas (incluindo
// as que usam Recharts, ~110KB gzip) eram carregadas de uma vez só no
// primeiro acesso, mesmo que o usuário só fosse abrir o Dashboard.
const Profile = lazy(() => import("./components/auth/Profile"));

const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const EvolucaoPatrimonial = lazy(
  () => import("./components/evolucao/EvolucaoPatrimonial"),
);
const Contas = lazy(() => import("./components/contas/Contas"));
const Ativos = lazy(() => import("./components/ativos/Ativos"));
const Passivos = lazy(() => import("./components/passivos/Passivos"));
const Investimentos = lazy(
  () => import("./components/investimentos/Investimentos"),
);
const ExercicioList = lazy(
  () => import("./components/exercicios/ExercicioList"),
);
const ExercicioForm = lazy(
  () => import("./components/exercicios/ExercicioForm"),
);

const AtivosPadrao = lazy(() => import("./components/padroes/AtivosPadrao"));
const PassivosPadrao = lazy(
  () => import("./components/padroes/PassivosPadrao"),
);
const InvestimentosPadrao = lazy(
  () => import("./components/padroes/InvestimentosPadrao"),
);
const CategoriasAtivo = lazy(
  () => import("./components/categorias/CategoriasAtivo"),
);
const CategoriasPassivo = lazy(
  () => import("./components/categorias/CategoriasPassivo"),
);
const TiposInvestimento = lazy(
  () => import("./components/categorias/TiposInvestimento"),
);
const ProdutosInvestimento = lazy(
  () => import("./components/categorias/ProdutosInvestimento"),
);

const ExportarRelatorios = lazy(
  () => import("./components/exportar/ExportarRelatorios"),
);
const Notificacoes = lazy(
  () => import("./components/notificacoes/Notificacoes"),
);
const AnalisesAvancadas = lazy(
  () => import("./components/analises/AnalisesAvancadas"),
);

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
  </div>
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

          <Suspense fallback={<PageLoader />}>
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
              <Route
                path="/categorias-ativos"
                element={page(CategoriasAtivo)}
              />
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
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
