import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
  const { error, access_token } = await accessTokenResponse.json(); // 응답으로 받은 AccessToken JSON 포맷 변환

  if (error) {
    // 임시코드 에러처리
    return new Response(null, {
      status: 400,
    });
  }

  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const { id, avatar_url, login } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    // db에 저장된 유저 중 github_id를 가진 사람 검색
    where: {
      github_id: `${id}`,
    },
    select: {
      id: true,
    },
  });

  if (user) {
    // github_id를 가진 사람이 존재할 경우 로그인
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }

  const newUser = await db.user.create({
    data: {
      username: login,
      github_id: `${id}`,
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  // github_id를 가진 사람이 존재할 경우 로그인
  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/profile");
}
