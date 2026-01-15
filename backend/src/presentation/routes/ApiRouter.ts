import { Router } from "express";
import { CommonRouter } from "./common/CommonRouter";
import { UserRouter } from "./user/UserRouter";
import { AdminRouter } from "./admin/AdminRouter";
import { ClientRouter } from "./client/ClientRouter";
import { requireValidToken } from "@presentation/middlewares/auth/requireValidToken";
import { checkUser } from "@presentation/middlewares/auth/checkUser";
import { checkBlacklist } from "@presentation/middlewares/auth/checkBlacklist";
import { asyncHandler } from "@presentation/helpers/asyncHandler";
import { checkRoles } from "@presentation/middlewares/auth/checkRoles";
import { checkSession } from "@presentation/middlewares/auth/checkSession";

export class ApiRouter {
  public static init(): Router {
    const apiRouter = Router();

    apiRouter.use(
      requireValidToken,
      asyncHandler(checkUser),
      asyncHandler(checkBlacklist),
      asyncHandler(checkSession),
      asyncHandler(checkRoles)
    );

    apiRouter.use("/user", UserRouter.init());
    apiRouter.use("/admin", AdminRouter.init());
    apiRouter.use("/client", ClientRouter.init());
    apiRouter.use("/common", CommonRouter.init());

    return apiRouter;
  }
}
