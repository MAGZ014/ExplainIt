import express from "express";
import corsMiddleware from "./src/middleware/cors.js";
import configEnv from "./src/configs/configEnv.js";

import { router } from "./src/routes/index.js";

const app = express();
const PORT = configEnv.PORT;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "ExplainIt API is running" });
});

app.use("/api", router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`ExplainIt API running at http://localhost:${PORT}`);
});
