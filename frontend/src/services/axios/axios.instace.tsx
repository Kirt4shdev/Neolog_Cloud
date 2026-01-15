import axios from "axios";
import { backendHost, backendPort } from "@/services/axios/configuration";

// En producción (Docker), usar URLs relativas (Nginx hace el proxy)
// En desarrollo, usar host:port explícitos
const getBaseURL = () => {
  if (!backendHost || !backendPort || backendHost === '' || backendPort === '') {
    // Producción: URLs relativas, Nginx hace el proxy
    return '';
  }
  // Desarrollo: URL explícita
  return `http://${backendHost}:${backendPort}`;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.code === "ECONNABORTED" ||
      error?.code === "ERR_BAD_RESPONSE" ||
      error?.code === "ECONNREFUSED" ||
      error?.response?.status == 500 ||
      error?.status == 500
    ) {
      return Promise.resolve({
        data: null,
        status: 503,
        message: error?.response?.data || error?.code,
      });
    }
    return Promise.reject(error);
  }
);
