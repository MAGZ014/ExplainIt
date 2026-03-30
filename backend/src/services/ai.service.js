import configEnv from "../configs/configEnv.js";

// ─── Modelos gratuitos por proveedor ───────────────────────────────────────
const PROVIDERS = {
  groq: {
    name: "groq",
    baseURL: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    apiKey: () => configEnv.GROQ_API_KEY,
    available: () => !!configEnv.GROQ_API_KEY,
  },
  openrouter: {
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    model: "qwen/qwen3-coder:free",
    apiKey: () => configEnv.OPENROUTER_API_KEY,
    available: () => !!configEnv.OPENROUTER_API_KEY,
    extraHeaders: {
      "HTTP-Referer": "https://explainit.app",
      "X-Title": "ExplainIt",
    },
  },
  gemini: {
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.0-flash",
    apiKey: () => configEnv.GEMINI_API_KEY,
    available: () => !!configEnv.GEMINI_API_KEY,
  },
};

// ─── Estado de rotación en memoria ────────────────────────────────────────
const providerState = {
  currentIndex: 0,
  order: ["groq", "openrouter", "gemini"],
  cooldowns: {},
};

// Obtiene la lista de proveedores disponibles
const getAvailableProviders = () => {
  return providerState.order.filter((name) => PROVIDERS[name].available());
};

// Marca un proveedor en cooldown N minutos
const setCooldown = (providerName, minutes = 1) => {
  providerState.cooldowns[providerName] = Date.now() + minutes * 60 * 1000;
  console.warn(
    `[AI Rotation] Provider "${providerName}" en cooldown por ${minutes} min`,
  );
};

/**
 * Verifica si un proveedor está en cooldown
 */
const isOnCooldown = (providerName) => {
  const cooldownUntil = providerState.cooldowns[providerName];
  if (!cooldownUntil) return false;
  if (Date.now() > cooldownUntil) {
    delete providerState.cooldowns[providerName];
    return false;
  }
  return true;
};

/**
 * Selecciona el siguiente proveedor disponible usando round-robin
 * Salta proveedores en cooldown o sin API key
 */
const selectProvider = () => {
  const available = getAvailableProviders();

  if (available.length === 0) {
    throw new Error(
      "No hay proveedores de IA configurados. Agrega al menos una API key (GROQ_API_KEY, OPENROUTER_API_KEY o GEMINI_API_KEY).",
    );
  }

  // Intentar seleccionar un proveedor que no esté en cooldown
  for (let i = 0; i < available.length; i++) {
    const idx = (providerState.currentIndex + i) % available.length;
    const name = available[idx];

    if (!isOnCooldown(name)) {
      // Avanzar el índice para la próxima llamada (round-robin)
      providerState.currentIndex = (idx + 1) % available.length;
      return PROVIDERS[name];
    }
  }

  // Todos en cooldown — usar el primero disponible de todas formas
  console.warn(
    "[AI Rotation] Todos los proveedores en cooldown, usando el primero disponible.",
  );
  const fallback = available[0];
  delete providerState.cooldowns[fallback];
  return PROVIDERS[fallback];
};

/**
 * Hace la llamada al proveedor (OpenAI-compatible API)
 */
const callProvider = async (provider, messages, temperature, maxTokens) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${provider.apiKey()}`,
    ...provider.extraHeaders,
  };

  const body = JSON.stringify({
    model: provider.model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const response = await fetch(`${provider.baseURL}/chat/completions`, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `[${provider.name}] HTTP ${response.status}: ${errorText}`,
    );
    error.status = response.status;
    error.provider = provider.name;
    throw error;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

/**
 * Función principal: genera una explicación usando IA con rotación automática
 * @param {string} userMessage - El error/código que pegó el usuario
 * @param {object} mode - El objeto del modo desde modes.json
 * @returns {Promise<{ content: string, provider: string, model: string }>}
 */
export const generateExplanation = async (userMessage, mode) => {
  const maxRetries = getAvailableProviders().length;
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const provider = selectProvider();

    try {
      console.log(
        `[AI Rotation] Intento ${attempt + 1}/${maxRetries} con "${provider.name}" (${provider.model})`,
      );

      const messages = [
        { role: "system", content: mode.systemPrompt },
        { role: "user", content: userMessage },
      ];

      const content = await callProvider(
        provider,
        messages,
        mode.temperature ?? 0.7,
        mode.maxTokens ?? 800,
      );

      console.log(`[AI Rotation] ✅ Respuesta exitosa de "${provider.name}"`);

      return {
        content,
        provider: provider.name,
        model: provider.model,
      };
    } catch (error) {
      lastError = error;
      console.error(
        `[AI Rotation] ❌ Error con "${provider.name}":`,
        error.message,
      );

      // Rate limit (429) → cooldown de 2 minutos
      if (error.status === 429) {
        setCooldown(provider.name, 2);
      }
      // Error de autenticación (401/403) → no reintentar este proveedor hoy
      else if (error.status === 401 || error.status === 403) {
        setCooldown(provider.name, 60);
      }
      // Otros errores → cooldown corto
      else {
        setCooldown(provider.name, 0.5);
      }
    }
  }

  throw new Error(
    `Todos los proveedores fallaron. Último error: ${lastError?.message}`,
  );
};

/**
 * Devuelve el estado actual de los proveedores (para debug/health check)
 */
export const getProvidersStatus = () => {
  return getAvailableProviders().map((name) => ({
    name,
    model: PROVIDERS[name].model,
    onCooldown: isOnCooldown(name),
    cooldownUntil: providerState.cooldowns[name]
      ? new Date(providerState.cooldowns[name]).toISOString()
      : null,
  }));
};
