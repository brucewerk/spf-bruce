import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Calendar,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatarMoeda } from "../../utils/format";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

const AnalisesAvancadas = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  useEffect(() => {
    carregarAnalises();
  }, []);

  const carregarAnalises = async () => {
    try {
      const response = await api.get("/reports/analises");
      setDados(response.data);
    } catch (error) {
      toast.error("Erro ao carregar análises");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-500">
            Nenhum dado disponível para análise
          </p>
        </div>
      </div>
    );
  }

  const crescimentoData =
    dados.crescimento?.map((item) => ({
      periodo: item.periodo,
      patrimonio: item.patrimonio,
      variacao: item.variacao,
    })) || [];

  const investimentosPorTipo = Object.entries(
    dados.analiseInvestimentos?.porTipo || {},
  ).map(([nome, data]) => ({
    name: nome,
    value: data.total,
  }));

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold">📊 Análises Avançadas</h1>
        <button
          onClick={carregarAnalises}
          className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
        <div className="card bg-primary-50 dark:bg-primary-900/20 p-2 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            Total Exercícios
          </p>
          <p className="text-sm sm:text-xl font-bold text-primary-600 dark:text-primary-400">
            {dados.resumo?.totalExercicios || 0}
          </p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 p-2 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            Investimentos
          </p>
          <p className="text-sm sm:text-xl font-bold text-green-600 dark:text-green-400">
            {dados.resumo?.totalInvestimentos || 0}
          </p>
        </div>
        <div className="card bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            Contas
          </p>
          <p className="text-sm sm:text-xl font-bold text-blue-600 dark:text-blue-400">
            {dados.resumo?.totalContas || 0}
          </p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3">
          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
            Período
          </p>
          <p className="text-[10px] sm:text-sm font-bold text-purple-600 dark:text-purple-400 truncate">
            {dados.resumo?.primeiroRegistro || "-"} →{" "}
            {dados.resumo?.ultimoRegistro || "-"}
          </p>
        </div>
      </div>

      {crescimentoData.length > 0 && (
        <div className="card mb-3 sm:mb-6 p-2 sm:p-4">
          <h2 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-4">
            Evolução Patrimonial
          </h2>
          <div className="h-44 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crescimentoData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="periodo"
                  stroke="#6b7280"
                  fontSize={9}
                  tick={{ fontSize: 8 }}
                />
                <YAxis stroke="#6b7280" fontSize={9} />
                <Tooltip formatter={(value) => formatarMoeda(value)} />
                <Legend wrapperStyle={{ fontSize: "9px" }} />
                <Line
                  type="monotone"
                  dataKey="patrimonio"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Patrimônio"
                />
                <Line
                  type="monotone"
                  dataKey="variacao"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Variação"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {dados.eficiencia && (
        <div className="grid grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
          <div className="card p-2 sm:p-4">
            <h2 className="text-[8px] sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 sm:mb-3">
              📈 Melhor Mês
            </h2>
            {dados.eficiencia.melhorMes ? (
              <>
                <p className="text-xs sm:text-xl font-bold text-green-600 dark:text-green-400 truncate">
                  {formatarMoeda(dados.eficiencia.melhorMes.patrimonio)}
                </p>
                <p className="text-[8px] sm:text-sm text-gray-500">
                  {dados.eficiencia.melhorMes.mes}
                </p>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Nenhum dado</p>
            )}
          </div>
          <div className="card p-2 sm:p-4">
            <h2 className="text-[8px] sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 sm:mb-3">
              📉 Pior Mês
            </h2>
            {dados.eficiencia.piorMes ? (
              <>
                <p className="text-xs sm:text-xl font-bold text-red-600 dark:text-red-400 truncate">
                  {formatarMoeda(dados.eficiencia.piorMes.patrimonio)}
                </p>
                <p className="text-[8px] sm:text-sm text-gray-500">
                  {dados.eficiencia.piorMes.mes}
                </p>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Nenhum dado</p>
            )}
          </div>
        </div>
      )}

      {investimentosPorTipo.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-6">
          <div className="card p-2 sm:p-4">
            <h2 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-4">
              Distribuição
            </h2>
            <div className="h-44 sm:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={investimentosPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={55}
                    innerRadius={20}
                    fill="#8884d8"
                    dataKey="value"
                    fontSize={8}
                  >
                    {investimentosPorTipo.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatarMoeda(value)} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-2 sm:p-4">
            <h2 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-4">
              Resumo
            </h2>
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[8px] sm:text-sm text-gray-500 dark:text-gray-400">
                  Total Investido
                </span>
                <span className="text-[10px] sm:text-base font-medium truncate">
                  {formatarMoeda(dados.analiseInvestimentos?.totalInvestido)}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[8px] sm:text-sm text-gray-500 dark:text-gray-400">
                  Saldo Total
                </span>
                <span className="text-[10px] sm:text-base font-medium text-green-600 truncate">
                  {formatarMoeda(dados.analiseInvestimentos?.saldoTotal)}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[8px] sm:text-sm text-gray-500 dark:text-gray-400">
                  Rendimento
                </span>
                <span
                  className={`text-[10px] sm:text-base font-medium truncate ${(dados.analiseInvestimentos?.rendimentoTotal || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatarMoeda(dados.analiseInvestimentos?.rendimentoTotal)}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[8px] sm:text-sm text-gray-500 dark:text-gray-400">
                  Quantidade
                </span>
                <span className="text-[10px] sm:text-base font-medium">
                  {dados.analiseInvestimentos?.quantidade || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {dados.projecao && (
        <div className="card p-2 sm:p-4">
          <h2 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-4">
            🔮 Projeção Anual
          </h2>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
            <div className="text-center">
              <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                Média Mensal
              </p>
              <p className="text-xs sm:text-xl font-bold text-primary-600 truncate">
                {formatarMoeda(dados.projecao.mediaPatrimonio)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                Projeção Anual
              </p>
              <p className="text-xs sm:text-xl font-bold text-green-600 truncate">
                {formatarMoeda(dados.projecao.projecaoAnual)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                Base
              </p>
              <p className="text-xs sm:text-xl font-bold text-gray-600">
                {dados.projecao.baseMeses} meses
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalisesAvancadas;
