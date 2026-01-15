import { container } from "tsyringe";
import { AddUserToBlacklistUseCase } from "@application/use-cases/blackList/AddUserToBlackListUseCase";
import { RemoveUserFromBlacklistUseCase } from "@application/use-cases/blackList/RemoveUserFromBlackListUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import type { Request, Response } from "express";

export class BlacklistController {
  public static async addUserToBlacklist(
    req: Request,
    res: Response
  ): Promise<Response> {
    const addUserToBlacklistUseCase = container.resolve(
      AddUserToBlacklistUseCase
    );

    const ctx = ContextBuilder.build(req, res);

    const blacklistEntry = await addUserToBlacklistUseCase.execute({
      contract: { ...req.body, blockerId: ctx.userId },
      ctx: ctx,
    });

    return res.status(200).json({
      message: `User with ID "${blacklistEntry.blockedId}" successfully added to blacklist`,
      data: blacklistEntry,
    });
  }

  public static async removeUserFromBlacklist(
    req: Request,
    res: Response
  ): Promise<Response> {
    const removeUserFromBlacklistUseCase = container.resolve(
      RemoveUserFromBlacklistUseCase
    );

    const ctx = ContextBuilder.build(req, res);

    const blacklistEntry = await removeUserFromBlacklistUseCase.execute({
      contract: { ...req.body, removerId: ctx.userId },
      ctx: ctx,
    });

    return res.status(200).json({
      message: `User with ID "${blacklistEntry.blockedId}" successfully removed from blacklist`,
      data: blacklistEntry,
    });
  }
}
