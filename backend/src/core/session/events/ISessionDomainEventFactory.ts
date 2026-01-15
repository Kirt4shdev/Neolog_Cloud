import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * ISessionDomainEventFactory - Interfaz de fábrica de eventos de dominio de sesiones
 * @property createSession - Evento de creación de sesión exitosa
 * @property createSessionWithFailure - Evento de creación de sesión con fallo
 * @property deleteSession - Evento de eliminación de sesión exitosa (logout)
 * @property deleteSessionWithFailure - Evento de eliminación de sesión con fallo
 * @property deleteAllUserSessions - Evento de eliminación de todas las sesiones de un usuario
 * @property deleteAllUserSessionsWithFailure - Evento de fallo al eliminar todas las sesiones
 */
export interface ISessionDomainEventFactory {
  /**
   * Evento: Sesión creada exitosamente
   * @returns DomainEvent
   */
  createSession(): DomainEvent;

  /**
   * Evento: Error al crear sesión
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  createSessionWithFailure(failureReason?: string): DomainEvent;

  /**
   * Evento: Sesión eliminada exitosamente (logout)
   * @returns DomainEvent
   */
  deleteSession(): DomainEvent;

  /**
   * Evento: Error al eliminar sesión
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  deleteSessionWithFailure(failureReason?: string): DomainEvent;

  /**
   * Evento: Todas las sesiones de un usuario eliminadas exitosamente
   * @returns DomainEvent
   */
  deleteAllUserSessions(): DomainEvent;

  /**
   * Evento: Error al eliminar todas las sesiones de un usuario
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  deleteAllUserSessionsWithFailure(failureReason?: string): DomainEvent;
}
