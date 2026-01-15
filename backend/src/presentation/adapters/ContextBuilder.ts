import type { Request, Response } from "express";
import type { ClientInfo } from "@core/shared/contracts/ClientInfo";

export class ContextBuilder {
  /**
   * Construye un contexto base desde req/res
   */
  private static base(req: Request, res: Response): ExecutionContext {
    return {
      ip: req?.ip || req?.socket?.remoteAddress || "unknown",
      userId: res?.locals?.userId as UUID,
      adminId: res?.locals?.adminId as UUID,
      clientId: res?.locals?.clientId as UUID,
      jwt: req?.cookies?.jwt,
      sessionId: req?.cookies?.session as UUID,
      clientInfo: res?.locals?.clientInfo as ClientInfo,
    };
  }

  static build(req: Request, res: Response): ExecutionContext {
    return this.base(req, res);
  }
}
