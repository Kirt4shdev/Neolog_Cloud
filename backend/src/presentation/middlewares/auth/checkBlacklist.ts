import { container } from "tsyringe";
import { BlacklistService } from "@application/services/BlacklistService";
import { ServerError } from "@shared/utils/ServerError";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import type { Request, Response, NextFunction } from "express";

export async function checkBlacklist(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const timer = new PerformanceTimer().init();

  const userId = res.locals.userId;

  const blacklistService = container.resolve(BlacklistService);
  const isBlacklisted = await blacklistService.isUserInBlacklist(userId);

  if (!userId) {
    throw ServerError.unauthorized("User ID not found");
  }

  if (isBlacklisted) {
    throw ServerError.forbidden("You are in the black list");
  }

  timer.stop("Middleware: Check Black List");

  next();
}
