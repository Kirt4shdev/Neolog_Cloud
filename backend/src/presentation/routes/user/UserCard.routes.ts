import { Router } from "express";
import { UserCardController } from "@presentation/controllers/UserCard.controller";

export class UserCardRoutes {
  public static get routes(): Router {
    const router = Router();

    router.put("/", UserCardController.updateMyUserCard);
    router.post("/", UserCardController.createMyUserCard);

    return router;
  }
}
