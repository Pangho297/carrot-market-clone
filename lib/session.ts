import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

/** 로그인 상태가 아닐경우를 대비해 타입 지정
 *
 *  로그인한 사용자만 쿠키에 id를 가지고 있음
 */
interface SessionContent {
  id?: number;
}

/** 세션토큰 생성 로직
 * 
 * 사용자가 로그인한 상태인지 알고싶다면 getSession에 id가 존재하는지 확인해보면 알수 있게됨
 */
export default function getSession() {
  // 세션 토큰 생성
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "auth",
    password: process.env.COOKIE_PASSWORD!,
  });
}
