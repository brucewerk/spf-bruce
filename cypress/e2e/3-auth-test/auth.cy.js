describe("Tela de login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("mostra o formulário de login", () => {
    cy.contains("Sistema Planilha Financeira").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Entrar");
  });

  it("mostra erros de validação (Zod) ao enviar o formulário em branco", () => {
    cy.get('button[type="submit"]').click();

    cy.contains("Informe um e-mail válido.").should("be.visible");
    cy.contains("A senha é obrigatória.").should("be.visible");
  });

  it("tem link para a tela de registro", () => {
    cy.contains("a", /criar conta|cadastr/i).should("have.attr", "href");
  });

  it("rejeita login com credenciais inválidas", () => {
    cy.get('input[type="email"]').type("naoexiste@example.com");
    cy.get('input[type="password"]').type("senhaErrada123");
    cy.get('button[type="submit"]').click();

    // A tela deve continuar em /login (não redirecionar) e mostrar um erro
    cy.url().should("include", "/login");
  });
});

describe("Tela de registro", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("mostra o formulário de cadastro", () => {
    cy.contains("Criar nova conta").should("be.visible");
    cy.get('input[type="text"]').should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Criar conta");
  });

  it("acusa senhas que não coincidem", () => {
    cy.get('input[type="text"]').type("Bruno Teste");
    cy.get('input[type="email"]').type("bruno.teste@example.com");
    cy.get('input[type="password"]').first().type("senha123");
    cy.get('input[type="password"]').last().type("senhaDiferente");
    cy.get('button[type="submit"]').click();

    cy.contains("As senhas não coincidem.").should("be.visible");
    // Não deve navegar pra fora de /register com dados inválidos
    cy.url().should("include", "/register");
  });

  it("acusa senha curta antes mesmo de checar a confirmação", () => {
    cy.get('input[type="text"]').type("Bruno Teste");
    cy.get('input[type="email"]').type("bruno.teste@example.com");
    cy.get('input[type="password"]').first().type("123");
    cy.get('input[type="password"]').last().type("123");
    cy.get('button[type="submit"]').click();

    cy.contains("A senha deve ter pelo menos 6 caracteres.").should(
      "be.visible",
    );
  });
});

describe("Rotas protegidas", () => {
  it("redireciona para /login quando não autenticado", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
  });
});
