import axios from "axios";
import { env } from "@/shared/config/env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

//We will add the token we need to send here when we create Redux later.
//For now, this is the base.
