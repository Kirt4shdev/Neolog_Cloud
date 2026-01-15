import type { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";

/**
 * Session Info Middleware
 *
 * Parsea el User-Agent y otros headers para extraer información detallada sobre:
 * - Navegador (nombre, versión, motor)
 * - Sistema Operativo (nombre, versión)
 * - Dispositivo (tipo: desktop, mobile, tablet, smarttv, etc.)
 * - CPU (arquitectura)
 * - Idioma del navegador
 * - IP del cliente
 *
 * Esta información se adjunta al objeto request para uso posterior en la aplicación,
 * especialmente útil para el sistema de sesiones y auditoría.
 */
export function sessionInfoMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // Parsear User-Agent
  const userAgentString = req.headers["user-agent"] || "";
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  // Extraer idioma del navegador
  const acceptLanguage = req.headers["accept-language"] || "";
  const primaryLanguage = acceptLanguage.split(",")[0]?.trim() || "unknown";

  // Construir información de sesión
  const sessionInfo = {
    // User-Agent completo
    userAgent: userAgentString,

    // Navegador
    browser: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
    browserMajor: result.browser.major || "Unknown",

    // Sistema Operativo
    os: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
    platform: `${result.os.name || "Unknown"} ${
      result.os.version || ""
    }`.trim(),

    // Dispositivo
    device: result.device.type || "desktop", // desktop, mobile, tablet, smarttv, wearable, console
    deviceVendor: result.device.vendor || "Unknown",
    deviceModel: result.device.model || "Unknown",

    // CPU
    cpuArchitecture: result.cpu.architecture || "Unknown",

    // Motor del navegador
    engine: result.engine.name || "Unknown",
    engineVersion: result.engine.version || "Unknown",

    // Idioma
    language: primaryLanguage,
    languages: acceptLanguage,

    // IP del cliente (considera proxies)
    ip:
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      (req.headers["x-real-ip"] as string) ||
      req.socket.remoteAddress ||
      "Unknown",

    // Información adicional útil
    isMobile: result.device.type === "mobile",
    isTablet: result.device.type === "tablet",
    isDesktop: !result.device.type || result.device.type === "desktop",
  };

  // Adjuntar al request para uso posterior
  (req as any).sessionInfo = sessionInfo;

  next();
}
