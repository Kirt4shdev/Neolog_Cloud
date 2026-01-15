import { Router } from "express";
import { PasswordController } from "@presentation/controllers/Password.controller";

export class PasswordRoutes {
  public static get routes(): Router {
    const router = Router();

    const passwordRouter = Router();

    passwordRouter.post("/forgot", PasswordController.forgotPassword);
    passwordRouter.post("/reset/:token", PasswordController.resetPassword);

    router.use("/password", passwordRouter);

    return router;
  }
}
