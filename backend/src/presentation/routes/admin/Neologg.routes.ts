import { Router } from "express";
import { DeviceController } from "@presentation/controllers/Device.controller";
import { ProvisioningController } from "@presentation/controllers/Provisioning.controller";

export class NeologgRoutes {
  public static get routes(): Router {
    const router = Router();
    const neologgRouter = Router();

    // Device routes
    neologgRouter.get("/devices", DeviceController.getDeviceList);
    neologgRouter.get("/devices/:deviceId", DeviceController.getDeviceDetail);
    neologgRouter.post(
      "/devices/:deviceId/actions",
      DeviceController.sendDeviceAction
    );

    // Provisioning routes
    neologgRouter.get(
      "/provisioning/status",
      ProvisioningController.getProvisioningStatus
    );
    neologgRouter.post(
      "/provisioning/toggle",
      ProvisioningController.toggleProvisioning
    );

    router.use("/neologg", neologgRouter);

    return router;
  }
}
