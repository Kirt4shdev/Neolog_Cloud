import { container } from "tsyringe";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import { GetDeviceListUseCase } from "@application/use-cases/device/GetDeviceListUseCase";
import { GetDeviceDetailUseCase } from "@application/use-cases/device/GetDeviceDetailUseCase";
import { SendDeviceActionUseCase } from "@application/use-cases/device/SendDeviceActionUseCase";
import { DeleteDeviceUseCase } from "@application/use-cases/device/DeleteDeviceUseCase";
import type { Request, Response } from "express";

export class DeviceController {
  /**
   * Obtiene el listado de dispositivos
   * GET /api/admin/neologg/devices
   */
  public static async getDeviceList(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getDeviceListUseCase = container.resolve(GetDeviceListUseCase);
    const ctx = ContextBuilder.build(req, res);

    const devices = await getDeviceListUseCase.execute({ ctx });

    return res.status(200).json({
      message: "Devices retrieved successfully",
      data: devices,
    });
  }

  /**
   * Obtiene el detalle de un dispositivo específico
   * GET /api/admin/neologg/devices/:deviceId
   */
  public static async getDeviceDetail(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getDeviceDetailUseCase = container.resolve(GetDeviceDetailUseCase);
    const ctx = ContextBuilder.build(req, res);

    const device = await getDeviceDetailUseCase.execute({
      contract: { deviceId: req.params.deviceId },
      ctx,
    });

    return res.status(200).json({
      message: "Device detail retrieved successfully",
      data: device,
    });
  }

  /**
   * Envía una acción a un dispositivo
   * POST /api/admin/neologg/devices/:deviceId/actions
   */
  public static async sendDeviceAction(
    req: Request,
    res: Response
  ): Promise<Response> {
    const sendDeviceActionUseCase = container.resolve(SendDeviceActionUseCase);
    const ctx = ContextBuilder.build(req, res);

    const actionResult = await sendDeviceActionUseCase.execute({
      contract: {
        deviceId: req.params.deviceId,
        action: req.body.action,
        requestedBy: ctx.adminId as UUID,
      },
      ctx,
    });

    return res.status(200).json({
      message: "Action sent successfully",
      data: actionResult,
    });
  }

  /**
   * Elimina un dispositivo
   * DELETE /api/admin/neologg/devices/:deviceId
   */
  public static async deleteDevice(
    req: Request,
    res: Response
  ): Promise<Response> {
    const deleteDeviceUseCase = container.resolve(DeleteDeviceUseCase);
    const ctx = ContextBuilder.build(req, res);

    const deletedDevice = await deleteDeviceUseCase.execute({
      contract: { deviceId: req.params.deviceId },
      ctx,
    });

    return res.status(200).json({
      message: "Device deleted successfully",
      data: deletedDevice,
    });
  }
}
