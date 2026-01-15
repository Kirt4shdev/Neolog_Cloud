import type { IUserCardDomainEventFactory } from "@core/user-card/events/IUserCardDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class UserCardDomainEventFactory implements IUserCardDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  userCardCreated(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "create",
      table: "user_cards",
      isSuccessful: true,
      endpoint: "/api/user/card",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
      userId: this.event?.userId,
    };
  }

  userCardUpdated(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "update",
      table: "user_cards",
      isSuccessful: true,
      endpoint: "/api/user/card",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "PUT",
      userId: this.event?.userId,
    };
  }

  userCardCreatedWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "create",
      table: "user_cards",
      isSuccessful: false,
      endpoint: "/api/user/card",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
      userId: this.event?.userId,
    };
  }

  userCardUpdatedWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "update",
      table: "user_cards",
      isSuccessful: false,
      endpoint: "/api/user/card",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "PUT",
      userId: this.event?.userId,
    };
  }
}
