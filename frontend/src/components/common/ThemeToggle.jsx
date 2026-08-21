import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// `position` controla onde o botão flutua:
// - "bottom-right" (padrão): usado no Layout das telas autenticadas,
//   empilhado acima do BottomNav e abaixo do SettingsMenu — não mudou.
// - "top-right": usado em Login/Register, que não têm BottomNav/SettingsMenu
//   por baixo, então o canto superior direito fica mais natural ali.
const POSITION_CLASSES = {
  "bottom-right": "fixed bottom-36 right-4",
  "top-right": "fixed top-4 right-4",
};

const ThemeToggle = ({ position = "bottom-right" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${POSITION_CLASSES[position]} p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full shadow-lg transition-all duration-200 z-50 hover:scale-105 active:scale-95`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
