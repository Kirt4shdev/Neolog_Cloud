import type { ISessionDomainEventFactory } from "@core/session/events/ISessionDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class SessionDomainEventFactory implements ISessionDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {}

  createSession(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "create-session",
      table: "sessions",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/protected/sessions",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
    };
  }

  createSessionWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "create-session",
      table: "sessions",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/protected/sessions",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  deleteSession(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete-session",
      table: "sessions",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/protected/sessions",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "DELETE",
    };
  }

  deleteSessionWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete-session",
      table: "sessions",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/protected/sessions",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "DELETE",
    };
  }

  deleteAllUserSessions(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete-all-user-sessions",
      table: "sessions",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/protected/sessions/all",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "DELETE",
    };
  }

  deleteAllUserSessionsWithFailure(
    failureReason?: string
  ): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete-all-user-sessions",
      table: "sessions",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/protected/sessions/all",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "DELETE",
    };
  }

  getSessionsByUserId(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get",
      table: "sessions",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "GET",
    };
  }

  getSessionsByUserIdWithFailure(
    failureReason?: string
  ): DomainApplicationEvent {
    return {
      ...this.event,
      action: "delete",
      table: "sessions",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }
}
