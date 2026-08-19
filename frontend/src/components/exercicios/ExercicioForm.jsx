import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  TrendingDown,
  Trash2,
  Plus,
  Wallet,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatarMoeda } from "../../utils/format";

const ExercicioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: exercicio, loading, refetch } = useFetch(`/exercicios/${id}`);
  const [ativos, setAtivos] = useState([]);
  const [passivos, setPassivos] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [totals, setTotals] = useState({ totalAtivos: 0, totalPassivos: 0 });

  useEffect(() => {
    if (exercicio) {
      setAtivos(exercicio.ativos || []);
      setPassivos(exercicio.passivos || []);
      setInvestimentos(exercicio.investimentos || []);
      setTotals({
        totalAtivos: exercicio.totalAtivos || 0,
        totalPassivos: exercicio.totalPassivos || 0,
      });
    }
  }, [exercicio]);

  const updateAtivo = (index, field, value) => {
    const newAtivos = [...ativos];
    newAtivos[index] = {
      ...newAtivos[index],
      [field]: field === "valor" ? parseFloat(value) || 0 : value,
    };
    setAtivos(newAtivos);
    calculateTotals(newAtivos, passivos);
  };

  const updatePassivo = (index, field, value) => {
    const newPassivos = [...passivos];
    newPassivos[index] = {
      ...newPassivos[index],
      [field]: field === "valor" ? parseFloat(value) || 0 : value,
    };
    setPassivos(newPassivos);
    calculateTotals(ativos, newPassivos);
  };

  const updateInvestimento = (index, field, value) => {
    const newInvestimentos = [...investimentos];
    newInvestimentos[index] = {
      ...newInvestimentos[index],
      [field]: field === "valor" ? parseFloat(value) || 0 : value,
    };
    setInvestimentos(newInvestimentos);
  };

  const calculateTotals = (ativosData, passivosData) => {
    const totalAtivos = ativosData.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    const totalPassivos = passivosData.reduce(
      (sum, item) => sum + (item.valor || 0),
      0,
    );
    setTotals({ totalAtivos, totalPassivos });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/exercicios/${id}`, { ativos, passivos, investimentos });
      toast.success("Exercício salvo com sucesso!");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar exercício");
    } finally {
      setSaving(false);
    }
  };

  const removeAtivo = (index) => {
    const ativo = ativos[index];
    if (!window.confirm(`Remover o ativo "${ativo?.nome}" deste exercício?`)) {
      return;
    }
    const newAtivos = ativos.filter((_, i) => i !== index);
    setAtivos(newAtivos);
    calculateTotals(newAtivos, passivos);
  };

  const removePassivo = (index) => {
    const passivo = passivos[index];
    if (
      !window.confirm(`Remover o passivo "${passivo?.nome}" deste exercício?`)
    ) {
      return;
    }
    const newPassivos = passivos.filter((_, i) => i !== index);
    setPassivos(newPassivos);
    calculateTotals(ativos, newPassivos);
  };

  const removeInvestimento = (index) => {
    const investimento = investimentos[index];
    if (
      !window.confirm(
        `Remover o investimento "${investimento?.nome}" deste exercício?`,
      )
    ) {
      return;
    }
    const newInvestimentos = investimentos.filter((_, i) => i !== index);
    setInvestimentos(newInvestimentos);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!exercicio) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 dark:text-red-400">
          Exercício não encontrado
        </p>
      </div>
    );
  }

  const patrimonio = totals.totalAtivos - totals.totalPassivos;

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/exercicios")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">
            {meses[exercicio.month - 1]} {exercicio.year}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ativos.length} ativos • {passivos.length} passivos •{" "}
            {investimentos.length} investimentos
          </p>
        </div>
        <span
          className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
            patrimonio >= 0
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          Patrimônio: {formatCurrency(patrimonio)}
        </span>
      </div>

      {/* Cards de totais */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Ativos
          </p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(totals.totalAtivos)}
          </p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Passivos
          </p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totals.totalPassivos)}
          </p>
        </div>
      </div>

      {/* Ativos */}
      <div className="card mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Ativos
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({ativos.length} itens)
          </span>
        </h2>
        <div className="space-y-3">
          {ativos.map((ativo, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px] truncate">
                {ativo.nome}
                {ativo.tipo && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({ativo.tipo})
                  </span>
                )}
              </span>
              <input
                type="number"
                step="0.01"
                value={ativo.valor || ""}
                onChange={(e) => updateAtivo(index, "valor", e.target.value)}
                className="input-field flex-1"
                placeholder="0,00"
              />
              <button
                onClick={() => removeAtivo(index)}
                className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover ativo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {ativos.length === 0 && (
            <p className="text-gray-500 dark:text-gray-500 text-sm text-center py-4">
              Nenhum ativo cadastrado. Cadastre ativos padrão em Configurações.
            </p>
          )}
        </div>
      </div>

      {/* Passivos */}
      <div className="card mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          Passivos
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({passivos.length} itens)
          </span>
        </h2>
        <div className="space-y-3">
          {passivos.map((passivo, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px] truncate">
                {passivo.nome}
                {passivo.categoria && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({passivo.categoria})
                  </span>
                )}
              </span>
              <input
                type="number"
                step="0.01"
                value={passivo.valor || ""}
                onChange={(e) => updatePassivo(index, "valor", e.target.value)}
                className="input-field flex-1"
                placeholder="0,00"
              />
              <button
                onClick={() => removePassivo(index)}
                className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover passivo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {passivos.length === 0 && (
            <p className="text-gray-500 dark:text-gray-500 text-sm text-center py-4">
              Nenhum passivo cadastrado. Cadastre passivos padrão em
              Configurações.
            </p>
          )}
        </div>
      </div>

      {/* INVESTIMENTOS - NOVO */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-600" />
          Investimentos
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({investimentos.length} itens)
          </span>
        </h2>
        <div className="space-y-3">
          {investimentos.map((invest, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 group p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] truncate">
                  {invest.nome}
                </span>
                <span className="text-xs text-gray-400">
                  {invest.tipo} • {invest.produto}
                </span>
                <button
                  onClick={() => removeInvestimento(index)}
                  className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                  title="Remover investimento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Valor Compra
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invest.valorCompra || ""}
                    onChange={(e) =>
                      updateInvestimento(index, "valorCompra", e.target.value)
                    }
                    className="input-field text-sm"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Saldo Bruto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invest.saldoBruto || ""}
                    onChange={(e) =>
                      updateInvestimento(index, "saldoBruto", e.target.value)
                    }
                    className="input-field text-sm"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Taxa (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invest.taxaAno || ""}
                    onChange={(e) =>
                      updateInvestimento(index, "taxaAno", e.target.value)
                    }
                    className="input-field text-sm"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Rendimento
                  </label>
                  <span
                    className={`text-sm font-medium block mt-1 ${
                      (invest.saldoBruto || 0) - (invest.valorCompra || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      (invest.saldoBruto || 0) - (invest.valorCompra || 0),
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {investimentos.length === 0 && (
            <p className="text-gray-500 dark:text-gray-500 text-sm text-center py-4">
              Nenhum investimento cadastrado. Cadastre investimentos padrão em
              Configurações.
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {saving ? "Salvando..." : "Salvar Exercício"}
      </button>
    </div>
  );
};

export default ExercicioForm;
