import React from "react";
import Contas from "../../../src/components/contas/Contas";
import { mountWithProviders } from "../../support/component";

describe("<Contas />", () => {
  it("deve renderizar a tela de contas", () => {
    mountWithProviders(<Contas />, { theme: true, auth: true });
    cy.contains("Contas").should("be.visible");
    cy.contains("Total em Contas").should("be.visible");
    cy.contains("Adicionar").should("be.visible");
  });
});
