import { Router } from "express";
import { UserCardRoutes } from "./UserCard.routes";
import { UserProfileRoutes } from "./Profile.routes";
import { SessionRoutes } from "./Session.routes";

export class UserRouter {
  static init(): Router {
    const userRouter = Router();

    userRouter.use("/card", UserCardRoutes.routes);
    userRouter.use("/profile", UserProfileRoutes.routes);
    userRouter.use("/session", SessionRoutes.routes);

    return userRouter;
  }
}
