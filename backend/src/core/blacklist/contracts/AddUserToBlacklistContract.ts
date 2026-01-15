import { z } from "zod";
import { BLACKLIST } from "@shared/constants/blacklist";

/**
 * AddUserToBlacklistContract - Contrato para agregar un usuario a la blacklist
 * @property blockedId - ID del usuario bloqueado
 * @property blockerId - ID del usuario que bloqueó
 * @property reason - Motivo del bloqueo
 */
export const AddUserToBlacklistContract = z.object({
  blockedId: z
    .string({ message: "blockedId is required" })
    .trim()
    .uuid({ message: "Invalid blocked user ID format" }),
  blockerId: z
    .string({ message: "blockerId is required" })
    .trim()
    .uuid({ message: "Invalid blocker user ID format" }),
  reason: z
    .string()
    .trim()
    .min(BLACKLIST.REASON_MIN_LENGTH, {
      message: `reason must be at least ${BLACKLIST.REASON_MIN_LENGTH} characters`,
    })
    .max(BLACKLIST.REASON_MAX_LENGTH, {
      message: `reason must be at most ${BLACKLIST.REASON_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
});

export type AddUserToBlacklistContract = z.infer<
  typeof AddUserToBlacklistContract
>;
