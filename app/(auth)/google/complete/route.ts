import { NextRequest } from "next/server";
import { getAccessToken, getUserProfile } from "./service";
import db from "@/lib/db";
import { userLogin } from "@/utils/common";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const { access_token } = await getAccessToken(req);
  const { id, name, picture } = await getUserProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      google_id: `${id}`,
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await userLogin(user);
    return redirect("/profile");
  }

  const newUser = await db.user.create({
    data: {
      username: `${name}-g${id}`,
      google_id: `${id}`,
      avatar: picture,
    },
    select: {
      id: true,
    },
  });

  await userLogin(newUser);
  return redirect("/profile");
}
