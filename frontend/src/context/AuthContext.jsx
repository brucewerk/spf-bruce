import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("spf_token"));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("spf_token", token);
      setToken(token);
      setUser(user);
      toast.success("Login realizado com sucesso!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao fazer login");
      return { success: false, error: error.response?.data?.error };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("spf_token", token);
      setToken(token);
      setUser(user);
      toast.success("Conta criada com sucesso!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao criar conta");
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = async () => {
    try {
      // Invalida o token no servidor (tokenVersion++). Se a chamada falhar
      // (ex.: sem internet, ou o token já expirou), ainda assim limpamos o
      // estado local — o usuário não pode ficar preso na tela de logout.
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao invalidar sessão no servidor:", error);
    } finally {
      localStorage.removeItem("spf_token");
      setToken(null);
      setUser(null);
      toast.success("Logout realizado com sucesso!");
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put("/auth/profile", data);
      setUser(response.data.user);
      toast.success("Perfil atualizado com sucesso!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao atualizar perfil");
      return { success: false, error: error.response?.data?.error };
    }
  };

  const deleteAccount = async (password) => {
    try {
      await api.delete("/auth/profile", { data: { password } });
      // Conta já foi apagada no servidor — não faz sentido chamar
      // /auth/logout aqui (o usuário nem existe mais); só limpar localmente.
      localStorage.removeItem("spf_token");
      setToken(null);
      setUser(null);
      toast.success("Conta deletada com sucesso");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao deletar conta");
      return { success: false, error: error.response?.data?.error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
