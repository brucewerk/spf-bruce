import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Plus, Edit, Trash2, TrendingUp, GripVertical, X } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  formatarMoeda,
  parseMoeda,
  formatarInputMoeda,
} from "../../utils/format";

const InvestimentosPadrao = () => {
  const {
    data: investimentos,
    loading,
    refetch,
  } = useFetch("/padroes/investimentos");
  const { data: tiposInvestimento, refetch: refetchTipos } = useFetch(
    "/tipos-investimento",
  );
  const { data: produtosInvestimento, refetch: refetchProdutos } = useFetch(
    "/produtos-investimento",
  );
  const [editing, setEditing] = useState(null);
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [novoTipo, setNovoTipo] = useState({
    nome: "",
    cor: "#8b5cf6",
    icone: "📈",
    ativo: true,
  });
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    tipo: "",
    cor: "#8b5cf6",
    icone: "📈",
    ativo: true,
  });
  const [formData, setFormData] = useState({
    tipo: "",
    produto: "",
    nome: "",
    emissao: "",
    vencimento: "",
    valorCompra: "",
    saldoBruto: "",
    taxaAno: "",
    irIof: "0",
    ativo: true,
  });

  const coresTipo = [
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd",
    "#7c3aed",
    "#6d28d9",
    "#5b21b6",
    "#4c1d95",
    "#3b0764",
  ];
  const coresProduto = [
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd",
    "#7c3aed",
    "#6d28d9",
    "#5b21b6",
    "#4c1d95",
    "#3b0764",
    "#3b82f6",
    "#60a5fa",
    "#10b981",
    "#34d399",
    "#f59e0b",
    "#fbbf24",
    "#ef4444",
    "#f87171",
  ];
  const icones = [
    "📈",
    "💰",
    "💎",
    "🏦",
    "🪙",
    "📊",
    "🚀",
    "⭐",
    "🎯",
    "📦",
    "🔑",
    "💼",
    "📱",
    "💳",
    "🏠",
    "🌿",
    "⚡",
    "🔥",
    "🌟",
    "💫",
    "🔒",
    "🔓",
    "💹",
    "📉",
  ];

  const produtosFiltrados =
    produtosInvestimento?.filter((p) => p.tipo === formData.tipo && p.ativo) ||
    [];

  useEffect(() => {
    if (formData.tipo && produtosFiltrados.length > 0) {
      const produtoExiste = produtosFiltrados.some(
        (p) => p.nome === formData.produto,
      );
      if (!produtoExiste) {
        setFormData((prev) => ({ ...prev, produto: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, produto: "" }));
    }
  }, [formData.tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tipo:
          typeof formData.tipo === "string"
            ? formData.tipo
            : formData.tipo?.nome || "",
        produto:
          typeof formData.produto === "string"
            ? formData.produto
            : formData.produto?.nome || "",
        valorCompra: parseMoeda(formData.valorCompra),
        saldoBruto: parseMoeda(formData.saldoBruto),
        taxaAno: parseFloat(formData.taxaAno) || 0,
        irIof: parseMoeda(formData.irIof) || 0,
      };

      if (editing) {
        await api.put(`/padroes/investimentos/${editing}`, data);
        toast.success("Investimento padrão atualizado com sucesso!");
      } else {
        await api.post("/padroes/investimentos", data);
        toast.success("Investimento padrão criado com sucesso!");
      }

      setFormData({
        tipo: "",
        produto: "",
        nome: "",
        emissao: "",
        vencimento: "",
        valorCompra: "",
        saldoBruto: "",
        taxaAno: "",
        irIof: "0",
        ativo: true,
      });
      setEditing(null);
      refetch();
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error(
        error.response?.data?.error || "Erro ao salvar investimento padrão",
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Tem certeza que deseja excluir este investimento padrão?")
    ) {
      try {
        await api.delete(`/padroes/investimentos/${id}`);
        toast.success("Investimento padrão excluído com sucesso!");
        refetch();
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Erro ao excluir investimento padrão",
        );
      }
    }
  };

  const handleEdit = (invest) => {
    setEditing(invest._id);
    setFormData({
      tipo: invest.tipo,
      produto: invest.produto,
      nome: invest.nome,
      emissao: invest.emissao?.split("T")[0] || "",
      vencimento: invest.vencimento?.split("T")[0] || "",
      valorCompra: formatarInputMoeda(invest.valorCompra),
      saldoBruto: formatarInputMoeda(invest.saldoBruto),
      taxaAno: invest.taxaAno,
      irIof: formatarInputMoeda(invest.irIof),
      ativo: invest.ativo,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({
      tipo: "",
      produto: "",
      nome: "",
      emissao: "",
      vencimento: "",
      valorCompra: "",
      saldoBruto: "",
      taxaAno: "",
      irIof: "0",
      ativo: true,
    });
  };

  const handleValorChange = (campo, e) => {
    let value = e.target.value.replace(/[^\d,.]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    setFormData({ ...formData, [campo]: value });
  };

  const handleValorBlur = (campo) => {
    if (formData[campo]) {
      const num = parseMoeda(formData[campo]);
      if (num > 0) {
        setFormData({ ...formData, [campo]: formatarInputMoeda(num) });
      }
    }
  };

  const handleCriarTipo = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tipos-investimento", novoTipo);
      toast.success("Tipo criado com sucesso!");
      setNovoTipo({ nome: "", cor: "#8b5cf6", icone: "📈", ativo: true });
      setShowTipoModal(false);
      refetchTipos();
      setTimeout(() => {
        const tipoCriado = tiposInvestimento?.find(
          (t) => t.nome === novoTipo.nome,
        );
        if (tipoCriado) {
          setFormData({ ...formData, tipo: tipoCriado.nome });
        }
      }, 300);
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("duplicate")
      ) {
        toast.error("Este tipo já existe!");
      } else {
        toast.error(error.response?.data?.error || "Erro ao criar tipo");
      }
    }
  };

  const handleCriarProduto = async (e) => {
    e.preventDefault();
    try {
      await api.post("/produtos-investimento", novoProduto);
      toast.success("Produto criado com sucesso!");
      setNovoProduto({
        nome: "",
        tipo: "",
        cor: "#8b5cf6",
        icone: "📈",
        ativo: true,
      });
      setShowProdutoModal(false);
      refetchProdutos();
      setTimeout(() => {
        const produtoCriado = produtosInvestimento?.find(
          (p) => p.nome === novoProduto.nome,
        );
        if (produtoCriado) {
          setFormData({ ...formData, produto: produtoCriado.nome });
        }
      }, 300);
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("duplicate")
      ) {
        toast.error("Este produto já existe para este tipo!");
      } else {
        toast.error(error.response?.data?.error || "Erro ao criar produto");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const tiposAtivos = tiposInvestimento?.filter((t) => t.ativo) || [];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold">
          📈 Investimentos Padrão
        </h1>
      </div>

      <div className="card mb-4 sm:mb-6 p-3 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm label">Tipo</label>
              <div className="flex gap-1.5 sm:gap-2">
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                  className="input-field flex-1 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {tiposAtivos.map((tipo) => (
                    <option key={tipo._id} value={tipo.nome}>
                      {tipo.icone} {tipo.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowTipoModal(true)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap text-sm"
                  title="Novo Tipo"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Produto</label>
              <div className="flex gap-1.5 sm:gap-2">
                <select
                  value={formData.produto}
                  onChange={(e) =>
                    setFormData({ ...formData, produto: e.target.value })
                  }
                  className="input-field flex-1 text-sm"
                  required
                  disabled={!formData.tipo}
                >
                  <option value="">
                    {formData.tipo ? "Selecione" : "Selecione tipo primeiro"}
                  </option>
                  {produtosFiltrados.map((produto) => (
                    <option key={produto._id} value={produto.nome}>
                      {produto.icone} {produto.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowProdutoModal(true)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap text-sm"
                  title="Novo Produto"
                  disabled={!formData.tipo}
                >
                  +
                </button>
              </div>
              {formData.tipo && produtosFiltrados.length === 0 && (
                <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Nenhum produto para este tipo. Clique em "+" para criar.
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm label">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="input-field text-sm"
                placeholder="Nome completo do investimento"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Emissão</label>
              <input
                type="date"
                value={formData.emissao}
                onChange={(e) =>
                  setFormData({ ...formData, emissao: e.target.value })
                }
                className="input-field text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Vencimento</label>
              <input
                type="date"
                value={formData.vencimento}
                onChange={(e) =>
                  setFormData({ ...formData, vencimento: e.target.value })
                }
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Valor Compra</label>
              <input
                type="text"
                value={formData.valorCompra}
                onChange={(e) => handleValorChange("valorCompra", e)}
                onBlur={() => handleValorBlur("valorCompra")}
                className="input-field text-sm"
                placeholder="Ex: 10,00 ou 5000"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Saldo Bruto</label>
              <input
                type="text"
                value={formData.saldoBruto}
                onChange={(e) => handleValorChange("saldoBruto", e)}
                onBlur={() => handleValorBlur("saldoBruto")}
                className="input-field text-sm"
                placeholder="Ex: 10,00 ou 5000"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Taxa (% a.a.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.taxaAno}
                onChange={(e) =>
                  setFormData({ ...formData, taxaAno: e.target.value })
                }
                className="input-field text-sm"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">IR e IOF</label>
              <input
                type="text"
                value={formData.irIof}
                onChange={(e) => handleValorChange("irIof", e)}
                onBlur={() => handleValorBlur("irIof")}
                className="input-field text-sm"
                placeholder="Ex: 10,00"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-1.5 sm:gap-2">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 rounded"
                />
                <span className="text-[10px] sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ativo
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button type="submit" className="btn-primary flex-1 text-sm">
              {editing ? "Atualizar" : "Adicionar"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {investimentos?.map((invest) => {
          const tipo = tiposInvestimento?.find((t) => t.nome === invest.tipo);
          const produto = produtosInvestimento?.find(
            (p) => p.nome === invest.produto,
          );
          return (
            <div key={invest._id} className="card p-2 sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  {produto && (
                    <>
                      <div
                        className="w-2 h-2 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: produto.cor }}
                      />
                      <span className="text-lg sm:text-2xl flex-shrink-0">
                        {produto.icone}
                      </span>
                    </>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium truncate">
                      {invest.nome}
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-3 text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <span className="truncate">
                        Tipo:{" "}
                        {tipo ? `${tipo.icone} ${invest.tipo}` : invest.tipo}
                      </span>
                      <span className="truncate">
                        Produto:{" "}
                        {produto
                          ? `${produto.icone} ${invest.produto}`
                          : invest.produto}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(invest)}
                    className="p-1 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(invest._id)}
                    className="p-1 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mt-1.5 sm:mt-2 text-[8px] sm:text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Compra
                  </span>
                  <span className="ml-0.5 sm:ml-1 font-medium text-primary-600">
                    {formatarMoeda(invest.valorCompra)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Saldo
                  </span>
                  <span className="ml-0.5 sm:ml-1 font-medium text-green-600">
                    {formatarMoeda(invest.saldoBruto)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Rendimento
                  </span>
                  <span
                    className={`ml-0.5 sm:ml-1 font-medium ${invest.saldoBruto - invest.valorCompra >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatarMoeda(invest.saldoBruto - invest.valorCompra)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Taxa</span>
                  <span className="ml-0.5 sm:ml-1 font-medium">
                    {invest.taxaAno || 0}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {investimentos?.length === 0 && (
          <div className="card text-center py-6 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
              Nenhum investimento padrão cadastrado
            </p>
            <p className="text-[10px] sm:text-sm text-gray-400 dark:text-gray-600 mt-1 sm:mt-2">
              Cadastre tipos e produtos primeiro
            </p>
          </div>
        )}
      </div>

      {/* Modal para criar tipo */}
      {showTipoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold">Novo Tipo</h2>
              <button
                onClick={() => setShowTipoModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <form onSubmit={handleCriarTipo} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm label">Nome</label>
                <input
                  type="text"
                  value={novoTipo.nome}
                  onChange={(e) =>
                    setNovoTipo({ ...novoTipo, nome: e.target.value })
                  }
                  className="input-field text-sm"
                  placeholder="Ex: Renda Fixa"
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Cor</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                  {coresTipo.map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => setNovoTipo({ ...novoTipo, cor })}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${novoTipo.cor === cor ? "border-gray-900 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Ícone</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                  {icones.map((icone) => (
                    <button
                      key={icone}
                      type="button"
                      onClick={() => setNovoTipo({ ...novoTipo, icone })}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-2xl rounded-lg transition-all ${novoTipo.icone === icone ? "bg-primary-100 scale-110" : "hover:bg-gray-200"}`}
                    >
                      {icone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowTipoModal(false)}
                  className="btn-secondary flex-1 text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1 text-sm">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para criar produto */}
      {showProdutoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold">Novo Produto</h2>
              <button
                onClick={() => setShowProdutoModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <form
              onSubmit={handleCriarProduto}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="text-xs sm:text-sm label">Nome</label>
                <input
                  type="text"
                  value={novoProduto.nome}
                  onChange={(e) =>
                    setNovoProduto({ ...novoProduto, nome: e.target.value })
                  }
                  className="input-field text-sm"
                  placeholder="Ex: CDB, LCI"
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Tipo</label>
                <select
                  value={novoProduto.tipo}
                  onChange={(e) =>
                    setNovoProduto({ ...novoProduto, tipo: e.target.value })
                  }
                  className="input-field text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {tiposAtivos.map((tipo) => (
                    <option key={tipo._id} value={tipo.nome}>
                      {tipo.icone} {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Cor</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                  {coresProduto.map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => setNovoProduto({ ...novoProduto, cor })}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${novoProduto.cor === cor ? "border-gray-900 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Ícone</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                  {icones.map((icone) => (
                    <button
                      key={icone}
                      type="button"
                      onClick={() => setNovoProduto({ ...novoProduto, icone })}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-2xl rounded-lg transition-all ${novoProduto.icone === icone ? "bg-primary-100 scale-110" : "hover:bg-gray-200"}`}
                    >
                      {icone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowProdutoModal(false)}
                  className="btn-secondary flex-1 text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1 text-sm">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestimentosPadrao;
