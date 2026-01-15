import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class PasswordRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "Forgot password recovery token already exists",
    };
  }
}
