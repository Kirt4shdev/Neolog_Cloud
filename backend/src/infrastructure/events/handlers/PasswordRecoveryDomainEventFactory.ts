import type { IPasswordRecoveryDomainEventFactory } from "@core/password/events/IPasswordRecoveryDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class PasswordRecoveryDomainEventFactory
  implements IPasswordRecoveryDomainEventFactory
{
  constructor(public event?: Partial<DomainApplicationEvent>) {}

  forgotPassword(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "forgot-password",
      table: "password_recovery",
      isSuccessful: true,
      endpoint: "/api/unprotected/auth/forgot-password",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
    };
  }

  resetPassword(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "reset-password",
      table: "password_recovery",
      isSuccessful: true,
      endpoint: "/api/unprotected/auth/reset-password",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
    };
  }

  forgotPasswordWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "forgot-password",
      table: "password_recovery",
      isSuccessful: false,
      endpoint: "/api/unprotected/auth/forgot-password",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  resetPasswordWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "reset-password",
      table: "password_recovery",
      isSuccessful: false,
      endpoint: "/api/unprotected/auth/reset-password",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }
}
