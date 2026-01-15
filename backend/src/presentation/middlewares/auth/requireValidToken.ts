import { ServerError } from "@shared/utils/ServerError";
import { Jwt } from "@shared/utils/Jwt";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import type { Request, Response, NextFunction } from "express";

export function requireValidToken(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const timer = new PerformanceTimer().init();

  const token = req?.cookies?.jwt;

  if (!token) {
    throw ServerError.unauthorized("No API token provided");
  }

  Jwt.verify(token);

  timer.stop("Middleware: Require Valid Token");

  next();
}
