import React from "react";
import Dashboard from "../../../src/components/dashboard/Dashboard";
import { mountWithProviders } from "../../support/component";

describe("<Dashboard />", () => {
  it("deve renderizar o título e o seletor de ano", () => {
    mountWithProviders(<Dashboard />, { theme: true, auth: true });
    cy.contains("Dashboard").should("be.visible");
    cy.get("select").should("exist");
    cy.contains("Ativos (Atual)").should("exist");
    cy.contains("Passivos (Acumulado)").should("exist");
    cy.contains("Variação Acumulada").should("exist");
  });
});
