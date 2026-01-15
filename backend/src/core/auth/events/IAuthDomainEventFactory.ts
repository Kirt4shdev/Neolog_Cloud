import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IAuthDomainEventFactory - Interfaz de fábrica de eventos de dominio de autenticación
 * @property login - Evento de login
 * @property register - Evento de registro
 * @property logout - Evento de logout
 * @property loginWithFailure - Evento de login con fallo
 * @property registerWithFailure - Evento de registro con fallo
 * @property logoutWithFailure - Evento de logout con fallo
 */
export interface IAuthDomainEventFactory {
  /**
   * Evento: Login
   * @returns DomainEvent
   */
  login(): DomainEvent;
  /**
   * Evento: Registro
   * @returns DomainEvent
   */
  register(): DomainEvent;
  /**
   * Evento: Logout
   * @returns DomainEvent
   */
  logout(): DomainEvent;
  /**
   * Evento: Login con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */

  /**
   * Evento: Registro con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  loginWithFailure(failureReason?: string): DomainEvent;
  /**
   * Evento: Logout con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  registerWithFailure(failureReason?: string): DomainEvent;
  /**
   * Evento: Logout con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  logoutWithFailure(failureReason?: string): DomainEvent;
}
