import { container } from "tsyringe";
import { CreateUserCardUseCase } from "@application/use-cases/user-card/CreateUserCardUseCase";
import { UpdateUserCardUseCase } from "@application/use-cases/user-card/UpdateUserCardUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import type { Request, Response } from "express";

export class UserCardController {
  public static async createMyUserCard(
    req: Request,
    res: Response
  ): Promise<Response> {
    const createUserCardUseCase = container.resolve(CreateUserCardUseCase);

    const ctx = ContextBuilder.build(req, res);

    const userCard = await createUserCardUseCase.execute({
      contract: {
        userId: ctx.userId,
        ...req.body,
      },
      ctx: ctx,
    });

    return res.status(201).json({
      message: "User card created successfully",
      data: userCard,
    });
  }

  public static async updateMyUserCard(
    req: Request,
    res: Response
  ): Promise<Response> {
    const updateUserCardUseCase = container.resolve(UpdateUserCardUseCase);

    const ctx = ContextBuilder.build(req, res);

    const userCard = await updateUserCardUseCase.execute({
      contract: {
        userId: ctx.userId,
        ...req.body,
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "User card updated successfully",
      data: userCard,
    });
  }
}
