import React from "react";
import ExportarRelatorios from "../../../src/components/exportar/ExportarRelatorios";
import { mountWithProviders } from "../../support/component";

describe("<ExportarRelatorios />", () => {
  it("deve renderizar a tela de exportação", () => {
    mountWithProviders(<ExportarRelatorios />, { theme: true, auth: true });
    cy.contains("Exportar Relatórios").should("be.visible");
    cy.contains("Selecione o ano").should("be.visible");
    cy.contains("Formato do relatório").should("be.visible");
    cy.contains("PDF").should("be.visible");
    cy.contains("Excel").should("be.visible");
    cy.contains("Exportar Relatório").should("be.visible");
  });
});
