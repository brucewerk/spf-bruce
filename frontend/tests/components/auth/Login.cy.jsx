import React from "react";
import Login from "../../../src/components/auth/Login";
import { mountWithProviders } from "../../support/component";

describe("<Login />", () => {
  beforeEach(() => {
    mountWithProviders(<Login />, { theme: true, auth: true, router: true }); // 🔥 auth: true
  });

  it("deve renderizar a tela de login com os campos corretos", () => {
    cy.contains("SPF").should("be.visible");
    cy.contains("Sistema Planilha Financeira").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Entrar").should("be.visible");
    cy.contains("Cadastre-se").should("be.visible");
  });

  it("deve alternar a visibilidade da senha", () => {
    cy.get('input[name="password"]').should("have.attr", "type", "password");
    cy.get('button[type="button"]').click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");
  });

  it("deve mostrar erros de validação ao submeter formulário vazio", () => {
    cy.contains("button", "Entrar").click();
    cy.contains("Informe um e-mail válido.").should("be.visible");
    cy.contains("A senha é obrigatória.").should("be.visible");
  });
});
