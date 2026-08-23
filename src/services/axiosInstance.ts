import axios from "axios";
import { env } from "@/shared/config/env";
import { firebaseAuth } from "@/lib/firebase";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach Firebase ID Token to every request
apiClient.interceptors.request.use(async (config) => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
