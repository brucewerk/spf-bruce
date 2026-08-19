import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import {
  Plus,
  Edit,
  Trash2,
  Banknote,
  Building2,
  CreditCard,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  formatarMoeda,
  parseMoeda,
  formatarInputMoeda,
} from "../../utils/format";

const Contas = () => {
  const { data: contas, loading, refetch } = useFetch("/contas");
  const { data: exercicios } = useFetch("/exercicios");
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [saldosAtualizados, setSaldosAtualizados] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    banco: "",
    agencia: "",
    conta: "",
    chavePix: "",
    tipo: "corrente",
    saldoAtual: "",
  });

  const tipos = ["corrente", "investimento", "digital", "poupanca"];

  // Atualizar saldos das contas com base no último exercício
  const atualizarSaldos = async () => {
    setUpdating(true);
    try {
      if (exercicios && exercicios.length > 0) {
        // Pegar o exercício mais recente
        const ultimoExercicio = exercicios.reduce((max, e) => {
          return e.year > max.year ||
            (e.year === max.year && e.month > max.month)
            ? e
            : max;
        }, exercicios[0]);

        if (ultimoExercicio && ultimoExercicio.ativos) {
          // Para cada conta, buscar o valor correspondente no último exercício
          for (const conta of contas || []) {
            const ativoCorrespondente = ultimoExercicio.ativos.find(
              (a) =>
                a.nome.toLowerCase().includes(conta.nome.toLowerCase()) ||
                conta.nome.toLowerCase().includes(a.nome.toLowerCase()),
            );

            if (ativoCorrespondente) {
              await api.put(`/contas/${conta._id}`, {
                ...conta,
                saldoAtual: ativoCorrespondente.valor || 0,
              });
            }
          }
          toast.success("Saldos atualizados com sucesso!");
          setSaldosAtualizados(true);
          refetch();
        }
      }
    } catch (error) {
      toast.error("Erro ao atualizar saldos");
    } finally {
      setUpdating(false);
    }
  };

  // Atualizar automaticamente ao carregar
  useEffect(() => {
    if (
      contas &&
      contas.length > 0 &&
      exercicios &&
      exercicios.length > 0 &&
      !saldosAtualizados
    ) {
      atualizarSaldos();
    }
  }, [contas, exercicios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        saldoAtual: parseMoeda(formData.saldoAtual),
      };

      if (editing) {
        await api.put(`/contas/${editing}`, dataToSend);
        toast.success("Conta atualizada com sucesso!");
      } else {
        await api.post("/contas", dataToSend);
        toast.success("Conta criada com sucesso!");
      }
      setFormData({
        nome: "",
        banco: "",
        agencia: "",
        conta: "",
        chavePix: "",
        tipo: "corrente",
        saldoAtual: "",
      });
      setEditing(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar conta");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta conta?")) {
      try {
        await api.delete(`/contas/${id}`);
        toast.success("Conta excluída com sucesso!");
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao excluir conta");
      }
    }
  };

  const handleEdit = (conta) => {
    setEditing(conta._id);
    setFormData({
      nome: conta.nome,
      banco: conta.banco,
      agencia: conta.agencia,
      conta: conta.conta,
      chavePix: conta.chavePix || "",
      tipo: conta.tipo,
      saldoAtual: formatarInputMoeda(conta.saldoAtual),
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({
      nome: "",
      banco: "",
      agencia: "",
      conta: "",
      chavePix: "",
      tipo: "corrente",
      saldoAtual: "",
    });
  };

  const handleValorChange = (e) => {
    let value = e.target.value.replace(/[^\d,.]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    setFormData({ ...formData, saldoAtual: value });
  };

  const handleValorBlur = () => {
    if (formData.saldoAtual) {
      const num = parseMoeda(formData.saldoAtual);
      if (num > 0) {
        setFormData({ ...formData, saldoAtual: formatarInputMoeda(num) });
      }
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case "corrente":
        return <Banknote className="w-6 h-6 text-blue-500" />;
      case "investimento":
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case "digital":
        return <CreditCard className="w-6 h-6 text-purple-500" />;
      default:
        return <Building2 className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalSaldos =
    contas?.reduce((sum, c) => sum + (c.saldoAtual || 0), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contas</h1>
        <button
          onClick={atualizarSaldos}
          disabled={updating}
          className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
          title="Atualizar saldos dos exercícios"
        >
          <RefreshCw className={`w-5 h-5 ${updating ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="card bg-primary-50 dark:bg-primary-900/20 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total em Contas
        </p>
        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {formatarMoeda(totalSaldos)}
        </p>
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
                placeholder="Ex: Conta Corrente"
                required
              />
            </div>
            <div>
              <label className="label">Banco</label>
              <input
                type="number"
                value={formData.banco}
                onChange={(e) =>
                  setFormData({ ...formData, banco: e.target.value })
                }
                className="input-field"
                placeholder="Código do banco"
                required
              />
            </div>
            <div>
              <label className="label">Agência</label>
              <input
                type="text"
                value={formData.agencia}
                onChange={(e) =>
                  setFormData({ ...formData, agencia: e.target.value })
                }
                className="input-field"
                placeholder="Agência"
                required
              />
            </div>
            <div>
              <label className="label">Conta</label>
              <input
                type="text"
                value={formData.conta}
                onChange={(e) =>
                  setFormData({ ...formData, conta: e.target.value })
                }
                className="input-field"
                placeholder="Número da conta"
                required
              />
            </div>
            <div>
              <label className="label">Chave Pix</label>
              <input
                type="text"
                value={formData.chavePix}
                onChange={(e) =>
                  setFormData({ ...formData, chavePix: e.target.value })
                }
                className="input-field"
                placeholder="Chave Pix"
              />
            </div>
            <div>
              <label className="label">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className="input-field"
              >
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Saldo Atual</label>
              <input
                type="text"
                value={formData.saldoAtual}
                onChange={handleValorChange}
                onBlur={handleValorBlur}
                className="input-field"
                placeholder="Ex: 10,00 ou 5000"
              />
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
        {contas?.map((conta) => (
          <div
            key={conta._id}
            className="card flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 flex-1">
              {getIcon(conta.tipo)}
              <div>
                <h3 className="font-medium">{conta.nome}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Banco: {conta.banco}</span>
                  <span>Ag: {conta.agencia}</span>
                  <span>Conta: {conta.conta}</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    Saldo: {formatarMoeda(conta.saldoAtual)}
                  </span>
                </div>
                {conta.chavePix && (
                  <span className="text-xs text-gray-400">
                    Pix: {conta.chavePix}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(conta)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(conta._id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {contas?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-500">
              Nenhuma conta cadastrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contas;
