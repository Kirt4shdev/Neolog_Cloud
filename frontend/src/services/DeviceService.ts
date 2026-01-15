import { axiosInstance } from "@/services/axios/axios.instace";
import type { Device, DeviceListItem, ProvisioningConfig } from "@/interfaces/Device";

export class DeviceService {
  /**
   * Obtiene el listado de todos los dispositivos
   */
  static async getDeviceList(): Promise<DeviceListItem[]> {
    const response = await axiosInstance.get("/api/admin/neologg/devices");
    return response.data.data;
  }

  /**
   * Obtiene el detalle de un dispositivo específico
   */
  static async getDeviceDetail(deviceId: string): Promise<Device> {
    const response = await axiosInstance.get(`/api/admin/neologg/devices/${deviceId}`);
    return response.data.data;
  }

  /**
   * Envía una acción MQTT a un dispositivo
   */
  static async sendDeviceAction(
    deviceId: string,
    action: string
  ): Promise<void> {
    await axiosInstance.post(`/api/admin/neologg/devices/${deviceId}/actions`, {
      action,
    });
  }

  /**
   * Obtiene el estado del provisioning
   */
  static async getProvisioningStatus(): Promise<ProvisioningConfig> {
    const response = await axiosInstance.get("/api/admin/neologg/provisioning/status");
    return response.data.data;
  }

  /**
   * Activa o desactiva el provisioning
   */
  static async toggleProvisioning(isEnabled: boolean): Promise<ProvisioningConfig> {
    const response = await axiosInstance.post("/api/admin/neologg/provisioning/toggle", {
      isEnabled,
    });
    return response.data.data;
  }
}
