import EditProfileForm from "@/components/EditProfileForm";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";

async function getProfile(id: number) {
  const profile = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });

  if (!profile) {
    return notFound();
  }

  return profile;
}

const getCachedProfile = nextCache(getProfile, ["user-profile"], {
  tags: ["user-profile"],
});

export type ProfileType = Prisma.PromiseReturnType<typeof getProfile>;

export default async function ProfileEdit() {
  const session = await getSession();

  if (!session.id) {
    return notFound();
  }

  const profile = await getCachedProfile(session.id);
  return <EditProfileForm initProfile={profile} />;
}
