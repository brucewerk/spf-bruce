import React from "react";
import BottomNav from "../../../src/components/common/BottomNav";
import { mountWithProviders } from "../../support/component";

describe("<BottomNav />", () => {
  it("deve renderizar todos os ícones de navegação", () => {
    mountWithProviders(<BottomNav />, { router: true });
    cy.contains("Dashboard").should("be.visible");
    cy.contains("Evolução").should("be.visible");
    cy.contains("Contas").should("be.visible");
    cy.contains("Ativos").should("be.visible");
    cy.contains("Passivos").should("be.visible");
    cy.contains("Investimentos").should("be.visible");
    cy.contains("Exercícios").should("be.visible");
  });
});
