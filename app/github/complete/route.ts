import db from "@/lib/db";
import { userLogin } from "@/utils/common";
import { NextRequest } from "next/server";
import { getAccessToken, getUserEmail, getUserProfile } from "./service";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const { access_token } = await getAccessToken(req);
  const { id, avatar_url, login } = await getUserProfile(access_token);
  await getUserEmail(access_token);

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
    await userLogin(user);
    return redirect("/profile");
  }

  const newUser = await db.user.create({
    // db에 없는 경우 새로운 유저 추가
    data: {
      username: `${login}-gh${id}`,
      github_id: `${id}`,
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  // github_id를 가진 사람이 존재할 경우 로그인
  await userLogin(newUser);
  return redirect("/profile");
}
