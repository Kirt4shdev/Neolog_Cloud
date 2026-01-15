import { GetUserProfileByUserIdContract } from "@core/user-profile/contract/GetUserProfileByUserIdContract";
import { IUserProfileRepository } from "@core/user-profile/repositories/IUserProfileRepository";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { ServerError } from "@shared/utils/ServerError";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetMyProfileUseCase {
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
      throw ServerError.badRequest("Invalid user profile data");
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.userProfileRepository.getUserProfileByUserId(dto.result);

    if (repositoryError) {
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    return repositoryResult;
  }
}
