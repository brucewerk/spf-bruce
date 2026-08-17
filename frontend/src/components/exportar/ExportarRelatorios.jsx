import React, { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Loader2,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const ExportarRelatorios = () => {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [exportando, setExportando] = useState(false);
  const [tipo, setTipo] = useState("pdf");

  const anos = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i,
  );

  const handleExportar = async () => {
    setExportando(true);
    try {
      const response = await api.get(`/reports/${tipo}`, {
        params: { year: ano },
        responseType: "blob",
      });

      const extension = tipo === "pdf" ? "pdf" : "xlsx";
      const contentType =
        tipo === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio-${ano}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Relatório ${ano} exportado com sucesso!`);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar relatório");
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📄 Exportar Relatórios</h1>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Selecione o ano</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value))}
                className="input-field"
              >
                {anos.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Formato do relatório</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTipo("pdf")}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  tipo === "pdf"
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  PDF
                </div>
              </button>
              <button
                onClick={() => setTipo("excel")}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  tipo === "excel"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-400"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Excel
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleExportar}
            disabled={exportando}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {exportando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Exportar Relatório
              </>
            )}
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📌 O relatório incluirá: resumo geral, evolução mensal, contas
            bancárias e carteira de investimentos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportarRelatorios;
