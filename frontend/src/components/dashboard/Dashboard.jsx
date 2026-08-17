import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: exercicios, refetch } = useFetch("/exercicios");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearData, setYearData] = useState([]);
  const [summary, setSummary] = useState({
    totalAtivos: 0,
    totalPassivosAcumulado: 0,
    variacaoAcumulada: 0,
  });

  const [activeLines, setActiveLines] = useState({
    ativos: true,
    passivos: true,
    variacao: true,
  });

  const [activeBarDataKeys, setActiveBarDataKeys] = useState({
    ativos: true,
    passivos: true,
  });

  const [hiddenPieSlices, setHiddenPieSlices] = useState({});

  useEffect(() => {
    if (exercicios && exercicios.length > 0) {
      // Filtrar exercícios do ano selecionado
      const filtered = exercicios
        .filter((e) => e.year === selectedYear)
        .sort((a, b) => a.month - b.month);

      // Buscar o mês anterior (último mês do ano anterior)
      const anoAnterior = selectedYear - 1;
      const mesAnterior = exercicios
        .filter((e) => e.year === anoAnterior)
        .sort((a, b) => a.month - b.month);
      const ultimoMesAnterior =
        mesAnterior.length > 0 ? mesAnterior[mesAnterior.length - 1] : null;

      // Preparar dados com variação correta
      const dadosComVariacao = [];
      let patrimonioAnterior = ultimoMesAnterior
        ? (ultimoMesAnterior.totalAtivos || 0) -
          (ultimoMesAnterior.totalPassivos || 0)
        : 0;

      filtered.forEach((e, index) => {
        const patrimonioAtual = (e.totalAtivos || 0) - (e.totalPassivos || 0);
        let variacao = 0;

        if (index === 0 && ultimoMesAnterior) {
          // Primeiro mês do ano: variação = patrimônio atual - patrimônio do último mês do ano anterior
          variacao = patrimonioAtual - patrimonioAnterior;
        } else if (index > 0) {
          // Demais meses: variação = patrimônio atual - patrimônio anterior (do mesmo ano)
          variacao = patrimonioAtual - patrimonioAnterior;
        }

        dadosComVariacao.push({
          month: `${e.month}/${e.year}`,
          ativos: e.totalAtivos || 0,
          passivos: e.totalPassivos || 0,
          patrimonio: patrimonioAtual,
          variacao: variacao,
        });

        patrimonioAnterior = patrimonioAtual;
      });

      setYearData(dadosComVariacao);

      // Calcular resumo
      const lastMonth = dadosComVariacao[dadosComVariacao.length - 1];
      const firstMonth = dadosComVariacao[0];

      if (lastMonth) {
        // Calcular passivos acumulados (soma de todos os meses do ano)
        const totalPassivosAcumulado = dadosComVariacao.reduce(
          (sum, d) => sum + d.passivos,
          0,
        );

        // Calcular variação acumulada (soma de todas as variações mensais)
        const variacaoAcumulada = dadosComVariacao.reduce(
          (sum, d) => sum + d.variacao,
          0,
        );

        setSummary({
          totalAtivos: lastMonth.ativos || 0,
          totalPassivosAcumulado: totalPassivosAcumulado,
          variacaoAcumulada: variacaoAcumulada,
        });
      }

      // Resetar estados de legendas
      setActiveLines({
        ativos: true,
        passivos: true,
        variacao: true,
      });
      setActiveBarDataKeys({
        ativos: true,
        passivos: true,
      });
      setHiddenPieSlices({});
    } else {
      // Se não houver exercícios, resetar dados
      setYearData([]);
      setSummary({
        totalAtivos: 0,
        totalPassivosAcumulado: 0,
        variacaoAcumulada: 0,
      });
    }
  }, [exercicios, selectedYear]);

  const years = exercicios
    ? [...new Set(exercicios.map((e) => e.year))].sort()
    : [];

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  // Composição do último mês (ativos por tipo) - COM VERIFICAÇÃO DE SEGURANÇA
  let pieData = [];
  if (yearData.length > 0) {
    const lastMonthData = yearData[yearData.length - 1];
    // Verificar se lastMonthData existe e se ativos é um array
    if (
      lastMonthData &&
      lastMonthData.ativos &&
      Array.isArray(lastMonthData.ativos)
    ) {
      const ativosPorTipo = lastMonthData.ativos.reduce((acc, item) => {
        const tipo = item.tipo || "outro";
        acc[tipo] = (acc[tipo] || 0) + (item.valor || 0);
        return acc;
      }, {});
      pieData = Object.entries(ativosPorTipo).map(([name, value]) => ({
        name,
        value,
      }));
    }
  }

  // Inicializar estado do pie
  const initialPieState = pieData.reduce(
    (acc, _, index) => ({ ...acc, [index]: true }),
    {},
  );

  // Handlers para legendas
  const handleLineLegendClick = (dataKey) => {
    setActiveLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const handleBarLegendClick = (dataKey) => {
    setActiveBarDataKeys((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const handlePieLegendClick = (index) => {
    setHiddenPieSlices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const resetAllLegends = () => {
    setActiveLines({
      ativos: true,
      passivos: true,
      variacao: true,
    });
    setActiveBarDataKeys({
      ativos: true,
      passivos: true,
    });
    setHiddenPieSlices(initialPieState);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="text-xs sm:text-sm"
            >
              {entry.name}: {formatarMoeda(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filtrar dados da pizza com base no estado hiddenPieSlices
  const filteredPieData = pieData.filter((_, index) => !hiddenPieSlices[index]);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 pb-24">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input-field w-24 sm:w-32 text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="card p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Ativos (Atual)
              </p>
              <p className="text-sm sm:text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatarMoeda(summary.totalAtivos)}
              </p>
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
          </div>
        </div>

        <div className="card p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Passivos (Acumulado)
              </p>
              <p className="text-sm sm:text-lg font-bold text-red-600 dark:text-red-400">
                {formatarMoeda(summary.totalPassivosAcumulado)}
              </p>
            </div>
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
        </div>

        <div className="card col-span-2 p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Variação Acumulada
              </p>
              <p
                className={`text-base sm:text-xl font-bold ${summary.variacaoAcumulada >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {formatarMoeda(summary.variacaoAcumulada)}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 ${summary.variacaoAcumulada >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {summary.variacaoAcumulada >= 0 ? (
                <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="text-[10px] sm:text-sm font-medium">
                {summary.variacaoAcumulada >= 0 ? "+" : ""}
                {formatarMoeda(summary.variacaoAcumulada)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico 1: Evolução Patrimonial */}
      {yearData.length > 0 && (
        <div className="card mb-4 sm:mb-6 p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-lg font-semibold">
              Evolução Patrimonial
            </h2>
            <button
              onClick={resetAllLegends}
              className="p-1.5 sm:p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
              title="Resetar legendas"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Resetar</span>
            </button>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={10}
                  tick={{ fontSize: 9 }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickFormatter={(value) => formatarMoeda(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  onClick={(e) => handleLineLegendClick(e.dataKey)}
                  wrapperStyle={{ fontSize: "11px" }}
                />
                {activeLines.ativos && (
                  <Line
                    type="monotone"
                    dataKey="ativos"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                    name="Ativos"
                  />
                )}
                {activeLines.passivos && (
                  <Line
                    type="monotone"
                    dataKey="passivos"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 3 }}
                    name="Passivos"
                  />
                )}
                {activeLines.variacao && (
                  <Line
                    type="monotone"
                    dataKey="variacao"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 3 }}
                    name="Variação"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
            💡 Clique nas legendas | 🔄 Reset para restaurar
          </p>
        </div>
      )}

      {/* Gráfico 2: Ativos vs Passivos */}
      {yearData.length > 0 && (
        <div className="card mb-4 sm:mb-6 p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-lg font-semibold">
              Ativos vs Passivos
            </h2>
            <button
              onClick={resetAllLegends}
              className="p-1.5 sm:p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
              title="Resetar legendas"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Resetar</span>
            </button>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={10}
                  tick={{ fontSize: 9 }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickFormatter={(value) => formatarMoeda(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  onClick={(e) => handleBarLegendClick(e.dataKey)}
                  wrapperStyle={{ fontSize: "11px" }}
                />
                {activeBarDataKeys.ativos && (
                  <Bar dataKey="ativos" fill="#3b82f6" name="Ativos" />
                )}
                {activeBarDataKeys.passivos && (
                  <Bar dataKey="passivos" fill="#ef4444" name="Passivos" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
            💡 Clique nas legendas | 🔄 Reset para restaurar
          </p>
        </div>
      )}

      {/* Gráfico 3: Composição dos Ativos */}
      {filteredPieData.length > 0 && (
        <div className="card p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-lg font-semibold">
              Composição dos Ativos
            </h2>
            <button
              onClick={resetAllLegends}
              className="p-1.5 sm:p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
              title="Resetar legendas"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Resetar</span>
            </button>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={70}
                  innerRadius={25}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={10}
                >
                  {filteredPieData.map((entry, index) => {
                    const originalIndex = pieData.findIndex(
                      (d) => d.name === entry.name,
                    );
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[originalIndex % COLORS.length]}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip formatter={(value) => formatarMoeda(value)} />
                <Legend
                  wrapperStyle={{ fontSize: "10px", cursor: "pointer" }}
                  onClick={(e) => {
                    const index = pieData.findIndex((d) => d.name === e.value);
                    if (index !== -1) handlePieLegendClick(index);
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
            📊 Passe o mouse | 💡 Clique nas legendas
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
