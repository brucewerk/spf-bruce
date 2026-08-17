/**
 * Formata um número para moeda brasileira (R$)
 * Exemplo: 3549156.21 -> "R$ 3.549.156,21"
 * Exemplo: 430000 -> "R$ 430.000,00"
 * Exemplo: 3559433.34 -> "R$ 3.559.433,34"
 */
export const formatarMoeda = (valor) => {
  if (valor === undefined || valor === null || isNaN(valor)) {
    return "R$ 0,00";
  }

  const num =
    typeof valor === "string"
      ? parseFloat(valor.replace(/\./g, "").replace(",", "."))
      : valor;

  if (isNaN(num)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Remove formatação e converte string para número
 * Exemplo: "R$ 3.549.156,21" -> 3549156.21
 * Exemplo: "3.549.156,21" -> 3549156.21
 * Exemplo: "3549156,21" -> 3549156.21
 * Exemplo: "10,00" -> 10.00
 * Exemplo: "5000" -> 5000.00
 */
export const parseMoeda = (valor) => {
  if (!valor) return 0;

  // Remove R$, espaços e converte vírgula para ponto
  let clean = String(valor)
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "") // Remove pontos de milhar
    .replace(",", "."); // Converte vírgula decimal para ponto

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Formata para exibição em inputs (sem R$)
 * Exemplo: 3549156.21 -> "3.549.156,21"
 * Exemplo: 10 -> "10,00"
 * Exemplo: 5000 -> "5.000,00"
 */
export const formatarInputMoeda = (valor) => {
  if (valor === undefined || valor === null || isNaN(valor)) {
    return "";
  }

  const num =
    typeof valor === "string"
      ? parseFloat(valor.replace(/\./g, "").replace(",", "."))
      : valor;

  if (isNaN(num)) return "";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Converte string digitada para número mantendo o valor correto
 * Exemplo: "10" -> 10
 * Exemplo: "10,00" -> 10.00
 * Exemplo: "5000" -> 5000
 * Exemplo: "5.000,00" -> 5000.00
 */
export const converterParaNumero = (valor) => {
  if (!valor) return 0;

  // Remove tudo que não é número, vírgula ou ponto
  let clean = String(valor).replace(/[^\d,.]/g, "");

  // Se tiver vírgula, converte para ponto (decimal)
  if (clean.includes(",")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  }

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};
