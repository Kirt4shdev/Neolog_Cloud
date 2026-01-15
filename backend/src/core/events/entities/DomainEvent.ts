import { z } from "zod";
import { Role } from "@core/role/contracts/Role";
import { EventAction } from "../contracts/EventAction";

/**
 * DomainEvent - Schema de evento de dominio
 * @property action - Acción del evento
 * @property occurredAt - Fecha de ocurrencia del evento
 * @property requiredRole - Rol requerido para el evento
 * @property isSuccessful - Indica si el evento fue exitoso
 * @property failureReason - Motivo del fallo del evento
 * @property userId - ID del usuario que realizó el evento
 * @property metadata - Metadatos del evento
 */
export const DomainEvent = z.object({
  action: EventAction,
  occurredAt: z.coerce.date(),
  requiredRole: z.union([Role, z.array(Role)]).optional(),
  isSuccessful: z.boolean(),
  failureReason: z.string().optional(),
  userId: z.uuid().optional(),
  metadata: z.any().optional(),
});

export type DomainEvent = z.infer<typeof DomainEvent>;
