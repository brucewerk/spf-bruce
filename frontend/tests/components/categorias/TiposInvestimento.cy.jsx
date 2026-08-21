import React from "react";
import TiposInvestimento from "../../../src/components/categorias/TiposInvestimento";
import { mountWithProviders } from "../../support/component";

describe("<TiposInvestimento />", () => {
  it("deve renderizar a tela de tipos de investimento", () => {
    mountWithProviders(<TiposInvestimento />, { theme: true, auth: true });
    cy.contains("Tipos de Investimento").should("be.visible");
    cy.get('input[placeholder="Ex: Renda Fixa, Ações, FIIs"]').should(
      "be.visible",
    );
    cy.contains("Adicionar").should("be.visible");
  });
});
