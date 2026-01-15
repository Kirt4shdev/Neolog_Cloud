import { z } from "zod";
import { BaseEntity } from "@core/shared/base/BaseEntity";

/**
 * SessionEntity - Entidad de sesión
 * @property sessionId - ID de la sesión
 * @property userId - ID del usuario
 * @property jwt - Token JWT de la sesión
 *
 * Información del cliente:
 * @property userAgent - User-Agent completo del navegador
 * @property browser - Nombre del navegador
 * @property browserVersion - Versión del navegador
 * @property browserMajor - Versión mayor del navegador
 * @property os - Sistema operativo
 * @property osVersion - Versión del sistema operativo
 * @property platform - Plataforma completa (OS + versión)
 * @property deviceType - Tipo de dispositivo (mobile, tablet, desktop, etc.)
 * @property deviceVendor - Fabricante del dispositivo
 * @property deviceModel - Modelo del dispositivo
 * @property device - Descripción completa del dispositivo
 * @property cpuArchitecture - Arquitectura de la CPU
 * @property engine - Motor del navegador
 * @property engineVersion - Versión del motor
 * @property language - Idioma principal
 * @property languages - Lista de idiomas
 * @property ip - Dirección IP del cliente
 * @property isMobile - Indica si es un dispositivo móvil
 * @property isTablet - Indica si es una tablet
 * @property isDesktop - Indica si es un desktop
 * @property isBot - Indica si es un bot/crawler
 *
 * Hereda de BaseEntity:
 * @property createdAt - Fecha de creación
 */
export const SessionEntity = z
  .object({
    sessionId: z.uuid().trim(),
    userId: z.uuid().trim(),
    jwt: z.string().trim(),
    lastUsedAt: z.coerce.date(),

    // Información del cliente
    userAgent: z.string().trim(),
    browser: z.string().trim(),
    browserVersion: z.string().trim(),
    browserMajor: z.string().trim(),
    os: z.string().trim(),
    osVersion: z.string().trim(),
    platform: z.string().trim(),
    deviceType: z.string().trim(),
    deviceVendor: z.string().trim(),
    deviceModel: z.string().trim(),
    device: z.string().trim(),
    cpuArchitecture: z.string().trim(),
    engine: z.string().trim(),
    engineVersion: z.string().trim(),
    language: z.string().trim(),
    languages: z.string().trim(),
    ip: z.string().trim(),
    isMobile: z.boolean(),
    isTablet: z.boolean(),
    isDesktop: z.boolean(),
    isBot: z.boolean(),
  })
  .extend(BaseEntity.shape);

export type SessionEntity = z.infer<typeof SessionEntity>;
