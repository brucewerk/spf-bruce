const { calcularTotais } = require("../src/services/exercicioService");

describe("calcularTotais (função pura, sem banco de dados)", () => {
  it("soma os valores de ativos e passivos corretamente", () => {
    const resultado = calcularTotais({
      ativos: [{ valor: 1000 }, { valor: 5000 }],
      passivos: [{ valor: 800 }],
    });

    expect(resultado.totalAtivos).toBe(6000);
    expect(resultado.totalPassivos).toBe(800);
    expect(resultado.variacaoMensal).toBe(5200);
  });

  it("trata arrays vazios como zero, sem quebrar", () => {
    const resultado = calcularTotais({ ativos: [], passivos: [] });

    expect(resultado).toEqual({
      totalAtivos: 0,
      totalPassivos: 0,
      variacaoMensal: 0,
    });
  });

  it("trata ativos/passivos ausentes (undefined) como arrays vazios", () => {
    const resultado = calcularTotais({});

    expect(resultado).toEqual({
      totalAtivos: 0,
      totalPassivos: 0,
      variacaoMensal: 0,
    });
  });

  it("trata item sem campo valor como zero (não gera NaN)", () => {
    const resultado = calcularTotais({
      ativos: [{ valor: 100 }, { nome: "sem valor definido" }],
      passivos: [],
    });

    expect(resultado.totalAtivos).toBe(100);
    expect(Number.isNaN(resultado.totalAtivos)).toBe(false);
  });

  it("permite variacaoMensal negativa quando passivos superam ativos", () => {
    const resultado = calcularTotais({
      ativos: [{ valor: 500 }],
      passivos: [{ valor: 2000 }],
    });

    expect(resultado.variacaoMensal).toBe(-1500);
  });
});
