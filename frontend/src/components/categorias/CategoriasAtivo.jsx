import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Plus, Edit, Trash2, GripVertical, Palette } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const CategoriasAtivo = () => {
  const { data: categorias, loading, refetch } = useFetch("/categorias/ativos");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cor: "#3b82f6",
    icone: "🏦",
    ativo: true,
  });

  const cores = [
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
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd", // Roxos
    "#ec4899",
    "#f472b6",
    "#f9a8d4", // Rosas
    "#14b8a6",
    "#2dd4bf",
    "#5eead4", // Teals
  ];

  const icones = [
    "🏦",
    "🏠",
    "🚗",
    "📈",
    "💰",
    "💎",
    "🪙",
    "📊",
    "🏢",
    "🚀",
    "⭐",
    "🎯",
    "📦",
    "🔑",
    "💼",
    "📱",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categorias/ativos/${editing}`, formData);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await api.post("/categorias/ativos", formData);
        toast.success("Categoria criada com sucesso!");
      }
      setFormData({ nome: "", cor: "#3b82f6", icone: "🏦", ativo: true });
      setEditing(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar categoria");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete(`/categorias/ativos/${id}`);
        toast.success("Categoria excluída com sucesso!");
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao excluir categoria");
      }
    }
  };

  const handleEdit = (categoria) => {
    setEditing(categoria._id);
    setFormData({
      nome: categoria.nome,
      cor: categoria.cor,
      icone: categoria.icone,
      ativo: categoria.ativo,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ nome: "", cor: "#3b82f6", icone: "🏦", ativo: true });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias de Ativos</h1>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nome da Categoria</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="input-field"
                placeholder="Ex: Imóveis, Veículos, Investimentos"
                required
              />
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
                  Ativa (disponível para uso)
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

      <div className="space-y-3">
        {categorias?.map((categoria) => (
          <div
            key={categoria._id}
            className="card flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: categoria.cor }}
              />
              <span className="text-2xl">{categoria.icone}</span>
              <div>
                <h3 className="font-medium">{categoria.nome}</h3>
                <span
                  className={`text-sm ${categoria.ativo ? "text-green-600" : "text-red-600"}`}
                >
                  {categoria.ativo ? "Ativa" : "Inativa"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(categoria)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(categoria._id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {categorias?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-500">
              Nenhuma categoria de ativo cadastrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriasAtivo;
