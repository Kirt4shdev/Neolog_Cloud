import type { IDeviceDomainEventFactory } from "@core/device/events/IDeviceDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class DeviceDomainEventFactory implements IDeviceDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  provisionDevice(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "provision_device",
      table: "devices",
      isSuccessful: true,
      endpoint: "/unprotected/neologg/provision",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
    };
  }

  provisionDeviceWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "provision_device",
      table: "devices",
      isSuccessful: false,
      endpoint: "/unprotected/neologg/provision",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  getDeviceList(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get_device_list",
      table: "devices",
      isSuccessful: true,
      endpoint: "/api/admin/neologg/devices",
      requiredRole: "admin",
      occurredAt: new Date(),
      method: "GET",
    };
  }

  getDeviceListWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get_device_list",
      table: "devices",
      isSuccessful: false,
      endpoint: "/api/admin/neologg/devices",
      requiredRole: "admin",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }

  getDeviceDetail(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get_device_detail",
      table: "devices",
      isSuccessful: true,
      endpoint: "/api/admin/neologg/devices/:deviceId",
      requiredRole: "admin",
      occurredAt: new Date(),
      method: "GET",
    };
  }

  getDeviceDetailWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "get_device_detail",
      table: "devices",
      isSuccessful: false,
      endpoint: "/api/admin/neologg/devices/:deviceId",
      requiredRole: "admin",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "GET",
    };
  }

  sendDeviceAction(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "send_device_action",
      table: "device_actions",
      isSuccessful: true,
      endpoint: "/api/admin/neologg/devices/:deviceId/actions",
      requiredRole: "admin",
      occurredAt: new Date(),
      method: "POST",
    };
  }

  sendDeviceActionWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "send_device_action",
      table: "device_actions",
      isSuccessful: false,
      endpoint: "/api/admin/neologg/devices/:deviceId/actions",
      requiredRole: "admin",
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  processHeartbeat(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "process_heartbeat",
      table: "device_transmissions",
      isSuccessful: true,
      endpoint: "mqtt://production/neologg/+/heartbeat",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "MQTT",
    };
  }

  processHeartbeatWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "process_heartbeat",
      table: "device_transmissions",
      isSuccessful: false,
      endpoint: "mqtt://production/neologg/+/heartbeat",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "MQTT",
    };
  }

  processData(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "process_data",
      table: "device_transmissions",
      isSuccessful: true,
      endpoint: "mqtt://production/neologg/+/data",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "MQTT",
    };
  }

  processDataWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "process_data",
      table: "device_transmissions",
      isSuccessful: false,
      endpoint: "mqtt://production/neologg/+/data",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "MQTT",
    };
  }

  processLicense(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "process_license",
      table: "device_transmissions",
      isSuccessful: true,
      endpoint: "mqtt://production/neologg/+/license",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "MQTT",
    };
  }

  processLicenseWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "process_license",
      table: "device_transmissions",
      isSuccessful: false,
      endpoint: "mqtt://production/neologg/+/license",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "MQTT",
    };
  }
}
