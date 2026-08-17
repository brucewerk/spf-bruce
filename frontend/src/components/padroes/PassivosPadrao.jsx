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
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Despesas Padrão</h1>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="input-field"
                placeholder="Ex: Conta de Luz"
                required
              />
            </div>
            <div>
              <label className="label">Categoria</label>
              <div className="flex gap-2">
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  className="input-field flex-1"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriasAtivas.map((categoria) => (
                    <option key={categoria._id} value={categoria.nome}>
                      {categoria.icone} {categoria.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoriaModal(true)}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap"
                  title="Nova Categoria"
                >
                  +
                </button>
              </div>
              {categoriasAtivas.length === 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Nenhuma categoria cadastrada. Clique em "+" para criar uma.
                </p>
              )}
            </div>
            <div>
              <label className="label">Valor Base</label>
              <input
                type="text"
                value={formData.valorBase}
                onChange={handleValorChange}
                onBlur={handleValorBlur}
                className="input-field"
                placeholder="Ex: 10,00 ou 5000"
              />
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
                  Ativo (incluído automaticamente)
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
        {passivos?.map((passivo) => {
          const categoria = categoriasPassivo?.find(
            (c) => c.nome === passivo.categoria,
          );
          return (
            <div
              key={passivo._id}
              className="card flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-gray-400" />
                {categoria && (
                  <>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoria.cor }}
                    />
                    <span className="text-2xl">{categoria.icone}</span>
                  </>
                )}
                <div>
                  <h3 className="font-medium">{passivo.nome}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Categoria: {passivo.categoria || "Não definida"}
                    </span>
                    <span>Valor: {formatarMoeda(passivo.valorBase)}</span>
                    <span
                      className={
                        passivo.ativo ? "text-green-600" : "text-red-600"
                      }
                    >
                      {passivo.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(passivo)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(passivo._id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
        {passivos?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-500">
              Nenhuma despesa padrão cadastrada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
              Cadastre categorias de despesas primeiro ou use o botão "+" no
              formulário
            </p>
          </div>
        )}
      </div>

      {/* Modal para criar nova categoria */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nova Categoria de Despesa</h2>
              <button
                onClick={() => setShowCategoriaModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCriarCategoria} className="space-y-4">
              <div>
                <label className="label">Nome</label>
                <input
                  type="text"
                  value={novaCategoria.nome}
                  onChange={(e) =>
                    setNovaCategoria({ ...novaCategoria, nome: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Moradia, Transporte..."
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
                      onClick={() =>
                        setNovaCategoria({ ...novaCategoria, cor })
                      }
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
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
                <label className="label">Ícone</label>
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {icones.map((icone) => (
                    <button
                      key={icone}
                      type="button"
                      onClick={() =>
                        setNovaCategoria({ ...novaCategoria, icone })
                      }
                      className={`w-10 h-10 text-2xl rounded-lg transition-all ${
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoriaModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Criar Categoria
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
