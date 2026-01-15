import { Router } from "express";

export class TestCommonRoutes {
  public static get routes(): Router {
    const router = Router();

    const testCommonRouter = Router();

    testCommonRouter.get("/", (_req, res) => {
      res.status(200).json({ message: "Test Common Route" });
    });

    router.use("/test", testCommonRouter);

    return router;
  }
}
