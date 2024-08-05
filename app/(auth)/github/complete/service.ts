import { NextRequest } from "next/server";

interface UserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "public" | "private" | null;
}

export async function getAccessToken(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  // 임시코드가 없는 경우 에러 처리
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  // AccessToken을 받기위한 매개변수 정리
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!, // 클라이언트 ID
    client_secret: process.env.GITHUB_CLIENT_SECRET!, // 클라이언트 시크릿키
    code, // 임시코드
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`; // Github에서 제공한 AccessToken을 받기위한 URL + 매개변수
  const accessTokenResponse = await fetch(accessTokenURL, {
    // AccessToken 요청
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const res = await accessTokenResponse.json(); // 응답으로 받은 AccessToken JSON 포맷 변환

  if (res.error) {
    // 임시코드 에러처리
    return new Response(null, {
      status: 400,
    });
  }

  return res;
}

export async function getUserProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      // 요청 헤더에 발급받은 Access Token 추가
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache", // Next.js에선 기본적으로 요청을 캐시에 저장하는데 이를 막아두는 코드
  });

  const res = await userProfileResponse.json();

  return res;
}

export async function getUserEmail(access_token: string) {
  const userEmailResponse = await fetch(`https://api.github.com/user/emails`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const data = await userEmailResponse.json();
  const primaryEmail: string | null =
    data.filter((item: UserEmail) => item.primary)[0].email ?? null;

  return console.log(primaryEmail);
}
