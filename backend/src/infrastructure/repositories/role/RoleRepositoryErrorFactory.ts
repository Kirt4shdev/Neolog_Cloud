import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class RoleRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "Role already assigned to user",
    };
  }
}
