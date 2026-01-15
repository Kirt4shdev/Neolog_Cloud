import { Router } from "express";
import { TestCommonRoutes } from "./TestCommon.routes";

export class CommonRouter {
  public static init(): Router {
    const commonRouter = Router();

    commonRouter.use(TestCommonRoutes.routes);

    return commonRouter;
  }
}
