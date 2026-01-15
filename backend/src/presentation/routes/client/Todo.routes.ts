import { Router } from "express";
import { TodoController } from "@presentation/controllers/Todo.controller";
import { asyncHandler } from "@presentation/helpers/asyncHandler";

export class TodoRoutes {
  public static get routes(): Router {
    const router = Router();
    const todoRouter = Router();

    todoRouter.post("/", asyncHandler(TodoController.createTodo));
    todoRouter.get("/:todoId", asyncHandler(TodoController.getTodoById));
    todoRouter.get("/", asyncHandler(TodoController.getTodosWithPagination));
    todoRouter.put("/:todoId", asyncHandler(TodoController.updateTodo));
    todoRouter.delete("/:todoId", asyncHandler(TodoController.deleteTodo));

    router.use("/todo", todoRouter);

    return router;
  }
}
