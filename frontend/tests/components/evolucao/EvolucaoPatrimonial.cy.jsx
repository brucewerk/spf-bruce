import React from "react";
import EvolucaoPatrimonial from "../../../src/components/evolucao/EvolucaoPatrimonial";
import { mountWithProviders } from "../../support/component";

describe("<EvolucaoPatrimonial />", () => {
  it("deve renderizar o título", () => {
    mountWithProviders(<EvolucaoPatrimonial />, { theme: true, auth: true });
    cy.get("h1")
      .should("contain", "Evolução Patrimonial Acumulada")
      .should("be.visible"); // 🔥 Apenas título
  });
});
