import React from "react";
import Profile from "../../../src/components/auth/Profile";
import { mountWithProviders } from "../../support/component";

describe("<Profile />", () => {
  it("deve renderizar o formulário de perfil corretamente", () => {
    mountWithProviders(<Profile />, { theme: true, auth: true, router: true });
    cy.contains("Meu Perfil").should("be.visible");
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.contains("Alterar senha").should("be.visible");
    cy.contains("Sair da conta").should("be.visible");
    cy.contains("Deletar conta").should("be.visible");
  });
});
