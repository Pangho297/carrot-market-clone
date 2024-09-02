import { z } from "zod";

export const reviewSchema = z.object({
  writerId: z.coerce.number({
    required_error: "사용자 정보를 찾을 수 없습니다 다시 시도해주세요",
  }),
  targetId: z.coerce.number({
    required_error: "사용자 정보를 찾을 수 없습니다 다시 시도해주세요",
  }),
  payload: z.string({
    required_error: "리뷰를 입력해 주세요",
  }),
});

export type ReviewFormType = z.infer<typeof reviewSchema>;
