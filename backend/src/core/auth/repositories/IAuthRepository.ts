import type { LoginContract } from "../contracts/LoginContract";
import type { RegisterContract } from "../contracts/RegisterContract";
import type { AuthEntity } from "../entities/AuthEntity";

/**
 * IAuthRepository - Interfaz de repositorio de autenticación
 * @property login - Método para iniciar sesión
 * @property register - Método para registrar un nuevo usuario
 */
export interface IAuthRepository {
  /**
   * Método para iniciar sesión
   * @param data - Datos de login
   * @returns Promise<Result<AuthEntity>>
   */
  login(data: LoginContract): Promise<Result<AuthEntity>>;

  /**
   * Método para registrar un nuevo usuario
   * @param data - Datos de registro
   * @returns Promise<Result<AuthEntity>>
   */
  register(data: RegisterContract): Promise<Result<AuthEntity>>;
}
