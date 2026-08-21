import axios from "axios";
import { env } from "@/shared/config/env";
import { firebaseAuth } from "@/lib/firebase";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const currentUser = firebaseAuth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
