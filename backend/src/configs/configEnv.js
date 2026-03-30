import "dotenv/config";

const configEnv = {
  PORT: process.env.PORT || 5000,
  ORIGIN: process.env.ORIGIN || "http://localhost:3000",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS ||
    process.env.ORIGIN ||
    "http://localhost:3000",

  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};

export default configEnv;
