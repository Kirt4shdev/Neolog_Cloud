import { container } from "tsyringe";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import { ProvisionDeviceUseCase } from "@application/use-cases/device/ProvisionDeviceUseCase";
import { GetProvisioningStatusUseCase } from "@application/use-cases/provisioning/GetProvisioningStatusUseCase";
import { ToggleProvisioningUseCase } from "@application/use-cases/provisioning/ToggleProvisioningUseCase";
import type { Request, Response } from "express";

export class ProvisioningController {
  /**
   * Provisiona un nuevo dispositivo Neologg
   * POST /unprotected/neologg/provision
   * (Este endpoint NO está protegido - lo llaman los dispositivos en primera instalación)
   */
  public static async provisionDevice(
    req: Request,
    res: Response
  ): Promise<Response> {
    const provisionDeviceUseCase = container.resolve(ProvisionDeviceUseCase);
    const ctx = ContextBuilder.build(req, res);

    const provisionedDevice = await provisionDeviceUseCase.execute({
      contract: req.body,
      ctx,
    });

    return res.status(200).json({
      message: "Device provisioned successfully",
      data: provisionedDevice,
    });
  }

  /**
   * Obtiene el estado actual del provisioning
   * GET /api/admin/neologg/provisioning/status
   */
  public static async getProvisioningStatus(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getProvisioningStatusUseCase = container.resolve(
      GetProvisioningStatusUseCase
    );
    const ctx = ContextBuilder.build(req, res);

    const status = await getProvisioningStatusUseCase.execute({ ctx });

    return res.status(200).json({
      message: "Provisioning status retrieved successfully",
      data: status,
    });
  }

  /**
   * Activa o desactiva el provisioning
   * POST /api/admin/neologg/provisioning/toggle
   */
  public static async toggleProvisioning(
    req: Request,
    res: Response
  ): Promise<Response> {
    const toggleProvisioningUseCase = container.resolve(
      ToggleProvisioningUseCase
    );
    const ctx = ContextBuilder.build(req, res);

    const config = await toggleProvisioningUseCase.execute({
      contract: {
        isEnabled: req.body.isEnabled,
        updatedBy: ctx.adminId as UUID,
      },
      ctx,
    });

    return res.status(200).json({
      message: "Provisioning status updated successfully",
      data: config,
    });
  }
}
