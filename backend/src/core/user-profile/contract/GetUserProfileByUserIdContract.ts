import { z } from "zod";

export const GetUserProfileByUserIdContract = z.object({
  userId: z
    .string({ message: "userId is required" })
    .trim()
    .uuid({ message: "Invalid userId format" }),
});

export type GetUserProfileByUserIdContract = z.infer<
  typeof GetUserProfileByUserIdContract
>;
