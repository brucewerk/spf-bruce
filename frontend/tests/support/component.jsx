import { mount } from "cypress/react";
import "../../src/index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../src/context/ThemeContext";
import { AuthProvider } from "../../src/context/AuthContext";

// Comando customizado para montar componentes com Providers e Router
export const mountWithProviders = (component, options = {}) => {
  const { theme = true, auth = false, router = false } = options;

  let Wrapper = ({ children }) => <>{children}</>;

  if (router) {
    const NextWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <NextWrapper>
        <BrowserRouter>{children}</BrowserRouter>
      </NextWrapper>
    );
  }
  if (theme) {
    const NextWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <NextWrapper>
        <ThemeProvider>{children}</ThemeProvider>
      </NextWrapper>
    );
  }
  if (auth) {
    const NextWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <NextWrapper>
        <AuthProvider>{children}</AuthProvider>
      </NextWrapper>
    );
  }

  return mount(<Wrapper>{component}</Wrapper>);
};

// Comando padrão do Cypress (mantido para compatibilidade)
Cypress.Commands.add("mount", mount);
