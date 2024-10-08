import getSession from "@/lib/session";
import { redirect } from "next/navigation";

interface user_id {
  id: number;
}

/** 사용자 로그인
 *
 * @param user user_id
 * @param url string
 */
export async function userLogin(user: user_id) {
  const session = await getSession(); // 세션 토큰 생성
  session.id = user.id;
  await session.save(); // 세션 토큰 저장 및 유저 정보 암호화
}
