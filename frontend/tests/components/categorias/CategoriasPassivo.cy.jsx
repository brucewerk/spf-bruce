import React from "react";
import CategoriasPassivo from "../../../src/components/categorias/CategoriasPassivo";
import { mountWithProviders } from "../../support/component";

describe("<CategoriasPassivo />", () => {
  it("deve renderizar a tela de categorias de despesas", () => {
    mountWithProviders(<CategoriasPassivo />, { theme: true, auth: true });
    cy.contains("Categorias de Despesas").should("be.visible");
    cy.get('input[placeholder="Ex: Moradia, Transporte, Alimentação"]').should(
      "be.visible",
    );
    cy.contains("Adicionar").should("be.visible");
  });
});
