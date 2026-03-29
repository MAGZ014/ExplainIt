import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { router } from "./src/routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
