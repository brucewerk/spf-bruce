import React from "react";
import BottomNav from "./BottomNav";
import ThemeToggle from "./ThemeToggle";
import SettingsMenu from "./SettingsMenu";

// Layout compartilhado por todas as páginas autenticadas.
//
// Por que existe: antes, cada uma das ~19 rotas do App.jsx repetia
// manualmente <Página/><BottomNav/><SettingsMenu/><ThemeToggle/>, e cada
// página precisava adivinhar um padding-bottom grande o bastante pra não
// ficar escondida atrás do BottomNav (que é fixed). Isso causava conteúdo
// cortado no final de algumas telas, especialmente em janelas de desktop
// mais baixas.
//
// Como resolve: a altura real do BottomNav fica numa única variável CSS
// (--bottom-nav-h) definida aqui. O <main> reserva exatamente essa altura
// (+ uma margem de segurança) como padding-bottom, então qualquer página
// nova automaticamente fica correta, sem precisar copiar "pb-24" por aí.
const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      style={{ "--bottom-nav-h": "4rem" }}
    >
      <main
        className="min-h-screen"
        style={{
          paddingBottom:
            "calc(var(--bottom-nav-h) + 2rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </main>
      <BottomNav />
      <SettingsMenu />
      <ThemeToggle />
    </div>
  );
};

export default Layout;
