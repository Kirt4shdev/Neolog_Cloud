import type { IProvisioningDomainEventFactory } from "@core/provisioning/events/IProvisioningDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class ProvisioningDomainEventFactory
  implements IProvisioningDomainEventFactory
{
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  getProvisioningStatus(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get_provisioning_status",
      table: "provisioning_config",
      isSuccessful: true,
      endpoint: "/api/admin/neologg/provisioning/status",
      requiredRole: "admin",
      occurredAt: new Date(),
      method: "GET",
    };
  }

  getProvisioningStatusWithFailure(
    failureReason?: string
  ): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get_provisioning_status",
      table: "provisioning_config",
      isSuccessful: false,
      endpoint: "/api/admin/neologg/provisioning/status",
      requiredRole: "admin",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }

  toggleProvisioning(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "toggle_provisioning",
      table: "provisioning_config",
      isSuccessful: true,
      endpoint: "/api/admin/neologg/provisioning/toggle",
      requiredRole: "admin",
      occurredAt: new Date(),
      method: "POST",
    };
  }

  toggleProvisioningWithFailure(
    failureReason?: string
  ): DomainApplicationEvent {
    return {
      ...this.event,
      action: "toggle_provisioning",
      table: "provisioning_config",
      isSuccessful: false,
      endpoint: "/api/admin/neologg/provisioning/toggle",
      requiredRole: "admin",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }
}
