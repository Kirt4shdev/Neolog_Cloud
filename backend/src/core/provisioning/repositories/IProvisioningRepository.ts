import type { ToggleProvisioningContract } from "../contracts/ProvisioningContract";
import type { ProvisioningConfigEntity } from "../entities/ProvisioningConfigEntity";

/**
 * IProvisioningRepository - Interfaz de repositorio de provisioning
 */
export interface IProvisioningRepository {
  /**
   * Obtiene el estado actual del provisioning
   * @returns Promise<Result<ProvisioningConfigEntity>>
   */
  getProvisioningStatus(): Promise<Result<ProvisioningConfigEntity>>;

  /**
   * Activa o desactiva el provisioning
   * @param data - Configuración de provisioning
   * @returns Promise<Result<ProvisioningConfigEntity>>
   */
  toggleProvisioning(
    data: ToggleProvisioningContract
  ): Promise<Result<ProvisioningConfigEntity>>;
}
