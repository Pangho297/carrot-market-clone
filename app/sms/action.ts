"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { userLogin } from "@/utils/common";
import twilio from "twilio";

interface ActionState {
  token: boolean;
  phone?: string;
}

/** 토큰 입력 시 휴대전화번호 검증 */
async function phoneExists(phone: string) {
  const exists = await db.sMSToken.findUnique({
    where: {
      phone,
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
}

/** 토큰 검증 */
async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "인증번호가 유효하지 않습니다");

  /** 토큰을 사용자에게 보낸 시점의 전화번호와 입력 시점의 전화번호 확인 */
const phoneCheck = z
  .string()
  .trim()
  .refine(phoneExists, "휴대전화번호가 유효하지 않습니다");

/** 토큰 생성 */
async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();

  // token 중복 체크
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  if (exists) {
    // 중복 토큰일 경우 재귀
    return getToken();
  }

  return token;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "휴대전화번호가 잘못되었습니다"
  );

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
      const token = await getToken();
      const phone = result.data;

      // 이전 token 삭제하기
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone,
          },
        },
      });

      // token 생성
      await db.sMSToken.create({
        data: {
          phone, // token 검증 시 전화번호를 추가해 보안 강화
          token,
          user: {
            // 신규 유저일 가능성이 있기 때문에 이 경우 유저를 새로 생성함
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // Twilio를 사용해 SMS로 token 전송
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `[Pangho Market] 인증 번호 [${token}]를 입력해주세요.`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.TWILIO_VERIFY_PHONE_NUMBER!,
      });

      // 통과
      return { token: true, phone };
    }
  } else {
    // 사용자가 토큰도 입력한 경우
    const result = await tokenSchema.safeParseAsync(token);
    const check = await phoneCheck.safeParseAsync(prev.phone); // 휴대전화번호 입력 시점의 값 검증

    if (!check.success) {
      // 휴대전화번호 이상있는 경우
      return { token: false, error: check.error.flatten() };
    } else {
      // 토큰 유효성 검사
      if (!result.success) {
        // 실패
        return { token: true, error: result.error.flatten() }; // FIXME: 에러처리 필요
      } else {
        // token에 연결된 userId를 받아옴
        const token = await db.sMSToken.findUnique({
          where: {
            token: result.data.toString(),
          },
          select: {
            id: true,
            userId: true,
          },
        });

        // 사용자 로그인 (tokenSchema에서 토큰 검증 완료함)
        userLogin({ id: token!.userId });
        // 사용한 토큰 제거
        await db.sMSToken.delete({
          where: {
            id: token!.id,
          },
        });
        // 성공
        redirect("/profile");
      }
    }
  }
}
