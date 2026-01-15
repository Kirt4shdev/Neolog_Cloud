import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IIpBanDomainEventFactory - Interfaz de fábrica de eventos de dominio de IP de ban
 * @property ipBanned - Evento de IP ban
 * @property tooManyRequests - Evento de demasiadas solicitudes
 * @property ipAlreadyBanned - Evento de IP ya ban
 * @property ipBannedWithFailure - Evento de IP ban con fallo
 * @property tooManyRequestsWithFailure - Evento de demasiadas solicitudes con fallo
 */
export interface IIpBanDomainEventFactory {
  ipBanned(): DomainEvent;
  tooManyRequests(): DomainEvent;
  ipAlreadyBanned(): DomainEvent;

  ipBannedWithFailure(failureReason?: string): DomainEvent;
  tooManyRequestsWithFailure(failureReason?: string): DomainEvent;
}
