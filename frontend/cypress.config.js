import { defineConfig } from "cypress";

// Config de Component Testing, vivendo dentro de frontend/ (e não na raiz,
// onde já existe o cypress.config.js do E2E) porque o dev server de
// componentes precisa resolver o vite.config.js, o Tailwind e os módulos
// deste projeto especificamente — rodando daqui, a detecção automática do
// framework/bundler funciona sem precisar apontar caminhos manualmente.
//
// O E2E continua 100% como estava: `cypress.config.js` da raiz não foi
// tocado, e os comandos abaixo só afetam `--component`.
export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "src/**/*.cy.{js,jsx}",
    supportFile: "cypress/support/component.js",
    indexHtmlFile: "cypress/support/component-index.html",
  },
});
