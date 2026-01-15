import { z } from "zod";
import { BLACKLIST } from "@shared/constants/blacklist";
import { CreatableEntity } from "@core/shared/base/CreatableEntity";

/**
 * BlacklistEntity - Entidad de blacklist
 * @property blacklistId - ID de la blacklist
 * @property blockerId - ID del admin que bloqueó
 * @property blockedId - ID del usuario bloqueado
 * @property reason - Motivo del bloqueo (opcional)
 *
 * Hereda de CreatableEntity:
 * @property createdAt - Fecha de creación
 * @property createdBy - ID del admin que creó el registro
 */
export const BlacklistEntity = z
  .object({
    blacklistId: z.uuid().trim(),
    blockerId: z.uuid().trim(),
    blockedId: z.uuid().trim(),
    reason: z
      .string()
      .min(BLACKLIST.REASON_MIN_LENGTH, {
        message: `Reason must be at least ${BLACKLIST.REASON_MIN_LENGTH} characters`,
      })
      .max(BLACKLIST.REASON_MAX_LENGTH, {
        message: `Reason must be at most ${BLACKLIST.REASON_MAX_LENGTH} characters`,
      })
      .trim()
      .optional()
      .nullable()
      .default(null),
  })
  .extend(CreatableEntity.shape);

export type BlacklistEntity = z.infer<typeof BlacklistEntity>;
