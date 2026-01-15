import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { GetTodosWithPaginationContract } from "@core/todo/contracts/GetTodosWithPaginationContract";
import { TodoDomainEventFactory } from "@infrastructure/events/handlers/TodoDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ITodoRepository } from "@core/todo/repositories/ITodoRepository";

@injectable()
export class GetTodosWithPaginationUseCase {
  constructor(
    @inject("ITodoRepository")
    private readonly todoRepository: ITodoRepository
  ) {}

  public async execute(data: {
    contract: GetTodosWithPaginationContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new TodoDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { limit: contract?.limit, offset: contract?.offset },
    });

    const dto = DtoValidator.validate(GetTodosWithPaginationContract, contract);

    if (dto.error) {
      await EventService.emit(
        event.getTodosWithPaginationWithFailure(dto.error)
      );
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid pagination data";
      await EventService.emit(
        event.getTodosWithPaginationWithFailure(errorMessage)
      );
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.todoRepository.getTodosWithPagination(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.getTodosWithPaginationWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    await EventService.emit(event.getTodosWithPagination());

    // Devolver array vacío si no hay resultados (no es un error)
    return repositoryResult || [];
  }
}
