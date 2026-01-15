import { container } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import { SessionService } from "@application/services/SessionService";
import type { Request, Response, NextFunction } from "express";

/**
 * Middleware para validar que la sesión es válida
 *
 * Verifica que:
 * 1. El sessionId de las cookies existe en la base de datos
 * 2. El sessionId pertenece al usuario del JWT
 * 3. El JWT de la sesión coincide con el JWT de las cookies
 *
 * Si la sesión es válida, añade sessionId a res.locals para uso posterior
 */
export async function checkSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timer = new PerformanceTimer().init();

  // 1. Extraer JWT de las cookies
  const jwtToken = req?.cookies?.jwt;

  // 3. Extraer sessionId de las cookies
  const sessionId = req.cookies?.session;
  if (!sessionId) {
    throw ServerError.unauthorized("No session ID provided");
  }

  // 4. Buscar todas las sesiones del usuario
  const sessionService = container.resolve(SessionService);

  await sessionService
    .getSessionsByUserId(res?.locals?.userId)
    .then((sessions) => {
      // 5. Buscar la sesión que coincida con sessionId y JWT
      const validSession = sessions.find(
        (session) => session.sessionId === sessionId && session.jwt === jwtToken
      );

      if (!validSession) {
        throw new Error("Invalid session. Session not found or JWT mismatch.");
      }

      return validSession;
    })
    .catch((error) => {
      // Hacemos logout del navegador por si se borra esa session que no te bloquee la entrada a la API
      res.cookie("jwt", "", {});
      res.clearCookie("jwt");
      res.cookie("session", "", {});
      res.clearCookie("session");

      throw new Error(error.message);
    });

  // ACTUALIZAR EL last_used_at de la sesión
  await sessionService.updateLastUsedAtSession(sessionId);

  timer.stop("Middleware: Check Session");

  next();
}
