import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Plus, Edit, Trash2, GripVertical, X } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  formatarMoeda,
  parseMoeda,
  formatarInputMoeda,
} from "../../utils/format";

const PassivosPadrao = () => {
  const { data: passivos, loading, refetch } = useFetch("/padroes/passivos");
  const { data: categoriasPassivo, refetch: refetchCategorias } = useFetch(
    "/categorias/passivos",
  );
  const [editing, setEditing] = useState(null);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState({
    nome: "",
    cor: "#ef4444",
    icone: "💳",
    ativo: true,
  });
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    valorBase: "",
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
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        categoria:
          typeof formData.categoria === "string"
            ? formData.categoria
            : formData.categoria?.nome || "",
        valorBase: parseMoeda(formData.valorBase),
      };

      if (editing) {
        await api.put(`/padroes/passivos/${editing}`, dataToSend);
        toast.success("Despesa atualizada com sucesso!");
      } else {
        await api.post("/padroes/passivos", dataToSend);
        toast.success("Despesa criada com sucesso!");
      }
      setFormData({ nome: "", categoria: "", valorBase: "", ativo: true });
      setEditing(null);
      refetch();
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error(error.response?.data?.error || "Erro ao salvar despesa");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      try {
        await api.delete(`/padroes/passivos/${id}`);
        toast.success("Despesa excluída com sucesso!");
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao excluir despesa");
      }
    }
  };

  const handleEdit = (passivo) => {
    setEditing(passivo._id);
    setFormData({
      nome: passivo.nome,
      categoria: passivo.categoria || "",
      valorBase: formatarInputMoeda(passivo.valorBase),
      ativo: passivo.ativo,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ nome: "", categoria: "", valorBase: "", ativo: true });
  };

  const handleValorChange = (e) => {
    let value = e.target.value.replace(/[^\d,.]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    setFormData({ ...formData, valorBase: value });
  };

  const handleValorBlur = () => {
    if (formData.valorBase) {
      const num = parseMoeda(formData.valorBase);
      if (num > 0) {
        setFormData({ ...formData, valorBase: formatarInputMoeda(num) });
      }
    }
  };

  const handleCriarCategoria = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categorias/passivos", novaCategoria);
      toast.success("Categoria criada com sucesso!");
      setNovaCategoria({ nome: "", cor: "#ef4444", icone: "💳", ativo: true });
      setShowCategoriaModal(false);
      refetchCategorias();
      setTimeout(() => {
        const categoriaCriada = categoriasPassivo?.find(
          (c) => c.nome === novaCategoria.nome,
        );
        if (categoriaCriada) {
          setFormData({ ...formData, categoria: categoriaCriada.nome });
        }
      }, 300);
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("duplicate")
      ) {
        toast.error("Esta categoria já existe! Use a lista para selecioná-la.");
      } else {
        toast.error(error.response?.data?.error || "Erro ao criar categoria");
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

  const categoriasAtivas = categoriasPassivo?.filter((c) => c.ativo) || [];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold">📋 Despesas Padrão</h1>
      </div>

      <div className="card mb-4 sm:mb-6 p-3 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm label">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="input-field text-sm"
                placeholder="Ex: Conta de Luz"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Categoria</label>
              <div className="flex gap-1.5 sm:gap-2">
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  className="input-field flex-1 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {categoriasAtivas.map((categoria) => (
                    <option key={categoria._id} value={categoria.nome}>
                      {categoria.icone} {categoria.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoriaModal(true)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap text-sm"
                  title="Nova Categoria"
                >
                  +
                </button>
              </div>
              {categoriasAtivas.length === 0 && (
                <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Nenhuma categoria cadastrada. Clique em "+" para criar.
                </p>
              )}
            </div>
            <div>
              <label className="text-xs sm:text-sm label">Valor Base</label>
              <input
                type="text"
                value={formData.valorBase}
                onChange={handleValorChange}
                onBlur={handleValorBlur}
                className="input-field text-sm"
                placeholder="Ex: 10,00 ou 5000"
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
        {passivos?.map((passivo) => {
          const categoria = categoriasPassivo?.find(
            (c) => c.nome === passivo.categoria,
          );
          return (
            <div
              key={passivo._id}
              className="card flex flex-wrap items-center justify-between gap-2 p-2 sm:p-4"
            >
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                {categoria && (
                  <>
                    <div
                      className="w-2 h-2 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoria.cor }}
                    />
                    <span className="text-lg sm:text-2xl flex-shrink-0">
                      {categoria.icone}
                    </span>
                  </>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-medium truncate">
                    {passivo.nome}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="truncate">
                      Cat: {passivo.categoria || "Não definida"}
                    </span>
                    <span className="truncate font-medium text-red-600">
                      Valor: {formatarMoeda(passivo.valorBase)}
                    </span>
                    <span
                      className={
                        passivo.ativo ? "text-green-600" : "text-red-600"
                      }
                    >
                      {passivo.ativo ? "✅ Ativo" : "❌ Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(passivo)}
                  className="p-1 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-3 h-3 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleDelete(passivo._id)}
                  className="p-1 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          );
        })}
        {passivos?.length === 0 && (
          <div className="card text-center py-6 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
              Nenhuma despesa padrão cadastrada
            </p>
            <p className="text-[10px] sm:text-sm text-gray-400 dark:text-gray-600 mt-1 sm:mt-2">
              Cadastre categorias ou use o botão "+"
            </p>
          </div>
        )}
      </div>

      {/* Modal para criar nova categoria */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold">Nova Categoria</h2>
              <button
                onClick={() => setShowCategoriaModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <form
              onSubmit={handleCriarCategoria}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="text-xs sm:text-sm label">Nome</label>
                <input
                  type="text"
                  value={novaCategoria.nome}
                  onChange={(e) =>
                    setNovaCategoria({ ...novaCategoria, nome: e.target.value })
                  }
                  className="input-field text-sm"
                  placeholder="Ex: Moradia, Transporte..."
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Cor</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {cores.map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() =>
                        setNovaCategoria({ ...novaCategoria, cor })
                      }
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                        novaCategoria.cor === cor
                          ? "border-gray-900 dark:border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm label">Ícone</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {icones.map((icone) => (
                    <button
                      key={icone}
                      type="button"
                      onClick={() =>
                        setNovaCategoria({ ...novaCategoria, icone })
                      }
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-2xl rounded-lg transition-all ${
                        novaCategoria.icone === icone
                          ? "bg-primary-100 dark:bg-primary-900/30 scale-110"
                          : "hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {icone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoriaModal(false)}
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

export default PassivosPadrao;
