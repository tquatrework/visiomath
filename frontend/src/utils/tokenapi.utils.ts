// src/utils/tokenapi.utils.ts
import axios from "axios";
import API_URL from "../config/api.config";

const apiSec = axios.create({
  baseURL: API_URL,
});

// Ajouter un interceptor pour inclure automatiquement le token
apiSec.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // Récupération depuis localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiSec;
