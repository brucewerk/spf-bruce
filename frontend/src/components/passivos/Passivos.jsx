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

const Passivos = () => {
  const { data: exercicios, loading: loadingExercicios } =
    useFetch("/exercicios");
  const { data: categoriasPassivo } = useFetch("/categorias/passivos");
  const [passivos, setPassivos] = useState([]);
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

        if (ultimoExercicio.passivos) {
          setPassivos(ultimoExercicio.passivos);
          const total = ultimoExercicio.passivos.reduce(
            (sum, p) => sum + (p.valor || 0),
            0,
          );
          setTotalMaisAtual(total);
        } else {
          setPassivos([]);
          setTotalMaisAtual(0);
        }
      } else {
        setPassivos([]);
        setTotalMaisAtual(0);
        setPeriodo("");
      }
      setLoading(false);
      setHiddenPieSlices({});
      setHiddenBarItems({});
    } else if (exercicios && exercicios.length === 0) {
      setPassivos([]);
      setTotalMaisAtual(0);
      setPeriodo("");
      setLoading(false);
    }
  }, [exercicios]);

  const COLORS = [
    "#ef4444",
    "#f87171",
    "#fca5a5",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#f59e0b",
    "#fbbf24",
  ];

  const getMediasPorCategoria = () => {
    if (!exercicios || exercicios.length === 0) return {};

    const medias = {};
    const categorias = new Set();

    exercicios.forEach((e) => {
      e.passivos?.forEach((p) => {
        categorias.add(p.categoria || "Outros");
      });
    });

    categorias.forEach((cat) => {
      let soma = 0;
      let count = 0;
      exercicios.forEach((e) => {
        const item = e.passivos?.find((p) => (p.categoria || "Outros") === cat);
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

  const passivosPorCategoria = passivos?.reduce((acc, passivo) => {
    const categoria = passivo.categoria || "Outros";
    if (!acc[categoria]) acc[categoria] = { total: 0, itens: [] };
    acc[categoria].total += passivo.valor || 0;
    acc[categoria].itens.push(passivo);
    return acc;
  }, {});

  const dadosGrafico = Object.entries(passivosPorCategoria || {}).map(
    ([nome, dados]) => ({
      name: nome,
      value: dados.total,
      quantidade: dados.itens.length,
      media: mediasPorCategoria[nome] || 0,
    }),
  );

  const totalPassivos =
    passivos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;
  const somaMedias = dadosGrafico.reduce((sum, item) => sum + item.media, 0);

  const topDespesas = [...(passivos || [])]
    .sort((a, b) => (b.valor || 0) - (a.valor || 0))
    .slice(0, 5)
    .map((p, index) => ({
      id: index,
      name: p.nome.length > 12 ? p.nome.substring(0, 12) + "..." : p.nome,
      value: p.valor || 0,
      categoria: p.categoria || "Outros",
      fullName: p.nome,
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
  const filteredBarData = topDespesas.filter(
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
    const index = topDespesas.findIndex((d) => d.name === e.value);
    if (index !== -1) toggleBarItem(index);
  };

  const handleBarCellClick = (entry) => {
    const index = topDespesas.findIndex((d) => d.name === entry.name);
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
    <div className="max-w-6xl mx-auto p-2 sm:p-4 pb-24">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold flex flex-wrap items-center gap-1">
          💳 Despesas{" "}
          {periodo && (
            <span className="text-sm sm:text-lg font-normal text-gray-500">
              - {periodo}
            </span>
          )}
        </h1>
        <button
          onClick={() => (window.location.href = "/passivos-padrao")}
          className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
        >
          <span>⚙️</span>{" "}
          <span className="hidden sm:inline">Gerenciar Padrões</span>
        </button>
      </div>

      {passivos.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-500">
            Nenhuma despesa cadastrada
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
            Cadastre despesas padrão em Configurações → Despesas Padrão e crie
            um exercício
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
            <div className="card bg-red-50 dark:bg-red-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                Total do Mês
              </p>
              <p className="text-xs sm:text-xl font-bold text-red-600 dark:text-red-400 truncate">
                {formatarMoeda(totalPassivos)}
              </p>
            </div>
            <div className="card bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                Quantidade
              </p>
              <p className="text-xs sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                {passivos?.length || 0}
              </p>
            </div>
            <div className="card bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                Média
              </p>
              <p className="text-xs sm:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">
                {passivos?.length > 0
                  ? formatarMoeda(totalPassivos / passivos.length)
                  : "R$ 0,00"}
              </p>
            </div>
            <div className="card bg-green-50 dark:bg-green-900/20 p-2 sm:p-3">
              <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                💰 Total
              </p>
              <p className="text-xs sm:text-xl font-bold text-green-600 dark:text-green-400 truncate">
                {formatarMoeda(totalMaisAtual)}
              </p>
            </div>
          </div>

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
              {topDespesas.length > 0 ? (
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
                      <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]}>
                        {filteredBarData.map((entry, index) => {
                          const originalIndex = topDespesas.findIndex(
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

          <div className="card overflow-x-auto p-2 sm:p-4">
            <h2 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-4">
              Resumo por Categoria
            </h2>
            <div className="min-w-[400px] sm:min-w-full">
              <table className="w-full text-[10px] sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-1 sm:py-2 px-1 sm:px-3 font-medium">
                      Categoria
                    </th>
                    <th className="text-right py-1 sm:py-2 px-1 sm:px-3 font-medium">
                      Qtd
                    </th>
                    <th className="text-right py-1 sm:py-2 px-1 sm:px-3 font-medium">
                      Total
                    </th>
                    <th className="text-right py-1 sm:py-2 px-1 sm:px-3 font-medium">
                      Média
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dadosGrafico.map((item, index) => {
                    const categoria = categoriasPassivo?.find(
                      (c) => c.nome === item.name,
                    );
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-1 sm:py-2 px-1 sm:px-3 flex items-center gap-1 sm:gap-2">
                          {categoria && (
                            <>
                              <div
                                className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full"
                                style={{ backgroundColor: categoria.cor }}
                              />
                              <span className="text-sm sm:text-xl">
                                {categoria.icone}
                              </span>
                            </>
                          )}
                          <span className="text-[8px] sm:text-sm truncate max-w-[60px] sm:max-w-none">
                            {item.name}
                          </span>
                        </td>
                        <td className="text-right py-1 sm:py-2 px-1 sm:px-3">
                          {item.quantidade}
                        </td>
                        <td className="text-right py-1 sm:py-2 px-1 sm:px-3 font-medium text-red-600 dark:text-red-400 text-[8px] sm:text-sm">
                          {formatarMoeda(item.value)}
                        </td>
                        <td className="text-right py-1 sm:py-2 px-1 sm:px-3 text-gray-600 dark:text-gray-400 text-[8px] sm:text-sm">
                          {formatarMoeda(item.media)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                    <td className="py-1 sm:py-2 px-1 sm:px-3">TOTAL</td>
                    <td className="text-right py-1 sm:py-2 px-1 sm:px-3">
                      {passivos?.length || 0}
                    </td>
                    <td className="text-right py-1 sm:py-2 px-1 sm:px-3 text-red-600 dark:text-red-400 text-[8px] sm:text-sm">
                      {formatarMoeda(totalPassivos)}
                    </td>
                    <td className="text-right py-1 sm:py-2 px-1 sm:px-3 text-gray-600 dark:text-gray-400 text-[8px] sm:text-sm">
                      {formatarMoeda(somaMedias)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Passivos;
