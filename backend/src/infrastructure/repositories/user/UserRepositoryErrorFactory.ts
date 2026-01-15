import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class UserRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "User already exists",
    };
  }
}
