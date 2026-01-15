import { z } from "zod";
import { Roles } from "@core/role/contracts/Roles";
import { CreatableEntity } from "@core/shared/base/CreatableEntity";
import { SoftDeletableEntity } from "@core/shared/base/SoftDeletableEntity";

/**
 * RoleEntity - Entidad de rol con soft delete
 * @property userId - ID del usuario
 * @property roles - Roles del usuario
 *
 * Hereda de CreatableEntity:
 * @property createdAt - Fecha de creación
 * @property createdBy - ID del admin que creó el rol
 *
 * Hereda de SoftDeletableEntity:
 * @property deletedAt - Fecha de eliminación del rol (null si activo)
 * @property deletedBy - ID del admin que eliminó el rol (null si activo)
 *
 * Los roles ahora soportan soft delete para mantener auditoría completa.
 * Los eventos también auditan quién asignó/removió roles y cuándo.
 */
export const RoleEntity = z
  .object({
    userId: z.uuid({ message: "Invalid user ID format" }).trim(),
    roles: Roles,
  })
  .extend(CreatableEntity.shape)
  .extend(SoftDeletableEntity.shape)
  .strict();

export type RoleEntity = z.infer<typeof RoleEntity>;
