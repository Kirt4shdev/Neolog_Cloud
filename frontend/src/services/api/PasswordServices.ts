import { ApiService } from "../ApiService";
import type { ForgotPasswordContract } from "@core/password/contracts/ForgotPasswordContract";
import type { ResetPasswordContract } from "@core/password/contracts/ResetPasswordContract";

export class PasswordServices extends ApiService {
  public async forgotPassword(
    data: ForgotPasswordContract
  ): Promise<{ email: string }> {
    return await this.fetch<{ email: string }>(
      "POST",
      "/unprotected/password/forgot",
      data
    );
  }

  public async resetPassword(
    data: ResetPasswordContract
  ): Promise<{ email: string }> {
    return await this.fetch<{ email: string }>(
      "POST",
      "/unprotected/password/reset",
      data
    );
  }
}
