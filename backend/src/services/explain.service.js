import fs from "fs";
import { generateExplanation } from "./ai.service.js";

const modesFile = new URL("../db/modes.json", import.meta.url);

const getModes = () => JSON.parse(fs.readFileSync(modesFile, "utf8"));

/**
 * Busca el modo por nombre y genera la explicación con IA
 * @param {string} modeName - nombre del modo (ej: "principiante")
 * @param {string} userMessage - el error/código del usuario
 */
export const explainError = async (modeName, userMessage) => {
  const modes = getModes();
  const mode = modes.find((m) => m.name === modeName);

  if (!mode) {
    const available = modes.map((m) => m.name).join(", ");
    throw new Error(
      `Modo "${modeName}" no encontrado. Modos disponibles: ${available}`,
    );
  }

  if (!userMessage || userMessage.trim().length === 0) {
    throw new Error("El mensaje no puede estar vacío.");
  }

  const result = await generateExplanation(userMessage.trim(), mode);

  return {
    mode: {
      id: mode.id,
      name: mode.name,
      label: mode.label,
    },
    ...result,
  };
};
