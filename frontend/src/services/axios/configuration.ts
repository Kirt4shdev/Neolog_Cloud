// Si las variables están vacías (producción/Docker), devolver string vacío
// Si no están definidas (desarrollo), usar defaults
export const backendHost = import.meta.env.VITE_BACKEND_HOST !== undefined 
  ? import.meta.env.VITE_BACKEND_HOST 
  : "localhost";

export const backendPort = import.meta.env.VITE_BACKEND_PORT !== undefined 
  ? import.meta.env.VITE_BACKEND_PORT 
  : "8094";
