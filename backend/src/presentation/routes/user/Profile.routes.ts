import { Router } from "express";
import { UserProfileController } from "@presentation/controllers/UserProfile.controller";

export class UserProfileRoutes {
  public static get routes(): Router {
    const router = Router();

    router.get("/me", UserProfileController.getMyProfile);

    return router;
  }
}
