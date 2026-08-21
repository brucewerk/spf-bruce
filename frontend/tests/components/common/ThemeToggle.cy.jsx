import ThemeToggle from "../../../src/components/common/ThemeToggle";
import { ThemeProvider } from "../../../src/context/ThemeContext";

describe("<ThemeToggle />", () => {
  beforeEach(() => {
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
  });

  it("alterna entre claro e escuro ao clicar", () => {
    cy.mount(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    cy.get("html").should("not.have.class", "dark");
    cy.get('button[aria-label="Toggle theme"]').click();
    cy.get("html").should("have.class", "dark");
    cy.wrap(localStorage).invoke("getItem", "theme").should("eq", "dark");

    cy.get('button[aria-label="Toggle theme"]').click();
    cy.get("html").should("not.have.class", "dark");
    cy.wrap(localStorage).invoke("getItem", "theme").should("eq", "light");
  });

  it("aplica a posição padrão (bottom-right) quando nenhuma prop é passada", () => {
    cy.mount(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    cy.get('button[aria-label="Toggle theme"]')
      .should("have.class", "bottom-36")
      .and("have.class", "right-4");
  });

  it('usa o canto superior direito quando position="top-right"', () => {
    cy.mount(
      <ThemeProvider>
        <ThemeToggle position="top-right" />
      </ThemeProvider>,
    );
    cy.get('button[aria-label="Toggle theme"]')
      .should("have.class", "top-4")
      .and("have.class", "right-4")
      .and("not.have.class", "bottom-36");
  });
});
