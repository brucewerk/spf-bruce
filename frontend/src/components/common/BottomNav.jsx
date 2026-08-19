import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Building2,
  CreditCard,
  TrendingUp,
  Calendar,
} from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/evolucao", icon: BarChart3, label: "Evolução" },
    { to: "/contas", icon: Wallet, label: "Contas" },
    { to: "/ativos", icon: Building2, label: "Ativos" },
    { to: "/passivos", icon: CreditCard, label: "Passivos" },
    { to: "/investimentos", icon: TrendingUp, label: "Investimentos" },
    { to: "/exercicios", icon: Calendar, label: "Exercícios" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-xl mx-auto overflow-x-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-1.5 py-1 transition-colors duration-200 min-w-[40px] ${
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-medium text-center leading-tight">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
