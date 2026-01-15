import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class BlacklistRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "User already blacklisted",
    };
  }
}
