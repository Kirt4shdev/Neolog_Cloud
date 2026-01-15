import { inject, injectable } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import type { UserRolesIdsEntity } from "@core/role/entities/UserRolesIdsEntity";
import type { IRoleRepository } from "@core/role/repositories/IRoleRepository";

/**
 * RoleService - Servicio de aplicación para operaciones de roles
 * Usado principalmente por middlewares
 * NO emite eventos de dominio (a diferencia de los Use Cases)
 * No necesita validar el UUID del usuario, ya que es validado por el middleware checkUser
 */
@injectable()
export class RoleService {
  constructor(
    @inject("IRoleRepository")
    private roleRepository: IRoleRepository
  ) {}

  public async getRolesByUserId(userId: UUID): Promise<UserRolesIdsEntity> {
    const { error, result } = await this.roleRepository.getRolesByUserId(
      userId
    );

    if (error) throw ServerError[error.type](error.message);
    if (!result) throw ServerError.notFound("Roles not found");

    return result;
  }
}
