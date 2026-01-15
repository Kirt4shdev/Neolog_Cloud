import { axiosInstance } from "./axios/axios.instace";

/**
 * Estructura de respuesta del backend
 */
interface BackendResponse<T> {
  data: T;
  message?: string;
}

/**
 * ApiService es una clase abstracta que define el contrato para los servicios API.
 * Todos los servicios API deben extender esta clase y implementar el método fetch.
 */
export abstract class ApiService {
  protected async fetch<T>(
    method: "POST" | "GET" | "PUT" | "DELETE",
    url: string,
    data?: any
  ): Promise<T> {
    // Extraer automáticamente el nombre de la clase
    const serviceName = this.constructor.name;

    // Extraer automáticamente el nombre del método desde el stack trace
    const stack = new Error().stack;

    const methodName =
      stack
        ?.split("\n")[2] // La tercera línea contiene el método que llamó a fetch
        ?.trim()
        ?.match(/at \w+\.(\w+)/)?.[1] || "unknown";

    try {
      const { data: result } = await axiosInstance.request<BackendResponse<T>>({
        url,
        method,
        data: data ?? null,
      });

      console.info({
        [`${serviceName}.${methodName}`]: {
          url,
          method,
          data,
          response: result,
        },
      });

      // Extraer solo el campo "data" de la respuesta del backend
      return (result?.data ?? result) as T;
    } catch (error: any) {
      console.error({
        [`Error: ${serviceName}.${methodName}`]: {
          url,
          method,
          data,
          error: error?.response?.data,
        },
      });

      throw error;
    }
  }
}
