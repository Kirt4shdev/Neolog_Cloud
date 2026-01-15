import jwt from "jsonwebtoken";
import { envs } from "@shared/envs";
import { JWT } from "@shared/constants/jwt";
import { ServerError } from "./ServerError";
import type { JwtPayload } from "jsonwebtoken";

export class Jwt {
  /**
   * Crea un token JWT
   * @param payLoad - Payload del token
   * @returns Token JWT
   */
  public static createToken(payLoad: JwtPayload): CustomCookie {
    const token = jwt.sign(payLoad, envs.API_JWT_SECRET_TOKEN, {
      expiresIn: JWT.EXPIRES_IN,
    });

    return {
      cookieName: JWT.TOKEN_NAME,
      token,
      options:
        envs.EXECUTE_MODE === "dev"
          ? {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
            }
          : {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            },
    };
  }

  /**
   * Verifica si el token JWT es válido
   * @param token - Token JWT
   * @returns true si el token es válido, false si no es válido
   */
  public static verify(token: string): void {
    return jwt.verify(token, envs.API_JWT_SECRET_TOKEN, (err: unknown) => {
      if (err)
        throw ServerError.unauthorized(
          err instanceof Error ? err.message : "Token verification failed"
        );
    });
  }

  /**
   * Decodifica el token JWT
   * @param token - Token JWT
   * @returns Payload del token y el userId
   */
  public static decode(token: string): JwtPayload & { userId: UUID } {
    return jwt.decode(token) as JwtPayload & { userId: UUID };
  }

  /**
   * Verifica si el token ha expirado
   * @param iat - Fecha de creación del token
   * @returns true si el token no ha expirado, false si ha expirado
   */
  public static checkTokenExpiration(iat: number): boolean {
    const now = Math.floor(Date.now() / 1000);

    const timeElapsed = now - iat;

    return timeElapsed > JWT.EXPIRES_IN ? false : true;
  }

  /**
   * Extrae el JWT de las cookies del header
   * @param cookieHeader - Header de cookies
   * @returns JWT token o undefined
   */
  public extractJwtFromCookies(cookieHeader?: string): string | undefined {
    if (!cookieHeader) return undefined;

    // Parsear cookies en formato "key1=value1; key2=value2"
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Buscar cookie de sesión (ajustar nombre según tu implementación)
    return cookies["session"] || cookies["token"] || cookies["jwt"];
  }
}
