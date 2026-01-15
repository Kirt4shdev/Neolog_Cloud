import { container } from "tsyringe";
import { UserService } from "@application/services/UserService";
import { Jwt } from "@shared/utils/Jwt";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import { ServerError } from "@shared/utils/ServerError";
import type { Request, Response, NextFunction } from "express";

export async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const timer = new PerformanceTimer().init();

  const token = req.cookies.jwt;

  const userId: UUID = Jwt.decode(token)?.userId;

  const userService = container.resolve(UserService);
  const isValidUserId = await userService.isValidUserId(userId);

  if (!isValidUserId) {
    throw ServerError.notFound("No session initialized");
  }

  res.locals.userId = userId;

  timer.stop("Middleware: Check User");

  next();
}
