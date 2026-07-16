import axios from "axios";
import {setupInterceptors} from "@/api/interceptors"

const api = axios.create({
  // axios.craate = This creates our own customized Axios client.
  // It already knows Base URL,Headers.Cookies,Interceptors


  baseURL: import.meta.env.VITE_API_BASE_URL,
  // no need to write "http://localhost:8000/api/v1" everywhere
  // Axios automatically prefixes every request.
  // Example:api.get("/users/login") becomes http://localhost:8000/api/v1/users/login


  withCredentials: true,
  //withCredentials: true tells Axios "Send and receive cookies."
  // Without this, your authentication will break.
  // Because our backend uses jwt, refresh token, cookies


  headers: {
    "Content-Type": "application/json",
  },//Most of our requests are JSON.
});
// Register all interceptors
setupInterceptors(api);

export default api;