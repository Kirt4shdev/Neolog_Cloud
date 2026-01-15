import { Router } from "express";

export class TestClientRoutes {
  public static get routes(): Router {
    const router = Router();

    const testClientRouter = Router();

    testClientRouter.get("/", (_req, res) => {
      res.status(200).json({ message: "Test Client Route" });
    });

    router.use("/test", testClientRouter);

    return router;
  }
}
