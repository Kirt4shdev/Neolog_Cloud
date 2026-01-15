import { z } from "zod";
import { UserEntity } from "@core/user/entities/UserEntity";
import { UserCardEntity } from "@core/user-card/entities/UserCardEntity";
import { Roles } from "@core/role/contracts/Roles";
import { SessionEntity } from "@core/session/entities/SessionEntity";

/**
 * UserProfileEntity - Entidad de perfil de usuario
 * @property user - Usuario
 * @property card - Tarjeta de usuario
 * @property roles - Roles del usuario
 * @property sessions - Sesiones del usuario
 * @property isBlacklisted - Si el usuario está en la blacklist
 */
export const UserProfileEntity = z.object({
  user: UserEntity,
  card: UserCardEntity.optional().nullable().default(null),
  roles: Roles.optional().nullable().default([]),
  sessions: z.array(SessionEntity).optional().nullable().default([]),
  isBlacklisted: z.boolean().default(false),
});

export type UserProfileEntity = z.infer<typeof UserProfileEntity>;
