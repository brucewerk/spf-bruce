// Comandos customizados do Cypress para os testes E2E do SPF.
// Ver: https://on.cypress.io/custom-commands

/**
 * Preenche e envia o formulário de login.
 * Uso: cy.login('email@example.com', 'senha123')
 */
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
