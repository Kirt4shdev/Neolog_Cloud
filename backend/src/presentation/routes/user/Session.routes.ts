import { Router } from "express";
import { SessionController } from "@presentation/controllers/Session.controller";

export class SessionRoutes {
  public static get routes(): Router {
    const router = Router();

    // Usuario solo puede borrar sus propias sesiones
    router.delete("/:sessionId", SessionController.deleteMySession);

    return router;
  }
}
