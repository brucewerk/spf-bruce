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

  it("mostra erro de validação do navegador se enviar em branco", () => {
    cy.get('input[type="email"]:invalid').should("exist");
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

describe("Rotas protegidas", () => {
  it("redireciona para /login quando não autenticado", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
  });
});
