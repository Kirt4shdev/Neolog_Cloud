import { Router } from "express";
import { AuthRoutes } from "./Auth.routes";
import { PasswordRoutes } from "./Password.routes";
import { HealthRoutes } from "./Health.routes";
import { NeologgUnprotectedRoutes } from "./Neologg.routes";

export class UnprotectedRouter {
  static init(): Router {
    const unprotectedRouter = Router();

    unprotectedRouter.use(AuthRoutes.routes);
    unprotectedRouter.use(PasswordRoutes.routes);
    unprotectedRouter.use(HealthRoutes.routes);
    unprotectedRouter.use(NeologgUnprotectedRoutes.routes);

    return unprotectedRouter;
  }
}
