import type { DomainEvent } from "@core/events/entities/DomainEvent";

/**
 * IPasswordRecoveryDomainEventFactory - Interfaz de fábrica de eventos de dominio de recuperación de contraseña
 * @property forgotPassword - Evento de solicitud de cambio de contraseña
 * @property resetPassword - Evento de reseteo de contraseña
 * @property forgotPasswordWithFailure - Evento de solicitud de cambio de contraseña con fallo
 * @property resetPasswordWithFailure - Evento de reseteo de contraseña con fallo
 */
export interface IPasswordRecoveryDomainEventFactory {
  /**
   * Evento: Solicitud de cambio de contraseña
   * @returns DomainEvent
   */
  forgotPassword(): DomainEvent;

  /**
   * Evento: Reseteo de contraseña
   * @returns DomainEvent
   */
  resetPassword(): DomainEvent;

  /**
   * Evento: Solicitud de cambio de contraseña con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  forgotPasswordWithFailure(failureReason?: string): DomainEvent;

  /**
   * Evento: Reseteo de contraseña con fallo
   * @param failureReason - Motivo del fallo
   * @returns DomainEvent
   */
  resetPasswordWithFailure(failureReason?: string): DomainEvent;
}
