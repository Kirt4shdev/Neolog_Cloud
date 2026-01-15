import { z } from "zod";

/**
 * Role - Rol del usuario
 * @property admin - Rol de administrador
 * @property client - Rol de cliente
 */
export const Role = z.enum(["admin", "client"], {
  message: "Invalid role. Must be 'admin' or 'client'",
});

export type Role = z.infer<typeof Role>;
