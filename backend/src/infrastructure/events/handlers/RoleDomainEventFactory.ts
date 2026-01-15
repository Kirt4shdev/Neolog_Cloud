import type { IRoleDomainEventFactory } from "@core/role/events/IRoleDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class RoleDomainEventFactory implements IRoleDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {}

  assignRole(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "role-added",
      table: "admins",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/admin/roles",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      method: "POST",
    };
  }

  removeRole(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "role-removed",
      table: "admins",
      isSuccessful: true,
      endpoint: this.event?.endpoint || "/api/admin/roles",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      method: "DELETE",
    };
  }

  assignRoleWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "role-added",
      table: "admins",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/admin/roles",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  removeRoleWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "role-removed",
      table: "admins",
      isSuccessful: false,
      endpoint: this.event?.endpoint || "/api/admin/roles",
      requiredRole: ["admin"],
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "DELETE",
    };
  }
}
