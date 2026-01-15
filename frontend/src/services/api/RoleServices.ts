import { ApiService } from "../ApiService";
import type { RoleEntity } from "@core/role/entities/RoleEntity";
import type { AssignRoleContract } from "@core/role/contracts/AssignRoleContract";
import type { RemoveRoleContract } from "@core/role/contracts/RemoveRoleContract";

export class RoleServices extends ApiService {
  public async assignRole(
    data: Omit<AssignRoleContract, "createdBy">
  ): Promise<RoleEntity> {
    return await this.fetch<RoleEntity>("POST", "/api/admin/role", data);
  }

  public async removeRole(
    data: Omit<RemoveRoleContract, "deletedBy">
  ): Promise<RoleEntity> {
    return await this.fetch<RoleEntity>("DELETE", "/api/admin/role", data);
  }
}
