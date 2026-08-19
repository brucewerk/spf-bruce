import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { formatarMoeda } from "../../utils/format";
import { RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EvolucaoPatrimonial = () => {
  const { data: exercicios, loading } = useFetch("/exercicios");
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [anos, setAnos] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [activeLines, setActiveLines] = useState({
    ativos: true,
    passivos: true,
    variacao: true,
  });

  useEffect(() => {
    if (exercicios && exercicios.length > 0) {
      const ordenados = [...exercicios].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      let passivosAcumulados = 0;
      let ativosAtuais = 0;
      let patrimonioAnterior = 0;
      let variacaoAcumulada = 0;

      const grafico = ordenados.map((exercicio, index) => {
        ativosAtuais = exercicio.totalAtivos || 0;
        const passivosMes =
          exercicio.passivos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;
        passivosAcumulados += passivosMes;

        const patrimonioAtual =
          (exercicio.totalAtivos || 0) - (exercicio.totalPassivos || 0);
        if (index === 0) {
          variacaoAcumulada = 0;
        } else {
          variacaoAcumulada += patrimonioAtual - patrimonioAnterior;
        }
        patrimonioAnterior = patrimonioAtual;

        return {
          periodo: `${exercicio.month}/${exercicio.year}`,
          ativos: ativosAtuais,
          passivos: passivosAcumulados,
          variacao: variacaoAcumulada,
          year: exercicio.year,
        };
      });

      setDadosGrafico(grafico);

      const tabela = ordenados.map((exercicio, index) => {
        const passivosReais =
          exercicio.passivos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;

        let variacaoReal = 0;
        if (index > 0) {
          const anterior = ordenados[index - 1];
          const patrimonioAtual =
            (exercicio.totalAtivos || 0) - (exercicio.totalPassivos || 0);
          const patrimonioAnterior =
            (anterior.totalAtivos || 0) - (anterior.totalPassivos || 0);
          variacaoReal = patrimonioAtual - patrimonioAnterior;
        }

        return {
          periodo: `${exercicio.month}/${exercicio.year}`,
          ativos: exercicio.totalAtivos || 0,
          passivos: passivosReais,
          variacao: variacaoReal,
          year: exercicio.year,
        };
      });

      setDadosTabela(tabela);

      const anosUnicos = [...new Set(ordenados.map((e) => e.year))].sort();
      setAnos(anosUnicos);
      if (anosUnicos.length > 0 && !selectedYear) {
        setSelectedYear(anosUnicos[anosUnicos.length - 1]);
      }
    }
  }, [exercicios]);

  const dadosFiltradosGrafico = dadosGrafico.filter(
    (d) => d.year === selectedYear,
  );
  const dadosFiltradosTabela = dadosTabela.filter(
    (d) => d.year === selectedYear,
  );

  const handleLegendClick = (dataKey) => {
    setActiveLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const resetLegends = () => {
    setActiveLines({
      ativos: true,
      passivos: true,
      variacao: true,
    });
  };

  const getMaxValue = (data) => {
    if (!data || data.length === 0) return 0;
    const allValues = data.flatMap((d) => [d.ativos, d.passivos, d.variacao]);
    return Math.max(...allValues, 0) * 1.1;
  };

  const getTotaisAno = (data) => {
    if (!data || data.length === 0)
      return { ativos: 0, passivos: 0, variacao: 0 };
    const ultimo = data[data.length - 1];
    const somaPassivos = data.reduce((sum, d) => sum + d.passivos, 0);
    const somaVariacao = data.reduce((sum, d) => sum + d.variacao, 0);
    return {
      ativos: ultimo.ativos || 0,
      passivos: somaPassivos,
      variacao: somaVariacao,
    };
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Evolução Patrimonial Acumulada
      </h1>

      {dadosGrafico.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-500">
            Nenhum dado disponível para evolução patrimonial
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {anos.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
                  selectedYear === year
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {selectedYear && dadosFiltradosGrafico.length > 0 && (
            <>
              <div className="card mb-4 sm:mb-6 p-3 sm:p-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-4">
                  <h2 className="text-sm sm:text-lg font-semibold">
                    Evolução Acumulada - {selectedYear}
                  </h2>
                  <button
                    onClick={resetLegends}
                    className="p-1.5 sm:p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                    title="Resetar legendas"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Resetar</span>
                  </button>
                </div>
                <div className="h-48 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosFiltradosGrafico}>
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
                      <YAxis
                        stroke="#6b7280"
                        fontSize={9}
                        domain={[0, getMaxValue(dadosFiltradosGrafico)]}
                        tickFormatter={(value) => formatarMoeda(value)}
                        width={50}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        onClick={(e) => handleLegendClick(e.dataKey)}
                        wrapperStyle={{ fontSize: "9px" }}
                      />
                      {activeLines.ativos && (
                        <Line
                          type="monotone"
                          dataKey="ativos"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", r: 2 }}
                          name="Ativos (Atual)"
                        />
                      )}
                      {activeLines.passivos && (
                        <Line
                          type="monotone"
                          dataKey="passivos"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ fill: "#ef4444", r: 2 }}
                          name="Passivos (Acumulado)"
                        />
                      )}
                      {activeLines.variacao && (
                        <Line
                          type="monotone"
                          dataKey="variacao"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", r: 2 }}
                          name="Variação (Acumulada)"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
                  💡 Clique nas legendas | 🔄 Reset para restaurar
                </p>
              </div>

              {/* 🔥 SUBSTITUIÇÃO DA TABELA POR CARDS 🔥 */}
              <div className="card p-3 sm:p-4">
                <h2 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">
                  Resumo Acumulado - {selectedYear}
                </h2>

                {/* Grid de Cards (2 colunas no celular, 4 no desktop) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {dadosFiltradosTabela.map((data, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm flex flex-col"
                    >
                      <div className="text-[10px] sm:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 border-b border-gray-300 dark:border-gray-600 pb-1">
                        {data.periodo}
                      </div>
                      <div className="flex justify-between items-center text-[9px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <span>Ativos:</span>
                        <span className="text-primary-600 font-medium">
                          {formatarMoeda(data.ativos)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <span>Passivos:</span>
                        <span className="text-red-600 font-medium">
                          {formatarMoeda(data.passivos)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 pt-1 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-medium">Variação:</span>
                        <span
                          className={`font-bold ${data.variacao >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {data.variacao >= 0 ? "+" : ""}
                          {formatarMoeda(data.variacao)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card de Total */}
                <div className="mt-3 p-2 sm:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 flex flex-wrap justify-between items-center gap-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    TOTAL
                  </span>
                  {(() => {
                    const totais = getTotaisAno(dadosFiltradosTabela);
                    return (
                      <div className="flex flex-wrap gap-3 sm:gap-6 text-[10px] sm:text-sm">
                        <span className="text-primary-600 font-medium">
                          Ativos: {formatarMoeda(totais.ativos)}
                        </span>
                        <span className="text-red-600 font-medium">
                          Passivos: {formatarMoeda(totais.passivos)}
                        </span>
                        <span
                          className={`font-bold ${totais.variacao >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          Variação: {totais.variacao >= 0 ? "+" : ""}
                          {formatarMoeda(totais.variacao)}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EvolucaoPatrimonial;
