import { z } from "zod";

/**
 * LogoutContract - Contrato de logout
 * @property jwt - Token JWT
 * @property sessionId - ID de sesión
 */
export const LogoutContract = z.object({
  jwt: z
    .string({ message: "jwt is required" })
    .trim()
    .min(1, { message: "jwt cannot be empty" }),
  sessionId: z
    .string({ message: "sessionId is required" })
    .trim()
    .uuid({ message: "Invalid sessionId format" }),
});

export type LogoutContract = z.infer<typeof LogoutContract>;
