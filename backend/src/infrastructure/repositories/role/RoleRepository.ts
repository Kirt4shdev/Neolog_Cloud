import { RoleEntity } from "@core/role/entities/RoleEntity";
import { IRoleRepository } from "@core/role/repositories/IRoleRepository";
import { database } from "@infrastructure/database/PostgresDatabase";
import { RoleRepositoryErrorFactory } from "./RoleRepositoryErrorFactory";
import { UserRolesIdsEntity } from "@core/role/entities/UserRolesIdsEntity";
import type { AssignRoleContract } from "@core/role/contracts/AssignRoleContract";
import type { RemoveRoleContract } from "@core/role/contracts/RemoveRoleContract";

export class RoleRepository implements IRoleRepository {
  public async getRolesByUserId(
    userId: UUID
  ): Promise<Result<UserRolesIdsEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_roles_by_user_id($1)",
      params: [userId],
      single: true,
      isEmptyResponseAnError: true,
      emptyResponseMessageError: "User not found",
      schema: UserRolesIdsEntity,
    });

    if (error) {
      return { error: new RoleRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async assignRole(
    data: AssignRoleContract
  ): Promise<Result<RoleEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM assign_role($1, $2, $3)",
      params: [data.userIdToAssignRole, data.createdBy, data.role],
      single: true,
      schema: RoleEntity,
    });

    if (error) {
      return { error: new RoleRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async removeRole(
    data: RemoveRoleContract
  ): Promise<Result<RoleEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM remove_role($1, $2, $3)",
      params: [data.userIdToRemoveRole, data.deletedBy, data.role],
      single: true,
      schema: RoleEntity,
    });

    if (error) {
      return { error: new RoleRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
