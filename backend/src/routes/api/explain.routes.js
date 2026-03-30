import { Router } from "express";
import { explainError } from "../../services/explain.service.js";
import { getProvidersStatus } from "../../services/ai.service.js";

export const explainRouter = Router();

explainRouter.post("/", async (req, res) => {
  const { mode, message } = req.body;

  if (!mode || !message) {
    return res.status(400).json({
      error: 'Se requieren los campos "mode" y "message".',
      example: {
        mode: "principiante",
        message:
          "TypeError: Cannot read properties of undefined (reading 'map')",
      },
    });
  }

  try {
    const result = await explainError(mode, message);
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("[explainRouter] Error:", error.message);

    if (
      error.message.includes("fallaron") ||
      error.message.includes("cooldown")
    ) {
      return res.status(503).json({
        error:
          "Servicio temporalmente no disponible. Intenta de nuevo en unos segundos.",
        detail: error.message,
      });
    }

    // modo no encontrado
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Error interno del servidor.",
      detail: error.message,
    });
  }
});

explainRouter.get("/providers", (req, res) => {
  res.json({ providers: getProvidersStatus() });
});
