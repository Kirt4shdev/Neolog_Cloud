import { container } from "tsyringe";
import { AssignRoleUseCase } from "@application/use-cases/role/AssignRoleUseCase";
import { RemoveRoleUseCase } from "@application/use-cases/role/RemoveRoleUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import type { Request, Response } from "express";

export class RoleController {
  public static async assignRole(
    req: Request,
    res: Response
  ): Promise<Response> {
    const assignRoleUseCase = container.resolve(AssignRoleUseCase);

    const ctx = ContextBuilder.build(req, res);

    const result = await assignRoleUseCase.execute({
      contract: { ...req.body, createdBy: ctx.userId },
      ctx: ctx,
    });

    return res.status(200).json({
      message: `Role successfully assigned`,
      data: result,
    });
  }

  public static async removeRole(
    req: Request,
    res: Response
  ): Promise<Response> {
    const removeRoleUseCase = container.resolve(RemoveRoleUseCase);

    const ctx = ContextBuilder.build(req, res);

    const result = await removeRoleUseCase.execute({
      contract: { ...req.body, deletedBy: ctx.userId },
      ctx: ctx,
    });

    return res.status(200).json({
      message: `Role successfully removed`,
      data: result,
    });
  }
}
