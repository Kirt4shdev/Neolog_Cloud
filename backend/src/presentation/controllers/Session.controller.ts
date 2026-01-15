import { container } from "tsyringe";
import { DeleteSessionUseCase } from "@application/use-cases/session/DeleteSessionUseCase";
import { DeleteMySessionUseCase } from "@application/use-cases/session/DeleteMySessionUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import type { Request, Response } from "express";

export class SessionController {
  /**
   * Elimina una sesión específica (solo admins)
   * DELETE /api/admin/session/:sessionId
   */
  public static async deleteSession(
    req: Request,
    res: Response
  ): Promise<Response> {
    const deleteSessionUseCase = container.resolve(DeleteSessionUseCase);

    const ctx = ContextBuilder.build(req, res);

    const deletedSession = await deleteSessionUseCase.execute({
      contract: { sessionId: ctx.sessionId as UUID },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Session deleted successfully",
      data: deletedSession,
    });
  }

  /**
   * Elimina una sesión propia del usuario autenticado
   * DELETE /api/user/session/:sessionId
   * Valida que la sesión pertenezca al usuario antes de borrarla
   */
  public static async deleteMySession(
    req: Request,
    res: Response
  ): Promise<Response> {
    const deleteMySessionUseCase = container.resolve(DeleteMySessionUseCase);

    const ctx = ContextBuilder.build(req, res);

    const deletedSession = await deleteMySessionUseCase.execute({
      contract: {
        sessionId: ctx.sessionId as UUID,
        userId: ctx.userId as UUID,
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Session deleted successfully",
      data: deletedSession,
    });
  }
}
