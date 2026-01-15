import cors from "cors";
import { envs } from "@shared/envs";
import type { NextFunction, Request, Response } from "express";

const corsInstance = cors({
  origin: envs.API_ALLOWED_CORS_ORIGINS?.split(",") || [],
  credentials: true,
});

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  corsInstance(req, res, () => {
    next();
  });

  return;
}
