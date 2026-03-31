import { ENDPOINT } from "@/helpers/Endpoints";
import axios from "axios";

const api = axios.create({
  baseURL: ENDPOINT.EXPLAIN,
});

export const rateLimitState = {
  limit: 5,
  remaining: 5,
  resetAt: null,
  isBlocked: false,
  retryAfter: 0,
};

function parseRateLimitHeaders(headers) {
  const limit = parseInt(headers["x-ratelimit-limit"]) || 5;
  const remaining =
    parseInt(headers["x-ratelimit-remaining"]) ?? rateLimitState.remaining;
  const resetUnix = parseInt(headers["x-ratelimit-reset"]);
  const resetAt = resetUnix ? new Date(resetUnix * 1000) : null;

  rateLimitState.limit = limit;
  rateLimitState.remaining = remaining;
  rateLimitState.resetAt = resetAt;
  rateLimitState.isBlocked = false;
}

/**
 * Llama al endpoint /api/explain
 * @param {string} mode
 * @param {string} message
 * @returns {Promise<{ success, content, provider, model, mode }>}
 */
export const explainError = async (mode, message) => {
  try {
    const { data, headers } = await api.post("/", { mode, message });
    parseRateLimitHeaders(headers);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.error || error.message;
    const headers = error.response?.headers || {};
    const retryAfter = parseInt(error.response?.data?.retryAfter) || 60;

    // Siempre parsear headers aunque sea error
    parseRateLimitHeaders(headers);

    if (status === 429) {
      rateLimitState.isBlocked = true;
      rateLimitState.remaining = 0;
      rateLimitState.retryAfter = retryAfter;
      rateLimitState.resetAt = new Date(Date.now() + retryAfter * 1000);

      const err = new Error(`RATE_LIMIT:${retryAfter}`);
      err.isRateLimit = true;
      err.retryAfter = retryAfter;
      throw err;
    }

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
