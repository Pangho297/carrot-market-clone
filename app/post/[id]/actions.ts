"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { commentSchema } from "./schema";

/** 좋아요 추가 */
export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000)); // useOptimistic 테스트를 위해 강제로 느려지게 만듬
  try {
    const session = await getSession();

    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });

    // 좋아요를 눌렀을 때 화면 갱신을 위한 캐시 초기화 (Bad Case)
    // revalidatePath(`/posts/${id}`);

    // 캐싱된 데이터들을 Tag로 관리할 때 사용할 수 있는 캐시 초기화
    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
}

/** 좋아요 삭제 */
export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000)); // useOptimistic 테스트를 위해 강제로 느려지게 만듬
  try {
    const session = await getSession();

    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });

    // 좋아요를 눌렀을 때 화면 갱신을 위한 캐시 초기화 (Bad Case)
    // revalidatePath(`/posts/${id}`);

    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
}

export async function createComment(formData: FormData) {
  await new Promise((r) => setTimeout(r, 10000));
  const data = {
    payload: formData.get("payload"),
    userId: formData.get("userId"),
    postId: formData.get("postId"),
  };

  const result = commentSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.comment.create({
      data: {
        payload: result.data.payload,
        postId: result.data.postId,
        userId: result.data.userId,
      },
      select: {
        id: true,
      },
    });

    revalidateTag(`post-comment-list-${result.data.postId}`);
  }
}
