const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 3;

// Map<ip, number[]> — timestamps de peticiones recientes
const requestLog = new Map();

function getClientKey(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// Limpia timestamps viejos fuera de la ventana y devuelve los actuales
function getActiveTimestamps(key, now) {
  const timestamps = requestLog.get(key) || [];
  const active = timestamps.filter((t) => now - t < WINDOW_MS);
  return active;
}

export function explainRateLimiter(req, res, next) {
  const key = getClientKey(req);
  const now = Date.now();

  const active = getActiveTimestamps(key, now);
  const remaining = MAX_REQUESTS - active.length;
  const resetAt = active.length > 0 ? active[0] + WINDOW_MS : now + WINDOW_MS;
  const retryAfter = Math.ceil((resetAt - now) / 1000);

  // Headers estándar de rate limit (útiles para el frontend)
  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, remaining - 1));
  res.setHeader("X-RateLimit-Reset", Math.ceil(resetAt / 1000));

  if (remaining <= 0) {
    res.setHeader("Retry-After", retryAfter);
    return res.status(429).json({
      error: `Límite alcanzado. Puedes hacer ${MAX_REQUESTS} peticiones por minuto.`,
      retryAfter,
      resetAt: new Date(resetAt).toISOString(),
    });
  }

  // Registrar esta petición
  active.push(now);
  requestLog.set(key, active);

  // Limpiar el registro cuando ya no sea necesario
  setTimeout(() => {
    const updated = getActiveTimestamps(key, Date.now());
    if (updated.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, updated);
    }
  }, WINDOW_MS);

  next();
}
