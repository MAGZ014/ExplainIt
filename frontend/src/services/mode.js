import { ENDPOINT } from "@/helpers/endpoints";
import axios from "axios";

const api = axios.create({
  baseURL: ENDPOINT.MODE,
});

export const getModes = async () => {
  try {
    const modes = await api.get("/", {});
    return modes.data;
  } catch (error) {
    console.error("Error en obtener la informacion", error);
    return { success: false, error };
  }
};
