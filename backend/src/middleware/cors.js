import cors from "cors";
import configEnv from "../configs/configEnv.js";

const allowedOrigins = configEnv.ALLOWED_ORIGINS.split(",");

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default cors(corsOptions);
