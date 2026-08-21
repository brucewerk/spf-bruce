import React from "react";
import CategoriasAtivo from "../../../src/components/categorias/CategoriasAtivo";
import { mountWithProviders } from "../../support/component";

describe("<CategoriasAtivo />", () => {
  it("deve renderizar a tela de categorias de ativos", () => {
    mountWithProviders(<CategoriasAtivo />, { theme: true, auth: true });
    cy.contains("Categorias de Ativos").should("be.visible");
    cy.get('input[placeholder="Ex: Imóveis, Veículos, Investimentos"]').should(
      "be.visible",
    );
    cy.contains("Adicionar").should("be.visible");
  });
});
