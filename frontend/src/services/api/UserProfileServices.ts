import { ApiService } from "../ApiService";
import type { Pagination } from "@core/shared/contracts/Pagination";
import type { UserProfileEntity } from "@core/user-profile/entities/UserProfileEntity";

export class UserProfileServices extends ApiService {
  public async getMyProfile(): Promise<UserProfileEntity> {
    return await this.fetch<UserProfileEntity>("GET", "/api/user/profile/me");
  }

  public async getUserProfile(userId: string): Promise<UserProfileEntity> {
    return await this.fetch<UserProfileEntity>(
      "GET",
      `/api/admin/users/profile/${userId}`
    );
  }

  public async getUsersWithPagination(data: Pagination): Promise<{
    data: UserProfileEntity[];
  }> {
    const { limit, offset } = data;

    return await this.fetch<{ data: UserProfileEntity[] }>(
      "GET",
      `/api/admin/users/profile?limit=${limit}&offset=${offset}`
    );
  }
}
