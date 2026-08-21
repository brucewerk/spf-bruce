import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "m1tyf1",
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Sem necessidade de preprocessor para E2E
    },
  },
  // 🔥 Component Testing (a pasta tests/support é o caminho correto)
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "tests/components/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/support/component.jsx",
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
