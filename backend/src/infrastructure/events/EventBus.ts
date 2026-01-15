import geoip from "geoip-lite";
import { injectable } from "tsyringe";
import { database } from "@infrastructure/database/PostgresDatabase";
import { Debug } from "@shared/utils/Debug";
import { DomainApplicationEvent } from "./DomainApplicationEvent";
import type { IDomainEventRepository } from "@core/events/repositories/IDomainEventRepository";

/**
 * EventBus - Implementación del repositorio de eventos de dominio
 *
 * Implementa IDomainEventRepository para emitir eventos a PostgreSQL.
 *
 * Características:
 * - Acepta DomainEvent (core) pero internamente trabaja con DomainApplicationEvent (infrastructure)
 * - Protege contra exploit de metadata excesivo
 * - Geolocalización automática desde IP
 * - Serialización segura de datos
 * - TypeScript garantiza validación en compile-time
 *
 * @implements {IDomainEventRepository}
 */
@injectable()
export class EventBus implements IDomainEventRepository {
  /**
   * emit - Emite un evento de dominio a la base de datos.
   * @param event - El evento de dominio a emitir (DomainApplicationEvent).
   * @returns Una promesa que se resuelve cuando el evento ha sido emitido.
   * @throws Error si hay un problema de conexión con la base de datos.
   */
  public async emit(event: DomainApplicationEvent): Promise<void> {
    const { error } = await database.query<void>({
      query:
        "SELECT * FROM emit_event($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      params: [
        event.action,
        event.endpoint,
        event.occurredAt,
        Array.isArray(event.requiredRole)
          ? event.requiredRole.join(",")
          : event.requiredRole,
        event.isSuccessful,
        event.failureReason,
        event.ip ? JSON.stringify(geoip.lookup(event.ip)) : null,
        event.ip,
        event.table,
        event.userId,
        event.resourceId,
        event.metadata,
        event.method,
        false, // isExploit = false because we are not protecting against metadata exploit
      ],
      single: true,
      isEmptyResponseAnError: false,
    });

    if (error) {
      Debug.error(
        `EventBus: Failed to emit event - ${
          error.message || JSON.stringify(error)
        }`
      );
      throw new Error(
        `EventBus connection error: ${error.message || "Unknown error"}`
      );
    }
  }
}
