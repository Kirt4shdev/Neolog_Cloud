import { database } from "@infrastructure/database/PostgresDatabase";
import { AuthRepositoryErrorFactory } from "./AuthRepositoryErrorFactory";
import { AuthEntity } from "@core/auth/entities/AuthEntity";
import type { LoginContract } from "@core/auth/contracts/LoginContract";
import type { RegisterContract } from "@core/auth/contracts/RegisterContract";
import type { IAuthRepository } from "@core/auth/repositories/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  public async login(data: LoginContract): Promise<Result<AuthEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM login($1, $2)",
      params: [data?.email, data?.password],
      single: true,
      schema: AuthEntity,
      emptyResponseMessageError: "User not found",
    });

    if (error) {
      return { error: new AuthRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async register(data: RegisterContract): Promise<Result<AuthEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM register($1, $2, $3)",
      params: [data?.name, data?.email, data?.password],
      single: true,
      schema: AuthEntity,
    });

    if (error) {
      return { error: new AuthRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
