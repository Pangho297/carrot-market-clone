import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function getAccessToken(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const session = await getSession();

  // CSRF 공격 방어
  if (!state || session.state !== state) {
    return notFound();
  }

  // 임시코드가 없는 경우 에러 처리
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const baseUrl = "https://oauth2.googleapis.com/token";
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    grant_type: "authorization_code",
    code,
  };
  const formattedParams = new URLSearchParams(params).toString();
  const fullUrl = `${baseUrl}?${formattedParams}`;

  const accessTokenResponse = await fetch(fullUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    cache: "no-cache",
  });
  const res = await accessTokenResponse.json();

  if (res.error) {
    // 임시코드 에러처리
    return notFound();
  }

  return res;
}

export async function getUserProfile(access_token: string) {
  if (!access_token) {
    // 임시코드 에러처리
    return notFound();
  }

  const userProfileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );

  const res = await userProfileResponse.json();

  return res;
}
