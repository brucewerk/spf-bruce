import React from "react";
import Ativos from "../../../src/components/ativos/Ativos";
import { mountWithProviders } from "../../support/component";

describe("<Ativos />", () => {
  it("deve renderizar o componente sem erros", () => {
    mountWithProviders(<Ativos />, { theme: true, auth: true });
    // O componente entra em loading enquanto busca dados. Só verificamos
    // se ele monta corretamente.
    cy.get("div").should("exist");
  });
});
