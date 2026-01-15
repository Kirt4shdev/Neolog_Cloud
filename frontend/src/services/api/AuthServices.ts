import { ApiService } from "@/services/ApiService";
import type { LoginContract } from "@core/auth/contracts/LoginContract";
import type { RegisterContract } from "@core/auth/contracts/RegisterContract";
import type { AuthEntity } from "@core/auth/entities/AuthEntity";

export class AuthServices extends ApiService {
  public async login(data: LoginContract) {
    return await this.fetch<AuthEntity>(
      "POST",
      "/unprotected/auth/login",
      data
    );
  }

  public async register(data: RegisterContract) {
    return await this.fetch<AuthEntity>(
      "POST",
      "/unprotected/auth/register",
      data
    );
  }

  public async logout(): Promise<void> {
    await this.fetch<void>("GET", "/unprotected/auth/logout");
  }
}
