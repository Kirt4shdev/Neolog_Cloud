import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IUserDomainEventFactory - Interfaz de fábrica de eventos de dominio de usuario
 * @property isValidUserId - Evento de validación de ID de usuario
 */
export interface IUserDomainEventFactory {
  /**
   * Evento de validación de ID de usuario
   * @returns DomainEvent
   */
  isValidUserId(): DomainEvent;
}
