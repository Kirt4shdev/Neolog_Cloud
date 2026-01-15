import { database } from "@infrastructure/database/PostgresDatabase";
import { IPasswordRepository } from "@core/password/repositories/IPasswordRepository";
import { ForgotPasswordContract } from "@core/password/contracts/ForgotPasswordContract";
import { ForgotPasswordEntity } from "@core/password/entities/ForgotPasswordEntity";
import { ResetPasswordEntity } from "@core/password/entities/ResetPasswordEntity";
import { PasswordRepositoryErrorFactory } from "./PasswordRepositoryErrorFactory";
import { ResetPasswordContract } from "@core/password/contracts/ResetPasswordContract";

export class PasswordRepository implements IPasswordRepository {
  public async forgotPassword(
    data: ForgotPasswordContract
  ): Promise<Result<ForgotPasswordEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM forgot_password($1)",
      params: [data?.email],
      single: true,
      schema: ForgotPasswordEntity,
      emptyResponseMessageError: "Email not found",
    });

    if (error) {
      return { error: new PasswordRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async resetPassword(
    data: ResetPasswordContract
  ): Promise<Result<ResetPasswordEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM reset_password($1, $2)",
      params: [data?.token, data?.password],
      single: true,
      schema: ResetPasswordEntity,
      emptyResponseMessageError: "Token not found",
    });

    if (error) {
      return { error: new PasswordRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
