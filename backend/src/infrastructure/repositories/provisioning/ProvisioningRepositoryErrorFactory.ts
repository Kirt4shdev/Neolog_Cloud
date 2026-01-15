import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class ProvisioningRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {};
  }
}
