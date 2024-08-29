"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { commentSchema } from "./schema";
import { redirect } from "next/navigation";

/** 좋아요 추가 */
export async function likePost(post_id: number) {
  await new Promise((r) => setTimeout(r, 10000)); // useOptimistic 테스트를 위해 강제로 느려지게 만듬
  try {
    const session = await getSession();

    await db.like.create({
      data: {
        post_id,
        user_id: session.id!,
      },
    });

    // 좋아요를 눌렀을 때 화면 갱신을 위한 캐시 초기화 (Bad Case)
    // revalidatePath(`/posts/${id}`);

    // 캐싱된 데이터들을 Tag로 관리할 때 사용할 수 있는 캐시 초기화
    revalidateTag(`like-status-${post_id}`);
  } catch (error) {}
}

/** 좋아요 삭제 */
export async function dislikePost(post_id: number) {
  await new Promise((r) => setTimeout(r, 10000)); // useOptimistic 테스트를 위해 강제로 느려지게 만듬
  try {
    const session = await getSession();

    await db.like.delete({
      where: {
        id: {
          post_id,
          user_id: session.id!,
        },
      },
    });

    // 좋아요를 눌렀을 때 화면 갱신을 위한 캐시 초기화 (Bad Case)
    // revalidatePath(`/posts/${id}`);

    revalidateTag(`like-status-${post_id}`);
  } catch (error) {}
}

export async function createComment(formData: FormData) {
  await new Promise((r) => setTimeout(r, 10000));
  const data = {
    payload: formData.get("payload"),
    user_id: formData.get("user_id"),
    post_id: formData.get("post_id"),
  };

  const result = commentSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.comment.create({
      data: {
        payload: result.data.payload,
        post_id: result.data.post_id,
        user_id: result.data.user_id,
      },
      select: {
        id: true,
      },
    });

    revalidateTag(`post-comment-list-${result.data.post_id}`);
  }
}

export async function deleteComment(formData: FormData) {
  "use server";

  const data = {
    id: formData.get("id"),
    post_id: formData.get("post_id"),
  };

  if (!data) {
    return;
  }

  await db.comment.delete({
    where: {
      id: parseInt(data.id?.toString() ?? ""),
    },
  });

  revalidateTag(`post-comment-list-${data.post_id}`);
}
