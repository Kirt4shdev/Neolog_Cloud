import { container } from "tsyringe";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import { ServerError } from "@shared/utils/ServerError";
import { RoleService } from "@application/services/RoleService";
import type { Request, Response, NextFunction } from "express";

export async function checkRoles(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const timer = new PerformanceTimer().init();

  const userId = res?.locals?.userId;

  if (!userId) {
    throw ServerError.unauthorized("User ID not found");
  }

  const roleService = container.resolve(RoleService);
  const roles = await roleService.getRolesByUserId(userId);

  // Agregar los roles al res.locals para uso posterior
  res.locals.adminId = roles.adminId as UUID;
  res.locals.clientId = roles.clientId as UUID;

  timer.stop("Middleware: Check Roles");

  next();
}
