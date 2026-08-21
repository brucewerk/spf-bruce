import React from "react";
import NovoExercicioModal from "../../../src/components/exercicios/NovoExercicioModal";
import { mountWithProviders } from "../../support/component";

describe("<NovoExercicioModal />", () => {
  it("deve renderizar o modal quando isOpen=true", () => {
    mountWithProviders(
      <NovoExercicioModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={() => {}}
      />,
      { theme: true, router: true },
    );
    cy.contains("Novo Exercício").should("be.visible");
    cy.contains("Ano").should("be.visible");
    cy.contains("Mês").should("be.visible");
    cy.contains("Cancelar").should("be.visible");
    cy.contains("Criar e Editar").should("be.visible");
  });

  it("deve esconder o modal quando isOpen=false", () => {
    mountWithProviders(
      <NovoExercicioModal
        isOpen={false}
        onClose={() => {}}
        onSuccess={() => {}}
      />,
      { theme: true, router: true },
    );
    cy.contains("Novo Exercício").should("not.exist");
  });
});
