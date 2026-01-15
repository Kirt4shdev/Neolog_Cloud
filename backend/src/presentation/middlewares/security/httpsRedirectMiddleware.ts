import { envs } from "@shared/envs";
import type { NextFunction, Request, Response } from "express";

// Redirige todo el tráfico HTTP a HTTPS en producción
// Esto ayuda a asegurar que todas las comunicaciones entre el cliente y el servidor
// estén cifradas, protegiendo así la integridad y confidencialidad de los datos.
// Nota: Solo debe habilitarse en producción y si el sitio web es accesible
// exclusivamente a través de HTTPS.
export function httpsRedirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    envs.EXECUTE_MODE === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }

  next();
}
