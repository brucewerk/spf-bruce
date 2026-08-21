import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { loginSchema } from "../../schemas/authSchema";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mesmo schema Zod usado pelo backend em POST /api/auth/login — a
  // mensagem "Informe um e-mail válido" que aparece aqui é a mesma regra
  // que o servidor aplica, não uma cópia que pode ficar desalinhada dela.
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <ThemeToggle position="top-right" />
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <img
              src="/favicon-192x192.png"
              alt="SPF"
              className="w-16 h-16 mx-auto mb-3 rounded-2xl shadow-sm"
            />
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              SPF
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sistema Planilha Financeira
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              by BruCe
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                {...registerField("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  {...registerField("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
