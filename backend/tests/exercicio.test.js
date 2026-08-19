process.env.JWT_SECRET = "test-secret-nao-usar-em-producao";
process.env.NODE_ENV = "test";

const request = require("supertest");
const createApp = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./setupTestDB");

const app = createApp();

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

// Registra um usuário e devolve o token, pra não repetir isso em cada teste.
const criarUsuarioEToken = async () => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Bruno Gomes",
    email: `teste-${Date.now()}-${Math.random()}@example.com`,
    password: "senhaSegura123",
  });
  return res.body.token;
};

describe("POST /api/exercicios", () => {
  it("calcula totalAtivos, totalPassivos e variacaoMensal a partir dos padrões cadastrados", async () => {
    const token = await criarUsuarioEToken();
    const auth = { Authorization: `Bearer ${token}` };

    // Dois ativos padrão e um passivo padrão
    await request(app)
      .post("/api/padroes/ativos")
      .set(auth)
      .send({ nome: "Conta Corrente", tipo: "conta", valorBase: 1000 });
    await request(app)
      .post("/api/padroes/ativos")
      .set(auth)
      .send({ nome: "Tesouro Selic", tipo: "investimento", valorBase: 5000 });
    await request(app)
      .post("/api/padroes/passivos")
      .set(auth)
      .send({ nome: "Cartão de Crédito", categoria: "geral", valorBase: 800 });

    const res = await request(app)
      .post("/api/exercicios")
      .set(auth)
      .send({ year: 2026, month: 1 });

    expect(res.status).toBe(201);
    expect(res.body.exercicio.totalAtivos).toBe(6000);
    expect(res.body.exercicio.totalPassivos).toBe(800);
    expect(res.body.exercicio.variacaoMensal).toBe(5200);
    expect(res.body.exercicio.ativos).toHaveLength(2);
  });

  it("não permite criar dois exercícios para o mesmo mês/ano", async () => {
    const token = await criarUsuarioEToken();
    const auth = { Authorization: `Bearer ${token}` };

    await request(app)
      .post("/api/exercicios")
      .set(auth)
      .send({ year: 2026, month: 3 });

    const res = await request(app)
      .post("/api/exercicios")
      .set(auth)
      .send({ year: 2026, month: 3 });

    expect(res.status).toBe(400);
  });

  it("bloqueia criação sem autenticação", async () => {
    const res = await request(app)
      .post("/api/exercicios")
      .send({ year: 2026, month: 1 });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/exercicios?resumo=true", () => {
  it("devolve totais e contagens sem os arrays completos de ativos/passivos", async () => {
    const token = await criarUsuarioEToken();
    const auth = { Authorization: `Bearer ${token}` };

    await request(app)
      .post("/api/padroes/ativos")
      .set(auth)
      .send({ nome: "Conta Corrente", tipo: "conta", valorBase: 1000 });

    await request(app)
      .post("/api/exercicios")
      .set(auth)
      .send({ year: 2026, month: 1 });
    await request(app)
      .post("/api/exercicios")
      .set(auth)
      .send({ year: 2026, month: 2 });

    const res = await request(app)
      .get("/api/exercicios?resumo=true")
      .set(auth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    // O modo resumo não deve trazer os arrays pesados...
    expect(res.body[0].ativos).toBeUndefined();
    // ...mas deve trazer os totais e a contagem calculada via $size
    expect(res.body[0].totalAtivos).toBe(1000);
    expect(res.body[0].qtdAtivos).toBe(1);
  });

  it("cada usuário só vê os próprios exercícios", async () => {
    const tokenA = await criarUsuarioEToken();
    const tokenB = await criarUsuarioEToken();

    await request(app)
      .post("/api/exercicios")
      .set({ Authorization: `Bearer ${tokenA}` })
      .send({ year: 2026, month: 1 });

    const res = await request(app)
      .get("/api/exercicios?resumo=true")
      .set({ Authorization: `Bearer ${tokenB}` });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
