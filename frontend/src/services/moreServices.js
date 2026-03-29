import { BASE_URL } from "@/helpers/Endpoints";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getStatusApi = async () => {
  try {
    const status = await api.get("/health", {});
    return status.data;
  } catch (error) {
    console.error("Error en obtener el status", error);
    return { success: false, error };
  }
};
