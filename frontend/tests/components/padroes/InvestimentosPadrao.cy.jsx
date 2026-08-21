import React from "react";
import InvestimentosPadrao from "../../../src/components/padroes/InvestimentosPadrao";
import { mountWithProviders } from "../../support/component";

describe("<InvestimentosPadrao />", () => {
  it("deve renderizar a tela de investimentos padrão", () => {
    mountWithProviders(<InvestimentosPadrao />, { theme: true, auth: true });
    cy.contains("Investimentos Padrão").should("be.visible");
    cy.contains("Tipo").should("be.visible");
    cy.contains("Produto").should("be.visible");
    cy.contains("Adicionar").should("be.visible");
  });
});
