import { LogColorFormatter } from "@shared/utils/LogColorFormatter";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import type { NextFunction, Request, Response } from "express";

export function httpRequestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timer = new PerformanceTimer().init();

  res.on("finish", () => {
    const durationMs = timer.stop();
    console.log(
      `${LogColorFormatter.HttpMethod(req.method)} ${
        req.originalUrl
      } ${LogColorFormatter.StatusCode(
        res.statusCode
      )} - ${LogColorFormatter.ResponseTime(durationMs)}`
    );
  });

  next();
}
