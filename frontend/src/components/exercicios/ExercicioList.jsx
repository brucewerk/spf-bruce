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
  const { data: exercicios, loading, refetch } = useFetch("/exercicios");
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = exercicios
    ? [...new Set(exercicios.map((e) => e.year))].sort((a, b) => b - a)
    : [];

  const filteredExercicios =
    exercicios?.filter((e) => e.year === selectedYear) || [];

  // Ordenar todos os exercícios por data
  const todosExerciciosOrdenados = exercicios
    ? [...exercicios].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
    : [];

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
  const mesesExtenso = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Pegar o primeiro e último exercício
  const primeiroExercicio =
    todosExerciciosOrdenados.length > 0 ? todosExerciciosOrdenados[0] : null;
  const ultimoExercicio =
    todosExerciciosOrdenados.length > 0
      ? todosExerciciosOrdenados[todosExerciciosOrdenados.length - 1]
      : null;

  // Formatar período
  const getPeriodo = () => {
    if (!primeiroExercicio || !ultimoExercicio) return "";
    const inicio = `${mesesExtenso[primeiroExercicio.month - 1]} ${primeiroExercicio.year}`;
    const fim = `${mesesExtenso[ultimoExercicio.month - 1]} ${ultimoExercicio.year}`;
    return `${inicio} a ${fim}`;
  };

  // Calcular o total de passivos acumulado (soma de TODOS os passivos de todos os exercícios)
  const totalPassivosAcumulado =
    exercicios?.reduce((acc, e) => {
      const totalPassivosMes =
        e.passivos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;
      return acc + totalPassivosMes;
    }, 0) || 0;

  // Calcular o lucro/prejuízo acumulado (soma de todas as variações)
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

  // Totais mais atuais
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

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          📅 Exercícios Acumulados
          {primeiroExercicio && ultimoExercicio && (
            <span className="text-lg font-normal text-gray-500 block sm:inline">
              {" "}
              - {getPeriodo()}
            </span>
          )}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo
        </button>
      </div>

      {/* Cards com totais mais atuais, passivos acumulados e lucro/prejuízo */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="card bg-primary-50 dark:bg-primary-900/20 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ativos (Atual)
          </p>
          <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
            {formatarMoeda(totalAtivosMaisAtual)}
          </p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Passivos (Acumulado)
          </p>
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            {formatarMoeda(totalPassivosAcumulado)}
          </p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {lucroPrejuizoAcumulado >= 0
              ? "📈 Lucro Acumulado"
              : "📉 Prejuízo Acumulado"}
          </p>
          <p
            className={`text-sm font-bold ${
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

      {/* Filtro por ano */}
      {years.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
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

      {/* Lista de exercícios */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredExercicios.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Nenhum exercício encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Clique em "Novo" para criar seu primeiro exercício
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
            Serão carregados automaticamente seus ativos, despesas e
            investimentos padrão
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExercicios
            .sort((a, b) => a.month - b.month)
            .map((exercicio) => {
              const patrimonio =
                (exercicio.totalAtivos || 0) - (exercicio.totalPassivos || 0);

              return (
                <div
                  key={exercicio._id}
                  className="card hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">
                          {meses[exercicio.month - 1]} {exercicio.year}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            patrimonio >= 0
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {patrimonio >= 0 ? (
                            <span className="flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />
                              Positivo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ArrowDown className="w-3 h-3" />
                              Negativo
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {exercicio.ativos?.length || 0} ativos
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Ativos:
                          </span>
                          <span className="ml-1 font-medium text-primary-600 dark:text-primary-400">
                            {formatarMoeda(exercicio.totalAtivos || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Passivos:
                          </span>
                          <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                            {formatarMoeda(exercicio.totalPassivos || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => navigate(`/exercicios/${exercicio._id}`)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCopy(exercicio._id)}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Copiar do mês anterior"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exercicio._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

      <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
        💡 Cadastre ativos, despesas e investimentos padrão em Configurações
        (⚙️) para criar exercícios automaticamente
      </div>
    </div>
  );
};

export default ExercicioList;
