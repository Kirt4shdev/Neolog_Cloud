import type { DomainEvent } from "@core/events/entities/DomainEvent";

export interface IDeviceDomainEventFactory {
  provisionDevice(): DomainEvent;
  provisionDeviceWithFailure(failureReason?: string): DomainEvent;

  getDeviceList(): DomainEvent;
  getDeviceListWithFailure(failureReason?: string): DomainEvent;

  getDeviceDetail(): DomainEvent;
  getDeviceDetailWithFailure(failureReason?: string): DomainEvent;

  sendDeviceAction(): DomainEvent;
  sendDeviceActionWithFailure(failureReason?: string): DomainEvent;

  processHeartbeat(): DomainEvent;
  processHeartbeatWithFailure(failureReason?: string): DomainEvent;

  processData(): DomainEvent;
  processDataWithFailure(failureReason?: string): DomainEvent;

  processLicense(): DomainEvent;
  processLicenseWithFailure(failureReason?: string): DomainEvent;
}
