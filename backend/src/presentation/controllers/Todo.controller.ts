import { container } from "tsyringe";
import { CreateTodoUseCase } from "@application/use-cases/todo/CreateTodoUseCase";
import { GetTodoByIdUseCase } from "@application/use-cases/todo/GetTodoByIdUseCase";
import { GetTodosWithPaginationUseCase } from "@application/use-cases/todo/GetTodosWithPaginationUseCase";
import { UpdateTodoUseCase } from "@application/use-cases/todo/UpdateTodoUseCase";
import { DeleteTodoUseCase } from "@application/use-cases/todo/DeleteTodoUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import type { Request, Response } from "express";

export class TodoController {
  public static async createTodo(
    req: Request,
    res: Response
  ): Promise<Response> {
    const createTodoUseCase = container.resolve(CreateTodoUseCase);

    const ctx = ContextBuilder.build(req, res);

    const todo = await createTodoUseCase.execute({
      contract: { ...req.body, userId: ctx.userId },
      ctx: ctx,
    });

    return res.status(201).json({
      message: "Todo created successfully",
      data: todo,
    });
  }

  public static async getTodoById(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getTodoByIdUseCase = container.resolve(GetTodoByIdUseCase);

    const ctx = ContextBuilder.build(req, res);

    const todo = await getTodoByIdUseCase.execute({
      contract: { todoId: req.params.todoId as UUID },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Todo retrieved successfully",
      data: todo,
    });
  }

  public static async getTodosWithPagination(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getTodosWithPaginationUseCase = container.resolve(
      GetTodosWithPaginationUseCase
    );

    const ctx = ContextBuilder.build(req, res);

    const todos = await getTodosWithPaginationUseCase.execute({
      contract: {
        userId: ctx.userId as UUID,
        limit: Number(req.query.limit),
        offset: Number(req.query.offset),
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Todos retrieved successfully",
      data: todos,
    });
  }

  public static async updateTodo(
    req: Request,
    res: Response
  ): Promise<Response> {
    const updateTodoUseCase = container.resolve(UpdateTodoUseCase);

    const ctx = ContextBuilder.build(req, res);

    const todo = await updateTodoUseCase.execute({
      contract: { ...req.body, todoId: req.params.todoId as UUID },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Todo updated successfully",
      data: todo,
    });
  }

  public static async deleteTodo(
    req: Request,
    res: Response
  ): Promise<Response> {
    const deleteTodoUseCase = container.resolve(DeleteTodoUseCase);

    const ctx = ContextBuilder.build(req, res);

    const todo = await deleteTodoUseCase.execute({
      contract: {
        todoId: req.params.todoId as UUID,
        deletedBy: ctx.userId as UUID,
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Todo deleted successfully",
      data: todo,
    });
  }
}
