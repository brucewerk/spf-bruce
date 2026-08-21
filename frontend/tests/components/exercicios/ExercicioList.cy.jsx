import React from "react";
import ExercicioList from "../../../src/components/exercicios/ExercicioList";
import { mountWithProviders } from "../../support/component";

describe("<ExercicioList />", () => {
  it("deve renderizar a lista de exercícios", () => {
    mountWithProviders(<ExercicioList />, {
      theme: true,
      auth: true,
      router: true,
    }); // 🔥 router: true
    cy.contains("Novo").should("be.visible"); // Botão sempre visível
  });
});
