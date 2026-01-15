import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class UserProfileRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "User profile not found": "User profile not found",
      "No user profiles found": "No user profiles found",
      "User profile by user id not found": "User profile by user id not found",
    };
  }
}
