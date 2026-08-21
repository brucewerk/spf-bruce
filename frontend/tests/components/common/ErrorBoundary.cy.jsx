import ErrorBoundary from "../../../src/components/common/ErrorBoundary";

const ComponenteComErro = () => {
  throw new Error("Falha proposital para o teste");
};

const ComponenteOk = () => <div>Conteúdo normal</div>;

describe("<ErrorBoundary />", () => {
  it("renderiza os filhos normalmente quando não há erro", () => {
    cy.mount(
      <ErrorBoundary>
        <ComponenteOk />
      </ErrorBoundary>,
    );

    cy.contains("Conteúdo normal").should("be.visible");
    cy.contains("Algo deu errado").should("not.exist");
  });

  it("mostra a tela de fallback quando um componente filho quebra", () => {
    cy.on("uncaught:exception", () => false);

    cy.mount(
      <ErrorBoundary>
        <ComponenteComErro />
      </ErrorBoundary>,
    );

    cy.contains("Algo deu errado").should("be.visible");
    cy.contains("Ocorreu um erro inesperado nesta tela").should("be.visible");
    cy.contains("button", "Voltar ao início").should("be.visible");
  });
});
