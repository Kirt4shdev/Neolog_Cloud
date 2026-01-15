import express, { Router } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { envs } from "@shared/envs";
import { Debug } from "@shared/utils/Debug";
import hpp from "hpp";
import { xssMiddleware } from "@presentation/middlewares/security/xssMiddleware";
import { requestIpLimiter } from "@presentation/middlewares/security/requestIpLimiter";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import { httpStrictTransportSecurityMiddleware } from "./middlewares/security/httpStrictTransportSecurityMiddleware";
import { httpsRedirectMiddleware } from "./middlewares/security/httpsRedirectMiddleware";
import { helmetMiddleware } from "./middlewares/security/helmetMiddleware";
import { corsMiddleware } from "./middlewares/security/corsMiddleware";
import { userAgentParserMiddleware } from "./middlewares/security/userAgentParserMiddleware";
import { asyncHandler } from "@presentation/helpers/asyncHandler";
import type { Express, Request, Response, NextFunction } from "express";

const timer = new PerformanceTimer();

export class ExpressServer {
  public readonly port: Number = envs.API_PORT;

  public create(): Express {
    return express();
  }

  // Helper para medir performance de middlewares
  private measureMiddleware(name: string, middleware: any, isAsync = false) {
    if (isAsync) {
      return asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
          timer.init();
          await middleware(req, res, next);
          timer.stop(`Middleware: ${name}`);
        }
      );
    }

    return (req: Request, res: Response, next: NextFunction) => {
      timer.init();
      middleware(req, res, () => {
        timer.stop(`Middleware: ${name}`);
        next();
      });
    };
  }

  public initMiddlewares(): Router {
    Debug.info("Server configuration initializing...");

    const router = Router();

    // TODO: Enable request IP limiter in production
    router.use(this.measureMiddleware("CORS", corsMiddleware));
    router.use(
      this.measureMiddleware("User Agent Parser", userAgentParserMiddleware)
    );
    router.use(
      this.measureMiddleware("Request Limiter", requestIpLimiter, true)
    );
    router.use(this.measureMiddleware("Helmet Security", helmetMiddleware));
    router.use(this.measureMiddleware("HPP Protection", hpp()));
    router.use(
      this.measureMiddleware("JSON Parser", express.json({ limit: "10mb" }))
    );
    router.use(
      this.measureMiddleware(
        "URL Encoded",
        express.urlencoded({ extended: true, limit: "10mb" })
      )
    );
    router.use(this.measureMiddleware("XSS Protection", xssMiddleware));
    router.use(this.measureMiddleware("Cookie Parser", cookieParser()));
    router.use(this.measureMiddleware("Compression", compression()));
    router.use(
      this.measureMiddleware("HTTPS Redirect", httpsRedirectMiddleware)
    );
    router.use(
      this.measureMiddleware(
        "HSTS Security",
        httpStrictTransportSecurityMiddleware
      )
    );

    Debug.success("Server configuration ready");

    return router;
  }

  public notFoundHandler() {
    Debug.info("404 Not Found handler initializing...");

    const notFoundHandler = (
      _req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      next(createError(404));
    };

    Debug.success("404 Not Found handler ready");

    return notFoundHandler;
  }

  public defaultErrorHandler() {
    Debug.info("Unhandled exceptions initializing...");

    const errorHandler = (
      err: any,
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        if (res.headersSent) return next(err);

        err.message.startsWith("{")
          ? Debug.error(err.message, true)
          : Debug.error(err.message);

        return res.status(err.statusCode || 500).json({
          error: err.message.startsWith("{")
            ? JSON.parse(err.message)
            : err.message,
        });
      } catch (error) {
        return res.status(500).json({ unhandled_exception: error, err });
      }
    };

    Debug.success("Unhandled exceptions ready");

    return errorHandler;
  }

  public listenCallback(): void | Error {
    if (envs.EXECUTE_MODE !== "production" && envs.EXECUTE_MODE !== "dev") {
      Debug.error('Type EXECUTE_MODE only accepts "dev" or "production"');
      throw new Error(`Missing EXECUTE_MODE env variable or invalid type.`);
    }

    Debug.success(`Server running at port ${envs.API_PORT}`);
    Debug.info(`Environment: ${envs.EXECUTE_MODE}`);

    return;
  }

  static port(): Number {
    return envs.API_PORT;
  }
}
