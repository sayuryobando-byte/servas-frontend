import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const httpClient = axios.create({
  baseURL: BASE_URL,
});

// Adjunta el token guardado en sesión a cada petición protegida.
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("servas_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza los errores del backend para mostrarlos fácil en la UI.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Ocurrió un error al comunicarse con el servidor.";
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);
