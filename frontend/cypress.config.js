import { defineConfig } from "cypress";
import { mergeConfig } from "vite";
import viteConfig from "./vite.config.js";

// O Electron (browser padrão do Cypress) não aceita argumentos genéricos de
// linha de comando (--disable-gpu etc.) via launchOptions.args — só browsers
// baseados em Chrome "de verdade" (chrome, edge) aceitam. Aplicamos os flags
// apenas nesses casos; o Electron já lida com o próprio modo headless.
function onBrowserLaunch(on) {
  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.name === "chrome" || browser.name === "edge") {
      launchOptions.args.push("--disable-gpu");
      launchOptions.args.push("--disable-dev-shm-usage");
      launchOptions.args.push("--no-sandbox");
    }
    return launchOptions;
  });
}

export default defineConfig({
  projectId: "m1tyf1",
  // O projeto não usa Cypress.env() em nenhum teste; desabilitar remove o
  // aviso de depreciação e segue a recomendação de segurança do Cypress 15.
  allowCypressEnv: false,
  // O Vite só transforma cada arquivo .jsx na primeira vez que ele é pedido
  // pelo browser (compilação sob demanda, não há como "pré-compilar" código
  // local do jeito que optimizeDeps faz para pacotes de node_modules). Em
  // máquinas com disco/antivírus mais lentos (comum no Windows), esse
  // primeiro toque em componentes maiores pode passar dos 4000ms padrão do
  // Cypress — e como a ORDEM de quais arquivos ainda estão "frios" varia a
  // cada execução, o conjunto de specs que falha por timeout muda de uma
  // rodada para outra, mesmo sem nenhuma mudança no código. Aumentamos a
  // margem para cobrir esse cold-start sem mascarar problemas reais.
  defaultCommandTimeout: 15000,
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      onBrowserLaunch(on);
      return config;
    },
  },
  // 🔥 Component Testing
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      // IMPORTANTE: mesclamos explicitamente o vite.config.js real do projeto
      // (que registra o plugin @vitejs/plugin-react-swc, responsável pelo JSX
      // automático) com as otimizações extras abaixo. Se apenas um objeto
      // solto fosse passado aqui, ele podia sobrepor o vite.config.js real e
      // derrubar o plugin do React — causando erros como
      // "ReferenceError: React is not defined" ao montar qualquer componente.
      viteConfig: mergeConfig(viteConfig, {
        optimizeDeps: {
          // Pré-otimiza (pre-bundle) as dependências usadas pelos componentes
          // e pelo support file antes da primeira requisição do runner do
          // Cypress. Sem isso, o Vite pode descobrir dependências "on the
          // fly" durante o primeiro teste e recarregar o cache de otimização
          // em pleno voo, produzindo "Failed to fetch dynamically imported
          // module" de forma intermitente/consistente em várias specs.
          include: [
            "react",
            "react-dom",
            "react-dom/client",
            "react/jsx-dev-runtime",
            "react-router-dom",
            "cypress/react",
            "axios",
            "zod",
            "@hookform/resolvers/zod",
            "react-hook-form",
            "react-hot-toast",
            "recharts",
            "lucide-react",
            "@sentry/react",
          ],
        },
        server: {
          // "optimizeDeps.include" cobre pacotes de node_modules, mas não
          // ajuda com o código-fonte local (src/**): esses arquivos só são
          // transformados pelo Vite na primeira vez que algum spec os pede.
          // Isso é o que causava o timeout intermitente — não era rede nem
          // um bug de tela, era o Vite compilando um .jsx "frio" enquanto o
          // Cypress já estava contando os 4000ms da assertion. `warmup`
          // manda o dev-server transformar tudo isso de antemão, assim que
          // sobe, então nenhum spec paga esse custo durante o teste em si.
          warmup: {
            clientFiles: [
              "./src/components/**/*.jsx",
              "./src/context/**/*.jsx",
              "./src/hooks/**/*.js",
              "./src/utils/**/*.js",
              "./src/schemas/**/*.js",
              "./src/services/**/*.js",
            ],
          },
        },
      }),
    },
    specPattern: "tests/components/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/support/component.jsx",
    setupNodeEvents(on, config) {
      onBrowserLaunch(on);
      return config;
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
