import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { UpdateTodoContract } from "@core/todo/contracts/UpdateTodoContract";
import { TodoDomainEventFactory } from "@infrastructure/events/handlers/TodoDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ITodoRepository } from "@core/todo/repositories/ITodoRepository";
import type { GetTodoByIdContract } from "@core/todo/contracts/GetTodoByIdContract";

@injectable()
export class UpdateTodoUseCase {
  constructor(
    @inject("ITodoRepository")
    private readonly todoRepository: ITodoRepository
  ) {}

  public async execute(data: {
    contract: UpdateTodoContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new TodoDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { todoId: contract?.todoId },
    });

    const dto = DtoValidator.validate(UpdateTodoContract, contract);

    if (dto.error) {
      await EventService.emit(event.updateTodoWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid todo data";
      await EventService.emit(event.updateTodoWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // Verificar ownership antes de actualizar
    const getTodoContract: GetTodoByIdContract = {
      todoId: dto.result.todoId,
    };

    const { result: existingTodo } = await this.todoRepository.getTodoById(
      getTodoContract
    );

    if (!existingTodo) {
      const errorMessage = "Todo not found";
      await EventService.emit(event.updateTodoWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    if (existingTodo.userId !== ctx.userId) {
      const errorMessage = "You can only update your own todos";
      await EventService.emit(event.updateTodoWithFailure(errorMessage));
      throw ServerError.forbidden(errorMessage);
    }

    if (existingTodo.deletedAt) {
      const errorMessage = "Todo not found";
      await EventService.emit(event.updateTodoWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.todoRepository.updateTodo(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.updateTodoWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Error updating todo";
      await EventService.emit(event.updateTodoWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.updateTodo());

    return repositoryResult;
  }
}
