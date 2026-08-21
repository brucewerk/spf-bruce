import React from "react";
import Passivos from "../../../src/components/passivos/Passivos";
import { mountWithProviders } from "../../support/component";

describe("<Passivos />", () => {
  it("deve renderizar o componente sem erros", () => {
    mountWithProviders(<Passivos />, { theme: true, auth: true });
    // O componente entra em loading enquanto busca dados. Só verificamos
    // se ele monta corretamente.
    cy.get("div").should("exist");
  });
});
