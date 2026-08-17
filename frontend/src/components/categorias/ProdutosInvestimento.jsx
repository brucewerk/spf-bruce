import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Plus, Edit, Trash2, GripVertical, Filter } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const ProdutosInvestimento = () => {
  const {
    data: produtos,
    loading,
    refetch,
  } = useFetch("/produtos-investimento");
  const { data: tiposInvestimento } = useFetch("/tipos-investimento");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    cor: "#8b5cf6",
    icone: "📈",
    ativo: true,
  });
  const [filtroTipo, setFiltroTipo] = useState("");

  const cores = [
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd", // Roxos
    "#3b82f6",
    "#60a5fa",
    "#93c5fd", // Azuis
    "#10b981",
    "#34d399",
    "#6ee7b7", // Verdes
    "#f59e0b",
    "#fbbf24",
    "#fcd34d", // Amarelos
    "#ef4444",
    "#f87171",
    "#fca5a5", // Vermelhos
    "#ec4899",
    "#f472b6",
    "#f9a8d4", // Rosas
    "#14b8a6",
    "#2dd4bf",
    "#5eead4", // Teals
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/produtos-investimento/${editing}`, formData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await api.post("/produtos-investimento", formData);
        toast.success("Produto criado com sucesso!");
      }
      setFormData({
        nome: "",
        tipo: "",
        cor: "#8b5cf6",
        icone: "📈",
        ativo: true,
      });
      setEditing(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar produto");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete(`/produtos-investimento/${id}`);
        toast.success("Produto excluído com sucesso!");
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao excluir produto");
      }
    }
  };

  const handleEdit = (produto) => {
    setEditing(produto._id);
    setFormData({
      nome: produto.nome,
      tipo: produto.tipo,
      cor: produto.cor,
      icone: produto.icone,
      ativo: produto.ativo,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({
      nome: "",
      tipo: "",
      cor: "#8b5cf6",
      icone: "📈",
      ativo: true,
    });
  };

  const produtosFiltrados = filtroTipo
    ? produtos?.filter((p) => p.tipo === filtroTipo)
    : produtos;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos de Investimento</h1>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nome do Produto</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="input-field"
                placeholder="Ex: CDB, LCI, Tesouro Direto"
                required
              />
            </div>
            <div>
              <label className="label">Tipo de Investimento</label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Selecione um tipo</option>
                {tiposInvestimento
                  ?.filter((t) => t.ativo)
                  .map((tipo) => (
                    <option key={tipo._id} value={tipo.nome}>
                      {tipo.icone} {tipo.nome}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label">Cor</label>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {cores.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setFormData({ ...formData, cor })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.cor === cor
                        ? "border-gray-900 dark:border-white scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="label">Ícone</label>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {icones.map((icone) => (
                  <button
                    key={icone}
                    type="button"
                    onClick={() => setFormData({ ...formData, icone })}
                    className={`w-10 h-10 text-2xl rounded-lg transition-all ${
                      formData.icone === icone
                        ? "bg-primary-100 dark:bg-primary-900/30 scale-110"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {icone}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ativo (disponível para uso)
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              {editing ? "Atualizar" : "Adicionar"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filtro por tipo */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">Todos os tipos</option>
          {tiposInvestimento
            ?.filter((t) => t.ativo)
            .map((tipo) => (
              <option key={tipo._id} value={tipo.nome}>
                {tipo.icone} {tipo.nome}
              </option>
            ))}
        </select>
        {filtroTipo && (
          <button
            onClick={() => setFiltroTipo("")}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Limpar filtro
          </button>
        )}
      </div>

      <div className="space-y-3">
        {produtosFiltrados?.map((produto) => {
          const tipo = tiposInvestimento?.find((t) => t.nome === produto.tipo);
          return (
            <div
              key={produto._id}
              className="card flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: produto.cor }}
                />
                <span className="text-2xl">{produto.icone}</span>
                <div>
                  <h3 className="font-medium">{produto.nome}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Tipo:{" "}
                      {tipo
                        ? `${tipo.icone} ${produto.tipo}`
                        : produto.tipo || "Não definido"}
                    </span>
                    <span
                      className={
                        produto.ativo ? "text-green-600" : "text-red-600"
                      }
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(produto)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(produto._id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
        {produtosFiltrados?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-500">
              {filtroTipo
                ? "Nenhum produto encontrado para este tipo"
                : "Nenhum produto de investimento cadastrado"}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
              Cadastre tipos de investimento primeiro em Configurações → Tipos
              de Investimento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdutosInvestimento;
