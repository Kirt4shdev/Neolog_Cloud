import { ServerError } from "@shared/utils/ServerError";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import type { Request, Response, NextFunction } from "express";

export async function requireAdminAuth(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const timer = new PerformanceTimer().init();

  const adminId = res?.locals?.adminId;

  if (!adminId) {
    throw ServerError.unauthorized(`Admin access required`);
  }

  timer.stop("Middleware: Require Admin Auth");

  next();
}
