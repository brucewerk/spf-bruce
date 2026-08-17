import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Plus, Edit, Trash2, GripVertical, X, AlertCircle } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const CategoriasPassivo = () => {
  const {
    data: categorias,
    loading,
    refetch,
  } = useFetch("/categorias/passivos");
  const [editing, setEditing] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cor: "#ef4444",
    icone: "💳",
    ativo: true,
  });

  const cores = [
    "#ef4444",
    "#f87171",
    "#fca5a5",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#f59e0b",
    "#fbbf24",
    "#10b981",
    "#34d399",
    "#3b82f6",
    "#60a5fa",
    "#8b5cf6",
    "#a78bfa",
    "#ec4899",
    "#f472b6",
  ];
  const icones = [
    "💳",
    "🏠",
    "🚗",
    "📚",
    "🍽️",
    "🏥",
    "🎮",
    "🛒",
    "💡",
    "📱",
    "🚌",
    "🎓",
    "💊",
    "🎯",
    "📦",
    "🔄",
    "🛍️",
    "🎨",
    "⚡",
    "🌿",
    "🏋️",
    "🎬",
    "✈️",
    "🏨",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (editing) {
        await api.put(`/categorias/passivos/${editing}`, formData);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await api.post("/categorias/passivos", formData);
        toast.success("Categoria criada com sucesso!");
      }
      setFormData({ nome: "", cor: "#ef4444", icone: "💳", ativo: true });
      setEditing(null);
      setErrorMessage(null);
      refetch();
    } catch (error) {
      console.error("Erro detalhado:", error);
      const errorMsg =
        error.response?.data?.error || "Erro ao salvar categoria";
      setErrorMessage(errorMsg);

      if (error.response?.data?.code === "DUPLICATE") {
        toast.error(`⚠️ ${errorMsg}`);
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete(`/categorias/passivos/${id}`);
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
    setErrorMessage(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ nome: "", cor: "#ef4444", icone: "💳", ativo: true });
    setErrorMessage(null);
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
        <h1 className="text-2xl font-bold">Categorias de Despesas</h1>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
          )}
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
                placeholder="Ex: Moradia, Transporte, Alimentação"
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
              Nenhuma categoria de despesa cadastrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriasPassivo;
