import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IUserCardDomainEventFactory - Factory de eventos de dominio para tarjetas de usuario
 *
 * Define los eventos que pueden ocurrir en el ciclo de vida de una tarjeta de usuario
 */
export interface IUserCardDomainEventFactory {
  /**
   * Evento: Tarjeta de usuario creada
   */
  userCardCreated(userCardId: UUID, userId: UUID): DomainEvent;

  /**
   * Evento: Tarjeta de usuario actualizada
   */
  userCardUpdated(userCardId: UUID, userId: UUID): DomainEvent;
}
