import { Router } from "express";

export class HealthRoutes {
  public static get routes(): Router {
    const router = Router();

    router.get("/health", (_req, res) => {
      try {
        return res.status(200).end();
      } catch (error) {
        return res.status(500).end();
      }
    });

    return router;
  }
}
