const BASE_URL = Object.freeze(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
);

export const ENDPOINT = Object.freeze({
  MESSAGE: `${BASE_URL}/messages`,
  MODE: `${BASE_URL}/modes`,
});
