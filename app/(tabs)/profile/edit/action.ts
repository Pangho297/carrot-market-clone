"use server";

import db from "@/lib/db";
import { profileSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function updateProfile(formData: FormData, id: number) {
  const data = {
    username: formData.get("username"),
    ...(formData.get("avatar") !== null && { avatar: formData.get("avatar") }),
  };

  const result = profileSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    await db.user.update({
      where: {
        id,
      },
      data: result.data,
    });

    revalidateTag("user-profile");
    redirect("/profile");
  }
}
