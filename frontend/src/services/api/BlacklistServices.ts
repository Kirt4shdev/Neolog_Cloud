import { ApiService } from "../ApiService";
import type { BlacklistEntity } from "@core/blacklist/entities/BlacklistEntity";
import type { AddUserToBlacklistContract } from "@core/blacklist/contracts/AddUserToBlacklistContract";
import type { RemoveUserFromBlacklistContract } from "@core/blacklist/contracts/RemoveUserFromBlacklistContract";

export class BlacklistServices extends ApiService {
  public async addUserToBlacklist(
    data: Omit<AddUserToBlacklistContract, "blockerId">
  ): Promise<BlacklistEntity> {
    return await this.fetch<BlacklistEntity>(
      "POST",
      "/api/admin/blacklist",
      data
    );
  }

  public async removeUserFromBlacklist(
    data: Omit<RemoveUserFromBlacklistContract, "removerId">
  ): Promise<BlacklistEntity> {
    return await this.fetch<BlacklistEntity>(
      "DELETE",
      "/api/admin/blacklist",
      data
    );
  }
}
