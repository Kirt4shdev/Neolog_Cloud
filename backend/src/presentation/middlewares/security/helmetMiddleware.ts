import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";

const helmetInstance = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"], // solo tu dominio
      "script-src": ["'self'"], // bloquea scripts externos salvo que los permitas
      "object-src": ["'none'"], // evita Flash, Java, etc
      "upgrade-insecure-requests": [], // fuerza HTTPS
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  hidePoweredBy: true, // quita el header X-Powered-By
  noSniff: true, // evita MIME sniffing
  referrerPolicy: { policy: "no-referrer" },
  frameguard: { action: "deny" }, // evita clickjacking
});

export function helmetMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  helmetInstance(req, res, () => {
    next();
  });

  return;
}
