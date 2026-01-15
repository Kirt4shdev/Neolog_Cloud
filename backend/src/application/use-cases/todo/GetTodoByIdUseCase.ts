import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { GetTodoByIdContract } from "@core/todo/contracts/GetTodoByIdContract";
import { TodoDomainEventFactory } from "@infrastructure/events/handlers/TodoDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ITodoRepository } from "@core/todo/repositories/ITodoRepository";

@injectable()
export class GetTodoByIdUseCase {
  constructor(
    @inject("ITodoRepository")
    private readonly todoRepository: ITodoRepository
  ) {}

  public async execute(data: {
    contract: GetTodoByIdContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new TodoDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { todoId: contract?.todoId },
    });

    const dto = DtoValidator.validate(GetTodoByIdContract, contract);

    if (dto.error) {
      await EventService.emit(event.getTodoByIdWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid todo ID";
      await EventService.emit(event.getTodoByIdWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.todoRepository.getTodoById(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.getTodoByIdWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Todo not found";
      await EventService.emit(event.getTodoByIdWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    // Verificar ownership: el todo debe pertenecer al usuario autenticado
    if (repositoryResult.userId !== ctx.userId) {
      const errorMessage = "You can only access your own todos";
      await EventService.emit(event.getTodoByIdWithFailure(errorMessage));
      throw ServerError.forbidden(errorMessage);
    }

    // Verificar que no esté eliminado
    if (repositoryResult.deletedAt) {
      const errorMessage = "Todo not found";
      await EventService.emit(event.getTodoByIdWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    await EventService.emit(event.getTodoById());

    return repositoryResult;
  }
}
