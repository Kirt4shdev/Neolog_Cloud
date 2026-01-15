import { Router } from "express";
import { RoleRoutes } from "./Role.routes";
import { BlacklistRoutes } from "./BlackList.routes";
import { UsersProfilesRoutes } from "./UsersProfiles.routes";
import { SessionRoutes } from "./Session.routes";
import { NeologgRoutes } from "./Neologg.routes";
import { requireAdminAuth } from "@presentation/middlewares/auth/requireAdminAuth";
import { asyncHandler } from "@presentation/helpers/asyncHandler";

export class AdminRouter {
  public static init(): Router {
    const adminRouter = Router();

    adminRouter.use(asyncHandler(requireAdminAuth));

    adminRouter.use(RoleRoutes.routes);
    adminRouter.use(BlacklistRoutes.routes);
    adminRouter.use(UsersProfilesRoutes.routes);
    adminRouter.use(SessionRoutes.routes);
    adminRouter.use(NeologgRoutes.routes);

    return adminRouter;
  }
}
