import { Router } from "express";
import { ProvisioningController } from "@presentation/controllers/Provisioning.controller";

export class NeologgUnprotectedRoutes {
  public static get routes(): Router {
    const router = Router();
    const neologgRouter = Router();

    // Provision endpoint (unprotected - llamado por dispositivos)
    neologgRouter.post("/provision", ProvisioningController.provisionDevice);

    router.use("/neologg", neologgRouter);

    return router;
  }
}
