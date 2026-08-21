import React from "react";
import ProdutosInvestimento from "../../../src/components/categorias/ProdutosInvestimento";
import { mountWithProviders } from "../../support/component";

describe("<ProdutosInvestimento />", () => {
  it("deve renderizar a tela de produtos de investimento", () => {
    mountWithProviders(<ProdutosInvestimento />, { theme: true, auth: true });
    cy.contains("Produtos de Investimento").should("be.visible");
    cy.get('input[placeholder="Ex: CDB, LCI, Tesouro Direto"]').should(
      "be.visible",
    );
    cy.contains("Adicionar").should("be.visible");
  });
});
