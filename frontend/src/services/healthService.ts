import api from "../api/axios.ts";

export const getHealth = async () => {
  const response = await api.get("/healthcheck");
  return response.data;
};