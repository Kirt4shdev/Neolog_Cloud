import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class AuthRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "User already registered",
    };
  }
}
