"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

interface ActionState {
  token: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "휴대전화번호가 잘못되었습니다"
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prev: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prev.token) {
    // 사용자가 전화번호만 입력한 경우
    const result = phoneSchema.safeParse(phone);

    // 휴대전화 유효성 검사
    if (!result.success) {
      // 실패
      return { token: false, error: result.error.flatten() };
    } else {
      // 통과
      return { token: true };
    }
  } else {
    // 사용자가 토큰도 입력한 경우
    const result = tokenSchema.safeParse(token);

    // 토큰 유효성 검사
    if (!result.success) {
      // 실패
      return { token: true, error: result.error.flatten() }; // FIXME: 에러처리 필요
    } else {
      // 성공
      redirect("/");
    }
  }
}
