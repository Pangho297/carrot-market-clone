"use server";

import {
  EMAIL_REQUIRED_ERROR,
  EMAIL_TYPE_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from "@/lib/constants";
import { z } from "zod";

interface FormSchema {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const checkPasswords = ({ password, confirm_password }: FormSchema) =>
  password === confirm_password;

const formSchema: z.ZodType<FormSchema> = z
  .object({
    username: z
      .string({
        required_error: "사용자 이름을 입력해 주세요",
        invalid_type_error: "사용자 이름이 잘못되었습니다 다시 확인해주세요",
      })
      .toLowerCase() // 모든 문자를 소문자로 변경
      .trim() // 문자열 양끝의 공백을 제거
      .transform((value) => `test_${value}_test`), // 데이터를 임의로 변경하여 반환함
    // .refine((value) => !value.includes("pangho"), "custom error"), // 단일 항목에 대한 검증 함수
    email: z
      .string({
        required_error: EMAIL_REQUIRED_ERROR,
      })
      .email(EMAIL_TYPE_ERROR)
      .toLowerCase(),
    password: z
      .string({
        required_error: PASSWORD_REQUIRED_ERROR,
      })
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPasswords, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirm_password"], // 에러가 표시될 위치 지정
  });

export async function createAccount(prev: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
