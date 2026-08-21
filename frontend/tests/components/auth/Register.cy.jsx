import React from "react";
import Register from "../../../src/components/auth/Register";
import { mountWithProviders } from "../../support/component";

describe("<Register />", () => {
  beforeEach(() => {
    mountWithProviders(<Register />, { theme: true, auth: true, router: true }); // 🔥 auth: true
  });

  it("deve renderizar o formulário de cadastro corretamente", () => {
    cy.contains("SPF").should("be.visible");
    cy.contains("Criar nova conta").should("be.visible");
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="confirmPassword"]').should("be.visible");
    cy.contains("button", "Criar conta").should("be.visible");
    cy.contains("Faça login").should("be.visible");
  });

  it("deve validar senhas que não coincidem", () => {
    cy.get('input[name="password"]').type("senha123");
    cy.get('input[name="confirmPassword"]').type("senha321");
    cy.contains("button", "Criar conta").click();
    cy.contains("As senhas não coincidem.").should("be.visible");
  });

  it("deve validar senha curta", () => {
    cy.get('input[name="password"]').type("123");
    cy.get('input[name="confirmPassword"]').type("123");
    cy.contains("button", "Criar conta").click();
    cy.contains("A senha deve ter pelo menos 6 caracteres.").should(
      "be.visible",
    );
  });
});
