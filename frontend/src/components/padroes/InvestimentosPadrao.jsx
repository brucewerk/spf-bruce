import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Plus, Edit, Trash2, TrendingUp, GripVertical } from "lucide-react";
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
  const { data: tiposInvestimento } = useFetch("/tipos-investimento");
  const { data: produtosInvestimento } = useFetch("/produtos-investimento");
  const [editing, setEditing] = useState(null);
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
    // Permite apenas números, vírgula e ponto
    let value = e.target.value.replace(/[^\d,.]/g, "");

    // Se tiver vírgula, garante que seja a única
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
        <h1 className="text-2xl font-bold">Investimentos Padrão</h1>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo</label>
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
              <label className="label">Produto</label>
              <select
                value={formData.produto}
                onChange={(e) =>
                  setFormData({ ...formData, produto: e.target.value })
                }
                className="input-field"
                required
                disabled={!formData.tipo}
              >
                <option value="">
                  {formData.tipo
                    ? "Selecione um produto"
                    : "Selecione um tipo primeiro"}
                </option>
                {produtosFiltrados.map((produto) => (
                  <option key={produto._id} value={produto.nome}>
                    {produto.icone} {produto.nome}
                  </option>
                ))}
              </select>
              {formData.tipo && produtosFiltrados.length === 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Nenhum produto cadastrado para este tipo. Cadastre em
                  Configurações → Produtos de Investimento
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="label">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="input-field"
                placeholder="Nome completo do investimento"
                required
              />
            </div>
            <div>
              <label className="label">Data Emissão</label>
              <input
                type="date"
                value={formData.emissao}
                onChange={(e) =>
                  setFormData({ ...formData, emissao: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Data Vencimento</label>
              <input
                type="date"
                value={formData.vencimento}
                onChange={(e) =>
                  setFormData({ ...formData, vencimento: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Valor Compra</label>
              <input
                type="text"
                value={formData.valorCompra}
                onChange={(e) => handleValorChange("valorCompra", e)}
                onBlur={() => handleValorBlur("valorCompra")}
                className="input-field"
                placeholder="Ex: 10,00 ou 5000"
                required
              />
            </div>
            <div>
              <label className="label">Saldo Bruto</label>
              <input
                type="text"
                value={formData.saldoBruto}
                onChange={(e) => handleValorChange("saldoBruto", e)}
                onBlur={() => handleValorBlur("saldoBruto")}
                className="input-field"
                placeholder="Ex: 10,00 ou 5000"
                required
              />
            </div>
            <div>
              <label className="label">Taxa (% ao ano)</label>
              <input
                type="number"
                step="0.01"
                value={formData.taxaAno}
                onChange={(e) =>
                  setFormData({ ...formData, taxaAno: e.target.value })
                }
                className="input-field"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="label">IR e IOF</label>
              <input
                type="text"
                value={formData.irIof}
                onChange={(e) => handleValorChange("irIof", e)}
                onBlur={() => handleValorBlur("irIof")}
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
        {investimentos?.map((invest) => {
          const tipo = tiposInvestimento?.find((t) => t.nome === invest.tipo);
          const produto = produtosInvestimento?.find(
            (p) => p.nome === invest.produto,
          );
          return (
            <div
              key={invest._id}
              className="card flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-gray-400" />
                {produto && (
                  <>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: produto.cor }}
                    />
                    <span className="text-2xl">{produto.icone}</span>
                  </>
                )}
                <div>
                  <h3 className="font-medium">{invest.nome}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Tipo:{" "}
                      {tipo
                        ? `${tipo.icone} ${invest.tipo}`
                        : invest.tipo || "Não definido"}
                    </span>
                    <span>
                      Produto:{" "}
                      {produto
                        ? `${produto.icone} ${invest.produto}`
                        : invest.produto || "Não definido"}
                    </span>
                    <span>Compra: {formatarMoeda(invest.valorCompra)}</span>
                    <span>Saldo: {formatarMoeda(invest.saldoBruto)}</span>
                    <span
                      className={
                        invest.ativo ? "text-green-600" : "text-red-600"
                      }
                    >
                      {invest.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(invest)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(invest._id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
        {investimentos?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-500">
              Nenhum investimento padrão cadastrado
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
              Cadastre tipos e produtos de investimento primeiro em
              Configurações
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestimentosPadrao;
