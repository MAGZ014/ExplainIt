import { ENDPOINT } from "@/helpers/Endpoints";
import axios from "axios";

const api = axios.create({
  baseURL: ENDPOINT.EXPLAIN,
});

/**
 * Llama al endpoint /api/explain
 * @param {string} mode - nombre del modo (ej: "principiante")
 * @param {string} message - el error/código del usuario
 * @returns {Promise<{ success, content, provider, model, mode }>}
 */
export const explainError = async (mode, message) => {
  try {
    const { data } = await api.post("/", { mode, message });
    return data;
  } catch (error) {
    console.error("Error al llamar /explain:", error);
    const status = error.response?.status;
    const detail = error.response?.data?.error || error.message;

    if (status === 503) {
      throw new Error(
        "⏳ Todos los proveedores de IA están ocupados. Intenta en unos segundos.",
      );
    }
    if (status === 404) {
      throw new Error(`Modo no encontrado: ${detail}`);
    }
    throw new Error(detail || "Error desconocido al contactar la API.");
  }
};
