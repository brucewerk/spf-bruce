import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { formatarMoeda } from "../../utils/format";
import { RefreshCw } from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Ativos = () => {
  const { data: exercicios, loading: loadingExercicios } =
    useFetch("/exercicios");
  const { data: categoriasAtivo } = useFetch("/categorias/ativos");
  const [ativos, setAtivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMaisAtual, setTotalMaisAtual] = useState(0);
  const [periodo, setPeriodo] = useState("");
  const [hiddenPieSlices, setHiddenPieSlices] = useState({});
  const [hiddenBarItems, setHiddenBarItems] = useState({});

  const meses = [
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

  useEffect(() => {
    if (exercicios && exercicios.length > 0) {
      const ultimoExercicio = exercicios.reduce((max, e) => {
        return e.year > max.year || (e.year === max.year && e.month > max.month)
          ? e
          : max;
      }, exercicios[0]);

      if (ultimoExercicio) {
        setPeriodo(
          `${meses[ultimoExercicio.month - 1]}/${ultimoExercicio.year}`,
        );

        if (ultimoExercicio.ativos) {
          setAtivos(ultimoExercicio.ativos);
          const total = ultimoExercicio.ativos.reduce(
            (sum, a) => sum + (a.valor || 0),
            0,
          );
          setTotalMaisAtual(total);
        } else {
          setAtivos([]);
          setTotalMaisAtual(0);
        }
      } else {
        setAtivos([]);
        setTotalMaisAtual(0);
        setPeriodo("");
      }
      setLoading(false);
      setHiddenPieSlices({});
      setHiddenBarItems({});
    } else if (exercicios && exercicios.length === 0) {
      setAtivos([]);
      setTotalMaisAtual(0);
      setPeriodo("");
      setLoading(false);
    }
  }, [exercicios]);

  const COLORS = [
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
    "#0ea5e9",
    "#38bdf8",
  ];

  const getMediasPorCategoria = () => {
    if (!exercicios || exercicios.length === 0) return {};

    const medias = {};
    const categorias = new Set();

    exercicios.forEach((e) => {
      e.ativos?.forEach((a) => {
        categorias.add(a.tipo || "Outros");
      });
    });

    categorias.forEach((cat) => {
      let soma = 0;
      let count = 0;
      exercicios.forEach((e) => {
        const item = e.ativos?.find((a) => (a.tipo || "Outros") === cat);
        if (item && item.valor) {
          soma += item.valor;
          count++;
        }
      });
      medias[cat] = count > 0 ? soma / count : 0;
    });

    return medias;
  };

  const mediasPorCategoria = getMediasPorCategoria();

  const ativosPorCategoria = ativos?.reduce((acc, ativo) => {
    const categoria = ativo.tipo || "Outros";
    if (!acc[categoria]) acc[categoria] = { total: 0, itens: [] };
    acc[categoria].total += ativo.valor || 0;
    acc[categoria].itens.push(ativo);
    return acc;
  }, {});

  const dadosGrafico = Object.entries(ativosPorCategoria || {}).map(
    ([nome, dados]) => ({
      name: nome,
      value: dados.total,
      quantidade: dados.itens.length,
      media: mediasPorCategoria[nome] || 0,
    }),
  );

  const totalAtivos = ativos?.reduce((sum, a) => sum + (a.valor || 0), 0) || 0;
  const ativosAtivos = ativos?.filter((a) => a.ativo !== false).length || 0;
  const maiorAtivo = ativos?.reduce((max, a) => {
    if (!max) return a;
    return (a.valor || 0) > (max.valor || 0) ? a : max;
  }, null);

  const somaMedias = dadosGrafico.reduce((sum, item) => sum + item.media, 0);

  const topAtivos = [...(ativos || [])]
    .sort((a, b) => (b.valor || 0) - (a.valor || 0))
    .slice(0, 5)
    .map((a, index) => ({
      id: index,
      name: a.nome.length > 12 ? a.nome.substring(0, 12) + "..." : a.nome,
      value: a.valor || 0,
      categoria: a.tipo || "Outros",
      fullName: a.nome,
    }));

  const togglePieSlice = (index) => {
    setHiddenPieSlices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleBarItem = (index) => {
    setHiddenBarItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredPieData = dadosGrafico.filter(
    (_, index) => !hiddenPieSlices[index],
  );
  const filteredBarData = topAtivos.filter(
    (_, index) => !hiddenBarItems[index],
  );

  const resetAllLegends = () => {
    setHiddenPieSlices({});
    setHiddenBarItems({});
  };

  const handlePieLegendClick = (e) => {
    const index = dadosGrafico.findIndex((d) => d.name === e.value);
    if (index !== -1) togglePieSlice(index);
  };

  const handleBarLegendClick = (e) => {
    const index = topAtivos.findIndex((d) => d.name === e.value);
    if (index !== -1) toggleBarItem(index);
  };

  const handleBarCellClick = (entry) => {
    const index = topAtivos.findIndex((d) => d.name === entry.name);
    if (index !== -1) toggleBarItem(index);
  };

  if (loading || loadingExercicios) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold flex flex-wrap items-center gap-1">
          🏦 Ativos{" "}
          {periodo && (
            <span className="text-sm sm:text-lg font-normal text-gray-500">
              - {periodo}
            </span>
          )}
        </h1>
        <button
          onClick={() => (window.location.href = "/ativos-padrao")}
          className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
        >
          <span>⚙️</span>{" "}
          <span className="hidden sm:inline">Gerenciar Padrões</span>
        </button>
      </div>

      {ativos.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-500">
            Nenhum ativo cadastrado
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
            Cadastre ativos padrão em Configurações → Ativos Padrão e crie um
            exercício
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
            <div className="card bg-primary-50 dark:bg-primary-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                Total do Mês
              </p>
              <p className="text-xs sm:text-xl font-bold text-primary-600 dark:text-primary-400 truncate">
                {formatarMoeda(totalAtivos)}
              </p>
            </div>
            <div className="card bg-green-50 dark:bg-green-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                Quantidade
              </p>
              <p className="text-xs sm:text-xl font-bold text-green-600 dark:text-green-400">
                {ativos?.length || 0}
              </p>
            </div>
            <div className="card bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                Ativos Ativos
              </p>
              <p className="text-xs sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                {ativosAtivos}
              </p>
            </div>
            <div className="card bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                💰 Total
              </p>
              <p className="text-xs sm:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">
                {formatarMoeda(totalMaisAtual)}
              </p>
            </div>
          </div>

          {maiorAtivo && (
            <div className="card bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 mb-3 sm:mb-6 p-2 sm:p-4">
              <p className="text-[8px] sm:text-sm text-gray-600 dark:text-gray-400">
                🏆 Maior Ativo
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                <div>
                  <p className="text-sm sm:text-lg font-bold truncate max-w-[150px] sm:max-w-none">
                    {maiorAtivo.nome}
                  </p>
                  <p className="text-[8px] sm:text-sm text-gray-500 dark:text-gray-400">
                    Categoria: {maiorAtivo.tipo || "Não definida"}
                  </p>
                </div>
                <p className="text-base sm:text-2xl font-bold text-primary-600 dark:text-primary-400 truncate max-w-[120px] sm:max-w-none">
                  {formatarMoeda(maiorAtivo.valor)}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-6">
            <div className="card p-2 sm:p-4">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2 sm:mb-4">
                <h2 className="text-xs sm:text-lg font-semibold">
                  Distribuição
                </h2>
                <button
                  onClick={resetAllLegends}
                  className="p-1 sm:p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                  title="Resetar legendas"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Resetar</span>
                </button>
              </div>
              {dadosGrafico.length > 0 ? (
                <div className="h-44 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={filteredPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={55}
                        innerRadius={20}
                        fill="#8884d8"
                        dataKey="value"
                        fontSize={8}
                      >
                        {filteredPieData.map((entry, index) => {
                          const originalIndex = dadosGrafico.findIndex(
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
                        wrapperStyle={{ fontSize: "8px" }}
                        onClick={handlePieLegendClick}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-44 sm:h-64 flex items-center justify-center text-gray-400">
                  Nenhum dado disponível
                </div>
              )}
              <p className="text-[8px] sm:text-xs text-gray-400 text-center mt-2">
                💡 Clique nas legendas
              </p>
            </div>

            <div className="card p-2 sm:p-4">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2 sm:mb-4">
                <h2 className="text-xs sm:text-lg font-semibold">Top 5</h2>
                <button
                  onClick={resetAllLegends}
                  className="p-1 sm:p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                  title="Resetar legendas"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Resetar</span>
                </button>
              </div>
              {topAtivos.length > 0 ? (
                <div className="h-44 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredBarData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.1}
                      />
                      <XAxis type="number" stroke="#6b7280" fontSize={8} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#6b7280"
                        fontSize={7}
                        width={40}
                      />
                      <Tooltip formatter={(value) => formatarMoeda(value)} />
                      <Legend
                        wrapperStyle={{ fontSize: "8px" }}
                        onClick={handleBarLegendClick}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {filteredBarData.map((entry, index) => {
                          const originalIndex = topAtivos.findIndex(
                            (d) => d.name === entry.name,
                          );
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[originalIndex % COLORS.length]}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleBarCellClick(entry)}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-44 sm:h-64 flex items-center justify-center text-gray-400">
                  Nenhum dado disponível
                </div>
              )}
              <p className="text-[8px] sm:text-xs text-gray-400 text-center mt-2">
                💡 Clique nas barras ou legendas
              </p>
            </div>
          </div>

          {/* 🔥 SUBSTITUIÇÃO DA TABELA POR CARDS 🔥 */}
          <div className="card p-2 sm:p-4">
            <h2 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-4">
              Resumo por Categoria
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {dadosGrafico.map((item, index) => {
                const categoria = categoriasAtivo?.find(
                  (c) => c.nome === item.name,
                );
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1 mb-1">
                      {categoria && (
                        <>
                          <div
                            className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: categoria.cor }}
                          />
                          <span className="text-sm sm:text-xl">
                            {categoria.icone}
                          </span>
                        </>
                      )}
                      <span className="truncate text-[10px] sm:text-xs">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <span>Qtd:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item.quantidade}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <span>Total:</span>
                      <span className="font-medium text-primary-600">
                        {formatarMoeda(item.value)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <span>Média:</span>
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {formatarMoeda(item.media)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card de Total */}
            <div className="mt-3 p-2 sm:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 flex flex-wrap justify-between items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                TOTAL
              </span>
              <div className="flex flex-wrap gap-3 sm:gap-6 text-[10px] sm:text-sm">
                <span>Qtd: {ativos?.length || 0}</span>
                <span className="text-primary-600 font-medium">
                  Total: {formatarMoeda(totalAtivos)}
                </span>
                <span className="text-gray-600 font-medium">
                  Média Geral: {formatarMoeda(somaMedias)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Ativos;
