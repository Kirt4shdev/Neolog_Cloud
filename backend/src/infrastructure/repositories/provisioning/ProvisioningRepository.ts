import { database } from "@infrastructure/database/PostgresDatabase";
import { ProvisioningRepositoryErrorFactory } from "./ProvisioningRepositoryErrorFactory";
import { ProvisioningConfigEntity } from "@core/provisioning/entities/ProvisioningConfigEntity";
import type { ToggleProvisioningContract } from "@core/provisioning/contracts/ProvisioningContract";
import type { IProvisioningRepository } from "@core/provisioning/repositories/IProvisioningRepository";

export class ProvisioningRepository implements IProvisioningRepository {
  public async getProvisioningStatus(): Promise<
    Result<ProvisioningConfigEntity>
  > {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_provisioning_status()",
      params: [],
      single: true,
      schema: ProvisioningConfigEntity,
      emptyResponseMessageError: "Provisioning config not found",
    });

    if (error) {
      return {
        error: new ProvisioningRepositoryErrorFactory(error).create(),
      };
    }

    return { result };
  }

  public async toggleProvisioning(
    data: ToggleProvisioningContract
  ): Promise<Result<ProvisioningConfigEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM toggle_provisioning($1, $2)",
      params: [data?.isEnabled, data?.updatedBy],
      single: true,
      schema: ProvisioningConfigEntity,
    });

    if (error) {
      return {
        error: new ProvisioningRepositoryErrorFactory(error).create(),
      };
    }

    return { result };
  }
}
