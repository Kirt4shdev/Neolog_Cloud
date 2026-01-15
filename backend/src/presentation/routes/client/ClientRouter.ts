import { Router } from "express";
import { TestClientRoutes } from "./TestClient.routes";
import { TodoRoutes } from "./Todo.routes";
import { requireClientAuth } from "@presentation/middlewares/auth/requireClientAuth";
import { asyncHandler } from "@presentation/helpers/asyncHandler";

export class ClientRouter {
  static init(): Router {
    const clientRouter = Router();

    clientRouter.use(asyncHandler(requireClientAuth));

    clientRouter.use(TestClientRoutes.routes);
    clientRouter.use(TodoRoutes.routes);

    return clientRouter;
  }
}
