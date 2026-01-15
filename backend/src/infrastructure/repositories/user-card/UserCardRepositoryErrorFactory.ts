import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class UserCardRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "User card already exists for this user",
      "User not found": "User not found",
      "User already has a card": "User already has a card",
      "User card not found": "User card not found",
    };
  }
}
