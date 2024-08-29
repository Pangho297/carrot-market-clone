"use server";

import getSession from "@/lib/session";
import { lifeSchema } from "./schema";
import db from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function postLife(formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = lifeSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    const { title, description } = result.data;

    await db.post.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: session.id!,
          },
        },
      },
      select: {
        id: true,
      },
    });

    revalidateTag("post-list");
    redirect("/life");
  }
}
