import { container } from "tsyringe";
import { ForgotPasswordUseCase } from "@application/use-cases/password/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@application/use-cases/password/ResetPasswordUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import type { Request, Response } from "express";

export class PasswordController {
  public static async forgotPassword(
    req: Request,
    res: Response
  ): Promise<Response> {
    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);

    const ctx = ContextBuilder.build(req, res);

    const { email } = await forgotPasswordUseCase.execute({
      contract: req.body,
      ctx: ctx,
    });

    return res
      .status(200)
      .json({ message: `Recovery password email sent to "${email}".` });
  }

  public static async resetPassword(
    req: Request,
    res: Response
  ): Promise<Response> {
    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    const ctx = ContextBuilder.build(req, res);

    const { email } = await resetPasswordUseCase.execute({
      contract: { ...req.body, token: req?.params?.token },
      ctx: ctx,
    });

    return res.status(200).json({
      message: `User associate with email "${email}" has successfully reseted his password`,
    });
  }
}
