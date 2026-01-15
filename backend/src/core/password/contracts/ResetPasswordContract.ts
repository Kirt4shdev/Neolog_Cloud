import { z } from "zod";
import { RECOVERY_TOKEN } from "@shared/constants/recoveryToken";
import { PasswordContract } from "@core/shared/contracts/PasswordContract";

/**
 * ResetPasswordContract - Contrato para resetear la contraseña
 * @property token - Token de recuperación de contraseña
 * @property password - Nueva contraseña
 * @property repeatPassword - Repetir contraseña
 */
export const ResetPasswordContract = z
  .object({
    token: z
      .string({ message: "token is required" })
      .trim()
      .min(RECOVERY_TOKEN.PASSWORD_RECOVERY_MIN_TOKEN_LENGTH, {
        message: `token must be at least ${RECOVERY_TOKEN.PASSWORD_RECOVERY_MIN_TOKEN_LENGTH} characters`,
      })
      .max(RECOVERY_TOKEN.PASSWORD_RECOVERY_MAX_TOKEN_LENGTH, {
        message: `token must be at most ${RECOVERY_TOKEN.PASSWORD_RECOVERY_MAX_TOKEN_LENGTH} characters`,
      }),
    password: PasswordContract.shape.password,
    repeatPassword: PasswordContract.shape.password,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type ResetPasswordContract = z.infer<typeof ResetPasswordContract>;
