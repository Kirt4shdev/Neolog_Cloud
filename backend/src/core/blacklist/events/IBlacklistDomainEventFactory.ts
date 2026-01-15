import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IBlacklistDomainEventFactory - Interfaz de fábrica de eventos de dominio de blacklist
 * @property addToBlacklist - Evento de agregado a la blacklist
 * @property removeFromBlacklist - Evento de eliminado de la blacklist
 * @property addToBlacklistWithFailure - Evento de agregado a la blacklist con fallo
 * @property removeFromBlacklistWithFailure - Evento de eliminado de la blacklist con fallo
 */
export interface IBlacklistDomainEventFactory {
  /**
   * Evento: Agregado a la blacklist
   * @returns DomainEvent
   */
  addToBlacklist(): DomainEvent;
  /**
   * Evento: Eliminado de la blacklist
   * @returns DomainEvent
   */
  removeFromBlacklist(): DomainEvent;

  /**
   * Evento: Agregado a la blacklist con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  addToBlacklistWithFailure(failureReason?: string): DomainEvent;
  /**
   * Evento: Eliminado de la blacklist con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  removeFromBlacklistWithFailure(failureReason?: string): DomainEvent;
}
