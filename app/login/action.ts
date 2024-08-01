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
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { userLogin } from "@/utils/common";
import { redirect } from "next/navigation";

// 이메일로 유저 찾기
const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string({
      required_error: EMAIL_REQUIRED_ERROR,
    })
    .email(EMAIL_TYPE_ERROR)
    .toLowerCase()
    .refine(checkEmailExists, "존재하지 않는 계정입니다"),
  password: z
    .string({
      required_error: PASSWORD_REQUIRED_ERROR,
    })
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function login(state: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const { email, password } = result.data;

    // 비밀번호 해시값 확인
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true, // 로그인 시 세션 토큰으로 사용할 id
        password: true, // 유저 비밀번호값 조회
      },
    });

    const ok = await bcrypt.compare(password, user!.password ?? ""); // 소셜 미디어 로그인일 경우 비밀번호가 없는 경우가 있기에 비밀번호가 없는 경우 빈 문자와 비교

    // 사용자 로그인
    if (ok) {
      await userLogin(user!);
      return redirect("/profile");
    } else {
      // 비밀번호가 틀렸을 경우 에러 메시지 노출, Zod의 형태로 에러를 리턴하여 앞단에서 사용하도록 유도
      return {
        fieldErrors: {
          password: ["비밀번호가 일치하지 않습니다."],
          email: [],
        },
      };
    }
  }
}
