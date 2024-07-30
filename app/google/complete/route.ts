import { NextRequest } from "next/server";
import { getAccessToken, getUserProfile } from "./service";
import db from "@/lib/db";
import { userLogin } from "@/utils/common";

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
}
