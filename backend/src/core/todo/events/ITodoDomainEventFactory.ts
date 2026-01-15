import type { DomainEvent } from "@core/events/entities/DomainEvent";

export interface ITodoDomainEventFactory {
  createTodo(): DomainEvent;
  createTodoWithFailure(failureReason?: string): DomainEvent;

  getTodoById(): DomainEvent;
  getTodoByIdWithFailure(failureReason?: string): DomainEvent;

  getTodosWithPagination(): DomainEvent;
  getTodosWithPaginationWithFailure(failureReason?: string): DomainEvent;

  updateTodo(): DomainEvent;
  updateTodoWithFailure(failureReason?: string): DomainEvent;

  deleteTodo(): DomainEvent;
  deleteTodoWithFailure(failureReason?: string): DomainEvent;
}
