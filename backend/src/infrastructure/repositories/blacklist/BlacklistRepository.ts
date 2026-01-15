import { database } from "@infrastructure/database/PostgresDatabase";
import { BlacklistEntity } from "@core/blacklist/entities/BlacklistEntity";
import { BlacklistRepositoryErrorFactory } from "./BlacklistRepositoryErrorFactory";
import { Pagination } from "@core/shared/contracts/Pagination";
import type { IBlacklistRepository } from "@core/blacklist/repositories/IBlacklistRepository";
import type { AddUserToBlacklistContract } from "@core/blacklist/contracts/AddUserToBlacklistContract";
import type { RemoveUserFromBlacklistContract } from "@core/blacklist/contracts/RemoveUserFromBlacklistContract";

export class BlacklistRepository implements IBlacklistRepository {
  public async getBlacklistedUsers(
    data: Pagination & { userId?: UUID }
  ): Promise<Result<BlacklistEntity[]>> {
    const { error, result } = await database.query<BlacklistEntity>({
      query: "SELECT * FROM get_blacklisted_users($1, $2)",
      params: [data.limit, data.offset],
      single: false,
      schema: BlacklistEntity,
    });

    if (error) {
      return { error: new BlacklistRepositoryErrorFactory(error).create() };
    }

    return { result: result || [] };
  }

  public async isUserInBlacklist(userId: UUID): Promise<Result<boolean>> {
    const { error, result } = await database.query<{ isBlacklisted: boolean }>({
      query: "SELECT * FROM is_user_in_blacklist($1)",
      params: [userId],
      single: true,
      isEmptyResponseAnError: true,
    });

    if (error) {
      return { error: new BlacklistRepositoryErrorFactory(error).create() };
    }

    return { result: result?.isBlacklisted || false };
  }

  public async addUserToBlacklist(
    data: AddUserToBlacklistContract
  ): Promise<Result<BlacklistEntity>> {
    const { error, result } = await database.query<BlacklistEntity>({
      query: "SELECT * FROM add_user_to_blacklist($1, $2, $3)",
      params: [data.blockedId, data.blockerId, data.reason],
      single: true,
      schema: BlacklistEntity,
      emptyResponseMessageError: "Failed to add user to blacklist",
    });

    if (error) {
      return { error: new BlacklistRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async removeUserFromBlacklist(
    data: RemoveUserFromBlacklistContract
  ): Promise<Result<BlacklistEntity>> {
    const { error, result } = await database.query<BlacklistEntity>({
      query: "SELECT * FROM remove_user_from_blacklist($1, $2)",
      params: [data.blockedId, data.removerId],
      single: true,
      schema: BlacklistEntity,
      emptyResponseMessageError: "Failed to remove user from blacklist",
    });

    if (error) {
      return { error: new BlacklistRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
