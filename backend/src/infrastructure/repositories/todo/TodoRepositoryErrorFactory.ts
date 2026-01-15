import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class TodoRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23503": "User not found",
      "23505": "Todo already exists",
      // Más casos específicos si son necesarios
    };
  }
}
