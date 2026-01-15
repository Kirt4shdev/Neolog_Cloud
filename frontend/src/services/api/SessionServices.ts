import { ApiService } from "../ApiService";
import type { SessionEntity } from "@core/session/entities/SessionEntity";

export class SessionServices extends ApiService {
  public async getMySessions(): Promise<SessionEntity[]> {
    return await this.fetch<SessionEntity[]>("GET", "/api/user/session");
  }

  public async deleteMySession(sessionId: string): Promise<SessionEntity> {
    return await this.fetch<SessionEntity>(
      "DELETE",
      `/api/user/session/${sessionId}`
    );
  }

  public async deleteSession(sessionId: string): Promise<SessionEntity> {
    return await this.fetch<SessionEntity>(
      "DELETE",
      `/api/admin/session/${sessionId}`
    );
  }
}
