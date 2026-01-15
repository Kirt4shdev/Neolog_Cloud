import type { IIpBanDomainEventFactory } from "@core/security/events/IIpBanDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class IpBanEventFactory implements IIpBanDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  ipBanned(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "ip-blocked",
      table: "/ip-bans",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/",
      requiredRole: undefined,
      occurredAt: new Date(),
    };
  }

  tooManyRequests(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "too-many-requests",
      table: "/ip-bans",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/",
      requiredRole: undefined,
      occurredAt: new Date(),
    };
  }

  ipAlreadyBanned(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "ip-already-banned",
      table: "/ip-bans",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/",
      requiredRole: undefined,
      occurredAt: new Date(),
    };
  }

  ipBannedWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "ip-blocked",
      table: "/ip-bans",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
    };
  }

  tooManyRequestsWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "too-many-requests",
      table: "/ip-bans",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
    };
  }
}
