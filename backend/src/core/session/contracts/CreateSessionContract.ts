import { z } from "zod";
import { ClientInfoContract } from "@core/shared/contracts/ClientInfo";

/**
 * CreateSessionContract - Contrato para crear una sesión
 * @property userId - ID del usuario
 * @property jwt - Token JWT de la sesión
 * @extends ClientInfoContract - Información del cliente (userAgent, browser, os, etc.)
 */
export const CreateSessionContract = z
  .object({
    userId: z
      .string({ message: "userId is required" })
      .trim()
      .uuid({ message: "Invalid userId format" }),
    jwt: z
      .string({ message: "jwt is required" })
      .trim()
      .min(1, { message: "jwt cannot be empty" }),
  })
  .extend(ClientInfoContract.shape);

export type CreateSessionContract = z.infer<typeof CreateSessionContract>;
