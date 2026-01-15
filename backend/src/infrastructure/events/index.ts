import "reflect-metadata";
import { container } from "tsyringe";
import { EventBus } from "./EventBus";

/**
 * Registra las dependencias relacionadas con eventos de dominio
 *
 * - IDomainEventRepository: Implementación del bus de eventos
 */
export function registerEventDependencies() {
  container.registerSingleton("IDomainEventRepository", EventBus);
}
