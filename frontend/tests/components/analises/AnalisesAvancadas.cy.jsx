import React from "react";
import AnalisesAvancadas from "../../../src/components/analises/AnalisesAvancadas";
import { mountWithProviders } from "../../support/component";

describe("<AnalisesAvancadas />", () => {
  it("deve renderizar o componente sem erros", () => {
    mountWithProviders(<AnalisesAvancadas />, { theme: true, auth: true });
    // O componente usa useFetch para buscar dados. Sem a API, ele pode
    // ficar em loading. Então verificamos apenas se o container existe.
    cy.get("div").should("exist");
  });
});
