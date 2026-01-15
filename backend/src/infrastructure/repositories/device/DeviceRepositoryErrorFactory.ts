import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class DeviceRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "Device with this serial number already exists",
    };
  }
}
