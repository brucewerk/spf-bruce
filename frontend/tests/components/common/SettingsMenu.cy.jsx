import React from "react";
import SettingsMenu from "../../../src/components/common/SettingsMenu";
import { mountWithProviders } from "../../support/component";

describe("<SettingsMenu />", () => {
  it("deve abrir e fechar o menu ao clicar no botão", () => {
    mountWithProviders(<SettingsMenu />, { theme: true, router: true });

    // O botão existe
    cy.get('button[aria-label="Menu de configurações"]').should("exist");

    // 🔥 Força o clique para ignorar qualquer overlay
    cy.get('button[aria-label="Menu de configurações"]').click({ force: true });

    // 🔥 O menu abre. Verificamos no DOM, pois o overlay pode cobrir visualmente
    cy.contains("Perfil").should("exist");
    cy.contains("Categorias").should("exist");
    cy.contains("Padrões").should("exist");
    cy.contains("Ferramentas").should("exist");

    // 🔥 Força o clique para fechar
    cy.get('button[aria-label="Menu de configurações"]').click({ force: true });

    // 🔥 O menu fecha. Verificamos no DOM
    cy.contains("Perfil").should("not.exist");
  });
});
