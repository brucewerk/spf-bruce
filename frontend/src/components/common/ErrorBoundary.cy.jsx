import ErrorBoundary from "./ErrorBoundary";

// Componente que quebra de propósito, só pra forçar o ErrorBoundary a agir.
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
    // O React loga o erro no console durante o teste — isso é esperado,
    // não indica falha do teste em si.
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
