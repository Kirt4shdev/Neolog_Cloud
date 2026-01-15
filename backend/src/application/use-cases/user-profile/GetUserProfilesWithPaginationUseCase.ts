import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { Pagination } from "@core/shared/contracts/Pagination";
import type { IUserProfileRepository } from "@core/user-profile/repositories/IUserProfileRepository";

@injectable()
export class GetUserProfilesWithPaginationUseCase {
  constructor(
    @inject("IUserProfileRepository")
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  public async execute(data: {
    contract: Pagination;
    ctx?: ExecutionContext | undefined;
  }) {
    const { contract } = data;

    const dto = DtoValidator.validate(Pagination, contract);

    if (dto.error) {
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      throw ServerError.badRequest(
        "Invalid user profiles with pagination data"
      );
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.userProfileRepository.getUserProfilesWithPagination(
        dto.result
      );

    if (repositoryError) {
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    return repositoryResult || [];
  }
}
