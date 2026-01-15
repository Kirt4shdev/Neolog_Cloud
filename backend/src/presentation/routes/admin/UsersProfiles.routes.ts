import { Router } from "express";
import { UserProfileController } from "@presentation/controllers/UserProfile.controller";

export class UsersProfilesRoutes {
  public static get routes(): Router {
    const router = Router();

    const usersProfilesRouter = Router();

    // GET /api/admin/users?limit=5&offset=0
    usersProfilesRouter.get(
      "/",
      UserProfileController.getUsersProfilesWithPagination
    );

    // GET /api/admin/users?userId=123
    usersProfilesRouter.get(
      "/:userId",
      UserProfileController.getUserProfileByUserId
    );

    router.use("/users-profiles", usersProfilesRouter);

    return router;
  }
}
