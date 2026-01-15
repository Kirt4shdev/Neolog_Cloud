import { container } from "tsyringe";
import { REDIS_SERVER } from "@shared/constants/redisServer";
import { ServerError } from "@shared/utils/ServerError";
import { IpBanEventFactory } from "@infrastructure/events/handlers/IpBanEventFactory";
import { Debug } from "@shared/utils/Debug";
import { EventService } from "@application/services/EventService";
import type { Request, Response, NextFunction } from "express";
import type { ICacheService } from "@core/shared/services/ICacheService";

export async function requestIpLimiter(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const cacheService = container.resolve<ICacheService>("ICacheService");

  const ip = req.ip;

  if (!ip) throw ServerError.unprocessableEntity("IP address is required");

  // Para borrar mi IP de la lista de baneados:
  // await cacheService.removeKey(`banned:ip:${ip}`);
  // await cacheService.removeKey(`ip:${ip}`);
  // return next();

  const event = new IpBanEventFactory({
    ip: ip,
    endpoint: req.originalUrl || req.url,
    metadata: {
      userAgent: req.get("user-agent"),
      referer: req.get("referer"),
    },
  });

  const isBanned = await cacheService.isKeyExists(`banned:ip:${ip}`);

  if (isBanned) {
    EventService.emit(event.ipAlreadyBanned()).catch((err) => {
      Debug.error(
        "[IP LIMITER] Error emitiendo evento ipAlreadyBanned: " + err
      );
    });
    throw ServerError.forbidden(
      `IP address is banned until ${REDIS_SERVER.BAN_TIME_SECONDS} seconds`
    );
  }

  const exists = await cacheService.isKeyExists(`ip:${ip}`);
  if (!exists) {
    await cacheService.setKeyWithExpire(
      `ip:${ip}`,
      "0",
      REDIS_SERVER.WINDOW_SECONDS
    );
  }

  const count = await cacheService.incrementWithExpire(
    `ip:${ip}`,
    REDIS_SERVER.WINDOW_SECONDS
  );

  if (count > REDIS_SERVER.MAX_REQUESTS) {
    await cacheService.setKeyWithExpire(
      `banned:ip:${ip}`,
      "true",
      REDIS_SERVER.BAN_TIME_SECONDS
    );

    await EventService.emit(event.ipBanned()).catch((err) => {
      Debug.error("[IP LIMITER] Error emitiendo evento ipBanned: " + err);
    });

    throw ServerError.forbidden(
      "IP address is banned due to too many requests"
    );
  }

  // Emitir evento de "too many requests" cuando está cerca del límite
  if (count > REDIS_SERVER.MAX_REQUESTS * 0.8) {
    Debug.warning(
      `[IP LIMITER] ⚠️ IP ${ip} cerca del límite (${count}/${REDIS_SERVER.MAX_REQUESTS})`
    );
    await EventService.emit(event.tooManyRequests()).catch((err) => {
      Debug.error(
        "[IP LIMITER] Error emitiendo evento tooManyRequests: " + err
      );
    });
  }

  next();
}
