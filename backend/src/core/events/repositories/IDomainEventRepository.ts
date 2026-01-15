import type { DomainEvent } from "../entities/DomainEvent";

export interface IDomainEventRepository {
  /**
   * Método para emitir un evento
   * @param event - Evento a emitir
   * @returns Promise<void>
   */
  emit(event: DomainEvent): Promise<void>;
}
