import "dotenv/config";

const configEnv = {
  PORT: process.env.PORT || 5000,
  ORIGIN: process.env.ORIGIN || "http://localhost:3000",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS ||
    process.env.ORIGIN ||
    "http://localhost:3000",
};

export default configEnv;
