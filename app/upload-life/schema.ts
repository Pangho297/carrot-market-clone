import { z } from "zod";

const escapeHtml = (text: string) => {
  const map: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&#39;",
    '"': "&quot;",
    "/": "&#47;",
  };
  return text.replace(/[<>&'"\/]/g, (char: string): string => map[char]);
};

export const lifeSchema = z.object({
  title: z.string({
    required_error: "제목을 입력해 주세요",
  }),
  description: z
    .string({
      required_error: "내용을 입력해 주세요",
    })
    .transform((str) => escapeHtml(str)),
});

export type LifeFormType = z.infer<typeof lifeSchema>;
