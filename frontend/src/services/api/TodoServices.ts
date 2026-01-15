import { ApiService } from "../ApiService";
import type { TodoEntity } from "@core/todo/entities/TodoEntity";
import type { CreateTodoContract } from "@core/todo/contracts/CreateTodoContract";
import type { UpdateTodoContract } from "@core/todo/contracts/UpdateTodoContract";
import type { Pagination } from "@core/shared/contracts/Pagination";

export class TodoServices extends ApiService {
  public async createTodo(
    data: Omit<CreateTodoContract, "userId">
  ): Promise<TodoEntity> {
    return await this.fetch<TodoEntity>("POST", "/api/client/todo", data);
  }

  public async getTodoById(todoId: string): Promise<TodoEntity> {
    return await this.fetch<TodoEntity>("GET", `/api/client/todo/${todoId}`);
  }

  public async getTodosWithPagination(data: Pagination): Promise<TodoEntity[]> {
    const { limit, offset } = data;

    return await this.fetch<TodoEntity[]>(
      "GET",
      `/api/client/todo?limit=${limit}&offset=${offset}`
    );
  }

  public async updateTodo(
    todoId: string,
    data: Partial<Omit<UpdateTodoContract, "todoId">>
  ): Promise<TodoEntity> {
    return await this.fetch<TodoEntity>(
      "PUT",
      `/api/client/todo/${todoId}`,
      data
    );
  }

  public async deleteTodo(todoId: string): Promise<TodoEntity> {
    return await this.fetch<TodoEntity>("DELETE", `/api/client/todo/${todoId}`);
  }
}
