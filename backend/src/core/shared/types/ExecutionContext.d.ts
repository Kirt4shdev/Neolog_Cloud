/**
 * ExecutionContext - Contexto de ejecución
 * Se declara para poder tipar los contextos de ejecución y tener intelisense en el editor de código.
 * @property ip - IP de la solicitud
 * @property userId - ID del usuario
 * @property adminId - ID del admin (si el usuario es admin)
 * @property clientId - ID del cliente (si el usuario es cliente)
 * @property jwt - Token JWT (opcional)
 * @property sessionId - ID de sesión (opcional)
 * @property clientInfo - Información del cliente (opcional)
 *
 * Su objetivo es abstraer la capa de servidor (Express, hono, etc.)
 * y tener intelisense en el editor de código.
 *
 */
import type { ClientInfo } from "@core/shared/contracts/ClientInfo";

declare global {
  type ExecutionContext = {
    ip: string;
    userId: UUID;
    adminId: UUID;
    clientId: UUID;
    jwt: string;
    sessionId: UUID;
    clientInfo: ClientInfo;
  };
}

export {};
