import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { CreateTodoContract } from "@core/todo/contracts/CreateTodoContract";
import { TodoDomainEventFactory } from "@infrastructure/events/handlers/TodoDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { ITodoRepository } from "@core/todo/repositories/ITodoRepository";

@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject("ITodoRepository")
    private readonly todoRepository: ITodoRepository
  ) {}

  public async execute(data: {
    contract: CreateTodoContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const event = new TodoDomainEventFactory({
      ip: ctx?.ip,
      userId: ctx?.userId,
      metadata: { title: contract?.title },
    });

    const dto = DtoValidator.validate(CreateTodoContract, contract);

    if (dto.error) {
      await EventService.emit(event.createTodoWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid todo data";
      await EventService.emit(event.createTodoWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.todoRepository.createTodo(dto.result);

    if (repositoryError) {
      await EventService.emit(
        event.createTodoWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Error creating todo";
      await EventService.emit(event.createTodoWithFailure(errorMessage));
      throw ServerError.internalServer(errorMessage);
    }

    await EventService.emit(event.createTodo());

    return repositoryResult;
  }
}
