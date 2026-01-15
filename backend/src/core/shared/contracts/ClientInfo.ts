import { z } from "zod";

/**
 * ClientInfoContract - Información del cliente extraída del User-Agent
 * Esta información es añadida al Request por el userAgentParserMiddleware
 */
export const ClientInfoContract = z.object({
  // User-Agent completo
  userAgent: z.string().trim(),

  // Navegador
  browser: z.string().trim(),
  browserVersion: z.string().trim(),
  browserMajor: z.string().trim(),

  // Sistema Operativo
  os: z.string().trim(),
  osVersion: z.string().trim(),
  platform: z.string().trim(),

  // Dispositivo
  deviceType: z.enum([
    "mobile",
    "tablet",
    "desktop",
    "smarttv",
    "wearable",
    "console",
  ]),
  deviceVendor: z.string().trim(),
  deviceModel: z.string().trim(),
  device: z.string().trim(),

  // CPU
  cpuArchitecture: z.string().trim(),

  // Motor del navegador
  engine: z.string().trim(),
  engineVersion: z.string().trim(),

  // Idioma
  language: z.string().trim(),
  languages: z.string().trim(),

  // IP
  ip: z.string().trim(),

  // Flags útiles
  isMobile: z.boolean(),
  isTablet: z.boolean(),
  isDesktop: z.boolean(),
  isBot: z.boolean(),
});

export type ClientInfo = z.infer<typeof ClientInfoContract>;
