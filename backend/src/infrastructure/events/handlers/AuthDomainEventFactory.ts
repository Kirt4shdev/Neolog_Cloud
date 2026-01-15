import type { IAuthDomainEventFactory } from "@core/auth/events/IAuthDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class AuthDomainEventFactory implements IAuthDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  login(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "login",
      table: "users",
      isSuccessful: true,
      endpoint: "/api/unprotected/auth/login",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
    };
  }

  register(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "register",
      table: "users",
      isSuccessful: true,
      endpoint: "/api/unprotected/auth/register",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  logout(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "logout",
      table: "users",
      isSuccessful: true,
      endpoint: "/api/protected/auth/logout",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "GET",
      userId: this.event?.userId,
    };
  }

  loginWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "login",
      table: "users",
      isSuccessful: false,
      endpoint: "/api/unprotected/auth/login",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  registerWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "register",
      table: "users",
      isSuccessful: false,
      endpoint: "/api/unprotected/auth/register",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  logoutWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "logout",
      table: "users",
      isSuccessful: false,
      endpoint: "/api/protected/auth/logout",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }
}
