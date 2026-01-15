import { container } from "tsyringe";
import { Debug } from "@shared/utils/Debug";
import type { IDomainEventRepository } from "@core/events/repositories/IDomainEventRepository";
import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * EventService - Servicio estático para emitir eventos de dominio
 *
 * Capa de servicio que encapsula la emisión de eventos.
 * Provee un método estático para que los use cases puedan emitir eventos
 * sin necesidad de inyectar el repositorio.
 *
 * Uso en Use Cases:
 * ```typescript
 * await EventService.emit(event.login());
 * ```
 *
 * Ventajas:
 * - Sin inyección de dependencias en cada use case
 * - Centraliza la lógica de emisión de eventos
 * - Maneja errores de forma consistente
 */
export class EventService {
  /**
   * emit - Emite un evento de dominio
   * @param event - Evento de dominio a emitir
   * @returns Promise que se resuelve cuando el evento ha sido persistido
   *
   * Nota: Los errores se logean pero NO se re-lanzan para evitar que
   * eventos fallidos rompan el flujo de negocio.
   */
  public static async emit(event: DomainEvent): Promise<void> {
    try {
      const eventRepository = container.resolve<IDomainEventRepository>(
        "IDomainEventRepository"
      );
      await eventRepository.emit(event);
    } catch (error) {
      // Log del error pero no re-throw para evitar que eventos fallidos rompan el flujo
      Debug.error({ EventService_emit_ERROR: error }, true);
    }
  }
}
