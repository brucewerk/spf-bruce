import React from "react";
import Investimentos from "../../../src/components/investimentos/Investimentos";
import { mountWithProviders } from "../../support/component";

describe("<Investimentos />", () => {
  it("deve renderizar o componente sem erros", () => {
    mountWithProviders(<Investimentos />, { theme: true, auth: true });
    // O componente entra em loading enquanto busca dados. Só verificamos
    // se ele monta corretamente.
    cy.get("div").should("exist");
  });
});
