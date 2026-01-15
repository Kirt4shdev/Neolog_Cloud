import type { DomainEvent } from "@core/events/entities/DomainEvent";

export interface IProvisioningDomainEventFactory {
  getProvisioningStatus(): DomainEvent;
  getProvisioningStatusWithFailure(failureReason?: string): DomainEvent;

  toggleProvisioning(): DomainEvent;
  toggleProvisioningWithFailure(failureReason?: string): DomainEvent;
}
