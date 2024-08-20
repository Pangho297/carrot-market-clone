import {z} from "zod"

export const productSchema = z.object({
  photo: z.string({
    required_error: "사진을 업로드해 주세요",
  }),
  title: z
    .string({
      required_error: "제목을 입력해 주세요",
    })
    .max(50),
  description: z.string({
    required_error: "설명을 입력해 주세요",
  }),
  price: z.coerce.number({
    required_error: "가격을 입력해 주세요",
  }),
});

export type ProductFormType = z.infer<typeof productSchema>