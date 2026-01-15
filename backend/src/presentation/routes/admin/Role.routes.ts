import { Router } from "express";
import { RoleController } from "@presentation/controllers/Role.controller";

export class RoleRoutes {
  public static get routes(): Router {
    const router = Router();

    const roleRouter = Router();

    roleRouter.post("/", RoleController.assignRole);
    roleRouter.delete("/", RoleController.removeRole);

    router.use("/role", roleRouter);

    return router;
  }
}
