import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Sem isso, um erro de render em qualquer componente (ex.: dado inesperado
// vindo da API) derrubava a árvore inteira do React e deixava a tela em
// branco, sem nenhuma pista pro usuário do que aconteceu.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Erro não tratado na interface:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="card max-w-md w-full text-center p-6">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h1 className="text-lg font-semibold mb-2">
              Algo deu errado
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Ocorreu um erro inesperado nesta tela. Seus dados salvos não
              foram afetados.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Voltar ao início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
