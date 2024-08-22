import { z } from "zod";

export const commentSchema = z.object({
  payload: z.string({
    required_error: "댓글을 입력해 주세요",
  }),
  postId: z.coerce.number(),
  userId: z.coerce.number(),
});

export type CommentType = z.infer<typeof commentSchema>;
