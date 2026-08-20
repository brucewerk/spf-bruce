import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";

// ThemeToggle depende do ThemeContext — sem o Provider em volta, useTheme()
// lançaria "must be used within ThemeProvider". Testar com o Provider real
// (em vez de mockar o contexto) confirma que o clique realmente propaga até
// a classe `dark` no <html>, que é o que o Tailwind usa pra aplicar o tema
// em toda a aplicação — não só que o ícone do botão mudou.
describe("<ThemeToggle />", () => {
  beforeEach(() => {
    // Garante um ponto de partida previsível a cada teste, já que o tema
    // fica salvo no localStorage entre execuções.
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
});
