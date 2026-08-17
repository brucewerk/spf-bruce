import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url, options);
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.error || "Erro ao carregar dados");
        toast.error(error.response?.data?.error || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await api.get(url, options);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || "Erro ao carregar dados");
      toast.error(error.response?.data?.error || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
