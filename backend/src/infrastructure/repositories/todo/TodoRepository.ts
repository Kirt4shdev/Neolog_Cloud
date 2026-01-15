import { TodoEntity } from "@core/todo/entities/TodoEntity";
import { ITodoRepository } from "@core/todo/repositories/ITodoRepository";
import { database } from "@infrastructure/database/PostgresDatabase";
import { TodoRepositoryErrorFactory } from "./TodoRepositoryErrorFactory";
import type { CreateTodoContract } from "@core/todo/contracts/CreateTodoContract";
import type { UpdateTodoContract } from "@core/todo/contracts/UpdateTodoContract";
import type { DeleteTodoContract } from "@core/todo/contracts/DeleteTodoContract";
import type { GetTodoByIdContract } from "@core/todo/contracts/GetTodoByIdContract";
import type { GetTodosWithPaginationContract } from "@core/todo/contracts/GetTodosWithPaginationContract";

export class TodoRepository implements ITodoRepository {
  public async createTodo(
    data: CreateTodoContract
  ): Promise<Result<TodoEntity>> {
    const { error, result } = await database.query({
      query: `SELECT * FROM create_todo($1, $2, $3, $4, $5)`,
      params: [
        data.userId,
        data.title,
        data.description,
        data.priority,
        data.dueDate,
      ],
      single: true,
      schema: TodoEntity,
    });

    if (error) {
      return { error: new TodoRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getTodoById(
    data: GetTodoByIdContract
  ): Promise<Result<TodoEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_todo_by_id($1)",
      params: [data.todoId],
      single: true,
      schema: TodoEntity,
      isEmptyResponseAnError: true,
      emptyResponseMessageError: "Todo not found",
    });

    if (error) {
      return { error: new TodoRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getTodosWithPagination(
    data: GetTodosWithPaginationContract
  ): Promise<Result<TodoEntity[]>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_todos_with_pagination($1, $2, $3)",
      params: [data.userId, data.limit, data.offset],
      single: false,
      schema: TodoEntity,
      isEmptyResponseAnError: true,
      emptyResponseMessageError: "No todos found",
    });

    if (error) {
      return { error: new TodoRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async updateTodo(
    data: UpdateTodoContract
  ): Promise<Result<TodoEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM update_todo($1, $2, $3, $4, $5, $6)",
      params: [
        data.todoId,
        data.title,
        data.description,
        data.isCompleted,
        data.priority,
        data.dueDate,
      ],
      single: true,
      schema: TodoEntity,
    });

    if (error) {
      return { error: new TodoRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async deleteTodo(
    data: DeleteTodoContract
  ): Promise<Result<TodoEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM delete_todo($1, $2)",
      params: [data.todoId, data.deletedBy],
      single: true,
      schema: TodoEntity,
    });

    if (error) {
      return { error: new TodoRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
