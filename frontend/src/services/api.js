import axios from "axios";

// Determinar a URL base da API
const getBaseURL = () => {
  // Em produção no Vercel, usar a URL do backend
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL || "https://spf-bruce-backend.vercel.app/api"
    );
  }
  // Em desenvolvimento, usar localhost
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("spf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("spf_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
