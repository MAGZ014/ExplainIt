import { ENDPOINT } from "@/helpers/Endpoints";
import axios from "axios";

const api = axios.create({
  baseURL: ENDPOINT.MESSAGE,
});

export const getMessagesCounter = async () => {
  try {
    const modes = await api.get("/", {});
    return modes.data;
  } catch (error) {
    console.error("Error en obtener la informacion", error);
    return { success: false, error };
  }
};

export const incrementCounter = async () => {
  try {
    const modes = await api.post("/increment", {});
    return modes.data;
  } catch (error) {
    console.error("Error en obtener la informacion", error);
    return { success: false, error };
  }
};
