import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { GetUserProfileByUserIdContract } from "@core/user-profile/contract/GetUserProfileByUserIdContract";
import { DtoValidator } from "@shared/utils/DtoValidator";
import type { IUserProfileRepository } from "@core/user-profile/repositories/IUserProfileRepository";

@injectable()
export class GetUserProfileByUserIdUseCase {
  constructor(
    @inject("IUserProfileRepository")
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  public async execute(data: {
    contract: GetUserProfileByUserIdContract;
    ctx?: ExecutionContext | undefined;
  }) {
    const { contract } = data;

    const dto = DtoValidator.validate(GetUserProfileByUserIdContract, contract);

    if (dto.error) {
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      throw ServerError.badRequest("Invalid user profile by user id");
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.userProfileRepository.getUserProfileByUserId(dto.result);

    if (repositoryError) {
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      throw ServerError.notFound("User profile by user id not found");
    }

    return repositoryResult;
  }
}
