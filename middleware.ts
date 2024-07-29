import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

/** 인증되지 않은 유저가 접근 가능한 페이지 목록
 *
 * 배열이 아닌 객체인 이유는 검색 시 좀 더 빠르게 검색 할 수 있기 위함
 */
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/signup": true,
};

// 미들웨어 파일명은 반드시 middleware 이어야하거나 export default 이어야함
export async function middleware(req: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[req.nextUrl.pathname]; // 접속 시도한 페이지가 인증되지 않은 유저가 접근 가능한 페이지인지 확인

  // 로그아웃 상태 처리
  if (!session.id) {
    // 로그인 상태가 아닌 경우
    if (!exists) {
      // publicOnlyUrls 에 없는 페이지에 접근 (로그인 유저만의 페이지에 접근 시도)
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // 로그인한 경우
    if (exists) {
      // 로그인 유저가 계정생성등의 페이지에 접근 시
      return NextResponse.redirect(new URL("/products", req.url));
    }
  }

  // 쿠키설정
  // if (pathname === "/") {
  //   const response = NextResponse.next(); // 사용자에게 전달할 response 가져오기
  //   response.cookies.set("middleware-cookie", "hello!"); // 원하는 쿠키 response에 담기
  //   return response;
  // }
}

// 설정파일명은 반드시 config 이어야함
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
