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

const usuarioValido = {
  name: "Bruno Gomes",
  email: "bruno@example.com",
  password: "senhaSegura123",
};

describe("POST /api/auth/register", () => {
  it("cria um usuário com dados válidos e retorna um token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(usuarioValido);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(usuarioValido.email);
    // Nunca deve devolver o hash da senha
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejeita e-mail inválido (validação era decorativa antes da correção)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...usuarioValido, email: "isso-nao-e-um-email" });

    expect(res.status).toBe(400);
  });

  it("rejeita senha curta", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...usuarioValido, password: "123" });

    expect(res.status).toBe(400);
  });

  it("não permite dois usuários com o mesmo e-mail", async () => {
    await request(app).post("/api/auth/register").send(usuarioValido);
    const res = await request(app)
      .post("/api/auth/register")
      .send(usuarioValido);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(usuarioValido);
  });

  it("autentica com credenciais corretas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: usuarioValido.email,
      password: usuarioValido.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejeita senha incorreta", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: usuarioValido.email,
      password: "senhaErrada",
    });

    expect(res.status).toBe(401);
  });

  it("rejeita e-mail não cadastrado", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "naoexiste@example.com",
      password: usuarioValido.password,
    });

    expect(res.status).toBe(401);
  });
});

describe("Rotas protegidas e logout", () => {
  const getToken = async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(usuarioValido);
    return res.body.token;
  };

  it("bloqueia acesso sem token", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(401);
  });

  it("permite acesso com token válido", async () => {
    const token = await getToken();
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(usuarioValido.email);
  });

  it("invalida o token no servidor depois do logout", async () => {
    const token = await getToken();

    // Antes do logout, o token funciona normalmente
    const antesDoLogout = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(antesDoLogout.status).toBe(200);

    const logoutRes = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(logoutRes.status).toBe(200);

    // Mesmo token, mesmo antes de expirar, agora deve ser rejeitado —
    // é exatamente o bug que a correção de tokenVersion resolveu.
    const depoisDoLogout = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(depoisDoLogout.status).toBe(401);
  });
});
