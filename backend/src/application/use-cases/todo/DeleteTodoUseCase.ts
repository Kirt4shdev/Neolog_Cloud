import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { DeleteTodoContract } from "@core/todo/contracts/DeleteTodoContract";
import { TodoDomainEventFactory } from "@infrastructure/events/handlers/TodoDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ITodoRepository } from "@core/todo/repositories/ITodoRepository";
import type { GetTodoByIdContract } from "@core/todo/contracts/GetTodoByIdContract";

@injectable()
export class DeleteTodoUseCase {
  constructor(
    @inject("ITodoRepository")
    private readonly todoRepository: ITodoRepository
  ) {}

  public async execute(data: {
    contract: DeleteTodoContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new TodoDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { todoId: contract?.todoId },
    });

    const dto = DtoValidator.validate(DeleteTodoContract, contract);

    if (dto.error) {
      await EventService.emit(event.deleteTodoWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid todo ID";
      await EventService.emit(event.deleteTodoWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // Verificar ownership antes de eliminar
    const getTodoContract: GetTodoByIdContract = {
      todoId: dto.result.todoId,
    };

    const { result: existingTodo } = await this.todoRepository.getTodoById(
      getTodoContract
    );

    if (!existingTodo) {
      const errorMessage = "Todo not found";
      await EventService.emit(event.deleteTodoWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    if (existingTodo.userId !== ctx.userId) {
      const errorMessage = "You can only delete your own todos";
      await EventService.emit(event.deleteTodoWithFailure(errorMessage));
      throw ServerError.forbidden(errorMessage);
    }

    if (existingTodo.deletedAt) {
      const errorMessage = "Todo not found";
      await EventService.emit(event.deleteTodoWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.todoRepository.deleteTodo(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.deleteTodoWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Error deleting todo";
      await EventService.emit(event.deleteTodoWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.deleteTodo());

    return repositoryResult;
  }
}
