import { z } from "zod";

/**
 * ApplicationEvent - Evento de aplicación
 * @property endpoint - Endpoint HTTP invocado
 * @property method - Método HTTP (GET, POST, PUT, DELETE, etc.)
 * @property location - Ubicación geográfica (obtenida del IP)
 * @property ip - Dirección IP del cliente
 * @property table - Tabla de base de datos afectada
 * @property resourceId - ID del recurso afectado
 */
export const ApplicationEvent = z.object({
  endpoint: z.string(),
  method: z.string().optional(),
  location: z.string().optional(),
  ip: z.string().optional(),
  table: z.string().optional(),
  resourceId: z.uuid().optional(),
});

export type ApplicationEvent = z.infer<typeof ApplicationEvent>;
