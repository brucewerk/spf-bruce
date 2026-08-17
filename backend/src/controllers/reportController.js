const ExcelJS = require("exceljs");
const Exercicio = require("../models/Exercicio");
const Conta = require("../models/Conta");
const Investimento = require("../models/Investimento");

// ============================================
// FUNÇÃO AUXILIAR: FORMATAR MOEDA
// ============================================

const formatarMoeda = (valor) => {
  if (valor === undefined || valor === null || isNaN(valor)) {
    return "R$ 0,00";
  }
  const num = typeof valor === "string" ? parseFloat(valor) : valor;
  return `R$ ${num
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

// ============================================
// FUNÇÃO AUXILIAR: BUSCAR INVESTIMENTOS POR USUÁRIO
// ============================================

const buscarInvestimentosPorUsuario = async (userId) => {
  try {
    // Buscar usando o modelo diretamente com filtro explícito
    const investimentos = await Investimento.find({
      userId: userId,
    }).lean();

    console.log(
      `🔍 Busca direta por userId: ${userId} -> ${investimentos.length} investimentos`,
    );

    // Filtrar novamente em memória para garantir
    const filtrados = investimentos.filter((i) => {
      const idStr = i.userId?.toString?.() || "";
      const userIdStr = userId?.toString?.() || "";
      return idStr === userIdStr;
    });

    console.log(`🔍 Após filtro em memória: ${filtrados.length} investimentos`);

    if (filtrados.length > 0) {
      filtrados.forEach((i) => {
        console.log(`  - ${i.nome} (userId: ${i.userId})`);
      });
    }

    return filtrados;
  } catch (error) {
    console.error("❌ Erro ao buscar investimentos:", error);
    return [];
  }
};

// ============================================
// 1. EXPORTAR RELATÓRIO PDF
// ============================================

const gerarRelatorioPDF = async (req, res) => {
  try {
    const userId = req.userId;
    const { year } = req.query;

    console.log(`📄 Gerando relatório PDF para ${year} - Usuário ${userId}`);

    // Buscar dados explicitamente
    const exercicios = await Exercicio.find({
      userId: userId,
      year: parseInt(year),
    }).sort({ month: 1 });

    const contas = await Conta.find({
      userId: userId,
    });

    // Buscar investimentos com função específica
    const investimentos = await buscarInvestimentosPorUsuario(userId);

    console.log(
      `📊 Dados encontrados: ${exercicios.length} exercícios, ${contas.length} contas, ${investimentos.length} investimentos`,
    );

    // Calcular totais
    const totalAtivos = exercicios.reduce(
      (sum, e) => sum + (e.totalAtivos || 0),
      0,
    );
    const totalPassivos = exercicios.reduce(
      (sum, e) => sum + (e.totalPassivos || 0),
      0,
    );
    const totalInvestimentos = investimentos.reduce(
      (sum, i) => sum + (i.saldoBruto || 0),
      0,
    );
    const totalPatrimonio = totalAtivos - totalPassivos;
    const totalContas = contas.reduce((sum, c) => sum + (c.saldoAtual || 0), 0);

    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    // Definir conteúdo do PDF
    const docDefinition = {
      content: [
        {
          text: `Relatorio Financeiro - ${year}`,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          text: `Gerado em: ${new Date().toLocaleDateString("pt-BR")} as ${new Date().toLocaleTimeString("pt-BR")}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        {
          text: "Resumo Geral",
          style: "sectionHeader",
          margin: [0, 10, 0, 10],
        },
        {
          ul: [
            `Total de Ativos: ${formatarMoeda(totalAtivos)}`,
            `Total de Passivos: ${formatarMoeda(totalPassivos)}`,
            `Patrimonio Liquido: ${formatarMoeda(totalPatrimonio)}`,
            `Total de Investimentos: ${formatarMoeda(totalInvestimentos)}`,
            `Total em Contas: ${formatarMoeda(totalContas)}`,
          ],
          margin: [0, 0, 0, 15],
        },

        ...(exercicios.length > 0
          ? [
              {
                text: "Evolucao Mensal",
                style: "sectionHeader",
                margin: [0, 10, 0, 10],
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["auto", "auto", "auto", "auto"],
                  body: [
                    ["Mes", "Ativos", "Passivos", "Patrimonio"],
                    ...exercicios.map((e) => {
                      const patrimonio =
                        (e.totalAtivos || 0) - (e.totalPassivos || 0);
                      return [
                        meses[e.month - 1] || e.month,
                        formatarMoeda(e.totalAtivos || 0),
                        formatarMoeda(e.totalPassivos || 0),
                        formatarMoeda(patrimonio),
                      ];
                    }),
                    [
                      { text: "TOTAL", bold: true },
                      { text: formatarMoeda(totalAtivos), bold: true },
                      { text: formatarMoeda(totalPassivos), bold: true },
                      { text: formatarMoeda(totalPatrimonio), bold: true },
                    ],
                  ],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 15],
              },
            ]
          : []),

        ...(contas.length > 0
          ? [
              {
                text: "Contas Bancarias",
                style: "sectionHeader",
                margin: [0, 10, 0, 10],
              },
              ...contas.map((c) => ({
                text: `- ${c.nome}: ${formatarMoeda(c.saldoAtual || 0)}`,
                margin: [0, 3, 0, 3],
              })),
              { text: " ", margin: [0, 5, 0, 5] },
            ]
          : []),

        ...(investimentos.length > 0
          ? [
              {
                text: "Carteira de Investimentos",
                style: "sectionHeader",
                margin: [0, 10, 0, 10],
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "auto", "auto"],
                  body: [
                    ["Nome", "Compra", "Saldo", "Rendimento"],
                    ...investimentos.map((i) => {
                      const rendimento =
                        (i.saldoBruto || 0) - (i.valorCompra || 0);
                      return [
                        i.nome || "N/A",
                        formatarMoeda(i.valorCompra || 0),
                        formatarMoeda(i.saldoBruto || 0),
                        formatarMoeda(rendimento),
                      ];
                    }),
                  ],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 15],
              },
            ]
          : []),

        {
          text: "---",
          alignment: "center",
          margin: [0, 20, 0, 10],
        },
        {
          text: "SPF - Sistema Planilha Financeira by BruCe",
          style: "footer",
          alignment: "center",
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: "#2563eb",
        },
        subheader: {
          fontSize: 10,
          color: "#666666",
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: "#1e293b",
        },
        footer: {
          fontSize: 9,
          color: "#999999",
          margin: [0, 5, 0, 0],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    const PdfPrinter = require("pdfmake");

    const fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=relatorio-${year}.pdf`,
    );

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("❌ Erro ao gerar PDF:", error);
    res
      .status(500)
      .json({ error: "Erro ao gerar relatorio PDF: " + error.message });
  }
};

// ============================================
// 2. EXPORTAR RELATÓRIO EXCEL
// ============================================

const gerarRelatorioExcel = async (req, res) => {
  try {
    const userId = req.userId;
    const { year } = req.query;

    console.log(`📊 Gerando relatorio Excel para ${year} - Usuario ${userId}`);

    const exercicios = await Exercicio.find({
      userId: userId,
      year: parseInt(year),
    }).sort({ month: 1 });

    const contas = await Conta.find({
      userId: userId,
    });

    // Buscar investimentos com função específica
    const investimentos = await buscarInvestimentosPorUsuario(userId);

    console.log(
      `📊 Encontrados: ${exercicios.length} exercicios, ${contas.length} contas, ${investimentos.length} investimentos`,
    );

    // Calcular totais
    const totalAtivos = exercicios.reduce(
      (sum, e) => sum + (e.totalAtivos || 0),
      0,
    );
    const totalPassivos = exercicios.reduce(
      (sum, e) => sum + (e.totalPassivos || 0),
      0,
    );
    const totalPatrimonio = totalAtivos - totalPassivos;
    const totalInvestimentos = investimentos.reduce(
      (sum, i) => sum + (i.saldoBruto || 0),
      0,
    );
    const totalContas = contas.reduce((sum, c) => sum + (c.saldoAtual || 0), 0);

    const workbook = new ExcelJS.Workbook();
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Marco",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    // ===== Planilha: Resumo =====
    const sheetResumo = workbook.addWorksheet("Resumo");
    sheetResumo.addRow(["SPF - Sistema Planilha Financeira"]);
    sheetResumo.addRow([`Relatorio ${year}`]);
    sheetResumo.addRow([
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
    ]);
    sheetResumo.addRow([]);

    const headerRow = sheetResumo.addRow(["Indicador", "Valor"]);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };

    sheetResumo.addRow(["Total de Ativos", totalAtivos]);
    sheetResumo.addRow(["Total de Passivos", totalPassivos]);
    sheetResumo.addRow(["Patrimonio Liquido", totalPatrimonio]);
    sheetResumo.addRow(["Total de Investimentos", totalInvestimentos]);
    sheetResumo.addRow(["Total em Contas", totalContas]);

    sheetResumo.getColumn(2).numFmt = '"R$ "#,##0.00';

    // ===== Planilha: Evolução Mensal =====
    const sheetEvolucao = workbook.addWorksheet("Evolucao Mensal");
    const headerEvolucao = sheetEvolucao.addRow([
      "Mes",
      "Ativos",
      "Passivos",
      "Patrimonio",
    ]);
    headerEvolucao.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerEvolucao.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };

    exercicios.forEach((e) => {
      const patrimonio = (e.totalAtivos || 0) - (e.totalPassivos || 0);
      sheetEvolucao.addRow([
        meses[e.month - 1] || e.month,
        e.totalAtivos || 0,
        e.totalPassivos || 0,
        patrimonio,
      ]);
    });

    if (exercicios.length > 0) {
      const totalPatrimonioGeral = exercicios.reduce(
        (s, e) => s + ((e.totalAtivos || 0) - (e.totalPassivos || 0)),
        0,
      );
      const totalRow = sheetEvolucao.addRow([
        "TOTAL",
        totalAtivos,
        totalPassivos,
        totalPatrimonioGeral,
      ]);
      totalRow.font = { bold: true };
      totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE5E7EB" },
      };
    }

    sheetEvolucao.getColumn(2).numFmt = '"R$ "#,##0.00';
    sheetEvolucao.getColumn(3).numFmt = '"R$ "#,##0.00';
    sheetEvolucao.getColumn(4).numFmt = '"R$ "#,##0.00';

    // ===== Planilha: Contas =====
    const sheetContas = workbook.addWorksheet("Contas");
    const headerContas = sheetContas.addRow([
      "Nome",
      "Banco",
      "Agencia",
      "Conta",
      "Chave Pix",
      "Saldo",
    ]);
    headerContas.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerContas.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8B5CF6" },
    };

    contas.forEach((c) => {
      sheetContas.addRow([
        c.nome,
        c.banco,
        c.agencia,
        c.conta,
        c.chavePix || "",
        c.saldoAtual || 0,
      ]);
    });
    sheetContas.getColumn(6).numFmt = '"R$ "#,##0.00';

    // ===== Planilha: Investimentos =====
    const sheetInvestimentos = workbook.addWorksheet("Investimentos");
    const headerInvest = sheetInvestimentos.addRow([
      "Nome",
      "Tipo",
      "Produto",
      "Valor Compra",
      "Saldo Bruto",
      "Rendimento",
      "Taxa (%)",
    ]);
    headerInvest.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerInvest.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10B981" },
    };

    investimentos.forEach((i) => {
      const rendimento = (i.saldoBruto || 0) - (i.valorCompra || 0);
      sheetInvestimentos.addRow([
        i.nome || "",
        i.tipo || "",
        i.produto || "",
        i.valorCompra || 0,
        i.saldoBruto || 0,
        rendimento,
        i.taxaAno || 0,
      ]);
    });

    sheetInvestimentos.getColumn(4).numFmt = '"R$ "#,##0.00';
    sheetInvestimentos.getColumn(5).numFmt = '"R$ "#,##0.00';
    sheetInvestimentos.getColumn(6).numFmt = '"R$ "#,##0.00';
    sheetInvestimentos.getColumn(7).numFmt = "0.00";

    [sheetResumo, sheetEvolucao, sheetContas, sheetInvestimentos].forEach(
      (sheet) => {
        sheet.columns.forEach((col) => {
          col.width = 24;
        });
      },
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=relatorio-${year}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Erro ao gerar Excel:", error);
    res
      .status(500)
      .json({ error: "Erro ao gerar relatorio Excel: " + error.message });
  }
};

// ============================================
// 3. DASHBOARD DE ANÁLISES AVANÇADAS
// ============================================

const getAnalisesAvancadas = async (req, res) => {
  try {
    const userId = req.userId;

    const exercicios = await Exercicio.find({ userId }).sort({
      year: 1,
      month: 1,
    });
    const investimentos = await buscarInvestimentosPorUsuario(userId);
    const contas = await Conta.find({ userId });

    // ... resto do código igual ...
    const crescimento = [];
    let anterior = 0;
    exercicios.forEach((e, index) => {
      const patrimonio = (e.totalAtivos || 0) - (e.totalPassivos || 0);
      const variacao = index === 0 ? 0 : patrimonio - anterior;
      crescimento.push({
        periodo: `${e.month}/${e.year}`,
        patrimonio,
        variacao,
        variacaoPercentual: anterior > 0 ? (variacao / anterior) * 100 : 0,
      });
      anterior = patrimonio;
    });

    const analiseInvestimentos = {
      totalInvestido: investimentos.reduce(
        (s, i) => s + (i.valorCompra || 0),
        0,
      ),
      saldoTotal: investimentos.reduce((s, i) => s + (i.saldoBruto || 0), 0),
      rendimentoTotal: investimentos.reduce(
        (s, i) => s + ((i.saldoBruto || 0) - (i.valorCompra || 0)),
        0,
      ),
      quantidade: investimentos.length,
      porTipo: investimentos.reduce((acc, i) => {
        const tipo = i.tipo || "Outros";
        if (!acc[tipo]) acc[tipo] = { quantidade: 0, total: 0 };
        acc[tipo].quantidade++;
        acc[tipo].total += i.saldoBruto || 0;
        return acc;
      }, {}),
    };

    const totalAtivosHistorico = exercicios.reduce(
      (s, e) => s + (e.totalAtivos || 0),
      0,
    );
    const totalPassivosHistorico = exercicios.reduce(
      (s, e) => s + (e.totalPassivos || 0),
      0,
    );
    const eficiencia = {
      totalAtivosHistorico,
      totalPassivosHistorico,
      mediaAtivos:
        exercicios.length > 0 ? totalAtivosHistorico / exercicios.length : 0,
      mediaPassivos:
        exercicios.length > 0 ? totalPassivosHistorico / exercicios.length : 0,
      melhorMes: exercicios.reduce((best, e) => {
        const patrimonio = (e.totalAtivos || 0) - (e.totalPassivos || 0);
        if (!best || patrimonio > best.patrimonio) {
          return { mes: `${e.month}/${e.year}`, patrimonio };
        }
        return best;
      }, null),
      piorMes: exercicios.reduce((worst, e) => {
        const patrimonio = (e.totalAtivos || 0) - (e.totalPassivos || 0);
        if (!worst || patrimonio < worst.patrimonio) {
          return { mes: `${e.month}/${e.year}`, patrimonio };
        }
        return worst;
      }, null),
    };

    const ultimos3 = exercicios.slice(-3);
    const mediaProjecao =
      ultimos3.length > 0
        ? ultimos3.reduce(
            (s, e) => s + ((e.totalAtivos || 0) - (e.totalPassivos || 0)),
            0,
          ) / ultimos3.length
        : 0;

    res.json({
      crescimento,
      analiseInvestimentos,
      eficiencia,
      projecao: {
        mediaPatrimonio: mediaProjecao,
        projecaoAnual: mediaProjecao * 12,
        baseMeses: ultimos3.length,
      },
      resumo: {
        totalExercicios: exercicios.length,
        totalContas: contas.length,
        totalInvestimentos: investimentos.length,
        primeiroRegistro:
          exercicios.length > 0
            ? `${exercicios[0].month}/${exercicios[0].year}`
            : null,
        ultimoRegistro:
          exercicios.length > 0
            ? `${exercicios[exercicios.length - 1].month}/${exercicios[exercicios.length - 1].year}`
            : null,
      },
    });
  } catch (error) {
    console.error("❌ Erro nas analises:", error);
    res.status(500).json({ error: "Erro ao gerar analises: " + error.message });
  }
};

// ============================================
// 4. NOTIFICAÇÕES
// ============================================

const getNotificacoes = async (req, res) => {
  try {
    const userId = req.userId;

    const exercicios = await Exercicio.find({ userId })
      .sort({ year: -1, month: -1 })
      .limit(12);
    const investimentos = await buscarInvestimentosPorUsuario(userId);

    const ultimoExercicio = exercicios[0];
    const notificacoes = [];

    if (ultimoExercicio && ultimoExercicio.passivos) {
      const despesas = ultimoExercicio.passivos.filter((p) => p.valor > 0);
      if (despesas.length > 0) {
        notificacoes.push({
          id: `despesas-${Date.now()}`,
          tipo: "warning",
          titulo: "Despesas Registradas",
          mensagem: `Voce tem ${despesas.length} despesas registradas no ultimo mes.`,
          data: new Date(),
          lida: false,
        });
      }
    }

    if (exercicios.length > 1) {
      const atual =
        (exercicios[0].totalAtivos || 0) - (exercicios[0].totalPassivos || 0);
      const anterior =
        (exercicios[1].totalAtivos || 0) - (exercicios[1].totalPassivos || 0);
      if (atual < anterior && anterior > 0) {
        const quedaPercentual = ((anterior - atual) / anterior) * 100;
        if (quedaPercentual > 5) {
          notificacoes.push({
            id: `queda-${Date.now()}`,
            tipo: "danger",
            titulo: "Queda Patrimonial",
            mensagem: `Seu patrimonio caiu ${quedaPercentual.toFixed(1)}% no ultimo mes.`,
            data: new Date(),
            lida: false,
          });
        }
      }
    }

    const investimentosNegativos = investimentos.filter(
      (i) => (i.saldoBruto || 0) < (i.valorCompra || 0),
    );
    if (investimentosNegativos.length > 0) {
      notificacoes.push({
        id: `invest-neg-${Date.now()}`,
        tipo: "warning",
        titulo: "Investimentos com Perda",
        mensagem: `${investimentosNegativos.length} investimento(s) estao com rendimento negativo.`,
        data: new Date(),
        lida: false,
      });
    }

    if (ultimoExercicio && ultimoExercicio.totalPassivos > 0) {
      const proporcao =
        (ultimoExercicio.totalPassivos / (ultimoExercicio.totalAtivos || 1)) *
        100;
      if (proporcao > 30) {
        notificacoes.push({
          id: `dica-${Date.now()}`,
          tipo: "info",
          titulo: "Dica do Dia",
          mensagem:
            "Seus passivos representam mais de 30% dos ativos. Revise suas despesas.",
          data: new Date(),
          lida: false,
        });
      }
    }

    if (investimentos.length === 0) {
      notificacoes.push({
        id: `meta-${Date.now()}`,
        tipo: "info",
        titulo: "Comece a Investir!",
        mensagem: "Voce ainda nao tem investimentos cadastrados. Comece hoje!",
        data: new Date(),
        lida: false,
      });
    }

    notificacoes.sort((a, b) => b.data - a.data);
    res.json(notificacoes);
  } catch (error) {
    console.error("❌ Erro ao gerar notificacoes:", error);
    res
      .status(500)
      .json({ error: "Erro ao gerar notificacoes: " + error.message });
  }
};

const marcarNotificacaoLida = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: "Notificacao marcada como lida.", id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao marcar notificacao: " + error.message });
  }
};

module.exports = {
  gerarRelatorioPDF,
  gerarRelatorioExcel,
  getAnalisesAvancadas,
  getNotificacoes,
  marcarNotificacaoLida,
};
