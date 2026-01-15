import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class SessionRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23503": "User not found", // Foreign key violation
      "23505": "Session already exists", // Unique constraint violation,
      "42804": "Function does not exist",
    };
  }
}
