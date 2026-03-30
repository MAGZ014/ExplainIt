import { Router } from "express";
import { messageRouter } from "./api/message.routes.js";
import { modesRouter } from "./api/modes.routes.js";
import { explainRouter } from "./api/explain.routes.js";
export const router = Router();

router.use("/messages", messageRouter);
router.use("/modes", modesRouter);
router.use("/explain", explainRouter);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Estado de la API
router.get("/status", (req, res) => {
  res.json({
    status: "levando",
    message: "API activa",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
router.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
