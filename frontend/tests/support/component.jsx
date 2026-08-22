import { mount } from "cypress/react";
import "../../src/index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../src/context/ThemeContext";
import { AuthProvider } from "../../src/context/AuthContext";

// Comando customizado para montar componentes com Providers e Router
export const mountWithProviders = (component, options = {}) => {
  const { theme = true, auth = false, router = false } = options;

  // As telas usam useFetch -> axios com baseURL absoluta
  // (http://localhost:5000/api ou a URL de produção), então em component
  // testing essa chamada é uma requisição de rede de verdade para um
  // servidor que não está rodando. O "connection refused" eventualmente
  // resolve o `loading`, mas o tempo até isso acontecer varia por SO/rede
  // (no Windows, a resolução de "localhost" às vezes tenta IPv6 antes de
  // cair para IPv4, adicionando alguns segundos) — o que tornava os testes
  // intermitentes: passavam ou estouravam o timeout de 4s dependendo da
  // sorte, sem relação com o código da tela em si.
  //
  // Por isso, toda chamada à API é interceptada por padrão e respondida
  // instantaneamente com uma lista vazia. Isso resolve `loading` de forma
  // determinística e imediata em QUALQUER ambiente (local ou CI), sem
  // depender de timing de rede. Um teste específico que precise simular
  // dados reais ou um erro pode registrar seu próprio `cy.intercept(...)`
  // antes de chamar `mountWithProviders` — o intercept mais específico
  // (registrado depois) tem prioridade sobre este catch-all.
  cy.intercept("GET", "**/api/**", {
    statusCode: 200,
    body: [],
  }).as("defaultApiGet");

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

