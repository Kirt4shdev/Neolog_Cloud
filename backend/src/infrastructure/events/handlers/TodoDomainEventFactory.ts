import type { ITodoDomainEventFactory } from "@core/todo/events/ITodoDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class TodoDomainEventFactory implements ITodoDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  createTodo(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "create",
      table: "todos",
      isSuccessful: true,
      endpoint: "/api/client/todo",
      requiredRole: "client",
      occurredAt: new Date(),
      method: "POST",
    };
  }

  createTodoWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "create",
      table: "todos",
      isSuccessful: false,
      endpoint: "/api/client/todo",
      requiredRole: "client",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  getTodoById(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get",
      table: "todos",
      isSuccessful: true,
      endpoint: "/api/client/todo/:todoId",
      requiredRole: "client",
      occurredAt: new Date(),
      method: "GET",
    };
  }

  getTodoByIdWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get",
      table: "todos",
      isSuccessful: false,
      endpoint: "/api/client/todo/:todoId",
      requiredRole: "client",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }

  getTodosWithPagination(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get",
      table: "todos",
      isSuccessful: true,
      endpoint: "/api/client/todo",
      requiredRole: "client",
      occurredAt: new Date(),
      method: "GET",
    };
  }

  getTodosWithPaginationWithFailure(
    failureReason?: string
  ): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get",
      table: "todos",
      isSuccessful: false,
      endpoint: "/api/client/todo",
      requiredRole: "client",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }

  updateTodo(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "update",
      table: "todos",
      isSuccessful: true,
      endpoint: "/api/client/todo/:todoId",
      requiredRole: "client",
      occurredAt: new Date(),
      method: "PUT",
    };
  }

  updateTodoWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "update",
      table: "todos",
      isSuccessful: false,
      endpoint: "/api/client/todo/:todoId",
      requiredRole: "client",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "PUT",
    };
  }

  deleteTodo(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete",
      table: "todos",
      isSuccessful: true,
      endpoint: "/api/client/todo/:todoId",
      requiredRole: "client",
      occurredAt: new Date(),
      method: "DELETE",
    };
  }

  deleteTodoWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete",
      table: "todos",
      isSuccessful: false,
      endpoint: "/api/client/todo/:todoId",
      requiredRole: "client",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "DELETE",
    };
  }
}
