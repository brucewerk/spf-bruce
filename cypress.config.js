module.exports = {
  projectId: "m1tyf1",
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: "cypress/support/e2e.js", // 🔥 Garante que o arquivo de suporte seja encontrado
  },
};
