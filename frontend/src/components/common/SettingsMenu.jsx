import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Settings,
  X,
  List,
  Tag,
  TrendingUp,
  FolderOpen,
  Folder,
  Layers,
  Package,
  FileText,
  Bell,
  BarChart3,
  User,
} from "lucide-react";

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Adicionado para pegar o nome do usuário

  const menuItems = [
    {
      section: "Conta",
      items: [{ to: "/perfil", icon: User, label: "Meu Perfil" }],
    },
    {
      section: "Categorias",
      items: [
        {
          to: "/categorias-ativos",
          icon: FolderOpen,
          label: "Categorias de Ativos",
        },
        {
          to: "/categorias-passivos",
          icon: Folder,
          label: "Categorias de Despesas",
        },
        {
          to: "/tipos-investimento",
          icon: Layers,
          label: "Tipos de Investimento",
        },
        {
          to: "/produtos-investimento",
          icon: Package,
          label: "Produtos de Investimento",
        },
      ],
    },
    {
      section: "Padrões (carregam no novo exercício)",
      items: [
        { to: "/ativos-padrao", icon: List, label: "Ativos Padrão" },
        { to: "/passivos-padrao", icon: Tag, label: "Despesas Padrão" },
        {
          to: "/investimentos-padrao",
          icon: TrendingUp,
          label: "Investimentos Padrão",
        },
      ],
    },
    {
      section: "Ferramentas",
      items: [
        { to: "/exportar", icon: FileText, label: "Exportar Relatórios" },
        { to: "/notificacoes", icon: Bell, label: "Notificações" },
        { to: "/analises", icon: BarChart3, label: "Análises Avançadas" },
      ],
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 z-50 hover:scale-105 active:scale-95"
        aria-label="Menu de configurações"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed bottom-28 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-3 z-50 min-w-[240px] max-h-[60vh] overflow-y-auto border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-5 duration-200">
            {/* Cabeçalho com nome do usuário */}
            <div className="px-3 py-2 mb-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Logado como
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                {user?.name || "Usuário"}
              </p>
            </div>

            {menuItems.map((section, idx) => (
              <div key={idx}>
                {idx > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                )}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-1">
                  {section.section}
                </p>
                {section.items.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default SettingsMenu;
