import React from "react";
import Notificacoes from "../../../src/components/notificacoes/Notificacoes";
import { mountWithProviders } from "../../support/component";

describe("<Notificacoes />", () => {
  it("deve renderizar a tela de notificações", () => {
    mountWithProviders(<Notificacoes />, { theme: true, auth: true });
    cy.contains("Notificações").should("be.visible");
    cy.contains("Atualizar").should("be.visible");
  });
});
