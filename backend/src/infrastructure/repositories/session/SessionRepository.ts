import { SessionEntity } from "@core/session/entities/SessionEntity";
import { ISessionRepository } from "@core/session/repositories/ISessionRepository";
import { database } from "@infrastructure/database/PostgresDatabase";
import { SessionRepositoryErrorFactory } from "./SessionRepositoryErrorFactory";
import type { CreateSessionContract } from "@core/session/contracts/CreateSessionContract";
import type { DeleteSessionContract } from "@core/session/contracts/DeleteSessionContract";

export class SessionRepository implements ISessionRepository {
  public async createSession(
    data: CreateSessionContract
  ): Promise<Result<SessionEntity>> {
    const { error, result } = await database.query({
      query: `SELECT * FROM create_session(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )`,
      params: [
        data.userId,
        data.jwt,
        data.userAgent,
        data.browser,
        data.browserVersion,
        data.browserMajor,
        data.os,
        data.osVersion,
        data.platform,
        data.deviceType,
        data.deviceVendor,
        data.deviceModel,
        data.device,
        data.cpuArchitecture,
        data.engine,
        data.engineVersion,
        data.language,
        data.languages,
        data.ip,
        data.isMobile,
        data.isTablet,
        data.isDesktop,
        data.isBot,
      ],
      single: true,
      schema: SessionEntity,
    });

    if (error) {
      return { error: new SessionRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async getSessionsByUserId(
    userId: UUID
  ): Promise<Result<SessionEntity[]>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM get_sessions_by_user_id($1)",
      params: [userId],
      single: false,
      isEmptyResponseAnError: true,
      emptyResponseMessageError: "No sessions found for this user",
      schema: SessionEntity,
    });

    if (error) {
      return { error: new SessionRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async deleteSession(
    data: DeleteSessionContract
  ): Promise<Result<SessionEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM delete_session($1)",
      params: [data.sessionId],
      single: true,
      isEmptyResponseAnError: true,
      emptyResponseMessageError: "Session not found",
      schema: SessionEntity,
    });

    if (error) {
      return { error: new SessionRepositoryErrorFactory(error).create() };
    }

    return { result };
  }

  public async updateLastUsedAtSession(sessionId: UUID): Promise<Result<void>> {
    const { error } = await database.query<void>({
      query: "SELECT * FROM update_last_used_at_session($1)",
      params: [sessionId],
      single: true,
    });

    if (error) {
      return { error: new SessionRepositoryErrorFactory(error).create() };
    }

    return { result: undefined };
  }
}
