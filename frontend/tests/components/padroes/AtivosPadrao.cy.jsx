import React from "react";
import AtivosPadrao from "../../../src/components/padroes/AtivosPadrao";
import { mountWithProviders } from "../../support/component";

describe("<AtivosPadrao />", () => {
  it("deve renderizar a tela de ativos padrão", () => {
    mountWithProviders(<AtivosPadrao />, { theme: true, auth: true });
    cy.contains("Ativos Padrão").should("be.visible");
    cy.get('input[placeholder="Ex: Apartamento"]').should("be.visible");
    cy.contains("Adicionar").should("be.visible");
  });
});
