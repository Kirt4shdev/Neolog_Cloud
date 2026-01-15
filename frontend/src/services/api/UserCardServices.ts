import { ApiService } from "../ApiService";
import type { UserCardEntity } from "@core/user-card/entities/UserCardEntity";
import type { CreateUserCardContract } from "@core/user-card/contracts/createUserCardContract";
import type { UpdateUserCardContract } from "@core/user-card/contracts/UpdateUserCardContract";

export class UserCardServices extends ApiService {
  public async createUserCard(
    data: CreateUserCardContract
  ): Promise<UserCardEntity> {
    return await this.fetch<UserCardEntity>(
      "POST",
      "/api/user/user-card",
      data
    );
  }

  public async updateUserCard(
    data: UpdateUserCardContract
  ): Promise<UserCardEntity> {
    return await this.fetch<UserCardEntity>("PUT", "/api/user/user-card", data);
  }
}
