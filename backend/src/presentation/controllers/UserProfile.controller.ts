import { container } from "tsyringe";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import { GetMyProfileUseCase } from "@application/use-cases/user-profile/GetMyProfileUseCase";
import { GetUserProfilesWithPaginationUseCase } from "@application/use-cases/user-profile/GetUserProfilesWithPaginationUseCase";
import { GetUserProfileByUserIdUseCase } from "@application/use-cases/user-profile/GetUserProfileByUserIdUseCase";
import type { Request, Response } from "express";

export class UserProfileController {
  /**
   * Obtiene el perfil completo del usuario autenticado (user + card)
   * GET /api/user/my-user
   */
  public static async getMyProfile(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getMyProfileUseCase = container.resolve(GetMyProfileUseCase);

    const ctx = ContextBuilder.build(req, res);

    const userProfile = await getMyProfileUseCase.execute({
      contract: {
        userId: ctx.userId,
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  }

  public static async getUserProfileByUserId(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getUserProfileByUserIdUseCase = container.resolve(
      GetUserProfileByUserIdUseCase
    );

    const ctx = ContextBuilder.build(req, res);

    console.log({ "req.params": req.params.userId });
    // { 'req.params': '0c9e42b74-2d77-4c50-bb36-2ce633080c5d' }
    const userProfile = await getUserProfileByUserIdUseCase.execute({
      contract: {
        userId: req.params.userId as UUID,
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  }

  /**
   * Obtiene perfiles de usuarios con paginación (users + cards + roles + sessions)
   * GET /api/admin/users?limit=10&offset=0
   */
  public static async getUsersProfilesWithPagination(
    req: Request,
    res: Response
  ): Promise<Response> {
    const getUserProfilesWithPaginationUseCase = container.resolve(
      GetUserProfilesWithPaginationUseCase
    );

    const ctx = ContextBuilder.build(req, res);

    const userProfiles = await getUserProfilesWithPaginationUseCase.execute({
      contract: {
        limit: Number(req.query.limit) || 10,
        offset: Number(req.query.offset) || 0,
      },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "User profiles retrieved successfully",
      data: userProfiles,
    });
  }
}
