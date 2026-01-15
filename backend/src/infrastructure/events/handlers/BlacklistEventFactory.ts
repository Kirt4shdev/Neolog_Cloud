import type { IBlacklistDomainEventFactory } from "@core/blacklist/events/IBlacklistDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class BlacklistEventFactory implements IBlacklistDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  addToBlacklist(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "block",
      table: "blacklist",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/admin/blacklist",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      method: "POST",
    };
  }

  removeFromBlacklist(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "unblock",
      table: "blacklist",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/admin/blacklist",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      method: "DELETE",
    };
  }

  addToBlacklistWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "block",
      table: "blacklist",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/admin/blacklist",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  removeFromBlacklistWithFailure(
    failureReason?: string
  ): DomainApplicationEvent {
    return {
      ...this.event,
      action: "unblock",
      table: "blacklist",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/admin/blacklist",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "DELETE",
    };
  }
}
