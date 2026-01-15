import { Router } from "express";
import { SessionController } from "@presentation/controllers/Session.controller";

export class SessionRoutes {
  public static get routes(): Router {
    const router = Router();

    const sessionRouter = Router();

    sessionRouter.delete("/:sessionId", SessionController.deleteSession);

    router.use("/session", sessionRouter);

    return router;
  }
}
