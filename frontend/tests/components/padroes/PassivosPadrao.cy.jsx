import React from "react";
import PassivosPadrao from "../../../src/components/padroes/PassivosPadrao";
import { mountWithProviders } from "../../support/component";

describe("<PassivosPadrao />", () => {
  it("deve renderizar a tela de despesas padrão", () => {
    mountWithProviders(<PassivosPadrao />, { theme: true, auth: true });
    cy.contains("Despesas Padrão").should("be.visible");
    cy.get('input[placeholder="Ex: Conta de Luz"]').should("be.visible");
    cy.contains("Adicionar").should("be.visible");
  });
});
