import { z } from "zod";
import { Role } from "./Role";

/**
 * Roles - Contrato de roles
 * @property roles - Roles del usuario
 *
 * Se utiliza para validar el array de roles del usuario.
 */
export const Roles = z.array(Role, {
  message: "Invalid roles array",
});

export type Roles = z.infer<typeof Roles>;
