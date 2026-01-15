import { Router } from "express";
import { BlacklistController } from "@presentation/controllers/Blacklist.controller";

export class BlacklistRoutes {
  public static get routes(): Router {
    const router = Router();

    const blackListRouter = Router();

    blackListRouter.post("/", BlacklistController.addUserToBlacklist);
    blackListRouter.delete("/", BlacklistController.removeUserFromBlacklist);

    router.use("/blacklist", blackListRouter);

    return router;
  }
}
