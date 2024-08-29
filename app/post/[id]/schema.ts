import { z } from "zod";

export const commentSchema = z.object({
  payload: z.string({
    required_error: "댓글을 입력해 주세요",
  }),
  post_id: z.coerce.number(),
  user_id: z.coerce.number(),
});

export type CommentType = z.infer<typeof commentSchema>;
