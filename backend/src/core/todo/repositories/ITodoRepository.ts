import type { TodoEntity } from "../entities/TodoEntity";
import type { CreateTodoContract } from "../contracts/CreateTodoContract";
import type { UpdateTodoContract } from "../contracts/UpdateTodoContract";
import type { DeleteTodoContract } from "../contracts/DeleteTodoContract";
import type { GetTodoByIdContract } from "../contracts/GetTodoByIdContract";
import type { GetTodosWithPaginationContract } from "../contracts/GetTodosWithPaginationContract";

/**
 * ITodoRepository - Interfaz de repositorio de ToDo's
 */
export interface ITodoRepository {
  /**
   * Crear un nuevo ToDo
   * @param data - Datos del ToDo
   * @returns Promise<Result<TodoEntity>>
   */
  createTodo(data: CreateTodoContract): Promise<Result<TodoEntity>>;

  /**
   * Obtener un ToDo por ID
   * @param data - ID del ToDo
   * @returns Promise<Result<TodoEntity>>
   */
  getTodoById(data: GetTodoByIdContract): Promise<Result<TodoEntity>>;

  /**
   * Obtener ToDo's con paginación
   * @param data - Parámetros de paginación
   * @returns Promise<Result<TodoEntity[]>>
   */
  getTodosWithPagination(
    data: GetTodosWithPaginationContract
  ): Promise<Result<TodoEntity[]>>;

  /**
   * Actualizar un ToDo
   * @param data - Datos del ToDo a actualizar
   * @returns Promise<Result<TodoEntity>>
   */
  updateTodo(data: UpdateTodoContract): Promise<Result<TodoEntity>>;

  /**
   * Eliminar un ToDo (soft delete)
   * @param data - ID del ToDo y usuario que elimina
   * @returns Promise<Result<TodoEntity>>
   */
  deleteTodo(data: DeleteTodoContract): Promise<Result<TodoEntity>>;
}
