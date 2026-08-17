import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      const response = await api.get("/reports/notificacoes");
      setNotificacoes(response.data);
    } catch (error) {
      toast.error("Erro ao carregar notificações");
    } finally {
      setLoading(false);
    }
  };

  const marcarLida = async (id) => {
    try {
      await api.put(`/reports/notificacoes/${id}`);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n)),
      );
      toast.success("Notificação marcada como lida");
    } catch (error) {
      toast.error("Erro ao marcar notificação");
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case "danger":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getCorBg = (tipo) => {
    switch (tipo) {
      case "danger":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notificações
          {notificacoes.filter((n) => !n.lida).length > 0 && (
            <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
              {notificacoes.filter((n) => !n.lida).length}
            </span>
          )}
        </h1>
        <button
          onClick={carregarNotificacoes}
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Atualizar
        </button>
      </div>

      {notificacoes.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Tudo em ordem!
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Nenhuma notificação no momento
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((notif) => (
            <div
              key={notif.id}
              className={`card border-l-4 ${getCorBg(notif.tipo)} ${notif.lida ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getIcon(notif.tipo)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {notif.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notif.mensagem}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.data).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {!notif.lida && (
                      <button
                        onClick={() => marcarLida(notif.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        title="Marcar como lida"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notificacoes;
