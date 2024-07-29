import getSession from "@/lib/session";
import { redirect } from "next/navigation";

interface userId {
  id: number;
}

/** 사용자 로그인
 *
 * @param user userId
 * @param url string
 */
export async function userLogin(user: userId, url = "/profile") {
  const session = await getSession(); // 세션 토큰 생성
  session.id = user.id;
  await session.save(); // 세션 토큰 저장 및 유저 정보 암호화
  return redirect(url); // 사용자 redirect
}
