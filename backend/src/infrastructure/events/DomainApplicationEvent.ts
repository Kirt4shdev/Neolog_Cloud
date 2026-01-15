import { z } from "zod";
import { DomainEvent } from "@core/events/entities/DomainEvent";
import { ApplicationEvent } from "./ApplicationEvent";

/**
 * DomainApplicationEvent - Evento de dominio + aplicación
 * @property endpoint - Endpoint HTTP invocado
 * @property method - Método HTTP (GET, POST, PUT, DELETE, etc.)
 * @property location - Ubicación geográfica (obtenida del IP)
 * @property ip - Dirección IP del cliente
 * @property table - Tabla de base de datos afectada
 * @property resourceId - ID del recurso afectado
 */
export const DomainApplicationEvent = DomainEvent.extend(
  ApplicationEvent.shape
);

export type DomainApplicationEvent = z.infer<typeof DomainApplicationEvent>;
