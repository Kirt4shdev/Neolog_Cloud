import { ServerError } from "@shared/utils/ServerError";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import type { Request, Response, NextFunction } from "express";

export async function requireClientAuth(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const timer = new PerformanceTimer().init();

  const clientId = res?.locals?.clientId;

  if (!clientId) {
    throw ServerError.unauthorized(`Client access required`);
  }

  timer.stop("Middleware: Require Client Auth");

  next();
}
