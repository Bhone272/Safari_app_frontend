// src/shared/lib/httpClient.js
import axios from "axios";
import { API_BASE_URL } from "../../app/config/env.js";
import { getToken } from "./storage.js";

const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;
