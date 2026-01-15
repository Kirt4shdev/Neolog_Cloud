import { container } from "tsyringe";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { RegisterUseCase } from "@application/use-cases/auth/RegisterUseCase";
import { LogoutUseCase } from "@application/use-cases/auth/LogoutUseCase";
import { CreateSessionUseCase } from "@application/use-cases/session/CreateSessionUseCase";
import { DeleteSessionUseCase } from "@application/use-cases/session/DeleteSessionUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import { Jwt } from "@shared/utils/Jwt";
import type { Request, Response } from "express";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const loginUseCase = container.resolve(LoginUseCase);
    const createSessionUseCase = container.resolve(CreateSessionUseCase);

    const ctx = ContextBuilder.build(req, res);

    const user = await loginUseCase.execute({
      contract: req.body,
      ctx: ctx,
    });

    const jwt = Jwt.createToken({ userId: user.userId });

    const session = await createSessionUseCase.execute({
      contract: {
        userId: user.userId as UUID,
        jwt: jwt.token,
        ...ctx?.clientInfo,
      },
      ctx: ctx,
    });

    // // Guardar JWT en cookie
    res.cookie(jwt.cookieName, jwt.token, jwt.options);

    // // Guardar session ID en cookie
    res.cookie("session", session.sessionId, jwt.options);

    return res
      .status(200)
      .json({ message: `${user.email} successfully logged in` });
  }

  public static async register(req: Request, res: Response): Promise<Response> {
    const registerUseCase = container.resolve(RegisterUseCase);

    const ctx = ContextBuilder.build(req, res);

    const user = await registerUseCase.execute({
      contract: req.body,
      ctx: ctx,
    });

    return res
      .status(200)
      .json({ message: `${user.email} successfully registered` });
  }

  public static async logout(req: Request, res: Response) {
    const logoutUseCase = container.resolve(LogoutUseCase);
    const deleteSessionUseCase = container.resolve(DeleteSessionUseCase);

    const ctx = ContextBuilder.build(req, res);

    await logoutUseCase.execute({
      contract: {
        jwt: ctx.jwt as string,
        sessionId: ctx.sessionId as UUID,
      },
      ctx: ctx,
    });

    await deleteSessionUseCase
      .execute({
        contract: { sessionId: ctx.sessionId as UUID },
        ctx: ctx,
      })
      .finally(() => {
        res.cookie("jwt", "", {});
        res.clearCookie("jwt");
        res.cookie("session", "", {});
        res.clearCookie("session");
      });

    return res.status(200).json({ message: "Successfully logged out" });
  }
}
