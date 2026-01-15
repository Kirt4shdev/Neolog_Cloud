import type { CreateSessionContract } from "../contracts/CreateSessionContract";
import type { DeleteSessionContract } from "../contracts/DeleteSessionContract";
import type { SessionEntity } from "../entities/SessionEntity";

/**
 * ISessionRepository - Interfaz del repositorio de sesiones
 *
 * Operaciones disponibles:
 * - createSession: Crea una nueva sesión con información del cliente
 * - getSessionsByUserId: Obtiene todas las sesiones de un usuario
 * - deleteSession: Elimina una sesión específica
 */
export interface ISessionRepository {
  /**
   * Crea una nueva sesión
   * @param data - Datos de la sesión a crear
   * @returns Promise<Result<SessionEntity>>
   */
  createSession(data: CreateSessionContract): Promise<Result<SessionEntity>>;

  /**
   * Obtiene todas las sesiones activas de un usuario
   * @param userId - UUID del usuario
   * @returns Promise<Result<SessionEntity[]>>
   */
  getSessionsByUserId(userId: UUID): Promise<Result<SessionEntity[]>>;

  /**
   * Elimina una sesión específica (logout)
   * @param data - Contrato con sessionId
   * @returns Promise<Result<SessionEntity>>
   */
  deleteSession(data: DeleteSessionContract): Promise<Result<SessionEntity>>;

  /**
   * Actualiza la fecha de última utilización de una sesión
   * @param sessionId - ID de la sesión a actualizar
   * @returns Promise<Result<void>>
   */
  updateLastUsedAtSession(sessionId: UUID): Promise<Result<void>>;
}
