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

      // Dados para o gráfico (acumulados)
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

      // Dados para a tabela (reais)
      const tabela = ordenados.map((exercicio, index) => {
        const passivosReais =
          exercicio.passivos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;

        // Calcular variação real (diferença do patrimônio em relação ao mês anterior)
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
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
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
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">
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
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {anos.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
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
              <div className="card mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Evolução Acumulada - {selectedYear}
                  </h2>
                  <button
                    onClick={resetLegends}
                    className="p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                    title="Resetar legendas"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resetar
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosFiltradosGrafico}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.1}
                      />
                      <XAxis dataKey="periodo" stroke="#6b7280" fontSize={12} />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        domain={[0, getMaxValue(dadosFiltradosGrafico)]}
                        tickFormatter={(value) => formatarMoeda(value)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend onClick={(e) => handleLegendClick(e.dataKey)} />
                      {activeLines.ativos && (
                        <Line
                          type="monotone"
                          dataKey="ativos"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6" }}
                          name="Ativos (Atual)"
                        />
                      )}
                      {activeLines.passivos && (
                        <Line
                          type="monotone"
                          dataKey="passivos"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ fill: "#ef4444" }}
                          name="Passivos (Acumulado)"
                        />
                      )}
                      {activeLines.variacao && (
                        <Line
                          type="monotone"
                          dataKey="variacao"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981" }}
                          name="Variação (Acumulada)"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  💡 Clique nas legendas para mostrar/esconder | 🔄 Botão Reset
                  para restaurar
                </p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold mb-4">
                  Resumo Acumulado - {selectedYear}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium">
                          Período
                        </th>
                        <th className="text-right py-2 px-3 font-medium">
                          Ativos (Atual)
                        </th>
                        <th className="text-right py-2 px-3 font-medium">
                          Passivos (Real)
                        </th>
                        <th className="text-right py-2 px-3 font-medium">
                          Variação (Real)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosFiltradosTabela.map((data, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-gray-800"
                        >
                          <td className="py-2 px-3">{data.periodo}</td>
                          <td className="text-right py-2 px-3 text-primary-600">
                            {formatarMoeda(data.ativos)}
                          </td>
                          <td className="text-right py-2 px-3 text-red-600">
                            {formatarMoeda(data.passivos)}
                          </td>
                          <td
                            className={`text-right py-2 px-3 font-medium ${
                              data.variacao >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.variacao >= 0 ? "+" : ""}
                            {formatarMoeda(data.variacao)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                        <td className="py-2 px-3">TOTAL DO ANO</td>
                        {(() => {
                          const totais = getTotaisAno(dadosFiltradosTabela);
                          return (
                            <>
                              <td className="text-right py-2 px-3 text-primary-600">
                                {formatarMoeda(totais.ativos)}
                              </td>
                              <td className="text-right py-2 px-3 text-red-600">
                                {formatarMoeda(totais.passivos)}
                              </td>
                              <td
                                className={`text-right py-2 px-3 ${
                                  totais.variacao >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {totais.variacao >= 0 ? "+" : ""}
                                {formatarMoeda(totais.variacao)}
                              </td>
                            </>
                          );
                        })()}
                      </tr>
                    </tfoot>
                  </table>
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
