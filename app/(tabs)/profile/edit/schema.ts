import { z } from "zod";

export const profileSchema = z.object({
  avatar: z.string().nullable().optional(),
  username: z.string({
    required_error: "사용자명을 입력해 주세요",
  }),
});

export type ProfileFormType = z.infer<typeof profileSchema>;
