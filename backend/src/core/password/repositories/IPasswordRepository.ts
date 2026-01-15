import type { ForgotPasswordContract } from "../contracts/ForgotPasswordContract";
import type { ResetPasswordContract } from "../contracts/ResetPasswordContract";
import type { ForgotPasswordEntity } from "../entities/ForgotPasswordEntity";
import type { ResetPasswordEntity } from "../entities/ResetPasswordEntity";

/**
 * IPasswordRepository - Interfaz de repositorio de recuperación de contraseña
 * @property forgotPassword - Método para solicitar un cambio de contraseña
 * @property resetPassword - Método para resetear la contraseña
 */
export interface IPasswordRepository {
  /**
   * Método para solicitar un cambio de contraseña
   * @param data - Datos de solicitud de cambio de contraseña
   * @returns Promise<Result<ForgotPasswordEntity>>
   */
  forgotPassword(
    data: ForgotPasswordContract
  ): Promise<Result<ForgotPasswordEntity>>;

  /**
   * Método para resetear la contraseña
   * @param data - Datos de reseteo de contraseña
   * @returns Promise<Result<ResetPasswordEntity>>
   */
  resetPassword(
    data: ResetPasswordContract
  ): Promise<Result<ResetPasswordEntity>>;
}
