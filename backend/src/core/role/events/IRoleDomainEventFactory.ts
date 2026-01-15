import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IRoleDomainEventFactory - Interfaz de fábrica de eventos de dominio de roles
 * @property assignRole - Evento de asignación de rol
 * @property removeRole - Evento de eliminación de rol
 * @property assignRoleWithFailure - Evento de asignación de rol con fallo
 * @property removeRoleWithFailure - Evento de eliminación de rol con fallo
 */
export interface IRoleDomainEventFactory {
  /**
   * Evento: Asignación de rol
   * @returns DomainEvent
   */
  assignRole(): DomainEvent;
  /**
   * Evento: Eliminación de rol
   * @returns DomainEvent
   */
  removeRole(): DomainEvent;

  /**
   * Evento: Asignación de rol con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  assignRoleWithFailure(failureReason?: string): DomainEvent;
  /**
   * Evento: Eliminación de rol con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  removeRoleWithFailure(failureReason?: string): DomainEvent;
}
