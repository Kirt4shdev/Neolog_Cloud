import { envs } from "@shared/envs";
import type { NextFunction, Request, Response } from "express";

// HSTS - HTTP Strict Transport Security
// Indica a los navegadores que solo deben conectarse a través de HTTPS
// durante el tiempo especificado en max-age.
// Esto ayuda a prevenir ataques de intermediarios (MITM) y secuestro de cookies.
// Nota: Solo debe habilitarse en producción y si el sitio web es accesible
// exclusivamente a través de HTTPS.
export function httpStrictTransportSecurityMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (envs.EXECUTE_MODE === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  next();
}
