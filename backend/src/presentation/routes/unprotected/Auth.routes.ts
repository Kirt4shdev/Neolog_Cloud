import { Router } from "express";
import { AuthController } from "@presentation/controllers/Auth.controller";
import { checkUser } from "@presentation/middlewares/auth/checkUser";
import { asyncHandler } from "@presentation/helpers/asyncHandler";

export class AuthRoutes {
  public static get routes(): Router {
    const router = Router();

    const authRouter = Router();

    authRouter.post("/login", AuthController.login);
    authRouter.post("/register", AuthController.register);
    authRouter.get("/logout", asyncHandler(checkUser), AuthController.logout);

    router.use("/auth", authRouter);

    return router;
  }
}
