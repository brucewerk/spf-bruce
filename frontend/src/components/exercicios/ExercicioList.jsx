import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import NovoExercicioModal from "./NovoExercicioModal";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatarMoeda } from "../../utils/format";

const ExercicioList = () => {
  const navigate = useNavigate();
  const { data: exercicios, loading, refetch } = useFetch(
    "/exercicios?resumo=true",
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = exercicios
    ? [...new Set(exercicios.map((e) => e.year))].sort((a, b) => b - a)
    : [];

  const filteredExercicios =
    exercicios?.filter((e) => e.year === selectedYear) || [];

  const todosExerciciosOrdenados = exercicios
    ? [...exercicios].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
    : [];

  const ultimoExercicio =
    todosExerciciosOrdenados.length > 0
      ? todosExerciciosOrdenados[todosExerciciosOrdenados.length - 1]
      : null;

  const totalPassivosAcumulado =
    exercicios?.reduce((acc, e) => acc + (e.totalPassivos || 0), 0) || 0;

  let lucroPrejuizoAcumulado = 0;
  let patrimonioAnterior = 0;

  todosExerciciosOrdenados.forEach((exercicio, index) => {
    const patrimonioAtualMes =
      (exercicio.totalAtivos || 0) - (exercicio.totalPassivos || 0);
    if (index === 0) {
      lucroPrejuizoAcumulado += 0;
    } else {
      lucroPrejuizoAcumulado += patrimonioAtualMes - patrimonioAnterior;
    }
    patrimonioAnterior = patrimonioAtualMes;
  });

  const totalAtivosMaisAtual = ultimoExercicio?.totalAtivos || 0;

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este exercício?")) {
      try {
        await api.delete(`/exercicios/${id}`);
        toast.success("Exercício excluído com sucesso!");
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao excluir exercício");
      }
    }
  };

  const handleCopy = async (id) => {
    try {
      const response = await api.post(`/exercicios/${id}/copiar`);
      if (response.data.success) {
        toast.success("Valores copiados do mês anterior!");
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao copiar valores");
    }
  };

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold">📅 Exercícios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
        >
          <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
          <span>Novo</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <div className="card bg-primary-50 dark:bg-primary-900/20 p-1.5 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            Ativos (Atual)
          </p>
          <p className="text-[10px] sm:text-sm font-bold text-primary-600 dark:text-primary-400 truncate">
            {formatarMoeda(totalAtivosMaisAtual)}
          </p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 p-1.5 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            Passivos (Acum.)
          </p>
          <p className="text-[10px] sm:text-sm font-bold text-red-600 dark:text-red-400 truncate">
            {formatarMoeda(totalPassivosAcumulado)}
          </p>
        </div>
        <div className="card p-1.5 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            {lucroPrejuizoAcumulado >= 0 ? "📈 Lucro" : "📉 Prejuízo"}
          </p>
          <p
            className={`text-[10px] sm:text-sm font-bold truncate ${
              lucroPrejuizoAcumulado >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {lucroPrejuizoAcumulado >= 0 ? "+" : ""}
            {formatarMoeda(lucroPrejuizoAcumulado)}
          </p>
        </div>
      </div>

      {years.length > 0 && (
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
                selectedYear === year
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredExercicios.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
            Nenhum exercício encontrado
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1 sm:mt-2">
            Clique em "Novo" para criar seu primeiro exercício
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredExercicios
            .sort((a, b) => a.month - b.month)
            .map((exercicio) => {
              const patrimonio =
                (exercicio.totalAtivos || 0) - (exercicio.totalPassivos || 0);

              return (
                <div
                  key={exercicio._id}
                  className="card hover:shadow-lg transition-all duration-200 p-2 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-lg font-semibold">
                          {meses[exercicio.month - 1]} {exercicio.year}
                        </h3>
                        <span
                          className={`text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                            patrimonio >= 0
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {patrimonio >= 0 ? (
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">Positivo</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <ArrowDown className="w-2 h-2 sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">Negativo</span>
                            </span>
                          )}
                        </span>
                        <span className="text-[8px] sm:text-xs text-gray-400">
                          {exercicio.qtdAtivos ?? exercicio.ativos?.length ?? 0}{" "}
                          ativos
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm">
                        <div className="truncate">
                          <span className="text-gray-500 dark:text-gray-400">
                            Ativos:
                          </span>
                          <span className="ml-0.5 sm:ml-1 font-medium text-primary-600 dark:text-primary-400">
                            {formatarMoeda(exercicio.totalAtivos || 0)}
                          </span>
                        </div>
                        <div className="truncate">
                          <span className="text-gray-500 dark:text-gray-400">
                            Passivos:
                          </span>
                          <span className="ml-0.5 sm:ml-1 font-medium text-red-600 dark:text-red-400">
                            {formatarMoeda(exercicio.totalPassivos || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/exercicios/${exercicio._id}`)}
                        className="p-1 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleCopy(exercicio._id)}
                        className="p-1 sm:p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Copiar do mês anterior"
                      >
                        <Copy className="w-3 h-3 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exercicio._id)}
                        className="p-1 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-1 sm:mt-2 h-1 sm:h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        patrimonio >= 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((Math.abs(patrimonio) / (exercicio.totalAtivos || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <NovoExercicioModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refetch();
        }}
        existingYears={years}
      />

      <div className="mt-3 sm:mt-4 text-center text-[8px] sm:text-xs text-gray-400 dark:text-gray-600">
        💡 Cadastre ativos, despesas e investimentos padrão em Configurações
        (⚙️) para criar exercícios automaticamente
      </div>
    </div>
  );
};

export default ExercicioList;
