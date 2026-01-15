import { UAParser } from "ua-parser-js";
import type { NextFunction, Request, Response } from "express";

/**
 * Middleware que parsea el User-Agent y extrae información detallada del cliente
 * Enriquece el objeto Request con información sobre el navegador, SO, dispositivo, etc.
 */
export function userAgentParserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userAgent = req.headers["user-agent"] || "";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Extraer información adicional de headers
  const acceptLanguage = req.headers["accept-language"] || "";
  const ip = req.ip || req.socket.remoteAddress || "";

  // Información del navegador
  const browser = result.browser.name || "Unknown";
  const browserVersion = result.browser.version || "Unknown";

  // Información del sistema operativo
  const os = result.os.name || "Unknown";
  const osVersion = result.os.version || "Unknown";
  const platform = `${os}${osVersion ? " " + osVersion : ""}`;

  // Información del dispositivo
  const deviceType = result.device.type || "desktop"; // mobile, tablet, desktop, smarttv, wearable, console
  const deviceVendor = result.device.vendor || "Unknown";
  const deviceModel = result.device.model || "Unknown";

  // Información de la CPU
  const cpuArchitecture = result.cpu.architecture || "Unknown";

  // Información del motor del navegador
  const engine = result.engine.name || "Unknown";
  const engineVersion = result.engine.version || "Unknown";

  // Construir objeto con toda la información
  const clientInfo = {
    // User-Agent completo
    userAgent,

    // Navegador
    browser,
    browserVersion,
    browserMajor: result.browser.major || "Unknown",

    // Sistema Operativo
    os,
    osVersion,
    platform,

    // Dispositivo
    deviceType,
    deviceVendor,
    deviceModel,
    device:
      deviceType === "desktop"
        ? "desktop"
        : `${deviceVendor} ${deviceModel}`.trim(),

    // CPU
    cpuArchitecture,

    // Motor del navegador
    engine,
    engineVersion,

    // Otros
    language: acceptLanguage.split(",")[0] || "Unknown", // Primer idioma preferido
    languages: acceptLanguage,
    ip,

    // Información adicional útil
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop" || !result.device.type,
    isBot: /bot|crawler|spider|crawling/i.test(userAgent),
  };

  // Añadir la información al objeto Request para que esté disponible en otros middlewares
  // (req as any).clientInfo = clientInfo;
  res.locals.clientInfo = clientInfo;

  next();
}
